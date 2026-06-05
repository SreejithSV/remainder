import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import {
  addSale, calcEndDate, calcReminderDate, CATEGORIES, type WarrantyUnit,
} from "@/lib/warranty-data";

export const Route = createFileRoute("/add-sale")({
  head: () => ({ meta: [{ title: "Add New Sale — WarrantyPro" }] }),
  component: AddSale,
});

function AddSale() {
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const [form, setForm] = useState({
    customerName: "", phone: "", email: "",
    productName: "", brandName: "", category: "Electronics",
    serialNumber: "", purchasePrice: "",
    saleDate: today,
    warrantyDuration: "1",
    warrantyUnit: "years" as WarrantyUnit,
    notes: "",
  });

  const update = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const preview = useMemo(() => {
    const dur = Number(form.warrantyDuration);
    if (!form.saleDate || !dur || dur <= 0) return null;
    const end = calcEndDate(form.saleDate, dur, form.warrantyUnit);
    const reminder = calcReminderDate(end);
    return { end, reminder };
  }, [form.saleDate, form.warrantyDuration, form.warrantyUnit]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.phone || !form.productName) {
      toast.error("Please fill required fields");
      return;
    }
    addSale({
      customerName: form.customerName.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      productName: form.productName.trim(),
      brandName: form.brandName.trim(),
      category: form.category,
      serialNumber: form.serialNumber.trim(),
      purchasePrice: Number(form.purchasePrice) || 0,
      saleDate: new Date(form.saleDate).toISOString(),
      warrantyDuration: Number(form.warrantyDuration),
      warrantyUnit: form.warrantyUnit,
      notes: form.notes.trim(),
    });
    toast.success("Sale recorded successfully");
    navigate({ to: "/products" });
  };

  const inputCls = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-3xl">
      <form onSubmit={submit} className="bg-card border rounded-xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">New Sale Record</h2>
          <p className="text-sm text-muted-foreground">Fill the details to track this product's warranty.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Customer Name *">
            <input className={inputCls} value={form.customerName} onChange={(e) => update("customerName", e.target.value)} required />
          </Field>
          <Field label="Phone Number *">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">+91</span>
              <input className={`${inputCls} rounded-l-none`} value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))} required />
            </div>
          </Field>
          <Field label="Email">
            <input type="email" className={inputCls} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={form.category} onChange={(e) => update("category", e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Product Name *">
            <input className={inputCls} value={form.productName} onChange={(e) => update("productName", e.target.value)} required />
          </Field>
          <Field label="Brand Name">
            <input className={inputCls} value={form.brandName} onChange={(e) => update("brandName", e.target.value)} />
          </Field>
          <Field label="Serial Number">
            <input className={inputCls} value={form.serialNumber} onChange={(e) => update("serialNumber", e.target.value)} />
          </Field>
          <Field label="Purchase Price">
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">₹</span>
              <input type="number" min="0" className={`${inputCls} rounded-l-none`} value={form.purchasePrice} onChange={(e) => update("purchasePrice", e.target.value)} />
            </div>
          </Field>
          <Field label="Sale Date">
            <input type="date" className={inputCls} value={form.saleDate} onChange={(e) => update("saleDate", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-2">
            <Field label="Warranty Duration">
              <input type="number" min="1" className={inputCls} value={form.warrantyDuration} onChange={(e) => update("warrantyDuration", e.target.value)} />
            </Field>
            <Field label="Unit">
              <select className={inputCls} value={form.warrantyUnit} onChange={(e) => update("warrantyUnit", e.target.value as WarrantyUnit)}>
                <option value="days">Days</option>
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </Field>
          </div>
        </div>

        <Field label="Notes">
          <textarea rows={3} className={inputCls} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
        </Field>

        {preview && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-1 text-sm">
            <p className="font-medium text-primary">Warranty ends: {format(preview.end, "EEE, dd MMM yyyy")}</p>
            <p className="flex items-center gap-1.5 text-warning-foreground">
              <Bell className="h-4 w-4" /> Reminder will fire on: {format(preview.reminder, "EEE, dd MMM yyyy")}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-end pt-2">
          <button type="button" onClick={() => navigate({ to: "/" })} className="px-4 py-2 text-sm rounded-md border hover:bg-muted">Cancel</button>
          <button type="submit" className="px-5 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">
            Save Sale
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}