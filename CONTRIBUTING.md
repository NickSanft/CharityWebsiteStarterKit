# Contributing to OpenGood

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/opengood.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and configure your environment
5. Start the database: `docker-compose up db -d`
6. Run migrations: `npm run db:migrate`
7. Seed the database: `npm run db:seed`
8. Start the dev server: `npm run dev`

## Development Workflow

### Branching Strategy

- `main` — stable, production-ready code
- `feature/*` — new features
- `fix/*` — bug fixes
- `docs/*` — documentation changes

### Code Style

- We use ESLint and Prettier for code formatting
- Run `npm run lint` before committing
- Run `npm run format` to auto-format code
- Use TypeScript strict mode — no `any` types without justification

### Testing

- Write tests for new features and bug fixes
- Run tests with `npm test`
- Ensure all tests pass before submitting a PR

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear, descriptive commits
3. Ensure linting and tests pass
4. Submit a PR with a clear description of changes
5. Link any related issues

### PR Checklist

- [ ] Code follows the project's style guidelines
- [ ] Tests added/updated for changes
- [ ] Documentation updated if needed
- [ ] No new TypeScript errors
- [ ] Accessibility considerations addressed

## Accessibility Testing

All contributions must maintain WCAG 2.1 Level AA compliance:

- Use semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<section>`, etc.)
- All interactive elements must be keyboard accessible
- All images must have meaningful `alt` text
- Form inputs must have associated `<label>` elements
- Color contrast must meet minimum ratios (4.5:1 for text, 3:1 for large text)
- Test with keyboard navigation (Tab, Enter, Escape)
- Screen reader testing is encouraged (VoiceOver on Mac, NVDA on Windows)

## Reporting Bugs

Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) to file bugs.

## Requesting Features

Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) to suggest features.

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Please be respectful and constructive in all interactions.
