# Awardly — Monorepo

Reusable paid voting and awards management platform by [Elite Developers](https://elitedevelopers.agency).

## Overview

Awardly is a white-label, configuration-driven platform for running paid voting events — award shows, talent contests, public polls, and more. The same codebase can be redeployed under a different brand by changing configuration, not source code.

## Tech Stack

| Layer | Technology |
|---|---|
| Public & Admin Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Animations | GSAP + AOS.js |
| Dialogs | SweetAlert2 |
| Backend | Node.js + TypeScript (Vercel Functions) |
| Database | Neon PostgreSQL + Drizzle ORM |
| Payments | Paystack |
| Media Storage | Vercel Blob |
| Email | Resend + optional Gmail SMTP |
| Validation | Zod |
| Testing | Vitest |

## Monorepo Structure

```
awardly/
├── apps/
│   ├── web/        # Public-facing website
│   ├── admin/      # Private management application
│   └── api/        # Vercel serverless functions
├── packages/
│   ├── database/   # Drizzle schema, migrations, client
│   ├── validation/ # Zod schemas
│   ├── shared-types/
│   ├── business-logic/
│   ├── auth/
│   └── ui/         # Shared UI components
└── tests/
    ├── unit/
    ├── integration/
    ├── payments/
    └── e2e/
```

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm >= 8
- A Neon PostgreSQL database
- A Paystack account (test mode)
- A Resend account

### Local Development

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Fill in your credentials

# Run database migrations
pnpm db:migrate

# Seed development data
pnpm db:seed

# Start public website
pnpm dev:web

# Start admin application (in a new terminal)
pnpm dev:admin
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values. See the comments in that file for setup instructions.

## Documentation

Full documentation is in the `/docs` directory:

- [`PRD.md`](docs/PRD.md) — Product Requirements
- [`MVP.md`](docs/MVP.md) — Minimum Viable Product scope
- [`EPR.md`](docs/EPR.md) — Engineering & Product Requirements
- [`ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System Architecture
- [`API.md`](docs/API.md) — API Reference
- [`DATABASE.md`](docs/DATABASE.md) — Database Schema
- [`SECURITY.md`](docs/SECURITY.md) — Security Checklist & Practices

## Deployment

Awardly is designed to deploy on Vercel. Each app (`web`, `admin`, `api`) can be deployed as a separate Vercel project from the same monorepo.

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for full deployment instructions.

---

© 2026 Awardly. Developed by [Elite Developers](https://elitedevelopers.agency).
