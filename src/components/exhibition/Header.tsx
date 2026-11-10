import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { roomFor, rooms, site, WALK } from "@/content/site";
import { cn } from "@/lib/utils";

/*
  The gallery's signage.
  A quiet bar that tells you which room you're in, plus a "Floor plan" button
  that opens a full-screen map of every room in giant type.
*/
const Header = () => {
  const { pathname } = useLocation();
  const current = roomFor(pathname);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const accent = rooms.find((r) => r.id === hovered)?.tone;
  const dark = pathname === "/contact" && !open;

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[90] rounded-full bg-ink px-4 py-2 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-[60] h-[var(--header-h)] backdrop-blur-md transition-colors duration-500",
          dark ? "bg-ink/85 text-cream" : "bg-cream/85 text-ink",
        )}
      >
        <div className="gallery-x grid h-full grid-cols-[1fr_auto] items-center gap-6 md:grid-cols-[1fr_auto_1fr]">
          <Link to="/" className="flex items-baseline gap-2 justify-self-start" aria-label={`${site.studio}, back to the entrance`}>
            <span className="display text-[1.65rem] leading-none">Fera's Studio</span>
          </Link>

          {/* Where you are */}
          <p className={cn("label hidden items-center gap-2 md:flex", dark ? "text-cream/60" : "text-stone")} aria-live="polite">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: pathname === WALK.path ? WALK.tone : current?.tone ?? "#282624" }} aria-hidden />
            {pathname === WALK.path ? (
              <span className={dark ? "text-cream" : "text-ink"}>{WALK.label}</span>
            ) : current ? (
              <>
                Room {current.no} <span aria-hidden>·</span> <span className={dark ? "text-cream" : "text-ink"}>{current.label}</span>
              </>
            ) : (
              "Off the floor plan"
            )}
          </p>

          <div className="flex items-center gap-3 justify-self-end">
            <Link
              to="/contact"
              className="hidden rounded-full bg-coral px-4 py-2 text-sm font-medium text-ink transition-transform duration-300 ease-gallery hover:-translate-y-0.5 sm:inline-flex"
            >
              Start a project
            </Link>
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={open}
              aria-controls="floor-plan"
              onClick={() => setOpen((o) => !o)}
              className={cn("group flex items-center gap-2 rounded-full border py-2 pl-4 pr-3 text-sm", dark ? "border-cream/60" : "border-ink/70")}
            >
              {open ? "Close" : "Floor plan"}
              <span
                aria-hidden
                className={cn(
                  "flex h-5 w-5 items-center justify-center text-lg leading-none transition-transform duration-500 ease-gallery",
                  open ? "rotate-45" : "group-hover:rotate-90",
                )}
              >
                +
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen floor plan */}
      <div
        id="floor-plan"
        role="dialog"
        aria-modal="true"
        aria-label="Floor plan"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-50 flex flex-col bg-cream pt-[var(--header-h)] transition-[clip-path,visibility] duration-700 ease-gallery",
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]",
        )}
      >
        {/* a wash of the hovered room's colour */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 transition-opacity duration-500"
          style={{ background: accent ? `radial-gradient(60% 70% at 75% 55%, ${accent}66, transparent 70%)` : undefined, opacity: accent ? 1 : 0 }}
        />
        <nav className="gallery-x relative flex flex-1 flex-col justify-center py-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="label text-stone">Floor plan · {rooms.length} rooms · choose where to go</p>
            <Link to={WALK.path} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="rounded-full bg-lavender px-4 py-2 text-sm font-medium">
              Take the gallery walk →
            </Link>
          </div>
          <ol className="space-y-1">
            {rooms.map((r, i) => {
              const here = current?.id === r.id;
              return (
                <li key={r.id}>
                  <Link
                    ref={i === 0 ? firstLinkRef : undefined}
                    to={r.path}
                    tabIndex={open ? 0 : -1}
                    aria-current={here ? "page" : undefined}
                    onMouseEnter={() => setHovered(r.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(r.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setOpen(false)}
                    className="group grid grid-cols-[3rem_1fr] items-center gap-3 sm:grid-cols-[4.5rem_1fr_auto]"
                    style={{ transitionDelay: open ? `${120 + i * 50}ms` : "0ms" }}
                  >
                    <span className="font-mono text-xs text-stone">{r.no}</span>
                    <span
                      className={cn(
                        "display text-[clamp(2.8rem,9vw,7.5rem)] transition-[transform,color] duration-500 ease-gallery group-hover:translate-x-3 group-focus-visible:translate-x-3",
                        here && "italic",
                      )}
                    >
                      {r.label}
                    </span>
                    <span className="label hidden max-w-[16rem] text-right text-stone opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block">
                      {here ? "You are here" : r.blurb}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </nav>
        <div className="gallery-x relative flex flex-col gap-3 border-t border-ink/15 py-5 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-stone">Open for freelance projects and collaborations.</p>
          <div className="flex flex-wrap items-center gap-5">
            <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1} className="link-underline">
              {site.email}
            </a>
            {site.socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="link-underline">
                {s.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
