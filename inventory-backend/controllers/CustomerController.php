<?php
require_once __DIR__ . '/CrudController.php';
require_once __DIR__ . '/../models/Customer.php';

class CustomerController extends CrudController
{
    protected string $resourceName = 'Customer';

    public function __construct(PDO $db)
    {
        $this->model = new Customer($db);
    }
}
