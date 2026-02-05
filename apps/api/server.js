#!/usr/bin/env node

// Direct server start script - bypasses npm scripts entirely
console.log('🚀 Direct server start...');
console.log('📁 Working directory:', process.cwd());
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 3001);

const fs = require('fs');
const path = require('path');

// Check if we're in the right directory
const packagePath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packagePath)) {
  console.error('❌ package.json not found in current directory');
  console.error('📍 Current directory:', process.cwd());
  process.exit(1);
}

// Check if dist/main.js exists
const mainPath = path.join(process.cwd(), 'dist', 'main.js');
if (!fs.existsSync(mainPath)) {
  console.error('❌ dist/main.js not found!');
  console.error('📍 Looking for:', mainPath);
  
  // List available files
  const distPath = path.join(process.cwd(), 'dist');
  if (fs.existsSync(distPath)) {
    console.error('📂 Files in dist directory:');
    const files = fs.readdirSync(distPath);
    files.forEach(file => console.error('  -', file));
  } else {
    console.error('📂 dist directory does not exist');
  }
  process.exit(1);
}

console.log('✅ All checks passed, starting application...');

// Start the NestJS application
try {
  require('./dist/main.js');
} catch (error) {
  console.error('❌ Failed to start application:', error.message);
  process.exit(1);
}