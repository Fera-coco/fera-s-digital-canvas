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

/** A piece hanging on the rail. Swings a little; straightens when you point at it. */
export function HangingPiece({p, i}: {p: Piece; i: number}) {
  const tilt = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'][i % 4]
  return (
    <li className="w-[62vw] max-w-[270px] shrink-0 snap-center sm:w-[250px]">
      <Link to={`/piece/${p.slug}`} className={`group block origin-top transition-transform duration-300 ${tilt} hover:rotate-0 focus-visible:rotate-0`}>
        <Hanger />
        <div className="relative border-2 border-ink bg-white p-2 shadow-[4px_4px_0_var(--color-ink)]">
          <div className="relative aspect-[4/5] overflow-hidden bg-mist">
            <img src={photo(p.photos[0], 640)} srcSet={photoSet(p.photos[0])} sizes="270px" alt={p.name} loading={i < 3 ? 'eager' : 'lazy'} width={640} height={800} className={`size-full object-cover ${p.sold ? 'grayscale' : ''}`} />
            {p.sold ? <SoldSticker /> : null}
          </div>
          <Tag price={p.price} sold={p.sold} className="absolute -left-2 bottom-[4.6rem]" />
          <p className="mt-2 line-clamp-2 min-h-[2.6em] text-[0.95rem] font-semibold leading-tight group-hover:text-cobalt">{p.name}</p>
          <p className="text-xs text-muted">{[p.category?.title, p.size ? `Size ${p.size}` : null].filter(Boolean).join(', ')}</p>
        </div>
      </Link>
    </li>
  )
}

export function GridPiece({p}: {p: Piece}) {
  return (
    <li className="min-w-0">
      <Link to={`/piece/${p.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden border-2 border-ink bg-mist">
          <img src={photo(p.photos[0], 640)} srcSet={photoSet(p.photos[0])} sizes="(min-width: 1024px) 25vw, 50vw" alt={p.name} loading="lazy" width={640} height={800} className={`size-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${p.sold ? 'grayscale' : ''}`} />
          {p.sold ? <SoldSticker /> : null}
          <Tag price={p.price} sold={p.sold} className="absolute bottom-3 left-0" />
        </div>
        <p className="mt-2 line-clamp-2 text-[0.95rem] font-semibold leading-snug group-hover:text-cobalt">{p.name}</p>
      </Link>
    </li>
  )
}

const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function LoopVideo({file, poster, label}: {file: string; poster: string; label: string}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [still] = useState(reduced)
  useEffect(() => {
    if (!still && ref.current) {
      ref.current.muted = true
      ref.current.play().catch(() => {})
    }
  }, [still])
  return <video ref={ref} src={video(file)} poster={video(poster)} muted loop playsInline autoPlay={!still} preload="metadata" aria-label={label} className="size-full object-cover" />
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
