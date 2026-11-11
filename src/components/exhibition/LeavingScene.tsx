import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Visitor from "@/components/gallery/Visitor";
import { getVisitor, loadVisitor } from "@/content/visitors";
import { mailto } from "@/content/site";
import { cn } from "@/lib/utils";

type Phase = "ask" | "walking" | "closing" | "gone";
const motionOk = () => typeof document !== "undefined" && document.documentElement.classList.contains("motion-ok");

/*
  Leaving the exhibition: a "leave or stay?" prompt, then the visitor strolls to the
  door, steps through, the door swings shut and the lights go down.
*/
const LeavingScene = ({ onStay }: { onStay: () => void }) => {
  const me = useMemo(() => getVisitor(loadVisitor() ?? "dreamer"), []);
  const [phase, setPhase] = useState<Phase>("ask");
  const leaveBtn = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => leaveBtn.current?.focus(), []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && phase === "ask" && onStay();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phase, onStay]);
  useEffect(() => {
    if (phase === "gone") endRef.current?.focus();
  }, [phase]);

  const leave = () => {
    if (!motionOk()) return setPhase("gone");
    setPhase("walking");
    window.setTimeout(() => setPhase("closing"), 2300);
    window.setTimeout(() => setPhase("gone"), 3500);
  };

  const out = phase !== "ask";
  const shut = phase === "closing" || phase === "gone";

  return (
    <div role="dialog" aria-modal="true" aria-label="Leaving the exhibition" className="fixed inset-0 z-[80] overflow-hidden bg-ink text-cream">
      {/* the lights */}
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 bg-black transition-opacity duration-[1200ms]", phase === "gone" ? "opacity-60" : "opacity-0")} />

      {/* the scene */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[62%]">
        <div className="absolute inset-x-0 bottom-0 h-[22%] bg-[#1d1c1a]" />
        {/* the door */}
        <div className="absolute bottom-[22%] right-[14%] h-[62%] w-[min(26vw,220px)]">
          <div className="absolute inset-0 rounded-t-full bg-butter shadow-[0_0_80px_20px_rgba(245,236,167,0.35)]" />
          <div
            className="leave-door absolute inset-0 origin-left rounded-t-full border-4 border-[#3a3633] bg-[#4a4440]"
            style={{ transform: shut ? "perspective(800px) rotateY(0deg)" : "perspective(800px) rotateY(-78deg)" }}
          >
            <span className="absolute right-4 top-1/2 h-3 w-3 rounded-full bg-butter" />
          </div>
          <p className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-butter">Exit</p>
        </div>
        {/* the visitor */}
        <div
          className={cn("leave-walker absolute bottom-[21%] h-[46%]", out ? "leave-walker-out" : "")}
          style={{ left: out ? "calc(86% - min(13vw, 110px) - 40px)" : "14%", opacity: phase === "closing" || phase === "gone" ? 0 : 1 }}
        >
          <Visitor v={me} walking={phase === "walking"} facing={1} className="h-full w-auto" />
        </div>
      </div>

      {/* words */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pt-[calc(var(--header-h)+2rem)] text-center">
        {phase === "ask" && (
          <div className="dialog-in">
            <p className="label text-cream/60">The exit</p>
            <h2 className="display mt-3 text-[clamp(2.6rem,7vw,5rem)]">Leaving already?</h2>
            <p className="mt-4 text-lg text-cream/80">The gallery's still open. Stay a little longer, or head out?</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={onStay} className="btn border border-cream/50 text-cream hover:bg-cream hover:text-ink">
                Stay a little longer
              </button>
              <button ref={leaveBtn} type="button" onClick={leave} className="btn bg-coral text-ink hover:-translate-y-0.5">
                Yes, I'm off 👋
              </button>
            </div>
          </div>
        )}
        {(phase === "walking" || phase === "closing") && (
          <p className="dialog-in font-serif text-3xl italic" role="status">
            {phase === "walking" ? "Heading out…" : "Mind the door!"}
          </p>
        )}
        {phase === "gone" && (
          <div ref={endRef} tabIndex={-1} className="dialog-in outline-none" role="status">
            <p className="display text-[clamp(2.6rem,7vw,5rem)]">See you at the next exhibit ✦</p>
            <p className="mt-4 text-lg text-cream/80">Thanks for walking through Fera's Studio.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/" className="btn bg-coral text-ink">
                Back to the ticket desk
              </Link>
              <a href={mailto("Project enquiry via Fera's Studio", "Hi Fera,\n\nI'd love to talk about:\n")} className="btn border border-cream/50 text-cream hover:bg-cream hover:text-ink">
                Write to the studio ↗
              </a>
              <button type="button" onClick={onStay} className="btn border border-cream/30 text-cream/80 hover:text-cream">
                Actually, let me back in
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeavingScene;
