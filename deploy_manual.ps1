$ErrorActionPreference = "Stop"
# 1. Définir les variables
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$zipFile = "$sourceDir\deploy_package.zip"
$serverIp = "116.203.51.124"
$keyPath = "$sourceDir\hetzner_key"
$remoteUser = "pioneer"
$remoteDir = "/var/www/pioneer-academy"

# 2. Nettoyer les anciens zips
if (Test-Path $zipFile) { Remove-Item $zipFile }

# 3. Zipper le projet
Write-Host "📦 Compression du projet en cours..." -ForegroundColor Cyan
Compress-Archive -Path "$sourceDir\*" -DestinationPath $zipFile -CompressionLevel Fastest -Force

# 4. Envoyer le zip sur le serveur (via SCP)
Write-Host "🚀 Envoi vers le serveur ($serverIp)..." -ForegroundColor Cyan
& scp -i "$keyPath" -o StrictHostKeyChecking=no "$zipFile" "${remoteUser}@${serverIp}:/tmp/deploy_package.zip"

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Transfert réussi !" -ForegroundColor Green
    
    # 5. Dézipper sur le serveur (via SSH)
    Write-Host "📂 Décompression sur le serveur..." -ForegroundColor Cyan
    $sshCommand = "unzip -o /tmp/deploy_package.zip -d $remoteDir"
    & ssh -i "$keyPath" "${remoteUser}@${serverIp}" $sshCommand
    
    Write-Host "🎉 DÉPLOIEMENT TERMINÉ ! Les fichiers sont sur le serveur." -ForegroundColor Green
}
else {
    Write-Host "❌ Erreur lors du transfert SCP." -ForegroundColor Red
}
