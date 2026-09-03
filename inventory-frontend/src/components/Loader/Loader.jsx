export default function Loader({ label = "Loading..." }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: 24 }}>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: "3px solid var(--line)",
          borderTopColor: "var(--teal)",
          animation: "spin 700ms linear infinite",
        }}
      />
      <div style={{ fontSize: 12.5, color: "var(--ink-soft)" }}>{label}</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
