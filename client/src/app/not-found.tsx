import { ButtonLink } from "@/components/ui/ButtonLink";
import { Container } from "@/components/ui/Container";
import { routes } from "@/data/site";

export default function NotFound() {
  return (
    <Container className="pt-6">
      <section className="surface-glow relative flex flex-col items-start gap-5 overflow-hidden rounded-panel p-8 text-ink ring-1 ring-line sm:p-16">
        <div aria-hidden className="absolute -right-40 -top-52 size-[600px] animate-spin-slow rounded-full border border-dashed border-brand/10" />
        <div aria-hidden className="absolute -right-10 bottom-0 size-64 rounded-full bg-white opacity-[0.2] blur-[90px]" />
        <span className="font-display text-[clamp(4rem,12vw,9rem)] font-bold leading-none text-brand">404</span>
        <h1 className="text-[clamp(1.75rem,4vw,3rem)] font-bold">This page went offline.</h1>
        <p className="max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href={routes.home} variant="accent">Back to home</ButtonLink>
          <ButtonLink href={routes.shop} variant="outline-dark">Browse the shop</ButtonLink>
        </div>
      </section>
    </Container>
  );
}
