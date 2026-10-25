"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Logo } from "@/components/ui/Logo";
import { mainNav, routes } from "@/data/site";
import { cn } from "@/lib/utils";

const iconButton =
  "grid size-11 place-items-center rounded-xl text-ink transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-brand";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-xl transition-[background-color,box-shadow,border-color] duration-300",
        scrolled
          ? "border-line bg-surface/85 shadow-[0_10px_30px_-20px_rgb(11_12_16/0.35)]"
          : "border-transparent bg-surface/70",
      )}
    >
      <Container className="flex items-center justify-between gap-8 py-3.5">
        <Logo />

        <nav aria-label="Main" className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {mainNav.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "relative py-2 after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-left after:bg-brand after:transition-transform after:duration-300 hover:text-brand hover:after:scale-x-100",
                isActive(link.href) ? "font-semibold text-brand after:scale-x-100" : "after:scale-x-0",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button type="button" aria-label="Search" className={cn(iconButton, "hidden sm:grid")}>
            <Search className="size-5" aria-hidden />
          </button>
          <button type="button" aria-label="Wishlist" className={iconButton}>
            <Heart className="size-5" aria-hidden />
          </button>
          <button type="button" aria-label="Account" className={cn(iconButton, "hidden sm:grid")}>
            <User className="size-5" aria-hidden />
          </button>
          <Link href={routes.cart} aria-label="Cart, 2 items" className={cn(iconButton, "relative")}>
            <ShoppingBag className="size-5" aria-hidden />
            <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-brand text-[10px] font-semibold text-white">
              2
            </span>
          </Link>
          <ButtonLink href={routes.bookRepair} className="ml-2 hidden min-h-11 rounded-xl px-[18px] text-sm lg:inline-flex">
            Book a repair
          </ButtonLink>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-11 place-items-center rounded-xl border border-line bg-white lg:hidden"
          >
            {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Mobile"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden border-t border-line bg-surface lg:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {mainNav.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={isActive(link.href) ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-3 py-3 text-base font-medium hover:bg-white",
                    isActive(link.href) && "bg-white text-brand",
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <ButtonLink href={routes.bookRepair} onClick={() => setMenuOpen(false)} className="mt-2">
                Book a repair
              </ButtonLink>
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
