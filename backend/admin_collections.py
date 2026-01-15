"""
Admin collections management
"""
from typing import List, Dict, Optional
from datetime import datetime
from supabase_client import supabase


def get_all_collections() -> List[Dict]:
    """
    Get all collections with product count.
    """
    try:
        # Fetch all collections
        collections_response = supabase.table("collections").select("*").order("created_at", desc=True).execute()
        collections = collections_response.data

        # For each collection, get product count
        result = []
        for collection in collections:
            # Count products in this collection
            products_response = supabase.table("collection_products").select("product_id", count="exact").eq("collection_id", collection["id"]).execute()
            product_count = products_response.count or 0

            result.append({
                **collection,
                "product_count": product_count
            })

        return result

    except Exception as e:
        print(f"Error fetching collections: {e}")
        raise


def get_collection_details(collection_id: str) -> Optional[Dict]:
    """
    Get collection with all its products.
    """
    try:
        # Fetch collection
        collection_response = supabase.table("collections").select("*").eq("id", collection_id).single().execute()
        collection = collection_response.data

        # Fetch products in this collection
        products_response = supabase.table("collection_products").select(
            """
            product_id,
            added_at,
            products (
                id,
                name,
                description,
                base_price,
                product_type,
                colour,
                image_url,
                is_active
            )
            """
        ).eq("collection_id", collection_id).execute()

        # Extract product data
        products = []
        for item in products_response.data:
            if item.get("products"):
                products.append({
                    **item["products"],
                    "added_at": item["added_at"]
                })

        return {
            **collection,
            "products": products
        }

    except Exception as e:
        print(f"Error fetching collection details: {e}")
        return None


def create_collection(name: str, description: str = "") -> Optional[Dict]:
    """
    Create a new collection.
    """
    try:
        collection_data = {
            "name": name,
            "description": description,
            "is_dropped": False
        }

        response = supabase.table("collections").insert(collection_data).execute()
        return response.data[0] if response.data else None

    except Exception as e:
        print(f"Error creating collection: {e}")
        raise


def update_collection(collection_id: str, name: str = None, description: str = None) -> bool:
    """
    Update collection details.
    """
    try:
        update_data = {}
        if name is not None:
            update_data["name"] = name
        if description is not None:
            update_data["description"] = description

        if update_data:
            supabase.table("collections").update(update_data).eq("id", collection_id).execute()
        return True

    except Exception as e:
        print(f"Error updating collection: {e}")
        return False


def delete_collection(collection_id: str) -> bool:
    """
    Delete a collection. Products in the collection are NOT deleted.
    """
    try:
        supabase.table("collections").delete().eq("id", collection_id).execute()
        return True

    except Exception as e:
        print(f"Error deleting collection: {e}")
        raise


def add_products_to_collection(collection_id: str, product_ids: List[str]) -> bool:
    """
    Add multiple products to a collection.
    """
    try:
        # Build insert data
        inserts = [
            {
                "collection_id": collection_id,
                "product_id": product_id
            }
            for product_id in product_ids
        ]

        # Insert (will ignore duplicates due to PRIMARY KEY constraint)
        supabase.table("collection_products").insert(inserts).execute()
        return True

    except Exception as e:
        print(f"Error adding products to collection: {e}")
        raise


def remove_product_from_collection(collection_id: str, product_id: str) -> bool:
    """
    Remove a product from a collection.
    """
    try:
        supabase.table("collection_products").delete().eq("collection_id", collection_id).eq("product_id", product_id).execute()
        return True

    except Exception as e:
        print(f"Error removing product from collection: {e}")
        return False


def drop_collection(collection_id: str) -> bool:
    """
    "Drop" a collection - mark it as dropped and set all products to active.
    """
    try:
        # Get all products in the collection
        products_response = supabase.table("collection_products").select("product_id").eq("collection_id", collection_id).execute()
        product_ids = [item["product_id"] for item in products_response.data]

        if product_ids:
            # Set all products to active using in_ filter for bulk update
            supabase.table("products").update({"is_active": True}).in_("id", product_ids).execute()

        # Mark collection as dropped
        supabase.table("collections").update({
            "is_dropped": True,
            "dropped_at": datetime.utcnow().isoformat()
        }).eq("id", collection_id).execute()

        return True

    except Exception as e:
        # Silent error - just return False
        return False


def undrop_collection(collection_id: str) -> bool:
    """
    "Undrop" a collection - mark it as not dropped and set all products to inactive.
    """
    try:
        # Get all products in the collection
        products_response = supabase.table("collection_products").select("product_id").eq("collection_id", collection_id).execute()
        product_ids = [item["product_id"] for item in products_response.data]

        if product_ids:
            # Set all products to inactive using in_ filter for bulk update
            supabase.table("products").update({"is_active": False}).in_("id", product_ids).execute()

        # Mark collection as not dropped
        supabase.table("collections").update({
            "is_dropped": False,
            "dropped_at": None
        }).eq("id", collection_id).execute()

        return True

    except Exception as e:
        # Silent error - just return False
        return False
