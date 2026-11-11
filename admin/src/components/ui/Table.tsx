import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("-mx-4 overflow-x-auto sm:mx-0", className)}>
      <table className="w-full min-w-[640px] border-collapse">{children}</table>
    </div>
  );
}

export function Th({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn("border-b border-line px-3 py-2.5 text-left text-[11px] font-bold tracking-[0.08em] text-muted uppercase first:pl-4 last:pr-4 sm:first:pl-3 sm:last:pr-3", className)}
      {...props}
    />
  );
}

export function Td({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("border-b border-line-2 px-3 py-3 text-sm group-last/row:border-b-0 first:pl-4 last:pr-4 sm:first:pl-3 sm:last:pr-3", className)}
      {...props}
    />
  );
}

export function Tr({ className, onClick, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      onClick={onClick}
      className={cn("group/row transition-colors", onClick && "cursor-pointer hover:bg-surface-2", className)}
      {...props}
    />
  );
}
