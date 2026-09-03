<?php
require_once __DIR__ . '/CrudController.php';
require_once __DIR__ . '/../models/Category.php';

class CategoryController extends CrudController
{
    protected string $resourceName = 'Category';

    public function __construct(PDO $db)
    {
        $this->model = new Category($db);
    }
}
