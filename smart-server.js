const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 5000;

console.log(`Starting Validated Smart Frontend on port ${PORT}`);

// Verify Static Directory
let staticDir = __dirname;
if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    staticDir = path.join(__dirname, 'dist');
}
console.log(`Serving static files from: ${staticDir}`);

// 1. Security Filter
app.use((req, res, next) => {
    const forbidden = ['.env', 'smart-server.js', 'package.json', 'backend/'];
    if (forbidden.some(f => req.url.includes(f))) {
        console.warn(`[SEC] Blocked access to ${req.url} from ${req.ip}`);
        return res.status(403).send('Forbidden');
    }
    next();
});

// 2. Logger
app.use((req, res, next) => {
    console.log(`[REQ] ${req.method} ${req.url} from ${req.ip}`);
    next();
});

// 3. Proxy API -> 3001
const apiProxy = createProxyMiddleware({
    target: 'http://127.0.0.1:3001',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
    onProxyReq: (proxyReq, req, res) => {
        // console.log(`[PROXY] Forwarding ${req.url}`);
    },
    onError: (err, req, res) => {
        console.error('[PROXY ERROR]', err);
        res.status(502).json({ error: 'Backend unavailable', details: err.message });
    }
});

app.use('/api', apiProxy);

// 4. Static Files
app.use(express.static(staticDir));

// 5. Fallback (SPA)
app.use((req, res) => {
    // Check if request expects HTML (to avoid returning HTML for missing images/JS)
    const accept = req.headers.accept || '';
    if (accept.includes('text/html') || req.method === 'GET') {
        console.log(`[SPA] Fallback for ${req.url} -> serving index.html`);
        res.sendFile(path.join(staticDir, 'index.html'));
    } else {
        res.status(404).send('Not Found');
    }
});

// Start Server (Listen on all interfaces IPv4/IPv6)
const server = app.listen(PORT, () => {
    console.log(`✅ Smart Frontend online at http://localhost:${PORT}`);
});

server.on('error', (e) => {
    console.error('❌ Server Error:', e);
});
