<?php
/**
 * Route table + tiny dispatcher.
 *
 * Each entry: [HTTP method, path pattern, handler]
 * `{id}` in a pattern captures a numeric id and is passed to the handler.
 * A handler with signature (PDO $db, array $params, array $body, ?array $auth).
 *
 * `protected => true` routes require a valid Bearer token; the decoded
 * JWT payload is then passed to the handler as $auth.
 */

require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/CategoryController.php';
require_once __DIR__ . '/../controllers/SupplierController.php';
require_once __DIR__ . '/../controllers/CustomerController.php';
require_once __DIR__ . '/../controllers/ProductController.php';
require_once __DIR__ . '/../controllers/PurchaseController.php';
require_once __DIR__ . '/../controllers/SaleController.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../helpers/Response.php';

function buildRoutes(PDO $db): array
{
    $auth = new AuthController($db);
    $categories = new CategoryController($db);
    $suppliers = new SupplierController($db);
    $customers = new CustomerController($db);
    $products = new ProductController($db);
    $purchases = new PurchaseController($db);
    $sales = new SaleController($db);

    $crud = function ($controller) {
        return [
            'index'   => fn($p, $b) => $controller->index(),
            'show'    => fn($p, $b) => $controller->show((int) $p['id']),
            'store'   => fn($p, $b) => $controller->store($b),
            'update'  => fn($p, $b) => $controller->update((int) $p['id'], $b),
            'destroy' => fn($p, $b) => $controller->destroy((int) $p['id']),
        ];
    };

    $c = $crud($categories);
    $s = $crud($suppliers);
    $cu = $crud($customers);

    return [
        // --- Auth (public) ---
        ['POST', '#^/auth/login$#', fn($p, $b) => $auth->login($b), false],
        ['POST', '#^/auth/register$#', fn($p, $b) => $auth->register($b), false],
        ['GET', '#^/auth/me$#', fn($p, $b, $t) => $auth->me($t), true],

        // --- Categories ---
        ['GET', '#^/categories$#', $c['index'], true],
        ['GET', '#^/categories/(?P<id>\d+)$#', $c['show'], true],
        ['POST', '#^/categories$#', $c['store'], true],
        ['PUT', '#^/categories/(?P<id>\d+)$#', $c['update'], true],
        ['DELETE', '#^/categories/(?P<id>\d+)$#', $c['destroy'], true],

        // --- Suppliers ---
        ['GET', '#^/suppliers$#', $s['index'], true],
        ['GET', '#^/suppliers/(?P<id>\d+)$#', $s['show'], true],
        ['POST', '#^/suppliers$#', $s['store'], true],
        ['PUT', '#^/suppliers/(?P<id>\d+)$#', $s['update'], true],
        ['DELETE', '#^/suppliers/(?P<id>\d+)$#', $s['destroy'], true],

        // --- Customers ---
        ['GET', '#^/customers$#', $cu['index'], true],
        ['GET', '#^/customers/(?P<id>\d+)$#', $cu['show'], true],
        ['POST', '#^/customers$#', $cu['store'], true],
        ['PUT', '#^/customers/(?P<id>\d+)$#', $cu['update'], true],
        ['DELETE', '#^/customers/(?P<id>\d+)$#', $cu['destroy'], true],

        // --- Products ---
        ['GET', '#^/products$#', fn($p, $b) => $products->index(), true],
        ['GET', '#^/products/(?P<id>\d+)$#', fn($p, $b) => $products->show((int) $p['id']), true],
        ['POST', '#^/products$#', fn($p, $b) => $products->store($b), true],
        ['PUT', '#^/products/(?P<id>\d+)$#', fn($p, $b) => $products->update((int) $p['id'], $b), true],
        ['DELETE', '#^/products/(?P<id>\d+)$#', fn($p, $b) => $products->destroy((int) $p['id']), true],
        ['PATCH', '#^/products/(?P<id>\d+)/adjust$#', fn($p, $b) => $products->adjust((int) $p['id'], $b), true],

        // --- Purchases ---
        ['GET', '#^/purchases$#', fn($p, $b) => $purchases->index(), true],
        ['POST', '#^/purchases$#', fn($p, $b) => $purchases->store($b), true],
        ['PUT', '#^/purchases/(?P<id>\d+)$#', fn($p, $b) => $purchases->update((int) $p['id'], $b), true],
        ['DELETE', '#^/purchases/(?P<id>\d+)$#', fn($p, $b) => $purchases->destroy((int) $p['id']), true],

        // --- Sales ---
        ['GET', '#^/sales$#', fn($p, $b) => $sales->index(), true],
        ['POST', '#^/sales$#', fn($p, $b) => $sales->store($b), true],
        ['PUT', '#^/sales/(?P<id>\d+)$#', fn($p, $b) => $sales->update((int) $p['id'], $b), true],
        ['DELETE', '#^/sales/(?P<id>\d+)$#', fn($p, $b) => $sales->destroy((int) $p['id']), true],
    ];
}

function dispatch(array $routes, string $method, string $path, array $body): void
{
    $matchedPath = false;

    foreach ($routes as [$routeMethod, $pattern, $handler, $needsAuth]) {
        if (!preg_match($pattern, $path, $matches)) {
            continue;
        }
        $matchedPath = true;

        if ($routeMethod !== $method) {
            continue;
        }

        $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
        $authPayload = null;
        if ($needsAuth) {
            $authPayload = AuthMiddleware::requireAuth();
        }

        $handler($params, $body, $authPayload);
        return;
    }

    Response::error($matchedPath ? 'Method not allowed' : 'Route not found', $matchedPath ? 405 : 404);
}
