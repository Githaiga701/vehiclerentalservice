# Admin Phone Number Updated

## ✅ Changes Made

Updated admin phone number from `+254700000000` to `+254790843300`

### Files Updated:
- ✅ `apps/api/prisma/seed.ts` - Database seed file
- ✅ All documentation files (19 files)
- ✅ Changes committed and pushed to GitHub

---

## 🔄 Update Production Database

The seed file has been updated, but the existing admin user in the production database still has the old number. You have two options:

### Option 1: Trigger Re-seed (Recommended)

Render will automatically run the seed on next deployment. To trigger it:

1. Go to https://dashboard.render.com
2. Click your API service
3. Click **Manual Deploy** → **Deploy latest commit**
4. Wait for deployment to complete

The seed script uses `upsert`, so it will update the existing admin user with the new phone number.

### Option 2: Manual Database Update (If needed)

If you need to update immediately without redeploying:

1. Go to Render Dashboard
2. Click your PostgreSQL database
3. Click **Connect** → Copy the connection string
4. Use a PostgreSQL client (like pgAdmin or DBeaver) to connect
5. Run this SQL:

```sql
UPDATE "User" 
SET phone = '+254790843300' 
WHERE phone = '+254700000000';
```

---

## 🧪 Testing the New Admin Number

After deployment completes:

1. Go to your app: https://vehiclerentalservice-api.vercel.app/login
2. Enter: **+254790843300** (or **0790843300**)
3. Click "Request OTP"
4. Check WhatsApp (if configured) or Render logs for OTP
5. Enter OTP and login
6. You should see the admin dashboard

---

## 📱 Updated Test Accounts

```
👨‍💼 Admin: +254790843300 (or 0790843300)
🏠 Owner: +254723456789
👤 Renter: +254712345678
```

---

## 🔑 WhatsApp OTP Setup

Don't forget to add the new admin number to WhatsApp sandbox:

1. Open WhatsApp on **+254790843300**
2. Send "join [your-code]" to **+1 415 523 8886**
3. Wait for confirmation
4. Test OTP delivery

---

## ✅ Summary

- ✅ Code updated with new admin number
- ✅ All documentation updated
- ✅ Changes pushed to GitHub
- ⏳ Waiting for Render to redeploy (or trigger manual deploy)
- ⏳ Test login with new number after deployment

**New Admin Phone**: +254790843300

