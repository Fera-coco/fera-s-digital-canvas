# WOGVINTAGE HUB demo

Open Call demo for WOGVINTAGE HUB (unisex vintage clothing, Nigeria). Served at `/demos/wogvintage-hub/`.

```bash
npm install
npm run dev            # local
npm run publish-demo   # build and copy into ../../public/demos/wogvintage-hub
```

- **Watermark:** on by default. `npm run build:clean` (or `VITE_NO_WATERMARK=1`) builds without it for launch or clean recordings.
- **Products:** `src/data/catalog.ts`, shaped like the Sanity schema in the `wogvintage-hub` repo (name, slug, price in naira, size, category, photos, sold, details). Only what the client sent: no prices or sizes yet, so pieces show "Price on request".
- **WhatsApp number:** `settings.whatsappNumber` in the same file. Empty for now, so WhatsApp asks which chat to send to.
- **Ordering:** every piece has "Order on WhatsApp" with the name and price prefilled. Sold pieces stay listed with a Sold stamp and "Notify me about similar". No cart, no payments.
- Every page is `noindex`; `/demos/` is also disallowed in `robots.txt`.
