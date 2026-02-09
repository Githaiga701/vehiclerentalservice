#!/bin/bash
set -e

echo "=== Setting up database ==="

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "DATABASE_URL is set"

# Generate Prisma Client
echo "=== Generating Prisma Client ==="
npx prisma generate

# Push database schema
echo "=== Pushing database schema ==="
npx prisma db push --accept-data-loss --skip-generate

echo "=== Database setup complete ==="
