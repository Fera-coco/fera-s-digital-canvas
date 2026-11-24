import {useEffect, useRef, useState} from 'react'
import {video} from '../lib/shop'
import {PlayIcon} from './Icons'

const reduced = () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/** Muted, looping clip of the rail. Holds on the cover photo for visitors who prefer less motion. */
export function HeroVideo({file, poster}: {file: string; poster: string}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [still] = useState(reduced)
  useEffect(() => {
    const v = ref.current
    if (!v || still) return
    v.muted = true
    v.play().catch(() => {})
  }, [still])
  return (
    <video
      ref={ref}
      src={video(file)}
      poster={video(poster)}
      muted
      loop
      playsInline
      autoPlay={!still}
      preload="metadata"
      aria-label="Shirts on the WOGVINTAGE HUB rail"
      className="size-full object-cover"
    />
  )
}

/** Tap-to-play rail videos in a film strip. One plays at a time. */
export function Reels({reels}: {reels: {url: string; poster: string}[]}) {
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const [playing, setPlaying] = useState<number | null>(null)
  const play = (i: number) => {
    refs.current.forEach((v, j) => j !== i && v?.pause())
    refs.current[i]?.play().catch(() => {})
  }
  return (
    <div className="film -mx-4 px-4 py-6 sm:mx-0 sm:px-6">
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto">
        {reels.map((r, i) => (
          <li key={r.url} className="relative w-[44%] shrink-0 snap-start sm:w-[220px]">
            <div className="relative aspect-[9/16] overflow-hidden bg-ink">
              <video
                ref={(el) => {
                  refs.current[i] = el
                }}
                src={video(r.url)}
                poster={video(r.poster)}
                playsInline
                preload="none"
                controls={playing === i}
                onPlay={() => setPlaying(i)}
                onPause={() => setPlaying((p) => (p === i ? null : p))}
                onEnded={() => setPlaying(null)}
                aria-label={`Rail video ${i + 1}`}
                className="size-full object-cover"
              />
              {playing !== i ? (
                <button type="button" onClick={() => play(i)} aria-label={`Play rail video ${i + 1}`} className="absolute inset-0 grid place-items-center bg-ink/15 hover:bg-ink/30">
                  <span className="grid size-14 place-items-center rounded-full bg-gold text-oxblood">
                    <PlayIcon className="ml-0.5 size-6" />
                  </span>
                </button>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
