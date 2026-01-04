# ============================================
# SCRIPT DE RESCUE MODE - PIONEER ACADEMY VPS
# ============================================
# Ce script automatise la configuration SSH en mode Rescue
# Auteur: Antigravity AI Assistant
# Date: 2025-12-30
# ============================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   RESCUE MODE SETUP - PIONEER ACADEMY VPS" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Configuration
$VPS_IP = "77.42.75.58"
$SSH_USER = "pioneer"
$SSH_PUBLIC_KEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILTlNH7VhnZfPxmoLsy0HyKKhF5xVlyO5vE5SKGGhG0I abdoulrazaktanko06@gmail.com"

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  IP VPS: $VPS_IP" -ForegroundColor White
Write-Host "  User SSH: $SSH_USER" -ForegroundColor White
Write-Host ""

# Étape 1: Vérification Rescue Mode
Write-Host "[1/7] Vérification du mode Rescue..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: Assurez-vous d'avoir activé le Rescue Mode dans Hetzner Cloud Console:" -ForegroundColor Red
Write-Host "  1. https://console.hetzner.cloud/" -ForegroundColor White
Write-Host "  2. Servers > Votre serveur > Rescue" -ForegroundColor White
Write-Host "  3. Enable rescue & power cycle" -ForegroundColor White
Write-Host ""

$rescueConfirm = Read-Host "Avez-vous activé le Rescue Mode et attendu 1 minute? (oui/non)"
if ($rescueConfirm -ne "oui") {
    Write-Host "❌ Veuillez activer le Rescue Mode d'abord!" -ForegroundColor Red
    Write-Host "Appuyez sur une touche pour quitter..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host "✅ Rescue Mode confirmé" -ForegroundColor Green
Write-Host ""

# Étape 2: Connexion SSH en mode Rescue
Write-Host "[2/7] Préparation de la connexion SSH..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Le script va maintenant vous guider pour vous connecter en SSH." -ForegroundColor Cyan
Write-Host "Vous devrez entrer le MOT DE PASSE RESCUE fourni par Hetzner." -ForegroundColor Cyan
Write-Host ""
Write-Host "Commande SSH à exécuter:" -ForegroundColor Yellow
Write-Host "  ssh root@$VPS_IP" -ForegroundColor White
Write-Host ""
Write-Host "Appuyez sur une touche pour continuer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Étape 3: Création du script Bash à exécuter sur le serveur
Write-Host ""
Write-Host "[3/7] Création du script de configuration..." -ForegroundColor Yellow

$bashScript = @"
#!/bin/bash
# Script de configuration automatique en mode Rescue

echo "================================================"
echo "   CONFIGURATION SSH - MODE RESCUE"
echo "================================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Étape 1: Identifier le disque
echo -e "`${YELLOW}[1/6] Identification du disque principal...`${NC}"
lsblk
echo ""
echo -e "`${YELLOW}Quel est votre disque principal? (ex: sda1 ou nvme0n1p1)`${NC}"
read -p "Disque: " DISK_NAME

if [ -z "`$DISK_NAME" ]; then
    echo -e "`${RED}❌ Erreur: Disque non spécifié`${NC}"
    exit 1
fi

# Étape 2: Montage du disque
echo ""
echo -e "`${YELLOW}[2/6] Montage de /dev/`$DISK_NAME sur /mnt...`${NC}"
mount /dev/`$DISK_NAME /mnt

if [ `$? -ne 0 ]; then
    echo -e "`${RED}❌ Erreur lors du montage`${NC}"
    exit 1
fi

echo -e "`${GREEN}✅ Disque monté avec succès`${NC}"
ls /mnt
echo ""

# Étape 3: Création du dossier .ssh
echo -e "`${YELLOW}[3/6] Création du dossier .ssh...`${NC}"
mkdir -p /mnt/home/$SSH_USER/.ssh

if [ `$? -eq 0 ]; then
    echo -e "`${GREEN}✅ Dossier .ssh créé`${NC}"
else
    echo -e "`${RED}❌ Erreur lors de la création du dossier`${NC}"
    exit 1
fi

# Étape 4: Ajout de la clé SSH
echo ""
echo -e "`${YELLOW}[4/6] Ajout de la clé SSH...`${NC}"
echo "$SSH_PUBLIC_KEY" > /mnt/home/$SSH_USER/.ssh/authorized_keys

if [ `$? -eq 0 ]; then
    echo -e "`${GREEN}✅ Clé SSH ajoutée`${NC}"
else
    echo -e "`${RED}❌ Erreur lors de l'ajout de la clé`${NC}"
    exit 1
fi

# Étape 5: Configuration des permissions
echo ""
echo -e "`${YELLOW}[5/6] Configuration des permissions...`${NC}"
chmod 700 /mnt/home/$SSH_USER/.ssh
chmod 600 /mnt/home/$SSH_USER/.ssh/authorized_keys
chown -R 1000:1000 /mnt/home/$SSH_USER/.ssh

if [ `$? -eq 0 ]; then
    echo -e "`${GREEN}✅ Permissions configurées`${NC}"
else
    echo -e "`${RED}❌ Erreur lors de la configuration des permissions`${NC}"
    exit 1
fi

# Étape 6: Vérification
echo ""
echo -e "`${YELLOW}[6/6] Vérification de la configuration...`${NC}"
echo "Contenu de authorized_keys:"
cat /mnt/home/$SSH_USER/.ssh/authorized_keys
echo ""

# Diagnostic Frontend & Nginx
echo ""
echo -e "`${YELLOW}========================================`${NC}"
echo -e "`${YELLOW}   DIAGNOSTIC FRONTEND & NGINX`${NC}"
echo -e "`${YELLOW}========================================`${NC}"
echo ""

echo -e "`${YELLOW}--- Contenu Frontend ---`${NC}"
ls -la /mnt/var/www/pioneer-academy/frontend/ 2>/dev/null || echo -e "`${RED}Dossier frontend introuvable`${NC}"
echo ""

echo -e "`${YELLOW}--- Configuration Nginx ---`${NC}"
cat /mnt/etc/nginx/sites-available/pioneer-academy 2>/dev/null || echo -e "`${RED}Configuration Nginx introuvable`${NC}"
echo ""

echo ""
echo -e "`${GREEN}================================================`${NC}"
echo -e "`${GREEN}   ✅ CONFIGURATION TERMINÉE !`${NC}"
echo -e "`${GREEN}================================================`${NC}"
echo ""
echo -e "`${YELLOW}Prochaines étapes:`${NC}"
echo -e "  1. Notez les résultats du diagnostic ci-dessus"
echo -e "  2. Tapez: exit"
echo -e "  3. Désactivez le Rescue Mode dans Hetzner Console"
echo -e "  4. Testez: ssh $SSH_USER@$VPS_IP"
echo ""
"@

# Sauvegarder le script
$bashScript | Out-File -FilePath "rescue-setup.sh" -Encoding UTF8 -NoNewline
Write-Host "✅ Script créé: rescue-setup.sh" -ForegroundColor Green

# Étape 4: Instructions finales
Write-Host ""
Write-Host "[4/7] Instructions pour la suite..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   INSTRUCTIONS ÉTAPE PAR ÉTAPE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Connectez-vous en SSH en mode Rescue:" -ForegroundColor Yellow
Write-Host "    ssh root@$VPS_IP" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Entrez le MOT DE PASSE RESCUE (fourni par Hetzner)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3️⃣  Une fois connecté, copiez/collez ces commandes UNE PAR UNE:" -ForegroundColor Yellow
Write-Host ""
Write-Host "    # Identifier le disque" -ForegroundColor Cyan
Write-Host "    lsblk" -ForegroundColor White
Write-Host ""
Write-Host "    # Monter le disque (remplacez sda1 par votre disque)" -ForegroundColor Cyan
Write-Host "    mount /dev/sda1 /mnt" -ForegroundColor White
Write-Host ""
Write-Host "    # Créer le dossier SSH" -ForegroundColor Cyan
Write-Host "    mkdir -p /mnt/home/$SSH_USER/.ssh" -ForegroundColor White
Write-Host ""
Write-Host "    # Ajouter la clé SSH" -ForegroundColor Cyan
Write-Host "    echo `"$SSH_PUBLIC_KEY`" > /mnt/home/$SSH_USER/.ssh/authorized_keys" -ForegroundColor White
Write-Host ""
Write-Host "    # Permissions" -ForegroundColor Cyan
Write-Host "    chmod 700 /mnt/home/$SSH_USER/.ssh" -ForegroundColor White
Write-Host "    chmod 600 /mnt/home/$SSH_USER/.ssh/authorized_keys" -ForegroundColor White
Write-Host "    chown -R 1000:1000 /mnt/home/$SSH_USER/.ssh" -ForegroundColor White
Write-Host ""
Write-Host "    # Vérification" -ForegroundColor Cyan
Write-Host "    cat /mnt/home/$SSH_USER/.ssh/authorized_keys" -ForegroundColor White
Write-Host ""
Write-Host "    # DIAGNOSTIC (IMPORTANT!)" -ForegroundColor Cyan
Write-Host "    ls -la /mnt/var/www/pioneer-academy/frontend/" -ForegroundColor White
Write-Host "    cat /mnt/etc/nginx/sites-available/pioneer-academy" -ForegroundColor White
Write-Host ""
Write-Host "4️⃣  Tapez: exit" -ForegroundColor Yellow
Write-Host ""
Write-Host "5️⃣  Désactivez le Rescue Mode (Hetzner Console)" -ForegroundColor Yellow
Write-Host ""
Write-Host "6️⃣  Testez: ssh $SSH_USER@$VPS_IP" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Créer un fichier avec toutes les commandes
$allCommands = @"
# ========================================
# COMMANDES À EXÉCUTER EN MODE RESCUE
# ========================================

# 1. Identifier le disque
lsblk

# 2. Monter le disque (REMPLACEZ sda1 par votre disque!)
mount /dev/sda1 /mnt

# 3. Vérifier le montage
ls /mnt

# 4. Créer le dossier SSH
mkdir -p /mnt/home/$SSH_USER/.ssh

# 5. Ajouter la clé SSH
echo "$SSH_PUBLIC_KEY" > /mnt/home/$SSH_USER/.ssh/authorized_keys

# 6. Permissions dossier .ssh
chmod 700 /mnt/home/$SSH_USER/.ssh

# 7. Permissions authorized_keys
chmod 600 /mnt/home/$SSH_USER/.ssh/authorized_keys

# 8. Propriétaire
chown -R 1000:1000 /mnt/home/$SSH_USER/.ssh

# 9. Vérification
cat /mnt/home/$SSH_USER/.ssh/authorized_keys

# 10. DIAGNOSTIC FRONTEND
ls -la /mnt/var/www/pioneer-academy/frontend/

# 11. DIAGNOSTIC NGINX
cat /mnt/etc/nginx/sites-available/pioneer-academy

# 12. Sortir
exit
"@

$allCommands | Out-File -FilePath "rescue-commands.txt" -Encoding UTF8
Write-Host "✅ Fichier créé: rescue-commands.txt (toutes les commandes)" -ForegroundColor Green
Write-Host ""

Write-Host "[5/7] Création d'une nouvelle paire de clés SSH (optionnel)..." -ForegroundColor Yellow
$newKeyConfirm = Read-Host "Voulez-vous créer une NOUVELLE paire de clés SSH? (oui/non)"

if ($newKeyConfirm -eq "oui") {
    Write-Host ""
    Write-Host "Création d'une nouvelle clé SSH..." -ForegroundColor Cyan
    
    $sshKeyPath = "$env:USERPROFILE\.ssh\pioneer-vps"
    
    # Créer le dossier .ssh s'il n'existe pas
    if (-not (Test-Path "$env:USERPROFILE\.ssh")) {
        New-Item -ItemType Directory -Path "$env:USERPROFILE\.ssh" -Force | Out-Null
    }
    
    # Générer la clé
    ssh-keygen -t ed25519 -f $sshKeyPath -N '""' -C "pioneer-vps-rescue-$(Get-Date -Format 'yyyy-MM-dd')"
    
    Write-Host "✅ Nouvelle clé SSH créée!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Clé publique:" -ForegroundColor Yellow
    Get-Content "$sshKeyPath.pub"
    Write-Host ""
    Write-Host "Cette clé a été sauvegardée dans: $sshKeyPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "⚠️  Utilisez CETTE clé publique dans les commandes Rescue!" -ForegroundColor Red
}

Write-Host ""
Write-Host "[6/7] Résumé des fichiers créés..." -ForegroundColor Yellow
Write-Host "✅ rescue-setup.sh - Script bash automatique" -ForegroundColor Green
Write-Host "✅ rescue-commands.txt - Toutes les commandes" -ForegroundColor Green
Write-Host ""

Write-Host "[7/7] PRÊT À COMMENCER!" -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   🚀 ACTION REQUISE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "MAINTENANT, faites ceci:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Ouvrez un NOUVEAU terminal PowerShell" -ForegroundColor White
Write-Host "2. Tapez: ssh root@$VPS_IP" -ForegroundColor White
Write-Host "3. Entrez le MOT DE PASSE RESCUE" -ForegroundColor White
Write-Host "4. Copiez/collez les commandes du fichier rescue-commands.txt" -ForegroundColor White
Write-Host ""
Write-Host "📋 Fichier des commandes: rescue-commands.txt" -ForegroundColor Cyan
Write-Host "📍 Emplacement: $(Get-Location)\rescue-commands.txt" -ForegroundColor Cyan
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Appuyez sur une touche pour ouvrir rescue-commands.txt..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
notepad rescue-commands.txt
