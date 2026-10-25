import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface MarqueeProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  /** Animation duration in seconds — higher is slower. */
  duration?: number;
  className?: string;
  trackClassName?: string;
  fade?: boolean;
}

/**
 * Infinite right-to-left ticker. The list is rendered twice and the track
 * slides by half its width, so the loop is seamless.
 */
export function Marquee<T>({
  items,
  renderItem,
  duration = 32,
  className,
  trackClassName,
  fade = true,
}: MarqueeProps<T>) {
  const loop = [...items, ...items];

  return (
    <div className={cn("overflow-hidden", fade && "mask-fade-x", className)}>
      <div
        className={cn("flex w-max animate-marquee pause-on-hover", trackClassName)}
        style={{ animationDuration: `${duration}s` }}
      >
        {loop.map((item, index) => (
          <div key={index} className="shrink-0" aria-hidden={index >= items.length || undefined}>
            {renderItem(item, index % items.length)}
          </div>
        ))}
      </div>
    </div>
  );
}
