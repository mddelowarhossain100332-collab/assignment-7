"use client";
import Link from "next/link";
import Image from "next/image"; // Next.js এর Image কম্পোনেন্ট
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getCategories } from "@/lib/api";
import { useAsync } from "@/lib/useAsync";
import { bnToday } from "@/lib/bn";
import logo from "@/components/logo-icon.png"; 




export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: cats } = useAsync(getCategories, []);
  const [date, setDate] = useState("");

  useEffect(() => setDate(bnToday()), []);

  async function handleSignOut() {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
    router.refresh();
  }

  const linkCls = (active: boolean) =>
    `whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition ${
      active ? "bg-primary text-primary-content" : "hover:bg-base-200"
    }`;

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between py-3">
        {/* logo r tithle */}
          <Link href="/" className="flex items-center gap-2 leading-tight">
            <Image 
              src={logo} 
              alt="Logo" 
              width={32} 
              height={32} 
              className="h-8 w-auto object-contain" 
            />
            <div>
              <span className="block text-xl font-bold text-primary sm:text-2xl">বাজার দর</span>
              <span className="block text-xs text-base-content/60 min-h-4">{date}</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            {isPending ? (
              <div className="skeleton h-8 w-24 rounded-full" />
            ) : session ? (
              <div className="dropdown dropdown-end">
                <button tabIndex={0} className="btn btn-ghost btn-sm sm:btn-md gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-content text-sm">
                    {session.user.name?.[0] ?? "👤"}
                  </span>
                  <span className="hidden sm:inline">{session.user.name}</span>
                </button>
                <ul
                  tabIndex={0}
                  className="menu dropdown-content z-20 mt-2 w-48 rounded-box border border-base-300 bg-base-100 p-2 shadow"
                >
                  <li><Link href="/profile">আমার প্রোফাইল</Link></li>
                  <li><button onClick={handleSignOut}>সাইন আউট</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link href="/signin" className="btn btn-outline btn-primary btn-sm sm:btn-md">সাইন ইন</Link>
                <Link href="/signup" className="btn btn-primary btn-sm sm:btn-md">সাইন আপ</Link>
              </>
            )}
          </div>
        </div>

        <nav className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 pb-3" aria-label="ক্যাটেগরি">
          <Link href="/" className={linkCls(pathname === "/")}>সব পণ্য</Link>
          {cats?.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className={linkCls(pathname === `/category/${c.slug}`)}>
              {c.icon} {c.nameBn}
            </Link>
          ))}
          {!cats && Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-8 w-20 shrink-0 rounded-full" />)}
        </nav>
      </div>
    </header>
  );
}