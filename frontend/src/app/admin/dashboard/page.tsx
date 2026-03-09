"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import AdminShell from "../_components/AdminShell";
import { MaterialIcon } from "@/components/ui";
import { adminOrderService } from "@/services/admin.order.service";
import { adminFeedbackService } from "@/services/admin.feedback.service";
import { adminRecipeService } from "@/services/admin.recipe.service";
import {
  adminSubmissionService,
  type RecipeSubmission,
} from "@/services/admin.submission.service";
import { tokenStorage } from "@/services/auth.service";
import type { ItemOrder } from "@/types";

// ── Stat Card ─────────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
  sub?: string;
  subColor?: string;
  loading?: boolean;
}

function StatCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
  sub,
  subColor = "text-gray-400",
  loading,
}: StatCardProps) {
  return (
    <div className="relative flex-1 min-w-0 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {label}
          </p>
          {loading ? (
            <div className="mt-1 h-8 w-16 animate-pulse rounded-lg bg-gray-100" />
          ) : (
            <p className="text-3xl font-black text-text-main">{value}</p>
          )}
          {sub && !loading && (
            <p className={`text-xs font-semibold ${subColor}`}>{sub}</p>
          )}
        </div>
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}
        >
          <MaterialIcon
            name={icon}
            filled
            className={`text-[22px] ${iconColor}`}
          />
        </div>
      </div>
    </div>
  );
}

// ── Order Status badge ────────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PAID: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status}
    </span>
  );
}

// ── Submission card ───────────────────────────────────────────────────────────
const CATEGORY_TAG: Record<string, string> = {
  gelato: "bg-blue-100 text-blue-700",
  sorbet: "bg-purple-100 text-purple-700",
  yogurt: "bg-pink-100 text-pink-700",
};

function guessTag(title: string) {
  const t = title.toLowerCase();
  for (const [k, v] of Object.entries(CATEGORY_TAG)) {
    if (t.includes(k)) return { label: k.toUpperCase(), cls: v };
  }
  return { label: "ICE CREAM", cls: "bg-amber-100 text-amber-700" };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

// ── Main Page ─────────────────────────────────────────────────────────────────
interface DashStats {
  pendingOrders: number;
  draftRecipes: number;
  unreadFeedback: number;
  pendingSubmissions: number;
}

export default function AdminDashboardPage() {
  const user = tokenStorage.getUser();

  const [stats, setStats] = useState<DashStats>({
    pendingOrders: 0,
    draftRecipes: 0,
    unreadFeedback: 0,
    pendingSubmissions: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);

  const [urgentOrders, setUrgentOrders] = useState<ItemOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  const [pendingSubs, setPendingSubs] = useState<RecipeSubmission[]>([]);
  const [subsLoading, setSubsLoading] = useState(true);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // ── Fetch all dashboard data ──────────────────────────────────────────────
  const fetchData = useCallback(async () => {
    setStatsLoading(true);
    setOrdersLoading(true);
    setSubsLoading(true);

    await Promise.allSettled([
      // Stats
      (async () => {
        try {
          const [ordRes, recRes, fbRes, subRes] = await Promise.all([
            adminOrderService.getAll(1, 1, "PENDING"),
            adminRecipeService.getAll(1, 1, false),
            adminFeedbackService.getAll(1, 100),
            adminSubmissionService.getAll(1, 1, "PENDING"),
          ]);
          const unread =
            fbRes.success && fbRes.data
              ? fbRes.data.items.filter((f) => !f.isRead).length
              : 0;
          setStats({
            pendingOrders:
              ordRes.success && ordRes.data ? ordRes.data.totalCount : 0,
            draftRecipes:
              recRes.success && recRes.data ? recRes.data.totalCount : 0,
            unreadFeedback:
              fbRes.success && fbRes.data
                ? fbRes.data.totalCount - (fbRes.data.items.length - unread)
                : 0,
            pendingSubmissions: subRes.totalCount ?? 0,
          });
        } finally {
          setStatsLoading(false);
        }
      })(),

      // Urgent orders
      (async () => {
        try {
          const res = await adminOrderService.getAll(1, 5, "PENDING");
          if (res.success && res.data) setUrgentOrders(res.data.items);
        } finally {
          setOrdersLoading(false);
        }
      })(),

      // Pending submissions
      (async () => {
        try {
          const res = await adminSubmissionService.getAll(1, 5, "PENDING");
          setPendingSubs(res.items ?? []);
        } finally {
          setSubsLoading(false);
        }
      })(),
    ]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Quick approve/reject ──────────────────────────────────────────────────
  async function handleApprove(sub: RecipeSubmission) {
    setActionLoading(sub.id + "_approve");
    try {
      await adminSubmissionService.review(sub.id, true);
      await adminRecipeService.create({
        flavorName: sub.title,
        shortDescription:
          sub.description ?? `A community recipe by ${sub.name ?? "Guest"}.`,
        ingredients: sub.ingredients,
        procedure: sub.steps,
        imageUrl: sub.imageUrl,
      });
      fetchData();
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(sub: RecipeSubmission) {
    setActionLoading(sub.id + "_reject");
    try {
      await adminSubmissionService.review(sub.id, false);
      fetchData();
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <AdminShell activePage="dashboard">
      {/* ── Welcome header ── */}
      <div className="mb-7 flex items-start justify-between">
        <div>
          <h1 className="text-[2rem] font-black leading-tight tracking-tight text-text-main">
            Welcome back,{" "}
            {user?.fullName?.split(" ")[0] ?? user?.username ?? "Admin"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Here is what&apos;s happening with your ice cream empire today.
          </p>
        </div>
        <Link
          href="/admin/recipes"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover active:scale-[0.98]"
        >
          <MaterialIcon name="add" className="text-[18px]" />
          Add New Recipe
        </Link>
      </div>

      {/* ── Stat cards ── */}
      <div className="mb-7 flex gap-4">
        <StatCard
          label="Pending Orders"
          value={stats.pendingOrders}
          icon="shopping_bag"
          iconBg="bg-orange-100"
          iconColor="text-orange-500"
          sub="Awaiting processing"
          loading={statsLoading}
        />
        <StatCard
          label="New Recipes"
          value={stats.draftRecipes}
          icon="menu_book"
          iconBg="bg-blue-100"
          iconColor="text-blue-500"
          sub="Pending review"
          loading={statsLoading}
        />
        <StatCard
          label="Total Recipes"
          value="—"
          icon="attach_money"
          iconBg="bg-green-100"
          iconColor="text-green-500"
          sub="In the library"
          loading={false}
        />
        <StatCard
          label="Unread Feedback"
          value={stats.unreadFeedback}
          icon="chat"
          iconBg="bg-purple-100"
          iconColor="text-purple-500"
          sub={stats.unreadFeedback > 0 ? "Needs attention" : "All caught up"}
          subColor={
            stats.unreadFeedback > 0 ? "text-orange-500" : "text-green-500"
          }
          loading={statsLoading}
        />
      </div>

      {/* ── Main content: 2-col layout ── */}
      <div className="flex gap-6">
        {/* ── Left col: Urgent Orders ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-6">
          {/* Urgent Orders */}
          <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div>
                <h2 className="text-base font-black text-text-main">
                  Urgent Orders
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {stats.pendingOrders} pending order
                  {stats.pendingOrders !== 1 ? "s" : ""} need attention
                </p>
              </div>
              <Link
                href="/admin/orders"
                className="text-sm font-bold text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {/* Table */}
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-gray-50">
                  {["Order ID", "Customer", "Status", "Total", "Action"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {ordersLoading ? (
                  [...Array(3)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(5)].map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="h-4 animate-pulse rounded bg-gray-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : urgentOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-sm text-gray-400"
                    >
                      <MaterialIcon
                        name="check_circle"
                        filled
                        className="mb-2 text-[32px] text-green-200"
                      />
                      <p>No pending orders. All clear!</p>
                    </td>
                  </tr>
                ) : (
                  urgentOrders.map((order, idx) => {
                    const isLast = idx === urgentOrders.length - 1;
                    return (
                      <tr
                        key={order.id}
                        className={`group transition-colors hover:bg-gray-50 ${!isLast ? "border-b border-gray-50" : ""}`}
                      >
                        {/* Order ID */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-text-main">
                            #{order.orderNo}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-xs font-black text-primary">
                              {order.customerName[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-text-main">
                              {order.customerName.split(" ")[0]}{" "}
                              {order.customerName.split(" ").slice(-1)[0][0]}.
                            </span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <StatusBadge status={order.status} />
                        </td>

                        {/* Total */}
                        <td className="px-6 py-4 font-bold text-text-main">
                          ${order.totalCost.toFixed(2)}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4">
                          <Link
                            href="/admin/orders"
                            className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary opacity-70 group-hover:opacity-100"
                          >
                            <MaterialIcon name="edit" className="text-[16px]" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* ── Quick Stats row ── */}
          <div className="grid grid-cols-2 gap-4">
            {/* Pending Submissions count */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-black text-text-main">
                  Pending Submissions
                </p>
                <span className="flex size-8 items-center justify-center rounded-xl bg-orange-100">
                  <MaterialIcon
                    name="pending"
                    filled
                    className="text-[18px] text-orange-500"
                  />
                </span>
              </div>
              <p className="text-3xl font-black text-text-main">
                {statsLoading ? (
                  <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-gray-100" />
                ) : (
                  stats.pendingSubmissions
                )}
              </p>
              <Link
                href="/admin/contributions"
                className="text-xs font-bold text-primary hover:underline"
              >
                Review all submissions →
              </Link>
            </div>

            {/* New Recipe Contest CTA */}
            <div className="relative rounded-2xl bg-linear-to-br from-primary to-primary/70 p-5 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <MaterialIcon
                  name="emoji_events"
                  className="text-[100px] text-white"
                />
              </div>
              <div>
                <p className="text-sm font-black text-white">
                  New Recipe Contest
                </p>
                <p className="mt-1 text-xs text-white/80 leading-relaxed">
                  Review the top submissions for this month&apos;s contest.
                </p>
              </div>
              <Link
                href="/admin/contributions"
                className="mt-4 inline-flex items-center gap-1.5 self-start rounded-xl bg-white px-4 py-2 text-xs font-bold text-primary shadow transition hover:shadow-md"
              >
                Review Candidates
              </Link>
            </div>
          </div>
        </div>

        {/* ── Right col: Pending Submissions ── */}
        <div className="w-[320px] shrink-0 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 flex flex-col">
          {/* Header */}
          <div className="border-b border-gray-100 px-5 py-5">
            <h2 className="text-base font-black text-text-main">
              Pending Recipes
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              {stats.pendingSubmissions} user submission
              {stats.pendingSubmissions !== 1 ? "s" : ""} waiting for review.
            </p>
          </div>

          {/* Submission list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {subsLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="p-5 flex flex-col gap-2">
                  <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
                  <div className="h-3 w-full animate-pulse rounded bg-gray-100" />
                </div>
              ))
            ) : pendingSubs.length === 0 ? (
              <div className="py-12 text-center text-sm text-gray-400 px-5">
                <MaterialIcon
                  name="check_circle"
                  filled
                  className="mb-2 text-[32px] text-green-200"
                />
                <p>No pending submissions.</p>
              </div>
            ) : (
              pendingSubs.map((sub) => {
                const tag = guessTag(sub.title);
                const approvingThis = actionLoading === sub.id + "_approve";
                const rejectingThis = actionLoading === sub.id + "_reject";
                const busy = approvingThis || rejectingThis;

                return (
                  <div
                    key={sub.id}
                    className="p-5 flex flex-col gap-2 hover:bg-gray-50 transition-colors"
                  >
                    {/* Top: tag + time */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${tag.cls}`}
                      >
                        {tag.label}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {timeAgo(sub.createdAt)}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-black text-text-main leading-snug">
                      {sub.title}
                    </p>

                    {/* Description preview */}
                    {sub.description && (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {sub.description}
                      </p>
                    )}

                    {/* Author + actions */}
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary/20 to-primary/10 text-[10px] font-black text-primary">
                          {(sub.name ?? "?")[0].toUpperCase()}
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                          {sub.name ?? "Anonymous"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        {busy ? (
                          <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleReject(sub)}
                              title="Reject"
                              className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                            >
                              <MaterialIcon
                                name="close"
                                className="text-[15px]"
                              />
                            </button>
                            <button
                              onClick={() => handleApprove(sub)}
                              title="Approve & Publish"
                              className="flex size-7 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                            >
                              <MaterialIcon
                                name="check"
                                className="text-[15px]"
                              />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 px-5 py-4">
            <Link
              href="/admin/contributions"
              className="flex items-center justify-center gap-1.5 text-sm font-bold text-primary hover:underline"
            >
              View All Submissions
              <MaterialIcon name="arrow_forward" className="text-[16px]" />
            </Link>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
