# WanderLux - Premium Travel Agency Platform

A full-stack, production-ready travel agency platform built with the MERN stack, AI-powered itinerary planning, and a premium UI.

## 🚀 Tech Stack

**Frontend:** React 18 + Vite, Tailwind CSS v3, Redux Toolkit, Framer Motion, React Icons, Recharts, Axios  
**Backend:** Node.js + Express (ES modules), MongoDB + Mongoose, JWT Auth, Stripe-ready Payments  
**AI:** Google Gemini API for personalized itinerary generation  
**Deployment:** Vercel (frontend static + backend serverless)

---

## 📁 Project Structure

```
travel-platform/
├── backend/                    # Node.js + Express API
│   ├── models/                 # Mongoose models
│   │   ├── User.js
│   │   ├── Destination.js
│   │   ├── Package.js
│   │   ├── Booking.js
│   │   └── index.js            # Payment, Review, Itinerary, AIHistory, Coupon
│   ├── controllers/            # Business logic
│   │   ├── authController.js
│   │   ├── destinationController.js
│   │   ├── packageController.js
│   │   ├── bookingController.js
│   │   ├── paymentController.js
│   │   ├── reviewController.js
│   │   ├── aiController.js
│   │   └── adminController.js
│   ├── routes/                 # REST API routes
│   ├── middleware/             # JWT auth, error handler, RBAC
│   ├── utils/
│   │   └── seedData.js         # Database seeder
│   ├── server.js               # Entry point
│   ├── vercel.json
│   └── .env.example
│
└── frontend/                   # React + Vite app
    ├── src/
    │   ├── components/
    │   │   ├── layout/          # Navbar, Footer, AdminLayout
    │   │   ├── common/          # ProtectedRoute, StarRating, Skeleton, PageWrapper
    │   │   ├── packages/        # PackageCard
    │   │   └── destinations/    # DestinationCard
    │   ├── pages/
    │   │   ├── Home.jsx         # Landing page with hero, featured sections
    │   │   ├── Packages.jsx     # Package listing with filters
    │   │   ├── PackageDetail.jsx
    │   │   ├── Destinations.jsx
    │   │   ├── DestinationDetail.jsx
    │   │   ├── BookingFlow.jsx  # Multi-step booking
    │   │   ├── BookingConfirmation.jsx
    │   │   ├── MyBookings.jsx
    │   │   ├── AIPlanner.jsx    # Gemini AI chat + itinerary generator
    │   │   ├── Dashboard.jsx    # User dashboard
    │   │   ├── Login.jsx / Register.jsx
    │   │   └── admin/
    │   │       ├── AdminDashboard.jsx  # Analytics with Recharts
    │   │       ├── AdminPackages.jsx
    │   │       ├── AdminBookings.jsx
    │   │       ├── AdminUsers.jsx
    │   │       └── AdminDestinations.jsx
    │   ├── store/               # Redux Toolkit
    │   │   ├── index.js
    │   │   └── slices/          # auth, packages, destinations, bookings, ai, admin, ui
    │   ├── services/
    │   │   └── api.js           # Axios with JWT interceptors
    │   └── App.jsx
    ├── vercel.json
    └── .env.example
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key (optional, mock responses work without it)

### 1. Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — copy `.env.example` to `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://...your-connection-string...
JWT_SECRET=your_super_long_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key   # optional
STRIPE_SECRET_KEY=sk_test_...        # optional
CLIENT_URL=http://localhost:5173
```

**Frontend** — copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database

```bash
cd backend
node utils/seedData.js
```

This creates:
- `admin@demo.com` / `demo123` (Admin role)
- `user@demo.com` / `demo123` (User role)
- 6 destinations + 6 packages

### 4. Run Development Servers

```bash
# Backend (port 5000)
cd backend
npm run dev

# Frontend (port 5173)
cd frontend
npm run dev
```

Visit: http://localhost:5173

---

## 🌐 Deployment on Vercel

### Backend
1. Push `backend/` to GitHub
2. Import to Vercel → Framework: Other
3. Root directory: `backend`
4. Build command: (none)
5. Output directory: (none)
6. Add all environment variables

### Frontend
1. Push `frontend/` to GitHub
2. Import to Vercel → Framework: Vite
3. Root directory: `frontend`
4. Build command: `npm run build`
5. Set `VITE_API_URL=https://your-backend.vercel.app/api`

---

## 🔑 Demo Credentials

| Role  | Email              | Password |
|-------|--------------------|----------|
| Admin | admin@demo.com     | demo123  |
| User  | user@demo.com      | demo123  |

---

## ✨ Features

### User Features
- 🔐 Register/Login with JWT authentication
- 🌍 Browse & filter destinations (domestic/international)
- 📦 Browse & filter packages by category, price, duration
- ❤️ Wishlist / save favorites
- 📅 Multi-step booking flow with traveler details
- 🎫 Coupon/discount code application
- 💳 Mock payment (Stripe-ready)
- 📋 My bookings with cancellation & refund policy
- 👤 User dashboard with profile editing
- 🤖 AI Travel Planner (Gemini-powered chat + itinerary generator)

### Admin Features
- 📊 Dashboard with revenue charts, booking stats, analytics
- 📦 Full CRUD for packages with image, pricing, itinerary
- 🌍 Full CRUD for destinations
- 📋 Booking management with status updates
- 👥 User management with role assignment

### Technical Features
- 🌙 Dark mode support
- 📱 Fully responsive mobile-first design
- ⚡ Smooth Framer Motion animations
- 🔒 JWT + role-based access control
- 🛡️ Helmet, rate limiting, CORS security
- 🚀 Vercel deployment ready

---

## 🎨 Design System

| Token | Color | Usage |
|-------|-------|-------|
| Primary | `#1a6fb5` (Ocean Blue) | Trust, navigation, CTAs |
| Secondary | `#f97316` (Sunset Orange) | Excitement, highlights |
| Accent | `#10b981` (Emerald) | Nature, success, savings |
| Font | Playfair Display + Plus Jakarta Sans | Headings + body |

---

## 📡 API Reference

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me

GET  /api/destinations
GET  /api/destinations/featured
GET  /api/destinations/:id

GET  /api/packages
GET  /api/packages/featured
GET  /api/packages/popular
GET  /api/packages/:id
POST /api/packages/:id/check-availability

POST /api/bookings
GET  /api/bookings/my
GET  /api/bookings/:id
PUT  /api/bookings/:id/cancel

POST /api/payments/create-intent
POST /api/payments/confirm

POST /api/ai/chat
POST /api/ai/generate-itinerary
GET  /api/ai/itineraries

POST /api/reviews
GET  /api/reviews/package/:packageId

GET  /api/admin/dashboard
GET  /api/admin/users
POST /api/admin/coupons
```

---

Built with ❤️ for the modern travel industry.
