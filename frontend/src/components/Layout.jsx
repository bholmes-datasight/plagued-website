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
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/>
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
                src="/img/logo-green.png"
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
              <img src="/img/logo-green.png" alt="Plagued" className="h-10 w-auto mb-4" />
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
