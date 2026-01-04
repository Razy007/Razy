# Script de Réinitialisation d'Urgence SSH
# À exécuter dans PowerShell
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host "   🚑 PI ACADEMY - RÉINITIALISATION D'URGENCE SSH" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérification et Création des Clés
$sshDir = "$env:USERPROFILE\.ssh"
$keyPath = "$sshDir\id_ed25519"

if (-not (Test-Path $sshDir)) {
    Write-Host "📂 Création du dossier .ssh..." -ForegroundColor Yellow
    $null = New-Item -ItemType Directory -Force -Path $sshDir
}

if (-not (Test-Path $keyPath)) {
    Write-Host "🔑 Génération d'une nouvelle clé SSH (Appuyez sur Entrée si demandé)..." -ForegroundColor Yellow
    ssh-keygen -t ed25519 -f $keyPath -N "" -q
    Write-Host "✅ Clé générée avec succès." -ForegroundColor Green
}
else {
    Write-Host "ℹ️ Une clé SSH existe déjà, nous allons l'utiliser." -ForegroundColor Green
}

# 2. Nettoyage des anciennes empreintes du serveur
Write-Host "🧹 Nettoyage des anciennes connexions vers 77.42.75.58..." -ForegroundColor Yellow
ssh-keygen -R 77.42.75.58 2>$null
Write-Host "✅ Nettoyage terminé." -ForegroundColor Green

# 3. Affichage de la Clé Publique
$publicKey = Get-Content "$keyPath.pub"
Write-Host ""
Write-Host "⚠️ COPIEZ CETTE LIGNE CI-DESSOUS (C'EST VOTRE CLÉ PUBLIQUE) :" -ForegroundColor Magenta
Write-Host "---------------------------------------------------"
Write-Host $publicKey -ForegroundColor White -BackgroundColor Black
Write-Host "---------------------------------------------------"
Write-Host "👆 Vous en aurez besoin à l'ÉTAPE 4 du guide." -ForegroundColor Magenta
Write-Host ""

# 4. Instructions pour Hetzner
Write-Host "🛑 STOP ! LISEZ CECI AVANT DE CONTINUER :" -ForegroundColor Red
Write-Host "1. Allez sur la console Hetzner - Serveur - Rescue."
Write-Host "2. Désactivez le Rescue s'il est actif."
Write-Host "3. Activez 'Enable rescue and power cycle'."
Write-Host "4. ⚠️ COPIEZ LE MOT DE PASSE QUI S'AFFICHE SUR HETZNER !"
Write-Host ""
Pause

# 5. Lancement de la connexion
Write-Host ""
Write-Host "🚀 Lancement de la connexion SSH..." -ForegroundColor Cyan
Write-Host "👉 Quand 'password:' s'affiche, COLLEZ le mot de passe Hetzner (Clic Droit)." -ForegroundColor Yellow
Write-Host ""

ssh root@77.42.75.58
