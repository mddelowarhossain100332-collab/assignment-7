"use client";
import { getProducts } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { getChange, toBn, toBn1, unitLabel } from "@/lib/bn";

export default function Ticker() {
  const { data } = useAsync(() => getProducts(), []);

  if (!data) return <div className="h-9 bg-primary" aria-hidden />;

  const items = data.map((p) => {
    const c = getChange(p);
    const sym = c.dir === "up" ? "▲" : c.dir === "down" ? "▼" : "—";
    const color = c.dir === "up" ? "text-green-300" : c.dir === "down" ? "text-red-300" : "text-gray-300";
    return (
      <span key={p.id} className="flex items-center gap-2 whitespace-nowrap">
        <span>{p.image}</span>
        <span className="font-medium">{p.nameBn}</span>
        <span className="opacity-80">{toBn(p.today)} টাকা/{unitLabel(p.unit).replace("প্রতি ", "")}</span>
        <span className={color}>{sym} {toBn1(c.pct)}%</span>
      </span>
    );
  });

  return (
    <div className="marquee-wrap overflow-hidden bg-primary text-primary-content" aria-label="আজকের দামের টিকার">
      <div className="marquee flex w-max text-sm py-2">
        <div className="flex gap-10 pr-10">{items}</div>
        <div className="flex gap-10 pr-10" aria-hidden>{items}</div>
      </div>
    </div>
  );
}
