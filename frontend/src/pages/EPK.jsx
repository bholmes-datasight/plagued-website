import { motion } from 'framer-motion'
import { Disc3, Music2, Mail, Instagram, Facebook, Youtube, Download, Globe, Image } from 'lucide-react'
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

const AmazonMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z"/>
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
          style={{ backgroundImage: 'url(/img/album-artwork-without-logo.webp)' }}
        />
        <div className="absolute inset-0 bg-plague-black/85" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
        {/* Logo */}
        <motion.img
          src="/img/logo-green.png"
          alt="Plagued"
          className="w-48 md:w-64 mb-8 drop-shadow-[0_0_40px_rgba(0,255,0,0.3)]"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />

        <p className="font-display text-sm md:text-base uppercase tracking-[0.3em] text-plague-mist/80 mb-12">
          Death Metal • East of England
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
                Plagued is a five-piece death metal band from the East of England, formed in 2024. The band's debut EP, Rotting Dominions, presents old-school death metal with a modern sound, bringing together influences from each of the members, including old-school death metal, Swedish death metal, hardcore, metalcore, and thrash metal.
              </p>
              <p>
                The material is built around riff-driven songwriting, a modern Swedish guitar sound, and powerful, aggressive vocals, combining hardcore grooves with crushing fast death metal riffs.
              </p>
              <p>
                Rotting Dominions serves as Plagued's first recorded statement, establishing the band's foundations and direction.
              </p>
            </div>
            <img
              src="/img/photo-band.jpg"
              alt="Plagued band photo"
              className="w-full mt-6 rounded border border-plague-lighter/20"
            />
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
                  href="https://www.tiktok.com/@plagued.uk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <TikTokIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">TikTok</span>
                </a>
              </div>
            </div>

            {/* Streaming */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3">
                Listen On
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://open.spotify.com/artist/5oD38veNZ1ryvzKDH8zJKz?si=xFEdlX-ESoyYUmNHWSXSWw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <SpotifyIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Spotify</span>
                </a>
                <a
                  href="https://music.apple.com/us/artist/plagued/1867938771"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <AppleMusicIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Apple</span>
                </a>
                <a
                  href="https://plagueduk.bandcamp.com/track/malediction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <BandcampIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Bandcamp</span>
                </a>
                <a
                  href="https://music.amazon.co.uk/artists/B008UZLJZC/the-plagued"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/10 border border-plague-green/30 hover:border-plague-green hover:bg-plague-lighter/20 transition-all duration-300 rounded text-xs"
                >
                  <AmazonMusicIcon className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist">Amazon</span>
                </a>
              </div>
            </div>

            {/* Press Materials / Downloads */}
            <div className="card p-4">
              <h3 className="font-display text-xs uppercase tracking-wider text-plague-green mb-3 flex items-center gap-2">
                <Download className="w-3 h-3" />
                Press Materials
              </h3>
              <div className="space-y-2">
                <a
                  href="https://drive.google.com/drive/folders/1dNfg8aZ__B3bnDBg1RLTEh7TQ4BJ0xpp?usp=drive_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Music2 className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Download EP (MP3)</span>
                </a>
                <a
                  href="https://drive.google.com/file/d/1wSbv1ih62e-huIFuSvA_f6tMwpaU-a1q/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Download className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Download Artwork</span>
                </a>
                <a
                  href="https://drive.google.com/drive/folders/1cZfhzg5G22bs-dde6A1QWM9IHGJrn_vc?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded text-xs"
                >
                  <Image className="w-3 h-3 text-plague-green" />
                  <span className="text-plague-mist/70">Band Photos</span>
                </a>
              </div>
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
                  src="/img/album-artwork.jpg"
                  alt="Rotting Dominions"
                  className="w-full shadow-2xl shadow-black/30 mb-4"
                />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <Disc3 className="w-4 h-4 text-plague-green" />
                  <span className="font-display text-plague-green uppercase tracking-wider text-xs">
                    Debut EP • 27th February 2026
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
                  <div className="flex justify-between border-b border-plague-lighter/10 pb-1">
                    <span className="text-plague-mist/50 text-xs">Cover Art</span>
                    <a
                      href="https://www.instagram.com/hyperbholic"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-display text-plague-bone text-xs hover:text-plague-green transition-colors"
                    >
                      Mohammed Khoirul Anam
                    </a>
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

            {/* YouTube Video */}
            <div className="mt-6">
              <p className="text-plague-mist/60 text-xs mb-3">
                "Malediction" (Single releasing 30th January):
              </p>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full rounded border border-plague-lighter/20"
                  src="https://www.youtube-nocookie.com/embed/V5wuEUriRUI"
                  title="Plagued - Malediction"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EPK
