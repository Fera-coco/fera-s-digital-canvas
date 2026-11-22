import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { agents, img, movingIn, naira, short, type Listing } from "../data/listings";
import { Check, FeeBar, Heart, ListingCard, PriceLine, cx } from "../components/ui";
import { actions, allListings, useStore } from "../lib/store";

export default function Property() {
  const { slug = "" } = useParams();
  const store = useStore();
  const all = allListings(store);
  const l = all.find((x) => x.slug === slug);
  const [shown, setShown] = useState<number | null>(null);
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!l) {
    return (
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">This home has been taken off the market.</h1>
        <Link to="/homes" className="btn-primary mt-6">See other homes</Link>
      </main>
    );
  }
  const similar = all.filter((x) => x.slug !== l.slug && x.deal === l.deal).slice(0, 3);
  const inCompare = store.compare.includes(l.slug);

  return (
    <main className="mx-auto max-w-7xl px-4 pt-5 md:px-6">
      <nav className="text-sm text-stone" aria-label="Breadcrumb">
        <Link to={`/homes?deal=${l.deal}`} className="hover:text-ink">{l.deal === "rent" ? "To rent" : "For sale"}</Link> ·{" "}
        <Link to={`/homes?deal=${l.deal}&area=${encodeURIComponent(l.area)}`} className="hover:text-ink">{l.area}</Link>
      </nav>

      {/* Gallery */}
      <div className="relative mt-3 grid h-[300px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:h-[460px]">
        {l.images.slice(0, 4).map((k, i) => (
          <button key={k + i} onClick={() => setShown(i)} className={cx("relative overflow-hidden bg-sand", i === 0 ? "col-span-4 row-span-2 md:col-span-2" : i === 1 ? "hidden md:col-span-2 md:block" : "hidden md:block")}>
            <img src={img(k, i === 0 ? 1400 : 800)} alt={`${l.title}, photo ${i + 1}`} className="h-full w-full object-cover transition hover:scale-[1.02]" />
          </button>
        ))}
        <button onClick={() => setShown(0)} className="absolute bottom-3 right-3 rounded-full bg-paper px-4 py-2 text-sm font-bold shadow-card">See all {l.images.length} photos</button>
        <Heart slug={l.slug} className="absolute right-3 top-3" />
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {l.verified && <span className="inline-flex items-center gap-1 rounded-full bg-forest px-2.5 py-1 text-[11px] font-bold text-cream"><Check /> Verified listing</span>}
            <span className={cx("rounded-full px-2.5 py-1 text-[11px] font-bold", l.status === "Available" ? "bg-forest-soft text-forest" : "bg-gold-soft")}>{l.status}</span>
            <span className="text-[13px] text-stone">{l.listedDaysAgo === 1 ? "Listed yesterday" : `Listed ${l.listedDaysAgo} days ago`}</span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-semibold leading-tight md:text-5xl">{l.title}</h1>
          <p className="mt-1 text-lg text-stone">{l.street}, {l.area}, Lagos</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[`${l.beds} bedrooms`, `${l.baths} bathrooms`, `${l.sqm} m²`, l.kind].map((f) => <span key={f} className="chip">{f}</span>)}
          </div>

          {l.deal === "rent" ? <TotalPackage l={l} /> : <TitleCheck l={l} />}

          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">Living here</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[["⚡", "Power", l.power], ["💧", "Water", l.water], ["🛡️", "Security", l.security]].map(([i, t, d]) => (
                <div key={t} className="rounded-2xl bg-paper p-4 shadow-card">
                  <p className="text-xl" aria-hidden>{i}</p>
                  <p className="label mt-2">{t}</p>
                  <p className="mt-1 text-[15px] font-medium">{d}</p>
                </div>
              ))}
            </div>
            <Commute l={l} />
          </section>

          <section className="mt-12">
            <h2 className="font-display text-2xl font-semibold">About this home</h2>
            <p className="mt-3 max-w-2xl text-[17px] leading-relaxed text-ink/85">{l.about}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {l.features.map((f) => <li key={f} className="flex items-center gap-2 text-[15px]"><span className="grid h-5 w-5 place-items-center rounded-full bg-forest-soft text-forest"><Check /></span>{f}</li>)}
            </ul>
          </section>
        </div>

        <aside id="book" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-paper p-5 shadow-card">
            <PriceLine l={l} big />
            <Booker l={l} />
            <button onClick={() => actions.toggleCompare(l.slug)} aria-pressed={inCompare} className={cx("btn-ghost mt-3 w-full", inCompare && "!border-forest !bg-forest-soft text-forest")}>
              {inCompare ? "✓ In your comparison" : "Add to compare"}
            </button>
          </div>
        </aside>
      </div>

      {similar.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Similar homes</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{similar.map((s) => <ListingCard key={s.slug} l={s} />)}</div>
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-ink/10 bg-paper/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold leading-tight">{short(l.price)}{l.deal === "rent" && <span className="font-sans text-xs font-medium text-stone"> / year</span>}</p>
          {movingIn(l) && <p className="truncate text-[12px] text-stone">Move-in total {short(movingIn(l)!.total)}</p>}
        </div>
        <a href="#book" className="btn-primary shrink-0 !py-2.5">Book inspection</a>
      </div>

      {shown !== null && <Lightbox l={l} start={shown} onClose={() => setShown(null)} />}
    </main>
  );
}

function TotalPackage({ l }: { l: Listing }) {
  const m = movingIn(l)!;
  const refundable = m.lines.filter((x) => x.refundable).reduce((s, x) => s + x.amount, 0);
  return (
    <section className="mt-10 rounded-3xl bg-paper p-6 shadow-card md:p-8">
      <p className="label">Total package</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-display text-4xl font-semibold">{naira(m.total)}</h2>
        <p className="text-sm text-stone">to move in, first year</p>
      </div>
      <div className="mt-5"><FeeBar l={l} /></div>
      <ul className="mt-5 divide-y divide-ink/10">
        {m.lines.map((x) => (
          <li key={x.key} className="flex items-center justify-between gap-3 py-3 text-[15px]">
            <span className="flex items-center gap-2.5">
              <i className={cx("h-3 w-3 shrink-0 rounded-full", x.color)} />
              {x.label}
              {x.refundable && <span className="rounded-full bg-lagoon px-2 py-0.5 text-[11px] font-bold">Refundable</span>}
            </span>
            <span className="font-semibold tabular-nums">{naira(x.amount)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-stone">
        From year two you pay rent and service charge only: <span className="font-semibold text-ink">{naira(l.price + (l.serviceCharge ?? 0))}</span>.
        {refundable > 0 && <> The {naira(refundable)} caution comes back when you move out, minus any damage.</>}
      </p>
    </section>
  );
}

const DOC_STYLE = {
  seen: { label: "Seen and checked", cls: "bg-forest-soft text-forest", icon: "✓" },
  "in progress": { label: "In progress", cls: "bg-gold-soft text-ink", icon: "…" },
  "not provided": { label: "Not provided", cls: "bg-clay-soft text-clay-ink", icon: "!" },
} as const;

function TitleCheck({ l }: { l: Listing }) {
  const docs = l.titleDocs ?? [];
  const seen = docs.filter((d) => d.status === "seen").length;
  const costs = [
    ["Agency fee (5%)", l.price * 0.05],
    ["Legal fee (5%)", l.price * 0.05],
    ["Governor's Consent and registration (about 3%)", l.price * 0.03],
  ] as const;
  return (
    <section className="mt-10 grid gap-5 md:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl bg-paper p-6 shadow-card">
        <p className="label">Title check</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{seen} of {docs.length} documents seen</h2>
        <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-sand">
          <span className="bg-forest" style={{ width: `${(seen / Math.max(docs.length, 1)) * 100}%` }} />
        </div>
        <ul className="mt-5 space-y-3">
          {docs.map((d) => {
            const s = DOC_STYLE[d.status];
            return (
              <li key={d.name} className="flex gap-3">
                <span className={cx("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[12px] font-bold", s.cls)}>{s.icon}</span>
                <div>
                  <p className="font-semibold">{d.name} <span className={cx("ml-1 inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-bold", s.cls)}>{s.label}</span></p>
                  <p className="text-sm text-stone">{d.note}</p>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-5 rounded-2xl bg-cream p-3 text-[13px] text-stone">Always have your own lawyer search the title at the Lands Registry before you pay.</p>
      </div>
      <div className="rounded-3xl bg-forest p-6 text-cream shadow-card">
        <p className="label !text-gold">Budget beyond the price</p>
        <ul className="mt-4 space-y-3 text-[15px]">
          {costs.map(([t, v]) => (
            <li key={t} className="flex justify-between gap-3"><span className="text-cream/80">{t}</span><span className="font-semibold">{short(v)}</span></li>
          ))}
        </ul>
        <div className="mt-4 border-t border-cream/20 pt-4">
          <p className="text-sm text-cream/70">Estimated total</p>
          <p className="font-display text-3xl font-semibold">{short(l.price + costs.reduce((s, [, v]) => s + v, 0))}</p>
          <p className="mt-2 text-[12px] text-cream/60">Typical Lagos rates, for planning only. Your lawyer confirms the real figures.</p>
        </div>
      </div>
    </section>
  );
}

function Commute({ l }: { l: Listing }) {
  const { to, offPeak, rush } = l.commute;
  return (
    <div className="mt-4 rounded-2xl bg-paper p-5 shadow-card">
      <p className="label">Drive to {to}</p>
      <div className="mt-3 space-y-2.5">
        {[["Off-peak", offPeak, "bg-forest"], ["Rush hour", rush, "bg-clay"]].map(([t, v, c]) => (
          <div key={t as string} className="grid grid-cols-[84px_1fr_56px] items-center gap-3 text-sm">
            <span className="font-medium">{t}</span>
            <span className="h-2.5 overflow-hidden rounded-full bg-sand"><span className={cx("block h-full rounded-full", c as string)} style={{ width: `${((v as number) / 90) * 100}%` }} /></span>
            <span className="text-right font-semibold tabular-nums">{v} min</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function nextDays() {
  const out: { key: string; day: string; date: string }[] = [];
  const d = new Date();
  for (let i = 1; out.length < 6; i++) {
    const x = new Date(d.getFullYear(), d.getMonth(), d.getDate() + i);
    if (x.getDay() === 0) continue; // no Sunday inspections
    out.push({ key: x.toDateString(), day: x.toLocaleDateString("en-GB", { weekday: "short" }), date: x.toLocaleDateString("en-GB", { day: "numeric", month: "short" }) });
  }
  return out;
}

function Booker({ l }: { l: Listing }) {
  const days = useMemo(nextDays, []);
  const [day, setDay] = useState(days[0].key);
  const [time, setTime] = useState("10:00");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState(false);
  const agent = agents[l.agent];
  const d = days.find((x) => x.key === day)!;
  const message = `Hi ${agent.name.split(" ")[0]}, I'd like to inspect "${l.title}" in ${l.area} on ${d.day} ${d.date} at ${time}. My name is ${name || "…"}.`;

  if (done) {
    return (
      <div className="mt-5 rounded-2xl bg-forest-soft p-4">
        <p className="font-bold text-forest">✓ Inspection requested</p>
        <p className="mt-1 text-sm">{agent.name} will confirm on WhatsApp. On a live site this opens WhatsApp with:</p>
        <p className="mt-2 rounded-xl bg-paper p-3 text-[13px] italic text-ink/80">{message}</p>
        <button className="mt-3 text-sm font-bold text-forest underline" onClick={() => setDone(false)}>Book another time</button>
      </div>
    );
  }

  return (
    <form
      className="mt-5"
      onSubmit={(e) => {
        e.preventDefault();
        actions.addEnquiry({ slug: l.slug, name, phone, kind: "Inspection", when: `${d.day} ${d.date}, ${time}` });
        setDone(true);
      }}
    >
      <p className="font-bold">Book a free inspection</p>
      <div className="mt-3 grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Day">
        {days.map((x) => (
          <button type="button" role="radio" aria-checked={day === x.key} key={x.key} onClick={() => setDay(x.key)}
            className={cx("rounded-xl border px-2 py-2 text-center text-[13px] leading-tight", day === x.key ? "border-forest bg-forest text-cream" : "border-ink/15 hover:border-ink/40")}>
            <span className="block font-bold">{x.day}</span>{x.date}
          </button>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5" role="radiogroup" aria-label="Time">
        {["10:00", "12:00", "14:00", "16:00"].map((t) => (
          <button type="button" role="radio" aria-checked={time === t} key={t} onClick={() => setTime(t)}
            className={cx("rounded-xl border py-2 text-[13px] font-semibold", time === t ? "border-clay bg-clay text-white" : "border-ink/15 hover:border-ink/40")}>{t}</button>
        ))}
      </div>
      <label className="mt-3 block"><span className="sr-only">Your name</span><input required className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} /></label>
      <label className="mt-2 block"><span className="sr-only">WhatsApp number</span><input required inputMode="tel" className="field" placeholder="WhatsApp number" value={phone} onChange={(e) => setPhone(e.target.value)} /></label>
      <button className="btn-primary mt-3 w-full">Request inspection</button>
      <div className="mt-4 flex items-center gap-3 border-t border-ink/10 pt-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-clay-soft text-sm font-bold text-clay-ink">{agent.initials}</span>
        <div className="text-sm">
          <p className="font-bold">{agent.name} · {agent.role}</p>
          <p className="text-stone">{agent.reply}</p>
        </div>
      </div>
    </form>
  );
}

function Lightbox({ l, start, onClose }: { l: Listing; start: number; onClose: () => void }) {
  const [i, setI] = useState(start);
  const n = l.images.length;
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setI((x) => (x + 1) % n);
      if (e.key === "ArrowLeft") setI((x) => (x - 1 + n) % n);
    };
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  }, [n, onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label="Photos" className="fixed inset-0 z-50 flex flex-col bg-ink/95 p-4">
      <div className="flex items-center justify-between text-cream">
        <p className="text-sm font-semibold">{i + 1} / {n}</p>
        <button onClick={onClose} className="rounded-full bg-cream/10 px-4 py-2 text-sm font-bold hover:bg-cream/20" autoFocus>Close</button>
      </div>
      <div className="relative flex flex-1 items-center justify-center">
        <img src={img(l.images[i], 1800)} alt={`${l.title}, photo ${i + 1}`} className="max-h-full max-w-full rounded-2xl object-contain" />
        <button aria-label="Previous photo" onClick={() => setI((i - 1 + n) % n)} className="absolute left-0 grid h-12 w-12 place-items-center rounded-full bg-cream/90 text-xl font-bold">‹</button>
        <button aria-label="Next photo" onClick={() => setI((i + 1) % n)} className="absolute right-0 grid h-12 w-12 place-items-center rounded-full bg-cream/90 text-xl font-bold">›</button>
      </div>
    </div>
  );
}
