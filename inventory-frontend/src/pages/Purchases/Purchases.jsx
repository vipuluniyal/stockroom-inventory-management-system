import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import Button from "../../components/Button/Button.jsx";
import Table from "../../components/Table/Table.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Input from "../../components/Input/Input.jsx";
import Select from "../../components/Select/Select.jsx";
import ConfirmModal from "../../components/Modal/ConfirmModal.jsx";
import { useResource } from "../../hooks/useResource";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";

export default function Purchases() {
  const { items, loading, createItem, updateItem, removeItem } = useResource("purchases");
  const [modal, setModal] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const columns = [
    { key: "reference", label: "Reference", render: (o) => <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{o.reference}</span> },
    { key: "supplier", label: "Supplier" },
    { key: "date", label: "Date", render: (o) => formatDate(o.date) },
    { key: "items", label: "Line items" },
    { key: "total", label: "Total", render: (o) => <span style={{ fontFamily: "var(--font-mono)" }}>{formatCurrency(o.total)}</span> },
    { key: "status", label: "Status", sortable: false, render: (o) => (
      <Select
        value={o.status}
        onChange={(e) => updateItem(o.id, { status: e.target.value })}
        options={["paid", "pending", "cancelled"]}
        containerStyle={{ marginBottom: 0 }}
        style={{ padding: "5px 24px 5px 8px", fontSize: 12.5 }}
      />
    ) },
  ];

  if (loading) return <Loader label="Loading purchases..." />;

  return (
    <>
      <Header
        eyebrow="Transactions"
        title="Purchases"
        description="Stock coming in from your suppliers."
        actions={<Button icon={Plus} onClick={() => setModal({ mode: "add" })}>New order</Button>}
      />

      <Table
        columns={columns}
        rows={items}
        emptyLabel="No orders yet"
        actions={(row) => (
          <IconButton onClick={() => setToDelete(row)} danger><Trash2 size={14} /></IconButton>
        )}
      />

      {modal && (
        <OrderFormModal
          onClose={() => setModal(null)}
          onSave={async (data) => { await createItem(data); setModal(null); }}
        />
      )}

      {toDelete && (
        <ConfirmModal
          title="Delete this order?"
          message={`"${toDelete.reference}" will be permanently removed.`}
          confirmLabel="Delete"
          onClose={() => setToDelete(null)}
          onConfirm={async () => { await removeItem(toDelete.id); setToDelete(null); }}
        />
      )}
    </>
  );
}

function OrderFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    reference: "PO-" + Math.floor(1000 + Math.random() * 9000),
    supplier: "",
    date: new Date().toISOString().slice(0, 10),
    items: 1,
    total: 0,
    status: "pending",
  });

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.supplier.trim()) return;
    onSave({ ...form, items: Number(form.items) || 0, total: Number(form.total) || 0 });
  }

  return (
    <Modal title="New order" onClose={onClose}>
      <form onSubmit={submit}>
        <Input label="Reference" value={form.reference} onChange={(e) => set("reference", e.target.value)} />
        <Input label="Supplier" value={form.supplier} onChange={(e) => set("supplier", e.target.value)} placeholder="e.g. Fastenal Co." required />
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Input label="Date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <Input label="Line items" type="number" min="1" value={form.items} onChange={(e) => set("items", e.target.value)} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Input label="Total" type="number" min="0" step="0.01" value={form.total} onChange={(e) => set("total", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <Select label="Status" value={form.status} onChange={(e) => set("status", e.target.value)} options={["paid", "pending", "cancelled"]} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Button type="button" variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</Button>
          <Button type="submit" variant="accent" style={{ flex: 1, justifyContent: "center" }}>Create order</Button>
        </div>
      </form>
    </Modal>
  );
}

function IconButton({ children, onClick, danger }) {
  return (
    <button onClick={onClick} style={{ border: "1px solid var(--line)", background: "#FBFBF9", borderRadius: 6, padding: 6, cursor: "pointer", color: danger ? "var(--red)" : "var(--ink-soft)" }}>
      {children}
    </button>
  );
}
