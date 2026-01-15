"""
Database operations for merch, orders, and stock management
"""
import json
from typing import List, Dict, Optional, Tuple
from datetime import datetime
from uuid import UUID

from supabase_client import supabase


# ============== PRODUCTS & VARIANTS ==============

def get_all_products_with_stock() -> List[Dict]:
    """
    Fetch all active products with their variants and stock levels.
    Returns format compatible with frontend expectations.
    """
    try:
        # Fetch products
        products_response = supabase.table("products")\
            .select("*")\
            .eq("is_active", True)\
            .execute()

        products = products_response.data

        # Fetch all variants (no is_available column - that was removed)
        variants_response = supabase.table("product_variants")\
            .select("*")\
            .execute()

        variants = variants_response.data

        # Group variants by product_id
        variants_by_product = {}
        for variant in variants:
            product_id = variant["product_id"]
            if product_id not in variants_by_product:
                variants_by_product[product_id] = []
            variants_by_product[product_id].append(variant)

        # Transform to frontend format
        result = []
        for product in products:
            product_variants = variants_by_product.get(product["id"], [])

            # Build sizes array with stock info
            sizes = []
            has_any_stock = False
            for variant in product_variants:
                size_info = {
                    "size": variant["size"],
                    "stock": variant["stock_quantity"],
                    "variant_id": variant["id"],
                    "available": variant["stock_quantity"] > 0
                }
                sizes.append(size_info)
                if variant["stock_quantity"] > 0:
                    has_any_stock = True

            result.append({
                "id": product["id"],
                "name": product["name"],
                "description": product["description"],
                "price": product["base_price"],
                "image": product["image_url"],
                "sizes": sizes,
                "inStock": has_any_stock
            })

        return result

    except Exception as e:
        print(f"Error fetching products: {e}")
        raise


def check_stock_availability(items: List[Dict]) -> Tuple[bool, Optional[str]]:
    """
    Validate stock availability for cart items.
    Returns (is_available, error_message)
    """
    try:
        for item in items:
            # Find variant by product_id and size
            response = supabase.table("product_variants")\
                .select("stock_quantity, size")\
                .eq("product_id", item["id"])\
                .eq("size", item["size"])\
                .single()\
                .execute()

            if not response.data:
                return False, f"{item['name']} (Size: {item['size']}) is no longer available"

            variant = response.data
            if variant["stock_quantity"] < item["quantity"]:
                return False, f"Insufficient stock for {item['name']} (Size: {item['size']}). Only {variant['stock_quantity']} remaining."

        return True, None

    except Exception as e:
        print(f"Error checking stock: {e}")
        return False, "Unable to verify stock availability"


def decrement_stock(items: List[Dict], order_id: UUID) -> bool:
    """
    Decrement stock for purchased items and record transaction.
    Uses atomic operations to prevent overselling.
    """
    try:
        for item in items:
            # Get current stock
            variant_response = supabase.table("product_variants")\
                .select("id, stock_quantity")\
                .eq("product_id", item["id"])\
                .eq("size", item["size"])\
                .single()\
                .execute()

            if not variant_response.data:
                raise ValueError(f"Variant not found: {item['id']} - {item['size']}")

            variant = variant_response.data
            variant_id = variant["id"]
            current_stock = variant["stock_quantity"]

            # Check stock availability
            if current_stock < item["quantity"]:
                raise ValueError(f"Insufficient stock for {item['name']} (Size: {item['size']})")

            new_stock = current_stock - item["quantity"]

            # Update stock
            supabase.table("product_variants")\
                .update({"stock_quantity": new_stock})\
                .eq("id", variant_id)\
                .execute()

            # Record stock transaction
            supabase.table("stock_transactions")\
                .insert({
                    "product_variant_id": variant_id,
                    "order_id": str(order_id),
                    "transaction_type": "sale",
                    "quantity_change": -item["quantity"],
                    "stock_before": current_stock,
                    "stock_after": new_stock,
                    "created_by": "system",
                    "notes": f"Order {order_id}"
                })\
                .execute()

        return True

    except Exception as e:
        print(f"Error decrementing stock: {e}")
        raise


# ============== CUSTOMERS & ADDRESSES ==============

def find_or_create_customer(email: str, name: Optional[str] = None) -> UUID:
    """
    Find existing customer by email or create new one.
    """
    try:
        # Check if customer exists
        response = supabase.table("customers")\
            .select("id")\
            .eq("email", email)\
            .limit(1)\
            .execute()

        if response.data:
            return response.data[0]["id"]

        # Create new customer
        new_customer = supabase.table("customers")\
            .insert({"email": email, "name": name})\
            .execute()

        return new_customer.data[0]["id"]

    except Exception as e:
        print(f"Error finding/creating customer: {e}")
        raise


def create_address(customer_id: UUID, shipping_data: Dict) -> UUID:
    """
    Create shipping address record.
    """
    try:
        address_data = {
            "customer_id": str(customer_id),
            "name": shipping_data.get("name", ""),
            "line1": shipping_data.get("address", {}).get("line1", ""),
            "line2": shipping_data.get("address", {}).get("line2"),
            "city": shipping_data.get("address", {}).get("city", ""),
            "state": shipping_data.get("address", {}).get("state"),
            "postal_code": shipping_data.get("address", {}).get("postal_code", ""),
            "country": shipping_data.get("address", {}).get("country", "GB")
        }

        response = supabase.table("addresses")\
            .insert(address_data)\
            .execute()

        return response.data[0]["id"]

    except Exception as e:
        print(f"Error creating address: {e}")
        raise


# ============== ORDERS ==============

def create_order(
    customer_id: UUID,
    address_id: UUID,
    items: List[Dict],
    total_amount: int,
    stripe_payment_intent_id: str,
    shipping_amount: int = 0,
    discount_code_id: Optional[UUID] = None
) -> Dict:
    """
    Create order with items.
    Returns order record with order_number.
    """
    try:
        # Calculate subtotal
        subtotal = sum(item["price"] * item["quantity"] for item in items)

        # Generate order number
        order_number_response = supabase.rpc("generate_order_number").execute()
        order_number = order_number_response.data

        # Create order
        order_data = {
            "order_number": order_number,
            "customer_id": str(customer_id),
            "shipping_address_id": str(address_id),
            "status": "paid",  # Orders are created when payment succeeds (webhook fires)
            "subtotal_amount": subtotal,
            "shipping_amount": shipping_amount,
            "total_amount": total_amount,
            "currency": "gbp",
            "stripe_payment_intent_id": stripe_payment_intent_id,
            "paid_at": datetime.utcnow().isoformat()
        }

        # Add discount code if provided
        if discount_code_id:
            order_data["discount_code_id"] = str(discount_code_id)

        order_response = supabase.table("orders")\
            .insert(order_data)\
            .execute()

        order = order_response.data[0]
        order_id = order["id"]

        # Create order items
        for item in items:
            # Get variant details
            variant_response = supabase.table("product_variants")\
                .select("id")\
                .eq("product_id", item["id"])\
                .eq("size", item["size"])\
                .single()\
                .execute()

            variant_id = variant_response.data["id"]

            order_item_data = {
                "order_id": order_id,
                "product_variant_id": variant_id,
                "product_name": item["name"],
                "product_size": item["size"],
                "product_image_url": item.get("image"),
                "quantity": item["quantity"],
                "unit_price": item["price"],
                "line_total": item["price"] * item["quantity"]
            }

            supabase.table("order_items")\
                .insert(order_item_data)\
                .execute()

        return order

    except Exception as e:
        print(f"Error creating order: {e}")
        raise


def get_order_by_payment_intent(payment_intent_id: str) -> Optional[Dict]:
    """
    Find order by Stripe payment intent ID.
    Used to prevent duplicate order creation.
    """
    try:
        response = supabase.table("orders")\
            .select("*")\
            .eq("stripe_payment_intent_id", payment_intent_id)\
            .limit(1)\
            .execute()

        if response.data:
            return response.data[0]
        return None

    except Exception as e:
        print(f"Error fetching order: {e}")
        return None


def update_order_status(order_id: UUID, status: str) -> bool:
    """
    Update order status with timestamp.
    """
    try:
        update_data = {"status": status}

        # Set timestamp based on status
        if status == "shipped":
            update_data["shipped_at"] = datetime.utcnow().isoformat()
        elif status == "delivered":
            update_data["delivered_at"] = datetime.utcnow().isoformat()

        supabase.table("orders")\
            .update(update_data)\
            .eq("id", str(order_id))\
            .execute()

        return True

    except Exception as e:
        print(f"Error updating order status: {e}")
        return False


def mark_confirmation_email_sent(order_id: UUID) -> bool:
    """
    Mark order confirmation email as sent.
    """
    try:
        supabase.table("orders")\
            .update({
                "confirmation_email_sent": True,
                "confirmation_email_sent_at": datetime.utcnow().isoformat()
            })\
            .eq("id", str(order_id))\
            .execute()

        return True

    except Exception as e:
        print(f"Error marking email sent: {e}")
        return False


# ============== DISCOUNT CODES ==============

def validate_discount_code(code: str, customer_email: str) -> Optional[Dict]:
    """
    Validate a discount code and check if customer can use it.
    Returns discount code details if valid, None if invalid.
    """
    try:
        # Fetch discount code
        response = supabase.table("discount_codes")\
            .select("*")\
            .eq("code", code.upper())\
            .eq("active", True)\
            .execute()

        if not response.data:
            return None

        discount = response.data[0]

        # Check if code has expired
        if discount.get("valid_until"):
            valid_until = datetime.fromisoformat(discount["valid_until"].replace("Z", "+00:00"))
            if datetime.utcnow().replace(tzinfo=valid_until.tzinfo) > valid_until:
                return None

        # Check if not yet valid
        if discount.get("valid_from"):
            valid_from = datetime.fromisoformat(discount["valid_from"].replace("Z", "+00:00"))
            if datetime.utcnow().replace(tzinfo=valid_from.tzinfo) < valid_from:
                return None

        # If single use per customer, check if customer has already used it
        if discount.get("single_use_per_customer", True):
            usage_response = supabase.table("discount_code_usage")\
                .select("*")\
                .eq("discount_code_id", discount["id"])\
                .eq("customer_email", customer_email.lower())\
                .execute()

            if usage_response.data:
                return None  # Customer has already used this code

        return discount

    except Exception as e:
        print(f"Error validating discount code: {e}")
        return None


def record_discount_code_usage(discount_code_id: UUID, customer_email: str, order_id: UUID) -> bool:
    """
    Record that a customer has used a discount code on an order.
    """
    try:
        supabase.table("discount_code_usage").insert({
            "discount_code_id": str(discount_code_id),
            "customer_email": customer_email.lower(),
            "order_id": str(order_id)
        }).execute()

        return True

    except Exception as e:
        print(f"Error recording discount code usage: {e}")
        return False


def get_discount_code_by_code(code: str) -> Optional[Dict]:
    """
    Get discount code details by code string.
    """
    try:
        response = supabase.table("discount_codes")\
            .select("*")\
            .eq("code", code.upper())\
            .execute()

        if response.data:
            return response.data[0]
        return None

    except Exception as e:
        print(f"Error fetching discount code: {e}")
        return None
