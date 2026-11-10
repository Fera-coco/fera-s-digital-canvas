import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Visitor from "@/components/gallery/Visitor";
import { exhibits } from "@/content/exhibits";
import { getVisitor, loadVisitor, saveVisitor, visitors, type VisitorId } from "@/content/visitors";
import { usePageMeta } from "@/hooks/use-exhibition";
import { cn } from "@/lib/utils";

/*
  The entrance: a ticket desk.
  Pick who you're visiting as, take your ticket, walk in.
  Clients in a hurry can skip straight to the work.
*/
const TicketDesk = () => {
  usePageMeta(
    "Fera's Studio: a walk-through exhibition of design & development work",
    "Pick a visitor and walk through Fera's Studio, an interactive gallery of UX/UI design, product design and web development by Fera (Peace Oluwaferanmi Segun-Babs).",
    "/",
  );
  const navigate = useNavigate();
  const [picked, setPicked] = useState<VisitorId>(() => loadVisitor() ?? "sketcher");
  const [stamped, setStamped] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const v = getVisitor(picked);

  // arrow keys move between visitors, like a radio group
  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = visitors.findIndex((x) => x.id === picked);
    let n = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") n = (i + 1) % visitors.length;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") n = (i - 1 + visitors.length) % visitors.length;
    if (n < 0) return;
    e.preventDefault();
    setPicked(visitors[n].id);
    (groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[n])?.focus();
  };

  const enter = () => {
    saveVisitor(picked);
    if (!document.documentElement.classList.contains("motion-ok")) return navigate("/visit");
    setStamped(true);
    window.setTimeout(() => navigate("/visit"), 650);
  };

  useEffect(() => setStamped(false), [picked]);

  return (
    <main id="main" className="relative min-h-[100svh] overflow-hidden pt-[var(--header-h)]">
      <div className="gallery-x grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 gap-10 py-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        {/* Welcome */}
        <div className="lg:col-span-5">
          <p className="label rise flex items-center gap-3 text-stone">
            <span className="inline-block h-2 w-2 rounded-full bg-coral" aria-hidden />
            Ticket desk · Fera's Studio · Free entry
          </p>
          <h1 className="display rise mt-6 text-[clamp(3rem,7.4vw,6.6rem)]" style={{ "--delay": "80ms" } as React.CSSProperties}>
            Welcome in. <em className="italic">Who's visiting</em> today?
          </h1>
          <p className="rise mt-6 max-w-lg text-lg leading-relaxed text-ink/85" style={{ "--delay": "180ms" } as React.CSSProperties}>
            Fera's Studio is the exhibition of Fera, a UX/UI designer and front-end developer. Pick a visitor, take
            your ticket and walk the gallery: {exhibits.length} exhibits of design and development work, the curator's
            room, the studio and a guestbook at the exit.
          </p>
          <div className="rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm" style={{ "--delay": "260ms" } as React.CSSProperties}>
            <Link to="/collection" className="link-underline font-medium">
              In a hurry? Skip the walk and see the work →
            </Link>
            <Link to="/contact" className="link-underline text-stone">
              Start a project
            </Link>
          </div>
        </div>

        {/* Visitors + ticket */}
        <div className="lg:col-span-7">
          <div
            ref={groupRef}
            role="radiogroup"
            aria-label="Choose your visitor"
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
                  <span className="relative mt-3 font-serif text-xl leading-tight">{x.name}</span>
                  <span className="relative mt-1 text-xs leading-snug text-stone">{x.line}</span>
                  {on && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ink px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest text-cream">
                      Picked
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* The ticket */}
          <div className="rise mt-8 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center" style={{ "--delay": "520ms" } as React.CSSProperties}>
            <div className={cn("ticket relative flex flex-1 items-center gap-4 rounded-md bg-paper p-4 pr-6", stamped && "is-stamped")}>
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full" style={{ background: v.top }}>
                <Visitor v={v} className="h-12 w-auto" />
              </span>
              <span className="min-w-0">
                <span className="label block text-stone">Admit one · Fera's Studio</span>
                <span className="block font-serif text-2xl leading-tight">{v.name}</span>
                <span className="block text-sm text-stone">{v.greeting}</span>
              </span>
              <span aria-hidden className="ticket-stamp absolute right-4 top-1/2 -translate-y-1/2 rotate-[-12deg] rounded-md border-2 border-coral px-2 py-1 font-mono text-xs uppercase tracking-widest text-coral-ink">
                Admitted
              </span>
            </div>
            <button type="button" onClick={enter} className="btn-ink shrink-0 px-8 py-4 text-base">
              Take ticket &amp; walk in <span aria-hidden>→</span>
            </button>
          </div>
          <p className="label mt-4 text-stone">Walk with ← → or A / D, scroll, or the on-screen arrows · press E to look closer</p>
        </div>
      </div>
    </main>
  );
};

export default TicketDesk;
