import { Routes, Route, Navigate } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Music from './pages/Music'
import Merch from './pages/Merch'
import Shows from './pages/Shows'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import EPK from './pages/EPK'
import Links from './pages/Links'
import ComingSoon from './pages/ComingSoon'
import { usePageConfig } from './hooks/usePageConfig'

function App() {
  const { developmentMode } = usePageConfig()

  // In development mode, only show Coming Soon, Links, and EPK
  if (developmentMode) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ComingSoon />} />
            <Route path="links" element={<Links />} />
            <Route path="epk" element={<EPK />} />
            {/* Redirect all other routes to coming soon */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
        <Analytics />
      </>
    )
  }

  // Normal site mode
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="music" element={<Music />} />
          <Route path="merch" element={<Merch />} />
          <Route path="shows" element={<Shows />} />
          <Route path="contact" element={<Contact />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="checkout/success" element={<CheckoutSuccess />} />
          <Route path="links" element={<Links />} />
          <Route path="epk" element={<EPK />} />
        </Route>
      </Routes>
      <Analytics />
    </>
  )
}

export default App
