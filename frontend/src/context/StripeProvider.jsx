import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

// Load Stripe outside component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

function StripeProvider({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  )
}

export default StripeProvider
