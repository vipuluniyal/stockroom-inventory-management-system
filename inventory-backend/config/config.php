<?php
/**
 * Central app config. In production, load these from environment
 * variables instead of hardcoding — this keeps the demo copy-paste simple.
 */

return [
    'db' => [
        'host'    => getenv('DB_HOST') ?: '127.0.0.1',
        'port'    => getenv('DB_PORT') ?: '3306',
        'name'    => getenv('DB_NAME') ?: 'stockroom',
        'user'    => getenv('DB_USER') ?: 'root',
        'pass'    => getenv('DB_PASS') ?: '',
        'charset' => 'utf8mb4',
    ],
    'jwt' => [
        // CHANGE THIS before deploying anywhere real.
        'secret'     => getenv('JWT_SECRET') ?: 'change-this-dev-secret-please',
        'expiry_sec' => 60 * 60 * 8, // 8 hours
    ],
    'cors' => [
        // Add your frontend's dev/prod origins here.
        'allowed_origins' => [
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ],
    ],
];
