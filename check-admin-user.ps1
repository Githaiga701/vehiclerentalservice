# Check Admin User in Database

$API_URL = "https://vehiclerentalservice.onrender.com"
$ADMIN_PHONE = "+254790843300"

Write-Host "`nChecking Admin User Status...`n" -ForegroundColor Cyan

# Step 1: Request OTP to see if user exists
Write-Host "Step 1: Requesting OTP for $ADMIN_PHONE" -ForegroundColor Yellow
try {
    $body = @{phone = $ADMIN_PHONE} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$API_URL/auth/request-otp" -Method Post -Body $body -ContentType "application/json"
    Write-Host "SUCCESS: OTP requested" -ForegroundColor Green
    Write-Host "Message: $($response.message)" -ForegroundColor Gray
    Write-Host "`nCheck Render logs for OTP code" -ForegroundColor Yellow
    Write-Host "Then use the OTP to login and check your role`n" -ForegroundColor Yellow
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nExpected Behavior:" -ForegroundColor Cyan
Write-Host "- If user exists: OTP sent, check role after login" -ForegroundColor White
Write-Host "- If user doesn't exist: New user created as RENTER (default)" -ForegroundColor White
Write-Host "`nAdmin Number: $ADMIN_PHONE" -ForegroundColor Cyan
Write-Host "Expected Role: ADMIN" -ForegroundColor Cyan
Write-Host "`nIf role is RENTER, database needs to be reseeded.`n" -ForegroundColor Yellow
