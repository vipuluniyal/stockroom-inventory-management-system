export default function Header({ eyebrow, title, description, actions }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
      <div>
        {eyebrow && <div className="eyebrow" style={{ marginBottom: 4 }}>{eyebrow}</div>}
        <h1 className="page-title">{title}</h1>
        {description && <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--ink-soft)" }}>{description}</p>}
      </div>
      {actions && <div style={{ display: "flex", gap: 10 }}>{actions}</div>}
    </div>
  );
}
