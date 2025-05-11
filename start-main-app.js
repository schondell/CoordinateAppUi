/**
 * This script starts the main Angular application with AppModule
 * using the full layout with Syncfusion sidebar
 */
const { spawn } = require('child_process');

console.log('Starting main Coordinate App with full Syncfusion UI...');

// Run ng serve with the updated project configuration
const server = spawn('npx', ['ng', 'serve', 
                            '--project=quickapp-pro',
                            '--configuration=development',
                            '--port=4200'], {
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