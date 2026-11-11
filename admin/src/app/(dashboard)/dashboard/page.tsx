import type { Metadata } from "next";

import { DashboardView } from "@/views/dashboard/DashboardView";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return <DashboardView />;
}

/** This page sits behind the client-side session gate in AdminShell, so skip the instant-navigation check. */
export const instant = false;
