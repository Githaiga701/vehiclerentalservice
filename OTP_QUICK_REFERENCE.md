# OTP System - Quick Reference Card

## 🚀 Quick Start

### Get OTP (Development)

```powershell
# Request OTP
$body = @{phone="+254700000000"} | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3001/auth/request-otp" -Method Post -Body $body -ContentType "application/json"

# Check server logs for OTP code
# Look for: [AuthService] OTP for +254700000000: 123456
```

### Get OTP (Production with Redis)

```powershell
# 1. Request OTP
$body = @{phone="+254700000000"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://your-api.vercel.app/auth/request-otp" -Method Post -Body $body -ContentType "application/json"

# 2. Login as admin
$body = @{phone="+254700000000";code="any-6-digits"} | ConvertTo-Json
$response = Invoke-RestMethod -Uri "https://your-api.vercel.app/auth/verify-otp" -Method Post -Body $body -ContentType "application/json"
$token = $response.accessToken

# 3. Get all OTPs
$headers = @{Authorization="Bearer $token"}
$otps = Invoke-RestMethod -Uri "https://your-api.vercel.app/auth/admin/otps" -Headers $headers
$otps.otps | Format-Table phone, otp, ttl
```

## 📱 Test Accounts

| Role | Phone | Notes |
|------|-------|-------|
| Admin | +254700000000 | Full access + OTP endpoint |
| Owner | +254723456789 | Vehicle management |
| Renter | +254712345678 | Browse & book |

## 🔑 Admin OTP Endpoint

**Endpoint**: `GET /auth/admin/otps`
**Auth**: Bearer token (Admin only)
**Returns**: List of active OTPs with TTL

## ⚙️ Environment Setup

### Local (No Redis)
```env
# Leave REDIS_URL commented out
# OTPs stored in database
# Check server logs for codes
```

### Production (With Redis)
```env
REDIS_URL=rediss://default:password@your-redis.upstash.io:6379
```

## 📊 Upstash Redis Setup

1. Go to https://console.upstash.com/
2. Create Redis database
3. Copy Redis URL
4. Add to Vercel environment variables
5. Redeploy

## 🧪 Testing Workflow

### Local Development
1. Request OTP → Check logs → Copy code → Login

### Production
1. Request OTP → Call admin endpoint → Get code → Login

## 📝 Key Files

- `apps/api/src/database/redis.service.ts` - Redis service
- `apps/api/src/auth/auth.service.ts` - OTP logic
- `apps/api/src/auth/auth.controller.ts` - Admin endpoint
- `apps/api/.env` - Configuration

## 🔒 Security Notes

⚠️ Admin OTP endpoint is for testing only
⚠️ Add IP whitelist in production
⚠️ Add rate limiting
⚠️ Consider removing after testing

## 📚 Full Documentation

- `REDIS_OTP_SETUP.md` - Complete setup guide
- `REDIS_OTP_TEST_RESULTS.md` - Test results
