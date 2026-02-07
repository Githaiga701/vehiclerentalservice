# Deployment Checklist

## ✅ Pre-Deployment Verification

Run the verification script:
```bash
# Windows
powershell -ExecutionPolicy Bypass -File verify-production-ready.ps1

# Linux/Mac
chmod +x verify-production-ready.sh
./verify-production-ready.sh
```

**Expected Result**: All checks pass ✅

---

## 🚀 Deployment Steps

### Step 1: Prepare Repository
```bash
# Commit all changes
git add .
git commit -m "Production ready: PostgreSQL, security hardening, zero errors"

# Push to main branch
git push origin main
```

### Step 2: Deploy Database (Render)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "PostgreSQL"
3. Configure:
   - **Name**: `vehiclerent-db`
   - **Database**: `vehiclerent`
   - **User**: `vehiclerent_user`
   - **Region**: Oregon (or closest to your users)
   - **Plan**: Free (or Starter for production)
4. Click "Create Database"
5. **Copy the Internal Database URL** (starts with `postgresql://`)

### Step 3: Deploy API (Render)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name**: `vehiclerent-api`
   - **Root Directory**: `apps/api`
   - **Environment**: Node
   - **Region**: Same as database
   - **Branch**: `main`
   - **Build Command**:
     ```
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free (or Starter for production)

5. **Add Environment Variables**:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste-internal-database-url-from-step-2>
   JWT_SECRET=<generate-using-command-below>
   JWT_REFRESH_SECRET=<generate-using-command-below>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   PORT=10000
   CORS_ORIGINS=https://your-frontend-domain.vercel.app
   THROTTLE_TTL=60
   THROTTLE_LIMIT=10
   MAX_FILE_SIZE=10485760
   UPLOAD_PATH=./uploads
   ```

   **Generate Secrets**:
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   
   # Windows PowerShell
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   ```

6. Click "Create Web Service"
7. Wait for deployment (5-10 minutes)
8. **Test API**:
   ```bash
   curl https://vehiclerent-api.onrender.com/health
   ```
   Expected: `{"status":"ok",...}`

### Step 4: Deploy Frontend (Vercel)

#### Option A: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd vehiclerentalservice
vercel

# Follow prompts:
# - Framework: Next.js
# - Root Directory: apps/web
# - Build Command: (leave default)
# - Output Directory: (leave default)

# Deploy to production
vercel --prod
```

#### Option B: Vercel Dashboard
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Build Command**: `cd ../.. && pnpm install && cd apps/web && pnpm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `pnpm install`

5. **Add Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://vehiclerent-api.onrender.com
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

6. Click "Deploy"
7. Wait for deployment (3-5 minutes)

### Step 5: Update CORS

After frontend is deployed, update API CORS:

1. Go to Render Dashboard → vehiclerent-api
2. Environment → Edit `CORS_ORIGINS`
3. Add your Vercel URL:
   ```
   https://your-app.vercel.app,https://www.your-domain.com
   ```
4. Save and redeploy

---

## 🔍 Post-Deployment Verification

### 1. Test API Health
```bash
curl https://vehiclerent-api.onrender.com/health
```
Expected:
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T...",
  "environment": "production",
  "uptime": 123.45
}
```

### 2. Test Frontend
Visit: `https://your-app.vercel.app`

Expected:
- ✅ Page loads
- ✅ No console errors
- ✅ API calls work

### 3. Test Authentication
1. Go to `/login`
2. Request OTP
3. Verify OTP works
4. Check JWT token in localStorage

### 4. Test Database
```bash
# From Render dashboard, open database shell
psql $DATABASE_URL

# Check tables
\dt

# Check users
SELECT COUNT(*) FROM "User";
```

---

## 🐛 Troubleshooting

### API Won't Start
**Check Render logs:**
1. Go to Render Dashboard → vehiclerent-api
2. Click "Logs"
3. Look for errors

**Common issues:**
- Missing environment variables
- Database connection failed
- Migration errors

**Solutions:**
```bash
# Verify DATABASE_URL is correct
# Verify JWT_SECRET is set
# Check migration status in logs
```

### Frontend Can't Connect to API
**Check:**
1. `NEXT_PUBLIC_API_URL` is correct
2. CORS is configured with frontend URL
3. API is running (check health endpoint)

**Fix:**
1. Update `CORS_ORIGINS` in Render
2. Redeploy API
3. Clear browser cache

### Database Migration Fails
**Check:**
1. Database is accessible
2. Migration files exist
3. No syntax errors in schema

**Fix:**
```bash
# From local machine with DATABASE_URL set
npx prisma migrate deploy --preview-feature
```

---

## 📊 Monitoring

### Render Metrics
- Go to Render Dashboard → vehiclerent-api
- View: CPU, Memory, Response Time
- Set up alerts for downtime

### Vercel Analytics
- Go to Vercel Dashboard → your-project
- View: Page views, Performance, Errors
- Enable Web Analytics for detailed metrics

### Database Monitoring
- Go to Render Dashboard → vehiclerent-db
- View: Connections, Storage, Performance
- Set up alerts for high usage

---

## 🔄 Updates and Maintenance

### Deploy Updates
```bash
# Make changes
git add .
git commit -m "Update: description"
git push origin main

# Render auto-deploys API
# Vercel auto-deploys frontend
```

### Database Migrations
```bash
# Create migration locally
cd apps/api
pnpm run prisma:migrate:dev --name add_new_feature

# Commit migration
git add prisma/migrations
git commit -m "Migration: add_new_feature"
git push origin main

# Render auto-runs migration on deploy
```

### Rollback
**Render:**
1. Go to Dashboard → vehiclerent-api
2. Click "Manual Deploy"
3. Select previous commit
4. Deploy

**Vercel:**
1. Go to Dashboard → your-project
2. Click "Deployments"
3. Find previous deployment
4. Click "..." → "Promote to Production"

---

## ✅ Deployment Complete!

Your Vehicle Rental Service is now live:

- **API**: https://vehiclerent-api.onrender.com
- **Frontend**: https://your-app.vercel.app
- **Database**: PostgreSQL on Render

**Next Steps:**
1. Set up custom domain
2. Configure SSL (automatic on Render/Vercel)
3. Set up monitoring alerts
4. Configure backup strategy
5. Set up CI/CD pipelines

---

**Deployed**: February 7, 2026  
**Status**: ✅ PRODUCTION  
**Version**: 1.0.0
