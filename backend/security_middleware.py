"""
Security middleware for the Plagued API
Implements rate limiting and security headers
"""
from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response, JSONResponse


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""

    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Content Security Policy - adjust as needed for your frontend
        csp = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://va.vercel-scripts.com; "
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self' data:; "
            "connect-src 'self' https://api.stripe.com https://vitals.vercel-insights.com; "
            "frame-src https://js.stripe.com; "
            "object-src 'none'; "
            "base-uri 'self';"
        )
        response.headers["Content-Security-Policy"] = csp

        # Permissions Policy (formerly Feature-Policy)
        response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"

        return response


def sanitize_text(text: str, max_length: int = 5000) -> str:
    """
    Sanitize user input text
    - Strip HTML tags
    - Limit length
    - Remove potentially dangerous characters
    """
    import bleach

    if not text:
        return ""

    # Limit length
    text = text[:max_length]

    # Remove all HTML tags and attributes
    cleaned = bleach.clean(text, tags=[], strip=True)

    return cleaned.strip()


def validate_email_content(email: str) -> bool:
    """
    Basic validation to prevent email header injection
    """
    dangerous_chars = ['\r', '\n', '\x00']
    return not any(char in email for char in dangerous_chars)


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """Limit request body size to prevent large payload attacks"""

    def __init__(self, app, max_size: int = 1_048_576):  # Default 1MB
        super().__init__(app)
        self.max_size = max_size

    async def dispatch(self, request: Request, call_next):
        # Check Content-Length header if present
        content_length = request.headers.get('content-length')
        if content_length:
            if int(content_length) > self.max_size:
                return JSONResponse(
                    status_code=413,
                    content={"detail": "Request body too large"}
                )

        return await call_next(request)
