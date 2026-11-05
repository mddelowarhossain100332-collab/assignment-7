"use client";
import Link from "next/link";
import { useMemo } from "react";
import { getProductBySlug } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { getChange, toBn, toBn1, unitLabel } from "@/lib/bn";
import ChangeBadge from "@/components/ChangeBadge";
import NotFoundView from "@/components/NotFoundView";

function Stat({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 p-4">
      <p className="text-sm text-base-content/60">{label}</p>
      <p className={`mt-1 text-xl font-bold ${tone ?? ""}`}>{value}</p>
    </div>
  );
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const { data: p, loading } = useAsync(() => getProductBySlug(params.slug), [params.slug]);

  const summary = useMemo(() => {
    if (!p) return null;
    const m = p.markets ?? [];
    const min = m.length ? Math.min(...m.map((x) => x.min)) : p.today;
    const max = m.length ? Math.max(...m.map((x) => x.max)) : p.today;
    const avg = m.length ? m.reduce((s, x) => s + (x.min + x.max) / 2, 0) / m.length : p.today;
    const byDivision = new Map<string, typeof m>();
    m.forEach((x) => byDivision.set(x.division, [...(byDivision.get(x.division) ?? []), x]));
    return { min, max, avg, byDivision };
  }, [p]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl space-y-4 px-4 py-8">
        <div className="skeleton h-28 w-full" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-20" />)}
        </div>
        <div className="skeleton h-64 w-full" />
      </div>
    );
  }

  if (!p || !summary) {
    return <NotFoundView title="পণ্যটি পাওয়া যায়নি" message="এই নামে কোনো পণ্য নেই।" />;
  }

  const c = getChange(p);
  const trend = c.dir === "up" ? "বেড়েছে" : c.dir === "down" ? "কমেছে" : "অপরিবর্তিত আছে";

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Link href="/" className="text-sm text-primary hover:underline">← সব পণ্য</Link>

      {/* উপরের সারাংশ */}
      <section className="mt-3 rounded-2xl border border-base-300 bg-base-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="text-6xl" aria-hidden>{p.image}</span>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{p.nameBn}</h1>
              <p className="mt-1 text-base-content/70">
                {unitLabel(p.unit)} আজকের গড় দাম {toBn1(summary.avg)} টাকা; গতকালের তুলনায় দাম {trend}।
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href={`/category/${p.category}`} className="badge badge-outline badge-primary">
                  {p.categoryIcon} {p.categoryNameBn}
                </Link>
                <span className="badge badge-outline">{unitLabel(p.unit)}</span>
              </div>
            </div>
          </div>
          <ChangeBadge p={p} />
        </div>
      </section>

      {/* about dam */}
      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Stat label="সর্বনিম্ন দাম" value={`${toBn(summary.min)} টাকা`} tone="text-success" />
          <Stat label="সর্বোচ্চ দাম" value={`${toBn(summary.max)} টাকা`} tone="text-error" />
          <Stat label="গড় দাম" value={`${toBn1(summary.avg)} টাকা`} />
          <Stat label="বাজারভিত্তিক আজকের দাম" value={`${toBn(p.today)} টাকা`} tone="text-primary" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <Stat label="গতকাল" value={`${toBn(p.yesterday)} টাকা`} />
          <Stat label="গত সপ্তাহ" value={`${toBn(p.lastWeek)} টাকা`} />
          <Stat label="গত মাস" value={`${toBn(p.lastMonth)} টাকা`} />
        </div>
      </section>

     {/* bjar vittik dam */}
      {summary.byDivision.size > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-bold">বাজারভিত্তিক আজকের দাম</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from(summary.byDivision.entries()).map(([division, list]) => (
              <div key={division} className="rounded-xl border border-base-300 bg-base-100">
                <h3 className="border-b border-base-300 px-4 py-2 font-semibold">{division} বিভাগ</h3>
                <div className="overflow-x-auto">
                  <table className="table table-sm">
                    <thead>
                      <tr><th>বাজার</th><th className="text-right">সর্বনিম্ন</th><th className="text-right">সর্বোচ্চ</th></tr>
                    </thead>
                    <tbody>
                      {list.map((m) => (
                        <tr key={m.market}>
                          <td>{m.market}</td>
                          <td className="text-right text-success">{toBn(m.min)} টাকা</td>
                          <td className="text-right text-error">{toBn(m.max)} টাকা</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
