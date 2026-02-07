#!/bin/bash

# Production Readiness Verification Script
# Run this to verify the monorepo is production-ready

set -e

echo "🔍 Vehicle Rental Service - Production Readiness Verification"
echo "=============================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILURES=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is not installed"
        FAILURES=$((FAILURES + 1))
        return 1
    fi
}

# Function to run test
run_test() {
    local test_name=$1
    local test_command=$2
    
    echo -n "Testing: $test_name... "
    if eval $test_command > /dev/null 2>&1; then
        echo -e "${GREEN}✓ PASS${NC}"
        return 0
    else
        echo -e "${RED}✗ FAIL${NC}"
        FAILURES=$((FAILURES + 1))
        return 1
    fi
}

echo "1. Checking Prerequisites"
echo "-------------------------"
check_command "node"
check_command "pnpm"
check_command "psql"
echo ""

echo "2. Checking Dependencies"
echo "------------------------"
run_test "node_modules exists" "test -d node_modules"
run_test "API node_modules exists" "test -d apps/api/node_modules"
run_test "Web node_modules exists" "test -d apps/web/node_modules"
echo ""

echo "3. Checking Configuration"
echo "-------------------------"
run_test "API .env exists" "test -f apps/api/.env"
run_test "API .env.example exists" "test -f apps/api/.env.example"
run_test "Web .env.example exists" "test -f apps/web/.env.example"
run_test "render.yaml exists" "test -f render.yaml"
run_test ".gitignore includes .env" "grep -q '.env' .gitignore"
echo ""

echo "4. Checking Prisma"
echo "------------------"
run_test "Prisma schema exists" "test -f apps/api/prisma/schema.prisma"
run_test "PostgreSQL provider" "grep -q 'provider = \"postgresql\"' apps/api/prisma/schema.prisma"
run_test "Migration lock exists" "test -f apps/api/prisma/migrations/migration_lock.toml"
run_test "PostgreSQL migration exists" "test -d apps/api/prisma/migrations/20260207000000_init_postgresql"
echo ""

echo "5. Checking Security"
echo "--------------------"
run_test "Helmet in package.json" "grep -q 'helmet' apps/api/package.json"
run_test "Throttler in app.module" "grep -q 'ThrottlerModule' apps/api/src/app.module.ts"
run_test "No default JWT secret in auth.module" "! grep -q 'your-secret-key-change-in-production' apps/api/src/auth/auth.module.ts"
run_test "Health endpoint exists" "grep -q '/health' apps/api/src/main.ts"
echo ""

echo "6. Building Projects"
echo "--------------------"
echo "Building API..."
if cd apps/api && pnpm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ API build successful${NC}"
    cd ../..
else
    echo -e "${RED}✗ API build failed${NC}"
    FAILURES=$((FAILURES + 1))
    cd ../..
fi

echo "Building Web..."
if cd apps/web && pnpm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Web build successful${NC}"
    cd ../..
else
    echo -e "${RED}✗ Web build failed${NC}"
    FAILURES=$((FAILURES + 1))
    cd ../..
fi
echo ""

echo "7. Checking Documentation"
echo "-------------------------"
run_test "Production guide exists" "test -f PRODUCTION_READY_GUIDE.md"
run_test "Summary exists" "test -f PRODUCTION_READINESS_SUMMARY.md"
run_test "README exists" "test -f README.md"
echo ""

echo "=============================================================="
echo ""

if [ $FAILURES -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! All checks passed.${NC}"
    echo -e "${GREEN}✅ The monorepo is PRODUCTION READY!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push to Git: git push origin main"
    echo "2. Deploy API to Render (automatic)"
    echo "3. Deploy Web to Vercel: vercel --prod"
    exit 0
else
    echo -e "${RED}❌ FAILED: $FAILURES check(s) failed.${NC}"
    echo ""
    echo "Please review the failures above and fix them."
    echo "Refer to PRODUCTION_READY_GUIDE.md for help."
    exit 1
fi
