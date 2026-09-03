<?php
require_once __DIR__ . '/CrudController.php';
require_once __DIR__ . '/../models/Supplier.php';

class SupplierController extends CrudController
{
    protected string $resourceName = 'Supplier';

    public function __construct(PDO $db)
    {
        $this->model = new Supplier($db);
    }
}
