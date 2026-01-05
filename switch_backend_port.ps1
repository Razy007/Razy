$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"

# Switch backend to port 5000
Write-Host "Switching backend to port 5000..."
$sshCmd = "pm2 delete frontend debug-server; pm2 stop api-pioneer; PORT=5000 pm2 restart api-pioneer --update-env; pm2 save"
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd

Write-Host "BACKEND ON 5000"
