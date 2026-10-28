import { LogoMark } from "@/components/ui/LogoMark";

/** [left %, top %, size px, delay s, duration s] */
const sparks: [number, number, number, number, number][] = [
  [8, 78, 6, 0, 9],
  [18, 30, 4, 2.4, 11],
  [52, 18, 4, 1.2, 12],
  [63, 74, 6, 3.6, 9],
  [78, 26, 4, 6.2, 11],
];

/** Animated, purely decorative hero background: aurora glow, dot grid, radiating rings, sparks. */
export function HeroBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Aurora glow — radial gradients (no blur filters) animated with transforms only */}
      <div className="absolute -left-40 -top-52 size-[760px] animate-aurora-a will-change-transform [background:radial-gradient(closest-side,rgb(35_71_255/0.2),transparent)]" />
      <div className="absolute -bottom-72 left-[22%] size-[720px] animate-aurora-b will-change-transform [background:radial-gradient(closest-side,rgb(255_201_51/0.5),transparent)]" />
      <div className="absolute -right-48 top-0 size-[680px] animate-aurora-a will-change-transform [animation-delay:-6s] [background:radial-gradient(closest-side,rgb(255_201_51/0.38),transparent)]" />

      {/* Dot grid, faded towards the edges */}
      <div
        className="absolute inset-0 opacity-[0.55] [background-image:radial-gradient(rgb(17_17_17/0.16)_1px,transparent_1.2px)] [background-size:26px_26px] [mask-image:radial-gradient(ellipse_at_70%_45%,#000_8%,transparent_68%)]"
      />

      {/* Radiating rings behind the phone */}
      <div className="absolute right-[24%] top-1/2 size-0 max-lg:right-1/2">
        {[0, 1.6, 3.2].map((delay) => (
          <span
            key={delay}
            className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2 animate-ring-out rounded-full border border-[#2347ff]/25"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      {/* Ghost bolt mark */}
      <LogoMark className="absolute -bottom-10 right-[6%] h-[360px] animate-float-soft text-ink/[0.04]" />

      {/* Drifting sparks */}
      {sparks.map(([left, top, size, delay, duration]) => (
        <span
          key={`${left}-${top}`}
          className="absolute animate-spark rounded-full bg-[#ffc933] will-change-transform"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size, animationDelay: `${delay}s`, animationDuration: `${duration}s` }}
        />
      ))}
    </div>
  );
}
