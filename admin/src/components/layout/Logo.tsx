import { LogoMark } from "@/components/admin/LogoMark";
import { cn } from "@/lib/utils";

/** Brand tile: yellow rounded square with the V-bolt, plus wordmark. */
export function BrandTile({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="grid size-10 shrink-0 place-items-center rounded-[14px] bg-accent text-accent-ink">
        <LogoMark className="h-[19px]" />
      </span>
      {compact ? null : (
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="font-logo text-[16px] font-extrabold uppercase leading-none tracking-[0.01em] text-rail-hi">VoltEdge</span>
          <span className="mt-1 text-[10px] font-semibold tracking-[0.16em] text-rail-mut uppercase">Admin</span>
        </span>
      )}
    </div>
  );
}
