# Vehicle Rental Platform

A comprehensive, website-first vehicle rental platform designed for the Kenyan market. This platform connects vehicle owners with renters, emphasizing trust through KYC verification, ratings, and a unique driver payment confirmation system.

## 🏗️ Architecture

This project is a **Monorepo** managed with [Turborepo](https://turbo.build/) and [pnpm](https://pnpm.io/).

- **apps/api**: [NestJS](https://nestjs.com/) backend API.
- **apps/web**: [Next.js](https://nextjs.org/) frontend application.
- **packages/shared**: Shared TypeScript types and utility functions.
- **infra**: Infrastructure configuration (e.g., Docker).

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with [Prisma ORM](https://www.prisma.io/)
- **Authentication**: JWT with Passport.js, phone-based OTP
- **Validation**: class-validator, class-transformer
- **Security**: @nestjs/throttler, Bcrypt

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form, Zod

## ✨ Key Features

- **Phone-based Authentication**: Secure login using OTP.
- **KYC Verification**: Document upload (ID, Selfie, Address) with admin approval workflow.
- **Vehicle Management**: Owners can list vehicles with detailed specifications and manage availability.
- **Booking System**: Streamlined booking flow with owner approval and status tracking.
- **Driver Payment Confirmation**: A unique system for secure payment confirmation via driver-specific links.
- **Trust & Ratings**: Rating system for vehicles, owners, and drivers to build platform trust.
- **Admin Dashboard**: Comprehensive management of KYC, users, bookings, and analytics.

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/) (v9+)
- [Docker](https://www.docker.com/) (for local database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd vehiclerentalservice
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   - Create `.env` in `apps/api/` (refer to the documentation in [PROJECT_STATUS.md](./PROJECT_STATUS.md))
   - Create `.env.local` in `apps/web/`

4. **Start the database:**
   ```bash
   docker-compose up -d
   ```

5. **Run Prisma migrations:**
   ```bash
   cd apps/api
   pnpm prisma:migrate:dev
   ```

6. **Start development servers:**
   ```bash
   cd ../..
   pnpm dev
   ```

## 📂 Project Structure

```
.
├── apps/
│   ├── api/          # NestJS Backend
│   └── web/          # Next.js Frontend
├── packages/
│   └── shared/       # Shared code/types
├── infra/            # Docker & Infrastructure
├── turbo.json        # Turborepo configuration
└── pnpm-workspace.yaml
```

## 📝 Status & Roadmap

The project is currently in active development. For a detailed status report and implementation roadmap, please refer to:
- [PROJECT_STATUS.md](./PROJECT_STATUS.md)
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

## 📄 License

This project is private and confidential.
