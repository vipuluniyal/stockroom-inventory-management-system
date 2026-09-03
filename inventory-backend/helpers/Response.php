<?php
/**
 * Small helper for consistent JSON responses.
 */

class Response
{
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_SLASHES);
        exit;
    }

    public static function success($data, int $status = 200): void
    {
        self::json($data, $status);
    }

    public static function error(string $message, int $status = 400, array $extra = []): void
    {
        self::json(array_merge(['error' => $message], $extra), $status);
    }

    public static function notFound(string $resource = 'Resource'): void
    {
        self::error("$resource not found", 404);
    }
}
