# 🏝️ Zain's Serenity — Luxury Coastal Retreat

### A full-stack luxury resort website built with Next.js 16, MongoDB, and modern web technologies

---

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.3.1-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.9.2-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=for-the-badge&logo=vercel&logoColor=white)](https://zainserenity.vercel.app)

**Live Website:** [zainserenity.vercel.app](https://zainserenity.vercel.app)

</div>

---

## 📸 Screenshots

<div align="center">

| | |
|:---:|:---:|
| **Hero Section** | **Featured Rooms** |
| ![Hero](public/images/screenshots/hero-loading.png) | ![Featured Rooms](public/images/screenshots/our-featured-room.png) |
| **Rooms Page** | **Room Detail** |
| ![Rooms](public/images/screenshots/rooms-page.png) | ![Room Management](public/images/screenshots/room-management.png) |
| **Admin Dashboard** | **Admin Bookings** |
| ![Dashboard](public/images/screenshots/admin-dashboard.png) | ![Bookings](public/images/screenshots/admin-booking.png) |
| **Gallery Management** | **User Management** |
| ![Gallery](public/images/screenshots/admin-gallery.png) | ![Users](public/images/screenshots/admin-users.png) |
| **Booking Email** | **Guest Review** |
| ![Email](public/images/screenshots/booking-email.png) | ![Review](public/images/screenshots/guest-review.png) |
| **My Bookings** | **Why Choose Us** |
| ![My Bookings](public/images/screenshots/my-booking.png) | ![Why Us](public/images/screenshots/why-choose-us.png) |
| **GA4 Tracking** | **Contact Form** |
| ![GA4](public/images/screenshots/GA4-tracking-dashboard.png) | ![Contact](public/images/screenshots/contact-form.png) |
| **Gallery Page** | **Add Room** |
| ![Gallery](public/images/screenshots/gallery.png) | ![Add Room](public/images/screenshots/admin-add-room.png) |

</div>

---

## ✨ Overview

**Zain's Serenity** is a complete luxury coastal retreat website that offers a seamless booking experience for guests while providing a powerful admin dashboard for managing rooms, bookings, users, gallery images, and analytics. Built with cutting-edge technologies, the website delivers a premium user experience with smooth animations, 3D room tours, and real-time availability management.

The project represents the vision of **Zain Shah** — a sanctuary where nature, culture, and luxury coexist. From the initial discovery of Crystal Cove in 2009 to a world-class resort recognized among the **Top 10 Luxury Resorts Worldwide** in 2025, this digital platform brings that dream to life.

---

## 🌟 Key Features

### 🏨 Guest Features

| Feature | Description |
|---------|-------------|
| **Dynamic Room Catalog** | Browse rooms with pagination, featured badges, ratings, and real-time availability filters |
| **Advanced Search** | Search by check-in/check-out dates with automatic availability filtering |
| **Room Detail View** | Full gallery, amenities, reviews, availability calendar, and 3D room viewer |
| **Booking System** | Complete reservation flow with guest/children count, special requests, and instant price calculation |
| **User Authentication** | Email/password registration with verification, Google OAuth, password reset, and session management |
| **My Bookings** | View, filter, and track all personal bookings with status indicators |
| **Review System** | Submit ratings and reviews for rooms with duplicate prevention |
| **Gallery** | Category-filtered image gallery with lightbox and dynamic loading |
| **Contact Form** | Professional inquiry form with email notifications |
| **Interactive Maps** | Embedded location with coordinates and directions link |

### 🛠️ Admin Features

| Feature | Description |
|---------|-------------|
| **Analytics Dashboard** | Real-time revenue charts, booking status, occupancy rates, and room performance |
| **Revenue Tracking** | Custom date ranges, room-wise breakdown, monthly comparisons |
| **Booking Management** | Confirm/cancel bookings with automated email notifications |
| **Room Management** | CRUD operations, image uploads, featured/new flags, status toggles |
| **Gallery Management** | Upload, categorize, caption, and delete images with Cloudinary integration |
| **User Management** | Role assignment, verification toggle, user deletion with confirmation |
| **Availability Grid** | 14-day visual room availability matrix |
| **Notification System** | Real-time alerts for pending bookings and today's check-ins |

### 📊 Advanced Integrations

| Integration | Purpose |
|-------------|---------|
| **Google Analytics 4** | Complete event tracking for user behavior, bookings, and engagement |
| **Cloudinary** | Cloud-based image storage and optimization |
| **Nodemailer** | Professional HTML email templates for booking confirmations, verification, and password resets |
| **Three.js / React Three Fiber** | Interactive 3D bedroom model with auto-rotation |
| **Recharts** | Beautiful data visualizations for admin analytics |
| **Framer Motion** | Smooth animations and transitions throughout the site |

---

## 🚀 Tech Stack

### Frontend

- **Next.js 16.3.1** — React framework with App Router
- **React 19.2.8** — UI library
- **TypeScript 5** — Type safety and better developer experience
- **Tailwind CSS 4** — Utility-first CSS framework
- **Framer Motion 13** — Animation library
- **Lucide React** — Icon library
- **React DatePicker** — Date selection components

### Backend

- **Next.js API Routes** — Serverless API endpoints
- **MongoDB 9.9.2** — NoSQL database
- **Mongoose** — ODM for MongoDB
- **NextAuth.js 4.24** — Authentication
- **Bcrypt.js** — Password hashing
- **Nodemailer 7** — Email sending

### 3D & Visualization

- **Three.js 0.185** — 3D graphics
- **React Three Fiber 9.7** — React renderer for Three.js
- **React Three Drei 10.7** — Useful helpers for R3F

### DevOps & Deployment

- **Vercel** — Hosting and deployment
- **Cloudinary** — Image storage
- **Google Analytics 4** — Analytics
- **GitHub** — Version control

---

## 📦 Installation

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** or **yarn** or **pnpm**
- **MongoDB** — local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Cloudinary Account** — for image uploads
- **Google OAuth Credentials** — for social login
- **Gmail Account** — for sending emails (with app password)

### Step 1: Clone the Repository

```bash
git clone https://github.com/zainshah3464/Zain-Serenity.git
cd Zain-Serenity
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# ── Database ──────────────────────────────
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/guesthouse

# ── Authentication ────────────────────────
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# ── Google OAuth ──────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ── Cloudinary ────────────────────────────
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# ── Email (Gmail) ─────────────────────────
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password

# ── Google Analytics 4 ────────────────────
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ── Base URL ──────────────────────────────
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Step 4: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 5: Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
Zain-Serenity/
├── public/
│   ├── images/
│   │   ├── about/              # About page images
│   │   ├── favicon/            # Favicon files & manifest
│   │   ├── gallery/            # Gallery images
│   │   ├── location/           # Location/map images
│   │   ├── screenshots/        # Project screenshots
│   │   ├── why-us/             # Why Choose Us images
│   │   ├── email-header.png    # Email template header
│   │   ├── hero-fallback.jpg   # Hero fallback image
│   │   └── og-image.png        # Open Graph image
│   ├── models/
│   │   └── bedroom.glb         # 3D bedroom model
│   ├── videos/
│   │   └── hero-video.mp4      # Hero background video
│   └── ...
│
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── about/
│   │   ├── admin/
│   │   │   ├── (private)/
│   │   │   │   ├── bookings/
│   │   │   │   ├── gallery/
│   │   │   │   ├── rooms/
│   │   │   │   │   ├── [id]/
│   │   │   │   │   └── new/
│   │   │   │   └── users/
│   │   │   └── (public)/
│   │   │       └── login/
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   │   ├── bookings/[id]/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── gallery/
│   │   │   │   ├── rooms/
│   │   │   │   ├── stats/
│   │   │   │   ├── upload/
│   │   │   │   ├── users/
│   │   │   │   └── verify-user/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   ├── forgot-password/
│   │   │   │   ├── register/
│   │   │   │   ├── reset-password/
│   │   │   │   └── verify/
│   │   │   ├── bookings/
│   │   │   ├── contact/
│   │   │   ├── gallery/
│   │   │   ├── reviews/
│   │   │   └── rooms/
│   │   ├── booking/
│   │   ├── contact/
│   │   ├── forgot-password/
│   │   ├── gallery/
│   │   ├── login/
│   │   ├── my-bookings/
│   │   ├── register/
│   │   ├── reset-password/
│   │   ├── rooms/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── AdminTopbar.tsx
│   │   │   ├── DashboardComponents.tsx
│   │   │   ├── DashboardEntryAnimation.tsx
│   │   │   ├── DashboardLoader.tsx
│   │   │   └── DetailModal.tsx
│   │   ├── AboutContent.tsx
│   │   ├── FeaturedRoomsCarousel.tsx
│   │   ├── Footer.tsx
│   │   ├── Gallery.tsx
│   │   ├── HeroLoadingContext.tsx
│   │   ├── LocationMap.tsx
│   │   ├── Navbar.tsx
│   │   ├── Providers.tsx
│   │   ├── PublicLayoutWrapper.tsx
│   │   ├── ReviewCarousel.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── Room3DViewer.tsx
│   │   ├── RoomCard.tsx
│   │   ├── RoomDetailContent.tsx
│   │   ├── ScrollReveal.tsx
│   │   ├── SearchBar.tsx
│   │   ├── SkeletonCard.tsx
│   │   ├── StoryHero.tsx
│   │   └── WhyChooseUs.tsx
│   │
│   ├── hooks/
│   │   └── useMediaQuery.ts
│   │
│   ├── lib/
│   │   ├── bookingValidation.ts
│   │   ├── checkAvailability.ts
│   │   ├── dbConnect.ts
│   │   ├── emailTemplates.ts
│   │   ├── ga4.ts
│   │   └── rateLimiter.ts
│   │
│   ├── models/
│   │   ├── Booking.ts
│   │   ├── GalleryImage.ts
│   │   ├── Review.ts
│   │   ├── Room.ts
│   │   └── User.ts
│   │
│   └── types/
│       └── next-auth.d.ts
│
├── .env.local                   # Environment variables (not in git)
├── .gitignore
├── AGENTS.md
├── CLAUDE.md
├── README.md
├── eslint.config.mjs
├── next-env.d.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.js
└── tsconfig.json
```

---

## 🗄️ Database Models

### User Model (`src/models/User.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name of user |
| `email` | String | Unique email address |
| `passwordHash` | String? | Hashed password (optional for Google users) |
| `role` | "admin" \| "customer" | User role (default: "customer") |
| `isVerified` | Boolean | Email verification status |
| `verificationToken` | String? | Token for email verification |
| `verificationTokenExpiry` | Number? | Token expiry timestamp |
| `resetToken` | String? | Password reset token |
| `resetTokenExpiry` | Number? | Reset token expiry |
| `lastLogin` | Date? | Last login timestamp |

### Room Model (`src/models/Room.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Room name |
| `description` | String | Detailed description |
| `price` | Number | Price per night |
| `image` | String | Main image URL |
| `images` | String[] | Multiple images |
| `capacity` | Number | Maximum guests |
| `amenities` | String[] | List of amenities |
| `status` | "active" \| "inactive" \| "maintenance" | Room availability status |
| `isFeatured` | Boolean | Featured room flag |
| `isNewRoom` | Boolean | New room flag |
| `view` | String? | View type (e.g., "Mountain view") |
| `rating` | Number | Average rating (0-5) |
| `roomType` | String | Type (standard/deluxe/suite) |
| `bedType` | String | Bed configuration |
| `size` | String | Room size in sq ft |
| `discount` | Number? | Discount percentage |

### Booking Model (`src/models/Booking.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `userId` | String | Reference to user |
| `roomId` | String | Reference to room |
| `checkIn` | Date | Check-in date |
| `checkOut` | Date | Check-out date |
| `guests` | Number | Number of guests |
| `children` | Number | Number of children |
| `totalPrice` | Number | Total booking price |
| `specialRequests` | String? | Special requests |
| `status` | "pending" \| "confirmed" \| "cancelled" | Booking status |
| `createdAt` | Date | Creation timestamp |

### Review Model (`src/models/Review.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId | Reference to user |
| `roomId` | String | Reference to room |
| `rating` | Number | Rating (1-5) |
| `comment` | String | Review comment |
| `createdAt` | Date | Creation timestamp |

### GalleryImage Model (`src/models/GalleryImage.ts`)

| Field | Type | Description |
|-------|------|-------------|
| `url` | String | Image URL (Cloudinary) |
| `caption` | String? | Image caption |
| `category` | "featured" \| "rooms" \| "bathroom" \| "exterior" \| "amenities" \| "pool" \| "other" | Gallery category |
| `uploadedBy` | String | Admin user ID |
| `createdAt` | Date | Creation timestamp |

---

## 🔌 API Routes

### Public Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/rooms` | List rooms with filters (check-in/out, featured, pagination) | No |
| `GET` | `/api/gallery` | List gallery images by category | No |
| `POST` | `/api/contact` | Submit contact form | No |
| `POST` | `/api/bookings` | Create new booking | Yes |
| `GET` | `/api/bookings` | List bookings (admin: all, customer: own) | Yes |
| `POST` | `/api/reviews` | Submit room review | Yes |

### Auth Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user (with email verification) |
| `POST` | `/api/auth/forgot-password` | Send password reset email |
| `POST` | `/api/auth/reset-password` | Reset password with token |
| `GET` | `/api/auth/verify` | Verify email with token |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js authentication |

### Admin Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/dashboard` | Dashboard analytics (revenue, occupancy, bookings) |
| `GET` | `/api/admin/stats` | Basic statistics |
| `GET` | `/api/admin/rooms` | List all rooms (paginated) |
| `POST` | `/api/admin/rooms` | Create room |
| `GET/PUT/PATCH/DELETE` | `/api/admin/rooms/[id]` | Room CRUD operations |
| `GET` | `/api/admin/rooms/stats` | Room statistics |
| `GET` | `/api/admin/gallery` | List gallery images |
| `POST` | `/api/admin/gallery` | Upload gallery image |
| `PATCH/DELETE` | `/api/admin/gallery/[id]` | Update/delete gallery image |
| `POST` | `/api/admin/upload` | Upload image to Cloudinary |
| `GET` | `/api/admin/users` | List all users |
| `PATCH/DELETE` | `/api/admin/users/[id]` | Update/delete user |
| `POST` | `/api/admin/verify-user` | Manually verify user |
| `PATCH` | `/api/admin/bookings/[id]` | Update booking status (confirm/cancel) |

---

## 🎨 Design & User Experience

### Visual Design

- **Luxury Aesthetic** — Teal/emerald gradient palette with Playfair Display and Inter fonts
- **Glassmorphism** — Frosted glass effects throughout the interface
- **Smooth Animations** — Framer Motion powered transitions, hover effects, and loading states
- **Responsive** — Mobile-first design with adaptive layouts for all screen sizes
- **Accessibility** — ARIA labels, keyboard navigation, semantic HTML

### Performance

- **Turbopack** — Next.js 16's build system for faster compilation
- **Image Optimization** — Next.js Image component with lazy loading
- **Dynamic Imports** — Code splitting for better initial load
- **Edge Caching** — Vercel edge network for global distribution
- **Optimized Fonts** — next/font for zero-layout-shift font loading

### SEO & Metadata

- **Open Graph** — Social media sharing cards
- **Twitter Cards** — Twitter sharing support
- **Canonical URLs** — Proper URL canonicalization
- **Robots.txt** — Search engine crawling configuration
- **Manifest** — PWA-ready manifest file

---

## 📧 Email System

The project includes a sophisticated HTML email system with:

- **Booking Confirmations** — Professional emails with room details, amenities, and booking summary
- **Booking Cancellations** — Cancellation notifications with rebooking links
- **Welcome Emails** — New account creation emails
- **Welcome Back Emails** — Returning user login emails
- **Password Reset** — Secure reset links with expiry
- **Email Verification** — Account activation emails
- **Contact Form** — Admin notification for inquiries

All emails use a custom-designed template with luxury branding, responsive design, and consistent styling.

---

## 📊 Google Analytics 4 Integration

The project implements comprehensive GA4 tracking:

| Event | Trigger |
|-------|---------|
| `view_item_list` | Room listing page |
| `view_item` | Room detail page |
| `select_item` | Room card click |
| `begin_checkout` | Booking page load |
| `search_availability` | Room search |
| `select_date` | Date selection |
| `add_guest` | Guest count change |
| `view_gallery` | Gallery page view |
| `view_reviews` | Reviews section view |
| `generate_lead` | Contact form submission |
| `login` | User login (with method) |
| `user_identified` | User session start |
| `video_engagement` | Hero video interactions |
| `click_to_call` | Phone number click |
| `click_email` | Email link click |
| `click_map` | Map interaction |

---

## 🔒 Security Features

- **Rate Limiting** — Auth endpoints protected against brute force
- **Bcrypt Hashing** — Secure password storage (12 rounds)
- **JWT Sessions** — Stateless authentication with NextAuth.js
- **Input Validation** — Server-side validation for all forms
- **XSS Protection** — React's built-in escaping
- **CSRF Protection** — NextAuth.js CSRF tokens
- **Secure Headers** — Vercel security headers
- **Environment Variables** — Secrets stored securely

---

## 🚀 Deployment

### Vercel Deployment

The project is deployed on Vercel at [zainserenity.vercel.app](https://zainserenity.vercel.app).

**Steps to deploy:**

1. Push code to GitHub repository
2. Import project in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

### Environment Variables on Vercel

All environment variables are configured in the Vercel dashboard under **Project Settings → Environment Variables**. Production and Preview environments share the same variables.

---

## 👨‍💻 Developer

<div align="center">

### **Zain Shah**

**Full-Stack Developer & Founder**

[![Portfolio](https://img.shields.io/badge/Portfolio-zain--main--web.vercel.app-0d9488?style=for-the-badge&logo=vercel&logoColor=white)](https://zain-main-web.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-zainshah3464-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/zainshah3464)
[![Instagram](https://img.shields.io/badge/Instagram-zainshah3464-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://www.instagram.com/zainshah3464)
[![Email](https://img.shields.io/badge/Email-zainshahzs110@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:zainshahzs110@gmail.com)

</div>

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2025 Zain Shah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgements

- **Next.js Team** — For the amazing React framework
- **Vercel** — For hosting and deployment platform
- **MongoDB Atlas** — For database hosting
- **Cloudinary** — For image storage and optimization
- **Framer Motion** — For animation library
- **Tailwind CSS** — For utility-first CSS framework

---

<div align="center">

**Built with ❤️ by Zain Shah**

*"This place is not just my life's work; it's a love letter to the sea, the mountains, and every traveller who dares to dream."*

</div>
