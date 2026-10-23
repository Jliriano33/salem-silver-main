// Local stand-in for the n8n webhook. Test use only; listens on 127.0.0.1:3199.
// POST /hook... stores the JSON body, GET /all lists stored bodies, POST /reset clears them.
// POST /mode {"next":"n8n-404"} makes the next hook call answer like n8n does for an inactive workflow:
// a 404 whose message repeats the requested path.
import http from 'node:http';

const PORT = 3199;
let bodies = [];
let nextMode = null;

const send = (res, status, obj) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};

const server = http.createServer((req, res) => {
  let raw = '';
  req.on('data', (chunk) => { raw += chunk; });
  req.on('end', () => {
    if (req.method === 'POST' && req.url.startsWith('/hook')) {
      if (nextMode === 'n8n-404') {
        nextMode = null;
        return send(res, 404, {
          code: 404,
          message: `The requested webhook "POST ${req.url.slice(1)}" is not registered.`,
          hint: 'The workflow must be active for a production URL to run successfully.',
        });
      }
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
      nextMode = null;
      return send(res, 200, { ok: true });
    }
    if (req.method === 'POST' && req.url === '/mode') {
      try {
        nextMode = JSON.parse(raw).next ?? null;
      } catch {
        return send(res, 400, { ok: false, error: 'invalid json' });
      }
      return send(res, 200, { ok: true, next: nextMode });
    }
    return send(res, 404, { ok: false });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[echo] listening on http://127.0.0.1:${PORT}`);
});
