"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "../_components/AdminShell";
import { MaterialIcon } from "@/components/ui";
import { adminFeedbackService } from "@/services/admin.feedback.service";
import type { Feedback } from "@/types";

// ── Read/Unread badge ─────────────────────────────────────────────────────────
function ReadBadge({ isRead }: { isRead: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        isRead ? "bg-gray-100 text-gray-500" : "bg-blue-100 text-blue-700"
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${isRead ? "bg-gray-400" : "bg-blue-500"}`}
      />
      {isRead ? "Read" : "Unread"}
    </span>
  );
}

// ── Feedback Detail Modal ─────────────────────────────────────────────────────
function FeedbackDetailModal({
  feedback,
  onClose,
  onMarkedRead,
}: {
  feedback: Feedback;
  onClose: () => void;
  onMarkedRead: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleMarkRead() {
    setLoading(true);
    setError("");
    try {
      await adminFeedbackService.markRead(feedback.id);
      onMarkedRead();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to mark as read.");
    } finally {
      setLoading(false);
    }
  }

  const labelCls =
    "text-[11px] font-bold uppercase tracking-widest text-gray-400";
  const valueCls = "text-sm font-semibold text-text-main";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <MaterialIcon
                name="chat_bubble"
                filled
                className="text-[20px] text-primary"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-text-main">
                Feedback Detail
              </h2>
              <p className="text-xs text-gray-400">
                #{feedback.id.slice(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
          >
            <MaterialIcon name="close" className="text-[20px]" />
          </button>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
            <MaterialIcon
              name="error"
              filled
              className="shrink-0 text-[16px]"
            />
            {error}
          </div>
        )}

        {/* Info */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className={labelCls}>Name</p>
            <p className={valueCls}>{feedback.name ?? "Anonymous"}</p>
          </div>
          <div>
            <p className={labelCls}>Status</p>
            <ReadBadge isRead={feedback.isRead} />
          </div>
          <div>
            <p className={labelCls}>Email</p>
            <p className={valueCls}>{feedback.email ?? "—"}</p>
          </div>
          <div>
            <p className={labelCls}>User Type</p>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                feedback.isRegisteredUser
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {feedback.isRegisteredUser ? "Registered" : "Guest"}
            </span>
          </div>
          <div>
            <p className={labelCls}>Submitted</p>
            <p className={valueCls}>
              {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Message */}
        <div className="mt-5">
          <p className={labelCls + " mb-2"}>Message</p>
          <div className="rounded-xl bg-gray-50 px-4 py-4 text-sm leading-relaxed text-text-main">
            {feedback.message}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-text-muted hover:bg-gray-50"
          >
            Close
          </button>
          {!feedback.isRead && (
            <button
              onClick={handleMarkRead}
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-hover disabled:opacity-60"
            >
              {loading && (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              Mark as Read
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterRead, setFilterRead] = useState<"all" | "unread" | "read">(
    "all",
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [detailFeedback, setDetailFeedback] = useState<Feedback | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchFeedbacks = useCallback(async (page: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await adminFeedbackService.getAll(page, PAGE_SIZE);
      if (res.success && res.data) {
        setFeedbacks(res.data.items);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load feedbacks.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks(currentPage);
  }, [currentPage, fetchFeedbacks]);

  // ── Client-side filter ─────────────────────────────────────────────────────
  const filtered = feedbacks.filter((f) => {
    const matchSearch =
      search === "" ||
      (f.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (f.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      f.message.toLowerCase().includes(search.toLowerCase());
    const matchRead =
      filterRead === "all" ||
      (filterRead === "unread" && !f.isRead) ||
      (filterRead === "read" && f.isRead);
    return matchSearch && matchRead;
  });

  const unreadCount = feedbacks.filter((f) => !f.isRead).length;

  // ── Quick mark as read ─────────────────────────────────────────────────────
  async function quickMarkRead(feedback: Feedback) {
    setActionLoading(feedback.id);
    try {
      await adminFeedbackService.markRead(feedback.id);
      fetchFeedbacks(currentPage);
    } catch {
      // silent
    } finally {
      setActionLoading(null);
    }
  }

  // ── Pagination ─────────────────────────────────────────────────────────────
  function PaginationBtn({ page, active }: { page: number; active: boolean }) {
    return (
      <button
        onClick={() => setCurrentPage(page)}
        className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
          active
            ? "bg-primary text-white shadow-md shadow-primary/30"
            : "text-text-muted hover:bg-gray-100"
        }`}
      >
        {page}
      </button>
    );
  }

  const pageNums: (number | "…")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNums.push(i);
  } else {
    pageNums.push(1);
    if (currentPage > 3) pageNums.push("…");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    )
      pageNums.push(i);
    if (currentPage < totalPages - 2) pageNums.push("…");
    pageNums.push(totalPages);
  }

  return (
    <AdminShell activePage="feedback" pageTitle="Feedback">
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[2rem] font-black leading-tight tracking-tight text-text-main">
            Feedback
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Review messages from users and guests.{" "}
            <span className="font-bold text-text-main">
              Total: {totalCount}
            </span>
            {unreadCount > 0 && (
              <>
                {" · "}
                <span className="font-bold text-blue-600">
                  {unreadCount} unread
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        {/* Search */}
        <div className="relative min-w-55 flex-1">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or message..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-black outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {/* Read filter */}
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterRead(f)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition-all ${
                filterRead === f
                  ? "bg-text-main text-white"
                  : "bg-gray-100 text-text-muted hover:bg-gray-200"
              }`}
            >
              {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {error && (
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4 text-sm text-red-600">
            <MaterialIcon name="error" filled className="text-[16px]" />
            {error}
            <button
              onClick={() => fetchFeedbacks(currentPage)}
              className="ml-auto text-xs font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Sender", "Message", "Type", "Date", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400"
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <span className="inline-block size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-16 text-center text-sm text-gray-400"
                >
                  <MaterialIcon
                    name="search_off"
                    className="mb-2 text-[40px] text-gray-200"
                  />
                  <p>No feedback found.</p>
                </td>
              </tr>
            ) : (
              filtered.map((fb, idx) => {
                const isLast = idx === filtered.length - 1;
                const isProcessing = actionLoading === fb.id;
                return (
                  <tr
                    key={fb.id}
                    className={`group transition-colors hover:bg-gray-50 ${
                      !isLast ? "border-b border-gray-100" : ""
                    } ${!fb.isRead ? "bg-blue-50/30" : ""}`}
                  >
                    {/* Sender */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-black text-primary">
                          {(fb.name ?? "?")[0].toUpperCase()}
                        </div>
                        <div>
                          <p
                            className={`font-bold ${!fb.isRead ? "text-text-main" : "text-gray-600"}`}
                          >
                            {fb.name ?? "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {fb.email ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Message preview */}
                    <td className="max-w-xs px-6 py-4">
                      <p className="line-clamp-2 text-sm text-text-muted">
                        {fb.message}
                      </p>
                    </td>

                    {/* User type */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          fb.isRegisteredUser
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <MaterialIcon
                          name={
                            fb.isRegisteredUser ? "person" : "person_outline"
                          }
                          className="text-[12px]"
                        />
                        {fb.isRegisteredUser ? "Registered" : "Guest"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(fb.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <ReadBadge isRead={fb.isRead} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100">
                        {isProcessing ? (
                          <span className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                          <>
                            {/* View detail */}
                            <button
                              onClick={() => setDetailFeedback(fb)}
                              title="View Message"
                              className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                            >
                              <MaterialIcon
                                name="visibility"
                                className="text-[16px]"
                              />
                            </button>

                            {/* Quick mark read */}
                            {!fb.isRead && (
                              <button
                                onClick={() => quickMarkRead(fb)}
                                title="Mark as Read"
                                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                              >
                                <MaterialIcon
                                  name="done"
                                  className="text-[16px]"
                                />
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
            <p className="text-sm text-text-muted">
              Showing{" "}
              <span className="font-bold text-text-main">
                {(currentPage - 1) * PAGE_SIZE + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-text-main">
                {Math.min(currentPage * PAGE_SIZE, totalCount)}
              </span>{" "}
              of <span className="font-bold text-text-main">{totalCount}</span>{" "}
              results
            </p>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex size-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 disabled:opacity-30"
              >
                <MaterialIcon name="chevron_left" className="text-[20px]" />
              </button>
              {pageNums.map((p, i) =>
                p === "…" ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-sm text-gray-400"
                  >
                    …
                  </span>
                ) : (
                  <PaginationBtn key={p} page={p} active={p === currentPage} />
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="flex size-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 disabled:opacity-30"
              >
                <MaterialIcon name="chevron_right" className="text-[20px]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {detailFeedback && (
        <FeedbackDetailModal
          feedback={detailFeedback}
          onClose={() => setDetailFeedback(null)}
          onMarkedRead={() => {
            setDetailFeedback(null);
            fetchFeedbacks(currentPage);
          }}
        />
      )}
    </AdminShell>
  );
}
