/**
 * Direct Angular CLI starter script
 */
const { spawn } = require('child_process');

console.log('Starting Angular app with direct CLI call...');

// Use direct Angular CLI options
const ngServe = spawn('npx', [
  'ng',
  'serve',
  '--configuration=development',
  '--port=4200',
  '--open=false'
], {
  stdio: 'inherit',
  shell: true
});

ngServe.on('exit', (code) => {
  console.log(`Angular process exited with code ${code}`);
});

ngServe.on('error', (err) => {
  console.error('Failed to start Angular process:', err);
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  ngServe.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  ngServe.kill('SIGTERM');
});