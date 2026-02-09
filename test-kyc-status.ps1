# Test KYC Status Script
# This script helps debug KYC status issues

param(
    [Parameter(Mandatory=$false)]
    [string]$Phone = "+254790843300",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "https://vehiclerentalservice.onrender.com"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "KYC Status Checker" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Testing phone: $Phone" -ForegroundColor Yellow
Write-Host "API URL: $ApiUrl`n" -ForegroundColor Yellow

# Step 1: Request OTP
Write-Host "Step 1: Requesting OTP..." -ForegroundColor Cyan
try {
    $body = @{phone = $Phone} | ConvertTo-Json
    $otpResponse = Invoke-RestMethod -Uri "$ApiUrl/auth/request-otp" -Method Post -Body $body -ContentType "application/json"
    Write-Host "SUCCESS: OTP requested" -ForegroundColor Green
    Write-Host "Check Render logs for OTP code`n" -ForegroundColor Gray
} catch {
    Write-Host "ERROR: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

# Step 2: Get OTP from user
Write-Host "Step 2: Enter the OTP code from Render logs" -ForegroundColor Cyan
$otp = Read-Host "Enter OTP"

if ($otp.Length -ne 6) {
    Write-Host "ERROR: OTP must be 6 digits`n" -ForegroundColor Red
    exit 1
}

# Step 3: Verify OTP and get user data
Write-Host "`nStep 3: Verifying OTP and fetching user data..." -ForegroundColor Cyan
try {
    $body = @{
        phone = $Phone
        code = $otp
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/auth/verify-otp" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "`nSUCCESS! User authenticated" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "User Details:" -ForegroundColor White
    Write-Host "ID: $($response.user.id)" -ForegroundColor White
    Write-Host "Phone: $($response.user.phone)" -ForegroundColor White
    Write-Host "Name: $($response.user.name)" -ForegroundColor White
    Write-Host "Email: $($response.user.email)" -ForegroundColor White
    Write-Host "Role: $($response.user.role)" -ForegroundColor $(if ($response.user.role -eq "ADMIN") { "Green" } else { "White" })
    Write-Host "KYC Status: $($response.user.kycStatus)" -ForegroundColor $(
        if ($response.user.kycStatus -eq "APPROVED") { "Green" }
        elseif ($response.user.kycStatus -eq "PENDING") { "Yellow" }
        elseif ($response.user.kycStatus -eq "REJECTED") { "Red" }
        else { "Gray" }
    )
    Write-Host "Trust Score: $($response.user.trustScore)" -ForegroundColor White
    Write-Host "========================================`n" -ForegroundColor Green
    
    # Step 4: Analyze KYC status
    Write-Host "KYC Analysis:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    if ($response.user.kycStatus -eq "APPROVED") {
        Write-Host "KYC Status: APPROVED" -ForegroundColor Green
        Write-Host "Can book vehicles: YES" -ForegroundColor Green
        Write-Host "Should redirect to KYC: NO" -ForegroundColor Green
        Write-Host "`nIf user is being redirected to KYC, there's a bug!" -ForegroundColor Yellow
    }
    elseif ($response.user.kycStatus -eq "PENDING") {
        Write-Host "KYC Status: PENDING" -ForegroundColor Yellow
        Write-Host "Can book vehicles: NO" -ForegroundColor Red
        Write-Host "Should redirect to KYC: YES (to wait for approval)" -ForegroundColor Yellow
    }
    elseif ($response.user.kycStatus -eq "REJECTED") {
        Write-Host "KYC Status: REJECTED" -ForegroundColor Red
        Write-Host "Can book vehicles: NO" -ForegroundColor Red
        Write-Host "Should redirect to KYC: YES (to resubmit)" -ForegroundColor Red
    }
    else {
        Write-Host "KYC Status: NOT SUBMITTED (null)" -ForegroundColor Gray
        Write-Host "Can book vehicles: NO" -ForegroundColor Red
        Write-Host "Should redirect to KYC: YES (to submit)" -ForegroundColor Yellow
    }
    
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    # Step 5: Check role-based access
    Write-Host "Role-Based Access:" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    if ($response.user.role -eq "ADMIN") {
        Write-Host "Role: ADMIN" -ForegroundColor Green
        Write-Host "KYC Required: NO (admins bypass KYC)" -ForegroundColor Green
        Write-Host "Can book vehicles: YES" -ForegroundColor Green
    }
    elseif ($response.user.role -eq "OWNER") {
        Write-Host "Role: OWNER" -ForegroundColor Green
        Write-Host "KYC Required: NO (owners bypass KYC)" -ForegroundColor Green
        Write-Host "Can list vehicles: YES" -ForegroundColor Green
    }
    elseif ($response.user.role -eq "RENTER") {
        Write-Host "Role: RENTER" -ForegroundColor White
        Write-Host "KYC Required: YES (renters need KYC to book)" -ForegroundColor Yellow
        if ($response.user.kycStatus -eq "APPROVED") {
            Write-Host "Can book vehicles: YES" -ForegroundColor Green
        } else {
            Write-Host "Can book vehicles: NO (KYC not approved)" -ForegroundColor Red
        }
    }
    
    Write-Host "========================================`n" -ForegroundColor Cyan
    
} catch {
    Write-Host "ERROR: $($_.Exception.Message)`n" -ForegroundColor Red
    exit 1
}

Write-Host "Test complete!`n" -ForegroundColor Green
