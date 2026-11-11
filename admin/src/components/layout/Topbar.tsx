"use client";

import { usePathname, useRouter } from "next/navigation";
import { SignOut } from "@phosphor-icons/react";

import { BrandTile } from "@/components/layout/Logo";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { findNavItem } from "@/config/navigation";
import { useAdmin } from "@/store/AdminStore";

/** Sticky top bar: page eyebrow + title on the left; alerts, role, theme and sign-out on the right. */
export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useAdmin();
  const item = findNavItem(pathname);

  return (
    <header className="sticky top-0 z-30 -mx-2 -mt-3 mb-2 flex flex-wrap items-end justify-between gap-4 bg-bg/85 px-2.5 pt-3 pb-4 backdrop-blur-md sm:-mt-4 sm:pt-4">
      <div className="min-w-0">
        <span className="mb-3.5 inline-flex rounded-xl bg-rail px-2.5 py-1.5 lg:hidden">
          <BrandTile />
        </span>
        <div key={pathname} className="ve-rise">
          <p className="m-0 mb-1.5 text-[11.5px] font-semibold tracking-[0.12em] text-muted uppercase">{item?.eyebrow}</p>
          <h1 className="m-0 font-display text-[clamp(26px,3.2vw,38px)] leading-[1.05] font-semibold tracking-[-0.028em] text-balance">
            {item?.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <NotificationBell />
        <span className="hidden rounded-full bg-accent-soft px-3.5 py-2 text-xs font-semibold text-accent-text sm:inline-block">Admin</span>
        <ThemeToggle />
        <button
          type="button"
          onClick={() => {
            signOut();
            router.replace("/login");
          }}
          aria-label="Sign out"
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-semibold hover:bg-surface-2 sm:px-3.5"
        >
          <SignOut className="size-[18px]" aria-hidden />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </div>
    </header>
  );
}
