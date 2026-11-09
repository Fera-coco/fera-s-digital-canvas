/*
  The Collection.
  Every fact here comes from the project's own source code or from Fera directly.
  Nothing is estimated: no metrics, outcomes, clients or testimonials.
  Screenshots in /public/exhibits were captured from each project's real build.
*/

export type Tone = "lavender" | "coral" | "mint" | "butter" | "blush" | "peach";

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
  steps?: string[];
  stat?: { value: string; label: string; text: string };
}

export interface Exhibit {
  slug: string;
  no: string;
  title: string;
  medium: string; // category, written like a gallery "medium" line
  year?: string;
  badge?: { value: string; label: string };
  meta?: { label: string; value: string }[];
  statuses: Status[];
  tone: Tone;
  summary: string; // one line for the collection wall
  intro: string; // standfirst on the case page
  role: string[];
  stack: string[];
  links: { label: string; href: string }[];
  linkNote?: string;
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
    slug: "temu-product-comparison",
    no: "03",
    title: "A Better Way to Compare Before Buying",
    medium: "UX/UI design · Product design · Feature improvement",
    statuses: ["Concept", "Academic"],
    tone: "peach",
    badge: { value: "100/100", label: "Capstone score" },
    meta: [
      { label: "Product context", value: "Temu mobile shopping (proposed concept, not a live feature)" },
      { label: "Product explored", value: "Samsung Galaxy Buds" },
      { label: "Duration", value: "2 weeks" },
    ],
    summary:
      "A proposed comparison feature for Temu that lets shoppers put similar products side by side instead of jumping between listings. Explored through Samsung Galaxy Buds.",
    intro:
      "This capstone explores one small but real moment in online shopping: choosing between several similar products. Instead of redesigning Temu, I proposed a comparison feature that fits into the existing journey, then worked it through research, a user flow and low-fidelity wireframes.",
    role: ["User research", "User flow", "Low-fidelity wireframes"],
    stack: ["Figma", "Tally (survey)"],
    links: [],
    cover: {
      src: "/exhibits/temu-cover.webp",
      alt: "Four low-fidelity wireframes: search results, a comparison list, a side-by-side comparison table and a choose-your-product screen",
      caption: "Low-fidelity wireframes: search, comparison list, side-by-side compare and choose.",
      width: 1440,
      height: 900,
      device: "desktop",
    },
    sections: [
      {
        kicker: "The background",
        title: "More choice doesn't always make choosing easier",
        body: [
          "A shopper looking for Samsung Galaxy Buds on Temu finds several similar listings. To understand each one's price, ratings and specifications, they have to open them one by one and remember what they saw on the last page.",
          "That back and forth adds effort right at the moment of decision. The project focuses on improving just this part of the shopping experience.",
        ],
      },
      {
        kicker: "Understanding the problem",
        title: "Asking shoppers how they compare today",
        body: [
          "I ran a short online survey with four Temu users about how they shop, what gets in the way and what they'd like to see improved. The research objective was to understand what stops people from choosing confidently between similar products.",
        ],
        points: [
          { title: "3 of 4", text: "use Temu mainly for deals and discounts." },
          { title: "2 of 4", text: "reported difficulty comparing product options." },
          { title: "2 of 4", text: "rated the current comparison experience as dissatisfying." },
          {
            title: "Issues they raised",
            text: "Comparing specifications and prices across products, cluttered navigation, trusting reviews and judging quality, and concerns around checkout, delivery and returns.",
          },
        ],
      },
      {
        kicker: "The problem",
        title: "How might we help shoppers compare similar products without switching between listings?",
        body: [
          "When product information is spread across separate pages, shoppers compare details manually and rely on memory. That makes it harder to see the differences quickly and to know which product suits them best.",
        ],
      },
      {
        kicker: "The opportunity",
        title: "Add one feature, don't rebuild the store",
        body: [
          "The proposed solution lets shoppers select several products and view them side by side, focusing on price, customer ratings, specifications and other relevant details. The aim is to make differences obvious and reduce the effort of weighing up alternatives.",
        ],
      },
      {
        kicker: "User flow",
        title: "The proposed journey, from browsing to checkout",
        steps: [
          "Browse or search products",
          "Find a product of interest",
          "Select products to compare",
          "Open the comparison view",
          "Review side by side",
          "Choose the preferred option",
          "Continue to checkout",
        ],
        body: [
          "If the shopper isn't satisfied after comparing, the flow loops back to the comparison list so they can add or remove items.",
        ],
        shots: [
          {
            src: "/exhibits/temu-flow.webp",
            alt: "Temu user flow diagram: open Temu, search or browse, view results, select items to compare, open comparison list, compare side by side, choose preferred product (loop back if not satisfied), add to cart, checkout, place order, order confirmation",
            caption: "The user flow, with a loop back to the comparison list when the shopper isn't satisfied.",
            width: 2000,
            height: 836,
            device: "desktop",
          },
        ],
      },
      {
        kicker: "UX approach",
        title: "Why the comparison works the way it does",
        points: [
          {
            title: "Deliberate product selection",
            text: "Shoppers tick products straight from search results into a comparison list, so they never have to remember listings they've already seen.",
          },
          {
            title: "Side by side",
            text: "Putting products in one view makes differences visible at a glance, without repeatedly navigating between pages.",
          },
          {
            title: "A scannable hierarchy",
            text: "Price, rating and reviews come first, then specifications like Bluetooth version, noise cancellation, battery life and water resistance, in consistent rows that are easy to scan.",
          },
          {
            title: "A clear way out",
            text: "The comparison ends in a decision: select a product, add it to the cart and continue to checkout, or keep shopping.",
          },
        ],
      },
      {
        kicker: "Wireframes",
        title: "Selecting, comparing and choosing",
        shots: [
          {
            src: "/exhibits/temu-search.webp",
            alt: "Wireframe: search results for wireless earbuds with a select circle on each product",
            caption: "Select from search results",
            width: 390,
            height: 847,
            device: "mobile",
          },
          {
            src: "/exhibits/temu-list.webp",
            alt: "Wireframe: comparison list of three Galaxy Buds with Compare Now (3) and Continue Shopping",
            caption: "Comparison list",
            width: 390,
            height: 847,
            device: "mobile",
          },
          {
            src: "/exhibits/temu-compare.webp",
            alt: "Wireframe: side-by-side comparison of three products by price, rating, reviews, Bluetooth, noise cancellation, battery life and water resistance",
            caption: "Side-by-side comparison",
            width: 390,
            height: 847,
            device: "mobile",
          },
          {
            src: "/exhibits/temu-choose.webp",
            alt: "Wireframe: choose your product, with one product selected and Add to cart",
            caption: "Choose and add to cart",
            width: 390,
            height: 847,
            device: "mobile",
          },
        ],
      },
      {
        kicker: "Into checkout",
        title: "The decision carries straight through",
        shots: [
          {
            src: "/exhibits/temu-cart.webp",
            alt: "Wireframe: shopping cart with the chosen Galaxy Buds and accessories",
            caption: "Cart",
            width: 390,
            height: 847,
            device: "mobile",
          },
          {
            src: "/exhibits/temu-checkout.webp",
            alt: "Wireframe: checkout with shipping address, payment method and totals",
            caption: "Checkout",
            width: 390,
            height: 847,
            device: "mobile",
          },
          {
            src: "/exhibits/temu-confirmation.webp",
            alt: "Wireframe: order placed successfully, with order details and estimated delivery",
            caption: "Order confirmation",
            width: 390,
            height: 847,
            device: "mobile",
          },
        ],
      },
      {
        kicker: "Outcome",
        title: "A low-fidelity concept for comparing with confidence",
        body: [
          "The project resulted in a low-fidelity UX concept for a product comparison feature within Temu's shopping experience, bringing the relevant information together so shoppers can weigh alternatives in one place.",
        ],
        stat: {
          value: "100/100",
          label: "Capstone assessment",
          text: "The assessment recognised the clarity of the problem understanding, user needs, user flow and wireframing.",
        },
      },
      {
        kicker: "What I learned",
        title: "Small fixes can matter as much as new products",
        body: [
          "This project reinforced how valuable it is to look for friction inside experiences that already exist. A useful feature doesn't have to be a whole new product. Sometimes improving one specific interaction is what makes the experience more convenient.",
          "It also showed me how closely problem definition, user needs, information organisation and interface design depend on each other.",
        ],
      },
    ],
  },
  {
    slug: "sweetsips",
    no: "04",
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
    no: "05",
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
    no: "06",
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
    linkNote: "Not public yet. The live site will be linked here at launch.",
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
  peach: { bg: "bg-peach", soft: "bg-peach-soft", ink: "text-peach-ink", hex: "#F6C4A3" },
};

export const getExhibit = (slug?: string) => exhibits.find((e) => e.slug === slug);
