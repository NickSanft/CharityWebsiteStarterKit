# OpenGood

A free, open-source, self-hosted website starter kit for charities and nonprofits. Fork it, brand it, deploy it.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.

## Features

- **Public Website** — Homepage, About, Blog, Events, Contact, Donate, and Volunteer pages
- **Admin Dashboard** — Manage posts, events, volunteers, donations, messages, and site settings
- **Blog Module** — Markdown editor with preview, tagging, cover images, and SEO-friendly URLs
- **Volunteer Management** — Public sign-up form, admin status tracking, interest filtering
- **Donation System** — Stripe integration ready (Phase 2), admin donation tracking
- **Contact Form** — Submissions stored in database, admin inbox with read/unread status
- **Theming & Branding** — Change colors, logo, org name, and contact info from the admin panel
- **Authentication** — Auth.js v5 with credentials provider, JWT sessions, role-based access
- **First-Run Setup** — Guided admin account creation on first visit
- **Docker Ready** — `docker-compose up` and you're running
- **Mobile Responsive** — Every page works on phones, tablets, and desktops
- **Accessible** — Built with semantic HTML, ARIA labels, and keyboard navigation

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui (Radix UI) |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | Auth.js v5 |
| Payments | Stripe (Phase 2) |
| Icons | Lucide React |
| Containerization | Docker + Docker Compose |

## Quick Start

### Prerequisites

- Node.js 20+
- Docker and Docker Compose (for PostgreSQL)

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/opengood.git
cd opengood

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the database
docker-compose up db -d

# Generate Prisma client and run migrations
npm run db:generate
npm run db:migrate

# (Optional) Seed with demo data
npm run db:seed

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

### Demo Credentials

If you ran the seed script:

- **Admin:** admin@greenfield.org / admin123
- **Editor:** editor@greenfield.org / editor123

### First-Run Setup

If you didn't seed the database, visit `/admin/setup` to create your first admin account.

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `AUTH_SECRET` | Random secret for session encryption | Yes |
| `AUTH_URL` | Your site URL | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | For donations |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | For donations |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret | For donations |
| `SMTP_HOST` | SMTP server hostname | For emails |
| `SMTP_PORT` | SMTP server port | For emails |
| `SMTP_USER` | SMTP username | For emails |
| `SMTP_PASS` | SMTP password | For emails |
| `RESEND_API_KEY` | Resend API key (alternative to SMTP) | For emails |
| `NEXT_PUBLIC_SITE_URL` | Public URL of your site | Yes |
| `UPLOAD_DIR` | Directory for file uploads | No (default: ./uploads) |

## Project Structure

```
src/
  app/
    (public)/        # Public-facing pages (Home, About, Blog, etc.)
    admin/           # Admin dashboard and management pages
    api/             # API routes (auth, posts, contact, volunteers, etc.)
  components/
    ui/              # Reusable UI components (shadcn/ui)
    layout/          # Header, Footer, AdminSidebar
    blog/            # Blog-specific components
  lib/               # Prisma client, auth config, email, Stripe, utilities
  config/            # Site and navigation configuration
  types/             # TypeScript type definitions
prisma/
  schema.prisma      # Database schema
  seed.ts            # Demo data seed script
```

## Deployment

### Docker Compose (Recommended)

```bash
# Build and start everything
docker-compose up -d

# Run migrations
docker-compose exec app npx prisma migrate deploy
```

### Manual Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run `npm run build`
4. Run `npx prisma migrate deploy`
5. Run `npm start`

## Roadmap

- [x] **Phase 1:** Foundation — project setup, auth, blog, admin dashboard, theming
- [x] **Phase 2:** Donations — Stripe integration for one-time and recurring donations
- [x] **Phase 3:** Events — event creation, public registration, calendar integration
- [x] **Phase 4:** Volunteers — enhanced volunteer management and communication
- [x] **Phase 5:** Polish — accessibility audit, SEO, performance, email templates

## Contributors

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and distribute.
