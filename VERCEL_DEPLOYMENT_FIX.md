# Vercel Deployment Fix - Function Invocation Failed

**Date:** February 7, 2026  
**Status:** 🔧 In Progress  
**API Status:** ✅ Live on Render  
**Web Status:** ❌ Needs Environment Variable  

---

## Problem

Vercel shows:
```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
```

---

## Root Cause

The `NEXT_PUBLIC_API_URL` environment variable is not set in Vercel, so the app doesn't know where to connect to the API.

---

## Solution

### Step 1: Set Environment Variable in Vercel

1. **Go to:** https://vercel.com/dashboard
2. **Select your project** (vehiclerentalservice or similar)
3. **Click:** Settings (top navigation)
4. **Click:** Environment Variables (left sidebar)
5. **Click:** Add New
6. **Set:**
   - **Key:** `NEXT_PUBLIC_API_URL`
   - **Value:** `https://vehiclerentalservice.onrender.com`
   - **Environments:** Check all three boxes:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
7. **Click:** Save
8. **Go to:** Deployments tab
9. **Click:** ... (three dots) on latest deployment
10. **Click:** Redeploy
11. **Select:** Use existing Build Cache (faster)
12. **Click:** Redeploy

---

### Step 2: Update CORS on Render API

Your API needs to accept requests from Vercel:

1. **Go to:** https://dashboard.render.com
2. **Click:** vehiclerent-api service
3. **Click:** Environment (left sidebar)
4. **Find:** `CORS_ORIGINS` variable
5. **Edit or Add:**
   - **Key:** `CORS_ORIGINS`
   - **Value:** `https://your-vercel-app.vercel.app` (replace with your actual Vercel URL)
   - If you have multiple domains, separate with commas:
     ```
     https://your-app.vercel.app,https://your-app-preview.vercel.app
     ```
6. **Click:** Save Changes
7. Service will auto-redeploy

---

## How to Find Your Vercel URL

1. Go to Vercel dashboard
2. Click on your project
3. Look at the top - you'll see the URL like:
   - `https://vehiclerentalservice.vercel.app`
   - or `https://your-custom-domain.com`
4. Copy that URL

---

## Expected Result

After setting the environment variable and redeploying:

### Vercel Logs Should Show:
```
✓ Compiled successfully
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

### Your App Should:
- ✅ Load without 500 error
- ✅ Show the homepage
- ✅ Connect to API successfully
- ✅ Allow login/registration

---

## Verification Steps

After redeployment:

1. **Visit your Vercel URL**
2. **Check homepage loads** (no 500 error)
3. **Open browser console** (F12)
4. **Check for errors** (should be none)
5. **Try to login** (should work)
6. **Check Network tab** (API calls should go to Render URL)

---

## Common Issues

### Issue 1: Still Getting 500 Error
**Cause:** Environment variable not applied  
**Fix:** 
- Make sure you clicked "Save" after adding the variable
- Make sure you redeployed after saving
- Try "Redeploy" without cache

### Issue 2: CORS Error
**Symptom:** Console shows "blocked by CORS policy"  
**Fix:** 
- Update `CORS_ORIGINS` in Render to include your Vercel URL
- Make sure there are no typos in the URL
- Include both production and preview URLs

### Issue 3: API Not Responding
**Symptom:** Network requests timeout  
**Fix:**
- Check Render API is still running (should show "Live")
- Test API directly: `https://vehiclerentalservice.onrender.com/health`
- Should return: `{"status":"ok"}`

---

## Environment Variables Summary

### Vercel (Web App)
| Variable | Value | Required |
|----------|-------|----------|
| NEXT_PUBLIC_API_URL | https://vehiclerentalservice.onrender.com | ✅ Yes |

### Render (API)
| Variable | Value | Required |
|----------|-------|----------|
| CORS_ORIGINS | https://your-app.vercel.app | ✅ Yes |
| DATABASE_URL | postgresql://... | ✅ Yes (already set) |
| NODE_ENV | production | ✅ Yes (already set) |
| PORT | 10000 | ✅ Yes (already set) |
| JWT_SECRET | (auto-generated) | ✅ Yes (already set) |

---

## Testing the Connection

### Test 1: API Health Check
```bash
curl https://vehiclerentalservice.onrender.com/health
```
Expected: `{"status":"ok"}`

### Test 2: API Root
```bash
curl https://vehiclerentalservice.onrender.com/
```
Expected: 
```json
{
  "message": "VehicleRent Kenya API",
  "version": "1.0.0",
  "health": "/health"
}
```

### Test 3: Frontend Loads
Visit: `https://your-app.vercel.app`  
Expected: Homepage loads without errors

---

## Quick Checklist

Before testing:
- ⬜ `NEXT_PUBLIC_API_URL` set in Vercel
- ⬜ All three environments checked (Production, Preview, Development)
- ⬜ Saved the environment variable
- ⬜ Redeployed the Vercel app
- ⬜ `CORS_ORIGINS` set in Render
- ⬜ Render API is live and running
- ⬜ Waited for both deployments to complete

After deployment:
- ⬜ Vercel deployment shows "Ready"
- ⬜ No 500 errors on homepage
- ⬜ Browser console has no errors
- ⬜ Can navigate between pages
- ⬜ API calls work (check Network tab)

---

## Screenshots to Help

### Vercel Environment Variables
```
Settings → Environment Variables → Add New

┌─────────────────────────────────────────┐
│ Key: NEXT_PUBLIC_API_URL                │
│ Value: https://vehiclerentalservice...  │
│                                         │
│ ☑ Production                            │
│ ☑ Preview                               │
│ ☑ Development                           │
│                                         │
│ [Save]                                  │
└─────────────────────────────────────────┘
```

### Render Environment Variables
```
Environment → Add Environment Variable

┌─────────────────────────────────────────┐
│ Key: CORS_ORIGINS                       │
│ Value: https://your-app.vercel.app      │
│                                         │
│ [Save Changes]                          │
└─────────────────────────────────────────┘
```

---

## Success Indicators

✅ Vercel deployment shows "Ready"  
✅ No 500 errors when visiting site  
✅ Homepage loads correctly  
✅ Can navigate to different pages  
✅ Login page loads  
✅ API calls work (check Network tab)  
✅ No CORS errors in console  

---

## Next Steps After Success

1. ✅ Test login functionality
2. ✅ Test registration
3. ✅ Test vehicle listing
4. ✅ Test admin dashboard
5. ✅ Test profile page
6. ✅ Test profile picture upload

---

**Status:** Waiting for environment variable configuration

**Action Required:** Set `NEXT_PUBLIC_API_URL` in Vercel dashboard

**ETA:** 2-3 minutes after setting variable and redeploying

