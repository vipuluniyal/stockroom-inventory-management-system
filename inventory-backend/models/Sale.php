<?php
require_once __DIR__ . '/Model.php';

class Sale extends Model
{
    protected string $table = 'sales';
    protected array $fillable = [
        'reference', 'customer_id', 'order_date', 'items_count', 'total', 'status',
    ];

    private const JOIN_SELECT = "
        SELECT so.*, c.name AS customer
        FROM sales so
        LEFT JOIN customers c ON c.id = so.customer_id
    ";

    public function all(string $orderBy = 'so.order_date DESC'): array
    {
        $stmt = $this->db->query(self::JOIN_SELECT . " ORDER BY {$orderBy}");
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare(self::JOIN_SELECT . ' WHERE so.id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
