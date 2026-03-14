"use client";

import { useState, useEffect, useCallback } from "react";
import AdminShell from "../_components/AdminShell";
import { MaterialIcon } from "@/components/ui";
import { adminOrderService } from "@/services/admin.order.service";
import { extractApiError } from "@/services";
import type { ItemOrder, OrderStatus } from "@/types";

// ── Status helpers ────────────────────────────────────────────────────────────
const STATUSES = [
  "All",
  "PENDING",
  "PROCESSING",
  "COMPLETED",
  "DELIVERED",
  "CANCELLED",
] as const;

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  PROCESSING: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-indigo-100 text-indigo-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_DOT: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-500",
  PROCESSING: "bg-blue-500",
  COMPLETED: "bg-indigo-500",
  DELIVERED: "bg-green-500",
  CANCELLED: "bg-red-500",
};

function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      <span className={`size-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {status}
    </span>
  );
}

// ── Order Detail Modal ────────────────────────────────────────────────────────
function OrderDetailModal({
  order,
  onClose,
  onStatusUpdated,
}: {
  order: ItemOrder;
  onClose: () => void;
  onStatusUpdated: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    PENDING: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["COMPLETED", "DELIVERED", "CANCELLED"],
    COMPLETED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };

  const nextStatuses = allowedTransitions[order.status] ?? [];

  async function handleUpdateStatus(newStatus: OrderStatus) {
    setLoading(true);
    setError("");
    try {
      await adminOrderService.updateStatus(order.id, newStatus);
      onStatusUpdated();
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to update order status. Please try again."));
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
                name="receipt_long"
                filled
                className="text-[20px] text-primary"
              />
            </div>
            <div>
              <h2 className="text-lg font-black text-text-main">
                Order Details
              </h2>
              <p className="text-xs text-gray-400">{order.orderNo}</p>
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

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className={labelCls}>Customer</p>
            <p className={valueCls}>{order.customerName}</p>
          </div>
          <div>
            <p className={labelCls}>Status</p>
            <StatusBadge status={order.status} />
          </div>
          <div>
            <p className={labelCls}>Email</p>
            <p className={valueCls}>{order.email ?? "—"}</p>
          </div>
          <div>
            <p className={labelCls}>Phone</p>
            <p className={valueCls}>{order.phone ?? "—"}</p>
          </div>
          <div className="col-span-2">
            <p className={labelCls}>Address</p>
            <p className={valueCls}>{order.address ?? "—"}</p>
          </div>
          <div>
            <p className={labelCls}>Item</p>
            <p className={valueCls}>
              {order.itemTitle ?? order.itemId.slice(0, 8)}
            </p>
          </div>
          <div>
            <p className={labelCls}>Quantity</p>
            <p className={valueCls}>{order.quantity}</p>
          </div>
          <div>
            <p className={labelCls}>Unit Price</p>
            <p className={valueCls}>${order.unitPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className={labelCls}>Total</p>
            <p className="text-sm font-black text-primary">
              ${order.totalCost.toFixed(2)}
            </p>
          </div>
          <div>
            <p className={labelCls}>Order Date</p>
            <p className={valueCls}>
              {new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
          <div>
            <p className={labelCls}>Last Updated</p>
            <p className={valueCls}>
              {new Date(order.updatedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Status Actions */}
        {nextStatuses.length > 0 && (
          <div className="mt-6 border-t border-gray-100 pt-5">
            <p className={labelCls + " mb-3"}>Update Status</p>
            <div className="flex flex-wrap gap-2">
              {nextStatuses.map((s) => {
                const isCancelAction = s === "CANCELLED";
                return (
                  <button
                    key={s}
                    onClick={() => handleUpdateStatus(s)}
                    disabled={loading}
                    className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-60 ${
                      isCancelAction
                        ? "border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-primary text-white shadow-md shadow-primary/25 hover:bg-primary-hover"
                    }`}
                  >
                    {loading && (
                      <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    Mark as {s}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-text-muted hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ItemOrder[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] =
    useState<(typeof STATUSES)[number]>("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [detailOrder, setDetailOrder] = useState<ItemOrder | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const PAGE_SIZE = 10;

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (page: number, status?: string, start?: string, end?: string) => {
    setLoading(true);
    setError("");
    try {
      const filterStatus = status && status !== "All" ? status : undefined;
      const res = await adminOrderService.getAll(page, PAGE_SIZE, filterStatus, start, end);
      if (res.success && res.data) {
        setOrders(res.data.items);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load orders. Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(currentPage, activeStatus, startDate, endDate);
  }, [currentPage, activeStatus, startDate, endDate, fetchOrders]);

  // Reset page when filter changes
  function handleStatusFilter(s: (typeof STATUSES)[number]) {
    setActiveStatus(s);
    setCurrentPage(1);
  }

  // ── Client-side search ─────────────────────────────────────────────────────
  const filtered = orders.filter((o) => {
    if (search === "") return true;
    const q = search.toLowerCase();
    return (
      o.orderNo.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      (o.email ?? "").toLowerCase().includes(q) ||
      (o.itemTitle ?? "").toLowerCase().includes(q)
    );
  });

  // ── Quick status update ────────────────────────────────────────────────────
  async function quickStatusUpdate(order: ItemOrder, newStatus: OrderStatus) {
    setActionLoading(order.id);
    try {
      await adminOrderService.updateStatus(order.id, newStatus);
      fetchOrders(currentPage, activeStatus, startDate, endDate);
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
    <AdminShell activePage="orders" pageTitle="Order Management">
      {/* ── Header ── */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[2rem] font-black leading-tight tracking-tight text-text-main">
            Order Management
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            View and manage customer orders.{" "}
            <span className="font-bold text-text-main">
              Total Orders: {totalCount}
            </span>
          </p>
        </div>
      </div>

      {/* ── Search + Filter bar ── */}
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        {/* Search */}
        <div className="relative min-w-[220px] flex-1">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, customer, or email..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-black outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {/* Date Filters */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={startDate}
            onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
            className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-text-muted outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
          <span className="text-sm font-medium text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            min={startDate}
            onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
            className="h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-text-muted outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
          {(startDate || endDate) && (
            <button
              onClick={() => {
                setStartDate("");
                setEndDate("");
                setCurrentPage(1);
              }}
              className="ml-1 text-xs font-semibold text-primary underline hover:text-primary-hover"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => handleStatusFilter(s)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-all ${
                activeStatus === s
                  ? "bg-text-main text-white"
                  : "bg-gray-100 text-text-muted hover:bg-gray-200"
              }`}
            >
              {s === "All" ? "All Statuses" : s}
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
              onClick={() => fetchOrders(currentPage, activeStatus, startDate, endDate)}
              className="ml-auto text-xs font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {[
                "Order #",
                "Customer",
                "Item",
                "Qty",
                "Total",
                "Date",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3.5 text-left text-[11px] font-bold uppercase tracking-widest text-gray-400"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="py-16 text-center">
                  <span className="inline-block size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="py-16 text-center text-sm text-gray-400"
                >
                  <MaterialIcon
                    name="search_off"
                    className="mb-2 text-[40px] text-gray-200"
                  />
                  <p>No orders found.</p>
                </td>
              </tr>
            ) : (
              filtered.map((order, idx) => {
                const isLast = idx === filtered.length - 1;
                const isProcessing = actionLoading === order.id;
                return (
                  <tr
                    key={order.id}
                    className={`group transition-colors hover:bg-gray-50 ${
                      !isLast ? "border-b border-gray-100" : ""
                    }`}
                  >
                    {/* Order # */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-text-main">
                        {order.orderNo}
                      </p>
                      <p className="text-xs text-gray-400">
                        ID: #{order.id.slice(0, 7).toUpperCase()}
                      </p>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-text-main">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.email ?? "—"}
                      </p>
                    </td>

                    {/* Item */}
                    <td className="max-w-[160px] truncate px-6 py-4 text-text-muted">
                      {order.itemTitle ?? order.itemId.slice(0, 8)}
                    </td>

                    {/* Qty */}
                    <td className="px-6 py-4 text-center text-text-muted">
                      {order.quantity}
                    </td>

                    {/* Total */}
                    <td className="px-6 py-4 font-bold text-text-main">
                      ${order.totalCost.toFixed(2)}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
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
                              onClick={() => setDetailOrder(order)}
                              title="View Details"
                              className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
                            >
                              <MaterialIcon
                                name="visibility"
                                className="text-[16px]"
                              />
                            </button>

                            {/* Quick: Mark Delivered (from PROCESSING) */}
                            {order.status === "PROCESSING" && (
                              <button
                                onClick={() =>
                                  quickStatusUpdate(order, "DELIVERED")
                                }
                                title="Mark Delivered"
                                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-purple-300 hover:bg-purple-50 hover:text-purple-600"
                              >
                                <MaterialIcon
                                  name="local_shipping"
                                  className="text-[16px]"
                                />
                              </button>
                            )}

                            {/* Quick: Mark Delivered (from DELIVERED) */}
                            {order.status === "DELIVERED" && (
                              <button
                                onClick={() =>
                                  quickStatusUpdate(order, "DELIVERED")
                                }
                                title="Mark Delivered"
                                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                              >
                                <MaterialIcon
                                  name="check_circle"
                                  className="text-[16px]"
                                />
                              </button>
                            )}

                            {/* Quick: Cancel (from PENDING or PROCESSING) */}
                            {(order.status === "PENDING" ||
                              order.status === "PROCESSING") && (
                              <button
                                onClick={() =>
                                  quickStatusUpdate(order, "CANCELLED")
                                }
                                title="Cancel Order"
                                className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500"
                              >
                                <MaterialIcon
                                  name="cancel"
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
      {detailOrder && (
        <OrderDetailModal
          order={detailOrder}
          onClose={() => setDetailOrder(null)}
          onStatusUpdated={() => {
            setDetailOrder(null);
            fetchOrders(currentPage, activeStatus, startDate, endDate);
          }}
        />
      )}
    </AdminShell>
  );
}
