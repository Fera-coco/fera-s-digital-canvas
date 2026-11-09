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
      { label: "Visit the live app", href: "https://readsmartly.vercel.app/" },
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
    slug: "we-go",
    no: "02",
    title: "WE-GO",
    medium: "UX/UI design · Mobile app",
    year: "2026",
    statuses: ["In progress", "Academic"],
    tone: "butter",
    summary:
      "A mobile app for finding company when your usual people can't make it. Pick a plan, see who else is going and ask someone to go with you.",
    intro:
      "WE-GO is my UX/UI design capstone: a mobile app that helps people find company for plans and outings when their usual people are unavailable. Its idea is plans first, people second. I designed the product end to end, from onboarding and discovery to requests, chat and hosting a plan, across 30 screens.",
    role: ["UX research & flows", "UI design", "Prototyping in Figma"],
    stack: ["Figma"],
    links: [],
    cover: {
      src: "/exhibits/wego-cover.webp",
      alt: "Four WE-GO phone screens: the purple splash screen, the 'Plans? Better together.' intro, the 'Who's going' list and a chat with Tomi",
      caption: "Splash, intro, who's going and chat. A bright, friendly system built around plans, not profiles.",
      width: 1440,
      height: 900,
      device: "desktop",
    },
    sections: [
      {
        kicker: "The problem",
        title: "The plan is good. Your people just can't come.",
        body: [
          "Most plans fall through for one simple reason: the friends you'd usually go with are busy. WE-GO starts from the plan instead of the person. You find a beach hangout, a film or a brunch, see who else is going, and ask one of them to go with you.",
        ],
      },
      {
        kicker: "First visit",
        title: "An entrance that sets the tone",
        body: [
          "The onboarding is short and warm: a promise ('Plans? Better together.'), sign-up with Apple, Google or email, then a simple profile so others know who they're meeting.",
        ],
        shots: [
          phone("wego-intro", "WE-GO intro screen: 'Plans? Better together.' with photos of friends and stickers reading Movie tonight, Coffee and Beach day", "Intro"),
          phone("wego-signup", "WE-GO sign-up screen: 'Let's get you in.' with Apple, Google and email options", "Sign up"),
          phone("wego-create-profile", "WE-GO create-profile screen with a photo, name and short bio", "Create your profile"),
        ],
      },
      {
        kicker: "Finding company",
        title: "From a plan to a person in four taps",
        body: [
          "Home shows what's happening tonight and this weekend nearby. Open a plan, see who's going and who's interested, check what you have in common, then send a request with a short note.",
        ],
        shots: [
          phone("wego-home", "WE-GO home screen: 'Hey Fera, what's the plan?' with category chips and plans near Calavi, Cotonou", "Home. Photo placeholders mark where imagery goes."),
          phone("wego-whos-going", "WE-GO 'Who's going' list showing people going and interested, with shared interests", "Who's going"),
          phone("wego-profile-tomi", "WE-GO participant profile for Tomi, with shared interests and the plan they're going to", "A participant's profile"),
          phone("wego-send-request", "WE-GO send-request sheet with an optional note and quick-note suggestions", "Send a request"),
        ],
      },
      {
        kicker: "Design decisions",
        title: "Designed for meeting strangers safely",
        points: [
          {
            title: "Both people choose",
            text: "A chat only opens when the other person accepts. Declining is private, so saying no never feels awkward.",
          },
          {
            title: "Public places only",
            text: "Hosts pick a public meeting place that everyone can see, and the app reminds you to let a friend know where you're going. Profiles and chats have report and block options.",
          },
          {
            title: "Common ground up front",
            text: "Every person in a plan shows 'You both like...', so choosing who to ask is based on shared interests, not just a photo.",
          },
          {
            title: "Company size is a real choice",
            text: "One person, a small group or a bigger group: hosts set it, and visitors can filter by it alongside date, distance, category and cost in CFA.",
          },
        ],
        shots: [
          phone("wego-requests", "WE-GO requests screen with Accept and Decline, noting that declining is private", "Requests: declining is private"),
          phone("wego-going-together", "WE-GO 'You're going together!' confirmation with a safety reminder to meet at the plan's public spot", "Matched, with a safety reminder"),
          phone("wego-chat", "WE-GO chat with Tomi, with quick replies: On my way, I'm here, Running late", "Chat with quick replies for the day"),
        ],
      },
      {
        kicker: "Hosting",
        title: "Create a plan in three steps",
        body: [
          "Hosts describe the plan, set when and where, then choose who they're looking for: group size, spots to fill and whether to approve people before they join. A preview shows exactly how others will see it before it goes live.",
        ],
        shots: [
          phone("wego-create-1", "WE-GO create plan step 1: title, category and description", "Step 1: basics"),
          phone("wego-create-2", "WE-GO create plan step 2: date, time, public meeting place and cost", "Step 2: when and where"),
          phone("wego-create-3", "WE-GO create plan step 3: group size, spots, who can join and approval toggle", "Step 3: company"),
          phone("wego-my-plans", "WE-GO My plans screen listing a plan the user is going to and one they're hosting", "My plans"),
        ],
      },
    ],
  },
  {
    slug: "sweetsips",
    no: "03",
    title: "SweetSips",
    medium: "Brand website & ordering experience",
    year: "2025",
    statuses: ["Completed", "Academic"],
    tone: "coral",
    summary:
      "A bright, appetite-first website for a student-run parfait and smoothie brand in Cotonou, with a full menu, topping customisation and a delivery checkout.",
    intro:
      "SweetSips is a health-focused parfait and smoothie brand based in Cotonou, started by a student team as a school entrepreneurship project, with me as COO. I designed and built the website on my own, to introduce the brand, present the menu and let customers place an order.",
    role: ["Sole web designer & developer", "COO of the student team"],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "Vercel"],
    links: [
      { label: "Visit the live site", href: "https://sweetsips-landing-page-project.vercel.app/" },
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
    no: "04",
    title: "GamerzVerse",
    medium: "Web platform, front-end development",
    year: "2025",
    statuses: ["Concept", "Academic"],
    tone: "mint",
    summary:
      "A play-to-earn gaming platform concept featuring Whot, Ludo Naija and Ayo Olopon, with accounts, a wallet and leaderboards.",
    intro:
      "GamerzVerse is a concept for a play-to-earn gaming platform centred on familiar Nigerian games, created by a student team as a school project. I was the team's front-end developer and built the website: its pages, flows and interface.",
    role: ["Website build (front end)", "Front-end developer on the student team"],
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Supabase", "Vercel"],
    links: [
      { label: "Visit the live site", href: "https://gamerzverse.vercel.app/" },
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
  {
    slug: "gracelink-empire",
    no: "05",
    title: "Gracelink Empire",
    medium: "E-commerce website, design & development",
    year: "2026",
    statuses: ["In progress", "Client project"],
    tone: "blush",
    summary:
      "An online store for a Nigerian hair business selling human hair, extensions and ponytails, with guest checkout, order tracking and bank-transfer payments.",
    intro:
      "Gracelink Empire is an e-commerce website I'm designing and building for a Nigerian hair business. It's in active development: the storefront, checkout and the owner's tools are working in a demo while the business's real products and details are connected.",
    role: ["Web design", "Front-end & back-end development", "Client project"],
    stack: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    links: [],
    cover: {
      src: "/exhibits/gracelink-hero.webp",
      alt: "Gracelink Empire homepage: two illustrated hair textures labelled Curls and Sleek, with Shop Human Hair and Shop Ponytails buttons",
      caption: "Homepage. Two illustrated textures, Curls and Sleek, lead straight into the main categories.",
      width: 1520,
      height: 730,
      device: "desktop",
    },
    sections: [
      {
        kicker: "The brief",
        title: "A real shop, without payment-gateway fees",
        body: [
          "The business sells in Naira and wanted to avoid the fees that come with payment gateways. So customers pay by bank transfer and the owner confirms each payment, instead of routing money through a provider. The work is making that flow feel simple for customers and manageable for the owner.",
        ],
      },
      {
        kicker: "Design decisions",
        title: "Built around how the business actually runs",
        points: [
          {
            title: "Delivery priced by area",
            text: "Delivery fees come from dispatch riders' area price lists, so most customers see their fee at checkout. For areas not on the list, the owner quotes a fee after the order and follows up on WhatsApp.",
          },
          {
            title: "Stock that stays honest",
            text: "Items stay on sale until the owner confirms payment. Confirming checks and deducts stock, and refuses if an item has sold out. Unpaid orders cancel automatically after a deadline.",
          },
          {
            title: "No account needed",
            text: "Customers can check out as guests and track every order from a dedicated page.",
          },
          {
            title: "Tools for the owner",
            text: "An admin area for confirming payments, setting delivery fees and keeping on top of orders that need attention.",
          },
        ],
      },
    ],
  },
];

/* Works in the studio: real, ongoing, not yet ready to hang. */
export const inStudio: { title: string; medium: string; status: string; tone: Tone; text: string }[] = [];

export const toneStyles: Record<Tone, { bg: string; soft: string; ink: string; hex: string }> = {
  lavender: { bg: "bg-lavender", soft: "bg-lavender-soft", ink: "text-lavender-ink", hex: "#C5B8F1" },
  coral: { bg: "bg-coral", soft: "bg-coral-soft", ink: "text-coral-ink", hex: "#F28B79" },
  mint: { bg: "bg-mint", soft: "bg-mint-soft", ink: "text-mint-ink", hex: "#B9E2D1" },
  butter: { bg: "bg-butter", soft: "bg-butter-soft", ink: "text-butter-ink", hex: "#F5ECA7" },
  blush: { bg: "bg-blush", soft: "bg-blush-soft", ink: "text-blush-ink", hex: "#F2C3D2" },
};

export const getExhibit = (slug?: string) => exhibits.find((e) => e.slug === slug);
