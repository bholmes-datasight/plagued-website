import { useEffect, useRef, useMemo } from 'react'
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

// Generate random particle positions
const generateParticles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${15 + Math.random() * 20}s`,
    animationDelay: `${-(Math.random() * 30)}s`, // Negative delay makes them start mid-animation
    size: Math.random() * 4 + 2, // Slightly larger: 2-6px
  }))
}

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

function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  // Generate particles once
  const particlesMobile = useMemo(() => generateParticles(50), [])
  const particlesDesktop = useMemo(() => generateParticles(80), [])

  return (
    <div className="noise-overlay">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div style={{ y }} className="absolute inset-0">
          {/* Mobile */}
          <div
            className="absolute inset-0 md:hidden bg-plague-black"
            style={{ backgroundImage: 'url(/img/main-band-mobile.jpg)', backgroundPosition: '35% -120%', backgroundSize: '190%', backgroundRepeat: 'no-repeat' }}
          />
          {/* Desktop */}
          <div
            className="absolute inset-0 hidden md:block 2xl:hidden"
            style={{ backgroundImage: 'url(/img/main-band.png)', backgroundPosition: '10% 60%', backgroundSize: '120%' }}
          />
          {/* Ultrawide */}
          <div
            className="absolute inset-0 hidden 2xl:block"
            style={{ backgroundImage: 'url(/img/main-band.png)', backgroundPosition: '10% 35%', backgroundSize: '120%' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-plague-black/60 via-plague-black/40 to-plague-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-plague-black/80 via-transparent to-plague-black/80" />
        </motion.div>

        {/* Floating Mist Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-plague-green/[0.03] to-transparent animate-pulse" />
        </div>

        {/* Floating Particles/Spores - Mobile */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden md:hidden">
          {particlesMobile.map((particle) => (
            <div
              key={particle.id}
              className="absolute bottom-0 rounded-full bg-plague-green/20 animate-float-up"
              style={{
                left: particle.left,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: particle.animationDuration,
                animationDelay: particle.animationDelay,
              }}
            />
          ))}
        </div>

        {/* Floating Particles/Spores - Desktop */}
        <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden hidden md:block">
          {particlesDesktop.map((particle) => (
            <div
              key={particle.id}
              className="absolute bottom-0 rounded-full bg-plague-green/20 animate-float-up scale-150"
              style={{
                left: particle.left,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animationDuration: particle.animationDuration,
                animationDelay: particle.animationDelay,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity }}
          className="relative z-10 h-full flex flex-col items-center justify-center px-4"
        >
          <motion.img
            src="/img/logo-green.png"
            alt="Plagued"
            className="w-64 md:w-96 lg:w-[500px] mb-8 drop-shadow-[0_0_40px_rgba(0,255,0,0.4)]"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          <motion.h1
            className="font-blackletter text-4xl md:text-5xl lg:text-6xl text-plague-bone mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Rotting Dominions
          </motion.h1>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <a
              href="https://open.spotify.com/artist/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-plague-grey/30 border border-plague-green/30 rounded-full group-hover:bg-plague-green/20 group-hover:border-plague-green group-hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all duration-300">
                <SpotifyIcon className="w-6 h-6 md:w-8 md:h-8 text-plague-green" />
              </div>
            </a>
            <a
              href="https://music.apple.com/artist/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-plague-grey/30 border border-plague-green/30 rounded-full group-hover:bg-plague-green/20 group-hover:border-plague-green group-hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all duration-300">
                <AppleMusicIcon className="w-6 h-6 md:w-8 md:h-8 text-plague-green" />
              </div>
            </a>
            <a
              href="https://plagueduk.bandcamp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-plague-grey/30 border border-plague-green/30 rounded-full group-hover:bg-plague-green/20 group-hover:border-plague-green group-hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all duration-300">
                <BandcampIcon className="w-6 h-6 md:w-8 md:h-8 text-plague-green" />
              </div>
            </a>
            <a
              href="https://www.deezer.com/artist/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 transition-all duration-300"
            >
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-plague-grey/30 border border-plague-green/30 rounded-full group-hover:bg-plague-green/20 group-hover:border-plague-green group-hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] transition-all duration-300">
                <DeezerIcon className="w-6 h-6 md:w-8 md:h-8 text-plague-green" />
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <Link to="/merch" className="btn-secondary flex items-center gap-2 inline-flex">
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
              <div className="absolute -inset-4 bg-plague-green/10 blur-xl group-hover:bg-plague-green/15 transition-all duration-500" />
              <img
                src="/img/album-artwork.jpg"
                alt="Rotting Dominions"
                className="relative w-full shadow-2xl shadow-plague-green/10"
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
