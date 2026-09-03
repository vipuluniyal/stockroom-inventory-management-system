export default function Input({ label, error, icon: Icon, style, containerStyle, ...rest }) {
  return (
    <label style={{ display: "block", marginBottom: 14, ...containerStyle }}>
      {label && (
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "var(--ink-soft)",
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div style={{ position: "relative" }}>
        {Icon && (
          <Icon
            size={15}
            style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)" }}
          />
        )}
        <input
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: Icon ? "9px 11px 9px 32px" : "9px 11px",
            borderRadius: 6,
            border: `1px solid ${error ? "var(--red)" : "var(--line)"}`,
            background: "#FBFBF9",
            color: "var(--ink)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            outline: "none",
            ...style,
          }}
          {...rest}
        />
      </div>
      {error && <div style={{ fontSize: 12, color: "var(--red)", marginTop: 4 }}>{error}</div>}
    </label>
  );
}
