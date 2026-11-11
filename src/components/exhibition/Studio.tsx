import { mailto } from "@/content/site";
import { commissions } from "@/content/services";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

const Studio = () => (
  <section aria-labelledby="studio-title" className="pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-32 md:pt-[calc(var(--header-h)+5rem)]">
    <div className="gallery-x">
      <header className="grid grid-cols-1 gap-8 lg:grid-cols-12" data-reveal>
        <div className="lg:col-span-7">
          <p className="label text-stone">{t("Room 03")}</p>
          <h1 id="studio-title" className="display mt-4 text-[clamp(3.4rem,9vw,7.5rem)]">
            {t("The")} <em className="italic">{t("Studio")}</em>
          </h1>
        </div>
        <p className="max-w-md self-end text-lg leading-relaxed text-ink/85 lg:col-span-5">
          {t(
            "Fera's Studio takes commissions from small businesses, founders and teams who want digital work that looks considered and works properly. Here's what you can commission.",
          )}
          <a href="#prices" className="mt-4 flex w-fit items-center gap-2 text-base font-medium text-ink">
            <span className="link-underline">{t("See the price list")}</span>
            <span aria-hidden>↓</span>
          </a>
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
                {t(c.no)}
              </span>
              <div>
                <h3 className="font-serif text-[clamp(1.9rem,3.2vw,2.75rem)] leading-[1.02]">{t(c.title)}</h3>
                <p className="label mt-3 text-stone">{t(c.for)}</p>
              </div>
            </div>
            <p className="text-[1.05rem] leading-relaxed text-ink/85 md:col-span-4">{t(c.outcome)}</p>
            <div className="md:col-span-3">
              <ul className="space-y-1.5 text-sm text-ink/80">
                {c.includes.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span aria-hidden className="text-stone">
                      +
                    </span>
                    {t(x)}
                  </li>
                ))}
              </ul>
              <a
                href={mailto(`Enquiry: ${c.title}`, `Hi Fera,\n\nI'd like to talk about: ${c.title}.\n\nAbout the project:\n`)}
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium"
              >
                <span className="link-underline">{t("Enquire about this")}</span>
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
