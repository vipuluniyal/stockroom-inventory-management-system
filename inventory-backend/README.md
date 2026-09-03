# Stockroom — PHP + MySQL Backend

A plain-PHP (no framework, no Composer required) REST API for the Stockroom
inventory frontend. Talks JSON, auths with a hand-rolled JWT, and its field
names/shapes match the React app's mock API exactly — see "Connecting the
frontend" below.

## Requirements

- PHP 8.1+
- MySQL 5.7+ / MariaDB 10.3+
- Apache with `mod_rewrite` (or run PHP's built-in server, see below)

No Composer packages are required — auth uses a small hand-written JWT
helper (`helpers/JWT.php`) instead of a library, and everything else is
plain PDO.

## Setup

1. **Create the database:**
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   This creates the `stockroom` database, all tables, and seeds sample
   categories/suppliers/customers/products/purchases/sales plus one admin
   user:
   - email: `admin@stockroom.app`
   - password: `admin123`

2. **Configure the connection.** Copy `.env.example` to `.env` and fill in
   your DB credentials, or just export the same variables in your shell —
   `config/config.php` reads `getenv()` with sane localhost defaults.
   ```bash
   cp .env.example .env
   ```
   (Plain PHP doesn't auto-load `.env` files without a library; either set
   these as real environment variables, or simplest for local dev, just
   edit the defaults directly in `config/config.php`.)

3. **Run it.**
   - **Apache/XAMPP/Laragon/etc:** point a vhost's document root at
     `public/`, or drop the whole folder in `htdocs` and browse to
     `http://localhost/inventory-backend/public/`.
   - **PHP's built-in server** (fastest for local dev):
     ```bash
     php -S localhost:8000 -t public
     ```
     API is then at `http://localhost:8000/api/...`.

4. **Smoke test:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@stockroom.app","password":"admin123"}'
   ```
   You should get back a JWT and the user object.

## API reference

All endpoints are prefixed with `/api`. Everything except
`/auth/login` and `/auth/register` requires an `Authorization: Bearer <token>`
header.

| Method | Path                        | Notes                              |
|--------|-----------------------------|-------------------------------------|
| POST   | /auth/login                 | `{ email, password }` → `{ token, user }` |
| POST   | /auth/register              | `{ name, email, password }` → `{ token, user }` |
| GET    | /auth/me                    | current user from token             |
| GET    | /categories                 | list                                 |
| POST   | /categories                 | `{ name, description }`             |
| PUT    | /categories/{id}            |                                      |
| DELETE | /categories/{id}            |                                      |
| GET/POST/PUT/DELETE | /suppliers, /customers | same shape as categories, plus `email`, `phone`, `address` |
| GET    | /products                   | list, category/supplier as names    |
| POST   | /products                   | `{ name, sku, category, quantity, reorder, price, supplier }` |
| PUT    | /products/{id}              |                                      |
| DELETE | /products/{id}               |                                      |
| PATCH  | /products/{id}/adjust        | `{ delta: 1 }` or `{ delta: -1 }`   |
| GET/POST/PUT/DELETE | /purchases, /sales | `{ reference, supplier\|customer, date, items, total, status }` |

## Connecting the React frontend

The frontend's `src/services/api.js` currently talks to `localStorage`, not
this API. To point it here:

1. Replace the internals of `api.list/get/create/update/remove` and
   `authApi.login/register` with `fetch()` calls to
   `http://localhost:8000/api/...` (function signatures already match).
2. Store the JWT returned from login (e.g. in `AuthContext`, alongside the
   user) and attach it as `Authorization: Bearer <token>` on every request.
3. Field names line up exactly (`category`, `supplier`, `reorder`, `items`,
   `date`, etc.) — the controllers translate to/from the normalized DB
   columns internally, so no frontend field renaming is needed.

## Design notes

- **Normalized storage, flat API.** `products.category`/`products.supplier`
  and `purchases.supplier`/`sales.customer` are foreign keys under the
  hood, but the API accepts/returns plain name strings — controllers call
  `firstOrCreateByName()` to resolve or create the linked row. This keeps
  the database clean without requiring the frontend to know about ids.
- **`inventory_logs`** is an audit trail table (product id, +/- change,
  reason, who/when) for stock adjustments; `Product::adjustQuantity()`
  updates the quantity but doesn't yet write a log row — wire that up in
  `ProductController::adjust()` if you want a history view.
- **JWT is hand-rolled** (`helpers/JWT.php`, HS256, no dependency) to avoid
  requiring Composer for a demo project. Swap in `firebase/php-jwt` if you
  add Composer later and want more thorough edge-case handling.
- **CORS** origins are whitelisted in `config/config.php` — add your
  deployed frontend's URL there before shipping.
