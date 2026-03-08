"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { recipeService } from "@/services";
import { MaterialIcon } from "@/components/ui/MaterialIcon";
import type { RecipeDetail } from "@/types";

const FALLBACK_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAuml-kcfcPWeQBjMtTp9qNy2__FOkkxDJDXMp0QJqHwBlOeWZADpnNTXmemZ9LqvyaimNAdVs1EGRnnOUxNMUVxkrc0G9BGEVgFph5XOdJhYy2DbTEeql1E5LtYvl2Ozk2t1qF1tNfOu5xOilaYGbIWexibTqnCvXEQdONhyYHbLYA2E4Z1DZsnovxi6InrGGTvSbitgbig_XcxY6jjCD031OVC4KSu7-vM88HV18iiqoRA9Y0GU2N_YkcSxDgjCk_I1c9wmUBWrA";

/* ─── Page ───────────────────────────────────────────── */
export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());

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

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

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

  const ingredientLines = recipe.ingredients?.split("\n").filter(Boolean) ?? [];
  const procedureLines = recipe.procedure?.split("\n").filter(Boolean) ?? [];

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 bg-[#f9f9f9] dark:bg-gray-950">
      <div className="w-full max-w-5xl px-4 md:px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 pt-5 pb-3 text-sm text-gray-400">
          <Link href="/recipes" className="hover:text-primary transition-colors">
            Recipes
          </Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-gray-700 dark:text-gray-200 font-medium truncate max-w-xs">
            {recipe.flavorName}
          </span>
        </nav>

        {/* ── Hero: title left + image right ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start py-4">

          {/* Left — title, meta, actions */}
          <div className="flex flex-col gap-4">
            <h1 className="text-4xl md:text-[2.75rem] font-black leading-tight tracking-tight text-gray-900 dark:text-white">
              {recipe.flavorName}
            </h1>

            {recipe.shortDescription && (
              <p className="text-base text-gray-500 dark:text-gray-300 leading-relaxed">
                {recipe.shortDescription}
              </p>
            )}

            {/* Author + rating */}
            <div className="flex items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-black">
                IC
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">By IScream</span>
              <div className="flex items-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <MaterialIcon key={s} name="star" filled className="text-[16px]" />
                ))}
                <span className="text-xs text-gray-500 ml-1 font-semibold">5.0</span>
              </div>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "schedule", label: "Prep: 20m" },
                { icon: "soup_kitchen", label: "Cook: 45m" },
                { icon: "icecream", label: "Yield: 1 Quart" },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300"
                >
                  <span className="material-symbols-outlined text-[16px] text-primary">{icon}</span>
                  {label}
                </span>
              ))}
            </div>

            {/* Difficulty */}
            <div>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
                <span className="material-symbols-outlined text-[14px]">bar_chart</span>
                Intermediate
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-5 pt-2 border-t border-gray-200 dark:border-gray-800">
              {[
                { icon: "print", label: "Print Recipe" },
                { icon: "favorite_border", label: "Save" },
                { icon: "share", label: "Share" },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right — hero image with calories overlay */}
          <div className="relative">
            <div
              className="w-full aspect-[4/3] rounded-2xl bg-gray-200 dark:bg-gray-800 bg-center bg-cover shadow-xl"
              style={{ backgroundImage: `url('${recipe.imageUrl || FALLBACK_IMG}')` }}
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl bg-white dark:bg-gray-900 px-4 py-3 shadow-lg">
              <MaterialIcon name="local_fire_department" filled className="text-xl text-primary" />
              <div>
                <p className="text-lg font-black leading-none text-gray-900 dark:text-white">240</p>
                <p className="text-[10px] leading-none text-gray-400 mt-0.5">Calories per serving</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Content: Ingredients sidebar + Instructions ── */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 mt-6 items-start">

          {/* Ingredients card */}
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 text-base font-black text-gray-800 dark:text-white">
              <span className="material-symbols-outlined text-primary text-[18px]">kitchen</span>
              Ingredients
            </h2>

            {ingredientLines.length > 0 ? (
              <ul className="space-y-3">
                {ingredientLines.map((line, i) => {
                  const clean = line.replace(/^[-•*\d.)]\s*/, "").trim();
                  const isChecked = checked.has(i);
                  return (
                    <li
                      key={i}
                      className="flex cursor-pointer items-start gap-3"
                      onClick={() => toggleCheck(i)}
                    >
                      <span
                        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border-2 transition-all ${
                          isChecked
                            ? "border-primary bg-primary"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {isChecked && (
                          <span className="material-symbols-outlined bold text-white text-[11px]">
                            check
                          </span>
                        )}
                      </span>
                      <span
                        className={`text-sm leading-snug transition-colors ${
                          isChecked
                            ? "text-gray-400 line-through"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {clean}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm italic text-gray-400">No ingredients listed.</p>
            )}
          </div>

          {/* Instructions column */}
          <div className="flex flex-col gap-6">

            {/* Chef's Tip */}
            <div className="flex gap-4 rounded-2xl bg-gray-900 dark:bg-gray-800 p-5">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                <MaterialIcon name="tips_and_updates" filled className="text-[18px]" />
              </div>
              <div>
                <p className="mb-1 text-sm font-bold text-white">Chef&apos;s Tip</p>
                <p className="text-sm leading-relaxed text-gray-400">
                  For the best texture, make sure your ingredients are chilled before mixing.
                  Letting the base rest overnight gives a smoother, creamier result!
                </p>
              </div>
            </div>

            {/* Steps */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h2 className="mb-6 flex items-center gap-2 text-base font-black text-gray-800 dark:text-white">
                <span className="material-symbols-outlined text-primary text-[18px]">receipt_long</span>
                Instructions
              </h2>

              {procedureLines.length > 0 ? (
                <ol className="space-y-7">
                  {procedureLines.map((step, i) => {
                    const clean = step.replace(/^\d+[.)]\s*/, "").trim();
                    const words = clean.split(" ");
                    const title = words.slice(0, 4).join(" ");
                    const body = words.slice(4).join(" ");
                    return (
                      <li key={i} className="flex gap-5">
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white text-sm font-black shadow-md shadow-primary/20">
                          {i + 1}
                        </span>
                        <div className="pt-0.5">
                          {title && (
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
                          )}
                          {body && (
                            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{body}</p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              ) : (
                <p className="text-sm italic text-gray-400">No instructions listed.</p>
              )}
            </div>
          </div>
        </div>

        {/* ── Community Reviews ── */}
        <div className="mt-8 mb-2 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-base font-black text-gray-800 dark:text-white">Community Reviews</h2>
            <button className="text-sm font-bold text-primary hover:underline">Write a Review</button>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Score */}
            <div className="shrink-0 text-center">
              <p className="text-5xl font-black text-gray-900 dark:text-white">4.8</p>
              <div className="mt-1 flex items-center justify-center gap-0.5 text-amber-500">
                {[1, 2, 3, 4].map((s) => (
                  <MaterialIcon key={s} name="star" filled className="text-base" />
                ))}
                <MaterialIcon name="star_half" filled className="text-base" />
              </div>
              <p className="mt-1 text-xs text-gray-400">Based on 24 reviews</p>
            </div>

            {/* Rating bars */}
            <div className="flex-1 w-full space-y-2">
              {([[5, 80],[4, 12],[3, 5],[2, 2],[1, 1]] as [number, number][]).map(([star, pct]) => (
                <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="w-2 shrink-0">{star}</span>
                  <div className="flex-1 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      className="rating-bar-fill h-full rounded-full bg-primary"
                      style={{ "--bar-pct": `${pct}%` } as React.CSSProperties}
                    />
                  </div>
                  <span className="w-8 text-right">{pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 text-center text-sm italic text-gray-400">
            No reviews yet — be the first to share your experience!
          </p>
        </div>

      </div>
    </div>
  );
}
