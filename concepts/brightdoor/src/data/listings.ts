/*
  Sample listings for a concept site. Prices follow the shape of real Lagos
  listings (rent per year plus service charge, agency, legal and caution),
  but every home, figure and agent here is illustrative.
*/

const u = (id: string, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=70`;

export const IMG = {
  palmHouse: "photo-1757361653037-dbf0d0a820ae",
  yardHouse: "photo-1706808849777-96e0d7be3bb7",
  poolHouse: "photo-1721222204126-e7042f2893b1",
  whiteHouse: "photo-1654954878521-0d8530e8c347",
  curvedBlock: "photo-1768164630015-1ad8a3a574fe",
  facade: "photo-1756162542910-4573fdc6578b",
  lagosVI: "photo-1572727850654-f50a7ead20df",
  lagosAerial: "photo-1580239808463-daf9766788a7",
  lagosKitchen: "photo-1633119713175-c53c29479984",
  whiteKitchen: "photo-1641823911769-c55f23c25143",
  islandKitchen: "photo-1769326541248-5e09a8ace25b",
  lightLiving: "photo-1746517757473-7c88850e539b",
  brickLiving: "photo-1699976102698-47feeeb07074",
  chairLiving: "photo-1595599512948-b9831e5fc11c",
  dining: "photo-1751945965380-017e4ac16506",
  blueBedroom: "photo-1632829401795-2745c905ac77",
  plantBedroom: "photo-1632566853092-a0faa4665585",
} as const;

export const img = (key: keyof typeof IMG, w?: number) => u(IMG[key], w);

export type Deal = "rent" | "sale";
export type Kind = "Flat" | "Mini flat" | "Terrace duplex" | "Semi-detached duplex" | "Detached duplex";

export type Area = "Ikoyi" | "Victoria Island" | "Lekki Phase 1" | "Ikate" | "Ajah" | "Yaba" | "Gbagada" | "Ikeja GRA";

export type TitleDoc = { name: string; status: "seen" | "in progress" | "not provided"; note: string };

export type Listing = {
  slug: string;
  title: string;
  deal: Deal;
  kind: Kind;
  area: Area;
  street: string;
  price: number; // rent per year, or sale price
  beds: number;
  baths: number;
  sqm: number;
  images: (keyof typeof IMG)[];
  // rentals: the "total package"
  serviceCharge?: number;
  agencyPct?: number;
  legalPct?: number;
  caution?: number;
  // sales
  titleDocs?: TitleDoc[];
  power: string;
  water: string;
  security: string;
  commute: { to: string; offPeak: number; rush: number };
  features: string[];
  about: string;
  agent: "tolu" | "chidinma" | "ibrahim";
  listedDaysAgo: number;
  verified: boolean;
  status: "Available" | "Under offer";
};

export const agents = {
  tolu: { name: "Tolu A.", role: "Island rentals", reply: "Replies in about 10 min", initials: "TA" },
  chidinma: { name: "Chidinma O.", role: "Lekki & Ajah", reply: "Replies in about 20 min", initials: "CO" },
  ibrahim: { name: "Ibrahim B.", role: "Sales & title checks", reply: "Replies within the hour", initials: "IB" },
} as const;

export const listings: Listing[] = [
  {
    slug: "3-bed-flat-lekki-phase-1",
    title: "Serviced 3-bed flat with BQ",
    deal: "rent",
    kind: "Flat",
    area: "Lekki Phase 1",
    street: "Off Admiralty Way",
    price: 10_000_000,
    beds: 3,
    baths: 4,
    sqm: 165,
    images: ["curvedBlock", "lightLiving", "lagosKitchen", "blueBedroom"],
    serviceCharge: 1_000_000,
    agencyPct: 10,
    legalPct: 10,
    caution: 300_000,
    power: "Estate power 20h a day plus prepaid meter",
    water: "Treated borehole water",
    security: "Gated estate, 24h guards, CCTV",
    commute: { to: "Victoria Island", offPeak: 20, rush: 55 },
    features: ["All rooms en suite", "1-room BQ", "Fitted kitchen", "Lift", "2 parking spaces"],
    about:
      "A bright upstairs flat in a small serviced block a short walk from Admiralty Way. Every bedroom is en suite, the kitchen is fitted, and the service charge covers cleaning, security, borehole and the common generator.",
    agent: "tolu",
    listedDaysAgo: 2,
    verified: true,
    status: "Available",
  },
  {
    slug: "2-bed-flat-ikate",
    title: "Newly built 2-bed flat",
    deal: "rent",
    kind: "Flat",
    area: "Ikate",
    street: "Elegushi axis",
    price: 6_000_000,
    beds: 2,
    baths: 3,
    sqm: 110,
    images: ["facade", "brickLiving", "whiteKitchen", "plantBedroom"],
    serviceCharge: 600_000,
    agencyPct: 10,
    legalPct: 10,
    caution: 500_000,
    power: "Prepaid meter plus shared inverter backup",
    water: "Borehole with treatment plant",
    security: "Gated compound, night guard",
    commute: { to: "Victoria Island", offPeak: 25, rush: 60 },
    features: ["Brand new, first tenant", "Guest toilet", "Wardrobes in both rooms", "Balcony"],
    about:
      "A first-tenant 2-bed in a compact new building. Good for a couple or two flatmates who want to be near Lekki Phase 1 without the Phase 1 price.",
    agent: "chidinma",
    listedDaysAgo: 5,
    verified: true,
    status: "Available",
  },
  {
    slug: "mini-flat-yaba",
    title: "Self-contained mini flat",
    deal: "rent",
    kind: "Mini flat",
    area: "Yaba",
    street: "Near Herbert Macaulay Way",
    price: 2_500_000,
    beds: 1,
    baths: 1,
    sqm: 45,
    images: ["chairLiving", "plantBedroom", "whiteKitchen"],
    serviceCharge: 200_000,
    agencyPct: 10,
    legalPct: 10,
    caution: 250_000,
    power: "Prepaid meter, Band B feeder",
    water: "Borehole",
    security: "Shared compound, gateman",
    commute: { to: "Yaba tech hub", offPeak: 8, rush: 20 },
    features: ["Separate kitchen", "Tiled throughout", "Close to UNILAG and Sabo"],
    about:
      "A neat mini flat for one person on a quiet street, close enough to walk to the Yaba tech offices. Kitchen is separate from the living area.",
    agent: "tolu",
    listedDaysAgo: 1,
    verified: true,
    status: "Available",
  },
  {
    slug: "4-bed-terrace-ajah",
    title: "4-bed terrace duplex in an estate",
    deal: "rent",
    kind: "Terrace duplex",
    area: "Ajah",
    street: "Badore road",
    price: 5_500_000,
    beds: 4,
    baths: 5,
    sqm: 240,
    images: ["yardHouse", "dining", "islandKitchen", "blueBedroom"],
    serviceCharge: 500_000,
    agencyPct: 10,
    legalPct: 10,
    caution: 550_000,
    power: "Estate transformer plus prepaid meter",
    water: "Treated borehole",
    security: "Gated estate, access cards",
    commute: { to: "Lekki Phase 1", offPeak: 30, rush: 75 },
    features: ["Family lounge", "Ample parking", "Kids play area in estate", "BQ"],
    about:
      "Room for a growing family in a quiet estate off Badore road. Four en-suite bedrooms, a family lounge upstairs and parking for three cars.",
    agent: "chidinma",
    listedDaysAgo: 9,
    verified: false,
    status: "Under offer",
  },
  {
    slug: "3-bed-flat-ikoyi",
    title: "Waterside 3-bed with pool and gym",
    deal: "rent",
    kind: "Flat",
    area: "Ikoyi",
    street: "Old Ikoyi",
    price: 32_000_000,
    beds: 3,
    baths: 4,
    sqm: 210,
    images: ["poolHouse", "lightLiving", "islandKitchen", "plantBedroom"],
    serviceCharge: 6_000_000,
    agencyPct: 10,
    legalPct: 10,
    caution: 2_000_000,
    power: "24h power, central generator and diesel included in service charge",
    water: "Treated borehole and storage",
    security: "Concierge, 24h guards, CCTV",
    commute: { to: "Victoria Island", offPeak: 10, rush: 30 },
    features: ["Pool", "Gym", "Lagoon view", "Fully fitted kitchen", "Lift"],
    about:
      "A calm, fully serviced apartment in Old Ikoyi with a pool, gym and lagoon views. Diesel and maintenance are part of the service charge, so power is constant.",
    agent: "tolu",
    listedDaysAgo: 3,
    verified: true,
    status: "Available",
  },
  {
    slug: "4-bed-semi-detached-lekki-sale",
    title: "4-bed semi-detached duplex",
    deal: "sale",
    kind: "Semi-detached duplex",
    area: "Lekki Phase 1",
    street: "Lekki Phase 1 estate",
    price: 280_000_000,
    beds: 4,
    baths: 5,
    sqm: 320,
    images: ["whiteHouse", "dining", "lagosKitchen", "blueBedroom"],
    titleDocs: [
      { name: "Certificate of Occupancy (C of O)", status: "seen", note: "Original sighted, search done at the Lands Registry" },
      { name: "Survey plan", status: "seen", note: "Matches the plot on the ground" },
      { name: "Governor's Consent", status: "in progress", note: "Applied for by the buyer after sale" },
      { name: "Building approval", status: "seen", note: "Approved plan on file" },
    ],
    power: "Estate power plus 15kVA generator house",
    water: "Treated borehole",
    security: "Gated estate, 24h guards",
    commute: { to: "Victoria Island", offPeak: 20, rush: 55 },
    features: ["BQ", "Family lounge", "Fitted kitchen with pantry", "Parking for 3"],
    about:
      "A well-kept semi-detached home inside a mature Lekki Phase 1 estate. The C of O has been sighted and searched, and the survey plan matches the plot.",
    agent: "ibrahim",
    listedDaysAgo: 6,
    verified: true,
    status: "Available",
  },
  {
    slug: "5-bed-detached-ikeja-gra-sale",
    title: "5-bed detached house with garden",
    deal: "sale",
    kind: "Detached duplex",
    area: "Ikeja GRA",
    street: "Ikeja GRA",
    price: 450_000_000,
    beds: 5,
    baths: 6,
    sqm: 520,
    images: ["palmHouse", "brickLiving", "whiteKitchen", "plantBedroom"],
    titleDocs: [
      { name: "Certificate of Occupancy (C of O)", status: "seen", note: "Original sighted, search done at the Lands Registry" },
      { name: "Deed of Assignment", status: "seen", note: "Registered" },
      { name: "Survey plan", status: "seen", note: "Matches the plot on the ground" },
      { name: "Governor's Consent", status: "seen", note: "On the current owner's assignment" },
    ],
    power: "Dedicated transformer plus 30kVA generator",
    water: "Borehole with treatment plant",
    security: "Perimeter fence, gatehouse",
    commute: { to: "Murtala Muhammed Airport", offPeak: 15, rush: 35 },
    features: ["Large garden", "2-room BQ", "Study", "Parking for 6"],
    about:
      "A quiet family home on a large plot in Ikeja GRA, ten minutes from the airport off-peak. Title documents are complete and registered.",
    agent: "ibrahim",
    listedDaysAgo: 14,
    verified: true,
    status: "Available",
  },
  {
    slug: "3-bed-terrace-gbagada-sale",
    title: "3-bed terrace duplex, off-plan",
    deal: "sale",
    kind: "Terrace duplex",
    area: "Gbagada",
    street: "Gbagada Phase 2",
    price: 120_000_000,
    beds: 3,
    baths: 4,
    sqm: 190,
    images: ["facade", "chairLiving", "islandKitchen", "blueBedroom"],
    titleDocs: [
      { name: "Certificate of Occupancy (C of O)", status: "seen", note: "Developer's global C of O sighted" },
      { name: "Building approval", status: "in progress", note: "Approval for the new terrace block pending" },
      { name: "Survey plan", status: "seen", note: "Matches the plot on the ground" },
      { name: "Governor's Consent", status: "not provided", note: "Ask how the developer will transfer title" },
    ],
    power: "Prepaid meter, estate generator planned",
    water: "Borehole planned",
    security: "Gated, guards from handover",
    commute: { to: "Ikeja", offPeak: 20, rush: 50 },
    features: ["Payment plan over 12 months", "Handover in 2027", "Rooftop terrace"],
    about:
      "An off-plan terrace in Gbagada with a 12-month payment plan. Buying off-plan means buying a process: read the title checklist before you commit.",
    agent: "ibrahim",
    listedDaysAgo: 4,
    verified: false,
    status: "Available",
  },
];

export const bySlug = (slug: string) => listings.find((l) => l.slug === slug);

/** The full first-year cost of a rental, line by line. */
export function movingIn(l: Listing) {
  if (l.deal !== "rent") return null;
  const agency = Math.round((l.price * (l.agencyPct ?? 0)) / 100);
  const legal = Math.round((l.price * (l.legalPct ?? 0)) / 100);
  const lines = [
    { key: "rent", label: "Rent (1 year)", amount: l.price, color: "bg-forest", refundable: false },
    { key: "service", label: "Service charge", amount: l.serviceCharge ?? 0, color: "bg-gold", refundable: false },
    { key: "agency", label: `Agency fee (${l.agencyPct}%)`, amount: agency, color: "bg-clay", refundable: false },
    { key: "legal", label: `Legal fee (${l.legalPct}%)`, amount: legal, color: "bg-clay-ink", refundable: false },
    { key: "caution", label: "Caution deposit", amount: l.caution ?? 0, color: "bg-lagoon", refundable: true },
  ].filter((x) => x.amount > 0);
  const total = lines.reduce((s, x) => s + x.amount, 0);
  return { lines, total };
}

export const naira = (n: number) => "₦" + n.toLocaleString("en-NG");
export const short = (n: number) =>
  n >= 1_000_000_000 ? `₦${+(n / 1_000_000_000).toFixed(2)}bn` : n >= 1_000_000 ? `₦${+(n / 1_000_000).toFixed(1)}m` : `₦${Math.round(n / 1000)}k`;
