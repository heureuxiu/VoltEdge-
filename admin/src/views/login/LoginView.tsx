"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, EyeSlash, Moon, Sun } from "@phosphor-icons/react";

import { LogoMark } from "@/components/admin/LogoMark";
import { useTheme } from "@/components/Providers";
import { Field, Input } from "@/components/ui/Field";
import { adminSite } from "@/config/site";
import { useAdmin } from "@/store/AdminStore";

export function LoginView() {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const { hydrated, session, signIn, connectionError } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hydrated && session) router.replace("/dashboard");
  }, [hydrated, session, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = await signIn(email, password);
    setBusy(false);
    if (result.ok) router.replace("/dashboard");
    else setError(result.message);
  }

  return (
    <div className="grid min-h-dvh gap-4 p-3 sm:p-4 lg:grid-cols-[1.1fr_1fr]">
      <section className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-3xl bg-rail p-7 text-rail-hi sm:p-10 lg:min-h-0">
        <div aria-hidden className="absolute -top-32 -right-24 size-[420px] rounded-full bg-accent opacity-[0.14] blur-[90px]" />
        <div aria-hidden className="absolute -bottom-40 -left-20 size-[380px] rounded-full bg-hero opacity-[0.22] blur-[100px]" />
        <div className="relative flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-2xl bg-accent text-accent-ink">
            <LogoMark className="h-6" />
          </span>
          <span className="font-logo text-xl font-extrabold tracking-[0.01em] uppercase">{adminSite.name}</span>
        </div>
        <div className="relative">
          <h2 className="m-0 text-4xl leading-[1.05] font-bold sm:text-5xl">
            Run the store.
            <br />
            <span className="text-accent">Fix. Sell. Trade.</span>
          </h2>
          <p className="mt-4 max-w-sm text-sm text-rail-mut">Orders, stock, repairs and trade-ins — one calm place for the whole VoltEdge team.</p>
        </div>
      </section>

      <section className="flex flex-col justify-center px-2 py-8 sm:px-8">
        <div className="mx-auto w-full max-w-[400px]">
          <div className="mb-8 flex items-center justify-between">
            <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">Sign in</span>
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle theme"
              className="grid size-10 place-items-center rounded-xl border border-line bg-surface hover:bg-surface-2"
            >
              {theme === "dark" ? <Sun className="size-5" aria-hidden /> : <Moon className="size-5" aria-hidden />}
            </button>
          </div>
          <h1 className="m-0 text-3xl font-bold">Welcome back</h1>
          <p className="mt-1.5 mb-6 text-sm text-ink-2">Sign in with your store email and password.</p>

          <form onSubmit={onSubmit} className="grid gap-4">
            <Field label="Email">
              <Input type="email" autoComplete="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="you@voltedge.co.za" />
            </Field>
            <Field label="Password">
              <div className="relative">
                <Input
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="pr-11"
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((v) => !v)}
                  className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:text-ink"
                >
                  {show ? <EyeSlash className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
                </button>
              </div>
            </Field>
            {error || connectionError ? <p role="alert" className="m-0 rounded-xl bg-danger-soft px-3.5 py-2.5 text-[13px] font-semibold text-danger">{error || connectionError}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-ink text-[15px] font-bold text-bg transition hover:opacity-90 disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
              <ArrowRight className="size-[18px]" weight="bold" aria-hidden />
            </button>
          </form>



          <a href={adminSite.storeUrl} className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-ink">
            <ArrowLeft className="size-3.5" weight="bold" aria-hidden />
            Back to the store
          </a>
        </div>
      </section>
    </div>
  );
}
