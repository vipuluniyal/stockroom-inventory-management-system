<?php
require_once __DIR__ . '/Model.php';

class Customer extends Model
{
    protected string $table = 'customers';
    protected array $fillable = ['name', 'email', 'phone', 'address'];
}
