import Image from "next/image";
import { BatteryFull, Camera, Cpu, DeviceMobile, FileText, Lightning, ShieldCheck, SimCard, Wrench } from "@phosphor-icons/react/dist/ssr";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Product } from "@/types";

/** Bento-style feature grid + full spec table. Replaces the old tabbed "details" section. */
export function ProductBento({ product }: { product: Product }) {
  const specs: [string, string][] = [
    ["Model", product.name],
    ["Configuration", product.spec],
    ["Display", "[SIZE & TYPE]"],
    ["Chip", "[CHIP]"],
    ["Camera", "[CAMERA SPEC]"],
    ["Battery", "[BATTERY]"],
    ["Network", "5G · eSIM"],
    ["Brand", product.brand],
  ];

  const box = [
    { icon: DeviceMobile, label: product.name },
    { icon: Lightning, label: "USB-C charge cable" },
    { icon: FileText, label: "Documentation" },
    { icon: ShieldCheck, label: "VoltEdge warranty card" },
  ];

  return (
    <section className="mt-12" aria-labelledby="details-title">
      <SectionHeading eyebrow="In detail" title={<span id="details-title">Everything it does</span>} />

      <div className="grid auto-rows-[200px] grid-cols-2 gap-4 lg:grid-cols-4">
        {/* Camera — hero tile */}
        <Reveal className="relative col-span-2 row-span-2 overflow-hidden rounded-[28px] bg-ink p-8 text-white">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/10">
            <Camera className="size-7" aria-hidden />
          </span>
          <b className="mt-5 block max-w-[260px] font-display text-3xl leading-tight">Pro camera system</b>
          <p className="mt-3 max-w-[260px] text-[15px] leading-relaxed text-white/65">[CAMERA SPEC] — captured sharper in low light, with true-to-life colour.</p>
          <Image
            src={product.image}
            alt=""
            width={420}
            height={520}
            className="absolute -bottom-16 -right-6 h-[430px] w-auto rotate-6 opacity-95 drop-shadow-[0_30px_30px_rgb(0_0_0/0.5)]"
          />
        </Reveal>

        <Reveal delay={0.05} className="flex flex-col justify-between rounded-[28px] bg-[#ffc933] p-6">
          <Cpu className="size-9" aria-hidden />
          <span>
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-ink/60">Chip</span>
            <b className="block font-display text-2xl">[CHIP]</b>
          </span>
        </Reveal>

        <Reveal delay={0.1} className="flex flex-col justify-between rounded-[28px] bg-[#fef4cc] p-6 ring-1 ring-[#f3dd8a]">
          <BatteryFull className="size-9" aria-hidden />
          <span>
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-ink/60">Battery</span>
            <b className="block font-display text-2xl">[BATTERY]</b>
          </span>
        </Reveal>

        <Reveal delay={0.15} className="flex flex-col justify-between rounded-[28px] bg-white p-6 ring-1 ring-line">
          <DeviceMobile className="size-9" aria-hidden />
          <span>
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Display</span>
            <b className="block font-display text-2xl">[SIZE & TYPE]</b>
          </span>
        </Reveal>

        <Reveal delay={0.2} className="flex flex-col justify-between rounded-[28px] bg-surface p-6 ring-1 ring-line">
          <SimCard className="size-9" aria-hidden />
          <span>
            <span className="text-xs font-bold uppercase tracking-[0.08em] text-muted">Network</span>
            <b className="block font-display text-2xl">5G · eSIM</b>
          </span>
        </Reveal>

        {/* Warranty */}
        <Reveal className="col-span-2 flex items-center gap-6 rounded-[28px] bg-white p-7 ring-1 ring-line">
          <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-ink text-white">
            <ShieldCheck className="size-9" aria-hidden />
          </span>
          <span>
            <b className="block font-display text-xl">Covered by us</b>
            <span className="mt-1 block text-[15px] leading-relaxed text-muted">
              New devices carry the manufacturer&apos;s warranty. Pre-owned include a [X]-month VoltEdge warranty.
            </span>
          </span>
        </Reveal>

        {/* Checked */}
        <Reveal delay={0.05} className="col-span-2 flex items-center gap-6 rounded-[28px] bg-white p-7 ring-1 ring-line">
          <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-[#ffc933]">
            <Wrench className="size-9" aria-hidden />
          </span>
          <span>
            <b className="block font-display text-xl">Checked by us</b>
            <span className="mt-1 block text-[15px] leading-relaxed text-muted">
              Every device is tested, IMEI-checked and reset before it leaves the store. Repairs: 90 days, parts and labour.
            </span>
          </span>
        </Reveal>
      </div>

      {/* In the box + spec sheet */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="rounded-[28px] bg-surface p-7">
          <b className="font-display text-xl">What&apos;s in the box</b>
          <ul className="mt-5 flex flex-col gap-3">
            {box.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 text-[15px] font-semibold">
                <Icon className="size-6 shrink-0" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.05} className="rounded-[28px] bg-white p-7 ring-1 ring-line">
          <b className="font-display text-xl">Full specifications</b>
          <dl className="mt-5 overflow-hidden rounded-[20px] ring-1 ring-line">
            {specs.map(([key, value], index) => (
              <div key={key} className={`flex justify-between gap-4 px-5 py-3.5 text-[15px] ${index % 2 === 0 ? "bg-surface" : "bg-white"}`}>
                <dt className="text-muted">{key}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
