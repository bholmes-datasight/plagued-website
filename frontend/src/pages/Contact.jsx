import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, Mail, Instagram, CheckCircle, AlertCircle, Facebook, Youtube } from 'lucide-react'

// Custom SVG icons for streaming platforms
const SpotifyIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.959-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.361 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

const AppleMusicIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
)

const BandcampIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M0 12.5h6.077l2.096-4.5H24l-6.077 4.5L15.827 17H0l8.077-4.5z"/>
  </svg>
)

const TikTokIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.954-1.289-2.066-1.289-3.338v-.8H12.56v14.8c0 2.327-1.892 4.219-4.218 4.219S4.124 17.327 4.124 15c0-2.327 1.892-4.219 4.218-4.219.462 0 .905.075 1.321.213v-3.996c-.436-.061-.88-.092-1.321-.092C3.708 6.906 0 10.614 0 15.25s3.708 8.344 8.342 8.344 8.342-3.708 8.342-8.344v-6.9c1.132.748 2.45 1.15 3.816 1.15v-3.938z"/>
  </svg>
)

const DeezerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.81 4.16v3.03h5.17V4.16h-5.17zm0 4.55v3.03h5.17V8.71h-5.17zm0 4.54v3.03h5.17v-3.03h-5.17zm-6.55-9.09v3.03h5.17V4.16h-5.17zm0 4.55v3.03h5.17V8.71h-5.17zm0 4.54v3.03h5.17v-3.03h-5.17zm0 4.55v3.04h5.17V17.8h-5.17zM5.7 8.71v3.03h5.17V8.71H5.7zm0 4.54v3.03h5.17v-3.03H5.7zm0 4.55v3.04h5.17V17.8H5.7zM0 13.25v3.03h5.17v-3.03H0zm0 4.55v3.04h5.17V17.8H0z"/>
  </svg>
)

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState(null) // 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      setStatus('error')
      setErrorMessage('Failed to send message. Please try emailing us directly.')
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
            <h1 className="section-heading mb-6">Contact</h1>
            <div className="w-24 h-1 bg-plague-green mx-auto mb-6" />
            <p className="text-plague-mist/60 max-w-xl mx-auto">
              Get in touch with us for booking inquiries, press, or just to say hello.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-blackletter text-2xl text-plague-bone mb-8">
                Send a Message
              </h2>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-plague-green/10 border border-plague-green/30 p-8 text-center"
                >
                  <CheckCircle className="w-16 h-16 mx-auto text-plague-green mb-4" />
                  <h3 className="font-display text-xl uppercase tracking-wider text-plague-green mb-2">
                    Message Sent!
                  </h3>
                  <p className="text-plague-mist/70">
                    Thanks for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setStatus(null)}
                    className="mt-6 text-plague-green underline hover:no-underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-plague-mist/60 text-sm uppercase tracking-wider mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-plague-mist/60 text-sm uppercase tracking-wider mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-plague-mist/60 text-sm uppercase tracking-wider mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select a subject</option>
                      <option value="Booking Inquiry">Booking Inquiry</option>
                      <option value="Press/Media">Press / Media</option>
                      <option value="Merch Question">Merch Question</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-plague-mist/60 text-sm uppercase tracking-wider mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Your message..."
                    />
                  </div>

                  {status === 'error' && (
                    <div className="flex items-center gap-2 text-plague-red text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <span className="w-5 h-5 border-2 border-plague-black/30 border-t-plague-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="font-blackletter text-2xl text-plague-bone mb-8">
                Get in Touch
              </h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="card p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-plague-green/10 border border-plague-green/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-plague-green" />
                    </div>
                    <div>
                      <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:plagueduk@gmail.com"
                        className="text-plague-mist/70 hover:text-plague-green transition-colors"
                      >
                        plagueduk@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="card p-6">
                  <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-4">
                    Social Media
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://instagram.com/plagueduk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <Instagram className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">Instagram</span>
                    </a>
                    <a
                      href="https://facebook.com/plagueduk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <Facebook className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">Facebook</span>
                    </a>
                    <a
                      href="https://tiktok.com/@plagueduk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <TikTokIcon className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">TikTok</span>
                    </a>
                    <a
                      href="https://youtube.com/@plagueduk"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <Youtube className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">YouTube</span>
                    </a>
                  </div>
                </div>

                {/* Streaming Platforms */}
                <div className="card p-6">
                  <h3 className="font-display text-sm uppercase tracking-wider text-plague-bone mb-4">
                    Listen On
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href="https://open.spotify.com/artist/placeholder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <SpotifyIcon className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">Spotify</span>
                    </a>
                    <a
                      href="https://music.apple.com/artist/placeholder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <AppleMusicIcon className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">Apple Music</span>
                    </a>
                    <a
                      href="https://plagueduk.bandcamp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <BandcampIcon className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">Bandcamp</span>
                    </a>
                    <a
                      href="https://www.deezer.com/artist/placeholder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-plague-lighter/20 hover:bg-plague-green/20 transition-all duration-300 rounded"
                    >
                      <DeezerIcon className="w-5 h-5 text-plague-green" />
                      <span className="text-sm text-plague-mist/70">Deezer</span>
                    </a>
                  </div>
                </div>

                {/* Response Time */}
                <div className="p-6 bg-plague-grey/20 border border-plague-lighter/10">
                  <p className="text-plague-mist/60 text-sm">
                    <strong className="text-plague-bone">Response Time:</strong> We typically 
                    respond within 48 hours. For urgent booking inquiries, please include 
                    "URGENT" in your subject line.
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12">
                <h3 className="font-display text-sm uppercase tracking-widest text-plague-mist/60 mb-4">
                  Quick Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:plagueduk@gmail.com?subject=Booking Inquiry"
                    className="px-4 py-2 bg-plague-grey/50 border border-plague-lighter/30 text-plague-mist/80 text-sm hover:border-plague-green/50 hover:text-plague-green transition-all"
                  >
                    Booking
                  </a>
                  <a
                    href="mailto:plagueduk@gmail.com?subject=Press/Media Inquiry"
                    className="px-4 py-2 bg-plague-grey/50 border border-plague-lighter/30 text-plague-mist/80 text-sm hover:border-plague-green/50 hover:text-plague-green transition-all"
                  >
                    Press Kit
                  </a>
                  <a
                    href="mailto:plagueduk@gmail.com?subject=Merch Question"
                    className="px-4 py-2 bg-plague-grey/50 border border-plague-lighter/30 text-plague-mist/80 text-sm hover:border-plague-green/50 hover:text-plague-green transition-all"
                  >
                    Merch Support
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact
