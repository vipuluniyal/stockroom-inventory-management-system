<?php
require_once __DIR__ . '/Model.php';

class Category extends Model
{
    protected string $table = 'categories';
    protected array $fillable = ['name', 'description'];
}
