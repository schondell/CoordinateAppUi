const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Bootstrapping Angular application with Google Maps and Syncfusion components...');

// Ensure Google Maps script is properly included
const indexPath = path.join(__dirname, 'src', 'index.html');
const indexContent = fs.readFileSync(indexPath, 'utf8');

if (!indexContent.includes('maps.googleapis.com/maps/api/js')) {
  console.warn('Google Maps API script not found in index.html. Adding it...');
  const updatedContent = indexContent.replace(
    '</head>',
    '  <!-- Google Maps API -->\n  <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD_TzLQC-bGE3mqO77nkE7LjiFkzrhGkPE&libraries=geometry,places"></script>\n</head>'
  );
  fs.writeFileSync(indexPath, updatedContent);
  console.log('Added Google Maps script to index.html');
}

// Clear cache first
const cleanCache = spawn('rm', ['-rf', '.angular/cache'], {
  stdio: 'inherit',
  shell: true
});

cleanCache.on('exit', () => {
  console.log('Cache cleaned, running ng build...');
  
  // Try to build the app with full configuration
  const buildProcess = spawn('npx', ['ng', 'build', 'CoordinateUi', '--delete-output-path=false', '--verbose'], {
    stdio: 'inherit',
    shell: true
  });

  buildProcess.on('exit', (code) => {
    if (code !== 0) {
      console.log('Standard build failed, trying development configuration...');
      
      // Try development build configuration
      const devBuildProcess = spawn('npx', ['ng', 'build', 'CoordinateUi', '--configuration=development', '--delete-output-path=false', '--verbose'], {
        stdio: 'inherit',
        shell: true
      });
      
      devBuildProcess.on('exit', (devCode) => {
        if (devCode !== 0) {
          console.log('Development build failed, trying to serve directly...');
          
          // If build fails, try serving directly
          const serveProcess = spawn('npx', ['ng', 'serve', 'CoordinateUi', '--port=4200', '--disable-host-check', '--verbose'], {
            stdio: 'inherit',
            shell: true
          });
          
          serveProcess.on('exit', (serveCode) => {
            console.log(`Serve process exited with code ${serveCode}`);
          });
          
          serveProcess.on('error', (err) => {
            console.error('Failed to start serve process:', err);
          });
        }
      });
      
      devBuildProcess.on('error', (err) => {
        console.error('Failed to start development build process:', err);
      });
    } else {
      console.log('Build successful, starting server...');
      
      // Start server after successful build
      const serveProcess = spawn('npx', ['ng', 'serve', 'CoordinateUi', '--port=4200', '--disable-host-check'], {
        stdio: 'inherit',
        shell: true
      });
      
      serveProcess.on('exit', (code) => {
        console.log(`Server process exited with code ${code}`);
      });
      
      serveProcess.on('error', (err) => {
        console.error('Failed to start server process:', err);
      });
    }
  });
  
  buildProcess.on('error', (err) => {
    console.error('Failed to start build process:', err);
  });
});

cleanCache.on('error', (err) => {
  console.error('Failed to clean cache:', err);
});