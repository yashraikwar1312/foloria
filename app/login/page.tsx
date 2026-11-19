"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!supabase) {
      setError("Supabase is not configured.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#f7f5ef] lg:grid-cols-2">
      <section className="hidden bg-[url('https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center lg:block" />
      <section className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="editorial text-3xl font-semibold">Foliora</Link>
          <h1 className="editorial mt-10 text-5xl">Welcome back.</h1>
          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block text-xs">Email<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required className="mt-2 w-full border-b border-[#bbb7ad] bg-transparent py-3 outline-none"/></label>
            <label className="block text-xs">Password<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required className="mt-2 w-full border-b border-[#bbb7ad] bg-transparent py-3 outline-none"/></label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button disabled={loading} className="mt-4 w-full rounded-full bg-[#20201e] py-3.5 text-sm text-white disabled:opacity-50">{loading ? "Signing in..." : "Sign in"}</button>
          </form>
          <p className="mt-6 text-sm text-[#77746d]">New to Foliora? <Link href="/signup" className="text-[#20201e] underline">Create an account</Link></p>
        </div>
      </section>
    </main>
  );
}
