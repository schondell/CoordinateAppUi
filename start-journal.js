/**
 * Start script specifically for running the application with journal route
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Coordinate App with focus on Journal route...');

// Determine project to use based on environment
const projectName = 'CoordinateUi'; // Use the main project
const port = 4200;

// Start the Angular application
console.log(`Starting Angular with project: ${projectName} on port ${port}`);
const server = spawn('npx', ['ng', 'serve', `--project=${projectName}`, `--port=${port}`], {
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