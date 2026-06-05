import { MessageCircle } from "lucide-react";
import type { Sale } from "@/lib/warranty-data";
import { format } from "date-fns";
import { useSettings } from "@/hooks/use-sales";

export function WhatsAppButton({ sale, className = "" }: { sale: Sale; className?: string }) {
  const settings = useSettings();
  const msg = `Dear ${sale.customerName}, your ${sale.productName} warranty expires on ${format(
    new Date(sale.warrantyEndDate),
    "dd MMM yyyy",
  )}. Please contact us for renewal or service. - ${settings.shopName || "WarrantyPro"}`;
  const url = `https://wa.me/91${sale.phone}?text=${encodeURIComponent(msg)}`;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-success text-success-foreground text-xs font-medium hover:opacity-90 transition-opacity ${className}`}
    >
      <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
    </a>
  );
}