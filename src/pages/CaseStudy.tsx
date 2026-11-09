import { Link, useParams } from "react-router-dom";
import Frame from "@/components/exhibition/Frame";
import Exit from "@/components/exhibition/Exit";
import NotFound from "./NotFound";
import { exhibits, getExhibit, toneStyles } from "@/content/exhibits";
import { usePageMeta } from "@/hooks/use-exhibition";
import { cn } from "@/lib/utils";

const CaseStudy = () => {
  const { slug } = useParams();
  const ex = getExhibit(slug);

  usePageMeta(
    ex ? `${ex.title}: ${ex.medium} | Fera's Studio` : "Exhibit not found | Fera's Studio",
    ex ? ex.summary : "This exhibit isn't in the collection.",
    ex ? `/work/${ex.slug}` : "/",
  );

  if (!ex) return <NotFound />;

  const tone = toneStyles[ex.tone];
  const idx = exhibits.indexOf(ex);
  const next = exhibits[(idx + 1) % exhibits.length];

  return (
    <>
      <main id="main">
        <article aria-labelledby="exhibit-title">
          {/* Title wall */}
          <header className="pt-[var(--header-h)]">
            <div className="gallery-x pb-12 pt-12 md:pb-16 md:pt-20">
              <nav aria-label="Breadcrumb" className="label mb-10 flex flex-wrap gap-2 text-stone">
                <Link to={{ pathname: "/", hash: "#collection" }} className="link-underline">
                  The Collection
                </Link>
                <span aria-hidden>/</span>
                <span aria-current="page">Exhibit {ex.no}</span>
              </nav>

              <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                <div className="lg:col-span-8">
                  <p className="label flex items-center gap-3 text-stone rise">
                    <span className={cn("inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-ink", tone.bg)}>{ex.no}</span>
                    Exhibit {ex.no}
                    {ex.year ? ` · ${ex.year}` : ""}
                  </p>
                  <h1
                    id="exhibit-title"
                    className={cn(
                      "display rise mt-6",
                      ex.title.length > 18 ? "text-[clamp(3rem,7vw,6.5rem)]" : "text-[clamp(3.6rem,12vw,10rem)]",
                    )} style={{ "--delay": "80ms" } as React.CSSProperties}>
                    {ex.title}
                  </h1>
                  <p className={cn("label rise mt-4", tone.ink)} style={{ "--delay": "160ms" } as React.CSSProperties}>
                    {ex.medium}
                  </p>
                </div>
                <p className="rise self-end text-lg leading-relaxed text-ink/85 lg:col-span-4" style={{ "--delay": "240ms" } as React.CSSProperties}>
                  {ex.intro}
                </p>
              </div>
            </div>

            {/* Lead image on a coloured wall */}
            <div className={cn("py-10 md:py-16", tone.soft)}>
              <div className="gallery-x">
                <div className="frame mx-auto max-w-[1100px] p-2 sm:p-3">
                  <img
                    src={ex.cover.src}
                    alt={ex.cover.alt}
                    width={ex.cover.width}
                    height={ex.cover.height}
                    decoding="async"
                    loading="eager"
                    style={{ viewTransitionName: `exhibit-${ex.slug}` } as React.CSSProperties}
                    className="block w-full bg-wall"
                  />
                </div>
                <p className="label mx-auto mt-4 max-w-[1100px] text-stone">{ex.cover.caption}</p>
              </div>
            </div>
          </header>

          {/* Wall label: the facts */}
          <section aria-label="Project details" className="gallery-x py-14 md:py-20">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-8 border-y border-ink/15 py-8 md:grid-cols-4">
              <div>
                <dt className="label text-stone">Status</dt>
                <dd className="mt-2 space-y-1">
                  {ex.badge && (
                    <span className={cn("mb-2 inline-flex items-baseline gap-2 rounded-full px-3 py-1", tone.bg)}>
                      <span className="font-serif text-lg leading-none">{ex.badge.value}</span>
                      <span className="text-xs">{ex.badge.label}</span>
                    </span>
                  )}
                  {ex.statuses.map((s) => (
                    <span key={s} className="block">
                      {s}
                    </span>
                  ))}
                </dd>
              </div>
              {ex.meta?.map((m) => (
                <div key={m.label}>
                  <dt className="label text-stone">{m.label}</dt>
                  <dd className="mt-2 text-[0.95rem] leading-relaxed">{m.value}</dd>
                </div>
              ))}
              <div>
                <dt className="label text-stone">My role</dt>
                <dd className="mt-2 space-y-1">
                  {ex.role.map((r) => (
                    <span key={r} className="block">
                      {r}
                    </span>
                  ))}
                </dd>
              </div>
              <div className="col-span-2 md:col-span-1">
                <dt className="label text-stone">Made with</dt>
                <dd className="mt-2 text-[0.95rem] leading-relaxed">{ex.stack.join(", ")}</dd>
              </div>
              {(ex.links.length > 0 || ex.linkNote) && (
              <div className="col-span-2 md:col-span-1">
                <dt className="label text-stone">{ex.links.length ? "See it for yourself" : "Launch"}</dt>
                <dd className="mt-2 space-y-2">
                  {ex.linkNote && <span className="block text-[0.95rem] leading-relaxed">{ex.linkNote}</span>}
                  {ex.links.map((l) => (
                    <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 font-medium">
                      <span className="link-underline">{l.label}</span>
                      <span aria-hidden>↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ))}
                </dd>
              </div>
              )}

            </dl>
          </section>

          {/* The story, room by room */}
          {ex.sections.map((s, i) => (
            <section key={s.title} aria-labelledby={`${ex.slug}-s${i}`} className="gallery-x pb-20 md:pb-28">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-reveal>
                <div className="lg:col-span-4">
                  <p className={cn("label", tone.ink)}>
                    {String(i + 1).padStart(2, "0")} · {s.kicker}
                  </p>
                </div>
                <div className="lg:col-span-8">
                  <h2 id={`${ex.slug}-s${i}`} className="font-serif text-[clamp(2.1rem,4.4vw,3.6rem)] leading-[1.02]">
                    {s.title}
                  </h2>
                  {s.body?.map((p) => (
                    <p key={p.slice(0, 24)} className="mt-6 max-w-2xl text-[1.08rem] leading-relaxed text-ink/85">
                      {p}
                    </p>
                  ))}
                  {s.steps && (
                    <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1" aria-label="User flow steps">
                      {s.steps.map((step, k) => (
                        <li key={step} className="flex items-center gap-4">
                          <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs", k === 0 || k === s.steps!.length - 1 ? "bg-ink text-cream" : tone.soft)}>
                            {String(k + 1).padStart(2, "0")}
                          </span>
                          <span className="text-[1.02rem]">{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  {s.stat && (
                    <div className={cn("mt-10 flex flex-col gap-6 rounded-sm p-8 sm:flex-row sm:items-center sm:gap-10 md:p-10", tone.soft)}>
                      <div className="shrink-0">
                        <p className="display text-[clamp(4rem,9vw,6.5rem)]">{s.stat.value}</p>
                        <p className={cn("label mt-2", tone.ink)}>{s.stat.label}</p>
                      </div>
                      <p className="max-w-md text-[1.05rem] leading-relaxed text-ink/85">{s.stat.text}</p>
                    </div>
                  )}
                  {s.points && (
                    <dl className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                      {s.points.map((pt) => (
                        <div key={pt.title} className="border-t border-ink/15 pt-4">
                          <dt className="font-semibold">{pt.title}</dt>
                          <dd className="mt-2 leading-relaxed text-ink/80">{pt.text}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </div>
              </div>
              {s.shots && (
                <div
                  className={cn(
                    "mt-14 grid",
                    s.shots.every((x) => x.device === "mobile")
                      ? cn("grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8", s.shots.length >= 4 ? "lg:grid-cols-4" : "md:grid-cols-3 lg:mx-auto lg:max-w-[1000px]")
                      : cn("gap-10", s.shots.length > 1 ? "lg:grid-cols-2" : ""),
                  )}
                >
                  {s.shots.map((shot, j) => (
                    <div key={shot.src} data-reveal style={{ "--delay": `${j * 100}ms` } as React.CSSProperties}>
                      <Frame shot={shot} caption className={s.shots!.length === 1 ? "mx-auto max-w-[1000px]" : ""} />
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Mobile view */}
          {ex.secondary && (
            <section aria-label="On a phone" className={cn("py-16 md:py-24", tone.soft)}>
              <div className="gallery-x grid grid-cols-1 items-center gap-10 md:grid-cols-12">
                <div className="md:col-span-5 md:col-start-2" data-reveal>
                  <p className={cn("label", tone.ink)}>On a phone</p>
                  <p className="mt-4 font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.05]">{ex.secondary.caption}</p>
                </div>
                <div className="md:col-span-4 md:col-start-8" data-reveal>
                  <Frame shot={ex.secondary} className="mx-auto max-w-[300px]" />
                </div>
              </div>
            </section>
          )}

          {/* Continue the walk */}
          <nav aria-label="Next exhibit" className="gallery-x py-20 md:py-28">
            <Link to={`/work/${next.slug}`} viewTransition className="group grid grid-cols-1 items-end gap-6 border-t border-ink/15 pt-8 md:grid-cols-12">
              <div className="md:col-span-8">
                <p className="label text-stone">Next in the collection · Exhibit {next.no}</p>
                <p
                  className={cn(
                    "display mt-4 transition-transform duration-500 ease-gallery group-hover:translate-x-2",
                    next.title.length > 18 ? "text-[clamp(2.6rem,6vw,5rem)]" : "text-[clamp(3rem,9vw,7.5rem)]",
                  )}
                >
                  {next.title} <span aria-hidden className="font-sans text-[0.5em]">→</span>
                </p>
              </div>
              <div className="hidden md:col-span-4 md:block">
                <div className={cn("frame p-3 transition-transform duration-500 ease-gallery group-hover:-translate-y-1", toneStyles[next.tone].bg)}>
                  <img src={next.cover.src} alt="" width={next.cover.width} height={next.cover.height} loading="lazy" decoding="async" className="block w-full bg-wall" />
                </div>
              </div>
            </Link>
          </nav>
        </article>
      </main>
      <Exit />
    </>
  );
};

export default CaseStudy;
