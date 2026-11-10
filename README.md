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

## The Open Call (`/open-call`)
Availability and the five project cards live in `public/open-call.json`. Edit it on GitHub and commit; Vercel redeploys automatically.
- A spot only counts as taken at stage `Confirmed` or later (`Discovery`, `Design`, `Development`, `Review`, `Ready to launch`, `Launched`).
- Keep `shareDetails: false` until the business agrees to be shown; until then only the stage appears.
- Add a short `note` for progress updates and an `image` (put it in `public/open-call/`).
- Applications close automatically when all five spots are taken, or set `applicationsOpen` to `false`.

### Applications and admin panel (Supabase)
Businesses apply through the form on `/open-call`; manage everything at `/open-call/admin`.

- Supabase project: `feras-studio-open-call` (schema from `supabase/open-call.sql`, public sign-ups off).
- The public URL and publishable key are in `.env.production` (safe to commit; row level security protects the data).
- Admins are users listed in `open_call_admins`. To add one, create the user in Authentication → Users, then run:
  `insert into public.open_call_admins (user_id) select id from auth.users where email = 'their@email.com';`
- Without the env values, the page falls back to `public/open-call.json` and the email/WhatsApp cards.

Applicants must agree to cover domain and hosting and to the finished website being featured in the portfolio. Anyone can submit an application; only admins can read applications or change spots and settings. Confirming an application into a spot sets it to `Confirmed` with "Share publicly" on (untick it to keep details private until launch).
