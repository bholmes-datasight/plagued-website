"""
Plagued Band Website - FastAPI Backend
"""
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from typing import Optional

import stripe
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = FastAPI(title="Plagued API", version="1.0.0")

# CORS - update origins for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:3000", "https://plagued.uk"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stripe configuration - set these environment variables
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder")

# Email configuration
SMTP_HOST = os.getenv("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
CONTACT_EMAIL = "plagueduk@gmail.com"


# ============== MODELS ==============

class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class CartItem(BaseModel):
    id: str
    name: str
    price: int  # Price in pence
    quantity: int
    size: Optional[str] = None
    image: Optional[str] = None


class CheckoutRequest(BaseModel):
    items: list[CartItem]
    success_url: str
    cancel_url: str


# ============== DATA ==============

# Band members data
BAND_MEMBERS = [
    {
        "id": "ben",
        "name": "Benjamin Holmes",
        "role": "Guitar",
        "image": None,  # Add image path when available
    },
    {
        "id": "joe",
        "name": "Joe McCloughlin",
        "role": "Drums",
        "image": None,
    },
    {
        "id": "chris",
        "name": "Chris Binks",
        "role": "Vocals",
        "image": None,
    },
]

# Releases data
RELEASES = [
    {
        "id": "rotting-dominions",
        "title": "Rotting Dominions",
        "type": "EP",
        "year": 2025,
        "artwork": "/album-artwork.jpg",
        "tracks": [
            {"number": 1, "title": "Boneshaper"},
            {"number": 2, "title": "Sporeborn"},
            {"number": 3, "title": "Malediction"},
            {"number": 4, "title": "Fentylation"},
            {"number": 5, "title": "Divine Infection"},
        ],
        "streaming_links": {
            "spotify": "",  # Add when available
            "apple_music": "",
            "bandcamp": "",
            "youtube_music": "",
        },
    }
]

# Merch data - placeholder items
MERCH_ITEMS = [
    {
        "id": "rotting-dominions-tee",
        "name": "Rotting Dominions T-Shirt",
        "description": "Official Rotting Dominions artwork on black tee",
        "price": 2000,  # £20.00 in pence
        "image": "/album-artwork.jpg",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "in_stock": True,
    },
    {
        "id": "logo-tee-green",
        "name": "Plagued Logo T-Shirt (Green)",
        "description": "Toxic green logo on black tee",
        "price": 1800,  # £18.00 in pence
        "image": "/logo-green.png",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "in_stock": True,
    },
]

# Shows data - placeholder
SHOWS = [
    # {
    #     "id": "show-1",
    #     "date": "2025-03-15",
    #     "venue": "The Underworld",
    #     "city": "London",
    #     "country": "UK",
    #     "ticket_link": "",
    #     "with_bands": ["Support TBA"],
    # },
]


# ============== ENDPOINTS ==============

@app.get("/")
async def root():
    return {"message": "Plagued API", "version": "1.0.0"}


@app.get("/api/band")
async def get_band_info():
    """Get band information and members"""
    return {
        "name": "Plagued",
        "location": "United Kingdom",
        "genre": "Death Metal",
        "formed": 2024,
        "members": BAND_MEMBERS,
        "bio": "Plagued is a death metal band from the United Kingdom, delivering crushing riffs and unrelenting brutality.",
        "social": {
            "instagram": "https://instagram.com/plagueduk",
            "facebook": "",
            "youtube": "",
        },
    }


@app.get("/api/releases")
async def get_releases():
    """Get all releases"""
    return RELEASES


@app.get("/api/releases/{release_id}")
async def get_release(release_id: str):
    """Get a specific release"""
    for release in RELEASES:
        if release["id"] == release_id:
            return release
    raise HTTPException(status_code=404, detail="Release not found")


@app.get("/api/merch")
async def get_merch():
    """Get all merchandise"""
    return MERCH_ITEMS


@app.get("/api/merch/{item_id}")
async def get_merch_item(item_id: str):
    """Get a specific merch item"""
    for item in MERCH_ITEMS:
        if item["id"] == item_id:
            return item
    raise HTTPException(status_code=404, detail="Item not found")


@app.get("/api/shows")
async def get_shows():
    """Get all shows"""
    return SHOWS


@app.post("/api/contact")
async def submit_contact(form: ContactForm):
    """Handle contact form submission"""
    try:
        # Build email
        msg = MIMEMultipart()
        msg["From"] = SMTP_USER or "noreply@plagued.uk"
        msg["To"] = CONTACT_EMAIL
        msg["Subject"] = f"[Plagued Website] {form.subject}"

        body = f"""
New contact form submission from plagued.uk

Name: {form.name}
Email: {form.email}
Subject: {form.subject}

Message:
{form.message}

---
Submitted at: {datetime.utcnow().isoformat()}
        """
        msg.attach(MIMEText(body, "plain"))

        # Send email if SMTP is configured
        if SMTP_USER and SMTP_PASSWORD:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls()
                server.login(SMTP_USER, SMTP_PASSWORD)
                server.send_message(msg)
        else:
            # Log to console if email not configured
            print(f"Contact form submission (email not configured):\n{body}")

        return {"success": True, "message": "Message sent successfully"}

    except Exception as e:
        print(f"Error sending contact email: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message")


@app.post("/api/checkout")
async def create_checkout_session(request: CheckoutRequest):
    """Create a Stripe checkout session"""
    try:
        line_items = []
        for item in request.items:
            line_items.append({
                "price_data": {
                    "currency": "gbp",
                    "product_data": {
                        "name": item.name,
                        "description": f"Size: {item.size}" if item.size else None,
                    },
                    "unit_amount": item.price,
                },
                "quantity": item.quantity,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            shipping_address_collection={
                "allowed_countries": ["GB"],  # UK only for now
            },
        )

        return {"checkout_url": session.url}

    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle the event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # TODO: Fulfillment logic - send order notification email
        print(f"Order completed: {session['id']}")

    return {"status": "success"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
