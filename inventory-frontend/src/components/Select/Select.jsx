import { ChevronDown } from "lucide-react";

export default function Select({ label, options = [], style, containerStyle, ...rest }) {
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
        <select
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "9px 28px 9px 11px",
            borderRadius: 6,
            border: "1px solid var(--line)",
            background: "#FBFBF9",
            color: "var(--ink)",
            fontSize: 14,
            fontFamily: "var(--font-body)",
            outline: "none",
            appearance: "none",
            ...style,
          }}
          {...rest}
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)", pointerEvents: "none" }}
        />
      </div>
    </label>
  );
}
