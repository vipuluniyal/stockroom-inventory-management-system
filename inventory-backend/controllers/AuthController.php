<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/Response.php';
require_once __DIR__ . '/../helpers/JWT.php';

class AuthController
{
    private User $users;
    private array $config;

    public function __construct(PDO $db)
    {
        $this->users = new User($db);
        $this->config = require __DIR__ . '/../config/config.php';
    }

    public function login(array $body): void
    {
        $email = trim($body['email'] ?? '');
        $password = (string) ($body['password'] ?? '');

        if ($email === '' || $password === '') {
            Response::error('Email and password are required', 422);
        }

        $user = $this->users->findByEmail($email);
        if (!$user || !password_verify($password, $user['password_hash'])) {
            Response::error('Invalid email or password', 401);
        }

        $token = JWT::encode(
            ['sub' => $user['id'], 'email' => $user['email']],
            $this->config['jwt']['secret'],
            $this->config['jwt']['expiry_sec']
        );

        Response::success([
            'token' => $token,
            'user' => User::sanitize($user),
        ]);
    }

    public function register(array $body): void
    {
        $name = trim($body['name'] ?? '');
        $email = trim($body['email'] ?? '');
        $password = (string) ($body['password'] ?? '');

        if ($name === '' || $email === '' || strlen($password) < 6) {
            Response::error('Name, email, and a password of at least 6 characters are required', 422);
        }

        if ($this->users->findByEmail($email)) {
            Response::error('An account with that email already exists', 409);
        }

        $user = $this->users->create([
            'name' => $name,
            'email' => $email,
            'password_hash' => password_hash($password, PASSWORD_BCRYPT),
            'role' => 'Admin',
        ]);

        $token = JWT::encode(
            ['sub' => $user['id'], 'email' => $user['email']],
            $this->config['jwt']['secret'],
            $this->config['jwt']['expiry_sec']
        );

        Response::success([
            'token' => $token,
            'user' => User::sanitize($user),
        ], 201);
    }

    public function me(array $tokenPayload): void
    {
        $user = $this->users->find((int) $tokenPayload['sub']);
        if (!$user) {
            Response::notFound('User');
        }
        Response::success(User::sanitize($user));
    }
}
