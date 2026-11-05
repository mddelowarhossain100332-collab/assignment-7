import type { Product } from "@/lib/types";
import { getChange, toBn1 } from "@/lib/bn";

export default function ChangeBadge({ p }: { p: Product }) {
  const c = getChange(p);
  const style =
    c.dir === "up"
      ? "bg-green-100 text-green-700"
      : c.dir === "down"
      ? "bg-red-100 text-red-700"
      : "bg-gray-100 text-gray-600";
  const sym = c.dir === "up" ? "▲" : c.dir === "down" ? "▼" : "—";
  return (
    <span className={`rounded-full px-2.5 py-1 text-sm font-semibold ${style}`}>
      {sym} {toBn1(c.pct)}%
    </span>
  );
}
