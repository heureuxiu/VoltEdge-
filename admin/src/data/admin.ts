import type {
  AdminOrder,
  AdminProductRow,
  AdminRepair,
  AdminTradeIn,
} from "@/types/admin";

/* ------------------------------------------------------------------ */
/*  Inventory — mirrors the real storefront catalogue (VoltEdge client  */
/*  app) with admin-only price & stock figures layered on top.         */
/* ------------------------------------------------------------------ */

export const adminProducts: AdminProductRow[] = [
  { id: "iphone-17-pro-max", name: "iPhone 17 Pro Max", spec: "256GB · New", category: "iPhone", price: 34999, stock: 14, tint: "bg-brand-soft" },
  { id: "iphone-17", name: "iPhone 17", spec: "128GB · New", category: "iPhone", price: 24999, stock: 21, tint: "bg-[#f1f3f6]" },
  { id: "iphone-15-pro", name: "iPhone 15 Pro", spec: "128GB · Pre-owned", category: "iPhone", price: 18499, stock: 2, tint: "bg-repair-soft" },
  { id: "galaxy-s25-ultra", name: "Galaxy S25 Ultra", spec: "256GB · New", category: "Samsung", price: 29999, stock: 9, tint: "bg-[#e9f7ef]" },
  { id: "galaxy-s25", name: "Galaxy S25", spec: "128GB · New", category: "Samsung", price: 19999, stock: 17, tint: "bg-[#f1f3f6]" },
  { id: "galaxy-a36", name: "Galaxy A36", spec: "128GB · New", category: "Samsung", price: 8499, stock: 31, tint: "bg-lime-soft" },
  { id: "airpods-pro-3", name: "AirPods Pro 3", spec: "USB-C · ANC", category: "Gadgets", price: 5499, stock: 5, tint: "bg-[#efe9ff]" },
  { id: "macbook-air", name: 'MacBook Air 13"', spec: "M4 · 256GB", category: "Gadgets", price: 24999, stock: 0, tint: "bg-brand-soft" },
];

export const adminProductCategories = ["All", "iPhone", "Samsung", "Gadgets"] as const;

/* ------------------------------------------------------------------ */
/*  Orders                                                              */
/* ------------------------------------------------------------------ */

export const adminOrders: AdminOrder[] = [
  { id: "VE-10482", customer: "Thabo N.", item: "iPhone 17 Pro Max ×1", date: "23 Oct", total: 34999, status: "Delivered" },
  { id: "VE-10481", customer: "Aisha K.", item: "AirPods Pro 3 ×1", date: "23 Oct", total: 5499, status: "Packed" },
  { id: "VE-10480", customer: "Lerato M.", item: "Galaxy S25 Ultra ×1", date: "22 Oct", total: 29999, status: "In transit" },
  { id: "VE-10479", customer: "Juan P.", item: 'MacBook Air 13" ×1', date: "22 Oct", total: 24999, status: "Pending payment" },
  { id: "VE-10478", customer: "Naledi S.", item: "iPhone 15 Pro ×1", date: "21 Oct", total: 18499, status: "Cancelled" },
  { id: "VE-10477", customer: "Kyle B.", item: "Galaxy A36 ×2", date: "21 Oct", total: 16998, status: "Delivered" },
  { id: "VE-10476", customer: "Zanele P.", item: "iPhone 17 ×1", date: "20 Oct", total: 24999, status: "In transit" },
  { id: "VE-10475", customer: "Michael O.", item: "AirPods Pro 3 ×1", date: "20 Oct", total: 5499, status: "Delivered" },
];

export type OrderStatusFilter = "All" | AdminOrder["status"];

export const adminOrderStatuses: OrderStatusFilter[] = [
  "All",
  "Pending payment",
  "Packed",
  "In transit",
  "Delivered",
  "Cancelled",
];

export const orderStatusStyles: Record<AdminOrder["status"], string> = {
  Delivered: "bg-[#DCFCE7] text-[#15803D]",
  Packed: "bg-brand-soft text-brand",
  "In transit": "bg-[#FEF3C7] text-[#B45309]",
  "Pending payment": "bg-[#FEF3C7] text-[#B45309]",
  Cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};

export const totalOrdersAllTime = 128;
export const ordersNeedingAttention = adminOrders.filter(
  (o) => o.status === "Pending payment",
).length;

/* ------------------------------------------------------------------ */
/*  Repairs                                                             */
/* ------------------------------------------------------------------ */

export const adminRepairs: AdminRepair[] = [
  { id: "RP-3391", customer: "Thabo N.", device: "iPhone 15 Pro", issue: "Screen replacement", when: "Today, 2pm", quote: 1899, status: "In progress" },
  { id: "RP-3390", customer: "Aisha K.", device: "Galaxy S24", issue: "Battery swap", when: "Today, 4pm", quote: 899, status: "Diagnosing" },
  { id: "RP-3389", customer: "Lerato M.", device: "MacBook Air", issue: "Keyboard repair", when: "Tomorrow, 10am", quote: 2499, status: "Waiting on part" },
  { id: "RP-3388", customer: "Juan P.", device: "iPhone 13", issue: "Back glass", when: "Yesterday", quote: 1299, status: "Ready to collect" },
  { id: "RP-3387", customer: "Naledi S.", device: "iPad Air", issue: "Charging port", when: "Yesterday", quote: 749, status: "Ready to collect" },
  { id: "RP-3386", customer: "Kyle B.", device: "Galaxy S23", issue: "Cracked screen", when: "2 days ago", quote: 1599, status: "Quality check" },
];

export const repairStatusStyles: Record<AdminRepair["status"], string> = {
  "In progress": "bg-[#FEF3C7] text-[#B45309]",
  Diagnosing: "bg-brand-soft text-brand",
  "Waiting on part": "bg-[#FEE2E2] text-[#DC2626]",
  "Ready to collect": "bg-[#DCFCE7] text-[#15803D]",
  "Quality check": "bg-brand-soft text-brand",
};

export const repairQueueStats = [
  { label: "In queue today", value: 7 },
  { label: "Overdue", value: 2 },
  { label: "Waiting on parts", value: 3 },
  { label: "Ready to collect", value: 4 },
];

/* ------------------------------------------------------------------ */
/*  Trade-ins                                                           */
/* ------------------------------------------------------------------ */

export const adminTradeIns: AdminTradeIn[] = [
  { id: "TI-2210", customer: "Zanele P.", device: "iPhone 14 · 128GB", grade: "A", creditMin: 9500, creditMax: 10800, status: "Awaiting check-in" },
  { id: "TI-2209", customer: "Michael O.", device: "iPhone 13 · 256GB", grade: "B", creditMin: 6200, creditMax: 7100, status: "Checked — credit issued" },
  { id: "TI-2208", customer: "Fatima R.", device: "Galaxy S23 · 128GB", grade: "A", creditMin: 5800, creditMax: 6600, status: "Awaiting check-in" },
  { id: "TI-2207", customer: "Sipho D.", device: "iPhone 12 · 64GB", grade: "C", creditMin: 2400, creditMax: 2900, status: "Declined — device faulty" },
  { id: "TI-2206", customer: "Grace M.", device: "iPhone 14 Pro · 256GB", grade: "A", creditMin: 11200, creditMax: 12600, status: "Checked — credit issued" },
];

export const tradeInStatusStyles: Record<AdminTradeIn["status"], string> = {
  "Awaiting check-in": "bg-[#FEF3C7] text-[#B45309]",
  "Checked — credit issued": "bg-[#DCFCE7] text-[#15803D]",
  "Declined — device faulty": "bg-[#FEE2E2] text-[#DC2626]",
};

export const tradeInGradeStats: { grade: "A" | "B" | "C"; count: number; label: string; tint: string; color: string }[] = [
  { grade: "A", count: 9, label: "Grade A — like new", tint: "bg-lime-soft", color: "text-lime-dark" },
  { grade: "B", count: 5, label: "Grade B — light marks", tint: "bg-brand-soft", color: "text-brand" },
  { grade: "C", count: 2, label: "Grade C — heavy wear", tint: "bg-[#FEF3C7]", color: "text-[#B45309]" },
];

/* ------------------------------------------------------------------ */
/*  Dashboard                                                           */
/* ------------------------------------------------------------------ */

export const dashboardStats = {
  revenueToday: 142850,
  ordersToday: 23,
  repairsInQueue: 7,
  tradeInRequests: 6,
};

export const lowStockProducts = adminProducts
  .filter((p) => p.stock > 0 && p.stock <= 5)
  .sort((a, b) => a.stock - b.stock);

export const salesThisWeek = [
  { day: "Mon", amount: 18400 },
  { day: "Tue", amount: 23900 },
  { day: "Wed", amount: 12800 },
  { day: "Thu", amount: 28100 },
  { day: "Fri", amount: 31500 },
  { day: "Sat", amount: 34200 },
  { day: "Sun", amount: 19700 },
];

export const salesThisWeekTotal = salesThisWeek.reduce((sum, d) => sum + d.amount, 0);

/* ------------------------------------------------------------------ */
/*  Formatting                                                          */
/* ------------------------------------------------------------------ */

export function formatZar(amount: number) {
  return `R${amount.toLocaleString("en-ZA")}`;
}
