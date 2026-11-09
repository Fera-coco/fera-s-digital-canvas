/*
  The Collection.
  Every fact here comes from the project's own source code or from Fera directly.
  Nothing is estimated: no metrics, outcomes, clients or testimonials.
  Screenshots in /public/exhibits were captured from each project's real build.
*/

export type Tone = "lavender" | "coral" | "mint" | "butter" | "blush";

export type Status = "Completed" | "Concept" | "In progress" | "Client project" | "Academic" | "Team project";

export interface Shot {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  device?: "desktop" | "mobile";
}

export interface Section {
  kicker: string;
  title: string;
  body?: string[];
  points?: { title: string; text: string }[];
  shots?: Shot[];
}

export interface Exhibit {
  slug: string;
  no: string;
  title: string;
  medium: string; // category, written like a gallery "medium" line
  year: string;
  statuses: Status[];
  tone: Tone;
  summary: string; // one line for the collection wall
  intro: string; // standfirst on the case page
  role: string[];
  stack: string[];
  links: { label: string; href: string }[];
  cover: Shot;
  secondary?: Shot;
  sections: Section[];
}

const desk = (src: string, alt: string, caption: string): Shot => ({
  src: `/exhibits/${src}.webp`,
  alt,
  caption,
  width: 1440,
  height: 900,
  device: "desktop",
});
const phone = (src: string, alt: string, caption: string): Shot => ({
  src: `/exhibits/${src}.webp`,
  alt,
  caption,
  width: 390,
  height: 844,
  device: "mobile",
});

export const exhibits: Exhibit[] = [
  {
    slug: "readsmartly",
    no: "01",
    title: "ReadSmartly",
    medium: "Product design & web app development",
    year: "2026",
    statuses: ["Completed", "Academic"],
    tone: "lavender",
    summary:
      "An AI-assisted study companion that tracks reading, plans the semester around exam dates and quizzes students on their own notes.",
    intro:
      "ReadSmartly is my final-year Computer Science thesis project: a progressive web app that helps university students build a reading habit and arrive at exams prepared. I designed and built it end to end, from the landing page and onboarding to the dashboard, timers and AI features.",
    role: ["Product & UX/UI design", "Front-end development", "Firebase integration", "Thesis research & write-up"],
    stack: ["HTML", "CSS", "JavaScript", "Bootstrap 5", "Firebase Auth", "Cloud Firestore", "Chart.js", "Service worker (PWA)", "Vercel"],
    links: [
      { label: "Visit the live app", href: "https://read-smartly.vercel.app/" },
      { label: "View the code", href: "https://github.com/Fera-coco/readsmartly" },
    ],
    cover: desk(
      "readsmartly-landing",
      "ReadSmartly landing page: headline 'Study smarter. Miss nothing.' beside a dashboard and phone mock-up",
      "Landing page. The hero shows the product rather than describing it.",
    ),
    secondary: phone(
      "readsmartly-mobile",
      "ReadSmartly landing page on a phone",
      "The same entrance, rebuilt for a phone screen.",
    ),
    sections: [
      {
        kicker: "The opportunity",
        title: "Students don't fall behind in one day. They drift.",
        body: [
          "Reading for a course is easy to postpone until the exam is close. ReadSmartly is built around that moment before a student slips: it keeps a visible streak, turns exam dates into daily page targets and redistributes the load automatically when a day is missed.",
        ],
      },
      {
        kicker: "First visit",
        title: "A two-minute onboarding that builds the plan for you",
        body: [
          "New students choose what kind of learner they are, add their courses and take a 60-second reading-speed test with a short comprehension check. The app uses the courses, page counts, exam dates and measured reading speed to generate a personalised daily study plan.",
        ],
        shots: [
          desk(
            "readsmartly-onboarding",
            "ReadSmartly onboarding step one: name, AI assistant name and student type",
            "Onboarding, step one of five: a progress bar shows Welcome, Courses, Speed, Plan and Done.",
          ),
        ],
      },
      {
        kicker: "Design decisions",
        title: "What the product does, and why it is shaped that way",
        points: [
          {
            title: "Readiness, not just activity",
            text: "Each course gets a live exam-readiness score that combines pages completed, reading pace and days remaining, so progress is measured against the deadline that matters.",
          },
          {
            title: "Notes that come back as questions",
            text: "After a session, students write or dictate a short summary. Before the next session, the AI turns those notes into review questions.",
          },
          {
            title: "Low effort to log",
            text: "A reading timer, a Pomodoro mode and voice notes (transcribed in the browser) keep logging a session quick.",
          },
          {
            title: "A dashboard that starts honest",
            text: "Streak, pages, sessions and pages-per-hour start at zero and grow with real use, with a 14-day chart, a monthly calendar and a weekly review that exports to PDF.",
          },
        ],
        shots: [
          desk(
            "readsmartly-readiness",
            "ReadSmartly landing section explaining the exam readiness score with sample course bars",
            "The readiness section of the landing page. Figures shown are sample data in the marketing mock-up.",
          ),
          desk(
            "readsmartly-dashboard",
            "ReadSmartly dashboard for a new user: streak card, stats and pages-read chart",
            "The signed-in dashboard on day one, before any sessions are logged.",
          ),
        ],
      },
    ],
  },
  {
    slug: "sweetsips",
    no: "02",
    title: "SweetSips",
    medium: "Brand website & ordering experience",
    year: "2025",
    statuses: ["Completed", "Team project"],
    tone: "coral",
    summary:
      "A bright, appetite-first website for a Cotonou parfait and smoothie brand, with a full menu, topping customisation and a delivery checkout.",
    intro:
      "SweetSips is a health-focused parfait and smoothie brand based in Cotonou, created as a team venture in which I served as COO. I designed and built its website to introduce the brand, present the menu and let customers place an order.",
    role: ["Web design", "Front-end development", "Team member (COO)"],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Vercel"],
    links: [
      { label: "Visit the live site", href: "https://sweetsips-landing-page-project.vercel.app/" },
      { label: "View the code", href: "https://github.com/Fera-coco/sweetsips-landing-page-project" },
    ],
    cover: desk(
      "sweetsips-hero",
      "SweetSips homepage: a full-bleed photo of fruit parfaits and smoothies with the headline 'Fresh Fruit Parfaits & Smoothies, Made with Love'",
      "The homepage leads with the product itself.",
    ),
    secondary: phone("sweetsips-mobile", "SweetSips homepage on a phone", "Mobile entrance with thumb-reachable cart and chat buttons."),
    sections: [
      {
        kicker: "The brief",
        title: "Make healthy feel like a treat",
        body: [
          "The brand promise is simple: fresh, hygienic, affordable fruit blends for busy people in the city. The site needed to sell that in a glance, then get out of the way so customers could order.",
        ],
      },
      {
        kicker: "Ordering",
        title: "From menu to doorstep on one page",
        points: [
          { title: "A menu you can taste", text: "Parfaits and smoothies are shown with photography, a short description and a price in CFA." },
          { title: "Build your own", text: "Parfaits can be customised with individual toppings, each priced so the total stays clear." },
          { title: "Delivery choices", text: "Checkout offers regular or shared delivery, with the delivery fee shown before the order is placed." },
          { title: "Always a way to ask", text: "Floating cart and chat buttons stay within reach on every screen size." },
        ],
        shots: [
          desk("sweetsips-menu", "SweetSips menu section with parfait cards, prices in CFA and Add to Cart buttons", "The menu: consistent cards, clear prices and one action per item."),
        ],
      },
    ],
  },
  {
    slug: "gamerzverse",
    no: "03",
    title: "GamerzVerse",
    medium: "Web platform, front-end development",
    year: "2025",
    statuses: ["Concept", "Team project"],
    tone: "mint",
    summary:
      "A play-to-earn gaming platform concept featuring Whot, Ludo Naija and Ayo Olopon, with accounts, a wallet and leaderboards.",
    intro:
      "GamerzVerse is a team-built concept for a play-to-earn gaming platform centred on familiar Nigerian games. I worked on the team as a front-end developer, building the interface for the platform's pages and flows.",
    role: ["Front-end development", "Team project"],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Vercel"],
    links: [
      { label: "Visit the live site", href: "https://gamerzverse.vercel.app/" },
      { label: "View the code", href: "https://github.com/Fera-coco/gamerz-verse-play-earn" },
    ],
    cover: desk(
      "gamerzverse-hero",
      "GamerzVerse homepage: a dark hero with a hooded gamer holding a controller and the headline 'Play. Earn. Dominate.'",
      "Homepage. Dark, high-contrast and built around one line.",
    ),
    secondary: phone("gamerzverse-mobile", "GamerzVerse homepage on a phone", "The hero on mobile, with full-width actions."),
    sections: [
      {
        kicker: "The idea",
        title: "Games people already know, on a modern platform",
        body: [
          "Instead of unfamiliar titles, the platform is built around Whot, Ludo Naija and Ayo Olopon, games many players grew up with. Around them sit sign-up with email verification, a dashboard, a wallet, a leaderboard and a help chatbot.",
        ],
      },
      {
        kicker: "Interface",
        title: "Three steps, said three ways",
        body: [
          "Play, earn, withdraw: the same idea repeats in the hero, the how-it-works steps and the game marketplace, so a new visitor understands the platform before signing up.",
        ],
        shots: [
          desk("gamerzverse-how", "GamerzVerse 'How GamerzVerse Works' section with three numbered steps: Play, Earn, Withdraw", "How it works, in three numbered steps."),
          desk("gamerzverse-games", "GamerzVerse game marketplace with cards for Whot, Ludo Naija and Ayo Olopon", "The game marketplace. Player counts and point rates are demo values in the concept."),
        ],
      },
    ],
  },
];

/* Works in the studio: real, ongoing, not yet ready to hang. */
export const inStudio = [
  {
    title: "WE-GO",
    medium: "UX/UI capstone · Mobile app",
    status: "In progress · Academic",
    tone: "butter" as Tone,
    text: "An app that helps people find company for activities when their usual people are unavailable. Plans first, people second.",
  },
  {
    title: "Gracelink Empire",
    medium: "E-commerce website · Client work",
    status: "In development · Client project",
    tone: "blush" as Tone,
    text: "An online store for a Nigerian hair business, with a product catalogue, area-based delivery pricing and bank-transfer checkout.",
  },
];

export const toneStyles: Record<Tone, { bg: string; soft: string; ink: string; hex: string }> = {
  lavender: { bg: "bg-lavender", soft: "bg-lavender-soft", ink: "text-lavender-ink", hex: "#C5B8F1" },
  coral: { bg: "bg-coral", soft: "bg-coral-soft", ink: "text-coral-ink", hex: "#F28B79" },
  mint: { bg: "bg-mint", soft: "bg-mint-soft", ink: "text-mint-ink", hex: "#B9E2D1" },
  butter: { bg: "bg-butter", soft: "bg-butter-soft", ink: "text-butter-ink", hex: "#F5ECA7" },
  blush: { bg: "bg-blush", soft: "bg-blush-soft", ink: "text-blush-ink", hex: "#F2C3D2" },
};

export const getExhibit = (slug?: string) => exhibits.find((e) => e.slug === slug);
