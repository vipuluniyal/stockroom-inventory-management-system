import { useMemo, useState } from "react";
import { Package } from "lucide-react";
import Pagination from "../Pagination/Pagination.jsx";

/**
 * Generic, sortable, paginated data table.
 *
 * columns: [{ key, label, render?(row), sortable? = true, width? }]
 * rows: array of data objects (must each have a unique `id`)
 * actions: (row) => ReactNode, rendered in a trailing column
 */
export default function Table({ columns, rows, actions, pageSize = 6, emptyLabel = "No records found" }) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const copy = [...rows];
    copy.sort((a, b) => {
      let av = a[sortKey];
      let bv = b[sortKey];
      if (typeof av === "string") { av = av.toLowerCase(); bv = String(bv).toLowerCase(); }
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);

  function handleSort(col) {
    if (col.sortable === false) return;
    if (sortKey === col.key) setSortDir((d) => -d);
    else { setSortKey(col.key); setSortDir(1); }
  }

  return (
    <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div style={{ overflowX: "auto" }} className="scrollbar-thin">
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ background: "var(--panel-soft)", borderBottom: "1px solid var(--line)" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col)}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    cursor: col.sortable === false ? "default" : "pointer",
                    userSelect: "none",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--ink-soft)",
                    width: col.width,
                  }}
                >
                  {col.label}
                  {sortKey === col.key ? (sortDir === 1 ? " ▲" : " ▼") : ""}
                </th>
              ))}
              {actions && <th style={{ padding: "10px 14px" }} />}
            </tr>
          </thead>
          <tbody>
            {paged.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid var(--line-soft)" }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: "12px 14px", fontSize: 13.5 }}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {actions && (
                  <td style={{ padding: "12px 14px" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>{actions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {paged.length === 0 && (
        <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--ink-soft)" }}>
          <Package size={26} style={{ marginBottom: 10, opacity: 0.5 }} />
          <div style={{ fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>{emptyLabel}</div>
          <div style={{ fontSize: 13 }}>Try adjusting your search or filters.</div>
        </div>
      )}

      <div style={{ padding: "0 14px" }}>
        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </div>
    </div>
  );
}
