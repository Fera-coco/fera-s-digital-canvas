import portrait from "@/assets/curator.webp";
import { cn } from "@/lib/utils";

const approach = [
  {
    no: "i.",
    title: "Understand before drawing",
    text: "Sitemaps, task flows and wireframes come before colour. I want to know what someone came to do and what might stop them.",
    tone: "bg-butter",
  },
  {
    no: "ii.",
    title: "Design and build in one hand",
    text: "Because I design and develop, the details I sweat over in Figma are the details that ship. Nothing is lost in hand-off.",
    tone: "bg-mint",
  },
  {
    no: "iii.",
    title: "Make it work everywhere",
    text: "Responsive layouts, readable type, clear focus states and fast pages. Polish is part of the job, not an extra.",
    tone: "bg-blush",
  },
];

const provenance = [
  { what: "B.Sc. Computer Science", where: "ESTAM University", when: "Final year" },
  { what: "UX/UI design bootcamp", where: "Research, sitemaps, task flows, wireframes, capstone", when: "Coursework" },
  { what: "IT Intern, front-end & full-stack development", where: "Techverse Global, Cotonou", when: "Internship" },
  { what: "Diploma, Electrical Engineering", where: "Engineering foundation", when: "Completed" },
  {
    what: "Earlier roles",
    where: "Broadcast engineering at Splash FM and Fresh FM; student information officer at St. Louis Africa University",
    when: "Before tech",
  },
];

const materials = ["Figma", "HTML & CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "Supabase", "Firebase", "Git & GitHub", "Vercel"];

const Curator = () => (
  <section id="curator" aria-labelledby="curator-title" className="relative bg-wall/60 py-24 md:py-36">
    <div className="gallery-x">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        {/* Portrait */}
        <div className="lg:col-span-5" data-reveal>
          <p className="label text-stone">Room 02</p>
          <h2 id="curator-title" className="display mt-4 text-[clamp(3rem,8vw,6.5rem)]">
            The Curator
          </h2>
          <figure className="mt-10 max-w-[420px]">
            <div className="frame p-3 sm:p-4" style={{ transform: "rotate(-1.2deg)" }}>
              <img
                src={portrait}
                alt="Fera, smiling, in a black blazer, standing outdoors in front of a leafy garden"
                width={720}
                height={960}
                loading="lazy"
                decoding="async"
                className="block w-full bg-wall"
              />
            </div>
            <figcaption className="mt-6 border-l-2 border-coral pl-4">
              <span className="block font-serif text-xl italic">Portrait of the curator</span>
              <span className="label text-stone">Peace Oluwaferanmi Segun-Babs, called Fera</span>
            </figcaption>
          </figure>
        </div>

        {/* Statement */}
        <div className="lg:col-span-7 lg:pt-36">
          <p className="font-serif text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.12]" data-reveal>
            I design the way I build: with the whole thing in mind, from the first sketch to the{" "}
            <em className="bg-lavender/70 px-1 italic">last pixel on a small phone</em>.
          </p>
          <div className="mt-10 grid gap-6 text-[1.05rem] leading-relaxed text-ink/85 md:grid-cols-2" data-reveal>
            <p>
              I'm Peace Oluwaferanmi Segun-Babs, and most people call me Fera. I'm a UX/UI designer and front-end
              developer in the final year of a B.Sc. in Computer Science, after first training in Electrical
              Engineering.
            </p>
            <p>
              Fera's Studio is where the two halves meet. I research and design in Figma, then build what I've designed
              with modern front-end tools. I'm drawn to work that feels personal and well made, rooted in the people
              it's for.
            </p>
          </div>

          <ol className="mt-14 grid gap-8 sm:grid-cols-3" aria-label="How I work">
            {approach.map((a, i) => (
              <li key={a.title} data-reveal style={{ "--delay": `${i * 90}ms` } as React.CSSProperties}>
                <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-full font-serif text-lg italic", a.tone)}>
                  {a.no}
                </span>
                <h3 className="mt-4 text-lg font-semibold leading-snug">{a.title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/80">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Provenance and materials, set like the back of a gallery catalogue */}
      <div className="mt-24 grid grid-cols-1 gap-14 border-t border-ink/15 pt-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7" data-reveal>
          <h3 className="label text-stone">Provenance</h3>
          <dl className="mt-6">
            {provenance.map((p) => (
              <div key={p.what} className="grid grid-cols-1 gap-1 border-b border-ink/10 py-4 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <dt className="font-medium">{p.what}</dt>
                  <dd className="text-[0.95rem] text-stone">{p.where}</dd>
                </div>
                <dd className="label text-stone sm:text-right">{p.when}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="lg:col-span-4 lg:col-start-9" data-reveal>
          <h3 className="label text-stone">Materials</h3>
          <ul className="mt-6 flex flex-wrap gap-2">
            {materials.map((m) => (
              <li key={m} className="rounded-full border border-ink/20 bg-paper px-3.5 py-1.5 text-sm">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export default Curator;
