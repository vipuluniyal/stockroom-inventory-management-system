import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

/**
 * Generic data hook for a REST-style resource collection.
 * Handles loading, error state, and CRUD helpers backed by services/api.js.
 */
export function useResource(resource) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.list(resource);
      setItems(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createItem(data) {
    const created = await api.create(resource, data);
    setItems((prev) => [created, ...prev]);
    return created;
  }

  async function updateItem(id, data) {
    const updated = await api.update(resource, id, data);
    setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    return updated;
  }

  async function removeItem(id) {
    await api.remove(resource, id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return { items, loading, error, refresh, createItem, updateItem, removeItem };
}
