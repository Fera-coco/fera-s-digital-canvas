import { Link } from "react-router-dom";
import { nextRoom, site, type RoomId } from "@/content/site";

/* The doorway at the end of every room, plus a small colophon. */
const NextRoom = ({ from }: { from: RoomId }) => {
  const next = nextRoom(from);
  return (
    <footer className="mt-auto">
      <div className="gallery-x">
        <Link to={next.path} className="group block border-t border-ink/15 py-14 md:py-20">
          <p className="label flex items-center gap-3 text-stone">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: next.tone }} aria-hidden />
            Next room · {next.no}
          </p>
          <div className="mt-4 flex items-end justify-between gap-6">
            <p className="display text-[clamp(3.2rem,11vw,9.5rem)] transition-transform duration-700 ease-gallery group-hover:translate-x-3">
              {next.label}
            </p>
            <span
              aria-hidden
              className="mb-4 flex h-16 w-16 shrink-0 items-center justify-center rounded-full text-2xl transition-transform duration-500 ease-gallery group-hover:-rotate-45 md:h-24 md:w-24 md:text-3xl"
              style={{ background: next.tone, color: next.id === "entrance" ? "#F7F4EC" : "#282624" }}
            >
              →
            </span>
          </div>
          <p className="mt-3 max-w-md text-stone">{next.blurb}</p>
        </Link>
      </div>
      <div className="gallery-x flex flex-col gap-3 border-t border-ink/15 py-6 text-sm text-stone md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} {site.studio} · {site.person}
        </p>
        <p className="label">Set in Instrument Serif, DM Sans &amp; Space Mono · Designed and built by Fera</p>
        <a href={`mailto:${site.email}`} className="link-underline">
          {site.email}
        </a>
      </div>
    </footer>
  );
};

export default NextRoom;
