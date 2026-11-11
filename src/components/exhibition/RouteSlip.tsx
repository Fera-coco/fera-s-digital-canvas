import Visitor from "@/components/gallery/Visitor";
import { stopInfo, type Journey } from "@/content/journeys";
import type { VisitorType } from "@/content/visitors";
import { t, tf } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/*
  The route slip: handed over at the ticket booth, kept in your pocket on the walk.
  Each stop gets ticked off as you look closer at it.
*/
const RouteSlip = ({
  journey,
  visitor,
  done,
  next,
  onPick,
  compact = false,
}: {
  journey: Journey;
  visitor: VisitorType;
  done: Set<string>;
  next?: string;
  onPick?: (id: string) => void;
  compact?: boolean;
}) => {
  const count = journey.route.filter((id) => done.has(id)).length;
  const finished = journey.route.length > 0 && count === journey.route.length;

  return (
    <div className={cn("route-slip relative bg-paper text-ink", compact ? "px-4 pb-4 pt-5" : "px-6 pb-6 pt-7")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone">{t("Route slip · Fera's Studio")}</p>
          <p className={cn("font-serif leading-tight", compact ? "text-xl" : "text-[1.9rem]")}>{t(journey.routeTitle)}</p>
          <p className="mt-0.5 text-xs text-stone">{tf("Issued to: {who}", { who: t(visitor.name) })}</p>
        </div>
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full" style={{ background: visitor.top }}>
          <Visitor v={visitor} className="h-10 w-auto" />
        </span>
      </div>

      {journey.route.length === 0 ? (
        <p className={cn("mt-4 border-t border-dashed border-ink/25 pt-4 leading-relaxed text-ink/85", compact ? "text-sm" : "")}>
          {t("No set route for you. Wander, stop wherever something catches your eye, and sign the visitors' book on your way out.")}
        </p>
      ) : (
        <ol className="mt-4 border-t border-dashed border-ink/25 pt-2">
          {journey.route.map((id, i) => {
            const s = stopInfo(id);
            const ticked = done.has(id);
            const isNext = id === next;
            const row = (
              <>
                <span
                  className={cn(
                    "slip-box flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 font-mono text-[11px]",
                    ticked ? "is-ticked border-ink bg-ink text-cream" : isNext ? "border-coral text-ink" : "border-ink/40 text-stone",
                  )}
                  aria-hidden
                >
                  {ticked ? "✓" : i + 1}
                </span>
                <span className={cn("min-w-0 flex-1", compact && "flex items-baseline gap-2")}>
                  <span className={cn("block truncate", compact && "flex-1", ticked && "text-stone line-through decoration-ink/40")}>{t(s.label)}</span>
                  <span className="block shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">{t(s.room)}</span>
                </span>
                {isNext && !ticked && <span className="shrink-0 rounded-full bg-coral px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider">{t("Next")}</span>}
                <span className="sr-only">{ticked ? t("(done)") : ""}</span>
              </>
            );
            return (
              <li key={id} className="border-b border-dotted border-ink/15 last:border-0">
                {onPick ? (
                  <button type="button" onClick={() => onPick(id)} className="flex w-full items-center gap-3 py-1.5 text-left text-sm hover:bg-ink/[0.03]">
                    {row}
                  </button>
                ) : (
                  <div className={cn("flex items-center gap-3", compact ? "py-1 text-sm" : "py-2")}>{row}</div>
                )}
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-stone">
        <span>{journey.route.length > 0 ? tf("{n} of {m} stops", { n: count, m: journey.route.length }) : t("Free roam")}</span>
        {finished && <span className="slip-stamp rounded-sm border-2 border-coral-ink px-1.5 py-0.5 text-coral-ink">{t("Route complete")}</span>}
      </div>
    </div>
  );
};

export default RouteSlip;
