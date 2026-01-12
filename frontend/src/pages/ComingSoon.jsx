import { motion } from 'framer-motion'

function ComingSoon() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
      {/* Background */}
      <div className="absolute md:fixed inset-0 z-0 min-h-screen">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/album-artwork-without-logo.webp)' }}
        />
        <div className="absolute inset-0 bg-plague-black/90" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        <motion.img
          src="/logo-green.png"
          alt="Plagued"
          className="w-64 md:w-96 lg:w-[500px] mx-auto mb-12 drop-shadow-[0_0_50px_rgba(0,255,0,0.4)]"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <h1 className="font-blackletter text-4xl md:text-6xl text-plague-green mb-6">
            Coming Soon
          </h1>
          <p className="font-display text-lg md:text-xl uppercase tracking-[0.3em] text-plague-mist/80 mb-8">
            Death Metal • United Kingdom
          </p>
          <p className="text-plague-mist/60 max-w-md mx-auto">
            The plague is spreading. Our new website is under construction.
          </p>
        </motion.div>

        {/* Animated glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-plague-green/10 rounded-full blur-3xl animate-pulse pointer-events-none" />
      </div>
    </div>
  )
}

export default ComingSoon
