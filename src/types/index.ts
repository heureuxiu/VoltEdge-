import type { LucideIcon } from "lucide-react";

export type ProductCategory = "iphone" | "samsung" | "gadgets";
export type ProductType = "phone" | "laptop" | "audio";

export interface Product {
  /** Also used as the URL slug: /shop/[id] */
  id: string;
  type: ProductType;
  brand: string;
  name: string;
  spec: string;
  badge: string;
  category: ProductCategory;
  image: string;
  /** Tint behind the product photo on cards. */
  tint: string;
  /** Prices are placeholders until real pricing is supplied. */
  price: string;
  compareAtPrice?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

export interface IconItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface Category {
  name: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  href: string;
}

export interface HeroSlide {
  id: string;
  tag: string;
  tagClassName: string;
  titleTop: string;
  titleBottom: string;
  body: string;
  cta: NavLink;
  image: string;
  imageAlt: string;
  glow: string;
  card: { title: string; subtitle: string };
}

export interface Guide {
  tag: string;
  title: string;
  tint: string;
  href: string;
}

export interface AnnouncementMessage {
  tag: string;
  text: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface SelectOption<T extends string = string> {
  label: string;
  value: T;
  description?: string;
}
