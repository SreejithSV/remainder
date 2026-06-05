import { useEffect, useState, useCallback } from "react";
import { getSales, getSettings, seedIfEmpty, type Sale, type Settings } from "@/lib/warranty-data";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(() => setSales(getSales()), []);

  useEffect(() => {
    seedIfEmpty();
    refresh();
    setReady(true);
    const onUpdate = () => refresh();
    window.addEventListener("warranty:update", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("warranty:update", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, [refresh]);

  return { sales, ready, refresh };
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({ shopName: "WarrantyPro", ownerPhone: "" });
  useEffect(() => {
    setSettings(getSettings());
    const cb = () => setSettings(getSettings());
    window.addEventListener("warranty:settings", cb);
    return () => window.removeEventListener("warranty:settings", cb);
  }, []);
  return settings;
}