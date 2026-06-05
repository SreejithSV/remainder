import { jsxs, jsx } from "react/jsx-runtime";
import { useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CheckCircle2, AlertTriangle, Phone, Check } from "lucide-react";
import { u as useSales } from "./use-sales-CH0VIFZo.mjs";
import { b as getStatus, d as daysRemaining, m as markNotified } from "./warranty-data-xSwjLSd3.mjs";
import { W as WhatsAppButton } from "./whatsapp-button-CTq7gs02.mjs";
function Alerts() {
  const {
    sales
  } = useSales();
  const urgent = useMemo(() => sales.filter((s) => {
    const st = getStatus(s);
    return st === "expiring_soon" || st === "expired";
  }).sort((a, b) => +new Date(a.warrantyEndDate) - +new Date(b.warrantyEndDate)), [sales]);
  if (urgent.length === 0) {
    return /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-12 text-center", children: [
      /* @__PURE__ */ jsx(CheckCircle2, { className: "h-12 w-12 mx-auto text-success" }),
      /* @__PURE__ */ jsx("p", { className: "mt-3 font-medium", children: "All warranties are healthy" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "No expiring or expired warranties right now." })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsx(AlertTriangle, { className: "h-4 w-4" }),
      urgent.length,
      " record",
      urgent.length === 1 ? "" : "s",
      " need attention."
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid sm:grid-cols-2 gap-4", children: urgent.map((s) => {
      const expired = getStatus(s) === "expired";
      const days = daysRemaining(s);
      return /* @__PURE__ */ jsxs("div", { className: `rounded-xl border p-5 ${expired ? "bg-destructive/5 border-destructive/30" : "bg-warning/10 border-warning/40"}`, children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("p", { className: "font-semibold text-lg", children: s.customerName }),
            /* @__PURE__ */ jsxs("a", { href: `tel:+91${s.phone}`, className: "text-sm font-medium text-primary inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsx(Phone, { className: "h-3.5 w-3.5" }),
              " +91 ",
              s.phone
            ] })
          ] }),
          s.notified && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 text-xs text-success font-medium", children: [
            /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }),
            " Notified"
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 font-medium", children: s.productName }),
        /* @__PURE__ */ jsx("p", { className: `mt-1 text-sm font-semibold ${expired ? "text-destructive" : "text-warning-foreground"}`, children: expired ? `Expired ${Math.abs(days)} days ago` : `${days} days remaining` }),
        /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Ends: ",
          format(new Date(s.warrantyEndDate), "dd MMM yyyy")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-wrap gap-2", children: [
          /* @__PURE__ */ jsx(WhatsAppButton, { sale: s }),
          /* @__PURE__ */ jsxs("button", { onClick: () => {
            markNotified(s.id, !s.notified);
            toast.success(s.notified ? "Marked as not notified" : "Marked as notified");
          }, className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card text-xs font-medium hover:bg-muted", children: [
            /* @__PURE__ */ jsx(Check, { className: "h-3.5 w-3.5" }),
            " ",
            s.notified ? "Undo notify" : "Mark as Notified"
          ] })
        ] })
      ] }, s.id);
    }) })
  ] });
}
export {
  Alerts as component
};
