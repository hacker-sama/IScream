"use client";

import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { MaterialIcon } from "@/components/ui";
import { getRecipeBySlug, AUTHOR_AVATAR } from "../data";

export default function PremiumRecipeDetailPage() {
  const params = useParams<{ slug: string }>();
  const recipe = getRecipeBySlug(params.slug);

  const [checked, setChecked] = useState<Set<number>>(new Set());

  if (!recipe) notFound();

  function toggleCheck(i: number) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const chips = [
    recipe.prep ? { icon: "schedule", label: `Prep: ${recipe.prep}` } : null,
    recipe.cook ? { icon: "timelapse", label: `Cook: ${recipe.cook}` } : null,
    { icon: "icecream", label: `Yield: ${recipe.yield}` },
  ].filter(Boolean) as { icon: string; label: string }[];

  return (
    <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8 py-8 px-4 md:px-12 xl:px-0">
      {/* ── Hero ── */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left: text */}
        <div className="flex flex-col gap-6 flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-[#896169] dark:text-gray-400">
            <Link href="/membership/vip" className="hover:underline cursor-pointer">
              Recipes
            </Link>
            <MaterialIcon name="chevron_right" className="text-[16px]" />
            <span className="hover:underline cursor-pointer">{recipe.category}</span>
            <MaterialIcon name="chevron_right" className="text-[16px]" />
            <span className="text-primary font-medium">{recipe.flavorName}</span>
          </div>

          {/* Title & description */}
          <div className="flex flex-col gap-3">
            <h1 className="text-[#181112] dark:text-white text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] tracking-[-0.033em]">
              {recipe.flavorName}
            </h1>
            <p className="text-[#896169] dark:text-gray-300 text-lg leading-relaxed max-w-2xl">
              {recipe.shortDescription}
            </p>
          </div>

          {/* Author & rating */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 pr-4 border-r border-gray-200 dark:border-gray-700">
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url('${AUTHOR_AVATAR}')` }}
              />
              <span className="text-sm font-bold">By Mr. A</span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span className="font-bold text-lg">{recipe.rating}</span>
              <span className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <MaterialIcon key={i} name="star" filled className="text-[20px]" />
                ))}
              </span>
              <span className="text-[#896169] dark:text-gray-400 text-sm ml-1 underline decoration-dotted cursor-pointer hover:text-primary">
                ({recipe.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Chips */}
          <div className="flex gap-3 flex-wrap">
            {chips.map((c) => (
              <div
                key={c.label}
                className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-[#f4f0f1] dark:bg-white/10 pl-4 pr-4 transition-transform hover:scale-105 cursor-default"
              >
                <MaterialIcon name={c.icon} className="text-[18px] text-[#896169] dark:text-gray-400" />
                <p className="text-[#181112] dark:text-white text-sm font-bold">{c.label}</p>
              </div>
            ))}
            <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 pl-4 pr-4 border border-primary/20">
              <MaterialIcon name="bar_chart" className="text-[18px] text-primary" />
              <p className="text-primary text-sm font-bold">{recipe.difficulty}</p>
            </div>
            {recipe.specialBadge && (
              <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary/10 pl-4 pr-4 border border-primary/20">
                <MaterialIcon name="verified" className="text-[18px] text-primary" />
                <p className="text-primary text-sm font-bold">{recipe.specialBadge}</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 mt-2">
            <button className="flex items-center gap-2 bg-[#f8f6f6] dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#181112] dark:text-white px-6 py-3 rounded-full font-bold transition-all shadow-sm">
              <MaterialIcon name="print" />
              <span>Print Recipe</span>
            </button>
            <button className="flex items-center gap-2 bg-[#f8f6f6] dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#181112] dark:text-white px-6 py-3 rounded-full font-bold transition-all shadow-sm group">
              <MaterialIcon name="favorite" filled className="group-hover:text-primary transition-colors" />
              <span>Save</span>
            </button>
            <button className="flex items-center gap-2 bg-[#f8f6f6] dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-[#181112] dark:text-white px-6 py-3 rounded-full font-bold transition-all shadow-sm">
              <MaterialIcon name="share" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Right: image */}
        <div className="w-full lg:w-[50%] xl:w-[45%] relative group">
          <div className="w-full aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden shadow-xl rotate-1 group-hover:rotate-0 transition-all duration-500">
            <div
              className="w-full h-full bg-center bg-no-repeat bg-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: `url('${recipe.imageUrl}')` }}
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-lg border border-gray-100 dark:border-white/5 max-w-[200px] hidden md:block">
            <div className="flex items-start gap-3">
              <MaterialIcon name="local_fire_department" className="text-primary text-3xl" />
              <div>
                <p className="font-bold text-lg leading-none">{recipe.calories}</p>
                <p className="text-xs text-[#896169] dark:text-gray-400 mt-1">{recipe.caloriesLabel}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Ingredients */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-surface-dark rounded-xl p-6 md:p-8 shadow-sm border border-[#f4f0f1] dark:border-white/5 sticky top-24">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <MaterialIcon name="shopping_basket" className="text-primary" />
              Ingredients
            </h3>
            <div className="flex flex-col gap-3">
              {recipe.ingredients.map((ing, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-[#f8f6f6] dark:hover:bg-white/5 cursor-pointer group transition-colors select-none"
                >
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-primary rounded border-gray-300 focus:ring-primary bg-white dark:bg-black/20 dark:border-gray-600"
                    checked={checked.has(i)}
                    onChange={() => toggleCheck(i)}
                  />
                  <span
                    className={`text-base group-hover:text-primary transition-colors${
                      checked.has(i) ? " line-through text-gray-400" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: ing }}
                  />
                </label>
              ))}
            </div>

            {/* Pro tip upsell */}
            <div className="mt-8 bg-primary/5 rounded-lg p-4 border border-primary/10">
              <div className="flex gap-3">
                <div
                  className="w-12 h-16 bg-gray-200 rounded shadow-sm bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url('${recipe.proTipProductImage}')` }}
                />
                <div className="flex flex-col">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">
                    {recipe.proTipLabel}
                  </p>
                  <p className="text-sm font-medium mb-1">{recipe.proTipText}</p>
                  <a
                    href="#"
                    className="text-sm font-bold underline decoration-2 decoration-primary/30 hover:decoration-primary text-primary"
                  >
                    Add to cart
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Chef tip */}
          <div className="bg-[#221014] text-white p-6 rounded-xl flex gap-4 shadow-lg">
            <div className="bg-white/10 p-3 rounded-full h-fit shrink-0">
              <MaterialIcon name="tips_and_updates" className="text-primary text-2xl" />
            </div>
            <div>
              <h4 className="font-bold text-lg mb-2">Chef&apos;s Tip</h4>
              <p className="text-gray-300 leading-relaxed">{recipe.chefTip}</p>
            </div>
          </div>

          {/* Steps */}
          <div className="flex flex-col gap-10 bg-white dark:bg-surface-dark p-6 md:p-10 rounded-xl border border-[#f4f0f1] dark:border-white/5 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <MaterialIcon name="menu_book" className="text-primary" />
                Instructions
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#896169] dark:text-gray-400">Keep screen on</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input defaultChecked className="sr-only peer" type="checkbox" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                </label>
              </div>
            </div>

            {recipe.steps.map((step, i) => {
              const isFirst = i === 0;
              const isSecond = i === 1;
              const isLast = i === recipe.steps.length - 1;
              return (
                <div key={i} className="flex gap-4 md:gap-6 group">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-lg md:text-xl shrink-0 z-10 ${
                        isFirst
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : isSecond
                          ? "bg-white dark:bg-surface-dark border-2 border-primary text-primary"
                          : "bg-white dark:bg-surface-dark border-2 border-gray-300 dark:border-gray-600 text-gray-500 group-hover:border-primary group-hover:text-primary transition-colors"
                      }`}
                    >
                      {i + 1}
                    </div>
                    {!isLast && <div className="w-0.5 bg-gray-200 dark:bg-gray-700 flex-1 my-2" />}
                  </div>
                  <div className={`flex-1 ${isLast ? "" : "pb-8"}`}>
                    <h4 className="text-xl font-bold mb-3 text-[#181112] dark:text-white group-hover:text-primary transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-lg leading-relaxed text-[#5a484c] dark:text-gray-300">{step.body}</p>
                    {step.imageUrl && (
                      <div className="rounded-lg overflow-hidden h-48 w-full md:w-2/3 shadow-sm bg-gray-100 mt-4">
                        <div
                          className="w-full h-full bg-cover bg-center"
                          style={{ backgroundImage: `url('${step.imageUrl}')` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Reviews ── */}
      <div className="mt-4 bg-white dark:bg-surface-dark rounded-xl p-8 shadow-sm border border-[#f4f0f1] dark:border-white/5">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Community Reviews</h3>
          <button className="text-primary font-bold hover:underline">Write a Review</button>
        </div>
        <div className="flex flex-col md:flex-row gap-12">
          {/* Rating summary */}
          <div className="w-full md:w-1/3 flex flex-col gap-6">
            <div className="flex flex-col gap-2 bg-[#f4f0f1] dark:bg-white/5 p-6 rounded-xl text-center md:text-left">
              <p className="text-[#181112] dark:text-white text-5xl font-black leading-tight tracking-[-0.033em]">
                {recipe.rating}
              </p>
              <div className="flex gap-1 justify-center md:justify-start text-primary">
                {Array.from({ length: 5 }, (_, i) => (
                  <MaterialIcon key={i} name="star" filled className="text-xl" />
                ))}
              </div>
              <p className="text-[#181112] dark:text-gray-300 text-base font-normal leading-normal">
                Based on {recipe.reviewCount} reviews
              </p>
            </div>
            <div className="flex flex-col gap-3 px-2">
              {recipe.ratingBars.map((bar) => (
                <div key={bar.stars} className="grid grid-cols-[20px_1fr_40px] items-center gap-x-3 text-sm">
                  <span className="font-bold">{bar.stars}</span>
                  <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${bar.pct}%` }} />
                  </div>
                  <span className="text-right text-gray-500">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual reviews */}
          <div className="w-full md:w-2/3 flex flex-col gap-6">
            {recipe.reviews.map((review, i) => (
              <div
                key={i}
                className={
                  i < recipe.reviews.length - 1
                    ? "border-b border-gray-100 dark:border-gray-700 pb-6"
                    : ""
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full bg-gray-200 bg-cover bg-center"
                      style={{ backgroundImage: `url('${review.avatarUrl}')` }}
                    />
                    <div>
                      <p className="font-bold text-sm">{review.name}</p>
                      <p className="text-xs text-gray-500">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex text-primary text-sm">
                    {Array.from({ length: 5 }, (_, i) => (
                      <MaterialIcon
                        key={i}
                        name="star"
                        filled={i < review.stars}
                        className="text-[18px]"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300">{review.text}</p>
              </div>
            ))}
            <button className="w-full py-3 bg-[#f4f0f1] dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-[#181112] dark:text-white font-bold rounded-lg transition-colors mt-2">
              Load more reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
