import { STATUS_META, stockStatus } from "../../constants/status";

export default function StockGauge({ quantity, reorder }) {
  const ceiling = Math.max(reorder * 2, quantity, 1);
  const pct = Math.min(quantity / ceiling, 1);
  const reorderPct = Math.min(reorder / ceiling, 1);
  const status = stockStatus(quantity, reorder);
  const meta = STATUS_META[status];

  return (
    <div style={{ width: "100%" }}>
      <div style={{ position: "relative", height: 10, borderRadius: 2, background: "var(--line-soft)", overflow: "hidden", border: "1px solid var(--line)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${pct * 100}%`, background: meta.color, transition: "width 300ms ease" }} />
        <div title="Reorder threshold" style={{ position: "absolute", left: `${reorderPct * 100}%`, top: -2, bottom: -2, width: 2, background: "var(--ink)", opacity: 0.55 }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-soft)" }}>
        <span>{quantity.toLocaleString()} on hand</span>
        <span>reorder @ {reorder.toLocaleString()}</span>
      </div>
    </div>
  );
}
