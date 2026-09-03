import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";

export default function DashboardLayout() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <Navbar />
        <main style={{ flex: 1, padding: "22px 26px 8px", maxWidth: 1240, width: "100%", margin: "0 auto" }}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
