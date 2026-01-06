import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, ArrowRight } from 'lucide-react'
import { useCart } from '../context/CartContext'

function CheckoutSuccess() {
  const { clearCart } = useCart()

  useEffect(() => {
    // Clear the cart after successful checkout
    clearCart()
  }, [clearCart])

  return (
    <div className="noise-overlay min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg w-full text-center"
      >
        <div className="card p-12">
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 bg-plague-green/20 border-2 border-plague-green rounded-full flex items-center justify-center"
          >
            <CheckCircle className="w-12 h-12 text-plague-green" />
          </motion.div>

          {/* Message */}
          <h1 className="font-display text-3xl uppercase tracking-wider text-plague-green mb-4">
            Order Confirmed!
          </h1>
          <p className="text-plague-mist/70 mb-8">
            Thanks for your order. You'll receive a confirmation email shortly 
            with your order details and tracking information.
          </p>

          {/* Order Info */}
          <div className="p-6 bg-plague-grey/30 border border-plague-lighter/20 mb-8">
            <div className="flex items-center justify-center gap-3 text-plague-mist/60">
              <Package className="w-5 h-5 text-plague-green" />
              <span>Your order is being prepared</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/merch"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="px-6 py-3 text-plague-mist/60 hover:text-plague-green transition-colors font-display uppercase tracking-wider text-sm"
            >
              Return Home
            </Link>
          </div>
        </div>

        {/* Support Note */}
        <p className="mt-8 text-plague-mist/40 text-sm">
          Questions about your order?{' '}
          <Link to="/contact" className="text-plague-green hover:underline">
            Contact us
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

export default CheckoutSuccess
