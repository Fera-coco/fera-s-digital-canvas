import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { bySlug, img, keyOf, naira, waLink, type Product } from "../data/products";
import { addToCart, cartCount, useStore } from "../lib/store";
import { BagIcon, WaIcon } from "../components/ui";

/* Version B: a cleaner, more complete take on the Nature's Gentle Touch layout
   Honeybell likes. Black and white, light type, her green as the accent. */

const NAV: [string, string][] = [
  ["/", "Home"],
  ["/shop", "Shop products"],
  ["/routine", "Routine finder"],
  ["/#diary", "Hair diary"],
  ["/#faq", "FAQs"],
];

export function ClassicHeader() {
  const s = useStore();
  const n = cartCount(s);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname, loc.hash]);
  return (
    <>
      <div className="bg-ink px-4 py-2.5 text-center text-[0.78rem] text-white">
        Order online or on WhatsApp · Pay by bank transfer ·{" "}
        <span className="text-white/60">
          Demo by <a href="/" className="underline underline-offset-2">Fera's Studio</a>
        </span>
      </div>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2">
          <Link to="/" aria-label="Superb Naturals home" className="shrink-0">
            <img src={img("logo")} alt="Superb Naturals" className="h-[72px] w-auto" />
          </Link>
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {NAV.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === "/"} className={({ isActive }) => `text-[0.72rem] font-semibold uppercase tracking-[0.16em] transition hover:text-blush ${isActive && !to.includes("#") ? "text-blush" : "text-ink/80"}`}>
                {label}
              </NavLink>
            ))}
            <Link to="/cart" className="flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] hover:text-blush">
              <BagIcon /> Cart {n > 0 && <span className="grid h-5 min-w-5 place-items-center bg-blush px-1 text-[0.65rem] text-white">{n}</span>}
            </Link>
          </nav>
          <div className="flex items-center gap-2 lg:hidden">
            <Link to="/cart" className="relative grid h-11 w-11 place-items-center border border-ink/15" aria-label={`Cart, ${n} items`}>
              <BagIcon />
              {n > 0 && <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center bg-blush px-1 text-[0.65rem] font-bold text-white">{n}</span>}
            </Link>
            <button className="grid h-11 w-11 place-items-center border border-ink/15" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
              {open ? "✕" : "☰"}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-ink/10 px-5 pb-3 lg:hidden" aria-label="Mobile">
            {NAV.map(([to, label]) => (
              <Link key={to} to={to} className="block border-b border-ink/5 py-3.5 text-sm font-semibold uppercase tracking-[0.14em]">
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export function ClassicFooter() {
  return (
    <footer className="mt-24">
      <div className="bg-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <img src={img("logo")} alt="Superb Naturals" className="h-20 w-auto mix-blend-multiply" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-stone">Natural hair care made with raw herbs and active oils. Restoring confidence in beauty. For external use only.</p>
          </div>
          <div className="text-sm">
            <p className="label">Shop</p>
            <ul className="mt-4 space-y-2.5 text-stone">
              <li><Link to="/shop" className="hover:text-ink">All products</Link></li>
              <li><Link to="/shop?kind=Kit" className="hover:text-ink">Kits</Link></li>
              <li><Link to="/shop?kind=Beard" className="hover:text-ink">For men</Link></li>
              <li><Link to="/routine" className="hover:text-ink">Routine finder</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="label">Contact</p>
            <a href={waLink("Hello Superb Naturals 👋")} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 font-semibold hover:text-blush">
              <WaIcon /> +234 802 086 6239
            </a>
            <p className="mt-3 text-stone">CAC registered business</p>
          </div>
        </div>
      </div>
      <div className="bg-[#ECECEA] px-5 py-5 text-center text-[0.72rem] uppercase tracking-[0.16em] text-stone">
        © 2026 Superb Natural Beauty Ventures · Website by Fera's Studio
      </div>
    </footer>
  );
}

const SLIDES = [
  { title: "Hair Growth\nSolution Range", text: "Raw herbs and over 10 active oils for faster, thicker growth.", img: "hair-pink", to: "/shop?concern=growth", pos: "object-[center_30%]" },
  { title: "Scalp & Dandruff\nSolution Range", text: "Cleans the scalp, exfoliates dead skin cells and stops itching.", img: "shampoo-conditioner-garden", to: "/shop?concern=dandruff", pos: "object-center" },
  { title: "Edge Care\nSolution Range", text: "Essential Edge Oil, made to boost edge growth.", img: "hair-puff", to: "/shop?concern=edges", pos: "object-[center_70%]" },
  { title: "For the Men", text: "Beard oil for shine, and a beard wash combo.", img: "beard-oil", to: "/shop?kind=Beard", pos: "object-center" },
];

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [paused]);
  const s = SLIDES[i];
  return (
    <section className="relative bg-[#F0F0EE]" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-roledescription="carousel" aria-label="Product ranges">
      <div className="mx-auto grid max-w-6xl md:min-h-[560px] md:grid-cols-2">
        <div key={s.title} className="order-2 flex flex-col justify-center px-5 py-12 md:order-1 md:py-20 md:pr-12">
          <p className="label text-blush">Superb Naturals</p>
          <h1 className="mt-4 whitespace-pre-line font-display text-[2.6rem] leading-[1.08] md:text-[3.6rem]">{s.title}</h1>
          <p className="mt-5 max-w-sm text-stone">{s.text}</p>
          <Link to={s.to} className="btn mt-8 w-fit bg-ink !px-12 !py-4 text-white hover:bg-blush">Shop</Link>
        </div>
        <div className="relative order-1 h-[52vh] md:order-2 md:h-auto">
          {SLIDES.map((x, k) => (
            <img key={x.img} src={img(x.img)} alt="" className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${x.pos} ${k === i ? "opacity-100" : "opacity-0"}`} />
          ))}
        </div>
      </div>
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2 md:left-5 md:translate-x-0 lg:left-[calc(50%-36rem+1.25rem)]">
        {SLIDES.map((x, k) => (
          <button key={x.title} onClick={() => setI(k)} aria-label={`Show ${x.title.replace("\n", " ")}`} aria-current={k === i} className={`h-1.5 transition-all ${k === i ? "w-10 bg-ink" : "w-5 bg-ink/25"}`} />
        ))}
      </div>
    </section>
  );
}

function Tile({ p }: { p: Product }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="group w-[72vw] shrink-0 snap-start sm:w-[260px]">
      <Link to={`/shop/${p.slug}`} className="block aspect-square overflow-hidden bg-[#F0F0EE]">
        <img src={img(p.images[0])} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </Link>
      <div className="px-2 pt-4 text-center">
        <Link to={`/shop/${p.slug}`} className="block text-[0.95rem] leading-snug hover:text-blush">
          {p.name}
          {(p.size || p.sizes) && <span className="text-stone"> ({p.size ?? p.sizes!.map((x) => x.label).join(" / ")})</span>}
        </Link>
        <p className="mt-2 text-sm font-semibold">
          {p.sizes && <span className="font-normal text-stone">from </span>}
          {naira(p.price)}
        </p>
        <button
          className="mt-3 w-full border border-ink py-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.16em] transition hover:bg-ink hover:text-white"
          onClick={() => {
            addToCart(keyOf(p.slug, p.sizes?.[0].label));
            setAdded(true);
            setTimeout(() => setAdded(false), 1400);
          }}
        >
          {added ? "Added ✓" : p.sizes ? `Add ${p.sizes[0].label}` : "Add to cart"}
        </button>
      </div>
    </div>
  );
}

function Range({ title, text, slugs }: { title: string; text: string; slugs: string[] }) {
  const row = useRef<HTMLDivElement>(null);
  const items = slugs.map((s) => bySlug(s)).filter(Boolean) as Product[];
  const move = (d: number) => row.current?.scrollBy({ left: d * 280, behavior: "smooth" });
  return (
    <section className="mx-auto max-w-6xl px-5 pt-16">
      <div className="flex items-end justify-between gap-6 border-t border-ink/10 pt-8">
        <div>
          <h2 className="font-display text-3xl md:text-[2.1rem]">{title}</h2>
          <p className="mt-3 max-w-2xl text-[0.95rem] font-medium leading-relaxed text-stone">{text}</p>
        </div>
        <div className="hidden shrink-0 gap-1.5 sm:flex">
          <button onClick={() => move(-1)} className="grid h-10 w-10 place-items-center bg-ink text-white hover:bg-blush" aria-label={`Scroll ${title} left`}>‹</button>
          <button onClick={() => move(1)} className="grid h-10 w-10 place-items-center bg-ink text-white hover:bg-blush" aria-label={`Scroll ${title} right`}>›</button>
        </div>
      </div>
      <div ref={row} className="-mx-5 mt-8 flex snap-x gap-5 overflow-x-auto px-5 pb-2 [scrollbar-width:none]">
        {items.map((p) => (
          <Tile key={p.slug} p={p} />
        ))}
      </div>
    </section>
  );
}

const FAQ = [
  ["How do I order?", "Add products to your cart and check out, or order on WhatsApp. Both reach Superb Naturals directly."],
  ["How do I pay?", "By bank transfer. After checkout you'll see the account details and your order number. Send your proof of payment on WhatsApp to confirm."],
  ["How much is delivery?", "It depends on where you are. Your delivery fee is confirmed on WhatsApp once your address is in."],
  ["Is Superb Naturals registered?", "Yes. Superb Natural Beauty Ventures is a CAC registered business."],
  ["Which products are right for me?", "Try the routine finder. Three quick questions, and it builds a routine from the range."],
];

export function ClassicHome() {
  const kit = bySlug("medium-kit")!;
  const [kitAdded, setKitAdded] = useState(false);
  return (
    <>
      <Hero />

      <section className="border-b border-ink/10">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
          {[
            ["🌿", "Raw herbs & 10+ active oils"],
            ["📜", "CAC registered business"],
            ["🏦", "Pay by bank transfer"],
            ["💬", "Order support on WhatsApp"],
          ].map(([e, t]) => (
            <li key={t} className="flex items-center gap-3 border-ink/10 px-5 py-5 text-[0.8rem] font-semibold uppercase tracking-[0.1em] md:border-r md:last:border-r-0">
              <span className="text-xl">{e}</span> {t}
            </li>
          ))}
        </ul>
      </section>

      <Range title="Hair Growth Solutions" text="Infused with raw herbs and over 10 active oils to promote faster and thicker hair growth, and stop itching and breakage." slugs={["hair-growth-oil", "hair-growth-butter", "medium-kit", "mini-kit"]} />
      <Range title="Scalp & Dandruff Solutions" text="Cleans hair and scalp, exfoliates dead skin cells, and stops itching and dandruff." slugs={["shampoo-conditioner", "anti-dandruff-shampoo", "moisturizing-conditioner", "scalp-massager"]} />
      <Range title="Edge Care" text="Made for your edges: boosts edge growth and reduces itching and breakage." slugs={["essential-edge-oil", "hair-growth-oil", "dermal-roller"]} />

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="grid overflow-hidden bg-ink text-white md:grid-cols-2">
          <img src={img(kit.images[0])} alt="The Superb Naturals Medium Kit: conditioner, shampoo, hair growth oil and hair growth butter" className="h-full max-h-[460px] w-full object-cover" loading="lazy" />
          <div className="flex flex-col justify-center p-8 md:p-14">
            <p className="label text-white/60">The full routine</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">The Medium Kit</h2>
            <p className="mt-2 text-2xl">{naira(kit.price)}</p>
            <p className="mt-5 text-white/70">{kit.includes!.join(", ")}.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                className="btn bg-white !px-8 !py-3.5 text-ink hover:bg-blush hover:text-white"
                onClick={() => {
                  addToCart("medium-kit");
                  setKitAdded(true);
                }}
              >
                {kitAdded ? "Added ✓" : "Add to cart"}
              </button>
              <Link to="/shop/mini-kit" className="btn border border-white/40 !px-8 !py-3.5 hover:border-white">Or the Mini Kit · ₦15,000</Link>
            </div>
          </div>
        </div>
      </section>

      <Range title="For the Men" text="Beard oil that adds shine, and a beard wash and conditioner combo." slugs={["beard-oil", "beard-wash-combo"]} />

      <section id="diary" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-20 text-center">
        <h2 className="font-display text-4xl md:text-5xl">My Hair Diary</h2>
        <p className="mx-auto mt-4 max-w-xl text-stone">Healthy hair, every texture. Moments from the Superb Naturals hair diary.</p>
        <div className="mt-10 grid grid-cols-3 gap-2 md:gap-4">
          {[
            ["hair-blowout", "Long, stretched natural hair"],
            ["hair-pink", "Full, curly natural hair with a bottle of growth oil"],
            ["hair-puff", "A full natural-hair puff with a white bow"],
          ].map(([src, alt]) => (
            <img key={src} src={img(src)} alt={alt} loading="lazy" className="aspect-[3/4] w-full object-cover object-top" />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="flex flex-col items-start justify-between gap-6 border border-ink p-8 md:flex-row md:items-center md:p-12">
          <div>
            <h2 className="font-display text-3xl md:text-4xl">Not sure where to start?</h2>
            <p className="mt-2 text-stone">Three quick questions and we'll build your routine from the range.</p>
          </div>
          <Link to="/routine" className="btn shrink-0 bg-ink !px-10 !py-4 text-white hover:bg-blush">Find my routine</Link>
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 pt-20">
        <h2 className="text-center font-display text-4xl">FAQs</h2>
        <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
          {FAQ.map(([q, a]) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                {q}
                <span className="text-xl transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-stone">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
