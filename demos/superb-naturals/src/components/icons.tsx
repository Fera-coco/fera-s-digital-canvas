/* Small line icons used instead of emoji. 24px grid, currentColor stroke. */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const Svg = ({ size = 22, children, ...r }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden {...r}>
    {children}
  </svg>
);

export const Sprout = (p: P) => (
  <Svg {...p}>
    <path d="M12 20v-8" />
    <path d="M12 12c0-4 3-6 7-6 0 4-3 6-7 6Z" />
    <path d="M12 14c0-3-2.5-5-6-5 0 3 2.5 5 6 5Z" />
  </Svg>
);
export const Feather = (p: P) => (
  <Svg {...p}>
    <path d="M20 4c-7 0-12 5-12 12v4" />
    <path d="M8 16c5 0 9-3 10-8" />
    <path d="M8 12h6" />
  </Svg>
);
export const Drop = (p: P) => (
  <Svg {...p}>
    <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z" />
    <path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5" />
  </Svg>
);
export const Strand = (p: P) => (
  <Svg {...p}>
    <path d="M6 3c4 3 4 6 0 9s-4 6 0 9" />
    <path d="M13 3c4 3 4 6 1 9" />
    <path d="M15 15c1.5 2 1.5 4-1 6" />
  </Svg>
);
export const Bottle = (p: P) => (
  <Svg {...p}>
    <path d="M10 3h4v3h-4z" />
    <path d="M9 6h6l1 3v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V9l1-3Z" />
    <path d="M8 13h8" />
  </Svg>
);
export const Curl = (p: P) => (
  <Svg {...p}>
    <path d="M12 12a3 3 0 1 1 3-3 5 5 0 1 1-5-5" />
    <path d="M12 12a6 6 0 1 0 6 6" />
  </Svg>
);
export const Braid = (p: P) => (
  <Svg {...p}>
    <path d="M9 3c3 2 3 4 0 6s-3 4 0 6 3 4 0 6" />
    <path d="M15 3c-3 2-3 4 0 6s3 4 0 6-3 4 0 6" />
  </Svg>
);
export const Straight = (p: P) => (
  <Svg {...p}>
    <path d="M7 3v18M12 3v18M17 3v18" />
  </Svg>
);
export const Bubbles = (p: P) => (
  <Svg {...p}>
    <circle cx="9" cy="14" r="5" />
    <circle cx="17" cy="7" r="3" />
    <circle cx="18" cy="16" r="2" />
  </Svg>
);
export const Truck = (p: P) => (
  <Svg {...p}>
    <path d="M3 6h11v10H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Svg>
);
export const Bank = (p: P) => (
  <Svg {...p}>
    <path d="M3 9 12 4l9 5" />
    <path d="M5 10v8M10 10v8M14 10v8M19 10v8" />
    <path d="M3 20h18" />
  </Svg>
);
export const Leaf = (p: P) => (
  <Svg {...p}>
    <path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15" />
    <path d="M5 19 13 11" />
  </Svg>
);
export const Check = (p: P) => (
  <Svg {...p}>
    <path d="m5 12 4.5 4.5L19 7" />
  </Svg>
);
export const Heart = ({ filled, ...p }: P & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
  </Svg>
);
export const Globe = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
  </Svg>
);
