$ErrorActionPreference = "Stop"
# 1. Variables
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$zipFile = "$sourceDir\deploy_package.zip"
$serverIp = "116.203.51.124"
$keyPath = "$sourceDir\hetzner_key"
$remoteUser = "pioneer"
$remoteDir = "/var/www/pioneer-academy"

# 2. Cleanup
if (Test-Path $zipFile) { Remove-Item $zipFile }

# 3. Build & Zip
Write-Host "Building project..."
& npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

Write-Host "Compressing dist folder..."
Compress-Archive -Path "$sourceDir\dist\*" -DestinationPath $zipFile -CompressionLevel Fastest -Force

# 4. SCP
Write-Host "Sending to $serverIp..."
& scp -i "$keyPath" -o StrictHostKeyChecking=no "$zipFile" "${remoteUser}@${serverIp}:/tmp/deploy_package.zip"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Transfer Success!"
    
    # 5. Unzip
    Write-Host "Unzipping..."
    $sshCmd = "rm -rf $remoteDir/assets $remoteDir/index.html $remoteDir/vite.svg; unzip -o /tmp/deploy_package.zip -d $remoteDir; rm /tmp/deploy_package.zip"
    & ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd
    
    Write-Host "DEPLOYMENT COMPLETE!"
}
else {
    Write-Host "SCP Failed."
}
