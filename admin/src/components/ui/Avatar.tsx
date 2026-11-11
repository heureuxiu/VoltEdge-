import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span aria-hidden className={cn("grid size-9 shrink-0 place-items-center rounded-full bg-accent font-display text-xs font-bold text-accent-ink", className)}>
      {initials(name)}
    </span>
  );
}
