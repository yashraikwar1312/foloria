"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, ArrowRight, Expand, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import HTMLFlipBook from "react-pageflip";
import { useMagazineStore } from "@/lib/store";

type FlipBookRef = {
  pageFlip: () => {
    flipNext: () => void;
    flipPrev: () => void;
    flip: (page: number) => void;
  };
};

function ReaderContent() {
  const params = useParams<{ id: string }>();
  const { magazines, hydrate } = useMagazineStore();
  const [active, setActive] = useState(0);
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(false);
  const [toc, setToc] = useState(false);
  const flipBook = useRef<FlipBookRef>(null);
  const [viewport, setViewport] = useState({ width: 390, height: 520 });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => hydrate(), [hydrate]);
  useEffect(() => {
    const resize = () => {
      const mobile = window.innerWidth < 700;
      setIsMobile(mobile);
      setViewport(mobile
        ? { width: Math.min(390, window.innerWidth - 32), height: Math.min(520, window.innerHeight - 170) }
        : { width: 520, height: 700 });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") flipBook.current?.pageFlip().flipNext();
      if (event.key === "ArrowLeft") flipBook.current?.pageFlip().flipPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
  const magazine = magazines.find((item) => item.id === params.id);

  if (!magazine) return (
    <main className="flex min-h-screen items-center justify-center"><div className="text-center"><p className="editorial text-4xl">Magazine not found</p><Link href="/explore" className="mt-6 inline-block text-sm underline">Explore publications</Link></div></main>
  );

  const publicUrl = typeof window !== "undefined" ? window.location.href : "";
  const playPageSound = () => {
    if (!sound) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(180, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(90, context.currentTime + 0.08);
    gain.gain.setValueAtTime(0.035, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.09);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.1);
  };

  return (
    <main className={`flex min-h-screen flex-col ${dark ? "bg-[#171715] text-[#eee]" : "bg-[#e6e2d7] text-[#20201e]"}`}>
      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/explore" className="flex items-center gap-2 text-xs"><ArrowLeft size={16}/> Explore</Link>
        <div className="text-center"><p className="editorial text-lg">{magazine.title}</p><p className="text-[9px] uppercase tracking-[0.16em] opacity-60">{magazine.author}</p></div>
        <div className="flex items-center gap-1">
          <button onClick={() => setToc(!toc)} className="rounded p-2 text-xs">Contents</button>
          <button onClick={() => setSound(!sound)} className="rounded p-2">{sound ? <Volume2 size={16}/> : <VolumeX size={16}/>}</button>
          <button onClick={() => setDark(!dark)} className="rounded p-2">{dark ? <Sun size={16}/> : <Moon size={16}/>}</button>
          <button onClick={() => document.documentElement.requestFullscreen?.()} className="hidden rounded p-2 sm:block"><Expand size={16}/></button>
        </div>
      </header>
      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-16 pt-4">
        {toc && (
          <div className={`absolute left-4 top-4 z-20 w-64 rounded-sm p-5 shadow-xl ${dark ? "bg-[#242421]" : "bg-[#f7f5ef]"}`}>
            <p className="editorial text-2xl">Contents</p>
            {magazine.pages.map((page, index) => <button key={page.id} onClick={() => { flipBook.current?.pageFlip().flip(index); setToc(false); }} className="mt-4 flex w-full justify-between border-b border-current/10 pb-2 text-left text-sm"><span>{page.title}</span><span>{index + 1}</span></button>)}
          </div>
        )}
        <HTMLFlipBook
          ref={flipBook}
          className="foliora-flipbook"
          style={{}}
          width={viewport.width}
          height={viewport.height}
          size="stretch"
          minWidth={260}
          maxWidth={520}
          minHeight={360}
          maxHeight={700}
          showCover
          maxShadowOpacity={0.45}
          mobileScrollSupport
          usePortrait={isMobile}
          swipeDistance={20}
          drawShadow
          startZIndex={10}
          autoSize={false}
          clickEventForward
          useMouseEvents
          showPageCorners
          disableFlipByClick={false}
          flippingTime={850}
          startPage={0}
          onFlip={(event) => {
            setActive(event.data);
            playPageSound();
          }}
        >
          {magazine.pages.map((page, index) => (
            <div
              key={page.id}
              className="reader-page"
              style={{
                background: page.background,
                backgroundImage: page.image ? `url(${page.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-end p-12 text-center">
                <div className={page.image ? "w-full bg-black/35 px-5 py-4 text-white" : ""}>
                  <p className="editorial text-[48px] leading-[0.9]">{page.title}</p>
                  <p className="mt-5 text-[10px] uppercase tracking-[0.2em]">{page.subtitle}</p>
                </div>
              </div>
              <span className="absolute bottom-3 right-4 text-[9px]">{index + 1}</span>
            </div>
          ))}
        </HTMLFlipBook>
      </section>
      <footer className="fixed bottom-0 left-0 flex h-16 w-full items-center justify-center gap-5 border-t border-current/10 bg-inherit">
        <button onClick={() => flipBook.current?.pageFlip().flipPrev()} disabled={active === 0} className="disabled:opacity-30"><ArrowLeft size={18}/></button>
        <div className="h-px w-32 bg-current/20"><div className="h-px bg-current transition-all" style={{ width: `${((active + 1) / magazine.pages.length) * 100}%` }}/></div>
        <span className="w-14 text-center text-xs">{active + 1} / {magazine.pages.length}</span>
        <button onClick={() => flipBook.current?.pageFlip().flipNext()} disabled={active === magazine.pages.length - 1} className="disabled:opacity-30"><ArrowRight size={18}/></button>
      </footer>
      <div className="sr-only"><QRCodeSVG value={publicUrl} /></div>
    </main>
  );
}

export default function Reader() {
  return (
    <Suspense fallback={<main className="flex min-h-screen items-center justify-center">Loading magazine...</main>}>
      <ReaderContent />
    </Suspense>
  );
}
