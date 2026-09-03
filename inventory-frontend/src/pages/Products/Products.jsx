import { useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import Button from "../../components/Button/Button.jsx";
import Table from "../../components/Table/Table.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import ConfirmModal from "../../components/Modal/ConfirmModal.jsx";
import ProductFormModal from "./ProductFormModal.jsx";
import { useResource } from "../../hooks/useResource";
import { formatCurrency } from "../../utils/formatCurrency";
import { stockStatus } from "../../constants/status";

export default function Products() {
  const { items, loading, createItem, updateItem, removeItem } = useResource("products");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase())
      ),
    [items, query]
  );

  const columns = [
    { key: "name", label: "Product", render: (p) => (
      <div>
        <div style={{ fontWeight: 600 }}>{p.name}</div>
        <div style={{ marginTop: 3 }}><Badge status={stockStatus(p.quantity, p.reorder)} /></div>
      </div>
    ) },
    { key: "sku", label: "SKU", render: (p) => <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink-soft)" }}>{p.sku}</span> },
    { key: "category", label: "Category" },
    { key: "quantity", label: "On hand", render: (p) => p.quantity.toLocaleString() },
    { key: "price", label: "Unit price", render: (p) => <span style={{ fontFamily: "var(--font-mono)" }}>{formatCurrency(p.price)}</span> },
    { key: "supplier", label: "Supplier" },
  ];

  if (loading) return <Loader label="Loading products..." />;

  return (
    <>
      <Header
        eyebrow="Catalog"
        title="Products"
        description="Every SKU in the warehouse, with live stock and pricing."
        actions={<Button icon={Plus} onClick={() => setModal({ mode: "add" })}>Add product</Button>}
      />

      <div style={{ position: "relative", width: 320, marginBottom: 14 }}>
        <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or SKU..."
          style={{ width: "100%", boxSizing: "border-box", padding: "9px 11px 9px 32px", borderRadius: 6, border: "1px solid var(--line)", background: "#FBFBF9", fontSize: 14, outline: "none" }}
        />
      </div>

      <Table
        columns={columns}
        rows={filtered}
        emptyLabel="No products match"
        actions={(row) => (
          <>
            <IconButton onClick={() => setModal({ mode: "edit", item: row })} title="Edit"><Pencil size={14} /></IconButton>
            <IconButton onClick={() => setToDelete(row)} title="Delete" danger><Trash2 size={14} /></IconButton>
          </>
        )}
      />

      {modal && (
        <ProductFormModal
          initial={modal.mode === "edit" ? modal.item : null}
          onClose={() => setModal(null)}
          onSave={async (data) => {
            if (modal.mode === "edit") await updateItem(modal.item.id, data);
            else await createItem(data);
            setModal(null);
          }}
        />
      )}

      {toDelete && (
        <ConfirmModal
          title="Remove this product?"
          message={`"${toDelete.name}" will be removed from the catalog. This can't be undone.`}
          confirmLabel="Remove"
          onClose={() => setToDelete(null)}
          onConfirm={async () => { await removeItem(toDelete.id); setToDelete(null); }}
        />
      )}
    </>
  );
}

function IconButton({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        border: "1px solid var(--line)", background: "#FBFBF9", borderRadius: 6, padding: 6,
        cursor: "pointer", color: danger ? "var(--red)" : "var(--ink-soft)",
      }}
    >
      {children}
    </button>
  );
}
