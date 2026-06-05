import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Phone, Users, X } from "lucide-react";
import { format } from "date-fns";
import { useSales } from "@/hooks/use-sales";
import { getStatus, type Sale } from "@/lib/warranty-data";
import { StatusBadge } from "@/components/status-badge";

export const Route = createFileRoute("/customers")({
  head: () => ({ meta: [{ title: "Customers — WarrantyPro" }] }),
  component: Customers,
});

interface CustomerRow {
  name: string;
  phone: string;
  total: number;
  active: number;
  sales: Sale[];
}

function Customers() {
  const { sales } = useSales();
  const [selected, setSelected] = useState<CustomerRow | null>(null);

  const customers = useMemo<CustomerRow[]>(() => {
    const map = new Map<string, CustomerRow>();
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
          sales: [s],
        });
      }
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [sales]);

  if (customers.length === 0) {
    return (
      <div className="bg-card border rounded-xl p-12 text-center">
        <Users className="h-12 w-12 mx-auto text-muted-foreground/60" />
        <p className="mt-3 font-medium">No customers yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {customers.map((c) => (
          <button
            key={`${c.name}-${c.phone}`}
            onClick={() => setSelected(c)}
            className="text-left bg-card border rounded-xl p-5 hover:shadow-md hover:border-primary/40 transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">{c.name}</p>
                <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                  <Phone className="h-3 w-3" /> +91 {c.phone}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <p className="text-muted-foreground text-xs">Products</p>
                <p className="font-semibold">{c.total}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">Active</p>
                <p className="font-semibold text-success">{c.active}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <h3 className="font-semibold text-lg">{selected.name}</h3>
                <p className="text-sm text-muted-foreground">+91 {selected.phone} · {selected.total} purchases</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {selected.sales.map((s) => (
                <div key={s.id} className="border rounded-lg p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium truncate">{s.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.brandName} · Sold {format(new Date(s.saleDate), "dd MMM yyyy")}
                    </p>
                  </div>
                  <StatusBadge sale={s} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}