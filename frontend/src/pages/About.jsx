import { motion } from 'framer-motion'
import { Users } from 'lucide-react'

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
                  {/* Name */}
                  <h3 className="font-display text-xl uppercase tracking-wider text-plague-bone mb-4 group-hover:text-plague-green transition-colors duration-300">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="font-blackletter text-xl text-plague-green/80 font-bold">
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
