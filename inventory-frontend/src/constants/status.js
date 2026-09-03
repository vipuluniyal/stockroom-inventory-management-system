export const STATUS_META = {
  ok: { label: "In stock", color: "var(--teal)", bg: "var(--teal-soft)" },
  low: { label: "Reorder soon", color: "var(--amber)", bg: "var(--amber-soft)" },
  critical: { label: "Critical", color: "var(--red)", bg: "var(--red-soft)" },
  paid: { label: "Paid", color: "var(--teal)", bg: "var(--teal-soft)" },
  pending: { label: "Pending", color: "var(--amber)", bg: "var(--amber-soft)" },
  cancelled: { label: "Cancelled", color: "var(--red)", bg: "var(--red-soft)" },
};

export function stockStatus(quantity, reorder) {
  if (quantity <= reorder * 0.4) return "critical";
  if (quantity <= reorder) return "low";
  return "ok";
}
