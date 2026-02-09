# Vercel Environment Setup Guide

## Issue: OTP Fetch Failing on Vercel

**Problem**: Vercel frontend is trying to connect to `http://localhost:3001` instead of your Render API.

**Solution**: Update the `NEXT_PUBLIC_API_URL` environment variable in Vercel.

## Step-by-Step Fix

### 1. Go to Vercel Dashboard

1. Open https://vercel.com/dashboard
2. Select your project (vehiclerentalservice or similar)
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### 2. Add/Update Environment Variable

**Add this variable**:
```
Name: NEXT_PUBLIC_API_URL
Value: https://vehiclerentalservice.onrender.com
```

**Important Notes**:
- ✅ Use `https://` (not `http://`)
- ✅ No trailing slash at the end
- ✅ Apply to: Production, Preview, and Development

### 3. Redeploy

After saving:
1. Vercel will show a banner: "Redeploy to apply changes"
2. Click **Redeploy** button
3. Wait for deployment to complete (~2-3 minutes)

### 4. Test

Once redeployed:
1. Go to your Vercel app URL
2. Navigate to `/login`
3. Enter phone: `+254700000000`
4. Click "Request OTP"
5. Check Render logs for the OTP code

## All Required Environment Variables for Vercel

Here's the complete list you should have in Vercel:

### Required
```
NEXT_PUBLIC_API_URL=https://vehiclerentalservice.onrender.com
```

### Optional (for production)
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### Analytics (Optional)
```
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## How to Get OTP in Production

Since you can't see console logs in production, you have 3 options:

### Option 1: Check Render Logs (Easiest)

1. Go to https://dashboard.render.com
2. Click your API service
3. Click **Logs** tab
4. Request OTP from your app
5. Look for: `[AuthService] OTP for +254700000000: 123456`

### Option 2: Setup Redis + Admin Endpoint

1. Create Upstash Redis account: https://console.upstash.com
2. Create new Redis database
3. Copy Redis URL
4. Add to Render environment variables:
   ```
   REDIS_URL=rediss://default:password@host.upstash.io:6379
   ```
5. Redeploy Render
6. Use admin endpoint to get OTPs via API

### Option 3: Setup SMS Service (Production Ready)

Integrate with SMS provider:
- Africa's Talking (Kenya)
- Twilio
- AWS SNS

## Verifying the Fix

### Test API Connection

Open browser console on your Vercel app and run:
```javascript
fetch('https://vehiclerentalservice.onrender.com/health')
  .then(r => r.json())
  .then(console.log)
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2026-02-09T..."
}
```

### Test OTP Request

1. Open Network tab in browser DevTools
2. Go to login page
3. Request OTP
4. Check Network tab for the request
5. Should see: `POST https://vehiclerentalservice.onrender.com/auth/request-otp`
6. Status should be: `200 OK`

## Common Issues

### Issue 1: CORS Error
**Error**: "Access to fetch blocked by CORS policy"

**Solution**: Update Render environment variable:
```
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-preview.vercel.app
```

### Issue 2: 404 Not Found
**Error**: "Cannot POST /auth/request-otp"

**Solution**: 
- Check Render API is running
- Verify URL has no typos
- Check Render logs for errors

### Issue 3: Timeout
**Error**: "Request timeout"

**Solution**:
- Render free tier sleeps after 15 min inactivity
- First request takes ~30 seconds to wake up
- Subsequent requests are fast

## Environment Variable Checklist

### Vercel (Frontend)
- [x] `NEXT_PUBLIC_API_URL` = `https://vehiclerentalservice.onrender.com`
- [ ] `NEXT_PUBLIC_APP_URL` = Your Vercel URL (optional)
- [ ] `NODE_ENV` = `production` (optional, auto-set)

### Render (Backend)
- [x] `DATABASE_URL` = PostgreSQL connection string
- [x] `JWT_SECRET` = Auto-generated
- [x] `JWT_REFRESH_SECRET` = Auto-generated
- [x] `CORS_ORIGINS` = Your Vercel URL
- [ ] `REDIS_URL` = Upstash Redis URL (optional)

## Quick Commands

### Check Render API Status
```bash
curl https://vehiclerentalservice.onrender.com/health
```

### Request OTP via API
```bash
curl -X POST https://vehiclerentalservice.onrender.com/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+254700000000"}'
```

### Get OTPs (Admin)
```bash
# First login to get token, then:
curl https://vehiclerentalservice.onrender.com/auth/admin/otps \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. ✅ Update `NEXT_PUBLIC_API_URL` in Vercel
2. ✅ Redeploy Vercel
3. ✅ Test OTP request
4. ✅ Check Render logs for OTP
5. ⏳ Optional: Setup Redis for OTP retrieval
6. ⏳ Optional: Setup SMS service

## Support

If you still have issues:
1. Check Vercel deployment logs
2. Check Render API logs
3. Check browser console for errors
4. Verify environment variables are saved
5. Try a hard refresh (Ctrl+Shift+R)

## Summary

**The Fix**: Set `NEXT_PUBLIC_API_URL=https://vehiclerentalservice.onrender.com` in Vercel and redeploy.

After this, your Vercel frontend will correctly connect to your Render backend, and OTP requests will work!
