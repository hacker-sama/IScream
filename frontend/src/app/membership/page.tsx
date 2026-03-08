"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MaterialIcon, Badge, Button } from "@/components/ui";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { routes } from "@/config";
import { useAuth } from "@/context/AuthContext";
import { membershipService } from "@/services";
import type { MembershipPlan } from "@/types";

export default function MembershipPage() {
    const router = useRouter();
    const { user, isLoggedIn, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [fetchingPlans, setFetchingPlans] = useState(true);

    useEffect(() => {
        if (authLoading) return; // Wait for auth state

        const fetchPlans = async () => {
            try {
                if (isLoggedIn) {
                    const subStatus = await membershipService.getStatus();
                    if (subStatus?.status === "ACTIVE") {
                        router.push("/membership/vip");
                        return;
                    }
                }

                const data = await membershipService.getPlans();
                setPlans(data.filter(p => p.isActive));
            } catch (error) {
                console.error("Failed to fetch plans:", error);
            } finally {
                setFetchingPlans(false);
            }
        };
        fetchPlans();
    }, [isLoggedIn, authLoading, router]);

  // Navigate to checkout with the selected plan
  const handleSubscribe = async (planId: number) => {
    if (!isLoggedIn) {
      router.push(
        `${routes.login}?returnUrl=${encodeURIComponent(routes.membership)}`,
      );
      return;
    }

    setLoading(true);
    router.push(`/membership/checkout?plan=${planId}`);
  };

    if (authLoading || fetchingPlans) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
      <RequireAuth featureName="membership plans">
        <div className="w-full max-w-[1024px] flex flex-col gap-16 md:gap-24">
          {/* ── Hero Section ── */}
          <section
            className="relative mt-6 md:mt-10 overflow-hidden rounded-[2.5rem] shadow-xl"
            style={{
              background: "linear-gradient(135deg, #fffbe6 0%, #fff5d6 35%, #fff0f0 70%, #fff9f0 100%)",
            }}
          >
            <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-8 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute right-1/3 top-0 h-40 w-40 rounded-full bg-rose-200/20 blur-2xl" />

            <div className="relative flex flex-col items-center text-center p-8 md:p-16 gap-6">
              <Badge className="border border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                <MaterialIcon name="stars" className="text-sm" />
                Premium Access
              </Badge>

              <h1 className="font-serif-display text-5xl md:text-[5rem] font-black leading-[1.1] tracking-tight text-text-main">
                Sweeten the <span className="gradient-text">Deal!</span>
              </h1>

              <p className="max-w-[600px] text-lg md:text-xl font-medium leading-relaxed text-text-muted">
                Join the Scoop Squad and unlock exclusive flavors of content.
                Choose the plan that fits your appetite.
              </p>

              <Button
                onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}
                className="h-12 px-8 text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
              >
                View Plans
                <MaterialIcon name="arrow_downward" className="ml-1" />
              </Button>
            </div>
          </section>

          {/* ── Pricing Cards ── */}
          <section id="pricing" className="rounded-[2rem] bg-white px-8 py-10 md:px-12 md:py-12 dark:bg-surface-dark">
            <div className="flex flex-col items-center text-center mb-10 gap-3">
              <h2 className="font-serif-display text-3xl md:text-4xl font-black text-text-main dark:text-white">
                Choose Your Plan
              </h2>
              <p className="text-text-muted max-w-md">Pick a plan and start enjoying premium ice cream content today.</p>
            </div>

            <div
              className={`grid w-full gap-8 max-w-[900px] mx-auto ${fetchingPlans ? "md:grid-cols-1" : "md:grid-cols-2"}`}
            >
              {fetchingPlans ? (
                <div className="flex justify-center p-12 text-text-muted">
                  Loading plans...
                </div>
              ) : plans.length === 0 ? (
                <div className="flex justify-center p-12 text-text-muted col-span-2">
                  No plans available at the moment.
                </div>
              ) : (
                plans.map((plan) => {
                  const isPro = plan.code.toUpperCase().includes("PRO");
                  return (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col items-start rounded-[2.5rem] p-10 transition-all duration-300 hover:-translate-y-1
                                  ${isPro
                                    ? "shadow-2xl shadow-primary/10 border-[3px] border-primary bg-white dark:bg-surface-dark"
                                    : "bg-white shadow-xl shadow-gray-200/50 dark:bg-surface-dark dark:shadow-none border border-gray-100"}
                              `}
                    >
                      {isPro && (
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1.5 flex items-center gap-1.5 shadow-lg shadow-primary/20">
                          <MaterialIcon name="verified" filled className="text-white text-sm" />
                          <span className="text-xs font-black uppercase tracking-wider text-white">
                            Best Value
                          </span>
                        </div>
                      )}

                      <h3
                        className={`text-sm font-black tracking-widest uppercase mb-6 ${isPro ? "text-primary" : "text-text-muted"}`}
                      >
                        {plan.code} Plan
                      </h3>

                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-6xl font-black text-text-main dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-xl font-bold text-text-muted pb-2">
                          / {plan.durationDays} days
                        </span>
                      </div>

                      <div className="mb-10 w-full pb-8 border-b border-gray-100">
                        {isPro ? (
                          <span className="inline-block rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                            Unlock maximum features!
                          </span>
                        ) : (
                          <p className="text-sm text-text-muted">
                            Perfect for tasting the waters.
                          </p>
                        )}
                      </div>

                      <ul className="flex flex-col gap-5 mb-12 w-full">
                        {isPro ? (
                          <>
                            <li className="flex items-center gap-4 text-text-main font-bold">
                              <MaterialIcon name="check_circle" filled className="text-primary text-xl" />
                              All Basic perks
                            </li>
                            {[
                              "Full Recipe Access",
                              "Early Access to Books",
                              "Exclusive Merch",
                              '"IScream\'s" Secret Menu',
                            ].map((perk, i) => (
                              <li key={i} className="flex items-center gap-4 text-text-main font-semibold">
                                <MaterialIcon name="icecream" filled className="text-primary text-xl" />
                                {perk}
                              </li>
                            ))}
                          </>
                        ) : (
                          <>
                            {[
                              "Basic Recipe Access",
                              "Monthly Newsletter",
                              "Community Forum Access",
                            ].map((perk, i) => (
                              <li key={i} className="flex items-center gap-4 text-text-main font-semibold">
                                <MaterialIcon name="icecream" filled className="text-primary text-xl" />
                                {perk}
                              </li>
                            ))}
                          </>
                        )}
                      </ul>

                      <button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={loading}
                        className={`mt-auto w-full rounded-full py-4 font-bold transition-all disabled:opacity-50 
                                          ${isPro
                                            ? "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primary-hover hover:scale-[1.02] disabled:hover:scale-100"
                                            : "border-2 border-gray-200 text-text-main hover:border-text-main"}
                                      `}
                      >
                        {loading
                          ? "Processing..."
                          : isPro
                            ? "Proceed to Payment"
                            : "Select Basic"}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* ── Trust Markers ── */}
          <section className="mb-10 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-text-muted">
              <MaterialIcon name="lock" className="text-sm" /> Secure Payment
            </div>
            <div className="flex gap-4">
              {["VISA", "Mastercard", "Amex"].map((card) => (
                <span key={card} className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-500">
                  {card}
                </span>
              ))}
            </div>
          </section>
        </div>
      </RequireAuth>
    );
}
