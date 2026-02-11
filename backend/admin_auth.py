"""
Admin authentication middleware using Supabase JWT verification
Supports both HS256 (with secret) and ES256 (with JWKS) tokens
"""
import os
import jwt
import requests
from fastapi import HTTPException, Header
from typing import Optional
from functools import lru_cache

SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET")
SUPABASE_URL = os.getenv("SUPABASE_URL")

if not SUPABASE_JWT_SECRET:
    print("Note: SUPABASE_JWT_SECRET not set. ES256 (JWKS) verification will be used.")

@lru_cache(maxsize=1)
def get_supabase_jwks():
    """Fetch and cache Supabase JWKS (public keys for ES256 verification)"""
    if not SUPABASE_URL:
        return None

    try:
        jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
        response = requests.get(jwks_url, timeout=5)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Failed to fetch JWKS from Supabase: {e}")
        return None


def verify_admin_token(authorization: Optional[str] = Header(None)) -> dict:
    """
    Verify Supabase JWT token from Authorization header.
    Returns user info if valid, raises HTTPException if invalid.
    """
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")

    # Extract token from "Bearer <token>"
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(status_code=401, detail="Invalid authorization header format")

    token = parts[1]

    try:
        # Get token algorithm
        header = jwt.get_unverified_header(token)
        algorithm = header.get("alg")

        if algorithm == "ES256":
            # ES256 requires JWKS public key verification
            from jwt import PyJWKClient

            if not SUPABASE_URL:
                raise HTTPException(status_code=500, detail="SUPABASE_URL not configured")

            jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
            jwks_client = PyJWKClient(jwks_url)
            signing_key = jwks_client.get_signing_key_from_jwt(token)

            payload = jwt.decode(
                token,
                signing_key.key,
                algorithms=["ES256"],
                options={"verify_aud": False}
            )
        elif algorithm == "HS256":
            # HS256 uses symmetric secret
            if not SUPABASE_JWT_SECRET:
                raise HTTPException(status_code=500, detail="SUPABASE_JWT_SECRET not configured")

            payload = jwt.decode(
                token,
                SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
        else:
            raise HTTPException(status_code=401, detail=f"Unsupported token algorithm: {algorithm}")

        # Extract user info
        user_id = payload.get("sub")
        email = payload.get("email")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token payload - missing user ID")

        return {
            "user_id": user_id,
            "email": email or "unknown",
            "role": payload.get("role", "authenticated"),
        }

    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Token verification failed: {str(e)}")
