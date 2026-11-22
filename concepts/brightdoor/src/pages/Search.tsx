import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { movingIn, short, type Area } from "../data/listings";
import { LagosMap, ListingCard, cx } from "../components/ui";
import { allListings, useStore } from "../lib/store";

const AREAS: Area[] = ["Lekki Phase 1", "Ikoyi", "Victoria Island", "Ikate", "Ajah", "Yaba", "Gbagada", "Ikeja GRA"];

export default function Search() {
  const [q, setQ] = useSearchParams();
  const store = useStore();
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "map">("list");

  const deal = q.get("deal") ?? "";
  const area = q.get("area") ?? "";
  const max = Number(q.get("max") || 0);
  const beds = Number(q.get("beds") || 0);
  const verified = q.get("verified") === "1";
  const sort = q.get("sort") ?? "new";

  const update = (k: string, v: string) => {
    const n = new URLSearchParams(q);
    if (v) n.set(k, v);
    else n.delete(k);
    if (k === "deal") n.delete("max");
    setQ(n, { replace: true });
  };

  const results = useMemo(() => {
    const total = (l: ReturnType<typeof allListings>[number]) => movingIn(l)?.total ?? l.price;
    const r = allListings(store).filter(
      (l) => (!deal || l.deal === deal) && (!area || l.area === area) && (!max || l.price <= max) && (!beds || l.beds >= beds) && (!verified || l.verified),
    );
    if (sort === "low") r.sort((a, b) => total(a) - total(b));
    else if (sort === "high") r.sort((a, b) => total(b) - total(a));
    else r.sort((a, b) => a.listedDaysAgo - b.listedDaysAgo);
    return r;
  }, [store, deal, area, max, beds, verified, sort]);

  const budgets = deal === "sale" ? [150_000_000, 300_000_000, 500_000_000] : [3_000_000, 6_000_000, 12_000_000, 35_000_000];

  return (
    <main className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="label">{area || "All of Lagos"}</p>
          <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">
            {results.length} {results.length === 1 ? "home" : "homes"} {deal === "rent" ? "to rent" : deal === "sale" ? "for sale" : "to rent or buy"}
          </h1>
        </div>
        <div className="flex rounded-full bg-paper p-1 shadow-card lg:hidden" role="tablist" aria-label="View">
          {(["list", "map"] as const).map((v) => (
            <button key={v} role="tab" aria-selected={view === v} onClick={() => setView(v)} className={cx("rounded-full px-4 py-1.5 text-sm font-bold capitalize", view === v ? "bg-forest text-cream" : "text-ink/70")}>{v}</button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 -mx-4 mt-4 border-y border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur md:mx-0 md:rounded-2xl md:border md:px-3">
        <div className="flex gap-2 overflow-x-auto pb-0.5 [scrollbar-width:none]">
          <div className="flex shrink-0 rounded-full bg-paper p-0.5 shadow-card">
            {[["", "All"], ["rent", "Rent"], ["sale", "Buy"]].map(([v, t]) => (
              <button key={t} onClick={() => update("deal", v)} aria-pressed={deal === v} className={cx("rounded-full px-3.5 py-1.5 text-[13px] font-bold", deal === v ? "bg-forest text-cream" : "text-ink/70")}>{t}</button>
            ))}
          </div>
          <select aria-label="Area" className="chip shrink-0 !pr-7" value={area} onChange={(e) => update("area", e.target.value)}>
            <option value="">Any area</option>
            {AREAS.map((a) => <option key={a}>{a}</option>)}
          </select>
          <select aria-label="Budget" className="chip shrink-0 !pr-7" value={max || ""} onChange={(e) => update("max", e.target.value)}>
            <option value="">Any budget</option>
            {budgets.map((b) => <option key={b} value={b}>Up to {short(b)}</option>)}
          </select>
          <select aria-label="Bedrooms" className="chip shrink-0 !pr-7" value={beds || ""} onChange={(e) => update("beds", e.target.value)}>
            <option value="">Any beds</option>
            {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}+ beds</option>)}
          </select>
          <button onClick={() => update("verified", verified ? "" : "1")} aria-pressed={verified} className={cx("chip shrink-0", verified && "!border-forest !bg-forest-soft text-forest")}>✓ Verified only</button>
          <select aria-label="Sort" className="chip shrink-0 !pr-7" value={sort} onChange={(e) => update("sort", e.target.value)}>
            <option value="new">Newest</option>
            <option value="low">Lowest move-in total</option>
            <option value="high">Highest price</option>
          </select>
        </div>
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_minmax(0,0.9fr)]">
        <div className={cx(view === "map" && "hidden lg:block")}>
          {results.length === 0 ? (
            <div className="rounded-3xl bg-paper p-10 text-center shadow-card">
              <p className="font-display text-2xl font-semibold">No homes match yet.</p>
              <p className="mt-2 text-stone">Try a bigger budget or another area.</p>
              <button className="btn-ghost mt-5" onClick={() => setQ(new URLSearchParams())}>Clear filters</button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {results.map((l) => <ListingCard key={l.slug} l={l} active={hover === l.slug} onHover={setHover} />)}
            </div>
          )}
        </div>
        <div className={cx("lg:sticky lg:top-36 lg:self-start", view === "list" && "hidden lg:block")}>
          <LagosMap items={results} active={hover} onHover={setHover} />
        </div>
      </div>
    </main>
  );
}
