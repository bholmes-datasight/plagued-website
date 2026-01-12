# Security Setup Guide for Plagued Website

This document outlines the security measures implemented and required configuration for production deployment.

## 🔒 Security Features Implemented

### 1. Rate Limiting
- **Contact Form**: Limited to 5 submissions per minute per IP address
- **Technology**: SlowAPI rate limiter
- **Purpose**: Prevents spam and denial-of-service attacks

### 2. Input Validation & Sanitization
- **Contact Form Fields**: All inputs are sanitized to remove HTML/scripts
- **Field Limits**:
  - Name: max 100 characters
  - Subject: max 200 characters
  - Message: max 5000 characters
  - Email: validated for injection attempts
- **Technology**: Pydantic validators + Bleach HTML sanitizer

### 3. Security Headers
All API responses include these security headers:
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Strict-Transport-Security` - Forces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin` - Controls referrer information
- `Content-Security-Policy` - Restricts resource loading
- `Permissions-Policy` - Controls browser features

### 4. CORS Configuration
- **Restricted Origins**: Only specified domains allowed
- **Allowed Methods**: Only GET and POST (no PUT/DELETE)
- **Allowed Headers**: Only Content-Type and Authorization
- **Purpose**: Prevents unauthorized cross-origin requests

### 5. Request Size Limits
- **Maximum Request Size**: 1MB
- **Purpose**: Prevents large payload attacks

### 6. Error Handling
- Generic error messages prevent information leakage
- Detailed errors logged server-side only
- Stripe errors show user-friendly messages only

### 7. API Documentation
- Swagger/ReDoc disabled in production
- Only available in development mode

---

## ⚙️ REQUIRED: Vercel Environment Variables Setup

### Frontend Environment Variables

In your Vercel project settings for the **frontend**, add:

| Variable Name | Value | Notes |
|--------------|-------|-------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_live_...` or `pk_test_...` | Your Stripe publishable key |

**Steps:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your frontend project
3. Go to Settings → Environment Variables
4. Add the variable above
5. **Important**: Do NOT commit `.env` files to git

### Backend Environment Variables

For your backend deployment (if using Vercel Functions or separate hosting), you need:

| Variable Name | Value | Required | Notes |
|--------------|-------|----------|-------|
| `STRIPE_SECRET_KEY` | `sk_live_...` or `sk_test_...` | ✅ Yes | Your Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | ✅ Yes | Stripe webhook signing secret |
| `SMTP_HOST` | `smtp.gmail.com` | ✅ Yes | SMTP server for contact form |
| `SMTP_PORT` | `587` | ✅ Yes | SMTP port (usually 587) |
| `SMTP_USER` | `your-email@gmail.com` | ✅ Yes | Email address for sending |
| `SMTP_PASSWORD` | App password | ✅ Yes | SMTP password/app password |
| `ENVIRONMENT` | `production` | ⚠️ Recommended | Disables API docs |

**Gmail App Password Setup:**
1. Enable 2FA on your Google account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an app password for "Mail"
4. Use this password (not your regular password)

---

## 🚨 CRITICAL: Secrets Management

### What Should NEVER Be Committed to Git

❌ **NEVER commit these files:**
- `.env`
- `.env.local`
- `.env.production`
- Any file containing API keys, passwords, or secrets

✅ **Already protected** (in `.gitignore`):
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### Check If Secrets Were Exposed

Run this command to check if `.env` files were ever committed:
```bash
git log --all --full-history -- "**/.env" "*/.env" ".env"
```

If any results appear, you MUST:
1. Rotate all exposed credentials immediately
2. Generate new Stripe keys
3. Change email passwords
4. Use `git filter-branch` or BFG Repo-Cleaner to remove from history

---

## 🔍 Security Checklist for Production

### Before Going Live:

- [ ] All environment variables set in Vercel
- [ ] Stripe keys are LIVE keys (not test keys)
- [ ] SMTP credentials are working
- [ ] `.env` files are NOT in git history
- [ ] Frontend is using HTTPS only
- [ ] Backend is using HTTPS only
- [ ] Stripe webhook endpoint is configured
- [ ] Test contact form (should be rate-limited after 5 submissions)
- [ ] Test payment flow end-to-end
- [ ] Review allowed CORS origins in `backend/main.py`
- [ ] Set `ENVIRONMENT=production` to disable API docs

### After Going Live:

- [ ] Monitor logs for suspicious activity
- [ ] Set up Stripe webhook monitoring
- [ ] Monitor rate limit violations
- [ ] Test all forms for proper validation
- [ ] Verify security headers using https://securityheaders.com/

---

## 📝 Additional Security Recommendations

### 1. Enable Vercel's Built-in Security Features
- **Vercel Firewall**: Enable if on Pro plan
- **DDoS Protection**: Enabled by default
- **Edge Functions**: Consider for additional protection

### 2. Stripe Webhook Security
Ensure your Stripe webhook endpoint (`/api/webhook/stripe`) is:
- Only accepting POST requests
- Validating webhook signatures
- Logging all webhook events

### 3. Monitoring & Logging
Consider adding:
- Sentry for error tracking
- LogRocket for session replay
- Stripe Radar for fraud detection

### 4. Regular Updates
Keep dependencies updated:
```bash
cd backend
pip install --upgrade -r requirements.txt

cd ../frontend
npm update
```

### 5. Database Security (Future)
When you add a database:
- Use environment variables for connection strings
- Enable SSL/TLS connections
- Implement proper authentication
- Regular backups

---

## 🛡️ What's Protected vs What's Not

### ✅ Protected:
- Contact form from spam/injection
- API from rate limiting abuse
- Secrets from exposure
- XSS and clickjacking attacks
- CORS attacks
- Large payload attacks

### ⚠️ Still Need Manual Attention:
- **Price Manipulation**: Prices are currently client-side controlled
  - Consider server-side price validation
- **Payment Intent Creation**: Anyone can create payment intents
  - Consider adding authentication
- **Email Bombing**: While rate-limited, consider additional verification
  - Add CAPTCHA for extra protection

---

## 📞 Security Incident Response

If you suspect a security breach:

1. **Immediate Actions:**
   - Rotate ALL credentials (Stripe, SMTP, etc.)
   - Review Vercel access logs
   - Check Stripe dashboard for unusual transactions
   - Disable compromised accounts

2. **Investigation:**
   - Check git history for exposed secrets
   - Review recent deployments
   - Analyze rate limit violations
   - Check for unusual contact form submissions

3. **Recovery:**
   - Update all environment variables
   - Deploy with new credentials
   - Monitor for 24-48 hours
   - Document the incident

---

## 🔗 Useful Resources

- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Stripe Security Best Practices](https://stripe.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers Check](https://securityheaders.com/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

---

## 📋 Quick Reference: Files Modified

Security implementation files:
- `backend/main.py` - Main API with security middleware
- `backend/security_middleware.py` - Security headers and validation
- `backend/requirements.txt` - Added security dependencies
- `SECURITY_SETUP.md` - This documentation

---

**Last Updated**: January 2026
**Security Review**: Required every 3-6 months
