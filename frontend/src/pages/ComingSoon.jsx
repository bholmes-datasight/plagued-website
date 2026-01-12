import { motion } from 'framer-motion'

// Generate random particle positions
const generateParticles = (count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${15 + Math.random() * 20}s`,
    animationDelay: `${Math.random() * 10}s`,
    size: Math.random() * 3 + 1,
  }))
}

function ComingSoon() {
  const particles = generateParticles(30)

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

      {/* Animated Noise/Grain Overlay */}
      <div className="absolute inset-0 z-[1] opacity-20 mix-blend-overlay pointer-events-none">
        <div
          className="absolute inset-0 animate-grain"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        />
      </div>

      {/* Rising Smoke/Mist */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-plague-green/5 via-plague-green/2 to-transparent animate-rise-slow" />
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-plague-black/30 via-plague-black/10 to-transparent animate-rise-medium" />
      </div>

      {/* Floating Particles/Spores */}
      <div className="absolute inset-0 z-[3] pointer-events-none overflow-hidden">
        {particles.map((particle) => (
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
