<?php
/**
 * Front controller. All API requests are rewritten here by .htaccess
 * (Apache) or should be pointed here by your webserver config (Nginx/PHP
 * built-in server), then dispatched based on the path after /api.
 */

declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../routes/api.php';

// ---- CORS ----
$config = require __DIR__ . '/../config/config.php';
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $config['cors']['allowed_origins'], true)) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Parse path (strip /api prefix, query string, trailing slash) ----
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$path = preg_replace('#^/api#', '', $uri);
$path = rtrim($path, '/');
if ($path === '') {
    $path = '/';
}

// ---- Parse JSON body (if any) ----
$raw = file_get_contents('php://input');
$body = [];
if ($raw !== false && $raw !== '') {
    $decoded = json_decode($raw, true);
    if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
        $body = $decoded;
    } else {
        Response::error('Invalid JSON body', 400);
    }
}

// ---- Dispatch ----
try {
    $db = getDbConnection();
    $routes = buildRoutes($db);
    dispatch($routes, $_SERVER['REQUEST_METHOD'], $path, $body);
} catch (Throwable $e) {
    Response::error('Server error', 500, [
        'detail' => $e->getMessage(),
    ]);
}
