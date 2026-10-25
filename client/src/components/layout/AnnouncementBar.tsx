import { announcements } from "@/data/site";
import { Marquee } from "@/components/ui/Marquee";

export function AnnouncementBar() {
  return (
    <div className="border-b border-line bg-ink-800 text-[13px]" aria-label="Store offers">
      <Marquee
        items={announcements}
        duration={38}
        className="h-[42px]"
        trackClassName="h-full items-center"
        renderItem={(message) => (
          <span className="flex items-center gap-2.5 pr-9">
            <span className="rounded-[5px] bg-lime px-[7px] py-1 text-[10px] font-bold uppercase tracking-[0.05em] text-ink">
              {message.tag}
            </span>
            <span className="font-medium text-white">{message.text}</span>
            <span aria-hidden className="ml-6 size-1 rounded-full bg-white/35" />
          </span>
        )}
      />
    </div>
  );
}
