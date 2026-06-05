import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertTriangle, Check, Phone, CheckCircle2 } from "lucide-react";
import { useSales } from "@/hooks/use-sales";
import { daysRemaining, getStatus, markNotified } from "@/lib/warranty-data";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Warranty Alerts — WarrantyPro" }] }),
  component: Alerts,
});

function Alerts() {
  const { sales } = useSales();
  const urgent = useMemo(
    () =>
      sales
        .filter((s) => {
          const st = getStatus(s);
          return st === "expiring_soon" || st === "expired";
        })
        .sort((a, b) => +new Date(a.warrantyEndDate) - +new Date(b.warrantyEndDate)),
    [sales],
  );

  if (urgent.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-12 text-center">
        <CheckCircle2 className="h-12 w-12 mx-auto text-success" />
        <p className="mt-3 font-medium">All warranties are healthy</p>
        <p className="text-sm text-muted-foreground">No expiring or expired warranties right now.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <AlertTriangle className="h-4 w-4" />
        {urgent.length} record{urgent.length === 1 ? "" : "s"} need attention.
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {urgent.map((s) => {
          const expired = getStatus(s) === "expired";
          const days = daysRemaining(s);
          return (
            <div
              key={s.id}
              className={`rounded-xl border p-5 ${
                expired
                  ? "bg-destructive/5 border-destructive/30"
                  : "bg-warning/10 border-warning/40"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-lg">{s.customerName}</p>
                  <a href={`tel:+91${s.phone}`} className="text-sm font-medium text-primary inline-flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> +91 {s.phone}
                  </a>
                </div>
                {s.notified && (
                  <span className="inline-flex items-center gap-1 text-xs text-success font-medium">
                    <Check className="h-3.5 w-3.5" /> Notified
                  </span>
                )}
              </div>
              <p className="mt-3 font-medium">{s.productName}</p>
              <p className={`mt-1 text-sm font-semibold ${expired ? "text-destructive" : "text-warning-foreground"}`}>
                {expired ? `Expired ${Math.abs(days)} days ago` : `${days} days remaining`}
              </p>
              <p className="text-xs text-muted-foreground">Ends: {format(new Date(s.warrantyEndDate), "dd MMM yyyy")}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <WhatsAppButton sale={s} />
                <button
                  onClick={() => {
                    markNotified(s.id, !s.notified);
                    toast.success(s.notified ? "Marked as not notified" : "Marked as notified");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card text-xs font-medium hover:bg-muted"
                >
                  <Check className="h-3.5 w-3.5" /> {s.notified ? "Undo notify" : "Mark as Notified"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}