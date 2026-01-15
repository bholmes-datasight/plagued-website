import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ShoppingBag, Lock, ArrowLeft, Loader, User, MapPin, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const { items, totalPrice, clearCart } = useCart()

  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Customer and shipping info
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    postalCode: '',
    country: 'GB',
    phone: '',
  })

  const [formErrors, setFormErrors] = useState({})

  const formatPrice = (pence) => `£${(pence / 100).toFixed(2)}`

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Name validation
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      errors.fullName = 'Full name is required'
    }

    // Address validation
    if (!formData.addressLine1 || formData.addressLine1.trim().length < 3) {
      errors.addressLine1 = 'Address is required'
    }

    // City validation
    if (!formData.city || formData.city.trim().length < 2) {
      errors.city = 'City is required'
    }

    // Postal code validation
    if (!formData.postalCode || formData.postalCode.trim().length < 3) {
      errors.postalCode = 'Postal code is required'
    }

    // Phone validation (optional but if provided, basic check)
    if (formData.phone && formData.phone.trim().length < 10) {
      errors.phone = 'Please enter a valid phone number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    // Validate form first
    if (!validateForm()) {
      setErrorMessage('Please fill in all required fields correctly')
      return
    }

    setIsProcessing(true)
    setErrorMessage('')

    try {
      // Revalidate stock availability before payment
      const merchResponse = await fetch('/api/merch')
      if (!merchResponse.ok) {
        throw new Error('Failed to validate stock availability')
      }

      const currentProducts = await merchResponse.json()

      // Check each cart item against current stock
      for (const cartItem of items) {
        const product = currentProducts.find(p => p.id === cartItem.id)
        if (!product) {
          setErrorMessage(`${cartItem.name} is no longer available`)
          setIsProcessing(false)
          return
        }

        const sizeVariant = product.sizes.find(s => s.size === cartItem.size)
        if (!sizeVariant || !sizeVariant.available) {
          setErrorMessage(`${cartItem.name} (Size: ${cartItem.size}) is no longer available`)
          setIsProcessing(false)
          return
        }

        if (sizeVariant.stock < cartItem.quantity) {
          setErrorMessage(
            `Insufficient stock for ${cartItem.name} (Size: ${cartItem.size}). Only ${sizeVariant.stock} remaining.`
          )
          setIsProcessing(false)
          return
        }
      }

      // Confirm payment with Stripe, including shipping data
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          receipt_email: formData.email,
          shipping: {
            name: formData.fullName,
            phone: formData.phone || undefined,
            address: {
              line1: formData.addressLine1,
              line2: formData.addressLine2 || undefined,
              city: formData.city,
              postal_code: formData.postalCode,
              country: formData.country,
            },
          },
        },
        redirect: 'if_required',
      })

      if (error) {
        setErrorMessage(error.message)
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        clearCart()
        navigate('/checkout/success')
      }
    } catch (err) {
      console.error('Payment error:', err)
      setErrorMessage(err.message || 'An unexpected error occurred.')
      setIsProcessing(false)
    }
  }

  const InputField = ({ label, name, type = 'text', required = true, placeholder }) => (
    <div>
      <label className="text-plague-mist/80 text-sm uppercase tracking-wider block mb-2">
        {label} {required && <span className="text-plague-red">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        placeholder={placeholder}
        className={`w-full bg-plague-dark border ${
          formErrors[name] ? 'border-plague-red' : 'border-plague-lighter/30'
        } px-4 py-3 text-plague-bone focus:border-plague-green focus:outline-none transition-colors`}
      />
      {formErrors[name] && (
        <p className="text-plague-red text-xs mt-1">{formErrors[name]}</p>
      )}
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Customer Information */}
      <div className="card p-6">
        <h3 className="font-display text-lg uppercase tracking-wider text-plague-bone mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-plague-green" />
          Customer Information
        </h3>
        <div className="space-y-4">
          <InputField
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
          />
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="John Smith"
          />
          <InputField
            label="Phone Number"
            name="phone"
            type="tel"
            required={false}
            placeholder="07123456789 (optional)"
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div className="card p-6">
        <h3 className="font-display text-lg uppercase tracking-wider text-plague-bone mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-plague-green" />
          Shipping Address
        </h3>
        <div className="space-y-4">
          <InputField
            label="Address Line 1"
            name="addressLine1"
            placeholder="123 High Street"
          />
          <InputField
            label="Address Line 2"
            name="addressLine2"
            required={false}
            placeholder="Apartment, suite, etc. (optional)"
          />
          <div className="grid md:grid-cols-2 gap-4">
            <InputField
              label="City"
              name="city"
              placeholder="London"
            />
            <InputField
              label="Postal Code"
              name="postalCode"
              placeholder="SW1A 1AA"
            />
          </div>
          <div>
            <label className="text-plague-mist/80 text-sm uppercase tracking-wider block mb-2">
              Country <span className="text-plague-red">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full bg-plague-dark border border-plague-lighter/30 px-4 py-3 text-plague-bone focus:border-plague-green focus:outline-none transition-colors"
            >
              <option value="GB">United Kingdom</option>
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="IE">Ireland</option>
              <option value="FR">France</option>
              <option value="DE">Germany</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="NL">Netherlands</option>
            </select>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="card p-6">
        <h3 className="font-display text-lg uppercase tracking-wider text-plague-bone mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5 text-plague-green" />
          Payment Details
        </h3>
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
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Complete Order - {formatPrice(totalPrice)}
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
  const [shippingCost, setShippingCost] = useState(0)
  const [shippingMethod, setShippingMethod] = useState('')
  const [subtotal, setSubtotal] = useState(totalPrice)
  const [finalTotal, setFinalTotal] = useState(totalPrice)
  const [discountCode, setDiscountCode] = useState('')
  const [appliedDiscount, setAppliedDiscount] = useState(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountError, setDiscountError] = useState('')
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)
  const [discountCodesEnabled, setDiscountCodesEnabled] = useState(false)

  const formatPrice = (pence) => `£${(pence / 100).toFixed(2)}`

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountError('Please enter a discount code')
      return
    }

    setIsApplyingDiscount(true)
    setDiscountError('')

    try {
      // Get customer email from local storage or form (we'll need to handle this)
      const response = await fetch('/api/validate-discount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: discountCode.trim().toUpperCase(),
          items: items,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setDiscountError(data.detail || 'Invalid discount code')
        setIsApplyingDiscount(false)
        return
      }

      // Apply discount and recreate payment intent
      setAppliedDiscount(data)
      await createPaymentIntent(discountCode.trim().toUpperCase())
      setIsApplyingDiscount(false)
    } catch (err) {
      console.error('Error applying discount:', err)
      setDiscountError('Failed to apply discount code')
      setIsApplyingDiscount(false)
    }
  }

  const handleRemoveDiscount = async () => {
    setAppliedDiscount(null)
    setDiscountCode('')
    setDiscountError('')
    setDiscountAmount(0)
    setIsLoading(true)
    await createPaymentIntent(null)
    setIsLoading(false)
  }

  const createPaymentIntent = async (discountCodeToApply = undefined) => {
    try {
      // If discountCodeToApply was explicitly passed, use it (even if null)
      // Otherwise, fall back to the current appliedDiscount
      const discount_code = discountCodeToApply !== undefined
        ? discountCodeToApply
        : (appliedDiscount ? appliedDiscount.code : null);

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          discount_code: discount_code,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const data = await response.json()
      setClientSecret(data.clientSecret)
      setSubtotal(data.subtotal)
      setShippingCost(data.shipping_cost)
      setShippingMethod(data.shipping_method)
      setFinalTotal(data.total_amount)
      setDiscountAmount(data.discount_amount || 0)
      setIsLoading(false)
    } catch (err) {
      console.error('Error creating payment intent:', err)
      setError('Failed to initialize checkout. Please try again.')
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0) {
      navigate('/merch')
      return
    }

    // Fetch config and create PaymentIntent
    const initCheckout = async () => {
      try {
        const configResponse = await fetch('/api/config')
        if (configResponse.ok) {
          const config = await configResponse.json()
          setDiscountCodesEnabled(config.discount_codes_enabled)
        }
      } catch (err) {
        console.error('Error fetching config:', err)
      }

      createPaymentIntent()
    }

    initCheckout()
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

              {/* Totals */}
              <div className="pt-4 border-t border-plague-lighter/30 space-y-2">
                <div className="flex items-center justify-between text-plague-mist">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">{formatPrice(subtotal)}</span>
                </div>

                {/* Show discount amount if applied and feature is enabled */}
                {discountCodesEnabled && appliedDiscount && discountAmount > 0 && (
                  <div className="flex items-center justify-between text-plague-green">
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-3 h-3" />
                      <span>Discount ({appliedDiscount.code})</span>
                      <button
                        onClick={handleRemoveDiscount}
                        className="text-plague-red text-xs hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                    <span className="text-sm">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-plague-mist">
                  <span className="text-sm">
                    {shippingMethod || 'Shipping'}
                    {shippingCost === 0 && shippingMethod && (
                      <span className="ml-2 text-plague-green text-xs">FREE</span>
                    )}
                  </span>
                  <span className="text-sm">
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>

                {/* Discount Code Section - only show if feature is enabled and no discount applied */}
                {discountCodesEnabled && !appliedDiscount && (
                  <div className="pt-3 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="DISCOUNT CODE"
                        className="flex-1 bg-plague-dark border border-plague-lighter/30 px-3 py-2 text-plague-bone text-sm focus:border-plague-green focus:outline-none transition-colors uppercase"
                        disabled={isApplyingDiscount}
                      />
                      <button
                        onClick={handleApplyDiscount}
                        disabled={isApplyingDiscount || !discountCode.trim()}
                        className="px-4 py-2 bg-plague-green/20 border border-plague-green text-plague-green text-sm uppercase tracking-wider hover:bg-plague-green hover:text-plague-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isApplyingDiscount ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          'Apply'
                        )}
                      </button>
                    </div>
                    {discountError && (
                      <p className="text-plague-red text-xs">{discountError}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t-2 border-plague-green/30 mt-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg uppercase tracking-wider">
                    Total
                  </span>
                  <div className="text-right">
                    {discountCodesEnabled && appliedDiscount && discountAmount > 0 ? (
                      <>
                        <div className="text-plague-mist/40 text-sm line-through">
                          {formatPrice(finalTotal + discountAmount)}
                        </div>
                        <div className="font-display text-2xl text-plague-green">
                          {formatPrice(finalTotal)}
                        </div>
                      </>
                    ) : (
                      <span className="font-display text-2xl text-plague-green">
                        {formatPrice(finalTotal)}
                      </span>
                    )}
                  </div>
                </div>
                {subtotal >= 5000 ? (
                  <p className="text-plague-green text-xs mt-2 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Free shipping unlocked!
                  </p>
                ) : (
                  <p className="text-plague-mist/40 text-xs mt-2">
                    Free shipping on orders over £50
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Checkout Form - Right Side (3 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
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
                  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
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
