import { Link, NavLink, useLocation } from "react-router-dom";
import { img, movingIn, short, naira, type Listing, type Area } from "../data/listings";
import { actions, useStore } from "../lib/store";

export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className={cx("flex items-center gap-2", light ? "text-cream" : "text-ink")} aria-label="Brightdoor Homes, home">
      <svg viewBox="0 0 64 64" className="h-8 w-8" aria-hidden>
        <rect width="64" height="64" rx="16" fill={light ? "#F6F1E7" : "#1F4D3A"} />
        <path d="M14 34 32 18l18 16v14a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2Z" fill={light ? "#1F4D3A" : "#F6F1E7"} />
        <circle cx="32" cy="38" r="5" fill="#D2603A" />
      </svg>
      <span className="font-display text-[22px] font-semibold tracking-tight">Brightdoor</span>
    </Link>
  );
}

export function DemoBanner() {
  return (
    <div className="bg-ink px-4 py-2 text-center text-[12px] text-cream/85">
      Concept website by <a className="font-semibold text-gold underline-offset-2 hover:underline" href="https://ferasportfolio.vercel.app">Fera's Studio</a>. Listings, prices and agents are samples.
    </div>
  );
}

export function Header() {
  const { saved, compare } = useStore();
  const loc = useLocation();
  const dealNow = loc.pathname === "/homes" ? new URLSearchParams(loc.search).get("deal") : null;
  const pill = (on: boolean) => cx("rounded-full px-3 py-2 text-sm font-semibold transition", on ? "bg-forest-soft text-forest" : "text-ink/75 hover:text-ink");
  const link = ({ isActive }: { isActive: boolean }) =>
    cx("rounded-full px-3 py-2 text-sm font-semibold transition", isActive ? "bg-forest-soft text-forest" : "text-ink/75 hover:text-ink");
  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-1" aria-label="Main">
          <Link to="/homes?deal=rent" className={pill(dealNow === "rent")}>Rent</Link>
          <Link to="/homes?deal=sale" className={cx(pill(dealNow === "sale"), "hidden sm:inline-flex")}>Buy</Link>
          <NavLink to="/compare" className={link}>
            Saved{saved.length + compare.length > 0 && <span className="ml-1.5 rounded-full bg-clay px-1.5 text-[11px] text-white">{saved.length}</span>}
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => cx(link({ isActive }), "hidden md:inline-flex")}>Owner login</NavLink>
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 bg-forest-deep text-cream/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <Logo light />
          <p className="mt-3 max-w-xs text-sm">Lagos homes with the full price upfront. No surprise fees, no inspection fees.</p>
        </div>
        <div className="text-sm">
          <p className="label !text-cream/50">Explore</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/homes?deal=rent" className="hover:text-cream">Homes to rent</Link></li>
            <li><Link to="/homes?deal=sale" className="hover:text-cream">Homes for sale</Link></li>
            <li><Link to="/dashboard" className="hover:text-cream">Owner dashboard</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="label !text-cream/50">About this site</p>
          <p className="mt-3">
            A concept by <a href="https://ferasportfolio.vercel.app" className="font-semibold text-gold hover:underline">Fera's Studio</a>, built to show what a Lagos estate agency website can do. Photos from Unsplash.
          </p>
        </div>
      </div>
    </footer>
  );
}

export function Heart({ slug, className }: { slug: string; className?: string }) {
  const { saved } = useStore();
  const on = saved.includes(slug);
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        actions.toggleSaved(slug);
      }}
      aria-pressed={on}
      aria-label={on ? "Remove from saved" : "Save this home"}
      className={cx("grid h-10 w-10 place-items-center rounded-full bg-paper/95 shadow-card transition hover:scale-105", className)}
    >
      <svg viewBox="0 0 24 24" className={cx("h-5 w-5", on ? "fill-clay stroke-clay" : "fill-none stroke-ink")} strokeWidth="2">
        <path d="M12 20s-7-4.5-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5c-2.3 4.5-9.3 9-9.3 9Z" />
      </svg>
    </button>
  );
}

/** One horizontal bar showing where the move-in money goes. */
export function FeeBar({ l, thin = false }: { l: Listing; thin?: boolean }) {
  const m = movingIn(l);
  if (!m) return null;
  return (
    <div className={cx("flex w-full overflow-hidden rounded-full bg-sand", thin ? "h-1.5" : "h-3")} aria-hidden>
      {m.lines.map((x) => (
        <span key={x.key} className={cx(x.color, x.refundable && "bg-[repeating-linear-gradient(135deg,#BFD9DA_0_4px,#9CC3C5_4px_8px)]")} style={{ width: `${(x.amount / m.total) * 100}%` }} />
      ))}
    </div>
  );
}

export function PriceLine({ l, big = false }: { l: Listing; big?: boolean }) {
  const m = movingIn(l);
  return (
    <div>
      <p className={cx("font-display font-semibold", big ? "text-3xl" : "text-xl")}>
        {big ? naira(l.price) : short(l.price)}
        {l.deal === "rent" && <span className="font-sans text-sm font-medium text-stone"> / year</span>}
      </p>
      {m && (
        <p className="mt-0.5 text-[13px] text-stone">
          Move-in total <span className="font-semibold text-ink">{big ? naira(m.total) : short(m.total)}</span>
        </p>
      )}
    </div>
  );
}

export function ListingCard({ l, active, onHover }: { l: Listing; active?: boolean; onHover?: (slug: string | null) => void }) {
  return (
    <Link
      to={`/homes/${l.slug}`}
      onMouseEnter={() => onHover?.(l.slug)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(l.slug)}
      className={cx("group block overflow-hidden rounded-3xl bg-paper shadow-card transition", active && "ring-2 ring-clay")}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        <img src={img(l.images[0], 800)} alt={`${l.title} in ${l.area}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-paper/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider">{l.deal === "rent" ? "To rent" : "For sale"}</span>
          {l.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[11px] font-bold text-cream">
              <Check /> Verified
            </span>
          )}
          {l.status !== "Available" && <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold">{l.status}</span>}
        </div>
        <Heart slug={l.slug} className="absolute right-3 top-3" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <PriceLine l={l} />
          <p className="pt-1 text-right text-[12px] text-stone">{l.listedDaysAgo === 1 ? "Listed yesterday" : `Listed ${l.listedDaysAgo} days ago`}</p>
        </div>
        {l.deal === "rent" && <div className="mt-3"><FeeBar l={l} thin /></div>}
        <h3 className="mt-3 font-semibold leading-snug">{l.title}</h3>
        <p className="text-sm text-stone">{l.area} · {l.street}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-medium text-ink/80">
          <span>{l.beds} bed</span>
          <span>{l.baths} bath</span>
          <span>{l.sqm} m²</span>
          <span className="text-forest">⚡ {l.power.split(",")[0].split(" plus")[0]}</span>
        </div>
      </div>
    </Link>
  );
}

export const Check = () => (
  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
    <path d="m4 10.5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* A schematic Lagos map: mainland, lagoon, the island and Lekki peninsula. */
export const AREA_POS: Record<Area, [number, number]> = {
  "Ikeja GRA": [22, 16],
  Gbagada: [33, 34],
  Yaba: [43, 47],
  Ikoyi: [50, 66],
  "Victoria Island": [42, 77],
  "Lekki Phase 1": [61, 75],
  Ikate: [71, 74],
  Ajah: [88, 75],
};

export function LagosMap({ items, active, onHover }: { items: Listing[]; active?: string | null; onHover?: (s: string | null) => void; compact?: boolean }) {
  const byArea = new Map<Area, Listing[]>();
  items.forEach((l) => byArea.set(l.area, [...(byArea.get(l.area) ?? []), l]));
  return (
    <div className="relative aspect-[5/4] w-full overflow-hidden rounded-3xl bg-lagoon">
      <svg viewBox="0 0 1000 800" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="#1B211E" strokeOpacity=".05" />
          </pattern>
        </defs>
        {/* mainland */}
        <path d="M0 0h1000v300c-90 30-160 40-260 60-90 18-160 70-260 80-90 10-150-20-230 10-90 34-160 30-250 20Z" fill="#EADFCB" />
        <path d="M0 0h1000v300c-90 30-160 40-260 60-90 18-160 70-260 80-90 10-150-20-230 10-90 34-160 30-250 20Z" fill="url(#grid)" />
        {/* island + lekki peninsula */}
        <path d="M300 520c60-30 130-40 200-30 50 8 90 30 150 30 110 0 220-40 350-30v170H260c-10-50 0-100 40-140Z" fill="#EADFCB" />
        <path d="M300 520c60-30 130-40 200-30 50 8 90 30 150 30 110 0 220-40 350-30v170H260c-10-50 0-100 40-140Z" fill="url(#grid)" />
        {/* atlantic */}
        <path d="M0 690c200-20 420 10 640-10 140-12 250-5 360 0v120H0Z" fill="#9CC3C5" />
        {/* roads */}
        <path d="M210 120c40 90 100 160 160 230 50 60 90 110 120 170" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".9" />
        <path d="M430 610c120-10 260-20 520-10" stroke="#fff" strokeWidth="7" fill="none" strokeLinecap="round" opacity=".9" />
        <path d="M455 500c-10 40-20 70-30 105" stroke="#fff" strokeWidth="6" fill="none" strokeLinecap="round" opacity=".9" />
        <text x="560" y="455" fontSize="22" fontStyle="italic" fill="#1F4D3A" opacity=".45" fontFamily="Fraunces Variable, serif">Lagos Lagoon</text>
        <text x="80" y="760" fontSize="22" fontStyle="italic" fill="#143327" opacity=".45" fontFamily="Fraunces Variable, serif">Atlantic Ocean</text>
      </svg>
      {(Object.keys(AREA_POS) as Area[]).map((area) => {
        const [x, y] = AREA_POS[area];
        const here = byArea.get(area) ?? [];
        return (
          <div key={area} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${x}%`, top: `${y}%` }}>
            <p className={cx("pointer-events-none mb-1 whitespace-nowrap text-center text-[11px] font-semibold", here.length ? "text-ink/70" : "text-ink/35")}>{area}</p>
            <div className="flex flex-col items-center gap-1">
              {here.map((l) => (
                <Link
                  key={l.slug}
                  to={`/homes/${l.slug}`}
                  onMouseEnter={() => onHover?.(l.slug)}
                  onMouseLeave={() => onHover?.(null)}
                  aria-label={`${l.title}, ${short(l.price)}`}
                  className={cx(
                    "whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-bold shadow-card transition",
                    active === l.slug ? "z-10 scale-110 bg-clay text-white" : l.deal === "rent" ? "bg-paper text-ink hover:bg-forest hover:text-cream" : "bg-forest text-cream hover:bg-clay",
                  )}
                >
                  {short(l.price)}
                </Link>
              ))}
            </div>
          </div>
        );
      })}
      <div className="absolute bottom-3 left-3 flex gap-2 rounded-full bg-paper/90 px-3 py-1.5 text-[11px] font-semibold">
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full border border-ink/30 bg-paper" /> Rent / year</span>
        <span className="flex items-center gap-1"><i className="h-2.5 w-2.5 rounded-full bg-forest" /> Sale</span>
      </div>
    </div>
  );
}
