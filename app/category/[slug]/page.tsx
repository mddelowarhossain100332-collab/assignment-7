"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { getCategories, getProducts } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { parseBn } from "@/lib/bn";
import ProductGrid from "@/components/ProductGrid";
import NotFoundView from "@/components/NotFoundView";

type Sort = "default" | "asc" | "desc";

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [sort, setSort] = useState<Sort>("default");

  const cats = useAsync(getCategories, []);
  const prods = useAsync(() => getProducts(slug), [slug]);

  const category = cats.data?.find((c) => c.slug === slug);

  const sorted = useMemo(() => {
    const list = [...(prods.data ?? [])];
  // mittha kaj korar jnno
    if (sort === "asc") list.sort((a, b) => parseBn(a.today) - parseBn(b.today));
    if (sort === "desc") list.sort((a, b) => parseBn(b.today) - parseBn(a.today));
    return list;
  }, [prods.data, sort]);

  const loading = cats.loading || prods.loading;

//  catagory load howar slog
  if (!cats.loading && !cats.error && !category) {
    return <NotFoundView title="ক্যাটেগরিটি পাওয়া যায়নি" message="এই নামে কোনো ক্যাটেগরি নেই।" />;
  }

  const empty = !loading && !prods.error && sorted.length === 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          {category ? (
            <>
              <span className="text-4xl" aria-hidden>{category.icon}</span>
              <h1 className="text-2xl font-bold sm:text-3xl">{category.nameBn}</h1>
            </>
          ) : (
            <div className="skeleton h-10 w-48" />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <span className="font-medium">সাজান:</span>
          <select
            className="select select-bordered select-sm sm:select-md"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
          >
            <option value="default">ডিফল্ট</option>
            <option value="asc">দাম: কম থেকে বেশি</option>
            <option value="desc">দাম: বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      {prods.error && (
        <div role="alert" className="alert alert-error">
          <span>তথ্য আনতে সমস্যা হয়েছে। আবার চেষ্টা করুন।</span>
        </div>
      )}

      {empty ? (
        <div className="flex flex-col items-center py-16 text-center">
          <div className="text-6xl" aria-hidden>🧺</div>
          <p className="mt-3 text-lg font-semibold">এই ক্যাটেগরিতে কোনো পণ্য নেই</p>
          <Link href="/" className="btn btn-primary mt-5">হোম পেজে ফিরে যান</Link>
        </div>
      ) : (
        <ProductGrid products={sorted} loading={loading} skeletonCount={8} />
      )}
    </div>
  );
}
