$ErrorActionPreference = "Stop"

# ============================================================================
# 🚀 DÉPLOIEMENT PRODUCTION - Academy of Pi
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

# 1. Vérifications
Write-Host "🔍 Vérification de l'environnement..." -ForegroundColor Yellow
if (-not (Test-Path $distDir)) {
    Write-Host "❌ ERREUR: dist/ non trouvé. Run 'npm run build'." -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $keyPath)) {
    Write-Host "❌ ERREUR: Clé SSH non trouvée." -ForegroundColor Red
    exit 1
}

# 2. Nettoyage et Zip
if (Test-Path $zipFile) { Remove-Item $zipFile }
Write-Host "📦 Compression de dist/..." -ForegroundColor Cyan
Compress-Archive -Path "$distDir\*" -DestinationPath $zipFile -CompressionLevel Fastest -Force
Write-Host "   ✅ Zip créé." -ForegroundColor Green

# 3. Transfert SCP
Write-Host "🚀 Transfert vers $serverIp..." -ForegroundColor Cyan
scp -i "$keyPath" -o StrictHostKeyChecking=no "$zipFile" "${remoteUser}@${serverIp}:$remoteTempZip"
if ($LASTEXITCODE -ne 0) { throw "Erreur SCP" }
Write-Host "   ✅ Transfert réussi." -ForegroundColor Green

# 4. Commandes SSH (Bash)
# Note: Using a here-string for the commands, to be passed to SSH
$remoteScript = @"
    # Stop on error
    set -e
    
    echo '📂 Preparing directory...'
    # Backup current
    if [ -d $remoteAppDir ]; then
        # Remove old backup if exists
        rm -rf ${remoteAppDir}_backup
        # Move current to backup
        mv $remoteAppDir ${remoteAppDir}_backup
    fi
    
    # Create new dir
    mkdir -p $remoteAppDir
    
    # Unzip
    echo '📦 Unzipping...'
    unzip -o $remoteTempZip -d $remoteAppDir > /dev/null
    
    # Cleanup zip
    rm $remoteTempZip
    
    # Permissions
    echo '🔒 Setting permissions...'
    sudo chown -R www-data:www-data $remoteAppDir
    sudo chmod -R 755 $remoteAppDir
    
    echo '✅ SUCCESS: Deployed to $remoteAppDir'
"@

# 5. Exécution SSH
Write-Host "🔧 Installation sur le serveur..." -ForegroundColor Cyan
# We pipe the script to ssh to avoid quote escaping hell
$remoteScript | ssh -i "$keyPath" -o StrictHostKeyChecking=no "${remoteUser}@${serverIp}" "bash -s"

if ($LASTEXITCODE -ne 0) { 
    Write-Host "❌ Erreur lors du déploiement SSH." -ForegroundColor Red
    exit 1
}

Write-Host "`n🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !" -ForegroundColor Green
Write-Host "🌍 https://www.pioneeracademy.academy" -ForegroundColor Cyan
