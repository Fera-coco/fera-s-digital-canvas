import {useMemo} from 'react'
import {useSearchParams} from 'react-router-dom'
import {allCategories, allPieces, allSizes, media, photo, photoSet, shop, wa} from '../lib/shop'
import {PieceCard} from '../components/PieceCard'
import {HeroVideo, Reels} from '../components/Media'
import {ChatIcon} from '../components/Icons'
import {Seo} from '../components/Seo'

export function Home() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('style')
  const size = params.get('size')
  const showSold = params.get('sold') !== 'hide'

  const available = allPieces.filter((p) => !p.sold)
  const anySold = allPieces.some((p) => p.sold)
  const list = useMemo(
    () => allPieces.filter((p) => (!cat || p.category?.slug === cat) && (!size || p.size === size) && (showSold || !p.sold)),
    [cat, size, showSold],
  )

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, {replace: true, preventScrollReset: true})
  }
  const tagline = shop.tagline || 'Unisex vintage clothing'

  return (
    <>
      <Seo
        title={`${shop.shopName} | Old soul. New wear.`}
        description={`${tagline} in Nigeria. One-of-a-kind statement shirts and prints, ordered straight on WhatsApp.`}
        path="/"
      />

      {/* Hero: crimson band with film grain, the rail in a polaroid */}
      <section className="grain overflow-hidden bg-crimson text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-10 sm:px-6 md:grid-cols-[1.25fr_0.75fr] md:items-center md:pb-20 md:pt-16">
          <div>
            <h1 className="font-display text-[clamp(3.2rem,16vw,5.5rem)] leading-[0.9] md:text-[clamp(4.5rem,8vw,7.5rem)]">
              Old soul.
              <span className="block text-gold">New wear.</span>
            </h1>
            <p className="mt-6 max-w-[36ch] text-lg leading-snug text-cream/90 sm:text-xl">
              {tagline} for everyone. Most pieces are one of a kind, so when one sells, it is gone.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="#rail" className="rounded-full bg-gold px-6 py-3 font-semibold text-oxblood shadow-[0_4px_0_var(--color-gold-deep)] hover:bg-cream">
                Shop the rail
              </a>
              <p className="text-base text-cream/85">{available.length === 1 ? '1 piece' : `${available.length} pieces`} on the rail now</p>
            </div>
          </div>
          <figure className="mx-auto w-[62%] max-w-[340px] rotate-[2.5deg] bg-cream p-3 pb-12 shadow-[0_18px_40px_rgba(30,10,12,0.35)] md:w-full">
            <div className="aspect-[4/5] overflow-hidden bg-oxblood">
              <HeroVideo file={media.hero.url} poster={media.hero.poster} />
            </div>
            <figcaption className="mt-3 text-center font-display text-xl italic text-oxblood">Fresh off the rail</figcaption>
          </figure>
        </div>
      </section>

      {/* The rail */}
      <section id="rail" aria-labelledby="rail-h" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-14 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="rail-h" className="font-display text-4xl text-crimson sm:text-5xl">
            On the rail
          </h2>
          <p className="max-w-sm text-muted">Tap a piece for more photos. Order it on WhatsApp in one message.</p>
        </div>

        <div className="sticky top-16 z-20 -mx-4 mt-6 border-y border-line bg-paper/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
            <Chip label="All styles" active={!cat} onClick={() => set('style', null)} />
            {allCategories.map((c) => (
              <Chip key={c.slug} label={c.title} count={c.count} active={cat === c.slug} onClick={() => set('style', cat === c.slug ? null : c.slug)} />
            ))}
            {allSizes.length > 0 ? (
              <>
                <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line" />
                {allSizes.map((s) => (
                  <Chip key={s} label={`Size ${s}`} active={size === s} onClick={() => set('size', size === s ? null : s)} />
                ))}
              </>
            ) : null}
            {anySold ? (
              <>
                <span aria-hidden="true" className="mx-1 h-6 w-px shrink-0 bg-line" />
                <Chip label={showSold ? 'Hide sold' : 'Show sold'} active={!showSold} onClick={() => set('sold', showSold ? 'hide' : null)} />
              </>
            ) : null}
          </div>
        </div>

        {list.length === 0 ? (
          <div className="mt-8 border-2 border-dashed border-crimson/40 bg-mist px-6 py-12">
            <p className="font-display text-2xl text-crimson">Nothing here right now</p>
            <p className="mt-1 text-muted">Try another style, or ask what is coming next.</p>
            <a href={wa(`Hi ${shop.shopName}, what's coming next on the rail?`)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold text-white hover:bg-whatsapp-deep">
              <ChatIcon /> Ask on WhatsApp
            </a>
          </div>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
            {list.map((p, i) => (
              <PieceCard key={p.id} piece={p} eager={i < 4} />
            ))}
          </ul>
        )}
      </section>

      {/* Lookbook */}
      <section id="lookbook" aria-labelledby="look-h" className="mx-auto mt-24 max-w-6xl scroll-mt-24 px-4 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <h2 id="look-h" className="font-display text-4xl text-crimson sm:text-5xl">
              Lookbook
            </h2>
            <p className="mt-3 max-w-[38ch] text-lg">
              Worn by customers. Loud prints, easy fits, styled your own way.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-5 pt-3 sm:gap-8">
            {media.photos.map((ph, i) => (
              <li key={ph._key} className={`tape bg-cream p-2 pb-8 shadow-[0_10px_24px_rgba(30,10,12,0.18)] ${i % 2 ? 'rotate-[2deg] md:mt-10' : '-rotate-[2deg]'}`}>
                <img src={photo(ph, 640)} srcSet={photoSet(ph)} sizes="(min-width: 768px) 30vw, 46vw" alt={ph.alt || ''} loading="lazy" width={640} height={800} className="aspect-[4/5] w-full object-cover" />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-12">
          <h3 className="mb-4 font-display text-2xl text-oxblood">See the rail move</h3>
          <Reels reels={media.reels} />
        </div>
      </section>

      {/* How ordering works: a real sequence, so it is numbered */}
      <section aria-labelledby="how-h" className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
        <div className="ticket bg-oxblood px-7 py-10 text-cream sm:px-12">
          <h2 id="how-h" className="font-display text-3xl text-gold sm:text-4xl">
            How to order
          </h2>
          <ol className="mt-7 grid gap-7 sm:grid-cols-3">
            {[
              ['Pick your piece', 'Open it to see the photos, size and price.'],
              ['Tap Order on WhatsApp', 'Your message opens with the piece and price filled in. Just send.'],
              ['Sort payment and delivery', `${shop.shopName} confirms the piece is yours and arranges the rest with you.`],
            ].map(([t, b], i) => (
              <li key={t} className="border-t border-cream/25 pt-4">
                <p className="font-display text-5xl leading-none text-gold">{i + 1}</p>
                <p className="mt-3 text-lg font-semibold">{t}</p>
                <p className="mt-1 text-cream/75">{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about-h" className="mx-auto mt-24 grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-2 md:items-center">
        <img
          src={photo(media.railPhoto, 960)}
          srcSet={photoSet(media.railPhoto)}
          sizes="(min-width: 768px) 50vw, 100vw"
          alt={media.railPhoto.alt || ''}
          loading="lazy"
          width={900}
          height={900}
          className="aspect-square w-full object-cover"
        />
        <div>
          <h2 id="about-h" className="font-display text-4xl text-crimson sm:text-5xl">
            About the hub
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg">
            {shop.about ||
              `${shop.shopName} sells unisex vintage clothing: statement shirts and prints for anyone who wants to stand out. Stock changes all the time, so if you see something you like, ask for it.`}
          </p>
          <a href={wa(`Hi ${shop.shopName}, I'd like to know more about your pieces.`)} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-semibold text-white hover:bg-whatsapp-deep">
            <ChatIcon /> Message us on WhatsApp
          </a>
        </div>
      </section>
    </>
  )
}

function Chip({label, count, active, onClick}: {label: string; count?: number; active: boolean; onClick: () => void}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border-[1.5px] px-4 py-1.5 text-sm font-medium transition-colors ${
        active ? 'border-crimson bg-crimson text-cream' : 'border-line bg-paper hover:border-crimson'
      }`}
    >
      {label}
      {typeof count === 'number' ? <span className={active ? 'ml-1.5 text-cream/75' : 'ml-1.5 text-muted'}>{count}</span> : null}
    </button>
  )
}

