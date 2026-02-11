import { motion } from 'framer-motion'
import { Music2, Disc3 } from 'lucide-react'

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

const YouTubeMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z"/>
  </svg>
)

const AmazonMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M17.06 11.57c0 .21-.07.36-.2.46-.12.1-.32.14-.57.14h-.67v-1.2h.67c.25 0 .45.05.57.14.13.1.2.25.2.46zm-6.82 1.88c-.24.24-.54.36-.9.36-.37 0-.67-.12-.9-.36-.24-.24-.36-.56-.36-.94 0-.38.12-.7.36-.94.23-.24.53-.36.9-.36.36 0 .66.12.9.36.24.24.35.56.35.94 0 .38-.11.7-.35.94zm9.67-4.85v6.8c0 .22-.08.4-.23.56-.15.15-.34.23-.56.23H4.88c-.22 0-.4-.08-.56-.23-.15-.16-.23-.34-.23-.56v-6.8c0-.22.08-.4.23-.56.16-.15.34-.23.56-.23h14.24c.22 0 .4.08.56.23.15.16.23.34.23.56zM7.36 14.2v-4h1.15v1.28h1.15V10.2h1.15v4H9.66v-1.53H8.51v1.53H7.36zm5.73-.77c.37-.38.55-.85.55-1.43 0-.57-.18-1.05-.55-1.43-.38-.37-.85-.56-1.43-.56-.57 0-1.05.19-1.43.56-.37.38-.56.86-.56 1.43 0 .58.19 1.05.56 1.43.38.37.86.56 1.43.56.58 0 1.05-.19 1.43-.56zm3.82-1.31c0 .45-.14.82-.43 1.1-.29.28-.68.42-1.19.42h-.67v.56h-1.15v-4h1.82c.51 0 .9.14 1.19.42.29.28.43.65.43 1.1v.4z"/>
  </svg>
)


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

      {/* Malediction Single */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Single Artwork */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-plague-green/10 blur-2xl group-hover:bg-plague-green/15 transition-all duration-500" />
              <img
                src="/img/malediction_album_cover.png"
                alt="Malediction"
                className="relative w-full shadow-2xl shadow-plague-green/10"
              />
            </motion.div>

            {/* Single Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Disc3 className="w-6 h-6 text-plague-green" />
                <span className="font-display text-plague-green uppercase tracking-wider">
                  Single • Out Now
                </span>
              </div>

              <h2 className="font-blackletter text-4xl md:text-5xl lg:text-6xl text-plague-bone mb-8">
                Malediction
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

              {/* Streaming Links */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://open.spotify.com/artist/5oD38veNZ1ryvzKDH8zJKz?si=xFEdlX-ESoyYUmNHWSXSWw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300"
                >
                  <SpotifyIcon className="w-5 h-5 text-plague-green" />
                  <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Spotify</span>
                </a>
                <a
                  href="https://music.apple.com/us/artist/plagued/1867938771"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300"
                >
                  <AppleMusicIcon className="w-5 h-5 text-plague-green" />
                  <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Apple</span>
                </a>
                <a
                  href="https://music.youtube.com/channel/UC3FO1IzOLymLxDvjSc7wBYQ?si=LUHLsft0Xr9Q985I"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300"
                >
                  <YouTubeMusicIcon className="w-5 h-5 text-plague-green" />
                  <span className="font-display text-sm uppercase tracking-wider text-plague-mist">YouTube</span>
                </a>
                <a
                  href="https://plagueduk.bandcamp.com/track/malediction"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300"
                >
                  <BandcampIcon className="w-5 h-5 text-plague-green" />
                  <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Bandcamp</span>
                </a>
                <a
                  href="https://music.amazon.co.uk/artists/B008UZLJZC/the-plagued"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="col-span-2 flex items-center justify-center gap-2 p-3 bg-plague-grey/20 border border-plague-green/30 hover:border-plague-green hover:bg-plague-grey/40 transition-all duration-300"
                >
                  <AmazonMusicIcon className="w-5 h-5 text-plague-green" />
                  <span className="font-display text-sm uppercase tracking-wider text-plague-mist">Amazon Music</span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rotting Dominions EP */}
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
