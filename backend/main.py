"""
Plagued Band Website - FastAPI Backend
"""
import os
import json
import base64
from datetime import datetime
from typing import Optional, List
from uuid import UUID

import stripe
import resend
from fastapi import FastAPI, HTTPException, Request, File, UploadFile
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

from database import (
    get_all_products_with_stock,
    check_stock_availability,
    find_or_create_customer,
    create_address,
    create_order,
    decrement_stock,
    get_order_by_payment_intent,
    mark_confirmation_email_sent,
    validate_discount_code,
    record_discount_code_usage,
    get_discount_code_by_code
)

from admin_auth import verify_admin_token
from admin_db import (
    get_all_orders,
    get_order_details,
    update_order_status,
    get_order_stats,
    get_size_distribution_by_type,
    get_all_products_admin,
    update_variant_stock,
    get_low_stock_variants,
    get_all_customers,
    get_customer_details,
    get_analytics_overview,
    create_product,
    create_product_variant,
    delete_product,
    upload_product_image
)
from admin_collections import (
    get_all_collections,
    get_collection_details,
    create_collection,
    update_collection,
    delete_collection,
    add_products_to_collection,
    remove_product_from_collection,
    drop_collection,
    undrop_collection
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
    "http://localhost:5175",
    "http://localhost:5176",
    "http://localhost:5177",
    "http://localhost:5178",
    "http://localhost:3000",
    "https://plagueduk.com",
    "https://www.plagueduk.com",
    "https://admin.plagueduk.com",
]

# Match Vercel preview/production deployment URLs
allowed_origin_regex = r"https://plagued-(admin-|website-).*\.vercel\.app"

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],  # Added DELETE for product deletion
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

# Feature flags
ENABLE_DISCOUNT_CODES = os.getenv("ENABLE_DISCOUNT_CODES", "false").lower() == "true"

# Load logo image for emails
LOGO_DATA_URI = ""
try:
    logo_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "img", "logo-green.png")
    with open(logo_path, "rb") as logo_file:
        logo_base64 = base64.b64encode(logo_file.read()).decode("utf-8")
        LOGO_DATA_URI = f"data:image/png;base64,{logo_base64}"
except Exception as e:
    print(f"Warning: Could not load logo image: {e}")
    LOGO_DATA_URI = ""  # Fallback to no image


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
    discount_code: Optional[str] = None


class DiscountCodeValidationRequest(BaseModel):
    code: str
    customer_email: Optional[str] = None


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
        "image": "/img/logo-green.png",
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
    """Get all merchandise with real-time stock levels from Supabase"""
    try:
        products = get_all_products_with_stock()
        return products
    except Exception as e:
        print(f"Error fetching merch: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")


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


def calculate_shipping(subtotal_pence: int) -> dict:
    """
    Calculate shipping cost based on order subtotal.
    Returns dict with shipping_cost (pence) and shipping_method.
    """
    # Free shipping over £50
    FREE_SHIPPING_THRESHOLD = 5000  # £50.00 in pence
    STANDARD_SHIPPING_COST = 495    # £4.95 in pence

    if subtotal_pence >= FREE_SHIPPING_THRESHOLD:
        return {
            "shipping_cost": 0,
            "shipping_method": "Free UK Shipping"
        }
    else:
        return {
            "shipping_cost": STANDARD_SHIPPING_COST,
            "shipping_method": "UK Standard Shipping"
        }


@app.get("/api/config")
async def get_config():
    """Get public configuration settings"""
    return {
        "discount_codes_enabled": ENABLE_DISCOUNT_CODES
    }


@app.post("/api/validate-discount")
async def validate_discount(request: DiscountCodeValidationRequest):
    """Validate a discount code, optionally checking customer usage"""
    if not ENABLE_DISCOUNT_CODES:
        raise HTTPException(status_code=400, detail="Discount codes are currently disabled")

    try:
        # If customer email provided, do full validation including usage check
        if request.customer_email:
            discount = validate_discount_code(request.code, request.customer_email)
            if not discount:
                raise HTTPException(
                    status_code=400,
                    detail="Invalid discount code or you have already used this code"
                )
        else:
            # Just check if code exists and is active
            discount = get_discount_code_by_code(request.code)
            if not discount or not discount.get("active"):
                raise HTTPException(
                    status_code=400,
                    detail="Invalid discount code"
                )

        return {
            "code": discount["code"],
            "discount_percentage": discount["discount_percentage"],
            "description": discount.get("description", "")
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error validating discount: {e}")
        raise HTTPException(status_code=500, detail="Failed to validate discount code")


@app.post("/api/create-payment-intent")
async def create_payment_intent(request: PaymentIntentRequest):
    """Create a Stripe PaymentIntent with stock validation and shipping"""
    try:
        # Validate stock availability BEFORE creating payment intent
        is_available, error_message = check_stock_availability([
            {
                "id": item.id,
                "name": item.name,
                "size": item.size,
                "quantity": item.quantity
            } for item in request.items
        ])

        if not is_available:
            raise HTTPException(status_code=400, detail=error_message)

        # Calculate subtotal
        subtotal = sum(item.price * item.quantity for item in request.items)

        # Calculate shipping
        shipping_info = calculate_shipping(subtotal)
        shipping_cost = shipping_info["shipping_cost"]

        # Apply discount if provided and feature is enabled
        discount_amount = 0
        discount_code_id = None
        if ENABLE_DISCOUNT_CODES and request.discount_code:
            discount = get_discount_code_by_code(request.discount_code)
            if discount and discount.get("active"):
                discount_percentage = discount["discount_percentage"]
                discount_amount = int((subtotal * discount_percentage) / 100)
                discount_code_id = discount["id"]
                print(f"[DISCOUNT] Applied {discount_percentage}% discount: -{discount_amount} pence")

        # Calculate total amount (subtotal - discount + shipping)
        total_amount = subtotal - discount_amount + shipping_cost

        # Validate minimum amount (GBP requires minimum 30 pence)
        if total_amount < 30:
            raise HTTPException(status_code=400, detail="Order total must be at least £0.30")

        # Validate cart is not empty
        if not request.items or len(request.items) == 0:
            raise HTTPException(status_code=400, detail="Cart is empty")

        # Create PaymentIntent - only allow card (includes Apple Pay, Google Pay)
        # This excludes Klarna and other BNPL options
        metadata = {
            "items": json.dumps([{
                "id": item.id,
                "name": item.name,
                "price": item.price,
                "quantity": item.quantity,
                "size": item.size
            } for item in request.items]),
            "subtotal": str(subtotal),
            "shipping_cost": str(shipping_cost),
            "shipping_method": shipping_info["shipping_method"]
        }

        # Add discount info to metadata if applied
        if discount_code_id:
            metadata["discount_code"] = request.discount_code
            metadata["discount_code_id"] = str(discount_code_id)
            metadata["discount_amount"] = str(discount_amount)

        payment_intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency="gbp",
            payment_method_types=["card"],  # Card includes wallet payments (Apple Pay, Google Pay)
            # Store cart items and shipping info in metadata for webhook processing
            # Note: Stripe metadata has 500 char limit, so we exclude image URLs
            metadata=metadata,
        )

        return {
            "clientSecret": payment_intent.client_secret,
            "paymentIntentId": payment_intent.id,
            "subtotal": subtotal,
            "shipping_cost": shipping_cost,
            "shipping_method": shipping_info["shipping_method"],
            "total_amount": total_amount,
            "discount_amount": discount_amount
        }

    except HTTPException:
        raise
    except stripe.error.StripeError as e:
        print(f"Stripe payment intent error: {type(e).__name__}")
        print(f"Stripe error details: {str(e)}")
        print(f"Stripe error code: {e.code if hasattr(e, 'code') else 'N/A'}")
        print(f"Amount attempted: {total_amount}")
        user_message = e.user_message if hasattr(e, 'user_message') else str(e)
        raise HTTPException(status_code=400, detail=user_message)
    except Exception as e:
        print(f"Unexpected payment intent error: {type(e).__name__}: {str(e)}")
        raise HTTPException(status_code=500, detail="Payment initialization failed")


@app.post("/api/webhook/stripe")
async def stripe_webhook(request: Request):
    """Handle Stripe webhooks"""
    print("\n" + "="*60)
    print("🔔 WEBHOOK RECEIVED FROM STRIPE")
    print("="*60)

    payload = await request.body()
    sig_header = request.headers.get("stripe-signature")

    print(f"[WEBHOOK] Payload size: {len(payload)} bytes")
    print(f"[WEBHOOK] Signature header present: {bool(sig_header)}")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid payload")
    except stripe.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid signature")

    # Handle payment_intent.succeeded event
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        payment_intent_id = payment_intent["id"]

        print(f"PaymentIntent succeeded: {payment_intent_id}")

        try:
            # Check if order already exists (idempotency)
            existing_order = get_order_by_payment_intent(payment_intent_id)
            if existing_order:
                print(f"Order already exists for PaymentIntent: {payment_intent_id}")
                return {"status": "success", "message": "Order already processed"}

            # Extract order details from metadata
            items_json = payment_intent.get("metadata", {}).get("items", "[]")
            items = json.loads(items_json)

            if not items:
                print(f"Warning: No items found in PaymentIntent metadata")
                return {"status": "success", "message": "No items to process"}

            # Get shipping details
            shipping = payment_intent.get("shipping", {})
            shipping_address = shipping.get("address", {})
            shipping_name = shipping.get("name", "")

            # Get customer email - improved extraction logic
            customer_email = ""

            print(f"[EMAIL DEBUG] Extracting email from payment intent...")
            print(f"[EMAIL DEBUG] payment_intent.receipt_email: {payment_intent.get('receipt_email')}")

            # Try receipt_email first (this is what Stripe Elements populates)
            if payment_intent.get("receipt_email"):
                customer_email = payment_intent["receipt_email"]
                print(f"[EMAIL DEBUG] ✅ Found email in receipt_email: {customer_email}")

            # Try latest_charge billing_details
            elif payment_intent.get("latest_charge"):
                charge_id = payment_intent["latest_charge"]
                print(f"[EMAIL DEBUG] Checking latest_charge.billing_details...")
                print(f"[EMAIL DEBUG] Retrieving charge: {charge_id}")
                charge = stripe.Charge.retrieve(charge_id)
                customer_email = charge.billing_details.email or ""
                if customer_email:
                    print(f"[EMAIL DEBUG] ✅ Found email in charge.billing_details: {customer_email}")

            # Fallback
            if not customer_email:
                customer_email = "benrholmes@outlook.com"
                print(f"⚠️ [EMAIL WARNING] No customer email found, using fallback: {customer_email}")

            print(f"[EMAIL DEBUG] Final customer_email to be used: {customer_email}")

            # Double-check stock availability (race condition protection)
            is_available, error_message = check_stock_availability(items)
            if not is_available:
                print(f"Stock unavailable during order creation: {error_message}")
                # TODO: Handle this edge case - may need to refund payment or contact customer
                return {"status": "error", "message": error_message}

            # 1. Find or create customer
            customer_id = find_or_create_customer(customer_email, shipping_name)

            # 2. Create address
            address_id = create_address(customer_id, shipping)

            # 3. Extract shipping cost and discount code from metadata
            shipping_cost = int(payment_intent.get("metadata", {}).get("shipping_cost", 0))
            discount_code_id = payment_intent.get("metadata", {}).get("discount_code_id")
            discount_code = payment_intent.get("metadata", {}).get("discount_code")

            print(f"[DISCOUNT DEBUG] Metadata discount_code_id: {discount_code_id}")
            print(f"[DISCOUNT DEBUG] Metadata discount_code: {discount_code}")

            # 3a. Verify customer hasn't already used the discount code
            if discount_code_id and discount_code:
                print(f"[DISCOUNT DEBUG] Validating discount code {discount_code} for customer {customer_email}")
                discount_valid = validate_discount_code(discount_code, customer_email)
                if not discount_valid:
                    print(f"[DISCOUNT WARNING] Customer {customer_email} has already used code {discount_code}")
                    discount_code_id = None  # Don't apply discount if already used
                else:
                    print(f"[DISCOUNT DEBUG] Discount code is valid, will be applied to order")

            # 4. Create order with items
            order = create_order(
                customer_id=customer_id,
                address_id=address_id,
                items=items,
                total_amount=payment_intent["amount"],
                stripe_payment_intent_id=payment_intent_id,
                shipping_amount=shipping_cost,
                discount_code_id=UUID(discount_code_id) if discount_code_id else None
            )

            order_id = order["id"]
            order_number = order["order_number"]

            # 4a. Record discount code usage if applicable
            if discount_code_id:
                print(f"[DISCOUNT DEBUG] Recording discount code usage:")
                print(f"  - discount_code_id: {discount_code_id}")
                print(f"  - customer_email: {customer_email}")
                print(f"  - order_id: {order_id}")
                usage_recorded = record_discount_code_usage(UUID(discount_code_id), customer_email, UUID(order_id))
                if usage_recorded:
                    print(f"[DISCOUNT] ✅ Recorded discount code usage for order {order_number}")
                else:
                    print(f"[DISCOUNT] ❌ Failed to record discount code usage for order {order_number}")

            # 4b. Decrement stock
            decrement_stock(items, order_id)

            # 5. Send order confirmation emails
            try:
                # Build items HTML for email
                items_html = ""
                for item in items:
                    line_total = item["price"] * item["quantity"]
                    items_html += f"""
                    <tr>
                        <td style="padding: 10px; border-bottom: 1px solid #eee;">
                            {item['name']}<br>
                            <span style="color: #666; font-size: 12px;">Size: {item['size']}</span>
                        </td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">{item['quantity']}</td>
                        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">£{(line_total / 100):.2f}</td>
                    </tr>
                    """

                # Calculate amounts
                total_amount = payment_intent['amount']
                subtotal = total_amount - shipping_cost

                subtotal_formatted = f"£{(subtotal / 100):.2f}"
                shipping_formatted = f"£{(shipping_cost / 100):.2f}"
                total_formatted = f"£{(total_amount / 100):.2f}"

                # Free shipping note
                free_shipping_note = ""
                if shipping_cost == 0 and subtotal >= 5000:  # £50 or more
                    free_shipping_note = ' <span style="color: #00ff00; font-size: 12px;">(Free on orders over £50)</span>'

                html_body = f"""
                <html>
                <body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto;">
                    <div style="background: #000; padding: 30px 20px; text-align: center;">
                        <img src="{LOGO_DATA_URI}" alt="PLAGUED" style="max-width: 200px; height: auto;">
                    </div>

                    <div style="padding: 30px 20px;">
                        <h2 style="color: #00ff00;">Order Confirmed!</h2>
                        <p>Thanks for your order, {shipping_name}! We'll ship it out soon.</p>

                        <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #00ff00;">
                            <strong>Order Number:</strong> {order_number}<br>
                            <strong>Order Date:</strong> {datetime.utcnow().strftime('%d %B %Y')}
                        </div>

                        <h3 style="margin-top: 30px;">Order Items</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f5f5f5;">
                                    <th style="padding: 10px; text-align: left;">Item</th>
                                    <th style="padding: 10px; text-align: center;">Qty</th>
                                    <th style="padding: 10px; text-align: right;">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items_html}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="2" style="padding: 10px; text-align: right;">Subtotal:</td>
                                    <td style="padding: 10px; text-align: right;">{subtotal_formatted}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding: 10px; text-align: right;">Shipping:{free_shipping_note}</td>
                                    <td style="padding: 10px; text-align: right;">{shipping_formatted}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding: 15px 10px; text-align: right; font-weight: bold; border-top: 2px solid #00ff00;">Total:</td>
                                    <td style="padding: 15px 10px; text-align: right; font-weight: bold; color: #00ff00; font-size: 18px; border-top: 2px solid #00ff00;">{total_formatted}</td>
                                </tr>
                            </tfoot>
                        </table>

                        <h3 style="margin-top: 30px;">Shipping Address</h3>
                        <div style="background: #f5f5f5; padding: 15px;">
                            {shipping_name}<br>
                            {shipping_address.get('line1', '')}<br>
                            {shipping_address.get('line2', '') + '<br>' if shipping_address.get('line2') else ''}
                            {shipping_address.get('city', '')}, {shipping_address.get('postal_code', '')}<br>
                            {shipping_address.get('country', 'GB')}
                        </div>

                        <p style="margin-top: 30px; color: #666; font-size: 14px;">
                            You'll receive another email with tracking information once your order ships.
                        </p>

                        <p style="margin-top: 20px;">
                            Questions? Email us at <a href="mailto:contact@plagueduk.com" style="color: #00ff00;">contact@plagueduk.com</a>
                        </p>
                    </div>

                    <div style="background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666;">
                        <p style="margin: 0;">Plagued - Death Metal from the UK</p>
                        <p style="margin: 5px 0 0 0;">contact@plagueduk.com</p>
                    </div>
                </body>
                </html>
                """

                # Send customer confirmation email
                if resend.api_key:
                    try:
                        print(f"[EMAIL DEBUG] Sending customer confirmation to: {customer_email}")
                        customer_response = resend.Emails.send({
                            "from": FROM_EMAIL,
                            "to": [customer_email],
                            "subject": f"Order Confirmation - {order_number}",
                            "html": html_body
                        })
                        print(f"[EMAIL DEBUG] Customer email sent! Response: {customer_response}")
                    except Exception as customer_email_error:
                        print(f"[EMAIL ERROR] Failed to send customer email: {customer_email_error}")
                        print(f"[EMAIL ERROR] Customer email was: {customer_email}")

                    # Send notification to band
                    notification_html = f"""
                    <html>
                    <body style="font-family: Arial, sans-serif;">
                        <h2 style="color: #00ff00;">New Order Received!</h2>
                        <p><strong>Order Number:</strong> {order_number}</p>
                        <p><strong>Customer:</strong> {shipping_name} ({customer_email})</p>
                        <p><strong>Total:</strong> {total_formatted}</p>

                        <p><strong>Items:</strong></p>
                        <ul>
                            {''.join([f'<li>{item["name"]} - Size {item["size"]} x {item["quantity"]}</li>' for item in items])}
                        </ul>
                        <p><strong>Shipping Address:</strong><br>
                        {shipping_name}<br>
                        {shipping_address.get('line1', '')}<br>
                        {shipping_address.get('line2', '') + '<br>' if shipping_address.get('line2') else ''}
                        {shipping_address.get('city', '')}, {shipping_address.get('postal_code', '')}<br>
                        {shipping_address.get('country', 'GB')}
                        </p>
                        <p><a href="https://dashboard.stripe.com/payments/{payment_intent_id}" style="color: #00ff00;">View in Stripe Dashboard</a></p>
                    </body>
                    </html>
                    """

                    try:
                        print(f"[EMAIL DEBUG] Sending admin notification to: {CONTACT_EMAIL}")

                        email_params = {
                            "from": FROM_EMAIL,
                            "to": [CONTACT_EMAIL],
                            "subject": f"New Order: {order_number}",
                            "html": notification_html
                        }

                        admin_response = resend.Emails.send(email_params)
                        print(f"[EMAIL DEBUG] Admin email sent! Response: {admin_response}")
                    except Exception as admin_email_error:
                        print(f"[EMAIL ERROR] Failed to send admin email: {admin_email_error}")

                    # Mark email as sent
                    mark_confirmation_email_sent(order_id)

                    print(f"[EMAIL DEBUG] ✅ Order confirmation emails completed for order {order_number}")

            except Exception as email_error:
                print(f"Error sending order confirmation email: {email_error}")
                # Don't fail the webhook - order is created, just log the email error

            print(f"Order created successfully: {order_number}")

        except Exception as e:
            print(f"Error processing order: {type(e).__name__}: {str(e)}")
            # Return 200 to Stripe to avoid retries, but log error for manual review
            return {"status": "error", "message": str(e)}

    elif event["type"] == "checkout.session.completed":
        # Handle if you use Checkout Sessions (currently using Payment Intents)
        session = event["data"]["object"]
        print(f"Checkout session completed: {session['id']}")

    return {"status": "success"}


@app.post("/api/test-webhook")
async def test_webhook(payment_intent_id: str = None):
    """
    TEST ENDPOINT - Simulates webhook processing for local testing
    Call this with a payment_intent_id after completing a test checkout
    This bypasses webhook signature verification
    """
    print("\n" + "="*60)
    print("🧪 TEST WEBHOOK TRIGGERED")
    print("="*60)

    try:
        if not payment_intent_id:
            raise HTTPException(status_code=400, detail="payment_intent_id is required")

        print(f"[TEST WEBHOOK] Fetching PaymentIntent: {payment_intent_id}")

        # Fetch the payment intent from Stripe
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id, expand=["latest_charge"])

        print(f"[TEST WEBHOOK] PaymentIntent status: {payment_intent.status}")
        print(f"[TEST WEBHOOK] Amount: £{payment_intent.amount / 100:.2f}")

        if payment_intent.status != "succeeded":
            return {
                "status": "skipped",
                "message": f"Payment intent status is {payment_intent.status}, not 'succeeded'"
            }

        # Check if order already exists (idempotency)
        existing_order = get_order_by_payment_intent(payment_intent_id)
        if existing_order:
            return {
                "status": "already_processed",
                "order_id": existing_order["id"],
                "order_number": existing_order["order_number"],
                "message": "Order was already created for this payment"
            }

        # Extract items from metadata
        items_json = payment_intent.metadata.get("items", "[]")
        items = json.loads(items_json)

        if not items:
            return {"status": "error", "message": "No items found in payment intent metadata"}

        # Extract shipping info
        shipping = payment_intent.shipping or {}
        shipping_name = shipping.get("name", "")

        # Extract customer email from charge
        customer_email = ""

        print(f"[EMAIL DEBUG] Extracting email from payment intent...")
        print(f"[EMAIL DEBUG] payment_intent.receipt_email: {payment_intent.receipt_email}")

        # Try receipt_email first (this is what Stripe Elements populates)
        if payment_intent.receipt_email:
            customer_email = payment_intent.receipt_email
            print(f"[EMAIL DEBUG] ✅ Found email in receipt_email: {customer_email}")

        # Try latest_charge billing_details
        elif payment_intent.latest_charge:
            charge = payment_intent.latest_charge
            print(f"[EMAIL DEBUG] Checking latest_charge.billing_details...")
            print(f"[EMAIL DEBUG] Charge type: {type(charge)}")

            # If charge is a string ID, we need to retrieve it
            if isinstance(charge, str):
                print(f"[EMAIL DEBUG] Charge is ID string, retrieving charge object...")
                charge = stripe.Charge.retrieve(charge)

            customer_email = charge.billing_details.email or ""
            if customer_email:
                print(f"[EMAIL DEBUG] ✅ Found email in charge.billing_details: {customer_email}")
            else:
                print(f"[EMAIL DEBUG] ❌ No email in charge.billing_details")

        # Fallback to test email
        if not customer_email:
            customer_email = "benrholmes@outlook.com"
            print(f"⚠️ [EMAIL WARNING] No customer email found, using fallback: {customer_email}")

        # Get total amount
        total_amount = payment_intent.amount

        print(f"\n{'='*60}")
        print(f"🧪 TEST WEBHOOK PROCESSING")
        print(f"{'='*60}")
        print(f"Payment Intent ID: {payment_intent_id}")
        print(f"Customer Email: {customer_email}")
        print(f"Shipping Name: {shipping_name}")
        print(f"Total Amount: £{total_amount/100:.2f}")
        print(f"Items: {len(items)}")
        for item in items:
            print(f"  - {item['name']} (Size: {item['size']}) x{item['quantity']}")
        print(f"{'='*60}\n")

        # Validate stock availability
        is_available, error_message = check_stock_availability(items)
        if not is_available:
            return {
                "status": "error",
                "message": f"Stock validation failed: {error_message}"
            }

        print("✅ Stock validation passed")

        # Create customer
        customer_id = find_or_create_customer(customer_email, shipping_name)
        print(f"✅ Customer created/found: {customer_id}")

        # Create address
        address_id = create_address(customer_id, shipping)
        print(f"✅ Address created: {address_id}")

        # Extract shipping cost and discount code from metadata
        shipping_cost = int(payment_intent.metadata.get("shipping_cost", 0))
        discount_code_id = payment_intent.metadata.get("discount_code_id")
        discount_code = payment_intent.metadata.get("discount_code")
        print(f"💷 Shipping cost: £{shipping_cost/100:.2f}")
        if discount_code_id:
            print(f"🎟️ Discount code in metadata: {discount_code}")

            # Verify customer hasn't already used the discount code
            discount_valid = validate_discount_code(discount_code, customer_email)
            if not discount_valid:
                print(f"[DISCOUNT WARNING] Customer {customer_email} has already used code {discount_code}")
                discount_code_id = None  # Don't apply discount if already used
            else:
                print(f"✅ Discount code valid for customer")

        # Create order
        order = create_order(
            customer_id=customer_id,
            address_id=address_id,
            items=items,
            total_amount=total_amount,
            stripe_payment_intent_id=payment_intent_id,
            shipping_amount=shipping_cost,
            discount_code_id=UUID(discount_code_id) if discount_code_id else None
        )
        order_id = order["id"]
        order_number = order["order_number"]
        print(f"✅ Order created: {order_number} (ID: {order_id})")

        # Record discount code usage if applicable
        if discount_code_id:
            record_discount_code_usage(UUID(discount_code_id), customer_email, UUID(order_id))
            print(f"[DISCOUNT] Recorded discount code usage for order {order_number}")

        # Decrement stock
        decrement_stock(items, order_id)
        print(f"✅ Stock decremented")

        # Send confirmation email to customer
        customer_items_html = "".join([
            f"""
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #2a2a2a;">
                    <strong style="color: #00ff00;">{item['name']}</strong><br>
                    <span style="color: #999; font-size: 12px;">Size: {item['size']} | Qty: {item['quantity']}</span>
                </td>
                <td style="padding: 12px; border-bottom: 1px solid #2a2a2a; text-align: right; color: #00ff00;">
                    £{(item['price'] * item['quantity'] / 100):.2f}
                </td>
            </tr>
            """ for item in items
        ])

        # Calculate amounts for email
        subtotal = total_amount - shipping_cost
        free_shipping_note = ""
        if shipping_cost == 0 and subtotal >= 5000:  # £50 or more
            free_shipping_note = '<br><span style="color: #00ff00; font-size: 11px;">(Free on orders over £50)</span>'

        customer_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a; color: #f5f5f5; margin: 0; padding: 40px 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #1a1a1a; border: 1px solid #2a2a2a;">
                <div style="background-color: #000; padding: 30px; text-align: center; border-bottom: 2px solid #00ff00;">
                    <img src="{LOGO_DATA_URI}" alt="PLAGUED" style="max-width: 200px; height: auto;">
                </div>

                <div style="padding: 40px 30px;">
                    <h2 style="color: #00ff00; margin-top: 0;">Order Confirmed</h2>
                    <p style="color: #999; line-height: 1.6;">
                        Thanks for your order! We've received your payment and will start processing your items soon.
                    </p>

                    <div style="background-color: #0a0a0a; padding: 20px; margin: 30px 0; border-left: 3px solid #00ff00;">
                        <p style="margin: 0; color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Order Number</p>
                        <p style="margin: 5px 0 0 0; color: #00ff00; font-size: 24px; font-weight: bold;">{order_number}</p>
                    </div>

                    <h3 style="color: #f5f5f5; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px;">Order Details</h3>
                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        {customer_items_html}
                        <tr>
                            <td style="padding: 12px; text-align: right; color: #999;">
                                Subtotal
                            </td>
                            <td style="padding: 12px; text-align: right; color: #f5f5f5;">
                                £{(subtotal / 100):.2f}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; text-align: right; color: #999;">
                                Shipping{free_shipping_note}
                            </td>
                            <td style="padding: 12px; text-align: right; color: #f5f5f5;">
                                £{(shipping_cost / 100):.2f}
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 20px 12px 12px 12px; text-align: right; color: #999; border-top: 2px solid #00ff00;">
                                <strong>TOTAL</strong>
                            </td>
                            <td style="padding: 20px 12px 12px 12px; text-align: right; font-size: 20px; color: #00ff00; border-top: 2px solid #00ff00;">
                                <strong>£{(total_amount / 100):.2f}</strong>
                            </td>
                        </tr>
                    </table>

                    <h3 style="color: #f5f5f5; border-bottom: 1px solid #2a2a2a; padding-bottom: 10px;">Shipping Address</h3>
                    <p style="color: #999; line-height: 1.6;">
                        {shipping_name}<br>
                        {shipping.get('address', {}).get('line1', '')}<br>
                        {shipping.get('address', {}).get('line2', '') + '<br>' if shipping.get('address', {}).get('line2') else ''}
                        {shipping.get('address', {}).get('city', '')}, {shipping.get('address', {}).get('postal_code', '')}<br>
                        {shipping.get('address', {}).get('country', '')}
                    </p>

                    <p style="color: #666; font-size: 12px; margin-top: 40px;">
                        If you have any questions, reply to this email or contact us at <a href="mailto:contact@plagueduk.com" style="color: #00ff00;">contact@plagueduk.com</a>
                    </p>
                </div>

                <div style="background-color: #0a0a0a; padding: 20px; text-align: center; border-top: 1px solid #2a2a2a;">
                    <p style="color: #666; font-size: 12px; margin: 0;">
                        © 2024 Plagued. All rights reserved.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """

        resend.Emails.send({
            "from": FROM_EMAIL,
            "to": customer_email,
            "subject": f"Order Confirmation - {order_number}",
            "html": customer_html
        })
        print(f"✅ Customer confirmation email sent to: {customer_email}")

        # Send admin notification with shipping label
        admin_items_list = "\n".join([
            f"- {item['name']} (Size: {item['size']}) x{item['quantity']} = £{(item['price'] * item['quantity'] / 100):.2f}"
            for item in items
        ])

        admin_html = f"""
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #00ff00;">🎉 New Order Received!</h2>

            <div style="background: #f5f5f5; padding: 15px; margin: 20px 0; border-left: 4px solid #00ff00;">
                <strong>Order Number:</strong> {order_number}<br>
                <strong>Total:</strong> £{(total_amount / 100):.2f}<br>
                <strong>Customer:</strong> {customer_email}
            </div>

            <h3>Items Ordered:</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-left: 4px solid #00ff00;">{admin_items_list}</pre>

            <h3>Shipping Address:</h3>
            <pre style="background: #f5f5f5; padding: 15px; border-left: 4px solid #00ff00;">{shipping_name}
{shipping.get('address', {}).get('line1', '')}
{shipping.get('address', {}).get('line2', '')}
{shipping.get('address', {}).get('city', '')}, {shipping.get('address', {}).get('postal_code', '')}
{shipping.get('address', {}).get('country', '')}</pre>

            <p style="color: #666; font-size: 12px; margin-top: 40px;">
                View full order details in your Supabase dashboard.
            </p>
        </body>
        </html>
        """

        email_params = {
            "from": FROM_EMAIL,
            "to": CONTACT_EMAIL,
            "subject": f"🛍️ New Order: {order_number}",
            "html": admin_html
        }

        resend.Emails.send(email_params)
        print(f"✅ Admin notification email sent to: {CONTACT_EMAIL}")

        # Mark confirmation email as sent
        mark_confirmation_email_sent(order_id)
        print(f"✅ Email status updated in database")

        print(f"\n{'='*60}")
        print(f"✅ TEST COMPLETE - Order processed successfully!")
        print(f"{'='*60}\n")

        return {
            "status": "success",
            "order_id": str(order_id),
            "order_number": order_number,
            "customer_email": customer_email,
            "total_amount": f"£{(total_amount / 100):.2f}",
            "message": "Order processed successfully! Check Supabase and your email."
        }

    except Exception as e:
        print(f"\n❌ TEST FAILED: {str(e)}\n")
        import traceback
        traceback.print_exc()
        return {
            "status": "error",
            "message": str(e)
        }


# ============== ADMIN API ENDPOINTS ==============
# All admin endpoints require authentication via Supabase JWT token

from fastapi import Depends

@app.get("/api/admin/orders")
async def admin_list_orders(
    page: int = 1,
    limit: int = 20,
    status: str = None,
    search: str = None,
    admin: dict = Depends(verify_admin_token)
):
    """Get paginated list of orders with filtering"""
    try:
        offset = (page - 1) * limit
        result = get_all_orders(limit=limit, offset=offset, status_filter=status, search=search)
        return result
    except Exception as e:
        print(f"Error in admin_list_orders: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch orders")


@app.get("/api/admin/orders/{order_id}")
async def admin_get_order(
    order_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Get full order details"""
    try:
        order = get_order_details(order_id)
        if not order:
            raise HTTPException(status_code=404, detail="Order not found")
        return order
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_get_order: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch order")


class UpdateOrderStatusRequest(BaseModel):
    status: str = Field(..., pattern="^(pending|processing|shipped|delivered|cancelled)$")


@app.patch("/api/admin/orders/{order_id}/status")
async def admin_update_order_status(
    order_id: str,
    request: UpdateOrderStatusRequest,
    admin: dict = Depends(verify_admin_token)
):
    """Update order status"""
    try:
        success = update_order_status(order_id, request.status)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update order status")
        return {"success": True, "order_id": order_id, "status": request.status}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_update_order_status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update order status")


@app.get("/api/admin/products")
async def admin_list_products(
    admin: dict = Depends(verify_admin_token)
):
    """Get all products with variants"""
    try:
        products = get_all_products_admin()
        return products
    except Exception as e:
        print(f"Error in admin_list_products: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch products")


class UpdateStockRequest(BaseModel):
    stock_quantity: int = Field(..., ge=0)
    reason: str = "manual_adjustment"
    notes: str = ""


@app.patch("/api/admin/products/variants/{variant_id}/stock")
async def admin_update_stock(
    variant_id: str,
    request: UpdateStockRequest,
    admin: dict = Depends(verify_admin_token)
):
    """Update variant stock level"""
    try:
        success = update_variant_stock(
            variant_id=variant_id,
            new_stock=request.stock_quantity,
            reason=request.reason,
            notes=request.notes
        )
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update stock")
        return {"success": True, "variant_id": variant_id, "new_stock": request.stock_quantity}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_update_stock: {e}")
        raise HTTPException(status_code=500, detail="Failed to update stock")


class CreateProductRequest(BaseModel):
    name: str
    description: str
    base_price: int = Field(..., gt=0)
    product_type: str = None
    colour: str = None
    image_url: str = None
    is_active: bool = True
    unit_cost: int = Field(default=0, ge=0)  # Cost per unit in pence for profit calculation
    sizes: List[dict]  # [{"size_name": "S", "stock_quantity": 10, "price_adjustment": 0}]


@app.post("/api/admin/products")
async def admin_create_product(
    request: CreateProductRequest,
    admin: dict = Depends(verify_admin_token)
):
    """Create a new product with variants"""
    try:
        # Create product
        product = create_product(
            name=request.name,
            description=request.description,
            base_price=request.base_price,
            product_type=request.product_type,
            colour=request.colour,
            image_url=request.image_url,
            is_active=request.is_active,
            unit_cost=request.unit_cost
        )

        if not product:
            raise HTTPException(status_code=500, detail="Failed to create product")

        # Create variants for each size
        variants = []
        for size_data in request.sizes:
            variant = create_product_variant(
                product_id=product["id"],
                size_name=size_data.get("size_name"),
                price_adjustment=size_data.get("price_adjustment", 0),
                stock_quantity=size_data.get("stock_quantity", 0)
            )
            if variant:
                variants.append(variant)

        return {
            "success": True,
            "product": product,
            "variants": variants
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_create_product: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create product: {str(e)}")


@app.post("/api/admin/products/upload-image")
async def admin_upload_product_image(
    file: UploadFile = File(...),
    admin: dict = Depends(verify_admin_token)
):
    """Upload product image to Supabase Storage"""
    try:
        # Read file bytes
        file_bytes = await file.read()

        # Validate file type
        if not file.content_type or not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Upload to Supabase
        image_url = upload_product_image(file_bytes, file.filename)

        if not image_url:
            raise HTTPException(status_code=500, detail="Failed to upload image")

        return {"success": True, "image_url": image_url}

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_upload_product_image: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@app.delete("/api/admin/products/{product_id}")
async def admin_delete_product(
    product_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Delete a product if it has no orders, otherwise mark as inactive"""
    try:
        result = delete_product(product_id)

        if not result:
            raise HTTPException(status_code=500, detail="Failed to delete product")

        return {
            "success": True,
            "action": result["action"],  # 'deleted' or 'deactivated'
            "message": result["message"]
        }

    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_delete_product: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete product: {str(e)}")


@app.get("/api/admin/customers")
async def admin_list_customers(
    page: int = 1,
    limit: int = 50,
    search: str = None,
    admin: dict = Depends(verify_admin_token)
):
    """Get paginated list of customers"""
    try:
        offset = (page - 1) * limit
        result = get_all_customers(limit=limit, offset=offset, search=search)
        return result
    except Exception as e:
        print(f"Error in admin_list_customers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch customers")


@app.get("/api/admin/customers/{customer_id}")
async def admin_get_customer(
    customer_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Get customer with full order history"""
    try:
        customer = get_customer_details(customer_id)
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")
        return customer
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_get_customer: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch customer")


@app.get("/api/admin/analytics/overview")
async def admin_get_analytics(
    admin: dict = Depends(verify_admin_token)
):
    """Get analytics overview for dashboard"""
    try:
        analytics = get_analytics_overview()
        return analytics
    except Exception as e:
        print(f"Error in admin_get_analytics: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch analytics")


@app.get("/api/admin/analytics/size-distribution")
async def admin_get_size_distribution(
    admin: dict = Depends(verify_admin_token)
):
    """Get size distribution by product type for inventory planning"""
    try:
        distribution = get_size_distribution_by_type()
        return distribution
    except Exception as e:
        print(f"Error in admin_get_size_distribution: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch size distribution")


@app.get("/api/admin/dashboard/stats")
async def admin_dashboard_stats(
    admin: dict = Depends(verify_admin_token)
):
    """Get quick stats for dashboard"""
    try:
        order_stats = get_order_stats()
        low_stock = get_low_stock_variants(threshold=5)
        analytics = get_analytics_overview()

        return {
            "order_stats": order_stats,
            "low_stock_count": len(low_stock),
            "low_stock_items": low_stock[:5],  # Top 5 low stock items
            # Revenue breakdown
            "total_revenue": analytics["total_revenue"],
            "product_revenue": analytics["product_revenue"],
            "shipping_collected": analytics["shipping_collected"],
            # Cost breakdown
            "cogs": analytics["cogs"],
            "shipping_costs": analytics["shipping_costs"],
            "inventory_value": analytics["inventory_value"],
            "total_costs_including_inventory": analytics["total_costs_including_inventory"],
            # Profit metrics
            "gross_profit": analytics["gross_profit"],
            "gross_margin": analytics["gross_margin"],
            "net_profit": analytics["net_profit"],
            "net_margin": analytics["net_margin"],
            # Overall P&L
            "overall_pl": analytics["overall_pl"],
            "has_broken_even": analytics["has_broken_even"],
            # Legacy fields
            "total_cost": analytics["total_cost"],
            "total_profit": analytics["total_profit"],
            "profit_margin": analytics["profit_margin"],
            # Order metrics
            "total_orders": analytics["total_orders"],
            "monthly_revenue": analytics["monthly_revenue"],
            "monthly_orders": analytics["monthly_orders"],
            "total_customers": analytics["total_customers"],
            "average_order_value": analytics["average_order_value"],
            "top_products": analytics["top_products"],
            "recent_orders": analytics["recent_orders"][:5]  # Last 5 orders
        }
    except Exception as e:
        print(f"Error in admin_dashboard_stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch dashboard stats")


# ============== COLLECTIONS ==============

class CreateCollectionRequest(BaseModel):
    name: str
    description: str = ""


class UpdateCollectionRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class AddProductsRequest(BaseModel):
    product_ids: List[str]


@app.get("/api/admin/collections")
async def admin_list_collections(
    admin: dict = Depends(verify_admin_token)
):
    """Get all collections with product counts"""
    try:
        collections = get_all_collections()
        return collections
    except Exception as e:
        print(f"Error in admin_list_collections: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch collections")


@app.get("/api/admin/collections/{collection_id}")
async def admin_get_collection(
    collection_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Get collection details with all products"""
    try:
        collection = get_collection_details(collection_id)
        if not collection:
            raise HTTPException(status_code=404, detail="Collection not found")
        return collection
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_get_collection: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch collection")


@app.post("/api/admin/collections")
async def admin_create_collection(
    request: CreateCollectionRequest,
    admin: dict = Depends(verify_admin_token)
):
    """Create a new collection"""
    try:
        collection = create_collection(
            name=request.name,
            description=request.description
        )
        if not collection:
            raise HTTPException(status_code=500, detail="Failed to create collection")
        return {"success": True, "collection": collection}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_create_collection: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create collection: {str(e)}")


@app.patch("/api/admin/collections/{collection_id}")
async def admin_update_collection(
    collection_id: str,
    request: UpdateCollectionRequest,
    admin: dict = Depends(verify_admin_token)
):
    """Update collection details"""
    try:
        success = update_collection(
            collection_id=collection_id,
            name=request.name,
            description=request.description
        )
        if not success:
            raise HTTPException(status_code=500, detail="Failed to update collection")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_update_collection: {e}")
        raise HTTPException(status_code=500, detail="Failed to update collection")


@app.delete("/api/admin/collections/{collection_id}")
async def admin_delete_collection(
    collection_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Delete a collection"""
    try:
        success = delete_collection(collection_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to delete collection")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_delete_collection: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete collection")


@app.post("/api/admin/collections/{collection_id}/products")
async def admin_add_products_to_collection(
    collection_id: str,
    request: AddProductsRequest,
    admin: dict = Depends(verify_admin_token)
):
    """Add products to a collection"""
    try:
        success = add_products_to_collection(collection_id, request.product_ids)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to add products")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_add_products_to_collection: {e}")
        raise HTTPException(status_code=500, detail="Failed to add products")


@app.delete("/api/admin/collections/{collection_id}/products/{product_id}")
async def admin_remove_product_from_collection(
    collection_id: str,
    product_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Remove a product from a collection"""
    try:
        success = remove_product_from_collection(collection_id, product_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to remove product")
        return {"success": True}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_remove_product_from_collection: {e}")
        raise HTTPException(status_code=500, detail="Failed to remove product")


@app.post("/api/admin/collections/{collection_id}/drop")
async def admin_drop_collection(
    collection_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Drop a collection - make all products active"""
    try:
        success = drop_collection(collection_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to drop collection")
        return {"success": True, "message": "Collection dropped successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_drop_collection: {e}")
        raise HTTPException(status_code=500, detail="Failed to drop collection")


@app.post("/api/admin/collections/{collection_id}/undrop")
async def admin_undrop_collection(
    collection_id: str,
    admin: dict = Depends(verify_admin_token)
):
    """Undrop a collection - make all products inactive"""
    try:
        success = undrop_collection(collection_id)
        if not success:
            raise HTTPException(status_code=500, detail="Failed to undrop collection")
        return {"success": True, "message": "Collection undropped successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in admin_undrop_collection: {e}")
        raise HTTPException(status_code=500, detail="Failed to undrop collection")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
