import { motion } from 'framer-motion'
import { Instagram, Facebook, Youtube, Globe, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.954-1.289-2.066-1.289-3.338v-.8H12.56v14.8c0 2.327-1.892 4.219-4.218 4.219S4.124 17.327 4.124 15c0-2.327 1.892-4.219 4.218-4.219.462 0 .905.075 1.321.213v-3.996c-.436-.061-.88-.092-1.321-.092C3.708 6.906 0 10.614 0 15.25s3.708 8.344 8.342 8.344 8.342-3.708 8.342-8.344v-6.9c1.132.748 2.45 1.15 3.816 1.15v-3.938z"/>
  </svg>
)

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

const AmazonMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.06 11.57c0 .21-.07.36-.2.46-.12.1-.32.14-.57.14h-.67v-1.2h.67c.25 0 .45.05.57.14.13.1.2.25.2.46zm-6.82 1.88c-.24.24-.54.36-.9.36-.37 0-.67-.12-.9-.36-.24-.24-.36-.56-.36-.94 0-.38.12-.7.36-.94.23-.24.53-.36.9-.36.36 0 .66.12.9.36.24.24.35.56.35.94 0 .38-.11.7-.35.94zm9.67-4.85v6.8c0 .22-.08.4-.23.56-.15.15-.34.23-.56.23H4.88c-.22 0-.4-.08-.56-.23-.15-.16-.23-.34-.23-.56v-6.8c0-.22.08-.4.23-.56.16-.15.34-.23.56-.23h14.24c.22 0 .4.08.56.23.15.16.23.34.23.56zM7.36 14.2v-4h1.15v1.28h1.15V10.2h1.15v4H9.66v-1.53H8.51v1.53H7.36zm5.73-.77c.37-.38.55-.85.55-1.43 0-.57-.18-1.05-.55-1.43-.38-.37-.85-.56-1.43-.56-.57 0-1.05.19-1.43.56-.37.38-.56.86-.56 1.43 0 .58.19 1.05.56 1.43.38.37.86.56 1.43.56.58 0 1.05-.19 1.43-.56zm3.82-1.31c0 .45-.14.82-.43 1.1-.29.28-.68.42-1.19.42h-.67v.56h-1.15v-4h1.82c.51 0 .9.14 1.19.42.29.28.43.65.43 1.1v.4z"/>
  </svg>
)

const YouTubeMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228 18.228 15.432 18.228 12 15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
  </svg>
)

function Links() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center py-12">
      {/* Background */}
      <div className="absolute md:fixed inset-0 z-0 min-h-screen">
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
          Death Metal • East of England
        </motion.p>

        {/* Links Container */}
        <div className="space-y-4">
          {/* Streaming Platforms - New Single */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="space-y-3"
          >
            <p className="text-center text-plague-green text-sm uppercase tracking-widest mb-4 font-display">
              New Single "Malediction" Out Now
            </p>

            <a
              href="https://open.spotify.com/artist/5oD38veNZ1ryvzKDH8zJKz?si=xFEdlX-ESoyYUmNHWSXSWw"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300 backdrop-blur-sm"
            >
              <SpotifyIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Spotify</span>
            </a>

            <a
              href="https://music.apple.com/us/artist/plagued/1867938771"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300 backdrop-blur-sm"
            >
              <AppleMusicIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Apple Music</span>
            </a>

            <a
              href="https://music.youtube.com/channel/UC3FO1IzOLymLxDvjSc7wBYQ?si=LUHLsft0Xr9Q985I"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300 backdrop-blur-sm"
            >
              <YouTubeMusicIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-mist">YouTube Music</span>
            </a>

            <a
              href="https://plagueduk.bandcamp.com/track/malediction"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300 backdrop-blur-sm"
            >
              <BandcampIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Bandcamp</span>
            </a>

            <a
              href="https://music.amazon.co.uk/artists/B008UZLJZC/the-plagued"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300 backdrop-blur-sm"
            >
              <AmazonMusicIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Amazon Music</span>
            </a>
          </motion.div>

          {/* Socials Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="space-y-3 pt-4"
          >
            <p className="text-center text-plague-mist/50 text-xs uppercase tracking-widest mb-4">
              Socials
            </p>
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

            <a
              href="https://www.youtube.com/@PlaguedUK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <Youtube className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">YouTube</span>
            </a>

            <a
              href="https://www.tiktok.com/@plagued.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <TikTokIcon className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">TikTok</span>
            </a>
          </motion.div>

          {/* Website & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-3 pt-4"
          >
            <Link
              to="/"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <Globe className="w-5 h-5 text-plague-green" />
              <div className="flex flex-col items-center">
                <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Website</span>
                <span className="text-plague-mist/50 text-xs">Coming Soon</span>
              </div>
            </Link>

            <a
              href="mailto:contact@plagueduk.com"
              className="flex items-center justify-center gap-3 w-full p-4 bg-plague-grey/40 border border-plague-green/30 hover:bg-plague-green/10 hover:border-plague-green transition-all duration-300 backdrop-blur-sm"
            >
              <Mail className="w-5 h-5 text-plague-green" />
              <span className="font-display text-sm uppercase tracking-wider text-plague-bone">Email Us</span>
            </a>
          </motion.div>

        </div>
      </div>

      {/* Animated glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-plague-green/5 rounded-full blur-3xl animate-pulse pointer-events-none" />
    </div>
  )
}

export default Links
