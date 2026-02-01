const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('DEBUG: Nginx is working!');
  console.log('Request received from', req.headers['host']);
}).listen(5000, '0.0.0.0', () => console.log('Debug server listening on 5000'));
