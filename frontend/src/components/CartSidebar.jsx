import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'

function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalPrice,
    checkout,
  } = useCart()

  const formatPrice = (pence) => {
    return `£${(pence / 100).toFixed(2)}`
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-plague-black/80 backdrop-blur-sm z-50"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-plague-dark border-l border-plague-lighter/30 z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-plague-lighter/30">
              <h2 className="font-display text-xl uppercase tracking-wider text-plague-green flex items-center gap-3">
                <ShoppingBag className="w-6 h-6" />
                Your Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-plague-mist/60 hover:text-plague-green transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-grow overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 mx-auto text-plague-lighter/50 mb-4" />
                  <p className="text-plague-mist/60">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item) => (
                    <div
                      key={`${item.id}-${item.size}`}
                      className="flex gap-4 p-4 bg-plague-grey/30 border border-plague-lighter/20"
                    >
                      {/* Item Image */}
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover"
                        />
                      )}

                      {/* Item Details */}
                      <div className="flex-grow">
                        <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone">
                          {item.name}
                        </h3>
                        {item.size && (
                          <p className="text-plague-mist/60 text-xs mt-1">
                            Size: {item.size}
                          </p>
                        )}
                        <p className="text-plague-green font-bold mt-2">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity - 1)
                            }
                            className="p-1 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-bold w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.size, item.quantity + 1)
                            }
                            className="p-1 bg-plague-lighter/30 hover:bg-plague-green hover:text-plague-black transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id, item.size)}
                            className="p-1 ml-auto text-plague-red hover:text-plague-red-bright transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-plague-lighter/30">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-display text-lg uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-display text-2xl text-plague-green">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <button
                  onClick={checkout}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Checkout
                </button>
                <p className="text-plague-mist/40 text-xs text-center mt-4">
                  Secure checkout powered by Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default CartSidebar
