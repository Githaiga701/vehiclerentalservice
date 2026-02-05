#!/bin/bash

# Render build script for the API
echo "Starting build process..."

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build the application
npm run build

echo "Build completed successfully!"