import NextRoom from "@/components/exhibition/NextRoom";
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
  "Fera's Studio will ask your permission before showcasing your website or any confidential materials.",
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

  return (
    <main id="main" className="flex min-h-[100svh] flex-col">
      {/* ---------- A. The invitation ---------- */}
      <section aria-labelledby="oc-title" className="relative overflow-hidden pt-[var(--header-h)]">
        <div className="gallery-x grid grid-cols-1 gap-12 pb-20 pt-12 lg:grid-cols-12 lg:items-end lg:pb-28 lg:pt-20">
          <div className="lg:col-span-8">
            <p className="label rise flex flex-wrap items-center gap-x-3 gap-y-1 text-stone">
              <span className="inline-block h-2 w-2 rounded-full bg-coral" aria-hidden />
              Fera's Studio presents <span aria-hidden>·</span> A special open call
            </p>
            <h1 className="display rise mt-6 text-[clamp(3rem,8.4vw,7.8rem)]" style={{ "--delay": "80ms" } as React.CSSProperties}>
              Five businesses. Five websites. <em className="italic">One creative opportunity.</em>
            </h1>
            <p className="rise mt-8 max-w-2xl text-lg leading-relaxed text-ink/85 md:text-xl" style={{ "--delay": "180ms" } as React.CSSProperties}>
              We're opening five spots for businesses ready to build their online presence. Through this special Fera's
              Studio initiative, five selected businesses will receive a professionally designed and developed website
              without paying development fees.
            </p>
            <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ "--delay": "260ms" } as React.CSSProperties}>
              <a href="#apply" className="btn-ink">
                Apply for a spot <span aria-hidden>↓</span>
              </a>
              <a href="#spots" className="btn-line">
                See available spots
              </a>
            </div>
          </div>

          {/* The special-exhibition ticket */}
          <div className="rise lg:col-span-4" style={{ "--delay": "340ms" } as React.CSSProperties}>
            <div className="relative mx-auto max-w-sm rotate-[2deg]">
            <div className="ticket bg-paper p-7">
              <p className="label text-stone">Special exhibition · Nigeria &amp; Benin</p>
              <p className="display mt-3 text-5xl">The Open Call</p>
              <div className="my-5 border-t-2 border-dashed border-ink/20" />
              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="label text-stone">Admits</dt>
                  <dd className="mt-1 font-serif text-3xl">Five</dd>
                </div>
                <div>
                  <dt className="label text-stone">Dev fee</dt>
                  <dd className="mt-1 font-serif text-3xl">Waived</dd>
                </div>
              </dl>
            </div>
              <span aria-hidden className="absolute -right-3 -top-4 rotate-[14deg] rounded-md border-2 border-coral bg-cream px-3 py-1 font-mono text-xs uppercase tracking-widest text-coral-ink">
                Limited
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- B. The five spots ---------- */}
      <section id="spots" aria-labelledby="spots-title" className="bg-wall/60 py-20 md:py-28">
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
            <OfferCard tone="bg-mint" label="On us" note="Development fee waived" items={onUs} />
            <OfferCard tone="bg-blush" label="Your responsibility" note="Paid by the business" items={yours} />
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-stone">
            The Open Call is for standard business websites, service websites and product catalogues. Complex ecommerce,
            extensive custom integrations and inventory systems aren't automatically included, but can be discussed
            separately.
          </p>
        </div>
      </section>

      {/* ---------- D. Who can apply ---------- */}
      <section aria-labelledby="who-title" className="py-20 md:py-28">
        <div className="gallery-x grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead no="03" id="who-title" title="Who can apply?" />
            <p className="mt-6 font-serif text-[clamp(2.4rem,5vw,4rem)] leading-[1]">
              Nigeria <span className="text-stone">&amp;</span> <em className="italic">Benin Republic</em>
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-6">
            <p className="label text-stone">Ideal applicants</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {ideal.map((x, i) => (
                <li key={x} className={cn("rounded-full px-4 py-2 text-sm", ["bg-butter", "bg-blush", "bg-lavender", "bg-mint", "bg-coral-soft", "bg-butter-soft"][i % 6])}>
                  {x}
                </li>
              ))}
            </ul>
            <p className="mt-6 leading-relaxed text-ink/85">
              Applications are reviewed one by one. Fera's Studio selects businesses based on their needs, how well the
              project fits and the scope of work required.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- E. How it works ---------- */}
      <section aria-labelledby="how-title" className="bg-wall/60 py-20 md:py-28">
        <div className="gallery-x">
          <SectionHead no="04" id="how-title" title="How it works" intro="Applying doesn't automatically guarantee a spot. A spot is only yours once Fera's Studio confirms it." />
          <ol className="mt-12 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-7">
            {steps.map((s, i) => (
              <li key={s} className="relative border-t-2 border-ink pt-4" data-reveal style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}>
                <span className="font-mono text-xs text-stone">Step {pad(i + 1)}</span>
                <p className="mt-2 leading-snug">{s}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- F. The making of the five ---------- */}
      <section aria-labelledby="five-title" className="py-20 md:py-28">
        <div className="gallery-x">
          <SectionHead no="05" id="five-title" title="The making of the five" intro="Follow each website from confirmation to launch. Only details a business has agreed to share appear here." />
          {data ? (
            <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
              {data.spots.map((s) => (
                <ProjectCard key={s.number} s={s} />
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
            <p className="mt-4 text-stone">Friendly, not legal. Read it before you apply.</p>
          </div>
          <ol className="grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:col-span-8">
            {conditions.map((c, i) => (
              <li key={c} className="flex gap-4 border-b border-ink/10 pb-4">
                <span className="font-mono text-xs leading-6 text-stone">{pad(i + 1)}</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- H. Apply ---------- */}
      <section id="apply" aria-labelledby="apply-title" className="scroll-mt-[var(--header-h)] py-20 md:py-28">
        <div className="gallery-x">
          <SectionHead no="07" id="apply-title" title="Apply for a spot" />
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
            <>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/85">
                Pick whichever is easier. Both open a message with the questions already filled in, so you just add your
                answers and send.
              </p>
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                <ApplyCard
                  tone="bg-lavender"
                  label="Option 01"
                  title="Apply by email"
                  detail={APPLY_EMAIL}
                  href={applyByEmail}
                  cta="Open an email draft"
                  note="Opens your email app with the subject and questions filled in."
                />
                <ApplyCard
                  tone="bg-mint"
                  label="Option 02"
                  title="Apply on WhatsApp"
                  detail={WHATSAPP_DISPLAY}
                  href={applyByWhatsApp}
                  cta="Open WhatsApp chat"
                  note="Opens a WhatsApp chat with Fera and a ready-to-send message."
                  external
                />
              </div>
              <p className="mt-6 max-w-3xl rounded-sm border-l-4 border-coral bg-paper p-4 text-sm leading-relaxed">
                <strong className="font-semibold">Applications are subject to review and confirmation.</strong> Sending a
                message doesn't reserve a spot. Fera's Studio will reply after reviewing your business, and the counter
                above changes only when a business is confirmed.
              </p>
            </>
          )}
        </div>
      </section>

      <NextRoom from="studio" />
    </main>
  );
};

/* ------------------------------------------------------------------ */

const SectionHead = ({ no, id, title, intro }: { no: string; id: string; title: string; intro?: string }) => (
  <div data-reveal>
    <p className="label text-stone">The Open Call · {no}</p>
    <h2 id={id} className="display mt-3 text-[clamp(2.6rem,6vw,5rem)]">
      {title}
    </h2>
    {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/85">{intro}</p>}
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

const Availability = ({ state, data }: { state: "loading" | "error" | "ready"; data: OpenCallData | null }) => {
  if (!data) return <StatusNote state={state} />;
  const { remaining, open } = summarise(data);
  return (
    <div className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <p className="font-serif text-[clamp(2.6rem,7vw,5.5rem)] leading-none" aria-live="polite">
          <span className="italic">{pad(remaining)}</span> of {pad(TOTAL_SPOTS)} <span className="text-stone">spots available</span>
        </p>
        <span className={cn("rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest", open ? "bg-mint text-mint-ink" : "bg-ink text-cream")}>
          Applications {open ? "open" : "closed"}
        </span>
      </div>
      <ol className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" aria-label="The five spots">
        {data.spots.map((s, i) => {
          const taken = isTaken(s.stage);
          return (
            <li
              key={s.number}
              className={cn("ticket relative flex aspect-[4/5] flex-col justify-between p-5", taken ? "bg-ink text-cream" : "bg-paper")}
              style={{ transform: `rotate(${[-1.5, 1, -0.5, 1.5, -1][i]}deg)` }}
            >
              <span className={cn("label", taken ? "text-cream/60" : "text-stone")}>Spot</span>
              <span className="display text-[4.5rem]">{s.number}</span>
              <span className={cn("label", taken ? "text-cream/80" : "text-mint-ink")}>{taken ? "Taken" : "Available"}</span>
              {taken && (
                <span aria-hidden className="absolute right-3 top-1/2 -translate-y-1/2 rotate-[-14deg] rounded-md border-2 border-coral px-2 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-coral">
                  Confirmed
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const OfferCard = ({ tone, label, note, items }: { tone: string; label: string; note: string; items: string[] }) => (
  <div className="frame p-0" data-reveal>
    <div className={cn("flex items-baseline justify-between gap-3 px-6 py-4", tone)}>
      <p className="display text-3xl">{label}</p>
      <p className="label">{note}</p>
    </div>
    <ul className="divide-y divide-ink/10 px-6 py-2">
      {items.map((x) => (
        <li key={x} className="py-3 leading-relaxed">
          {x}
        </li>
      ))}
    </ul>
  </div>
);

const ProjectCard = ({ s }: { s: Spot }) => {
  const taken = isTaken(s.stage);
  const show = taken && s.shareDetails;
  const progress = STAGES.indexOf(s.stage);
  const total = STAGES.length - STAGES.indexOf("Confirmed"); // confirmed → launched
  const doneSteps = taken ? progress - STAGES.indexOf("Confirmed") + 1 : 0;
  return (
    <li className={cn("flex flex-col border-t-2 pt-4", taken ? "border-ink" : "border-ink/20")}>
      <p className="label flex items-center justify-between text-stone">
        <span>Project {s.number}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[0.65rem]", taken ? "bg-lavender text-ink" : "bg-mint-soft text-mint-ink")}>{s.stage}</span>
      </p>
      <div className={cn("mt-4 flex aspect-[4/3] items-center justify-center overflow-hidden", show && s.image ? "bg-wall" : "border-2 border-dashed border-ink/15")}>
        {show && s.image ? (
          <img src={s.image} alt={`Preview of the ${s.business} website`} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <span className="px-4 text-center font-serif text-xl italic text-stone">{taken ? "Preview coming soon" : "Waiting for a business"}</span>
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
    </li>
  );
};

const ApplyCard = ({ tone, label, title, detail, href, cta, note, external }: { tone: string; label: string; title: string; detail: string; href: string; cta: string; note: string; external?: boolean }) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={cn("group flex flex-col p-7 transition-transform duration-500 ease-gallery hover:-translate-y-1 md:p-9", tone)}
  >
    <p className="label">{label}</p>
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
