import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { img, listings, movingIn, naira, short } from "../data/listings";
import { AREAS } from "../data/listings";
import { Check, FeeBar, LagosMap, ListingCard, cx } from "../components/ui";

const RENT_BUDGETS = [1_000_000, 2_000_000, 3_000_000, 6_000_000, 12_000_000, 35_000_000];
const SALE_BUDGETS = [50_000_000, 150_000_000, 300_000_000, 500_000_000];

export default function Home() {
  const nav = useNavigate();
  const [deal, setDeal] = useState<"rent" | "sale">("rent");
  const [area, setArea] = useState("");
  const [max, setMax] = useState("");
  const [beds, setBeds] = useState("");
  const example = listings[0];
  const m = movingIn(example)!;

  const go = (e: React.FormEvent) => {
    e.preventDefault();
    const q = new URLSearchParams({ deal });
    if (area) q.set("area", area);
    if (max) q.set("max", max);
    if (beds) q.set("beds", beds);
    nav(`/homes?${q}`);
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <img src={img("lagosVI", 2000)} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/70 via-forest-deep/55 to-forest-deep/90" />
        <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 md:px-6 md:pb-20 md:pt-24">
          <p className="label !text-gold">Lagos homes · Rent and buy</p>
          <h1 className="mt-3 max-w-3xl font-display text-[44px] font-semibold leading-[1.02] tracking-tight text-cream md:text-7xl">
            See the full price <em className="font-normal text-gold">before</em> you inspect.
          </h1>
          <p className="mt-5 max-w-xl text-[17px] text-cream/85">
            Every rental shows the total package: rent, service charge, agency, legal and caution. Every sale shows which title documents we've actually seen.
          </p>

          <form onSubmit={go} className="mt-8 max-w-4xl rounded-3xl bg-paper p-3 shadow-card md:p-4" aria-label="Search homes">
            <div className="flex gap-1 rounded-full bg-cream p-1 sm:w-fit" role="tablist">
              {(["rent", "sale"] as const).map((d) => (
                <button key={d} type="button" role="tab" aria-selected={deal === d} onClick={() => { setDeal(d); setMax(""); }}
                  className={cx("flex-1 rounded-full px-6 py-2 text-sm font-bold transition sm:flex-none", deal === d ? "bg-forest text-cream" : "text-ink/70")}>
                  {d === "rent" ? "Rent" : "Buy"}
                </button>
              ))}
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1.4fr_1fr_0.8fr_auto]">
              <label className="block">
                <span className="sr-only">Area</span>
                <select className="field" value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">All of Lagos</option>
                  {AREAS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="sr-only">Budget</span>
                <select className="field" value={max} onChange={(e) => setMax(e.target.value)}>
                  <option value="">Any budget</option>
                  {(deal === "rent" ? RENT_BUDGETS : SALE_BUDGETS).map((b) => <option key={b} value={b}>Up to {short(b)}{deal === "rent" ? " / yr" : ""}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="sr-only">Bedrooms</span>
                <select className="field" value={beds} onChange={(e) => setBeds(e.target.value)}>
                  <option value="">Any beds</option>
                  {[1, 2, 3, 4].map((b) => <option key={b} value={b}>{b}+ beds</option>)}
                </select>
              </label>
              <button className="btn-primary !rounded-xl !bg-clay hover:!bg-clay-ink">Search homes</button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap gap-2" aria-label="Quick searches">
            {[["Under ₦1m a year", "/homes?deal=rent&max=1000000"], ["Under ₦2m", "/homes?deal=rent&max=2000000"], ["Family homes, 3+ beds", "/homes?beds=3"], ["Verified only", "/homes?verified=1"]].map(([t, to]) => (
              <Link key={t} to={to} className="rounded-full border border-cream/30 bg-cream/10 px-3.5 py-1.5 text-[13px] font-semibold text-cream backdrop-blur hover:bg-cream hover:text-forest">{t}</Link>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-cream/90">
            {["No inspection fees", "Fees shown upfront", "Title documents checked"].map((t) => (
              <li key={t} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-ink"><Check /></span>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Total package explainer */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="label">The total package, explained</p>
            <h2 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">₦10m rent is never ₦10m.</h2>
            <p className="mt-4 max-w-md text-[17px] text-stone">
              In Lagos, the first year costs rent plus service charge, agency, legal and a caution deposit. Most listings bury that in the description. We put it on every card.
            </p>
            <Link to="/homes?deal=rent" className="btn-primary mt-7">See homes to rent</Link>
          </div>
          <div className="rounded-3xl bg-paper p-6 shadow-card md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <p className="font-semibold">{example.title}, {example.area}</p>
              <p className="text-sm text-stone">Example</p>
            </div>
            <p className="mt-4 font-display text-5xl font-semibold">{naira(m.total)}</p>
            <p className="text-sm text-stone">to move in, for a home advertised at {naira(example.price)} a year</p>
            <div className="mt-5"><FeeBar l={example} /></div>
            <ul className="mt-5 divide-y divide-ink/10 text-[15px]">
              {m.lines.map((x) => (
                <li key={x.key} className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-2.5"><i className={cx("h-3 w-3 rounded-full", x.color)} />{x.label}{x.refundable && <span className="rounded-full bg-lagoon px-2 py-0.5 text-[11px] font-bold">Refundable</span>}</span>
                  <span className="font-semibold tabular-nums">{naira(x.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="label">New this week</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Fresh listings</h2>
          </div>
          <Link to="/homes" className="text-sm font-bold text-forest hover:underline">See all {listings.length} homes →</Link>
        </div>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...listings].sort((a, b) => a.listedDaysAgo - b.listedDaysAgo).slice(0, 3).map((l) => <ListingCard key={l.slug} l={l} />)}
        </div>
      </section>

      {/* Map */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="label">Where's your budget?</p>
            <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">Prices on the map, from Ikeja to Ajah.</h2>
            <p className="mt-3 text-stone">Every pin is a real price, so you can see what each part of Lagos costs before you scroll through a single listing.</p>
            <Link to="/homes" className="btn-ghost mt-6">Open the map</Link>
          </div>
          <LagosMap items={listings} compact />
        </div>
      </section>

      {/* Buying */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid gap-8 overflow-hidden rounded-[2rem] bg-forest text-cream lg:grid-cols-2">
          <div className="p-8 md:p-12">
            <p className="label !text-gold">Buying in Lagos?</p>
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-4xl">We show you the papers, not just the pictures.</h2>
            <p className="mt-4 text-cream/80">
              Every home for sale lists its title documents and their status: seen and searched, in progress, or not provided. So you know what your lawyer needs to check before you pay a kobo.
            </p>
            <ul className="mt-6 space-y-2 text-sm font-semibold">
              {["Certificate of Occupancy", "Survey plan", "Governor's Consent", "Building approval"].map((d) => (
                <li key={d} className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-gold text-ink"><Check /></span>{d}</li>
              ))}
            </ul>
            <Link to="/homes?deal=sale" className="btn mt-8 bg-cream text-forest hover:bg-gold">See homes for sale</Link>
          </div>
          <img src={img("whiteHouse", 1200)} alt="A white two-storey house with a black roof and a green lawn" className="h-72 w-full object-cover lg:h-full" />
        </div>
      </section>

      {/* How inspection works */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <p className="label">How it works</p>
        <h2 className="mt-2 font-display text-3xl font-semibold md:text-4xl">From scrolling to keys, without the runaround.</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Pick a slot", "Choose a day and time for an inspection straight from the listing. Inspections are free."],
            ["Meet the agent", "You get a WhatsApp confirmation with the agent's name and the exact address the day before."],
            ["Pay the right people", "We share the landlord's account details in writing and never ask for cash on site."],
          ].map(([t, d], i) => (
            <li key={t} className="rounded-3xl bg-paper p-6 shadow-card">
              <span className="font-display text-4xl font-semibold text-clay">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-stone">{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
