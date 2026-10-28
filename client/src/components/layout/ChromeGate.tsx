"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Hides the storefront chrome (header, footer, chat button) on the distraction-free checkout. */
export function ChromeGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/checkout")) return null;
  return <>{children}</>;
}
