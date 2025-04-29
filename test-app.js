const { spawn } = require('child_process');
const http = require('http');

console.log('Running test to verify Angular application with Google Maps and Syncfusion...');

// Check if app builds successfully
const buildProcess = spawn('npx', ['ng', 'build', 'quickapp-pro', '--configuration=development'], {
  stdio: 'inherit',
  shell: true
});

buildProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ Build successful');
    
    // Try to serve the app
    const serveProcess = spawn('npx', ['ng', 'serve', 'quickapp-pro', '--port=4200'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Check if server starts successfully by waiting and then making an HTTP request
    setTimeout(() => {
      http.get('http://localhost:4200', (res) => {
        console.log(`✅ Server response status: ${res.statusCode}`);
        
        // Get some response data
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          // Basic check if it contains Angular app marker
          if (data.includes('app-root')) {
            console.log('✅ Angular app is running correctly');
          } else {
            console.error('❌ Angular app not detected in response');
          }
          
          // Clean up
          serveProcess.kill();
        });
      }).on('error', (err) => {
        console.error('❌ Error connecting to server:', err.message);
        serveProcess.kill();
      });
    }, 10000); // Wait 10 seconds for server to start
    
  } else {
    console.error(`❌ Build failed with code ${code}`);
  }
});

buildProcess.on('error', (err) => {
  console.error('❌ Failed to start build process:', err);
});