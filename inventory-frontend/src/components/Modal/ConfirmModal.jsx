export default function ConfirmModal({ title, message, confirmLabel = "Confirm", onConfirm, onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,38,34,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: 16,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--panel)", borderRadius: 12, padding: 22, width: 360, border: "1px solid var(--line)" }}
      >
        <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>{title}</h3>
        <p style={{ margin: "0 0 18px", fontSize: 13, color: "var(--ink-soft)" }}>{message}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: "1px solid var(--line)", background: "#FBFBF9", cursor: "pointer", fontWeight: 600 }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 1, padding: "9px 0", borderRadius: 7, border: "none", background: "var(--red)", color: "#fff", cursor: "pointer", fontWeight: 600 }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
