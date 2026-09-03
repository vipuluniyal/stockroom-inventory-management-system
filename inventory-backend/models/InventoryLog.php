<?php
require_once __DIR__ . '/Model.php';

class InventoryLog extends Model
{
    protected string $table = 'inventory_logs';
    protected array $fillable = ['product_id', 'change_qty', 'reason', 'created_by'];

    public function forProduct(int $productId): array
    {
        $stmt = $this->db->prepare(
            'SELECT * FROM inventory_logs WHERE product_id = :pid ORDER BY created_at DESC'
        );
        $stmt->execute(['pid' => $productId]);
        return $stmt->fetchAll();
    }
}
