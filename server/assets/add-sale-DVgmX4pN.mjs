import { jsx, jsxs } from "react/jsx-runtime";
import { useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { e as calcEndDate, f as calcReminderDate, C as CATEGORIES, h as addSale } from "./warranty-data-xSwjLSd3.mjs";
function AddSale() {
  const navigate = useNavigate();
  const today = format(/* @__PURE__ */ new Date(), "yyyy-MM-dd");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    productName: "",
    brandName: "",
    category: "Electronics",
    serialNumber: "",
    purchasePrice: "",
    saleDate: today,
    warrantyDuration: "1",
    warrantyUnit: "years",
    notes: ""
  });
  const update = (k, v) => setForm((f) => ({
    ...f,
    [k]: v
  }));
  const preview = useMemo(() => {
    const dur = Number(form.warrantyDuration);
    if (!form.saleDate || !dur || dur <= 0) return null;
    const end = calcEndDate(form.saleDate, dur, form.warrantyUnit);
    const reminder = calcReminderDate(end);
    return {
      end,
      reminder
    };
  }, [form.saleDate, form.warrantyDuration, form.warrantyUnit]);
  const submit = (e) => {
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
      notes: form.notes.trim()
    });
    toast.success("Sale recorded successfully");
    navigate({
      to: "/products"
    });
  };
  const inputCls = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return /* @__PURE__ */ jsx("div", { className: "max-w-3xl", children: /* @__PURE__ */ jsxs("form", { onSubmit: submit, className: "bg-card border rounded-xl p-6 space-y-5", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold", children: "New Sale Record" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Fill the details to track this product's warranty." })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
      /* @__PURE__ */ jsx(Field, { label: "Customer Name *", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: form.customerName, onChange: (e) => update("customerName", e.target.value), required: true }) }),
      /* @__PURE__ */ jsx(Field, { label: "Phone Number *", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm", children: "+91" }),
        /* @__PURE__ */ jsx("input", { className: `${inputCls} rounded-l-none`, value: form.phone, onChange: (e) => update("phone", e.target.value.replace(/\D/g, "")), required: true })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Email", children: /* @__PURE__ */ jsx("input", { type: "email", className: inputCls, value: form.email, onChange: (e) => update("email", e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Category", children: /* @__PURE__ */ jsx("select", { className: inputCls, value: form.category, onChange: (e) => update("category", e.target.value), children: CATEGORIES.map((c) => /* @__PURE__ */ jsx("option", { children: c }, c)) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Product Name *", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: form.productName, onChange: (e) => update("productName", e.target.value), required: true }) }),
      /* @__PURE__ */ jsx(Field, { label: "Brand Name", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: form.brandName, onChange: (e) => update("brandName", e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Serial Number", children: /* @__PURE__ */ jsx("input", { className: inputCls, value: form.serialNumber, onChange: (e) => update("serialNumber", e.target.value) }) }),
      /* @__PURE__ */ jsx(Field, { label: "Purchase Price", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm", children: "₹" }),
        /* @__PURE__ */ jsx("input", { type: "number", min: "0", className: `${inputCls} rounded-l-none`, value: form.purchasePrice, onChange: (e) => update("purchasePrice", e.target.value) })
      ] }) }),
      /* @__PURE__ */ jsx(Field, { label: "Sale Date", children: /* @__PURE__ */ jsx("input", { type: "date", className: inputCls, value: form.saleDate, onChange: (e) => update("saleDate", e.target.value) }) }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-2", children: [
        /* @__PURE__ */ jsx(Field, { label: "Warranty Duration", children: /* @__PURE__ */ jsx("input", { type: "number", min: "1", className: inputCls, value: form.warrantyDuration, onChange: (e) => update("warrantyDuration", e.target.value) }) }),
        /* @__PURE__ */ jsx(Field, { label: "Unit", children: /* @__PURE__ */ jsxs("select", { className: inputCls, value: form.warrantyUnit, onChange: (e) => update("warrantyUnit", e.target.value), children: [
          /* @__PURE__ */ jsx("option", { value: "days", children: "Days" }),
          /* @__PURE__ */ jsx("option", { value: "months", children: "Months" }),
          /* @__PURE__ */ jsx("option", { value: "years", children: "Years" })
        ] }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx(Field, { label: "Notes", children: /* @__PURE__ */ jsx("textarea", { rows: 3, className: inputCls, value: form.notes, onChange: (e) => update("notes", e.target.value) }) }),
    preview && /* @__PURE__ */ jsxs("div", { className: "rounded-lg bg-primary/5 border border-primary/20 p-4 space-y-1 text-sm", children: [
      /* @__PURE__ */ jsxs("p", { className: "font-medium text-primary", children: [
        "Warranty ends: ",
        format(preview.end, "EEE, dd MMM yyyy")
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "flex items-center gap-1.5 text-warning-foreground", children: [
        /* @__PURE__ */ jsx(Bell, { className: "h-4 w-4" }),
        " Reminder will fire on: ",
        format(preview.reminder, "EEE, dd MMM yyyy")
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex gap-3 justify-end pt-2", children: [
      /* @__PURE__ */ jsx("button", { type: "button", onClick: () => navigate({
        to: "/"
      }), className: "px-4 py-2 text-sm rounded-md border hover:bg-muted", children: "Cancel" }),
      /* @__PURE__ */ jsx("button", { type: "submit", className: "px-5 py-2 text-sm rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity", children: "Save Sale" })
    ] })
  ] }) });
}
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsx("span", { className: "text-sm font-medium text-foreground mb-1.5 block", children: label }),
    children
  ] });
}
export {
  AddSale as component
};
