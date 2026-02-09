# Fix Admin Role Issue

## 🔍 Problem

You logged in with **+254790843300** but it shows as **RENTER** instead of **ADMIN**.

## 🎯 Root Cause

The production database hasn't been reseeded after we changed the admin number from +254700000000 to +254790843300.

**What happened**:
1. You logged in with +254790843300
2. User didn't exist in database
3. System auto-created user with default role: RENTER
4. You're now logged in as RENTER

**What should happen**:
1. Database should have +254790843300 with role: ADMIN
2. Login should recognize you as ADMIN
3. You should see admin dashboard

---

## ✅ Solution Options

### Option 1: Trigger Database Reseed (Recommended - 3 minutes)

The seed file uses `upsert`, so it will update the existing user to ADMIN role.

#### Step 1: Trigger Manual Deploy
1. Go to: https://dashboard.render.com
2. Click your API service
3. Click **Manual Deploy** button (top right)
4. Select **Deploy latest commit**
5. Click **Deploy**
6. Wait 2-3 minutes for deployment

#### Step 2: Verify Seed Ran
1. Click **Logs** tab
2. Look for these messages:
   ```
   🌱 Starting database seed...
   👥 Creating users...
   ✅ Created user: Admin User (ADMIN)
   🎉 Database seeded successfully!
   ```

#### Step 3: Test Login
1. Go to your app
2. Logout (if logged in)
3. Login with: **+254790843300**
4. Get OTP from Render logs
5. Login
6. ✅ Should now show as ADMIN

---

### Option 2: Direct Database Update (If Option 1 doesn't work)

If the seed doesn't update the user, you can update directly in the database.

#### Using Render Dashboard:
1. Go to: https://dashboard.render.com
2. Click your **PostgreSQL database** (not API service)
3. Click **Connect** → **External Connection**
4. Copy the connection string
5. Use a PostgreSQL client (pgAdmin, DBeaver, or psql)
6. Connect to database
7. Run this SQL:

```sql
-- Update user role to ADMIN
UPDATE "User" 
SET role = 'ADMIN', 
    name = 'Admin User',
    email = 'admin@vehiclerent.ke'
WHERE phone = '+254790843300';

-- Verify the update
SELECT id, phone, name, email, role, "isActive" 
FROM "User" 
WHERE phone = '+254790843300';
```

#### Using psql (Command Line):
```bash
# Connect to database
psql "your-connection-string-here"

# Update user
UPDATE "User" SET role = 'ADMIN' WHERE phone = '+254790843300';

# Verify
SELECT phone, name, role FROM "User" WHERE phone = '+254790843300';
```

---

### Option 3: Delete User and Reseed (Clean slate)

If you want to start fresh:

#### Step 1: Delete the User
```sql
-- Delete user (this will cascade delete related records)
DELETE FROM "User" WHERE phone = '+254790843300';
```

#### Step 2: Trigger Reseed
1. Follow Option 1 steps
2. User will be created fresh with ADMIN role

---

## 🧪 Verify Admin Role

After fixing, verify the admin role:

### Test 1: Check User Info
```powershell
# Login and get token
$body = @{phone="+254790843300"; code="123456"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "https://vehiclerentalservice.onrender.com/auth/verify-otp" -Method Post -Body $body -ContentType "application/json"

# Check user role
Write-Host "Role: $($response.user.role)"
# Should show: ADMIN
```

### Test 2: Access Admin Endpoints
```powershell
# Try to access admin endpoint
$token = "your-access-token"
$headers = @{Authorization = "Bearer $token"}
Invoke-RestMethod -Uri "https://vehiclerentalservice.onrender.com/auth/admin/otps" -Headers $headers
# Should work if ADMIN, fail if RENTER
```

### Test 3: Check in App
1. Login to app
2. Go to: `/admin/dashboard`
3. Should see admin dashboard
4. Should see admin menu items

---

## 📊 Current Database State

### What's in Production Now:
```
Phone: +254790843300
Role: RENTER (wrong!)
Created: When you first logged in
```

### What Should Be:
```
Phone: +254790843300
Role: ADMIN (correct!)
Name: Admin User
Email: admin@vehiclerent.ke
```

---

## 🎯 Recommended Steps (Right Now)

### Quick Fix (3 minutes):

1. **Trigger Reseed**
   ```
   Render Dashboard → Your API service → Manual Deploy → Deploy latest commit
   ```

2. **Wait for Deploy**
   ```
   Watch logs for: "Database seeded successfully!"
   ```

3. **Logout and Login Again**
   ```
   Your app → Logout → Login with +254790843300
   ```

4. **Verify Role**
   ```
   Check if you can access /admin/dashboard
   ```

---

## 🔧 Troubleshooting

### Issue: Seed doesn't update the user

**Cause**: The `upsert` might not be working as expected

**Solution**: Use Option 2 (Direct Database Update)

---

### Issue: Can't access database directly

**Cause**: Don't have PostgreSQL client

**Solution**: 
1. Install pgAdmin: https://www.pgadmin.org/download/
2. Or use Render's web shell (if available)
3. Or delete user via API and reseed

---

### Issue: Still showing as RENTER after reseed

**Possible causes**:
1. Seed didn't run (check logs)
2. Wrong phone number
3. Cache issue (logout/login)

**Solution**:
1. Check Render logs for seed messages
2. Verify phone number: +254790843300
3. Clear browser cache and login again
4. Use Option 2 (Direct update)

---

## 📝 Prevention

To prevent this in the future:

### When Changing Admin Number:
1. Update seed file ✅ (done)
2. Trigger manual deploy immediately
3. Verify in logs that seed ran
4. Test login before using

### For New Deployments:
1. Always check seed logs
2. Verify test accounts exist
3. Test admin login first

---

## ✅ Verification Checklist

After fixing:

- [ ] Triggered manual deploy
- [ ] Seed logs show "Created user: Admin User (ADMIN)"
- [ ] Logged out and logged in again
- [ ] User role shows as ADMIN
- [ ] Can access /admin/dashboard
- [ ] Can see admin menu items
- [ ] Admin endpoints work

---

## 🚀 Quick Command

Run this to trigger reseed:

```powershell
# This will show you what to do
Write-Host "1. Go to: https://dashboard.render.com"
Write-Host "2. Click your API service"
Write-Host "3. Click 'Manual Deploy' (top right)"
Write-Host "4. Select 'Deploy latest commit'"
Write-Host "5. Click 'Deploy'"
Write-Host "6. Wait 2-3 minutes"
Write-Host "7. Check logs for: 'Database seeded successfully!'"
Write-Host "8. Logout and login again with +254790843300"
```

---

## 📚 Related Files

- Seed file: `apps/api/prisma/seed.ts`
- Check script: `check-admin-user.ps1`
- Admin number docs: `ADMIN_NUMBER_UPDATE.md`

---

## 💡 Summary

**Problem**: +254790843300 is RENTER, should be ADMIN

**Quick Fix**: 
1. Render Dashboard → Manual Deploy
2. Wait for seed to run
3. Logout and login again

**Time**: 3 minutes

**Alternative**: Direct database update (if needed)

