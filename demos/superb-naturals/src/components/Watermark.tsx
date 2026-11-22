/* Demo watermark: tiled "Fera's Studio · Demo" over every page so any
   screenshot or recording carries it. Clicks pass straight through.
   Remove (set SHOW to false) when the client approves and the site launches. */
const SHOW = import.meta.env.VITE_NO_WATERMARK !== "1";

const svg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220"><text x="170" y="110" text-anchor="middle" dominant-baseline="middle" transform="rotate(-28 170 110)" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2" fill="rgba(17,17,17,0.10)">FERA'S STUDIO · DEMO</text></svg>`,
);

export default function Watermark() {
  if (!SHOW) return null;
  return (
    <div
      aria-hidden
      className="keep-round pointer-events-none fixed inset-0 z-[60] select-none print:block"
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundRepeat: "repeat" }}
    />
  );
}
