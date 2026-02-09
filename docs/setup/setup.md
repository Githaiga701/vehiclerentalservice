# 🚀 Vehicle Rental Platform - Complete Setup Guide

## Quick Setup Instructions

### 1. Install Dependencies
```bash
# Install all dependencies
npm install

# Install tsx for running TypeScript files
cd apps/api && npm install tsx --save-dev
```

### 2. Database Setup
```bash
# Navigate to API directory
cd apps/api

# Create .env file
echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/vehicle_rental\"
JWT_SECRET=\"your-super-secret-jwt-key-change-this-in-production\"
JWT_REFRESH_SECRET=\"your-refresh-secret-key-change-this-too\"
PORT=3001" > .env

# Run database migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database with mock users and vehicles
npm run db:seed
```

### 3. Start Development Servers
```bash
# From root directory, start both servers
npm run dev

# Or start individually:
# Backend (from apps/api)
npm run start:dev

# Frontend (from apps/web)
npm run dev
```

## 🧪 Test Accounts

After running the seed script, you can login with these test accounts:

### Regular User (Renter)
- **Phone**: `+254712345678` or `0712345678`
- **OTP**: Any 6-digit number (e.g., `123456`)
- **Name**: John Mwangi

### Vehicle Owner
- **Phone**: `+254723456789` or `0723456789`  
- **OTP**: Any 6-digit number (e.g., `123456`)
- **Name**: Mary Wanjiku
- **KYC Status**: Approved

### Admin User
- **Phone**: `+254790843300` or `0790843300`
- **OTP**: Any 6-digit number (e.g., `123456`)
- **Name**: Admin User
- **KYC Status**: Approved

## 🔧 Features to Test

### 1. Authentication Flow
1. Go to `/register` or `/login`
2. Enter any of the test phone numbers above
3. Enter any 6-digit OTP (the system accepts any valid format for testing)
4. You'll be logged in and redirected appropriately

### 2. KYC Submission
1. Login as a regular user
2. Go to `/kyc`
3. Fill in personal details
4. Use the interactive map to select your location
5. Upload mock files (any image files)
6. Submit for review

### 3. Vehicle Browsing & Booking
1. Go to `/vehicles`
2. Use search and filters to browse vehicles
3. Click on any vehicle to see details
4. Click "Book Now" (requires login and KYC approval)
5. Fill in the comprehensive booking form with:
   - Date and time selection
   - Driver information
   - Optional delivery service with location picker
   - Special requests

### 4. Contact Form
1. Go to `/contact`
2. Fill in the contact form
3. Submit and see success notification

### 5. Location Features
- **KYC Form**: Interactive map for address selection
- **Booking Form**: Pickup/dropoff location selection for delivery
- **Address Search**: Type to get location suggestions
- **Current Location**: Click GPS button to detect current location

## 🛠️ Technical Details

### Backend APIs Available
- `POST /auth/request-otp` - Send OTP
- `POST /auth/verify-otp` - Verify OTP and login
- `GET /auth/me` - Get current user
- `POST /contact` - Submit contact form
- `POST /kyc` - Submit KYC documents
- `GET /vehicles` - List vehicles with filters
- `GET /vehicles/:id` - Get vehicle details
- `POST /bookings` - Create booking
- `GET /bookings/my-bookings` - Get user bookings

### Database Schema
- **Users**: Phone-based authentication with roles
- **Vehicles**: Complete vehicle information with images
- **Bookings**: Comprehensive booking system with location data
- **KYC**: Document verification with location coordinates
- **OTP**: Phone verification system

### Frontend Features
- **Phone-based Authentication**: OTP login/register
- **Interactive Maps**: Leaflet integration for location selection
- **Form Validation**: Zod schemas with React Hook Form
- **Toast Notifications**: Success/error feedback
- **Loading States**: Proper UX with loading indicators
- **Responsive Design**: Mobile-first approach

## 🚨 Important Notes

### OTP System
- **Development Mode**: Accepts any 6-digit number for testing
- **Production**: Would integrate with SMS service (Twilio, Africa's Talking)
- **Console Logging**: Check server console for generated OTP codes

### File Uploads
- **KYC Documents**: Currently simulated (files logged but not stored)
- **Production**: Would integrate with cloud storage (AWS S3, Cloudinary)

### Location Services
- **Maps**: Uses OpenStreetMap (free) via Leaflet
- **Geocoding**: Nominatim API for address search
- **GPS**: Browser geolocation API for current location

## 🔍 Troubleshooting

### Database Issues
```bash
# Reset database
npx prisma migrate reset

# View database
npx prisma studio
```

### Port Conflicts
- Backend runs on port 3001
- Frontend runs on port 3000
- Change ports in package.json if needed

### Environment Variables
Make sure `.env` file exists in `apps/api/` with:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`

## 🎯 What's Working

✅ **Complete Authentication System**
- Phone-based OTP login/register
- JWT token management with refresh
- Role-based access control

✅ **Interactive Location Features**
- Leaflet maps with OpenStreetMap
- Address search and autocomplete
- Current location detection
- Location picker in forms

✅ **Comprehensive Booking System**
- Date/time selection
- Driver information collection
- Delivery service with location picker
- Price calculation
- Booking status management

✅ **Form Integrations**
- All forms connected to backend
- Real-time validation
- Error handling with toast notifications
- Loading states

✅ **Enhanced UI/UX**
- Responsive design
- Loading indicators
- Toast notifications
- Interactive elements

The platform is now fully functional with real backend integration, location services, and improved user experience!