import { type ClassValue, clsx } from "clsx";

/**
 * Utility to merge Tailwind classes safely.
 * Uses clsx for conditional class joining.
 * If you later add tailwind-merge, swap in `twMerge(clsx(inputs))`.
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Return a safe image URL string or undefined.
 * Only allows http, https and data:image schemes. Returns undefined for invalid URLs.
 */
export function sanitizeImageUrl(raw?: string) {
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const scheme = url.protocol.replace(":", "");
    if (scheme === "http" || scheme === "https") return url.toString();
    if (scheme === "data" && url.pathname.startsWith("image/")) return raw;
    return undefined;
  } catch (e) {
    // try data urls that may not parse with new URL in some environments
    if (raw.startsWith("data:image/")) return raw;
    return undefined;
  }
}
