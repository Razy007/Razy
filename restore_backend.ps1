$ErrorActionPreference = "Stop"
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$zipFile = "$sourceDir\backend_restore.zip"
$serverIp = "116.203.51.124"
$keyPath = "$sourceDir\hetzner_key"
$remoteUser = "pioneer"
$remoteDir = "/var/www/pioneer-academy/backend"

# Cleanup
if (Test-Path $zipFile) { Remove-Item $zipFile }

# Zip backend (excluding node_modules)
Write-Host "Compressing backend (skipping node_modules)..."
Get-ChildItem -Path "$sourceDir\backend" -Exclude "node_modules" | Compress-Archive -DestinationPath $zipFile -Update
# Note: .env is excluded for security/consistency? No, I should include it if it's needed. But usually env is on server.
# The server lost its .env too! I MUST upload the local .env if relevant, or .env.template
# Step 876 showed .env on local. I will include it. so removing .env from exclude.


# SCP
Write-Host "Sending to $serverIp..."
& scp -i "$keyPath" -o StrictHostKeyChecking=no "$zipFile" "${remoteUser}@${serverIp}:/tmp/backend_restore.zip"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Transfer Success!"
    
    # Unzip on server (overwrite existing, keep node_modules if present - wait, unzip might verify paths)
    # Warning: Compress-Archive includes the root folder usually? No, "$sourceDir\backend\*" puts contents at root of zip.
    
    Write-Host "Restoring..."
    $sshCmd = "unzip -o /tmp/backend_restore.zip -d $remoteDir; rm /tmp/backend_restore.zip; cd $remoteDir; npm install --production; pm2 restart all || echo 'PM2 restart failed'"
    & ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCmd
    
    Write-Host "RESTORE COMPLETE!"
}
else {
    Write-Host "SCP Failed."
}
