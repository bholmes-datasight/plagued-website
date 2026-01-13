"""
Plagued Band Website - FastAPI Backend
"""
import os
import json
from datetime import datetime
from typing import Optional

import stripe
import resend
from mailjet_rest import Client as MailjetClient
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, validator, Field
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from security_middleware import (
    SecurityHeadersMiddleware,
    RequestSizeLimitMiddleware,
    sanitize_text,
    validate_email_content
)

# Load environment variables from .env file
load_dotenv()

# Initialize rate limiter
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Plagued API",
    version="1.0.0",
    docs_url=None if os.getenv("ENVIRONMENT") == "production" else "/docs",
    redoc_url=None if os.getenv("ENVIRONMENT") == "production" else "/redoc"
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Request size limit middleware (1MB max)
app.add_middleware(RequestSizeLimitMiddleware, max_size=1_048_576)

# CORS - restrictive configuration
allowed_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "https://plagueduk.com",
    "https://www.plagueduk.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Only allow necessary methods
    allow_headers=["Content-Type", "Authorization"],  # Only necessary headers
    max_age=600,  # Cache preflight requests for 10 minutes
)

# Stripe configuration - set these environment variables
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_placeholder")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_placeholder")

# Email configuration - Resend API
resend.api_key = os.getenv("RESEND_API_KEY", "")
FROM_EMAIL = os.getenv("FROM_EMAIL", "contact@plagueduk.com")
CONTACT_EMAIL = os.getenv("CONTACT_EMAIL", "plagueduk@gmail.com")

# Mailjet configuration
MAILJET_API_KEY = os.getenv("MAILJET_API_KEY", "")
MAILJET_SECRET_KEY = os.getenv("MAILJET_SECRET_KEY", "")
MAILJET_LIST_ID = os.getenv("MAILJET_LIST_ID", "")  # Contact list ID

# Initialize Mailjet client
if MAILJET_API_KEY and MAILJET_SECRET_KEY:
    mailjet = MailjetClient(auth=(MAILJET_API_KEY, MAILJET_SECRET_KEY), version='v3')
else:
    mailjet = None


# ============== MODELS ==============

class ContactForm(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)

    @validator('name', 'subject', 'message')
    def sanitize_fields(cls, v):
        """Sanitize text fields to prevent injection attacks"""
        if isinstance(v, str):
            return sanitize_text(v, max_length=5000)
        return v

    @validator('email')
    def validate_email_safety(cls, v):
        """Validate email doesn't contain injection attempts"""
        if not validate_email_content(v):
            raise ValueError('Invalid email format')
        return v


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


class PaymentIntentRequest(BaseModel):
    items: list[CartItem]


class MailingListSubscribe(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr

    @validator('name')
    def sanitize_name(cls, v):
        """Sanitize name field to prevent injection attacks"""
        if isinstance(v, str):
            return sanitize_text(v, max_length=100)
        return v

    @validator('email')
    def validate_email_safety(cls, v):
        """Validate email doesn't contain injection attempts"""
        if not validate_email_content(v):
            raise ValueError('Invalid email format')
        return v


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
@limiter.limit("5/minute")  # Max 5 submissions per minute per IP
async def submit_contact(request: Request, form: ContactForm):
    """Handle contact form submission"""
    try:
        # Build email body
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
            <h2 style="color: #00ff00;">New Contact Form Submission</h2>
            <p><strong>From:</strong> plagueduk.com</p>
            <hr style="border: 1px solid #eee;">

            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Email:</strong> {form.email}</p>
            <p><strong>Subject:</strong> {form.subject}</p>

            <h3>Message:</h3>
            <p style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
                {form.message.replace('\n', '<br>')}
            </p>

            <hr style="border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
                Submitted at: {datetime.utcnow().isoformat()}<br>
                IP Address: {get_remote_address(request)}
            </p>
        </body>
        </html>
        """

        # Send email using Resend
        if resend.api_key:
            params = {
                "from": FROM_EMAIL,
                "to": [CONTACT_EMAIL],
                "subject": f"[Plagued Website] {form.subject}",
                "html": html_body,
                "reply_to": form.email,
            }

            resend.Emails.send(params)
        else:
            # Log to console if Resend not configured
            print(f"Contact form submission (Resend not configured):")
            print(f"From: {form.name} <{form.email}>")
            print(f"Subject: {form.subject}")
            print(f"Message: {form.message}")

        return {"success": True, "message": "Message sent successfully"}

    except Exception as e:
        print(f"Error sending contact email: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send message")


@app.post("/api/subscribe")
@limiter.limit("10/minute")  # Max 10 subscription attempts per minute per IP
async def subscribe_to_mailing_list(request: Request, subscription: MailingListSubscribe):
    """Subscribe email to Mailjet mailing list"""
    try:
        if not mailjet or not MAILJET_LIST_ID:
            # If Mailjet not configured, just return success (for development)
            print(f"Mailing list subscription (Mailjet not configured): {subscription.name} <{subscription.email}>")
            return {"success": True, "message": "Successfully subscribed"}

        # Add contact to list with properties using managemanycontacts
        # This is the recommended way to add contacts with custom properties
        data = {
            'Action': 'addnoforce',
            'Contacts': [
                {
                    'Email': subscription.email,
                    'Name': subscription.name,
                    'Properties': {
                        'firstname': subscription.name
                    }
                }
            ]
        }

        result = mailjet.contactslist_managemanycontacts.create(id=MAILJET_LIST_ID, data=data)

        return {"success": True, "message": "Successfully subscribed"}

    except Exception as e:
        error_message = str(e)
        # Handle case where email is already subscribed
        if "already" in error_message.lower() or "exist" in error_message.lower():
            return {"success": True, "message": "You're already subscribed!"}

        print(f"Mailjet API error: {type(e).__name__}: {error_message}")
        raise HTTPException(status_code=400, detail="Failed to subscribe. Please try again.")


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
        print(f"Stripe checkout error: {type(e).__name__}")
        user_message = e.user_message if hasattr(e, 'user_message') else "Payment processing failed"
        raise HTTPException(status_code=400, detail=user_message)
    except Exception as e:
        print(f"Unexpected checkout error: {type(e).__name__}")
        raise HTTPException(status_code=500, detail="Checkout session creation failed")


@app.post("/api/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    """Create a Stripe PaymentIntent for embedded checkout"""
    try:
        # Calculate total amount
        total_amount = sum(item.price * item.quantity for item in request.items)

        # Create PaymentIntent with automatic payment methods
        payment_intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency="gbp",
            automatic_payment_methods={
                "enabled": True,
            },
            # Store cart items in metadata for webhook processing
            metadata={
                "items": json.dumps([{
                    "id": item.id,
                    "name": item.name,
                    "price": item.price,
                    "quantity": item.quantity,
                    "size": item.size
                } for item in request.items])
            },
        )

        return {
            "clientSecret": payment_intent.client_secret,
            "paymentIntentId": payment_intent.id
        }

    except stripe.error.StripeError as e:
        print(f"Stripe payment intent error: {type(e).__name__}")
        user_message = e.user_message if hasattr(e, 'user_message') else "Payment initialization failed"
        raise HTTPException(status_code=400, detail=user_message)
    except Exception as e:
        print(f"Unexpected payment intent error: {type(e).__name__}")
        raise HTTPException(status_code=500, detail="Payment initialization failed")


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

    elif event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        print(f"PaymentIntent succeeded: {payment_intent['id']}")

        # Extract order details from metadata
        items_json = payment_intent.get("metadata", {}).get("items", "[]")
        items = json.loads(items_json)

        # Get shipping details
        shipping = payment_intent.get("shipping", {})
        shipping_address = shipping.get("address", {})
        shipping_name = shipping.get("name", "")

        print(f"Order Details:")
        print(f"  Customer: {shipping_name}")
        print(f"  Address: {shipping_address}")
        print(f"  Items: {items}")
        print(f"  Amount: £{payment_intent['amount'] / 100:.2f}")

        # TODO: Send confirmation email, create order record, etc.

    return {"status": "success"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
