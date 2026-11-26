import {useMemo, useRef, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {allCategories, allPieces, allSizes, media, photo, photoSet, priceLabel, shop, wa} from '../lib/shop'
import {ChatIcon} from '../components/Icons'
import {Seo} from '../components/Seo'
import {GridPiece, HangingPiece, HeroPhotos, Mount, RailTile, RailTV} from './parts'

export function BlueHome() {
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState<'rail' | 'grid'>('rail')
  const railRef = useRef<HTMLUListElement>(null)
  const nudge = (dir: 1 | -1) => railRef.current?.scrollBy({left: dir * 300, behavior: 'smooth'})
  const style = params.get('style')
  const size = params.get('size')
  const list = useMemo(() => allPieces.filter((p) => (!style || p.category?.slug === style) && (!size || p.size === size)), [style, size])
  const available = allPieces.filter((p) => !p.sold)
  const prices = [...new Set(available.map((p) => p.price).filter((n): n is number => typeof n === 'number'))]
  const onePrice = prices.length === 1 && available.every((p) => p.price === prices[0]) ? prices[0] : null
  const pick = available[0]
  const showFilters = allCategories.length > 1 || allSizes.length > 0
  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    if (v) n.set(k, v)
    else n.delete(k)
    setParams(n, {replace: true, preventScrollReset: true})
  }

  return (
    <>
      <Seo
        title={`${shop.shopName} | Loud prints for everyone`}
        description={`Unisex vintage shirts in Nigeria${onePrice ? `, ${priceLabel(onePrice)} each` : ''}. One-of-a-kind prints, ordered straight on WhatsApp.`}
        path="/"
      />

      {/* Hero: his sharpest images up front. Phones: full-bleed photo, text over it.
          Wide screens: cobalt panel with the headline beside the photos. */}
      <section className="relative isolate flex min-h-[calc(100svh-6.5rem)] items-end overflow-hidden bg-cobalt text-white md:min-h-[86vh] md:items-center">
        <div className="absolute inset-0 md:left-[46%]">
          <HeroPhotos photos={media.heroPhotos} />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-transparent md:bg-gradient-to-r md:from-cobalt/35 md:via-transparent" />
        </div>
        <RailTile clip={media.heroBg[0]} className="absolute right-4 top-5 md:bottom-10 md:right-8 md:top-auto" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-40 sm:px-6 md:py-20">
          <div className="max-w-[34rem] md:max-w-[44%]">
            <p className="inline-flex items-center rounded-full border-2 border-white/80 px-4 py-1 text-sm font-bold">Unisex vintage shirts</p>
            <h1 className="mt-5 font-wide text-[clamp(2.7rem,12.5vw,5.6rem)] leading-[0.9] [text-shadow:0_2px_18px_rgba(0,0,0,0.3)] md:text-[clamp(3.2rem,5.6vw,5.6rem)]">
              Loud prints for <span className="text-sun">everyone.</span>
            </h1>
            <p className="mt-5 max-w-[36ch] text-lg text-white/90">
              {onePrice ? `Every shirt ${priceLabel(onePrice)}. ` : ''}Most are one of a kind. When one sells, it is gone.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#rail" className="rounded-full border-2 border-ink bg-sun px-7 py-3.5 font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] hover:bg-white">
                Shop the rail
              </a>
              <a href={wa(`Hi ${shop.shopName}, what's new on the rail?`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3.5 font-bold hover:bg-white hover:text-ink">
                <ChatIcon /> Ask what's new
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* One price: his strongest selling point, said big */}
      {onePrice && pick ? (
        <section aria-labelledby="price-h" className="overflow-x-clip bg-cobalt text-white">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:py-20">
            <div>
              <h2 id="price-h" className="font-wide text-[clamp(3.6rem,17vw,8.5rem)] leading-[0.85] text-sun">
                {priceLabel(onePrice)}
              </h2>
              <p className="mt-5 max-w-[30ch] font-wide text-2xl leading-tight sm:text-3xl">Every shirt on the rail. One price.</p>
              <p className="mt-4 max-w-[42ch] text-lg text-white/85">You know the price before you ask. Bag the print you love, pay by transfer and send your receipt on WhatsApp.</p>
              <a href="#rail" className="mt-8 inline-flex rounded-full border-2 border-ink bg-sun px-7 py-3.5 font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] hover:bg-white">
                Pick your print
              </a>
            </div>
            <Link to={`/piece/${pick.slug}`} className="group relative mx-auto block w-full max-w-sm">
              <div className="border-2 border-ink shadow-[8px_8px_0_var(--color-ink)] transition-transform group-hover:-translate-y-1">
                <Mount p={pick} i={0} large />
              </div>
              <span className="absolute -right-1 -top-4 grid size-20 rotate-12 sm:-right-3 place-items-center rounded-full border-2 border-ink bg-tomato text-center font-wide text-xs leading-tight text-white sm:size-24 sm:text-sm">
                Pick of
                <br />
                the rail
              </span>
              <p className="mt-4 text-center font-semibold text-white/90 group-hover:text-sun">{pick.name}</p>
            </Link>
          </div>
        </section>
      ) : null}

      {/* The rail, drawn as a real clothes rail */}
      <section id="rail" aria-labelledby="rail-h" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="rail-h" className="font-wide text-4xl text-cobalt sm:text-5xl">
              The rail
            </h2>
            <p className="mt-2 text-muted">{available.length} shirts hanging now. Tap one to see it up close.</p>
          </div>
          <div role="group" aria-label="View" className="inline-flex rounded-full border-2 border-ink p-1">
            {(['rail', 'grid'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${view === v ? 'bg-ink text-white' : 'hover:text-cobalt'}`}>
                {v === 'rail' ? 'Flick through' : 'See all'}
              </button>
            ))}
          </div>
        </div>
        {showFilters ? (
          <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
            <Chip label="Everything" active={!style && !size} onClick={() => setParams({}, {replace: true, preventScrollReset: true})} />
            {allCategories.length > 1 && allCategories.map((c) => <Chip key={c.slug} label={`${c.title} (${c.count})`} active={style === c.slug} onClick={() => set('style', style === c.slug ? null : c.slug)} />)}
            {allSizes.map((s) => (
              <Chip key={s} label={`Size ${s}`} active={size === s} onClick={() => set('size', size === s ? null : s)} />
            ))}
          </div>
        ) : null}
      </section>

      {view === 'rail' ? (
        <div className="relative mt-8">
          <div className="rail-bar absolute inset-x-0 top-[6px] z-0" aria-hidden="true" />
          <ul ref={railRef} className="no-scrollbar relative z-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[12vw] pb-8 sm:gap-8 sm:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))]">
            {list.map((p, i) => (
              <HangingPiece key={p.id} p={p} i={i} />
            ))}
          </ul>
          <div className="flex items-center justify-center gap-4">
            <button type="button" onClick={() => nudge(-1)} aria-label="Previous shirts" className="hidden size-11 place-items-center rounded-full border-2 border-ink bg-white text-xl font-bold hover:bg-sun sm:grid">
              <span aria-hidden="true">&lsaquo;</span>
            </button>
            <p className="text-center text-sm text-muted">Slide along the rail.</p>
            <button type="button" onClick={() => nudge(1)} aria-label="Next shirts" className="hidden size-11 place-items-center rounded-full border-2 border-ink bg-white text-xl font-bold hover:bg-sun sm:grid">
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        </div>
      ) : (
        <ul className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-x-3 gap-y-6 px-4 sm:grid-cols-3 sm:gap-x-5 sm:px-6 lg:grid-cols-4">
          {list.map((p, i) => (
            <GridPiece key={p.id} p={p} i={i} />
          ))}
        </ul>
      )}

      {/* Worn by you: his best photos, given room */}
      <section id="worn" aria-labelledby="worn-h" className="mt-20 scroll-mt-20 bg-cream py-16">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          {media.photos[0] ? (
            <figure className="relative">
              <img src={photo(media.photos[0], 960)} srcSet={photoSet(media.photos[0])} sizes="(min-width: 768px) 55vw, 100vw" alt={media.photos[0].alt || ''} loading="lazy" width={806} height={1000} className="aspect-[4/5] w-full border-2 border-ink object-cover object-top shadow-[8px_8px_0_var(--color-cobalt)]" />
              <span className="absolute -left-3 -top-4 grid size-20 -rotate-12 place-items-center rounded-full border-2 border-ink bg-sun font-wide text-base">Worn</span>
            </figure>
          ) : null}
          <div>
            <h2 id="worn-h" className="font-wide text-[clamp(2.6rem,11vw,4.5rem)] leading-[0.9] text-cobalt">
              Worn
              <br />
              loud.
            </h2>
            <p className="mt-4 max-w-[34ch] text-lg">Customers in their pieces, styled their own way. Bold print up top, keep the rest simple.</p>
            {media.photos[1] ? (
              <figure className="relative mt-8 w-3/4 md:w-full">
                <img src={photo(media.photos[1], 960)} srcSet={photoSet(media.photos[1])} sizes="(min-width: 768px) 35vw, 75vw" alt={media.photos[1].alt || ''} loading="lazy" width={806} height={1000} className="aspect-[4/5] w-full rotate-2 border-2 border-ink object-cover object-top shadow-[6px_6px_0_var(--color-ink)]" />
              </figure>
            ) : null}
          </div>
        </div>
      </section>

      {/* Rail TV */}
      <section aria-labelledby="tv-h" className="bg-ink py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="tv-h" className="font-wide text-4xl text-sun sm:text-5xl">
            Rail TV
          </h2>
          <p className="mt-2 max-w-md text-white/75">Prints look better moving. Tap a screen.</p>
          <div className="mt-8">
            <RailTV reels={media.reels} />
          </div>
        </div>
      </section>

      {/* How to order, as a receipt */}
      <section aria-labelledby="how-h" className="bg-cobalt px-4 py-16 sm:px-6">
        <div className="receipt mx-auto max-w-md rotate-[-1.5deg] bg-white px-6 pt-8 text-ink shadow-[0_20px_40px_rgba(18,21,42,0.35)] sm:px-9">
          <img src={`${import.meta.env.BASE_URL}brand-blue/mark.svg`} alt="" className="mx-auto h-10 w-auto" />
          <h2 id="how-h" className="mt-4 text-center font-wide text-2xl">
            How to order
          </h2>
          <p className="mt-1 text-center text-sm text-muted">Transfer, then WhatsApp. No card needed.</p>
          <ol className="mt-6 space-y-4 border-y-2 border-dashed border-ink/40 py-5 font-narrow text-[1.05rem] font-semibold">
            {[
              ['Bag a shirt', onePrice ? priceLabel(onePrice) : 'tap it'],
              ['Add your address', 'checkout'],
              ['Pay by transfer', 'bank app'],
              ['Send receipt on WhatsApp', 'delivery price'],
            ].map(([a, b], i) => (
              <li key={a} className="flex items-baseline gap-2">
                <span className="text-cobalt">{i + 1}</span>
                <span>{a}</span>
                <span aria-hidden="true" className="min-w-4 flex-1 border-b-2 border-dotted border-ink/40" />
                <span className="text-right text-muted">{b}</span>
              </li>
            ))}
          </ol>
          <p className="mt-4 flex items-baseline justify-between font-wide text-xl">
            <span>Total effort</span>
            <span className="text-cobalt">Easy</span>
          </p>
          <a href="#rail" className="mt-6 flex items-center justify-center gap-2 rounded-full border-2 border-ink bg-sun px-5 py-3 font-bold text-ink">
            Pick a shirt
          </a>
          <p className="mt-4 text-center text-sm text-muted">Thank you. Come again.</p>
        </div>
      </section>

      {/* About */}
      <section aria-labelledby="about-h" className="mx-auto mt-20 grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[1fr_1fr] md:items-center">
        <div className="order-2 md:order-1">
          <h2 id="about-h" className="font-wide text-4xl text-cobalt sm:text-5xl">
            About the hub
          </h2>
          <p className="mt-4 max-w-[46ch] text-lg">
            {shop.about ||
              `${shop.shopName} sells unisex vintage shirts: bold prints for anyone who likes to be seen. The rail changes all the time, so if something catches your eye, ask for it.`}
          </p>
          <a href={wa(`Hi ${shop.shopName}, what's new on the rail?`)} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun px-5 py-3 font-bold shadow-[3px_3px_0_var(--color-ink)] hover:bg-white">
            <ChatIcon /> Ask what's new
          </a>
        </div>
        <img src={photo(media.railPhoto, 960)} srcSet={photoSet(media.railPhoto)} sizes="(min-width: 768px) 50vw, 100vw" alt={media.railPhoto.alt || ''} loading="lazy" width={900} height={900} className="order-1 aspect-square w-full rounded-full border-4 border-ink object-cover md:order-2" />
      </section>
    </>
  )
}

function Chip({label, active, onClick}: {label: string; active: boolean; onClick: () => void}) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={`shrink-0 rounded-full border-2 border-ink px-4 py-1.5 text-sm font-bold ${active ? 'bg-cobalt text-white' : 'bg-white hover:bg-sun'}`}>
      {label}
    </button>
  )
}
