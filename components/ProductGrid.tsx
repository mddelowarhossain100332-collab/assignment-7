import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export function CardSkeletons({ count = 8 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card border border-base-300 bg-base-100 p-4">
          <div className="flex items-center gap-3">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/3" />
            </div>
          </div>
          <div className="skeleton mt-4 h-8 w-full" />
        </div>
      ))}
    </>
  );
}

export default function ProductGrid({
  products,
  loading,
  skeletonCount = 8,
}: {
  products: Product[];
  loading?: boolean;
  skeletonCount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {loading ? <CardSkeletons count={skeletonCount} /> : products.map((p) => <ProductCard key={p.id} p={p} />)}
    </div>
  );
}
