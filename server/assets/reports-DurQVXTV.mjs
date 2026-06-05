import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { format, startOfMonth, isSameMonth } from "date-fns";
import { IndianRupee, Download } from "lucide-react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, PieChart, Pie, Cell, Legend } from "recharts";
import { toast } from "sonner";
import { u as useSales } from "./use-sales-CH0VIFZo.mjs";
import { a as getSales } from "./warranty-data-xSwjLSd3.mjs";
const COLORS = ["oklch(0.32 0.08 245)", "oklch(0.65 0.15 150)", "oklch(0.78 0.15 75)", "oklch(0.577 0.245 27.325)", "oklch(0.60 0.18 295)"];
function Reports() {
  const {
    sales
  } = useSales();
  const monthly = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of sales) {
      const k = format(startOfMonth(new Date(s.saleDate)), "MMM yy");
      map.set(k, (map.get(k) || 0) + 1);
    }
    return [...map.entries()].map(([month, sales2]) => ({
      month,
      sales: sales2
    })).slice(-12);
  }, [sales]);
  const byCategory = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of sales) map.set(s.category, (map.get(s.category) || 0) + 1);
    return [...map.entries()].map(([name, value]) => ({
      name,
      value
    }));
  }, [sales]);
  const monthRevenue = useMemo(() => sales.filter((s) => isSameMonth(new Date(s.saleDate), /* @__PURE__ */ new Date())).reduce((sum, s) => sum + (s.purchasePrice || 0), 0), [sales]);
  const topCustomers = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of sales) {
      const k = `${s.customerName}|${s.phone}`;
      const ex = map.get(k);
      if (ex) {
        ex.count++;
        ex.revenue += s.purchasePrice || 0;
      } else map.set(k, {
        name: s.customerName,
        phone: s.phone,
        count: 1,
        revenue: s.purchasePrice || 0
      });
    }
    return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [sales]);
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(getSales(), null, 2)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `warranty-export-${format(/* @__PURE__ */ new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export downloaded");
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between gap-2 flex-wrap", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-5 flex items-center gap-4", children: [
        /* @__PURE__ */ jsx("div", { className: "h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center", children: /* @__PURE__ */ jsx(IndianRupee, { className: "h-6 w-6" }) }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Revenue This Month" }),
          /* @__PURE__ */ jsxs("p", { className: "text-2xl font-bold", children: [
            "₹",
            monthRevenue.toLocaleString("en-IN")
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: exportJson, className: "inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90", children: [
        /* @__PURE__ */ jsx(Download, { className: "h-4 w-4" }),
        " Export JSON"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-4", children: "Monthly Sales" }),
        /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(BarChart, { data: monthly, children: [
          /* @__PURE__ */ jsx(CartesianGrid, { strokeDasharray: "3 3", opacity: 0.3 }),
          /* @__PURE__ */ jsx(XAxis, { dataKey: "month", fontSize: 12 }),
          /* @__PURE__ */ jsx(YAxis, { fontSize: 12, allowDecimals: false }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Bar, { dataKey: "sales", fill: "oklch(0.32 0.08 245)", radius: [6, 6, 0, 0] })
        ] }) }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-4", children: "Sales by Category" }),
        /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: byCategory, dataKey: "value", nameKey: "name", innerRadius: 45, outerRadius: 80, children: byCategory.map((_, i) => /* @__PURE__ */ jsx(Cell, { fill: COLORS[i % COLORS.length] }, i)) }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Legend, {})
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-5", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-4", children: "Top 5 Customers" }),
      topCustomers.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No data" }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
        /* @__PURE__ */ jsx("thead", { className: "text-muted-foreground text-left", children: /* @__PURE__ */ jsxs("tr", { className: "border-b", children: [
          /* @__PURE__ */ jsx("th", { className: "py-2 pr-3", children: "Customer" }),
          /* @__PURE__ */ jsx("th", { className: "py-2 pr-3", children: "Phone" }),
          /* @__PURE__ */ jsx("th", { className: "py-2 pr-3", children: "Purchases" }),
          /* @__PURE__ */ jsx("th", { className: "py-2", children: "Revenue" })
        ] }) }),
        /* @__PURE__ */ jsx("tbody", { children: topCustomers.map((c) => /* @__PURE__ */ jsxs("tr", { className: "border-b last:border-0", children: [
          /* @__PURE__ */ jsx("td", { className: "py-3 pr-3 font-medium", children: c.name }),
          /* @__PURE__ */ jsxs("td", { className: "py-3 pr-3 text-muted-foreground", children: [
            "+91 ",
            c.phone
          ] }),
          /* @__PURE__ */ jsx("td", { className: "py-3 pr-3", children: c.count }),
          /* @__PURE__ */ jsxs("td", { className: "py-3", children: [
            "₹",
            c.revenue.toLocaleString("en-IN")
          ] })
        ] }, `${c.name}-${c.phone}`)) })
      ] }) })
    ] })
  ] });
}
export {
  Reports as component
};
