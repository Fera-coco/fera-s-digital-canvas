import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getJourney, loadProgress, loadWalkSpot, stopInfo, TICK_EVENT } from "@/content/journeys";
import { getVisitor, loadVisitor } from "@/content/visitors";
import Visitor from "@/components/gallery/Visitor";
import { t, tf } from "@/lib/i18n";

/*
  Visitors who stepped out of the gallery walk (into a case study, the price list,
  the curator's room…) always have a way back, with their slip count, and a little
  note when a stop gets ticked off on the page they're on.
*/
const ReturnToWalk = () => {
  const { pathname } = useLocation();
  const [ticked, setTicked] = useState<string | null>(null);
  const [, bump] = useState(0);
  const visitor = getVisitor(loadVisitor()); // read fresh: the ticket may have been taken after the app loaded
  const journey = getJourney(visitor.id);

  useEffect(() => {
    const onTick = (e: Event) => {
      setTicked((e as CustomEvent<string>).detail);
      bump((n) => n + 1);
    };
    window.addEventListener(TICK_EVENT, onTick);
    return () => window.removeEventListener(TICK_EVENT, onTick);
  }, []);
  useEffect(() => {
    if (!ticked) return;
    const tm = window.setTimeout(() => setTicked(null), 3200);
    return () => window.clearTimeout(tm);
  }, [ticked]);

  const hidden = pathname === "/visit" || pathname === "/" || pathname.startsWith("/open-call/admin");
  if (hidden || loadWalkSpot() === null) return null;

  const done = loadProgress(visitor.id).filter((id) => journey.route.includes(id)).length;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-40 flex flex-col items-start gap-2 pb-[env(safe-area-inset-bottom)]">
      {ticked && (
        <p role="status" className="dialog-in rounded-full bg-mint px-4 py-2 text-sm font-medium text-ink shadow-md">
          ✓ {tf("Ticked off: {stop}", { stop: t(stopInfo(ticked).label) })}
        </p>
      )}
      <Link
        to="/visit"
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-ink py-1.5 pl-1.5 pr-4 text-sm text-cream shadow-lg transition-transform duration-300 ease-gallery hover:-translate-y-0.5"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: visitor.top }}>
          <Visitor v={visitor} className="h-7 w-auto" />
        </span>
        <span aria-hidden>←</span>
        {t("Back to the gallery walk")}
        {journey.route.length > 0 && (
          <span className={`nums rounded-full px-2 py-0.5 font-mono text-[11px] ${ticked ? "bg-mint text-ink" : "bg-cream/15"}`}>
            🎟️ {done}/{journey.route.length}
          </span>
        )}
      </Link>
    </div>
  );
};

export default ReturnToWalk;
