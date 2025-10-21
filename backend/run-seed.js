#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🌱 Starting E-commerce Database Seeding...\n');

// Run the seed script
const seedProcess = spawn('node', [path.join(__dirname, 'seed-dummy-data.js')], {
  stdio: 'inherit',
  shell: true
});

seedProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your backend server: npm run dev');
    console.log('2. Start your frontend: cd ../frontend && npm run dev');
    console.log('3. Login to admin panel with: admin@example.com / admin123');
    console.log('4. Import the Postman collection for API testing');
  } else {
    console.log(`\n❌ Database seeding failed with code ${code}`);
  }
});

seedProcess.on('error', (error) => {
  console.error('❌ Error running seed script:', error);
});
