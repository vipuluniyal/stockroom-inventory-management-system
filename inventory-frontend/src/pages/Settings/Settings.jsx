import { useState } from "react";
import { Save, LogOut } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import { Card } from "../../components/Card/Card.jsx";
import Input from "../../components/Input/Input.jsx";
import Select from "../../components/Select/Select.jsx";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth";

export default function Settings() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [currency, setCurrency] = useState("USD");
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  function save(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <>
      <Header eyebrow="Insights" title="Settings" description="Your profile and workspace preferences." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Profile</div>
          <form onSubmit={save}>
            <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" value={user?.email || ""} disabled />
            <Select label="Display currency" value={currency} onChange={(e) => setCurrency(e.target.value)} options={["USD", "EUR", "GBP", "INR"]} />
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, margin: "6px 0 18px" }}>
              <input type="checkbox" checked={lowStockAlerts} onChange={(e) => setLowStockAlerts(e.target.checked)} />
              Notify me about low-stock items
            </label>
            <Button type="submit" variant="accent" icon={Save}>
              {saved ? "Saved" : "Save changes"}
            </Button>
          </form>
        </Card>

        <Card style={{ padding: 20 }}>
          <div className="eyebrow" style={{ marginBottom: 14 }}>Data</div>
          <p style={{ fontSize: 13.5, color: "var(--ink-soft)", marginTop: 0 }}>
            Inventory data now lives in your MySQL database, not the browser. To restore the
            original sample catalog, contacts, and orders, re-run{" "}
            <code style={{ fontFamily: "var(--font-mono)", fontSize: 12.5 }}>database/schema.sql</code>{" "}
            against your database from the backend project.
          </p>
          <Button variant="ghost" icon={LogOut} onClick={logout}>Log out</Button>
        </Card>
      </div>
    </>
  );
}
