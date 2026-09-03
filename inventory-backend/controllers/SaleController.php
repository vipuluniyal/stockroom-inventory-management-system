<?php
require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../models/Sale.php';
require_once __DIR__ . '/../models/Customer.php';

class SaleController
{
    private Sale $sales;
    private Customer $customers;

    public function __construct(PDO $db)
    {
        $this->sales = new Sale($db);
        $this->customers = new Customer($db);
    }

    public function index(): void
    {
        Response::success(array_map([$this, 'present'], $this->sales->all()));
    }

    public function store(array $body): void
    {
        if (trim($body['customer'] ?? '') === '') {
            Response::error('Validation failed', 422, ['fields' => ['customer' => 'Customer is required']]);
        }
        $created = $this->sales->create($this->toStorage($body));
        Response::success($this->present($created), 201);
    }

    public function update(int $id, array $body): void
    {
        if (!$this->sales->find($id)) {
            Response::notFound('Sales order');
        }
        Response::success($this->present($this->sales->update($id, $this->toStorage($body))));
    }

    public function destroy(int $id): void
    {
        if (!$this->sales->find($id)) {
            Response::notFound('Sales order');
        }
        $this->sales->delete($id);
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
        if (array_key_exists('customer', $body)) {
            $data['customer_id'] = $this->customers->firstOrCreateByName($body['customer']);
        }
        return $data;
    }

    private function present(array $row): array
    {
        return [
            'id' => (int) $row['id'],
            'reference' => $row['reference'],
            'customer' => $row['customer'],
            'date' => $row['order_date'],
            'items' => (int) $row['items_count'],
            'total' => (float) $row['total'],
            'status' => $row['status'],
        ];
    }
}
