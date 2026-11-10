import { useEffect, useRef, useState } from "react";
import Visitor from "@/components/gallery/Visitor";
import { useSeen } from "@/hooks/use-seen";
import type { VisitorType } from "@/content/visitors";
import { cn } from "@/lib/utils";

export interface JourneyStep {
  title: string; // heading in the panel
  label: string; // short line under the dot
  bubble: string; // what the guide says at this stop
  detail: string; // the fuller explanation in the panel
}

const STEP_MS = 3600; // time spent at each stop on the guided walk
const WALK_MS = 1400; // must match .oc-walker transition

const panelTones = [
  "bg-butter-soft",
  "bg-lavender-soft",
  "bg-mint-soft",
  "bg-blush-soft",
  "bg-peach-soft",
  "bg-coral-soft",
  "bg-mint-soft",
];
const pad = (n: number) => String(n).padStart(2, "0");
const motionOk = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion-ok");

/*
  "How it works" as a walk: the guide strolls from stop to stop at a gentle pace,
  says something at each one, and the panel below explains it.
  Visitors can take over at any time: click a stop, use the arrows, or pause.
*/
const Journey = ({ guide, steps }: { guide: VisitorType; steps: JourneyStep[] }) => {
  const last = steps.length - 1;
  const [ref, seen] = useSeen<HTMLDivElement>(0.35);
  const [at, setAt] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hold, setHold] = useState(false); // paused while the visitor hovers or focuses inside
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const prev = useRef(0);
  const started = useRef(false);

  // Start the guided walk the first time the section comes into view.
  useEffect(() => {
    if (seen && !started.current && motionOk()) {
      started.current = true;
      setPlaying(true);
    }
  }, [seen]);

  // Advance one stop at a time while playing.
  useEffect(() => {
    if (!playing || hold) return;
    if (at >= last) return setPlaying(false);
    const t = window.setTimeout(() => setAt((a) => Math.min(a + 1, last)), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, hold, at, last]);

  // Walk animation and facing direction whenever the stop changes.
  useEffect(() => {
    if (at === prev.current) return;
    setFacing(at < prev.current ? -1 : 1);
    prev.current = at;
    if (!motionOk()) return;
    setWalking(true);
    const t = window.setTimeout(() => setWalking(false), WALK_MS);
    return () => window.clearTimeout(t);
  }, [at]);

  const go = (i: number) => {
    setPlaying(false);
    setAt(Math.max(0, Math.min(last, i)));
  };
  const toggle = () => {
    if (playing) return setPlaying(false);
    if (at >= last) setAt(0);
    setPlaying(true);
  };

  const pos = `${(at + 0.5) * (100 / steps.length)}%`;
  const step = steps[at];

  return (
    <div
      ref={ref}
      className="mt-12"
      onMouseEnter={() => setHold(true)}
      onMouseLeave={() => setHold(false)}
      onFocus={() => setHold(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setHold(false)}
    >
      {/* the walk (wide screens) */}
      <div aria-hidden className="relative hidden h-48 lg:block">
        <div className="absolute inset-x-0 bottom-0 h-[3px] rounded-full bg-ink/10" />
        <div className="oc-walk-line absolute bottom-0 left-0 h-[3px] rounded-full bg-ink" style={{ width: pos }} />
        {steps.map((_, i) => (
          <span
            key={i}
            className={cn(
              "absolute bottom-[-5px] h-[13px] w-[13px] -translate-x-1/2 rounded-full border-2 border-ink transition-colors duration-500",
              i <= at ? "bg-ink" : "bg-cream",
            )}
            style={{ left: `${(i + 0.5) * (100 / steps.length)}%` }}
          />
        ))}
        <div className="oc-walker absolute bottom-1 -translate-x-1/2" style={{ left: pos }}>
          <span
            key={at}
            className={cn(
              "oc-reveal oc-pop is-seen absolute bottom-[calc(100%+0.25rem)] whitespace-nowrap rounded-2xl border-2 border-ink bg-paper px-3 py-1.5 font-serif text-lg italic",
              at > last - 2 ? "right-6 rounded-br-sm" : "left-6 rounded-bl-sm",
            )}
            style={{ animationDelay: walking ? `${WALK_MS - 200}ms` : "0ms" }}
          >
            {step.bubble}
          </span>
          <Visitor v={guide} walking={walking} facing={facing} className="h-32 w-auto" />
        </div>
      </div>

      {/* the stops: always clickable */}
      <ol className="grid gap-2 sm:grid-cols-2 lg:mt-6 lg:grid-cols-7 lg:gap-3">
        {steps.map((s, i) => {
          const lit = i <= at;
          const current = i === at;
          return (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-current={current ? "step" : undefined}
                className={cn(
                  "group flex h-full w-full items-start gap-3 rounded-sm p-3 text-left transition-colors duration-300 lg:flex-col lg:gap-0",
                  current ? "bg-paper shadow-[0_1px_0_rgba(40,38,36,0.12)]" : "hover:bg-paper/70",
                  lit ? "text-ink" : "text-ink/50",
                )}
              >
                <span
                  className={cn(
                    "oc-step-dot flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs lg:mb-3",
                    current ? "scale-110 bg-coral text-ink" : lit ? "bg-ink text-cream" : "bg-ink/10 text-stone group-hover:bg-ink/20",
                  )}
                >
                  {pad(i + 1)}
                </span>
                <span className="leading-snug">{s.label}</span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* what happens at this stop */}
      <div
        className={cn(
          "mt-6 grid gap-6 rounded-sm p-6 transition-colors duration-500 md:grid-cols-12 md:items-center md:p-8",
          panelTones[at % panelTones.length],
        )}
      >
        <div className="md:col-span-8" aria-live="polite">
          <p className="label text-stone">
            Stop {pad(at + 1)} of {pad(steps.length)}
          </p>
          <p key={at} className="oc-reveal oc-rise is-seen display mt-2 text-[clamp(1.8rem,3.4vw,2.8rem)] leading-[1.05]">
            {step.title}
          </p>
          <p
            key={`d${at}`}
            className="oc-reveal oc-rise is-seen mt-3 max-w-xl leading-relaxed text-ink/85"
            style={{ animationDelay: "120ms" }}
          >
            {step.detail}
          </p>
        </div>
        <div className="flex items-center gap-2 md:col-span-4 md:justify-end">
          <button type="button" onClick={() => go(at - 1)} disabled={at === 0} className="journey-btn" aria-label="Previous stop">
            ←
          </button>
          <button type="button" onClick={toggle} className="journey-btn min-w-[9.5rem] px-4" aria-pressed={playing}>
            {playing ? "Pause the walk" : at >= last ? "Walk it again" : "Walk me through"}
          </button>
          <button type="button" onClick={() => go(at + 1)} disabled={at === last} className="journey-btn" aria-label="Next stop">
            →
          </button>
        </div>
        {/* a slim timer so visitors can see the next stop is coming */}
        <div aria-hidden className="h-[3px] overflow-hidden rounded-full bg-ink/10 md:col-span-12">
          {playing && !hold && at < last && (
            <div key={`t${at}`} className="oc-step-timer h-full bg-ink/60" style={{ animationDuration: `${STEP_MS}ms` }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Journey;
