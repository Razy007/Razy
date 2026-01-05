$ErrorActionPreference = "Stop"
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$serverIp = "116.203.51.124"
$keyPath = "$sourceDir\hetzner_key"
$remoteUser = "pioneer"

# Start frontend service on port 5000
Write-Host "Starting frontend service on port 5000..."
$sshCmd = "pm2 delete frontend; pm2 start 'npx serve -s /var/www/pioneer-academy -l 5000' --name frontend; pm2 save"
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd

Write-Host "SERVICE STARTED!"
