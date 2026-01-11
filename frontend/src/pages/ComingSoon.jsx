import { motion } from 'framer-motion'
import { Instagram, Facebook } from 'lucide-react'

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

const DeezerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.81 4.16v3.03h5.17V4.16h-5.17zm0 4.55v3.03h5.17V8.71h-5.17zm0 4.54v3.03h5.17v-3.03h-5.17zm-6.55-9.09v3.03h5.17V4.16h-5.17zm0 4.55v3.03h5.17V8.71h-5.17zm0 4.54v3.03h5.17v-3.03h-5.17zm0 4.55v3.04h5.17V17.8h-5.17zM5.7 8.71v3.03h5.17V8.71H5.7zm0 4.54v3.03h5.17v-3.03H5.7zm0 4.55v3.04h5.17V17.8H5.7zM0 13.25v3.03h5.17v-3.03H0zm0 4.55v3.04h5.17V17.8H0z"/>
  </svg>
)

function ComingSoon() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/album-artwork-without-logo.webp)' }}
        />
        <div className="absolute inset-0 bg-plague-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-xl px-4">
        {/* Logo */}
        <motion.img
          src="/logo-green.png"
          alt="Plagued"
          className="w-48 md:w-64 mx-auto mb-8 drop-shadow-[0_0_40px_rgba(0,255,0,0.3)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-display text-sm md:text-base uppercase tracking-[0.3em] text-plague-mist/80 text-center mb-12"
        >
          Death Metal • United Kingdom
        </motion.p>

        {/* Links Container */}
        <div className="space-y-4">
          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-3"
          >
            <a
              href="https://www.instagram.com/plagued.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <Instagram className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Instagram</span>
            </a>

            <a
              href="https://www.facebook.com/Plagued.UK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <Facebook className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Facebook</span>
            </a>
          </motion.div>

          {/* Streaming Platforms */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3 pt-4"
          >
            <p className="text-center text-plague-mist/50 text-xs uppercase tracking-widest mb-4">
              Listen On
            </p>

            <a
              href="https://open.spotify.com/artist/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <SpotifyIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Spotify</span>
            </a>

            <a
              href="https://music.apple.com/artist/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <AppleMusicIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Apple Music</span>
            </a>

            <a
              href="https://plagueduk.bandcamp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <BandcampIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Bandcamp</span>
            </a>

            <a
              href="https://www.deezer.com/artist/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <DeezerIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Deezer</span>
            </a>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center text-plague-mist/40 text-xs mt-12"
        >
          Website launching soon
        </motion.p>
      </div>

      {/* Animated glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-plague-green/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
    </div>
  )
}

export default ComingSoon
