# Digital Bookstore

A professional, responsive React bookstore application powered by the Google Books API. Search millions of books, build a cart, and receive download links via email — all wrapped in a refined dark-library aesthetic.

---

## Features

- **Live Book Search** — Real-time search via the Google Books API with keyboard support (Enter to search)
- **Smart Cart** — Add books with visual feedback; cart persists across sessions via `localStorage`
- **Email Delivery** — Checkout sends book preview/download links directly to your inbox via EmailJS
- **PDF Availability Check** — Automatically fetches Google Books links for titles without direct PDFs, with a user-confirmation step before sending
- **Fully Responsive** — Optimised for mobile, tablet, and desktop with a collapsible hamburger navigation
- **Accessible UI** — ARIA labels, keyboard navigation, focus states, and semantic HTML throughout

---

## Getting Started

### Prerequisites
- Node.js ≥ 16
- npm ≥ 8

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd folio-bookstore

# Install dependencies
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The page hot-reloads on file changes.

### Production Build

```bash
npm run build
```

Outputs an optimised production bundle to the `build/` folder.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Create React App) |
| Routing | React Router v6 |
| Book Data | Google Books API (free, no key required) |
| Email | EmailJS (`emailjs-com`) |
| Persistence | `localStorage` |
| Fonts | Google Fonts (Playfair Display, Crimson Pro) |
| Styling | Plain CSS with CSS custom properties |

---

## Project Structure

```
src/
├── App.js                  # Root app, routing
├── index.js                # React entry point
├── index.css               # Global tokens, resets, scrollbar
├── App.css                 # Minimal overrides
├── components/
│   ├── Navbar.js           # Sticky navigation with mobile menu
│   ├── HomePage.js         # Search, results grid, toast notifications
│   ├── CartPage.js         # Cart list with remove functionality
│   └── CheckoutPage.js     # Email delivery with PDF availability check
└── styles/
    ├── navbar.css
    ├── home.css
    ├── cart.css
    └── checkout.css
```

---

## EmailJS Configuration

The checkout uses EmailJS to send book links. The credentials are pre-configured in `CheckoutPage.js`:

```js
emailjs.send(
  "service_zxeryon",      // Service ID
  "template_m5k5p8s",     // Template ID
  { to_email, books, download_link },
  "3XYNWB0B3lELZA4_a"    // Public Key
)
```

To use your own EmailJS account:
1. Sign up at [emailjs.com](https://www.emailjs.com)
2. Create an email service and template
3. Replace the IDs and public key above

Your template should include these variables:
- `{{to_email}}` — recipient address
- `{{books}}` — comma-separated book titles
- `{{download_link}}` — newline-separated title: link pairs

---

## Application Flow

```
Home (Search)
    │
    ▼
Add to Cart ──→ localStorage persists cart
    │
    ▼
Cart Page ──→ Review, remove items
    │
    ▼
Checkout Page
    │
    ├── Enter email
    ├── Fetch PDF / Google Books links
    ├── If some PDFs unavailable → Confirmation dialog
    └── Send email via EmailJS → Clear cart
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm start` | Start development server on port 3000 |
| `npm test` | Run tests in interactive watch mode |
| `npm run build` | Create optimised production build |
| `npm run eject` | Eject from Create React App (irreversible) |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---
