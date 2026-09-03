<?php
require_once __DIR__ . '/Model.php';

class User extends Model
{
    protected string $table = 'users';
    protected array $fillable = ['name', 'email', 'password_hash', 'role'];

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare('SELECT * FROM users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function sanitize(array $user): array
    {
        unset($user['password_hash']);
        return $user;
    }
}
