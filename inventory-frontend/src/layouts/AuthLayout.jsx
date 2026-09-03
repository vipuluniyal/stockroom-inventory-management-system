import { Outlet } from "react-router-dom";
import { Boxes } from "lucide-react";

export default function AuthLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div style={{ width: 380, maxWidth: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 22 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Boxes size={18} color="#fff" />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 24, textTransform: "uppercase" }}>
            Stockroom
          </span>
        </div>
        <div style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 12, padding: 26 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
