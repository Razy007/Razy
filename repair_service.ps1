$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"

Write-Host "🔧 Repairing Frontend Dependencies and Restarting..."

# 1. Install critical dependencies for Smart Server (at root)
# We assume package.json might be missing or dependencies were cleared.
# We explicitly install what smart-server.js needs.
$cmdRepair = "cd /var/www/pioneer-academy; npm install express http-proxy-middleware cors dotenv --save; pm2 restart frontend"

Write-Host "Running installation on server..."
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" $cmdRepair

# 2. Check Status
Write-Host "Checking PM2..."
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" "pm2 status"

# 3. Verify Health Again
Write-Host "`n🏥 Retesting Health..."
$json = & ssh -i "$keyPath" "${remoteUser}@${serverIp}" "curl -s http://localhost:3001/api/health"
Write-Host "API Response: $json"
