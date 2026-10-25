import { MessageCircle } from "lucide-react";

import { ButtonLink } from "@/components/ui/ButtonLink";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/data/site";

export function ContactCta() {
  return (
    <Reveal>
      <section
        id="contact"
        className="mt-24 flex scroll-mt-28 flex-wrap items-center justify-between gap-8 rounded-panel bg-brand p-7 text-white sm:p-12 lg:p-16"
        aria-labelledby="contact-title"
      >
        <div className="flex flex-[1_1_420px] flex-col gap-3">
          <h2 id="contact-title" className="text-[clamp(1.875rem,4vw,3rem)] font-bold leading-[1.05]">
            Questions? Chat to a human.
          </h2>
          <p className="text-[17px] leading-relaxed text-[#dce2ff]">
            Ask about a product, a repair or a trade-in — we usually reply within minutes during store hours.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={siteConfig.whatsappUrl} variant="light">
            <MessageCircle className="size-5 text-green-600" aria-hidden />
            WhatsApp us
          </ButtonLink>
          <ButtonLink href={`tel:${siteConfig.phone}`} variant="ghost" className="ring-white/30 bg-white/14">
            {siteConfig.phone}
          </ButtonLink>
        </div>
      </section>
    </Reveal>
  );
}
