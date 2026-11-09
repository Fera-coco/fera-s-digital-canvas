import { mailto } from "@/content/site";
import { cn } from "@/lib/utils";

const commissions = [
  {
    no: "A",
    title: "Website design & development",
    for: "For businesses and brands that need a new website",
    outcome:
      "Look credible from the first visit, explain clearly what you offer and make it easy for customers to get in touch, book or order.",
    includes: ["Site structure & content plan", "Visual design in Figma", "Responsive build in React or Next.js", "Launch on Vercel"],
    tone: "bg-coral",
  },
  {
    no: "B",
    title: "UX/UI & product design",
    for: "For apps, tools and digital products",
    outcome: "Work out what your users need, then turn it into flows and screens that a team can build with confidence.",
    includes: ["User research & sitemaps", "Task flows & wireframes", "High-fidelity UI", "Clickable prototypes"],
    tone: "bg-lavender",
  },
  {
    no: "C",
    title: "Website improvements & redesigns",
    for: "For sites that exist but aren't pulling their weight",
    outcome: "Find what's confusing or broken, fix it on every screen size and bring the look in line with the quality of your business.",
    includes: ["UX & content review", "Responsive & accessibility fixes", "Visual refresh or full redesign"],
    tone: "bg-mint",
  },
  {
    no: "D",
    title: "Landing pages & ordering flows",
    for: "For launches, campaigns and single products",
    outcome: "One focused page with one clear action, whether that's signing up, enquiring or placing an order.",
    includes: ["Single-page design & build", "Enquiry or order flow", "Performance & SEO basics"],
    tone: "bg-butter",
  },
];

const Studio = () => (
  <section id="studio" aria-labelledby="studio-title" className="py-24 md:py-36">
    <div className="gallery-x">
      <header className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-reveal>
        <div className="lg:col-span-7">
          <p className="label text-stone">Room 03</p>
          <h2 id="studio-title" className="display mt-4 text-[clamp(3rem,8vw,6.5rem)]">
            The Studio
          </h2>
        </div>
        <p className="max-w-md self-end text-lg leading-relaxed text-ink/85 lg:col-span-5">
          Fera's Studio takes commissions from small businesses, founders and teams who want digital work that looks
          considered and works properly. Here's what you can commission.
        </p>
      </header>

      <ol className="mt-16 border-t border-ink/20 md:mt-24">
        {commissions.map((c, i) => (
          <li
            key={c.no}
            className="group grid grid-cols-1 gap-6 border-b border-ink/20 py-10 md:grid-cols-12 md:gap-8 md:py-12"
            data-reveal
            style={{ "--delay": `${i * 60}ms` } as React.CSSProperties}
          >
            <div className="flex items-start gap-5 md:col-span-5">
              <span
                className={cn(
                  "mt-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-mono text-sm transition-transform duration-500 ease-gallery group-hover:rotate-[-12deg] group-hover:scale-110",
                  c.tone,
                )}
                aria-hidden
              >
                {c.no}
              </span>
              <div>
                <h3 className="font-serif text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.02]">{c.title}</h3>
                <p className="label mt-3 text-stone">{c.for}</p>
              </div>
            </div>
            <p className="text-[1.05rem] leading-relaxed text-ink/85 md:col-span-4">{c.outcome}</p>
            <div className="md:col-span-3">
              <ul className="space-y-1.5 text-sm text-ink/80">
                {c.includes.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden className="text-stone">
                      +
                    </span>
                    {x}
                  </li>
                ))}
              </ul>
              <a
                href={mailto(`Enquiry: ${c.title}`, `Hi Fera,\n\nI'd like to talk about: ${c.title}.\n\nAbout the project:\n`)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
              >
                <span className="link-underline">Enquire about this</span>
                <span aria-hidden>↗</span>
              </a>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default Studio;
