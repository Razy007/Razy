$ErrorActionPreference = "Stop"

# ============================================================================
# 🚀 DÉPLOIEMENT PRODUCTION - Academy of Pi
# ============================================================================
# Ce script déploie UNIQUEMENT le build optimisé (dist/) en production
# ============================================================================

Write-Host "`n🎯 DÉPLOIEMENT PRODUCTION - Academy of Pi" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════`n" -ForegroundColor Cyan

# Variables
$sourceDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$distDir = "$sourceDir\dist"
$zipFile = "$sourceDir\dist_deploy.zip"
$serverIp = "116.203.51.124"
$keyPath = "$sourceDir\hetzner_key"
$remoteUser = "pioneer"
$remoteTempZip = "/tmp/dist_deploy.zip"
$remoteAppDir = "/var/www/pioneer-academy"

# Vérifications préalables
Write-Host "🔍 Vérification de l'environnement..." -ForegroundColor Yellow

if (-not (Test-Path $distDir)) {
    Write-Host "❌ ERREUR: Le dossier dist/ n'existe pas !" -ForegroundColor Red
    Write-Host "   Veuillez exécuter 'npm run build' d'abord.`n" -ForegroundColor Red
    exit 1
}

if (-not (Test-Path $keyPath)) {
    Write-Host "❌ ERREUR: Clé SSH introuvable: $keyPath`n" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ dist/ trouvé" -ForegroundColor Green
Write-Host "   ✅ Clé SSH trouvée`n" -ForegroundColor Green

# Nettoyage ancien zip
if (Test-Path $zipFile) { 
    Write-Host "🧹 Suppression ancien zip..." -ForegroundColor Yellow
    Remove-Item $zipFile 
}

# Compression du dossier dist/
Write-Host "📦 Compression de dist/..." -ForegroundColor Cyan
try {
    Compress-Archive -Path "$distDir\*" -DestinationPath $zipFile -CompressionLevel Fastest -Force
    $zipSize = (Get-Item $zipFile).Length / 1MB
    Write-Host "   ✅ Zip créé: $([math]::Round($zipSize, 2)) MB`n" -ForegroundColor Green
}
catch {
    Write-Host "❌ Erreur lors de la compression: $_`n" -ForegroundColor Red
    exit 1
}

# Transfert SCP
Write-Host "🚀 Transfert vers $serverIp..." -ForegroundColor Cyan
scp -i "$keyPath" -o StrictHostKeyChecking=no "$zipFile" "${remoteUser}@${serverIp}:$remoteTempZip"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du transfert SCP.`n" -ForegroundColor Red
    exit 1
}

Write-Host "   ✅ Transfert réussi !`n" -ForegroundColor Green

# Déploiement sur le serveur
Write-Host "📂 Déploiement sur le serveur..." -ForegroundColor Cyan

# Backup de l'ancien répertoire
Write-Host "   📦 Backup de l'ancien déploiement..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" "if [ -d $remoteAppDir ]; then sudo mv $remoteAppDir ${remoteAppDir}_backup; fi"

# Créer le répertoire
Write-Host "   📁 Création du répertoire..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" "sudo mkdir -p $remoteAppDir"

# Décompresser
Write-Host "   📦 Décompression..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" "sudo unzip -o $remoteTempZip -d $remoteAppDir"

# Permissions
Write-Host "   🔐 Configuration des permissions..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" 'sudo chown -R www-data:www-data /var/www/pioneer-academy; sudo chmod -R 755 /var/www/pioneer-academy'

# Nettoyage
Write-Host "   🧹 Nettoyage..." -ForegroundColor Yellow
ssh -i "$keyPath" "${remoteUser}@${serverIp}" "rm $remoteTempZip"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du déploiement.`n" -ForegroundColor Red
    exit 1
}

# Nettoyage local
Remove-Item $zipFile

# Succès
Write-Host "`n🎉 DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "🌍 URL: https://www.pioneeracademy.academy" -ForegroundColor Cyan
Write-Host "📁 Chemin serveur: $remoteAppDir" -ForegroundColor Cyan
Write-Host "🔙 Backup: ${remoteAppDir}_backup`n" -ForegroundColor Yellow

Write-Host "⚠️  PROCHAINES ÉTAPES:" -ForegroundColor Yellow
Write-Host "   1. Testez l'application sur www.pioneeracademy.academy" -ForegroundColor White
Write-Host "   2. Si OK: Procéder au backup Git (Phase A1)" -ForegroundColor White
Write-Host "   3. Si KO: Restaurer avec SSH: sudo mv /var/www/pioneer-academy_backup /var/www/pioneer-academy`n" -ForegroundColor White
