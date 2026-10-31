import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PORT = 5173;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer((req, res) => {
  try {
    const rawUrl = req.url || '/';
    const parsedPath = rawUrl.split('?')[0];

    // Favicon handler: return empty 204 or svg
    if (parsedPath === '/favicon.ico') {
      res.writeHead(204);
      res.end();
      return;
    }

    let filePath;

    // Route: Root or SPA portfolio route (/p/*) -> serve index.html
    if (parsedPath === '/' || parsedPath.startsWith('/p/')) {
      filePath = path.join(__dirname, 'index.html');
    } else {
      // Clean path to prevent traversal
      const safePath = path.normalize(parsedPath).replace(/^(\.\.[\/\\])+/, '');
      filePath = path.join(__dirname, safePath);
    }

    // Check if the requested file exists
    fs.stat(filePath, (statErr, stats) => {
      if (statErr || !stats.isFile()) {
        // If not a static file, fallback to index.html for SPA routing
        const fallbackPath = path.join(__dirname, 'index.html');
        fs.readFile(fallbackPath, (fbErr, fbContent) => {
          if (fbErr) {
            console.error(`[500] Failed to read index.html:`, fbErr);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error: index.html could not be read.');
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Access-Control-Allow-Origin': '*'
          });
          res.end(fbContent);
        });
        return;
      }

      // Read and serve file
      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          console.error(`[500] Error reading ${filePath}:`, readErr);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Server Error');
          return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*'
        });
        res.end(content);
      });
    });
  } catch (err) {
    console.error(`[500 Exception]:`, err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('500 Server Error: ' + (err?.message || 'Unknown error'));
  }
});

function startServer(port) {
  server.listen(port, '0.0.0.0', () => {
    console.log(`\n  ➜  Folix is running at:`);
    console.log(`  ➜  Local:   http://localhost:${port}/`);
    console.log(`  ➜  Sample:  http://localhost:${port}/p/rafeek\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`\n  ⚠️  Port ${port} is in use. Trying fallback port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(DEFAULT_PORT);
