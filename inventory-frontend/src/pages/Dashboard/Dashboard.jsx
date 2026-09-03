import { useMemo } from "react";
import { Package, Wallet, AlertTriangle, ShoppingCart } from "lucide-react";
import Header from "../../components/Header/Header.jsx";
import { StatCard, Card } from "../../components/Card/Card.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import Badge from "../../components/Badge/Badge.jsx";
import { TrendChart, CategoryPieChart } from "../../components/Charts/Charts.jsx";
import { useResource } from "../../hooks/useResource";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate } from "../../utils/formatDate";
import { stockStatus } from "../../constants/status";

export default function Dashboard() {
  const { items: products, loading: loadingProducts } = useResource("products");
  const { items: sales, loading: loadingSales } = useResource("sales");
  const { items: purchases, loading: loadingPurchases } = useResource("purchases");

  const stats = useMemo(() => {
    const totalUnits = products.reduce((s, p) => s + p.quantity, 0);
    const totalValue = products.reduce((s, p) => s + p.quantity * p.price, 0);
    const lowCount = products.filter((p) => stockStatus(p.quantity, p.reorder) !== "ok").length;
    const revenue = sales.reduce((s, o) => s + o.total, 0);
    return { totalUnits, totalValue, lowCount, revenue };
  }, [products, sales]);

  const categoryBreakdown = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      map[p.category] = (map[p.category] || 0) + p.quantity * p.price;
    });
    return Object.entries(map).map(([label, value]) => ({ label, value: Math.round(value) }));
  }, [products]);

  const salesTrend = useMemo(() => {
    return [...sales]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((o) => ({ label: formatDate(o.date).replace(",", ""), value: o.total }));
  }, [sales]);

  const loading = loadingProducts || loadingSales || loadingPurchases;
  if (loading) return <Loader label="Loading your dashboard..." />;

  return (
    <>
      <Header
        eyebrow="Overview"
        title="Dashboard"
        description="A snapshot of stock levels, revenue, and what needs attention today."
      />

      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 20 }}>
        <StatCard icon={Package} label="Units on hand" value={stats.totalUnits.toLocaleString()} sub={`${products.length} SKUs tracked`} accent="var(--teal)" />
        <StatCard icon={Wallet} label="Inventory value" value={formatCurrency(stats.totalValue)} sub="at current unit price" accent="var(--teal)" />
        <StatCard icon={AlertTriangle} label="Needs reorder" value={stats.lowCount} sub="items at or below threshold" accent={stats.lowCount ? "var(--amber)" : "var(--ink-soft)"} />
        <StatCard icon={ShoppingCart} label="Revenue booked" value={formatCurrency(stats.revenue)} sub={`${sales.length} sales orders`} accent="var(--teal)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Sales trend</div>
          <TrendChart data={salesTrend} />
        </Card>
        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Inventory value by category</div>
          <CategoryPieChart data={categoryBreakdown} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Recent purchase orders</div>
          {purchases.slice(0, 4).map((po) => (
            <div key={po.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{po.reference} · {po.supplier}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>{formatDate(po.date)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>{formatCurrency(po.total)}</span>
                <Badge status={po.status} />
              </div>
            </div>
          ))}
        </Card>

        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Items needing attention</div>
          {products.filter((p) => stockStatus(p.quantity, p.reorder) !== "ok").slice(0, 4).map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--line-soft)" }}>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "var(--ink-soft)", fontFamily: "var(--font-mono)" }}>{p.sku}</div>
              </div>
              <Badge status={stockStatus(p.quantity, p.reorder)} />
            </div>
          ))}
          {products.filter((p) => stockStatus(p.quantity, p.reorder) !== "ok").length === 0 && (
            <div style={{ fontSize: 13, color: "var(--ink-soft)", padding: "8px 0" }}>Everything is well stocked.</div>
          )}
        </Card>
      </div>
    </>
  );
}
