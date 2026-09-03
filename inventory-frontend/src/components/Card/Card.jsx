export function Card({ children, style, ...rest }) {
  return (
    <div
      style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "var(--radius-md)",
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon: Icon, label, value, sub, accent }) {
  return (
    <Card style={{ padding: "16px 18px", flex: "1 1 180px", minWidth: 180 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className="eyebrow">{label}</span>
        {Icon && <Icon size={16} color={accent || "var(--ink-soft)"} />}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 30,
          color: "var(--ink)",
          marginTop: 6,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 12, color: "var(--ink-soft)", marginTop: 4 }}>{sub}</div>}
    </Card>
  );
}
