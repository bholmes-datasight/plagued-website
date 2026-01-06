import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingCart, Instagram, Facebook, Youtube, Music, Mail } from 'lucide-react'
import { useCart } from '../context/CartContext'
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

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/music', label: 'Music' },
  { path: '/merch', label: 'Merch' },
  { path: '/shows', label: 'Shows' },
  { path: '/contact', label: 'Contact' },
]

function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { itemCount, toggleCart } = useCart()

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
      <header
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
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-plague-dark border-t border-plague-lighter/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo & Tagline */}
            <div>
              <img src="/logo-green.png" alt="Plagued" className="h-10 w-auto mb-4" />
              <p className="text-plague-mist/60 text-sm">
                Death Metal from the United Kingdom
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-plague-green mb-4">
                Navigation
              </h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-plague-mist/60 hover:text-plague-green text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social & Contact */}
            <div>
              <h4 className="font-display text-sm uppercase tracking-wider text-plague-green mb-4">
                Connect
              </h4>
              <div className="grid grid-cols-4 gap-3 mb-4">
                <a
                  href="https://instagram.com/plagueduk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://facebook.com/plagueduk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://tiktok.com/@plagueduk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="TikTok"
                >
                  <TikTokIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com/@plagueduk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
                <a
                  href="https://open.spotify.com/artist/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Spotify"
                >
                  <SpotifyIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://music.apple.com/artist/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Apple Music"
                >
                  <AppleMusicIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://plagueduk.bandcamp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Bandcamp"
                >
                  <BandcampIcon className="w-5 h-5" />
                </a>
                <a
                  href="mailto:plagueduk@gmail.com"
                  className="p-2 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-all duration-300 rounded flex items-center justify-center"
                  title="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
              <p className="text-plague-mist/60 text-sm">
                plagueduk@gmail.com
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-plague-lighter/20 text-center">
            <p className="text-plague-mist/40 text-xs">
              © {new Date().getFullYear()} Plagued. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Cart Sidebar */}
      <CartSidebar />
      
      {/* Mailing List Popup */}
      <MailingListPopup />
    </div>
  )
}

export default Layout
