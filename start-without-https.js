// Simple script to start Angular app without HTTPS requirements
const { spawn } = require('child_process');

console.log('Starting Angular app without HTTPS...');

// Use spawn instead of exec to properly handle stdout/stderr streams
const angularProcess = spawn('npx', ['ng', 'serve', '--port=44450', '--project=minimal', 
                                      '--configuration=development', '--watch'], {
  stdio: 'inherit', // This will pass the output directly to the console
  shell: true
});

// Handle process exit
angularProcess.on('exit', (code) => {
  console.log(`Angular process exited with code ${code}`);
});

// Handle errors
angularProcess.on('error', (err) => {
  console.error('Failed to start Angular process:', err);
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