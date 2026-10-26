"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { ArrowUpRight, Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { mainNav, routes } from "@/data/site";
import { cn } from "@/lib/utils";

const iconButton =
  "grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 pb-1 pt-3">
      <Container>
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-full bg-ink/95 py-2 pl-5 pr-2 ring-1 backdrop-blur-xl transition-all duration-300",
            scrolled
              ? "ring-white/10 shadow-[0_18px_40px_-18px_rgb(17_17_17/0.6)]"
              : "ring-white/10 shadow-[0_8px_24px_-16px_rgb(17_17_17/0.4)]",
          )}
        >
          <Logo tone="dark" />

          <LayoutGroup id="main-nav">
            <nav
              aria-label="Main"
              onMouseLeave={() => setHovered(null)}
              className="hidden items-center gap-1 rounded-full bg-white/10 p-1 text-[15px] font-medium lg:flex"
            >
              {mainNav.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onMouseEnter={() => setHovered(link.label)}
                    onFocus={() => setHovered(link.label)}
                    className={cn(
                      "relative rounded-full px-4 py-2 transition-colors duration-200",
                      active ? "text-ink" : "text-white/85 hover:text-white",
                    )}
                  >
                    {active && <span className="absolute inset-0 rounded-full bg-white" />}
                    {!active && hovered === link.label && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-0 rounded-full bg-white/15"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </LayoutGroup>

          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Search"
              className="hidden h-11 items-center gap-2.5 rounded-full bg-white/10 px-4 text-sm text-white/60 transition-colors hover:bg-white/15 xl:flex xl:w-[210px]"
            >
              <Search className="size-[18px] text-white" aria-hidden />
              Search products…
            </button>
            <button type="button" aria-label="Search" className={cn(iconButton, "hidden sm:grid xl:hidden")}>
              <Search className="size-5" aria-hidden />
            </button>
            <button type="button" aria-label="Wishlist" className={cn(iconButton, "hidden sm:grid")}>
              <Heart className="size-5" aria-hidden />
            </button>
            <button type="button" aria-label="Account" className={cn(iconButton, "hidden sm:grid")}>
              <User className="size-5" aria-hidden />
            </button>
            <Link href={routes.cart} aria-label="Cart, 2 items" className={cn(iconButton, "relative")}>
              <ShoppingBag className="size-5" aria-hidden />
              <span className="absolute right-1 top-1 grid size-[18px] place-items-center rounded-full bg-accent text-[10px] font-bold text-ink ring-2 ring-ink">
                2
              </span>
            </Link>

            <Link
              href={routes.bookRepair}
              className="group ml-1 hidden h-11 items-center gap-3 rounded-full bg-accent pl-5 pr-1.5 text-sm font-bold text-ink transition-colors hover:bg-[#ffd24d] lg:inline-flex"
            >
              Book a repair
              <span className="grid size-8 place-items-center rounded-full bg-ink text-white transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="size-4" strokeWidth={2.4} aria-hidden />
              </span>
            </Link>

            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-11 place-items-center rounded-full bg-white text-ink lg:hidden"
            >
              {menuOpen ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              aria-label="Mobile"
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
              className="mt-2 overflow-hidden rounded-[28px] bg-white/95 p-3 ring-1 ring-black/10 shadow-[0_24px_48px_-24px_rgb(17_17_17/0.4)] backdrop-blur-xl lg:hidden"
            >
              <div className="flex flex-col gap-1">
                {mainNav.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-base font-medium hover:bg-surface",
                      isActive(link.href) && "bg-ink text-white hover:bg-ink",
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href={routes.bookRepair}
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 flex h-12 items-center justify-center gap-2 rounded-full bg-accent text-sm font-bold text-ink"
                >
                  Book a repair
                  <ArrowUpRight className="size-4" strokeWidth={2.4} aria-hidden />
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </Container>
    </header>
  );
}
