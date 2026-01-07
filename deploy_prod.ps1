$ErrorActionPreference = "Stop"

Write-Host "`n======================================================" -ForegroundColor Cyan
Write-Host "DEPLOIEMENT PRODUCTION - Academy of Pi" -ForegroundColor Cyan
Write-Host "======================================================`n" -ForegroundColor Cyan

# Variables
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$distDir = "$sourceDir\dist"
$zipFile = "$sourceDir\dist_deploy.zip"
$serverIp = "116.203.51.124"
$keyPath = "$sourceDir\hetzner_key"
$remoteUser = "pioneer"
$remoteTempZip = "/tmp/dist_deploy.zip"
$remoteAppDir = "/var/www/pioneer-academy"

# Verifications
Write-Host "Verification de l'environnement..." -ForegroundColor Yellow

if (-not (Test-Path $distDir)) {
    Write-Host "ERREUR: Le dossier dist/ n'existe pas !" -ForegroundColor Red
    Write-Host "Veuillez executer 'npm run build' d'abord.`n" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $keyPath)) {
    Write-Host "ERREUR: Cle SSH introuvable: $keyPath`n" -ForegroundColor Red
    exit 1
}

Write-Host "   OK: dist/ trouve" -ForegroundColor Green
Write-Host "   OK: Cle SSH trouvee`n" -ForegroundColor Green

# Nettoyage ancien zip
if (Test-Path $zipFile) { 
    Write-Host "Suppression ancien zip..." -ForegroundColor Yellow
    Remove-Item $zipFile 
}

# Compression
Write-Host "Compression de dist/..." -ForegroundColor Cyan
try {
    Compress-Archive -Path "$distDir\*" -DestinationPath $zipFile -CompressionLevel Fastest -Force
    $zipSize = (Get-Item $zipFile).Length / 1MB
    Write-Host "   OK: Zip cree: $([math]::Round($zipSize, 2)) MB`n" -ForegroundColor Green
}
catch {
    Write-Host "ERREUR lors de la compression: $_`n" -ForegroundColor Red
    exit 1
}

# Transfert SCP
Write-Host "Transfert vers $serverIp..." -ForegroundColor Cyan
scp -i "$keyPath" -o StrictHostKeyChecking=no "$zipFile" "${remoteUser}@${serverIp}:$remoteTempZip"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors du transfert SCP.`n" -ForegroundColor Red
    exit 1
}

Write-Host "   OK: Transfert reussi !`n" -ForegroundColor Green

# Deploiement
Write-Host "Deploiement sur le serveur..." -ForegroundColor Cyan

# Backup
Write-Host "   Backup de l'ancien deploiement..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" 'if [ -d /var/www/pioneer-academy ]; then sudo mv /var/www/pioneer-academy /var/www/pioneer-academy_backup; fi'

# Creation repertoire
Write-Host "   Creation du repertoire..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" 'sudo mkdir -p /var/www/pioneer-academy'

# Decompression
Write-Host "   Decompression..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" 'sudo unzip -o /tmp/dist_deploy.zip -d /var/www/pioneer-academy'

# Permissions
Write-Host "   Configuration des permissions..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" 'sudo chown -R www-data:www-data /var/www/pioneer-academy; sudo chmod -R 755 /var/www/pioneer-academy'

# Nettoyage
Write-Host "   Nettoyage..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" 'rm /tmp/dist_deploy.zip'

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERREUR lors du deploiement.`n" -ForegroundColor Red
    exit 1
}

# Nettoyage local
Remove-Item $zipFile

# Succes
Write-Host "`nDEPLOIEMENT REUSSI !" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Green
Write-Host "URL: https://www.pioneeracademy.academy" -ForegroundColor Cyan
Write-Host "Chemin serveur: $remoteAppDir" -ForegroundColor Cyan
Write-Host "Backup: ${remoteAppDir}_backup`n" -ForegroundColor Yellow

Write-Host "PROCHAINES ETAPES:" -ForegroundColor Yellow
Write-Host "   1. Testez l'application sur www.pioneeracademy.academy" -ForegroundColor White
Write-Host "   2. Si OK: Proceder au backup Git (Phase A1)" -ForegroundColor White
Write-Host "   3. Si KO: Restaurer avec SSH`n" -ForegroundColor White
