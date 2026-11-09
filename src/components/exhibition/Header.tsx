import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { rooms, site } from "@/content/site";
import { useRoomProgress } from "@/hooks/use-exhibition";
import { cn } from "@/lib/utils";

/*
  Navigation as a floor plan.
  Desktop: rooms are listed by number with a progress rail that fills as you walk.
  Mobile: a single "Floor plan" button opens a full-screen map of the rooms.
*/
const Header = () => {
  const { pathname } = useLocation();
  const onHome = pathname === "/";
  const { active, progress } = useRoomProgress(onHome);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
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

  const current = rooms.find((r) => r.id === active) ?? rooms[0];

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[70] rounded-full bg-ink px-4 py-2 text-sm text-cream focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)] transition-[background-color,box-shadow] duration-500",
          scrolled || !onHome ? "bg-cream/90 shadow-[0_1px_0_rgba(40,38,36,0.08)] backdrop-blur-md" : "bg-transparent",
        )}
      >
        <div className="gallery-x flex h-full items-center justify-between gap-6">
          <Link to="/" className="group flex items-baseline gap-2" aria-label={`${site.studio}, home`}>
            <span className="display text-[1.65rem] leading-none">Fera's Studio</span>
            <span className="label hidden text-stone sm:inline">Est. digital</span>
          </Link>

          {/* Desktop floor plan */}
          <nav aria-label="Rooms" className="hidden lg:block">
            <ol className="flex items-center gap-1">
              {rooms.map((r) => {
                const isActive = onHome && r.id === active;
                return (
                  <li key={r.id}>
                    <Link
                      to={{ pathname: "/", hash: `#${r.id}` }}
                      aria-current={isActive ? "location" : undefined}
                      className={cn(
                        "group flex items-baseline gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors duration-300",
                        isActive ? "bg-ink text-cream" : "text-ink hover:bg-wall",
                      )}
                    >
                      <span className={cn("font-mono text-[0.65rem]", isActive ? "text-lavender" : "text-stone")}>{r.no}</span>
                      {r.short}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to={{ pathname: "/", hash: "#exit" }}
              className="hidden rounded-full bg-coral px-4 py-2 text-sm font-medium text-ink transition-transform duration-300 ease-gallery hover:-translate-y-0.5 md:inline-flex lg:hidden xl:inline-flex"
            >
              Start a project
            </Link>
            <button
              ref={toggleRef}
              type="button"
              className="flex items-center gap-2 rounded-full border border-ink/70 px-4 py-2 text-sm lg:hidden"
              aria-expanded={open}
              aria-controls="floor-plan"
              onClick={() => setOpen((o) => !o)}
            >
              <span className="font-mono text-[0.65rem] text-stone">{onHome ? current.no : "··"}</span>
              {open ? "Close" : "Floor plan"}
            </button>
          </div>
        </div>

        {/* Progress rail */}
        {onHome && (
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent" aria-hidden>
            <div
              className="h-full origin-left bg-ink transition-transform duration-150"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        )}
      </header>

      {/* Mobile floor plan overlay */}
      <div
        id="floor-plan"
        className={cn(
          "fixed inset-0 z-40 bg-cream pt-[var(--header-h)] transition-[opacity,visibility] duration-500 ease-gallery lg:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
        aria-hidden={!open}
      >
        <nav aria-label="Floor plan" className="gallery-x flex h-full flex-col justify-between pb-8 pt-6">
          <div>
            <p className="label mb-6 text-stone">Floor plan · {rooms.length} rooms</p>
            <ol className="border-t border-ink/15">
              {rooms.map((r, i) => (
                <li key={r.id} className="border-b border-ink/15">
                  <Link
                    to={{ pathname: "/", hash: `#${r.id}` }}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between py-4"
                    style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                  >
                    <span className="display text-[2.4rem]">{r.label}</span>
                    <span className="font-mono text-xs text-stone">{r.no} · {r.short}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-2">
            <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1} className="block text-lg underline underline-offset-4">
              {site.email}
            </a>
            <div className="flex gap-5 text-sm text-stone">
              {site.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
