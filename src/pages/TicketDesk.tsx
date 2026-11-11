import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Visitor from "@/components/gallery/Visitor";
import { exhibits } from "@/content/exhibits";
import { getVisitor, loadVisitor, saveVisitor, visitors, type VisitorId } from "@/content/visitors";
import { getJourney, resetProgress } from "@/content/journeys";
import RouteSlip from "@/components/exhibition/RouteSlip";
import { usePageMeta } from "@/hooks/use-exhibition";
import { PAGES } from "@/content/seo";
import { cn } from "@/lib/utils";
import { t, tf } from "@/lib/i18n";

/*
  The entrance: a ticket desk.
  Pick who you're visiting as, take your ticket, walk in.
  Clients in a hurry can skip straight to the work.
*/
const TicketDesk = () => {
  usePageMeta(PAGES.home);
  const navigate = useNavigate();
  const [picked, setPicked] = useState<VisitorId>(() => loadVisitor() ?? "client");
  const [stamped, setStamped] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const v = getVisitor(picked);
  const j = getJourney(picked);

  // arrow keys move between visitors, like a radio group
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = visitors.findIndex((x) => x.id === picked);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % visitors.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + visitors.length) % visitors.length;
    if (n < 0) return;
    e.preventDefault();
    setPicked(visitors[n].id);
    groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[n]?.focus();
  };

  // Take the ticket: it's stamped "Admitted", then the booth hands over your route slip.
  const [slip, setSlip] = useState(false);
  const enter = () => {
    saveVisitor(picked);
    resetProgress(picked);
    if (!document.documentElement.classList.contains("motion-ok")) return setSlip(true);
    setStamped(true);
    window.setTimeout(() => setSlip(true), 750);
  };

  useEffect(() => setStamped(false), [picked]);

  // While the slip is out, the page behind it stays put.
  useEffect(() => {
    if (!slip) return;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSlip(false);
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [slip]);

  return (
    <main id="main" className="relative min-h-[100svh] overflow-hidden pt-[var(--header-h)]">
      <div className="gallery-x grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Welcome */}
        <div className="lg:col-span-5">
          <p className="label rise flex items-center gap-3 text-stone">
            <span className="inline-block h-2 w-2 rounded-full bg-coral" aria-hidden />
            {t("Ticket desk · Fera's Studio · Free entry")}
          </p>
          <h1 className="display rise mt-6 text-[clamp(3rem,7.4vw,6.6rem)]" style={{ "--delay": "80ms" } as React.CSSProperties}>
            {t("Welcome in.")} <em className="italic">{t("Who's visiting")}</em> {t("today?")}
          </h1>
          <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-ink/85" style={{ "--delay": "180ms" } as React.CSSProperties}>
            {t(
              "Fera's Studio is the exhibition of Fera, a UX/UI designer and front-end developer. Tell us who you are and your ticket comes with your own route through the gallery:",
            )}{" "}
            {t(exhibits.length)}{" "}
            {t("exhibits of design and development work, the curator's room, the studio and a visitors' book at the exit.")}
          </p>
          <div
            className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm"
            style={{ "--delay": "260ms" } as React.CSSProperties}
          >
            <Link to={j.shortcut.to} className="link-underline font-medium">
              {t(j.shortcut.label)} →
            </Link>
            <Link to="/contact" className="link-underline text-stone">
              {t("Start a project")}
            </Link>
          </div>
          <Link
            to="/open-call"
            className="rise mt-8 inline-flex items-center gap-3 rounded-full border border-ink/20 py-1.5 pl-1.5 pr-4 text-sm transition-colors hover:border-ink"
            style={{ "--delay": "320ms" } as React.CSSProperties}
          >
            <span className="whitespace-nowrap rounded-full bg-blush px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-widest">{t("Now on")}</span>
            {t("The Open Call: five free websites for businesses →")}
          </Link>
        </div>

        {/* Visitors + ticket */}
        <div className="lg:col-span-7">
          <div
            ref={groupRef}
            role="radiogroup"
            aria-label={t("Who are you?")}
            onKeyDown={onKeyDown}
            className="grid grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {visitors.map((x, i) => {
              const on = x.id === picked;
              return (
                <button
                  key={x.id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setPicked(x.id)}
                  className={cn(
                    "rise group relative flex flex-col items-center rounded-t-full border-2 px-3 pb-4 pt-8 text-center transition-[transform,background-color,border-color] duration-500 ease-gallery",
                    on ? "-translate-y-2 border-ink bg-paper" : "border-transparent bg-wall/70 hover:-translate-y-1",
                  )}
                  style={{ "--delay": `${200 + i * 80}ms` } as React.CSSProperties}
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-6 top-6 bottom-24 rounded-t-full opacity-60 transition-opacity"
                    style={{ background: x.top, opacity: on ? 0.55 : 0.3 }}
                  />
                  <Visitor v={x} walking={on} className="relative h-36 w-auto sm:h-40" />
                  <span className="relative mt-3 font-serif text-xl leading-tight">{t(x.name)}</span>
                  <span className="relative mt-1 text-xs leading-snug text-stone">{t(x.line)}</span>
                  {on && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-cream">
                      {t("Picked")}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* The ticket */}
          <div
            className="rise mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center"
            style={{ "--delay": "520ms" } as React.CSSProperties}
          >
            <div className={cn("ticket relative flex flex-1 items-center gap-4 rounded-md bg-paper p-4 pr-6", stamped && "is-stamped")}>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ background: v.top }}>
                <Visitor v={v} className="h-12 w-auto" />
              </span>
              <span className="min-w-0">
                <span className="label block text-stone">{t("Admit one · Fera's Studio")}</span>
                <span className="block font-serif text-2xl leading-tight">{t(v.name)}</span>
                <span className="block text-sm text-stone">{t(v.greeting)}</span>
                <span className="mt-1 block text-xs font-medium text-ink">
                  {t("Your route:")} {t(j.routeTitle)}
                  {j.route.length > 0 ? tf(" · {n} stops", { n: j.route.length }) : ""}
                </span>
              </span>
              <span
                aria-hidden
                className="ticket-stamp absolute right-4 top-1/2 -translate-y-1/2 rotate-[-12deg] rounded-md border-2 border-coral px-2 py-1 font-mono text-xs uppercase tracking-widest text-coral-ink"
              >
                {t("Admitted")}
              </span>
            </div>
            <button type="button" onClick={enter} className="btn-ink shrink-0 px-8 py-4 text-base">
              {t("Take ticket & walk in")} <span aria-hidden>→</span>
            </button>
          </div>
          <p className="label mt-4 text-stone">{t("Walk with ← → or A / D, scroll, or the on-screen arrows · press E to look closer")}</p>
        </div>
      </div>
      {slip && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-4 backdrop-blur-sm" onClick={() => setSlip(false)}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("Your route slip")}
            onClick={(e) => e.stopPropagation()}
            className="dialog-in flex max-h-[calc(100svh-2rem)] w-full max-w-sm flex-col"
          >
            <div className="shrink-0 rounded-t-md bg-ink px-4 pb-3 pt-4 text-cream">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cream/60">{t("Ticket booth")}</p>
              <p className="mt-0.5 font-serif text-2xl leading-tight">{t("Admitted ✓ Here's your route slip.")}</p>
              <p className="mt-0.5 text-xs text-cream/75">{t("Keep it with you. Each stop gets ticked off as you look closer.")}</p>
              {/* the printer slot the slip comes out of */}
              <div aria-hidden className="mt-3 h-2 rounded-full bg-black/70 shadow-[inset_0_2px_3px_rgba(0,0,0,.8)]" />
            </div>
            {/* only the slip scrolls, never the page behind it */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3">
              <div className="slip-print">
                <RouteSlip compact journey={j} visitor={v} done={new Set()} next={j.route[0]} />
              </div>
            </div>
            <div className="mt-3 flex shrink-0 flex-wrap justify-center gap-3">
              <button type="button" autoFocus onClick={() => navigate("/visit")} className="btn bg-coral px-7 text-ink">
                {t("Walk in")} <span aria-hidden>→</span>
              </button>
              <button type="button" onClick={() => setSlip(false)} className="btn border border-cream/60 text-cream">
                {t("Change visitor")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default TicketDesk;
