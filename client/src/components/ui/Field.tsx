import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const inputClassName =
  "h-[52px] w-full rounded-[14px] border border-[#d4d4d8] bg-surface px-3.5 text-[15px] text-ink placeholder:text-[#8a90a0] focus:border-brand focus:outline-none";

interface FieldProps extends ComponentPropsWithoutRef<"input"> {
  label: ReactNode;
  wrapperClassName?: string;
}

export function Field({ label, wrapperClassName, className, ...props }: FieldProps) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-[13px] font-semibold", wrapperClassName)}>
      {label}
      <input className={cn(inputClassName, className)} {...props} />
    </label>
  );
}

interface TextAreaFieldProps extends ComponentPropsWithoutRef<"textarea"> {
  label: ReactNode;
}

export function TextAreaField({ label, className, ...props }: TextAreaFieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-[13px] font-semibold">
      {label}
      <textarea
        className={cn(inputClassName, "h-auto min-h-28 resize-y py-3", className)}
        {...props}
      />
    </label>
  );
}
