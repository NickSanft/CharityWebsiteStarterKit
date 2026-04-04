# Nonprofit Website Starter Kit — Claude Code Implementation Plan

## Project Overview

Build an open-source, self-hosted Next.js starter kit that any charity or nonprofit can fork, brand, and deploy to run a full-featured website. The project name is **OpenGood** (working title — rename as desired).

**Repository:** Create a new GitHub repository with the MIT License so any charity can freely use, modify, and distribute the project without restriction.

**Tech Stack:**

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with a theming/branding configuration system
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js (credentials + OAuth providers)
- **Payments:** Stripe (one-time and recurring donations)
- **Containerization:** Docker + Docker Compose for self-hosting
- **Testing:** Jest + React Testing Library
- **Linting:** ESLint + Prettier with strict configs

---

## Repository Setup

### License

Add an MIT License file (`LICENSE`) at the repository root. MIT is the best fit because it allows any charity to use, copy, modify, merge, publish, and distribute the software freely with no restrictions beyond preserving the license notice.

### GitHub Community Files

Create the following in the repository root and `.github/` directory:

- `LICENSE` — MIT License
- `README.md` — Project overview, screenshots, quick-start guide, feature list, and contribution link
- `CONTRIBUTING.md` — How to contribute: branching strategy, PR process, code style, testing expectations
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
- `.github/ISSUE_TEMPLATE/bug_report.md` — Bug report template
- `.github/ISSUE_TEMPLATE/feature_request.md` — Feature request template
- `.github/PULL_REQUEST_TEMPLATE.md` — PR checklist template
- `CHANGELOG.md` — Keep a Changelog format
- `.github/workflows/ci.yml` — GitHub Actions CI pipeline (lint, type-check, test, build)

---

## Project Structure

```
opengood/
├── .github/                    # GitHub templates and CI workflows
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Seed script with demo data
│   └── migrations/             # Prisma migrations
├── public/
│   ├── images/                 # Default placeholder images
│   └── favicon.ico
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public)/           # Public-facing route group
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── about/page.tsx        # About page
│   │   │   ├── contact/page.tsx      # Contact page
│   │   │   ├── blog/                 # Blog listing + detail pages
│   │   │   ├── events/               # Event listing + detail pages
│   │   │   ├── donate/page.tsx       # Donation page
│   │   │   └── volunteer/page.tsx    # Volunteer sign-up page
│   │   ├── admin/              # Admin dashboard route group
│   │   │   ├── layout.tsx            # Admin layout with sidebar nav
│   │   │   ├── page.tsx              # Admin dashboard home
│   │   │   ├── posts/                # Blog post CRUD
│   │   │   ├── events/               # Event CRUD
│   │   │   ├── volunteers/           # Volunteer management
│   │   │   ├── donations/            # Donation log and reporting
│   │   │   └── settings/             # Site settings and branding
│   │   ├── api/                # API routes
│   │   │   ├── auth/[...nextauth]/   # NextAuth endpoints
│   │   │   ├── donations/            # Stripe webhook + donation API
│   │   │   ├── contact/              # Contact form handler
│   │   │   ├── volunteers/           # Volunteer sign-up API
│   │   │   └── upload/               # Image upload endpoint
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles + Tailwind imports
│   ├── components/
│   │   ├── ui/                 # Reusable UI primitives (Button, Card, Input, Modal, etc.)
│   │   ├── layout/             # Header, Footer, Sidebar, Navigation
│   │   ├── donations/          # DonationForm, DonationWidget, DonationTicker
│   │   ├── events/             # EventCard, EventList, RSVPForm
│   │   ├── blog/               # PostCard, PostList, PostContent
│   │   ├── volunteers/         # VolunteerForm, VolunteerList
│   │   └── common/             # SEO Head, Newsletter signup, Social links
│   ├── lib/
│   │   ├── prisma.ts           # Prisma client singleton
│   │   ├── stripe.ts           # Stripe client setup
│   │   ├── auth.ts             # NextAuth configuration
│   │   ├── email.ts            # Email utility (Nodemailer or Resend)
│   │   └── utils.ts            # Shared utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── types/                  # TypeScript type definitions
│   └── config/
│       ├── site.ts             # Site metadata, branding, social links
│       └── navigation.ts       # Navigation menu structure
├── docker-compose.yml          # PostgreSQL + App containers
├── Dockerfile                  # Multi-stage production build
├── .env.example                # Environment variable template with comments
├── tailwind.config.ts          # Tailwind config with theme tokens
├── next.config.js
├── tsconfig.json
├── jest.config.ts
├── package.json
└── README.md
```

---

## Database Schema (Prisma)

Design the following models in `prisma/schema.prisma`:

### SiteSettings

Stores global site configuration so charities can customize without touching code.

- `id` — String, primary key (use a single-row pattern, e.g., id = "default")
- `orgName` — String, the charity's display name
- `tagline` — String, optional short tagline
- `logoUrl` — String, optional path to uploaded logo
- `primaryColor` — String, hex color code (default "#2563eb")
- `secondaryColor` — String, hex color code (default "#16a34a")
- `contactEmail` — String
- `contactPhone` — String, optional
- `address` — String, optional
- `socialLinks` — Json, object with keys like facebook, twitter, instagram, linkedin
- `updatedAt` — DateTime

### User (Admin accounts)

- `id` — String, cuid
- `name` — String
- `email` — String, unique
- `passwordHash` — String
- `role` — Enum: ADMIN, EDITOR
- `createdAt` — DateTime
- `updatedAt` — DateTime

### Post (Blog)

- `id` — String, cuid
- `title` — String
- `slug` — String, unique
- `excerpt` — String, optional, short summary for cards
- `content` — Text, full post body (store as HTML or Markdown)
- `coverImage` — String, optional URL
- `published` — Boolean, default false
- `publishedAt` — DateTime, optional
- `authorId` — Relation to User
- `tags` — Json, array of tag strings
- `createdAt` — DateTime
- `updatedAt` — DateTime

### Event

- `id` — String, cuid
- `title` — String
- `slug` — String, unique
- `description` — Text
- `coverImage` — String, optional
- `location` — String (physical address or "Virtual")
- `virtualLink` — String, optional (Zoom/Meet URL)
- `startDate` — DateTime
- `endDate` — DateTime
- `capacity` — Int, optional (null = unlimited)
- `published` — Boolean, default false
- `createdAt` — DateTime
- `updatedAt` — DateTime

### EventRegistration

- `id` — String, cuid
- `eventId` — Relation to Event
- `name` — String
- `email` — String
- `phone` — String, optional
- `headcount` — Int, default 1
- `createdAt` — DateTime

### Volunteer

- `id` — String, cuid
- `name` — String
- `email` — String, unique
- `phone` — String, optional
- `interests` — Json, array of strings (e.g., ["fundraising", "mentoring", "events"])
- `availability` — String, optional free-text
- `message` — Text, optional
- `status` — Enum: NEW, CONTACTED, ACTIVE, INACTIVE
- `createdAt` — DateTime
- `updatedAt` — DateTime

### Donation

- `id` — String, cuid
- `stripePaymentId` — String, unique
- `stripeCustomerId` — String, optional
- `amount` — Int (store in cents)
- `currency` — String, default "usd"
- `recurring` — Boolean
- `donorName` — String, optional
- `donorEmail` — String
- `message` — String, optional dedication or note
- `status` — Enum: PENDING, COMPLETED, FAILED, REFUNDED
- `createdAt` — DateTime

### ContactSubmission

- `id` — String, cuid
- `name` — String
- `email` — String
- `subject` — String, optional
- `message` — Text
- `read` — Boolean, default false
- `createdAt` — DateTime

---

## Phase 1: Foundation

**Goal:** A forkable, brandable, deployable website shell with blog and admin panel.

### Tasks

1. **Initialize the project**
   - Create Next.js 14+ app with TypeScript and App Router
   - Install and configure Tailwind CSS
   - Set up ESLint, Prettier, and strict TypeScript config
   - Create the `docker-compose.yml` with PostgreSQL and the app service
   - Create the `Dockerfile` with a multi-stage build (deps → build → production)
   - Create `.env.example` with all required environment variables, well-commented

2. **Set up the database**
   - Write the full Prisma schema with all models listed above
   - Generate and run the initial migration
   - Write a `seed.ts` that populates demo data: a default admin user, sample blog posts, a sample event, and default site settings

3. **Implement authentication**
   - Configure NextAuth.js with credentials provider (email + password)
   - Create login page at `/admin/login`
   - Protect all `/admin/*` routes with middleware that checks for a valid session
   - Add a "first-run setup" flow: if no admin user exists, show a setup page to create the first admin account

4. **Build the theming/branding system**
   - In `tailwind.config.ts`, define CSS custom properties for primary color, secondary color, fonts, and border radius that map to the SiteSettings model
   - Create a `ThemeProvider` component that reads SiteSettings from the database and injects CSS variables into the root layout
   - Create the admin Settings page where staff can update org name, logo, colors, contact info, and social links — changes take effect immediately without redeployment

5. **Build public page layouts**
   - Create the root layout with responsive Header (logo, navigation, "Donate" CTA button) and Footer (contact info, social links, copyright)
   - Build the Homepage with configurable hero section (headline, subhead, CTA button, background image), a mission statement area, and a "Latest News" section pulling recent blog posts
   - Build the About page with rich text content area
   - Build the Contact page with a form that submits to `/api/contact` and stores a ContactSubmission

6. **Build the blog module**
   - Public: Blog listing page with cards (title, excerpt, cover image, date), pagination, and individual post detail pages with SEO meta tags
   - Admin: Blog post list with publish/draft status, create/edit post form with title, slug (auto-generated from title), excerpt, content (use a Markdown editor component or simple rich-text textarea), cover image upload, tags, and publish toggle
   - API routes for CRUD operations on posts

7. **Build the admin dashboard shell**
   - Admin layout with sidebar navigation: Dashboard, Posts, Events, Volunteers, Donations, Settings
   - Dashboard home page showing summary cards: total posts, upcoming events, new volunteers this month, total donations this month
   - Make the sidebar responsive and collapsible on mobile

8. **Write tests**
   - Unit tests for utility functions
   - Component tests for key UI components (Header, Footer, DonationForm)
   - Integration tests for API routes (contact form submission, auth)

9. **Documentation**
   - Write the README with: project description, feature list, screenshots, prerequisites (Node 18+, Docker), quick-start instructions, environment variable reference, deployment guide, and a link to CONTRIBUTING.md
   - Write CONTRIBUTING.md with the branching model, coding standards, and PR process

---

## Phase 2: Donations

**Goal:** Accept one-time and recurring donations via Stripe.

### Tasks

1. **Stripe integration setup**
   - Create `lib/stripe.ts` with Stripe SDK initialization
   - Document required Stripe environment variables in `.env.example`: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

2. **Donation page and form**
   - Build `/donate` page with a polished donation form
   - Preset amount buttons ($10, $25, $50, $100) plus a custom amount input
   - Toggle for one-time vs. monthly recurring
   - Optional donor name, email, and dedication message fields
   - Use Stripe Elements for the payment card input (never handle raw card data)

3. **Payment processing API**
   - API route `POST /api/donations/create-intent` — creates a Stripe PaymentIntent (one-time) or a Stripe Subscription (recurring), returns the client secret
   - API route `POST /api/donations/webhook` — Stripe webhook handler that listens for `payment_intent.succeeded`, `invoice.payment_succeeded`, and `charge.refunded` events, and creates/updates Donation records in the database

4. **Admin donation management**
   - Admin donations list page: table with donor name, email, amount, date, recurring status, and payment status
   - Filters by date range and recurring/one-time
   - Simple CSV export of donation data for the charity's own bookkeeping
   - Summary stats: total raised all-time, this month, this year; number of recurring donors

5. **Embeddable donation widget**
   - Create a `DonationWidget` component that can be placed on any page (homepage, sidebar) — a compact form with preset amounts and a "Donate" button
   - Optional: a small "donation ticker" component showing recent donation activity (anonymized)

---

## Phase 3: Events

**Goal:** Let charities create, publish, and manage events with public registration.

### Tasks

1. **Public event pages**
   - Event listing page at `/events` showing upcoming events as cards (title, date, location, cover image), sorted by start date
   - Past events section or toggle
   - Individual event detail page at `/events/[slug]` with full description, date/time, location (with a map link if physical address), capacity and remaining spots, and a registration form

2. **Registration system**
   - Registration form: name, email, phone (optional), headcount
   - API route `POST /api/events/[id]/register` that validates capacity, creates an EventRegistration, and sends a confirmation email
   - Show "Event Full" state when registrations reach capacity
   - Optional: basic waitlist functionality

3. **Admin event management**
   - Event list with upcoming/past tabs, publish/draft status
   - Create/edit event form: title, slug, description (rich text or Markdown), cover image, location, virtual link, start/end date-time pickers, capacity, publish toggle
   - View registrations for each event as a table with CSV export
   - Ability to send a bulk email to all registrants for an event (e.g., reminders or updates)

4. **Calendar integration**
   - "Add to Calendar" button on event detail pages that generates `.ics` file downloads
   - Optional: iCal feed URL so people can subscribe to all events

---

## Phase 4: Volunteers

**Goal:** Let potential volunteers sign up and let admins manage them.

### Tasks

1. **Public volunteer sign-up**
   - Volunteer page at `/volunteer` explaining what volunteers do and a sign-up form
   - Form fields: name, email, phone, interest areas (multi-select checkboxes from a configurable list), availability, message
   - API route `POST /api/volunteers` that creates a Volunteer record with status NEW and sends a confirmation email

2. **Admin volunteer management**
   - Volunteer list with filters by status (New, Contacted, Active, Inactive) and interest area
   - Detail view showing all volunteer info and status history
   - Ability to update volunteer status
   - CSV export of volunteer data
   - Optional: basic email templates for volunteer outreach (welcome, follow-up)

3. **Volunteer interest configuration**
   - Admin settings area where staff can define the list of volunteer interest categories (e.g., "Fundraising", "Mentoring", "Event Support", "Administrative", "Technical")
   - These categories drive the checkboxes on the public form

---

## Phase 5: Polish & Community Readiness

**Goal:** Make the project accessible, performant, well-documented, and welcoming to contributors.

### Tasks

1. **Accessibility audit and fixes**
   - Meet WCAG 2.1 Level AA across all pages
   - Ensure full keyboard navigation, proper ARIA labels, focus management in modals and forms
   - Test with screen readers (document testing process in CONTRIBUTING.md)
   - Ensure sufficient color contrast in the default theme and validate that the branding system enforces minimum contrast ratios

2. **SEO optimization**
   - Dynamic meta tags (title, description, Open Graph, Twitter Card) on all public pages
   - Auto-generated `sitemap.xml` and `robots.txt`
   - Structured data (JSON-LD) for events and blog posts

3. **Performance**
   - Image optimization with Next.js `<Image>` component throughout
   - Lazy loading for below-fold content
   - Target Lighthouse scores: Performance 90+, Accessibility 95+, Best Practices 95+, SEO 95+

4. **Email system**
   - Set up a transactional email utility (`lib/email.ts`) using Nodemailer (self-hosted SMTP) or Resend (API-based)
   - Email templates for: contact form confirmation, event registration confirmation, volunteer welcome, donation receipt
   - Document email provider configuration in README

5. **Demo site and screenshots**
   - Create a seed script that generates a realistic-looking demo charity ("Greenfield Community Foundation") with sample posts, events, volunteers, and donations
   - Take screenshots for the README and create a simple landing page or GitHub Pages site showcasing the project

6. **Final documentation pass**
   - Deployment guide covering: Docker Compose on a VPS, environment variable setup, Stripe configuration, email provider setup, initial admin account creation
   - Architecture decision records (ADRs) for key choices (why Next.js, why Prisma, why MIT license)
   - Inline code documentation and JSDoc comments on all public-facing utility functions and components

7. **Community setup**
   - GitHub Discussions enabled for questions and ideas
   - Issue labels: `good-first-issue`, `help-wanted`, `bug`, `feature`, `documentation`, `accessibility`
   - Create 5–10 pre-written "good first issue" issues to welcome new contributors
   - Add a "Contributors" section to the README using All Contributors spec

---

## Environment Variables Reference

Document these in `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/opengood"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (choose one provider)
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-password"
# OR
RESEND_API_KEY="re_..."

# App
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
UPLOAD_DIR="./uploads"
```

---

## Key Principles for Implementation

1. **Simplicity over cleverness.** Every charity that forks this will have different technical skill levels. Keep the codebase straightforward and well-commented.

2. **Configuration over code changes.** Anything a charity might want to customize (colors, org name, menu items, volunteer categories) should be editable through the admin panel or a config file — not by editing components.

3. **Accessibility is not optional.** Every component, every page, every interaction must be accessible. Use semantic HTML, proper ARIA, keyboard navigation, and sufficient contrast as baseline requirements.

4. **Mobile-first responsive design.** Many donors and volunteers will interact with the site on their phones.

5. **Secure by default.** Hash passwords with bcrypt, validate and sanitize all inputs, use parameterized queries (Prisma handles this), protect admin routes with middleware, and never expose sensitive data in client bundles.

6. **Docker-first deployment.** The primary deployment path is `docker-compose up`. It should work on a $5/month VPS with no additional configuration beyond environment variables.
