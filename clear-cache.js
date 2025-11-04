// Simple script to clear Next.js cache
const fs = require('fs');
const path = require('path');

const nextDir = path.join(__dirname, '.next');

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, { recursive: true, force: true });
  console.log('✅ Cleared .next cache directory');
} else {
  console.log('ℹ️  No .next directory found');
}

console.log('🚀 You can now run: pnpm dev');