"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Faq } from "@/types";

interface AccordionProps {
  items: Faq[];
  defaultOpen?: number;
  className?: string;
}

export function Accordion({ items, defaultOpen = 0, className }: AccordionProps) {
  const [open, setOpen] = useState<number>(defaultOpen);
  const baseId = useId();

  return (
    <div className={className}>
      {items.map((item, index) => {
        const isOpen = open === index;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question} className="border-t border-line">
            <h3 className="font-sans">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? -1 : index)}
                className="flex min-h-16 w-full items-center justify-between gap-4 text-left text-[17px] font-semibold"
              >
                {item.question}
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full transition-all duration-300",
                    isOpen ? "rotate-45 bg-lime" : "bg-surface",
                  )}
                >
                  <Plus className="size-4" aria-hidden />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <p className="mb-5 max-w-[640px] text-[15px] leading-relaxed text-muted">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
