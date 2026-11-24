import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import '@fontsource-variable/jost'
import '@fontsource/dm-serif-display/400.css'
import '@fontsource/dm-serif-display/400-italic.css'
import './styles.css'
import {Layout} from './components/Layout'
import {Home} from './pages/Home'
import {PiecePage} from './pages/PiecePage'
import {NotFound} from './pages/NotFound'

// The static head tags in index.html are for link previews; React manages the head from here.
document.querySelectorAll('head title, head meta[name="description"], head meta[property^="og:"]:not([property="og:site_name"])').forEach((el) => el.remove())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/piece/:slug" element={<PiecePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
