<?php
/**
 * Tiny active-record-ish base class. Each subclass sets $table and
 * $fillable (the columns allowed to be mass-assigned from request input).
 */

abstract class Model
{
    protected PDO $db;
    protected string $table;
    protected array $fillable = [];

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function all(string $orderBy = 'id DESC'): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table} ORDER BY {$orderBy}");
        return $stmt->fetchAll();
    }

    public function find(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function create(array $data): array
    {
        $data = $this->onlyFillable($data);
        $columns = array_keys($data);
        $placeholders = array_map(fn($c) => ":$c", $columns);

        $sql = sprintf(
            'INSERT INTO %s (%s) VALUES (%s)',
            $this->table,
            implode(', ', $columns),
            implode(', ', $placeholders)
        );

        $stmt = $this->db->prepare($sql);
        $stmt->execute($data);

        return $this->find((int) $this->db->lastInsertId());
    }

    public function update(int $id, array $data): ?array
    {
        $data = $this->onlyFillable($data);
        if (empty($data)) {
            return $this->find($id);
        }

        $assignments = implode(', ', array_map(fn($c) => "$c = :$c", array_keys($data)));
        $sql = "UPDATE {$this->table} SET {$assignments} WHERE id = :id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([...$data, 'id' => $id]);

        return $this->find($id);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(['id' => $id]);
    }

    protected function onlyFillable(array $data): array
    {
        return array_intersect_key($data, array_flip($this->fillable));
    }

    /**
     * Looks up a row by its `name` column and returns its id, creating
     * the row first if it doesn't exist yet. Lets controllers accept a
     * plain string (e.g. "Hardware", "Fastenal Co.") from the frontend
     * while storage stays normalized behind a foreign key.
     */
    public function firstOrCreateByName(?string $name): ?int
    {
        $name = trim((string) $name);
        if ($name === '') {
            return null;
        }

        $stmt = $this->db->prepare("SELECT id FROM {$this->table} WHERE name = :name LIMIT 1");
        $stmt->execute(['name' => $name]);
        $row = $stmt->fetch();
        if ($row) {
            return (int) $row['id'];
        }

        $created = $this->create(['name' => $name]);
        return (int) $created['id'];
    }
}
