import { X } from "lucide-react";

export default function Modal({ title, onClose, children, width = 440 }) {
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
        style={{
          background: "var(--panel)",
          borderRadius: 12,
          width,
          maxWidth: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          padding: 24,
          border: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 22,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
              margin: 0,
            }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", padding: 4 }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
