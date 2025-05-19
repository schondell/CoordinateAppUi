#!/usr/bin/env node

/**
 * Script to start the Angular application
 */
const { spawn } = require('child_process');

console.log('Starting Angular application...');

// Start Angular dev server with the quickapp-pro project
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