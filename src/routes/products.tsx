import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Phone, Edit2, Trash2, Grid3x3, List, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { useSales } from "@/hooks/use-sales";
import { daysRemaining, deleteSale, getStatus, type Sale } from "@/lib/warranty-data";
import { StatusBadge } from "@/components/status-badge";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const Route = createFileRoute("/products")({
  head: () => ({ meta: [{ title: "All Products — WarrantyPro" }] }),
  component: Products,
});

type Filter = "all" | "active" | "expiring_soon" | "expired";
type Sort = "expiry" | "sale" | "customer";

function Products() {
  const { sales } = useSales();
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("expiry");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = useMemo(() => {
    let list = sales;
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter(
        (s) => s.customerName.toLowerCase().includes(t) || s.productName.toLowerCase().includes(t),
      );
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

  const handleDelete = (s: Sale) => {
    if (!confirm(`Delete record for ${s.customerName}?`)) return;
    deleteSale(s.id);
    toast.success("Record deleted");
  };

  const filterBtns: { v: Filter; label: string }[] = [
    { v: "all", label: "All" },
    { v: "active", label: "Active" },
    { v: "expiring_soon", label: "Expiring Soon" },
    { v: "expired", label: "Expired" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card border rounded-xl p-4 space-y-4">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1); }}
              placeholder="Search customer or product…"
              className="w-full pl-9 pr-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex border rounded-md overflow-hidden">
            <button onClick={() => setView("cards")} className={`p-2 ${view === "cards" ? "bg-primary text-primary-foreground" : "bg-card"}`} aria-label="Cards">
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button onClick={() => setView("table")} className={`p-2 ${view === "table" ? "bg-primary text-primary-foreground" : "bg-card"}`} aria-label="Table">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {filterBtns.map((b) => (
              <button
                key={b.v}
                onClick={() => { setFilter(b.v); setPage(1); }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  filter === b.v ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="text-sm rounded-md border border-input bg-background px-3 py-1.5">
            <option value="expiry">Sort: Expiry Date</option>
            <option value="sale">Sort: Sale Date</option>
            <option value="customer">Sort: Customer Name</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState />
      ) : view === "cards" ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageItems.map((s) => <ProductCard key={s.id} sale={s} onDelete={handleDelete} />)}
        </div>
      ) : (
        <ProductTable sales={pageItems} onDelete={handleDelete} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`px-3 py-1.5 text-sm rounded-md ${p === page ? "bg-primary text-primary-foreground" : "bg-card border hover:bg-muted"}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ sale, onDelete }: { sale: Sale; onDelete: (s: Sale) => void }) {
  const days = daysRemaining(sale);
  const status = getStatus(sale);
  return (
    <div className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold truncate">{sale.customerName}</p>
          <a href={`tel:+91${sale.phone}`} className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            <Phone className="h-3 w-3" /> +91 {sale.phone}
          </a>
        </div>
        <StatusBadge sale={sale} />
      </div>
      <div className="mt-3 space-y-1">
        <p className="font-medium">{sale.productName}</p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{sale.brandName}</span>
          <span className="px-1.5 py-0.5 rounded bg-accent text-accent-foreground">{sale.category}</span>
        </div>
      </div>
      <div className="mt-3 text-xs text-muted-foreground space-y-0.5">
        <p>Sold: {format(new Date(sale.saleDate), "dd MMM yyyy")}</p>
        <p>Ends: {format(new Date(sale.warrantyEndDate), "dd MMM yyyy")}</p>
        <p className={`font-medium ${status === "expired" ? "text-destructive" : status === "expiring_soon" ? "text-warning-foreground" : "text-success"}`}>
          {days >= 0 ? `${days} days remaining` : `Expired ${Math.abs(days)} days ago`}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-2 pt-3 border-t">
        <WhatsAppButton sale={sale} />
        <Link to="/add-sale" className="ml-auto p-1.5 rounded hover:bg-muted text-muted-foreground" title="Edit">
          <Edit2 className="h-4 w-4" />
        </Link>
        <button onClick={() => onDelete(sale)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive" title="Delete">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function ProductTable({ sales, onDelete }: { sales: Sale[]; onDelete: (s: Sale) => void }) {
  return (
    <div className="bg-card border rounded-xl overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-muted-foreground text-left bg-muted/50">
          <tr>
            <th className="px-4 py-3">Customer</th>
            <th className="px-4 py-3">Product</th>
            <th className="px-4 py-3">Sale</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="px-4 py-3">
                <div className="font-medium">{s.customerName}</div>
                <div className="text-xs text-muted-foreground">+91 {s.phone}</div>
              </td>
              <td className="px-4 py-3">
                <div>{s.productName}</div>
                <div className="text-xs text-muted-foreground">{s.brandName}</div>
              </td>
              <td className="px-4 py-3 text-muted-foreground">{format(new Date(s.saleDate), "dd MMM yyyy")}</td>
              <td className="px-4 py-3 text-muted-foreground">{format(new Date(s.warrantyEndDate), "dd MMM yyyy")}</td>
              <td className="px-4 py-3"><StatusBadge sale={s} /></td>
              <td className="px-4 py-3 text-right">
                <div className="inline-flex items-center gap-1">
                  <WhatsAppButton sale={s} />
                  <button onClick={() => onDelete(s)} className="p-1.5 rounded hover:bg-destructive/10 text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-card border rounded-xl p-12 text-center">
      <PackageOpen className="h-12 w-12 mx-auto text-muted-foreground/60" />
      <p className="mt-3 font-medium">No products found</p>
      <p className="text-sm text-muted-foreground">Try adjusting filters or add a new sale.</p>
      <Link to="/add-sale" className="inline-block mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium">
        Add New Sale
      </Link>
    </div>
  );
}