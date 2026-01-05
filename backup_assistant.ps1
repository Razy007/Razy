$ErrorActionPreference = "Stop"

# Configuration
$ProjectDir = "c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app"
$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm"
$BackupName = "Academy_of_Pi_Backup_$Timestamp"
$ZipFileName = "$BackupName.zip"
$ZipPath = Join-Path $ProjectDir $ZipFileName

# Destinations
$DestUsb = "D:\"
$DestOneDrive = "C:\Users\lenovo\OneDrive\Documents"

# 1. Create Zip (Excluding heavy folders)
Write-Host "📦 Création de l'archive de sauvegarde..."
if (Test-Path $ZipPath) { Remove-Item $ZipPath }

# Note: Compress-Archive can be slow with node_modules. We will try to exclude it if possible.
# PowerShell 5.1/7 Compress-Archive doesn't have a simple Exclude parameter for folders when zipping a root dir.
# Strategy: Get-ChildItem excluding node_modules/git/dist, then pipe to Compress-Archive.

$files = Get-ChildItem -Path $ProjectDir -Exclude "node_modules", ".git", "dist", ".gemini", "*.zip"
Compress-Archive -Path $files.FullName -DestinationPath $ZipPath -Force

Write-Host "✅ Archive créée : $ZipPath"

# 2. Copy to USB (D:\)
Write-Host "`n💾 Copie vers USB ($DestUsb)..."
if (Test-Path $DestUsb) {
    try {
        $UsbTarget = Join-Path $DestUsb $ZipFileName
        Copy-Item -Path $ZipPath -Destination $UsbTarget -Force
        Write-Host "✅ Sauvegarde USB réussie : $UsbTarget"
    }
    catch {
        Write-Host "❌ Erreur copie USB : $_"
    }
}
else {
    Write-Host "⚠️ Lecteur D:\ non détecté. Vérifiez votre clé USB."
}

# 3. Copy to OneDrive
Write-Host "`n☁️ Copie vers OneDrive ($DestOneDrive)..."
if (Test-Path $DestOneDrive) {
    try {
        $OneDriveTarget = Join-Path $DestOneDrive $ZipFileName
        Copy-Item -Path $ZipPath -Destination $OneDriveTarget -Force
        Write-Host "✅ Sauvegarde OneDrive réussie : $OneDriveTarget"
    }
    catch {
        Write-Host "❌ Erreur copie OneDrive : $_"
    }
}
else {
    Write-Host "⚠️ Dossier OneDrive non trouvé : $DestOneDrive"
    # Try Documents default
    $DestDocs = [Environment]::GetFolderPath("MyDocuments")
    Write-Host "Essai dans Documents par défaut : $DestDocs"
    Copy-Item -Path $ZipPath -Destination (Join-Path $DestDocs $ZipFileName) -Force
}

# 4. Verification
Write-Host "`n🔍 Vérification terminée."
