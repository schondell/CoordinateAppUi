/**
 * Main start script for the Angular application with standalone components
 */
const { spawn } = require('child_process');

console.log('Starting Coordinate App with proper standalone configuration...');

// Use npx to run the Angular CLI
const angularProcess = spawn('npx', ['ng', 'serve', 'quickapp-pro',
                                   '--configuration=development',
                                   '--port=4200',
                                   '--open=false'], {
  stdio: 'inherit',
  shell: true
});

// Handle process exit
angularProcess.on('exit', (code) => {
  console.log(`Angular process exited with code ${code}`);
});

// Handle errors
angularProcess.on('error', (err) => {
  console.error('Failed to start Angular process:', err);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down...');
  angularProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  angularProcess.kill('SIGTERM');
});