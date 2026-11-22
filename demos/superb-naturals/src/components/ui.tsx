import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { img, naira, toneBg, waLink, type Product } from "../data/products";
import { cartCount, toggleLove, useStore, addToCart } from "../lib/store";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`} aria-label="Superb Naturals home">
      <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-ink/10">
        <img src={img("logo")} alt="" className="h-9 w-9 object-contain" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-[1.15rem] font-semibold tracking-wide">Superb Naturals</span>
        <span className="block text-[0.62rem] font-bold uppercase tracking-[0.22em] text-leaf">Natural hair care</span>
      </span>
    </Link>
  );
}

export function Header() {
  const s = useStore();
  const n = cartCount(s);
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => setOpen(false), [loc.pathname]);
  const links = [
    ["/shop", "Shop"],
    ["/routine", "Find my routine"],
    ["/#wash-day", "Wash day"],
    ["/#faq", "FAQ"],
  ];
  return (
    <>
      <div className="bg-leaf px-4 py-2 text-center text-[0.78rem] font-medium text-white">
        Demo website by <a href="/" className="font-bold text-butter underline-offset-2 hover:underline">Fera's Studio</a>. Prices and bank details will be added by Superb Naturals.
      </div>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
          <Logo />
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {links.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-semibold transition hover:bg-leaf-soft ${isActive && !to.includes("#") ? "bg-leaf-soft text-leaf-deep" : ""}`}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative grid h-11 w-11 place-items-center rounded-full bg-paper ring-1 ring-ink/10 transition hover:ring-ink/30" aria-label={`Cart, ${n} item${n === 1 ? "" : "s"}`}>
              <BagIcon />
              {n > 0 && <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-blush px-1 text-[0.7rem] font-bold text-white">{n}</span>}
            </Link>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-paper ring-1 ring-ink/10 md:hidden" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Menu">
              <span className="text-lg">{open ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-ink/10 px-5 pb-4 md:hidden" aria-label="Mobile">
            {links.map(([to, label]) => (
              <Link key={to} to={to} className="block border-b border-ink/5 py-3 font-semibold">
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-leaf-deep text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Unlock your hair's full potential.</p>
          <p className="mt-3 text-sm text-white/70">Natural hair care made with raw herbs and active oils. For external use only.</p>
        </div>
        <div className="text-sm">
          <p className="label text-butter">Shop</p>
          <ul className="mt-3 space-y-2 text-white/80">
            <li><Link to="/shop" className="hover:text-white">All products</Link></li>
            <li><Link to="/shop?concern=edges" className="hover:text-white">For edges</Link></li>
            <li><Link to="/shop?concern=dandruff" className="hover:text-white">For dandruff & itching</Link></li>
            <li><Link to="/routine" className="hover:text-white">Find my routine</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="label text-butter">Talk to us</p>
          <a href={waLink("Hello Superb Naturals 👋 I have a question about your products.")} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 font-bold text-leaf-deep">
            <WaIcon /> +234 802 086 6239
          </a>
          <p className="mt-3 text-white/70">Orders, questions and delivery on WhatsApp.</p>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/60">© 2026 Superb Natural Beauty Ventures · Website by Fera's Studio</div>
    </footer>
  );
}

export function Price({ p, className = "" }: { p: Product; className?: string }) {
  return p.price ? <span className={`font-display font-semibold ${className}`}>{naira(p.price)}</span> : <span className={`text-sm font-semibold text-stone ${className}`}>Price coming soon</span>;
}

export function ProductCard({ p }: { p: Product }) {
  const s = useStore();
  const loved = s.loved.includes(p.slug);
  const [added, setAdded] = useState(false);
  return (
    <article className="group flex flex-col overflow-hidden rounded-[1.75rem] bg-paper shadow-card ring-1 ring-ink/5">
      <div className={`relative aspect-[4/5] overflow-hidden ${toneBg[p.tone]}`}>
        <Link to={`/shop/${p.slug}`} aria-label={p.name}>
          <img src={img(p.images[0])} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.7rem] font-bold text-leaf-deep">{p.kind}</span>
        <button onClick={() => toggleLove(p.slug)} aria-pressed={loved} aria-label={loved ? `Remove ${p.name} from favourites` : `Save ${p.name}`} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-lg transition hover:scale-110">
          {loved ? "💖" : "🤍"}
        </button>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/shop/${p.slug}`} className="font-display text-xl font-semibold leading-tight hover:text-leaf">{p.name}</Link>
        <p className="mt-1.5 text-sm text-stone">{p.benefits[0]}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <Price p={p} className="text-lg" />
          {p.price ? (
            <button
              className="btn-leaf !px-4 !py-2.5"
              onClick={() => {
                addToCart(p.slug);
                setAdded(true);
                setTimeout(() => setAdded(false), 1400);
              }}
            >
              {added ? "Added ✓" : "Add to bag"}
            </button>
          ) : (
            <a className="btn-ghost !px-4 !py-2.5" href={waLink(`Hello Superb Naturals 👋 How much is the ${p.name}?`)} target="_blank" rel="noopener noreferrer">
              Ask price
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export const BagIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M6 7h12l-1 13H7L6 7Z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);

export const WaIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
  </svg>
);

export function SectionTitle({ kicker, title, sub, center }: { kicker: string; title: string; sub?: string; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="label text-blush">{kicker}</p>
      <h2 className="mt-3 font-display text-[2.1rem] font-semibold leading-[1.05] tracking-tight md:text-5xl">{title}</h2>
      {sub && <p className="mt-4 text-[1.02rem] leading-relaxed text-stone">{sub}</p>}
    </div>
  );
}
