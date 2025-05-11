/**
 * Start script for QuickApp Pro project
 */
const { spawn } = require('child_process');

console.log('Starting Coordinate App (quickapp-pro)...');

// Start the QuickApp Pro project
const server = spawn('npx', ['ng', 'serve', '--project=quickapp-pro', '--port=4200'], {
  stdio: 'inherit',
  shell: true
});

// Handle server exit
server.on('exit', (code) => {
  console.log(`Angular server process exited with code ${code}`);
});

// Handle errors
server.on('error', (err) => {
  console.error('Failed to start Angular server:', err);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.kill('SIGTERM');
});