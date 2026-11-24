import {useEffect} from 'react'
import {Link, Outlet, useLocation} from 'react-router-dom'
import {BASE, shop, wa} from '../lib/shop'
import {ChatIcon, InstagramIcon} from './Icons'
import {DemoBanner, Watermark} from './Watermark'

function ScrollManager() {
  const {pathname, hash} = useLocation()
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
      return
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export function Layout() {
  const chat = wa(`Hi ${shop.shopName}, I have a question.`)
  return (
    <>
      <ScrollManager />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-gold focus:px-3 focus:py-2">
        Skip to content
      </a>
      <DemoBanner />
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" aria-label={`${shop.shopName} home`} className="shrink-0">
            <img src={`${BASE}brand/logo.svg`} alt={shop.shopName} width={210} height={52} className="h-11 w-auto sm:h-12" />
          </Link>
          <nav aria-label="Main" className="flex items-center gap-1 sm:gap-2">
            <Link to="/#rail" className="hidden rounded-full px-3 py-2 text-sm font-medium hover:text-crimson sm:inline">
              Shop
            </Link>
            <Link to="/#lookbook" className="hidden rounded-full px-3 py-2 text-sm font-medium hover:text-crimson sm:inline">
              Lookbook
            </Link>
            <a
              href={chat}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-3.5 py-2 text-sm font-semibold text-cream hover:bg-oxblood"
            >
              <ChatIcon className="size-4" /> <span>Message us</span>
            </a>
          </nav>
        </div>
      </header>
      <main id="main">
        <Outlet />
      </main>
      <footer className="mt-24 bg-oxblood text-cream">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-[1fr_auto] sm:px-6">
          <div>
            <img src={`${BASE}brand/logo-on-dark.svg`} alt={shop.shopName} width={300} height={70} className="h-16 w-auto" />
            <p className="mt-4 max-w-sm font-display text-2xl text-gold">Old soul. New wear.</p>
          </div>
          <ul className="flex flex-wrap items-start gap-3">
            <li>
              <a href={chat} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 font-semibold text-oxblood hover:bg-cream">
                <ChatIcon className="size-4" /> WhatsApp
              </a>
            </li>
            {shop.instagram ? (
              <li>
                <a href={`https://instagram.com/${shop.instagram}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border-2 border-cream/50 px-4 py-2 font-semibold hover:border-gold hover:text-gold">
                  <InstagramIcon className="size-4" /> @{shop.instagram}
                </a>
              </li>
            ) : null}
          </ul>
          <p className="text-sm text-cream/60 sm:col-span-2">
            © {new Date().getFullYear()} {shop.shopName}. Website by{' '}
            <a href="https://ferasportfolio.vercel.app" className="underline hover:text-gold">
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
