const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Angular application with Google Maps integration...');

// Verify Google Maps script is present
const indexPath = path.join(__dirname, 'src', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (!indexContent.includes('maps.googleapis.com/maps/api/js')) {
  console.warn('⚠️ Google Maps API script not found in index.html. Adding it...');
  
  const updatedContent = indexContent.replace(
    '</head>',
    '  <!-- Google Maps API with key and libraries -->\n  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_TzLQC-bGE3mqO77nkE7LjiFkzrhGkPE&libraries=geometry,places"></script>\n</head>'
  );
  
  fs.writeFileSync(indexPath, updatedContent);
  console.log('✅ Added Google Maps script to index.html');
}

// Clean the Angular cache for a fresh build
console.log('🧹 Cleaning Angular cache...');
const cleanProcess = spawn('rm', ['-rf', '.angular/cache'], {
  stdio: 'inherit',
  shell: true
});

cleanProcess.on('exit', () => {
  console.log('🏗️ Building application...');
  
  // Build in development mode for faster builds and better debugging
  const buildProcess = spawn('npx', ['ng', 'build', 'CoordinateUi', '--configuration=development'], {
    stdio: 'inherit',
    shell: true
  });
  
  buildProcess.on('exit', (code) => {
    if (code === 0) {
      console.log('🚀 Starting development server...');
      
      // Start Angular dev server
      const serveProcess = spawn('npx', ['ng', 'serve', 'CoordinateUi', '--port=4200'], {
        stdio: 'inherit',
        shell: true
      });
      
      serveProcess.on('exit', (code) => {
        console.log(`Server process exited with code ${code}`);
      });
      
    } else {
      console.error(`❌ Build failed with code ${code}`);
      
      // If build fails, try to serve directly
      console.log('🔄 Attempting to serve directly...');
      
      const serveProcess = spawn('npx', ['ng', 'serve', 'CoordinateUi', '--port=4200'], {
        stdio: 'inherit',
        shell: true
      });
      
      serveProcess.on('exit', (code) => {
        console.log(`Server process exited with code ${code}`);
      });
    }
  });
  
  buildProcess.on('error', (err) => {
    console.error('❌ Build process error:', err);
  });
});

cleanProcess.on('error', (err) => {
  console.error('❌ Cache clean error:', err);
});