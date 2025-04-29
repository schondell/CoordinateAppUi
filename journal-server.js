/**
 * Simple HTTP server to serve static HTML journal page
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4200;

console.log('Starting simple HTTP server for journal page...');

// Create simple HTTP server
const server = http.createServer((req, res) => {
  let filePath;
  
  if (req.url === '/' || req.url === '/index.html') {
    filePath = path.join(__dirname, 'minimal', 'dist', 'index.html');
  } else if (req.url === '/journal' || req.url === '/journal.html') {
    filePath = path.join(__dirname, 'minimal', 'dist', 'journal.html');
  } else if (req.url === '/about' || req.url === '/about.html') {
    filePath = path.join(__dirname, 'minimal', 'dist', 'about.html');
  } else {
    // Serve from minimal/dist directory
    filePath = path.join(__dirname, 'minimal', 'dist', req.url);
  }
  
  // Get file extension
  const extname = String(path.extname(filePath)).toLowerCase();
  
  // Define content types
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };
  
  const contentType = contentTypes[extname] || 'text/plain';
  
  // Read file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // If page not found, serve 404 or index.html as fallback
        console.log(`File not found: ${filePath}`);
        
        // Serve index.html for SPA-like behavior
        fs.readFile(path.join(__dirname, 'minimal', 'dist', 'index.html'), (err, indexContent) => {
          if (err) {
            res.writeHead(404);
            res.end('Page not found');
            return;
          }
          
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(indexContent, 'utf-8');
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
      return;
    }
    
    // Success
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content, 'utf-8');
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Journal page available at http://localhost:${PORT}/journal`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});