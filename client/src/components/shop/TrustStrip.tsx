import { BadgeCheck, CreditCard, ShieldCheck, Truck } from "lucide-react";

const items = [
  { title: "Genuine stock only", description: "Checked & never blacklisted", icon: BadgeCheck },
  { title: "90-day warranty", description: "On repairs & pre-owned", icon: ShieldCheck },
  { title: "Pay in 3 with Payflex", description: "Interest-free instalments", icon: CreditCard },
  { title: "Collect or deliver", description: "Same-day collection in store", icon: Truck },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="mt-[72px] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, ...item }) => (
        <div key={item.title} className="flex items-center gap-3.5 rounded-[20px] bg-white p-5 ring-1 ring-line">
          <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-ink">
            <Icon className="size-[22px] text-lime" aria-hidden />
          </span>
          <span>
            <b className="text-[15px]">{item.title}</b>
            <br />
            <span className="text-[13px] text-muted">{item.description}</span>
          </span>
        </div>
      ))}
    </section>
  );
}
