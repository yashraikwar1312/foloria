export default function StatusPage() {
  const configured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-6 text-center">
      <div>
        <p className="editorial text-5xl">Foliora is live</p>
        <p className="mt-4 text-sm text-[#77746d]">Vercel deployment and routing are working.</p>
        <p className="mt-6 rounded-full border border-[#dedbd2] px-4 py-2 text-sm">
          Supabase: {configured ? "Configured" : "Missing environment variables"}
        </p>
      </div>
    </main>
  );
}
