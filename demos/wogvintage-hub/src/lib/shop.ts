import {categories, lookbook, pieces, settings, type ImageField, type PieceDoc} from '../data/catalog'

// The one place the site reads content from. At launch, these become Sanity GROQ queries
// returning the same shapes (see queries in the wogvintage-hub repo).

export const BASE = import.meta.env.BASE_URL

export type Category = {title: string; slug: string; count: number}
export type Piece = {
  id: string
  name: string
  slug: string
  price: number | null
  size: string | null
  sold: boolean
  category: {title: string; slug: string} | null
  photos: ImageField[]
  details?: string
  addedAt: string
}

const catById = new Map(categories.map((c) => [c._id, c]))

function toPiece(d: PieceDoc): Piece {
  const c = d.category ? catById.get(d.category._ref) : undefined
  return {
    id: d._id,
    name: d.name,
    slug: d.slug.current,
    price: d.price,
    size: d.size,
    sold: d.sold,
    category: c ? {title: c.title, slug: c.slug.current} : null,
    photos: d.photos,
    details: d.details,
    addedAt: d._createdAt,
  }
}

/** Newest first; sold pieces stay listed after the available ones. */
export const allPieces: Piece[] = pieces
  .map(toPiece)
  .sort((a, b) => Number(a.sold) - Number(b.sold) || b.addedAt.localeCompare(a.addedAt))

export const getPiece = (slug: string) => allPieces.find((p) => p.slug === slug) || null

export const allCategories: Category[] = [...categories]
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
  .map((c) => ({title: c.title, slug: c.slug.current, count: allPieces.filter((p) => p.category?.slug === c.slug.current && !p.sold).length}))
  .filter((c) => c.count > 0)

export const allSizes = [...new Set(allPieces.map((p) => p.size).filter((s): s is string => !!s))]

export const shop = settings
export const media = lookbook

/** Photo URL at a width. Demo photos are pre-sized at 480 and 960 wide. */
export const photo = (f: ImageField, w: number) => `${BASE}img/${f.asset.url}-${w <= 480 ? 480 : 960}.webp`
export const photoSet = (f: ImageField) => `${photo(f, 480)} 480w, ${photo(f, 960)} 960w`
export const video = (file: string) => `${BASE}video/${file}`

const naira = new Intl.NumberFormat('en-NG', {style: 'currency', currency: 'NGN', maximumFractionDigits: 0})
export const priceLabel = (n: number | null) => (typeof n === 'number' ? naira.format(n) : 'Price on request')

/** Absolute link to a piece, for WhatsApp messages and sharing. */
export const pieceUrl = (slug: string) => `${window.location.origin}${BASE}piece/${slug}`

/** wa.me link. With no number yet, WhatsApp opens and asks which chat to send to. */
export function wa(text: string) {
  const digits = shop.whatsappNumber.replace(/\D/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
}

export const orderText = (p: Piece) =>
  [
    `Hi ${shop.shopName}, I'd like to order this piece:`,
    '',
    p.name,
    `Price: ${priceLabel(p.price)}`,
    ...(p.size ? [`Size: ${p.size}`] : []),
    pieceUrl(p.slug),
    '',
    'Is it still available?',
  ].join('\n')

export const similarText = (p: Piece) =>
  `Hi ${shop.shopName}, I missed "${p.name}" (sold). Please let me know when something similar comes in.\n\n${pieceUrl(p.slug)}`
