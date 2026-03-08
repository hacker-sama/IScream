import { MaterialIcon } from "@/components/ui";
import Link from "next/link";

const perks = [
  {
    icon: "icecream",
    title: "50+ Exclusive Recipes",
    desc: "Secret family recipes you won't find anywhere else",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: "local_shipping",
    title: "Free Delivery",
    desc: "Free shipping on all book orders over $25",
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    icon: "groups",
    title: "10k+ Community",
    desc: "Join ice cream lovers sharing recipes daily",
    color: "text-purple-500",
    bg: "bg-purple-50",
  },
  {
    icon: "workspace_premium",
    title: "Premium Access",
    desc: "Unlock VIP recipes, live sessions & more",
    color: "text-amber-500",
    bg: "bg-amber-50",
  },
];

export function PromoBanner() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 px-8 py-12 md:px-14 md:py-16">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-amber-400/15 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-0 h-40 w-40 rounded-full bg-pink-400/10 blur-3xl" />

      {/* Content */}
      <div className="relative">
        {/* Top row: headline */}
        <div className="mb-10 flex flex-col items-center text-center md:mb-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <MaterialIcon name="auto_awesome" className="text-sm" />
            Why Choose IScream
          </span>
          <h2 className="font-serif-display max-w-lg text-3xl font-black leading-tight text-white md:text-4xl">
            Everything You Need for the{" "}
            <span className="bg-gradient-to-r from-primary to-amber-400 bg-clip-text text-transparent">
              Perfect Scoop
            </span>
          </h2>
        </div>

        {/* Perks grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:bg-white/10"
            >
              <div
                className={`flex size-12 items-center justify-center rounded-xl ${perk.bg}`}
              >
                <MaterialIcon
                  name={perk.icon}
                  filled
                  className={`text-[24px] ${perk.color}`}
                />
              </div>
              <h3 className="text-base font-bold text-white">{perk.title}</h3>
              <p className="text-sm leading-relaxed text-gray-400">
                {perk.desc}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/membership"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 hover:shadow-primary/50"
          >
            <MaterialIcon name="card_membership" className="text-[20px]" />
            Become a Member
          </Link>
        </div>
      </div>
    </section>
  );
}
