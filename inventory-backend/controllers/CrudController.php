<?php
require_once __DIR__ . '/../helpers/Response.php';

/**
 * Base controller for simple resources that map 1:1 onto a Model
 * with no field translation needed (Categories, Suppliers, Customers).
 */
abstract class CrudController
{
    protected $model;
    protected string $resourceName = 'Resource';

    public function index(): void
    {
        Response::success($this->model->all());
    }

    public function show(int $id): void
    {
        $row = $this->model->find($id);
        if (!$row) {
            Response::notFound($this->resourceName);
        }
        Response::success($row);
    }

    public function store(array $body): void
    {
        $errors = $this->validate($body);
        if ($errors) {
            Response::error('Validation failed', 422, ['fields' => $errors]);
        }
        Response::success($this->model->create($body), 201);
    }

    public function update(int $id, array $body): void
    {
        if (!$this->model->find($id)) {
            Response::notFound($this->resourceName);
        }
        Response::success($this->model->update($id, $body));
    }

    public function destroy(int $id): void
    {
        if (!$this->model->find($id)) {
            Response::notFound($this->resourceName);
        }
        $this->model->delete($id);
        Response::success(['id' => $id, 'deleted' => true]);
    }

    /** Return an array of field => message for invalid input, or []. */
    protected function validate(array $body): array
    {
        $errors = [];
        if (trim($body['name'] ?? '') === '') {
            $errors['name'] = 'Name is required';
        }
        return $errors;
    }
}
