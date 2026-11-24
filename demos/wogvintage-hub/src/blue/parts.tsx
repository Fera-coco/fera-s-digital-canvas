import {useEffect, useRef, useState} from 'react'
import {Link} from 'react-router-dom'
import {photo, photoSet, priceLabel, video, type Piece} from '../lib/shop'
import {PlayIcon} from '../components/Icons'

export function Tag({price, sold, className = ''}: {price: number | null; sold?: boolean; className?: string}) {
  const ask = typeof price !== 'number'
  return (
    <span className={`hang-tag inline-flex items-center border-y-2 border-r-2 border-ink pr-3 font-bold ${sold ? 'bg-white text-muted line-through' : 'bg-sun text-ink'} py-1 ${ask ? 'text-[0.78rem]' : 'text-[0.95rem]'} ${className}`}>
      <span aria-hidden="true" className="absolute left-[9px] top-1/2 size-[7px] -translate-y-1/2 rounded-full bg-paper ring-2 ring-ink" />
      {priceLabel(price)}
    </span>
  )
}

export function SoldSticker({big}: {big?: boolean}) {
  return (
    <span className={`absolute right-3 top-3 grid -rotate-12 place-items-center rounded-full bg-tomato font-wide text-white shadow-[2px_2px_0_var(--color-ink)] ${big ? 'size-24 text-xl' : 'size-14 text-xs'}`}>
      Sold
    </span>
  )
}

function Hanger() {
  return (
    <svg viewBox="0 0 120 56" aria-hidden="true" className="mx-auto -mb-1 h-12 w-28 text-ink">
      <path d="M60 4c-6 0-9 4-9 8s4 6 9 8" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M60 20 8 50h104L60 20Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
  )
}

// Colour stages behind each photo. His photos are small, so each one is shown as a mounted
// print near its real size on a bright backdrop, instead of being stretched edge to edge.
const STAGES = ['bg-sun', 'bg-[#d9e0ff]', 'bg-[#ffd3cb]', 'bg-[#c9efd9]']
const TILTS = ['-rotate-[1.5deg]', 'rotate-[1.2deg]', '-rotate-[0.8deg]', 'rotate-[1.8deg]']

export function Mount({p, i, large, className = ''}: {p: Piece; i: number; large?: boolean; className?: string}) {
  const ph = p.photos[0]
  return (
    <div className={`relative grid aspect-[4/5] place-items-center overflow-hidden ${STAGES[i % STAGES.length]} ${large ? 'p-[8%]' : 'p-[10%]'} ${className}`}>
      <img
        src={photo(ph, large ? 960 : 480)}
        srcSet={photoSet(ph)}
        sizes={large ? '(min-width: 768px) 40vw, 85vw' : '240px'}
        alt={p.name}
        loading={i < 3 || large ? 'eager' : 'lazy'}
        className={`h-full max-h-full w-auto max-w-full border-[6px] border-white object-contain shadow-[0_10px_24px_rgba(18,21,42,0.28)] [filter:contrast(1.06)_saturate(1.1)] ${TILTS[i % TILTS.length]} ${p.sold ? 'grayscale' : ''}`}
      />
      {p.sold ? <SoldSticker big={large} /> : null}
    </div>
  )
}

/** A shirt hanging on the rail. Swings a little; straightens when you point at it. */
export function HangingPiece({p, i}: {p: Piece; i: number}) {
  const tilt = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'][i % 4]
  return (
    <li className="w-[66vw] max-w-[280px] shrink-0 snap-center sm:w-[260px]">
      <Link to={`/piece/${p.slug}`} className={`group block origin-top transition-transform duration-300 ${tilt} hover:rotate-0 focus-visible:rotate-0`}>
        <Hanger />
        <div className="border-2 border-ink bg-white shadow-[4px_4px_0_var(--color-ink)]">
          <Mount p={p} i={i} />
          <div className="flex items-end justify-between gap-2 border-t-2 border-ink px-3 py-2.5">
            <p className="line-clamp-2 text-[0.95rem] font-semibold leading-tight group-hover:text-cobalt">{p.name}</p>
            <Tag price={p.price} sold={p.sold} className="shrink-0" />
          </div>
        </div>
      </Link>
    </li>
  )
}

export function GridPiece({p, i = 0}: {p: Piece; i?: number}) {
  return (
    <li className="min-w-0">
      <Link to={`/piece/${p.slug}`} className="group block border-2 border-ink bg-white shadow-[3px_3px_0_var(--color-ink)] transition-transform hover:-translate-y-0.5">
        <Mount p={p} i={i} />
        <div className="border-t-2 border-ink px-2.5 py-2">
          <p className="line-clamp-2 text-sm font-semibold leading-tight group-hover:text-cobalt">{p.name}</p>
          <p className={`mt-1 text-sm font-bold ${p.sold ? 'text-muted line-through' : 'text-cobalt'}`}>{priceLabel(p.price)}</p>
        </div>
      </Link>
    </li>
  )
}

/** Sunflower ticker under the hero. Pauses for visitors who prefer less motion. */
export function Ticker({items}: {items: string[]}) {
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-8 pr-8">
      {items.map((t) => (
        <li key={t} className="flex items-center gap-8 whitespace-nowrap">
          <span>{t}</span>
          <svg viewBox="0 0 24 14" aria-hidden="true" className="h-3.5 w-6 text-cobalt">
            <path d="M6 1h17v12H6L1 7z" fill="currentColor" />
            <circle cx="7" cy="7" r="1.8" fill="#ffc531" />
          </svg>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="overflow-hidden border-y-2 border-ink bg-sun py-3 font-wide text-lg text-ink sm:text-xl">
      <div className="ticker flex w-max">
        {row()}
        {row(true)}
      </div>
    </div>
  )
}

const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Full-bleed background video. Phones get one clip; wide screens get three side by side,
    so each plays near its real size instead of being stretched and blurry. */
export function BackgroundVideo({clips}: {clips: {url: string; poster: string}[]}) {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const shown = wide ? clips.slice(0, 3) : clips.slice(0, 1)
  return (
    <div aria-hidden="true" className="absolute inset-0 flex gap-[3px] bg-ink">
      {shown.map((c) => (
        <div key={c.url} className="h-full min-w-0 flex-1">
          <LoopVideo file={c.url} poster={c.poster} label="" />
        </div>
      ))}
    </div>
  )
}

export function LoopVideo({file, poster, label}: {file: string; poster: string; label: string}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [still] = useState(reduced)
  useEffect(() => {
    if (!still && ref.current) {
      ref.current.muted = true
      ref.current.play().catch(() => {})
    }
  }, [still])
  return <video ref={ref} src={video(file)} poster={video(poster)} muted loop playsInline autoPlay={!still} preload="auto" aria-label={label || undefined} aria-hidden={label ? undefined : true} className="size-full object-cover" />
}

/** Rail TV: tap a screen to play. One at a time. */
export function RailTV({reels}: {reels: {url: string; poster: string}[]}) {
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const [on, setOn] = useState<number | null>(null)
  const play = (i: number) => {
    refs.current.forEach((v, j) => j !== i && v?.pause())
    refs.current[i]?.play().catch(() => {})
  }
  return (
    <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0">
      {reels.map((r, i) => (
        <li key={r.url} className="w-[58vw] shrink-0 snap-center sm:w-auto">
          <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border-4 border-sun bg-black">
            <video
              ref={(el) => {
                refs.current[i] = el
              }}
              src={video(r.url)}
              poster={video(r.poster)}
              playsInline
              preload="none"
              controls={on === i}
              onPlay={() => setOn(i)}
              onPause={() => setOn((x) => (x === i ? null : x))}
              onEnded={() => setOn(null)}
              aria-label={`Rail TV, clip ${i + 1}`}
              className="size-full object-cover"
            />
            {on !== i ? (
              <button type="button" onClick={() => play(i)} aria-label={`Play clip ${i + 1}`} className="absolute inset-0 grid place-items-center bg-black/10 hover:bg-black/25">
                <span className="grid size-14 place-items-center rounded-full border-2 border-ink bg-sun text-ink shadow-[2px_2px_0_var(--color-ink)]">
                  <PlayIcon className="ml-0.5 size-6" />
                </span>
              </button>
            ) : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
