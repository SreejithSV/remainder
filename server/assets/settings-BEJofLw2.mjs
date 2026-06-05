import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Store, Sun, Moon } from "lucide-react";
import { g as getSettings, s as saveSettings } from "./warranty-data-xSwjLSd3.mjs";
import "date-fns";
function SettingsPage() {
  const [shopName, setShopName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const s = getSettings();
    setShopName(s.shopName);
    setOwnerPhone(s.ownerPhone);
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("warrantyAppTheme", next ? "dark" : "light");
  };
  const save = () => {
    saveSettings({
      shopName: shopName.trim() || "WarrantyPro",
      ownerPhone: ownerPhone.trim()
    });
    toast.success("Settings saved");
  };
  const inputCls = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";
  return /* @__PURE__ */ jsxs("div", { className: "max-w-xl space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsx(Store, { className: "h-5 w-5 text-primary" }),
        /* @__PURE__ */ jsx("h2", { className: "font-semibold", children: "Shop Details" })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium mb-1.5 block", children: "Shop Name" }),
        /* @__PURE__ */ jsx("input", { className: inputCls, value: shopName, onChange: (e) => setShopName(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("label", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm font-medium mb-1.5 block", children: "Owner Phone" }),
        /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsx("span", { className: "inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm", children: "+91" }),
          /* @__PURE__ */ jsx("input", { className: `${inputCls} rounded-l-none`, value: ownerPhone, onChange: (e) => setOwnerPhone(e.target.value.replace(/\D/g, "")) })
        ] })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: save, className: "px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90", children: "Save Settings" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "bg-card border rounded-xl p-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "font-semibold", children: "Appearance" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Toggle dark mode" })
      ] }),
      /* @__PURE__ */ jsxs("button", { onClick: toggleDark, className: "inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-card hover:bg-muted text-sm", children: [
        dark ? /* @__PURE__ */ jsx(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ jsx(Moon, { className: "h-4 w-4" }),
        dark ? "Light mode" : "Dark mode"
      ] })
    ] })
  ] });
}
export {
  SettingsPage as component
};
