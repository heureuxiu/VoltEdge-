import type { OrderStatus } from "@/types/admin";

/** Static option lists used by filters. Live records come from the API (see `store/AdminStore.tsx`). */
export const adminProductCategories = ["All", "iPhone", "Samsung", "Gadgets"] as const;

export type OrderStatusFilter = "All" | OrderStatus;

export const adminOrderStatuses: OrderStatusFilter[] = ["All", "Pending payment", "Packed", "In transit", "Delivered", "Cancelled"];
