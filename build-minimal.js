#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building minimal Angular application...');

// Temporary files to create
const tempFiles = {
  'angular.json.bak': '', // Will store backup of original angular.json
  'tsconfig.app.json.bak': '' // Will store backup of original tsconfig.app.json
};

// Backup current angular.json
try {
  const angularJson = fs.readFileSync(path.join(__dirname, 'angular.json'), 'utf8');
  tempFiles['angular.json.bak'] = angularJson;
  console.log('Backed up original angular.json');
  
  // Modify angular.json to only include minimal app
  const updatedAngularJson = angularJson.replace(/"browser": "src\/minimal-main.ts",/g, 
    '"browser": "src/minimal-main.ts",\n            "preserveSymlinks": true,');
  
  fs.writeFileSync(path.join(__dirname, 'angular.json'), updatedAngularJson);
  console.log('Updated angular.json for minimal build');
} catch (err) {
  console.error('Error updating angular.json:', err);
  process.exit(1);
}

// Run the Angular build process
const buildProcess = spawn('npx', ['ng', 'build', '--configuration=development'], {
  stdio: 'inherit',
  shell: true
});

// Handle process completion
buildProcess.on('close', (code) => {
  // Restore original files
  if (tempFiles['angular.json.bak']) {
    fs.writeFileSync(path.join(__dirname, 'angular.json'), tempFiles['angular.json.bak']);
    console.log('Restored original angular.json');
  }
  
  if (code === 0) {
    console.log('Minimal build completed successfully');
  } else {
    console.error(`Build process exited with code ${code}`);
  }
});

// Handle errors
buildProcess.on('error', (err) => {
  console.error('Failed to start build process:', err);
  
  // Restore original files
  if (tempFiles['angular.json.bak']) {
    fs.writeFileSync(path.join(__dirname, 'angular.json'), tempFiles['angular.json.bak']);
    console.log('Restored original angular.json');
  }
});