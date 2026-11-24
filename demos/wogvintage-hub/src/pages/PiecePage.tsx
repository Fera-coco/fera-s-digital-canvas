import {useRef, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {allPieces, getPiece, orderText, photo, photoSet, pieceUrl, priceLabel, shop, similarText, wa, type Piece} from '../lib/shop'
import {PieceCard} from '../components/PieceCard'
import {PriceTag, SoldStamp} from '../components/Tag'
import {ArrowLeftIcon, BellIcon, ChatIcon, ShareIcon} from '../components/Icons'
import {Seo} from '../components/Seo'
import {NotFound} from './NotFound'

export function PiecePage() {
  const {slug = ''} = useParams()
  const p = getPiece(slug)
  if (!p) return <NotFound piece />

  const order = wa(orderText(p))
  const similar = wa(similarText(p))
  const more = allPieces.filter((x) => x.id !== p.id && !x.sold && x.category?.slug === p.category?.slug)
  const moreList = (more.length >= 2 ? more : allPieces.filter((x) => x.id !== p.id && !x.sold)).slice(0, 4)
  const desc = [p.details, p.size ? `Size ${p.size}.` : null, `${priceLabel(p.price)}.`, p.sold ? 'Sold.' : 'Order on WhatsApp.'].filter(Boolean).join(' ')

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: p.photos.map((ph) => window.location.origin + photo(ph, 960)),
    description: p.details || `${p.name}, unisex vintage from ${shop.shopName}.`,
    ...(p.category ? {category: p.category.title} : {}),
    ...(p.size ? {size: p.size} : {}),
    brand: {'@type': 'Brand', name: shop.shopName},
    itemCondition: 'https://schema.org/UsedCondition',
    ...(typeof p.price === 'number'
      ? {
          offers: {
            '@type': 'Offer',
            url: pieceUrl(p.slug),
            priceCurrency: 'NGN',
            price: p.price,
            availability: p.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
            itemCondition: 'https://schema.org/UsedCondition',
          },
        }
      : {}),
  }

  return (
    <div className="pb-24 md:pb-0">
      <Seo title={`${p.name} | ${shop.shopName}`} description={desc} path={`/piece/${p.slug}`} image={photo(p.photos[0], 960)} type="product" jsonLd={jsonLd} />

      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <Link to="/#rail" className="inline-flex items-center gap-1 py-2 text-sm font-medium text-crimson hover:underline">
          <ArrowLeftIcon className="size-4" /> Back to the rail
        </Link>
      </div>

      <article className="mx-auto grid max-w-6xl gap-8 pt-2 sm:px-6 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <Gallery piece={p} />
        <div className="px-4 sm:px-0 md:sticky md:top-24 md:self-start">
          {p.category ? (
            <Link to={`/?style=${p.category.slug}#rail`} className="text-sm font-medium text-muted hover:text-crimson">
              {p.category.title}
            </Link>
          ) : null}
          <h1 className="mt-1 font-display text-4xl leading-[1.02] text-crimson sm:text-5xl">{p.name}</h1>
          <PriceTag price={p.price} sold={p.sold} large className="mt-5" />

          <dl className="mt-7 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y border-line py-4 text-[0.97rem]">
            <dt className="text-muted">Size</dt>
            <dd>{p.size || 'Ask on WhatsApp'}</dd>
            <dt className="text-muted">Fit</dt>
            <dd>Unisex</dd>
            <dt className="text-muted">Availability</dt>
            <dd>{p.sold ? 'Sold' : 'On the rail now'}</dd>
          </dl>
          {p.details ? <p className="mt-5 max-w-[60ch] whitespace-pre-line">{p.details}</p> : null}

          <div className="mt-7 grid gap-3">
            {p.sold ? (
              <>
                <p className="border-l-4 border-crimson bg-mist px-4 py-3">
                  <span className="font-semibold text-crimson">This one has found a new home.</span>{' '}
                  <span className="text-muted">Want something like it? Ask and you will hear first when a similar piece lands.</span>
                </p>
                <a href={similar} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-lg font-semibold text-white hover:bg-whatsapp-deep">
                  <BellIcon /> Notify me about similar
                </a>
              </>
            ) : (
              <a
                href={order}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-4 text-lg font-semibold text-white shadow-[0_4px_0_var(--color-whatsapp-deep)] hover:bg-whatsapp-deep active:translate-y-0.5 active:shadow-[0_2px_0_var(--color-whatsapp-deep)]"
              >
                <ChatIcon /> Order on WhatsApp
              </a>
            )}
            <ShareButton name={p.name} url={pieceUrl(p.slug)} />
          </div>
          {!p.sold ? <p className="mt-4 text-sm text-muted">Vintage means one of each, mostly. If you like it, ask before someone else does.</p> : null}
        </div>
      </article>

      {/* Phones: keep the order button in reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="text-sm text-muted">{p.sold ? 'Sold' : priceLabel(p.price)}</p>
          </div>
          <a href={p.sold ? similar : order} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold text-white">
            {p.sold ? <BellIcon /> : <ChatIcon />} {p.sold ? 'Notify me' : 'Order'}
          </a>
        </div>
      </div>

      {moreList.length > 0 ? (
        <section aria-labelledby="more-h" className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <h2 id="more-h" className="font-display text-3xl text-crimson">
            More on the rail
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-4 sm:gap-x-5">
            {moreList.map((m) => (
              <PieceCard key={m.id} piece={m} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function Gallery({piece}: {piece: Piece}) {
  const [i, setI] = useState(0)
  const track = useRef<HTMLDivElement>(null)
  const go = (n: number) => track.current?.scrollTo({left: n * track.current.clientWidth, behavior: 'smooth'})
  return (
    <div>
      <div className="relative">
        <div
          ref={track}
          role="region"
          aria-label={`${piece.name} photos`}
          tabIndex={0}
          onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        >
          {piece.photos.map((ph, n) => (
            <img
              key={ph._key}
              src={photo(ph, 960)}
              srcSet={photoSet(ph)}
              sizes="(min-width: 768px) 55vw, 100vw"
              alt={piece.photos.length > 1 ? `${piece.name}, photo ${n + 1} of ${piece.photos.length}` : piece.name}
              width={900}
              height={1125}
              fetchPriority={n === 0 ? 'high' : undefined}
              loading={n === 0 ? 'eager' : 'lazy'}
              className={`aspect-[4/5] w-full shrink-0 snap-center bg-mist object-cover ${piece.sold ? 'grayscale' : ''}`}
            />
          ))}
        </div>
        {piece.sold ? <SoldStamp large /> : null}
      </div>
      {piece.photos.length > 1 ? (
        <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-4 sm:px-0">
          {piece.photos.map((ph, n) => (
            <li key={ph._key}>
              <button type="button" onClick={() => go(n)} aria-label={`Show photo ${n + 1}`} aria-current={i === n} className={`block border-2 ${i === n ? 'border-crimson' : 'border-transparent opacity-70'}`}>
                <img src={photo(ph, 480)} alt="" width={60} height={75} className="h-[75px] w-[60px] object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function ShareButton({name, url}: {name: string; url: string}) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    try {
      if (navigator.share) return void (await navigator.share({title: name, url}))
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* share sheet closed */
    }
  }
  return (
    <button type="button" onClick={share} className="flex items-center justify-center gap-2 rounded-full px-6 py-2.5 font-medium text-crimson hover:bg-mist">
      <ShareIcon /> <span aria-live="polite">{copied ? 'Link copied' : 'Share this piece'}</span>
    </button>
  )
}
