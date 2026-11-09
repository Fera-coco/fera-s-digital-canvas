import { useState } from "react";
import { Link } from "react-router-dom";
import { mailto, site } from "@/content/site";

const Exit = () => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <footer id="exit" aria-labelledby="exit-title" className="relative overflow-hidden bg-ink text-cream">
      <div className="gallery-x pb-10 pt-24 md:pt-36">
        <p className="label text-cream/60">Room 04 · The Exit</p>
        <h2 id="exit-title" className="display mt-6 max-w-5xl text-[clamp(3rem,9vw,8rem)]" data-reveal>
          Thanks for visiting. Shall we make the <em className="italic text-lavender">next exhibit</em> together?
        </h2>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12" data-reveal>
          <div className="lg:col-span-7">
            <p className="max-w-lg text-lg leading-relaxed text-cream/80">
              Tell me about your website, product or idea, and where you'd like it to go. Fera's Studio is open for
              freelance projects and collaborations.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={mailto("Project enquiry via Fera's Studio", "Hi Fera,\n\nI'd love to talk about:\n")}
                className="btn bg-coral text-ink hover:-translate-y-0.5 hover:bg-[#f59d8d]"
              >
                Write to the studio <span aria-hidden>↗</span>
              </a>
              <button type="button" onClick={copy} className="btn border border-cream/40 text-cream hover:bg-cream hover:text-ink">
                {copied ? "Email copied" : "Copy email address"}
              </button>
              <span role="status" aria-live="polite" className="sr-only">
                {copied ? "Email address copied to clipboard" : ""}
              </span>
            </div>
            <a href={`mailto:${site.email}`} className="mt-8 inline-block break-all font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] text-cream/90 underline decoration-cream/30 underline-offset-[6px] hover:decoration-cream">
              {site.email}
            </a>
          </div>

          <div className="lg:col-span-4 lg:col-start-9">
            <p className="label text-cream/60">Elsewhere</p>
            <ul className="mt-4 border-t border-cream/15">
              {site.socials.map((s) => (
                <li key={s.label} className="border-b border-cream/15">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between py-4 text-lg"
                  >
                    {s.label}
                    <span aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                      ↗
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Colophon */}
        <div className="mt-28 flex flex-col gap-4 border-t border-cream/15 pt-6 text-sm text-cream/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.studio} · {site.person}
          </p>
          <p className="label">Set in Instrument Serif, DM Sans &amp; Space Mono · Designed and built by Fera</p>
          <Link to={{ pathname: "/", hash: "#entrance" }} className="link-underline self-start md:self-auto">
            Back to the entrance ↑
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Exit;
