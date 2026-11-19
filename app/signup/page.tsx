"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setSuccess(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="editorial text-3xl font-semibold">Foliora</Link>
        <h1 className="editorial mt-10 text-5xl">Create your studio.</h1>
        {success ? (
          <p className="mt-8 leading-7">Check your email to confirm your account, then return to sign in.</p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-xs">Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full border-b border-[#bbb7ad] bg-transparent py-3 outline-none"/></label>
            <label className="block text-xs">Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required className="mt-2 w-full border-b border-[#bbb7ad] bg-transparent py-3 outline-none"/></label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="mt-4 w-full rounded-full bg-[#20201e] py-3.5 text-sm text-white disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
          </form>
        )}
        <p className="mt-6 text-sm text-[#77746d]">Already have an account? <Link href="/login" className="text-[#20201e] underline">Sign in</Link></p>
      </div>
    </main>
  );
}
