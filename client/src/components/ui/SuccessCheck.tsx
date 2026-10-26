"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

/** Accent tick that pops in — used on confirmation screens. */
export function SuccessCheck() {
  return (
    <motion.span
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 16 }}
      className="grid size-[72px] place-items-center rounded-full bg-accent"
    >
      <Check className="size-[34px] text-white" strokeWidth={2.6} aria-hidden />
    </motion.span>
  );
}
