import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ShoppingBag, Lock, ArrowLeft, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const formatPrice = (pence) => `£${(pence / 100).toFixed(2)}`

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required', // Only redirect if required (e.g., 3D Secure)
      })

      if (error) {
        // Payment failed
        setErrorMessage(error.message)
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded without redirect
        clearCart()
        navigate('/checkout/success')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setErrorMessage('An unexpected error occurred.')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element - handles card, wallets, BNPL, and shipping */}
      <div className="card p-6">
        <PaymentElement />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-plague-red/20 border border-plague-red text-plague-red-bright"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={`w-full btn-primary flex items-center justify-center gap-3 py-4 text-lg ${
          isProcessing ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Pay {formatPrice(totalPrice)}
          </>
        )}
      </button>

      <p className="text-plague-mist/40 text-xs text-center">
        Your payment information is secure and encrypted
      </p>
    </form>
  )
}

function Checkout() {
  const { items, totalPrice } = useCart()
  const navigate = useNavigate()
  const [clientSecret, setClientSecret] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const formatPrice = (pence) => `£${(pence / 100).toFixed(2)}`

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/merch')
      return
    }

    // Create PaymentIntent when component mounts
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        })

        if (!response.ok) {
          throw new Error('Failed to create payment intent')
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
        setIsLoading(false)
      } catch (err) {
        console.error('Error creating payment intent:', err)
        setError('Failed to initialize checkout. Please try again.')
        setIsLoading(false)
      }
    }

    createPaymentIntent()
  }, [items, navigate])

  if (isLoading) {
    return (
      <div className="noise-overlay min-h-[80vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader className="w-12 h-12 mx-auto text-plague-green animate-spin mb-4" />
          <p className="text-plague-mist/60">Preparing checkout...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="noise-overlay min-h-[80vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 max-w-md text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-plague-red/20 border-2 border-plague-red rounded-full flex items-center justify-center">
            <span className="text-3xl">⚠</span>
          </div>
          <h2 className="font-display text-xl uppercase tracking-wider text-plague-red mb-4">
            Checkout Error
          </h2>
          <p className="text-plague-mist/60 mb-6">{error}</p>
          <button
            onClick={() => navigate('/merch')}
            className="btn-secondary flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Shop
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="noise-overlay min-h-[80vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/merch')}
            className="text-plague-mist/60 hover:text-plague-green transition-colors flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to shop
          </button>

          <h1 className="font-display text-3xl md:text-4xl uppercase tracking-wider text-plague-green mb-2">
            Checkout
          </h1>
          <div className="w-16 h-1 bg-plague-green" />
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Order Summary - Left Side (2 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="card p-6 lg:sticky lg:top-24">
              <h2 className="font-display text-lg uppercase tracking-wider text-plague-bone mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-plague-green" />
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div
                    key={`${item.id}-${item.size}`}
                    className="flex gap-3 pb-4 border-b border-plague-lighter/20"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                      />
                    )}
                    <div className="flex-grow">
                      <h3 className="font-display text-sm uppercase text-plague-bone">
                        {item.name}
                      </h3>
                      {item.size && (
                        <p className="text-plague-mist/60 text-xs">
                          Size: {item.size}
                        </p>
                      )}
                      <p className="text-plague-mist/60 text-xs">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-plague-green font-bold text-sm">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div className="pt-4 border-t-2 border-plague-green/30">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg uppercase tracking-wider">
                    Total
                  </span>
                  <span className="font-display text-2xl text-plague-green">
                    {formatPrice(totalPrice)}
                  </span>
                </div>
                <p className="text-plague-mist/40 text-xs mt-2">
                  Shipping calculated at next step
                </p>
              </div>
            </div>
          </motion.div>

          {/* Payment Form - Right Side (3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="mb-6">
              <h2 className="font-display text-lg uppercase tracking-wider text-plague-bone mb-2 flex items-center gap-2">
                <Lock className="w-5 h-5 text-plague-green" />
                Payment Details
              </h2>
              <p className="text-plague-mist/60 text-sm">
                Complete your order securely below
              </p>
            </div>

            {clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'night',
                    variables: {
                      colorPrimary: '#00ff00',
                      colorBackground: '#1a1a1a',
                      colorText: '#f5f5f5',
                      colorDanger: '#cc0000',
                      fontFamily: 'Barlow, Helvetica Neue, sans-serif',
                      borderRadius: '0px',
                    },
                    rules: {
                      '.Input': {
                        borderColor: '#2a2a2a',
                        boxShadow: 'none',
                      },
                      '.Input:focus': {
                        borderColor: '#00ff00',
                        boxShadow: '0 0 0 1px #00ff00',
                      },
                      '.Label': {
                        color: '#e0e0e0',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      },
                    },
                  },
                }}
              >
                <CheckoutForm />
              </Elements>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
