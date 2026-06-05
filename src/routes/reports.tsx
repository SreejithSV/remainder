import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { format, startOfMonth, isSameMonth } from "date-fns";
import { Download, IndianRupee } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { useSales } from "@/hooks/use-sales";
import { getSales } from "@/lib/warranty-data";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports — WarrantyPro" }] }),
  component: Reports,
});

const COLORS = [
  "oklch(0.32 0.08 245)", "oklch(0.65 0.15 150)", "oklch(0.78 0.15 75)",
  "oklch(0.577 0.245 27.325)", "oklch(0.60 0.18 295)",
];

function Reports() {
  const { sales } = useSales();

  const monthly = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sales) {
      const k = format(startOfMonth(new Date(s.saleDate)), "MMM yy");
      map.set(k, (map.get(k) || 0) + 1);
    }
    return [...map.entries()].map(([month, sales]) => ({ month, sales })).slice(-12);
  }, [sales]);

  const byCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of sales) map.set(s.category, (map.get(s.category) || 0) + 1);
    return [...map.entries()].map(([name, value]) => ({ name, value }));
  }, [sales]);

  const monthRevenue = useMemo(
    () => sales.filter((s) => isSameMonth(new Date(s.saleDate), new Date()))
      .reduce((sum, s) => sum + (s.purchasePrice || 0), 0),
    [sales],
  );

  const topCustomers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; count: number; revenue: number }>();
    for (const s of sales) {
      const k = `${s.customerName}|${s.phone}`;
      const ex = map.get(k);
      if (ex) { ex.count++; ex.revenue += s.purchasePrice || 0; }
      else map.set(k, { name: s.customerName, phone: s.phone, count: 1, revenue: s.purchasePrice || 0 });
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [sales]);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(getSales(), null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `warranty-export-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="bg-card border rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Revenue This Month</p>
            <p className="text-2xl font-bold">₹{monthRevenue.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <button
          onClick={exportJson}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90"
        >
          <Download className="h-4 w-4" /> Export JSON
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Monthly Sales</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="sales" fill="oklch(0.32 0.08 245)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-5">
          <h2 className="font-semibold mb-4">Sales by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={byCategory} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
                  {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl p-5">
        <h2 className="font-semibold mb-4">Top 5 Customers</h2>
        {topCustomers.length === 0 ? (
          <p className="text-sm text-muted-foreground">No data</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-muted-foreground text-left">
                <tr className="border-b">
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Phone</th>
                  <th className="py-2 pr-3">Purchases</th>
                  <th className="py-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c) => (
                  <tr key={`${c.name}-${c.phone}`} className="border-b last:border-0">
                    <td className="py-3 pr-3 font-medium">{c.name}</td>
                    <td className="py-3 pr-3 text-muted-foreground">+91 {c.phone}</td>
                    <td className="py-3 pr-3">{c.count}</td>
                    <td className="py-3">₹{c.revenue.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}