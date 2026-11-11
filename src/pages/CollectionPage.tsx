import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { exhibits, toneStyles, type Exhibit } from "@/content/exhibits";
import { usePageMeta } from "@/hooks/use-exhibition";
import { PAGES } from "@/content/seo";
import NextRoom from "@/components/exhibition/NextRoom";
import { cn } from "@/lib/utils";
import { t, tf } from "@/lib/i18n";

type Filter = "all" | "design" | "build";

const filters: { id: Filter; label: string; note: string }[] = [
  { id: "design", label: "Design", note: "UX/UI and product design" },
  { id: "build", label: "Build", note: "Websites and web apps" },
];

const matches = (ex: Exhibit, f: Filter) => f === "all" || ex.discipline === f || ex.discipline === "both";

const ITEM = 52; // px height of one name in the reel

/*
  Room 01. The collection as a reel.
  Desktop: the room doesn't scroll. Scrolling, arrow keys or clicking a name turns
  the reel; the exhibit in the band is the one on the wall.
  Mobile: the exhibits hang one after another.
*/
const CollectionPage = () => {
  usePageMeta(PAGES.collection);

  const [filter, setFilter] = useState<Filter>("all");
  const list = useMemo(() => exhibits.filter((e) => matches(e, filter)), [filter]);
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const stageRef = useRef<HTMLDivElement>(null);
  const lock = useRef(0);
  const acc = useRef(0);

  useEffect(() => setActive(0), [filter]);

  const activeRef = useRef(0);
  activeRef.current = active;

  const step = useCallback((dir: number) => setActive((a) => Math.min(list.length - 1, Math.max(0, a + dir))), [list.length]);

  // wheel turns the reel (desktop stage only)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dir = e.deltaY > 0 ? 1 : -1;
      // let the page scroll on past the reel's ends (to the next-room door and back)
      if (window.scrollY > 4) return;
      if ((dir > 0 && activeRef.current >= list.length - 1) || (dir < 0 && activeRef.current <= 0)) return;
      e.preventDefault();
      const now = Date.now();
      acc.current += e.deltaY;
      if (now < lock.current || Math.abs(acc.current) < 30) return;
      step(acc.current > 0 ? 1 : -1);
      acc.current = 0;
      lock.current = now + 420;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [step, list.length]);

  // keyboard: up/down to turn, enter to walk in
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stageRef.current || stageRef.current.offsetParent === null) return; // stage hidden on mobile
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [role=dialog]:not([aria-hidden=true])")) return;
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const ex = list[active] ?? list[0];
  const tone = toneStyles[ex.tone];

  return (
    <main id="main" className="flex min-h-[100svh] flex-col">
      {/* ---------- Desktop: the reel ---------- */}
      <div
        ref={stageRef}
        className="relative hidden h-[100svh] overflow-hidden pt-[var(--header-h)] lg:block"
        aria-label={t("The Collection")}
        role="region"
      >
        <h1 className="sr-only">{t("The Collection")}</h1>

        <div className="gallery-x relative grid h-full grid-cols-12 gap-8">
          {/* Reel of names */}
          <div className="relative col-span-4">
            {/* the band: same box as the reel, stretched to the left edge of the screen */}
            <div
              aria-hidden
              className="absolute right-[-0.75rem] top-[44%] h-[52px] w-[100vw] -translate-y-1/2 transition-colors duration-500"
              style={{ background: tone.hex }}
            />
            <ol
              aria-label={t("Exhibits")}
              className="absolute right-0 top-[44%] w-full transition-transform duration-700 ease-gallery"
              style={{ transform: `translateY(${-active * ITEM - ITEM / 2}px)` }}
            >
              {list.map((e, i) => {
                const d = Math.abs(i - active);
                return (
                  <li key={e.slug} style={{ height: ITEM }}>
                    <button
                      type="button"
                      onClick={() => (i === active ? navigate(`/work/${e.slug}`) : setActive(i))}
                      aria-current={i === active ? "true" : undefined}
                      className="flex h-full w-full items-center justify-end gap-4 text-right transition-[opacity,color] duration-500"
                      style={{ opacity: i === active ? 1 : Math.max(0.12, 0.55 - d * 0.14) }}
                    >
                      <span className="font-mono text-xs text-ink/70">{t(e.no)}</span>
                      <span className={cn("truncate font-serif text-[1.9rem] leading-none", i === active && "italic")}>
                        {e.short ?? e.title}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* The wall: the active exhibit */}
          <div className="relative col-span-5 flex items-start pt-[6vh]">
            <Link to={`/work/${ex.slug}`} className="group relative block w-full" aria-label={tf("Walk into exhibit {no}: {title}", { no: ex.no, title: t(ex.title) })}>
              <div className={cn("frame p-4 transition-colors duration-500 xl:p-6", tone.bg)}>
                <div className="relative aspect-[16/10] overflow-hidden bg-wall">
                  {list.map((e, i) => (
                    <img
                      key={e.slug}
                      src={e.cover.src}
                      alt={i === active ? t(e.cover.alt) : ""}
                      width={e.cover.width}
                      height={e.cover.height}
                      loading={i < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className={cn(
                        "absolute inset-0 h-full w-full object-cover object-top transition-[opacity,transform] duration-700 ease-gallery group-hover:scale-[1.02]",
                        i === active ? "opacity-100" : "scale-[1.04] opacity-0",
                      )}
                    />
                  ))}
                </div>
              </div>
              {ex.badge && (
                <span className="absolute -left-6 -top-7 flex h-24 w-24 rotate-[-10deg] flex-col items-center justify-center rounded-full bg-ink text-center text-cream shadow-lg">
                  <span className="font-serif text-2xl leading-none">{t(ex.badge.value)}</span>
                  <span className="mt-1 font-mono text-[0.5rem] uppercase tracking-[0.12em] text-peach">{t(ex.badge.label)}</span>
                </span>
              )}
              <span className="label absolute -bottom-7 left-0 text-stone">{t(ex.cover.caption)}</span>
            </Link>
          </div>

          {/* Wall label */}
          <div className="col-span-3 flex flex-col pt-[6vh]" aria-live="polite">
            <p className="label text-stone">
              {t("Exhibit")} {t(ex.no)} {t("of")} {String(exhibits.length).padStart(2, "0")}
              {ex.year ? ` · ${ex.year}` : ""}
            </p>
            <h2 className={cn("display mt-3", ex.title.length > 18 ? "text-[2.4rem]" : "text-[3.4rem]")}>{t(ex.title)}</h2>
            <p className={cn("label mt-3", tone.ink)}>{t(ex.medium)}</p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink/85">{t(ex.summary)}</p>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label={t("Status")}>
              {ex.statuses.map((s) => (
                <li key={s} className={cn("rounded-full px-3 py-1 text-xs font-medium", tone.soft)}>
                  {t(s)}
                </li>
              ))}
            </ul>
            <Link to={`/work/${ex.slug}`} className="btn-ink mt-6 self-start">
              {t("Walk into the exhibit")} <span aria-hidden>→</span>
            </Link>
            <div className="mt-auto flex items-center gap-2 pb-[22vh] text-stone">
              <button
                type="button"
                onClick={() => step(-1)}
                disabled={active === 0}
                aria-label={t("Previous exhibit")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/30 disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                disabled={active === list.length - 1}
                aria-label={t("Next exhibit")}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ink/30 disabled:opacity-30"
              >
                ↓
              </button>
              <span className="label ml-2">{t("Scroll or use the arrow keys · keep scrolling to leave")}</span>
            </div>
          </div>
        </div>

        {/* Room title, cropped by the floor */}
        <p
          aria-hidden
          className="display pointer-events-none absolute -bottom-[0.18em] left-1/2 -translate-x-1/2 whitespace-nowrap text-[clamp(6rem,13vw,13rem)]"
        >
          {t("The")} <em className="italic">{t("Collection")}</em>
        </p>

        {/* Filter discs */}
        {filters.map((f, i) => {
          const on = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(on ? "all" : f.id)}
              title={t(f.note)}
              className={cn(
                "absolute bottom-0 flex h-44 w-44 translate-y-1/3 items-start justify-center rounded-full border border-ink pt-10 font-serif text-2xl transition-[transform,background-color] duration-500 ease-gallery hover:translate-y-[28%]",
                i === 0 ? "-left-10 bg-butter" : "-right-10 bg-mint",
                on && "translate-y-[20%] bg-ink text-cream hover:translate-y-[20%]",
              )}
            >
              <span>
                {t(f.label)}
                {on && <span className="block font-mono text-[0.6rem] uppercase tracking-widest">{t("tap for all")}</span>}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------- Mobile and tablet: hung one after another ---------- */}
      <div className="pt-[var(--header-h)] lg:hidden">
        <header className="gallery-x pb-10 pt-10">
          <p className="label text-stone">{t("Room 01")}</p>
          <h1 className="display mt-3 text-[clamp(3.4rem,15vw,6rem)]">
            {t("The")} <em className="italic">{t("Collection")}</em>
          </h1>
          <div className="mt-6 flex gap-2" role="group" aria-label={t("Filter exhibits")}>
            {[{ id: "all" as Filter, label: "All" }, ...filters].map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={cn("rounded-full border px-4 py-2 text-sm", filter === f.id ? "border-ink bg-ink text-cream" : "border-ink/30")}
              >
                {t(f.label)}
              </button>
            ))}
          </div>
        </header>
        <ol className="gallery-x space-y-16 pb-20">
          {list.map((e) => {
            const ts = toneStyles[e.tone];
            return (
              <li key={e.slug} data-reveal>
                <Link to={`/work/${e.slug}`} className="group block">
                  <div className="relative">
                    <div className={cn("frame p-3", ts.bg)}>
                      <img
                        src={e.cover.src}
                        alt={t(e.cover.alt)}
                        width={e.cover.width}
                        height={e.cover.height}
                        loading="lazy"
                        decoding="async"
                        className="block w-full bg-wall"
                      />
                    </div>
                    {e.badge && (
                      <span className="absolute -right-1 -top-5 flex h-20 w-20 rotate-[8deg] flex-col items-center justify-center rounded-full bg-ink text-center text-cream">
                        <span className="font-serif text-xl leading-none">{t(e.badge.value)}</span>
                        <span className="mt-0.5 font-mono text-[0.45rem] uppercase tracking-[0.1em] text-peach">{t(e.badge.label)}</span>
                      </span>
                    )}
                  </div>
                  <p className="label mt-5 flex items-center gap-3 text-stone">
                    <span className={cn("inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-ink", ts.bg)}>
                      {t(e.no)}
                    </span>
                    {e.statuses.map((x) => t(x)).join(" · ")}
                  </p>
                  <h2 className="display mt-3 text-[2.6rem]">{t(e.title)}</h2>
                  <p className={cn("label mt-2", ts.ink)}>{t(e.medium)}</p>
                  <p className="mt-3 leading-relaxed text-ink/85">{t(e.summary)}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium">
                    <span className="link-underline">{t("Walk into the exhibit")}</span> <span aria-hidden>→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
      <NextRoom from="collection" />
    </main>
  );
};

export default CollectionPage;
