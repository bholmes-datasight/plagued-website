import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Gift, CheckCircle, User } from 'lucide-react'

function MailingListPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Check if user has already signed up or dismissed
    const hasSignedUp = localStorage.getItem('plagued-mailing-signup')
    const hasDismissed = localStorage.getItem('plagued-mailing-dismissed')
    
    if (!hasSignedUp && !hasDismissed) {
      // Show popup after 10 seconds or when user scrolls down
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 10000)

      const handleScroll = () => {
        if (window.scrollY > 500) {
          setIsVisible(true)
          window.removeEventListener('scroll', handleScroll)
        }
      }

      window.addEventListener('scroll', handleScroll)

      return () => {
        clearTimeout(timer)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email }),
      })

      if (!response.ok) {
        throw new Error('Subscription failed')
      }

      setIsSuccess(true)
      localStorage.setItem('plagued-mailing-signup', 'true')

      // Auto close after success
      setTimeout(() => {
        setIsVisible(false)
      }, 3000)
    } catch (error) {
      console.error('Signup error:', error)
      alert('Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('plagued-mailing-dismissed', 'true')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-plague-black/80 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-plague-dark border border-plague-lighter/30 shadow-2xl shadow-plague-green/10"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-1 text-plague-mist/60 hover:text-plague-red transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              {!isSuccess ? (
                <>
                  {/* Header */}
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-plague-green/10 border border-plague-green/30 rounded-full flex items-center justify-center">
                      <Gift className="w-8 h-8 text-plague-green" />
                    </div>
                    <h3 className="font-blackletter text-2xl text-plague-bone mb-2">
                      Join the Plague
                    </h3>
                    <p className="text-plague-mist/70 text-sm leading-relaxed">
                      Get exclusive updates on new releases, show announcements, and merch drops.
                    </p>
                  </div>

                  {/* Discount offer */}
                  <div className="bg-plague-green/10 border border-plague-green/30 p-4 mb-6 text-center">
                    <p className="font-display text-plague-green text-lg uppercase tracking-wider">
                      10% Off First Order
                    </p>
                    <p className="text-plague-mist/60 text-sm mt-1">
                      Plus early access to limited merch
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="popup-name" className="sr-only">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-plague-green/60" />
                        <input
                          type="text"
                          id="popup-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your Name"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-plague-grey/50 border border-plague-lighter/30 text-plague-bone placeholder-plague-mist/40 focus:border-plague-green/50 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="popup-email" className="sr-only">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-plague-green/60" />
                        <input
                          type="email"
                          id="popup-email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@domain.com"
                          required
                          className="w-full pl-12 pr-4 py-3 bg-plague-grey/50 border border-plague-lighter/30 text-plague-bone placeholder-plague-mist/40 focus:border-plague-green/50 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-plague-black/30 border-t-plague-black rounded-full animate-spin" />
                          Joining...
                        </span>
                      ) : (
                        'Get 10% Off + Updates'
                      )}
                    </button>
                  </form>

                  {/* Privacy note */}
                  <p className="text-plague-mist/40 text-xs text-center mt-4">
                    No spam. Unsubscribe anytime. We respect your privacy.
                  </p>
                </>
              ) : (
                /* Success state */
                <div className="text-center py-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-plague-green/10 border border-plague-green/30 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-plague-green" />
                  </div>
                  <h3 className="font-blackletter text-xl text-plague-green mb-2">
                    Welcome to the Plague!
                  </h3>
                  <p className="text-plague-mist/70 text-sm mb-4">
                    Check your email for your 10% discount code and exclusive updates.
                  </p>
                  <p className="text-plague-mist/50 text-xs">
                    This popup will close automatically...
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MailingListPopup