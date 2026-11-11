import { ArrowsClockwise, ChatCircleText, ClockCounterClockwise, GearSix, Package, ShoppingBag, SquaresFour, Users, Wrench } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";

export interface NavItem {
  key: string;
  label: string;
  href: string;
  icon: Icon;
  /** Small caption above the page title in the top bar. */
  eyebrow: string;
  /** Page title shown in the top bar. */
  title: string;
}

export const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/dashboard", icon: SquaresFour, eyebrow: "Store overview", title: "Dashboard" },
  { key: "orders", label: "Orders", href: "/orders", icon: ShoppingBag, eyebrow: "Sales", title: "Orders" },
  { key: "products", label: "Products", href: "/products", icon: Package, eyebrow: "Catalogue", title: "Products" },
  { key: "repairs", label: "Repairs", href: "/repairs", icon: Wrench, eyebrow: "Workshop", title: "Repairs" },
  { key: "trade-ins", label: "Trade-ins", href: "/trade-ins", icon: ArrowsClockwise, eyebrow: "Buy-back", title: "Trade-ins" },
  { key: "customers", label: "Customers", href: "/customers", icon: Users, eyebrow: "People", title: "Customers" },
  { key: "messages", label: "Messages", href: "/messages", icon: ChatCircleText, eyebrow: "Inbox", title: "Messages" },
  { key: "activity", label: "Activity log", href: "/activity", icon: ClockCounterClockwise, eyebrow: "Audit", title: "Activity log" },
  { key: "settings", label: "Settings", href: "/settings", icon: GearSix, eyebrow: "Configuration", title: "Settings" },
];

export function findNavItem(pathname: string): NavItem | undefined {
  return navItems.find((item) => pathname.startsWith(item.href));
}
