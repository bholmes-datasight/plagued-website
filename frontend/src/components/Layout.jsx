import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, Instagram, Facebook, Youtube, Music } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { usePageConfig } from '../hooks/usePageConfig'
import CartSidebar from './CartSidebar'
import MailingListPopup from './MailingListPopup'

// Custom SVG icons for streaming platforms
const SpotifyIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const AppleMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
)

const BandcampIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M0 12.5h6.077l2.096-4.5H24l-6.077 4.5L15.827 17H0l8.077-4.5z"/>
  </svg>
)

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.954-1.289-2.066-1.289-3.338v-.8H12.56v14.8c0 2.327-1.892 4.219-4.218 4.219S4.124 17.327 4.124 15c0-2.327 1.892-4.219 4.218-4.219.462 0 .905.075 1.321.213v-3.996c-.436-.061-.88-.092-1.321-.092C3.708 6.906 0 10.614 0 15.25s3.708 8.344 8.342 8.344 8.342-3.708 8.342-8.344v-6.9c1.132.748 2.45 1.15 3.816 1.15v-3.938z"/>
  </svg>
)

const AmazonMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.06 11.57c0 .21-.07.36-.2.46-.12.1-.32.14-.57.14h-.67v-1.2h.67c.25 0 .45.05.57.14.13.1.2.25.2.46zm-6.82 1.88c-.24.24-.54.36-.9.36-.37 0-.67-.12-.9-.36-.24-.24-.36-.56-.36-.94 0-.38.12-.7.36-.94.23-.24.53-.36.9-.36.36 0 .66.12.9.36.24.24.35.56.35.94 0 .38-.11.7-.35.94zm9.67-4.85v6.8c0 .22-.08.4-.23.56-.15.15-.34.23-.56.23H4.88c-.22 0-.4-.08-.56-.23-.15-.16-.23-.34-.23-.56v-6.8c0-.22.08-.4.23-.56.16-.15.34-.23.56-.23h14.24c.22 0 .4.08.56.23.15.16.23.34.23.56zM7.36 14.2v-4h1.15v1.28h1.15V10.2h1.15v4H9.66v-1.53H8.51v1.53H7.36zm5.73-.77c.37-.38.55-.85.55-1.43 0-.57-.18-1.05-.55-1.43-.38-.37-.85-.56-1.43-.56-.57 0-1.05.19-1.43.56-.37.38-.56.86-.56 1.43 0 .58.19 1.05.56 1.43.38.37.86.56 1.43.56.58 0 1.05-.19 1.43-.56zm3.82-1.31c0 .45-.14.82-.43 1.1-.29.28-.68.42-1.19.42h-.67v.56h-1.15v-4h1.82c.51 0 .9.14 1.19.42.29.28.43.65.43 1.1v.4z"/>
  </svg>
)

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { itemCount, toggleCart } = useCart()
  const { developmentMode, showMailingListPopup, visiblePages } = usePageConfig()

  // Create navLinks from visible pages
  const navLinks = visiblePages.map(page => ({
    path: page.path,
    label: page.label
  }))

  // Hide nav and footer on EPK and Links pages, or on root if in development mode
  const showNavAndFooter = location.pathname !== '/epk' && location.pathname !== '/links' && !(developmentMode && location.pathname === '/')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {showNavAndFooter && <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-plague-black/95 backdrop-blur-md shadow-lg shadow-plague-green/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <motion.img
                src="/logo-green.png"
                alt="Plagued"
                className="h-12 w-auto"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-display text-sm uppercase tracking-widest transition-all duration-300 hover:text-plague-green ${
                    location.pathname === link.path
                      ? 'text-plague-green text-glow'
                      : 'text-plague-bone/80'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Cart & Mobile Menu Button */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-plague-bone/80 hover:text-plague-green transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-plague-green text-plague-black text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 text-plague-bone/80 hover:text-plague-green transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-plague-dark/95 backdrop-blur-md border-t border-plague-lighter/20"
            >
              <nav className="flex flex-col py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-6 py-3 font-display text-sm uppercase tracking-widest transition-all duration-300 ${
                      location.pathname === link.path
                        ? 'text-plague-green bg-plague-green/10'
                        : 'text-plague-bone/80 hover:text-plague-green hover:bg-plague-green/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>}

      {/* Main Content */}
      <main className={`flex-grow ${showNavAndFooter ? 'pt-20' : ''}`}>
        <Outlet />
      </main>

      {/* Footer */}
      {showNavAndFooter && <footer className="bg-plague-dark border-t border-plague-lighter/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Logo & Tagline */}
            <div>
              <img src="/logo-green.png" alt="Plagued" className="h-10 w-auto mb-4" />
              <p className="text-plague-mist/60 text-sm">
                Death Metal from the United Kingdom
              </p>
            </div>

            {/* Social & Contact */}
            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-plague-green mb-4">
                Connect
              </h4>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <a
                  href="https://www.instagram.com/plagued.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.facebook.com/Plagued.UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.tiktok.com/@plagued.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://www.youtube.com/@PlaguedUK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://open.spotify.com/artist/5oD38veNZ1ryvzKDH8zJKz?si=xFEdlX-ESoyYUmNHWSXSWw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Spotify"
                >
                  <SpotifyIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://music.apple.com/us/artist/plagued/1867938771"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Apple Music"
                >
                  <AppleMusicIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://plagueduk.bandcamp.com/track/malediction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Bandcamp"
                >
                  <BandcampIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://music.amazon.co.uk/artists/B008UZLJZC/the-plagued"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Amazon Music"
                >
                  <AmazonMusicIcon className="w-5 h-5" />
                </a>
              </div>
              <p className="text-plague-mist/60 text-sm">
                contact@plagueduk.com
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-plague-lighter/20 text-center">
            <p className="text-plague-mist/40 text-xs">
              © {new Date().getFullYear()} Plagued. All rights reserved.
            </p>
          </div>
        </div>
      </footer>}

      {/* Cart Sidebar */}
      {showNavAndFooter && <CartSidebar />}

      {/* Mailing List Popup */}
      {showMailingListPopup && <MailingListPopup />}
    </div>
  )
}

export default Layout
