/**
 * Watch for file changes and auto-deploy
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const serverPath = process.argv[2];

if (!serverPath) {
  console.error('Error: Please provide server path');
  console.log('Usage: node scripts/watch-and-deploy.js "D:\\path\\to\\server"');
  process.exit(1);
}

console.log('\n🔍 Watching for changes...');
console.log('Server path:', serverPath);
console.log('Press Ctrl+C to stop\n');

let isBuilding = false;

function deployFiles() {
  if (isBuilding) return;
  
  isBuilding = true;
  console.log('\n⚙️  Building and deploying...');
  
  exec(`npm run build`, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Build failed:', error.message);
      isBuilding = false;
      return;
    }
    
    // Copy dist files
    const distSrc = path.join(__dirname, '..', 'dist');
    const distDest = path.join(serverPath, 'dist');
    
    try {
      if (fs.existsSync(distSrc)) {
        copyRecursive(distSrc, distDest);
        console.log('✅ Deployed successfully!');
        console.log('⏰', new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('❌ Deploy failed:', err.message);
    }
    
    isBuilding = false;
  });
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Watch src directory
const srcPath = path.join(__dirname, '..', 'src');

fs.watch(srcPath, { recursive: true }, (eventType, filename) => {
  if (filename && filename.endsWith('.ts')) {
    console.log(`\n📝 Changed: ${filename}`);
    setTimeout(deployFiles, 500); // Debounce
  }
});

console.log('✅ Watcher started!');
console.log('Modify any .ts file in src/ to trigger rebuild\n');
