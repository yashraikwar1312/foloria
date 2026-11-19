"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useMagazineStore } from "@/lib/store";

export default function Explore() {
  const { magazines, hydrate } = useMagazineStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  useEffect(() => hydrate(), [hydrate]);
  const publicMagazines = useMemo(() => magazines.filter((m) => m.status === "published" && m.visibility === "public"), [magazines]);
  const shown = publicMagazines.filter((m) => (category === "All" || m.category === category) && m.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="min-h-screen">
      <nav className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-6">
        <Link href="/" className="editorial text-3xl font-semibold">Foliora</Link>
        <Link href="/dashboard" className="text-sm">My studio</Link>
      </nav>
      <section className="mx-auto max-w-[1180px] px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#858278]">The reader</p>
        <h1 className="editorial mt-3 text-6xl">Explore magazines</h1>
        <div className="mt-9 flex flex-col justify-between gap-4 sm:flex-row">
          <div className="flex gap-2">
            {["All", "Travel", "Culture", "Design", "Photography"].map((item) => (
              <button key={item} onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-xs ${category === item ? "border-[#20201e] bg-[#20201e] text-white" : "border-[#d8d4c9]"}`}>{item}</button>
            ))}
          </div>
          <label className="flex w-full items-center gap-2 rounded-full border border-[#d8d4c9] px-4 py-2 sm:w-64">
            <Search size={15}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full bg-transparent text-sm outline-none"/>
          </label>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((magazine) => (
            <Link href={`/magazine/${magazine.id}`} key={magazine.id} className="group">
              <div className="h-[420px] overflow-hidden bg-[#ddd8cc]">
                <div className="h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]" style={{ backgroundImage: `url(${magazine.cover})` }}/>
              </div>
              <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[#858278]">{magazine.category}</p>
              <h2 className="editorial mt-1 text-3xl">{magazine.title}</h2>
              <p className="mt-1 text-sm text-[#77746d]">by {magazine.author}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
