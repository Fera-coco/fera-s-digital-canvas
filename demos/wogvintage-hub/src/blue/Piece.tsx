import {useRef, useState} from 'react'
import {Link, useParams} from 'react-router-dom'
import {allPieces, getPiece, orderText, photo, photoSet, pieceUrl, priceLabel, shop, similarText, wa, type Piece} from '../lib/shop'
import {ArrowLeftIcon, BellIcon, ChatIcon, ShareIcon} from '../components/Icons'
import {Seo} from '../components/Seo'
import {GridPiece, SoldSticker} from './parts'
import {BlueNotFound} from './NotFound'

export function BluePiece() {
  const {slug = ''} = useParams()
  const p = getPiece(slug)
  if (!p) return <BlueNotFound piece />
  const order = wa(orderText(p))
  const similar = wa(similarText(p))
  const more = allPieces.filter((x) => x.id !== p.id && !x.sold).slice(0, 4)
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
      ? {offers: {'@type': 'Offer', url: pieceUrl(p.slug), priceCurrency: 'NGN', price: p.price, availability: p.sold ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock'}}
      : {}),
  }

  return (
    <div className="pb-24 md:pb-0">
      <Seo
        title={`${p.name} | ${shop.shopName}`}
        description={[p.details, p.size ? `Size ${p.size}.` : null, `${priceLabel(p.price)}.`, p.sold ? 'Sold.' : 'Order on WhatsApp.'].filter(Boolean).join(' ')}
        path={`/piece/${p.slug}`}
        image={photo(p.photos[0], 960)}
        type="product"
        jsonLd={jsonLd}
      />
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <Link to="/#rail" className="inline-flex items-center gap-1 py-2 text-sm font-bold text-cobalt hover:underline">
          <ArrowLeftIcon className="size-4" /> Back to the rail
        </Link>
      </div>

      <article className="mx-auto grid max-w-6xl gap-10 px-4 pt-2 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <Gallery p={p} />

        {/* The details live on a big hang tag */}
        <div className="relative pt-10 [filter:drop-shadow(6px_6px_0_var(--color-ink))] md:sticky md:top-24">
          <svg aria-hidden="true" viewBox="0 0 120 60" className="absolute left-1/2 top-0 h-12 w-24 -translate-x-1/2 text-ink">
            <path d="M60 58C50 40 80 28 64 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <div className="tag-v bg-cobalt px-6 pb-8 pt-24 text-white sm:px-9">
            <span aria-hidden="true" className="absolute left-1/2 top-[3.6rem] size-6 -translate-x-1/2 rounded-full border-4 border-sun bg-paper" />
            {p.category ? (
              <Link to={`/?style=${p.category.slug}#rail`} className="text-sm font-bold text-sun hover:underline">
                {p.category.title}
              </Link>
            ) : null}
            <h1 className="mt-1 font-wide text-3xl leading-[0.95] sm:text-4xl">{p.name}</h1>
            <p className={`mt-5 font-wide ${typeof p.price === 'number' ? 'text-4xl' : 'text-2xl'} ${p.sold ? 'text-white/50 line-through' : 'text-sun'}`}>{priceLabel(p.price)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/25 text-sm">
              {[
                ['Size', p.size || 'Ask us'],
                ['Fit', 'Unisex'],
                ['Status', p.sold ? 'Sold' : 'On the rail'],
                ['Condition', 'Vintage, pre-loved'],
              ].map(([k, v]) => (
                <div key={k} className="bg-cobalt-deep px-3 py-2.5">
                  <dt className="text-white/65">{k}</dt>
                  <dd className="font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            {p.details ? <p className="mt-5 whitespace-pre-line text-white/90">{p.details}</p> : null}
            <div className="mt-7 grid gap-3">
              {p.sold ? (
                <a href={similar} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-6 py-4 text-lg font-bold text-ink shadow-[3px_3px_0_var(--color-ink)]">
                  <BellIcon /> Notify me about similar
                </a>
              ) : (
                <a href={order} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-whatsapp px-6 py-4 text-lg font-bold text-white shadow-[3px_3px_0_var(--color-ink)] hover:bg-whatsapp-deep">
                  <ChatIcon /> Order on WhatsApp
                </a>
              )}
              <Share name={p.name} url={pieceUrl(p.slug)} />
            </div>
            <p className="mt-5 text-sm text-white/75">{p.sold ? 'This one found a new home. Ask and you hear first when something like it lands.' : 'Most pieces are one of a kind. Like it? Ask before someone else does.'}</p>
          </div>
        </div>
      </article>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-sun px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 md:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{p.name}</p>
            <p className="text-sm">{p.sold ? 'Sold' : priceLabel(p.price)}</p>
          </div>
          <a href={p.sold ? similar : order} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-whatsapp px-5 py-2.5 font-bold text-white">
            {p.sold ? <BellIcon /> : <ChatIcon />} {p.sold ? 'Notify me' : 'Order'}
          </a>
        </div>
      </div>

      {more.length ? (
        <section aria-labelledby="more-h" className="mx-auto mt-20 max-w-6xl px-4 sm:px-6">
          <h2 id="more-h" className="font-wide text-3xl text-cobalt">
            Also hanging
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-4 sm:gap-x-5">
            {more.map((m) => (
              <GridPiece key={m.id} p={m} />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function Gallery({p}: {p: Piece}) {
  const [i, setI] = useState(0)
  const t = useRef<HTMLDivElement>(null)
  return (
    <div>
      <div className="relative border-2 border-ink shadow-[6px_6px_0_var(--color-sun)]">
        <div ref={t} role="region" aria-label={`${p.name} photos`} tabIndex={0} onScroll={(e) => setI(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto">
          {p.photos.map((ph, n) => (
            <img key={ph._key} src={photo(ph, 960)} srcSet={photoSet(ph)} sizes="(min-width: 768px) 55vw, 100vw" alt={p.photos.length > 1 ? `${p.name}, photo ${n + 1}` : p.name} width={900} height={1125} loading={n ? 'lazy' : 'eager'} className={`aspect-[4/5] w-full shrink-0 snap-center bg-mist object-cover ${p.sold ? 'grayscale' : ''}`} />
          ))}
        </div>
        {p.sold ? <SoldSticker big /> : null}
      </div>
      {p.photos.length > 1 ? (
        <ul className="mt-3 flex gap-2">
          {p.photos.map((ph, n) => (
            <li key={ph._key}>
              <button type="button" aria-label={`Show photo ${n + 1}`} aria-current={i === n} onClick={() => t.current?.scrollTo({left: n * t.current.clientWidth, behavior: 'smooth'})} className={`block border-2 ${i === n ? 'border-cobalt' : 'border-transparent opacity-70'}`}>
                <img src={photo(ph, 480)} alt="" width={60} height={75} className="h-[75px] w-[60px] object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function Share({name, url}: {name: string; url: string}) {
  const [done, setDone] = useState(false)
  const go = async () => {
    try {
      if (navigator.share) return void (await navigator.share({title: name, url}))
      await navigator.clipboard.writeText(url)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      /* closed */
    }
  }
  return (
    <button type="button" onClick={go} className="flex items-center justify-center gap-2 rounded-full px-6 py-2 font-semibold text-white/90 hover:bg-white/10">
      <ShareIcon /> <span aria-live="polite">{done ? 'Link copied' : 'Share this piece'}</span>
    </button>
  )
}
