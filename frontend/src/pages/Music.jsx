import { motion } from 'framer-motion'
import { Play, ExternalLink, Music2, Disc3 } from 'lucide-react'

// Streaming platform icons/colors
const streamingPlatforms = [
  {
    name: 'Spotify',
    url: '', // Add when available
    color: '#1DB954',
    available: false,
  },
  {
    name: 'Apple Music',
    url: '',
    color: '#FA243C',
    available: false,
  },
  {
    name: 'Bandcamp',
    url: '',
    color: '#1DA0C3',
    available: false,
  },
  {
    name: 'YouTube Music',
    url: '',
    color: '#FF0000',
    available: false,
  },
  {
    name: 'Deezer',
    url: '',
    color: '#FEAA2D',
    available: false,
  },
  {
    name: 'Amazon Music',
    url: '',
    color: '#FF9900',
    available: false,
  },
]


function Music() {
  return (
    <div className="noise-overlay">
      {/* Hero Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-plague-green/5 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="section-heading mb-6">Music</h1>
            <div className="w-24 h-1 bg-plague-green mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Main Release */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Album Artwork */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-plague-green/10 blur-2xl group-hover:bg-plague-green/15 transition-all duration-500" />
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
              
              <h2 className="font-blackletter text-4xl md:text-5xl lg:text-6xl text-plague-bone mb-8">
                Rotting Dominions
              </h2>

              {/* Production Credits */}
              <div className="mb-10">
                <h3 className="font-display text-sm uppercase tracking-widest text-plague-mist/60 mb-4 flex items-center gap-2">
                  <Music2 className="w-4 h-4" />
                  Production Credits
                </h3>
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
              <div className="text-center p-8 bg-plague-green/5 border border-plague-green/20">
                <h3 className="font-blackletter text-xl text-plague-green mb-4">
                  Coming February 2026
                </h3>
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

      {/* More Coming Soon */}
      <section className="py-24 px-4 bg-plague-dark/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Disc3 className="w-16 h-16 mx-auto text-plague-green/30 mb-6" />
            <h2 className="font-display text-2xl uppercase tracking-wider text-plague-mist/60 mb-4">
              More Releases Coming Soon
            </h2>
            <p className="text-plague-mist/40">
              The plague continues to spread. Stay tuned for more.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Music
