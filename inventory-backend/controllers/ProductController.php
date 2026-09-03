<?php
require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../models/Product.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../models/Supplier.php';

/**
 * Products are stored normalized (category_id/supplier_id FKs) but the
 * frontend speaks in plain "category"/"supplier" name strings and uses
 * "reorder" (not "reorder_level"). This controller translates both ways
 * so the existing React app needs zero changes to talk to this API.
 */
class ProductController
{
    private Product $products;
    private Category $categories;
    private Supplier $suppliers;

    public function __construct(PDO $db)
    {
        $this->products = new Product($db);
        $this->categories = new Category($db);
        $this->suppliers = new Supplier($db);
    }

    public function index(): void
    {
        Response::success(array_map([$this, 'present'], $this->products->all()));
    }

    public function show(int $id): void
    {
        $row = $this->products->find($id);
        if (!$row) {
            Response::notFound('Product');
        }
        Response::success($this->present($row));
    }

    public function store(array $body): void
    {
        if (trim($body['name'] ?? '') === '' || trim($body['sku'] ?? '') === '') {
            Response::error('Validation failed', 422, ['fields' => ['name/sku' => 'Name and SKU are required']]);
        }

        $created = $this->products->create($this->toStorage($body));
        Response::success($this->present($created), 201);
    }

    public function update(int $id, array $body): void
    {
        if (!$this->products->find($id)) {
            Response::notFound('Product');
        }
        $updated = $this->products->update($id, $this->toStorage($body));
        Response::success($this->present($updated));
    }

    public function destroy(int $id): void
    {
        if (!$this->products->find($id)) {
            Response::notFound('Product');
        }
        $this->products->delete($id);
        Response::success(['id' => $id, 'deleted' => true]);
    }

    /** PATCH /products/{id}/adjust  { "delta": 1 } or { "delta": -1 } */
    public function adjust(int $id, array $body): void
    {
        if (!$this->products->find($id)) {
            Response::notFound('Product');
        }
        $delta = (int) ($body['delta'] ?? 0);
        Response::success($this->present($this->products->adjustQuantity($id, $delta)));
    }

    /** Maps frontend field names -> DB columns, resolving names to FK ids. */
    private function toStorage(array $body): array
    {
        $data = [];

        if (array_key_exists('name', $body)) $data['name'] = $body['name'];
        if (array_key_exists('sku', $body)) $data['sku'] = $body['sku'];
        if (array_key_exists('quantity', $body)) $data['quantity'] = (int) $body['quantity'];
        if (array_key_exists('price', $body)) $data['price'] = (float) $body['price'];
        if (array_key_exists('reorder', $body)) $data['reorder_level'] = (int) $body['reorder'];

        if (array_key_exists('category', $body)) {
            $data['category_id'] = $this->categories->firstOrCreateByName($body['category']);
        }
        if (array_key_exists('supplier', $body)) {
            $data['supplier_id'] = $this->suppliers->firstOrCreateByName($body['supplier']);
        }

        return $data;
    }

    /** Maps a DB row (with joined names) -> the shape the frontend expects. */
    private function present(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'name' => $row['name'],
            'sku' => $row['sku'],
            'category' => $row['category'],
            'quantity' => (int) $row['quantity'],
            'reorder' => (int) $row['reorder_level'],
            'price' => (float) $row['price'],
            'supplier' => $row['supplier'],
        ];
    }
}
