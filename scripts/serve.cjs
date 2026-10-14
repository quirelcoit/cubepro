const http = require('node:http');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.txt': 'text/plain', '.xml': 'application/xml' };

function resolveAsset(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname);
  const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!filename.startsWith(root + path.sep) || !mime[path.extname(filename)] || path.relative(root, filename).split(path.sep).some(p => p.startsWith('.'))) return null;
  return filename;
}

if (require.main === module) {
  http.createServer(async (req, res) => {
    try {
      const file = resolveAsset(req.url);
      if (!file || !['GET', 'HEAD'].includes(req.method)) { res.writeHead(404); res.end(); return; }
      const body = await fs.readFile(file);
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)], 'Cache-Control': 'no-store' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { res.writeHead(404); res.end(); }
  }).listen(8080, '127.0.0.1', () => console.log('CubePro: http://127.0.0.1:8080/?dev (Ctrl+C to stop)'));
}
module.exports = { resolveAsset };
