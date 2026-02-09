# Test OTP with Multiple Phone Numbers

$API_URL = "https://vehiclerentalservice.onrender.com"

$testNumbers = @(
    "+254790843300",  # Admin
    "+254796806058",  # Your number
    "+254712345678",  # Test renter
    "+254722123456"   # Random number
)

Write-Host "`nTesting OTP with Multiple Phone Numbers...`n" -ForegroundColor Cyan

foreach ($phone in $testNumbers) {
    Write-Host "Testing: $phone" -ForegroundColor Yellow
    
    try {
        $body = @{phone = $phone} | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$API_URL/auth/request-otp" -Method Post -Body $body -ContentType "application/json"
        
        if ($response.message -eq "OTP sent successfully") {
            Write-Host "  SUCCESS: OTP sent (expires in $($response.expiresIn)s)" -ForegroundColor Green
            Write-Host "  Check Render logs for OTP code" -ForegroundColor Gray
        } else {
            Write-Host "  FAILED: Unexpected response" -ForegroundColor Red
        }
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Write-Host ""
}

Write-Host "All numbers tested!" -ForegroundColor Cyan
Write-Host "`nTo get OTP codes:" -ForegroundColor Yellow
Write-Host "1. Go to https://dashboard.render.com" -ForegroundColor White
Write-Host "2. Click your API service" -ForegroundColor White
Write-Host "3. Click 'Logs' tab" -ForegroundColor White
Write-Host "4. Look for: [AuthService] OTP for +254XXXXXXXXX: 123456`n" -ForegroundColor White
