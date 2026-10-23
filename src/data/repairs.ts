import {
  BatteryFull,
  Camera,
  Droplets,
  Keyboard,
  Laptop,
  Plug,
  Smartphone,
  SmartphoneNfc,
  Tablet,
  type LucideIcon,
} from "lucide-react";

import type { Faq } from "@/types";

export interface RepairService {
  name: string;
  note: string;
  turnaround: string;
  icon: LucideIcon;
}

export type RepairDevice = "iphone" | "samsung" | "laptop" | "tablet";

export const repairDevices: { value: RepairDevice; label: string }[] = [
  { value: "iphone", label: "iPhone" },
  { value: "samsung", label: "Samsung" },
  { value: "laptop", label: "Laptop & MacBook" },
  { value: "tablet", label: "Tablet" },
];

/** Turnaround times are defaults — adjust to your workshop. */
export const repairPriceList: Record<RepairDevice, RepairService[]> = {
  iphone: [
    { name: "Screen replacement", note: "OLED & LCD options", turnaround: "Same day", icon: SmartphoneNfc },
    { name: "Battery replacement", note: "Restores battery health", turnaround: "Same day", icon: BatteryFull },
    { name: "Charging port", note: "Cleaning or replacement", turnaround: "Same day", icon: Plug },
    { name: "Back glass", note: "Laser removal, no frame swap", turnaround: "1–2 days", icon: Smartphone },
    { name: "Camera / lens", note: "Rear & front cameras", turnaround: "Same day", icon: Camera },
    { name: "Water damage", note: "Diagnosis & cleaning", turnaround: "2–3 days", icon: Droplets },
  ],
  samsung: [
    { name: "Screen replacement", note: "Genuine service packs", turnaround: "Same day", icon: SmartphoneNfc },
    { name: "Battery replacement", note: "Original-spec cells", turnaround: "Same day", icon: BatteryFull },
    { name: "Charging port", note: "Sub-board replacement", turnaround: "Same day", icon: Plug },
    { name: "Back glass", note: "Colour-matched", turnaround: "Same day", icon: Smartphone },
    { name: "Camera / lens", note: "Lens & module", turnaround: "Same day", icon: Camera },
  ],
  laptop: [
    { name: "Screen replacement", note: "MacBook & Windows", turnaround: "1–3 days", icon: Laptop },
    { name: "Battery replacement", note: "With health report", turnaround: "Same day", icon: BatteryFull },
    { name: "Keyboard repair", note: "Keys or full deck", turnaround: "1–2 days", icon: Keyboard },
    { name: "Liquid damage", note: "Logic board cleaning", turnaround: "2–4 days", icon: Droplets },
    { name: "Charging / DC jack", note: "Port & board repair", turnaround: "1–2 days", icon: Plug },
  ],
  tablet: [
    { name: "Glass & digitiser", note: "iPad & Galaxy Tab", turnaround: "1–2 days", icon: Tablet },
    { name: "Battery replacement", note: "All major tablets", turnaround: "1–2 days", icon: BatteryFull },
    { name: "Charging port", note: "Lightning & USB-C", turnaround: "Same day", icon: Plug },
  ],
};

export const repairProcess = [
  { title: "Book or walk in", description: "Choose your device and issue online, or simply drop in to the store." },
  { title: "Free diagnosis", description: "A technician checks the device and confirms the price before any work." },
  { title: "We fix it", description: "Quality parts, careful work and a full test once the repair is done." },
  { title: "Collect & go", description: "Most repairs are ready the same day, with a 90-day warranty." },
];

export const repairFaqs: Faq[] = [
  {
    question: "How long does a repair take?",
    answer:
      "Most phone screens, batteries and charging ports are done the same day, often while you wait. Laptop and water-damage jobs can take a little longer — we give you a time when we quote.",
  },
  {
    question: "Do you use original parts?",
    answer: "We offer quality parts in different grades and always tell you which one you are getting before we start. [Add your part policy here.]",
  },
  {
    question: "Is my data safe?",
    answer: "We never need access to your photos or messages. For most repairs you can keep your passcode — we only ask if a test needs it.",
  },
  {
    question: "What does the 90-day warranty cover?",
    answer: "Any fault with the part we fitted or our workmanship for 90 days. Accidental damage after the repair is not covered.",
  },
  { question: "Can you collect my device?", answer: "[Describe your collection or courier option and service areas.]" },
];

/* ------------------------------ Booking wizard ----------------------------- */

export const bookingDevices: { label: string; icon: LucideIcon; models: string[] }[] = [
  { label: "Apple iPhone", icon: Smartphone, models: ["iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17", "iPhone 16 Pro", "iPhone 15", "Other iPhone"] },
  { label: "Samsung Galaxy", icon: Smartphone, models: ["Galaxy S25 Ultra", "Galaxy S25", "Galaxy A36", "Other Galaxy"] },
  { label: "Other phone", icon: Smartphone, models: ["Xiaomi", "Huawei", "Oppo", "Other"] },
  { label: "Laptop / MacBook", icon: Laptop, models: ["MacBook Air", "MacBook Pro", "Windows laptop"] },
  { label: "Tablet / iPad", icon: Tablet, models: ["iPad", "iPad Pro", "Galaxy Tab", "Other tablet"] },
];

export const bookingIssues = [
  "Cracked screen",
  "Battery drains fast",
  "Won't charge",
  "Back glass",
  "Camera issue",
  "Water damage",
  "Something else",
];

export const bookingMethods = [
  { label: "Walk in / drop off", description: "At [STORE ADDRESS]" },
  { label: "Collection", description: "We fetch it in [AREAS]" },
];

export const bookingSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
