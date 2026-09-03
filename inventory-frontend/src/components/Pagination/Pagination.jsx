import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null;

  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 4px", justifyContent: "flex-end" }}>
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        style={navBtnStyle(page === 1)}
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((p, idx) => {
        const prev = pages[idx - 1];
        const showEllipsis = prev && p - prev > 1;
        return (
          <span key={p} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {showEllipsis && <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>…</span>}
            <button
              onClick={() => onChange(p)}
              style={{
                ...navBtnStyle(false),
                background: p === page ? "var(--ink)" : "#FBFBF9",
                color: p === page ? "#fff" : "var(--ink)",
                fontWeight: 600,
              }}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(Math.min(pageCount, page + 1))}
        disabled={page === pageCount}
        style={navBtnStyle(page === pageCount)}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function navBtnStyle(disabled) {
  return {
    width: 30,
    height: 30,
    borderRadius: 6,
    border: "1px solid var(--line)",
    background: "#FBFBF9",
    color: "var(--ink)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12.5,
  };
}
