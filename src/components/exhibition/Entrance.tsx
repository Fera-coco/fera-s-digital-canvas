import { Link } from "react-router-dom";
import { exhibits, getExhibit, toneStyles, type Shot } from "@/content/exhibits";
import { cn } from "@/lib/utils";

const rs = getExhibit("readsmartly")!;
const gz = getExhibit("gamerzverse")!;
const wg = getExhibit("we-go")!;
const wgPhone: Shot = { src: "/exhibits/wego-intro.webp", alt: "", caption: "", width: 390, height: 847, device: "mobile" };

/* Three works hung on the entrance wall, each with a pinned wall label. */
const hung = [
  { ex: rs, shot: rs.cover, cls: "left-0 top-4 w-[84%]", tilt: "-1.5deg", delay: 250 },
  { ex: gz, shot: gz.cover, cls: "right-0 top-[47%] w-[60%]", tilt: "2deg", delay: 450 },
  { ex: wg, shot: wgPhone, cls: "left-[3%] top-[58%] w-[25%]", tilt: "-3deg", delay: 650 },
];

const Entrance = () => (
  <section id="entrance" aria-labelledby="entrance-title" className="relative overflow-hidden pt-[var(--header-h)]">
    <div className="gallery-x grid min-h-[calc(100svh-var(--header-h))] grid-cols-1 items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-8 lg:pb-20">
      {/* Wall text */}
      <div className="lg:col-span-7">
        <p className="label rise mb-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-stone" style={{ "--delay": "0ms" } as React.CSSProperties}>
          <span className="inline-block h-2 w-2 rounded-full bg-coral" aria-hidden />
          Now showing
          <span aria-hidden>·</span>
          Fera's Studio
          <span aria-hidden>·</span>
          Design &amp; development
        </p>

        <h1 id="entrance-title" className="display text-[clamp(3.4rem,10.5vw,9.25rem)]">
          <span className="rise block" style={{ "--delay": "80ms" } as React.CSSProperties}>
            Designed
          </span>
          <span className="rise block" style={{ "--delay": "180ms" } as React.CSSProperties}>
            with care,
          </span>
          <span className="rise block" style={{ "--delay": "280ms" } as React.CSSProperties}>
            <em className="italic">built</em>{" "}
            to work.
          </span>
        </h1>

        <p className="rise mt-8 max-w-xl text-lg leading-relaxed text-ink/85 md:text-xl" style={{ "--delay": "420ms" } as React.CSSProperties}>
          Welcome to my digital exhibition. I'm Fera, a UX/UI designer and front-end developer. At Fera's Studio I
          design websites, products and interfaces, then build them into fast, responsive experiences people enjoy
          using.
        </p>

        <div className="rise mt-10 flex flex-wrap items-center gap-3" style={{ "--delay": "520ms" } as React.CSSProperties}>
          <Link to={{ pathname: "/", hash: "#collection" }} className="btn-ink group">
            Enter the collection
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
          </Link>
          <Link to={{ pathname: "/", hash: "#exit" }} className="btn-line">
            Start a project
          </Link>
        </div>

        <dl className="rise mt-14 grid max-w-xl grid-cols-3 gap-4 border-t border-ink/15 pt-5" style={{ "--delay": "640ms" } as React.CSSProperties}>
          {[
            ["On view", String(exhibits.length).padStart(2, "0")],
            ["Disciplines", "UX · UI · Web"],
            ["Admission", "Free"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="label text-stone">{k}</dt>
              <dd className="mt-1 font-serif text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* The entrance wall */}
      <div className="relative lg:col-span-5" aria-label="Works from the collection">
        <div className="relative mx-auto aspect-[10/11] w-full max-w-[560px] mb-16 lg:mb-0 lg:max-w-none">
          {hung.map(({ ex, shot, cls, tilt, delay }) => (
            <Link
              key={ex.slug + shot.src}
              to={`/work/${ex.slug}`}
              viewTransition
              className={cn("hang group absolute block focus-visible:outline-offset-8", cls)}
              style={{ "--tilt": tilt, "--delay": `${delay}ms` } as React.CSSProperties}
              aria-label={`Exhibit ${ex.no}: ${ex.title}`}
            >
              {/* picture wire */}
              <span aria-hidden className="absolute -top-5 left-1/2 h-5 w-px -translate-x-1/2 bg-ink/30" />
              <span aria-hidden className="absolute -top-6 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-ink/50" />
              <div
                className={cn(
                  "frame transition-transform duration-500 ease-gallery group-hover:-translate-y-1.5 group-hover:rotate-0",
                  toneStyles[ex.tone].bg,
                  "p-2.5 sm:p-3",
                )}
              >
                <img
                  src={shot.src}
                  alt=""
                  width={shot.width}
                  height={shot.height}
                  loading="eager"
                  fetchPriority={ex.no === "01" ? "high" : "auto"}
                  decoding="async"
                  className="block w-full bg-wall"
                />
              </div>
              <span
                className={cn(
                  "label absolute -bottom-7 whitespace-nowrap text-stone transition-colors group-hover:text-ink",
                  shot.device === "mobile" ? "left-0" : "right-0",
                )}
              >
                {ex.no} · {ex.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Entrance;
