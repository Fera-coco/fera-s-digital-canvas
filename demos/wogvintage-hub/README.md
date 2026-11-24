# WOGVINTAGE HUB demo

Open Call demo for WOGVINTAGE HUB (unisex vintage clothing, Nigeria). Served at `/demos/wogvintage-hub/`.

```bash
npm install
npm run dev            # local
npm run publish-demo   # build and copy into ../../public/demos/wogvintage-hub
npm run dev:blue                 # blue version, local
npm run publish-demo:blue        # build and copy into ../../public/demos/wogvintage-hub-blue
```

**Two looks, one codebase.** Both share the data, WhatsApp helpers, watermark, banner and SEO.
- Crimson and gold (`src/crimson`, `src/pages`, `src/components`): editorial serif, polaroid hero, taped lookbook, film-strip reels, ticket steps. `/demos/wogvintage-hub/`
- Cobalt and sunflower (`src/blue`, `VITE_THEME=blue`): a giant price tag hero with the video in the punched hole, pieces hanging on a drawn clothes rail (or a grid), Rail TV, Worn by you stickers, a receipt for How to order, and the piece details on a big hang tag. `/demos/wogvintage-hub-blue/`

- **Watermark:** on by default. `npm run build:clean` (or `VITE_NO_WATERMARK=1`) builds without it for launch or clean recordings.
- **Products:** `src/data/catalog.ts`, shaped like the Sanity schema in the `wogvintage-hub` repo (name, slug, price in naira, size, category, photos, sold, details). Only what the client sent: no prices or sizes yet, so pieces show "Price on request".
- **WhatsApp number:** `settings.whatsappNumber` in the same file. Empty for now, so WhatsApp asks which chat to send to.
- **Ordering:** every piece has "Order on WhatsApp" with the name and price prefilled. Sold pieces stay listed with a Sold stamp and "Notify me about similar". No cart, no payments.
- Every page is `noindex`; `/demos/` is also disallowed in `robots.txt`.
