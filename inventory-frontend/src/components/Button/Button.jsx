const VARIANTS = {
  primary: { background: "var(--ink)", color: "#fff", border: "none" },
  accent: { background: "var(--teal)", color: "#fff", border: "none" },
  ghost: { background: "#FBFBF9", color: "var(--ink)", border: "1px solid var(--line)" },
  danger: { background: "var(--red)", color: "#fff", border: "none" },
};

export default function Button({
  children,
  variant = "primary",
  icon: Icon,
  type = "button",
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const styles = VARIANTS[variant] || VARIANTS.primary;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 16px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 13.5,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        ...styles,
        ...style,
      }}
      {...rest}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
