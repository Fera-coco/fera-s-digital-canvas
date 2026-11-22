import { useState } from "react";
import { Link } from "react-router-dom";
import { CONCERNS, img, products, routine, bySlug, naira, waLink } from "../data/products";
import { ProductCard, SectionTitle } from "../components/ui";
import ConcernIcon from "../components/ConcernIcon";
import { Bank, Check, Leaf, Truck } from "../components/icons";
import { addToCart } from "../lib/store";

const FAQ = [
  {
    q: "How do I order?",
    a: "Add products to your bag and check out, or tap any WhatsApp button and order in chat. Both reach Superb Naturals directly.",
  },
  {
    q: "How do I pay?",
    a: "By bank transfer. After checkout you'll see the account details and your order number. Send your proof of payment on WhatsApp and your order is confirmed.",
  },
  {
    q: "How much is delivery?",
    a: "It depends on where you are, from ₦3,000 in Asaba and Warri to ₦7,000 for the Northern States, Calabar, Uyo and Port Harcourt. You pick your location at checkout and the fee is added to your total. We also ship internationally, quoted on WhatsApp.",
  },
  {
    q: "Which products are right for me?",
    a: "Take the one-minute routine finder. It asks what your hair needs and builds a routine from the range.",
  },
  {
    q: "How soon will my order arrive?",
    a: "Orders are dispatched within 2–3 days after your payment is confirmed.",
  },
  {
    q: "What if my order arrives damaged or wrong?",
    a: "Report it within 24 hours of delivery with clear pictures or videos, and we'll arrange a replacement or a refund once it's verified. Read the full refund policy for details.",
  },
  {
    q: "Can I drink or swallow the oils?",
    a: "No. Every Superb Naturals product is for external use only.",
  },
];

export default function Home() {
  const kit = bySlug("mini-kit")!;
  const [kitAdded, setKitAdded] = useState(false);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pt-16">
          <div>
            <p className="inline-flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-[0.14em] text-leaf"><Leaf size={16} /> Made with raw herbs & active oils</p>
            <h1 className="mt-6 font-display text-[3.1rem] font-semibold leading-[0.98] tracking-tight md:text-[4.6rem]">
              Unlock your hair's <span className="italic text-blush">full</span> potential.
            </h1>
            <p className="mt-6 max-w-md text-[1.08rem] leading-relaxed text-stone">
              Growth oil, edge oil, shampoo, conditioner and growth butter, made with raw herbs. Plus beard care for the men.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-leaf !px-7 !py-3.5 text-base">Shop the range</Link>
              <Link to="/routine" className="btn-ghost !px-7 !py-3.5 text-base">Find my routine</Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-stone">
              <li className="flex items-center gap-2"><Truck size={18} className="text-leaf" /> Delivery across Nigeria & abroad</li>
              <li className="flex items-center gap-2"><Bank size={18} className="text-leaf" /> Pay by bank transfer</li>
            </ul>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-3xl">
              <img src={img("hair-pink")} alt="A woman in a pink top holds a bottle of Superb Naturals Hair Growth Oil above her full, curly natural hair" className="aspect-[4/5] w-full object-cover" />
            </div>
            <div className="absolute -bottom-8 left-2 w-40 -rotate-3 overflow-hidden rounded-2xl bg-white p-2 shadow-card md:-left-14 md:w-48">
              <img src={img("growth-oil-trio")} alt="Three bottles of Superb Naturals Hair Growth Oil" className="aspect-square w-full rounded-2xl object-cover" />
              <p className="px-1 pb-1 pt-2 text-center text-xs font-bold">Hair Growth Oil</p>
            </div>
            <div className="absolute -right-3 top-8 rotate-6 rounded-2xl bg-butter px-4 py-3 text-center shadow-card md:-right-8">
              <p className="font-display text-2xl font-bold leading-none">10+</p>
              <p className="text-[0.7rem] font-bold">active oils</p>
            </div>
          </div>
        </div>
      </section>

      {/* Strip */}
      <div className="overflow-hidden bg-blush py-3 text-white" aria-hidden>
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10 whitespace-nowrap font-display text-lg italic">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Faster, thicker growth", "Stronger edges", "No more itching", "Less breakage", "Softer hair", "Restoring confidence in beauty"].map((t) => <span key={t + k} className="flex items-center gap-10">{t}<span className="h-1.5 w-1.5 rounded-full bg-white/60" /></span>),
          )}
        </div>
      </div>

      {/* Concerns */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <SectionTitle title="What does your hair need?" />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {CONCERNS.map((c, i) => (
            <Link
              key={c.id}
              to={`/shop?concern=${c.id}`}
              className={`group rounded-2xl p-5 transition hover:-translate-y-1 hover:shadow-card ${["bg-leaf-soft", "bg-blush-soft", "bg-mint-soft", "bg-butter-soft", "bg-paper ring-1 ring-ink/10"][i]}`}
            >
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/80 text-leaf-deep"><ConcernIcon id={c.id} /></span>
              <p className="mt-3 font-display text-lg font-semibold leading-tight">{c.label}</p>
              <p className="mt-1 text-sm text-stone">{c.blurb}</p>
              <p className="mt-3 text-sm font-bold text-leaf group-hover:underline">Shop →</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-5 pt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle title="Everything for healthy hair, from wash day to edges." />
          <Link to="/shop" className="btn-ghost">See all</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {products.filter((p) => p.kind !== "Beard" && p.kind !== "Tool" && p.slug !== "anti-dandruff-shampoo" && p.slug !== "moisturizing-conditioner").map((p) => (
            <ProductCard key={p.slug} p={p} />
          ))}
        </div>
      </section>

      {/* Men + tools */}
      <section className="mx-auto mt-10 max-w-6xl px-5">
        <div className="grid gap-4 md:grid-cols-2">
          <Link to="/shop?kind=Beard" className="group flex items-center gap-5 rounded-2xl bg-ink p-4 pr-6 text-white">
            <img src={img("beard-oil")} alt="Superb Naturals Beard Oil bottles" className="h-28 w-28 rounded-3xl object-cover" loading="lazy" />
            <span>
              <span className="label text-butter">For the men</span>
              <span className="mt-1 block font-display text-2xl font-semibold">Beard oil & beard wash</span>
              <span className="mt-1 block text-sm text-white/70 group-hover:text-white">From ₦5,000 →</span>
            </span>
          </Link>
          <Link to="/shop?kind=Tool" className="group flex items-center gap-5 rounded-2xl bg-paper p-4 pr-6 ring-1 ring-ink/10">
            <img src={img("scalp-massager")} alt="Superb Naturals scalp massager" className="h-28 w-28 rounded-3xl object-cover" loading="lazy" />
            <span>
              <span className="label text-blush">Tools</span>
              <span className="mt-1 block font-display text-2xl font-semibold">Scalp massager & dermal roller</span>
              <span className="mt-1 block text-sm text-stone group-hover:text-ink">From ₦4,000 →</span>
            </span>
          </Link>
        </div>
      </section>

      {/* Quiz teaser */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl bg-butter-soft md:grid-cols-[1fr_.8fr]">
          <div className="p-8 md:p-14">
            <h2 className=" font-display text-4xl font-semibold leading-tight md:text-5xl">Not sure where to start?</h2>
            <p className="mt-4 max-w-md text-stone">Three quick questions. Tell us what your hair needs and how you wear it. We'll put together a routine from the Superb Naturals range, in the order you use it.</p>
            <Link to="/routine" className="btn-blush mt-7 !px-7 !py-3.5 text-base">Find my routine</Link>
          </div>
          <img src={img("hair-puff")} alt="Side view of a full natural-hair puff tied with a white bow" className="h-full max-h-[460px] w-full object-cover object-[center_75%]" />
        </div>
      </section>

      {/* Wash day */}
      <section id="wash-day" className="mx-auto max-w-6xl scroll-mt-24 px-5 pt-24">
        <SectionTitle kicker="Wash day" title="Use them in this order" sub="A suggested routine with the full range. Start with a clean scalp and finish with your edges." center />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {routine.map((p) => (
            <li key={p.slug}>
              <Link to={`/shop/${p.slug}`} className="group block h-full rounded-3xl bg-paper p-4 shadow-card ring-1 ring-ink/5 transition hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf font-display text-lg font-bold text-white">{p.step}</span>
                  <span className="label text-leaf">{p.stepLabel}</span>
                </div>
                <img src={img(p.images[0])} alt="" className="mt-4 aspect-square w-full rounded-2xl object-cover" loading="lazy" />
                <p className="mt-3 font-display text-lg font-semibold leading-tight group-hover:text-leaf">{p.name}</p>
                <p className="mt-1 text-sm text-stone">{p.benefits[0]}</p>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* Mini kit */}
      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="grid items-center gap-10 rounded-3xl bg-blush-soft p-6 md:grid-cols-2 md:p-12">
          <img src={img("mini-kit")} alt="The Superb Naturals Mini Kit: shampoo, conditioner and a small oil beside a gift bag" className="w-full rounded-2xl object-cover" />
          <div>
            <p className="label text-blush-deep">Start here</p>
            <h2 className="mt-3 font-display text-4xl font-semibold md:text-5xl">The Mini Kit</h2>
            <p className="mt-3 font-display text-3xl font-semibold text-blush-deep">{naira(kit.price)}</p>
            <ul className="mt-6 space-y-2">
              {kit.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2 font-medium"><Check size={18} strokeWidth={2.4} className="mt-0.5 shrink-0 text-blush-deep" /> {b}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-stone">Inside: {kit.includes!.join(", ").toLowerCase()}.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                className="btn-blush !px-7 !py-3.5 text-base"
                onClick={() => {
                  addToCart("mini-kit");
                  setKitAdded(true);
                  setTimeout(() => setKitAdded(false), 1500);
                }}
              >
                {kitAdded ? "Added to bag ✓" : "Add to bag"}
              </button>
              <Link to="/shop/mini-kit" className="btn-ghost !px-7 !py-3.5 text-base">Details</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="mx-auto max-w-6xl px-5 pt-24">
        <SectionTitle title="Healthy hair. Happy you." sub="Every texture, cared for with raw herbs and active oils." center />
        <div className="mt-10 grid grid-cols-3 gap-3 md:gap-5">
          {[
            ["hair-blowout", "Side view of long, stretched natural hair"],
            ["hair-pink", "Full, curly natural hair with a bottle of growth oil"],
            ["hair-puff", "A full natural-hair puff with a white bow"],
          ].map(([src, alt], i) => (
            <div key={src} className={`overflow-hidden rounded-2xl ${i === 1 ? "md:-translate-y-6" : ""}`}>
              <img src={img(src)} alt={alt} className="aspect-[3/4] w-full object-cover object-top transition duration-700 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl scroll-mt-24 px-5 pt-24">
        <SectionTitle title="Good to know" center />
        <div className="mt-10 space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-paper p-5 ring-1 ring-ink/10 open:ring-leaf/40">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
                {f.q}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-leaf-soft text-leaf transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 leading-relaxed text-stone">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-center text-stone">
          Still wondering?{" "}
          <a className="font-bold text-leaf underline underline-offset-4" href={waLink("Hello Superb Naturals 👋 I have a question.")} target="_blank" rel="noopener noreferrer">
            Ask on WhatsApp
          </a>
        </p>
      </section>
    </>
  );
}
