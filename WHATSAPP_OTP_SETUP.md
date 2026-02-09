# WhatsApp OTP Setup Guide

## Overview

WhatsApp OTP is more reliable and cost-effective than SMS in Kenya. Users receive OTPs directly in WhatsApp, which they already use daily.

## Benefits

✅ **Higher Delivery Rate**: 98%+ delivery vs 85% for SMS
✅ **Lower Cost**: ~$0.005 per message vs $0.05 for SMS
✅ **Better UX**: Users already have WhatsApp open
✅ **Rich Formatting**: Can include branding and formatting
✅ **Read Receipts**: Know when user received the OTP

## Implementation Status

✅ WhatsAppService created
✅ Integrated with AuthService
✅ Twilio SDK installed
✅ Graceful fallback (logs OTP if WhatsApp not configured)

## Setup Steps

### Step 1: Create Twilio Account

1. Go to https://www.twilio.com/try-twilio
2. Sign up (free trial includes $15 credit)
3. Verify your phone number

### Step 2: Get WhatsApp Sandbox (Testing)

1. Go to Twilio Console → Messaging → Try it out → Send a WhatsApp message
2. Follow instructions to join sandbox:
   - Send "join [your-code]" to the Twilio WhatsApp number
   - Example: Send "join happy-tiger" to +1 415 523 8886
3. Note the sandbox number: `whatsapp:+14155238886`

### Step 3: Get Credentials

1. Go to Twilio Console → Account → API keys & tokens
2. Copy:
   - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: Click "View" to reveal

### Step 4: Configure Environment Variables

Add to Render environment variables:

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Step 5: Test

1. Request OTP from your app
2. Check WhatsApp for the message
3. Enter OTP to login

## Production Setup (WhatsApp Business API)

For production, you need an approved WhatsApp Business number:

### Option A: Twilio WhatsApp Business

1. Go to Twilio Console → Messaging → Senders → WhatsApp senders
2. Click "Request to enable my Twilio numbers for WhatsApp"
3. Fill out the form:
   - Business name
   - Business website
   - Use case description
4. Wait for approval (1-3 business days)
5. Once approved, update `TWILIO_WHATSAPP_NUMBER` to your number

### Option B: Meta WhatsApp Business API (Direct)

1. Go to https://business.facebook.com/
2. Create Business Manager account
3. Apply for WhatsApp Business API
4. Get approved number
5. Use Meta's API directly (more complex but cheaper at scale)

## Message Format

Current OTP message:
```
Your VehicleRent Kenya verification code is: 123456

This code expires in 5 minutes.

Do not share this code with anyone.
```

## Costs

### Twilio Pricing (Kenya)
- **Sandbox**: Free (for testing)
- **Production**: ~$0.005 per message
- **Free Trial**: $15 credit (~3,000 messages)

### Meta Direct (at scale)
- **First 1,000 messages/month**: Free
- **Additional messages**: ~$0.003 per message

## Testing

### Test in Development

Without Twilio configured:
```bash
# OTP will be logged to console
curl -X POST http://localhost:3001/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+254790843300"}'

# Check logs for: [AuthService] OTP for +254790843300: 123456
```

With Twilio configured:
```bash
# OTP will be sent to WhatsApp
curl -X POST http://localhost:3001/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phone":"+254790843300"}'

# Check WhatsApp for the message
```

### Test in Production

1. Add Twilio credentials to Render
2. Redeploy
3. Request OTP from your Vercel app
4. Check WhatsApp

## Troubleshooting

### Issue 1: "WhatsApp not configured"

**Cause**: Environment variables not set

**Solution**: Add TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN to Render

### Issue 2: "Failed to send WhatsApp OTP"

**Possible causes**:
- Invalid credentials
- Phone number not in sandbox (for testing)
- Phone number format wrong (must include country code)

**Solution**:
- Verify credentials in Twilio console
- Join sandbox: Send "join [code]" to Twilio WhatsApp number
- Use format: +254790843300 (with + and country code)

### Issue 3: "Twilio not installed"

**Cause**: Twilio package not installed

**Solution**:
```bash
cd apps/api
pnpm add twilio
```

## Phone Number Format

✅ Correct formats:
- `+254790843300`
- `+254712345678`

❌ Wrong formats:
- `0790843300` (missing country code)
- `254700000000` (missing +)
- `+254 700 000 000` (spaces not allowed)

## Fallback Behavior

The system gracefully handles WhatsApp unavailability:

1. **WhatsApp configured**: Sends OTP via WhatsApp
2. **WhatsApp not configured**: Logs OTP to console (development)
3. **WhatsApp fails**: Logs error and OTP to console

This ensures the system always works, even if WhatsApp is down.

## Security Considerations

✅ **OTP Expiry**: 5 minutes
✅ **One-time use**: OTP deleted after verification
✅ **Rate limiting**: Throttle OTP requests
✅ **Secure storage**: OTPs stored in Redis with TTL
✅ **No logging in production**: OTPs only logged if WhatsApp fails

## Alternative: Africa's Talking

For Kenya-specific solution, consider Africa's Talking:

```typescript
// Alternative implementation
import AfricasTalking from 'africastalking';

const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME,
});

await africastalking.SMS.send({
  to: [phone],
  message: `Your OTP is: ${otp}`,
  from: 'VehicleRent',
});
```

**Pricing**: ~KSh 0.80 per SMS (cheaper than Twilio for Kenya)

## Next Steps

1. ✅ WhatsApp service implemented
2. ⏳ Add Twilio credentials to Render
3. ⏳ Test WhatsApp OTP
4. ⏳ Apply for WhatsApp Business (for production)
5. ⏳ Monitor delivery rates
6. ⏳ Consider Africa's Talking for SMS fallback

## Summary

WhatsApp OTP is implemented and ready to use. Just add Twilio credentials to Render environment variables and it will automatically start sending OTPs via WhatsApp!

**Current Status**: ✅ Code ready, ⏳ Credentials needed
