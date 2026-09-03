# Stockroom — Inventory Management Frontend

A React + Vite frontend for managing products, stock levels, suppliers,
customers, and purchase/sales orders. Talks to the PHP + MySQL backend in
`../inventory-backend` over a JSON REST API.

## Getting started

1. **Get the backend running first** (see `inventory-backend/README.md`):
   ```bash
   mysql -u root -p < ../inventory-backend/database/schema.sql
   php -S localhost:8000 -t ../inventory-backend/public
   ```

2. **Point the frontend at it.** Copy `.env.example` to `.env` — the
   default already matches the command above:
   ```bash
   cp .env.example .env
   ```

3. **Install and run:**
   ```bash
   npm install
   npm run dev
   ```
   Open the printed local URL (typically http://localhost:5173).

Demo login (pre-filled on the sign-in screen), seeded by the backend's
`schema.sql`:
- **Email:** admin@stockroom.app
- **Password:** admin123

Or register a new account — it's created via `POST /auth/register` on the
backend.

## Project structure

```
src/
├── assets/            static images/icons you add
├── components/        reusable UI: Navbar, Sidebar, Header, Footer, Modal,
│                       Table, Pagination, Button, Input, Select, Card,
│                       Loader, Badge, Charts
├── layouts/            DashboardLayout (sidebar+navbar shell), AuthLayout
├── pages/              one folder per feature: Auth, Dashboard, Products,
│                       Categories, Suppliers, Customers, Purchases, Sales,
│                       Inventory, Reports, Settings
├── services/api.js     fetch-based REST client for the PHP backend, plus
│                        the auth endpoints
├── hooks/               useAuth, useResource (generic CRUD hook), useDebounce
├── context/             AuthContext — holds the JWT + current user
├── routes/               route table + ProtectedRoute
├── utils/                 formatCurrency, formatDate, generateId
└── constants/             nav items, category list, status metadata, API config
```

## How the API connection works

- **`constants/config.js`** — `API_BASE_URL` (from `VITE_API_BASE_URL`) and
  the shared `SESSION_STORAGE_KEY` used by both `AuthContext` and `api.js`.
- **`services/api.js`** — a thin `fetch` wrapper. `api.list/get/create/update/remove`
  map onto `GET/GET/POST/PUT/DELETE /resource`, and every request reads the
  JWT from `localStorage` and attaches `Authorization: Bearer <token>`
  automatically. `authApi.login`/`register` hit `/auth/login` and
  `/auth/register` and resolve to `{ token, user }`.
- **`context/AuthContext.jsx`** — calls `authApi`, then persists
  `{ token, user }` to `localStorage` under `SESSION_STORAGE_KEY` so a page
  refresh stays logged in. `api.js` reads that same key for the token, so
  the two never fall out of sync.
- **`hooks/useResource.js`** — unchanged from the mock version; it just
  calls `api.list/create/update/remove`, so no page needed to change when
  the backend swap happened.
- Field names already match the backend's response shape (`category`,
  `supplier`, `reorder`, `items`, `date`, etc.) — the PHP controllers do
  the translation to/from normalized DB columns, not the frontend.

## Troubleshooting

- **"Couldn't reach the server"** — the backend isn't running, or
  `VITE_API_BASE_URL` doesn't match where it's listening.
- **CORS error in the browser console** — add your dev URL to
  `cors.allowed_origins` in the backend's `config/config.php` (localhost:5173
  is included by default).
- **401 on every request after login** — check the token is actually being
  stored: `localStorage.getItem('stockroom_session_v1')` in devtools should
  show `{ token, user }`.
