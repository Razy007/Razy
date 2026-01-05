$ErrorActionPreference = "Stop"
$serverIp = "116.203.51.124"
$keyPath = "hetzner_key"
$remoteUser = "pioneer"

Write-Host "Locking down security and restarting..."

# 1. Update JWT_SECRET and Restart
# We use a single line command to avoid Here-String issues in potential encoding mess
$cmdGenerate = 'export NEW_SECRET=$(openssl rand -hex 64); echo "Secret: $NEW_SECRET"; sed -i "s/^JWT_SECRET=.*/JWT_SECRET=$NEW_SECRET/" /var/www/pioneer-academy/.env'
$cmdRestart = 'pm2 restart api-pioneer --update-env'

Write-Host "Generating JWT key and updating server..."
& ssh -i "$keyPath" "${remoteUser}@${serverIp}" "$cmdGenerate; $cmdRestart"

# 2. Wait
Write-Host "Waiting for restart (10s)..."
Start-Sleep -Seconds 10

# 3. Verify Security
Write-Host "Verifying .env protection..."
# Check HTTP Status Code for .env access
$code = & ssh -i "$keyPath" "${remoteUser}@${serverIp}" "curl -s -o /dev/null -w '%{http_code}' https://pioneeracademy.academy/.env"

if ($code -eq "403" -or $code -eq "404") {
    Write-Host "[OK] .env is protected (HTTP $code)"
}
else {
    Write-Host "[WARN] .env returns HTTP $code"
}

# 4. Verify DB
Write-Host "Checking Health/DB..."
$json = & ssh -i "$keyPath" "${remoteUser}@${serverIp}" "curl -s http://localhost:3001/api/health"
Write-Host "API Response: $json"

if ($json -match "connected") {
    Write-Host "[SUCCESS] Database Connected!"
}
else {
    Write-Host "[FAIL] Database NOT connected."
}
