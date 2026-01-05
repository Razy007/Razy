$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"

# SCP to home folder (usually writable)
Write-Host "Uploading to home..."
& scp -i "$keyPath" -o StrictHostKeyChecking=no "$sourceDir\smart-server.js" "${remoteUser}@${serverIp}:/home/pioneer/smart-server.js"

# Move to correct location and Restart
Write-Host "Deploying and Restarting..."
$sshCmd = "mv /home/pioneer/smart-server.js /var/www/pioneer-academy/smart-server.js; cd /var/www/pioneer-academy; pm2 restart frontend"
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd

Write-Host "DEPLOY COMPLETE"
