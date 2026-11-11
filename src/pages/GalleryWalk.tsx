import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Visitor from "@/components/gallery/Visitor";
import portrait from "@/assets/curator.webp";
import { exhibits, toneStyles, type Exhibit } from "@/content/exhibits";
import { commissions } from "@/content/services";
import { getJourney, loadProgress, loadWalkSpot, saveProgress, saveWalkSpot, stopInfo, type Journey } from "@/content/journeys";
import RouteSlip from "@/components/exhibition/RouteSlip";
import GuestbookWall from "@/components/exhibition/GuestbookWall";
import LeavingScene from "@/components/exhibition/LeavingScene";
import { mailto, site } from "@/content/site";
import { getVisitor, loadVisitor } from "@/content/visitors";
import { usePageMeta } from "@/hooks/use-exhibition";
import { PAGES } from "@/content/seo";
import { cn } from "@/lib/utils";
import { t, tf } from "@/lib/i18n";

/* ------------------------------------------------------------------ */
/*  The floor plan, in world units. The world is 720 units tall and    */
/*  is scaled to fit the screen. The visitor walks along the floor.    */
/* ------------------------------------------------------------------ */

const WH = 720; // world height
const FLOOR = 540; // where the wall meets the floor
const FEET = 640; // where the visitor stands
const START = 220;

type HallRoom = { id: string; no: string; label: string; from: number; to: number; tone: string; wash: string };

const FRAME_W = 440;
const FIRST_FRAME = 1360;
const FRAME_GAP = 580;
const collectionEnd = FIRST_FRAME + (exhibits.length - 1) * FRAME_GAP + FRAME_W / 2 + 260;

const ROOMS: HallRoom[] = (() => {
  const a = 1000;
  const b = collectionEnd;
  const c = b + 1180;
  const d = c + 1780; // four commission posters + the price board
  const e = d + 1000;
  return [
    { id: "lobby", no: "00", label: "Entrance hall", from: 0, to: a, tone: "#282624", wash: "#EFEADD" },
    { id: "collection", no: "01", label: "The Collection", from: a, to: b, tone: "#C5B8F1", wash: "#ECE8F6" },
    { id: "curator", no: "02", label: "The Curator", from: b, to: c, tone: "#B9E2D1", wash: "#E6F1EA" },
    { id: "studio", no: "03", label: "The Studio", from: c, to: d, tone: "#F5ECA7", wash: "#F6F1D6" },
    { id: "exit", no: "04", label: "The Exit", from: d, to: e, tone: "#F28B79", wash: "#F6E3DC" },
  ];
})();
const WORLD_W = ROOMS[ROOMS.length - 1].to;

type Spot =
  | { id: string; kind: "welcome"; x: number; label: string }
  | { id: string; kind: "exhibit"; x: number; label: string; ex: Exhibit }
  | { id: string; kind: "portrait" | "bio"; x: number; label: string }
  | { id: string; kind: "service"; x: number; label: string; i: number }
  | { id: string; kind: "prices"; x: number; label: string }
  | { id: string; kind: "guestbook" | "exitdoor"; x: number; label: string };

const curatorRoom = ROOMS[2];
const studioRoom = ROOMS[3];
const exitRoom = ROOMS[4];

const PRICE_BOARD_X = 1440;

const SPOTS: Spot[] = [
  { id: "welcome", kind: "welcome", x: 520, label: "Welcome sign" },
  ...exhibits.map((ex, i) => ({
    id: ex.slug,
    kind: "exhibit" as const,
    x: FIRST_FRAME + i * FRAME_GAP,
    label: `Exhibit ${ex.no}: ${ex.title}`,
    ex,
  })),
  { id: "portrait", kind: "portrait", x: curatorRoom.from + 380, label: "Portrait of the curator" },
  { id: "bio", kind: "bio", x: curatorRoom.from + 820, label: "The curator's note" },
  ...commissions.map((c, i) => ({
    id: `service-${c.no}`,
    kind: "service" as const,
    x: studioRoom.from + 300 + i * 260,
    label: `Commission ${c.no}: ${c.title}`,
    i,
  })),
  { id: "prices", kind: "prices", x: studioRoom.from + PRICE_BOARD_X, label: "The price list" },
  { id: "guestbook", kind: "guestbook", x: exitRoom.from + 400, label: "The guestbook" },
  { id: "exitdoor", kind: "exitdoor", x: exitRoom.from + 820, label: "Exit door" },
];

const REACH = 190;
const SPEED = 430; // units per second
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const roomAt = (x: number) => ROOMS.findIndex((r) => x >= r.from && x < r.to);

/* ------------------------------------------------------------------ */

const GalleryWalk = () => {
  usePageMeta(PAGES.visit);
  const navigate = useNavigate();
  const visitor = useMemo(() => getVisitor(loadVisitor()), []);
  const journey = useMemo(() => getJourney(visitor.id), [visitor]);
  const route = useMemo(() => journey.route.map((id) => SPOTS.find((sp) => sp.id === id)).filter((sp): sp is Spot => !!sp), [journey]);
  const [visited, setVisited] = useState<Set<string>>(() => new Set(loadProgress(visitor.id)));
  const [slipOpen, setSlipOpen] = useState(false);
  const [ticked, setTicked] = useState<string | null>(null); // the stop just ticked off, for the little toast

  const stageRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const meRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLSpanElement>(null);

  // Coming back from a case study or the price list? Start where you left off.
  const x = useRef(loadWalkSpot() ?? START);
  const lastSaved = useRef(-1);
  const target = useRef<number | null>(null);
  const keys = useRef({ left: false, right: false });
  const hold = useRef(0); // -1 / 0 / 1 from on-screen buttons
  const wheelUntil = useRef(0);
  const view = useRef({ scale: 1, w: 1000, top: 0 });

  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [near, setNear] = useState<Spot | null>(null);
  const [room, setRoom] = useState(0);
  const [open, setOpen] = useState<Spot | null>(null);
  const [guide, setGuide] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [scale, setScale] = useState(1);
  const [top, setTop] = useState(0);
  const [hint, setHint] = useState(true);

  const openRef = useRef(false);
  openRef.current = !!open || guide;

  /* ---- layout: scale the world to the stage ---- */
  useEffect(() => {
    const fit = () => {
      const el = stageRef.current;
      if (!el) return;
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(height / WH, width / 480);
      const top = Math.max(0, (height - WH * s) * 0.45);
      view.current = { scale: s, w: width / s, top };
      setScale(s);
      setTop(top);
      paint();
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---- draw the current position without re-rendering the world ---- */
  const paint = useCallback(() => {
    const { scale: s, w } = view.current;
    const cam = clamp(x.current - w * 0.42, 0, Math.max(0, WORLD_W - w));
    if (worldRef.current) worldRef.current.style.transform = `translate3d(${-cam * s}px,0,0) scale(${s})`;
    if (meRef.current) meRef.current.style.transform = `translate3d(${x.current - 60}px,0,0)`;
    if (dotRef.current) dotRef.current.style.left = `${(x.current / WORLD_W) * 100}%`;

    let best: Spot | null = null;
    let bestD = REACH;
    for (const sp of SPOTS) {
      const d = Math.abs(sp.x - x.current);
      if (d < bestD) {
        best = sp;
        bestD = d;
      }
    }
    setNear((prev) => (prev?.id === best?.id ? prev : best));
    const r = roomAt(x.current);
    setRoom((prev) => (prev === r || r < 0 ? prev : r));
  }, []);

  /* ---- the walking loop ---- */
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      let dir = 0;
      if (!openRef.current) {
        dir = (keys.current.right ? 1 : 0) - (keys.current.left ? 1 : 0) || hold.current;
      }
      let moving = false;
      if (dir !== 0) {
        target.current = null;
        x.current = clamp(x.current + dir * SPEED * dt, 60, WORLD_W - 60);
        setFacing(dir > 0 ? 1 : -1);
        moving = true;
      } else if (target.current !== null) {
        const delta = target.current - x.current;
        const stepLen = Math.min(Math.abs(delta), SPEED * 3.2 * dt);
        x.current += Math.sign(delta) * stepLen;
        setFacing(delta >= 0 ? 1 : -1);
        moving = Math.abs(delta) > 1;
        if (!moving) target.current = null;
      } else if (now < wheelUntil.current) {
        moving = true;
      }
      if (!moving && lastSaved.current !== Math.round(x.current)) {
        lastSaved.current = Math.round(x.current);
        saveWalkSpot(x.current);
      }
      if (moving) {
        paint();
        setHint(false);
      }
      setWalking((w) => (w === moving ? w : moving));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paint]);

  /* ---- keyboard ---- */
  // The price card is a doorway, not a dialog: it takes visitors to the price list in the Studio.
  const lookCloser = useCallback(
    (s: Spot) => {
      setVisited((v) => {
        if (v.has(s.id)) return v;
        const nextSet = new Set(v).add(s.id);
        saveProgress(visitor.id, [...nextSet]);
        if (journey.route.includes(s.id)) setTicked(s.id);
        return nextSet;
      });
      return s.kind === "prices" ? navigate("/studio#prices") : setOpen(s);
    },
    [navigate, visitor.id, journey.route],
  );
  useEffect(() => {
    if (!ticked) return;
    const tm = window.setTimeout(() => setTicked(null), 2600);
    return () => window.clearTimeout(tm);
  }, [ticked]);
  const inspect = useCallback(() => {
    if (near) lookCloser(near);
  }, [near, lookCloser]);

  useEffect(() => {
    const menuOpen = () => !!document.querySelector('#floor-plan[aria-hidden="false"], [aria-label="Leaving the exhibition"]');
    const down = (e: KeyboardEvent) => {
      if (menuOpen() || openRef.current || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "arrowright" || k === "d") {
        keys.current.right = true;
        e.preventDefault();
      } else if (k === "arrowleft" || k === "a") {
        keys.current.left = true;
        e.preventDefault();
      } else if (k === "e" || ((k === "enter" || k === " ") && document.activeElement === stageRef.current)) {
        e.preventDefault();
        inspect();
      } else if (k === "g") {
        setGuide(true);
      }
    };
    const up = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "arrowright" || k === "d") keys.current.right = false;
      if (k === "arrowleft" || k === "a") keys.current.left = false;
    };
    const blur = () => (keys.current = { left: false, right: false });
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", blur);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", blur);
    };
  }, [inspect]);

  /* ---- scroll wheel / trackpad walks too ---- */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (openRef.current) return;
      e.preventDefault();
      const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      x.current = clamp(x.current + d * 0.9, 60, WORLD_W - 60);
      target.current = null;
      setFacing(d >= 0 ? 1 : -1);
      wheelUntil.current = performance.now() + 180;
      paint();
      setHint(false);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [paint]);

  /* ---- touch: drag the floor ---- */
  const drag = useRef<{ id: number; last: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    if ((e.target as HTMLElement).closest("button, a")) return;
    drag.current = { id: e.pointerId, last: e.clientX };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dx = e.clientX - drag.current.last;
    drag.current.last = e.clientX;
    x.current = clamp(x.current - (dx / view.current.scale) * 1.3, 60, WORLD_W - 60);
    setFacing(dx <= 0 ? 1 : -1);
    wheelUntil.current = performance.now() + 150;
    paint();
    setHint(false);
  };
  const endDrag = () => (drag.current = null);

  const walkTo = (to: number) => {
    target.current = clamp(to, 60, WORLD_W - 60);
    setHint(false);
  };

  const holdBtn = (dir: -1 | 1) => ({
    onPointerDown: (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      hold.current = dir;
    },
    onPointerUp: () => (hold.current = 0),
    onPointerCancel: () => (hold.current = 0),
    onPointerLeave: () => (hold.current = 0),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        walkTo(x.current + dir * 400);
      }
    },
  });

  const close = () => {
    setOpen(null);
    setGuide(false);
    requestAnimationFrame(() => stageRef.current?.focus());
  };

  const current = ROOMS[room];
  const nextStop = route.find((sp) => !visited.has(sp.id));
  const doneCount = route.filter((sp) => visited.has(sp.id)).length;

  return (
    <main id="main" className="fixed inset-0 overflow-hidden bg-cream pt-[var(--header-h)]">
      <h1 className="sr-only">{t("The gallery walk")}</h1>

      {/* ---------- Stage ---------- */}
      <div
        ref={stageRef}
        tabIndex={0}
        role="application"
        aria-roledescription="gallery"
        aria-label={tf("Gallery walk. You are {who}, in {room}. Use left and right arrows to walk, E to look closer, G for the floor guide.", { who: t(visitor.name), room: t(current.label) })}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className="relative h-full w-full touch-none select-none overflow-hidden outline-none"
        style={{ background: `linear-gradient(${current.wash} 0 ${top + FLOOR * scale}px, #E3DCCB ${top + FLOOR * scale}px)` }}
      >
        {/* world */}
        <div
          ref={worldRef}
          className="absolute left-0 will-change-transform"
          style={{ width: WORLD_W, height: WH, transformOrigin: "0 0", top }}
        >
          <Hall />
          {/* this visitor's route: numbered pins above each stop */}
          {route.map((sp, i) => {
            const done = visited.has(sp.id);
            const isNext = sp === nextStop;
            return (
              <span
                key={sp.id}
                aria-hidden
                className={cn(
                  "absolute flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full font-mono text-[13px] shadow-md transition-colors",
                  done ? "bg-ink text-cream" : isNext ? "route-pin-next bg-coral text-ink" : "bg-paper text-ink ring-2 ring-coral",
                )}
                style={{ left: sp.x, top: 92 }}
              >
                {done ? "✓" : i + 1}
              </span>
            );
          })}
          {/* the visitor */}
          <div ref={meRef} className="absolute left-0 will-change-transform" style={{ top: FEET - 220, width: 120, height: 220 }}>
            <Visitor v={visitor} walking={walking} facing={facing} className="h-full w-full" />
            {near && !walking && (
              <button
                type="button"
                onClick={() => lookCloser(near)}
                className="absolute -top-16 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4 py-2 text-[15px] font-medium text-cream shadow-lg"
              >
                <kbd className="hidden rounded bg-cream/20 px-1.5 font-mono text-xs md:inline">E</kbd>
                {near.kind === "prices" ? t("See prices") : t("Look closer")}
              </button>
            )}
          </div>
        </div>

        {/* first-time hint */}
        {hint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center px-4">
            <p className="rounded-full bg-ink/85 px-5 py-2.5 text-sm text-cream shadow-lg">
              <span className="hidden md:inline">{t("Walk with ← → or scroll ·")} </span>
              <span className="md:hidden">{t("Drag or hold the arrows to walk ·")} </span>
              {t("stop at a piece to look closer")}
            </p>
          </div>
        )}
      </div>

      {/* ---------- HUD ---------- */}
      <div className="pointer-events-none fixed inset-x-0 top-[var(--header-h)] z-20">
        <div className="gallery-x flex items-start justify-between gap-3 pt-3">
          <div className="flex flex-col items-start gap-2">
            <div className="pointer-events-auto flex items-center gap-3 rounded-full bg-paper/90 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur">
              <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: visitor.top }}>
                <Visitor v={visitor} className="h-8 w-auto" />
              </span>
              <span className="leading-tight">
                <span className="label block text-stone">
                  {t("Room")} {t(current.no)}
                </span>
                <span className="block font-serif text-lg" aria-live="polite">
                  {t(current.label)}
                </span>
              </span>
            </div>
            <div className="pointer-events-auto flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-expanded={slipOpen}
                aria-controls="route-slip"
                onClick={() => setSlipOpen((o) => !o)}
                className={cn("flex items-center gap-2 rounded-full bg-paper/95 py-2 pl-3 pr-4 text-sm shadow-sm backdrop-blur", ticked && "slip-bump")}
              >
                <span aria-hidden>🎟️</span>
                {t("Your slip")}
                {route.length > 0 && (
                  <span className="nums rounded-full bg-ink px-2 py-0.5 font-mono text-[11px] text-cream">
                    {doneCount}/{route.length}
                  </span>
                )}
                <span aria-hidden className={cn("transition-transform", slipOpen && "rotate-180")}>▾</span>
              </button>
              {route.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    const to = nextStop ?? SPOTS.find((sp) => sp.id === "exitdoor");
                    if (to) walkTo(to.x - 120);
                  }}
                  className="flex items-center gap-2 rounded-full bg-ink py-2 pl-4 pr-4 text-sm text-cream shadow-sm"
                >
                  {nextStop ? (
                    <>
                      {t("Next stop:")}{" "}
                      <span className="max-w-[9rem] truncate sm:max-w-[14rem]">
                        {nextStop.kind === "exhibit" ? t(nextStop.ex.title) : t(stopInfo(nextStop.id).label)}
                      </span>{" "}
                      →
                    </>
                  ) : (
                    <>{t("Route done ✓ Head for the exit →")}</>
                  )}
                </button>
              )}
            </div>
            {slipOpen && (
              <div id="route-slip" onWheel={(e) => e.stopPropagation()} onTouchMove={(e) => e.stopPropagation()} className="pointer-events-auto dialog-in max-h-[calc(100svh-var(--header-h)-12rem)] w-[min(22rem,calc(100vw-2.5rem))] overflow-y-auto overscroll-contain">
                <RouteSlip
                  compact
                  journey={journey}
                  visitor={visitor}
                  done={visited}
                  next={nextStop?.id}
                  onPick={(id) => {
                    const sp = SPOTS.find((x) => x.id === id);
                    if (sp) walkTo(sp.x - 120);
                    setSlipOpen(false);
                  }}
                />
              </div>
            )}
            {ticked && (
              <p role="status" className="pointer-events-none dialog-in rounded-full bg-mint px-4 py-2 text-sm font-medium text-ink shadow-sm">
                ✓ {tf("Ticked off: {stop}", { stop: t(stopInfo(ticked).label) })}
              </p>
            )}
          </div>
          <div className="pointer-events-auto flex gap-2">
            <button
              type="button"
              onClick={() => setGuide(true)}
              className="rounded-full bg-paper/90 px-4 py-2 text-sm shadow-sm backdrop-blur"
            >
              {t("Floor guide")}
            </button>
            <Link to="/" className="hidden rounded-full bg-paper/90 px-4 py-2 text-sm shadow-sm backdrop-blur sm:inline-flex">
              {t("Change visitor")}
            </Link>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="gallery-x flex items-center gap-3">
          <button type="button" aria-label={t("Walk left")} className="walk-btn" {...holdBtn(-1)}>
            ←
          </button>

          {/* minimap */}
          <div className="relative flex-1">
            <ol className="flex h-3 overflow-hidden rounded-full" aria-label={t("Rooms on this floor")}>
              {ROOMS.map((r) => (
                <li key={r.id} style={{ flex: r.to - r.from }}>
                  <button
                    type="button"
                    onClick={() => walkTo(r.from + 160)}
                    className="block h-full w-full opacity-80 transition-opacity hover:opacity-100"
                    style={{ background: r.tone }}
                    aria-label={tf("Walk to {room}", { room: t(r.label) })}
                    title={t(r.label)}
                  />
                </li>
              ))}
            </ol>
            <span
              ref={dotRef}
              aria-hidden
              className="pointer-events-none absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream shadow"
              style={{ background: visitor.top, left: `${(x.current / WORLD_W) * 100}%` }}
            />
          </div>

          <button type="button" aria-label={t("Walk right")} className="walk-btn" {...holdBtn(1)}>
            →
          </button>
        </div>
      </div>

      {/* ---------- Look closer ---------- */}
      {open && (
        <SpotDialog
          spot={open}
          journey={journey}
          onClose={close}
          onWalkAgain={() => {
            close();
            walkTo(START);
          }}
          onLeave={() => {
            close();
            setLeaving(true);
          }}
        />
      )}
      {leaving && <LeavingScene onStay={() => setLeaving(false)} />}

      {/* ---------- Floor guide (also the accessible list of everything) ---------- */}
      {guide && (
        <Dialog label={t("Floor guide")} onClose={close}>
          <p className="label text-stone">{t("Floor guide")}</p>
          <h2 className="display mt-2 text-4xl">{t("Everything on this floor")}</h2>
          <ol className="mt-6 max-h-[55vh] space-y-5 overflow-y-auto pr-2">
            {ROOMS.map((r) => {
              const items = SPOTS.filter((s) => roomAt(s.x) === ROOMS.indexOf(r));
              return (
                <li key={r.id}>
                  <p className="label flex items-center gap-2 text-stone">
                    <span className="h-2 w-2 rounded-full" style={{ background: r.tone }} /> {t("Room")} {t(r.no)} · {t(r.label)}
                  </p>
                  <ul className="mt-2 divide-y divide-ink/10 border-y border-ink/10">
                    {items.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-3 py-2">
                        <button
                          type="button"
                          className="text-left hover:underline"
                          onClick={() => {
                            setGuide(false);
                            walkTo(s.x - 120);
                          }}
                        >
                          {t(s.label)}
                        </button>
                        {s.kind === "exhibit" && (
                          <Link to={`/work/${s.ex.slug}`} className="shrink-0 text-sm text-stone underline-offset-4 hover:underline">
                            {t("Open case study")}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-sm text-stone">
            {t("Prefer reading?")}{" "}
            <Link to="/collection" className="underline underline-offset-4">
              {t("See the collection as a page")}
            </Link>
            .
          </p>
        </Dialog>
      )}
    </main>
  );
};

/* ------------------------------------------------------------------ */
/*  The hall: walls, archways, frames, furniture. Static.              */
/* ------------------------------------------------------------------ */

const Hall = () => (
  <div className="absolute inset-0">
    {/* room washes on the wall */}
    {ROOMS.map((r) => (
      <div key={r.id} className="absolute top-0" style={{ left: r.from, width: r.to - r.from, height: FLOOR, background: r.wash }} />
    ))}
    {/* picture rail, skirting, floor boards */}
    <div className="absolute inset-x-0" style={{ top: 64, height: 3, background: "#282624", opacity: 0.12 }} />
    <div className="absolute inset-x-0" style={{ top: FLOOR - 18, height: 18, background: "#D9D1BF" }} />
    <div
      className="absolute inset-x-0 bottom-0"
      style={{ top: FLOOR, background: "repeating-linear-gradient(90deg,#E3DCCB 0 118px,#DDD5C2 118px 120px)" }}
    />
    <div className="absolute inset-x-0" style={{ top: FLOOR, height: 40, background: "linear-gradient(rgba(40,38,36,.10),transparent)" }} />

    {/* ---- Entrance hall ---- */}
    <div className="absolute" style={{ left: 40, top: 110, width: 600 }}>
      <p className="font-mono text-[14px] uppercase tracking-[0.2em] text-stone">{t("Now showing · design & development")}</p>
      <p className="font-serif text-[104px] leading-[0.9] text-ink">
        {t("Fera's")}
        <br />
        Studio
      </p>
      <p className="mt-4 max-w-[420px] text-[20px] leading-snug text-ink/80">
        {t("Websites, products and interfaces by Fera, a UX/UI designer and front-end developer. Walk right to begin. →")}
      </p>
    </div>
    <Desk x={740} />
    <Plant x={60} />

    {/* ---- Archways ---- */}
    {ROOMS.slice(1).map((r) => (
      <Arch key={r.id} x={r.from} no={r.no} label={t(r.label)} tone={r.tone} />
    ))}

    {/* ---- The Collection ---- */}
    {exhibits.map((ex, i) => {
      const cx = FIRST_FRAME + i * FRAME_GAP;
      const h = Math.round((FRAME_W - 36) * (ex.cover.height / ex.cover.width)) + 36;
      const ts = toneStyles[ex.tone];
      return (
        <div key={ex.slug} className="absolute" style={{ left: cx - FRAME_W / 2, top: 120, width: FRAME_W }}>
          {/* spotlight */}
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 h-[420px] w-[520px] -translate-x-1/2"
            style={{ background: "radial-gradient(50% 60% at 50% 30%, rgba(255,253,248,.85), transparent 70%)" }}
          />
          <div className="relative p-[18px] shadow-[0_24px_40px_-24px_rgba(40,38,36,.55)]" style={{ background: ts.hex, height: h }}>
            <img
              src={ex.cover.src}
              alt=""
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="block h-full w-full bg-wall object-cover object-top"
            />
            {ex.badge && (
              <span className="absolute -right-6 -top-8 flex h-[92px] w-[92px] rotate-[10deg] flex-col items-center justify-center rounded-full bg-ink text-center text-cream">
                <span className="font-serif text-[26px] leading-none">{t(ex.badge.value)}</span>
                <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.1em] text-peach">{t(ex.badge.label)}</span>
              </span>
            )}
          </div>
          {/* wall label */}
          <div className="ml-auto mt-5 w-[300px] bg-paper p-4 shadow-sm">
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-stone">
              {t("Exhibit")} {t(ex.no)}
            </p>
            <p className="mt-1 font-serif text-[30px] leading-[1.02]">{ex.short ?? ex.title}</p>
            <p className="mt-1 text-[14px] text-stone">{t(ex.medium)}</p>
          </div>
        </div>
      );
    })}
    <Bench x={FIRST_FRAME + FRAME_GAP * 1.5} />
    <Bench x={FIRST_FRAME + FRAME_GAP * 3.5} />
    <Plant x={collectionEnd - 120} />

    {/* ---- The Curator ---- */}
    <div className="absolute" style={{ left: curatorRoom.from + 380 - 140, top: 96, width: 280 }}>
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 h-[420px] w-[420px] -translate-x-1/2"
        style={{ background: "radial-gradient(50% 60% at 50% 30%, rgba(255,253,248,.85), transparent 70%)" }}
      />
      <div className="relative bg-paper p-4 shadow-[0_24px_40px_-24px_rgba(40,38,36,.55)]" style={{ transform: "rotate(-1.5deg)" }}>
        <img src={portrait} alt="" loading="lazy" className="block w-full" />
      </div>
      <p className="mt-4 text-center font-serif text-[22px] italic">{t("Portrait of the curator")}</p>
    </div>
    <div className="absolute bg-paper p-7 shadow-sm" style={{ left: curatorRoom.from + 820 - 210, top: 150, width: 420 }}>
      <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-mint-ink">{t("Curator's note")}</p>
      <p className="mt-3 font-serif text-[30px] leading-[1.1]">{t("I design the way I build: with the whole thing in mind.")}</p>
      <p className="mt-3 text-[16px] leading-relaxed text-ink/80">
        {t("UX/UI designer and front-end developer with a B.Sc. in Computer Science and an Electrical Engineering background.")}
      </p>
    </div>
    <Bench x={curatorRoom.from + 600} />
    <Plant x={curatorRoom.to - 120} />

    {/* ---- The Studio ---- */}
    {commissions.map((c, i) => {
      const tones = ["#F28B79", "#C5B8F1", "#B9E2D1", "#F5ECA7"];
      return (
        <div
          key={c.no}
          className="absolute flex flex-col p-5 shadow-[0_18px_30px_-20px_rgba(40,38,36,.5)]"
          style={{
            left: studioRoom.from + 300 + i * 260 - 105,
            top: 130,
            width: 210,
            height: 290,
            background: tones[i],
            transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`,
          }}
        >
          <span className="font-mono text-[13px]">
            {t("Commission")} {t(c.no)}
          </span>
          <span className="mt-auto font-serif text-[28px] leading-[1.02]">{t(c.title)}</span>
        </div>
      );
    })}
    <p className="absolute font-mono text-[13px] uppercase tracking-[0.18em] text-stone" style={{ left: studioRoom.from + 200, top: 470 }}>
      {t("Now taking commissions · look closer at a poster or the price list")}
    </p>
    <PriceBoard />

    {/* ---- The Exit ---- */}
    <div className="absolute" style={{ left: exitRoom.from + 400 - 110, top: 360, width: 220 }}>
      {/* lectern + guestbook */}
      <div className="mx-auto flex h-[46px] w-[200px] -skew-x-6 items-center justify-center gap-1 rounded-sm bg-paper shadow">
        <span className="h-[34px] w-[88px] bg-cream" />
        <span className="h-[34px] w-[88px] bg-cream" />
      </div>
      <div className="mx-auto h-[160px] w-[40px] bg-[#8B6B4E]" />
      <p className="mt-2 text-center font-mono text-[12px] uppercase tracking-[0.16em] text-stone">{t("Guestbook")}</p>
    </div>
    <div className="absolute" style={{ left: exitRoom.from + 820 - 90, top: 210, width: 180 }}>
      <p className="mx-auto mb-3 w-fit rounded-sm bg-coral px-3 py-1 font-mono text-[14px] font-bold tracking-[0.2em] text-ink">
        {t("EXIT")}
      </p>
      <div className="h-[330px] rounded-t-[90px] border-[10px] border-ink/80 bg-[#2B2725]" />
    </div>
    <p className="absolute font-serif text-[64px] leading-none" style={{ left: exitRoom.from + 90, top: 110 }}>
      {t("Thanks for")} <em className="italic">{t("visiting")}</em>.
    </p>
  </div>
);

const Arch = ({ x, no, label, tone }: { x: number; no: string; label: string; tone: string }) => (
  <div className="absolute" style={{ left: x - 110, top: 120, width: 220 }}>
    <div
      className="mx-auto mb-3 w-fit rounded-full px-4 py-1.5 font-mono text-[13px] uppercase tracking-[0.16em]"
      style={{ background: tone, color: tone === "#282624" ? "#F7F4EC" : "#282624" }}
    >
      {t("Room")} {t(no)}
    </div>
    <p className="mb-4 text-center font-serif text-[30px] leading-none">{t(label)}</p>
    <div
      className="h-[330px] rounded-t-full"
      style={{ background: "linear-gradient(#D7CFBD, #CFC6B2)", boxShadow: "inset 0 12px 30px rgba(40,38,36,.18)" }}
    />
  </div>
);

const Bench = ({ x }: { x: number }) => (
  <svg className="absolute" style={{ left: x - 110, top: FLOOR + 30 }} width="220" height="70" viewBox="0 0 220 70" aria-hidden>
    <rect x="0" y="10" width="220" height="16" rx="4" fill="#8B6B4E" />
    <rect x="18" y="26" width="10" height="40" fill="#5E4633" />
    <rect x="192" y="26" width="10" height="40" fill="#5E4633" />
  </svg>
);

const Plant = ({ x }: { x: number }) => (
  <svg className="absolute" style={{ left: x - 50, top: FLOOR - 150 }} width="100" height="190" viewBox="0 0 100 190" aria-hidden>
    <path d="M50 120 C20 90 10 50 30 20 C40 60 48 80 50 120Z" fill="#7FB59A" />
    <path d="M50 120 C80 90 92 46 70 14 C62 56 54 84 50 120Z" fill="#6AA388" />
    <path d="M50 120 C34 100 6 92 2 70 C24 78 40 92 50 120Z" fill="#8FC4A9" />
    <path d="M24 120 h52 l-8 66 h-36z" fill="#F28B79" />
  </svg>
);

const Desk = ({ x }: { x: number }) => (
  <div className="absolute" style={{ left: x - 140, top: FLOOR - 120, width: 280 }}>
    <p className="mx-auto mb-2 w-fit rounded-sm bg-ink px-3 py-1 font-mono text-[12px] uppercase tracking-[0.2em] text-cream">
      {t("Tickets")}
    </p>
    <div className="h-[150px] rounded-t-lg bg-paper shadow-[0_10px_20px_-12px_rgba(40,38,36,.5)]">
      <div className="h-3 rounded-t-lg bg-lavender" />
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/*  Dialogs                                                            */
/* ------------------------------------------------------------------ */

/* Every look-closer card ends with the same way back to the walk, with the visitor's slip count. */
const BackToWalk = ({ onClose }: { onClose: () => void }) => {
  const v = getVisitor(loadVisitor());
  const j = getJourney(v.id);
  const done = loadProgress(v.id).filter((id) => j.route.includes(id)).length;
  return (
    <div className="mt-8 border-t border-dashed border-ink/20 pt-5">
      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-2 rounded-full bg-ink py-1.5 pl-1.5 pr-4 text-sm text-cream shadow-sm transition-transform duration-300 ease-gallery hover:-translate-y-0.5"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full" style={{ background: v.top }}>
          <Visitor v={v} className="h-7 w-auto" />
        </span>
        <span aria-hidden>←</span>
        {t("Back to the gallery walk")}
        {j.route.length > 0 && (
          <span className="nums rounded-full bg-cream/15 px-2 py-0.5 font-mono text-[11px]">
            🎟️ {done}/{j.route.length}
          </span>
        )}
      </button>
    </div>
  );
};

const Dialog = ({ label, onClose, children, tone }: { label: string; onClose: () => void; children: React.ReactNode; tone?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    const el = ref.current;
    el?.querySelector<HTMLElement>("a, button:not([data-close])")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab" && el) {
        const f = [...el.querySelectorAll<HTMLElement>("a, button")];
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) {
          e.preventDefault();
          f[f.length - 1].focus();
        } else if (!e.shiftKey && document.activeElement === f[f.length - 1]) {
          e.preventDefault();
          f[0].focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-ink/40 p-3 pt-[calc(var(--header-h)+0.75rem)] backdrop-blur-sm sm:items-center sm:p-6 sm:pt-[calc(var(--header-h)+1rem)]"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        className="dialog-in relative max-h-[calc(100svh-var(--header-h)-1.5rem)] w-full max-w-3xl overflow-y-auto rounded-md bg-cream p-6 shadow-2xl sm:p-9"
        style={tone ? { borderTop: `10px solid ${tone}` } : undefined}
      >
        <button
          type="button"
          data-close
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-ink/30 px-3 py-1 text-sm"
          aria-label={t("Close and keep walking")}
        >
          {t("Keep walking ×")}
        </button>
        {t(children)}
        <BackToWalk onClose={onClose} />
      </div>
    </div>
  );
};

const SpotDialog = ({
  spot,
  journey,
  onClose,
  onWalkAgain,
  onLeave,
}: {
  spot: Spot;
  journey: Journey;
  onClose: () => void;
  onWalkAgain: () => void;
  onLeave: () => void;
}) => {
  if (spot.kind === "exhibit") {
    const ex = spot.ex;
    const ts = toneStyles[ex.tone];
    return (
      <Dialog label={t(spot.label)} onClose={onClose} tone={ts.hex}>
        <p className="label text-stone">
          {t("Exhibit")} {t(ex.no)}
          {ex.year ? ` · ${ex.year}` : ""}
        </p>
        <h2 className="display mt-2 pr-28 text-[clamp(2.2rem,5vw,3.6rem)]">{t(ex.title)}</h2>
        <p className={cn("label mt-2", ts.ink)}>{t(ex.medium)}</p>
        <div className={cn("mt-5 p-2.5", ts.bg)}>
          <img src={ex.cover.src} alt={t(ex.cover.alt)} className="block w-full bg-wall" />
        </div>
        <p className="mt-5 text-[1.05rem] leading-relaxed text-ink/85">{t(ex.summary)}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {ex.statuses.map((s) => (
            <li key={s} className={cn("rounded-full px-3 py-1 text-xs font-medium", ts.soft)}>
              {t(s)}
            </li>
          ))}
          {ex.badge && (
            <li className="rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream">
              {t(ex.badge.value)} {t(ex.badge.label)}
            </li>
          )}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={`/work/${ex.slug}`} className="btn-ink">
            {t("Walk into the exhibit")} <span aria-hidden>→</span>
          </Link>
        </div>
      </Dialog>
    );
  }

  if (spot.kind === "portrait" || spot.kind === "bio") {
    return (
      <Dialog label={t(spot.label)} onClose={onClose} tone="#B9E2D1">
        <div className="grid gap-6 sm:grid-cols-[180px_1fr]">
          <img
            src={portrait}
            alt={t("Fera, smiling, in a black blazer, standing outdoors in front of a leafy garden")}
            className="w-full max-w-[180px] bg-wall"
          />
          <div>
            <p className="label text-stone">{t("Room 02 · The Curator")}</p>
            <h2 className="display mt-2 text-4xl">{t("Hi, I'm Fera.")}</h2>
            <p className="mt-3 leading-relaxed text-ink/85">
              {t(
                "Peace Oluwaferanmi Segun-Babs. I'm a UX/UI designer and front-end developer with a B.Sc. in Computer Science and a background in Electrical Engineering. I research and design in Figma, then build what I've designed, so the details make it into the real thing.",
              )}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/curator" className="btn-ink">
                {t("Read the curator's room")} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      </Dialog>
    );
  }

  if (spot.kind === "service") {
    const c = commissions[spot.i];
    return (
      <Dialog label={t(spot.label)} onClose={onClose} tone="#F5ECA7">
        <p className="label text-stone">
          {t("Room 03 · Commission")} {t(c.no)}
        </p>
        <h2 className="display mt-2 pr-28 text-4xl">{t(c.title)}</h2>
        <p className="label mt-2 text-stone">{t(c.for)}</p>
        <p className="mt-4 text-[1.05rem] leading-relaxed text-ink/85">{t(c.outcome)}</p>
        <ul className="mt-4 grid gap-1.5 text-sm sm:grid-cols-2">
          {c.includes.map((x) => (
            <li key={x}>+ {t(x)}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={mailto(`Enquiry: ${c.title}`, `Hi Fera,\n\nI'd like to talk about: ${c.title}.\n\nAbout the project:\n`)}
            className="btn-ink"
          >
            {t("Enquire about this")} <span aria-hidden>↗</span>
          </a>
          <Link to="/studio" className="btn-line">
            {t("See all commissions")}
          </Link>
        </div>
      </Dialog>
    );
  }

  if (spot.kind === "guestbook") {
    return (
      <Dialog label={t(spot.label)} onClose={onClose} tone="#F28B79">
        <p className="label text-stone">{t("Room 04 · The visitors' book")}</p>
        <h2 className="display mt-2 pr-28 text-[clamp(2.4rem,5vw,3.6rem)]">{t("Sign before you go")}</h2>
        <p className="mt-3 leading-relaxed text-ink/85">
          {t("Leave your name, and a little note if you like, so Fera knows you stopped by.")}
        </p>
        <div className="mt-6">
          <GuestbookWall compact limit={8} />
        </div>
        <p className="mt-6 text-sm text-stone">
          {t("See every signature on")}{" "}
          <Link to="/contact#visitors-book" className="underline underline-offset-4">
            {t("the Exit wall")}
          </Link>
          .
        </p>
      </Dialog>
    );
  }

  if (spot.kind === "exitdoor") {
    const f = journey.finale;
    return (
      <Dialog label={t(spot.label)} onClose={onClose} tone="#282624">
        <p className="label text-stone">
          {t("The exit ·")} {t(journey.routeTitle)}
        </p>
        <h2 className="display mt-2 pr-28 text-4xl">{t(f.title)}</h2>
        <p className="mt-3 leading-relaxed text-ink/85">{t(f.text)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to={f.primary.to} className="btn bg-coral text-ink">
            {t(f.primary.label)}
          </Link>
          {f.secondary && (
            <Link to={f.secondary.to} className="btn-line">
              {t(f.secondary.label)}
            </Link>
          )}
          <button type="button" onClick={onWalkAgain} className="btn-line">
            {t("Walk the gallery again")}
          </button>
          <button type="button" onClick={onLeave} className="btn-line">
            {t("Leave the exhibition 🚪")}
          </button>
        </div>
        <p className="mt-4 text-sm text-stone">{t("Before you go: the visitors' book is just behind you.")}</p>
      </Dialog>
    );
  }

  // welcome sign
  return (
    <Dialog label={t(spot.label)} onClose={onClose} tone="#282624">
      <p className="label text-stone">{t("Room 00 · Entrance hall")}</p>
      <h2 className="display mt-2 pr-28 text-4xl">{t("Welcome to Fera's Studio.")}</h2>
      <p className="mt-3 leading-relaxed text-ink/85">
        {t("Fera is a UX/UI designer and front-end developer. This floor holds")} {t(exhibits.length)}{" "}
        {t("exhibits of her work, the curator's room, the studio's commissions and a visitors' book by the exit.")}
      </p>
      <p className="mt-3 rounded-sm bg-butter-soft p-4 leading-relaxed text-ink/90">
        <strong className="font-medium">
          {t("Your route:")} {t(journey.routeTitle)}.
        </strong>{" "}
        {t(journey.intro)}
        {journey.route.length > 0 && t(" Follow the numbered pins, or tap “Next stop” at the top.")}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onClose} className="btn-ink">
          {t("Start walking →")}
        </button>
        <Link to="/collection" className="btn-line">
          {t("Skip to the work")}
        </Link>
      </div>
    </Dialog>
  );
};

/* The price card on the Studio wall: no prices here, it points visitors to the Studio's price list. */
const PriceBoard = () => (
  <div
    className="absolute bg-ink p-7 text-cream shadow-[0_24px_40px_-22px_rgba(40,38,36,.7)]"
    style={{ left: studioRoom.from + PRICE_BOARD_X - 160, top: 140, width: 320, height: 280, transform: "rotate(0.6deg)" }}
  >
    <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-butter">{t("The price list")}</p>
    <p className="mt-3 font-serif text-[34px] leading-[1.02]">{t("What it costs, in naira or CFA.")}</p>
    <p className="mt-4 text-[15px] leading-relaxed text-cream/75">
      {t("Every service and price is waiting in the Studio. Step closer to see them.")}
    </p>
    <p className="absolute bottom-6 left-7 font-mono text-[11px] uppercase tracking-[0.14em] text-cream/60">{t("See prices →")}</p>
  </div>
);

export default GalleryWalk;
