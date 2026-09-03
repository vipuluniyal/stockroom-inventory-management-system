import { createContext, useEffect, useState } from "react";
import { authApi } from "../services/api";
import { SESSION_STORAGE_KEY } from "../constants/config";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      try {
        const session = JSON.parse(raw);
        if (session?.user) setUser(session.user);
      } catch {
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  function persistSession({ token, user: nextUser }) {
    setUser(nextUser);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({ token, user: nextUser }));
  }

  async function login(email, password) {
    const session = await authApi.login(email, password);
    persistSession(session);
    return session.user;
  }

  async function register(payload) {
    const session = await authApi.register(payload);
    persistSession(session);
    return session.user;
  }

  function logout() {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
