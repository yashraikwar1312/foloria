"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const signUpWithGoogle = async () => {
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setGoogleLoading(true);
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (oauthError) {
      setGoogleLoading(false);
      setError(oauthError.message);
    }
  };

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
          <>
          <button type="button" onClick={signUpWithGoogle} disabled={googleLoading} className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-[#cbc7bd] bg-white py-3.5 text-sm disabled:opacity-50">
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.26-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.71-1.58 2.68-3.9 2.68-6.62Z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86a5.36 5.36 0 0 1-5.05-3.71H.96v2.33A9 9 0 0 0 9 18Z"/><path fill="#FBBC05" d="M3.95 10.71A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.04l2.99-2.33Z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.58-2.58A8.65 8.65 0 0 0 9 0 9 9 0 0 0 .96 4.96l2.99 2.33A5.36 5.36 0 0 1 9 3.58Z"/></svg>
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </button>
          <div className="my-6 flex items-center gap-3 text-xs text-[#858278]"><span className="h-px flex-1 bg-[#dedbd2]"/><span>or</span><span className="h-px flex-1 bg-[#dedbd2]"/></div>
          <form onSubmit={submit} className="space-y-4">
            <label className="block text-xs">Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full border-b border-[#bbb7ad] bg-transparent py-3 outline-none"/></label>
            <label className="block text-xs">Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" minLength={8} required className="mt-2 w-full border-b border-[#bbb7ad] bg-transparent py-3 outline-none"/></label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="mt-4 w-full rounded-full bg-[#20201e] py-3.5 text-sm text-white disabled:opacity-50">{loading ? "Creating account..." : "Create account"}</button>
          </form>
          </>
        )}
        <p className="mt-6 text-sm text-[#77746d]">Already have an account? <Link href="/login" className="text-[#20201e] underline">Sign in</Link></p>
      </div>
    </main>
  );
}
