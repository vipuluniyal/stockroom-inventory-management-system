import { useMemo } from "react";
import Header from "../../components/Header/Header.jsx";
import { Card } from "../../components/Card/Card.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import { ComparisonBarChart, CategoryPieChart, TrendChart } from "../../components/Charts/Charts.jsx";
import { useResource } from "../../hooks/useResource";
import { formatDate } from "../../utils/formatDate";

export default function Reports() {
  const { items: products, loading: l1 } = useResource("products");
  const { items: sales, loading: l2 } = useResource("sales");
  const { items: purchases, loading: l3 } = useResource("purchases");

  const stockByCategory = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + p.quantity; });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [products]);

  const valueByCategory = useMemo(() => {
    const map = {};
    products.forEach((p) => { map[p.category] = (map[p.category] || 0) + p.quantity * p.price; });
    return Object.entries(map).map(([label, value]) => ({ label, value: Math.round(value) }));
  }, [products]);

  const cashFlow = useMemo(() => {
    const inflow = [...sales].sort((a, b) => new Date(a.date) - new Date(b.date)).map((o) => ({ label: formatDate(o.date), value: o.total }));
    return inflow;
  }, [sales]);

  const purchaseSpend = useMemo(() => {
    return [...purchases].sort((a, b) => new Date(a.date) - new Date(b.date)).map((o) => ({ label: formatDate(o.date), value: o.total }));
  }, [purchases]);

  if (l1 || l2 || l3) return <Loader label="Building your reports..." />;

  return (
    <>
      <Header eyebrow="Insights" title="Reports" description="Where your stock and cash are moving." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Units on hand by category</div>
          <ComparisonBarChart data={stockByCategory} color="var(--teal)" />
        </Card>
        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Inventory value by category</div>
          <CategoryPieChart data={valueByCategory} />
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Sales revenue over time</div>
          <TrendChart data={cashFlow} color="var(--teal)" />
        </Card>
        <Card style={{ padding: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>Purchase spend over time</div>
          <TrendChart data={purchaseSpend} color="var(--amber)" />
        </Card>
      </div>
    </>
  );
}
