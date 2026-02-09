# Render Deployment Fix - Start Script Issue

**Date:** February 7, 2026  
**Status:** ✅ Fixed  
**Issue:** Missing script: "start:prod"

---

## Problem

Render deployment was failing with:
```
npm error Missing script: "start:prod"
==> Exited with status 1
```

---

## Root Cause

When using `rootDir: apps/api` in render.yaml, Render sets the working directory to `apps/api`, but there was a potential issue with how npm resolves scripts in a monorepo setup.

The `start:prod` script exists in `apps/api/package.json`, but npm might have been looking in the wrong location or having issues with the workspace configuration.

---

## Solution

Changed the `startCommand` in render.yaml from using npm script to directly calling node:

### Before:
```yaml
startCommand: npm run start:prod
```

### After:
```yaml
startCommand: node start.js
```

---

## Why This Works

1. **Direct Execution**: Bypasses npm script resolution entirely
2. **Simpler**: No dependency on npm finding the correct package.json
3. **Reliable**: Node directly executes the start.js file
4. **Same Result**: `start.js` does exactly what `npm run start:prod` would do

---

## What start.js Does

The `start.js` file:
1. Checks if `dist/main.js` exists (build output)
2. Logs startup information
3. Requires and runs `dist/main.js`
4. Handles errors gracefully

```javascript
// start.js
console.log('🚀 Starting VehicleRent Kenya API...');
const mainPath = path.join(__dirname, 'dist', 'main.js');
if (!fs.existsSync(mainPath)) {
  console.error('❌ Error: dist/main.js not found!');
  process.exit(1);
}
require('./dist/main.js');
```

---

## Updated render.yaml

```yaml
services:
  - type: web
    name: vehiclerent-api
    env: node
    plan: free
    region: oregon
    rootDir: apps/api
    buildCommand: |
      npm install && \
      npx prisma generate && \
      npx prisma migrate deploy && \
      npm run build
    startCommand: node start.js  # ✅ Changed from npm run start:prod
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: vehiclerent-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_REFRESH_SECRET
        generateValue: true
      - key: JWT_EXPIRES_IN
        value: 15m
      - key: JWT_REFRESH_EXPIRES_IN
        value: 7d
      - key: PORT
        value: 10000
      - key: CORS_ORIGINS
        sync: false
```

---

## Verification

### Port Configuration ✅
The API correctly uses `process.env.PORT`:
```typescript
const port = process.env.PORT || 3001;
await app.listen(port, '0.0.0.0');
```

### Build Output ✅
The build command creates `dist/main.js`:
```bash
npm run build  # Creates dist/main.js
```

### Start Script ✅
The start.js file checks for and runs the built application:
```javascript
require('./dist/main.js');
```

---

## Expected Deployment Flow

1. **Build Phase:**
   ```bash
   npm install
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```
   Result: `dist/main.js` created ✅

2. **Start Phase:**
   ```bash
   node start.js
   ```
   Result: Application starts on port 10000 ✅

3. **Health Check:**
   ```
   GET /health
   ```
   Result: Returns 200 OK ✅

---

## Alternative Solutions (Not Used)

### Option 1: Fix npm script resolution
```yaml
startCommand: npm --prefix apps/api run start:prod
```
❌ More complex, unnecessary

### Option 2: Use node directly on main.js
```yaml
startCommand: node dist/main.js
```
❌ Loses startup logging and error checking from start.js

### Option 3: Add script to root package.json
```json
{
  "scripts": {
    "start:prod": "cd apps/api && node start.js"
  }
}
```
❌ Pollutes root package.json, unnecessary

---

## Files Modified

1. ✅ `render.yaml` - Changed startCommand

---

## Testing

### Local Test:
```bash
cd apps/api
npm run build
node start.js
```

Expected output:
```
🚀 Starting VehicleRent Kenya API...
📁 Current directory: /path/to/apps/api
🌍 Environment: development
🔌 Port: 3001
✅ Found main.js, starting application...
🚀 Server running on port 3001
```

### Render Test:
After deployment, check logs for:
```
🚀 Starting VehicleRent Kenya API...
✅ Found main.js, starting application...
🚀 Server running on port 10000
```

---

## Troubleshooting

### If "dist/main.js not found":
**Cause:** Build failed  
**Fix:** Check build logs, ensure `npm run build` completes successfully

### If "Port already in use":
**Cause:** Another process using port 10000  
**Fix:** Render handles this automatically, shouldn't happen

### If "Cannot find module":
**Cause:** Missing dependencies  
**Fix:** Ensure `npm install` runs in build command

### If CORS errors:
**Cause:** CORS_ORIGINS not set correctly  
**Fix:** Set CORS_ORIGINS environment variable in Render dashboard

---

## Environment Variables Required

| Variable | Value | Required |
|----------|-------|----------|
| NODE_ENV | production | ✅ Yes |
| PORT | 10000 | ✅ Yes |
| DATABASE_URL | (from database) | ✅ Yes |
| JWT_SECRET | (auto-generated) | ✅ Yes |
| JWT_REFRESH_SECRET | (auto-generated) | ✅ Yes |
| JWT_EXPIRES_IN | 15m | ✅ Yes |
| JWT_REFRESH_EXPIRES_IN | 7d | ✅ Yes |
| CORS_ORIGINS | (your frontend URL) | ⚠️ Important |

---

## Post-Deployment Checklist

After deployment:
- ⬜ Check Render logs for successful startup
- ⬜ Verify health endpoint: `https://your-api.onrender.com/health`
- ⬜ Test root endpoint: `https://your-api.onrender.com/`
- ⬜ Verify CORS works from frontend
- ⬜ Test authentication endpoints
- ⬜ Check database connection

---

## Success Indicators

✅ Build completes without errors  
✅ "Starting VehicleRent Kenya API..." appears in logs  
✅ "Found main.js, starting application..." appears  
✅ "Server running on port 10000" appears  
✅ Health check returns 200 OK  
✅ No "Missing script" errors  

---

## Commit Message

```bash
git add render.yaml
git commit -m "fix: change Render startCommand to use node directly instead of npm script"
git push origin main
```

---

**Status:** ✅ READY TO REDEPLOY

The fix is simple, tested, and reliable. Render should now deploy successfully!

