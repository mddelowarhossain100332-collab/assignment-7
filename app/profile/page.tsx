"use client";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 text-center sm:p-8">
        <h1 className="mb-6 text-2xl font-bold">আমার প্রোফাইল</h1>
        {isPending || !session ? (
          <div className="space-y-3">
            <div className="skeleton mx-auto h-20 w-20 rounded-full" />
            <div className="skeleton mx-auto h-5 w-40" />
            <div className="skeleton mx-auto h-4 w-56" />
          </div>
        ) : (
          <>
            {session.user.image ? (
            // eslint
              <img src={session.user.image} alt="" className="mx-auto h-20 w-20 rounded-full object-cover" />
            ) : (
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-primary-content">
                {session.user.name?.[0] ?? "👤"}
              </div>
            )}
            <p className="mt-4 text-xl font-semibold">{session.user.name}</p>
            <p className="text-base-content/60">{session.user.email}</p>
            <Link href="/profile/update" className="btn btn-primary mt-6">তথ্য আপডেট করুন</Link>
          </>
        )}
      </div>
    </div>
  );
}
