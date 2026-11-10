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
With Supabase connected, businesses apply through the form on `/open-call` and you manage everything at `/open-call/admin`. Without it, the page falls back to `public/open-call.json` and the email/WhatsApp cards.

1. Create a Supabase project and run `supabase/open-call.sql` in the SQL Editor.
2. In Authentication → Users, add your admin user (email and password). Turn off public sign-ups in Authentication → Providers → Email.
3. Run the insert at the bottom of `supabase/open-call.sql` with your admin email.
4. In Vercel → Settings → Environment Variables, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (Project Settings → API), then redeploy. See `.env.example` for local development.

Anyone can submit an application; only admins can read applications or change spots and settings (row level security). Confirming an application into a spot sets it to `Confirmed` with details hidden until you tick "Share publicly".
