"use client";
import { useMemo } from "react";
import Image from "next/image";
import { getProducts } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { getChange } from "@/lib/bn";
import ProductGrid from "@/components/ProductGrid";
import heroImg from "@/components/bazar-hero.png"; // হিরো ইমেজ ইমপোর্ট করা হলো

function SectionHead({ title, sub, id }: { title: string; sub?: string; id?: string }) {
  return (
    <div id={id} className="mb-4 scroll-mt-4">
      <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
      {sub && <p className="text-sm text-base-content/60">{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  const { data, loading, error } = useAsync(() => getProducts(), []);

  const risers = useMemo(
    () => (data ?? []).filter((p) => getChange(p).dir === "up").sort((a, b) => getChange(b).pct - getChange(a).pct).slice(0, 6),
    [data]
  );
  const fallers = useMemo(
    () => (data ?? []).filter((p) => getChange(p).dir === "down").sort((a, b) => getChange(b).pct - getChange(a).pct).slice(0, 6),
    [data]
  );

  return (
    <div>
      {/* hero section aikhane */}
      <section className="bg-base-100">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-10 md:grid-cols-2 md:py-14">
          <div>
            <p className="text-sm font-medium text-accent">প্রতিদিনের বাজার, এক জায়গায়</p>
            <h1 className="mt-2 text-3xl font-bold leading-snug sm:text-4xl lg:text-5xl">
              আজকের বাজারের দাম এক নজরে 
            </h1>
            <p className="mt-4 max-w-md text-base-content/70">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার আজকের দর এবং গতকালের তুলনায় কতটা বদলেছে — সব এক নজরে।
            </p>
            <a href="#সব-পণ্য" className="btn btn-primary mt-6">সব পণ্যের দাম দেখুন</a>
          </div>

         
          <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg">
            <Image 
              src={heroImg} 
              alt="Bazar Hero Banner" 
              fill 
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10">
        {error && (
          <div role="alert" className="alert alert-error">
            <span>তথ্য আনতে সমস্যা হয়েছে। পেজটি রিলোড করে আবার চেষ্টা করুন।</span>
          </div>
        )}

        <section>
          <SectionHead title="আজ দাম বেড়েছে ▲" sub="গতকালের তুলনায় সবচেয়ে বেশি বেড়েছে এমন ৬টি পণ্য" />
          <ProductGrid products={risers} loading={loading} skeletonCount={6} />
        </section>

        <section>
          <SectionHead title="আজ দাম কমেছে ▼" sub="গতকালের তুলনায় সবচেয়ে বেশি কমেছে এমন ৬টি পণ্য" />
          <ProductGrid products={fallers} loading={loading} skeletonCount={6} />
        </section>

        <section>
          <SectionHead id="সব-পণ্য" title="সব পণ্য" sub="সব ক্যাটেগরির পণ্যের আজকের দাম" />
          <ProductGrid products={data ?? []} loading={loading} skeletonCount={8} />
        </section>
      </div>
    </div>
  );
}