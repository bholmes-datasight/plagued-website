import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check, Package, Truck, CreditCard } from 'lucide-react'
import { useCart } from '../context/CartContext'

// Placeholder merch items - these would come from API in production
const merchItems = [
  {
    id: 'plagued-tshirt-black',
    name: 'Plagued Logo T-Shirt',
    description: 'Black t-shirt with white dripping Plagued logo on front.',
    price: 2000, // £20.00 in pence
    image: '/merch/tshirt-black.JPG',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'plagued-longsleeve-black',
    name: 'Plagued Long Sleeve T-Shirt',
    description: 'Black long sleeve t-shirt with Plagued design.',
    price: 2500, // £25.00 in pence
    image: '/merch/longsleeve-black.JPG',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true,
  },
  {
    id: 'plagued-cap-camo',
    name: 'Plagued Camo Cap',
    description: 'Camouflage cap with embroidered orange Plagued logo.',
    price: 1800, // £18.00 in pence
    image: '/merch/cap-camo.png',
    sizes: ['One Size'],
    inStock: true,
  },
]

function MerchCard({ item }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [isAdded, setIsAdded] = useState(false)
  const { addItem, openCart } = useCart()

  const formatPrice = (pence) => {
    return `£${(pence / 100).toFixed(2)}`
  }

  const handleAddToCart = () => {
    if (!selectedSize) return

    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      size: selectedSize,
      image: item.image,
    })

    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      openCart()
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group"
    >
      <div className="card overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-plague-grey/50">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
          />
          {!item.inStock && (
            <div className="absolute inset-0 bg-plague-black/80 flex items-center justify-center">
              <span className="font-display text-plague-red uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-display text-lg uppercase tracking-wider text-plague-bone mb-2 group-hover:text-plague-green transition-colors">
            {item.name}
          </h3>
          <p className="text-plague-mist/60 text-sm mb-4 flex-grow">
            {item.description}
          </p>

          {/* Price */}
          <div className="text-plague-green font-display text-2xl mb-4">
            {formatPrice(item.price)}
          </div>

          {/* Size Selection */}
          {item.inStock && (
            <>
              <div className="mb-4">
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 border font-display text-sm transition-all duration-200 ${
                        selectedSize === size
                          ? 'border-plague-green bg-plague-green text-plague-black'
                          : 'border-plague-lighter/50 text-plague-mist/80 hover:border-plague-green/50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={!selectedSize}
                className={`w-full py-3 font-display uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-300 ${
                  !selectedSize
                    ? 'bg-plague-lighter/30 text-plague-mist/50 cursor-not-allowed'
                    : isAdded
                    ? 'bg-plague-green text-plague-black'
                    : 'btn-primary'
                }`}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Added!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {selectedSize ? 'Add to Cart' : 'Select Size'}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}

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

      {/* Products Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {merchItems.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {merchItems.map((item) => (
                <MerchCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <Package className="w-20 h-20 mx-auto text-plague-lighter/40 mb-6" />
              <h2 className="font-display text-2xl uppercase tracking-wider text-plague-mist/60 mb-4">
                Merch Coming Soon
              </h2>
              <p className="text-plague-mist/40">
                We're preparing some sick merch for you. Check back soon.
              </p>
            </motion.div>
          )}
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
