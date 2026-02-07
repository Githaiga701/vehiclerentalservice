# Manual Testing Guide
**Quick Reference for Testing All Features**

## 🚀 Quick Start

### Servers Running:
- **Web:** http://localhost:3000
- **API:** http://localhost:3001
- **Database:** PostgreSQL (Docker)

### Test Accounts:
| Role | Phone | OTP |
|------|-------|-----|
| Admin | +254700000000 | Check server logs |
| Owner | +254723456789 | Check server logs |
| Renter | +254712345678 | Check server logs |

---

## 📋 Test Checklist

### 1. Admin Vehicle Approval (Priority 1) ⭐

**Steps:**
1. Open http://localhost:3000/login
2. Enter phone: `+254700000000`
3. Click "Request OTP"
4. Check API server logs for OTP (or use: 499160 if still valid)
5. Enter OTP and login
6. Navigate to "Admin Dashboard"
7. Click "Manage Vehicles"
8. **Expected:** See 5 pending vehicles with yellow "PENDING" badges
9. Click "Approve" on first vehicle
10. **Expected:** 
    - Toast notification "Vehicle approved successfully"
    - Vehicle badge changes to green "APPROVED"
    - Pending count decreases to 4
11. Click "Reject" on another vehicle
12. **Expected:**
    - Toast notification "Vehicle rejected"
    - Vehicle badge changes to red "REJECTED"
    - Pending count decreases to 3

**Success Criteria:**
- ✅ Can approve vehicles
- ✅ Can reject vehicles
- ✅ Status updates in real-time
- ✅ Pending count updates
- ✅ Changes persist after refresh

---

### 2. Admin Dashboard (Priority 2)

**Steps:**
1. Login as admin (if not already)
2. Go to http://localhost:3000/admin/dashboard
3. **Expected:** See colorful dashboard with:
   - Total Users stat (blue gradient)
   - Total Vehicles stat (purple gradient)
   - Active Bookings stat (orange gradient)
   - Monthly Revenue stat (green gradient)
   - Quick Actions panel (colorful buttons)
   - Recent Activities panel

**Success Criteria:**
- ✅ Dashboard loads with gradient header
- ✅ Stats display with correct colors
- ✅ Quick action buttons work
- ✅ Navigation to sub-pages works

---

### 3. Vehicle Browsing (Priority 3)

**Steps:**
1. Logout (if logged in)
2. Go to http://localhost:3000/vehicles
3. **Expected:** See only APPROVED vehicles (not pending ones)
4. Test filters:
   - Category filter
   - Location filter
   - Price range
5. Test search functionality
6. Click on a vehicle card
7. **Expected:** Navigate to vehicle details page

**Success Criteria:**
- ✅ Only approved vehicles visible to public
- ✅ Filters work correctly
- ✅ Search works
- ✅ Vehicle details page loads

---

### 4. Authentication Flow (Priority 4)

**Test as Renter:**
1. Go to http://localhost:3000/login
2. Enter: `+254712345678`
3. Request OTP
4. Check server logs for OTP
5. Verify OTP
6. **Expected:** Redirect to home/dashboard
7. Check if user name appears in header
8. Test logout

**Test as Owner:**
1. Login with: `+254723456789`
2. **Expected:** See "My Vehicles" or owner-specific options
3. Navigate to owner dashboard
4. Check owned vehicles

**Success Criteria:**
- ✅ OTP request works
- ✅ OTP verification works
- ✅ Session persists
- ✅ Role-based navigation works
- ✅ Logout works

---

### 5. Admin Users Management (Priority 5)

**Steps:**
1. Login as admin
2. Go to http://localhost:3000/admin/users
3. **Expected:** See user list with:
   - Purple/pink gradient header
   - User cards with avatars
   - Role badges (RENTER, OWNER, ADMIN)
   - KYC status badges
   - Trust scores
4. Test filters (role, KYC status)
5. Test search

**Success Criteria:**
- ✅ User list loads
- ✅ Filters work
- ✅ Search works
- ✅ User details display correctly

---

### 6. Admin Bookings Management (Priority 6)

**Steps:**
1. Login as admin
2. Go to http://localhost:3000/admin/bookings
3. **Expected:** See booking list with:
   - Blue/indigo gradient header
   - Booking cards with status badges
   - Filter options
4. Test status filters
5. Test search

**Success Criteria:**
- ✅ Booking list loads
- ✅ Filters work
- ✅ Status badges display correctly

---

### 7. Admin Reports (Priority 7)

**Steps:**
1. Login as admin
2. Go to http://localhost:3000/admin/reports
3. **Expected:** See:
   - Amber/orange gradient header
   - Colorful metric cards
   - Revenue trend chart placeholder
   - Booking status breakdown
   - Top performing vehicles
   - Top performing owners
4. Test period selector
5. Test export buttons

**Success Criteria:**
- ✅ Reports page loads
- ✅ Metrics display
- ✅ Period selector works
- ✅ Export buttons trigger alerts

---

### 8. Cache Management (Priority 8)

**Steps:**
1. Login as admin
2. Go to http://localhost:3000/admin/cache
3. **Expected:** See:
   - Cyan/blue gradient header
   - Cache Manager tab
   - Cache Tests tab
4. Click "Run Tests" button
5. **Expected:** See test results with pass/fail indicators

**Success Criteria:**
- ✅ Cache page loads
- ✅ Tabs work
- ✅ Tests can be executed
- ✅ Results display correctly

---

## 🐛 Known Issues to Watch For

1. **OTP Expiry:** OTPs expire after 5 minutes
2. **Session Timeout:** May need to re-login after inactivity
3. **Image Loading:** Some vehicle images may be placeholders
4. **Refresh Required:** Some actions may require page refresh

---

## 📊 Expected Results Summary

### Backend (All Passing ✅)
- Health check: OK
- Database: Connected
- 5 vehicles seeded (all PENDING)
- 4 users seeded
- All endpoints mapped

### Frontend (To Test)
- Admin can approve/reject vehicles
- Status updates in real-time
- Colorful, modern UI
- Role-based access control
- Responsive design

---

## 🔍 How to Check Server Logs for OTP

**In your terminal/console:**
Look for lines like:
```
[Nest] 18400  - 02/07/2026, 4:44:15 PM     LOG [AuthService] OTP for +254700000000: 499160
```

The 6-digit number is your OTP.

---

## 💡 Tips

1. **Keep server logs visible** - You'll need OTPs from there
2. **Test in order** - Start with admin approval (most important)
3. **Use Chrome DevTools** - Check console for errors
4. **Test on different screen sizes** - Verify responsive design
5. **Clear browser cache** - If you see stale data

---

## ✅ Success Criteria

**Minimum Viable Test:**
- [ ] Admin can login
- [ ] Admin can see pending vehicles
- [ ] Admin can approve a vehicle
- [ ] Approved vehicle status persists
- [ ] Pending count updates correctly

**Full Test:**
- [ ] All admin pages load with correct styling
- [ ] All CRUD operations work
- [ ] Filters and search work
- [ ] Real-time updates work
- [ ] No console errors
- [ ] Responsive on mobile

---

## 📝 Report Issues

If you find any issues, note:
1. What you were doing
2. What you expected
3. What actually happened
4. Any error messages
5. Browser console errors

---

**Happy Testing! 🎉**
