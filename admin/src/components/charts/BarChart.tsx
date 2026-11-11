import { cn } from "@/lib/utils";

export interface BarDatum {
  label: string;
  value: number;
}

/** Responsive HTML bar chart with gridlines; the tallest bar is highlighted in the accent colour. */
export function BarChart({ data, format, height = 220 }: { data: BarDatum[]; format: (n: number) => string; height?: number }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const ticks = [1, 0.75, 0.5, 0.25, 0];

  return (
    <div className="flex gap-3" style={{ height }}>
      <div className="flex flex-col justify-between pb-6 text-right text-[10.5px] text-muted tabular-nums">
        {ticks.map((t) => (
          <span key={t}>{format(max * t)}</span>
        ))}
      </div>
      <div className="relative flex min-w-0 flex-1 items-end gap-2 pb-6 sm:gap-3">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1.5 bottom-6 flex flex-col justify-between">
          {ticks.map((t) => (
            <span key={t} className="block border-t border-dashed border-line" />
          ))}
        </div>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const top = d.value === max;
          return (
            <div key={d.label} className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-[10.5px] font-bold tabular-nums">{format(d.value)}</span>
              <div
                className={cn("ve-bar w-full max-w-12 rounded-t-lg", top ? "bg-accent" : "bg-c1")}
                style={{ height: `${Math.max(pct, 2)}%`, animationDelay: `${i * 60}ms`, maxHeight: "calc(100% - 18px)" }}
                title={`${d.label}: ${format(d.value)}`}
              />
              <span className="absolute -bottom-6 text-[11px] font-medium text-muted">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
