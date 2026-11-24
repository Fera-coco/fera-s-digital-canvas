import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import '@fontsource-variable/jost'
import '@fontsource/dm-serif-display/400.css'
import '@fontsource/dm-serif-display/400-italic.css'
import '../styles.css'
import {Layout} from '../components/Layout'
import {Home} from '../pages/Home'
import {PiecePage} from '../pages/PiecePage'
import {NotFound} from '../pages/NotFound'
import {clearStaticHead} from '../lib/head'

clearStaticHead()

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
