/*
  The Fera's Studio price list (introductory guide prices).
  Source: "Fera's Studio Services and Pricing Catalogue". Edit prices here and the
  Studio room updates. ngn and xof are whole numbers; set from: true for "From …" prices
  and per: "month" for monthly services.
*/

import { WHATSAPP_NUMBER } from "./openCall";

export type Currency = "NGN" | "XOF";

export interface PriceItem {
  name: string;
  includes: string;
  ngn: number;
  xof: number;
  from?: boolean;
  per?: "month";
}

export interface PriceGroup {
  id: string;
  no: string;
  verb: string; // BUILD, IMPROVE…
  title: string;
  for: string;
  tone: string; // tailwind bg class
  items: PriceItem[];
  extras?: { title: string; items: PriceItem[] };
  notes: string[];
}

export const priceGroups: PriceGroup[] = [
  {
    id: "build",
    no: "01",
    verb: "Build",
    title: "Websites & digital platforms",
    for: "For businesses that need a professional website or a better way to present and sell their products online.",
    tone: "bg-coral",
    items: [
      { name: "Landing page", includes: "A focused, single-page website for a service, campaign or offer.", ngn: 90000, xof: 40000 },
      { name: "Starter business website", includes: "Up to 4 pages, responsive layout, contact and enquiry links, basic on-page SEO.", ngn: 180000, xof: 80000 },
      { name: "Business Website Plus", includes: "Up to 7 pages, expanded business information and page structure, responsive design.", ngn: 250000, xof: 110000 },
      { name: "Product catalogue website", includes: "Up to 30 products, categories and WhatsApp enquiry links. No online payment checkout.", ngn: 220000, xof: 95000 },
      { name: "Starter e‑commerce website", includes: "Product listings, cart, standard checkout arrangement and basic order notifications.", ngn: 350000, xof: 155000 },
      { name: "Website redesign", includes: "A visual and structural refresh of an existing website, quoted according to its size and condition.", ngn: 120000, xof: 52000, from: true },
    ],
    extras: {
      title: "Website add-ons",
      items: [
        { name: "Additional page", includes: "One extra page on any website package.", ngn: 20000, xof: 9000 },
        { name: "Additional 20 product uploads", includes: "Twenty more products added to a catalogue or shop.", ngn: 25000, xof: 11000 },
        { name: "Domain connection", includes: "Connecting your domain to the website.", ngn: 15000, xof: 7000 },
        { name: "Business email setup", includes: "An email address on your own domain.", ngn: 20000, xof: 9000 },
        { name: "Website maintenance", includes: "Routine updates and basic checks.", ngn: 30000, xof: 13000, per: "month" },
      ],
    },
    notes: [
      "A standard four-page business website typically takes 5 to 7 working days once all content and information have been supplied. Larger projects may take longer.",
      "Domain registration, hosting, paid integrations, premium plugins and other third-party charges are paid separately by the client.",
    ],
  },
  {
    id: "improve",
    no: "02",
    verb: "Improve",
    title: "Website audits, SEO & optimisation",
    for: "For businesses that already have a website but want to improve its clarity, usability and performance.",
    tone: "bg-lavender",
    items: [
      { name: "Quick website review", includes: "A focused review of key pages with practical observations and priority fixes.", ngn: 20000, xof: 9000 },
      { name: "Comprehensive website audit", includes: "User experience, mobile usability, navigation, content clarity and overall quality, with a report, screenshots and prioritised recommendations.", ngn: 50000, xof: 22000 },
      { name: "Website improvement", includes: "Implementing the improvements agreed during an audit or consultation.", ngn: 100000, xof: 44000, from: true },
      { name: "Basic SEO setup", includes: "Page titles, meta descriptions, headings, image alt text and basic search setup.", ngn: 45000, xof: 20000 },
      { name: "Website maintenance", includes: "Routine updates and basic checks for an existing website.", ngn: 30000, xof: 13000, per: "month" },
    ],
    notes: ["SEO improves the technical and content foundations of a website. Specific search rankings or traffic levels can't be guaranteed."],
  },
  {
    id: "automate",
    no: "03",
    verb: "Automate",
    title: "Simple business workflow automation",
    for: "For businesses that want to reduce repetitive admin and connect everyday tools.",
    tone: "bg-mint",
    items: [
      { name: "Basic workflow automation", includes: "One simple workflow, such as sending form submissions to Google Sheets or notifying you when a new enquiry arrives.", ngn: 60000, xof: 26000 },
      { name: "Multi-step workflow", includes: "A connected workflow across several steps or apps, scoped and priced by complexity.", ngn: 100000, xof: 44000, from: true },
    ],
    notes: [
      "Includes planning, setup, testing and handover. Examples: enquiry notifications, lead organisation and simple email responses.",
      "Complex integrations are quoted separately. Paid software, API usage and third-party subscriptions are not included.",
    ],
  },
  {
    id: "grow",
    no: "04",
    verb: "Grow",
    title: "Social media & content",
    for: "For businesses that need a more consistent, organised and professional social media presence.",
    tone: "bg-blush",
    items: [
      { name: "Social profile setup", includes: "Set up or organise one social media profile with essential business information.", ngn: 20000, xof: 9000 },
      { name: "Social media revamp", includes: "Refresh the profile details, bio, links, highlights and visual direction for one platform.", ngn: 35000, xof: 15000 },
      { name: "Content calendar", includes: "A practical content plan with suggested topics and a posting schedule.", ngn: 25000, xof: 11000 },
      { name: "Single promotional graphic", includes: "One social media promotional design.", ngn: 8000, xof: 3500 },
      { name: "5-graphic package", includes: "Five branded social media graphics.", ngn: 30000, xof: 13000 },
      { name: "10-graphic package", includes: "Ten branded social media graphics.", ngn: 50000, xof: 22000 },
      { name: "Content starter pack", includes: "A content calendar, 8 graphics and captions.", ngn: 55000, xof: 24000 },
      { name: "Monthly social media management", includes: "One platform: up to 8 feed posts, 4 story designs, captions, scheduling and a monthly summary.", ngn: 80000, xof: 35000, per: "month" },
    ],
    notes: ["Unless agreed otherwise, photography, video production, paid advertising, influencer fees and extensive community management are not included."],
  },
  {
    id: "get-found",
    no: "05",
    verb: "Get found",
    title: "Google Business & local visibility",
    for: "For businesses that want customers to find accurate information about them on Google.",
    tone: "bg-butter",
    items: [
      { name: "Google Business Profile setup", includes: "Profile creation or setup help, business details, categories and basic information.", ngn: 25000, xof: 11000 },
      { name: "Google Business Profile optimisation", includes: "Improve an existing profile's information, services, description, images and completeness.", ngn: 35000, xof: 15000 },
      { name: "Local SEO starter", includes: "Foundational local search improvements for your website and business presence.", ngn: 60000, xof: 26000 },
    ],
    notes: [
      "Google Business Profile is free; the fee covers professional setup or optimisation. Eligibility and verification follow Google's requirements, and placement or ranking can't be guaranteed.",
    ],
  },
  {
    id: "establish",
    no: "06",
    verb: "Establish",
    title: "Essential business tools",
    for: "For businesses that need simple tools to communicate clearly and present their products or services.",
    tone: "bg-peach",
    items: [
      { name: "WhatsApp Business setup", includes: "Business profile, description, hours, catalogue guidance and essential settings.", ngn: 20000, xof: 9000 },
      { name: "Digital product catalogue", includes: "A neatly designed digital catalogue for up to 20 products, using your images and details.", ngn: 45000, xof: 20000 },
      { name: "Digital business card", includes: "A shareable digital contact card with your business details and links.", ngn: 15000, xof: 7000 },
    ],
    notes: [],
  },
];

export const howItWorks = [
  { title: "Enquiry and brief", text: "Tell us about your business, your goals and what you need." },
  { title: "Scope and quote", text: "We confirm the deliverables, timeline and final price before work begins." },
  { title: "Deposit and kickoff", text: "A 60% deposit secures the project and starts the work." },
  { title: "Design and delivery", text: "We share progress, gather your feedback and complete the agreed work." },
  { title: "Final payment and handover", text: "The remaining 40% is paid before final files, credentials or website handover." },
];

export const terms = [
  "Monthly services are paid at the start of each service period.",
  "Website projects include two reasonable rounds of revisions. New features, major scope changes or extra revision rounds may cost more.",
  "You provide accurate business information, copy, images, product details and any account access needed. Delays in materials or feedback can affect the timeline.",
  "Domain registration, hosting, paid software, plugins, API usage, advertising spend and other third-party costs are not included unless stated.",
  "Work outside the agreed scope is discussed and quoted before it starts.",
  "All prices are introductory and may be reviewed as the studio grows.",
];

export const formatPrice = (item: PriceItem, c: Currency) => {
  const n = c === "NGN" ? item.ngn : item.xof;
  const amount = c === "NGN" ? `₦${n.toLocaleString("en-NG")}` : `CFA ${n.toLocaleString("en-NG")}`;
  return { lead: item.from ? "From" : "", amount, per: item.per ? "/ month" : "" };
};

export const whatsapp = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

/** Lowest price in a group, for "from" summaries. */
export const fromPrice = (g: PriceGroup, c: Currency) => {
  const min = Math.min(...g.items.map((i) => (c === "NGN" ? i.ngn : i.xof)));
  return c === "NGN" ? `₦${min.toLocaleString("en-NG")}` : `CFA ${min.toLocaleString("en-NG")}`;
};
