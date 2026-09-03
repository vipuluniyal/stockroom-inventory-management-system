<?php
/**
 * Reads the Bearer token from the Authorization header, validates it,
 * and returns the decoded payload (contains at least `sub` = user id).
 * Ends the request with a 401 if the token is missing or invalid.
 */

require_once __DIR__ . '/../helpers/JWT.php';
require_once __DIR__ . '/../helpers/Response.php';

class AuthMiddleware
{
    public static function requireAuth(): array
    {
        $config = require __DIR__ . '/../config/config.php';
        $headers = self::getAuthHeaders();

        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        if (!preg_match('/Bearer\s+(\S+)/', $authHeader, $matches)) {
            Response::error('Missing or malformed Authorization header', 401);
        }

        $payload = JWT::decode($matches[1], $config['jwt']['secret']);
        if (!$payload) {
            Response::error('Invalid or expired token', 401);
        }

        return $payload;
    }

    private static function getAuthHeaders(): array
    {
        if (function_exists('getallheaders')) {
            return getallheaders();
        }
        // Fallback for servers where getallheaders() isn't available.
        $headers = [];
        foreach ($_SERVER as $key => $value) {
            if (str_starts_with($key, 'HTTP_')) {
                $name = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
                $headers[$name] = $value;
            }
        }
        return $headers;
    }
}
