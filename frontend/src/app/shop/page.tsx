"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { itemService, orderService } from "@/services";
import { extractApiError } from "@/services";
import { RequireAuth } from "@/components/auth/RequireAuth";
import type { Item, ItemOrder } from "@/types";
import { routes } from "@/config";
import { MaterialIcon } from "@/components/ui";

/* ─── Skeleton ────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <article className="flex flex-col gap-4 rounded-2xl bg-card-light dark:bg-card-dark p-4 border border-gray-100 dark:border-white/5 animate-pulse">
      <div className="aspect-[3/4] w-full rounded-xl bg-gray-200 dark:bg-white/10" />
      <div className="flex flex-col gap-2">
        <div className="h-5 bg-gray-200 dark:bg-white/10 rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-full" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-2/3" />
      </div>
      <div className="h-10 bg-gray-200 dark:bg-white/10 rounded-full" />
    </article>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function OrderBooksPage() {
  const PAGE_SIZE = 8;
  const router = useRouter();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Track Order States
  const [trackOrderNo, setTrackOrderNo] = useState("");
  const [trackEmail, setTrackEmail] = useState("");
  const [trackResult, setTrackResult] = useState<ItemOrder | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackOrderNo.trim() || !trackEmail.trim()) {
      setTrackError("Please enter both Order No and Email.");
      return;
    }

    setIsTracking(true);
    setTrackError(null);
    setTrackResult(null);

    try {
      const res = await orderService.track(trackOrderNo, trackEmail);
      if (res.success && res.data) {
        setTrackResult(res.data);
      } else {
        setTrackError(res.message || "Order not found.");
      }
    } catch (err) {
      setTrackError(
        extractApiError(
          err,
          "Failed to track order. Please check your details.",
        ),
      );
    } finally {
      setIsTracking(false);
    }
  };

  const fetchItems = useCallback((q: string, currentPage: number) => {
    setLoading(true);
    setError(null);
    itemService
      .getAll(currentPage, PAGE_SIZE, q || undefined)
      .then((res) => {
        setItems(res.data?.items ?? []);
        setTotalPages(res.data?.totalPages ?? 1);
      })
      .catch(() => setError("Could not load the books. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchItems(search, page), 350);
    return () => clearTimeout(t);
  }, [search, page, fetchItems]);

  const fallbackImg =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC4vXTKgm_jzDVZ1LBV-Al_QCtiJsxWH4jj1Sx_8p0Poht4fOOPU7wSZq83uaR6AvWYqaogDtlNy8E1f7Qm5NZGPWOJK9-Zu6jiC18XxaKhE9g-iKbkTtj06zueGlVjCOZ6napZsIPAtYf2KUqHJKXYndvaL7jsxqnXxTWXWXNLG3vm5e2xUZp8mja3g8xq3_ZpkvsshqrVFlojEjrpwj0WfTpj0rWYbVa_TS8I9NhOq5kvKyEk7D2QcQgKR5HoDRUjhoYp9Ud6Sd0";

  return (
    <RequireAuth featureName="order books">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 md:py-20 w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-gray-900 dark:text-white md:text-5xl lg:text-6xl">
              Scoop Up the Secrets:{" "}
              <span className="text-primary">
                IScream&apos;s Recipe Collection
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto lg:mx-0">
              From our parlor to your kitchen. Discover the magic behind our
              famous flavors with our exclusive cookbooks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <button
                onClick={() =>
                  document
                    .getElementById("books-grid")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-red-600 hover:scale-105 hover:-translate-y-0.5"
              >
                View Collection
              </button>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="aspect-[4/3] w-full overflow-hidden rounded-[2.5rem] bg-gray-100 dark:bg-white/5 shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 ease-out relative">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDnZJctqOY43WhOZ5XpuScd8y6iLiOEVEwEWB9CFAvQ1Gcn-E8zUwTT_Ovbf-Xf3xlA9hJ93Hv1n4RoLS0D4hikPDSln8MlJXGvF1ZH74EEVeqmaS2UJIIExBB0JgNLgt9plZSmBK03DNXgtuQIFVvQScSivBp4-Lbcy35b_9rarXuemLikygw0CH2vLGRjmz2fJCSxKxMX83tk-mD7_Z6qz_SrqraioDFcE632y7z_--7ehORWEeIGsgjFhrvI1ALcoGiSsUNerlE')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur px-4 py-2 shadow-lg">
                  <span className="material-symbols-outlined text-primary">
                    auto_stories
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    Featured: The Summer Edit
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="books-grid" className="w-full max-w-7xl pb-20">
        {/* Search Bar */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <MaterialIcon
              name="search"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search ice cream books..."
              className="w-full h-11 rounded-2xl border border-gray-200 bg-white dark:bg-card-dark dark:border-white/10 pl-11 pr-4 text-sm text-gray-900 dark:text-white shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  setPage(1);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <MaterialIcon name="close" className="text-[18px]" />
              </button>
            )}
          </div>
          <h2 className="text-xl font-black text-gray-900 dark:text-white">
            {loading
              ? "Loading..."
              : error
                ? "Error"
                : `Page ${page}/${totalPages} - ${items.length} result${items.length !== 1 ? "s" : ""}`}
          </h2>
        </div>

        {error && (
          <div className="py-12 text-center">
            <span className="material-symbols-outlined text-4xl text-red-400 block mb-3">
              error
            </span>
            <p className="text-gray-500">{error}</p>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : items.length === 0 ? (
              <div className="col-span-4 py-20 text-center text-gray-400">
                <span className="material-symbols-outlined text-5xl mb-4 block">
                  auto_stories
                </span>
                <p className="text-lg font-medium">
                  {search.trim()
                    ? "No matching books found."
                    : "No books yet. Check back later!"}
                </p>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="group relative flex flex-col gap-4 rounded-2xl bg-card-light dark:bg-card-dark p-4 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl border border-gray-100 dark:border-white/5"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 dark:bg-white/5">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{
                        backgroundImage: `url('${item.imageUrl || fallbackImg}')`,
                      }}
                    />
                    {item.stock === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white/90 text-gray-800 text-xs font-bold px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold leading-tight text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary dark:bg-primary/20">
                          {typeof item.price === "number"
                            ? item.price.toLocaleString("vi-VN") +
                              " " +
                              item.currency
                            : item.price}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                    </div>

                    <button
                      disabled={item.stock === 0}
                      onClick={() =>
                        router.push(`/shop/checkout?item=${item.id}`)
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-bold text-white transition-colors hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-lg">
                        shopping_bag
                      </span>
                      {item.stock === 0 ? "Out of Stock" : "Buy Now"}
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-10">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center disabled:opacity-40 hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_left
              </span>
            </button>
            <span className="flex items-center text-sm font-semibold text-gray-600 dark:text-gray-300">
              {page} / {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center disabled:opacity-40 hover:border-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                chevron_right
              </span>
            </button>
          </div>
        )}
      </section>
    </RequireAuth>
  );
}
