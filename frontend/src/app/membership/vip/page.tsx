"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { membershipService } from "@/services/membership.service";
import { recipeService } from "@/services/recipe.service";
import { MaterialIcon, Badge, Button } from "@/components/ui";
import type { Recipe } from "@/types";

/* ─── Skeleton Card ─────────────────────────────────── */
function SkeletonCard() {
    return (
        <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm border border-transparent animate-pulse dark:bg-surface-dark">
            <div className="w-full aspect-[4/3] rounded-xl bg-gray-200 dark:bg-gray-800" />
            <div className="px-2 pb-2 flex flex-col gap-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
        </div>
    );
}

/* ─── Premium Recipe Card ────────────────────────────────────── */
function PremiumRecipeCard({ recipe }: { recipe: Recipe }) {
    const fallbackImg =
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAuml-kcfcPWeQBjMtTp9qNy2__FOkkxDJDXMp0QJqHwBlOeWZADpnNTXmemZ9LqvyaimNAdVs1EGRnnOUxNMUVxkrc0G9BGEVgFph5XOdJhYy2DbTEeql1E5LtYvl2Ozk2t1qF1tNfOu5xOilaYGbIWexibTqnCvXEQdONhyYHbLYA2E4Z1DZsnovxi6InrGGTvSbitgbig_XcxY6jjCD031OVC4KSu7-vM88HV18iiqoRA9Y0GU2N_YkcSxDgjCk_I1c9wmUBWrA";

    return (
        <Link href={`/recipes/${recipe.id}`}>
            <div className="group flex flex-col gap-4 rounded-2xl border border-transparent bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/10 hover:shadow-2xl hover:shadow-primary/10 dark:bg-surface-dark">
                <div className="relative w-full overflow-hidden rounded-xl">
                    <div
                        className="w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 bg-center bg-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundImage: `url('${recipe.imageUrl || fallbackImg}')` }}
                    />
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-50/90 px-3 py-1 backdrop-blur-sm border border-amber-200/50">
                        <MaterialIcon name="workspace_premium" filled className="text-[14px] text-amber-600" />
                        <span className="text-xs font-bold text-amber-600">Premium</span>
                    </div>
                </div>

                <div className="px-2 pb-2">
                    <h3 className="font-serif-display text-xl font-bold leading-tight text-text-main transition-colors group-hover:text-primary dark:text-white">
                        {recipe.flavorName}
                    </h3>
                    {recipe.shortDescription && (
                        <p className="mt-2 text-sm text-text-muted dark:text-gray-400 line-clamp-2">
                            {recipe.shortDescription}
                        </p>
                    )}
                    <div className="mt-3 flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
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
    const [loading, setLoading] = useState(true);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (authLoading) return;

        if (!isLoggedIn) {
            router.push('/login?returnUrl=/membership/vip');
            return;
        }

        const verifyMembershipAndLoad = async () => {
            try {
                const subStatus = await membershipService.getStatus();
                if (subStatus?.status !== "ACTIVE") {
                    router.push('/membership');
                    return;
                }
                setVerifying(false);

                const res = await recipeService.getAll(1, 48);
                setRecipes(res.data?.items ?? []);
            } catch (err) {
                console.error("Failed to load VIP data:", err);
                setError("Failed to load your premium recipes. Please try again.");
                setVerifying(false);
            } finally {
                setLoading(false);
            }
        };

        verifyMembershipAndLoad();
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
                        <Button
                            onClick={() => document.getElementById("vip-recipes")?.scrollIntoView({ behavior: "smooth" })}
                            className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
                        >
                            Browse Recipes
                            <MaterialIcon name="arrow_downward" className="ml-1" />
                        </Button>
                        <Link href="/recipes">
                            <Button
                                variant="outline"
                                className="h-12 px-8 border-primary/30 text-base hover:border-primary hover:bg-primary/5"
                            >
                                All Recipes
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Exclusive Recipes Grid ── */}
            <section id="vip-recipes" className="rounded-[2rem] bg-white px-8 py-10 md:px-12 md:py-12 dark:bg-surface-dark">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif-display text-3xl font-black text-text-main dark:text-white flex items-center gap-3">
                        <MaterialIcon name="auto_awesome" className="text-primary" />
                        Exclusive Recipes
                    </h2>
                </div>

                {error ? (
                    <div className="w-full py-16 flex flex-col items-center gap-6 text-center">
                        <div className="rounded-full bg-red-50 p-4">
                            <MaterialIcon name="error_outline" className="text-4xl text-red-400" />
                        </div>
                        <p className="text-text-muted max-w-md">{error}</p>
                        <Button onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {loading ? (
                            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        ) : recipes.length === 0 ? (
                            <div className="col-span-full py-20 text-center flex flex-col items-center gap-4">
                                <div className="rounded-full bg-gray-100 p-4">
                                    <MaterialIcon name="inventory_2" className="text-4xl text-text-muted" />
                                </div>
                                <p className="text-lg font-medium text-text-muted">The vault is currently empty.</p>
                                <p className="text-sm text-text-muted">New exclusive recipes are being crafted right now.</p>
                            </div>
                        ) : (
                            recipes.map(r => <PremiumRecipeCard key={r.id} recipe={r} />)
                        )}
                    </div>
                )}
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
