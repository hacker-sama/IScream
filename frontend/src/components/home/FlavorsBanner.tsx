import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui";

const flavors = [
  {
    name: "Strawberry Dream",
    color: "from-pink-400 to-rose-500",
    bg: "bg-pink-50",
    emoji: "🍓",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAoVf3jipyH8bGPDnANmYJnNP2UGR9ATsLpkYBP6X_DXdFiHRSxR_9p4xdUlVz1n2LvXcslAb8hhIUTptqnm-Cy7UfVB7AXlStQQK3bWpqlmIHJEw5CJxOqtWl36jJlNy_VQxNTKP3bOumSscfq3PBqXjVJy8fM4LpJCm17DQ99SkEMuUF_5hH6RY12FQ0iKV-hWGLEMb39CZzBCnN-bQwB2mRoqSffJxNJJXJWGKJ5TKp6Rg33gUTJaQVe5RvPKwGNvS0bHlE1TI",
  },
  {
    name: "Vanilla Bliss",
    color: "from-amber-300 to-yellow-500",
    bg: "bg-amber-50",
    emoji: "🍦",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQEJSuiJRer8s1wL3Lvy4IMobHDHBW6_uXLcO8ea24q0HDFByir7vfeLTGAEVmvTlPem_--3SVhWiKHihIWKX-hYYXBUilYqT1LzaPFyeGWlliysxTbvGnj7IDZc3JcLjRIrG5IO3Gnp1xO7UCuda0kCfzJwmxw6XRb6qsn2TO55hz-UxWQQ6ok1LwavL_VxW1nNDIuW0NoFS0xqI_CNB44O-AuGFdUchxE_0328gZjc537lCMpa8opRwxJ5sKFSZKxlwH-UtnRTw",
  },
  {
    name: "Chocolate Heaven",
    color: "from-amber-700 to-amber-900",
    bg: "bg-orange-50",
    emoji: "🍫",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAacZJS7S6v8W2LIfo-BW98nyM5Cr2uKI25MyuSdBkAMfpbufJbG_PGRSs4NTJjK55KUIYenbV4peI3bvTf5wh669Qx3On_iR20Bi-dIflWeiy8NK8n6n39RL_hAfpy-Rfx9WLB1sTA4F2lw0taU74Da1x2-mJLPfQTZR_uV29u0ZKp_ELrHEqG4mnroTkxUlczpfacY5P6hLTX9qfmEuReq1UaD2NLBQcP2h3wAqvJjsth125AUAR669YnTCfijl0fPtlsVV4iEiw",
  },
  {
    name: "Mint Chip",
    color: "from-emerald-400 to-teal-600",
    bg: "bg-emerald-50",
    emoji: "🌿",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIAY76_ri7jXCpf6v2OvAn7LYh04j6sDSjiQ6fNDyQEG5A77Sea9qwVstIXvr-x5Riaw6NPQK1WjDHggq7kwhrdOMoL1vu1fZhpz70YD99A2QN0ltS-tR9QAW3IT_MMJKBVEpsj054lRUST4zxDy0umarRVedmQzsaI5INc5-ky1N2iWzeW-qXJhIPq3s2OGdfNfXxpupMUZpvqKyZCfAEEbOc5UBu7BadA6W8YrBE8FRA76lxG7N-5eQfEU-EBLUFC1x4D5bX9ds",
  },
];

export function FlavorsBanner() {
  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/5 via-white to-amber-50 px-8 py-12 md:px-12 md:py-14">
      {/* Decorative */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-amber-200/30 blur-3xl" />

      {/* Header */}
      <div className="relative mb-10 flex flex-col items-center text-center">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
          <MaterialIcon name="local_fire_department" className="text-sm" />
          Trending Now
        </span>
        <h2 className="font-serif-display text-3xl font-black tracking-tight text-text-main md:text-4xl">
          Our Signature Flavors
        </h2>
        <p className="mt-2 max-w-md text-base text-text-muted">
          Handcrafted with love, each flavor tells its own story
        </p>
      </div>

      {/* Flavor cards */}
      <div className="relative grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {flavors.map((flavor) => (
          <Link
            key={flavor.name}
            href="/recipes"
            className="group relative flex flex-col items-center gap-3 rounded-2xl bg-white/80 p-5 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="relative size-28 overflow-hidden rounded-2xl md:size-32">
              <Image
                src={flavor.image}
                alt={flavor.name}
                width={200}
                height={200}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-t ${flavor.color} opacity-20`}
              />
            </div>
            <div className="text-center">
              <span className="text-xl">{flavor.emoji}</span>
              <p className="mt-1 text-sm font-bold text-text-main group-hover:text-primary">
                {flavor.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
