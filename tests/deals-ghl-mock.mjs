// Local stand-in for the GoHighLevel v2 API (goal NN deal inquiries). Test use only; 127.0.0.1:3198.
// Records every call. GET /_calls lists them, POST /_reset clears, POST /_mode {"fail":"upsert"|"tags"|"notes"}
// makes that step answer 500 until reset.
import http from 'node:http';

const PORT = 3198;
let calls = [];
let fail = null;

const send = (res, status, obj) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj));
};

http.createServer((req, res) => {
  let raw = '';
  req.on('data', (c) => { raw += c; });
  req.on('end', () => {
    if (req.method === 'GET' && req.url === '/_calls') return send(res, 200, calls);
    if (req.method === 'POST' && req.url === '/_reset') { calls = []; fail = null; return send(res, 200, { ok: true }); }
    if (req.method === 'POST' && req.url === '/_mode') { fail = JSON.parse(raw).fail ?? null; return send(res, 200, { ok: true }); }
    let body = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return send(res, 400, { msg: 'bad json' }); }
    const step = req.url === '/contacts/upsert' ? 'upsert'
      : /\/contacts\/[^/]+\/tags$/.test(req.url) ? 'tags'
      : /\/contacts\/[^/]+\/notes$/.test(req.url) ? 'notes' : null;
    calls.push({ method: req.method, url: req.url, step, auth: req.headers.authorization ?? null,
      version: req.headers.version ?? null, body });
    if (!step) return send(res, 404, { msg: 'not found' });
    if (req.method !== 'POST') return send(res, 405, { msg: 'method not allowed' });
    if (fail === step) return send(res, 500, { msg: 'mock failure' });
    if (step === 'upsert') return send(res, 200, { new: true, contact: { id: 'mock-contact-1' } });
    return send(res, 201, { ok: true });
  });
}).listen(PORT, '127.0.0.1', () => console.log(`[ghl-mock] http://127.0.0.1:${PORT}`));
