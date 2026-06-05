import { differenceInDays, addDays, addMonths, addYears } from "date-fns";
const DATA_KEY = "warrantyAppData";
const SETTINGS_KEY = "warrantyAppSettings";
const CATEGORIES = ["Electronics", "Tools", "Appliances", "Furniture", "Other"];
function calcEndDate(saleDate, duration, unit) {
  const d = typeof saleDate === "string" ? new Date(saleDate) : saleDate;
  if (unit === "days") return addDays(d, duration);
  if (unit === "months") return addMonths(d, duration);
  return addYears(d, duration);
}
function calcReminderDate(endDate) {
  return addDays(endDate, -6);
}
function getStatus(sale, now = /* @__PURE__ */ new Date()) {
  const end = new Date(sale.warrantyEndDate);
  const reminder = new Date(sale.reminderDate);
  if (now > end) return "expired";
  if (now >= reminder) return "expiring_soon";
  return "active";
}
function daysRemaining(sale, now = /* @__PURE__ */ new Date()) {
  return differenceInDays(new Date(sale.warrantyEndDate), now);
}
function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(DATA_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function write(sales) {
  localStorage.setItem(DATA_KEY, JSON.stringify(sales));
  window.dispatchEvent(new Event("warranty:update"));
}
function getSales() {
  return read();
}
function addSale(input) {
  const end = calcEndDate(input.saleDate, input.warrantyDuration, input.warrantyUnit);
  const reminder = calcReminderDate(end);
  const sale = {
    ...input,
    id: crypto.randomUUID(),
    warrantyEndDate: end.toISOString(),
    reminderDate: reminder.toISOString(),
    notified: false,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  const sales = read();
  sales.push(sale);
  write(sales);
  return sale;
}
function updateSale(id, patch) {
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
function deleteSale(id) {
  write(read().filter((s) => s.id !== id));
}
function markNotified(id, notified = true) {
  updateSale(id, { notified });
}
function getSettings() {
  if (typeof window === "undefined") return { shopName: "WarrantyPro", ownerPhone: "" };
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
  }
  return { shopName: "WarrantyPro", ownerPhone: "" };
}
function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("warranty:settings"));
}
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(DATA_KEY)) return;
  const now = /* @__PURE__ */ new Date();
  const mk = (saleOffset, duration, unit, data) => {
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
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      ...data
    };
  };
  const seed = [
    // Active
    mk(-30, 2, "years", {
      customerName: "Rahul Sharma",
      phone: "9876543210",
      email: "rahul@example.com",
      productName: 'Smart LED TV 55"',
      brandName: "Samsung",
      category: "Electronics",
      serialNumber: "SN-TV-001",
      purchasePrice: 65e3,
      notes: "Wall mounted"
    }),
    mk(-60, 1, "years", {
      customerName: "Priya Patel",
      phone: "9123456780",
      email: "priya@example.com",
      productName: "Microwave Oven",
      brandName: "LG",
      category: "Appliances",
      serialNumber: "SN-MW-552",
      purchasePrice: 12500
    }),
    // Expiring soon (within 6 days)
    mk(-359, 1, "years", {
      customerName: "Amit Verma",
      phone: "9988776655",
      email: "",
      productName: "Cordless Drill",
      brandName: "Bosch",
      category: "Tools",
      serialNumber: "SN-DR-220",
      purchasePrice: 7800
    }),
    mk(-178, 6, "months", {
      customerName: "Neha Singh",
      phone: "9001122334",
      email: "neha@example.com",
      productName: "Office Chair Pro",
      brandName: "Featherlite",
      category: "Furniture",
      serialNumber: "",
      purchasePrice: 14500,
      notes: "Lumbar support model"
    }),
    // Expired
    mk(-400, 1, "years", {
      customerName: "Vikram Rao",
      phone: "9876501234",
      email: "",
      productName: "Washing Machine",
      brandName: "Whirlpool",
      category: "Appliances",
      serialNumber: "SN-WM-771",
      purchasePrice: 28e3
    }),
    mk(-90, 30, "days", {
      customerName: "Sneha Iyer",
      phone: "9456712389",
      email: "sneha@example.com",
      productName: "Bluetooth Speaker",
      brandName: "JBL",
      category: "Electronics",
      serialNumber: "SN-BT-019",
      purchasePrice: 4500
    })
  ];
  localStorage.setItem(DATA_KEY, JSON.stringify(seed));
}
export {
  CATEGORIES as C,
  getSales as a,
  getStatus as b,
  deleteSale as c,
  daysRemaining as d,
  calcEndDate as e,
  calcReminderDate as f,
  getSettings as g,
  addSale as h,
  seedIfEmpty as i,
  markNotified as m,
  saveSettings as s
};
