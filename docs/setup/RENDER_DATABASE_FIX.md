# Fix Render Database - Missing Tables

## Issue
The Render database doesn't have the tables. Error: `The table 'public.User' does not exist`

## Root Cause
The migration from February 7th doesn't include the Contact model we added later. We need to apply the schema to the Render database.

## Solution: Use Render Shell to Push Schema

### Step 1: Open Render Shell

1. Go to https://dashboard.render.com
2. Click your **vehiclerent-api** service
3. Click **Shell** tab (top right corner)
4. Wait for shell to connect

### Step 2: Run These Commands

```bash
cd apps/api
npx prisma db push --accept-data-loss
npx prisma db seed
```

**What this does**:
- `prisma db push` - Syncs your Prisma schema to the database (creates all tables)
- `--accept-data-loss` - Required flag for production (database is empty anyway)
- `prisma db seed` - Seeds the database with initial data (admin user, test vehicles)

### Step 3: Verify

After running the commands, you should see:
```
✔ Database synchronized with Prisma schema
✔ Seeding completed
```

### Step 4: Test OTP Again

Go back to your Vercel app and try requesting OTP again. It should work now!

## Alternative: Update Build Command (For Future Deploys)

To ensure this works on future deploys, we can update the build command to use `db push` instead of `migrate deploy`.

However, for now, just run the shell commands above and it will work immediately.

## After Fix

Once the tables are created:
1. OTP requests will work
2. User registration will work
3. All database operations will work

## Verification

Test in browser console:
```javascript
fetch('https://vehiclerentalservice.onrender.com/auth/request-otp', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({phone: '+254790843300'})
})
  .then(r => r.json())
  .then(console.log)
```

Should return: `{message: "OTP sent successfully", expiresIn: 300}`

Then check Render logs for the OTP code!
