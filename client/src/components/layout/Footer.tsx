import Link from "next/link";

import { Container } from "@/components/ui/Container";
import { Logo } from "@/components/ui/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { footerColumns, siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-ink bg-ink text-muted-dark">
      <Container className="flex flex-col gap-14 pb-8 pt-[72px]">
        <div className="flex flex-wrap items-end justify-between gap-8 border-b border-white/10 pb-12">
          <p className="max-w-md font-display text-[clamp(1.75rem,3.4vw,2.5rem)] font-bold leading-[1.1] text-white">
            Get deals &amp; repair tips in your inbox.
          </p>
          <NewsletterForm />
        </div>

        <div className="grid grid-cols-2 gap-10 text-sm sm:grid-cols-3 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-3.5 sm:col-span-3 lg:col-span-1">
            <Logo tone="dark" />
            <p className="leading-relaxed">{siteConfig.tagline} Repairs · Sales · Support.</p>
          </div>

          {footerColumns.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h3 className="font-sans text-sm font-bold text-white">{column.title}</h3>
              {column.links.map((link) => (
                <Link key={link.label} href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              ))}
            </div>
          ))}

          <div className="flex flex-col gap-3">
            <h3 className="font-sans text-sm font-bold text-white">Get in touch</h3>
            <span>{siteConfig.phone}</span>
            <span>{siteConfig.email}</span>
            <span>{siteConfig.address}</span>
            <Link href={siteConfig.mapsUrl} className="text-white hover:underline">
              View on Google Maps →
            </Link>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 pt-6 text-[13px]">
          <span>
            © {siteConfig.copyrightYear} {siteConfig.name}. All rights reserved.
          </span>
          <span>Repairs · Sales · Support</span>
        </div>
      </Container>
    </footer>
  );
}
