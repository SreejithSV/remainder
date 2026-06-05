import { addDays, addMonths, addYears, differenceInDays } from "date-fns";

export type WarrantyUnit = "days" | "months" | "years";

export interface Sale {
  id: string;
  customerName: string;
  phone: string;
  email: string;
  productName: string;
  brandName: string;
  category: string;
  serialNumber: string;
  purchasePrice: number;
  saleDate: string;
  warrantyDuration: number;
  warrantyUnit: WarrantyUnit;
  warrantyEndDate: string;
  reminderDate: string;
  notes: string;
  notified: boolean;
  createdAt: string;
}

export interface Settings {
  shopName: string;
  ownerPhone: string;
}

const DATA_KEY = "warrantyAppData";
const SETTINGS_KEY = "warrantyAppSettings";

export const CATEGORIES = ["Electronics", "Tools", "Appliances", "Furniture", "Other"];

export function calcEndDate(saleDate: string | Date, duration: number, unit: WarrantyUnit): Date {
  const d = typeof saleDate === "string" ? new Date(saleDate) : saleDate;
  if (unit === "days") return addDays(d, duration);
  if (unit === "months") return addMonths(d, duration);
  return addYears(d, duration);
}

export function calcReminderDate(endDate: Date): Date {
  return addDays(endDate, -6);
}

export type Status = "active" | "expiring_soon" | "expired";

export function getStatus(sale: Sale, now = new Date()): Status {
  const end = new Date(sale.warrantyEndDate);
  const reminder = new Date(sale.reminderDate);
  if (now > end) return "expired";
  if (now >= reminder) return "expiring_soon";
  return "active";
}

export function daysRemaining(sale: Sale, now = new Date()): number {
  return differenceInDays(new Date(sale.warrantyEndDate), now);
}

function read(): Sale[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function write(sales: Sale[]) {
  localStorage.setItem(DATA_KEY, JSON.stringify(sales));
  window.dispatchEvent(new Event("warranty:update"));
}

export function getSales(): Sale[] {
  return read();
}

export function addSale(input: Omit<Sale, "id" | "warrantyEndDate" | "reminderDate" | "notified" | "createdAt">): Sale {
  const end = calcEndDate(input.saleDate, input.warrantyDuration, input.warrantyUnit);
  const reminder = calcReminderDate(end);
  const sale: Sale = {
    ...input,
    id: crypto.randomUUID(),
    warrantyEndDate: end.toISOString(),
    reminderDate: reminder.toISOString(),
    notified: false,
    createdAt: new Date().toISOString(),
  };
  const sales = read();
  sales.push(sale);
  write(sales);
  return sale;
}

export function updateSale(id: string, patch: Partial<Sale>) {
  const sales = read().map((s) => {
    if (s.id !== id) return s;
    const merged = { ...s, ...patch };
    if (patch.saleDate || patch.warrantyDuration || patch.warrantyUnit) {
      const end = calcEndDate(merged.saleDate, merged.warrantyDuration, merged.warrantyUnit);
      merged.warrantyEndDate = end.toISOString();
      merged.reminderDate = calcReminderDate(end).toISOString();
    }
    return merged;
  });
  write(sales);
}

export function deleteSale(id: string) {
  write(read().filter((s) => s.id !== id));
}

export function markNotified(id: string, notified = true) {
  updateSale(id, { notified });
}

export function getSettings(): Settings {
  if (typeof window === "undefined") return { shopName: "WarrantyPro", ownerPhone: "" };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { shopName: "WarrantyPro", ownerPhone: "" };
}

export function saveSettings(s: Settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("warranty:settings"));
}

export function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(DATA_KEY)) return;
  const now = new Date();
  const mk = (
    saleOffset: number,
    duration: number,
    unit: WarrantyUnit,
    data: Partial<Sale>,
  ): Sale => {
    const saleDate = addDays(now, saleOffset);
    const end = calcEndDate(saleDate, duration, unit);
    return {
      id: crypto.randomUUID(),
      customerName: "",
      phone: "",
      email: "",
      productName: "",
      brandName: "",
      category: "Electronics",
      serialNumber: "",
      purchasePrice: 0,
      saleDate: saleDate.toISOString(),
      warrantyDuration: duration,
      warrantyUnit: unit,
      warrantyEndDate: end.toISOString(),
      reminderDate: calcReminderDate(end).toISOString(),
      notes: "",
      notified: false,
      createdAt: new Date().toISOString(),
      ...data,
    };
  };
  const seed: Sale[] = [
    // Active
    mk(-30, 2, "years", {
      customerName: "Rahul Sharma", phone: "9876543210", email: "rahul@example.com",
      productName: "Smart LED TV 55\"", brandName: "Samsung", category: "Electronics",
      serialNumber: "SN-TV-001", purchasePrice: 65000, notes: "Wall mounted",
    }),
    mk(-60, 1, "years", {
      customerName: "Priya Patel", phone: "9123456780", email: "priya@example.com",
      productName: "Microwave Oven", brandName: "LG", category: "Appliances",
      serialNumber: "SN-MW-552", purchasePrice: 12500,
    }),
    // Expiring soon (within 6 days)
    mk(-359, 1, "years", {
      customerName: "Amit Verma", phone: "9988776655", email: "",
      productName: "Cordless Drill", brandName: "Bosch", category: "Tools",
      serialNumber: "SN-DR-220", purchasePrice: 7800,
    }),
    mk(-178, 6, "months", {
      customerName: "Neha Singh", phone: "9001122334", email: "neha@example.com",
      productName: "Office Chair Pro", brandName: "Featherlite", category: "Furniture",
      serialNumber: "", purchasePrice: 14500, notes: "Lumbar support model",
    }),
    // Expired
    mk(-400, 1, "years", {
      customerName: "Vikram Rao", phone: "9876501234", email: "",
      productName: "Washing Machine", brandName: "Whirlpool", category: "Appliances",
      serialNumber: "SN-WM-771", purchasePrice: 28000,
    }),
    mk(-90, 30, "days", {
      customerName: "Sneha Iyer", phone: "9456712389", email: "sneha@example.com",
      productName: "Bluetooth Speaker", brandName: "JBL", category: "Electronics",
      serialNumber: "SN-BT-019", purchasePrice: 4500,
    }),
  ];
  localStorage.setItem(DATA_KEY, JSON.stringify(seed));
}

export function useSalesSubscription(cb: () => void) {
  // helper used by hook
  if (typeof window === "undefined") return () => {};
  window.addEventListener("warranty:update", cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener("warranty:update", cb);
    window.removeEventListener("storage", cb);
  };
}