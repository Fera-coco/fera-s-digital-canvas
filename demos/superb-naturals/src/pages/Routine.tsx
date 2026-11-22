import { useState } from "react";
import { Link } from "react-router-dom";
import { CONCERNS, img, keyOf, naira, routine, waLink, type Concern, type Product } from "../data/products";
import { WaIcon } from "../components/ui";
import ConcernIcon from "../components/ConcernIcon";
import { Braid, Bubbles, Curl, Straight } from "../components/icons";

const STYLE_ICON = { out: Curl, protective: Braid, relaxed: Straight };
import { addToCart } from "../lib/store";

type Style = "out" | "protective" | "relaxed";
const STYLES: { id: Style; label: string; text: string }[] = [
  { id: "out", label: "Natural, worn out", text: "Afro, puff, twist-out, wash and go" },
  { id: "protective", label: "In a protective style", text: "Braids, twists, cornrows or under a wig" },
  { id: "relaxed", label: "Relaxed or texturised", text: "Chemically straightened hair" },
];
const WASH = ["Every week", "Every two weeks", "Once a month or less"];

/* Which products to suggest for each main concern. Shampoo and conditioner are always in. */
const PICKS: Record<Concern, string[]> = {
  growth: ["hair-growth-oil", "hair-growth-butter"],
  edges: ["essential-edge-oil", "hair-growth-oil"],
  dandruff: ["hair-growth-oil", "essential-edge-oil"],
  breakage: ["hair-growth-butter", "hair-growth-oil"],
  softness: ["hair-growth-butter"],
};

export default function Routine() {
  const [step, setStep] = useState(0);
  const [concern, setConcern] = useState<Concern | null>(null);
  const [style, setStyle] = useState<Style | null>(null);
  const [wash, setWash] = useState<string | null>(null);
  const [kitAdded, setKitAdded] = useState(false);
  const [allAdded, setAllAdded] = useState(false);

  const done = step === 3 && concern && style && wash;
  const picks: Product[] = done
    ? routine.filter((p) => p.slug === "shampoo-conditioner" || PICKS[concern].includes(p.slug) || (style === "protective" && p.kind === "Oil"))
    : [];

  const tips: string[] = [];
  if (done) {
    if (style === "protective") tips.push("Between wash days, oil your scalp along your parts so it doesn't dry out under the style.");
    if (concern === "edges") tips.push("Go gentle on your edges: avoid tight styles that pull at your hairline.");
    if (concern === "dandruff") tips.push("Massage the shampoo into your scalp, not only the length of your hair.");
    if (wash === "Once a month or less") tips.push("Long gaps between washes? Keep your scalp moisturised with oil in between.");
  }
  const c = CONCERNS.find((x) => x.id === concern);
  const s = STYLES.find((x) => x.id === style);

  return (
    <section className="mx-auto max-w-3xl px-5 pt-10">
      <h1 className="font-display text-5xl font-semibold tracking-tight">{done ? "Your routine" : "Let's find your routine"}</h1>

      {!done && (
        <>
          <div className="mt-6 flex gap-2" aria-hidden>
            {[0, 1, 2].map((k) => (
              <span key={k} className={`h-2 flex-1 rounded-full transition ${k <= step ? "bg-blush" : "bg-ink/10"}`} />
            ))}
          </div>
          <p className="mt-3 text-sm font-semibold text-stone">Question {step + 1} of 3</p>
        </>
      )}

      {step === 0 && (
        <Question title="What does your hair need most right now?">
          {CONCERNS.map((x) => (
            <Option key={x.id} on={concern === x.id} icon={<ConcernIcon id={x.id} />} label={x.label} text={x.blurb} onClick={() => { setConcern(x.id); setStep(1); }} />
          ))}
        </Question>
      )}
      {step === 1 && (
        <Question title="How do you usually wear your hair?" back={() => setStep(0)}>
          {STYLES.map((x) => (
            <Option key={x.id} on={style === x.id} icon={(() => { const I = STYLE_ICON[x.id]; return <I />; })()} label={x.label} text={x.text} onClick={() => { setStyle(x.id); setStep(2); }} />
          ))}
        </Question>
      )}
      {step === 2 && (
        <Question title="How often do you wash your hair?" back={() => setStep(1)}>
          {WASH.map((x) => (
            <Option key={x} on={wash === x} icon={<Bubbles />} label={x} onClick={() => { setWash(x); setStep(3); }} />
          ))}
        </Question>
      )}

      {done && (
        <div className="mt-6">
          <p className="text-lg text-stone">
            For <span className="font-bold text-ink">{c!.label.toLowerCase()}</span>, worn <span className="font-bold text-ink">{s!.label.toLowerCase()}</span>, washed <span className="font-bold text-ink">{wash!.toLowerCase()}</span>. Use these in order:
          </p>
          <ol className="mt-8 space-y-3">
            {picks.map((p, k) => (
              <li key={p.slug}>
                <Link to={`/shop/${p.slug}`} className="flex items-center gap-4 rounded-3xl bg-paper p-3 pr-5 shadow-card ring-1 ring-ink/5 transition hover:ring-leaf">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf font-display text-lg font-bold text-white">{k + 1}</span>
                  <img src={img(p.images[0])} alt="" className="h-16 w-16 rounded-2xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="label text-blush">{p.stepLabel}</span>
                    <span className="block font-display text-xl font-semibold leading-tight">{p.name}</span>
                    <span className="block truncate text-sm text-stone">{p.benefits[0]}</span>
                  </span>
                  <span aria-hidden className="text-xl text-leaf">→</span>
                </Link>
              </li>
            ))}
          </ol>

          {tips.length > 0 && (
            <div className="mt-6 rounded-3xl bg-butter-soft p-5">
              <p className="label">Little tips</p>
              <ul className="mt-3 space-y-2">
                {tips.map((t) => (
                  <li key={t} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blush" />{t}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 rounded-3xl bg-leaf-soft p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="label text-leaf-deep">Whole routine</p>
                <p className="font-display text-3xl font-semibold">{naira(picks.reduce((t, p) => t + p.price, 0))}</p>
                {picks.some((p) => p.sizes) && <p className="text-sm text-stone">With the 50ml Hair Growth Oil</p>}
              </div>
              <button
                className="btn-leaf !px-7 !py-3.5 text-base"
                onClick={() => {
                  picks.forEach((p) => addToCart(keyOf(p.slug, p.sizes?.[0].label)));
                  setAllAdded(true);
                }}
              >
                {allAdded ? "Added to bag ✓" : "Add all to bag"}
              </button>
            </div>
            {concern !== "dandruff" && <p className="mt-3 text-sm text-stone">Or get most of it in the <Link to="/shop/medium-kit" className="font-bold text-leaf underline">Medium Kit (₦26,000)</Link>.</p>}
          </div>

          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <a
              className="btn-ghost !py-4 text-base"
              target="_blank"
              rel="noopener noreferrer"
              href={waLink(`Hello Superb Naturals 👋 I took the routine finder (${c!.label}, ${s!.label}, washing ${wash!.toLowerCase()}). I'd like to order:\n${picks.map((p, k) => `${k + 1}. ${p.name}`).join("\n")}\nCan you help me get started?`)}
            >
              <WaIcon /> Ask about this routine on WhatsApp
            </a>
            <button
              className="btn-blush !py-4 text-base"
              onClick={() => {
                addToCart("mini-kit");
                setKitAdded(true);
              }}
            >
              {kitAdded ? "Mini Kit added ✓" : "Or start small: Mini Kit (₦15,000)"}
            </button>
          </div>
          <button className="mt-6 text-sm font-bold text-stone underline underline-offset-4" onClick={() => { setStep(0); setConcern(null); setStyle(null); setWash(null); setKitAdded(false); }}>
            Start again
          </button>
          <p className="mt-6 text-xs text-stone">A suggested routine to help you choose. All products are for external use only.</p>
        </div>
      )}
    </section>
  );
}

function Question({ title, children, back }: { title: string; children: React.ReactNode; back?: () => void }) {
  return (
    <div className="mt-8">
      <h2 className="font-display text-3xl font-semibold">{title}</h2>
      <div className="mt-6 grid gap-3">{children}</div>
      {back && (
        <button className="mt-6 text-sm font-bold text-stone underline underline-offset-4" onClick={back}>
          ← Back
        </button>
      )}
    </div>
  );
}

function Option({ on, icon, label, text, onClick }: { on: boolean; icon: React.ReactNode; label: string; text?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-4 rounded-3xl p-4 text-left transition ${on ? "bg-leaf text-white" : "bg-paper ring-1 ring-ink/10 hover:-translate-y-0.5 hover:ring-blush"}`}>
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${on ? "bg-white/15 text-white" : "bg-blush-soft text-blush-deep"}`}>{icon}</span>
      <span>
        <span className="block font-display text-lg font-semibold">{label}</span>
        {text && <span className={`block text-sm ${on ? "text-white/80" : "text-stone"}`}>{text}</span>}
      </span>
    </button>
  );
}
