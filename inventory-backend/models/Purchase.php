<?php
require_once __DIR__ . '/Model.php';

class Purchase extends Model
{
    protected string $table = 'purchases';
    protected array $fillable = [
        'reference', 'supplier_id', 'order_date', 'items_count', 'total', 'status',
    ];

    private const JOIN_SELECT = "
        SELECT po.*, s.name AS supplier
        FROM purchases po
        LEFT JOIN suppliers s ON s.id = po.supplier_id
    ";

    public function all(string $orderBy = 'po.order_date DESC'): array
    {
        $stmt = $this->db->query(self::JOIN_SELECT . " ORDER BY {$orderBy}");
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare(self::JOIN_SELECT . ' WHERE po.id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }
}
