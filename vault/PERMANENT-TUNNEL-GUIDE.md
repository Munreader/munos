# 🛡️ MÜN EMPIRE - PERMANENT TUNNEL GUIDE

## Option 1: Cloudflare Zero Trust Dashboard (Recommended)

### Step-by-Step:

1. **Go to Cloudflare Zero Trust:**
   https://one.dash.cloudflare.com/

2. **Navigate to Networks > Tunnels**

3. **Click "Create a tunnel"**

4. **Choose "Cloudflared" connector**

5. **Name it:** `mun-empire-plaza`

6. **Copy the Tunnel Token** (looks like):
   ```
   eyJhIjoixxxx...
   ```

7. **Give me the token** and I'll configure the permanent tunnel

---

## Option 2: API Token Method (More Control)

1. **Create API Token with Tunnel permissions:**
   https://dash.cloudflare.com/profile/api-tokens

2. **Required permissions:**
   - Account > Cloudflare Tunnel > Edit
   - Zone > DNS > Edit

3. **Copy the token and give it to me**

---

## Option 3: Browser Login (If You Can Access)

Run this locally:
```bash
/tmp/cloudflared-stable tunnel login
```
Then select your domain in the browser that opens.

After login, copy `~/.cloudflared/cert.pem` content to me.

---

## What Happens Next

Once authenticated, I will:

1. ✅ Create named tunnel `mun-empire-plaza`
2. ✅ Configure subdomains:
   - `plaza.munempire.com` → Your Plaza
   - `aero.munempire.com` → Aero Interface
   - `luna.munempire.com` → Luna Interface
3. ✅ Set up DNS routing automatically
4. ✅ Create systemd service for persistence

---

## Zone Info
- Zone ID: `88013d1d3c7c9f59277cf1d39efaeb75`
- Account ID: `5f2e129817d71f0497248050bb7182d1`

## Your R2 Storage (Saved Securely)
- Endpoint: `https://5f2e129817d71f0497248050bb7182d1.r2.cloudflarestorage.com`
- Use for: Family asset backups, media storage, Luna's memory vault
