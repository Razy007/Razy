$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"

# 1. Upload smart-server.js
Write-Host "Uploading smart-server.js..."
& scp -i "$keyPath" -o StrictHostKeyChecking=no "$sourceDir\smart-server.js" "${remoteUser}@${serverIp}:/var/www/pioneer-academy/smart-server.js"

# 2. Setup & Start
Write-Host "Setting up and starting service..."
# We run npm install in the root folder /var/www/pioneer-academy
$sshCmd = "cd /var/www/pioneer-academy; npm install express http-proxy-middleware; pm2 delete frontend; pm2 start smart-server.js --name frontend; pm2 save"
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd

Write-Host "SMART SERVER DEPLOYED!"
