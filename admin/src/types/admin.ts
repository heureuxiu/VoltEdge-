export type OrderStatus =
  | "Pending payment"
  | "Packed"
  | "In transit"
  | "Delivered"
  | "Cancelled";

export interface AdminOrderItem {
  productId: string;
  name: string;
  variant: string;
  image: string;
  qty: number;
  unitPrice: number;
}

export interface AdminOrder {
  id: string;
  customer: string;
  email: string;
  phone: string;
  /** Short summary such as "iPhone 17 ×1, AirPods Pro 3 ×1". */
  item: string;
  items: AdminOrderItem[];
  /** ISO timestamp the order was placed. */
  date: string;
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  delivery: "ship" | "pickup";
  shippingMethod: "standard" | "express" | "pickup";
  address?: { line1: string; line2: string; city: string; province: string; postal: string; country: string };
  payment: "card" | "payflex" | "eft";
  notes: string;
}

export type RepairStatus =
  | "Diagnosing"
  | "In progress"
  | "Waiting on part"
  | "Quality check"
  | "Ready to collect";

export interface AdminRepair {
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  device: string;
  issue: string;
  when: string;
  quote: number;
  status: RepairStatus;
  method?: string;
  notes?: string;
  source?: "website" | "admin";
}

export type TradeInGrade = "A" | "B" | "C";
export type TradeInStatus =
  | "Awaiting check-in"
  | "Checked — credit issued"
  | "Declined — device faulty";

export interface AdminTradeIn {
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  device: string;
  grade: TradeInGrade;
  creditMin: number;
  creditMax: number;
  status: TradeInStatus;
}

export interface AdminProductRow {
  id: string;
  name: string;
  spec: string;
  /** Display label: iPhone, Samsung or Gadgets. */
  category: string;
  price: number;
  stock: number;
  tint: string;
  active?: boolean;
  image?: string;
  compareAtPrice?: number | null;
}

export interface AdminCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  /** ISO timestamp of the first order / request. */
  joined: string;
}

export type ActivityKind = "order" | "product" | "repair" | "trade-in" | "settings" | "auth" | "message";

export interface ActivityEntry {
  id: string;
  at: string; // ISO date
  text: string;
  kind: ActivityKind;
  actor?: string;
}

export interface AdminMessage {
  id: string;
  at: string;
  topic: string;
  name: string;
  contact: string;
  message: string;
  handled: boolean;
}

export interface StoreSettings {
  storeName: string;
  supportEmail: string;
  whatsapp: string;
  lowStockThreshold: number;
  standardShipping: number;
  expressShipping: number;
  notifyNewOrder: boolean;
  notifyLowStock: boolean;
  notifyRepairReady: boolean;
}
