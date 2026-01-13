/**
 * Creates the complete RAGE MP server structure
 */

const fs = require('fs');
const path = require('path');

function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created: ${dirPath}`);
  } else {
    console.log(`✓ Exists: ${dirPath}`);
  }
}

function createFile(filePath, content) {
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created: ${filePath}`);
}

const serverPath = process.argv[2];

if (!serverPath) {
  console.error('Error: Please provide server path');
  console.log('Usage: node scripts/create-structure.js "D:\\path\\to\\server"');
  process.exit(1);
}

console.log('\n========================================');
console.log('Creating RAGE MP Server Structure');
console.log('========================================\n');

console.log('Server path:', serverPath);
console.log('');

// Create directories
console.log('[1] Creating directories...');
createDirectory(path.join(serverPath, 'packages', 'gamemode'));
createDirectory(path.join(serverPath, 'client_packages'));
createDirectory(path.join(serverPath, 'database'));
createDirectory(path.join(serverPath, 'dist'));

console.log('');
console.log('[2] Creating configuration files...');

// Create conf.json if not exists
const confPath = path.join(serverPath, 'conf.json');
if (!fs.existsSync(confPath)) {
  const conf = {
    "maxplayers": 100,
    "name": "RAGE MP Starter Server",
    "gamemode": "roleplay",
    "streamdistance": 500,
    "port": 22005,
    "disallow-multiple-connections-per-ip": true,
    "limit-time-of-connections-per-ip": 0,
    "url": "",
    "language": "en",
    "announce": false,
    "voice-chat": true,
    "allow-cef-debugging": true,
    "enable-nodejs": true,
    "csharp": "disabled"
  };
  createFile(confPath, JSON.stringify(conf, null, 2));
} else {
  console.log('✓ Exists: conf.json');
}

console.log('');
console.log('========================================');
console.log('Structure created successfully!');
console.log('========================================\n');
console.log('Next steps:');
console.log('1. Run: npm run build');
console.log('2. Copy files to server');
console.log('3. Start server: ragemp-server.exe');
console.log('');
