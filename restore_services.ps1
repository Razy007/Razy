$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"

# Restore standard config: API on 3001, Frontend on 5000
Write-Host "Restoring services..."
$sshCmd = "pm2 delete debug-server; pm2 stop api-pioneer; PORT=3001 pm2 restart api-pioneer --update-env; pm2 start 'npx serve -s /var/www/pioneer-academy -l 5000' --name frontend; pm2 save"
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd

Write-Host "SERVICES RESTORED"
