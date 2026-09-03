export const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", path: "/", icon: "LayoutDashboard" }],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", path: "/products", icon: "Package" },
      { label: "Categories", path: "/categories", icon: "Tags" },
      { label: "Inventory", path: "/inventory", icon: "Boxes" },
    ],
  },
  {
    label: "Relationships",
    items: [
      { label: "Suppliers", path: "/suppliers", icon: "Truck" },
      { label: "Customers", path: "/customers", icon: "Users" },
    ],
  },
  {
    label: "Transactions",
    items: [
      { label: "Purchases", path: "/purchases", icon: "ShoppingCart" },
      { label: "Sales", path: "/sales", icon: "Receipt" },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Reports", path: "/reports", icon: "BarChart3" },
      { label: "Settings", path: "/settings", icon: "Settings" },
    ],
  },
];
