import { jsxs, jsx } from "react/jsx-runtime";
import { b as getStatus, d as daysRemaining } from "./warranty-data-xSwjLSd3.mjs";
import { c as cn } from "./router-Cc0YGM-u.mjs";
function StatusBadge({ sale, className }) {
  const status = getStatus(sale);
  const days = daysRemaining(sale);
  const config = {
    active: { label: "Active", cls: "bg-success/15 text-success border-success/30", dot: "bg-success" },
    expiring_soon: { label: `Expiring in ${days}d`, cls: "bg-warning/20 text-warning-foreground border-warning/40", dot: "bg-warning" },
    expired: { label: `Expired ${Math.abs(days)}d ago`, cls: "bg-destructive/15 text-destructive border-destructive/30", dot: "bg-destructive" }
  }[status];
  return /* @__PURE__ */ jsxs("span", { className: cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium", config.cls, className), children: [
    /* @__PURE__ */ jsx("span", { className: cn("h-1.5 w-1.5 rounded-full", config.dot) }),
    config.label
  ] });
}
export {
  StatusBadge as S
};
