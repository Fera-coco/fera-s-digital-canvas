import {useMemo, useRef, useState} from 'react'
import {useSearchParams} from 'react-router-dom'
import {allCategories, allPieces, allSizes, media, photo, photoSet, shop, wa} from '../lib/shop'
import {ChatIcon} from '../components/Icons'
import {Seo} from '../components/Seo'
import {BackgroundVideo, GridPiece, HangingPiece, RailTV} from './parts'

export function BlueHome() {
  const [params, setParams] = useSearchParams()
  const [view, setView] = useState<'rail' | 'grid'>('rail')
  const railRef = useRef<HTMLUListElement>(null)
  const nudge = (dir: 1 | -1) => railRef.current?.scrollBy({left: dir * 300, behavior: 'smooth'})
  const style = params.get('style')
  const size = params.get('size')
  const list = useMemo(() => allPieces.filter((p) => (!style || p.category?.slug === style) && (!size || p.size === size)), [style, size])
  const onRail = allPieces.filter((p) => !p.sold).length
  const set = (k: string, v: string | null) => {
    const n = new URLSearchParams(params)
    if (v) n.set(k, v)
    else n.delete(k)
    setParams(n, {replace: true, preventScrollReset: true})
  }

  return (
    <>
      <Seo title={`${shop.shopName} | Loud prints for everyone`} description="Unisex vintage shirts and prints in Nigeria. One-of-a-kind pieces, ordered straight on WhatsApp." path="/" />

      {/* Hero: the rail itself, playing full-bleed behind the headline */}
      <section className="relative isolate flex min-h-[calc(100svh-6.5rem)] items-end overflow-hidden bg-ink text-white md:min-h-[78vh] md:items-center">
        <BackgroundVideo clips={media.heroBg} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/20 md:bg-ink/45" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-24 text-center sm:px-6 md:py-24">
          <p className="inline-flex items-center rounded-full border-2 border-white/80 px-4 py-1 text-sm font-bold">Unisex vintage, fresh on the rail</p>
          <h1 className="mx-auto mt-5 max-w-4xl font-wide text-[clamp(2.6rem,12vw,6.2rem)] leading-[0.9] [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]">
            Loud prints for <span className="text-sun">everyone.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[38ch] text-lg text-white/90">Most pieces are one of a kind. When one sells, it is gone.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#rail" className="rounded-full border-2 border-ink bg-sun px-7 py-3.5 font-bold text-ink shadow-[3px_3px_0_var(--color-ink)] hover:bg-white">
              Shop the rail
            </a>
            <a href={wa(`Hi ${shop.shopName}, what's new on the rail?`)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white px-6 py-3.5 font-bold hover:bg-white hover:text-ink">
              <ChatIcon /> Ask what's new
            </a>
          </div>
          <p className="mt-6 text-sm font-semibold text-white/80">{onRail} pieces hanging now</p>
        </div>
      </section>

      {/* The rail, drawn as a real clothes rail */}
      <section id="rail" aria-labelledby="rail-h" className="mx-auto max-w-6xl scroll-mt-20 px-4 pt-16 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="rail-h" className="font-wide text-4xl text-cobalt sm:text-5xl">
            The rail
          </h2>
          <div role="group" aria-label="View" className="inline-flex rounded-full border-2 border-ink p-1">
            {(['rail', 'grid'] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${view === v ? 'bg-ink text-white' : 'hover:text-cobalt'}`}>
                {v === 'rail' ? 'Flick through' : 'See all'}
              </button>
            ))}
          </div>
        </div>
        <div className="no-scrollbar mt-5 flex gap-2 overflow-x-auto pb-1">
          <Chip label="Everything" active={!style} onClick={() => set('style', null)} />
          {allCategories.map((c) => (
            <Chip key={c.slug} label={`${c.title} (${c.count})`} active={style === c.slug} onClick={() => set('style', style === c.slug ? null : c.slug)} />
          ))}
          {allSizes.map((s) => (
            <Chip key={s} label={`Size ${s}`} active={size === s} onClick={() => set('size', size === s ? null : s)} />
          ))}
        </div>
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
            <button type="button" onClick={() => nudge(-1)} aria-label="Previous pieces" className="hidden size-11 place-items-center rounded-full border-2 border-ink bg-white font-bold hover:bg-sun sm:grid">
              <span aria-hidden="true">&lsaquo;</span>
            </button>
            <p className="text-center text-sm text-muted">Slide along the rail. Tap a piece to see it up close.</p>
            <button type="button" onClick={() => nudge(1)} aria-label="Next pieces" className="hidden size-11 place-items-center rounded-full border-2 border-ink bg-white font-bold hover:bg-sun sm:grid">
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </div>
        </div>
      ) : (
        <ul className="mx-auto mt-8 grid max-w-6xl grid-cols-2 gap-x-3 gap-y-8 px-4 sm:grid-cols-3 sm:gap-x-5 sm:px-6 lg:grid-cols-4">
          {list.map((p) => (
            <GridPiece key={p.id} p={p} />
          ))}
        </ul>
      )}

      {/* Rail TV */}
      <section aria-labelledby="tv-h" className="mt-20 bg-ink py-14 text-white">
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

      {/* Worn by you */}
      <section id="worn" aria-labelledby="worn-h" className="mx-auto mt-20 max-w-6xl scroll-mt-20 px-4 sm:px-6">
        <h2 id="worn-h" className="font-wide text-4xl text-cobalt sm:text-5xl">
          Worn by you
        </h2>
        <p className="mt-2 max-w-md text-muted">Customers in their pieces, styled their own way.</p>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:gap-8">
          {media.photos.map((ph, i) => (
            <li key={ph._key} className="relative">
              <img src={photo(ph, 960)} srcSet={photoSet(ph)} sizes="50vw" alt={ph.alt || ''} loading="lazy" width={800} height={1000} className="aspect-[4/5] w-full border-2 border-ink object-cover shadow-[5px_5px_0_var(--color-cobalt)]" />
              <span className={`absolute -top-4 grid size-16 place-items-center rounded-full border-2 border-ink bg-sun font-wide text-sm text-ink sm:size-20 sm:text-base ${i % 2 ? '-right-2 rotate-12' : '-left-2 -rotate-12'}`}>
                Worn
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* How to order, as a receipt */}
      <section aria-labelledby="how-h" className="mt-20 bg-cobalt px-4 py-16 sm:px-6">
        <div className="receipt mx-auto max-w-md rotate-[-1.5deg] bg-white px-6 pt-8 text-ink shadow-[0_20px_40px_rgba(18,21,42,0.35)] sm:px-9">
          <img src={`${import.meta.env.BASE_URL}brand-blue/mark.svg`} alt="" className="mx-auto h-10 w-auto" />
          <h2 id="how-h" className="mt-4 text-center font-wide text-2xl">
            How to order
          </h2>
          <p className="mt-1 text-center text-sm text-muted">No cart. No card. Just WhatsApp.</p>
          <ol className="mt-6 space-y-4 border-y-2 border-dashed border-ink/40 py-5 font-narrow text-[1.05rem] font-semibold">
            {[
              ['Pick a piece', 'tap it'],
              ['Order on WhatsApp', '1 message'],
              ['Payment and delivery', 'sorted together'],
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
          <a href={wa(`Hi ${shop.shopName}, I'd like to order.`)} target="_blank" rel="noopener noreferrer" className="mt-6 flex items-center justify-center gap-2 rounded-full bg-whatsapp px-5 py-3 font-bold text-white hover:bg-whatsapp-deep">
            <ChatIcon /> Start on WhatsApp
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
              `${shop.shopName} sells unisex vintage clothing: bold shirts and prints for anyone who likes to be seen. The rail changes all the time, so if something catches your eye, ask for it.`}
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
