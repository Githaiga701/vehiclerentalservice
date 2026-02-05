#!/usr/bin/env node

// Simple start script for production
console.log('🚀 Starting VehicleRent Kenya API...');
console.log('📁 Current directory:', process.cwd());
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || 3001);

// Check if main.js exists
const fs = require('fs');
const path = require('path');

const mainPath = path.join(__dirname, 'dist', 'main.js');
if (!fs.existsSync(mainPath)) {
  console.error('❌ Error: dist/main.js not found!');
  console.error('📍 Looking for:', mainPath);
  console.error('📂 Available files in dist:');
  try {
    const distFiles = fs.readdirSync(path.join(__dirname, 'dist'));
    distFiles.forEach(file => console.error('  -', file));
  } catch (e) {
    console.error('  dist directory not found');
  }
  process.exit(1);
}

console.log('✅ Found main.js, starting application...');

// Start the application
require('./dist/main.js');