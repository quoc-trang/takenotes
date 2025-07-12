const { execSync } = require('child_process');

// Use the public database URL for local migration
const publicDbUrl =
  'postgresql://postgres:BeiSStpqLivGZfSLsGlQsCgHdfNzPlCK@ballast.proxy.rlwy.net:45800/railway';

console.log('Running migration with public database URL...');

try {
  // Set the DATABASE_URL environment variable and run migration
  execSync(`DATABASE_URL="${publicDbUrl}" npx prisma migrate deploy`, {
    stdio: 'inherit',
    env: { ...process.env, DATABASE_URL: publicDbUrl },
  });

  console.log('Migration completed successfully!');
} catch (error) {
  console.error('Migration failed:', error.message);
  process.exit(1);
}
