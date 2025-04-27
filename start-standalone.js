#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting standalone Angular application...');

// Run the Angular serve process
const serveProcess = spawn('npx', ['ng', 'serve', 
  '--configuration=development', 
  '--port=44450',
  '--disable-host-check'
], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    // Set an environment variable to tell Angular we want to use the minimal bootstrap
    ANGULAR_BOOTSTRAP_FILE: 'src/minimal-main.ts'
  }
});

// Handle process exit
serveProcess.on('close', (code) => {
  if (code === 0) {
    console.log('Angular server stopped successfully');
  } else {
    console.error(`Angular server process exited with code ${code}`);
  }
});

// Handle errors
serveProcess.on('error', (err) => {
  console.error('Failed to start Angular server:', err);
});