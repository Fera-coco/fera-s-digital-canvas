import { useRef, useState, type PointerEvent } from "react";
import { Link } from "react-router-dom";
import { exhibits, inStudio, toneStyles, type Exhibit } from "@/content/exhibits";
import { cn } from "@/lib/utils";

/* Each exhibit is hung differently so the wall never repeats itself. */
const layouts = [
  // 01: wide print left, label right, phone tucked over the corner
  {
    art: "lg:col-span-8 lg:col-start-1",
    label: "lg:col-span-4 lg:col-start-9 lg:pt-24",
    phone: "-bottom-10 right-4 w-[24%] sm:-right-6",
  },
  // 02: label left, print right and dropped lower
  {
    art: "lg:col-span-7 lg:col-start-6 lg:row-start-1 lg:mt-20",
    label: "lg:col-span-4 lg:col-start-1 lg:row-start-1 lg:pt-6",
    phone: "-top-10 -left-3 w-[22%] sm:-left-8",
  },
  // 03: centred, slightly narrower print, label underneath in two columns
  {
    art: "lg:col-span-10 lg:col-start-2",
    label: "lg:col-span-10 lg:col-start-2 lg:grid lg:grid-cols-2 lg:gap-12",
    phone: "-top-8 right-6 w-[18%] sm:-right-4",
  },
];

const ExhibitPiece = ({ ex, index }: { ex: Exhibit; index: number }) => {
  const l = layouts[index % layouts.length];
  const tone = toneStyles[ex.tone];
  const artRef = useRef<HTMLAnchorElement>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse" || !artRef.current) return;
    const r = artRef.current.getBoundingClientRect();
    setCursor({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  const labelBlock = (
    <div className={cn("relative", l.label)} data-reveal style={{ "--delay": "120ms" } as React.CSSProperties}>
      <div>
        <p className="label flex items-center gap-3 text-stone">
          <span className={cn("inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-ink", tone.bg)}>{ex.no}</span>
          Exhibit {ex.no} · {ex.year}
        </p>
        <h3 className="display mt-5 text-[clamp(2.75rem,6vw,4.75rem)]">
          <Link to={`/work/${ex.slug}`} viewTransition className="link-underline">
            {ex.title}
          </Link>
        </h3>
        <p className={cn("label mt-3", tone.ink)}>{ex.medium}</p>
      </div>
      <div className={cn(index % 3 === 2 && "lg:pt-[4.6rem]")}>
        <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-ink/85">{ex.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Project status">
          {ex.statuses.map((s) => (
            <li key={s} className={cn("rounded-full px-3 py-1 text-xs font-medium text-ink", tone.soft)}>
              {s}
            </li>
          ))}
        </ul>
        <Link
          to={`/work/${ex.slug}`}
          viewTransition
          className="group mt-7 inline-flex items-center gap-3 text-sm font-medium"
        >
          <span className="link-underline">Walk into the exhibit</span>
          <span aria-hidden className={cn("flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-300 ease-gallery group-hover:translate-x-1", tone.bg)}>
            →
          </span>
        </Link>
      </div>
    </div>
  );

  return (
    <article aria-labelledby={`ex-${ex.slug}`} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
      <span id={`ex-${ex.slug}`} className="sr-only">
        Exhibit {ex.no}: {ex.title}
      </span>
      <div className={cn("relative", l.art)} data-reveal>
        <Link
          ref={artRef}
          to={`/work/${ex.slug}`}
          viewTransition
          tabIndex={-1}
          aria-hidden
          onPointerMove={onMove}
          onPointerLeave={() => setCursor(null)}
          className="group relative block md:cursor-none"
        >
          <div className={cn("frame p-3 transition-transform duration-700 ease-gallery group-hover:-translate-y-1 sm:p-6 lg:p-8", tone.bg)}>
            <div className="overflow-hidden">
              <img
                src={ex.cover.src}
                alt={ex.cover.alt}
                width={ex.cover.width}
                height={ex.cover.height}
                loading="lazy"
                decoding="async"
                style={{ viewTransitionName: `exhibit-${ex.slug}` } as React.CSSProperties}
                className="block w-full bg-wall transition-transform [transition-duration:1200ms] ease-gallery group-hover:scale-[1.025]"
              />
            </div>
          </div>
          {ex.secondary && (
            <div className={cn("frame absolute hidden p-1.5 transition-transform duration-700 ease-gallery group-hover:-translate-y-3 sm:block sm:p-2", l.phone)}>
              <img
                src={ex.secondary.src}
                alt=""
                width={ex.secondary.width}
                height={ex.secondary.height}
                loading="lazy"
                decoding="async"
                className="block w-full bg-wall"
              />
            </div>
          )}
          {/* cursor label (desktop mouse only) */}
          {cursor && (
            <span
              className="pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-medium text-cream md:flex"
              style={{ left: cursor.x, top: cursor.y }}
            >
              View exhibit <span aria-hidden>↗</span>
            </span>
          )}
        </Link>
        <p className="label mt-4 text-stone">{ex.cover.caption}</p>
      </div>
      {labelBlock}
    </article>
  );
};

const Collection = () => (
  <section id="collection" aria-labelledby="collection-title" className="relative py-24 md:py-36">
    <div className="gallery-x">
      <header className="mb-20 grid grid-cols-1 gap-8 md:mb-28 lg:grid-cols-12" data-reveal>
        <div className="lg:col-span-7">
          <p className="label text-stone">Room 01</p>
          <h2 id="collection-title" className="display mt-4 text-[clamp(3rem,8vw,6.5rem)]">
            The Collection
          </h2>
        </div>
        <p className="max-w-md self-end text-lg leading-relaxed text-ink/85 lg:col-span-5">
          A small, curated selection of real projects, from finished builds to a client store in progress. Walk into
          any piece for the story of how it was made.
        </p>
      </header>

      <div className="space-y-32 md:space-y-44">
        {exhibits.map((ex, i) => (
          <ExhibitPiece key={ex.slug} ex={ex} index={i} />
        ))}
      </div>

      {/* Works still in the studio */}
      <aside aria-labelledby="in-studio-title" className="mt-36 md:mt-48" data-reveal>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/15 pb-5">
          <h3 id="in-studio-title" className="display text-[clamp(2rem,4vw,3rem)]">
            Still in the studio
          </h3>
          <p className="label text-stone">Not yet on the wall · in progress</p>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2">
          {inStudio.map((w, i) => (
            <li
              key={w.title}
              className={cn(
                "relative py-8 md:py-10",
                i === 0 ? (inStudio.length > 1 ? "md:border-r md:border-ink/15 md:pr-10" : "") : "border-t border-ink/15 md:border-t-0 md:pl-10",
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="label text-stone">{w.medium}</p>
                  <h4 className="mt-2 font-serif text-4xl">{w.title}</h4>
                </div>
                <span className={cn("shrink-0 rounded-full px-3 py-1 text-xs font-medium text-ink", toneStyles[w.tone].bg)}>
                  {w.status}
                </span>
              </div>
              <p className="mt-4 max-w-md leading-relaxed text-ink/85">{w.text}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  </section>
);

export default Collection;
