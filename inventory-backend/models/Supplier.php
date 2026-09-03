<?php
require_once __DIR__ . '/Model.php';

class Supplier extends Model
{
    protected string $table = 'suppliers';
    protected array $fillable = ['name', 'email', 'phone', 'address'];
}
