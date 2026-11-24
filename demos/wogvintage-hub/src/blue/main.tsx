import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import '@fontsource-variable/archivo/standard.css'
import './blue.css'
import {BlueLayout} from './Layout'
import {BlueHome} from './Home'
import {BluePiece} from './Piece'
import {BlueNotFound} from './NotFound'
import {clearStaticHead} from '../lib/head'

clearStaticHead()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <Routes>
        <Route element={<BlueLayout />}>
          <Route path="/" element={<BlueHome />} />
          <Route path="/piece/:slug" element={<BluePiece />} />
          <Route path="*" element={<BlueNotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
