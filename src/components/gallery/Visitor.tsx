import type { VisitorType } from "@/content/visitors";
import { cn } from "@/lib/utils";

interface Props {
  v: VisitorType;
  walking?: boolean;
  facing?: 1 | -1;
  className?: string;
  title?: string;
}

/*
  A small gallery visitor, drawn in SVG.
  Legs and arms swing while walking; a gentle breath while standing.
  Each character gets its own accessory.
*/
const Visitor = ({ v, walking = false, facing = 1, className, title }: Props) => (
  <svg
    viewBox="0 0 120 220"
    className={cn("visitor overflow-visible", walking ? "is-walking" : "is-idle", className)}
    role={title ? "img" : undefined}
    aria-label={title}
    aria-hidden={title ? undefined : true}
  >
    {/* shadow */}
    <ellipse cx="60" cy="214" rx="30" ry="5" fill="#282624" opacity="0.14" />
    <g style={{ transform: `scaleX(${facing})`, transformOrigin: "60px 110px" }}>
      <g className="visitor-body">
        {/* back arm */}
        <g className="visitor-arm-back" style={{ transformOrigin: "60px 92px" }}>
          <rect x="52" y="90" width="12" height="52" rx="6" fill={v.top} stroke="#282624" strokeWidth="3" />
          <circle cx="58" cy="144" r="6" fill={v.skin} stroke="#282624" strokeWidth="3" />
        </g>
        {/* legs */}
        <g className="visitor-leg-back" style={{ transformOrigin: "60px 148px" }}>
          <rect x="50" y="144" width="14" height="60" rx="7" fill={v.bottom} stroke="#282624" strokeWidth="3" />
          <path d="M48 202 h22 a6 6 0 0 1 0 10 h-22 z" fill="#282624" />
        </g>
        <g className="visitor-leg-front" style={{ transformOrigin: "60px 148px" }}>
          <rect x="56" y="144" width="14" height="60" rx="7" fill={v.bottom} stroke="#282624" strokeWidth="3" />
          <path d="M54 202 h22 a6 6 0 0 1 0 10 h-22 z" fill="#282624" />
        </g>
        {/* torso */}
        <rect x="38" y="84" width="44" height="70" rx="18" fill={v.top} stroke="#282624" strokeWidth="3" />
        {/* neck + head */}
        <rect x="54" y="72" width="12" height="16" rx="5" fill={v.skin} stroke="#282624" strokeWidth="3" />
        <circle cx="60" cy="52" r="26" fill={v.skin} stroke="#282624" strokeWidth="3" />
        {/* face: looking the way they walk */}
        <circle cx="70" cy="50" r="2.8" fill="#282624" />
        <path d="M66 62 q5 4 10 0" stroke="#282624" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        <circle cx="76" cy="58" r="3" fill="#F28B79" opacity="0.5" />

        {/* per-character hair and accessories */}
        {v.id === "sketcher" && (
          <>
            <path d="M34 48 q2 -24 26 -24 q24 0 26 22 q-14 -10 -30 -6 q-14 4 -22 8z" fill={v.hair} />
            {/* beret */}
            <path d="M32 34 q10 -16 32 -14 q22 2 22 14 q-26 -4 -54 0z" fill={v.accent} />
            <circle cx="62" cy="18" r="3" fill={v.accent} />
            {/* sketchbook under arm */}
            <rect x="72" y="104" width="24" height="30" rx="2" fill="#F7F4EC" stroke="#282624" strokeWidth="3" transform="rotate(-8 84 119)" />
            <path d="M76 112 h14 M76 118 h10" stroke="#C5B8F1" strokeWidth="2.4" strokeLinecap="round" transform="rotate(-8 84 119)" />
          </>
        )}
        {v.id === "builder" && (
          <>
            <path d="M34 50 q-2 -26 26 -28 q26 0 26 24 q-8 -8 -26 -8 q-18 0 -26 12z" fill={v.hair} />
            {/* cap, worn backwards */}
            <path d="M34 38 q4 -18 26 -18 q22 0 24 18z" fill={v.accent} stroke="#282624" strokeWidth="3" />
            <path d="M34 38 h-12 a4 4 0 0 0 0 6 h14z" fill={v.accent} stroke="#282624" strokeWidth="3" />
            {/* laptop bag strap + bag */}
            <path d="M44 88 L80 150" stroke="#282624" strokeWidth="4" />
            <rect x="74" y="138" width="28" height="22" rx="4" fill="#F28B79" stroke="#282624" strokeWidth="3" />
          </>
        )}
        {v.id === "dreamer" && (
          <>
            {/* puff of locs */}
            <circle cx="40" cy="34" r="12" fill={v.hair} />
            <circle cx="56" cy="24" r="13" fill={v.hair} />
            <circle cx="74" cy="28" r="12" fill={v.hair} />
            <circle cx="36" cy="52" r="10" fill={v.hair} />
            {/* headphones */}
            <path d="M34 50 q0 -32 26 -32 q26 0 26 32" stroke="#282624" strokeWidth="5" fill="none" />
            <rect x="28" y="46" width="12" height="18" rx="5" fill={v.accent} stroke="#282624" strokeWidth="3" />
            {/* tote bag */}
            <path d="M40 92 q-8 22 -4 40" stroke="#282624" strokeWidth="3" fill="none" />
            <rect x="22" y="128" width="26" height="28" rx="3" fill={v.accent} stroke="#282624" strokeWidth="3" />
          </>
        )}
        {v.id === "client" && (
          <>
            {/* neat bun */}
            <path d="M34 48 q0 -26 26 -26 q26 0 26 24 q-10 -10 -26 -10 q-16 0 -26 12z" fill={v.hair} />
            <circle cx="40" cy="26" r="9" fill={v.hair} />
            {/* glasses */}
            <circle cx="70" cy="50" r="7" fill="none" stroke="#282624" strokeWidth="2.6" />
            <path d="M63 50 h-10" stroke="#282624" strokeWidth="2.6" />
            {/* blazer lapels */}
            <path d="M52 86 l8 22 l8 -22" stroke="#282624" strokeWidth="3" fill="#F7F4EC" />
            {/* coffee */}
            <rect x="80" y="122" width="14" height="18" rx="3" fill="#F7F4EC" stroke="#282624" strokeWidth="3" />
            <rect x="80" y="126" width="14" height="5" fill="#C5B8F1" />
          </>
        )}

        {/* front arm */}
        <g className="visitor-arm-front" style={{ transformOrigin: "60px 92px" }}>
          <rect x="56" y="90" width="12" height="52" rx="6" fill={v.top} stroke="#282624" strokeWidth="3" />
          <circle cx="62" cy="144" r="6" fill={v.skin} stroke="#282624" strokeWidth="3" />
        </g>
      </g>
    </g>
  </svg>
);

export default Visitor;
