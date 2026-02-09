const { execSync } = require('child_process');

console.log('=== Setting up database ===');

// Check DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set');
  process.exit(1);
}

console.log('DATABASE_URL is set');

try {
  // Generate Prisma Client
  console.log('=== Generating Prisma Client ===');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Push database schema
  console.log('=== Pushing database schema ===');
  execSync('npx prisma db push --accept-data-loss --skip-generate', { stdio: 'inherit' });
  
  console.log('=== Database setup complete ===');
} catch (error) {
  console.error('Database setup failed:', error.message);
  process.exit(1);
}
