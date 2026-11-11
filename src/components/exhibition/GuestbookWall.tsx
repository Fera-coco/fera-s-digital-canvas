import { useEffect, useMemo, useState } from "react";
import Visitor from "@/components/gallery/Visitor";
import { getVisitor, loadVisitor } from "@/content/visitors";
import {
  guestbookReady,
  hasSigned,
  loadSignatures,
  NAME_MAX,
  NOTE_MAX,
  signGuestbook,
  validateSignature,
  type Signature,
} from "@/content/guestbook";
import { cn } from "@/lib/utils";
import { locale, t } from "@/lib/i18n";

const slipTones = ["bg-butter-soft", "bg-lavender-soft", "bg-mint-soft", "bg-blush-soft", "bg-peach-soft", "bg-paper"];
const tilt = (i: number) => [-2, 1.5, -1, 2, -1.5, 1][i % 6];

const when = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(locale(), { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
};

/*
  The visitors' book. Visitors sign with a name and an optional note; the signature
  pins itself to the wall straight away. Used on the Exit page and in the gallery walk.
*/
const GuestbookWall = ({ dark = false, limit = 24, compact = false }: { dark?: boolean; limit?: number; compact?: boolean }) => {
  const me = useMemo(() => getVisitor(loadVisitor() ?? "dreamer"), []);
  const [list, setList] = useState<Signature[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "sending" | "signed">("idle");
  const [mine, setMine] = useState<string | null>(null);
  const [trap, setTrap] = useState(""); // honeypot

  useEffect(() => {
    if (!guestbookReady) return setFailed(true);
    let live = true;
    loadSignatures(limit)
      .then((s) => live && setList(s))
      .catch(() => live && setFailed(true));
    return () => {
      live = false;
    };
  }, [limit]);

  const sign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trap) return;
    const problem = validateSignature(name, note);
    if (problem) return setError(problem);
    setError(null);
    setPhase("sending");
    try {
      const s = await signGuestbook(name, note, me.id);
      setList((l) => [s, ...(l ?? [])]);
      setMine(s.id);
      setPhase("signed");
      setName("");
      setNote("");
    } catch {
      setPhase("idle");
      setError("That didn't go through. Please try again in a moment.");
    }
  };

  const ink = dark ? "text-cream" : "text-ink";
  const soft = dark ? "text-cream/70" : "text-stone";
  const field = cn(
    "w-full rounded-sm border px-4 py-3 text-base outline-none transition-colors focus-visible:ring-2 focus-visible:ring-coral",
    dark ? "border-cream/30 bg-cream/5 text-cream placeholder:text-cream/40" : "border-ink/25 bg-paper text-ink placeholder:text-stone/70",
  );

  return (
    <div className={ink}>
      {phase === "signed" ? (
        <div role="status" className={cn("flex items-center gap-4 rounded-sm p-5", dark ? "bg-cream/10" : "bg-butter-soft")}>
          <Visitor v={me} className="h-20 w-auto shrink-0" />
          <div>
            <p className="font-serif text-2xl leading-tight">{t("You're in the book. Thank you for visiting!")}</p>
            <p className={cn("mt-1 text-sm", soft)}>{t("Your signature is pinned to the wall below.")}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={sign} noValidate className={cn("grid gap-3", !compact && "md:grid-cols-[1fr_1.4fr_auto] md:items-start")}>
          <label className="block">
            <span className="sr-only">{t("Your name")}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={NAME_MAX}
              placeholder={t("Your name")}
              autoComplete="name"
              aria-invalid={!!error && !name.trim()}
              className={field}
            />
          </label>
          <label className="block">
            <span className="sr-only">{t("A short note (optional)")}</span>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={NOTE_MAX}
              placeholder={t("A short note (optional)")}
              className={field}
            />
          </label>
          <input
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            className="hidden"
            name="website"
          />
          <button
            type="submit"
            disabled={phase === "sending"}
            className={cn(
              "inline-flex h-[50px] items-center justify-center gap-2 whitespace-nowrap rounded-full px-6 font-medium transition-transform duration-300 ease-gallery hover:-translate-y-0.5 disabled:opacity-60",
              "bg-coral text-ink",
            )}
          >
            {phase === "sending" ? t("Signing…") : t("Sign the book ✍")}
          </button>
          {error && (
            <p role="alert" className={cn("text-sm md:col-span-3", dark ? "text-coral" : "text-coral-ink")}>
              {t(error)}
            </p>
          )}
          {hasSigned() && !error && (
            <p className={cn("text-sm md:col-span-3", soft)}>{t("You've signed before. You're welcome to sign again.")}</p>
          )}
        </form>
      )}

      {/* the wall */}
      <div className="mt-8">
        {failed ? (
          <p className={cn("text-sm", soft)}>{t("The visitors' book is resting right now. Please try again later.")}</p>
        ) : !list ? (
          <p className={cn("label animate-pulse", soft)} role="status">
            {t("Opening the visitors' book…")}
          </p>
        ) : list.length === 0 ? (
          <p className={cn("text-sm", soft)}>{t("No signatures yet. Be the first to sign!")}</p>
        ) : (
          <ul className={cn("grid gap-4", compact ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4")}>
            {list.map((s, i) => (
              <li
                key={s.id}
                className={cn(
                  "relative rounded-sm p-4 text-ink shadow-[0_10px_24px_-18px_rgba(0,0,0,.6)]",
                  slipTones[i % slipTones.length],
                  s.id === mine && "oc-reveal oc-pop is-seen ring-2 ring-coral",
                )}
                style={{ transform: `rotate(${tilt(i)}deg)` }}
              >
                <span aria-hidden className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-coral shadow" />
                <div className="flex items-start gap-3">
                  <Visitor v={getVisitor(s.visitor)} className="h-12 w-auto shrink-0" />
                  <div className="min-w-0">
                    <p className="break-words font-serif text-[1.45rem] italic leading-tight">{t(s.name)}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.12em] text-stone">{when(s.created_at)}</p>
                  </div>
                </div>
                {s.note && <p className="mt-2 break-words text-sm leading-snug text-ink/85">“{t(s.note)}”</p>}
                {s.id === mine && (
                  <span className="absolute -right-2 -top-3 rotate-6 rounded-sm border-2 border-coral-ink bg-paper px-1.5 font-mono text-[10px] uppercase text-coral-ink">
                    {t("You!")}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default GuestbookWall;
