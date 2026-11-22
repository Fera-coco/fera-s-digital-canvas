import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { bySlug, img, products, routine, toneBg, waLink, naira } from "../data/products";
import { Price, ProductCard, WaIcon } from "../components/ui";
import { addToCart, toggleLove, useStore } from "../lib/store";

export default function Product() {
  const { slug } = useParams();
  const p = bySlug(slug);
  const s = useStore();
  const [i, setI] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  if (!p)
    return (
      <section className="mx-auto max-w-xl px-5 py-24 text-center">
        <h1 className="font-display text-4xl">We couldn't find that product.</h1>
        <Link to="/shop" className="btn-leaf mt-6">Back to the shop</Link>
      </section>
    );
  const loved = s.loved.includes(p.slug);
  const pairs = products.filter((o) => o.slug !== p.slug && o.concerns.some((c) => p.concerns.includes(c))).slice(0, 3);
  const pic = p.images[Math.min(i, p.images.length - 1)];
  return (
    <>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 pt-8 md:grid-cols-2 md:gap-14">
        <div>
          <nav className="mb-4 text-sm text-stone" aria-label="Breadcrumb">
            <Link to="/shop" className="hover:text-ink">Shop</Link> / <span className="text-ink">{p.name}</span>
          </nav>
          <div className={`overflow-hidden rounded-[2rem] ${toneBg[p.tone]}`}>
            <img src={img(pic)} alt={p.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {p.images.map((src, k) => (
                <button key={src} onClick={() => setI(k)} aria-label={`Photo ${k + 1}`} aria-pressed={i === k} className={`overflow-hidden rounded-2xl ring-2 transition ${i === k ? "ring-leaf" : "ring-transparent opacity-70 hover:opacity-100"}`}>
                  <img src={img(src)} alt="" className="h-20 w-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:pt-10">
          <p className="label text-blush">{p.kind === "Kit" ? "Bundle" : p.stepLabel ? `Step ${p.step} · ${p.stepLabel}` : p.kind}</p>
          <h1 className="mt-3 font-display text-5xl font-semibold leading-[1.02] tracking-tight">{p.name}</h1>
          <p className="mt-3 text-lg text-stone">{p.tagline}</p>
          <div className="mt-5">
            <Price p={p} className="text-3xl" />
          </div>

          <ul className="mt-7 space-y-3">
            {p.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 rounded-2xl bg-paper px-4 py-3 ring-1 ring-ink/5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-leaf text-xs text-white">✓</span>
                <span className="font-medium">{b}</span>
              </li>
            ))}
          </ul>
          {p.includes && (
            <p className="mt-5 rounded-2xl bg-blush-soft px-4 py-3 text-sm">
              <span className="font-bold">Inside the kit:</span> {p.includes.join(", ")}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {p.price ? (
              <>
                <div className="flex items-center rounded-full bg-paper ring-1 ring-ink/15">
                  <button className="h-12 w-12 text-xl" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="One less">−</button>
                  <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
                  <button className="h-12 w-12 text-xl" onClick={() => setQty(Math.min(20, qty + 1))} aria-label="One more">+</button>
                </div>
                <button
                  className="btn-leaf !px-8 !py-3.5 text-base"
                  onClick={() => {
                    addToCart(p.slug, qty);
                    setAdded(true);
                    setTimeout(() => setAdded(false), 1500);
                  }}
                >
                  {added ? "Added to bag ✓" : `Add to bag · ${naira(p.price * qty)}`}
                </button>
              </>
            ) : (
              <a className="btn-leaf !px-7 !py-3.5 text-base" href={waLink(`Hello Superb Naturals 👋 I'd like to order the ${p.name}. How much is it?`)} target="_blank" rel="noopener noreferrer">
                <WaIcon /> Order on WhatsApp
              </a>
            )}
            <button onClick={() => toggleLove(p.slug)} aria-pressed={loved} className="btn-ghost !py-3.5">
              {loved ? "💖 Saved" : "🤍 Save"}
            </button>
          </div>
          <p className="mt-4 text-sm text-stone">Pay by bank transfer · Delivery fee confirmed on WhatsApp · For external use only</p>

          {p.step && (
            <div className="mt-10 rounded-3xl bg-leaf-soft p-5">
              <p className="label text-leaf-deep">Where it fits in your routine</p>
              <ol className="mt-4 flex flex-wrap gap-2">
                {routine.map((r) => (
                  <li key={r.slug}>
                    <Link to={`/shop/${r.slug}`} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${r.slug === p.slug ? "bg-leaf text-white" : "bg-white text-ink hover:ring-1 hover:ring-leaf"}`}>
                      <span className="font-display">{r.step}</span> {r.short}
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </section>

      {pairs.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pt-20">
          <h2 className="font-display text-3xl font-semibold">Pairs well with</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {pairs.map((o) => (
              <ProductCard key={o.slug} p={o} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
