"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Copy, MoreHorizontal, Plus, Search } from "lucide-react";
import { useMagazineStore } from "@/lib/store";

export default function Dashboard() {
  const { magazines, hydrate, deleteMagazine, saveMagazine } = useMagazineStore();
  useEffect(() => hydrate(), [hydrate]);

  return (
    <main className="min-h-screen bg-[#f7f5ef]">
      <header className="flex h-16 items-center border-b border-[#dedbd2] px-6">
        <Link href="/" className="editorial text-2xl font-semibold">Foliora</Link>
        <div className="mx-auto flex w-[360px] items-center gap-2 rounded-full border border-[#ddd9cf] bg-white px-4 py-2 text-sm text-[#858278]">
          <Search size={15}/> Search projects
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-[#d8d0be] text-xs">YM</div>
      </header>
      <div className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm text-[#858278]">Wednesday, November 19</p>
            <h1 className="editorial mt-2 text-5xl">Welcome back.</h1>
          </div>
          <Link href="/editor/new" className="flex items-center gap-2 rounded-full bg-[#20201e] px-5 py-3 text-sm text-white">
            <Plus size={16}/> New magazine
          </Link>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {magazines.map((magazine) => (
            <article key={magazine.id} className="group">
              <Link href={`/editor/${magazine.id}`} className="relative block h-[300px] overflow-hidden bg-[#ded9cd]">
                <div className="h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.02]" style={{ backgroundImage: `url(${magazine.cover})` }} />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] uppercase tracking-wider">
                  {magazine.status}
                </span>
              </Link>
              <div className="mt-3 flex items-start justify-between">
                <div>
                  <h2 className="font-medium">{magazine.title}</h2>
                  <p className="mt-1 text-xs text-[#858278]">{magazine.pages.length} pages · Edited {magazine.updatedAt}</p>
                </div>
                <button onClick={() => deleteMagazine(magazine.id)} className="p-1 text-[#858278] hover:text-black" title="Delete project"><MoreHorizontal size={18}/></button>
              </div>
              <button onClick={() => saveMagazine({ ...magazine, id: `${magazine.id}-copy`, title: `${magazine.title} Copy`, status: "draft", updatedAt: "Just now" })} className="mt-3 flex items-center gap-2 text-xs text-[#858278] hover:text-black">
                <Copy size={13}/> Duplicate
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
