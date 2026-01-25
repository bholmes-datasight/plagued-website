import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

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
            <h1 className="section-heading mb-6">About</h1>
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

          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="card p-8"
            >
              <div className="space-y-4">
                {bandMembers.map((member) => (
                  <div key={member.name} className="border-b border-plague-lighter/10 pb-3 last:border-0">
                    <p className="text-plague-bone text-base md:text-lg font-display tracking-wide">{member.name}</p>
                    <p className="text-plague-green/80 text-sm">{member.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </section>

    </div>
  )
}

export default About
