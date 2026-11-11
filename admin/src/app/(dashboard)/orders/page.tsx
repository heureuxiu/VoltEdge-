import type { Metadata } from "next";

import { OrdersView } from "@/views/orders/OrdersView";

export const metadata: Metadata = { title: "Orders" };

export default function OrdersPage() {
  return <OrdersView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
