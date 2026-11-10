import { useEffect, useMemo, useState } from "react";
import NextRoom from "@/components/exhibition/NextRoom";
import Visitor from "@/components/gallery/Visitor";
import Reveal from "@/components/open-call/Reveal";
import ApplyForm from "@/components/open-call/ApplyForm";
import { backendReady } from "@/lib/supabase";
import { useSeen } from "@/hooks/use-seen";
import {
  APPLY_EMAIL,
  applyByEmail,
  applyByWhatsApp,
  isTaken,
  STAGES,
  summarise,
  TOTAL_SPOTS,
  useOpenCall,
  WHATSAPP_DISPLAY,
  type OpenCallData,
  type Spot,
} from "@/content/openCall";
import { getVisitor, loadVisitor, type VisitorType } from "@/content/visitors";
import { usePageMeta } from "@/hooks/use-exhibition";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

const onUs = ["Website design", "Website development", "Responsive layouts for mobile and desktop", "A professional online presence built around your needs"];
const yours = ["Domain registration", "Website hosting", "Your business information, content and images", "Any agreed paid third-party services"];
const ideal = ["Small business owners", "Fashion and beauty", "Retail", "Service providers", "Food and hospitality", "Growing brands"];
const steps = [
  "Discover the Open Call.",
  "Apply by email or WhatsApp.",
  "Fera's Studio reviews your business and requirements.",
  "Selected businesses receive confirmation and an onboarding message.",
  "Website design and development begin.",
  "Follow your website's progress here.",
  "Review the finished website and prepare for launch.",
];
const conditions = [
  "Only five businesses will be selected.",
  "Applications are open to businesses in Nigeria and Benin Republic.",
  "Website design and development fees are waived.",
  "Domain and hosting costs are paid by the business.",
  "The focus is standard business websites, service websites and product catalogues.",
  "Advanced features (complex ecommerce, custom integrations, inventory systems) may need a separate agreement.",
  "You'll need to provide your business information and content.",
  "Timelines depend on quick communication and delivery of materials.",
  "Revisions and final scope are agreed before development starts.",
  "Maintenance after launch isn't automatically included.",
  "In return, Fera's Studio will feature the finished website in its portfolio and on this page: business name, screenshots and link.",
  "Confidential materials (private documents, internal data) are never shown.",
];

const headline: { w: string; i?: boolean }[] = [
  { w: "Five" },
  { w: "businesses." },
  { w: "Five" },
  { w: "websites." },
  { w: "One", i: true },
  { w: "creative", i: true },
  { w: "opportunity.", i: true },
];

/* ------------------------------------------------------------------ */

const OpenCallPage = () => {
  usePageMeta(
    "The Open Call: five free websites | Fera's Studio",
    "A special Fera's Studio initiative: five businesses in Nigeria and Benin Republic receive a professionally designed and developed website with no development fee. Apply by email or WhatsApp.",
    "/open-call",
  );
  const state = useOpenCall();
  const data = state.status === "ready" ? state.data : null;
  const sum = data ? summarise(data) : null;
  // the visitor picked at the ticket desk guides you through the process
  const guide = useMemo(() => getVisitor(loadVisitor() ?? "client"), []);

  return (
    <main id="main" className="flex min-h-[100svh] flex-col overflow-x-hidden">
      {/* ---------- A. The invitation ---------- */}
      <section aria-labelledby="oc-title" className="relative pt-[var(--header-h)]">
        <div className="gallery-x grid grid-cols-1 gap-12 pb-20 pt-12 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:items-center lg:pb-24 lg:pt-12">
          <div className="lg:col-span-7">
            <p className="label rise flex flex-wrap items-center gap-x-3 gap-y-1 text-stone">
              <span className="oc-nav-dot relative inline-flex h-2 w-2 rounded-full bg-coral" aria-hidden />
              Fera's Studio presents <span aria-hidden>·</span> A special open call
            </p>
            <h1 id="oc-title" className="display mt-6 text-[clamp(3rem,7.2vw,7rem)]">
              {headline.map((h, k) => (
                <span key={k} className="rise inline-block" style={{ "--delay": `${80 + k * 90}ms` } as React.CSSProperties}>
                  {h.i ? <em className="italic">{h.w}</em> : h.w}
                  {k < headline.length - 1 ? " " : ""}
                </span>
              ))}
            </h1>
            <p className="rise mt-8 max-w-2xl text-lg leading-relaxed text-ink/85 md:text-xl" style={{ "--delay": "760ms" } as React.CSSProperties}>
              We're opening five spots for businesses ready to build their online presence. Through this special Fera's
              Studio initiative, five selected businesses will receive a professionally designed and developed website
              without paying development fees.
            </p>
            <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ "--delay": "860ms" } as React.CSSProperties}>
              <a href="#apply" className="btn-ink group">
                Apply for a spot <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
              <a href="#spots" className="btn-line">
                See available spots
              </a>
            </div>
          </div>

          {/* The special-exhibition notice board: a hung ticket, the five spots, and a curious visitor */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md pb-6 pt-10 lg:max-w-none lg:pl-10">
              <span aria-hidden className="absolute left-1/2 top-0 h-10 w-px -translate-x-1/2 bg-ink/40 lg:left-[calc(50%+1.25rem)]" />
              <span aria-hidden className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral ring-2 ring-cream lg:left-[calc(50%+1.25rem)]" />
              <Reveal kind="swing" delay={500}>
                <div className="oc-sway" style={{ "--bob-delay": "2s" } as React.CSSProperties}>
                  <div className="relative">
                    <div className="ticket bg-paper p-7 md:p-9">
                      <p className="label text-stone">Special exhibition · Nigeria &amp; Benin</p>
                      <p className="display mt-3 text-[clamp(3rem,5vw,4.4rem)]">The Open Call</p>
                      <p className="mt-2 text-sm text-stone">A Fera's Studio initiative for growing businesses.</p>
                      <div className="my-5 border-t-2 border-dashed border-ink/20" />
                      <dl className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <dt className="label text-stone">Admits</dt>
                          <dd className="mt-1 font-serif text-3xl">Five</dd>
                        </div>
                        <div>
                          <dt className="label text-stone">Dev fee</dt>
                          <dd className="mt-1 font-serif text-3xl">Waived</dd>
                        </div>
                        <div>
                          <dt className="label text-stone">Status</dt>
                          <dd className="mt-1 font-serif text-3xl">{sum ? (sum.open ? "Open" : "Closed") : "…"}</dd>
                        </div>
                      </dl>
                      <div className="mt-6 border-t-2 border-dashed border-ink/20 pt-5">
                        <p className="label text-stone">{sum ? `${pad(sum.remaining)} of ${pad(TOTAL_SPOTS)} spots left` : "Checking the spots…"}</p>
                        <ol className="mt-3 flex gap-2" aria-hidden>
                          {(data?.spots ?? Array.from({ length: TOTAL_SPOTS }, () => null)).map((sp, k) => {
                            const t = sp ? isTaken(sp.stage) : false;
                            return (
                              <Reveal as="li" kind="pop" delay={1100 + k * 120} key={k} className={cn("flex h-11 flex-1 items-center justify-center rounded-sm font-mono text-xs", t ? "bg-ink text-cream" : "bg-mint/60 text-mint-ink")}>
                                {pad(k + 1)}
                              </Reveal>
                            );
                          })}
                        </ol>
                      </div>
                    </div>
                    <span aria-hidden className="absolute -right-3 -top-4">
                      <Reveal as="span" kind="stamp" delay={1500} className="block rounded-md border-2 border-coral bg-cream px-3 py-1 font-mono text-xs uppercase tracking-widest text-coral-ink" style={{ "--stamp-rot": "14deg" } as React.CSSProperties}>
                        Limited
                      </Reveal>
                    </span>
                  </div>
                </div>
              </Reveal>
              {/* a visitor stops to read the notice */}
              <Reveal kind="pop" delay={1900} className="absolute -bottom-6 -left-4 hidden sm:block lg:-left-8" aria-hidden>
                <div className="relative">
                  <span className="absolute -top-12 right-6 whitespace-nowrap rounded-2xl rounded-br-sm border-2 border-ink bg-paper px-3 py-1.5 font-serif text-lg italic">Only five?!</span>
                  <div className="oc-bob">
                    <Visitor v={guide} className="h-36 w-auto" />
                  </div>
                </div>
              </Reveal>
              <Sparkle className="-right-2 top-24 h-5 w-5 text-butter" delay="0s" />
              <Sparkle className="-right-4 bottom-10 h-4 w-4 text-lavender" delay="0.8s" />
              <Sparkle className="left-1/2 -bottom-4 h-3 w-3 text-coral" delay="1.4s" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- B. The five spots ---------- */}
      <section id="spots" aria-labelledby="spots-title" className="scroll-mt-[var(--header-h)] bg-wall/60 py-20 md:py-28">
        <div className="gallery-x">
          <SectionHead no="01" id="spots-title" title="The five spots" />
          <Availability state={state.status} data={data} />
        </div>
      </section>

      {/* ---------- C. What's included ---------- */}
      <section aria-labelledby="incl-title" className="py-20 md:py-28">
        <div className="gallery-x">
          <SectionHead no="02" id="incl-title" title="What's included" intro="The design and build are on us. Running the website is on you, so nobody is surprised later." />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <Reveal kind="left">
              <OfferCard tone="bg-mint" mark="✓" label="On us" note="Development fee waived" items={onUs} />
            </Reveal>
            <Reveal kind="right" delay={150}>
              <OfferCard tone="bg-blush" mark="→" label="Your responsibility" note="Paid by the business" items={yours} />
            </Reveal>
          </div>
          <Reveal as="p" delay={300} className="mt-6 max-w-3xl text-sm leading-relaxed text-stone">
            The Open Call is for standard business websites, service websites and product catalogues. Complex ecommerce,
            extensive custom integrations and inventory systems aren't automatically included, but can be discussed
            separately.
          </Reveal>
        </div>
      </section>

      {/* ---------- D. Who can apply ---------- */}
      <section aria-labelledby="who-title" className="py-20 md:py-28">
        <div className="gallery-x grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead no="03" id="who-title" title="Who can apply?" />
            <p className="sr-only">Businesses in Nigeria and businesses in Benin Republic.</p>
            <div className="mt-8 flex flex-wrap items-center gap-5" aria-hidden>
              <Reveal kind="stamp" delay={150} className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-[3px] border-mint-ink bg-mint/50 text-center text-mint-ink" style={{ "--stamp-rot": "-8deg" } as React.CSSProperties}>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em]">Businesses in</span>
                <span className="font-serif text-3xl leading-none">Nigeria</span>
                <span className="mt-1 font-mono text-[0.6rem]">★ ★ ★</span>
              </Reveal>
              <Reveal kind="stamp" delay={450} className="flex h-40 w-40 flex-col items-center justify-center rounded-full border-[3px] border-coral-ink bg-coral-soft/60 text-center text-coral-ink" style={{ "--stamp-rot": "7deg" } as React.CSSProperties}>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em]">Businesses in</span>
                <span className="font-serif text-[1.65rem] leading-none">Benin Republic</span>
                <span className="mt-1 font-mono text-[0.6rem]">★ ★ ★</span>
              </Reveal>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
            <p className="label text-stone">Ideal applicants</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {ideal.map((x, i) => (
                <Reveal
                  as="li"
                  kind="pop"
                  delay={200 + i * 90}
                  key={x}
                  className={cn("rounded-full px-4 py-2 text-sm", ["bg-butter", "bg-blush", "bg-lavender", "bg-mint", "bg-coral-soft", "bg-butter-soft"][i % 6])}
                >
                  {x}
                </Reveal>
              ))}
            </ul>
            <Reveal as="p" delay={500} className="mt-6 leading-relaxed text-ink/85">
              Applications are reviewed one by one. Fera's Studio selects businesses based on their needs, how well the
              project fits and the scope of work required.
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- E. How it works ---------- */}
      <section aria-labelledby="how-title" className="bg-wall/60 py-20 md:py-28">
        <div className="gallery-x">
          <SectionHead no="04" id="how-title" title="How it works" intro="Applying doesn't automatically guarantee a spot. A spot is only yours once Fera's Studio confirms it." />
          <Journey guide={guide} />
        </div>
      </section>

      {/* ---------- F. The making of the five ---------- */}
      <section aria-labelledby="five-title" className="py-20 md:py-28">
        <div className="gallery-x">
          <SectionHead no="05" id="five-title" title="The making of the five" intro="Follow each website from confirmation to launch. Only details a business has agreed to share appear here." />
          {data ? (
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {data.spots.map((s, i) => (
                <ProjectCard key={s.number} s={s} i={i} />
              ))}
            </ol>
          ) : (
            <StatusNote state={state.status} />
          )}
        </div>
      </section>

      {/* ---------- G. The conditions ---------- */}
      <section aria-labelledby="cond-title" className="bg-wall/60 py-20 md:py-28">
        <div className="gallery-x grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead no="06" id="cond-title" title="The small print" />
            <Reveal as="p" delay={150} className="mt-4 text-stone">
              Friendly, not legal. Read it before you apply.
            </Reveal>
          </div>
          <ol className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:col-span-8">
            {conditions.map((c, i) => (
              <Reveal as="li" kind="rise" delay={(i % 2) * 80 + Math.floor(i / 2) * 60} key={c} className="flex gap-4 border-b border-ink/10 pb-4">
                <span className="font-mono text-xs leading-6 text-stone">{pad(i + 1)}</span>
                <span className="leading-relaxed">{c}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- H. Apply ---------- */}
      <section id="apply" aria-labelledby="apply-title" className="scroll-mt-[var(--header-h)] py-20 md:py-28">
        <div className="gallery-x">
          <div className="flex items-end justify-between gap-6">
            <SectionHead no="07" id="apply-title" title="Apply for a spot" />
            <Reveal kind="pop" delay={200} className="hidden shrink-0 sm:block" aria-hidden>
              <div className="oc-bob">
                <Visitor v={guide} className="h-32 w-auto md:h-40" />
              </div>
            </Reveal>
          </div>
          {sum && !sum.open ? (
            <div className="mt-10 max-w-2xl bg-paper p-8">
              <p className="display text-4xl">Applications are closed.</p>
              <p className="mt-3 leading-relaxed text-ink/85">
                All five spots have been taken. Follow the five websites above as they're built, or{" "}
                <a href={`mailto:${APPLY_EMAIL}`} className="underline underline-offset-4">
                  write to Fera's Studio
                </a>{" "}
                about a paid project.
              </p>
            </div>
          ) : (
            backendReady ? (
              <>
                <Reveal as="p" delay={100} className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/85">
                  Fill in your application card below. It goes straight to Fera's Studio, and we'll reach you on the email
                  or number you give us.
                </Reveal>
                <Reveal kind="rise" delay={200}>
                  <ApplyForm />
                </Reveal>
              </>
            ) : (
            <>
              <Reveal as="p" delay={100} className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/85">
                Pick whichever is easier. Both open a message with the questions already filled in, so you just add your
                answers and send.
              </Reveal>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <Reveal kind="left" delay={150}>
                  <ApplyCard
                    tone="bg-lavender"
                    label="Option 01"
                    title="Apply by email"
                    detail={APPLY_EMAIL}
                    href={applyByEmail}
                    cta="Open an email draft"
                    note="Opens your email app with the subject and questions filled in."
                    art={<Envelope />}
                  />
                </Reveal>
                <Reveal kind="right" delay={300}>
                  <ApplyCard
                    tone="bg-mint"
                    label="Option 02"
                    title="Apply on WhatsApp"
                    detail={WHATSAPP_DISPLAY}
                    href={applyByWhatsApp}
                    cta="Open WhatsApp chat"
                    note="Opens a WhatsApp chat with Fera and a ready-to-send message."
                    external
                    art={<ChatBubble />}
                  />
                </Reveal>
              </div>
              <Reveal as="p" delay={450} className="mt-6 max-w-3xl rounded-sm border-l-4 border-coral bg-paper p-4 text-sm leading-relaxed">
                <strong className="font-semibold">Applications are subject to review and confirmation.</strong> Sending a
                message doesn't reserve a spot. Fera's Studio will reply after reviewing your business, and the counter
                above changes only when a business is confirmed.
              </Reveal>
            </>
            )
          )}
        </div>
      </section>

      <NextRoom from="studio" />
    </main>
  );
};

/* ------------------------------------------------------------------ */

const Sparkle = ({ className, delay }: { className: string; delay: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden className={cn("oc-twinkle pointer-events-none absolute", className)} style={{ "--bob-delay": delay } as React.CSSProperties}>
    <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0Z" fill="currentColor" />
  </svg>
);

const SectionHead = ({ no, id, title, intro }: { no: string; id: string; title: string; intro?: string }) => (
  <div>
    <Reveal as="p" kind="rise" className="label text-stone">
      The Open Call · {no}
    </Reveal>
    <Reveal as="h2" kind="rise" delay={80} id={id} className="display mt-3 text-[clamp(2.6rem,6vw,5rem)]">
      {title}
    </Reveal>
    {intro && (
      <Reveal as="p" kind="rise" delay={160} className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/85">
        {intro}
      </Reveal>
    )}
  </div>
);

const StatusNote = ({ state }: { state: "loading" | "error" | "ready" }) =>
  state === "error" ? (
    <p className="mt-10 max-w-xl bg-paper p-5 leading-relaxed">
      Live availability couldn't be loaded right now. You can still apply below, and Fera's Studio will tell you if a spot
      is open.
    </p>
  ) : (
    <p className="label mt-10 animate-pulse text-stone" role="status">
      Checking the spots…
    </p>
  );

/* Counts up to the number of remaining spots once the counter is on screen. */
const useCountTo = (to: number, run: boolean) => {
  const [n, setN] = useState(to);
  useEffect(() => {
    if (!run) return;
    if (!document.documentElement.classList.contains("motion-ok") || to === 0) return setN(to);
    setN(0);
    let k = 0;
    const t = window.setInterval(() => {
      k += 1;
      setN(k);
      if (k >= to) window.clearInterval(t);
    }, 160);
    return () => window.clearInterval(t);
  }, [to, run]);
  return n;
};

const Availability = ({ state, data }: { state: "loading" | "error" | "ready"; data: OpenCallData | null }) => {
  const [ref, seen] = useSeen<HTMLDivElement>(0.3);
  const remaining = data ? summarise(data).remaining : 0;
  const shown = useCountTo(remaining, seen && !!data);
  return (
    <div ref={ref} className="mt-10 min-h-[4rem]">
      {!data ? (
        <StatusNote state={state} />
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <p className="font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-none">
              <span className="sr-only" aria-live="polite">
                {pad(remaining)} of {pad(TOTAL_SPOTS)} spots available
              </span>
              <span aria-hidden>
                <span className="inline-block min-w-[1.1em] italic tabular-nums">{pad(shown)}</span> of {pad(TOTAL_SPOTS)}{" "}
                <span className="text-stone">spots available</span>
              </span>
            </p>
            <Reveal
              as="span"
              kind="stamp"
              delay={1100}
              className={cn("rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest", summarise(data).open ? "bg-mint text-mint-ink" : "bg-ink text-cream")}
              style={{ "--stamp-rot": "0deg" } as React.CSSProperties}
            >
              Applications {summarise(data).open ? "open" : "closed"}
            </Reveal>
          </div>

          {/* the rail the tickets hang from */}
          <div className="relative mt-12">
            <div aria-hidden className="absolute inset-x-0 top-0 h-[3px] rounded-full bg-ink/15" />
            <ol className="grid grid-cols-2 gap-x-4 gap-y-12 pt-8 sm:grid-cols-3 lg:grid-cols-5" aria-label="The five spots">
              {data.spots.map((s, i) => {
                const taken = isTaken(s.stage);
                return (
                  <li key={s.number} className="relative">
                    <span aria-hidden className="absolute -top-8 left-1/2 h-8 w-px -translate-x-1/2 bg-ink/30" />
                    <Reveal kind="drop" delay={200 + i * 160}>
                      <div className={cn(!taken && "oc-sway")} style={{ "--bob-delay": `${i * 0.6}s` } as React.CSSProperties}>
                        <div
                          className={cn("ticket relative flex aspect-[4/5] flex-col justify-between p-5", taken ? "bg-ink text-cream" : "bg-paper")}
                          style={{ transform: `rotate(${[-1.5, 1, -0.5, 1.5, -1][i]}deg)` }}
                        >
                          <span className={cn("label", taken ? "text-cream/60" : "text-stone")}>Spot</span>
                          <span className="display text-[4.5rem]">{s.number}</span>
                          <span className={cn("label", taken ? "text-cream/80" : "text-mint-ink")}>{taken ? "Taken" : "Available"}</span>
                          {taken && (
                            <span aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2">
                              <Reveal as="span" kind="stamp" delay={900 + i * 160} className="block rounded-md border-2 border-coral px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-coral" style={{ "--stamp-rot": "-14deg" } as React.CSSProperties}>
                                Confirmed
                              </Reveal>
                            </span>
                          )}
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>
          </div>
        </>
      )}
    </div>
  );
};

const OfferCard = ({ tone, mark, label, note, items }: { tone: string; mark: string; label: string; note: string; items: string[] }) => (
  <div className="frame h-full p-0">
    <div className={cn("flex items-baseline justify-between gap-3 px-6 py-4", tone)}>
      <p className="display text-3xl">{label}</p>
      <p className="label">{note}</p>
    </div>
    <ul className="divide-y divide-ink/10 px-6 py-2">
      {items.map((x, i) => (
        <li key={x} className="flex items-center gap-3 py-3 leading-relaxed">
          <Reveal as="span" kind="pop" delay={450 + i * 140} aria-hidden className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs", tone)}>
            {mark}
          </Reveal>
          {x}
        </li>
      ))}
    </ul>
  </div>
);

/* A visitor walks the seven steps, lighting each one up as they arrive. */
const Journey = ({ guide }: { guide: VisitorType }) => {
  const [ref, seen] = useSeen<HTMLDivElement>(0.35);
  const [at, setAt] = useState(-1);
  useEffect(() => {
    if (!seen) return;
    if (!document.documentElement.classList.contains("motion-ok")) return setAt(steps.length - 1);
    let k = -1;
    const t = window.setInterval(() => {
      k += 1;
      setAt(k);
      if (k >= steps.length - 1) window.clearInterval(t);
    }, 750);
    return () => window.clearInterval(t);
  }, [seen]);
  const walking = seen && at < steps.length - 1;
  const pos = `${(Math.max(0, at) + 0.5) * (100 / steps.length)}%`;

  return (
    <div ref={ref} className="mt-12">
      {/* the walker (wide screens) */}
      <div aria-hidden className="relative hidden h-36 lg:block">
        <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-ink/10" />
        <div className="absolute bottom-0 left-0 h-[3px] rounded-full bg-ink transition-[width] duration-700 ease-linear" style={{ width: pos, opacity: at >= 0 ? 1 : 0 }} />
        <div className="oc-walker absolute bottom-0 -translate-x-1/2" style={{ left: pos }}>
          <Visitor v={guide} walking={walking} className="h-32 w-auto" />
          {at === steps.length - 1 && (
            <span className="oc-reveal oc-pop is-seen absolute -right-12 -top-2 rounded-full bg-ink px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-cream">Launch!</span>
          )}
        </div>
      </div>
      <ol className="grid gap-x-6 gap-y-6 sm:grid-cols-2 lg:mt-5 lg:grid-cols-7">
        {steps.map((s, i) => {
          const lit = i <= at;
          return (
            <li key={s} className={cn("relative pt-4 transition-colors duration-500", lit ? "text-ink" : "text-ink/45")}>
              <span className={cn("oc-step-dot mb-3 flex h-8 w-8 items-center justify-center rounded-full font-mono text-xs", lit ? "scale-110 bg-ink text-cream" : "scale-90 bg-ink/10 text-stone")}>
                {pad(i + 1)}
              </span>
              <p className="leading-snug">{s}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const ProjectCard = ({ s, i }: { s: Spot; i: number }) => {
  const taken = isTaken(s.stage);
  const show = taken && s.shareDetails;
  const progress = STAGES.indexOf(s.stage);
  const total = STAGES.length - STAGES.indexOf("Confirmed"); // confirmed → launched
  const doneSteps = taken ? progress - STAGES.indexOf("Confirmed") + 1 : 0;
  return (
    <Reveal as="li" kind="flip" delay={i * 140} className={cn("flex flex-col border-t-2 pt-4", taken ? "border-ink" : "border-ink/20")}>
      <p className="label flex items-center justify-between text-stone">
        <span>Project {s.number}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem]", taken ? "bg-lavender text-ink" : "bg-mint-soft text-mint-ink")}>{s.stage}</span>
      </p>
      <div className={cn("relative mt-4 flex aspect-[4/3] items-center justify-center overflow-hidden", show && s.image ? "bg-wall" : "border-2 border-dashed border-ink/15")}>
        {show && s.image ? (
          <img src={s.image} alt={`Preview of the ${s.business} website`} loading="lazy" className="h-full w-full object-cover" />
        ) : taken ? (
          <span className="px-4 text-center font-serif text-xl italic text-stone">Preview coming soon</span>
        ) : (
          /* a little "reserved" tag swinging on a nail */
          <span className="flex flex-col items-center" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-ink/40" />
            <span className="oc-sway flex flex-col items-center" style={{ "--bob-delay": `${i * 0.5}s` } as React.CSSProperties}>
              <span className="h-5 w-px bg-ink/30" />
              <span className="rounded-sm bg-butter px-3 py-1.5 font-serif text-lg italic">Reserved for you?</span>
            </span>
          </span>
        )}
      </div>
      <p className="mt-4 font-serif text-2xl leading-tight">{show ? s.business : taken ? "A confirmed business" : "Open spot"}</p>
      <p className="mt-1 text-sm text-stone">
        {show ? [s.category, s.country].filter(Boolean).join(" · ") : taken ? "Details shared once approved" : "Apply to claim it"}
      </p>
      {taken && (
        <div className="mt-4" aria-label={`Progress: ${s.stage}`}>
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: total }, (_, k) => (
              <span key={k} className={cn("h-1.5 flex-1 rounded-full", k < doneSteps ? "bg-ink" : "bg-ink/15")} />
            ))}
          </div>
        </div>
      )}
      {show && s.note && <p className="mt-3 text-sm leading-relaxed text-ink/85">{s.note}</p>}
      {show && s.url && (
        <a href={s.url} target="_blank" rel="noopener noreferrer" className="mt-3 text-sm font-medium underline underline-offset-4">
          Visit the website ↗
        </a>
      )}
    </Reveal>
  );
};

const Envelope = () => (
  <svg viewBox="0 0 120 90" className="oc-envelope h-16 w-auto overflow-visible md:h-20" aria-hidden>
    {/* the opened flap sits behind the letter */}
    <path className="flap-open" d="M6 30 L60 -2 L114 30 Z" fill="#EFEADD" stroke="#282624" strokeWidth="3" strokeLinejoin="round" />
    <g className="letter">
      <rect x="18" y="14" width="84" height="56" rx="3" fill="#FFFDF8" stroke="#282624" strokeWidth="3" />
      <path d="M30 30 h50 M30 40 h40 M30 50 h46" stroke="#C5B8F1" strokeWidth="4" strokeLinecap="round" />
    </g>
    <path d="M6 30 L60 64 L114 30 V84 H6 Z" fill="#F7F4EC" stroke="#282624" strokeWidth="3" strokeLinejoin="round" />
    <path className="flap" d="M6 30 L60 64 L114 30 Z" fill="#EFEADD" stroke="#282624" strokeWidth="3" strokeLinejoin="round" />
    <circle className="flap" cx="60" cy="62" r="7" fill="#F28B79" stroke="#282624" strokeWidth="2.5" />
  </svg>
);

const ChatBubble = () => (
  <span className="relative inline-flex h-14 items-center rounded-[22px] rounded-bl-md border-[3px] border-ink bg-paper px-5 md:h-16" aria-hidden>
    <span className="oc-dots flex gap-1.5 text-3xl leading-none">
      <span>•</span>
      <span>•</span>
      <span>•</span>
    </span>
  </span>
);

const ApplyCard = ({
  tone,
  label,
  title,
  detail,
  href,
  cta,
  note,
  external,
  art,
}: {
  tone: string;
  label: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
  note: string;
  external?: boolean;
  art: React.ReactNode;
}) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={cn("group flex h-full flex-col p-7 transition-transform duration-500 ease-gallery hover:-translate-y-1.5 hover:rotate-[-0.5deg] md:p-9", tone)}
  >
    <div className="flex items-start justify-between gap-4">
      <p className="label">{label}</p>
      <span className="transition-transform duration-500 ease-gallery group-hover:-rotate-6 group-hover:scale-105">{art}</span>
    </div>
    <p className="display mt-3 text-[clamp(2.4rem,4.4vw,3.6rem)]">{title}</p>
    <p className="mt-2 font-mono text-sm">{detail}</p>
    <p className="mt-4 text-sm leading-relaxed text-ink/80">{note}</p>
    <span className="mt-8 inline-flex items-center gap-3 self-start rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream">
      {cta} <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">{external ? "↗" : "→"}</span>
      {external && <span className="sr-only"> (opens in a new tab)</span>}
    </span>
  </a>
);

export default OpenCallPage;
