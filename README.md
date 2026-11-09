# Fera's Studio: The Digital Exhibition

Portfolio of Peace Oluwaferanmi Segun-Babs (Fera), UX/UI designer and front-end developer.
Live at https://ferasportfolio.vercel.app

## Stack
Vite, React 18, TypeScript, Tailwind CSS, React Router. Fonts are self-hosted via Fontsource
(Instrument Serif, DM Sans, Space Mono). Deployed on Vercel (`vercel.json` handles SPA routes).

## Structure
- `src/content/exhibits.ts`: every project on the site (copy, status, links, screenshots). Edit here to add or change work.
- `src/content/site.ts`: email, socials, room names.
- `src/components/exhibition/`: Header (floor-plan nav), Entrance, Collection, Curator, Studio, Exit, Frame.
- `src/pages/`: home, `/work/:slug` case studies, 404.
- `public/exhibits/`: real screenshots captured from each project's build (WebP).

## Adding an exhibit
1. Drop screenshots into `public/exhibits/` as `.webp` (1440×900 desktop, 780×1688 phone).
2. Add an entry to `exhibits` in `src/content/exhibits.ts`. Only include facts you can stand behind.
3. Add its URL to `public/sitemap.xml`.

## Develop
```sh
npm install
npm run dev
npm run build
```
