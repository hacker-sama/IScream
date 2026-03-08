"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { recipeService } from "@/services";
import { useAuth } from "@/context/AuthContext";
import type { RecipeDetail } from "@/types";

const FALLBACK_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuml-kcfcPWeQBjMtTp9qNy2__FOkkxDJDXMp0QJqHwBlOeWZADpnNTXmemZ9LqvyaimNAdVs1EGRnnOUxNMUVxkrc0G9BGEVgFph5XOdJhYy2DbTEeql1E5LtYvl2Ozk2t1qF1tNfOu5xOilaYGbIWexibTqnCvXEQdONhyYHbLYA2E4Z1DZsnovxi6InrGGTvSbitgbig_XcxY6jjCD031OVC4KSu7-vM88HV18iiqoRA9Y0GU2N_YkcSxDgjCk_I1c9wmUBWrA";

/* ─── Locked content overlay ──────────────────────── */
function LockedOverlay() {
  const { isLoggedIn } = useAuth();

  return (
    <div className="relative rounded-xl overflow-hidden">
      {/* Blurred placeholder */}
      <div className="blur-sm select-none pointer-events-none px-6 py-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
      </div>

      {/* Lock CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="bg-primary/10 p-4 rounded-full mb-4">
          <span className="material-symbols-outlined text-4xl text-primary">
            lock
          </span>
        </div>
        <h3 className="text-lg font-bold mb-1">Members Only</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center max-w-xs">
          {isLoggedIn
            ? "Subscribe to a membership plan to unlock full recipe details."
            : "Log in and subscribe to unlock the full recipe."}
        </p>
        <Link
          href={isLoggedIn ? "/membership" : "/login"}
          className="h-11 px-8 rounded-full bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 hover:bg-red-600 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">
            {isLoggedIn ? "card_membership" : "login"}
          </span>
          {isLoggedIn ? "View Membership Plans" : "Log In"}
        </Link>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    recipeService
      .getById(id)
      .then((res) => setRecipe(res.data ?? null))
      .catch(() => setError("Could not load this recipe."))
      .finally(() => setLoading(false));
  }, [id]);

  /* Loading */
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  /* Error */
  if (error || !recipe) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-5xl text-red-400">error</span>
        <p className="text-gray-500 dark:text-gray-400">{error ?? "Recipe not found."}</p>
        <Link
          href="/recipes"
          className="h-10 px-6 rounded-full bg-primary text-white text-sm font-bold flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Back to Recipes
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full pb-16">
      {/* Back link */}
      <div className="w-full max-w-4xl pt-6 pb-2">
        <Link
          href="/recipes"
          className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          All Recipes
        </Link>
      </div>

      {/* Hero image */}
      <div className="w-full max-w-4xl">
        <div
          className="w-full aspect-[16/7] rounded-2xl bg-gray-200 dark:bg-gray-800 bg-center bg-cover shadow-lg"
          style={{ backgroundImage: `url('${recipe.imageUrl || FALLBACK_IMG}')` }}
        />
      </div>

      {/* Content */}
      <div className="w-full max-w-4xl mt-8 flex flex-col gap-8">
        {/* Title & description */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-3xl md:text-4xl font-black">{recipe.flavorName}</h1>
            {recipe.isLocked && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase">
                <span className="material-symbols-outlined text-sm">lock</span>
                Premium
              </span>
            )}
          </div>
          {recipe.shortDescription && (
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {recipe.shortDescription}
            </p>
          )}
        </div>

        {/* Two columns: Ingredients + Procedure */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          {/* Ingredients */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">kitchen</span>
              Ingredients
            </h2>
            {recipe.isLocked ? (
              <LockedOverlay />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <div className="prose dark:prose-invert prose-sm max-w-none whitespace-pre-line">
                  {recipe.ingredients}
                </div>
              </div>
            )}
          </div>

          {/* Procedure */}
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">receipt_long</span>
              Procedure
            </h2>
            {recipe.isLocked ? (
              <LockedOverlay />
            ) : (
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                <div className="prose dark:prose-invert prose-sm max-w-none whitespace-pre-line">
                  {recipe.procedure}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
