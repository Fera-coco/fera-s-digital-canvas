/* Delivery fees and policies as sent by Superb Naturals (22 Nov 2026). */

export type Zone = { id: string; label: string; fee: number | null; note?: string };

export const ZONES: Zone[] = [
  { id: "asaba", label: "Asaba", fee: 3000 },
  { id: "warri", label: "Warri", fee: 3000 },
  { id: "abraka", label: "Abraka", fee: 4000 },
  { id: "anambra", label: "Anambra", fee: 4500 },
  { id: "lagos-island", label: "Lagos Island", fee: 6000 },
  { id: "lagos-mainland", label: "Lagos Mainland", fee: 5500 },
  { id: "ikorodu-ogun", label: "Ikorodu / Ogun State", fee: 5500 },
  { id: "badagry", label: "Badagry", fee: 5500 },
  { id: "northern", label: "Northern States", fee: 7000 },
  { id: "calabar-uyo", label: "Calabar / Uyo", fee: 7000 },
  { id: "port-harcourt", label: "Port Harcourt / Rivers State", fee: 7000 },
  { id: "other-ng", label: "Somewhere else in Nigeria", fee: null, note: "Your delivery fee will be confirmed on WhatsApp." },
  { id: "international", label: "Outside Nigeria (UK, US, Canada, Europe and more)", fee: null, note: "International shipping is quoted on WhatsApp, based on your country, city and order weight." },
];

export const zoneById = (id?: string) => ZONES.find((z) => z.id === id);

export const DELIVERY_POLICY = [
  "Full payment for products and delivery must be confirmed before dispatch.",
  "Orders are dispatched within 2–3 days after payment confirmation.",
  "Delivery fees are paid by the customer.",
  "Delivery fees are separate from product prices.",
  "Customers must provide accurate delivery addresses and active phone numbers.",
  "International customers will receive shipping information and estimated delivery timelines before payment.",
];

export const INTERNATIONAL = ["United Kingdom 🇬🇧", "United States 🇺🇸", "Canada 🇨🇦", "Europe 🇪🇺", "Other international destinations 🌍"];

export const INTERNATIONAL_BASIS = ["Destination country and city.", "Weight and quantity of products.", "Available courier and shipping method."];

export const REFUND_POLICY: { title: string; points: string[] }[] = [
  {
    title: "Refunds",
    points: [
      "All confirmed orders are generally non-refundable once dispatched.",
      "Refund requests may be considered if you receive a wrong, damaged or defective product.",
      "Refunds for eligible claims will be processed after verification.",
    ],
  },
  {
    title: "Wrong or damaged products",
    points: [
      "Customers must report damaged, defective or incorrect items within 24 hours of delivery.",
      "Clear pictures or videos must be provided as evidence.",
      "Where our mistake is confirmed, we will arrange a replacement or appropriate refund.",
    ],
  },
  {
    title: "Order cancellation",
    points: [
      "Orders can only be cancelled before dispatch.",
      "Once an order has been dispatched, cancellation is no longer accepted.",
      "Any eligible refund will be processed through the original payment method.",
    ],
  },
  {
    title: "Delivery fees",
    points: [
      "Delivery fees are generally non-refundable once an order has been dispatched.",
      "If an error on our part causes the delivery problem, we will review and resolve the issue fairly.",
    ],
  },
  {
    title: "Product performance",
    points: [
      "Hair growth and hair care results may vary from person to person.",
      "A product not producing immediate results does not automatically qualify for a refund.",
      "Customers are encouraged to follow the recommended usage instructions.",
    ],
  },
  {
    title: "International orders",
    points: [
      "International orders are subject to the same product refund conditions.",
      "Shipping charges, customs duties and other applicable charges may be non-refundable, subject to the circumstances and applicable consumer protection laws.",
    ],
  },
];

/* Where customers pay. Public payment details, as given by Superb Naturals. */
export const BANK = { bank: "OPay", name: "Mkpanam Honeybell", number: "8020866239" };
