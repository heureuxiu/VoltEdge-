import { cn } from "@/lib/utils";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  counts,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  counts?: Partial<Record<T, number>>;
}) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1 [scrollbar-width:none]">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          role="tab"
          aria-selected={value === o}
          onClick={() => onChange(o)}
          className={cn(
            "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors",
            value === o ? "bg-ink text-bg" : "text-muted hover:text-ink",
          )}
        >
          {o}
          {counts?.[o] !== undefined ? (
            <span className={cn("rounded-full px-1.5 text-[11px]", value === o ? "bg-bg/20" : "bg-line-2")}>{counts[o]}</span>
          ) : null}
        </button>
      ))}
    </div>
  );
}
