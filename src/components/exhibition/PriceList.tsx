import { useEffect, useState } from "react";
import { formatPrice, howItWorks, priceGroups, terms, type Currency, type PriceItem } from "@/content/pricing";
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from "@/content/openCall";
import { mailto, site } from "@/content/site";
import { cn } from "@/lib/utils";

const STORE = "feras-studio-currency";

/* Visitors in Benin (or reading in French) see CFA first; everyone else sees naira. They can switch. */
const initialCurrency = (): Currency => {
  try {
    const saved = localStorage.getItem(STORE);
    if (saved === "NGN" || saved === "XOF") return saved;
  } catch {
    /* storage unavailable */
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz === "Africa/Porto-Novo" || navigator.language.toLowerCase().startsWith("fr")) return "XOF";
  } catch {
    /* ignore */
  }
  return "NGN";
};

const whatsapp = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

const Price = ({ item, currency }: { item: PriceItem; currency: Currency }) => {
  const p = formatPrice(item, currency);
  return (
    <span className="tabular-nums shrink-0 whitespace-nowrap text-right">
      {p.lead && <span className="mr-1 text-sm text-stone">{p.lead}</span>}
      <span className="font-serif text-[1.55rem] leading-none">{p.amount}</span>
      {p.per && <span className="ml-1 text-sm text-stone">{p.per}</span>}
    </span>
  );
};

const Row = ({ item, currency }: { item: PriceItem; currency: Currency }) => {
  const p = formatPrice(item, currency);
  const ask = whatsapp(`Hi Fera, I'm interested in "${item.name}" (${[p.lead, p.amount, p.per].filter(Boolean).join(" ")}). Here's a bit about my business:\n`);
  return (
    <li className="group py-4">
      <div className="flex items-baseline gap-3">
        <h4 className="text-[1.05rem] font-medium">{item.name}</h4>
        <span aria-hidden className="mb-1 min-w-6 flex-1 border-b border-dotted border-ink/30" />
        <Price item={item} currency={currency} />
      </div>
      <div className="mt-1.5 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <p className="max-w-xl text-sm leading-relaxed text-stone">{item.includes}</p>
        <a
          href={ask}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-ink"
          aria-label={`Ask about ${item.name} on WhatsApp`}
        >
          <span className="link-underline">Ask about this</span>
          <span aria-hidden>↗</span>
        </a>
      </div>
    </li>
  );
};

const PriceList = () => {
  const [currency, setCurrency] = useState<Currency>("NGN");
  useEffect(() => setCurrency(initialCurrency()), []);
  const choose = (c: Currency) => {
    setCurrency(c);
    try {
      localStorage.setItem(STORE, c);
    } catch {
      /* storage unavailable */
    }
  };

  return (
    <section id="prices" aria-labelledby="prices-title" className="scroll-mt-[calc(var(--header-h)+1rem)] bg-wall/60 py-20 md:py-28">
      <div className="gallery-x">
        <header className="grid gap-8 lg:grid-cols-12 lg:items-end" data-reveal>
          <div className="lg:col-span-7">
            <p className="label text-stone">Services & prices</p>
            <h2 id="prices-title" className="display mt-4 text-[clamp(3rem,7vw,5.75rem)]">
              The price list
            </h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/85">
              Introductory guide prices for businesses in Nigeria and Benin. Your final quote depends on the scope, how ready your
              content is and any technical requirements.
            </p>
          </div>
          <div className="lg:col-span-5 lg:justify-self-end">
            <p id="currency-label" className="label mb-2 text-stone">
              Show prices in
            </p>
            <div role="group" aria-labelledby="currency-label" className="inline-flex rounded-full border border-ink/70 bg-paper p-1">
              {(
                [
                  ["NGN", "₦ Naira"],
                  ["XOF", "CFA franc"],
                ] as const
              ).map(([c, label]) => (
                <button
                  key={c}
                  type="button"
                  aria-pressed={currency === c}
                  onClick={() => choose(c)}
                  className={cn(
                    "rounded-full px-5 py-2 text-sm transition-colors duration-300",
                    currency === c ? "bg-ink text-cream" : "text-ink hover:bg-ink/5",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* jump to a section */}
        <nav aria-label="Price list sections" className="mt-10 flex flex-wrap gap-2" data-reveal>
          {priceGroups.map((g) => (
            <a key={g.id} href={`#price-${g.id}`} className="inline-flex items-center gap-2 rounded-full border border-ink/25 bg-paper px-4 py-2 text-sm hover:border-ink">
              <span aria-hidden className={cn("h-2 w-2 rounded-full", g.tone)} />
              {g.verb}
            </a>
          ))}
        </nav>

        <div className="mt-12 space-y-6">
          {priceGroups.map((g) => (
            <article
              key={g.id}
              id={`price-${g.id}`}
              aria-labelledby={`price-${g.id}-title`}
              className="scroll-mt-[calc(var(--header-h)+1.5rem)] rounded-sm bg-paper p-6 shadow-[0_1px_0_rgba(40,38,36,0.08),0_18px_40px_-28px_rgba(40,38,36,0.35)] md:p-10"
              data-reveal
            >
              <div className="grid gap-8 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className={cn("inline-flex h-11 w-11 items-center justify-center rounded-full font-mono text-sm", g.tone)}>
                      {g.no}
                    </span>
                    <p className="label text-ink">{g.verb}</p>
                  </div>
                  <h3 id={`price-${g.id}-title`} className="mt-5 font-serif text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.04]">
                    {g.title}
                  </h3>
                  <p className="mt-3 max-w-sm leading-relaxed text-ink/80">{g.for}</p>
                </div>

                <div className="lg:col-span-8">
                  <ul className="divide-y divide-ink/10 border-y border-ink/10">
                    {g.items.map((it) => (
                      <Row key={it.name} item={it} currency={currency} />
                    ))}
                  </ul>

                  {g.extras && (
                    <div className="mt-8">
                      <p className="label text-stone">{g.extras.title}</p>
                      <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
                        {g.extras.items.map((it) => (
                          <Row key={it.name} item={it} currency={currency} />
                        ))}
                      </ul>
                    </div>
                  )}

                  {g.notes.length > 0 && (
                    <div className="mt-6 space-y-2 text-sm leading-relaxed text-stone">
                      {g.notes.map((n) => (
                        <p key={n}>{n}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* how it works */}
        <div className="mt-20" data-reveal>
          <h3 className="font-serif text-[clamp(2rem,3.6vw,3rem)] leading-none">How working together works</h3>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {howItWorks.map((s, i) => (
              <li key={s.title} className="rounded-sm border border-ink/15 bg-paper p-5">
                <span className="tabular-nums font-mono text-xs text-stone">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 font-medium">{s.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-stone">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* the small print */}
        <details className="group mt-10 rounded-sm border border-ink/15 bg-paper" data-reveal>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium md:p-6">
            Important terms
            <span aria-hidden className="text-xl transition-transform duration-300 group-open:rotate-45">
              +
            </span>
          </summary>
          <ul className="space-y-2 px-5 pb-6 text-sm leading-relaxed text-ink/85 md:px-6">
            <li className="flex gap-2">
              <span aria-hidden className="text-stone">·</span>A 60% deposit is required before work begins; the remaining 40% is due before final handover.
            </li>
            {terms.map((t) => (
              <li key={t} className="flex gap-2">
                <span aria-hidden className="text-stone">·</span>
                {t}
              </li>
            ))}
          </ul>
        </details>

        {/* ask */}
        <div className="mt-14 flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between" data-reveal>
          <p className="max-w-lg font-serif text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.08]">Not sure which one fits? Tell Fera what you need.</p>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsapp("Hi Fera, I'd like a quote. Here's what my business needs:\n")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-coral px-6 py-3 font-medium text-ink transition-transform duration-300 ease-gallery hover:-translate-y-0.5"
            >
              WhatsApp {WHATSAPP_DISPLAY}
            </a>
            <a
              href={mailto("Quote request", "Hi Fera,\n\nI'd like a quote. Here's what my business needs:\n")}
              className="inline-flex items-center gap-2 rounded-full border border-ink/70 px-6 py-3 font-medium"
            >
              Email {site.email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceList;
