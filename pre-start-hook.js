#!/usr/bin/env node

/**
 * This script prepares the minimal environment for Angular development
 * by copying and setting up minimal configuration files.
 */

const fs = require('fs');
const path = require('path');

console.log('Setting up minimal Angular environment...');

// Function to ensure our minimal app can build properly
function setupMinimalEnvironment() {
  // Make sure tsconfig.minimal.json exists
  const tsConfigMinimalPath = path.join(__dirname, 'tsconfig.minimal.json');
  if (!fs.existsSync(tsConfigMinimalPath)) {
    const tsConfigMinimal = {
      "extends": "./tsconfig.json",
      "compilerOptions": {
        "outDir": "./out-tsc/app",
        "types": ["node"]
      },
      "files": [
        "src/minimal-main.ts"
      ],
      "include": [
        "src/app/minimal-app.component.ts",
        "src/environments/environment.ts",
        "src/environments/environment.prod.ts"
      ],
      "exclude": [
        "src/app/**/*.spec.ts",
        "src/app/**/*.module.ts"
      ]
    };
    
    fs.writeFileSync(tsConfigMinimalPath, JSON.stringify(tsConfigMinimal, null, 2));
    console.log('Created tsconfig.minimal.json');
  }
  
  // Verify the minimal app component exists
  const minimalAppPath = path.join(__dirname, 'src', 'app', 'minimal-app.component.ts');
  if (!fs.existsSync(minimalAppPath)) {
    console.error('Missing src/app/minimal-app.component.ts - please run git restore to recover this file');
    process.exit(1);
  }
  
  // Verify the minimal main file exists
  const minimalMainPath = path.join(__dirname, 'src', 'minimal-main.ts');
  if (!fs.existsSync(minimalMainPath)) {
    console.error('Missing src/minimal-main.ts - please run git restore to recover this file');
    process.exit(1);
  }
  
  console.log('Minimal environment setup completed');
}

// Call the function to set up minimal environment
setupMinimalEnvironment();