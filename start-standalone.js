#!/usr/bin/env node

/**
 * Simple script to start the Angular application in standalone mode
 */
const { spawn } = require('child_process');
const path = require('path');
const commander = require('commander');

// Parse command line arguments
const program = new commander.Command();
program
  .option('--project <project>', 'Specify which project to serve', 'minimal')
  .option('--port <port>', 'Port to serve on', '4200')
  .parse(process.argv);

const options = program.opts();
const projectName = options.project;
const port = options.port;

console.log(`Starting standalone Angular application for project ${projectName}...`);

// Start Angular dev server
const angularProcess = spawn('ng', ['serve', projectName, '--port', port], {
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