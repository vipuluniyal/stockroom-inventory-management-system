// Base URL of the PHP backend's API. Override per-environment with a
// .env file (VITE_API_BASE_URL=https://your-domain.com/api) — Vite only
// exposes variables prefixed with VITE_ to client code.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Shared localStorage key for the persisted session ({ token, user }),
// read by both AuthContext (to restore login state) and api.js (to
// attach the Authorization header) so the two never drift apart.
export const SESSION_STORAGE_KEY = "stockroom_session_v1";
