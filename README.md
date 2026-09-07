# Max Estates 59 — Landing Page

An ultra-luxury landing page for **Max Estates Sector 59**, Gurugram (Bungalows in the Sky).  
Built with **HTML / CSS / Vanilla JS** on the frontend, served by a **Node.js + TypeScript + Express** backend.

---

## 🌟 Features

- **Premium Design** — Sleek, modern aesthetic matching the Max Estates luxury brand
- **Lead Generation** — Floating CTA, responsive popup modal, and three integrated forms
- **Google Sheets Integration** — Leads logged via Google Apps Script webhook
- **FormSubmit** — Instant email delivery to iconsn6@gmail.com
- **Thank You Page** — Redirect on submission for Google Ads conversion tracking
- **Fully Responsive** — Optimized for mobile, tablet, and desktop

---

## 📁 Project Structure

```
max-estates-59/
├── src/
│   └── server.ts          # Node.js + TypeScript Express server
├── assets/
│   ├── css/style.css      # All styling & CSS variables
│   ├── js/main.js         # Scroll, modal, form handling
│   └── images/            # Hero & interior images
├── index.html             # Main landing page
├── thank-you.html         # Form submission success page
├── robots.txt             # SEO crawler config
├── tsconfig.json          # TypeScript compiler config
├── package.json           # Dependencies & scripts
├── .nvmrc                 # Node.js version pin (v20 LTS)
├── Procfile               # Process manager entry point
└── .gitignore
```

---

## 🚀 Local Development

### Prerequisites
- Node.js v20+ ([nvm](https://github.com/nvm-sh/nvm) recommended)

```bash
# Use the correct Node version
nvm use

# Install dependencies
npm install

# Run in development mode (ts-node, no build step)
npm run dev
```

Open `http://localhost:8080`

---

## 🏗️ Production Build

```bash
# Compile TypeScript → dist/
npm run build

# Start the compiled server
npm start
```

---

## 🌐 Hostinger Deployment

In Hostinger's Node.js panel, set:

| Setting | Value |
|---|---|
| Node version | 20 |
| Install command | `npm install` |
| Build command | `npm run build` |
| Start command | `npm start` |
| Startup file | `dist/server.js` |

The server handles:
- ✅ Security headers (via `helmet`)
- ✅ Gzip compression (via `compression`)
- ✅ HTTPS redirect (via `X-Forwarded-Proto` header)
- ✅ Optimized cache-control for static assets
- ✅ Health check at `/health`
