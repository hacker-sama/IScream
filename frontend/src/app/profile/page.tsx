"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { authService, type UserInfo } from "@/services/auth.service";
import { membershipService } from "@/services/membership.service";
import type { MembershipSubscription } from "@/types";
import { MaterialIcon, Button, Badge } from "@/components/ui";

export default function ProfilePage() {
  const { isLoggedIn, loading: authLoading } = useAuth();

  // State
  const [profile, setProfile] = useState<UserInfo | null>(null);
  const [subscription, setSubscription] =
    useState<MembershipSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "success" });

  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    if (!authLoading && isLoggedIn) {
      loadData();
    }
  }, [isLoggedIn, authLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileData, subData] = await Promise.all([
        authService.getMe(),
        membershipService.getStatus(),
      ]);

      setProfile(profileData);
      setFullName(profileData.fullName || "");
      setEmail(profileData.email || "");

      setSubscription(subData);
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to load profile",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: "", type: "success" });

    try {
      await authService.updateProfile({ fullName, email });
      setMessage({ text: "Profile updated successfully!", type: "success" });
      // Refresh to get latest data
      await loadData();
    } catch (err) {
      setMessage({
        text: err instanceof Error ? err.message : "Failed to update profile",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <MaterialIcon
          name="sync"
          className="animate-spin text-4xl text-primary"
        />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex w-full flex-col items-center px-4 py-12 md:py-20 max-w-250 mx-auto">
      {/* Page Header */}
      <div className="mb-12 flex flex-col items-center text-center">
        <Badge className="mb-5 border-transparent bg-primary/10 text-primary dark:bg-primary/20 flex gap-2 w-max">
          <MaterialIcon name="person" className="text-sm" />
          MY ACCOUNT
        </Badge>
        <h1 className="font-serif-display text-4xl md:text-5xl font-black leading-tight tracking-tight text-text-main dark:text-white mb-3">
          Your Profile
        </h1>
        <p className="max-w-125 text-base md:text-lg font-medium leading-relaxed text-text-muted">
          Manage your personal information and membership status.
        </p>
      </div>

      <div className="grid gap-8 w-full lg:grid-cols-12">
        {/* Left Column: Settings Form */}
        <div className="lg:col-span-7">
          <div className="rounded-[2rem] bg-white dark:bg-surface-dark p-8 shadow-xl shadow-primary/5 border border-gray-50 dark:border-white/5">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MaterialIcon name="person" className="text-primary" />
              Personal Information
            </h2>

            {message.text && (
              <div
                className={`mb-6 flex items-center gap-3 p-4 rounded-xl text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                    : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
                }`}
              >
                <MaterialIcon
                  name={message.type === "success" ? "check_circle" : "error"}
                  className="text-lg shrink-0"
                />
                {message.text}
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={profile.username}
                  disabled
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 bg-gray-50 text-gray-400 cursor-not-allowed dark:bg-white/5 dark:border-white/10 dark:text-gray-500"
                />
                <p className="text-xs text-gray-400 mt-1.5">
                  Username cannot be changed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFullName(e.target.value)
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-white/5 dark:border-white/10 dark:text-white transition-shadow"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-white/5 dark:border-white/10 dark:text-white transition-shadow"
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    saving ||
                    (fullName === profile.fullName && email === profile.email)
                  }
                  className="min-w-40 px-8 py-3 text-sm"
                >
                  {saving ? (
                    <MaterialIcon name="sync" className="animate-spin mr-2" />
                  ) : null}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Membership Status */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`rounded-[2rem] shadow-xl shadow-primary/5 border p-8 relative overflow-hidden ${
              subscription?.status === "ACTIVE"
                ? "bg-linear-to-br from-gray-900 to-black text-white border-black"
                : "bg-white dark:bg-surface-dark border-gray-50 dark:border-white/5"
            }`}
          >
            {subscription?.status === "ACTIVE" && (
              <div className="absolute -top-10 -right-10 text-white/5 pointer-events-none">
                <MaterialIcon name="star" filled className="text-[160px]" />
              </div>
            )}

            <h2
              className={`text-lg font-bold mb-2 flex items-center gap-2 ${
                subscription?.status === "ACTIVE"
                  ? "text-yellow-400"
                  : "text-gray-500"
              }`}
            >
              <MaterialIcon
                name={
                  subscription?.status === "ACTIVE"
                    ? "workspace_premium"
                    : "card_membership"
                }
                filled={subscription?.status === "ACTIVE"}
              />
              Membership Status
            </h2>

            {subscription?.status === "ACTIVE" ? (
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-serif-display font-bold text-white mb-1">
                    {subscription.planCode} Plan
                  </div>
                  <div className="text-gray-400 text-sm">
                    Active until{" "}
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 pb-1.5 rounded-full bg-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wide border border-green-500/30">
                  <MaterialIcon name="check_circle" className="text-[14px]" />
                  Active
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                  You don't have an active premium membership. Upgrade to unlock
                  all recipes!
                </p>
                <Link href="/membership" className="block">
                  <Button className="w-full bg-linear-to-r from-primary to-orange-500 hover:opacity-90 text-white">
                    <MaterialIcon name="auto_awesome" className="mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
