import {priceLabel} from '../lib/shop'

/** Gold price tag with a punched hole, hung on each piece. */
export function PriceTag({price, sold, large, className = ''}: {price: number | null; sold?: boolean; large?: boolean; className?: string}) {
  const ask = typeof price !== 'number'
  return (
    <span
      className={`hang-tag inline-flex items-center pr-3 font-semibold text-oxblood shadow-[2px_3px_0_rgba(30,10,12,0.18)] ${
        sold ? 'bg-cream' : 'bg-gold'
      } ${large ? 'py-2 text-xl' : 'py-1 text-[0.95rem]'} ${className}`}
    >
      <span aria-hidden="true" className="absolute left-[9px] top-1/2 size-[7px] -translate-y-1/2 rounded-full bg-paper ring-1 ring-ink/25" />
      <span className={`${sold ? 'text-muted line-through decoration-2' : ''} ${ask ? (large ? 'text-base' : 'text-[0.8rem]') : ''}`}>
        {priceLabel(price)}
      </span>
    </span>
  )
}

/** Rubber stamp for sold pieces. */
export function SoldStamp({large}: {large?: boolean}) {
  return (
    <span
      className={`absolute right-3 top-3 -rotate-[8deg] rounded-sm border-[3px] border-crimson bg-paper/90 font-display uppercase tracking-wider text-crimson ${
        large ? 'px-4 py-1 text-2xl' : 'px-2 py-0.5 text-sm'
      }`}
    >
      Sold
    </span>
  )
}
