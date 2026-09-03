// REST client for the Stockroom PHP backend (see inventory-backend/).
// Function signatures are unchanged from the old localStorage mock, so
// no page or hook needed to change — only this file did.

import { API_BASE_URL, SESSION_STORAGE_KEY } from "../constants/config";

function getAuthToken() {
  const raw = localStorage.getItem(SESSION_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw)?.token || null;
  } catch {
    return null;
  }
}

async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getAuthToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Couldn't reach the server. Is the backend running?");
  }

  // DELETE-style 204s and similar have no JSON body to parse.
  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || `Request failed (${response.status})`);
  }
  return data;
}

/** Generic CRUD over a named resource/collection (e.g. "products"). */
export const api = {
  list(resource) {
    return request(`/${resource}`);
  },

  get(resource, id) {
    return request(`/${resource}/${id}`);
  },

  create(resource, data) {
    return request(`/${resource}`, { method: "POST", body: data });
  },

  update(resource, id, data) {
    return request(`/${resource}/${id}`, { method: "PUT", body: data });
  },

  remove(resource, id) {
    return request(`/${resource}/${id}`, { method: "DELETE" });
  },
};

/** Auth-specific endpoints. Both resolve to { token, user }. */
export const authApi = {
  login(email, password) {
    return request("/auth/login", { method: "POST", body: { email, password } });
  },

  register({ name, email, password }) {
    return request("/auth/register", { method: "POST", body: { name, email, password } });
  },
};
