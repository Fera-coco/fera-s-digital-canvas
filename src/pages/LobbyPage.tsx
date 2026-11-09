import { Link } from "react-router-dom";
import Entrance from "@/components/exhibition/Entrance";
import NextRoom from "@/components/exhibition/NextRoom";
import { rooms } from "@/content/site";
import { usePageMeta } from "@/hooks/use-exhibition";

/* Room 00. The entrance hall: the headline wall, then four doorways. */
const LobbyPage = () => {
  usePageMeta(
    "Fera's Studio: UX/UI design & web development by Fera",
    "Fera's Studio is the digital exhibition of Peace Oluwaferanmi Segun-Babs (Fera), a UX/UI designer and front-end developer designing and building websites, products and interfaces.",
    "/",
  );
  const doors = rooms.filter((r) => r.id !== "entrance");

  return (
    <main id="main" className="flex min-h-[100svh] flex-col">
      <Entrance />

      <section aria-labelledby="doors-title" className="gallery-x pb-24 md:pb-32">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-t border-ink/15 pt-8" data-reveal>
          <h2 id="doors-title" className="display text-[clamp(2.4rem,5vw,4rem)]">
            Choose a <em className="italic">room</em>
          </h2>
          <p className="label text-stone">Four rooms · walk them in order or wander</p>
        </div>
        <ol className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          {doors.map((r, i) => (
            <li key={r.id} data-reveal style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
              <Link to={r.path} className="group flex h-full flex-col">
                {/* the doorway */}
                <div
                  className="relative flex aspect-[3/4] items-end overflow-hidden rounded-t-full p-5 transition-transform duration-700 ease-gallery group-hover:-translate-y-2 md:p-7"
                  style={{ background: r.tone }}
                >
                  <span
                    aria-hidden
                    className="absolute inset-x-[18%] bottom-0 top-[22%] rounded-t-full bg-cream/40 transition-[transform,opacity] duration-700 ease-gallery group-hover:scale-y-[1.04] group-hover:opacity-70"
                    style={{ transformOrigin: "bottom" }}
                  />
                  <span className={`relative font-mono text-xs ${r.id === "contact" ? "text-ink" : "text-ink/80"}`}>Room {r.no}</span>
                </div>
                <h3 className="display mt-4 text-[clamp(1.8rem,3vw,2.6rem)]">{r.label}</h3>
                <p className="mt-1 text-sm leading-relaxed text-stone">{r.blurb}</p>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium">
                  <span className="link-underline">Enter</span>
                  <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <NextRoom from="entrance" />
    </main>
  );
};

export default LobbyPage;
