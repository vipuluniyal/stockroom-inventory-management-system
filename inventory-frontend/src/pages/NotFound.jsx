import { Link } from "react-router-dom";
import { PackageSearch } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, background: "var(--bg)" }}>
      <PackageSearch size={36} color="var(--ink-soft)" />
      <h1 className="page-title">Page not found</h1>
      <p style={{ color: "var(--ink-soft)", margin: 0 }}>That shelf is empty. Let's get you back.</p>
      <Link to="/" style={{ marginTop: 10, color: "var(--teal)", fontWeight: 600 }}>Return to dashboard</Link>
    </div>
  );
}
