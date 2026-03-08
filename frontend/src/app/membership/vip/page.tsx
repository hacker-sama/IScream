"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { membershipService } from "@/services/membership.service";
import { MaterialIcon, Badge, Button } from "@/components/ui";
import { PREMIUM_RECIPES, type PremiumRecipe } from "./recipes/data";

/* ─── Featured Recipe Card ─── */
function FeaturedRecipeCard({ recipe }: { recipe: PremiumRecipe }) {
  return (
    <Link href={`/membership/vip/recipes/${recipe.slug}`}>
      <div className="group flex flex-col rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/10 hover:shadow-xl hover:shadow-primary/10 dark:bg-surface-dark overflow-hidden">
        <div className="relative overflow-hidden">
          <div
            className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${recipe.imageUrl}')` }}
          />
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-50/90 px-3 py-1 backdrop-blur-sm border border-amber-200/50">
            <MaterialIcon name="workspace_premium" filled className="text-[14px] text-amber-600" />
            <span className="text-xs font-bold text-amber-600">Premium</span>
          </div>
        </div>
        <div className="flex flex-col gap-2 p-5">
          <h3 className="font-serif-display text-lg font-bold leading-tight text-text-main transition-colors group-hover:text-primary dark:text-white">
            {recipe.flavorName}
          </h3>
          {recipe.shortDescription && (
            <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2">
              {recipe.shortDescription}
            </p>
          )}
          <div className="mt-1 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
            <span>View Recipe</span>
            <MaterialIcon name="arrow_forward" className="text-[16px]" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function VipRecipesPage() {
    const router = useRouter();
    const { isLoggedIn, loading: authLoading } = useAuth();
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push('/login?returnUrl=/membership/vip');
            return;
        }

        const verifyMembership = async () => {
            try {
                const subStatus = await membershipService.getStatus();
                if (subStatus?.status !== "ACTIVE") {
                    router.push('/membership');
                    return;
                }
            } catch (err) {
                console.error("Failed to verify membership:", err);
            } finally {
                setVerifying(false);
            }
        };

        verifyMembership();
    }, [isLoggedIn, authLoading, router]);

    if (authLoading || verifying) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="w-full max-w-[1024px] flex flex-col gap-16 md:gap-24">
            {/* ── Hero Section ── */}
            <section className="relative mt-6 md:mt-10 overflow-hidden rounded-[2.5rem] shadow-xl"
                style={{
                    background: "linear-gradient(135deg, #fffbe6 0%, #fff5d6 35%, #fff0f0 70%, #fff9f0 100%)",
                }}
            >
                {/* Decorative blobs */}
                <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-rose-200/20 blur-2xl" />

                <div className="relative flex flex-col items-center text-center p-8 md:p-16 gap-6">
                    <Badge className="border border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                        <MaterialIcon name="workspace_premium" className="text-sm" />
                        Premium Member Access
                    </Badge>

                    <h1 className="font-serif-display text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-text-main">
                        The Master<span className="gradient-text">Class</span> Vault
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl font-medium leading-relaxed text-text-muted">
                        Welcome to the inner circle. As a premium member, you have full access
                        to our most closely guarded recipes and techniques.
                    </p>

                    <div className="flex flex-wrap gap-4 pt-2">
                        <Link href="/recipes">
                            <Button
                                className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
                            >
                                Browse Recipes
                                <MaterialIcon name="arrow_forward" className="ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Featured Recipes ── */}
            <section className="rounded-[2rem] bg-white px-8 py-10 md:px-12 md:py-12 dark:bg-surface-dark">
                <div className="mb-8">
                  <h2 className="font-serif-display text-3xl font-black text-text-main dark:text-white flex items-center gap-3">
                    <MaterialIcon name="auto_awesome" className="text-primary" />
                    Featured Recipes
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {PREMIUM_RECIPES.map(r => <FeaturedRecipeCard key={r.slug} recipe={r} />)}
                </div>
              </section>

            {/* ── Perks Section ── */}
            <section className="mb-10 overflow-hidden rounded-[2.5rem] bg-white px-8 py-10 md:px-12 md:py-12 dark:bg-surface-dark">
                <div className="flex flex-col items-center text-center gap-4 mb-10">
                    <Badge className="border border-amber-200 bg-amber-50 text-amber-600">
                        <MaterialIcon name="diamond" className="text-sm" />
                        Member Perks
                    </Badge>
                    <h2 className="font-serif-display text-3xl font-black text-text-main dark:text-white">
                        Your Premium Benefits
                    </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: "menu_book", title: "Full Recipe Access", desc: "Ingredients & procedures unlocked" },
                        { icon: "auto_stories", title: "Early Book Access", desc: "Be the first to order new releases" },
                        { icon: "storefront", title: "Exclusive Merch", desc: "Members-only gear & collectibles" },
                        { icon: "icecream", title: "Secret Menu", desc: "Hidden flavors just for you" },
                    ].map((perk) => (
                        <div key={perk.title} className="flex flex-col items-center text-center gap-3 rounded-2xl bg-cream/50 p-6 dark:bg-white/5">
                            <div className="rounded-full bg-primary/10 p-3 text-primary">
                                <MaterialIcon name={perk.icon} className="text-2xl" />
                            </div>
                            <h3 className="font-bold text-text-main dark:text-white">{perk.title}</h3>
                            <p className="text-sm text-text-muted">{perk.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
