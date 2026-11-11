import Visitor from "@/components/gallery/Visitor";
import type { VisitorType } from "@/content/visitors";
import { cn } from "@/lib/utils";
import { t, tf } from "@/lib/i18n";

export type FormPhase = "idle" | "sending" | "sent" | "failed";
export interface FormProgress {
  filled: number;
  total: number;
  phase: FormPhase;
}

const line = ({ filled, total, phase }: FormProgress) => {
  if (phase === "sent") return "Received! Fera will be in touch.";
  if (phase === "sending") return "Posting it now…";
  if (phase === "failed") return "That didn't post. Try WhatsApp?";
  if (filled === 0) return "Grab a card and tell me about your business.";
  if (filled >= total) return "All set. Pop it in the box!";
  if (filled / total >= 0.6) return "Nearly there…";
  return "Good start. Keep going!";
};

/*
  Sits beside the application card: a gallery post box and the visitor's guide,
  who cheers the card along as it's filled in and watches it drop into the slot.
*/
const ApplyCompanion = ({ guide, progress }: { guide: VisitorType; progress: FormProgress }) => {
  const { filled, total, phase } = progress;
  const posted = phase === "sent";
  const ready = filled >= total;

  return (
    <div className="relative">
      {/* speech bubble */}
      <p
        key={line(progress)}
        aria-hidden
        className="oc-reveal oc-pop is-seen relative mx-auto mb-4 w-fit max-w-[16rem] rounded-2xl rounded-bl-sm border-2 border-ink bg-paper px-4 py-2.5 text-center font-serif text-xl italic leading-snug"
      >
        {t(line(progress))}
      </p>

      <div aria-hidden className="relative mx-auto flex h-64 w-full max-w-[19rem] items-end justify-center gap-2">
        {/* the guide */}
        <div className={cn(posted ? "oc-bob" : "")} style={{ "--bob-delay": "0.2s" } as React.CSSProperties}>
          <Visitor v={guide} className="h-40 w-auto" />
        </div>

        {/* the post box */}
        <div className="relative">
          {/* the card, hovering over the slot until it's posted */}
          <div className="absolute -top-14 left-0 right-0 flex justify-center">
            <svg
              viewBox="0 0 80 52"
              className={cn("oc-card w-20", posted && "is-posted", ready && !posted && "drop-shadow-[0_4px_0_rgba(242,139,121,0.6)]")}
            >
              <rect x="2" y="2" width="76" height="48" rx="4" fill="#FFFDF8" stroke="#282624" strokeWidth="2.5" />
              <rect x="10" y="10" width="30" height="5" rx="2" fill="#282624" />
              {Array.from({ length: 4 }).map((_, i) => (
                <rect
                  key={i}
                  x="10"
                  y={21 + i * 6}
                  width={i < Math.ceil((filled / total) * 4) ? 56 : 0}
                  height="3"
                  rx="1.5"
                  fill="#C5B8F1"
                  style={{ transition: "width 0.4s" }}
                />
              ))}
              <circle cx="64" cy="13" r="5" fill={ready ? "#F28B79" : "#E8E2D4"} style={{ transition: "fill 0.3s" }} />
            </svg>
          </div>

          <svg viewBox="0 0 120 150" className={cn("oc-box relative w-32", posted && "is-posted")}>
            <rect x="8" y="10" width="104" height="112" rx="10" fill="#F28B79" stroke="#282624" strokeWidth="3" />
            <path d="M8 34 h104" stroke="#282624" strokeWidth="3" />
            <rect x="28" y="20" width="64" height="7" rx="3.5" fill="#282624" />
            <rect x="22" y="48" width="76" height="30" rx="3" fill="#FFFDF8" stroke="#282624" strokeWidth="2.5" />
            <text x="60" y="60" textAnchor="middle" fontFamily="Space Mono, monospace" fontSize="7.5" letterSpacing="0.6" fill="#282624">
              {t("APPLICATIONS")}
            </text>
            <text x="60" y="72" textAnchor="middle" fontFamily="Space Mono, monospace" fontSize="6.5" letterSpacing="0.6" fill="#8E3324">
              {t("THE OPEN CALL")}
            </text>
            <circle cx="60" cy="98" r="9" fill="#F5ECA7" stroke="#282624" strokeWidth="2.5" />
            <path d="M60 93 v10 M55 98 h10" stroke="#282624" strokeWidth="2" strokeLinecap="round" />
            <rect x="30" y="122" width="10" height="24" fill="#282624" />
            <rect x="80" y="122" width="10" height="24" fill="#282624" />
            <rect x="20" y="144" width="80" height="5" rx="2.5" fill="#282624" opacity="0.15" />
          </svg>

          {posted && (
            <>
              <span className="oc-reveal oc-pop is-seen absolute -right-3 top-2 text-2xl" style={{ animationDelay: "0.9s" }}>
                ✦
              </span>
              <span className="oc-reveal oc-pop is-seen absolute -left-2 top-10 text-lg text-coral" style={{ animationDelay: "1.05s" }}>
                ✦
              </span>
            </>
          )}
        </div>
      </div>

      {/* progress, readable by everyone */}
      <div className="mx-auto mt-5 max-w-[19rem]">
        <div className="flex items-baseline justify-between">
          <p className="label text-stone">{posted ? t("Card posted") : t("Your card")}</p>
          <p className="nums font-mono text-xs text-stone">{posted ? t("Done") : tf("{n} of {m} done", { n: filled, m: total })}</p>
        </div>
        <div className="mt-2 flex gap-1" aria-hidden>
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className={cn("h-2 flex-1 rounded-full transition-colors duration-300", posted || i < filled ? "bg-ink" : "bg-ink/10")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplyCompanion;
