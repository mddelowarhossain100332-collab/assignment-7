"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session?.user.name) setName(session.user.name);
  }, [session?.user.name]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return void toast.error("আপনার নাম লিখুন");
    setBusy(true);
    const { error } = await authClient.updateUser({ name: name.trim() });
    setBusy(false);
    if (error) return void toast.error("তথ্য আপডেট করা যায়নি");
    toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
    router.push("/profile");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">তথ্য আপডেট করুন</h1>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="form-control">
            <span className="label-text mb-1">নাম</span>
            <input className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" />
          </label>
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? <span className="loading loading-spinner loading-sm" /> : "তথ্য আপডেট করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}
