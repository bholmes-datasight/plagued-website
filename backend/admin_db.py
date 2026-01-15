"""
Admin-specific database queries for orders, products, customers, and analytics
"""
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from supabase_client import supabase


# ============== ORDERS ==============

def get_all_orders(limit: int = 20, offset: int = 0, status_filter: str = None, search: str = None) -> Dict:
    """
    Get paginated list of orders with filtering.
    Returns orders with customer and item count.
    """
    try:
        query = supabase.table("orders").select(
            """
            *,
            customers(email, name),
            addresses(name, line1, city, postal_code, country)
            """,
            count="exact"
        ).order("created_at", desc=True)

        # Apply status filter
        if status_filter and status_filter.lower() != "all":
            query = query.eq("status", status_filter.lower())

        # Apply search filter (order number or customer email)
        if search:
            # This is a simplified search - ideally use full-text search
            query = query.or_(f"order_number.ilike.%{search}%")

        # Apply pagination
        query = query.range(offset, offset + limit - 1)

        response = query.execute()

        return {
            "data": response.data,
            "count": response.count,
            "limit": limit,
            "offset": offset
        }

    except Exception as e:
        print(f"Error fetching orders: {e}")
        raise


def get_order_details(order_id: str) -> Optional[Dict]:
    """
    Get full order details including items, customer, and address.
    """
    try:
        response = supabase.table("orders").select(
            """
            *,
            customers(id, email, name),
            addresses(name, line1, line2, city, state, postal_code, country),
            order_items(*)
            """
        ).eq("id", order_id).single().execute()

        return response.data

    except Exception as e:
        print(f"Error fetching order details: {e}")
        return None


def update_order_status(order_id: str, status: str) -> bool:
    """
    Update order status and set appropriate timestamp.
    Valid statuses: paid, shipped, delivered, cancelled, refunded
    """
    try:
        update_data = {"status": status}

        # Set timestamp based on status
        now = datetime.utcnow().isoformat()
        if status == "shipped":
            update_data["shipped_at"] = now
        elif status == "delivered":
            update_data["delivered_at"] = now
        elif status == "cancelled":
            update_data["cancelled_at"] = now
        elif status == "refunded":
            update_data["refunded_at"] = now

        supabase.table("orders").update(update_data).eq("id", order_id).execute()
        return True

    except Exception as e:
        print(f"Error updating order status: {e}")
        return False


def get_size_distribution_by_type() -> Dict[str, Dict]:
    """
    Get size distribution for sold items grouped by product type.
    This helps determine optimal ordering quantities for each size.

    Returns:
    {
        "T-Shirt": {
            "sizes": {"S": 5, "M": 10, "L": 15, "XL": 8},
            "total": 38,
            "percentages": {"S": 13.2, "M": 26.3, "L": 39.5, "XL": 21.0}
        },
        ...
    }
    """
    try:
        # Get all order items from non-cancelled/refunded orders with product info
        order_items_response = supabase.table("order_items").select(
            """
            product_name,
            product_size,
            quantity,
            product_variant_id,
            orders!inner(status)
            """
        ).execute()

        # Get product types for each variant
        variants_response = supabase.table("product_variants").select(
            "id, product_id, products(product_type)"
        ).execute()

        # Map variant_id to product_type
        variant_to_type = {}
        for variant in variants_response.data:
            variant_id = variant["id"]
            product_type = variant.get("products", {}).get("product_type", "Unknown")
            variant_to_type[variant_id] = product_type

        # Aggregate by product type and size
        distribution = {}

        for item in order_items_response.data:
            # Skip cancelled/refunded orders
            order_status = item.get("orders", {}).get("status")
            if order_status in ["cancelled", "refunded"]:
                continue

            variant_id = item["product_variant_id"]
            product_type = variant_to_type.get(variant_id, "Unknown")
            size = item["product_size"]
            quantity = item["quantity"]

            # Initialize product type if not exists
            if product_type not in distribution:
                distribution[product_type] = {"sizes": {}, "total": 0}

            # Add to size count
            if size not in distribution[product_type]["sizes"]:
                distribution[product_type]["sizes"][size] = 0

            distribution[product_type]["sizes"][size] += quantity
            distribution[product_type]["total"] += quantity

        # Calculate percentages
        for product_type, data in distribution.items():
            total = data["total"]
            percentages = {}
            for size, count in data["sizes"].items():
                percentages[size] = round((count / total * 100), 1) if total > 0 else 0
            data["percentages"] = percentages

        print(f"[SIZE DISTRIBUTION DEBUG] {distribution}")
        return distribution

    except Exception as e:
        print(f"Error fetching size distribution: {e}")
        import traceback
        traceback.print_exc()
        return {}


def get_order_stats() -> Dict:
    """
    Get order count by status for dashboard.
    Statuses: paid (payment received), shipped, delivered, cancelled, refunded
    """
    try:
        # Get counts for each status
        paid = supabase.table("orders").select("*", count="exact", head=True).eq("status", "paid").execute()
        shipped = supabase.table("orders").select("*", count="exact", head=True).eq("status", "shipped").execute()
        delivered = supabase.table("orders").select("*", count="exact", head=True).eq("status", "delivered").execute()
        cancelled = supabase.table("orders").select("*", count="exact", head=True).eq("status", "cancelled").execute()
        refunded = supabase.table("orders").select("*", count="exact", head=True).eq("status", "refunded").execute()

        return {
            "paid": paid.count or 0,
            "shipped": shipped.count or 0,
            "delivered": delivered.count or 0,
            "cancelled": cancelled.count or 0,
            "refunded": refunded.count or 0,
        }

    except Exception as e:
        print(f"Error fetching order stats: {e}")
        return {"paid": 0, "shipped": 0, "delivered": 0, "cancelled": 0, "refunded": 0}


# ============== PRODUCTS & STOCK ==============

def get_all_products_admin() -> List[Dict]:
    """
    Get all products with variants for admin (includes inactive products).
    """
    try:
        # Fetch all products
        products_response = supabase.table("products").select("*").execute()
        products = products_response.data

        # Fetch all variants using RPC to bypass PostgREST cache issues
        variants_response = supabase.rpc('get_all_product_variants', {}).execute()
        variants = variants_response.data

        # Group variants by product_id
        variants_by_product = {}
        for variant in variants:
            product_id = variant["product_id"]
            if product_id not in variants_by_product:
                variants_by_product[product_id] = []
            variants_by_product[product_id].append(variant)

        # Combine products with variants
        result = []
        for product in products:
            product_variants = variants_by_product.get(product["id"], [])
            result.append({
                **product,
                "product_variants": product_variants
            })

        return result

    except Exception as e:
        print(f"Error fetching products: {e}")
        raise


def update_variant_stock(variant_id: str, new_stock: int, reason: str = "manual_adjustment", notes: str = "") -> bool:
    """
    Update variant stock and create transaction record.
    """
    try:
        # Get current stock using RPC to bypass PostgREST cache
        variant_response = supabase.rpc('get_variant_stock', {'variant_id_param': variant_id}).execute()
        variant = variant_response.data[0]
        old_stock = variant["stock_quantity"]

        # Update stock
        supabase.table("product_variants").update({"stock_quantity": new_stock}).eq("id", variant_id).execute()

        # Create transaction record
        supabase.table("stock_transactions").insert({
            "product_variant_id": variant_id,
            "transaction_type": reason,
            "quantity_change": new_stock - old_stock,
            "stock_before": old_stock,
            "stock_after": new_stock,
            "created_by": "admin",
            "notes": notes or f"Manual adjustment: {reason}"
        }).execute()

        return True

    except Exception as e:
        print(f"Error updating stock: {e}")
        return False


def get_low_stock_variants(threshold: int = 5) -> List[Dict]:
    """
    Get variants with stock below threshold.
    Only shows variants with stock > 0 but below threshold.
    """
    try:
        # Use RPC to bypass PostgREST cache
        response = supabase.rpc('get_low_stock_variants', {'threshold': threshold}).execute()
        return response.data

    except Exception as e:
        print(f"Error fetching low stock variants: {e}")
        return []


def create_product(name: str, description: str, base_price: int, product_type: str = None, colour: str = None, image_url: str = None, is_active: bool = True, unit_cost: int = 0) -> Optional[Dict]:
    """
    Create a new product.
    Returns the created product.
    ID is auto-generated by Supabase trigger.
    """
    try:
        product_data = {
            # Don't send 'id' - let Supabase auto-generate it via trigger
            "name": name,
            "description": description,
            "base_price": base_price,
            "product_type": product_type,
            "colour": colour,
            "image_url": image_url,
            "is_active": is_active,
            "unit_cost": unit_cost
        }

        print(f"[PRODUCT DEBUG] Inserting product: {product_data}")
        # In Supabase v2.x, insert().execute() returns all columns by default
        response = supabase.table("products").insert(product_data).execute()
        print(f"[PRODUCT DEBUG] Product created successfully: {response.data}")
        return response.data[0] if response.data else None

    except Exception as e:
        print(f"[PRODUCT DEBUG] Error creating product: {e}")
        print(f"[PRODUCT DEBUG] Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise


def create_product_variant(product_id: str, size_name: str, price_adjustment: int = 0, stock_quantity: int = 0) -> Optional[Dict]:
    """
    Create a product variant (size).
    SKU is auto-generated by Supabase trigger based on product_type, colour, and size.
    """
    try:
        variant_data = {
            "product_id": product_id,
            "size": size_name,
            "price_adjustment": price_adjustment,
            "stock_quantity": stock_quantity
        }

        print(f"[VARIANT DEBUG] Inserting variant: {variant_data}")
        response = supabase.table("product_variants").insert(variant_data).execute()
        print(f"[VARIANT DEBUG] Variant created successfully: {response.data}")
        return response.data[0] if response.data else None

    except Exception as e:
        print(f"[VARIANT DEBUG] Error creating variant: {e}")
        print(f"[VARIANT DEBUG] Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise


def delete_product(product_id: str) -> dict:
    """
    Delete a product if it has no orders, otherwise mark it as inactive.
    Returns dict with 'action' (deleted/deactivated) and 'message'.
    """
    try:
        print(f"[DELETE DEBUG] Deleting product: {product_id}")

        # Check if product has any orders
        # Get all variants for this product
        variants_response = supabase.table("product_variants")\
            .select("id")\
            .eq("product_id", product_id)\
            .execute()

        variant_ids = [v["id"] for v in variants_response.data]

        # Check if any order_items reference these variants
        has_orders = False
        if variant_ids:
            order_items_response = supabase.table("order_items")\
                .select("id")\
                .in_("product_variant_id", variant_ids)\
                .limit(1)\
                .execute()

            has_orders = len(order_items_response.data) > 0

        if has_orders:
            # Product has been ordered - mark as inactive instead
            print(f"[DELETE DEBUG] Product has orders - marking as inactive: {product_id}")
            supabase.table("products")\
                .update({"is_active": False})\
                .eq("id", product_id)\
                .execute()

            return {
                "action": "deactivated",
                "message": "Product has existing orders and was marked as inactive instead of deleted."
            }

        # No orders - safe to delete
        # First, get the product to retrieve the image URL
        product_response = supabase.table("products").select("image_url").eq("id", product_id).single().execute()
        product = product_response.data

        # Delete the product (variants should cascade)
        supabase.table("products").delete().eq("id", product_id).execute()

        # Delete the image from Supabase Storage if it exists
        if product and product.get("image_url"):
            try:
                image_url = product["image_url"]
                # Extract filename from URL
                # URL format: https://.../storage/v1/object/public/product-images/filename.jpg
                if "product-images/" in image_url:
                    filename = image_url.split("product-images/")[-1]
                    print(f"[DELETE DEBUG] Deleting image: {filename}")

                    # Delete from storage bucket
                    supabase.storage.from_("product-images").remove([filename])
                    print(f"[DELETE DEBUG] Image deleted successfully: {filename}")
            except Exception as img_error:
                # Don't fail the whole operation if image deletion fails
                print(f"[DELETE DEBUG] Warning: Failed to delete image: {img_error}")

        print(f"[DELETE DEBUG] Product deleted successfully: {product_id}")
        return {
            "action": "deleted",
            "message": "Product deleted successfully."
        }

    except Exception as e:
        print(f"[DELETE DEBUG] Error deleting product: {e}")
        print(f"[DELETE DEBUG] Error type: {type(e).__name__}")
        import traceback
        traceback.print_exc()
        raise


def upload_product_image(file_bytes: bytes, filename: str) -> Optional[str]:
    """
    Upload product image to Supabase Storage.
    Returns the public URL of the uploaded image.
    """
    try:
        # Upload to Supabase Storage bucket 'product-images'
        bucket_name = "product-images"

        # Generate unique filename
        import uuid
        from datetime import datetime
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{uuid.uuid4().hex[:8]}_{filename}"

        # Upload file
        response = supabase.storage.from_(bucket_name).upload(
            unique_filename,
            file_bytes,
            {"content-type": "image/jpeg"}  # Adjust based on file type
        )

        # Get public URL
        public_url = supabase.storage.from_(bucket_name).get_public_url(unique_filename)

        return public_url

    except Exception as e:
        print(f"Error uploading image: {e}")
        raise


# ============== CUSTOMERS ==============

def get_all_customers(limit: int = 50, offset: int = 0, search: str = None) -> Dict:
    """
    Get paginated list of customers with order count and total spent.
    """
    try:
        query = supabase.table("customers").select("*", count="exact").order("created_at", desc=True)

        # Apply search
        if search:
            query = query.or_(f"email.ilike.%{search}%,name.ilike.%{search}%")

        query = query.range(offset, offset + limit - 1)
        response = query.execute()

        # For each customer, get order count and total spent
        customers = []
        for customer in response.data:
            orders_response = supabase.table("orders").select("total_amount, created_at").eq("customer_id", customer["id"]).execute()
            orders = orders_response.data

            total_spent = sum(order["total_amount"] for order in orders)
            last_order = max([order["created_at"] for order in orders]) if orders else None

            customers.append({
                **customer,
                "order_count": len(orders),
                "total_spent": total_spent,
                "last_order_at": last_order
            })

        return {
            "data": customers,
            "count": response.count,
            "limit": limit,
            "offset": offset
        }

    except Exception as e:
        print(f"Error fetching customers: {e}")
        raise


def get_customer_details(customer_id: str) -> Optional[Dict]:
    """
    Get customer with full order history.
    """
    try:
        customer_response = supabase.table("customers").select("*").eq("id", customer_id).single().execute()
        customer = customer_response.data

        # Get all orders
        orders_response = supabase.table("orders").select(
            "*,order_items(*)"
        ).eq("customer_id", customer_id).order("created_at", desc=True).execute()

        # Get all addresses used
        addresses_response = supabase.table("orders").select(
            "addresses(*)"
        ).eq("customer_id", customer_id).execute()

        # Calculate lifetime value
        total_spent = sum(order["total_amount"] for order in orders_response.data)

        return {
            **customer,
            "orders": orders_response.data,
            "order_count": len(orders_response.data),
            "total_spent": total_spent,
            "addresses": [order["addresses"] for order in addresses_response.data if order.get("addresses")]
        }

    except Exception as e:
        print(f"Error fetching customer details: {e}")
        return None


# ============== ANALYTICS ==============

def get_analytics_overview() -> Dict:
    """
    Get analytics data for dashboard including revenue, costs, and profit.
    Only counts paid orders (excludes cancelled and refunded).
    """
    try:
        # Get all paid orders (exclude cancelled and refunded)
        # Orders are created as "paid" when payment succeeds, then move to shipped/delivered
        all_orders = supabase.table("orders").select("total_amount, subtotal_amount, shipping_amount, created_at, status").not_.in_("status", ["cancelled", "refunded"]).execute()

        print(f"[ANALYTICS DEBUG] Found {len(all_orders.data)} orders (excluding cancelled/refunded)")
        print(f"[ANALYTICS DEBUG] Order statuses: {[o['status'] for o in all_orders.data]}")

        # Calculate revenue components
        total_revenue = sum(order["total_amount"] for order in all_orders.data)
        product_revenue = sum(order["subtotal_amount"] for order in all_orders.data)
        shipping_collected = sum(order.get("shipping_amount", 0) for order in all_orders.data)

        # Shipping costs you pay (assuming same as shipping collected for now)
        # In reality, you might pay less or more than what customer pays
        shipping_costs = shipping_collected

        total_orders = len(all_orders.data)

        print(f"[ANALYTICS DEBUG] Total revenue: {total_revenue}, Product revenue: {product_revenue}, Shipping collected: {shipping_collected}")
        print(f"[ANALYTICS DEBUG] Total orders: {total_orders}")

        # This month's revenue (make timezone-aware)
        from datetime import timezone
        first_day_of_month = datetime.now(timezone.utc).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month_orders = [order for order in all_orders.data if datetime.fromisoformat(order["created_at"].replace("Z", "+00:00")) >= first_day_of_month]
        month_revenue = sum(order["total_amount"] for order in this_month_orders)
        month_orders = len(this_month_orders)

        # Revenue by day (last 30 days)
        thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)
        recent_orders = [order for order in all_orders.data if datetime.fromisoformat(order["created_at"].replace("Z", "+00:00")) >= thirty_days_ago]

        # Calculate costs and profit from order items
        # Get all order items with product info
        order_items_response = supabase.table("order_items").select(
            """
            product_name,
            quantity,
            unit_price,
            orders!inner(status)
            """
        ).execute()

        # Filter out items from cancelled/refunded orders and calculate totals
        total_cost = 0
        product_sales = {}

        for item in order_items_response.data:
            # Skip cancelled and refunded orders
            order_status = item.get("orders", {}).get("status")
            if order_status in ["cancelled", "refunded"]:
                continue

            product_name = item["product_name"]
            quantity = item["quantity"]

            # Track product sales for top products
            product_sales[product_name] = product_sales.get(product_name, 0) + quantity

        # Get product costs for profit calculation (COGS - Cost of Goods Sold)
        products_response = supabase.table("products").select("name, unit_cost").execute()
        product_costs = {p["name"]: p.get("unit_cost", 0) for p in products_response.data}

        print(f"[ANALYTICS DEBUG] Product costs: {product_costs}")
        print(f"[ANALYTICS DEBUG] Found {len(order_items_response.data)} order items")

        # Calculate total cost of goods sold (COGS)
        for item in order_items_response.data:
            order_status = item.get("orders", {}).get("status")
            if order_status not in ["cancelled", "refunded"]:
                product_name = item["product_name"]
                quantity = item["quantity"]
                unit_cost = product_costs.get(product_name, 0)
                item_cost = unit_cost * quantity
                total_cost += item_cost
                print(f"[ANALYTICS DEBUG] Item: {product_name}, Qty: {quantity}, Unit Cost: {unit_cost}, Total: {item_cost}")

        print(f"[ANALYTICS DEBUG] Total COGS: {total_cost}")

        # Calculate inventory value (value of stock on hand)
        # This is separate from COGS - it's unit_cost × current stock quantity
        inventory_value = 0
        products_with_variants = supabase.table("products").select(
            "id, name, unit_cost, product_variants(stock_quantity)"
        ).execute()

        for product in products_with_variants.data:
            unit_cost = product.get("unit_cost", 0)
            variants = product.get("product_variants", [])
            total_stock = sum(v["stock_quantity"] for v in variants if v)
            product_inventory_value = unit_cost * total_stock
            inventory_value += product_inventory_value
            print(f"[ANALYTICS DEBUG] Inventory - {product['name']}: {total_stock} units × {unit_cost} = {product_inventory_value}")

        print(f"[ANALYTICS DEBUG] Total inventory value: {inventory_value}")

        # Calculate profit metrics
        # Gross profit = Product revenue - COGS
        gross_profit = product_revenue - total_cost
        gross_margin = (gross_profit / product_revenue * 100) if product_revenue > 0 else 0

        # Net profit = Gross profit - Shipping costs (and other expenses)
        net_profit = gross_profit - shipping_costs
        net_margin = (net_profit / total_revenue * 100) if total_revenue > 0 else 0

        print(f"[ANALYTICS DEBUG] Gross profit: {gross_profit} ({gross_margin:.1f}%), Net profit: {net_profit} ({net_margin:.1f}%)")

        # Overall P&L (including inventory investment)
        # This shows true financial position: have we recovered our inventory costs?
        total_costs_including_inventory = total_cost + shipping_costs + inventory_value
        overall_pl = total_revenue - total_costs_including_inventory
        has_broken_even = overall_pl >= 0

        print(f"[ANALYTICS DEBUG] Overall P&L: {overall_pl} (Break-even: {has_broken_even})")
        print(f"[ANALYTICS DEBUG] Total costs inc. inventory: {total_costs_including_inventory}")

        top_products = sorted(product_sales.items(), key=lambda x: x[1], reverse=True)[:5]

        # Order stats
        order_stats = get_order_stats()

        # Total customers
        customers_count = supabase.table("customers").select("*", count="exact", head=True).execute()

        return {
            # Revenue breakdown
            "total_revenue": total_revenue,
            "product_revenue": product_revenue,
            "shipping_collected": shipping_collected,

            # Cost breakdown
            "cogs": total_cost,  # Cost of Goods Sold
            "shipping_costs": shipping_costs,
            "inventory_value": inventory_value,
            "total_costs_including_inventory": total_costs_including_inventory,

            # Profit metrics
            "gross_profit": gross_profit,
            "gross_margin": round(gross_margin, 2),
            "net_profit": net_profit,
            "net_margin": round(net_margin, 2),

            # Overall P&L (including inventory investment)
            "overall_pl": overall_pl,
            "has_broken_even": has_broken_even,

            # Legacy fields (for backwards compatibility)
            "total_cost": total_cost,
            "total_profit": net_profit,
            "profit_margin": round(net_margin, 2),

            # Order metrics
            "total_orders": total_orders,
            "monthly_revenue": month_revenue,
            "monthly_orders": month_orders,
            "average_order_value": total_revenue // total_orders if total_orders > 0 else 0,
            "total_customers": customers_count.count or 0,
            "top_products": [{"name": name, "quantity": qty} for name, qty in top_products],
            "order_stats": order_stats,
            "recent_orders": recent_orders[:10]  # Last 10 orders for dashboard
        }

    except Exception as e:
        print(f"Error fetching analytics: {e}")
        import traceback
        traceback.print_exc()
        return {
            "total_revenue": 0,
            "product_revenue": 0,
            "shipping_collected": 0,
            "cogs": 0,
            "shipping_costs": 0,
            "inventory_value": 0,
            "total_costs_including_inventory": 0,
            "gross_profit": 0,
            "gross_margin": 0,
            "net_profit": 0,
            "net_margin": 0,
            "overall_pl": 0,
            "has_broken_even": False,
            "total_cost": 0,
            "total_profit": 0,
            "profit_margin": 0,
            "total_orders": 0,
            "monthly_revenue": 0,
            "monthly_orders": 0,
            "average_order_value": 0,
            "total_customers": 0,
            "top_products": [],
            "order_stats": {},
            "recent_orders": []
        }
