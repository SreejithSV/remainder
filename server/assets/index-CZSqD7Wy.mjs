import { jsx, jsxs } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { format } from "date-fns";
import { AlertTriangle, Package, ShieldCheck, Clock, XCircle } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { u as useSales } from "./use-sales-CH0VIFZo.mjs";
import { b as getStatus, d as daysRemaining } from "./warranty-data-xSwjLSd3.mjs";
import { S as StatusBadge } from "./status-badge-C_Nl8ojN.mjs";
import "./router-Cc0YGM-u.mjs";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
import "sonner";
function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  pulse
}) {
  const tones = {
    blue: "bg-primary text-primary-foreground",
    green: "bg-success text-success-foreground",
    amber: "bg-warning text-warning-foreground",
    red: "bg-destructive text-destructive-foreground"
  };
  return /* @__PURE__ */ jsx("div", { className: `${tones[tone]} rounded-xl p-5 shadow-sm relative overflow-hidden ${pulse && value > 0 ? "animate-pulse" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("p", { className: "text-sm opacity-90", children: label }),
      /* @__PURE__ */ jsx("p", { className: "text-3xl font-bold mt-1", children: value })
    ] }),
    /* @__PURE__ */ jsx(Icon, { className: "h-8 w-8 opacity-80" })
  ] }) });
}
function Dashboard() {
  const {
    sales,
    ready
  } = useSales();
  const stats = useMemo(() => {
    const active = sales.filter((s) => getStatus(s) === "active").length;
    const soon = sales.filter((s) => getStatus(s) === "expiring_soon").length;
    const expired = sales.filter((s) => getStatus(s) === "expired").length;
    return {
      total: sales.length,
      active,
      soon,
      expired
    };
  }, [sales]);
  const recent = useMemo(() => [...sales].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5), [sales]);
  const pieData = [{
    name: "Active",
    value: stats.active,
    color: "oklch(0.65 0.15 150)"
  }, {
    name: "Expiring Soon",
    value: stats.soon,
    color: "oklch(0.78 0.15 75)"
  }, {
    name: "Expired",
    value: stats.expired,
    color: "oklch(0.577 0.245 27.325)"
  }];
  if (!ready) return /* @__PURE__ */ jsx("div", { className: "text-muted-foreground", children: "Loading…" });
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    stats.soon > 0 && /* @__PURE__ */ jsx(Link, { to: "/alerts", className: "block", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 p-4 rounded-lg border border-warning/40 bg-warning/15 hover:bg-warning/25 transition-colors", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "h-5 w-5 text-warning-foreground" }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm font-medium text-warning-foreground", children: [
        stats.soon,
        " warrant",
        stats.soon === 1 ? "y" : "ies",
        " expiring within 6 days. Review alerts →"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsx(StatCard, { label: "Total Products Sold", value: stats.total, icon: Package, tone: "blue" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Active Warranties", value: stats.active, icon: ShieldCheck, tone: "green" }),
      /* @__PURE__ */ jsx(StatCard, { label: "Expiring in 6 Days", value: stats.soon, icon: Clock, tone: "amber", pulse: true }),
      /* @__PURE__ */ jsx(StatCard, { label: "Expired Warranties", value: stats.expired, icon: XCircle, tone: "red" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "lg:col-span-2 bg-card rounded-xl border p-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-4", children: "Recent Sales" }),
        recent.length === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm py-8 text-center", children: "No sales yet." }) : /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsx("thead", { className: "text-muted-foreground text-left", children: /* @__PURE__ */ jsxs("tr", { className: "border-b", children: [
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-3", children: "Customer" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-3", children: "Product" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-3", children: "Sale Date" }),
            /* @__PURE__ */ jsx("th", { className: "py-2 pr-3", children: "Warranty End" }),
            /* @__PURE__ */ jsx("th", { className: "py-2", children: "Status" })
          ] }) }),
          /* @__PURE__ */ jsx("tbody", { children: recent.map((s) => /* @__PURE__ */ jsxs("tr", { className: "border-b last:border-0", children: [
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-3 font-medium", children: s.customerName }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-3", children: s.productName }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-3 text-muted-foreground", children: format(new Date(s.saleDate), "dd MMM yyyy") }),
            /* @__PURE__ */ jsx("td", { className: "py-3 pr-3 text-muted-foreground", children: format(new Date(s.warrantyEndDate), "dd MMM yyyy") }),
            /* @__PURE__ */ jsx("td", { className: "py-3", children: /* @__PURE__ */ jsx(StatusBadge, { sale: s }) })
          ] }, s.id)) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl border p-5", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold mb-4", children: "Warranty Status" }),
        stats.total === 0 ? /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm py-8 text-center", children: "No data" }) : /* @__PURE__ */ jsx("div", { className: "h-64", children: /* @__PURE__ */ jsx(ResponsiveContainer, { width: "100%", height: "100%", children: /* @__PURE__ */ jsxs(PieChart, { children: [
          /* @__PURE__ */ jsx(Pie, { data: pieData, dataKey: "value", nameKey: "name", innerRadius: 50, outerRadius: 80, children: pieData.map((d, i) => /* @__PURE__ */ jsx(Cell, { fill: d.color }, i)) }),
          /* @__PURE__ */ jsx(Tooltip, {}),
          /* @__PURE__ */ jsx(Legend, {})
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "Tip: ",
      sales.filter((s) => daysRemaining(s) < 0).length,
      " expired records — visit Alerts to follow up."
    ] })
  ] });
}
export {
  Dashboard as component
};
