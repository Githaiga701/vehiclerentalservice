# Production Readiness Verification Script (PowerShell)
# Run this to verify the monorepo is production-ready

$ErrorActionPreference = "Continue"

Write-Host "Vehicle Rental Service - Production Readiness Verification" -ForegroundColor Cyan
Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

$Failures = 0

# Function to check command
function Test-Command {
    param($CommandName)
    
    if (Get-Command $CommandName -ErrorAction SilentlyContinue) {
        Write-Host "OK $CommandName is installed" -ForegroundColor Green
        return $true
    } else {
        Write-Host "FAIL $CommandName is not installed" -ForegroundColor Red
        $script:Failures++
        return $false
    }
}

# Function to run test
function Test-Condition {
    param(
        [string]$TestName,
        [scriptblock]$TestScript
    )
    
    Write-Host "Testing: $TestName... " -NoNewline
    try {
        $result = & $TestScript
        if ($result) {
            Write-Host "PASS" -ForegroundColor Green
            return $true
        } else {
            Write-Host "FAIL" -ForegroundColor Red
            $script:Failures++
            return $false
        }
    } catch {
        Write-Host "FAIL" -ForegroundColor Red
        $script:Failures++
        return $false
    }
}

Write-Host "1. Checking Prerequisites" -ForegroundColor Yellow
Write-Host "-------------------------"
Test-Command "node"
Test-Command "pnpm"
Write-Host ""

Write-Host "2. Checking Dependencies" -ForegroundColor Yellow
Write-Host "------------------------"
Test-Condition "node_modules exists" { Test-Path "node_modules" }
Test-Condition "API node_modules exists" { Test-Path "apps/api/node_modules" }
Test-Condition "Web node_modules exists" { Test-Path "apps/web/node_modules" }
Write-Host ""

Write-Host "3. Checking Configuration" -ForegroundColor Yellow
Write-Host "-------------------------"
Test-Condition "API .env exists" { Test-Path "apps/api/.env" }
Test-Condition "API .env.example exists" { Test-Path "apps/api/.env.example" }
Test-Condition "Web .env.example exists" { Test-Path "apps/web/.env.example" }
Test-Condition "render.yaml exists" { Test-Path "render.yaml" }
Test-Condition ".gitignore includes .env" { 
    (Get-Content ".gitignore" -Raw) -match "\.env" 
}
Write-Host ""

Write-Host "4. Checking Prisma" -ForegroundColor Yellow
Write-Host "------------------"
Test-Condition "Prisma schema exists" { Test-Path "apps/api/prisma/schema.prisma" }
Test-Condition "PostgreSQL provider" { 
    (Get-Content "apps/api/prisma/schema.prisma" -Raw) -match 'provider = "postgresql"' 
}
Test-Condition "Migration lock exists" { Test-Path "apps/api/prisma/migrations/migration_lock.toml" }
Test-Condition "PostgreSQL migration exists" { Test-Path "apps/api/prisma/migrations/20260207000000_init_postgresql" }
Write-Host ""

Write-Host "5. Checking Security" -ForegroundColor Yellow
Write-Host "--------------------"
Test-Condition "Helmet in package.json" { 
    (Get-Content "apps/api/package.json" -Raw) -match "helmet" 
}
Test-Condition "Throttler in app.module" { 
    (Get-Content "apps/api/src/app.module.ts" -Raw) -match "ThrottlerModule" 
}
Test-Condition "No default JWT secret" { 
    -not ((Get-Content "apps/api/src/auth/auth.module.ts" -Raw) -match "your-secret-key-change-in-production")
}
Test-Condition "Health endpoint exists" { 
    (Get-Content "apps/api/src/main.ts" -Raw) -match "/health" 
}
Write-Host ""

Write-Host "6. Checking Documentation" -ForegroundColor Yellow
Write-Host "-------------------------"
Test-Condition "Production guide exists" { Test-Path "PRODUCTION_READY_GUIDE.md" }
Test-Condition "Summary exists" { Test-Path "PRODUCTION_READINESS_SUMMARY.md" }
Test-Condition "README exists" { Test-Path "README.md" }
Write-Host ""

Write-Host "==============================================================" -ForegroundColor Cyan
Write-Host ""

if ($Failures -eq 0) {
    Write-Host "SUCCESS! All checks passed." -ForegroundColor Green
    Write-Host "The monorepo is PRODUCTION READY!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:"
    Write-Host "1. Push to Git: git push origin main"
    Write-Host "2. Deploy API to Render (automatic)"
    Write-Host "3. Deploy Web to Vercel: vercel --prod"
    exit 0
} else {
    Write-Host "FAILED: $Failures check(s) failed." -ForegroundColor Red
    Write-Host ""
    Write-Host "Please review the failures above and fix them."
    Write-Host "Refer to PRODUCTION_READY_GUIDE.md for help."
    exit 1
}
