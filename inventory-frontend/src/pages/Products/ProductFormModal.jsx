import { useState } from "react";
import { Check } from "lucide-react";
import Modal from "../../components/Modal/Modal.jsx";
import Input from "../../components/Input/Input.jsx";
import Select from "../../components/Select/Select.jsx";
import Button from "../../components/Button/Button.jsx";
import { CATEGORY_NAMES } from "../../constants/categories";

export default function ProductFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || { name: "", sku: "", category: CATEGORY_NAMES[0], quantity: 0, reorder: 10, price: 0, supplier: "" }
  );
  const isEdit = Boolean(initial);

  function set(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.sku.trim()) return;
    onSave({
      ...form,
      quantity: Number(form.quantity) || 0,
      reorder: Number(form.reorder) || 0,
      price: Number(form.price) || 0,
    });
  }

  return (
    <Modal title={isEdit ? "Edit product" : "Add product"} onClose={onClose}>
      <form onSubmit={submit}>
        <Input label="Product name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Hex Bolt M8x40" required />

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Input label="SKU" style={{ fontFamily: "var(--font-mono)" }} value={form.sku} onChange={(e) => set("sku", e.target.value)} placeholder="HW-0812" required />
          </div>
          <div style={{ flex: 1 }}>
            <Select label="Category" value={form.category} onChange={(e) => set("category", e.target.value)} options={CATEGORY_NAMES} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Input label="Quantity on hand" type="number" min="0" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <Input label="Reorder level" type="number" min="0" value={form.reorder} onChange={(e) => set("reorder", e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <Input label="Unit price" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <Input label="Supplier" value={form.supplier} onChange={(e) => set("supplier", e.target.value)} placeholder="e.g. Fastenal Co." />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          <Button type="button" variant="ghost" onClick={onClose} style={{ flex: 1, justifyContent: "center" }}>Cancel</Button>
          <Button type="submit" variant="accent" icon={Check} style={{ flex: 1, justifyContent: "center" }}>
            {isEdit ? "Save changes" : "Add to inventory"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
