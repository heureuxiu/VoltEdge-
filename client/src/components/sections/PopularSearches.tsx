import Link from "next/link";

import { Marquee } from "@/components/ui/Marquee";
import { popularSearches } from "@/data/site";

export function PopularSearches() {
  return (
    <section className="mt-24" aria-labelledby="searches-title">
      <h2 id="searches-title" className="mb-4 text-xl font-bold">
        Popular searches
      </h2>
      <Marquee
        items={popularSearches}
        duration={45}
        trackClassName="gap-2.5 pr-2.5"
        renderItem={(term) => (
          <Link
            href="/shop"
            className="block whitespace-nowrap rounded-full bg-white px-[18px] py-3 text-sm font-medium ring-1 ring-line transition-colors hover:bg-brand hover:text-white"
          >
            {term}
          </Link>
        )}
      />
    </section>
  );
}
