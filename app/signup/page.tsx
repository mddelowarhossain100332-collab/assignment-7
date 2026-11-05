"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function fail(msg: string) {
    setError(msg);
    toast.error(msg);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (name.trim().length < 2) return fail("আপনার নাম লিখুন");
    if (!EMAIL_RE.test(email)) return fail("সঠিক ইমেইল ঠিকানা দিন");
    if (password.length < 6) return fail("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    if (password !== confirmPassword) return fail("পাসওয়ার্ড দুটি মিলছে না");

    setBusy(true);
    const { error } = await authClient.signUp.email({ 
      name: name.trim(), 
      email, 
      password 
    });
    setBusy(false);

    if (error) {
      const m = (error.message ?? "").toLowerCase();
      return fail(
        m.includes("exist") 
          ? "এই ইমেইল দিয়ে আগেই একাউন্ট খোলা হয়েছে" 
          : "রেজিস্ট্রেশন করা যায়নি। তথ্য যাচাই করে আবার চেষ্টা করুন"
      );
    }

    toast.success("রেজিস্ট্রেশন সফল! এবার সাইন ইন করুন");
    router.push("/signin");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">একাউন্ট তৈরি করুন</h1>
        <p className="mt-1 text-sm text-base-content/60">বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          {error && <div role="alert" className="alert alert-error py-2 text-sm">{error}</div>}
          
          <label className="form-control">
            <span className="label-text mb-1">নাম</span>
            <input className="input input-bordered" value={name} onChange={(e) => setName(e.target.value)} placeholder="আপনার নাম" autoComplete="name" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">ইমেইল</span>
            <input type="email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">পাসওয়ার্ড</span>
            <input type="password" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="কমপক্ষে ৬ অক্ষর" autoComplete="new-password" />
          </label>

          <label className="form-control">
            <span className="label-text mb-1">পাসওয়ার্ড নিশ্চিতকরণ</span>
            <input type="password" className="input input-bordered" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="পুনরায় পাসওয়ার্ড দিন" autoComplete="new-password" />
          </label>

          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? <span className="loading loading-spinner loading-sm" /> : "রেজিস্টার করুন"}
          </button>
        </form>

        <div className="divider text-sm">অথবা</div>
        <SocialButtons />

        <p className="mt-6 text-center text-sm">
          আগেই একাউন্ট আছে? <Link href="/signin" className="font-semibold text-primary hover:underline">সাইন ইন করুন</Link>
        </p>
      </div>
    </div>
  );
}