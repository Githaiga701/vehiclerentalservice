# Frontend-Backend Integration Test Plan

## 🎯 Objective

Test all frontend features that depend on backend APIs to ensure seamless integration.

---

## 🔧 Prerequisites

### Backend (Render)
- ✅ API deployed: https://vehiclerentalservice.onrender.com
- ✅ Database connected and seeded
- ✅ CORS configured for Vercel

### Frontend (Vercel)
- ✅ App deployed: https://vehiclerentalservice-api.vercel.app
- ✅ API_URL configured correctly
- ✅ Environment variables set

### Test Accounts
```
👨‍💼 Admin: +254790843300 (or 0790843300)
🏠 Owner: +254723456789 (or 0723456789)
👤 Renter: +254712345678 (or 0712345678)
```

---

## 📋 Test Checklist

### 1. Authentication Flow ✅

#### 1.1 OTP Request
- [ ] Go to `/login` or `/register`
- [ ] Enter phone: `+254790843300`
- [ ] Click "Request OTP"
- [ ] **Expected**: Success message, no CORS errors
- [ ] **Check**: Render logs for OTP code or WhatsApp message

#### 1.2 OTP Verification
- [ ] Enter the OTP received
- [ ] Click "Verify"
- [ ] **Expected**: Redirect to dashboard/home
- [ ] **Check**: User logged in, token stored

#### 1.3 Session Persistence
- [ ] Refresh the page
- [ ] **Expected**: Still logged in
- [ ] Navigate to different pages
- [ ] **Expected**: Auth state maintained

---

### 2. Vehicle Browsing (Public) ✅

#### 2.1 Vehicle List
- [ ] Go to `/explore` or home page
- [ ] **Expected**: See list of vehicles
- [ ] **Check**: Images load, prices display correctly

#### 2.2 Vehicle Filters
- [ ] Use category filter (SUV, Sedan, etc.)
- [ ] Use price range filter
- [ ] Use location filter
- [ ] **Expected**: Results update dynamically

#### 2.3 Vehicle Details
- [ ] Click on a vehicle card
- [ ] **Expected**: Navigate to `/vehicles/[id]`
- [ ] **Check**: All details load (images, specs, pricing)

---

### 3. Booking Flow (Authenticated) ✅

#### 3.1 Create Booking
- [ ] Login as Renter: `+254712345678`
- [ ] Go to a vehicle details page
- [ ] Select dates (start and end)
- [ ] Click "Book Now"
- [ ] **Expected**: Booking created successfully
- [ ] **Check**: Redirect to bookings page

#### 3.2 View Bookings
- [ ] Go to `/bookings`
- [ ] **Expected**: See your bookings list
- [ ] **Check**: Status, dates, vehicle info correct

#### 3.3 Cancel Booking
- [ ] Click "Cancel" on a pending booking
- [ ] Confirm cancellation
- [ ] **Expected**: Booking status updated to CANCELLED
- [ ] **Check**: Status reflects in UI

---

### 4. Owner Dashboard ✅

#### 4.1 Login as Owner
- [ ] Logout current user
- [ ] Login with: `+254723456789`
- [ ] **Expected**: Access to owner dashboard

#### 4.2 List Vehicle
- [ ] Go to `/list-car` or owner dashboard
- [ ] Fill in vehicle details:
  - Title, description, category
  - Daily/monthly price
  - Location, seats, transmission
  - Upload images
- [ ] Submit form
- [ ] **Expected**: Vehicle created successfully
- [ ] **Check**: Vehicle appears in owner's list

#### 4.3 Manage Vehicles
- [ ] Go to `/owner/vehicles`
- [ ] **Expected**: See all your vehicles
- [ ] Edit a vehicle
- [ ] **Expected**: Changes saved
- [ ] Toggle availability
- [ ] **Expected**: Status updated

#### 4.4 View Bookings
- [ ] Go to owner bookings page
- [ ] **Expected**: See bookings for your vehicles
- [ ] Approve/reject a booking
- [ ] **Expected**: Status updated

---

### 5. Admin Dashboard ✅

#### 5.1 Login as Admin
- [ ] Logout current user
- [ ] Login with: `+254790843300`
- [ ] **Expected**: Access to admin dashboard

#### 5.2 Dashboard Stats
- [ ] Go to `/admin/dashboard`
- [ ] **Expected**: See stats:
  - Total users
  - Total vehicles
  - Total bookings
  - Revenue metrics

#### 5.3 Manage Vehicles
- [ ] Go to `/admin/vehicles`
- [ ] **Expected**: See all vehicles (all owners)
- [ ] Approve/reject pending vehicles
- [ ] **Expected**: Status updated

#### 5.4 KYC Approvals
- [ ] Go to `/kyc-approvals`
- [ ] **Expected**: See pending KYC submissions
- [ ] Approve/reject KYC
- [ ] **Expected**: Status updated

#### 5.5 Contact Messages
- [ ] Go to `/admin/messages`
- [ ] **Expected**: See contact form submissions
- [ ] Mark as read/replied
- [ ] **Expected**: Status updated
- [ ] Archive/delete messages
- [ ] **Expected**: Actions work correctly

---

### 6. Contact Form (Public) ✅

#### 6.1 Submit Contact Form
- [ ] Go to `/contact`
- [ ] Fill in form:
  - Name: Test User
  - Email: test@example.com
  - Phone: +254790843300
  - Subject: Test Message
  - Message: Testing contact form
- [ ] Submit form
- [ ] **Expected**: Success message

#### 6.2 Verify in Admin
- [ ] Login as admin
- [ ] Go to `/admin/messages`
- [ ] **Expected**: See the new message
- [ ] **Check**: All details correct

---

### 7. Profile Management ✅

#### 7.1 View Profile
- [ ] Login as any user
- [ ] Go to `/profile`
- [ ] **Expected**: See user details

#### 7.2 Edit Profile
- [ ] Click "Edit Profile"
- [ ] Update name and email
- [ ] Save changes
- [ ] **Expected**: Profile updated successfully

#### 7.3 Upload Profile Picture
- [ ] Click "Upload Picture"
- [ ] Select an image
- [ ] Upload
- [ ] **Expected**: Picture uploaded and displayed

---

### 8. KYC Submission ✅

#### 8.1 Submit KYC
- [ ] Login as Renter: `+254712345678`
- [ ] Go to `/kyc`
- [ ] Fill in KYC form:
  - Full name
  - National ID
  - Address, city
  - Upload ID documents
- [ ] Submit
- [ ] **Expected**: KYC submitted successfully

#### 8.2 Check Status
- [ ] Go to profile
- [ ] **Expected**: KYC status shows "PENDING"

#### 8.3 Admin Approval
- [ ] Login as admin
- [ ] Go to `/kyc-approvals`
- [ ] Approve the KYC
- [ ] **Expected**: Status updated

#### 8.4 Verify User Side
- [ ] Login back as renter
- [ ] Check profile
- [ ] **Expected**: KYC status shows "APPROVED"

---

## 🧪 API Endpoint Tests

### Quick API Health Check

```bash
# Test API is accessible
curl https://vehiclerentalservice.onrender.com/health

# Expected: {"status":"ok","timestamp":"..."}
```

### Test CORS

```javascript
// Open browser console on Vercel app
fetch('https://vehiclerentalservice.onrender.com/health')
  .then(r => r.json())
  .then(d => console.log('✅ CORS working:', d))
  .catch(e => console.error('❌ CORS error:', e));
```

### Test Authentication

```javascript
// Request OTP
fetch('https://vehiclerentalservice.onrender.com/auth/request-otp', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({phone: '+254790843300'})
})
  .then(r => r.json())
  .then(d => console.log('✅ OTP requested:', d))
  .catch(e => console.error('❌ Error:', e));
```

---

## 🔍 What to Check

### For Each Test:

1. **Network Tab**
   - No CORS errors
   - Status codes: 200 (success), 201 (created)
   - Response data correct

2. **Console**
   - No JavaScript errors
   - No API errors
   - Proper error handling

3. **UI/UX**
   - Loading states work
   - Success/error messages display
   - Data updates immediately
   - Navigation works correctly

4. **Backend Logs** (Render)
   - Requests logged
   - No server errors
   - OTP codes visible (if WhatsApp not configured)

---

## ❌ Common Issues to Watch For

### CORS Errors
```
Access to fetch at '...' has been blocked by CORS policy
```
**Fix**: Check CORS_ORIGINS in Render environment variables

### 401 Unauthorized
```
{"statusCode":401,"message":"Unauthorized"}
```
**Fix**: Check token is being sent, user is logged in

### 500 Internal Server Error
```
{"statusCode":500,"message":"Internal server error"}
```
**Fix**: Check Render logs for detailed error

### Network Timeout
```
Failed to fetch
```
**Fix**: Check API is running, Render service is up

---

## 📊 Test Results Template

```
Date: ___________
Tester: ___________

✅ = Pass | ❌ = Fail | ⏭️ = Skipped

[ ] 1. Authentication Flow
[ ] 2. Vehicle Browsing
[ ] 3. Booking Flow
[ ] 4. Owner Dashboard
[ ] 5. Admin Dashboard
[ ] 6. Contact Form
[ ] 7. Profile Management
[ ] 8. KYC Submission

Issues Found:
1. ___________
2. ___________

Notes:
___________
```

---

## 🚀 Quick Test Script

Run this in browser console on your Vercel app:

```javascript
// Comprehensive API Test
const API_URL = 'https://vehiclerentalservice.onrender.com';

async function testAll() {
  console.log('🧪 Starting API tests...\n');
  
  // Test 1: Health Check
  try {
    const health = await fetch(`${API_URL}/health`).then(r => r.json());
    console.log('✅ Health:', health);
  } catch (e) {
    console.error('❌ Health failed:', e.message);
  }
  
  // Test 2: Get Vehicles
  try {
    const vehicles = await fetch(`${API_URL}/vehicles`).then(r => r.json());
    console.log(`✅ Vehicles: ${vehicles.length} found`);
  } catch (e) {
    console.error('❌ Vehicles failed:', e.message);
  }
  
  // Test 3: Request OTP
  try {
    const otp = await fetch(`${API_URL}/auth/request-otp`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({phone: '+254790843300'})
    }).then(r => r.json());
    console.log('✅ OTP:', otp);
  } catch (e) {
    console.error('❌ OTP failed:', e.message);
  }
  
  console.log('\n🎉 Tests complete!');
}

testAll();
```

---

## ✅ Sign-Off

Once all tests pass:

- [ ] All authentication flows work
- [ ] All CRUD operations work
- [ ] No CORS errors
- [ ] No console errors
- [ ] All user roles work correctly
- [ ] Data persists correctly
- [ ] UI updates reflect backend changes

**Ready to commit and deploy!** 🚀

