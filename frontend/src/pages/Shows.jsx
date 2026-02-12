import { motion } from 'framer-motion'
import { Calendar, MapPin, Ticket, Clock } from 'lucide-react'

// Upcoming shows
const upcomingShows = [
  {
    id: 'bloodstock-m2tm-hitchin',
    date: '2025-04-26',
    venue: 'Bloodstock Metal 2 The Masses (Heat 2)',
    city: 'Hitchin',
    country: 'UK',
    doors: '18:30',
    firstBand: '19:00',
    ticketLink: 'https://club-85.co.uk/index.php/events/',
    ticketPrice: '£8 Advance / £10 OTD',
    withBands: [],
    soldOut: false,
    eventDetails: 'Club 85, SG5 1PZ',
    description: 'First stage of the competition before semi-finals and grand final.',
  },
]

function ShowCard({ show }) {
  const date = new Date(show.date)
  const day = date.getDate()
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase()
  const year = date.getFullYear()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="card p-6 flex flex-col md:flex-row gap-6 items-start md:items-center"
    >
      {/* Date Box */}
      <div className="flex-shrink-0 w-24 h-24 bg-plague-green/10 border border-plague-green/30 flex flex-col items-center justify-center">
        <span className="font-display text-3xl text-plague-green">{day}</span>
        <span className="font-display text-sm text-plague-mist/60">{month}</span>
        <span className="font-display text-xs text-plague-mist/40">{year}</span>
      </div>

      {/* Show Info */}
      <div className="flex-grow">
        <h3 className="font-display text-xl uppercase tracking-wider text-plague-bone mb-2">
          {show.venue}
        </h3>
        <div className="flex flex-wrap gap-4 text-sm text-plague-mist/60">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-plague-green/60" />
            {show.city}, {show.country}
          </span>
          {show.doors && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-plague-green/60" />
              Doors: {show.doors}{show.firstBand ? ` / First Band: ${show.firstBand}` : ''}
            </span>
          )}
          {show.ticketPrice && (
            <span className="flex items-center gap-1">
              <Ticket className="w-4 h-4 text-plague-green/60" />
              {show.ticketPrice}
            </span>
          )}
        </div>
        {show.eventDetails && (
          <p className="text-plague-mist/50 text-sm mt-1">
            {show.eventDetails}
          </p>
        )}
        {show.description && (
          <p className="text-plague-mist/40 text-sm mt-2">
            {show.description}
          </p>
        )}
        {show.withBands && show.withBands.length > 0 && (
          <p className="text-plague-mist/40 text-sm mt-2">
            w/ {show.withBands.join(', ')}
          </p>
        )}
      </div>

      {/* Ticket Button */}
      <div className="flex-shrink-0">
        {show.soldOut ? (
          <span className="px-6 py-3 bg-plague-red/20 border border-plague-red/50 text-plague-red font-display text-sm uppercase tracking-wider">
            Sold Out
          </span>
        ) : show.ticketLink ? (
          <a
            href={show.ticketLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Ticket className="w-5 h-5" />
            Tickets
          </a>
        ) : (
          <span className="px-6 py-3 bg-plague-lighter/30 text-plague-mist/50 font-display text-sm uppercase tracking-wider">
            Free Entry
          </span>
        )}
      </div>
    </motion.div>
  )
}

function Shows() {
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
            <h1 className="section-heading mb-6">Shows</h1>
            <div className="w-24 h-1 bg-plague-green mx-auto mb-6" />
            <p className="text-plague-mist/60 max-w-xl mx-auto">
              Witness Plagued live. Upcoming shows and tour dates.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shows List */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {upcomingShows.length > 0 ? (
            <div className="space-y-6">
              {upcomingShows.map((show) => (
                <ShowCard key={show.id} show={show} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <Calendar className="w-20 h-20 mx-auto text-plague-lighter/40 mb-6" />
              <h2 className="font-display text-2xl uppercase tracking-wider text-plague-mist/60 mb-4">
                No Shows Announced Yet
              </h2>
              <p className="text-plague-mist/40 max-w-md mx-auto">
                We're working on bringing the plague to a stage near you.
                Follow us on social media for announcements.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Booking Section */}
      <section className="py-24 px-4 bg-plague-dark/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-blackletter text-2xl text-plague-bone mb-6">
              Book Plagued
            </h2>
            <p className="text-plague-mist/60 mb-8 max-w-lg mx-auto">
              Interested in booking Plagued for your venue, festival, or event?
              Get in touch with us.
            </p>
            <a
              href="mailto:contact@plagueduk.com?subject=Booking Inquiry"
              className="btn-secondary inline-flex items-center gap-2"
            >
              Contact for Booking
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Shows
