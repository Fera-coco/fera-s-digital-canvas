import {useEffect} from 'react'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {BASE, shop, wa} from '../lib/shop'
import {BagIcon, ChatIcon, InstagramIcon} from '../components/Icons'
import {useBag} from '../lib/bag'
import {DemoBanner, Watermark} from '../components/Watermark'

function ScrollManager() {
  const {pathname, hash} = useLocation()
  useEffect(() => {
    if (hash) return void document.getElementById(hash.slice(1))?.scrollIntoView()
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function BlueLayout() {
  const chat = wa(`Hi ${shop.shopName}, I have a question.`)
  const {items} = useBag()
  return (
    <>
      <ScrollManager />
      <DemoBanner />
      <header className="sticky top-0 z-30 border-b-2 border-ink bg-paper">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" aria-label={`${shop.shopName} home`}>
            <img src={`${BASE}brand-blue/logo.svg`} alt={shop.shopName} width={190} height={50} className="h-10 w-auto sm:h-11" />
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1">
            <Link to="/#rail" className="hidden px-3 py-2 text-sm font-semibold hover:text-cobalt sm:inline">
              The rail
            </Link>
            <Link to="/#worn" className="hidden px-3 py-2 text-sm font-semibold hover:text-cobalt sm:inline">
              Worn by you
            </Link>
            <a href={chat} target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp" className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-sm font-bold hover:bg-mist">
              <ChatIcon className="size-4" /> <span className="hidden sm:inline">Message us</span>
            </a>
            <Link to="/checkout" aria-label={`Bag, ${items.length} ${items.length === 1 ? 'shirt' : 'shirts'}`} className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sun px-3.5 py-1.5 text-sm font-bold shadow-[2px_2px_0_var(--color-ink)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0_var(--color-ink)]">
              <BagIcon className="size-4" /> Bag
              {items.length ? <span className="grid min-w-5 place-items-center rounded-full bg-ink px-1 text-xs text-white">{items.length}</span> : null}
            </Link>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-24 bg-cobalt text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[1fr_auto] sm:px-6">
          <div>
            <img src={`${BASE}brand-blue/logo-white.svg`} alt={shop.shopName} width={300} height={70} className="h-14 w-auto" />
            <p className="mt-4 font-wide text-xl text-sun">Loud prints for everyone.</p>
          </div>
          <ul className="flex flex-wrap items-start gap-3">
            <li>
              <a href={chat} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sun px-4 py-2 font-bold text-ink hover:bg-white">
                <ChatIcon className="size-4" /> WhatsApp
              </a>
            </li>
            {shop.instagram ? (
              <li>
                <a href={`https://instagram.com/${shop.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 px-4 py-2 font-bold">
                  <InstagramIcon className="size-4" /> @{shop.instagram}
                </a>
              </li>
            ) : null}
          </ul>
          <p className="text-sm text-white/60 sm:col-span-2">
            © {new Date().getFullYear()} {shop.shopName}. Website by{' '}
            <a href="https://ferasportfolio.vercel.app" className="underline hover:text-sun">
              Fera's Studio
            </a>
            .
          </p>
        </div>
      </footer>
      <Watermark />
    </>
  )
}
