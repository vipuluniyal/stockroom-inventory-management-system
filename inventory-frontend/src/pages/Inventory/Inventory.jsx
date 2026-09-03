import { useMemo, useState } from "react";
import { PackagePlus, PackageMinus, AlertTriangle } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import Table from "../../components/Table/Table.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Button from "../../components/Button/Button.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import StockGauge from "./StockGauge.jsx";
import { useResource } from "../../hooks/useResource";
import { stockStatus } from "../../constants/status";

export default function Inventory() {
  const { items, loading, updateItem } = useResource("products");
  const [onlyLow, setOnlyLow] = useState(false);

  const filtered = useMemo(
    () => items.filter((p) => !onlyLow || stockStatus(p.quantity, p.reorder) !== "ok"),
    [items, onlyLow]
  );

  async function adjust(product, delta) {
    const next = Math.max(0, product.quantity + delta);
    await updateItem(product.id, { quantity: next });
  }

  const columns = [
    { key: "name", label: "Item", render: (p) => (
      <div>
        <div style={{ fontWeight: 600 }}>{p.name}</div>
        <div style={{ fontSize: 12, color: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}>{p.sku}</div>
      </div>
    ) },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Stock level", width: 220, render: (p) => <StockGauge quantity={p.quantity} reorder={p.reorder} /> },
    { key: "status", label: "Status", sortable: false, render: (p) => <Badge status={stockStatus(p.quantity, p.reorder)} /> },
  ];

  if (loading) return <Loader label="Loading stock levels..." />;

  return (
    <>
      <Header
        eyebrow="Catalog"
        title="Inventory"
        description="Adjust stock on hand and keep an eye on what's approaching its reorder point."
        actions={
          <Button variant={onlyLow ? "accent" : "ghost"} icon={AlertTriangle} onClick={() => setOnlyLow((v) => !v)}>
            Needs attention
          </Button>
        }
      />

      <Table
        columns={columns}
        rows={filtered}
        emptyLabel="No items to show"
        actions={(row) => (
          <>
            <button onClick={() => adjust(row, -1)} title="Remove one unit" style={adjustBtn}>
              <PackageMinus size={14} />
            </button>
            <button onClick={() => adjust(row, 1)} title="Add one unit" style={adjustBtn}>
              <PackagePlus size={14} />
            </button>
          </>
        )}
      />
    </>
  );
}

const adjustBtn = {
  border: "1px solid var(--line)",
  background: "#FBFBF9",
  borderRadius: 6,
  padding: 6,
  cursor: "pointer",
  color: "var(--ink-soft)",
};
