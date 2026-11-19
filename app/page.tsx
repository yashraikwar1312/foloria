import Link from "next/link";
import { ArrowRight, ChevronDown, MoveUpRight } from "lucide-react";

export default function Home() {
  return (
    <main>
      <nav className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-6">
        <Link href="/" className="editorial text-3xl font-semibold tracking-tight">Foliora</Link>
        <div className="hidden items-center gap-8 text-sm md:flex">
          <Link href="/explore" className="hover:opacity-60">Explore</Link>
          <Link href="/#features" className="hover:opacity-60">Features</Link>
          <Link href="/#templates" className="hover:opacity-60">Templates</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden px-3 py-2 text-sm sm:block">Sign in</Link>
          <Link href="/editor/new" className="rounded-full bg-[#20201e] px-5 py-2.5 text-sm text-white hover:bg-black">Start creating</Link>
        </div>
      </nav>

      <section className="mx-auto grid min-h-[620px] max-w-[1180px] items-center gap-10 px-6 py-16 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.22em] text-[#77746d]">The independent magazine studio</p>
          <h1 className="editorial max-w-xl text-[64px] leading-[0.92] tracking-[-0.045em] sm:text-[82px]">
            Your stories deserve more than a scroll.
          </h1>
          <p className="mt-7 max-w-md text-lg leading-8 text-[#68665f]">
            Create stunning digital magazines, bring your ideas to life, and share them with the world.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/editor/new" className="flex items-center gap-3 rounded-full bg-[#20201e] px-6 py-3.5 text-sm text-white">
              Start creating <ArrowRight size={16} />
            </Link>
            <Link href="/explore" className="rounded-full border border-[#cbc7bd] px-6 py-3.5 text-sm">
              Explore magazines
            </Link>
          </div>
        </div>

        <div className="relative flex h-[510px] items-center justify-center overflow-hidden rounded-sm bg-[#ded8c9]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,.72),transparent_55%)]" />
          <div className="relative h-[390px] w-[310px] rotate-[-4deg] bg-[#f2ede3] shadow-[0_30px_70px_rgba(62,55,43,.25)]">
            <div className="absolute left-1/2 top-0 h-full w-px bg-[#b9b2a4]" />
            <div className="h-full w-1/2 p-5">
              <p className="editorial text-[10px] uppercase tracking-[0.25em]">Volume 04</p>
              <p className="editorial mt-24 text-[42px] leading-[0.9]">Notes<br/>from<br/>Elsewhere</p>
            </div>
            <div className="absolute bottom-0 right-0 h-full w-1/2 bg-[url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=85')] bg-cover bg-center" />
          </div>
          <div className="absolute bottom-5 right-5 rounded-full border border-white/50 bg-white/70 px-4 py-2 text-xs backdrop-blur">Interactive preview</div>
        </div>
      </section>

      <section id="features" className="border-y border-[#dedbd2] bg-[#f1eee6]">
        <div className="mx-auto grid max-w-[1180px] gap-px px-6 md:grid-cols-3">
          {[
            ["01", "Create with intention", "Editorial layouts, expressive type and precise tools—without the learning curve."],
            ["02", "Publish beautifully", "Share a permanent public reader with realistic page turns and a QR code."],
            ["03", "Make it yours", "Use flexible pages, original uploads and free open-source typography."],
          ].map(([num, title, text]) => (
            <div key={num} className="border-[#dedbd2] py-12 md:border-r md:px-8 md:last:border-r-0">
              <p className="text-xs text-[#97938a]">{num}</p>
              <h2 className="editorial mt-10 text-3xl">{title}</h2>
              <p className="mt-4 max-w-xs leading-7 text-[#69675f]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="templates" className="mx-auto max-w-[1180px] px-6 py-24">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#858278]">Start inspired</p>
            <h2 className="editorial mt-3 text-5xl">Magazine templates</h2>
          </div>
          <Link href="/explore" className="hidden items-center gap-2 text-sm md:flex">View all <MoveUpRight size={15}/></Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Minimal Editorial", "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=85"],
            ["Photography Portfolio", "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85"],
            ["Travel Journal", "https://images.unsplash.com/photo-1470214304380-aadaedcfff1b?auto=format&fit=crop&w=700&q=85"],
          ].map(([title, image]) => (
            <Link href="/editor/new" key={title} className="group">
              <div className="h-[360px] overflow-hidden bg-[#ddd8cc]">
                <div className="h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]" style={{ backgroundImage: `url(${image})` }} />
              </div>
              <div className="mt-4 flex justify-between"><span>{title}</span><ChevronDown className="-rotate-90" size={16}/></div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-[#dedbd2] px-6 py-10">
        <div className="mx-auto flex max-w-[1180px] justify-between">
          <span className="editorial text-2xl">Foliora</span>
          <span className="text-sm text-[#77746d]">Stories deserve beautiful pages.</span>
        </div>
      </footer>
    </main>
  );
}
