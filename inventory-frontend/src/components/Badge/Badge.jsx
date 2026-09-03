import { STATUS_META } from "../../constants/status";

export default function Badge({ status, children }) {
  const meta = STATUS_META[status] || { label: children || status, color: "var(--ink-soft)", bg: "var(--line-soft)" };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.02em",
        color: meta.color,
        background: meta.bg,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: meta.color }} />
      {children || meta.label}
    </span>
  );
}
