"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { membershipService } from "@/services/membership.service";
import { MaterialIcon, Badge, Button } from "@/components/ui";
import { PREMIUM_RECIPES, type PremiumRecipe } from "./recipes/data";

/* ─── Subscribe Gate Overlay ─── */
function SubscribeGate({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-3xl bg-white dark:bg-surface-dark shadow-2xl p-8 flex flex-col items-center text-center gap-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-text-muted hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
        >
          <MaterialIcon name="close" className="text-lg" />
        </button>

        {/* Icon */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-900/20">
          <MaterialIcon name="workspace_premium" filled className="text-3xl text-amber-500" />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2 className="font-serif-display text-2xl font-black text-text-main dark:text-white">
            Premium Members Only
          </h2>
          <p className="text-sm leading-relaxed text-text-muted">
            This recipe is locked for premium members. Upgrade your plan to unlock
            the full MasterClass Vault.
          </p>
        </div>

        {/* Perks */}
        <ul className="w-full flex flex-col gap-2 text-left">
          {[
            "Full recipe access — ingredients & procedures",
            "Early access to books & exclusive merch",
            'IScream\'s secret menu',
          ].map((perk) => (
            <li key={perk} className="flex items-center gap-3 text-sm font-medium text-text-main dark:text-gray-200">
              <MaterialIcon name="check_circle" filled className="text-primary text-base shrink-0" />
              {perk}
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link
          href="/membership#pricing"
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary-hover transition-colors"
        >
          <MaterialIcon name="stars" className="text-base" />
          View Membership Plans
        </Link>
        <button
          onClick={onClose}
          className="text-sm text-text-muted hover:text-text-main transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}

/* ─── Featured Recipe Card ─── */
function FeaturedRecipeCard({
  recipe,
  isSubscribed,
  onLockedClick,
}: {
  recipe: PremiumRecipe;
  isSubscribed: boolean;
  onLockedClick: () => void;
}) {
  const cardContent = (
    <div className="group flex flex-col rounded-2xl border border-transparent bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/10 hover:shadow-xl hover:shadow-primary/10 dark:bg-surface-dark overflow-hidden cursor-pointer">
      <div className="relative overflow-hidden">
        <div
          className={`w-full aspect-[4/3] bg-gray-100 dark:bg-gray-800 bg-center bg-cover transition-transform duration-500 group-hover:scale-105 ${!isSubscribed ? "brightness-90" : ""}`}
          style={{ backgroundImage: `url('${recipe.imageUrl}')` }}
        />
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-amber-50/90 px-3 py-1 backdrop-blur-sm border border-amber-200/50">
          <MaterialIcon name="workspace_premium" filled className="text-[14px] text-amber-600" />
          <span className="text-xs font-bold text-amber-600">Premium</span>
        </div>
        {/* Lock icon for non-subscribers */}
        {!isSubscribed && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 shadow-lg">
              <MaterialIcon name="lock" className="text-base text-primary" />
              <span className="text-xs font-bold text-primary">Subscribe to unlock</span>
            </div>
          </div>
        )}
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
          {isSubscribed ? (
            <>
              <span>View Recipe</span>
              <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </>
          ) : (
            <>
              <MaterialIcon name="lock" className="text-[16px]" />
              <span>Members only</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (isSubscribed) {
    return (
      <Link href={`/membership/vip/recipes/${recipe.slug}`}>
        {cardContent}
      </Link>
    );
  }

  return (
    <button className="text-left w-full" onClick={onLockedClick}>
      {cardContent}
    </button>
  );
}

export default function VipRecipesPage() {
  const router = useRouter();
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showGate, setShowGate] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!isLoggedIn) {
      router.push("/login?returnUrl=/membership/vip");
      return;
    }

    const verifyMembership = async () => {
      try {
        const subStatus = await membershipService.getStatus();
        setIsSubscribed(subStatus?.status === "ACTIVE");
      } catch (err) {
        console.error("Failed to verify membership:", err);
        setIsSubscribed(false);
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
    <>
      {showGate && <SubscribeGate onClose={() => setShowGate(false)} />}

      <div className="w-full max-w-[1024px] flex flex-col gap-16 md:gap-24">
        {/* ── Hero Section ── */}
        <section
          className="relative mt-6 md:mt-10 overflow-hidden rounded-[2.5rem] shadow-xl"
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
              {isSubscribed
                ? "Welcome to the inner circle. As a premium member, you have full access to our most closely guarded recipes and techniques."
                : "Explore our exclusive recipe collection. Subscribe to unlock full access to every premium recipe."}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {isSubscribed ? (
                <Link href="/recipes">
                  <Button className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40">
                    Browse Recipes
                    <MaterialIcon name="arrow_forward" className="ml-1" />
                  </Button>
                </Link>
              ) : (
                <Link href="/membership#pricing">
                  <Button className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40">
                    <MaterialIcon name="stars" className="mr-1" />
                    Upgrade to Premium
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* ── Featured Recipes ── */}
        <section className="rounded-[2rem] bg-white px-8 py-10 md:px-12 md:py-12 dark:bg-surface-dark">
          <div className="mb-8">
            <h2 className="font-serif-display text-3xl font-black text-text-main dark:text-white flex items-center gap-3">
              <MaterialIcon name="auto_awesome" className="text-primary" />
              Featured Recipes
              {!isSubscribed && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-600">
                  <MaterialIcon name="lock" className="text-xs" />
                  Premium
                </span>
              )}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PREMIUM_RECIPES.map((r) => (
              <FeaturedRecipeCard
                key={r.slug}
                recipe={r}
                isSubscribed={isSubscribed}
                onLockedClick={() => setShowGate(true)}
              />
            ))}
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
              <div
                key={perk.title}
                className="flex flex-col items-center text-center gap-3 rounded-2xl bg-cream/50 p-6 dark:bg-white/5"
              >
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
    </>
  );
}
