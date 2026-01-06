import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

// Custom Metal Icons
const ElectricGuitarIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M21.5 2.5l-.88.88-2.12-2.12.88-.88c.39-.39 1.02-.39 1.41 0l.71.71c.39.39.39 1.02 0 1.41zM8.5 12.5l-1-1 7.07-7.07 1 1L8.5 12.5zm7-7l1-1 2.12 2.12-1 1-2.12-2.12zM3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM16 3c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0L16 4.25 19.75 8l.96-.96z"/>
  </svg>
)

const DrumIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 2C9.24 2 7 4.24 7 7v10c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-2.76-2.24-5-5-5zM9 7c0-1.66 1.34-3 3-3s3 1.34 3 3v1H9V7zm6 10c0 1.66-1.34 3-3 3s-3-1.34-3-3V10h6v7z"/>
    <circle cx="12" cy="12" r="1"/>
    <circle cx="10" cy="14" r="0.5"/>
    <circle cx="14" cy="14" r="0.5"/>
  </svg>
)

const MicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
  </svg>
)

const bandMembers = [
  {
    name: 'Benjamin Holmes',
    role: 'Lead Guitar',
    icon: ElectricGuitarIcon,
  },
  {
    name: 'Joe McCloughlin',
    role: 'Drums',
    icon: DrumIcon,
  },
  {
    name: 'Chris Binks',
    role: 'Vocals',
    icon: MicIcon,
  },
]

function About() {
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
            <h1 className="section-heading mb-6">About Plagued</h1>
            <div className="w-24 h-1 bg-plague-green mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <div className="bg-plague-grey/30 border border-plague-lighter/20 p-8 md:p-12">
              <p className="text-plague-mist/80 text-lg leading-relaxed mb-6">
                <span className="text-plague-green font-display">Plagued</span> is a
                death metal band from the United Kingdom.
              </p>
              <p className="text-plague-mist/80 text-lg leading-relaxed mb-6">
                We take influences from old school death metal, Swedish death metal, 
                and hardcore.
              </p>
              <p className="text-plague-mist/80 text-lg leading-relaxed">
                Our debut EP, <span className="text-plague-green font-display">Rotting Dominions</span>,
                is coming February 2026.
              </p>
            </div>
          </motion.div>
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
                  {/* Icon */}
                  <div className="w-20 h-20 mx-auto mb-6 bg-plague-green/10 border border-plague-green/30 rounded-full flex items-center justify-center group-hover:bg-plague-green/20 group-hover:border-plague-green/50 transition-all duration-300">
                    <member.icon className="w-10 h-10 text-plague-green" />
                  </div>

                  {/* Name */}
                  <h3 className="font-display text-xl uppercase tracking-wider text-plague-bone mb-2 group-hover:text-plague-green transition-colors duration-300">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="font-display text-sm uppercase tracking-widest text-plague-green/70">
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

    </div>
  )
}

export default About
