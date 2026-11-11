"use client";

import { usePathname } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";

function Gate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname?.startsWith("/checkout")) return null;
  return <>{children}</>;
}

/** Hides the storefront chrome (header, footer, chat button) on the distraction-free checkout. */
export function ChromeGate({ children }: { children: ReactNode }) {
  // usePathname() is runtime data; the chrome streams in once the path is known.
  return (
    <Suspense fallback={null}>
      <Gate>{children}</Gate>
    </Suspense>
  );
}
