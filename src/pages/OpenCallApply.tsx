import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ApplyForm from "@/components/open-call/ApplyForm";
import ApplyCompanion, { type FormProgress } from "@/components/open-call/ApplyCompanion";
import { backendReady } from "@/lib/supabase";
import {
  APPLY_EMAIL,
  applyByEmail,
  applyByWhatsApp,
  summarise,
  TOTAL_SPOTS,
  useOpenCall,
  WHATSAPP_DISPLAY,
} from "@/content/openCall";
import { getVisitor, loadVisitor } from "@/content/visitors";
import { usePageMeta } from "@/hooks/use-exhibition";
import { PAGES } from "@/content/seo";
import { t, tf } from "@/lib/i18n";

/* The application on its own page: a short link to send to businesses, straight to the form. */
const points = [
  ["Free", "Fera's Studio designs and builds your website with no development fee."],
  ["You cover", "Your domain name and hosting, paid directly to the provider."],
  ["In return", "Your website is featured in the Fera's Studio portfolio."],
] as const;

const OpenCallApply = () => {
  usePageMeta(PAGES.openCallApply);
  const state = useOpenCall();
  const sum = state.status === "ready" ? summarise(state.data) : null;
  const guide = useMemo(() => getVisitor(loadVisitor() ?? "client"), []);
  const [progress, setProgress] = useState<FormProgress>({ filled: 0, total: 11, phase: "idle" });
  const left = sum ? TOTAL_SPOTS - sum.taken : null;

  return (
    <main id="main" className="bg-wall pb-24 pt-[calc(var(--header-h)+2.5rem)] md:pt-[calc(var(--header-h)+4rem)]">
      <div className="gallery-x">
        <Link to="/open-call" className="link-underline text-sm text-stone">
          <span aria-hidden>←</span> {t("The Open Call")}
        </Link>

        <header className="mt-6 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="label text-stone">{t("The Open Call · Application")}</p>
            <h1 className="display mt-3 text-[clamp(2.6rem,7vw,5rem)] leading-[0.95]">{t("Apply for a free website")}</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/85">
              {t("Three short cards, about three minutes. Fera's Studio reviews every application and replies by WhatsApp or email.")}
            </p>
            {left !== null && left > 0 && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-paper px-4 py-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-coral" aria-hidden />
                {tf("{n} of {m} spots still open", { n: left, m: TOTAL_SPOTS })}
              </p>
            )}
          </div>
          <ul className="grid gap-3 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
            {points.map(([k, v]) => (
              <li key={k} className="bg-paper p-4">
                <p className="label text-coral-ink">{t(k)}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/85">{t(v)}</p>
              </li>
            ))}
          </ul>
        </header>

        <section aria-label={t("Application")} className="mt-12">
          {sum && !sum.open ? (
            <div className="max-w-2xl bg-paper p-8">
              <p className="display text-4xl">{t("Applications are closed.")}</p>
              <p className="mt-3 leading-relaxed text-ink/85">
                {t("All five spots have been taken. You can still")}{" "}
                <a href={`mailto:${APPLY_EMAIL}`} className="underline underline-offset-4">
                  {t("write to Fera's Studio")}
                </a>{" "}
                {t("about a paid project.")}
              </p>
            </div>
          ) : backendReady ? (
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-8">
                <ApplyForm onProgress={setProgress} />
              </div>
              <div className="hidden self-stretch lg:col-span-4 lg:block">
                <div className="sticky top-[calc(var(--header-h)+3rem)]">
                  <ApplyCompanion guide={guide} progress={progress} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <a href={applyByWhatsApp} target="_blank" rel="noopener noreferrer" className="btn-ink">
                {t("Apply on WhatsApp")} ({WHATSAPP_DISPLAY})
              </a>
              <a href={applyByEmail} className="btn-line">
                {t("Apply by email")}
              </a>
            </div>
          )}
          <p className="mt-8 max-w-3xl border-l-4 border-coral bg-paper p-4 text-sm leading-relaxed">
            <strong className="font-semibold">{t("Applications are subject to review and confirmation.")}</strong>{" "}
            {t("Sending an application doesn't reserve a spot. Read the full details and the small print on")}{" "}
            <Link to="/open-call" className="underline underline-offset-4">
              {t("the Open Call page")}
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
};

export default OpenCallApply;
