import type { ReactNode } from "react";

import { AdminShell } from "@/components/layout/AdminShell";

/**
 * The shell shows a splash screen until the saved admin session is read in the browser, so pages
 * under it can't be validated for instant navigation. Opt this segment out of that check.
 */
export const instant = false;

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
