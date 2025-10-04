# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Funny Tourism is a Next.js 15 web application for a Turkey tour operator. The platform allows customers to browse tour packages, make bookings, and manage their accounts. It includes an admin panel with AI-powered PDF package extraction using OpenAI.

**Tech Stack:**
- Next.js 15.5.4 (App Router)
- React 19.2.0
- TypeScript
- Tailwind CSS
- Prisma ORM with MySQL
- JWT-based authentication (bcryptjs)
- OpenAI API (GPT-4o for PDF extraction)

## Development Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Build & Production
npm run build           # Build for production
npm start               # Start production server

# Linting
npm run lint            # Run Next.js linter

# Database
npx prisma generate     # Generate Prisma client after schema changes
npx prisma db push      # Push schema changes to database
npx prisma studio       # Open Prisma Studio GUI

# Admin Management
npm run create-admin    # Interactive CLI to create admin user
```

## Architecture

### Dual Authentication System

The application has **two separate authentication systems**:

1. **Customer Auth** ([lib/auth/session.ts](lib/auth/session.ts))
   - JWT tokens stored in `auth-token` cookie
   - Used by: customer login, registration, dashboard, bookings
   - Protected routes: [/dashboard](app/dashboard/page.tsx), booking endpoints

2. **Admin Auth** ([lib/adminAuth.ts](lib/adminAuth.ts))
   - JWT tokens stored in `admin-token` cookie
   - Used by: admin panel, package management
   - Protected routes: [/admin/*](app/admin/), admin API endpoints
   - Helper functions: `getAdminFromToken()`, `requireAdmin()`

### Database Schema (Prisma)

Key models in [prisma/schema.prisma](prisma/schema.prisma):

- **Package**: Tour packages with support for two types:
  - `WITH_HOTEL`: Traditional packages with hotel pricing (3/4/5-star categories)
  - `LAND_ONLY`: Land services only with per-person pricing
  - Stores: itinerary (JSON), pricing (JSON), hotels (JSON), highlights, included/excluded items

- **User**: Customer accounts with bcrypt-hashed passwords

- **Booking**: Customer bookings with status tracking (`PENDING`, `CONFIRMED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`)

- **Admin**: Admin users (separate from customers)

- **ContactInquiry**: Contact form submissions

### AI-Powered PDF Extraction

The admin panel ([/admin/packages/add](app/admin/packages/add/page.tsx)) includes PDF package extraction:

**How it works** ([app/api/admin/extract-pdf/route.ts](app/api/admin/extract-pdf/route.ts)):
1. Admin uploads a tour package PDF
2. PDF saved to `public/packages/` directory
3. File uploaded to OpenAI with GPT-4o assistant
4. Assistant extracts structured data (title, itinerary, pricing, hotels, etc.)
5. Automatically detects package type (`WITH_HOTEL` vs `LAND_ONLY`)
6. Returns JSON to pre-fill the package form
7. Selects appropriate image from available destination images

**Environment variable required:** `OPENAI_API_KEY`

### API Routes Structure

**Customer APIs** ([app/api/auth/](app/api/auth/)):
- `/api/auth/register` - Customer registration
- `/api/auth/login` - Customer login
- `/api/auth/logout` - Customer logout
- `/api/auth/me` - Get current user
- `/api/bookings` - Create/list customer bookings
- `/api/contact` - Contact form submissions
- `/api/packages` - List packages (public)
- `/api/packages/[id]` - Get single package (public)

**Admin APIs** ([app/api/admin/](app/api/admin/)):
- `/api/admin/login` - Admin login
- `/api/admin/logout` - Admin logout
- `/api/admin/packages` - CRUD operations (protected)
- `/api/admin/packages/[id]` - Update/delete package (protected)
- `/api/admin/extract-pdf` - AI PDF extraction (protected)
- `/api/admin/next-package-id` - Get next available package ID

### Page Structure

**Customer-facing:**
- `/` - Homepage with hero, featured packages, testimonials
- `/packages` - Browse all packages
- `/packages/istanbul-cappadocia-kusadasi` - Example package detail page
- `/tours/*` - Tour category pages (daily tours, transfers, land packages, hotel packages)
- `/destinations/*` - Destination pages (Istanbul, Cappadocia, etc.)
- `/login`, `/register` - Customer authentication
- `/dashboard` - Customer booking management
- `/contact` - Contact form

**Admin panel:**
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin overview
- `/admin/packages/add` - Add package with PDF extraction
- `/admin/packages/edit/[id]` - Edit existing package

All admin pages check authentication via `getAdminFromToken()` and redirect to login if unauthorized.

### Components

**Shared UI:**
- [Navigation.tsx](components/Navigation.tsx) - Header with mobile menu
- [Footer.tsx](components/Footer.tsx) - Footer with contact info
- [WhatsAppWidget.tsx](components/WhatsAppWidget.tsx) - Floating WhatsApp button

**Homepage:**
- [Hero.tsx](components/Hero.tsx) - Hero section with CTA
- [FeaturedPackages.tsx](components/FeaturedPackages.tsx) - Package cards
- [Destinations.tsx](components/Destinations.tsx) - Destination showcase
- [Testimonials.tsx](components/Testimonials.tsx) - Customer reviews
- [WhyChooseUs.tsx](components/WhyChooseUs.tsx) - Benefits section

**Package Pages:**
- [ItineraryTimeline.tsx](components/ItineraryTimeline.tsx) - Day-by-day timeline
- [PricingCalculator.tsx](components/PricingCalculator.tsx) - Dynamic pricing based on group size/hotel category
- [ImageGallery.tsx](components/ImageGallery.tsx) - Lightbox image viewer

**Admin:**
- [admin/PackageForm.tsx](components/admin/PackageForm.tsx) - Package creation/edit form with PDF extraction UI
- [admin/LogoutButton.tsx](components/admin/LogoutButton.tsx) - Admin logout

### Environment Variables

Required in `.env`:
```
DATABASE_URL="mysql://..."
JWT_SECRET="your-secret-key"
OPENAI_API_KEY="sk-..."  # For PDF extraction feature
```

### Prisma Client Singleton

Use the shared Prisma client from [lib/prisma.ts](lib/prisma.ts) to avoid multiple instances in development:
```typescript
import prisma from '@/lib/prisma';
```

## Key Patterns

### Creating Admin Users

Run the interactive script:
```bash
npm run create-admin
```

This uses [scripts/create-admin.ts](scripts/create-admin.ts) to create admin accounts with hashed passwords.

### Adding New Packages

Two options:
1. **Manual:** Use admin panel at `/admin/packages/add`
2. **AI-assisted:** Upload PDF in admin panel, let OpenAI extract data, review and save

### Package Types

When creating packages, specify `packageType`:
- `WITH_HOTEL`: Include hotel pricing structure (3/4/5-star with single/double/triple rates)
- `LAND_ONLY`: Only per-person land services pricing

The pricing calculator component automatically adapts based on package type.

### Authentication Guards

**For customer routes:**
```typescript
import { getSession } from '@/lib/auth/session';

const user = await getSession();
if (!user) redirect('/login');
```

**For admin routes:**
```typescript
import { getAdminFromToken } from '@/lib/adminAuth';

const admin = await getAdminFromToken();
if (!admin) redirect('/admin/login');
```

**For admin API routes:**
```typescript
import { requireAdmin } from '@/lib/adminAuth';

const admin = await requireAdmin(); // Throws if not authenticated
```

### Styling

Uses Tailwind CSS with custom colors defined in [tailwind.config.ts](tailwind.config.ts):
- Primary blue: `primary-600` (#0284c7)
- Accent orange: `accent-500` (#f59e0b)

Framer Motion used for animations (scroll effects, hover states).
