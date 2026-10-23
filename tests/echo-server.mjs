// Local stand-in for the n8n webhook. Test use only; listens on 127.0.0.1:3199.
// POST /hook stores the JSON body, GET /all lists stored bodies, POST /reset clears them.
import http from 'node:http';

const PORT = 3199;
let bodies = [];

const send = (res, status, obj) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};

const server = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', () => {
    if (req.method === 'POST' && req.url === '/hook') {
      try {
        bodies.push(JSON.parse(raw));
      } catch {
        return send(res, 400, { ok: false, error: 'invalid json' });
      }
      return send(res, 200, { ok: true });
    }
    if (req.method === 'GET' && req.url === '/all') return send(res, 200, bodies);
    if (req.method === 'POST' && req.url === '/reset') {
      bodies = [];
      return send(res, 200, { ok: true });
    }
    return send(res, 404, { ok: false });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[echo] listening on http://127.0.0.1:${PORT}`);
});
