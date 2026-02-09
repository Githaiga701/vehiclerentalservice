# Frontend-Backend Integration Test Script
$API_URL = "https://vehiclerentalservice.onrender.com"
$FRONTEND_URL = "https://vehiclerentalservice-api.vercel.app"
$TEST_PHONE = "+254790843300"

Write-Host "`nStarting API Integration Tests...`n" -ForegroundColor Cyan

$passed = 0
$failed = 0

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$API_URL/health" -Method Get
    if ($response.status -eq "ok") {
        Write-Host "PASS: API is healthy" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "FAIL: Unexpected response" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""

# Test 2: Get Vehicles
Write-Host "Test 2: Get Vehicles" -ForegroundColor Yellow
try {
    $vehicles = Invoke-RestMethod -Uri "$API_URL/vehicles" -Method Get
    if ($vehicles.Count -gt 0) {
        Write-Host "PASS: Found $($vehicles.Count) vehicles" -ForegroundColor Green
        $passed++
    } else {
        Write-Host "WARN: No vehicles found" -ForegroundColor Yellow
        $passed++
    }
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""

# Test 3: Request OTP
Write-Host "Test 3: Request OTP" -ForegroundColor Yellow
try {
    $body = @{phone = $TEST_PHONE} | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "$API_URL/auth/request-otp" -Method Post -Body $body -ContentType "application/json"
    if ($response.message) {
        Write-Host "PASS: OTP requested successfully" -ForegroundColor Green
        Write-Host "Check Render logs or WhatsApp for OTP code" -ForegroundColor Gray
        $passed++
    } else {
        Write-Host "FAIL: No message in response" -ForegroundColor Red
        $failed++
    }
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""

# Test 4: Contact Form
Write-Host "Test 4: Contact Form Submission" -ForegroundColor Yellow
try {
    $body = @{
        name = "Test User"
        email = "test@example.com"
        phone = $TEST_PHONE
        subject = "Integration Test"
        message = "This is an automated test message."
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$API_URL/contact" -Method Post -Body $body -ContentType "application/json"
    Write-Host "PASS: Contact form submitted" -ForegroundColor Green
    $passed++
} catch {
    Write-Host "FAIL: $($_.Exception.Message)" -ForegroundColor Red
    $failed++
}

Write-Host ""
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($passed + $failed)" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red
$successRate = [math]::Round(($passed / ($passed + $failed)) * 100, 1)
Write-Host "Success Rate: $successRate%" -ForegroundColor $(if ($successRate -ge 80) { "Green" } else { "Yellow" })
Write-Host "=======================================" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "`nAll tests passed! Ready to commit!" -ForegroundColor Green
} else {
    Write-Host "`nSome tests failed. Review errors above." -ForegroundColor Yellow
}

Write-Host ""
