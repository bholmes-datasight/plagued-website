import { motion } from 'framer-motion'
import { Disc3, Music2, Mail, Instagram, Facebook, Youtube, Download, Globe } from 'lucide-react'
import { usePageConfig } from '../hooks/usePageConfig'
import { Link } from 'react-router-dom'

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

const DeezerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.81 4.16v3.03h5.17V4.16h-5.17zm0 4.55v3.03h5.17V8.71h-5.17zm0 4.54v3.03h5.17v-3.03h-5.17zm-6.55-9.09v3.03h5.17V4.16h-5.17zm0 4.55v3.03h5.17V8.71h-5.17zm0 4.54v3.03h5.17v-3.03h-5.17zm0 4.55v3.04h5.17V17.8h-5.17zM5.7 8.71v3.03h5.17V8.71H5.7zm0 4.54v3.03h5.17v-3.03H5.7zm0 4.55v3.04h5.17V17.8H5.7zM0 13.25v3.03h5.17v-3.03H0zm0 4.55v3.04h5.17V17.8H0z"/>
  </svg>
)

const bandMembers = [
  {
    name: 'Chris Binks',
    role: 'Vocals',
  },
  {
    name: 'Benjamin Holmes',
    role: 'Lead Guitar',
  },
  {
    name: 'Chris Poll',
    role: 'Rhythm Guitar',
  },
  {
    name: 'Jay Rutterford',
    role: 'Bass Guitar',
  },
  {
    name: 'Joey Mac',
    role: 'Drums',
  },
]

function EPK() {
  const { epkConfig } = usePageConfig()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute md:fixed inset-0 z-0 min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/album-artwork-without-logo.webp)' }}
        />
        <div className="absolute inset-0 bg-plague-black/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Logo */}
        <motion.img
          src="/logo-green.png"
          alt="Plagued"
          className="w-48 md:w-64 mb-8 drop-shadow-[0_0_40px_rgba(0,255,0,0.3)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <p className="font-display text-sm md:text-base uppercase tracking-[0.3em] text-plague-mist/80 mb-12">
          Death Metal • United Kingdom
        </p>

        {/* Content Grid */}
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 card p-6 md:p-8"
          >
            <h2 className="font-display text-xl uppercase tracking-wider text-plague-green mb-4">About</h2>
            <div className="text-plague-mist/80 leading-relaxed space-y-3 text-sm md:text-base">
              <p>
                Plagued is a five-piece death metal band from East Anglia, UK, formed in 2024. The band's debut EP, Rotting Dominions, presents old-school death metal with a modern sound, bringing together influences from each of the members, including old-school death metal, Swedish death metal, hardcore, metalcore, and thrash metal.
              </p>
              <p>
                The material is built around riff-driven songwriting, a modern Swedish guitar sound, and powerful, aggressive vocals, combining hardcore grooves with crushing fast death metal riffs.
              </p>
              <p>
                Rotting Dominions serves as Plagued's first recorded statement, establishing the band's foundations and direction.
              </p>
            </div>
          </motion.div>

          {/* Contact & Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-4"
          >
            {/* Website */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Website
              </h3>
              <Link
                to="/"
                className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
              >
                <Globe className="w-3 h-3 text-plague-green" />
                <div className="flex flex-col">
                  <span className="text-plague-mist/70">plagueduk.com</span>
                  <span className="text-plague-mist/50 text-xs">Coming Soon</span>
                </div>
              </Link>
            </div>

            {/* Email */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                Email
              </h3>
              <a
                href="mailto:contact@plagueduk.com"
                className="text-plague-mist/70 hover:text-plague-green transition-colors text-sm block"
              >
                contact@plagueduk.com
              </a>
            </div>

            {/* Social Media */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3">
                Socials
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://www.instagram.com/plagued.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Instagram className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Instagram</span>
                </a>
                <a
                  href="https://www.facebook.com/Plagued.UK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Facebook className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Facebook</span>
                </a>
                <a
                  href="https://www.youtube.com/@PlaguedUK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Youtube className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">YouTube</span>
                </a>
                <a
                  href="https://tiktok.com/@plagueduk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <TikTokIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">TikTok</span>
                </a>
              </div>
            </div>

            {/* Streaming - Greyed out until release */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3">
                Listen On
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 opacity-70 cursor-not-allowed rounded text-xs">
                  <SpotifyIcon className="w-3 h-3 text-plague-mist/50" />
                  <span className="text-plague-mist/50">Spotify</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 opacity-70 cursor-not-allowed rounded text-xs">
                  <AppleMusicIcon className="w-3 h-3 text-plague-mist/50" />
                  <span className="text-plague-mist/50">Apple</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 opacity-70 cursor-not-allowed rounded text-xs">
                  <BandcampIcon className="w-3 h-3 text-plague-mist/50" />
                  <span className="text-plague-mist/50">Bandcamp</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 opacity-70 cursor-not-allowed rounded text-xs">
                  <DeezerIcon className="w-3 h-3 text-plague-mist/50" />
                  <span className="text-plague-mist/50">Deezer</span>
                </div>
              </div>
            </div>

            {/* Press Materials / Downloads */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3 flex items-center gap-2">
                <Download className="w-3 h-3" />
                Press Materials
              </h3>
              <a
                href="https://drive.google.com/file/d/1wSbv1ih62e-huIFuSvA_f6tMwpaU-a1q/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
              >
                <Download className="w-3 h-3 text-plague-green" />
                <span className="text-plague-mist/70">Download Artwork</span>
              </a>
            </div>
          </motion.div>

          {/* Lineup */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card p-6"
          >
            <h2 className="font-display text-xl uppercase tracking-wider text-plague-green mb-4">Lineup</h2>
            <div className="space-y-3">
              {bandMembers.map((member) => (
                <div key={member.name} className="border-b border-plague-lighter/10 pb-2 last:border-0">
                  <p className="text-plague-bone text-sm md:text-base font-display tracking-wide">{member.name}</p>
                  <p className="text-plague-green/80 text-xs">{member.role}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Latest Release */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="lg:col-span-2 card p-6"
          >
            <h2 className="font-display text-xl uppercase tracking-wider text-plague-green mb-4">Latest Release</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <img
                  src="/album-artwork.jpg"
                  alt="Rotting Dominions"
                  className="w-full shadow-2xl shadow-plague-green/20 mb-4"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Disc3 className="w-4 h-4 text-plague-green" />
                  <span className="font-display text-plague-green uppercase tracking-wider text-xs">
                    Debut EP • February 2026
                  </span>
                </div>
                <h3 className="font-blackletter text-3xl text-plague-bone mb-4">Rotting Dominions</h3>
                <div className="space-y-2 text-sm text-plague-mist/70 mb-4">
                  <div className="flex justify-between border-b border-plague-lighter/10 pb-1">
                    <span className="text-plague-mist/50 text-xs">Produced, Recorded & Mixed</span>
                    <span className="font-display text-plague-bone text-xs">Benjamin Holmes</span>
                  </div>
                  <div className="flex justify-between border-b border-plague-lighter/10 pb-1">
                    <span className="text-plague-mist/50 text-xs">Mastered</span>
                    <span className="font-display text-plague-bone text-xs">Dan Swanö</span>
                  </div>
                </div>
                <p className="text-plague-mist/60 text-xs mb-4">
                  Listen to the full EP below:
                </p>
              </div>
            </div>

            {/* SoundCloud Embed */}
            <div className="mt-6">
              <iframe
                width="100%"
                height="450"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/soundcloud%3Aplaylists%3A2170826408%3Fsecret_token%3Ds-Vt9z2o4tJot&color=%2300ff00&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=false"
                className="rounded border border-plague-lighter/20"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EPK
