import { jsxs, jsx } from "react/jsx-runtime";
import { Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Search, Grid3x3, List, PackageOpen, Phone, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { u as useSales } from "./use-sales-CH0VIFZo.mjs";
import { b as getStatus, d as daysRemaining, c as deleteSale } from "./warranty-data-xSwjLSd3.mjs";
import { S as StatusBadge } from "./status-badge-C_Nl8ojN.mjs";
import { W as WhatsAppButton } from "./whatsapp-button-CTq7gs02.mjs";
import "./router-Cc0YGM-u.mjs";
import "@tanstack/react-query";
import "clsx";
import "tailwind-merge";
function Products() {
  const {
    sales
  } = useSales();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("expiry");
  const [view, setView] = useState("cards");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const filtered = useMemo(() => {
    let list = sales;
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((s) => s.customerName.toLowerCase().includes(t) || s.productName.toLowerCase().includes(t));
    }
    if (filter !== "all") list = list.filter((s) => getStatus(s) === filter);
    list = [...list].sort((a, b) => {
      if (sort === "customer") return a.customerName.localeCompare(b.customerName);
      if (sort === "sale") return +new Date(b.saleDate) - +new Date(a.saleDate);
      return +new Date(a.warrantyEndDate) - +new Date(b.warrantyEndDate);
    });
    return list;
  }, [sales, q, filter, sort]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);
  const handleDelete = (s) => {
    if (!confirm(`Delete record for ${s.customerName}?`)) return;
    deleteSale(s.id);
    toast.success("Record deleted");
  };
  const filterBtns = [{
    v: "all",
    label: "All"
  }, {
    v: "active",
    label: "Active"
  }, {
    v: "expiring_soon",
    label: "Expiring Soon"
  }, {
    v: "expired",
    label: "Expired"
  }];
  return /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-4 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex gap-2 items-center", children: [
        /* @__PURE__ */ jsxs("div", { className: "relative flex-1", children: [
          /* @__PURE__ */ jsx(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }),
          /* @__PURE__ */ jsx("input", { value: q, onChange: (e) => {
            setQ(e.target.value);
            setPage(1);
          }, placeholder: "Search customer or product…", className: "w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex border rounded-md overflow-hidden", children: [
          /* @__PURE__ */ jsx("button", { onClick: () => setView("cards"), className: `p-2 ${view === "cards" ? "bg-primary text-primary-foreground" : "bg-card"}`, "aria-label": "Cards", children: /* @__PURE__ */ jsx(Grid3x3, { className: "h-4 w-4" }) }),
          /* @__PURE__ */ jsx("button", { onClick: () => setView("table"), className: `p-2 ${view === "table" ? "bg-primary text-primary-foreground" : "bg-card"}`, "aria-label": "Table", children: /* @__PURE__ */ jsx(List, { className: "h-4 w-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2 items-center justify-between", children: [
        /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: filterBtns.map((b) => /* @__PURE__ */ jsx("button", { onClick: () => {
          setFilter(b.v);
          setPage(1);
        }, className: `px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${filter === b.v ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`, children: b.label }, b.v)) }),
        /* @__PURE__ */ jsxs("select", { value: sort, onChange: (e) => setSort(e.target.value), className: "text-sm rounded-md border border-input bg-background px-3 py-1.5", children: [
          /* @__PURE__ */ jsx("option", { value: "expiry", children: "Sort: Expiry Date" }),
          /* @__PURE__ */ jsx("option", { value: "sale", children: "Sort: Sale Date" }),
          /* @__PURE__ */ jsx("option", { value: "customer", children: "Sort: Customer Name" })
        ] })
      ] })
    ] }),
    filtered.length === 0 ? /* @__PURE__ */ jsx(EmptyState, {}) : view === "cards" ? /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: pageItems.map((s) => /* @__PURE__ */ jsx(ProductCard, { sale: s, onDelete: handleDelete }, s.id)) }) : /* @__PURE__ */ jsx(ProductTable, { sales: pageItems, onDelete: handleDelete }),
    totalPages > 1 && /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-1", children: Array.from({
      length: totalPages
    }, (_, i) => i + 1).map((p) => /* @__PURE__ */ jsx("button", { onClick: () => setPage(p), className: `px-3 py-1.5 text-sm rounded-md ${p === page ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-muted"}`, children: p }, p)) })
  ] });
}
function ProductCard({
  sale,
  onDelete
}) {
  const days = daysRemaining(sale);
  const status = getStatus(sale);
  return /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsx("p", { className: "font-semibold truncate", children: sale.customerName }),
        /* @__PURE__ */ jsxs("a", { href: `tel:+91${sale.phone}`, className: "text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
          " +91 ",
          sale.phone
        ] })
      ] }),
      /* @__PURE__ */ jsx(StatusBadge, { sale })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 space-y-1", children: [
      /* @__PURE__ */ jsx("p", { className: "font-medium", children: sale.productName }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsx("span", { children: sale.brandName }),
        /* @__PURE__ */ jsx("span", { className: "px-1.5 py-0.5 rounded bg-accent text-accent-foreground", children: sale.category })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-3 text-xs text-muted-foreground space-y-0.5", children: [
      /* @__PURE__ */ jsxs("p", { children: [
        "Sold: ",
        format(new Date(sale.saleDate), "dd MMM yyyy")
      ] }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Ends: ",
        format(new Date(sale.warrantyEndDate), "dd MMM yyyy")
      ] }),
      /* @__PURE__ */ jsx("p", { className: `font-medium ${status === "expired" ? "text-destructive" : status === "expiring_soon" ? "text-warning-foreground" : "text-success"}`, children: days >= 0 ? `${days} days remaining` : `Expired ${Math.abs(days)} days ago` })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center gap-2 pt-3 border-t", children: [
      /* @__PURE__ */ jsx(WhatsAppButton, { sale }),
      /* @__PURE__ */ jsx(Link, { to: "/add-sale", className: "ml-auto p-1.5 rounded hover:bg-muted text-muted-foreground", title: "Edit", children: /* @__PURE__ */ jsx(Edit2, { className: "h-4 w-4" }) }),
      /* @__PURE__ */ jsx("button", { onClick: () => onDelete(sale), className: "p-1.5 rounded hover:bg-destructive/10 text-destructive", title: "Delete", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
    ] })
  ] });
}
function ProductTable({
  sales,
  onDelete
}) {
  return /* @__PURE__ */ jsx("div", { className: "bg-card border rounded-xl overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
    /* @__PURE__ */ jsx("thead", { className: "text-muted-foreground text-left bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { children: [
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Customer" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Product" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Sale" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "End" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3", children: "Status" }),
      /* @__PURE__ */ jsx("th", { className: "px-4 py-3 text-right", children: "Actions" })
    ] }) }),
    /* @__PURE__ */ jsx("tbody", { children: sales.map((s) => /* @__PURE__ */ jsxs("tr", { className: "border-t", children: [
      /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: s.customerName }),
        /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
          "+91 ",
          s.phone
        ] })
      ] }),
      /* @__PURE__ */ jsxs("td", { className: "px-4 py-3", children: [
        /* @__PURE__ */ jsx("div", { children: s.productName }),
        /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground", children: s.brandName })
      ] }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: format(new Date(s.saleDate), "dd MMM yyyy") }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-muted-foreground", children: format(new Date(s.warrantyEndDate), "dd MMM yyyy") }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsx(StatusBadge, { sale: s }) }),
      /* @__PURE__ */ jsx("td", { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsx(WhatsAppButton, { sale: s }),
        /* @__PURE__ */ jsx("button", { onClick: () => onDelete(s), className: "p-1.5 rounded hover:bg-destructive/10 text-destructive", children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" }) })
      ] }) })
    ] }, s.id)) })
  ] }) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-12 text-center", children: [
    /* @__PURE__ */ jsx(PackageOpen, { className: "h-12 w-12 mx-auto text-muted-foreground/60" }),
    /* @__PURE__ */ jsx("p", { className: "mt-3 font-medium", children: "No products found" }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Try adjusting filters or add a new sale." }),
    /* @__PURE__ */ jsx(Link, { to: "/add-sale", className: "inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium", children: "Add New Sale" })
  ] });
}
export {
  Products as component
};
