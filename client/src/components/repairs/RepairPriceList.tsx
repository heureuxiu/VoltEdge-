"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";

import { ArrowUpRight } from "lucide-react";

import { repairDevices, repairPriceList, type RepairDevice } from "@/data/repairs";
import { routes } from "@/data/site";
import { cn } from "@/lib/utils";

export function RepairPriceList() {
  const [device, setDevice] = useState<RepairDevice>("iphone");

  return (
    <section id="prices" className="mt-4 scroll-mt-28 rounded-panel bg-white p-6 ring-1 ring-line sm:p-12" aria-labelledby="prices-title">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-muted">Repair prices</span>
          <h2 id="prices-title" className="mt-2 text-[clamp(1.875rem,3.8vw,2.875rem)] font-bold">
            What needs fixing?
          </h2>
        </div>
        <LayoutGroup id="repair-devices">
          <div role="tablist" aria-label="Device type" className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-surface p-1.5 ring-1 ring-line">
            {repairDevices.map((d) => (
              <button
                key={d.value}
                type="button"
                role="tab"
                aria-selected={device === d.value}
                onClick={() => setDevice(d.value)}
                className={cn("relative min-h-11 shrink-0 rounded-full px-5 text-sm font-semibold transition-colors", device === d.value ? "text-white" : "text-ink hover:bg-white")}
              >
                {device === d.value && (
                  <motion.span layoutId="repair-device" className="absolute inset-0 rounded-full bg-ink shadow-[0_8px_16px_-8px_rgb(17_17_17/0.6)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className="relative">{d.label}</span>
              </button>
            ))}
          </div>
        </LayoutGroup>
      </div>

      <div className="overflow-x-auto rounded-[20px] ring-1 ring-line">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="bg-surface text-xs font-bold uppercase tracking-[0.06em] text-muted">
              <th scope="col" className="px-5 py-3.5">Repair</th>
              <th scope="col" className="px-5 py-3.5">Turnaround</th>
              <th scope="col" className="px-5 py-3.5">Price</th>
              <th scope="col" className="px-5 py-3.5"><span className="sr-only">Action</span></th>
            </tr>
          </thead>
          <AnimatePresence mode="wait">
            <motion.tbody
              key={device}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {repairPriceList[device].map(({ icon: Icon, ...service }) => (
                <tr key={service.name} className="border-t border-line transition-colors hover:bg-surface">
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-3.5">
                      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-surface">
                        <Icon className="size-6" strokeWidth={1.7} aria-hidden />
                      </span>
                      <span>
                        <b className="text-base">{service.name}</b>
                        <br />
                        <span className="text-[13px] text-muted">{service.note}</span>
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold">{service.turnaround}</td>
                  <td className="px-5 py-4 font-display text-lg font-bold">From R [PRICE]</td>
                  <td className="px-5 py-4 text-right">
                    <Link
                      href={routes.bookRepair}
                      className="group/book inline-flex h-11 items-center gap-2 rounded-full bg-ink pl-5 pr-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#333333]"
                    >
                      Book
                      <span className="grid size-8 place-items-center rounded-full bg-accent text-ink transition-transform duration-300 group-hover/book:rotate-45">
                        <ArrowUpRight className="size-4" strokeWidth={2.4} aria-hidden />
                      </span>
                    </Link>
                  </td>
                </tr>
              ))}
            </motion.tbody>
          </AnimatePresence>
        </table>
      </div>
      <p className="mt-4 text-[13px] text-muted">
        Final price depends on the exact model and part grade — we always confirm the quote before starting.
      </p>
    </section>
  );
}
