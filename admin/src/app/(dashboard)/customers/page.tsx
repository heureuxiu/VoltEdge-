import type { Metadata } from "next";

import { CustomersView } from "@/views/customers/CustomersView";

export const metadata: Metadata = { title: "Customers" };

export default function CustomersPage() {
  return <CustomersView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
