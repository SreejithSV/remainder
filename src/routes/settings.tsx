import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Moon, Sun, Store } from "lucide-react";
import { getSettings, saveSettings } from "@/lib/warranty-data";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — WarrantyPro" }] }),
  component: SettingsPage,
});

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
    saveSettings({ shopName: shopName.trim() || "WarrantyPro", ownerPhone: ownerPhone.trim() });
    toast.success("Settings saved");
  };

  const inputCls = "w-full rounded-md border border-input bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="max-w-xl space-y-6">
      <div className="bg-card border rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Store className="h-5 w-5 text-primary" />
          <h2 className="font-semibold">Shop Details</h2>
        </div>
        <label className="block">
          <span className="text-sm font-medium mb-1.5 block">Shop Name</span>
          <input className={inputCls} value={shopName} onChange={(e) => setShopName(e.target.value)} />
        </label>
        <label className="block">
          <span className="text-sm font-medium mb-1.5 block">Owner Phone</span>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-sm">+91</span>
            <input className={`${inputCls} rounded-l-none`} value={ownerPhone} onChange={(e) => setOwnerPhone(e.target.value.replace(/\D/g, ""))} />
          </div>
        </label>
        <button onClick={save} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
          Save Settings
        </button>
      </div>

      <div className="bg-card border rounded-xl p-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Appearance</h2>
          <p className="text-sm text-muted-foreground">Toggle dark mode</p>
        </div>
        <button
          onClick={toggleDark}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-md border bg-card hover:bg-muted text-sm"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {dark ? "Light mode" : "Dark mode"}
        </button>
      </div>
    </div>
  );
}