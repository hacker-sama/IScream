"use client";

import { useCallback, useEffect, useState } from "react";
import AdminShell from "../_components/AdminShell";
import { MaterialIcon } from "@/components/ui";
import {
  adminItemService,
  extractApiError,
  type CreateItemRequest,
  type UpdateItemRequest,
} from "@/services";
import type { Item } from "@/types";

function formatPrice(price: number, currency: string) {
  return `${price.toLocaleString("vi-VN")} ${currency || "VND"}`;
}

function DeleteDialog({
  item,
  onConfirm,
  onCancel,
  loading,
}: {
  item: Item;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <MaterialIcon name="delete_forever" filled className="text-[24px]" />
        </div>
        <h3 className="text-lg font-black text-text-main">Delete Item?</h3>
        <p className="mt-1 text-sm text-text-muted">
          This will soft-delete <strong>{item.title}</strong> from the shop.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-text-muted hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-60"
          >
            {loading ? (
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : null}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ItemModal({
  mode,
  item,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  item?: Item;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    title: item?.title ?? "",
    description: item?.description ?? "",
    price: item?.price?.toString() ?? "",
    currency: item?.currency ?? "VND",
    imageUrl: item?.imageUrl ?? "",
    stock: item?.stock?.toString() ?? "0",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-black outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15";
  const labelCls = "mb-1 block text-xs font-semibold text-gray-500";

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const title = form.title.trim();
    const price = Number(form.price);
    const stock = Number(form.stock);
    const currency = form.currency.trim().toUpperCase();

    if (!title) {
      setError("Title is required.");
      return;
    }
    if (!Number.isFinite(price) || price < 0) {
      setError("Price must be a non-negative number.");
      return;
    }
    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock must be a non-negative integer.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (mode === "create") {
        const payload: CreateItemRequest = {
          title,
          description: form.description.trim() || undefined,
          price,
          currency: currency || "VND",
          imageUrl: form.imageUrl.trim() || undefined,
          stock,
        };
        await adminItemService.create(payload);
      } else {
        const payload: UpdateItemRequest = {
          title,
          description: form.description.trim() || undefined,
          price,
          currency: currency || "VND",
          imageUrl: form.imageUrl.trim() || undefined,
          stock,
        };
        await adminItemService.update(item!.id, payload);
      }

      onSaved();
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to save item. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 py-8 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
              <MaterialIcon
                name={mode === "create" ? "add_box" : "edit"}
                className="text-[20px] text-primary"
                filled
              />
            </div>
            <h2 className="text-lg font-black text-text-main">
              {mode === "create" ? "Add Shop Item" : "Edit Shop Item"}
            </h2>
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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
          noValidate
        >
          <div>
            <label className={labelCls}>Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g. Summer Dessert Handbook"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              rows={3}
              placeholder="Short product description..."
              className={inputCls + " resize-none"}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className={labelCls}>Price *</label>
              <input
                name="price"
                type="number"
                min="0"
                step="1000"
                value={form.price}
                onChange={onChange}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Currency</label>
              <input
                name="currency"
                value={form.currency}
                onChange={onChange}
                maxLength={8}
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Stock *</label>
            <input
              name="stock"
              type="number"
              min="0"
              step="1"
              value={form.stock}
              onChange={onChange}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Image URL</label>
            <input
              name="imageUrl"
              value={form.imageUrl}
              onChange={onChange}
              placeholder="https://..."
              className={inputCls}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-semibold text-text-muted hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-sm font-bold text-white shadow-md shadow-primary/25 hover:bg-primary-hover disabled:opacity-60"
            >
              {loading ? (
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : null}
              {mode === "create" ? "Create Item" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminItemsPage() {
  const PAGE_SIZE = 10;

  const [items, setItems] = useState<Item[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    mode: "create" | "edit";
    item?: Item;
  } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Item | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchItems = useCallback(async (page: number, q?: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await adminItemService.getAll(
        page,
        PAGE_SIZE,
        q || undefined,
      );
      if (res.success && res.data) {
        setItems(res.data.items);
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
      }
    } catch (err: unknown) {
      setError(extractApiError(err, "Failed to load items. Please try again."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems(currentPage, debouncedSearch);
  }, [currentPage, debouncedSearch, fetchItems]);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setActionLoading(deleteTarget.id);
    try {
      await adminItemService.remove(deleteTarget.id);
      setDeleteTarget(null);
      await fetchItems(currentPage, debouncedSearch);
    } catch (err: unknown) {
      setError(
        extractApiError(err, "Failed to delete item. Please try again."),
      );
    } finally {
      setActionLoading(null);
    }
  }

  const pageNums: (number | "...")[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNums.push(i);
  } else {
    pageNums.push(1);
    if (currentPage > 3) pageNums.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pageNums.push(i);
    }
    if (currentPage < totalPages - 2) pageNums.push("...");
    pageNums.push(totalPages);
  }

  return (
    <AdminShell activePage="items" pageTitle="Shop Items">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[2rem] font-black leading-tight tracking-tight text-text-main">
            Shop Item Management
          </h1>
          <p className="mt-1 text-sm text-text-muted">
            Manage products shown on <span className="font-bold">/shop</span>.
            Total: {totalCount}
          </p>
        </div>
        <button
          onClick={() => setModal({ mode: "create" })}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover"
        >
          <MaterialIcon name="add" className="text-[18px]" />
          Add Item
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-gray-100">
        <div className="relative min-w-[240px] flex-1">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or description..."
            className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-black outline-none transition focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
        {error && (
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4 text-sm text-red-600">
            <MaterialIcon name="error" filled className="text-[16px]" />
            {error}
          </div>
        )}

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Item", "Price", "Stock", "Updated", "Actions"].map((h) => (
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
                <td colSpan={5} className="py-16 text-center">
                  <span className="inline-block size-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-sm text-gray-400"
                >
                  <MaterialIcon
                    name="inventory_2"
                    className="mb-2 text-[40px] text-gray-200"
                  />
                  <p>No items found.</p>
                </td>
              </tr>
            ) : (
              items.map((item, idx) => {
                const isLast = idx === items.length - 1;
                const isBusy = actionLoading === item.id;
                return (
                  <tr
                    key={item.id}
                    className={`group transition-colors hover:bg-gray-50 ${!isLast ? "border-b border-gray-100" : ""}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center overflow-hidden rounded-xl bg-gray-100">
                          {item.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <MaterialIcon
                              name="menu_book"
                              className="text-[20px] text-gray-400"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-bold text-text-main">
                            {item.title}
                          </p>
                          <p className="truncate text-xs text-gray-400">
                            {item.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-text-main">
                      {formatPrice(item.price, item.currency)}
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          item.stock === 0
                            ? "bg-red-100 text-red-600"
                            : item.stock < 10
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(item.updatedAt).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-70 group-hover:opacity-100">
                        <button
                          onClick={() => setModal({ mode: "edit", item })}
                          title="Edit item"
                          disabled={isBusy}
                          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-40"
                        >
                          <MaterialIcon name="edit" className="text-[16px]" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          title="Delete item"
                          disabled={isBusy}
                          className="flex size-8 items-center justify-center rounded-lg border border-gray-200 text-gray-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-40"
                        >
                          <MaterialIcon name="delete" className="text-[16px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

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
              of <span className="font-bold text-text-main">{totalCount}</span>
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 disabled:opacity-30"
              >
                <MaterialIcon name="chevron_left" className="text-[20px]" />
              </button>
              {pageNums.map((p, i) =>
                p === "..." ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="px-1 text-sm text-gray-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-all ${
                      p === currentPage
                        ? "bg-primary text-white shadow-md shadow-primary/30"
                        : "text-text-muted hover:bg-gray-100"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="flex size-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 disabled:opacity-30"
              >
                <MaterialIcon name="chevron_right" className="text-[20px]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {modal && (
        <ItemModal
          mode={modal.mode}
          item={modal.item}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null);
            fetchItems(currentPage, debouncedSearch);
          }}
        />
      )}

      {deleteTarget && (
        <DeleteDialog
          item={deleteTarget}
          loading={actionLoading === deleteTarget.id}
          onCancel={() => {
            setDeleteTarget(null);
            setActionLoading(null);
          }}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </AdminShell>
  );
}
