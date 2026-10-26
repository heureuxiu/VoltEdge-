import { CreditCard, SealCheck, ShieldCheck, Truck } from "@phosphor-icons/react/dist/ssr";

const items = [
  { title: "Genuine stock only", description: "Checked & never blacklisted", icon: SealCheck },
  { title: "90-day warranty", description: "On repairs & pre-owned", icon: ShieldCheck },
  { title: "Pay in 3 with Payflex", description: "Interest-free instalments", icon: CreditCard },
  { title: "Collect or deliver", description: "Same-day collection in store", icon: Truck },
];

export function TrustStrip() {
  return (
    <section aria-label="Why shop with us" className="mt-[72px] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, ...item }) => (
        <div
          key={item.title}
          className={`group flex items-center gap-4 rounded-[20px] bg-white p-5 ring-1 ring-line transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgb(17_17_17/0.3)]`}
        >
          <Icon className="size-10 shrink-0 text-ink transition-transform duration-300 group-hover:scale-110" weight="regular" aria-hidden />
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
