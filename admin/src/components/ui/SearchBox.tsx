import { MagnifyingGlass } from "@phosphor-icons/react";

import { cn } from "@/lib/utils";

export function SearchBox({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={cn("flex h-10 items-center gap-2.5 rounded-xl border border-line bg-surface px-3.5 focus-within:border-ink", className)}>
      <MagnifyingGlass className="size-[18px] shrink-0 text-muted" aria-hidden />
      <span className="sr-only">{placeholder}</span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-w-0 border-0 bg-transparent text-sm outline-none placeholder:text-muted"
      />
    </label>
  );
}
