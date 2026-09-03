<?php
require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../models/Purchase.php';
require_once __DIR__ . '/../models/Supplier.php';

class PurchaseController
{
    private Purchase $purchases;
    private Supplier $suppliers;

    public function __construct(PDO $db)
    {
        $this->purchases = new Purchase($db);
        $this->suppliers = new Supplier($db);
    }

    public function index(): void
    {
        Response::success(array_map([$this, 'present'], $this->purchases->all()));
    }

    public function store(array $body): void
    {
        if (trim($body['supplier'] ?? '') === '') {
            Response::error('Validation failed', 422, ['fields' => ['supplier' => 'Supplier is required']]);
        }
        $created = $this->purchases->create($this->toStorage($body));
        Response::success($this->present($created), 201);
    }

    public function update(int $id, array $body): void
    {
        if (!$this->purchases->find($id)) {
            Response::notFound('Purchase order');
        }
        Response::success($this->present($this->purchases->update($id, $this->toStorage($body))));
    }

    public function destroy(int $id): void
    {
        if (!$this->purchases->find($id)) {
            Response::notFound('Purchase order');
        }
        $this->purchases->delete($id);
        Response::success(['id' => $id, 'deleted' => true]);
    }

    private function toStorage(array $body): array
    {
        $data = [];
        if (array_key_exists('reference', $body)) $data['reference'] = $body['reference'];
        if (array_key_exists('date', $body)) $data['order_date'] = $body['date'];
        if (array_key_exists('items', $body)) $data['items_count'] = (int) $body['items'];
        if (array_key_exists('total', $body)) $data['total'] = (float) $body['total'];
        if (array_key_exists('status', $body)) $data['status'] = $body['status'];
        if (array_key_exists('supplier', $body)) {
            $data['supplier_id'] = $this->suppliers->firstOrCreateByName($body['supplier']);
        }
        return $data;
    }

    private function present(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'reference' => $row['reference'],
            'supplier' => $row['supplier'],
            'date' => $row['order_date'],
            'items' => (int) $row['items_count'],
            'total' => (float) $row['total'],
            'status' => $row['status'],
        ];
    }
}
