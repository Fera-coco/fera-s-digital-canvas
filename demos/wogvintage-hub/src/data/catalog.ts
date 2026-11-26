/*
  Demo catalogue for WOGVINTAGE HUB.

  Shaped like the Sanity documents the live site will use (see the wogvintage-hub repo,
  studio/schemaTypes), so launch is a swap of data source, not a rewrite:
    piece:    name, slug, price (naira), size, category (reference), photos, sold, details
    category: title, slug, order
    settings: shopName, whatsappNumber, instagram, location, about

  Only what the client sent is here: his photos, and a price of 13,000 naira per piece
  (confirmed 24 Nov 2026). No sizes yet, so size is null and the site says "Ask us".
  Names describe what is in each photo.
*/

export type ImageField = {_type: 'image'; _key: string; asset: {url: string}; alt?: string}
export type Ref = {_type: 'reference'; _ref: string}

export type CategoryDoc = {_id: string; _type: 'category'; title: string; slug: {current: string}; order?: number}

export type PieceDoc = {
  _id: string
  _type: 'piece'
  _createdAt: string
  name: string
  slug: {_type: 'slug'; current: string}
  price: number | null
  size: string | null
  category: Ref | null
  photos: ImageField[]
  sold: boolean
  details?: string
}

export type SettingsDoc = {
  _id: 'settings'
  shopName: string
  tagline?: string
  whatsappNumber: string // country code first, digits only
  banks: {bankName: string; accountName: string; accountNumber: string}[] // accounts customers can pay into
  instagram?: string
  location?: string
  about?: string
}

const img = (file: string, alt: string, key = file): ImageField => ({_type: 'image', _key: key, asset: {url: file}, alt})
const ref = (id: string): Ref => ({_type: 'reference', _ref: id})

export const categories: CategoryDoc[] = [
  // He sells shirts only, so there is one category. Filters stay hidden until there are more.
  {_id: 'cat-shirts', _type: 'category', title: 'Shirts', slug: {current: 'shirts'}, order: 1},
]

const piece = (n: number, slug: string, name: string, cat: string, photo: string): PieceDoc => ({
  _id: `piece-${n}`,
  _type: 'piece',
  _createdAt: `2026-11-24T13:${String(60 - n).padStart(2, '0')}:00Z`, // demo order: first listed shows first
  name,
  slug: {_type: 'slug', current: slug},
  price: 13000,
  size: null,
  category: ref(cat),
  photos: [img(photo, name)],
  sold: false,
})

export const pieces: PieceDoc[] = [
  piece(1, 'red-geometric-print-shirt', 'Red geometric print shirt', 'cat-shirts', 'p1'),
  piece(2, 'green-marble-print-shirt', 'Green marble print shirt', 'cat-shirts', 'p8'),
  piece(3, 'red-tribal-print-shirt', 'Red tribal print shirt', 'cat-shirts', 'p3'),
  piece(4, 'brown-abstract-block-shirt', 'Brown abstract block shirt', 'cat-shirts', 'p4'),
  piece(5, 'teal-gold-tie-dye-shirt', 'Teal and gold tie-dye shirt', 'cat-shirts', 'p10'),
  piece(6, 'yellow-blue-colour-block-shirt', 'Yellow and blue colour-block shirt', 'cat-shirts', 'p2'),
  piece(7, 'green-tan-brushstroke-shirt', 'Green and tan brushstroke shirt', 'cat-shirts', 'p5'),
  piece(8, 'rust-red-print-shirt', 'Rust and red print shirt', 'cat-shirts', 'p6'),
  piece(9, 'black-grey-stripe-shirt', 'Black and grey stripe shirt', 'cat-shirts', 'p7'),
]

export const settings: SettingsDoc = {
  _id: 'settings',
  shopName: 'WOGVINTAGE HUB',
  tagline: 'Unisex vintage clothing',
  whatsappNumber: '2347064436708', // +234 706 443 6708, shared by Fera 24 Nov 2026
  // Accounts customers pay into, shared by Fera 24 Nov 2026.
  banks: [
    {bankName: 'Moniepoint MFB', accountName: 'Alagbo Justus Iseoluwa', accountNumber: '6551578127'},
    {bankName: 'Opay', accountName: 'Alagbo Justus Iseoluwa', accountNumber: '9063076135'},
  ],
}

/** Lookbook: customer photos and rail videos he sent (customerPhotos / reels in Sanity settings). */
export const lookbook = {
  photos: [img('c1', 'Customer in a leaf print shirt'), img('c2', 'Customer in a teal floral shirt')],
  reels: [
    {url: 'reel1.mp4', poster: 'reel1.jpg'},
    {url: 'reel2.mp4', poster: 'reel2.jpg'},
    {url: 'reel3.mp4', poster: 'reel3.jpg'},
  ],
  hero: {url: 'hero.mp4', poster: 'hero.jpg'},
  // Background hero (blue look): the sharpest clip he sent, cut into three steady segments
  // at native resolution. Phones play the first; wide screens show all three side by side.
  heroBg: [
    {url: 'bg-a.mp4', poster: 'bg-a.jpg'},
    {url: 'bg-b.mp4', poster: 'bg-b.jpg'},
    {url: 'bg-c.mp4', poster: 'bg-c.jpg'},
  ],
  railPhoto: img('rail', 'Shirts hanging on the WOGVINTAGE HUB rail'),
  // Blue hero: his sharpest images (customer photos), crossfading. The rail video plays in a small tile.
  heroPhotos: [img('c1', 'Customer in a leaf print shirt', 'hero-c1'), img('c2', 'Customer in a teal floral shirt', 'hero-c2')],
}
