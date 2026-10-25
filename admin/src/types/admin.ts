export type OrderStatus =
  | "Pending payment"
  | "Packed"
  | "In transit"
  | "Delivered"
  | "Cancelled";

export interface AdminOrder {
  id: string;
  customer: string;
  item: string;
  date: string;
  total: number;
  status: OrderStatus;
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
  device: string;
  issue: string;
  when: string;
  quote: number;
  status: RepairStatus;
}

export type TradeInGrade = "A" | "B" | "C";
export type TradeInStatus =
  | "Awaiting check-in"
  | "Checked — credit issued"
  | "Declined — device faulty";

export interface AdminTradeIn {
  id: string;
  customer: string;
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
  category: string;
  price: number;
  stock: number;
  tint: string;
}
