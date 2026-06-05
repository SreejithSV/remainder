import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useMemo } from "react";
import { Users, Phone, X } from "lucide-react";
import { format } from "date-fns";
import { u as useSales } from "./use-sales-CH0VIFZo.mjs";
import { b as getStatus } from "./warranty-data-xSwjLSd3.mjs";
import { S as StatusBadge } from "./status-badge-C_Nl8ojN.mjs";
import "./router-Cc0YGM-u.mjs";
import "@tanstack/react-query";
import "@tanstack/react-router";
import "clsx";
import "tailwind-merge";
import "sonner";
function Customers() {
  const {
    sales
  } = useSales();
  const [selected, setSelected] = useState(null);
  const customers = useMemo(() => {
    const map = /* @__PURE__ */ new Map();
    for (const s of sales) {
      const key = `${s.customerName}|${s.phone}`;
      const ex = map.get(key);
      if (ex) {
        ex.total++;
        if (getStatus(s) === "active") ex.active++;
        ex.sales.push(s);
      } else {
        map.set(key, {
          name: s.customerName,
          phone: s.phone,
          total: 1,
          active: getStatus(s) === "active" ? 1 : 0,
          sales: [s]
        });
      }
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [sales]);
  if (customers.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-12 text-center", children: [
      /* @__PURE__ */ jsx(Users, { className: "h-12 w-12 mx-auto text-muted-foreground/60" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 font-medium", children: "No customers yet" })
    ] });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: customers.map((c) => /* @__PURE__ */ jsxs("button", { onClick: () => setSelected(c), className: "text-left bg-card border rounded-xl p-5 hover:shadow-md hover:border-primary/40 transition-all", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsx("div", { className: "h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold", children: c.name.charAt(0).toUpperCase() }),
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "font-semibold truncate", children: c.name }),
          /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsx(Phone, { className: "h-3 w-3" }),
            " +91 ",
            c.phone
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex gap-6 text-sm", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "Products" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold", children: c.total })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-xs", children: "Active" }),
          /* @__PURE__ */ jsx("p", { className: "font-semibold text-success", children: c.active })
        ] })
      ] })
    ] }, `${c.name}-${c.phone}`)) }),
    selected && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4", onClick: () => setSelected(null), children: /* @__PURE__ */ jsxs("div", { className: "bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto", onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-5 border-b", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: selected.name }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-muted-foreground", children: [
            "+91 ",
            selected.phone,
            " · ",
            selected.total,
            " purchases"
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { onClick: () => setSelected(null), className: "p-1.5 rounded hover:bg-muted", children: /* @__PURE__ */ jsx(X, { className: "h-5 w-5" }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "p-5 space-y-3", children: selected.sales.map((s) => /* @__PURE__ */ jsxs("div", { className: "border rounded-lg p-3 flex items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsx("p", { className: "font-medium truncate", children: s.productName }),
          /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
            s.brandName,
            " · Sold ",
            format(new Date(s.saleDate), "dd MMM yyyy")
          ] })
        ] }),
        /* @__PURE__ */ jsx(StatusBadge, { sale: s })
      ] }, s.id)) })
    ] }) })
  ] });
}
export {
  Customers as component
};
