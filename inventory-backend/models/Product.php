<?php
require_once __DIR__ . '/Model.php';

class Product extends Model
{
    protected string $table = 'products';
    protected array $fillable = [
        'name', 'sku', 'category_id', 'supplier_id', 'quantity', 'reorder_level', 'price',
    ];

    private const JOIN_SELECT = "
        SELECT p.*, c.name AS category, s.name AS supplier
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id
        LEFT JOIN suppliers  s ON s.id = p.supplier_id
    ";

    /** Overrides base all() to include readable category/supplier names. */
    public function all(string $orderBy = 'p.id DESC'): array
    {
        $stmt = $this->db->query(self::JOIN_SELECT . " ORDER BY {$orderBy}");
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare(self::JOIN_SELECT . ' WHERE p.id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function adjustQuantity(int $id, int $delta): ?array
    {
        $stmt = $this->db->prepare(
            'UPDATE products SET quantity = GREATEST(0, quantity + :delta) WHERE id = :id'
        );
        $stmt->execute(['delta' => $delta, 'id' => $id]);
        return $this->find($id);
    }
}
