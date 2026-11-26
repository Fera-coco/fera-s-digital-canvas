/* Demo watermark and banner: tiled "FERA'S STUDIO · DEMO" over every page, so screenshots and screen
   recordings carry it. Clicks pass straight through.
   VITE_NO_WATERMARK=1 turns off both the watermark and the demo banner (launch, or clean recordings). */
export const SHOW_WATERMARK = import.meta.env.VITE_NO_WATERMARK !== '1'

const svg = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="220"><text x="170" y="110" text-anchor="middle" dominant-baseline="middle" transform="rotate(-28 170 110)" font-family="Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="2" fill="rgb(30,10,12)">FERA'S STUDIO · DEMO</text></svg>`,
)

export function Watermark() {
  if (!SHOW_WATERMARK) return null
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] select-none opacity-10 print:block"
      style={{backgroundImage: `url("data:image/svg+xml,${svg}")`, backgroundRepeat: 'repeat'}}
    />
  )
}

export function DemoBanner() {
  if (!SHOW_WATERMARK) return null
  return (
    <p className="bg-ink px-4 py-2 text-center text-xs font-medium tracking-wide text-cream/90 sm:text-sm">
      Demo website by{' '}
      <a href="https://ferasportfolio.vercel.app" className="underline decoration-gold underline-offset-2 hover:text-gold">
        Fera's Studio
      </a>
      . Launching soon on its own domain.
    </p>
  )
}
