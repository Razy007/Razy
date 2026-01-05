$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"

$debugScriptMain = @"
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('DEBUG: Nginx is working!');
  console.log('Request received from', req.headers['host']);
}).listen(5000, '0.0.0.0', () => console.log('Debug server listening on 5000'));
"@

# Create local file
$debugFile = "debug.js"
Set-Content -Path $debugFile -Value $debugScriptMain

# SCP
& scp -i "$keyPath" -o StrictHostKeyChecking=no "$debugFile" "${remoteUser}@${serverIp}:/var/www/pioneer-academy/debug.js"

# Start with PM2
$sshCmd = "pm2 stop frontend; pm2 start /var/www/pioneer-academy/debug.js --name debug-server -f; pm2 save"
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd

Write-Host "DEBUG SERVER STARTED"
