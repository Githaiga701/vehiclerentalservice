#!/bin/bash

# Render build script for the API
echo "🚀 Starting build process..."

# Install dependencies with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Run database migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build the application
echo "🏗️ Building application..."
npm run build

# Verify build output
if [ -f "dist/main.js" ]; then
    echo "✅ Build completed successfully!"
    echo "📁 Build output found at dist/main.js"
else
    echo "❌ Build failed - no output file found"
    exit 1
fi

# Verify package.json has start script
echo "🔍 Checking package.json scripts..."
if grep -q '"start"' package.json; then
    echo "✅ Start script found in package.json"
else
    echo "❌ Start script missing from package.json"
    echo "🔧 Adding start script..."
    # Backup approach - ensure start script exists
    npm pkg set scripts.start="node start.js"
fi

# Verify start.js exists
if [ -f "start.js" ]; then
    echo "✅ start.js file found"
else
    echo "❌ start.js file missing"
    exit 1
fi

echo "🎉 Build process completed!"