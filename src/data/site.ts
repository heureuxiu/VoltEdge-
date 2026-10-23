import type { AnnouncementMessage, FooterColumn, NavLink } from "@/types";

/**
 * Store-wide settings. Replace the bracketed placeholders with real details.
 */
export const siteConfig = {
  name: "VoltEdge",
  tagline: "Your one stop premium tech shop.",
  description:
    "Premium phones, laptops and gadgets at honest prices — plus same-day repairs, trade-ins and Pay in 3.",
  phone: "[PHONE NUMBER]",
  whatsapp: "[WHATSAPP NUMBER]",
  email: "[EMAIL]",
  address: "[STORE ADDRESS]",
  whatsappUrl: "/contact",
  mapsUrl: "/contact",
  copyrightYear: 2026,
  serviceAreas: ["[AREA 1]", "[AREA 2]", "[AREA 3]", "[AREA 4]"],
} as const;

/** Central list of app routes so links never drift out of sync. */
export const routes = {
  home: "/",
  shop: "/shop",
  product: (slug: string) => `/shop/${slug}`,
  cart: "/cart",
  repairs: "/repairs",
  bookRepair: "/repairs/book",
  tradeIn: "/trade-in",
  track: "/track",
  contact: "/contact",
} as const;

export const mainNav: NavLink[] = [
  { label: "Home", href: routes.home },
  { label: "Shop", href: routes.shop },
  { label: "Repairs", href: routes.repairs },
  { label: "Trade-in", href: routes.tradeIn },
  { label: "Track order", href: routes.track },
  { label: "Contact", href: routes.contact },
];

export const announcements: AnnouncementMessage[] = [
  { tag: "Repairs", text: "Same-day phone & laptop repairs — walk in or book online" },
  { tag: "Warranty", text: "90-day warranty on every repair, parts and labour" },
  { tag: "Payflex", text: "Pay in 3 interest-free instalments at checkout" },
  { tag: "Refer", text: "Refer a friend and you both get [REWARD]" },
];

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "All products", href: routes.shop },
      { label: "iPhone 17 Pro Max", href: routes.product("iphone-17-pro-max") },
      { label: "Samsung Galaxy", href: routes.shop },
      { label: "Audio & laptops", href: routes.shop },
      { label: "Your cart", href: routes.cart },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Book a repair", href: routes.bookRepair },
      { label: "Repair prices", href: routes.repairs },
      { label: "Trade in your device", href: routes.tradeIn },
      { label: "Track order or repair", href: routes.track },
      { label: "Find us · Hours", href: routes.contact },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
      { label: "Refund policy", href: "#" },
      { label: "Shipping policy", href: "#" },
      { label: "Trade-in policy", href: "#" },
    ],
  },
];

export const popularSearches: string[] = [
  "iPhone repair near me",
  "iPhone 17 Pro Max",
  "iPhone 17 Pro",
  "iPhone 16 Pro",
  "iPhone 13",
  "Samsung Galaxy S25",
  "Galaxy S25 Ultra",
  "Galaxy A17 128GB",
  "Galaxy A36 128GB",
  "AirPods Pro 3",
  "MacBook Air",
  "Laptop repairs",
];

export const brands: string[] = ["Apple", "Samsung", "Xiaomi", "Huawei", "JBL", "Aula", "PXN", "Lenovo", "HP"];

export const storeHours = [
  { day: "Monday – Friday", time: "[OPEN] – [CLOSE]", highlight: true },
  { day: "Saturday", time: "[OPEN] – [CLOSE]", highlight: false },
  { day: "Sunday", time: "[OPEN] – [CLOSE]", highlight: false },
  { day: "Public holidays", time: "[HOURS]", highlight: false },
];
