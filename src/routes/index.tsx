import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { format } from "date-fns";
import { Package, ShieldCheck, Clock, XCircle, AlertTriangle } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { useSales } from "@/hooks/use-sales";
import { daysRemaining, getStatus } from "@/lib/warranty-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard — WarrantyPro" }] }),
  component: Dashboard,
});

function StatCard({
  label, value, icon: Icon, tone, pulse,
}: { label: string; value: number; icon: typeof Package; tone: "blue" | "green" | "amber" | "red"; pulse?: boolean }) {
  const tones: Record<string, string> = {
    blue: "bg-primary text-primary-foreground",
    green: "bg-success text-success-foreground",
    amber: "bg-warning text-warning-foreground",
    red: "bg-destructive text-destructive-foreground",
  };
  return (
    <div className={`${tones[tone]} rounded-xl p-5 shadow-sm relative overflow-hidden ${pulse && value > 0 ? "animate-pulse" : ""}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm opacity-90">{label}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <Icon className="h-8 w-8 opacity-80" />
      </div>
    </div>
  );
}

function Dashboard() {
  const { sales, ready } = useSales();

  const stats = useMemo(() => {
    const active = sales.filter((s) => getStatus(s) === "active").length;
    const soon = sales.filter((s) => getStatus(s) === "expiring_soon").length;
    const expired = sales.filter((s) => getStatus(s) === "expired").length;
    return { total: sales.length, active, soon, expired };
  }, [sales]);

  const recent = useMemo(
    () => [...sales].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5),
    [sales],
  );

  const pieData = [
    { name: "Active", value: stats.active, color: "oklch(0.65 0.15 150)" },
    { name: "Expiring Soon", value: stats.soon, color: "oklch(0.78 0.15 75)" },
    { name: "Expired", value: stats.expired, color: "oklch(0.577 0.245 27.325)" },
  ];

  if (!ready) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6">
      {stats.soon > 0 && (
        <Link to="/alerts" className="block">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-warning/40 bg-warning/15 hover:bg-warning/25 transition-colors">
            <AlertTriangle className="h-5 w-5 text-warning-foreground" />
            <p className="text-sm font-medium text-warning-foreground">
              {stats.soon} warrant{stats.soon === 1 ? "y" : "ies"} expiring within 6 days. Review alerts →
            </p>
          </div>
        </Link>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products Sold" value={stats.total} icon={Package} tone="blue" />
        <StatCard label="Active Warranties" value={stats.active} icon={ShieldCheck} tone="green" />
        <StatCard label="Expiring in 6 Days" value={stats.soon} icon={Clock} tone="amber" pulse />
        <StatCard label="Expired Warranties" value={stats.expired} icon={XCircle} tone="red" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-xl border p-5">
          <h2 className="font-semibold mb-4">Recent Sales</h2>
          {recent.length === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No sales yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground text-left">
                  <tr className="border-b">
                    <th className="py-2 pr-3">Customer</th>
                    <th className="py-2 pr-3">Product</th>
                    <th className="py-2 pr-3">Sale Date</th>
                    <th className="py-2 pr-3">Warranty End</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s) => (
                    <tr key={s.id} className="border-b last:border-0">
                      <td className="py-3 pr-3 font-medium">{s.customerName}</td>
                      <td className="py-3 pr-3">{s.productName}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{format(new Date(s.saleDate), "dd MMM yyyy")}</td>
                      <td className="py-3 pr-3 text-muted-foreground">{format(new Date(s.warrantyEndDate), "dd MMM yyyy")}</td>
                      <td className="py-3"><StatusBadge sale={s} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-card rounded-xl border p-5">
          <h2 className="font-semibold mb-4">Warranty Status</h2>
          {stats.total === 0 ? (
            <p className="text-muted-foreground text-sm py-8 text-center">No data</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: {sales.filter((s) => daysRemaining(s) < 0).length} expired records — visit Alerts to follow up.
      </p>
    </div>
  );
}
