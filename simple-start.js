/**
 * Main startup script for Coordinate App
 */
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting Coordinate App (debug mode)...');

// Start Angular using the ng serve command with verbose flag
const server = spawn('npx', ['ng', 'serve', '--verbose', '--project=minimal', '--port', '4200'], {
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