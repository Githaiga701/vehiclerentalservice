# Quick Test Guide - Follow These Steps

**Servers Running:**
- ✅ API: http://localhost:3001
- ✅ Web: http://localhost:3000

---

## 🎯 Critical Tests (Do These First)

### Test 1: Homepage ✅
1. Open: http://localhost:3000
2. Check: Page loads without errors
3. Check: Hero section displays
4. Check: Navigation menu works

### Test 2: Login Flow ✅
1. Click "Login" in navigation
2. Enter phone: `+254712345678`
3. Click "Request OTP"
4. Enter any 6-digit code (e.g., `123456`)
5. Click "Verify"
6. Should redirect to homepage (logged in)

### Test 3: Profile Page ✅
1. Click your name/avatar in navigation
2. Go to "Profile"
3. Check: Your info displays
4. Check: Trust score shows

### Test 4: Profile Picture Upload ✅
1. On profile page
2. Click the camera icon on your avatar
3. Select an image file (jpg, png)
4. Wait for upload
5. Check: Picture displays
6. Refresh page
7. Check: Picture still there

### Test 5: Vehicle Listing ✅
1. Click "Vehicles" in navigation
2. Check: 5 vehicles display
3. Click on any vehicle
4. Check: Detail page loads
5. Check: Images display

### Test 6: Admin Dashboard (If Admin) ✅
1. Login with: `+254712345678` (admin account)
2. Go to: http://localhost:3000/admin/dashboard
3. Check: Dashboard loads
4. Check: Stats display

### Test 7: Admin Vehicle Management ✅
1. Go to: http://localhost:3000/admin/vehicles
2. Check: Vehicle list loads
3. Find a "PENDING" vehicle
4. Click "Approve"
5. Check: Status changes to "APPROVED"
6. Check: Success toast appears

---

## 🐛 What to Look For

### ✅ Good Signs:
- Pages load quickly
- No errors in browser console (F12)
- Toast notifications appear
- Data updates immediately
- Images load correctly

### ❌ Bad Signs:
- 500 errors
- Blank pages
- Console errors (red text)
- Infinite loading
- Images don't load

---

## 📝 Report Format

For each test, note:
- ✅ PASS - Works perfectly
- ⚠️ ISSUE - Works but has problems
- ❌ FAIL - Doesn't work

**Example:**
```
Test 1: Homepage
Status: ✅ PASS
Notes: Loads in 2 seconds, all elements visible

Test 4: Profile Picture
Status: ⚠️ ISSUE
Notes: Upload works but takes 10 seconds
```

---

## 🚀 Quick Commands

### Check API Status:
```bash
curl -UseBasicParsing http://localhost:3001/health
```

### Check Web Status:
Open: http://localhost:3000

### View API Logs:
Check the terminal where API is running

### View Web Logs:
Check the terminal where Web is running

---

## 🎯 Success Criteria

All these should work:
- ✅ Can access homepage
- ✅ Can login
- ✅ Can view profile
- ✅ Can upload profile picture
- ✅ Can view vehicles
- ✅ Admin can approve vehicles

If all pass: **READY FOR PRODUCTION** 🎉

---

## 📞 Need Help?

If something doesn't work:
1. Check browser console (F12)
2. Check API terminal for errors
3. Check Web terminal for errors
4. Note the exact error message
5. Tell me what happened

---

**Start testing now! Open http://localhost:3000 in your browser!**

