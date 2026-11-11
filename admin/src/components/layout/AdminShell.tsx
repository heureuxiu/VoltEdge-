"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { SplashScreen } from "@/components/ui/SplashScreen";
import { useAdmin } from "@/store/AdminStore";

/** Authenticated frame: guards the route, then renders the rail, top bar, page and mobile tab bar. */
export function AdminShell({ children }: { children: ReactNode }) {
  const { hydrated, session } = useAdmin();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && !session) router.replace("/login");
  }, [hydrated, session, router]);

  if (!hydrated || !session) return <SplashScreen />;

  return (
    <div className="min-h-dvh p-3 sm:p-4">
      <div className="grid w-full items-start gap-5 lg:grid-cols-[244px_minmax(0,1fr)]">
        <Sidebar />
        <main className="min-w-0 pb-24 lg:pb-4">
          <Topbar />
          {children}
        </main>
      </div>
      <MobileTabBar />
    </div>
  );
}
