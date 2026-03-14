import Image from "next/image";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui";
import { routes } from "@/config";
import { recipeService } from "@/services/recipe.service";

interface RecipeCardData {
  id: string;
  title: string;
  imageUrl: string;
  likes: number;
  authorName: string;
  authorAvatar: string;
}

const featuredRecipes: RecipeCardData[] = [
  {
    id: "bbdef4df-d43c-42d8-9dc4-18fa1f67f9a1",
    title: "Choco-Mint Blast",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAacZJS7S6v8W2LIfo-BW98nyM5Cr2uKI25MyuSdBkAMfpbufJbG_PGRSs4NTJjK55KUIYenbV4peI3bvTf5wh669Qx3On_iR20Bi-dIflWeiy8NK8n6n39RL_hAfpy-Rfx9WLB1sTA4F2lw0taU74Da1x2-mJLPfQTZR_uV29u0ZKp_ELrHEqG4mnroTkxUlczpfacY5P6hLTX9qfmEuReq1UaD2NLBQcP2h3wAqvJjsth125AUAR669YnTCfijl0fPtlsVV4iEiw",
    likes: 120,
    authorName: "User123",
    authorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCl-iJ99p3oBI5_cLGFoCtFNrK644Vvps3fxTRJaIMs2c0q5Jt1E3l1XIlmPmVvWcMHkt0dODadMImtDpo97IDAtkScRWnaXedMfABvyj0GPGOBpxNEqHjMVh5q-UjH7BGF0C67q5DXyWluUOMuvw6gFkkwOS1jj09wYt6FFS34X-UpPrcbgDeTqYtSKqVBthNIZNX88U7GdX9KvmLiCLh6vD5mxSY4ARyYO8IsUdGH5W3lUf9KJ0KOR72zbVUd6FJ2pdExdtt83bs",
  },
  {
    id: "a3a2a6a6-f28a-40f4-a4f6-7b24f5a32b95",
    title: "Very Berry Swirl",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIAY76_ri7jXCpf6v2OvAn7LYh04j6sDSjiQ6fNDyQEG5A77Sea9qwVstIXvr-x5Riaw6NPQK1WjDHggq7kwhrdOMoL1vu1fZhpz70YD99A2QN0ltS-tR9QAW3IT_MMJKBVEpsj054lRUST4zxDy0umarRVedmQzsaI5INc5-ky1N2iWzeW-qXJhIPq3s2OGdfNfXxpupMUZpvqKyZCfAEEbOc5UBu7BadA6W8YrBE8FRA76lxG7N-5eQfEU-EBLUFC1x4D5bX9ds",
    likes: 98,
    authorName: "IceCreamFan",
    authorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBLf76fxd71ClULhC-UtMzh5CT8J9WbAoAgHWG1jhZXu-P3erc4HTN922eyTOHc3UPTuPrIeqSK4EylaRgNmDR01_VU-JQWvKbMOle4Hs_2uTyLQNMIcvT2tzOGSqwx-DvF9BzUNu7YkT2qIqu1DFHuIdQjILQK3cC6FuS7H2eYbqWPTIyYXheuJSO4JcOFhIWxcmjBd5Sl4GzxQC34HQ_s8PUnthdvtqC_s08nQ-S1ZNec53JtjEX7KhUeTVzOc91zgOnec-b81ls",
  },
  {
    id: "ebd54a93-51bf-4357-bb03-aa0f1a9bde6b",
    title: "Rainbow Sherbet",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDD_kqU3oirpR_po0ak-TgrxxKznKXKRwP9a53YbVuJNhpWf4loiHJFkPIbiih5ckrU00x96ALdRIGaEwHw4GjtP1EEQjMK1ZnLONsVEq2GPCEgwyufTw4PJNOISF0tg-f3raFbABbNdaNAU7N5PBN6R5aVabunhwoR9lAURr-XBh-iAIZgkMMO9kSDVPRqBZFZ3t-WQG4uo4QxEW8S_JPTomqQJbQK09hq-cUqxe1huLBW-rUrjUdRYHrRJmH1sW6ibCOFWg3hH4w",
    likes: 85,
    authorName: "SweetTooth",
    authorAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCP5h7QL1vObQbuZkQgMMMaJYwV9vWtAeu0yCBHJQt-JJOO6s6E-QcFtu3106weQMub8353pEhLkieMtFTAj7aeCL0e3pOw--O1H1dUwXZ4XT4lBjuUZmW9TDNbDzpudM9QHxsqEl80FINVYXgw15Es4lUZQ12yJ-8jB4xz6Ix-0HeA4rcSjDE_HEMHAXbNPqIs0uUPo1qIM2bai660hW-f4aAVcKBuE2hs55gNb__lBkqAel5fe_HsMFUmRmb1z49pIwp-nlLgD9M",
  },
];

function RecipeCard({ recipe }: { recipe: RecipeCardData }) {
  return (
    <Link 
      href={`/recipes/${recipe.id}`}
      className="group flex flex-col gap-4 rounded-2xl border border-transparent bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/10 hover:shadow-2xl hover:shadow-primary/10 dark:bg-surface-dark"
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden rounded-xl">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          width={400}
          height={300}
          className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Like badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-primary/15 px-3 py-1 backdrop-blur-sm">
          <MaterialIcon
            name="favorite"
            filled
            className="text-[16px] text-primary"
          />
          <span className="text-xs font-bold text-primary">
            {recipe.likes}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="px-2 pb-2">
        <h3 className="font-serif-display text-xl font-bold leading-tight text-text-main transition-colors group-hover:text-primary dark:text-white">
          {recipe.title}
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <Image
            src={recipe.authorAvatar}
            alt={recipe.authorName}
            width={24}
            height={24}
            className="size-6 rounded-full object-cover"
          />
          <p className="text-sm font-medium text-text-muted dark:text-gray-400">
            by{" "}
            <span className="font-semibold text-text-main dark:text-gray-200">
              {recipe.authorName}
            </span>
          </p>
        </div>
      </div>
    </Link>
  );
}

export async function TopRecipesSection() {
  let displayRecipes: RecipeCardData[] = featuredRecipes;

  try {
    const res = await recipeService.getAll(1, 3);
    if (res?.data?.items?.length) {
      displayRecipes = res.data.items.slice(0, 3).map((r) => ({
        id: r.id,
        title: r.flavorName,
        imageUrl:
          r.imageUrl ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuAuml-kcfcPWeQBjMtTp9qNy2__FOkkxDJDXMp0QJqHwBlOeWZADpnNTXmemZ9LqvyaimNAdVs1EGRnnOUxNMUVxkrc0G9BGEVgFph5XOdJhYy2DbTEeql1E5LtYvl2Ozk2t1qF1tNfOu5xOilaYGbIWexibTqnCvXEQdONhyYHbLYA2E4Z1DZsnovxi6InrGGTvSbitgbig_XcxY6jjCD031OVC4KSu7-vM88HV18iiqoRA9Y0GU2N_YkcSxDgjCk_I1c9wmUBWrA",
        likes: Math.floor(Math.random() * 50) + 50, // mock likes
        authorName: "IScream",
        authorAvatar:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuCl-iJ99p3oBI5_cLGFoCtFNrK644Vvps3fxTRJaIMs2c0q5Jt1E3l1XIlmPmVvWcMHkt0dODadMImtDpo97IDAtkScRWnaXedMfABvyj0GPGOBpxNEqHjMVh5q-UjH7BGF0C67q5DXyWluUOMuvw6gFkkwOS1jj09wYt6FFS34X-UpPrcbgDeTqYtSKqVBthNIZNX88U7GdX9KvmLiCLh6vD5mxSY4ARyYO8IsUdGH5W3lUf9KJ0KOR72zbVUd6FJ2pdExdtt83bs",
      }));
    }
  } catch (err) {
    console.error("Failed to load top recipes:", err);
  }

  return (
    <section className="mt-10">
      {/* Section wrapper with tinted background */}
      <div
        className="rounded-[2rem] bg-white px-8 py-10 md:px-12 md:py-12"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
              <span>✦</span> Community Choice
            </span>
            <h2 className="font-serif-display mt-3 text-3xl font-black tracking-tight text-text-main dark:text-white md:text-4xl">
              Fan Favorites of the Month
            </h2>
          </div>
          <Link
            href={routes.recipes}
            className="group flex items-center gap-1 text-sm font-bold text-primary transition-all hover:gap-2"
          >
            View All Recipes
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}
