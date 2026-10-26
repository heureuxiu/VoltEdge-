import Link from "next/link";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { siteConfig } from "@/data/site";

export function WhatsAppButton() {
  return (
    <Link
      href={siteConfig.whatsappUrl}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-green-600 py-3.5 pl-4 pr-5 text-sm font-semibold text-white shadow-[0_16px_32px_-12px_rgb(22_163_74/0.6)] transition-transform hover:-translate-y-0.5"
    >
      <WhatsAppIcon className="size-6" />
      <span className="hidden sm:inline">Shop / Trade / Repairs</span>
    </Link>
  );
}
