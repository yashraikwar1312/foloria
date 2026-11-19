"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!supabase) {
      router.replace("/login");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      router.replace(data.session ? "/dashboard" : "/login");
    });
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef]">
      <p className="editorial text-2xl">Completing sign in...</p>
    </main>
  );
}
