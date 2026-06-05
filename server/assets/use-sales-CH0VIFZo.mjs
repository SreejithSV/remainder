import { useState, useCallback, useEffect } from "react";
import { a as getSales, i as seedIfEmpty, g as getSettings } from "./warranty-data-xSwjLSd3.mjs";
function useSales() {
  const [sales, setSales] = useState([]);
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
function useSettings() {
  const [settings, setSettings] = useState({ shopName: "WarrantyPro", ownerPhone: "" });
  useEffect(() => {
    setSettings(getSettings());
    const cb = () => setSettings(getSettings());
    window.addEventListener("warranty:settings", cb);
    return () => window.removeEventListener("warranty:settings", cb);
  }, []);
  return settings;
}
export {
  useSettings as a,
  useSales as u
};
