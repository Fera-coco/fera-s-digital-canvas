import {Link} from 'react-router-dom'
import {photo, photoSet, type Piece} from '../lib/shop'
import {PriceTag, SoldStamp} from './Tag'

export function PieceCard({piece, eager}: {piece: Piece; eager?: boolean}) {
  const cover = piece.photos[0]
  const meta = [piece.category?.title, piece.size ? `Size ${piece.size}` : null].filter(Boolean).join(', ')
  return (
    <li className="min-w-0">
      <Link to={`/piece/${piece.slug}`} className="group block">
        <div className="relative aspect-[4/5] overflow-hidden bg-mist">
          <img
            src={photo(cover, 640)}
            srcSet={photoSet(cover)}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            alt={piece.name}
            width={640}
            height={800}
            loading={eager ? 'eager' : 'lazy'}
            decoding="async"
            className={`size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${piece.sold ? 'opacity-75 grayscale' : ''}`}
          />
          {piece.sold ? <SoldStamp /> : null}
          <PriceTag price={piece.price} sold={piece.sold} className="absolute bottom-3 left-0" />
        </div>
        <p className="mt-2.5 line-clamp-2 text-[0.97rem] font-medium leading-snug group-hover:text-crimson">{piece.name}</p>
        {meta ? <p className="text-sm text-muted">{meta}</p> : null}
      </Link>
    </li>
  )
}
