"use client";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SocialButtons({ callbackURL = "/" }: { callbackURL?: string }) {
  async function go(provider: "google" | "github") {
    const { error } = await authClient.signIn.social({ provider, callbackURL });
    if (error) toast.error("সোশ্যাল লগইন করা যায়নি। আবার চেষ্টা করুন।");
  }
  return (
    <div className="space-y-2">
      <button type="button" onClick={() => go("google")} className="btn btn-outline w-full">
        <span className="font-bold">G</span> Google দিয়ে চালিয়ে যান
      </button>
    </div>
  );
}
