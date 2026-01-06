$ErrorActionPreference = "Stop"

# Configuration
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$serverIp = "116.203.51.124"
$keyPath = "$sourceDir\hetzner_key"
$remoteUser = "pioneer"
$remoteProject = "/var/www/pioneer-academy"
$distZip = "$sourceDir\dist_update.zip"

Write-Host "🚧 Starting UI Update Deployment..." -ForegroundColor Yellow

# 1. Clean previous zip
if (Test-Path $distZip) { Remove-Item $distZip }

# 2. Zip DIST folder CONTENTS
Write-Host "📦 Zipping dist folder..." -ForegroundColor Cyan
Set-Location "$sourceDir\dist"
Compress-Archive -Path * -DestinationPath $distZip -Force
Set-Location $sourceDir

# 3. Upload Zip
Write-Host "🚀 Uploading to server..." -ForegroundColor Cyan
& scp -i "$keyPath" -o StrictHostKeyChecking=no "$distZip" "${remoteUser}@${serverIp}:/tmp/dist_update.zip"

if ($LASTEXITCODE -eq 0) {
    # 4. Unzip and Restart
    Write-Host "⚙️  Installing on server..." -ForegroundColor Cyan
    $sshCmd = "mkdir -p $remoteProject/dist; unzip -o /tmp/dist_update.zip -d $remoteProject/dist; rm /tmp/dist_update.zip; pm2 restart frontend"
    & ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd
    
    Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
    Write-Host "The new UI should be live in a few moments." -ForegroundColor Green
}
else {
    Write-Host "❌ SCP Upload Failed" -ForegroundColor Red
}
