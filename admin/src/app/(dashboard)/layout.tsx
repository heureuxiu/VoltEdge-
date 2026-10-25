import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full bg-surface font-sans text-ink">
      <AdminSidebar />
      <main className="min-w-0 flex-1 px-8 py-7 pb-12">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-5">{children}</div>
      </main>
    </div>
  );
}
