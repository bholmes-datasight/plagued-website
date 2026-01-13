# Email & Mailing List Setup Guide

Complete guide to setting up custom email domain, contact forms, and mailing list for plagueduk.com

---

## Overview

Your website now uses:
1. **Resend** - For sending contact form emails from contact@plagueduk.com
2. **Mailjet** - For newsletter/mailing list management
3. **Cloudflare Email Routing** (optional) - For receiving emails at custom domain

---

## Part 1: Resend Setup (Contact Form)

### Step 1: Create Resend Account
1. Go to https://resend.com/signup
2. Sign up with your email
3. Verify your email address

### Step 2: Add Your Domain
1. Log into Resend dashboard
2. Go to **Domains** → **Add Domain**
3. Enter: `plagueduk.com`
4. Click **Add**

### Step 3: Configure DNS Records
Resend will show you DNS records to add. Go to your domain provider (Vercel DNS):

**Add these DNS records in Vercel:**

1. **SPF Record** (TXT):
   - Type: `TXT`
   - Name: `@` or `plagueduk.com`
   - Value: (Resend will provide, looks like: `v=spf1 include:_spf.resend.com ~all`)

2. **DKIM Record** (TXT):
   - Type: `TXT`
   - Name: (Resend will provide, looks like: `resend._domainkey`)
   - Value: (Resend will provide, long string)

3. **DMARC Record** (TXT):
   - Type: `TXT`
   - Name: `_dmarc`
   - Value: `v=DMARC1; p=none; rua=mailto:plagueduk@gmail.com`

**How to add DNS records in Vercel:**
1. Go to Vercel dashboard → Your project
2. Settings → Domains → plagueduk.com → DNS Records
3. Click **Add** for each record above
4. Wait 10-60 minutes for DNS propagation

### Step 4: Verify Domain in Resend
1. Back in Resend dashboard, click **Verify** next to your domain
2. Resend will check DNS records (may take a few minutes)
3. Once verified, you'll see a green checkmark ✓

### Step 5: Get API Key
1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it: "Plagued Website"
4. Permission: **Sending access**
5. Copy the API key (starts with `re_`)

### Step 6: Add to Backend .env
Update `backend/.env`:
```env
RESEND_API_KEY=re_your_actual_key_here
FROM_EMAIL=contact@plagueduk.com
CONTACT_EMAIL=plagueduk@gmail.com
```

### Step 7: Restart Backend
Stop and restart your backend server to load the new environment variables.

---

## Part 2: Mailjet Setup (Mailing List)

### Step 1: Create Mailjet Account
1. Go to https://app.mailjet.com/signup
2. Sign up (Free plan: 1,000 contacts, 6,000 emails/month - BETTER than Mailchimp!)
3. Verify your email address
4. Complete account setup

### Step 2: Get API Keys
1. In Mailjet dashboard, click your name (top right)
2. Go to **Account Settings** → **REST API** → **API Key Management (Primary and Sub-account)**
3. You'll see:
   - **API Key** (public key)
   - **Secret Key** (private key)
4. Copy both keys

### Step 3: Create Contact List
1. In Mailjet dashboard, go to **Contacts** (left sidebar)
2. Click **Contact Lists**
3. Click **Create a new list**
4. Enter:
   - **List Name**: "Plagued Fans"
   - **Description**: "Newsletter subscribers from plagueduk.com"
5. Click **Create**

### Step 4: Get List ID
1. You should see your new list
2. Click on "Plagued Fans" list
3. Look at the URL in your browser: `https://app.mailjet.com/contacts/lists/detail/XXXXXX`
4. The **XXXXXX** number is your List ID
5. Copy this number (it will be something like `123456`)

### Step 5: Add to Backend .env
Update `backend/.env`:
```env
MAILJET_API_KEY=your_mailjet_api_key_here
MAILJET_SECRET_KEY=your_mailjet_secret_key_here
MAILJET_LIST_ID=123456
```

### Step 6: Restart Backend
Stop and restart your backend server.

---

## Part 3: Cloudflare Email Routing (Optional - Receive Emails)

This lets you receive emails at `contact@plagueduk.com` and forward them to `plagueduk@gmail.com`

### Step 1: Add Domain to Cloudflare
1. Go to https://dash.cloudflare.com
2. Sign up/login
3. **Add a Site** → Enter `plagueduk.com`
4. Select **Free Plan**
5. Follow instructions to change nameservers at your domain registrar

**OR if you want to keep Vercel DNS:**
- You can skip Cloudflare and just use Resend's receiving features (paid)
- Or manually set up forwarding with your domain provider

---

## Part 4: Testing

### Test Contact Form
1. Go to `http://localhost:5173/contact`
2. Fill out and submit the form
3. Check `plagueduk@gmail.com` for the email
4. Email should be FROM: `contact@plagueduk.com`

### Test Mailing List
1. Browse your site for 10 seconds or scroll down
2. The mailing list popup should appear
3. Enter an email and submit
4. Check Mailjet dashboard → **Contacts** → **Contact Lists** → "Plagued Fans" → You should see the new contact

---

## Part 5: Production Deployment

### Update Vercel Environment Variables
When deploying to production, add these to Vercel:

1. Go to Vercel Dashboard → Your project → **Settings** → **Environment Variables**
2. Add:
   - `RESEND_API_KEY` = your Resend key
   - `FROM_EMAIL` = contact@plagueduk.com
   - `CONTACT_EMAIL` = plagueduk@gmail.com
   - `MAILJET_API_KEY` = your Mailjet API key
   - `MAILJET_SECRET_KEY` = your Mailjet secret key
   - `MAILJET_LIST_ID` = your list ID

3. **Redeploy** your site for changes to take effect

---

## Costs Summary

| Service | Free Tier | What You Get |
|---------|-----------|--------------|
| **Resend** | 3,000 emails/month | More than enough for contact forms |
| **Mailjet** | 1,000 contacts, 6,000 emails/month | 2x better than Mailchimp! |
| **Cloudflare** | 100% Free Forever | Email routing |
| **Total** | **$0/month** | Professional email setup! |

---

## Troubleshooting

### Contact form not sending
- Check backend logs for errors
- Verify Resend API key is correct
- Make sure domain is verified in Resend
- Check DNS records are propagated (use https://dnschecker.org)

### Mailing list not working
- Check backend logs
- Verify Mailjet API key, Secret key, and List ID
- Make sure List ID is just the number (no quotes or extra characters)

### Emails going to spam
- Make sure DNS records (SPF, DKIM, DMARC) are set up
- It may take a few days for email reputation to build
- Ask recipients to mark as "Not Spam"

---

## Support Links

- Resend Docs: https://resend.com/docs
- Mailjet API Docs: https://dev.mailjet.com/
- Cloudflare Email Routing: https://developers.cloudflare.com/email-routing/

---

**Need help?** Check backend logs or contact support at the respective services.
