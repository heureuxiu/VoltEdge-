import { BadgeCheck, Quote, Star } from "lucide-react";

import { Marquee } from "@/components/ui/Marquee";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviewTopics } from "@/data/content";
import { cn } from "@/lib/utils";

type Review = (typeof reviewTopics)[number];

/** Card looks rotate so the sliding rows have rhythm: white, cream, black. */
const variants = [
  { card: "border border-[#d4d4d8] bg-white", quote: "bg-ink text-white", text: "text-ink", sub: "text-muted", chip: "bg-surface text-ink", avatar: "bg-ink text-white" },
  { card: "border border-[#ecd77a] bg-[#fef4cc]", quote: "bg-ink text-white", text: "text-ink", sub: "text-ink/60", chip: "bg-white/70 text-ink", avatar: "bg-white text-ink" },
  { card: "border border-ink bg-ink text-white", quote: "bg-white text-ink", text: "text-white", sub: "text-white/60", chip: "bg-white/10 text-white", avatar: "bg-[#ffc933] text-ink" },
];

/** Replace the placeholder text and names with real Google reviews. */
function ReviewCard({ review, variant }: { review: Review; variant: number }) {
  const v = variants[variant % variants.length];

  return (
    <figure
      className={cn(
        "group relative mr-4 flex h-full w-[290px] flex-col gap-4 overflow-hidden rounded-[22px] p-5 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_32px_56px_-28px_rgb(17_17_17/0.5)] sm:w-[330px]",
        v.card,
      )}
    >
      <div className="flex items-center justify-between">
        <span className={cn("grid size-9 place-items-center rounded-full", v.quote)}>
          <Quote className="size-4 fill-current" aria-hidden />
        </span>
        <div className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
          {Array.from({ length: 5 }, (_, i) => (
            <Star key={i} className="size-4 fill-[#ffb400] text-[#ffb400]" aria-hidden />
          ))}
        </div>
      </div>

      <blockquote className={cn("text-[15px] font-medium leading-[1.55]", v.text)}>
        [Paste a real customer review here — {review.topic}]
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-full font-display text-base font-bold", v.avatar)}>C</span>
        <span className="flex min-w-0 flex-col gap-1">
          <b className={cn("flex items-center gap-1.5 text-sm", v.text)}>
            [CUSTOMER NAME]
            <BadgeCheck className="size-4 shrink-0 fill-[#2347ff] text-white" aria-label="Verified customer" />
          </b>
          <span className={cn("w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold", v.chip)}>{review.topic}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function Reviews() {
  const secondRow = [...reviewTopics.slice(3), ...reviewTopics.slice(0, 3)];

  return (
    <section className="mt-24" aria-labelledby="reviews-title">
      <SectionHeading eyebrow="Reviews" title={<span id="reviews-title">Loved by locals</span>} />
      <Reveal className="-mx-4 flex flex-col gap-4 sm:-mx-6">
        <Marquee
          items={reviewTopics}
          duration={60}
          fade={false}
          className="py-3 -my-3"
          renderItem={(review, index) => <ReviewCard review={review} variant={index} />}
        />
        <Marquee
          items={secondRow}
          duration={70}
          fade={false}
          className="py-3 -my-3"
          reverse
          renderItem={(review, index) => <ReviewCard review={review} variant={index + 1} />}
        />
      </Reveal>
    </section>
  );
}
