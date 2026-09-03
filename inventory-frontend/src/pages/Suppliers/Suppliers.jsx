import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import Button from "../../components/Button/Button.jsx";
import Table from "../../components/Table/Table.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import Input from "../../components/Input/Input.jsx";
import ConfirmModal from "../../components/Modal/ConfirmModal.jsx";
import { useResource } from "../../hooks/useResource";

export default function Suppliers() {
  const { items, loading, createItem, updateItem, removeItem } = useResource("suppliers");
  const [modal, setModal] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
  ];

  if (loading) return <Loader label="Loading Suppliers..." />;

  return (
    <>
      <Header
        eyebrow="Relationships"
        title="Suppliers"
        description="The vendors you purchase stock from."
        actions={<Button icon={Plus} onClick={() => setModal({ mode: "add" })}>Add contact</Button>}
      />

      <Table
        columns={columns}
        rows={items}
        emptyLabel="No records yet"
        actions={(row) => (
          <>
            <IconButton onClick={() => setModal({ mode: "edit", item: row })}><Pencil size={14} /></IconButton>
            <IconButton onClick={() => setToDelete(row)} danger><Trash2 size={14} /></IconButton>
          </>
        )}
      />

      {modal && (
        <ContactFormModal
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
          title="Remove this contact?"
          message={`"${toDelete.name}" will be removed from your suppliers.`}
          confirmLabel="Remove"
          onClose={() => setToDelete(null)}
          onConfirm={async () => { await removeItem(toDelete.id); setToDelete(null); }}
        />
      )}
    </>
  );
}

function ContactFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || { name: "", email: "", phone: "", address: "" });
  return (
    <Modal title={initial ? "Edit contact" : "Add contact"} onClose={onClose}>
      <form onSubmit={(e) => { e.preventDefault(); if (form.name.trim()) onSave(form); }}>
        <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
        <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
        <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Button type="button" variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</Button>
          <Button type="submit" variant="accent" style={{ flex: 1, justifyContent: "center" }}>Save</Button>
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
