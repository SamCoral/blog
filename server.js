const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT || 8000);
const rootDirectory = __dirname;
const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

function resolveFilePath(requestUrl) {
  const decodedUrl = decodeURIComponent(new URL(requestUrl, 'http://localhost').pathname);
  const relativePath = decodedUrl === '/' ? 'index.html' : decodedUrl.replace(/^\/+/, '');
  const requestedPath = path.resolve(rootDirectory, relativePath);

  if (!requestedPath.startsWith(rootDirectory + path.sep) && requestedPath !== rootDirectory) {
    return null;
  }

  return requestedPath;
}

function sendFile(response, filePath, statusCode = 200) {
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(statusCode, {
      'Content-Type': contentTypes[extension] || 'application/octet-stream',
      'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=3600',
    });

    fs.createReadStream(filePath).pipe(response);
  });
}

const server = http.createServer((request, response) => {
  const filePath = resolveFilePath(request.url || '/');

  if (!filePath) {
    response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Forbidden');
    return;
  }

  sendFile(response, filePath);
});

server.listen(port, '0.0.0.0', () => {
  console.log(`TechPulse blog is running at http://localhost:${port}`);
});
