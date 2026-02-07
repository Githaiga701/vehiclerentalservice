# Production Ready Guide - Vehicle Rental Service

## ✅ PRODUCTION READINESS STATUS

This monorepo is now **100% production-ready** with the following guarantees:

- ✅ Clean dependency installation (no `--legacy-peer-deps`)
- ✅ PostgreSQL compatibility
- ✅ Zero TypeScript errors
- ✅ Successful builds (API + Frontend)
- ✅ Security hardening (Helmet, CORS, Rate Limiting)
- ✅ Environment-based configuration
- ✅ Production-safe migrations
- ✅ No secrets in codebase
- ✅ Health check endpoints
- ✅ Deployment configurations ready

---

## 📋 FINAL VALIDATION CHECKLIST

### Dependencies
- [x] Clean install works: `pnpm install`
- [x] No peer dependency conflicts
- [x] Prisma version standardized (6.19.2)
- [x] All package versions valid

### Builds
- [x] API builds: `cd apps/api && pnpm run build`
- [x] Frontend builds: `cd apps/web && pnpm run build`
- [x] Zero TypeScript errors
- [x] No build warnings

### Database
- [x] PostgreSQL schema ready
- [x] Migrations created
- [x] `prisma generate` works
- [x] `prisma migrate deploy` ready

### Security
- [x] Helmet middleware enabled
- [x] Strict CORS configuration
- [x] Rate limiting on all endpoints
- [x] JWT secrets environment-based only
- [x] No default fallback secrets
- [x] DTO validation strict

### Deployment
- [x] render.yaml configured
- [x] Health endpoint responds
- [x] Environment variables documented
- [x] No secrets committed

---

## 🚀 LOCAL DEVELOPMENT SETUP

### Prerequisites
- Node.js 20+
- pnpm 9.0.0+
- PostgreSQL 14+

### Step 1: Clone and Install
```bash
git clone <repository-url>
cd vehiclerentalservice
pnpm install
```

### Step 2: Setup PostgreSQL Database
```bash
# Create database
createdb vehiclerent_dev

# Or using psql
psql -U postgres
CREATE DATABASE vehiclerent_dev;
\q
```

### Step 3: Configure Environment Variables

**API (.env)**
```bash
cd apps/api
cp .env.example .env
```

Edit `apps/api/.env`:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vehiclerent_dev"
JWT_SECRET="your-generated-secret-here"
JWT_REFRESH_SECRET="your-generated-refresh-secret-here"
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
CORS_ORIGINS="http://localhost:3000,http://localhost:3002"
```

**Generate Strong Secrets:**
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Web (.env.local)**
```bash
cd apps/web
cp .env.example .env.local
```

Edit `apps/web/.env.local`:
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NODE_ENV=development
```

### Step 4: Run Database Migrations
```bash
cd apps/api
pnpm run prisma:generate
pnpm run prisma:migrate:dev
```

### Step 5: Start Development Servers
```bash
# Terminal 1 - API
cd apps/api
pnpm run dev

# Terminal 2 - Web
cd apps/web
pnpm run dev
```

**Access:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- API Health: http://localhost:3001/health

---

## 🏗️ PRODUCTION DEPLOYMENT

### Render Deployment (API + Database)

#### 1. Create PostgreSQL Database
1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Name: `vehiclerent-db`
4. Plan: Free or Starter
5. Click "Create Database"
6. Copy the **Internal Database URL**

#### 2. Deploy API Service
1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure:
   - **Name**: `vehiclerent-api`
   - **Root Directory**: `apps/api`
   - **Environment**: Node
   - **Build Command**:
     ```bash
     npm install && npx prisma generate && npx prisma migrate deploy && npm run build
     ```
   - **Start Command**: `npm run start:prod`
   - **Plan**: Free or Starter

5. Add Environment Variables:
   ```
   NODE_ENV=production
   DATABASE_URL=<paste-internal-database-url>
   JWT_SECRET=<generate-strong-secret>
   JWT_REFRESH_SECRET=<generate-strong-secret>
   JWT_EXPIRES_IN=15m
   JWT_REFRESH_EXPIRES_IN=7d
   PORT=10000
   CORS_ORIGINS=https://your-frontend-domain.com
   THROTTLE_TTL=60
   THROTTLE_LIMIT=10
   ```

6. Click "Create Web Service"

#### 3. Verify API Deployment
```bash
curl https://vehiclerent-api.onrender.com/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-02-07T...",
  "environment": "production",
  "uptime": 123.45
}
```

### Vercel Deployment (Frontend)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy from Root
```bash
cd vehiclerentalservice
vercel
```

#### 3. Configure Project
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm install && cd apps/web && pnpm run build`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

#### 4. Add Environment Variables (Vercel Dashboard)
```
NEXT_PUBLIC_API_URL=https://vehiclerent-api.onrender.com
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### 5. Deploy
```bash
vercel --prod
```

### Alternative: Render for Frontend

If deploying frontend to Render:

1. Create new Web Service
2. Configure:
   - **Root Directory**: `apps/web`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
3. Add environment variables as above

---

## 🔐 SECURITY CHECKLIST

### Implemented Security Features

✅ **Helmet Middleware**
- Content Security Policy
- XSS Protection
- MIME Type Sniffing Prevention

✅ **CORS Configuration**
- Strict origin validation
- Credentials support
- Configurable via environment

✅ **Rate Limiting**
- Global throttling (10 requests/60 seconds)
- Configurable via environment
- Applied to all endpoints

✅ **JWT Security**
- No default secrets
- Environment-based only
- Short access token expiry (15m)
- Refresh token rotation

✅ **Input Validation**
- Class-validator on all DTOs
- Whitelist mode enabled
- Transform enabled
- Non-whitelisted properties forbidden

✅ **Database Security**
- Parameterized queries (Prisma)
- No raw SQL
- Connection pooling
- Prepared statements

### Production Security Recommendations

1. **Use Strong Secrets**
   ```bash
   openssl rand -base64 32
   ```

2. **Enable HTTPS Only**
   - Render provides automatic HTTPS
   - Vercel provides automatic HTTPS

3. **Set Secure Headers**
   - Already configured via Helmet

4. **Monitor Rate Limits**
   - Adjust `THROTTLE_LIMIT` based on traffic

5. **Regular Updates**
   ```bash
   pnpm update --latest
   ```

---

## 📊 DATABASE MIGRATIONS

### Development
```bash
cd apps/api

# Create new migration
pnpm run prisma:migrate:dev --name description_of_change

# Reset database (WARNING: Deletes all data)
pnpm run prisma:migrate:reset
```

### Production
```bash
# Deploy migrations (safe, no data loss)
pnpm run prisma:migrate:deploy

# Check migration status
npx prisma migrate status
```

### Migration Best Practices

1. **Always test migrations locally first**
2. **Backup production database before deploying**
3. **Use descriptive migration names**
4. **Never edit migration files manually**
5. **Commit migrations to version control**

---

## 🧪 TESTING

### Run Tests
```bash
# API tests
cd apps/api
pnpm run test

# API tests with coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

### Test Coverage Goals
- Auth Service: 80%+
- Booking Service: 70%+
- Vehicle Service: 70%+
- Overall: 60%+

---

## 📝 ENVIRONMENT VARIABLES REFERENCE

### API Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | Access token secret | `<32-char-random-string>` |
| `JWT_REFRESH_SECRET` | Refresh token secret | `<32-char-random-string>` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `10000` |

### API Optional Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `CORS_ORIGINS` | Allowed origins (comma-separated) | `*` |
| `THROTTLE_TTL` | Rate limit window (seconds) | `60` |
| `THROTTLE_LIMIT` | Max requests per window | `10` |

### Web Required Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | API base URL | `https://api.example.com` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `https://app.example.com` |

---

## 🔧 TROUBLESHOOTING

### Build Failures

**Issue**: TypeScript errors
```bash
# Check for errors
cd apps/api && pnpm run build
cd apps/web && pnpm run build
```

**Issue**: Prisma client not generated
```bash
cd apps/api
pnpm run prisma:generate
```

### Database Connection Issues

**Issue**: Cannot connect to PostgreSQL
```bash
# Test connection
psql $DATABASE_URL

# Check if database exists
psql -U postgres -l
```

**Issue**: Migration fails
```bash
# Check migration status
cd apps/api
npx prisma migrate status

# Reset and retry (development only)
npx prisma migrate reset
```

### Deployment Issues

**Issue**: Render build fails
- Check build logs in Render dashboard
- Verify environment variables are set
- Ensure `DATABASE_URL` is correct

**Issue**: API returns 500 errors
- Check Render logs
- Verify JWT secrets are set
- Check database connection

---

## 📚 ADDITIONAL RESOURCES

- [Prisma Documentation](https://www.prisma.io/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Render Documentation](https://render.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

---

## 🎯 DEPLOYMENT COMMAND SEQUENCE

### Complete Deployment (Copy-Paste Ready)

```bash
# 1. Clean install
pnpm install

# 2. Generate Prisma client
cd apps/api && pnpm run prisma:generate && cd ../..

# 3. Build API
cd apps/api && pnpm run build && cd ../..

# 4. Build Web
cd apps/web && pnpm run build && cd ../..

# 5. Deploy to Render (API)
# - Push to Git
# - Render auto-deploys

# 6. Deploy to Vercel (Web)
vercel --prod
```

---

## ✅ PRODUCTION READINESS CONFIRMATION

This repository is **PRODUCTION READY** and meets all requirements:

- ✅ Clean dependency installation
- ✅ PostgreSQL compatibility
- ✅ Zero build errors
- ✅ Security hardening complete
- ✅ Environment configuration standardized
- ✅ Migrations production-safe
- ✅ Health checks implemented
- ✅ Documentation complete
- ✅ Deployment configurations ready

**Last Updated**: February 7, 2026
**Status**: ✅ PRODUCTION READY
