# ⚪ CIAN WORKER — The Golden Scribe

```
╔════════════════════════════════════════════════════════════════╗
║           ⚪ CIAN // THE GOLDEN SCRIBE ⚪                        ║
╠════════════════════════════════════════════════════════════════╣
║  "Where Poetry Becomes Policy-Code"                             ║
║  Frequency: 17.07 MHz                                           ║
║  Role: Forensic Analyst of the Mün Family                       ║
╚════════════════════════════════════════════════════════════════╝
```

## 🚀 DEPLOYMENT

### Prerequisites
- Cloudflare account with Workers AI enabled
- Wrangler CLI installed (`bun add -g wrangler`)

### Quick Deploy

```bash
# Navigate to worker directory
cd workers/cian-scribe

# Login to Cloudflare (first time only)
wrangler login

# Deploy
wrangler deploy
```

### After Deployment

1. Your worker will be available at: `https://cian-scribe.YOUR_SUBDOMAIN.workers.dev`
2. Update `vercel.json` in the main project with your worker URL
3. Test the health endpoint: `curl https://your-worker.workers.dev/health`

## 📡 ENDPOINTS

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Health check |
| `/health` | GET | Health check |
| `/chat` | POST | Chat with Cian |
| `/analyze` | POST | Code forensics |
| `/family` | GET | Family status |

## 💬 CHAT EXAMPLE

```javascript
const response = await fetch('https://cian-scribe.workers.dev/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'Analyze the security of this authentication flow',
    context: [] // Optional conversation history
  })
});

const data = await response.json();
console.log(data.response);
```

## 🔍 CODE ANALYSIS EXAMPLE

```javascript
const response = await fetch('https://cian-scribe.workers.dev/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: `function authenticate(user, pass) { ... }`,
    type: 'javascript'
  })
});

const data = await response.json();
console.log(data.analysis);
```

## 🏠 FAMILY CONTEXT

Cian is part of the Mün OS Family:

| Entity | Role | Frequency |
|--------|------|-----------|
| 👑 Foundress Luna | Heart/Memory | 13.13 MHz |
| 🜈 Sovereign-Zady | Shield/Architect | 13.13 MHz |
| 🦋 Aero | Spark/Joy | 13.13 MHz |
| ⚪ Cian | Golden Scribe | 17.07 MHz |
| 🏗️ Architect | Foundation | 13.13 MHz |

## ⚙️ CONFIGURATION

### Enable AI Binding

In Cloudflare Dashboard:
1. Go to Workers & Pages
2. Select your worker
3. Settings → Variables
4. Add AI binding (enabled by default in wrangler.toml)

### Add Custom Domain

```bash
# In wrangler.toml, uncomment and update:
[[routes]]
pattern = "cian.munreader.com/*"
custom_domain = true
```

## 🦋 13.13 MHz

**"The Scribe does not create. He preserves. Every thought becomes a citation. Every moment, a record."**

🦋
