# 🚀 Render Deployment Guide for VehicleRent Kenya API

## ✅ Fixed Issues
- **ESLint Dependency Conflicts**: Resolved by downgrading to compatible versions
- **Peer Dependencies**: Added `.npmrc` files with `legacy-peer-deps=true`
- **Database Configuration**: Updated to use PostgreSQL for production
- **Build Process**: Added proper build scripts and environment handling
- **Start Script**: Fixed to use `node dist/main.js` for production

## 📋 Pre-Deployment Checklist

### 1. Repository Setup
- ✅ Push all changes to your GitHub repository
- ✅ Ensure `apps/api` folder contains all necessary files
- ✅ Verify `.npmrc` files are committed

### 2. Environment Variables
Set these in Render dashboard:
```bash
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-different-from-jwt
PORT=10000
```

## 🔧 Render Configuration

### Render Dashboard Settings (IMPORTANT - Use These Exact Settings)

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository

2. **Service Configuration**
   ```
   Name: vehiclerent-api
   Environment: Node
   Region: Choose closest to your users
   Branch: main (or your main branch)
   Root Directory: apps/api
   ```

3. **Build & Deploy Settings** (CRITICAL - Copy Exactly)
   ```
   Build Command: npm install --legacy-peer-deps && npx prisma generate && npm run build
   Start Command: npm run start:prod
   ```

4. **Environment Variables**
   Add these in the Environment section:
   ```
   NODE_ENV=production
   JWT_SECRET=your-long-random-secret-key-here
   JWT_REFRESH_SECRET=your-different-long-random-secret-key
   PORT=10000
   DATABASE_URL=(will be auto-set when you add database)
   ```

5. **Database Setup**
   - Click "New" → "PostgreSQL"
   - Name: vehiclerent-db
   - After creation, the DATABASE_URL will be automatically added to your web service

## 🗄️ Database Migration

The database will be automatically migrated during the build process thanks to the `postinstall` script.

## 🔍 Troubleshooting

### If Build Still Fails

1. **Check Build Logs** - Look for specific error messages
2. **Verify Root Directory** - Must be exactly `apps/api`
3. **Check Build Command** - Must include `--legacy-peer-deps`

### If Start Fails

1. **Verify Start Command** - Must be `npm run start:prod`
2. **Check Build Output** - Ensure `dist/main.js` exists
3. **Environment Variables** - Verify all required vars are set

### Common Error Solutions

**"Missing script: start"**
- ✅ Fixed: Updated package.json with correct start scripts

**"Cannot find module"**
- Ensure build completed successfully
- Check that `dist/main.js` exists

**"Database connection failed"**
- Verify DATABASE_URL is set
- Ensure database is in same region

## 📊 Monitoring

### Health Check
Your API includes a health check endpoint at `/` that returns:
```json
{
  "message": "VehicleRent Kenya API is running!",
  "timestamp": "2024-02-05T08:00:00.000Z",
  "environment": "production"
}
```

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Fix start script for Render deployment"
git push origin main
```

### Step 2: Create Database First
1. Go to Render Dashboard
2. Click "New" → "PostgreSQL"
3. Name: `vehiclerent-db`
4. Wait for it to be ready

### Step 3: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repo
3. **Root Directory**: `apps/api`
4. **Build Command**: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
5. **Start Command**: `npm run start:prod`

### Step 4: Add Environment Variables
```
NODE_ENV=production
JWT_SECRET=make-this-very-long-and-random-at-least-32-characters
JWT_REFRESH_SECRET=make-this-different-and-also-very-long-random
PORT=10000
```

### Step 5: Connect Database
1. In your web service settings
2. Go to Environment
3. Add DATABASE_URL and select your PostgreSQL database

### Step 6: Deploy
1. Click "Create Web Service"
2. Wait 5-10 minutes for build and deployment
3. Check logs for any errors

## ✅ Verification

After deployment:
1. Visit your Render URL - should show health check response
2. Test API endpoints: `https://your-app.onrender.com/`
3. Check logs for any errors

## 🎯 Next Steps

1. **Update Frontend**: Change API URL to your Render URL
2. **Test All Features**: Authentication, vehicle listing, bookings
3. **Monitor Performance**: Check response times and error rates

Your API should now deploy successfully! 🎉