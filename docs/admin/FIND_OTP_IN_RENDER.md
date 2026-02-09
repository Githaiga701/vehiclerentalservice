# 🔍 How to Find OTP in Render Logs

## Quick Steps (30 seconds)

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com
   - Login if needed

2. **Click Your API Service**
   - Look for: "vehiclerentalservice" or your API service name
   - Click on it

3. **Click "Logs" Tab**
   - You'll see it in the top navigation
   - Logs will start streaming

4. **Find the OTP**
   - Scroll to the **bottom** (most recent logs)
   - Look for this pattern:
   ```
   [AuthService] OTP for +254790843300: 123456
   ```
   - The 6-digit number is your OTP

5. **Copy and Use**
   - Copy the 6-digit code
   - Go back to your app
   - Enter the OTP
   - Login!

---

## 📸 What You'll See

### Example Log Output:

```
[Nest] 69  - 02/09/2026, 2:45:30 PM     LOG [AuthService] OTP stored in database for user cmlc90msz000b8geouulrn3juo
[Nest] 69  - 02/09/2026, 2:45:30 PM     LOG [AuthService] OTP for +254790843300: 847392
[Nest] 69  - 02/09/2026, 2:45:30 PM     LOG [WhatsAppService] WhatsApp not configured, skipping OTP send
```

**Your OTP**: `847392`

---

## 🎯 Tips

### Tip 1: Use Browser Search
- Press `Ctrl+F` (Windows) or `Cmd+F` (Mac)
- Search for: `OTP for`
- Jump directly to OTP lines

### Tip 2: Filter Logs
- Look for lines with `[AuthService]`
- These contain OTP information

### Tip 3: Refresh if Needed
- If you don't see the OTP, click the refresh icon
- Or scroll down to load more logs

### Tip 4: Check Timestamp
- Make sure the OTP timestamp matches when you requested it
- OTPs expire in 5 minutes

---

## ⚠️ Common Issues

### Issue 1: "I don't see any OTP in logs"

**Possible causes**:
- You're looking at old logs (scroll to bottom)
- OTP request didn't reach the server
- You're looking at the wrong service

**Solution**:
1. Scroll to the very bottom of logs
2. Request OTP again
3. Watch logs update in real-time
4. Look for `[AuthService] OTP for`

---

### Issue 2: "I see multiple OTPs"

**Solution**:
- Use the **most recent** OTP (bottom of logs)
- Each request generates a new OTP
- Old OTPs are invalidated

---

### Issue 3: "OTP says 'Invalid or expired'"

**Possible causes**:
- OTP is older than 5 minutes
- You used an old OTP
- You already used this OTP

**Solution**:
1. Request a new OTP
2. Use it immediately (within 5 minutes)
3. Make sure you're using the latest one

---

## 🔄 Real-Time Testing

### Open Two Windows:

**Window 1**: Your App
```
https://vehiclerentalservice-api.vercel.app/login
```

**Window 2**: Render Logs
```
https://dashboard.render.com
→ Click your service
→ Click "Logs" tab
```

### Workflow:
1. **Window 1**: Enter phone number → Click "Request OTP"
2. **Window 2**: See OTP appear in logs immediately
3. **Window 2**: Copy the 6-digit code
4. **Window 1**: Paste OTP → Click "Verify"
5. ✅ Logged in!

---

## 📱 Alternative: Use PowerShell to Get OTP

If you want to see the OTP without opening Render:

```powershell
# Request OTP
$body = @{phone="+254790843300"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://vehiclerentalservice.onrender.com/auth/request-otp" -Method Post -Body $body -ContentType "application/json"

# Then check Render logs for the OTP
```

---

## 🎯 Quick Reference

| Step | Action | Where |
|------|--------|-------|
| 1 | Request OTP | Your app (login page) |
| 2 | Open Render | https://dashboard.render.com |
| 3 | Click service | Your API service |
| 4 | Click Logs | Top navigation |
| 5 | Find OTP | Search for "OTP for" |
| 6 | Copy code | 6-digit number |
| 7 | Enter OTP | Your app |
| 8 | Login | ✅ Done! |

---

## 🚀 Want to Skip This?

### Enable WhatsApp OTP!

Once WhatsApp is configured:
- ✅ OTP sent directly to WhatsApp
- ✅ No need to check logs
- ✅ Instant delivery (2-3 seconds)
- ✅ Better user experience

**Setup time**: 5 minutes

**See**: `WHATSAPP_OTP_NEXT_STEPS.md` for setup guide

---

## 💡 Pro Tip

**Bookmark this URL** for quick access to logs:
```
https://dashboard.render.com/web/[your-service-id]/logs
```

Replace `[your-service-id]` with your actual service ID from the URL.

---

## ✅ Summary

**To get OTP now**:
1. Go to Render Dashboard
2. Click your service → Logs
3. Request OTP in your app
4. Find `[AuthService] OTP for +254790843300: 123456`
5. Copy the 6-digit code
6. Use it to login

**Time needed**: 30 seconds

**Works**: Immediately (no setup required)

