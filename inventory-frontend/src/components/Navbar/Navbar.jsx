import { Search, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "12px 22px",
        borderBottom: "1px solid var(--line)",
        background: "var(--panel)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ position: "relative", width: 320, maxWidth: "40vw" }}>
        <Search size={15} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-soft)" }} />
        <input
          placeholder="Search products, orders, suppliers..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 12px 8px 32px",
            borderRadius: 7,
            border: "1px solid var(--line)",
            background: "#FBFBF9",
            fontSize: 13.5,
            outline: "none",
          }}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{user?.name || "Guest"}</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-soft)" }}>{user?.role || "Viewer"}</div>
        </div>
        <div
          style={{
            width: 34, height: 34, borderRadius: "50%", background: "var(--teal-soft)",
            color: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 700, fontSize: 13,
          }}
        >
          {(user?.name || "G").slice(0, 1).toUpperCase()}
        </div>
        <button
          onClick={logout}
          title="Log out"
          style={{ border: "1px solid var(--line)", background: "#FBFBF9", borderRadius: 7, padding: 8, cursor: "pointer", color: "var(--ink-soft)" }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
}
