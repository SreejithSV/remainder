import { getStatus, daysRemaining, type Sale } from "@/lib/warranty-data";
import { cn } from "@/lib/utils";

export function StatusBadge({ sale, className }: { sale: Sale; className?: string }) {
  const status = getStatus(sale);
  const days = daysRemaining(sale);
  const config = {
    active: { label: "Active", cls: "bg-success/15 text-success border-success/30", dot: "bg-success" },
    expiring_soon: { label: `Expiring in ${days}d`, cls: "bg-warning/20 text-warning-foreground border-warning/40", dot: "bg-warning" },
    expired: { label: `Expired ${Math.abs(days)}d ago`, cls: "bg-destructive/15 text-destructive border-destructive/30", dot: "bg-destructive" },
  }[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-medium", config.cls, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}