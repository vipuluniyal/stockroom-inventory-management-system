import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import AuthLayout from "../layouts/AuthLayout.jsx";
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Products from "../pages/Products/Products.jsx";
import Categories from "../pages/Categories/Categories.jsx";
import Suppliers from "../pages/Suppliers/Suppliers.jsx";
import Customers from "../pages/Customers/Customers.jsx";
import Purchases from "../pages/Purchases/Purchases.jsx";
import Sales from "../pages/Sales/Sales.jsx";
import Inventory from "../pages/Inventory/Inventory.jsx";
import Reports from "../pages/Reports/Reports.jsx";
import Settings from "../pages/Settings/Settings.jsx";
import NotFound from "../pages/NotFound.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/suppliers" element={<Suppliers />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
