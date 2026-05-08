import { motion } from 'framer-motion'
import { ShoppingCart, Truck, CreditCard, Package } from 'lucide-react'

function Merch() {
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
            <h1 className="section-heading mb-6">Merch</h1>
            <div className="w-24 h-1 bg-plague-green mx-auto mb-6" />
            <p className="text-plague-mist/60 max-w-xl mx-auto">
              All items shipped from the UK.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bandcamp Merch Link */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-plague-mist/60 mb-4">Shop our merch on Bandcamp:</p>
            <a
              href="https://plagueduk.bandcamp.com/merch"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Visit our Bandcamp Store
            </a>
          </motion.div>
        </div>
      </section>

      {/* Shipping Info */}
      <section className="py-16 px-4 bg-plague-dark/50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-plague-green/10 border border-plague-green/30 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-plague-green" />
              </div>
              <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-2">
                UK Shipping
              </h3>
              <p className="text-plague-mist/60 text-sm">
                Fast delivery across the United Kingdom
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-plague-green/10 border border-plague-green/30 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-plague-green" />
              </div>
              <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-2">
                Secure Payment
              </h3>
              <p className="text-plague-mist/60 text-sm">
                Safe checkout powered by Stripe
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 mx-auto mb-4 bg-plague-green/10 border border-plague-green/30 rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-plague-green" />
              </div>
              <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-2">
                Quality Merch
              </h3>
              <p className="text-plague-mist/60 text-sm">
                Premium quality prints and materials
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Merch
