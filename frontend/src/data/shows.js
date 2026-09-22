// Single source of truth for Plagued live dates.
// Shows are never deleted - once the date passes they move to the "Past Shows"
// section automatically, so both Home and Shows stay in sync.
export const shows = [
  {
    id: 'portland-arms-cambridge-2026',
    date: '2026-04-05',
    venue: 'The Portland Arms',
    city: 'Cambridge',
    country: 'UK',
    doors: '19:00',
    ticketLink: 'https://wegottickets.com/event/689893',
    ticketPrice: '£11 Adv / £14 OTD',
    withBands: ['Dygora', 'Silicium', 'Tomb Slab'],
    soldOut: false,
    image: '/img/shows/belligerent_promotions_gig_april.jpg',
    description: 'A night of extreme metal presented by Belligerent Promotions.',
  },
  {
    id: 'b2-norwich-2026',
    date: '2026-04-10',
    venue: 'B2, Brickmakers',
    city: 'Norwich',
    country: 'UK',
    doors: '19:30',
    ticketLink: 'https://wegottickets.com/f/14376',
    ticketPrice: '£7.50 Adv / £10 OTD',
    withBands: ['State of Deceit', 'The Colony'],
    soldOut: false,
    image: '/img/shows/searchlight_promotions_gig_april.jpg',
    description: 'Plagued supporting State of Deceit + The Colony.',
  },
  {
    id: 'bloodstock-m2tm-hitchin',
    date: '2026-04-26',
    venue: 'Bloodstock Metal 2 The Masses (Heat 2)',
    city: 'Hitchin',
    country: 'UK',
    doors: '18:30',
    firstBand: '19:00',
    ticketLink: 'https://club-85.co.uk/event/metal-2-the-masses-2026-heat-2/',
    ticketPrice: '£8 Advance / £10 OTD',
    withBands: ['Shadowfen', 'Dead Villains', 'Deity & Devilry'],
    soldOut: false,
    eventDetails: 'Club 85, SG5 1PZ',
    image: '/img/shows/m2tm_gig_april.jpg',
    description: 'Competition heat headlined by Devilhusk. First stage before semi-finals and grand final.',
  },
  {
    id: 'deadwax-norwich-2026',
    date: '2026-10-20',
    venue: 'Dead Wax',
    city: 'Norwich',
    country: 'UK',
    doors: '19:00',
    ticketLink: 'https://wegottickets.com/f/24783',
    ticketPrice: '£15 Adv',
    withBands: ['Ceremonial Bloodbath (CA)', 'Cryptworm (UK)'],
    soldOut: false,
    image: '/img/shows/dead-wax-show.jpg',
    description: 'Infectious Entropy Ireland/UK Tour, presented by Killtown Bookings. Plagued on support.',
  },
  {
    id: 'b2-phage-records-norwich-2026',
    date: '2026-11-14',
    venue: 'B2, Brickmakers',
    city: 'Norwich',
    country: 'UK',
    doors: '19:00',
    ticketLink: 'https://wegottickets.com/f/21151',
    ticketPrice: '£11 Adv / £14 OTD',
    withBands: ['Stahlsarg', 'Terra', 'Bloodrieg'],
    soldOut: false,
    image: '/img/shows/b2-phage-records-show.jpg',
    description: 'Phage Records presents an evening of black metal.',
  },
]

// A show counts as "upcoming" for the whole of its own day.
function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

const byDateAsc = (a, b) => new Date(a.date) - new Date(b.date)

export function getUpcomingShows() {
  const today = startOfToday()
  return shows.filter((show) => new Date(show.date) >= today).sort(byDateAsc)
}

export function getPastShows() {
  const today = startOfToday()
  return shows.filter((show) => new Date(show.date) < today).sort(byDateAsc).reverse()
}

export function getNextShow() {
  return getUpcomingShows()[0] ?? null
}
