# Plagued - Official Website

Official website for Plagued, a death metal band from the United Kingdom.

We take influences from old school death metal, Swedish death metal, and hardcore.

## Upcoming Release

**Rotting Dominions** - Debut EP coming February 2026
- Produced, Recorded & Mixed by Benjamin Holmes
- Mastered by Dan Swanö

## Shows

- **April 19, 2025** - Bloodstock Metal 2 The Masses (Heat) - Club 85, Hitchin

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **Backend**: FastAPI + Stripe
- **Styling**: Custom dark theme with toxic green/blood red accents

## Project Structure

```
plagued-website/
├── frontend/                # React frontend
│   ├── public/             # Static assets (logos, artwork)
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (Cart)
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app with routing
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── backend/                 # FastAPI backend
    ├── main.py             # API endpoints
    ├── requirements.txt
    └── .env.example        # Environment variables template
```

## Setup Instructions

### Prerequisites

- Node.js 18+ (for frontend)
- Python 3.10+ (for backend)
- Stripe account (for payments)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your Stripe keys and email settings

# Start server
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Stripe API Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Email Configuration (for contact form)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password_here
```

### Stripe Setup

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Dashboard
3. Set up a webhook endpoint for `/api/webhook/stripe`
4. Add the webhook secret to your `.env` file

### Gmail App Password (for contact form)

1. Enable 2-factor authentication on your Google account
2. Go to Google Account > Security > App passwords
3. Generate an app password for "Mail"
4. Use this password in your `.env` file

## Features

- **Home**: Hero section with parallax, latest release showcase
- **About**: Band bio, member profiles, influences
- **Music**: Release pages with track listings, streaming links
- **Merch**: Product cards with size selection, cart system, Stripe checkout
- **Shows**: Upcoming gigs (placeholder for now)
- **Contact**: Contact form with email integration

## Customisation

### Colours

Edit `frontend/tailwind.config.js` to change the colour palette:

```js
colors: {
  plague: {
    green: '#00ff00',      // Primary accent
    red: '#8b0000',        // Secondary accent
    black: '#0a0a0a',      // Background
    // ...
  }
}
```

### Adding Merch Items

Edit the `MERCH_ITEMS` array in `backend/main.py` or `frontend/src/pages/Merch.jsx`.

### Adding Shows

Edit the `SHOWS` array in `backend/main.py` or `frontend/src/pages/Shows.jsx`.

### Adding Streaming Links

Edit the `RELEASES` array in `backend/main.py` or update the `streamingPlatforms` in `frontend/src/pages/Music.jsx`.

## Deployment

### Frontend (Vercel/Netlify)

```bash
cd frontend
npm run build
# Deploy the 'dist' folder
```

### Backend (Railway/Render/Fly.io)

Deploy the backend folder with the following settings:
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

Remember to set environment variables in your hosting platform.

## Domain

Suggested domain: `plagued.uk`

---

Built with 🤘 for Plagued
