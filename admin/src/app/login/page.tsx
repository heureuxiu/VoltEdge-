import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LogoMark } from "@/components/admin/LogoMark";
import { adminSite } from "@/data/site";

export const metadata: Metadata = {
  title: "Admin sign in",
};

export default function AdminLoginPage() {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-surface px-6 py-12">
      <div
        aria-hidden
        className="absolute -top-56 -right-40 size-[560px] rounded-full bg-brand opacity-[0.08] blur-[100px]"
      />
      <div
        aria-hidden
        className="absolute -bottom-52 -left-36 size-[480px] rounded-full bg-accent opacity-[0.16] blur-[100px]"
      />

      <div className="relative flex w-full max-w-[420px] flex-col items-center gap-7 text-center">
        <a href={adminSite.storeUrl} aria-label={`${adminSite.name} home`} className="flex items-center gap-3 text-ink">
          <LogoMark className="h-[30px]" />
          <span className="font-logo text-[24px] font-extrabold uppercase leading-none tracking-[0.01em]">{adminSite.name}</span>
        </a>

        <form className="flex w-full flex-col gap-[18px] rounded-panel border border-line bg-white p-9 text-left shadow-[0_8px_24px_rgba(17,17,17,0.06)]">
          <div>
            <b className="block font-display text-[22px] font-bold">Admin sign in</b>
            <span className="text-sm text-muted">Staff access only — use your store email.</span>
          </div>

          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
            Work email
            <input
              type="email"
              autoComplete="email"
              placeholder="you@voltedge.co.za"
              className="h-[50px] rounded-xl border border-line bg-surface px-3.5 text-[15px] font-normal text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-ink">
            Password
            <input
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              className="h-[50px] rounded-xl border border-line bg-surface px-3.5 text-[15px] font-normal text-ink placeholder:text-muted focus:outline-2 focus:outline-offset-2 focus:outline-brand"
            />
          </label>

          <div className="flex items-center justify-between text-[13px]">
            <label className="flex items-center gap-2 text-muted">
              <input type="checkbox" className="accent-brand" />
              Keep me signed in
            </label>
            <a href="#" className="font-semibold text-brand">
              Forgot password?
            </a>
          </div>

          <Link
            href="/dashboard"
            className="flex h-[52px] items-center justify-center rounded-2xl bg-brand text-[15px] font-bold text-white transition-colors hover:bg-[#333333]"
          >
            Sign in
          </Link>

          <p className="m-0 text-center text-xs text-[#9aa0ad]">
            Two-factor codes are sent to your store WhatsApp number.
          </p>
        </form>

        <a href={adminSite.storeUrl} className="flex items-center gap-1.5 text-[13px] font-semibold text-muted">
          <ArrowLeft className="size-3.5" strokeWidth={2} aria-hidden />
          Back to the store
        </a>
      </div>
    </div>
  );
}
