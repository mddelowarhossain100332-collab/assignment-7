"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import SocialButtons from "@/components/SocialButtons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [redirect, setRedirect] = useState("/");

  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const r = q.get("redirect");
    if (r && r.startsWith("/") && !r.startsWith("//")) setRedirect(r);
    if (q.get("protected")) toast.error("এই পাতা দেখতে আগে সাইন ইন করুন", { id: "protected" });
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!EMAIL_RE.test(email)) return fail("সঠিক ইমেইল ঠিকানা দিন");
    if (password.length < 6) return fail("পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে");

    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) return fail("ইমেইল বা পাসওয়ার্ড সঠিক নয়");

    toast.success("সফলভাবে সাইন ইন হয়েছে");
    router.push(redirect);
    router.refresh();
  }

  function fail(msg: string) {
    setError(msg);
    toast.error(msg);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <div className="rounded-2xl border border-base-300 bg-base-100 p-6 sm:p-8">
        <h1 className="text-2xl font-bold">সাইন ইন করুন</h1>
        <p className="mt-1 text-sm text-base-content/60">আপনার একাউন্টে প্রবেশ করুন</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          {error && <div role="alert" className="alert alert-error py-2 text-sm">{error}</div>}
          <label className="form-control">
            <span className="label-text mb-1">ইমেইল</span>
            <input type="email" className="input input-bordered" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
          </label>
          <label className="form-control">
            <span className="label-text mb-1">পাসওয়ার্ড</span>
            <input type="password" className="input input-bordered" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" autoComplete="current-password" />
          </label>
          <button className="btn btn-primary w-full" disabled={busy}>
            {busy ? <span className="loading loading-spinner loading-sm" /> : "সাইন ইন"}
          </button>
        </form>

        <div className="divider text-sm">অথবা</div>
        <SocialButtons callbackURL={redirect} />

        <p className="mt-6 text-center text-sm">
          একাউন্ট নেই? <Link href="/signup" className="font-semibold text-primary hover:underline">সাইন আপ করুন</Link>
        </p>
      </div>
    </div>
  );
}
