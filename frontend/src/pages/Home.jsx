import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Play, ArrowRight, Skull } from 'lucide-react'

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
            style={{ backgroundImage: 'url(/album-artwork-without-logo.jpg)' }}
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
              <p className="font-display text-plague-green uppercase tracking-wider mb-2">
                Debut EP • 2025
              </p>
              <h3 className="font-blackletter text-4xl md:text-5xl text-plague-bone mb-6">
                Rotting Dominions
              </h3>

              <div className="space-y-3 mb-8">
                {[
                  'Boneshaper',
                  'Sporeborn',
                  'Malediction',
                  'Fentylation',
                  'Divine Infection',
                ].map((track, index) => (
                  <motion.div
                    key={track}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="flex items-center gap-4 p-3 bg-plague-grey/30 border-l-2 border-plague-green/50 hover:border-plague-green hover:bg-plague-grey/50 transition-all duration-300"
                  >
                    <span className="font-display text-plague-green/60 text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-body text-plague-bone">{track}</span>
                  </motion.div>
                ))}
              </div>

              <Link
                to="/music"
                className="btn-primary inline-flex items-center gap-2"
              >
                Stream Now
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Band Section Preview */}
      <section className="py-24 px-4 bg-plague-dark/50">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-heading mb-6">The Plague Spreads</h2>
            <p className="text-plague-mist/70 max-w-2xl mx-auto mb-8 text-lg">
              A UK death metal band delivering crushing riffs and relentless 
              aggression. Old school brutality with modern intensity.
            </p>
            <Link
              to="/about"
              className="btn-secondary inline-flex items-center gap-2"
            >
              About the Band
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
