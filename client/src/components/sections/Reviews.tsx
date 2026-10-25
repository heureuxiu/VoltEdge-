import { Star } from "lucide-react";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { reviewTopics } from "@/data/content";
import { cn } from "@/lib/utils";

/** Replace the placeholders with real Google reviews. */
export function Reviews() {
  return (
    <section className="mt-24" aria-labelledby="reviews-title">
      <SectionHeading
        eyebrow="Reviews"
        title={<span id="reviews-title">Loved by locals</span>}
        action={<span className="text-[15px] text-muted">[RATING] on Google · [COUNT] reviews</span>}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {reviewTopics.map((review, index) => (
          <Reveal key={review.topic} delay={index * 0.08}>
            <figure className="flex h-full flex-col gap-[18px] rounded-card bg-white p-7 ring-1 ring-line">
              <div className="flex gap-0.5" role="img" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className="size-[18px] fill-amber-500 text-amber-500" aria-hidden />
                ))}
              </div>
              <blockquote className="text-base leading-relaxed">
                [Paste a real customer review here — {review.topic}]
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3">
                <span className={cn("size-10 rounded-full", review.tint)} />
                <span className="flex flex-col">
                  <b className="text-sm">[CUSTOMER NAME]</b>
                  <span className="text-[13px] text-muted">{review.topic}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
