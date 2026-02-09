# Vehicle Rental Platform - Setup Guide

## 🚀 Quick Start

This guide will help you set up the complete vehicle rental platform with frontend-backend integration, location features, and improved UI/UX.

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- PostgreSQL database
- Git

## 🛠️ Installation

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <your-repo-url>
cd vehicle-rental-platform

# Install dependencies for all packages
npm install
# or
pnpm install
```

### 2. Database Setup

```bash
# Navigate to API directory
cd apps/api

# Set up your database URL in .env file
cp .env.example .env
# Edit .env and add your DATABASE_URL

# Run database migrations
npx prisma migrate dev --name init
npx prisma generate

# Optional: Seed the database
npx prisma db seed
```

### 3. Environment Configuration

**Backend (.env in apps/api):**
```env
DATABASE_URL="postgresql://username:password@localhost:5432/vehicle_rental"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=3001
```

**Frontend (.env.local in apps/web):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Start Development Servers

```bash
# Start both frontend and backend
npm run dev

# Or start individually:
# Backend
cd apps/api && npm run start:dev

# Frontend (in another terminal)
cd apps/web && npm run dev
```

## 🌟 New Features Implemented

### ✅ Frontend-Backend Integration
- **API Client**: Centralized HTTP client with token management
- **Authentication**: Phone-based OTP login system
- **Form Connections**: All forms now connect to backend APIs
- **Error Handling**: Toast notifications for success/error states
- **Loading States**: Proper loading indicators throughout the app

### ✅ Location Features with Leaflet
- **Interactive Maps**: Leaflet integration for location picking
- **Address Search**: OpenStreetMap Nominatim API for location suggestions
- **Current Location**: GPS-based location detection
- **KYC Integration**: Location picker in KYC form
- **Booking Integration**: Pickup/dropoff location selection

### ✅ Enhanced Forms
- **Login Form**: OTP-based authentication with phone number
- **Contact Form**: Connected to backend with validation
- **KYC Form**: File uploads with location picker
- **Booking Form**: Comprehensive booking with location selection
- **Validation**: Zod schema validation on all forms

### ✅ Improved UI/UX
- **Loading States**: Skeleton loaders and spinners
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success/error feedback
- **Responsive Design**: Mobile-first approach
- **Interactive Elements**: Hover effects and animations

### ✅ Backend APIs
- **Auth Module**: OTP generation and JWT authentication
- **Vehicles Module**: CRUD operations with search/filtering
- **Contact Module**: Contact form submission handling
- **KYC Module**: Document upload and verification
- **Database Schema**: Complete Prisma schema with all relations

## 📱 Features Overview

### Authentication System
- Phone-based OTP login
- JWT token management with refresh
- Role-based access control (OWNER, RENTER, ADMIN)
- Secure token storage and automatic refresh

### Vehicle Management
- Browse vehicles with advanced filtering
- Search by name, location, category
- Sort by price, rating, year
- Real-time availability checking
- Owner dashboard for vehicle management

### Booking System
- Enhanced booking form with date/time selection
- Driver information collection
- Location-based pickup/dropoff
- Price calculation with delivery fees
- Booking status tracking

### KYC Verification
- Document upload (ID front/back, selfie)
- Address verification with map integration
- Status tracking (PENDING, APPROVED, REJECTED)
- Location coordinates storage

### Location Services
- Interactive map with Leaflet
- Address autocomplete and suggestions
- Current location detection
- Distance calculation for delivery
- Kenya-focused location search

## 🔧 API Endpoints

### Authentication
- `POST /auth/request-otp` - Send OTP to phone
- `POST /auth/verify-otp` - Verify OTP and login
- `POST /auth/refresh` - Refresh access token
- `GET /auth/me` - Get current user

### Vehicles
- `GET /vehicles` - List vehicles with filters
- `GET /vehicles/:id` - Get vehicle details
- `POST /vehicles` - Create vehicle (owner only)
- `PUT /vehicles/:id` - Update vehicle
- `DELETE /vehicles/:id` - Delete vehicle
- `GET /vehicles/my-vehicles` - Get owner's vehicles

### KYC
- `POST /kyc` - Submit KYC documents
- `GET /kyc/status` - Get KYC status

### Contact
- `POST /contact` - Submit contact form

## 🗂️ Project Structure

```
vehicle-rental-platform/
├── apps/
│   ├── api/                 # NestJS Backend
│   │   ├── src/
│   │   │   ├── auth/        # Authentication module
│   │   │   ├── vehicles/    # Vehicle management
│   │   │   ├── kyc/         # KYC verification
│   │   │   ├── contact/     # Contact form
│   │   │   └── database/    # Prisma service
│   │   └── prisma/          # Database schema
│   └── web/                 # Next.js Frontend
│       ├── src/
│       │   ├── app/         # App router pages
│       │   ├── components/  # Reusable components
│       │   ├── lib/         # Utilities and API client
│       │   └── types/       # TypeScript types
│       └── public/          # Static assets
├── packages/
│   └── shared/              # Shared utilities
└── docs/                    # Documentation
```

## 🧪 Testing the Integration

### 1. Authentication Flow
1. Go to `/login`
2. Enter a Kenyan phone number (e.g., 0712345678)
3. Click "Send OTP" (check console for OTP code)
4. Enter the OTP to login
5. You'll be redirected to the homepage

### 2. KYC Submission
1. Login first
2. Go to `/kyc`
3. Fill in personal details
4. Use the location picker to select your address
5. Upload ID documents and selfie
6. Submit for review

### 3. Vehicle Browsing
1. Go to `/vehicles`
2. Use search and filters
3. Browse available vehicles
4. Click on a vehicle to see details

### 4. Contact Form
1. Go to `/contact`
2. Fill in the contact form
3. Submit and see success notification

## 🔍 Development Tips

### Database Management
```bash
# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio

# Generate Prisma client after schema changes
npx prisma generate
```

### Debugging
- Backend logs: Check console output in API terminal
- Frontend errors: Check browser console
- Network requests: Use browser dev tools Network tab
- Database queries: Enable Prisma query logging

### Adding New Features
1. Update Prisma schema if needed
2. Create/update backend controllers and services
3. Update API client with new endpoints
4. Create/update frontend components
5. Test the integration

## 🚀 Deployment

### Backend Deployment
1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy to your preferred platform (Heroku, Railway, etc.)

### Frontend Deployment
1. Update `NEXT_PUBLIC_API_URL` to production API URL
2. Build the application: `npm run build`
3. Deploy to Vercel, Netlify, or your preferred platform

## 📞 Support

If you encounter any issues:
1. Check the console logs for errors
2. Verify database connection
3. Ensure all environment variables are set
4. Check that all dependencies are installed

## 🎯 Next Steps

The platform now has:
- ✅ Complete frontend-backend integration
- ✅ Location services with Leaflet
- ✅ Enhanced forms and validation
- ✅ Improved UI/UX with loading states
- ✅ Toast notifications and error handling

Ready for further development and customization!