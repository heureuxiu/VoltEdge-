import { cn } from "@/lib/utils";

/** The VoltEdge "V" with a lightning-bolt cut through its centre. Inherits the surrounding text colour. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 47 42" fill="currentColor" aria-hidden className={cn("h-[26px] w-auto", className)}>
      <path d="M0.5 0H14L21.8 21L18.2 33.2L25 34.5L22.8 42H16.8L0.5 0Z" />
      <path d="M32.8 0H46.5L30 42H26.2L29 32.2L22.2 31L21.8 29.8L32.8 0Z" />
    </svg>
  );
}
