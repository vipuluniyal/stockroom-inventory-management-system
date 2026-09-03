import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import { NAV_SECTIONS } from "../../constants/navigation";
import { Boxes } from "lucide-react";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 232,
        flexShrink: 0,
        background: "var(--panel)",
        borderRight: "1px solid var(--line)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "18px 18px 14px" }}>
        <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--teal)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Boxes size={16} color="#fff" />
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, textTransform: "uppercase" }}>
          Stockroom
        </span>
      </div>

      <nav style={{ flex: 1, overflowY: "auto", padding: "6px 12px" }} className="scrollbar-thin">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} style={{ marginBottom: 16 }}>
            <div
              style={{
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--ink-soft)",
                padding: "0 10px",
                marginBottom: 6,
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => {
              const Icon = Icons[item.icon] || Icons.Circle;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 10px",
                    borderRadius: 7,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: isActive ? "#fff" : "var(--ink)",
                    background: isActive ? "var(--teal)" : "transparent",
                    marginBottom: 2,
                  })}
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}
