export default function RecipesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="w-full max-w-7xl py-8 md:py-12">
        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-12 shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden relative">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />

          <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
            <div className="flex-1 flex flex-col gap-6 text-center md:text-left items-center md:items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                New Recipes Added Weekly
              </div>

              <h1 className="text-4xl md:text-6xl font-black leading-[1.1] tracking-tight">
                Scoop Up <br />
                <span className="text-primary">The Fun!</span>
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
                Dive into Mr. A&apos;s secret stash of frozen delights. From classic sorbets to wild sundae experiments.
              </p>

              <div className="flex flex-wrap gap-3 justify-center md:justify-start pt-2">
                <button className="h-12 px-8 rounded-full bg-primary text-white font-bold text-base shadow-xl shadow-primary/20 hover:bg-red-600 transition-all flex items-center gap-2">
                  Browse Recipes
                  <span className="material-symbols-outlined">arrow_downward</span>
                </button>
                <button className="h-12 px-8 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 font-bold text-base hover:border-primary/30 transition-all">
                  Submit Yours
                </button>
              </div>
            </div>

            <div className="flex-1 w-full relative">
              <div
                className="aspect-square md:aspect-[4/3] w-full rounded-xl bg-gray-100 dark:bg-gray-800 bg-center bg-cover shadow-2xl rotate-2 hover:rotate-0 transition-all duration-500"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA98AAL8Wa1oSl2dPL2P1dj5abs97vYH8hIdaP95Kw3nkfVkQXTRALy8mpz5FImFyxZ0mJqt7pMr5YYyq1SMMHZtxUoq9iJW56OF2XuyeHcevchiVqVIth6xi_LalgH7CbrpA8qT21XiYpn0wiAyPkA3H6KTSTXQQ0W-ROLJf2H_o1--c1Rn6YVQwTgJhXJHVnpJXKVeymzZ3XLl55LOpqx1319uJeRhUVcHSj6fmBNx9Tmk7-Rd1Qfpdf7Pxl5SDwmHfXnYvvdMZ8')",
                }}
              />

              {/* Floating Badge */}
              <div
                className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-8 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl flex items-center gap-3 animate-bounce"
                style={{ animationDuration: "3s" }}
              >
                <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full text-yellow-600 dark:text-yellow-400">
                  <span className="material-symbols-outlined">star</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Top Rated</p>
                  <p className="font-bold">Mango Tango</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Ticker */}
      <section className="w-full max-w-7xl pb-8">
        <div className="flex gap-6 overflow-x-auto hide-scrollbar pb-2">
          {tickerItems.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-3 bg-white dark:bg-gray-800 pl-2 pr-4 py-2 rounded-full border border-gray-100 dark:border-gray-700 shrink-0 shadow-sm"
            >
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center border-2 border-white dark:border-gray-700"
                style={{ backgroundImage: `url('${t.avatar}')` }}
              />
              <p className="text-xs font-medium">
                <strong>{t.name}</strong> {t.action} <span className="text-primary">{t.recipe}</span>
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Filter Chips */}
      <section className="w-full max-w-7xl pb-6">
        <div className="flex flex-wrap gap-3">
          <button className="h-10 px-5 rounded-full bg-primary text-white text-sm font-bold shadow-md shadow-primary/20 transition-transform hover:scale-105">
            All
          </button>
          {["Sorbet", "Gelato", "Sundaes", "Dairy-Free", "Quick & Easy"].map((x) => (
            <button
              key={x}
              className="h-10 px-5 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-200 dark:hover:border-gray-600 text-sm font-bold transition-all hover:shadow-sm"
            >
              {x}
            </button>
          ))}
        </div>
      </section>

      {/* Recipe Grid */}
      <section className="w-full max-w-7xl pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group flex flex-col gap-3 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-800"
            >
              <div
                className="w-full aspect-[4/3] rounded-lg bg-gray-200 dark:bg-gray-800 bg-center bg-cover relative overflow-hidden"
                style={{ backgroundImage: `url('${c.image}')` }}
              >
                <div className="absolute top-3 left-3 bg-white/90 dark:bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">schedule</span> {c.time}
                </div>
                <div className="absolute top-3 right-3 bg-primary text-white px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-lg">
                  Free
                </div>
              </div>

              <div className="px-1 pb-2">
                <h3 className="text-lg font-bold leading-tight mb-1 group-hover:text-primary transition-colors">
                  {c.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 font-medium">
                  <span className="flex items-center gap-1">
                    <span className={`material-symbols-outlined text-sm ${c.levelIconColor}`}>{c.levelIcon}</span>{" "}
                    {c.level}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm text-orange-400">local_fire_department</span>{" "}
                    {c.kcal}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature / Locked Recipe Concept Section */}
      <section className="w-full bg-white dark:bg-gray-900 py-16 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">Recipe of the Month</h2>
            <p className="text-gray-500 dark:text-gray-400">Get a taste of what&apos;s inside. Ingredients are on us!</p>
          </div>

          <div className="bg-background-light dark:bg-black rounded-lg md:rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-200 dark:border-gray-800">
            {/* Left: Visuals & Meta */}
            <div className="md:w-5/12 relative">
              <div
                className="h-64 md:h-full w-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2sc8lGxdhBtWojSo5gQo6J9Mmt-T6s-pgs83THvxmXIwtCzEKyzRlDmi9ddK_0BsXyYwlE4qs-BIi9XfNhulj7acjLw0SmZw1aoMOfvV1spw6OtRpFqTKV0AxJRjt0B09QV7jT6t169z6ymvqzbGXCFwgSuai7wHZb04WgTvRCu9eYTY5giEqTIYa45SGmdLLJiOhKqjEtO1LJ39KxFEh4M1IIg55IeCxlLYoKjRDAQAjnMyxMXA28n1D1tIIbxJA8PdQ4cQ1EMU')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-8">
                <h3 className="text-white text-3xl font-black leading-none mb-2">Caramel Swirl</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    Hard
                  </span>
                  <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                    40 mins
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Content */}
            <div className="md:w-7/12 p-6 md:p-10 flex flex-col relative">
              {/* Ingredients */}
              <div className="mb-8">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">shopping_basket</span>
                  Ingredients
                </h4>

                <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
                  {ingredients.map((x) => (
                    <li key={x} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="size-1.5 rounded-full bg-primary" /> {x}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div className="relative flex-1">
                <h4 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-400 dark:text-gray-600">
                  <span className="material-symbols-outlined">menu_book</span>
                  Steps to Make
                </h4>

                <div aria-hidden="true" className="space-y-3 blur-[6px] select-none opacity-50 dark:opacity-30">
                  <p className="text-sm">
                    First, whisk the cream and sugar vigorously in a large chilled bowl until soft peaks form. Make sure
                    not to overbeat.
                  </p>
                  <p className="text-sm">
                    Pour the milk slowly while stirring. Add the vanilla extract and the pinch of sea salt. Mix gently.
                  </p>
                  <p className="text-sm">
                    Pour the mixture into your ice cream maker and churn for about 20 minutes. While it churns, warm the
                    caramel sauce slightly.
                  </p>
                  <p className="text-sm">
                    Once the ice cream is soft-serve consistency, drizzle the caramel in layers as you transfer it to a
                    freezer-safe container.
                  </p>
                </div>

                {/* Lock Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
                  <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs mx-auto transform transition-all hover:scale-105">
                    <div className="size-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-3">
                      <span className="material-symbols-outlined text-2xl">lock</span>
                    </div>
                    <h5 className="font-bold text-lg mb-1 leading-tight">Mr. A&apos;s Secret Steps</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                      Unlock the full recipe method and become an ice cream pro!
                    </p>
                    <button className="w-full h-10 rounded-full bg-primary text-white text-sm font-bold shadow-lg shadow-primary/30 hover:bg-red-600 transition-colors">
                      Join for Free
                    </button>
                    <p className="mt-3 text-[10px] text-gray-400">
                      Already a member?{" "}
                      <a className="underline hover:text-primary" href="#">
                        Login
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              {/* end Steps */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const tickerItems = [
  {
    name: "Sarah",
    action: "made",
    recipe: "Mango Tango!",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADuugAl_GHKeiKui8he88X5WW7B0wqcNKNZPc_rI5XhBzAjNHxp0DUSD2Cq7XLSMA3-yrFuiMAtrkgl4seyz-N136WOUVKjO8YW_eTvsBoWxWrl4CC6IaTZxAceudT0Vnhg25Ct75HZATXudphaTAuuf46FfJ69nLTq3-5Jg_tgngi8XuoAmPEut0ADv48UwxOvWnAvusiq-itRAFquOEAK8ssn4-n0pzILfg4MFA5dv_V-VPHErpeBACONeKeYRHcrcsuPWrpQOg",
  },
  {
    name: "Mike",
    action: "tried",
    recipe: "Choco-Loco",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDzY0yn9K1ohH3y0A3VwmbdRTz5co5hhIEuG4kCs8vuQ642oDajlB6NiWbXRgw3Uhl-Ik0UKVdNgIDgpC4T4IlOHw6Sh2x6BX40WODk-feOhxuiVsm6c3s3gGHj0O961GVSf7RSMbpHlCbapP-Uaow6IlhxgrWyMDcykTvyrWPm7ECDp5cBPNlYdOJdVGCYFjcYKXr9Ct-MiNuLZhtSCqfSNtEL2B6_X6WjbSTexnof_PqGta1GcRwydPFxVFNNVPKU9u0SlKexuQ8",
  },
  {
    name: "Jen",
    action: "loved",
    recipe: "Berry Blastoff",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6w5QuJ20e4PYcfJMOdBkCS-MQJ4BMolTUJh7S8RyHlHLQaY4gi45_JLAUeiNDAP1d44DpWU5Z1AJAPLTKFFU3DDUwo9ZoTuKkmb96nf-QQJRoko6qG_xfuy_J1dN5BQJEgItXyMbXo-EfAJ7TjrfIdnpxQjLe-PzCt0DoZb76HQ6SEya3MGeTEF3TQF_z8rIvdghMTt9rFuXqCZjg9d3l7o5x8gfzbVAgLIM-8C-kdH8lpe-M6P7iCcfLWDgDz4hYXuCxTkk8RLQ",
  },
  {
    name: "Tom",
    action: "cooked",
    recipe: "Vanilla Dream",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDCJre7OEgqoK7t_HpmzGQPqwgHkSjh7A2D1Ns9mxkPmndt3_oqXUVD053DjNyK5NUNsWsrVCv1JgbX7SyztvXOijIMYC01BFsqwVOpUidvlsaLLDeIFWzqUGCAzY7efDdYZP9wcpREMlEBHLjg3r9igRmQRVfvNLBm0MaxEjto0u8eLDNKhlZu_KfMxQE1BC9XbTApgPcPGodAL1k5MEeIg8B5O7LYiwV9wnvhC0SsFAm79EyqtGj_a7eClDj8I_VZ-bZmkDA7bEY",
  },
];

const cards = [
  {
    title: "Berry Blastoff",
    time: "15m",
    level: "Easy",
    levelIcon: "sentiment_satisfied",
    levelIconColor: "text-green-500",
    kcal: "120 kcal",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuml-kcfcPWeQBjMtTp9qNy2__FOkkxDJDXMp0QJqHwBlOeWZADpnNTXmemZ9LqvyaimNAdVs1EGRnnOUxNMUVxkrc0G9BGEVgFph5XOdJhYy2DbTEeql1E5LtYvl2Ozk2t1qF1tNfOu5xOilaYGbIWexibTqnCvXEQdONhyYHbLYA2E4Z1DZsnovxi6InrGGTvSbitgbig_XcxY6jjCD031OVC4KSu7-vM88HV18iiqoRA9Y0GU2N_YkcSxDgjCk_I1c9wmUBWrA",
  },
  {
    title: "Choco-Loco",
    time: "30m",
    level: "Medium",
    levelIcon: "sentiment_neutral",
    levelIconColor: "text-yellow-500",
    kcal: "340 kcal",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDPlDU6Sq5Y4zqC0n053KlgOivHzk4TPX8jr4O-6hzfWtv8QLfwvIo52s5vh7D4ssifikVDaAQgvKkXiuIYqzyu78WcxupCOix31GblGJsuVa6s7H8uVxfprmP1qrQTZyW6wF4-NaC8K1gAgxnF-Rxoyd37U4K69LDtOMMYFYHuBKd0NnTMvqIyelL6FYHMWPEB_WP5opyaSYpkj4iu1wd_mjfJb_oRNkIz-AyX8EuwmN848SUaaC1OX1mBcYAP11LFKlKbwuphm7c",
  },
  {
    title: "Mango Tango",
    time: "20m",
    level: "Easy",
    levelIcon: "sentiment_satisfied",
    levelIconColor: "text-green-500",
    kcal: "180 kcal",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC27S-syMf2O80gzHJeD2GAJ2OjOfR541746r7OhXlgUZPUFzhrLkIs83b6tAD0gO7k3oCPM4FSnt83g2fe1y_YALn1HL8nxaHo153YWFpaW32t7lOrSdDsEIXE4GVpzUEVPciOXL4QxS5Qw_TtGFn6ecelVNTTG-B2dxJNWN7EHrdH50wxBa2YwxkponCYPpi1jkJpTDfXX_1ZiKXnc3Zwzo5_OOdqW76I4ztoNPvUmWi3Y2-YL3E7BBrLL3ElX22_uApo56RNluY",
  },
  {
    title: "Minty Fresh",
    time: "25m",
    level: "Medium",
    levelIcon: "sentiment_neutral",
    levelIconColor: "text-yellow-500",
    kcal: "210 kcal",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDstF0Ev6rPxO6FmccDdYSSZ1BBzNlxdggfuGs-jJ0-diUYWocR6e-R9FGhDL-pE9NqUXVYvjQgAr8YnJdW09rl3aS4BhuF5GBWh2AikuaNbGKW2uMX3Gqx1JHI1cJ8ykYhaEvBxfD6Tox1awPHR33AhCfoh07XKDn3hWEpEWHNIp3D9_i002wB1ZGTxwYJYBHiynQlRspf0OE-CIwhlPUaJQBdfGl2XVE7t_2zpBKpQtEwHQXOp0FBDGAG7BU5BErehEUzlAFeEkY",
  },
];

const ingredients = [
  "2 cups Heavy Cream",
  "1 cup Whole Milk",
  "3/4 cup Sugar",
  "1 pinch Sea Salt",
  "1 tsp Vanilla Extract",
  "1/2 cup Caramel Sauce",
];