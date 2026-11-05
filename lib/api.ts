import type { Category, Product } from "./types";

const BASES = [
  process.env.NEXT_PUBLIC_API_URL || "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

async function get<T>(path: string): Promise<T> {
  let last: unknown;
  for (const base of BASES) {
    try {
      const res = await fetch(base + path);
      if (!res.ok) throw new Error(String(res.status));
      return (await res.json()) as T;
    } catch (e) {
      last = e;
    }
  }
  throw last;
}

function toArray<T>(r: unknown): T[] {
  if (Array.isArray(r)) return r as T[];
  if (r && typeof r === "object") {
    const o = r as Record<string, unknown>;
    if (Array.isArray(o.data)) return o.data as T[];
    if (Array.isArray(o.products)) return o.products as T[];
    if (Array.isArray(o.categories)) return o.categories as T[];
    if ("id" in o) return [o as T];
  }
  return [];
}

export async function getProducts(category?: string): Promise<Product[]> {
  const path = category ? `/products?category=${encodeURIComponent(category)}` : "/products";
  return toArray<Product>(await get(path));
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const list = toArray<Product>(await get(`/products?slug=${encodeURIComponent(slug)}`));
    const exact = list.find((p) => p.slug === slug);
    if (!exact) return null;
   
    if (!exact.markets) {
      try {
        const full = toArray<Product>(await get(`/products/${exact.id}`))[0];
        return full ?? exact;
      } catch {
        return exact;
      }
    }
    return exact;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<Category[]> {
  return toArray<Category>(await get("/categories"));
}
