# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial project setup with Next.js 15, TypeScript, and Tailwind CSS
- Public pages: Homepage, About, Contact, Blog, Donate, Volunteer
- Admin dashboard with sidebar navigation
- Blog module with Markdown editor and public listing
- Authentication with Auth.js v5 (credentials provider)
- First-run admin setup flow
- Theming system with admin-configurable colors
- Contact form with database storage
- Volunteer sign-up system
- Admin management for posts, volunteers, messages, and settings
- Docker and Docker Compose configuration
- Database schema with Prisma ORM
- Seed script with demo data
- MIT License
- Stripe integration for one-time and recurring donations via Stripe Elements
- Payment processing API (create-intent, webhook handler)
- Donation page with multi-step form (amount selection, donor info, Stripe payment)
- Admin donation management with summary stats (total, monthly, yearly, recurring donors)
- CSV export for donation data
- Embeddable DonationWidget component for homepage/sidebar
- DonationTicker component showing recent anonymized donations
- Public events listing page with upcoming/past events
- Event detail pages with full description, date/time, location (Google Maps links), capacity tracking
- Event registration system with capacity validation and confirmation emails
- "Add to Calendar" .ics file download for individual events
- iCal feed URL for subscribing to all events (/api/events/feed)
- Admin event management: create, edit, publish/draft toggle
- Admin event registrations view with CSV export
- Event form with Markdown editor and preview
- Volunteer confirmation email sent on sign-up
- Admin volunteer detail page with full contact info, interests, message, and status
- Volunteer email outreach from admin (send custom emails to individual volunteers)
- CSV export for volunteer data
- Configurable volunteer interest categories in admin settings
- Public volunteer form dynamically loads interest categories from settings
