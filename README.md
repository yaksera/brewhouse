# Brew House Kathmandu

Website for **Brew House Kathmandu**, a cozy café in Patan, Lalitpur: good coffee, good food, good moments.

| Layer    | Stack                                                                                    |
| -------- | ---------------------------------------------------------------------------------------- |
| Frontend | Next.js 16 (App Router, Cache Components), React 19, Tailwind CSS v4, GSAP 3 (ScrollTrigger, Flip) |
| Backend  | Django 6, Django REST Framework, django-cors-headers, SQLite                              |

```
brewhouse/
├── backend/    Django + DRF API: menu, table reservations (with pre-orders), contact messages
└── frontend/   Next.js site with GSAP animations
```

## Getting started

### 1. Backend (port 8000)

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate        # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate      # also seeds the menu (4 categories, 16 items)
python manage.py createsuperuser   # optional, for /admin
python manage.py runserver
```

### 2. Frontend (port 3000)

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. If the API is down the page still renders from a bundled copy of the seed menu; reservations and messages need the API.

## Features

- **Menu**: filter by *Most Popular*, *Beverage*, *Breakfast*, *Main Course* or *Desserts*. Prices, badges and availability come from the API and can be edited in the Django admin.
- **Tray and pre-order**: tap **+** on any dish to add it to a tray. A floating button shows the count and total and opens the reservation form, so guests can book and pre-order in one go.
- **Table reservations**: date (today up to 60 days ahead), half-hour seatings from 7:30 AM to 8:30 PM, 1–20 guests and notes. Same-day bookings need 30 minutes' lead time.
- **Contact form**: the "Send a Message" form saves to the admin inbox.
- **Gallery**: bento grid with a keyboard-navigable lightbox.

## API

Base URL: `http://127.0.0.1:8000/api`

| Method | Endpoint          | Description                                                                 |
| ------ | ----------------- | --------------------------------------------------------------------------- |
| GET    | `/menu/`          | Categories and available menu items                                         |
| POST   | `/reservations/`  | `full_name`, `email`, `phone`, `date`, `time`, `party_size`, `notes?`, `pre_order?: [{item, quantity}]` |
| POST   | `/contact/`       | `name`, `email`, `message`                                                  |
| GET    | `/health/`        | Health check                                                                |

- Reservations are validated server-side: no past dates, at most 60 days ahead, seating hours only, and 30 minutes' lead time for same-day bookings.
- Pre-orders only accept available items. Duplicate items are merged, and each line stores the price at the time of booking.
- Emails are lower-cased and phone numbers normalised (spaces, dashes and brackets removed).
- POST endpoints are throttled to 10 requests/hour per IP.
- Admin (`/admin/`): manage the menu; confirm or cancel reservations with their pre-orders shown inline; read messages.

Run backend tests with `python manage.py test`.

## Animations

All motion uses GSAP inside `gsap.matchMedia()`, so it switches off when the user has `prefers-reduced-motion` set.

- **Hero**: Ken Burns zoom and scroll parallax on the photo, word-by-word headline reveal, a divider that draws in, staggered highlight chips.
- **Our Story**: photo wipe reveal, a hand-drawn swirl that draws itself, drifting coffee beans and a swaying leaf sprig.
- **Menu**: GSAP Flip re-flows the cards when you change category; the **+** button spins on add.
- **Gallery**: staggered clip-path tile reveals and an animated lightbox.
- **Contact**: photo wipe with parallax and a form card that slides in.
- **Navbar**: an underline that follows the section in view.

## Environment variables

**backend/.env**: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (see `.env.example`).

**frontend/.env.local**: `API_URL` (server-side fetches) and `NEXT_PUBLIC_API_URL` (browser form posts). Both default to `http://127.0.0.1:8000/api`.
