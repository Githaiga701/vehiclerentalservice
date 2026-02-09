# 🚀 Quick Test Reference Card

## URLs
- **Web:** http://localhost:3000
- **API:** http://localhost:3001
- **Admin Dashboard:** http://localhost:3000/admin/dashboard
- **Admin Vehicles:** http://localhost:3000/admin/vehicles

## Test Accounts
| Phone | Role | Use For |
|-------|------|---------|
| +254790843300 | ADMIN | Vehicle approval testing |
| +254723456789 | OWNER | Owner dashboard testing |
| +254712345678 | RENTER | Booking testing |

## OTP
Check server logs for OTP. Look for:
```
LOG [AuthService] OTP for +254790843300: 499160
```

## Priority Test: Vehicle Approval ⭐

1. Go to: http://localhost:3000/login
2. Phone: `+254790843300`
3. Get OTP from server logs
4. Login → Admin Dashboard → Manage Vehicles
5. **Should see:** 5 pending vehicles
6. Click "Approve" on first vehicle
7. **Should see:** Green badge, toast notification, count decreases
8. Refresh page
9. **Should see:** Changes persist

## Quick Checks

### ✅ Backend Health
```bash
curl http://localhost:3001/health
```
Should return: `{"status":"ok"}`

### ✅ Vehicles API
```bash
curl http://localhost:3001/vehicles
```
Should return: 5 vehicles (all PENDING)

### ✅ Web Server
Open: http://localhost:3000
Should load: Landing page

## Expected Results

| Test | Expected |
|------|----------|
| Pending vehicles | 5 |
| Approved vehicles | 0 (initially) |
| Admin can approve | ✅ Yes |
| Admin can reject | ✅ Yes |
| Status persists | ✅ Yes |
| Public sees pending | ❌ No |
| Public sees approved | ✅ Yes |

## Color Coding

| Page | Header Gradient |
|------|----------------|
| Dashboard | Indigo → Purple → Pink |
| Vehicles | Emerald → Teal → Cyan |
| Users | Purple → Pink → Rose |
| Bookings | Blue → Indigo → Purple |
| Reports | Amber → Orange → Red |
| Cache | Cyan → Blue → Indigo |

## Status Badges

| Status | Color |
|--------|-------|
| PENDING | Yellow |
| APPROVED | Green |
| REJECTED | Red |
| Available | Blue |
| Unavailable | Gray |

## Success = ✅
- Admin login works
- 5 pending vehicles visible
- Approve button works
- Status updates in real-time
- Changes persist after refresh

## Failure = ❌
- Can't login
- No vehicles shown
- Approve button doesn't work
- Status doesn't update
- Changes lost after refresh

---

**If all ✅ = System Working Perfectly! 🎉**
