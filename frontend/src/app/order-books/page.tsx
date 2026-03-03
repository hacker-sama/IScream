import Link from "next/link";
import { routes } from "@/config";

export default function OrderBooksPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Scoop Up the Secrets: <span className="text-primary">Mr. A&apos;s Recipe Collection</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              From our parlor to your kitchen. Discover the magic behind our famous flavors with our exclusive cookbooks.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:scale-105 hover:-translate-y-0.5">
                View Collection
              </button>
              <button className="inline-flex h-12 items-center justify-center rounded-full bg-white dark:bg-white/10 px-8 text-base font-bold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-white/20 transition-all hover:bg-gray-50 dark:hover:bg-white/20">
                Learn More
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-white/5 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 ease-out relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnZJctqOY43WhOZ5XpuScd8y6iLiOEVEwEWB9CFAvQ1Gcn-E8zUwTT_Ovbf-Xf3xlA9hJ93Hv1n4RoLS0D4hikPDSln8MlJXGvF1ZH74EEVeqmaS2UJIIExBB0JgNLgt9plZSmBK03DNXgtuQIFVvQScSivBp4-Lbcy35b_9rarXuemLikygw0CH2vLGRjmz2fJCSxKxMX83tk-mD7_Z6qz_SrqraioDFcE632y7z_--7ehORWEeIGsgjFhrvI1ALcoGiSsUNerlE')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 shadow-lg">
                  <span className="material-symbols-outlined text-primary">auto_stories</span>
                  <span className="text-sm font-bold text-gray-900">Featured: The Summer Edit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="w-full max-w-7xl pb-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-transform hover:-translate-y-0.5">
            All Books
          </button>
          {["Sorbets", "Dairy-Free", "Classics", "Toppings", "Kids' Corner"].map((x) => (
            <button
              key={x}
              className="rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-white/10 px-6 py-2.5 text-sm font-bold text-gray-600 dark:text-gray-300 transition-all hover:border-primary hover:text-primary dark:hover:text-primary hover:shadow-md hover:-translate-y-0.5"
            >
              {x}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="w-full max-w-7xl pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {books.map((b) => (
            <article
              key={b.title}
              className="group relative flex flex-col gap-4 rounded-2xl bg-card-light dark:bg-card-dark p-4 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl border border-gray-100 dark:border-white/5"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url('${b.image}')` }}
                />
                <div className="absolute top-3 right-3">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 hover:text-primary shadow-sm backdrop-blur transition-colors">
                    <span className="material-symbols-outlined text-lg">favorite</span>
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {b.title}
                    </h3>
                    <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20">
                      {b.price}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{b.desc}</p>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover">
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  Buy Now
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 bg-gray-100 dark:bg-card-dark/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center gap-6 rounded-3xl bg-white dark:bg-card-dark p-10 md:p-16 shadow-xl border border-gray-100 dark:border-white/5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
              <span className="material-symbols-outlined text-4xl">lightbulb</span>
            </div>

            <h2 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white md:text-4xl">
              Have a flavor idea?
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
              Our community is built on creativity. Submit your wildest recipe ideas and if Mr. A picks it, it goes in our
              next book!
            </p>

            <Link
              href={routes.addRecipe}
              className="mt-4 flex min-w-[200px] items-center justify-center rounded-full bg-primary px-8 py-4 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:scale-105 hover:-translate-y-1"
            >
              Submit Recipe
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

const books = [
  {
    title: "The Classic Scoop",
    price: "$24.99",
    desc: "Master the basics of vanilla, chocolate, and strawberry. Perfect for beginners.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC4vXTKgm_jzDVZ1LBV-Al_QCtiJsxWH4jj1Sx_8p0Poht4fOOPU7wSZq83uaR6AvWYqaogDtlNy8E1f7Qm5NZGPWOJK9-Zu6jiC18XxaKhE9g-iKbkTtj06zueGlVjCOZ6napZsIPAtYf2KUqHJKXYndvaL7jsxqnXxTWXWXNLG3vm5e2xUZp8mja3g8xq3_ZpkvsshqrVFlojEjrpwj0WfTpj0rWYbVa_TS8I9NhOq5kvKyEk7D2QcQgKR5HoDRUjhoYp9Ud6Sd0",
  },
  {
    title: "Sorbet Summer",
    price: "$19.99",
    desc: "Refreshing, fruit-forward recipes for hot days. Dairy-free delights.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFoKnmwGM4KGtKgTlPtAOtRhIB7N51KdSersO2fKJkXQ-2ouCMkJeFuPa6ttaXfUJu074gBd6D9JeEC5yk85dM5pT-wWQbchXJhcBc9xpRWQ0i9jIVqeLiQKBwA9QZQo_nvN98--RJurbz05zwWn73MSK3ypZ7pGQX_E2m4wBUCHnY6TRWEf9EKg_Xoi1deUV3qVOu0uC5CBwq9EkYX5SdCFmCFrZK-PcaVC7rp2jy4pFCsM9Bzjf93KXatk2l-ECC92o1EUMBZjg",
  },
  {
    title: "The Sundae Guide",
    price: "$15.00",
    desc: "Sauces, toppings, and construction techniques for the ultimate treat.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC3QIM0qj-f5wP-AXTKYre7yUNq2qJvSyBY3iZUlaEZpFbweMstMCdSA4QM7qZd1HfPtkJzd9l59H5qnry1EuRxrSIEDRGY0FajiVYnygw_nW4cG4HUkjurMCQkbrAw2TtBqsmlx4IFXndicHcj-TDUzoXiNqtvHVz_CMklrCBsJ751sITz81cOQz5E1yeJHCkzZoPfmZGWSO8GdJXVJEg5d5_FU4doHqWyDOPqlGYQvWN4pf77c9PUThhfWVTMNxEjOcNS-6G7pyo",
  },
  {
    title: "Popsicle Party",
    price: "$18.50",
    desc: "Fun, frozen sticks for kids and adults alike. Easy to make.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBOLFzRPOMEX3Y0Y9ShSaPVG4j2ovo4Ch2rka_q8bR5OunKUS0WpLbWXjGuHXdib-n7iN-eImNu0boLXZvtfr-cDu5ItuyWVy70CZOsfHkufSBQRhuuBfKBUMd4Otz5RJivk8QC5hY8uEwEBliNwYGaau69zoS8slbZd7IXWZ_jFbx7nlZPg1c84glk5ZfVZlsiyfE5Viqajh4G8E_c6sddnM8OeC_ryXw8nkuhCeAuY5TjKonAKdtqKO380G3DcsWIAU0FeAKIt_Q",
  },
  {
    title: "Exotic Flavors",
    price: "$29.99",
    desc: "Travel the world through your tastebuds. Matcha, Ube, and more.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCOKEdZHYlrEOivnrdvIyvpGR-3bNN9RVyAPawED9sMXq5hkzp7ogdOBnFhIOLvNLSjLLoBUokf85n8fxHlyMvizRdv_F8x4Nbt1KdSBYwpEinEapVmRpOUQfkfy1M2r0JS9jnLLptwFrLmZqv_JET3_jDIAG3Bdd5rqS45pS7JI0zboXpgRD30GPl57BNa7XLCC6Lgo6YV4tmL65hmiGXqqGiqRAk8t0V_lKLUAg8s6RJ7uAiWeLuTsQnPYyELYyW-NfJMEB-kpuI",
  },
  {
    title: "Shake It Up",
    price: "$22.00",
    desc: "The ultimate guide to thick, creamy milkshakes and floats.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZk2XJHUeSgAeZe_TthEy8eaOERksV0U0XCsD7hHHhLgdM_kHUcl6749Of5jPCXpgLESspyWdoAl4LsgrzNiXVZ-9CDeD_g-mfNOjRJJ3pfKdazD76dVYb9hzuynuIwmArb2ElsH1oJ67IKkRCYTIqbfQomJQ-XTGaGJRfvj96K3xI4qBK5p4k-oih-QDhO5u6m6-tT1I0B3KPv58HC7lGnm6BSeRs08F1opeyM4DU0MSIIFY2nJZEiOvvLXhfSYgvmT0v8V2YuW8",
  },
];