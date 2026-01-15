"""
Royal Mail Click & Drop API Integration
Generates shipping labels for orders
"""
import os
import requests
from datetime import datetime
from typing import Optional, Tuple


# Royal Mail Click & Drop API Configuration
# Uses the Click & Drop authorization key (simpler than OAuth2)
ROYAL_MAIL_AUTH_KEY = os.getenv("ROYAL_MAIL_AUTH_KEY", "")
ROYAL_MAIL_BASE_URL = "https://api.parcel.royalmail.com/api/v1"

# Sender (return) address configuration
SENDER_NAME = os.getenv("ROYAL_MAIL_SENDER_NAME", "Plagued Merch")
SENDER_ADDRESS_LINE1 = os.getenv("ROYAL_MAIL_SENDER_ADDRESS_LINE1", "")
SENDER_CITY = os.getenv("ROYAL_MAIL_SENDER_CITY", "")
SENDER_POSTCODE = os.getenv("ROYAL_MAIL_SENDER_POSTCODE", "")
SENDER_EMAIL = os.getenv("ROYAL_MAIL_SENDER_EMAIL", "plagueduk@gmail.com")

# Default service code - Royal Mail Tracked 48 (economical tracked option)
# Can be overridden per order if needed
DEFAULT_SERVICE_CODE = "TPN"  # Tracked 48


def is_configured() -> bool:
    """Check if Royal Mail API is configured."""
    return bool(ROYAL_MAIL_AUTH_KEY)


def create_shipping_label(
    order_number: str,
    recipient_name: str,
    address_line1: str,
    address_line2: str,
    city: str,
    postcode: str,
    country_code: str,
    email: str,
    items: list,
    total_amount: int,
    subtotal: int,
    shipping_cost: int,
    weight_grams: int = 500
) -> Tuple[Optional[bytes], Optional[str], Optional[str]]:
    """
    Create a shipping label via Royal Mail Click & Drop API.

    Returns:
        Tuple of (pdf_bytes, tracking_number, error_message)
        - If successful: (pdf_bytes, tracking_number, None)
        - If failed: (None, None, error_message)
    """
    if not ROYAL_MAIL_AUTH_KEY:
        print("[ROYAL MAIL] Auth key not configured - skipping label generation")
        return None, None, "Royal Mail auth key not configured"

    print(f"[ROYAL MAIL] Creating shipping label for order {order_number}")

    # Build the order request
    # Using Royal Mail Click & Drop API format
    order_data = {
        "items": [{
            "orderReference": order_number,
            "recipient": {
                "address": {
                    "fullName": recipient_name,
                    "addressLine1": address_line1,
                    "addressLine2": address_line2 or "",
                    "city": city,
                    "postcode": postcode,
                    "countryCode": country_code or "GB"
                },
                "emailAddress": email
            },
            "sender": {
                "tradingName": "Plagued",
                "address": {
                    "fullName": SENDER_NAME,
                    "addressLine1": SENDER_ADDRESS_LINE1,
                    "city": SENDER_CITY,
                    "postcode": SENDER_POSTCODE,
                    "countryCode": "GB"
                },
                "emailAddress": SENDER_EMAIL
            },
            "billing": {
                "address": {
                    "fullName": recipient_name,
                    "addressLine1": address_line1,
                    "city": city,
                    "postcode": postcode,
                    "countryCode": country_code or "GB"
                }
            },
            "packages": [{
                "weightInGrams": weight_grams,
                "packageFormatIdentifier": "smallParcel",
                "contents": [
                    {
                        "name": item["name"],
                        "quantity": item["quantity"],
                        "unitValue": item["price"] / 100,  # Convert pence to pounds
                        "unitWeightInGrams": int(weight_grams / len(items))
                    } for item in items
                ]
            }],
            "orderDate": datetime.utcnow().isoformat() + "Z",
            "subtotal": subtotal / 100,  # Convert pence to pounds
            "shippingCostCharged": shipping_cost / 100,
            "total": total_amount / 100,
            "currencyCode": "GBP",
            "label": {
                "includeLabelInResponse": True,
                "labelFormat": "PDF"
            },
            "orderTax": 0,
            "shippingCostChargedTax": 0
        }]
    }

    headers = {
        "Authorization": f"Bearer {ROYAL_MAIL_AUTH_KEY}",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }

    try:
        print(f"[ROYAL MAIL] Sending request to {ROYAL_MAIL_BASE_URL}/orders")

        response = requests.post(
            f"{ROYAL_MAIL_BASE_URL}/orders",
            json=order_data,
            headers=headers,
            timeout=30
        )

        print(f"[ROYAL MAIL] Response status: {response.status_code}")

        if response.status_code in [200, 201]:
            result = response.json()

            # Extract label and tracking info
            if "createdOrders" in result and len(result["createdOrders"]) > 0:
                created_order = result["createdOrders"][0]
                tracking_number = created_order.get("trackingNumber", "")

                # Get label PDF (base64 encoded)
                label_base64 = created_order.get("label", "")
                if label_base64:
                    import base64
                    pdf_bytes = base64.b64decode(label_base64)
                    print(f"[ROYAL MAIL] Label generated successfully - Tracking: {tracking_number}")
                    return pdf_bytes, tracking_number, None
                else:
                    print("[ROYAL MAIL] No label in response, fetching separately...")
                    # Try to fetch label separately
                    order_id = created_order.get("orderIdentifier")
                    if order_id:
                        return fetch_label(order_id, tracking_number)

            print(f"[ROYAL MAIL] Unexpected response format: {result}")
            return None, None, "Unexpected response format from Royal Mail"

        else:
            error_detail = response.text
            print(f"[ROYAL MAIL] API Error: {error_detail}")
            return None, None, f"Royal Mail API error: {response.status_code}"

    except requests.exceptions.Timeout:
        print("[ROYAL MAIL] Request timeout")
        return None, None, "Royal Mail API timeout"
    except requests.exceptions.RequestException as e:
        print(f"[ROYAL MAIL] Request error: {e}")
        return None, None, f"Royal Mail API request error: {str(e)}"
    except Exception as e:
        print(f"[ROYAL MAIL] Unexpected error: {e}")
        return None, None, f"Unexpected error: {str(e)}"


def fetch_label(order_identifier: str, tracking_number: str = "") -> Tuple[Optional[bytes], Optional[str], Optional[str]]:
    """
    Fetch a shipping label for an existing order.

    Returns:
        Tuple of (pdf_bytes, tracking_number, error_message)
    """
    if not ROYAL_MAIL_AUTH_KEY:
        return None, None, "Royal Mail auth key not configured"

    headers = {
        "Authorization": f"Bearer {ROYAL_MAIL_AUTH_KEY}",
        "Accept": "application/pdf"
    }

    try:
        response = requests.get(
            f"{ROYAL_MAIL_BASE_URL}/orders/{order_identifier}/label",
            params={"documentType": "postageLabel"},
            headers=headers,
            timeout=30
        )

        if response.status_code == 200:
            pdf_bytes = response.content
            print(f"[ROYAL MAIL] Label fetched successfully")
            return pdf_bytes, tracking_number, None
        else:
            print(f"[ROYAL MAIL] Label fetch failed - Status: {response.status_code}")
            print(f"[ROYAL MAIL] Label fetch response: {response.text}")
            return None, tracking_number, f"Failed to fetch label: {response.status_code}"

    except Exception as e:
        return None, tracking_number, f"Error fetching label: {str(e)}"


def estimate_weight_grams(items: list) -> int:
    """
    Estimate package weight based on items.
    Default estimates for merch items.
    """
    total_weight = 0

    for item in items:
        name_lower = item.get("name", "").lower()
        quantity = item.get("quantity", 1)

        # Estimate weight based on product type
        if "t-shirt" in name_lower or "tee" in name_lower:
            total_weight += 200 * quantity  # ~200g per t-shirt
        elif "hoodie" in name_lower:
            total_weight += 500 * quantity  # ~500g per hoodie
        elif "cap" in name_lower or "hat" in name_lower:
            total_weight += 100 * quantity  # ~100g per cap
        elif "patch" in name_lower:
            total_weight += 20 * quantity   # ~20g per patch
        elif "sticker" in name_lower:
            total_weight += 10 * quantity   # ~10g per sticker
        else:
            total_weight += 200 * quantity  # Default estimate

    # Add packaging weight (~50g)
    total_weight += 50

    # Minimum weight
    return max(total_weight, 100)
