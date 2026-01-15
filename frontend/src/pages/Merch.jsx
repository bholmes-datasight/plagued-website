import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check, Package, Truck, CreditCard, AlertCircle, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'

function MerchCard({ item }) {
  const [selectedSize, setSelectedSize] = useState('')
  const [isAdded, setIsAdded] = useState(false)
  const { addItem, openCart } = useCart()

  const formatPrice = (pence) => {
    return `£${(pence / 100).toFixed(2)}`
  }

  const handleAddToCart = () => {
    if (!selectedSize) return

    const selectedSizeObj = item.sizes.find(s => s.size === selectedSize)
    if (!selectedSizeObj?.available) return

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

  const getSelectedSizeStock = () => {
    const sizeObj = item.sizes.find(s => s.size === selectedSize)
    return sizeObj?.stock || 0
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
              <div className="mb-2">
                <label className="text-plague-mist/60 text-xs uppercase tracking-wider block mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {item.sizes.map((sizeObj) => (
                    <button
                      key={sizeObj.size}
                      onClick={() => sizeObj.available && setSelectedSize(sizeObj.size)}
                      disabled={!sizeObj.available}
                      className={`w-10 h-10 border font-display text-sm transition-all duration-200 relative ${
                        selectedSize === sizeObj.size
                          ? 'border-plague-green bg-plague-green text-plague-black'
                          : sizeObj.available
                          ? 'border-plague-lighter/50 text-plague-mist/80 hover:border-plague-green/50'
                          : 'border-plague-lighter/20 text-plague-mist/30 cursor-not-allowed'
                      }`}
                    >
                      {sizeObj.size}
                      {!sizeObj.available && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-px bg-plague-red/60 rotate-45" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock indicator */}
              {selectedSize && (
                <div className="mb-4 text-xs text-plague-green/80">
                  {getSelectedSizeStock()} in stock
                </div>
              )}

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
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMerch()
  }, [])

  const fetchMerch = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/merch')

      if (!response.ok) {
        throw new Error('Failed to load products')
      }

      const data = await response.json()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching merch:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

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
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader className="w-12 h-12 text-plague-green animate-spin mb-4" />
              <p className="text-plague-mist/60">Loading products...</p>
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <AlertCircle className="w-20 h-20 mx-auto text-plague-red/60 mb-6" />
              <h2 className="font-display text-2xl uppercase tracking-wider text-plague-mist/60 mb-4">
                Failed to Load Products
              </h2>
              <p className="text-plague-mist/40 mb-6">{error}</p>
              <button
                onClick={fetchMerch}
                className="btn-primary"
              >
                Try Again
              </button>
            </motion.div>
          ) : products.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {products.map((item) => (
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
