# Architecture Decision Records

## ADR 1: Next.js as the Framework

**Status:** Accepted

**Context:** We needed a React-based framework that supports server-side rendering, API routes, and static generation for a full-stack web application.

**Decision:** Use Next.js 15 with the App Router.

**Rationale:**
- Full-stack capabilities (pages + API routes) in one framework
- Server Components reduce client-side JavaScript
- Built-in image optimization, font loading, and routing
- Large ecosystem and community
- Excellent TypeScript support
- Vercel and self-hosted deployment options

**Alternatives considered:** Remix, Astro, plain Express + React

---

## ADR 2: PostgreSQL with Prisma ORM

**Status:** Accepted

**Context:** We needed a reliable database with an ORM that provides type safety and easy migrations.

**Decision:** Use PostgreSQL with Prisma ORM.

**Rationale:**
- PostgreSQL is robust, free, and widely available
- Prisma provides auto-generated TypeScript types from the schema
- Prisma Migrate handles schema evolution
- Prisma Client prevents SQL injection by default
- Easy to run in Docker for development and production

**Alternatives considered:** SQLite (too limited for production), MySQL, MongoDB, Drizzle ORM

---

## ADR 3: MIT License

**Status:** Accepted

**Context:** This project is intended for charities and nonprofits to freely use, modify, and deploy.

**Decision:** Use the MIT License.

**Rationale:**
- Maximum freedom for organizations to use, modify, and distribute
- No copyleft restrictions that might concern legal teams
- Compatible with virtually all other open-source licenses
- Simple and well-understood

**Alternatives considered:** Apache 2.0 (more complex), GPL (too restrictive for this use case)

---

## ADR 4: Auth.js v5 for Authentication

**Status:** Accepted

**Context:** We needed authentication with credentials-based login for admin users.

**Decision:** Use Auth.js v5 (next-auth) with the credentials provider and JWT sessions.

**Rationale:**
- Deep Next.js integration
- JWT sessions avoid database lookups on every request
- Credentials provider allows email/password login without third-party dependencies
- Easy to add OAuth providers later (Google, GitHub, etc.)
- Middleware-based route protection

**Alternatives considered:** Lucia Auth, custom JWT implementation, Clerk (SaaS dependency)

---

## ADR 5: Tailwind CSS with shadcn/ui

**Status:** Accepted

**Context:** We needed a styling approach that is easy to customize and produces accessible components.

**Decision:** Use Tailwind CSS v4 with shadcn/ui components (Radix UI primitives).

**Rationale:**
- Tailwind enables rapid UI development with consistent design tokens
- shadcn/ui components are copy-pasted into the project (no external dependency)
- Built on Radix UI, which handles accessibility (ARIA, keyboard navigation, focus management)
- Easy to customize colors and branding via CSS variables
- No runtime CSS-in-JS overhead

**Alternatives considered:** Material UI (too opinionated), Chakra UI (runtime overhead), plain CSS modules

---

## ADR 6: Stripe for Payment Processing

**Status:** Accepted

**Context:** We needed a payment processor for one-time and recurring donations.

**Decision:** Use Stripe with Stripe Elements on the frontend.

**Rationale:**
- Industry standard for online payments
- Stripe Elements handles PCI compliance (we never touch card data)
- Supports both one-time payments and recurring subscriptions
- Webhook-based architecture for reliable payment tracking
- Generous free tier and nonprofit discounts available
- Excellent documentation and SDK

**Alternatives considered:** PayPal (worse developer experience), Square, custom implementation (PCI nightmare)
