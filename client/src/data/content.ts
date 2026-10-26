import {
  BatteryFull,
  Clock,
  CreditCard,
  Droplets,
  Gamepad2,
  Headphones,
  Laptop,
  Plug,
  ShieldCheck,
  Smartphone,
  SmartphoneNfc,
  Tablet,
  Tv,
  BadgeCheck,
} from "lucide-react";

import type { Category, Guide, HeroSlide, IconItem } from "@/types";

export const heroSlides: HeroSlide[] = [
  {
    id: "new-arrival",
    tag: "New arrival",
    tagClassName: "bg-brand text-white",
    titleTop: "iPhone 17 Pro Max.",
    titleBottom: "In store now.",
    body: "Brand-new and certified pre-owned flagships at honest prices — with trade-in credit and Pay in 3 to make the upgrade easy.",
    cta: { label: "Shop iPhone", href: "/shop" },
    image: "/images/hero/iphone-17-pro-deep-blue.webp",
    imageAlt: "iPhone 17 Pro Max in deep blue, back and front",
    glow: "bg-white",
    card: { title: "iPhone 17 Pro Max", subtitle: "From R [PRICE] · or 3 × R [AMOUNT]" },
  },
  {
    id: "repairs",
    tag: "Same-day repairs",
    tagClassName: "bg-repair text-white",
    titleTop: "Cracked screen?",
    titleBottom: "Fixed today.",
    body: "Screens, batteries, charging ports and back glass — done by certified technicians while you wait, backed by a 90-day warranty.",
    cta: { label: "Book a repair", href: "/repairs" },
    image: "/images/hero/iphone-17-pro-silver.webp",
    imageAlt: "iPhone 17 Pro in silver, back and front",
    glow: "bg-white",
    card: { title: "Screen repair", subtitle: "From R [PRICE] · same day" },
  },
  {
    id: "trade-in",
    tag: "Trade-in",
    tagClassName: "bg-accent text-ink",
    titleTop: "Old phone,",
    titleBottom: "new upgrade.",
    body: "Get an instant estimate for your current device, bring it in for a quick check and put the credit straight towards something new.",
    cta: { label: "Get a quote", href: "/trade-in" },
    image: "/images/hero/iphone-17-pro-cosmic-orange.webp",
    imageAlt: "iPhone 17 Pro in cosmic orange, back and front",
    glow: "bg-white",
    card: { title: "Trade-in estimate", subtitle: "Up to R [VALUE] credit" },
  },
];

export const categories: Category[] = [
  { name: "Phones", description: "iPhone, Samsung & more", icon: Smartphone, tint: "bg-brand-soft", href: "/shop" },
  { name: "Laptops", description: "MacBook & Windows", icon: Laptop, tint: "bg-accent-soft", href: "/shop" },
  { name: "Tablets", description: "iPad & Android", icon: Tablet, tint: "bg-repair-soft", href: "/shop" },
  { name: "TVs & Gadgets", description: "Smart home & more", icon: Tv, tint: "bg-[#f4f4f5]", href: "/shop" },
  { name: "Gaming", description: "Controllers & keyboards", icon: Gamepad2, tint: "bg-[#f1f1f3]", href: "/shop" },
  { name: "Accessories", description: "Cases, chargers, audio", icon: Headphones, tint: "bg-[#f4f4f5]", href: "/shop" },
];

export const repairServices: { name: string; icon: IconItem["icon"] }[] = [
  { name: "Screen replacement", icon: SmartphoneNfc },
  { name: "Battery replacement", icon: BatteryFull },
  { name: "Charging port", icon: Plug },
  { name: "Back glass", icon: Smartphone },
  { name: "Laptop & MacBook", icon: Laptop },
  { name: "Water damage", icon: Droplets },
];

export const repairSteps = [
  { title: "Book online or walk in", description: "Pick your device and issue, choose a time." },
  { title: "Free diagnosis & quote", description: "We confirm the price before any work starts." },
  { title: "Collect the same day", description: "Backed by our 90-day repair warranty." },
];

export const perks: IconItem[] = [
  { title: "Same-day repairs", description: "Most phone and laptop repairs done while you wait or by end of day.", icon: Clock },
  { title: "90-day warranty", description: "Every repair is backed by a 90-day parts and labour warranty.", icon: ShieldCheck },
  { title: "Genuine stock only", description: "Every device is checked, verified and never blacklisted.", icon: BadgeCheck },
  { title: "Pay in 3 with Payflex", description: "Split your purchase into three interest-free payments.", icon: CreditCard },
];

export const reviewTopics = [
  { topic: "Screen repair", tint: "bg-brand-soft" },
  { topic: "Bought a pre-owned iPhone", tint: "bg-accent-soft" },
  { topic: "Traded in an old phone", tint: "bg-repair-soft" },
  { topic: "Battery replacement", tint: "bg-accent-soft" },
  { topic: "Bought a laptop", tint: "bg-repair-soft" },
  { topic: "Pay in 3 checkout", tint: "bg-brand-soft" },
];

export const guides: Guide[] = [
  { tag: "Pre-owned", title: "Is buying a pre-owned iPhone safe?", image: "/images/guides/pre-owned.jpg", tint: "bg-brand-soft", href: "#guides" },
  { tag: "Repairs", title: "iPhone screen repair: 2026 prices", image: "/images/guides/screen-repair.jpg", tint: "bg-repair-soft", href: "#guides" },
  { tag: "Trade-in", title: "How much is my old iPhone worth?", image: "/images/guides/trade-in.jpg", tint: "bg-accent-soft", href: "#guides" },
  { tag: "Safety", title: "How to spot a stolen or blacklisted iPhone", image: "/images/guides/safety.jpg", tint: "bg-[#f4f4f5]", href: "#guides" },
  { tag: "Finance", title: "Payflex vs Mobicred vs PayJustNow", image: "/images/guides/finance.jpg", tint: "bg-[#f1f1f3]", href: "#guides" },
  { tag: "Compare", title: "iPhone 13 vs iPhone 14 in 2026", image: "/images/guides/compare.jpg", tint: "bg-[#f4f4f5]", href: "#guides" },
];
