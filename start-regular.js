#!/usr/bin/env node

/**
 * Simple script to start the regular Angular application (not standalone mode)
 */
const { spawn } = require('child_process');

console.log('Starting regular Angular application (not standalone)...');

// Start Angular dev server with the quickapp-pro project (not minimal)
const angularProcess = spawn('ng', ['serve', 'quickapp-pro', '--port', '44450', '--configuration=development'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true
});

angularProcess.on('error', (error) => {
  console.error('Error starting Angular server:', error);
  process.exit(1);
});

angularProcess.on('close', (code) => {
  console.log(`Angular server process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Caught interrupt signal, shutting down...');
  angularProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Caught termination signal, shutting down...');
  angularProcess.kill('SIGTERM');
});