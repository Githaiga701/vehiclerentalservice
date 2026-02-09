# Make User Admin Script
# This script makes any phone number an admin

param(
    [Parameter(Mandatory=$false)]
    [string]$Phone = "+254790843300",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "https://vehiclerentalservice.onrender.com",
    
    [Parameter(Mandatory=$false)]
    [string]$SecretKey = "change-this-secret-key"
)

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Make User Admin" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Phone Number: $Phone" -ForegroundColor Yellow
Write-Host "API URL: $ApiUrl" -ForegroundColor Yellow
Write-Host ""

# Make admin
Write-Host "Making $Phone an admin..." -ForegroundColor Yellow

try {
    $body = @{
        phone = $Phone
        secretKey = $SecretKey
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$ApiUrl/auth/setup/make-admin" -Method Post -Body $body -ContentType "application/json"
    
    Write-Host "`nSUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "User Details:" -ForegroundColor White
    Write-Host "Phone: $($response.user.phone)" -ForegroundColor White
    Write-Host "Role: $($response.user.role)" -ForegroundColor Green
    Write-Host "Name: $($response.user.name)" -ForegroundColor White
    Write-Host "Email: $($response.user.email)" -ForegroundColor White
    Write-Host "========================================`n" -ForegroundColor Green
    
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Logout from your app (if logged in)" -ForegroundColor White
    Write-Host "2. Login with: $Phone" -ForegroundColor White
    Write-Host "3. You should now have admin access!" -ForegroundColor White
    Write-Host ""
    
} catch {
    $errorMessage = $_.Exception.Message
    
    if ($errorMessage -like "*404*" -or $errorMessage -like "*not found*") {
        Write-Host "`nERROR: User not found" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "The user with phone $Phone doesn't exist yet." -ForegroundColor Yellow
        Write-Host "`nSolution:" -ForegroundColor Cyan
        Write-Host "1. Go to your app and request OTP for $Phone" -ForegroundColor White
        Write-Host "2. This will create the user" -ForegroundColor White
        Write-Host "3. Then run this script again" -ForegroundColor White
        Write-Host ""
    }
    elseif ($errorMessage -like "*403*" -or $errorMessage -like "*Forbidden*") {
        Write-Host "`nERROR: Invalid secret key" -ForegroundColor Red
        Write-Host "========================================" -ForegroundColor Red
        Write-Host "The secret key is incorrect." -ForegroundColor Yellow
        Write-Host "`nSolution:" -ForegroundColor Cyan
        Write-Host "1. Check ADMIN_SETUP_SECRET in Render environment variables" -ForegroundColor White
        Write-Host "2. Use the correct secret key with -SecretKey parameter" -ForegroundColor White
        Write-Host "3. Or update the secret in Render" -ForegroundColor White
        Write-Host ""
    }
    else {
        Write-Host "`nERROR: $errorMessage" -ForegroundColor Red
        Write-Host ""
    }
}

Write-Host "========================================`n" -ForegroundColor Cyan
