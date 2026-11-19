"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Copy, ImageIcon, Layers3, Minus, Plus, Redo2, Shapes, TextCursorInput, Trash2, Undo2, Upload } from "lucide-react";
import { useMagazineStore, type Magazine, type PageData } from "@/lib/store";

function EditorContent() {
  const params = useParams<{ id: string }>();
  const { magazines, hydrate, saveMagazine } = useMagazineStore();
  const [active, setActive] = useState(0);
  const [saved, setSaved] = useState("All changes saved");
  const [zoom, setZoom] = useState(72);
  const [tab, setTab] = useState("Pages");

  const [magazine, setMagazine] = useState<Magazine>({
    id: "new",
    title: "Untitled Magazine",
    subtitle: "Issue One",
    author: "Your name",
    category: "Culture",
    description: "A new independent publication.",
    status: "draft",
    visibility: "public",
    cover: "",
    updatedAt: "Just now",
    pages: [{ id: "page-1", background: "#e9e5da", title: "Untitled", subtitle: "Stories worth keeping" }],
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (params.id === "new") return;
    const existing = magazines.find((item) => item.id === params.id);
    if (existing) setMagazine(existing);
  }, [params.id, magazines]);

  const update = (patch: Partial<Magazine>) => {
    setSaved("Saving...");
    setMagazine((current) => {
      const next = { ...current, ...patch, updatedAt: "Just now" };
      window.setTimeout(() => { saveMagazine(next); setSaved("All changes saved"); }, 450);
      return next;
    });
  };

  const updatePage = (patch: Partial<PageData>) => {
    update({ pages: magazine.pages.map((page, index) => index === active ? { ...page, ...patch } : page) });
  };

  const addPage = () => {
    if (magazine.pages.length >= 45) return;
    const page = { id: `page-${Date.now()}`, background: "#eeeae1", title: "New story", subtitle: "Add a thought, place or moment" };
    update({ pages: [...magazine.pages, page] });
    setActive(magazine.pages.length);
  };

  const deletePage = () => {
    if (magazine.pages.length <= 1) return;
    const pages = magazine.pages.filter((_, index) => index !== active);
    setActive(Math.max(0, active - 1));
    update({ pages });
  };

  const duplicatePage = () => {
    if (magazine.pages.length >= 45) return;
    const copy = { ...magazine.pages[active], id: `page-${Date.now()}` };
    const pages = [...magazine.pages]; pages.splice(active + 1, 0, copy);
    update({ pages }); setActive(active + 1);
  };

  const publish = () => {
    const id = magazine.id === "new" ? `issue-${Date.now().toString(36)}` : magazine.id;
    const next = { ...magazine, id, status: "published" as const, cover: magazine.pages[0].image || magazine.cover || "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85" };
    saveMagazine(next);
    setMagazine(next);
  };

  const page = magazine.pages[active];

  return (
    <main className="flex h-screen overflow-hidden bg-[#edebe5]">
      <aside className="hidden w-[220px] border-r border-[#d8d5cc] bg-[#f8f7f2] lg:flex lg:flex-col">
        <div className="flex h-16 items-center border-b border-[#dedbd2] px-4">
          <Link href="/dashboard" className="mr-3 rounded p-1 hover:bg-[#ebe8df]"><ArrowLeft size={17}/></Link>
          <span className="editorial text-xl">Foliora</span>
        </div>
        <div className="grid grid-cols-4 border-b border-[#dedbd2] text-[#77746d]">
          {[["Pages", Layers3], ["Text", TextCursorInput], ["Image", ImageIcon], ["Shape", Shapes]].map(([name, Icon]) => (
            <button key={String(name)} onClick={() => setTab(String(name))} className={`flex flex-col items-center gap-1 py-3 text-[9px] ${tab === name ? "bg-white text-black" : ""}`}>
              <Icon size={16}/>{String(name)}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          {tab === "Pages" ? (
            <div className="space-y-3">
              {magazine.pages.map((item, index) => (
                <button key={item.id} onClick={() => setActive(index)} className={`block w-full p-2 ${active === index ? "bg-[#dedbd2]" : "hover:bg-[#efede6]"}`}>
                  <div className="mx-auto h-[150px] w-[106px] shadow-sm" style={{ background: item.background, backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
                    {!item.image && <p className="editorial px-3 pt-12 text-center text-lg leading-5">{item.title}</p>}
                  </div>
                  <p className="mt-2 text-[10px] text-[#77746d]">{index + 1}</p>
                </button>
              ))}
            </div>
          ) : tab === "Text" ? (
            <div className="space-y-2">
              {["Editorial heading", "Section heading", "Body text", "Caption"].map((text) => (
                <button key={text} onClick={() => updatePage({ title: text })} className="w-full rounded border border-[#ddd9cf] bg-white p-3 text-left text-sm">{text}</button>
              ))}
            </div>
          ) : tab === "Image" ? (
            <label className="flex cursor-pointer flex-col items-center rounded border border-dashed border-[#bbb7ac] p-5 text-xs text-[#77746d]">
              <Upload size={20}/><span className="mt-2">Upload image</span>
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (file.size > 10 * 1024 * 1024) { alert("Please choose an image smaller than 10 MB."); return; }
                const reader = new FileReader();
                reader.onload = () => updatePage({ image: String(reader.result) });
                reader.readAsDataURL(file);
              }}/>
            </label>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {["#20201e", "#b6a58a", "#7d8878", "#bc6d55"].map((color) => <button key={color} onClick={() => updatePage({ background: color })} className="h-20 rounded" style={{ background: color }}/>)}
            </div>
          )}
        </div>
        <button onClick={addPage} disabled={magazine.pages.length >= 45} className="m-3 flex items-center justify-center gap-2 rounded border border-[#d1cec4] py-2 text-sm disabled:opacity-40"><Plus size={15}/> Add page</button>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[#d8d5cc] bg-[#faf9f5] px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/dashboard" className="lg:hidden"><ArrowLeft size={18}/></Link>
            <input value={magazine.title} onChange={(e) => update({ title: e.target.value })} className="w-32 truncate border-none bg-transparent text-sm font-medium outline-none sm:w-48"/>
            <span className="hidden text-xs text-[#858278] sm:inline">{saved}</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="rounded p-2 hover:bg-[#ebe8df]" title="Undo"><Undo2 size={16}/></button>
            <button className="rounded p-2 hover:bg-[#ebe8df]" title="Redo"><Redo2 size={16}/></button>
            <Link href={`/magazine/${magazine.id}`} className="ml-1 hidden rounded-full border border-[#d3d0c6] px-4 py-2 text-xs sm:block">Preview</Link>
            <button onClick={publish} className="ml-1 rounded-full bg-[#20201e] px-4 py-2 text-xs text-white">Publish</button>
          </div>
        </header>
        <div className="relative flex flex-1 items-center justify-center overflow-auto p-6">
          <div className="relative origin-center shadow-[0_20px_55px_rgba(70,65,55,.18)] transition-transform" style={{ width: 420 * zoom / 72, height: 560 * zoom / 72, background: page.background, backgroundImage: page.image ? `url(${page.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}>
            <div className="absolute inset-0 flex flex-col items-center justify-end p-[12%] text-center">
              <div className={page.image ? "mb-3 w-full bg-black/35 px-4 py-3 text-white" : "w-full"}>
                <input value={page.title} onChange={(e) => updatePage({ title: e.target.value })} className="editorial w-full bg-transparent text-center text-[42px] leading-none outline-none" style={{ fontSize: `${38 * zoom / 72}px` }}/>
                <input value={page.subtitle} onChange={(e) => updatePage({ subtitle: e.target.value })} className="mt-3 w-full bg-transparent text-center text-xs uppercase tracking-[0.18em] outline-none"/>
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#d8d5cc] bg-white px-3 py-2 shadow-sm">
            <button onClick={() => setZoom(Math.max(45, zoom - 10))}><Minus size={14}/></button>
            <span className="w-10 text-center text-xs">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(100, zoom + 10))}><Plus size={14}/></button>
          </div>
        </div>
        <footer className="flex h-12 items-center justify-center gap-4 border-t border-[#d8d5cc] bg-[#faf9f5] text-xs">
          <button onClick={() => setActive(Math.max(0, active - 1))} disabled={active === 0}><ArrowLeft size={15}/></button>
          <span>{active + 1} / 45 Pages</span>
          <button onClick={() => setActive(Math.min(magazine.pages.length - 1, active + 1))} disabled={active === magazine.pages.length - 1}><ArrowRight size={15}/></button>
          <button onClick={duplicatePage} title="Duplicate page" className="ml-3"><Copy size={15}/></button>
          <button onClick={deletePage} title="Delete page"><Trash2 size={15}/></button>
        </footer>
      </section>

      <aside className="hidden w-[240px] border-l border-[#d8d5cc] bg-[#f8f7f2] p-4 xl:block">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#858278]">Page settings</p>
        <label className="mt-5 block text-xs">Background</label>
        <input type="color" value={page.background} onChange={(e) => updatePage({ background: e.target.value })} className="mt-2 h-10 w-full rounded border-0"/>
        <label className="mt-5 block text-xs">Title</label>
        <textarea value={page.title} onChange={(e) => updatePage({ title: e.target.value })} className="mt-2 h-20 w-full resize-none rounded border border-[#ddd9cf] bg-white p-3 text-sm"/>
        <label className="mt-5 block text-xs">Subtitle</label>
        <textarea value={page.subtitle} onChange={(e) => updatePage({ subtitle: e.target.value })} className="mt-2 h-16 w-full resize-none rounded border border-[#ddd9cf] bg-white p-3 text-sm"/>
      </aside>
    </main>
  );
}

export default function Editor() {
  return (
    <Suspense fallback={<main className="flex h-screen items-center justify-center">Loading studio...</main>}>
      <EditorContent />
    </Suspense>
  );
}
