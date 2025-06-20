/**
 * Main start script for the Angular application
 */
const { spawn } = require('child_process');

console.log('Starting Coordinate App...');

// Use npx to run the Angular CLI
const angularProcess = spawn('npx', ['ng', 'serve', 'CoordinateUi',
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