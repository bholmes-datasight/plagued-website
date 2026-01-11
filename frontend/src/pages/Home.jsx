import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, ArrowRight, Skull, Users, Disc3, Music2, Mail, Instagram, Facebook, Youtube } from 'lucide-react'

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
    name: 'Benjamin Holmes',
    role: 'Lead Guitar',
  },
  {
    name: 'Joe McCloughlin',
    role: 'Drums',
  },
  {
    name: 'Chris Binks',
    role: 'Vocals',
  },
]

function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <div className="noise-overlay">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ y }} className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/album-artwork-without-logo.webp)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-plague-black/60 via-plague-black/40 to-plague-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-plague-black/80 via-transparent to-plague-black/80" />
        </motion.div>

        {/* Floating Mist Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-plague-green/10 to-transparent animate-pulse" />
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center px-4"
        >
          <motion.img
            src="/logo-green.png"
            alt="Plagued"
            className="w-64 md:w-96 lg:w-[500px] mb-8 drop-shadow-[0_0_40px_rgba(0,255,0,0.4)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          <motion.p
            className="font-display text-lg md:text-xl uppercase tracking-[0.3em] text-plague-mist/80 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Death Metal • United Kingdom
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link to="/music" className="btn-primary flex items-center gap-2">
              <Play className="w-5 h-5" />
              Listen Now
            </Link>
            <Link to="/merch" className="btn-secondary flex items-center gap-2">
              <Skull className="w-5 h-5" />
              Shop Merch
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="w-6 h-10 border-2 border-plague-green/50 rounded-full flex justify-center">
              <motion.div
                className="w-1.5 h-3 bg-plague-green rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Bio Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="section-heading mb-4">About Plagued</h2>
            <div className="w-24 h-1 bg-plague-green mx-auto" />
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Bio Text */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="bg-plague-grey/30 border border-plague-lighter/20 p-8 md:p-12 h-full">
                <p className="text-plague-mist/80 text-lg leading-relaxed mb-6">
                  Plagued is a five-piece death metal band from East Anglia, UK, formed in 2024. The band's debut EP, Rotting Dominions, presents old-school death metal with a modern sound, bringing together influences from each of the members, including old-school death metal, Swedish death metal, hardcore, metalcore, and thrash metal.
                </p>
                <p className="text-plague-mist/80 text-lg leading-relaxed mb-6">
                  The material is built around riff-driven songwriting, a modern Swedish guitar sound, and powerful, aggressive vocals, combining hardcore grooves with crushing fast death metal riffs.
                </p>
                <p className="text-plague-mist/80 text-lg leading-relaxed">
                  Rotting Dominions serves as Plagued's first recorded statement, establishing the band's foundations and direction.
                </p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Email */}
              <div className="card p-6">
                <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-4 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-plague-green" />
                  Email
                </h3>
                <a
                  href="mailto:plagueduk@gmail.com"
                  className="text-plague-mist/70 hover:text-plague-green transition-colors block"
                >
                  plagueduk@gmail.com
                </a>
              </div>

              {/* Social Media */}
              <div className="card p-6">
                <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-4">
                  Social Media
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://instagram.com/plagueduk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <Instagram className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">Instagram</span>
                  </a>
                  <a
                    href="https://facebook.com/plagueduk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <Facebook className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">Facebook</span>
                  </a>
                  <a
                    href="https://tiktok.com/@plagueduk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <TikTokIcon className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">TikTok</span>
                  </a>
                  <a
                    href="https://youtube.com/@plagueduk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <Youtube className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">YouTube</span>
                  </a>
                </div>
              </div>

              {/* Streaming Platforms */}
              <div className="card p-6">
                <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-4">
                  Listen On
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://open.spotify.com/artist/placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <SpotifyIcon className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">Spotify</span>
                  </a>
                  <a
                    href="https://music.apple.com/artist/placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <AppleMusicIcon className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">Apple Music</span>
                  </a>
                  <a
                    href="https://plagueduk.bandcamp.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <BandcampIcon className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">Bandcamp</span>
                  </a>
                  <a
                    href="https://www.deezer.com/artist/placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                  >
                    <DeezerIcon className="w-4 h-4 text-plague-green" />
                    <span className="text-xs text-plague-mist/70">Deezer</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Band Members Section */}
      <section className="py-24 px-4 bg-plague-dark/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading mb-4">The Lineup</h2>
            <div className="w-24 h-1 bg-plague-green mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {bandMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <div className="card p-8 text-center h-full hover:shadow-[0_0_30px_rgba(0,255,0,0.15)] transition-all duration-500">
                  {/* Name */}
                  <h3 className="font-display text-xl uppercase tracking-wider text-plague-bone mb-4 group-hover:text-plague-green transition-colors duration-300">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="font-blackletter text-xl text-plague-green/80">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Future Members Note */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 text-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-plague-grey/30 border border-plague-lighter/20">
              <Users className="w-5 h-5 text-plague-green/60" />
              <span className="text-plague-mist/60 text-sm">
                More members joining soon...
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Latest Release Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="section-heading mb-4">Latest Release</h2>
            <div className="w-24 h-1 bg-plague-green mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Album Artwork */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-plague-green/20 blur-xl group-hover:bg-plague-green/30 transition-all duration-500" />
              <img
                src="/album-artwork.jpg"
                alt="Rotting Dominions"
                className="relative w-full shadow-2xl shadow-plague-green/20"
              />
            </motion.div>

            {/* Album Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Disc3 className="w-6 h-6 text-plague-green" />
                <span className="font-display text-plague-green uppercase tracking-wider">
                  Debut EP • Coming February 2026
                </span>
              </div>

              <h3 className="font-blackletter text-4xl md:text-5xl text-plague-bone mb-6">
                Rotting Dominions
              </h3>

              {/* Production Credits */}
              <div className="mb-8">
                <h4 className="font-display text-sm uppercase tracking-widest text-plague-mist/60 mb-4 flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Production Credits
                </h4>
                <div className="space-y-3 p-6 bg-plague-grey/20 border border-plague-lighter/10">
                  <div className="flex justify-between items-center">
                    <span className="text-plague-mist/60 text-sm">Produced, Recorded & Mixed by</span>
                    <span className="text-plague-bone font-display">Benjamin Holmes</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-plague-mist/60 text-sm">Mastered by</span>
                    <span className="text-plague-bone font-display">Dan Swanö</span>
                  </div>
                </div>
              </div>

              {/* Coming Soon Message */}
              <div className="mb-8 p-8 bg-plague-green/5 border border-plague-green/20">
                <h4 className="font-blackletter text-xl text-plague-green mb-4">
                  Coming February 2026
                </h4>
                <p className="text-plague-mist/70 mb-4">
                  Rotting Dominions will be available on all major streaming platforms.
                </p>
                <p className="text-plague-mist/60 text-sm">
                  Follow us on social media for updates and the exact release date.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
