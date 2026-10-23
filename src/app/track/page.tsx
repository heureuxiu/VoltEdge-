import type { Metadata } from "next";
import Link from "next/link";

import { TrackOrder } from "@/components/track/TrackOrder";
import { Container } from "@/components/ui/Container";
import { routes } from "@/data/site";

export const metadata: Metadata = {
  title: "Track order",
  description: "Check the live status of your order or repair.",
};

const helpCards = [
  { title: "Where's my reference?", body: "It's in your confirmation email or WhatsApp — orders start with VE-, repairs with RP-." },
  { title: "Collecting in store?", body: "Bring your ID and the reference. We'll message you as soon as it's ready." },
];

export default function TrackPage() {
  return (
    <Container className="pt-6">
      <TrackOrder />
      <section className="mt-[72px] grid gap-4 md:grid-cols-3">
        {helpCards.map((card) => (
          <div key={card.title} className="rounded-card bg-white p-6 ring-1 ring-line">
            <b className="font-display text-lg">{card.title}</b>
            <p className="mt-2 text-sm leading-relaxed text-muted">{card.body}</p>
          </div>
        ))}
        <div className="rounded-card bg-white p-6 ring-1 ring-line">
          <b className="font-display text-lg">Something wrong?</b>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            See our{" "}
            <Link href="#" className="font-semibold text-brand">
              refund policy
            </Link>{" "}
            or{" "}
            <Link href={routes.contact} className="font-semibold text-brand">
              contact us
            </Link>
            .
          </p>
        </div>
      </section>
    </Container>
  );
}
