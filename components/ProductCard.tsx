import Link from "next/link";
import type { Product } from "@/lib/types";
import { toBn, unitLabel } from "@/lib/bn";
import ChangeBadge from "./ChangeBadge";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link
      href={`/product/${p.slug}`}
      className="card border border-base-300 bg-base-100 transition hover:border-primary hover:shadow-md"
    >
      <div className="card-body gap-0 p-4">
        <div className="flex items-center gap-3">
          <span className="text-4xl" aria-hidden>{p.image}</span>
          <div>
            <h3 className="text-lg font-semibold leading-tight">{p.nameBn}</h3>
            <p className="text-sm text-base-content/60">{unitLabel(p.unit)}</p>
          </div>
        </div>
        <div className="mt-3 flex items-end justify-between border-t border-base-300 pt-3">
          <div>
            <p className="text-xs text-base-content/60">আজকের দাম</p>
            <p className="text-xl font-bold">{toBn(p.today)} টাকা</p>
          </div>
          <ChangeBadge p={p} />
        </div>
      </div>
    </Link>
  );
}
