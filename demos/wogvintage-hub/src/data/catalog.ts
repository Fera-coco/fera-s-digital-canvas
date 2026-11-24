/*
  Demo catalogue for WOGVINTAGE HUB.

  Shaped like the Sanity documents the live site will use (see the wogvintage-hub repo,
  studio/schemaTypes), so launch is a swap of data source, not a rewrite:
    piece:    name, slug, price (naira), size, category (reference), photos, sold, details
    category: title, slug, order
    settings: shopName, whatsappNumber, instagram, location, about

  Only what the client sent is here. He sent photos, no prices or sizes yet,
  so price and size are null and the site shows "Price on request".
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
  whatsappNumber: string // country code first, digits only. Empty until he confirms it.
  instagram?: string
  location?: string
  about?: string
}

const img = (file: string, alt: string, key = file): ImageField => ({_type: 'image', _key: key, asset: {url: file}, alt})
const ref = (id: string): Ref => ({_type: 'reference', _ref: id})

export const categories: CategoryDoc[] = [
  {_id: 'cat-camp', _type: 'category', title: 'Camp collar', slug: {current: 'camp-collar'}, order: 1},
  {_id: 'cat-band', _type: 'category', title: 'Band collar', slug: {current: 'band-collar'}, order: 2},
  {_id: 'cat-over', _type: 'category', title: 'Oversized', slug: {current: 'oversized'}, order: 3},
]

const piece = (n: number, slug: string, name: string, cat: string, photo: string): PieceDoc => ({
  _id: `piece-${n}`,
  _type: 'piece',
  _createdAt: `2026-11-24T13:${String(60 - n).padStart(2, '0')}:00Z`, // demo order: first listed shows first
  name,
  slug: {_type: 'slug', current: slug},
  price: null,
  size: null,
  category: ref(cat),
  photos: [img(photo, name)],
  sold: false,
})

export const pieces: PieceDoc[] = [
  piece(1, 'red-geometric-camp-shirt', 'Red geometric print camp shirt', 'cat-camp', 'p1'),
  piece(2, 'green-marble-camp-shirt', 'Green marble print camp shirt', 'cat-camp', 'p8'),
  piece(3, 'red-tribal-band-collar-shirt', 'Red tribal print band-collar shirt', 'cat-band', 'p3'),
  piece(4, 'brown-abstract-camp-shirt', 'Brown abstract block camp shirt', 'cat-camp', 'p4'),
  piece(5, 'teal-gold-tie-dye-shirt', 'Teal and gold tie-dye pocket shirt', 'cat-camp', 'p10'),
  piece(6, 'yellow-blue-colour-block-shirt', 'Yellow and blue colour-block shirt', 'cat-over', 'p2'),
  piece(7, 'green-tan-brushstroke-shirt', 'Green and tan brushstroke camp shirt', 'cat-camp', 'p5'),
  piece(8, 'rust-print-camp-shirt', 'Rust and red print camp shirt', 'cat-camp', 'p6'),
  piece(9, 'black-grey-stripe-shirt', 'Black and grey stripe oversized shirt', 'cat-over', 'p7'),
]

export const settings: SettingsDoc = {
  _id: 'settings',
  shopName: 'WOGVINTAGE HUB',
  tagline: 'Unisex vintage clothing',
  whatsappNumber: '',
}

/** Lookbook: customer photos and rail videos he sent (customerPhotos / reels in Sanity settings). */
export const lookbook = {
  photos: [img('c1', 'Customer in a leaf print camp shirt'), img('c2', 'Customer in a teal floral camp shirt')],
  reels: [
    {url: 'reel1.mp4', poster: 'reel1.jpg'},
    {url: 'reel2.mp4', poster: 'reel2.jpg'},
    {url: 'reel3.mp4', poster: 'reel3.jpg'},
  ],
  hero: {url: 'hero.mp4', poster: 'hero.jpg'},
  railPhoto: img('rail', 'Shirts hanging on the WOGVINTAGE HUB rail'),
}
