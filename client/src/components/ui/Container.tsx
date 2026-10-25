import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14", className)} {...props} />;
}
