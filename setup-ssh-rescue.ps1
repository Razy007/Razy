# ============================================
# SETUP SSH POUR RESCUE MODE - VERSION COMPLÈTE
# ============================================
# Ce script crée une nouvelle clé SSH et prépare tout pour le Rescue Mode
# Auteur: Antigravity AI Assistant
# Date: 2025-12-30
# ============================================

param(
    [switch]$CreateNewKey = $false,
    [switch]$UseExistingKey = $true
)

$VPS_IP = "77.42.75.58"
$SSH_USER = "pioneer"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   SETUP SSH - RESCUE MODE HETZNER" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# ÉTAPE 1 : CHOIX DE LA CLÉ SSH
# ============================================

Write-Host "[1/5] Configuration de la clé SSH..." -ForegroundColor Yellow
Write-Host ""

if ($CreateNewKey) {
    Write-Host "Option : CRÉER UNE NOUVELLE CLÉ SSH" -ForegroundColor Cyan
    Write-Host ""
    
    $sshDir = "$env:USERPROFILE\.ssh"
    $keyPath = "$sshDir\hetzner_rescue"
    
    # Créer le dossier .ssh s'il n'existe pas
    if (-not (Test-Path $sshDir)) {
        New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
        Write-Host "✓ Dossier .ssh créé" -ForegroundColor Green
    }
    
    # Vérifier si la clé existe déjà
    if (Test-Path $keyPath) {
        Write-Host "⚠️  La clé $keyPath existe déjà!" -ForegroundColor Yellow
        $overwrite = Read-Host "Voulez-vous la remplacer? (oui/non)"
        if ($overwrite -ne "oui") {
            Write-Host "❌ Opération annulée" -ForegroundColor Red
            exit
        }
    }
    
    # Générer la nouvelle clé
    Write-Host "Génération de la nouvelle clé SSH ED25519..." -ForegroundColor Cyan
    ssh-keygen -t ed25519 -f $keyPath -N '""' -C "hetzner-rescue-$VPS_IP-$(Get-Date -Format 'yyyyMMdd')"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Clé SSH créée avec succès!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Clé privée : $keyPath" -ForegroundColor White
        Write-Host "Clé publique : $keyPath.pub" -ForegroundColor White
        Write-Host ""
        
        # Afficher la clé publique
        Write-Host "Votre NOUVELLE clé publique :" -ForegroundColor Yellow
        Write-Host "================================" -ForegroundColor Yellow
        $publicKey = Get-Content "$keyPath.pub"
        Write-Host $publicKey -ForegroundColor Green
        Write-Host "================================" -ForegroundColor Yellow
        Write-Host ""
        
        $SSH_PUBLIC_KEY = $publicKey
    }
    else {
        Write-Host "❌ Erreur lors de la création de la clé SSH" -ForegroundColor Red
        exit
    }
}
else {
    Write-Host "Option : UTILISER LA CLÉ EXISTANTE" -ForegroundColor Cyan
    Write-Host ""
    
    $SSH_PUBLIC_KEY = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILTlNH7VhnZfPxmoLsy0HyKKhF5xVlyO5vE5SKGGhG0I abdoulrazaktanko06@gmail.com"
    
    Write-Host "Clé publique utilisée :" -ForegroundColor Yellow
    Write-Host $SSH_PUBLIC_KEY -ForegroundColor Green
    Write-Host ""
}

Write-Host "✅ Clé SSH configurée" -ForegroundColor Green
Write-Host ""

# ============================================
# ÉTAPE 2 : NETTOYER LES ANCIENNES CLÉS
# ============================================

Write-Host "[2/5] Nettoyage des anciennes clés SSH..." -ForegroundColor Yellow

try {
    ssh-keygen -R $VPS_IP 2>&1 | Out-Null
    Write-Host "✅ Anciennes clés SSH nettoyées" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Pas d'anciennes clés à nettoyer" -ForegroundColor Yellow
}

Write-Host ""

# ============================================
# ÉTAPE 3 : VÉRIFIER RESCUE MODE
# ============================================

Write-Host "[3/5] Vérification du mode Rescue..." -ForegroundColor Yellow
Write-Host ""
Write-Host "⚠️  IMPORTANT : Avez-vous activé le Rescue Mode dans Hetzner?" -ForegroundColor Red
Write-Host ""
Write-Host "Si NON, suivez ces étapes :" -ForegroundColor Yellow
Write-Host "  1. https://console.hetzner.cloud/" -ForegroundColor White
Write-Host "  2. Servers > Votre serveur (77.42.75.58)" -ForegroundColor White
Write-Host "  3. Onglet 'Rescue'" -ForegroundColor White
Write-Host "  4. 'Enable rescue & power cycle'" -ForegroundColor White
Write-Host "  5. Copiez le MOT DE PASSE RESCUE affiché" -ForegroundColor White
Write-Host "  6. Attendez 1 minute" -ForegroundColor White
Write-Host ""

$rescueReady = Read-Host "Le Rescue Mode est-il activé? (oui/non)"

if ($rescueReady -ne "oui") {
    Write-Host ""
    Write-Host "❌ Veuillez activer le Rescue Mode d'abord!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Appuyez sur une touche pour quitter..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""
Write-Host "✅ Rescue Mode confirmé" -ForegroundColor Green
Write-Host ""

# ============================================
# ÉTAPE 4 : CRÉER LE SCRIPT RESCUE
# ============================================

Write-Host "[4/5] Création du script de configuration Rescue..." -ForegroundColor Yellow

$rescueScript = @"
#!/bin/bash
# Script de configuration SSH automatique en mode Rescue
# Généré automatiquement le $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

set -e  # Arrêter en cas d'erreur

echo "================================================"
echo "   CONFIGURATION SSH - MODE RESCUE"
echo "   Pioneer Academy VPS"
echo "================================================"
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
SSH_USER="$SSH_USER"
SSH_PUBLIC_KEY="$SSH_PUBLIC_KEY"

# Étape 1: Identifier le disque
echo -e "`${YELLOW}[1/7] Identification du disque principal...`${NC}"
echo ""
lsblk
echo ""

# Demander le disque (avec valeur par défaut)
read -p "Entrez le nom du disque principal [sda1]: " DISK_INPUT
DISK_NAME=`${DISK_INPUT:-sda1}

echo ""
echo -e "`${CYAN}Disque sélectionné : /dev/`$DISK_NAME`${NC}"

# Étape 2: Montage du disque
echo ""
echo -e "`${YELLOW}[2/7] Montage de /dev/`$DISK_NAME sur /mnt...`${NC}"

if mount | grep -q "/mnt"; then
    echo -e "`${YELLOW}⚠️  /mnt est déjà monté. Démontage...`${NC}"
    umount /mnt 2>/dev/null || true
fi

mount /dev/`$DISK_NAME /mnt

if [ `$? -eq 0 ]; then
    echo -e "`${GREEN}✅ Disque monté avec succès`${NC}"
else
    echo -e "`${RED}❌ Erreur lors du montage`${NC}"
    exit 1
fi

echo ""
echo "Contenu de /mnt :"
ls -la /mnt | head -10
echo ""

# Étape 3: Création du dossier .ssh
echo -e "`${YELLOW}[3/7] Création du dossier .ssh pour `$SSH_USER...`${NC}"

mkdir -p /mnt/home/`$SSH_USER/.ssh

if [ `$? -eq 0 ]; then
    echo -e "`${GREEN}✅ Dossier .ssh créé`${NC}"
else
    echo -e "`${RED}❌ Erreur lors de la création du dossier`${NC}"
    exit 1
fi

# Étape 4: Ajout de la clé SSH
echo ""
echo -e "`${YELLOW}[4/7] Ajout de la clé SSH publique...`${NC}"

echo "`$SSH_PUBLIC_KEY" > /mnt/home/`$SSH_USER/.ssh/authorized_keys

if [ `$? -eq 0 ]; then
    echo -e "`${GREEN}✅ Clé SSH ajoutée`${NC}"
else
    echo -e "`${RED}❌ Erreur lors de l'ajout de la clé`${NC}"
    exit 1
fi

# Étape 5: Permissions
echo ""
echo -e "`${YELLOW}[5/7] Configuration des permissions...`${NC}"

chmod 700 /mnt/home/`$SSH_USER/.ssh
chmod 600 /mnt/home/`$SSH_USER/.ssh/authorized_keys
chown -R 1000:1000 /mnt/home/`$SSH_USER/.ssh

if [ `$? -eq 0 ]; then
    echo -e "`${GREEN}✅ Permissions configurées`${NC}"
else
    echo -e "`${RED}❌ Erreur lors de la configuration des permissions`${NC}"
    exit 1
fi

# Étape 6: Vérification
echo ""
echo -e "`${YELLOW}[6/7] Vérification de la configuration...`${NC}"
echo ""
echo "Contenu de authorized_keys:"
echo "----------------------------"
cat /mnt/home/`$SSH_USER/.ssh/authorized_keys
echo "----------------------------"
echo ""
echo "Permissions:"
ls -la /mnt/home/`$SSH_USER/.ssh/
echo ""

# Étape 7: Diagnostic
echo ""
echo -e "`${YELLOW}[7/7] DIAGNOSTIC FRONTEND & NGINX`${NC}"
echo ""
echo -e "`${CYAN}========================================`${NC}"
echo -e "`${CYAN}   DIAGNOSTIC SYSTÈME`${NC}"
echo -e "`${CYAN}========================================`${NC}"
echo ""

echo -e "`${YELLOW}--- Contenu Frontend ---`${NC}"
if [ -d "/mnt/var/www/pioneer-academy/frontend" ]; then
    ls -la /mnt/var/www/pioneer-academy/frontend/
else
    echo -e "`${RED}❌ Dossier frontend introuvable!`${NC}"
    echo "Recherche du dossier..."
    find /mnt/var/www -name "pioneer-academy" -type d 2>/dev/null || echo "Aucun dossier trouvé"
fi

echo ""
echo -e "`${YELLOW}--- Configuration Nginx ---`${NC}"
if [ -f "/mnt/etc/nginx/sites-available/pioneer-academy" ]; then
    cat /mnt/etc/nginx/sites-available/pioneer-academy
else
    echo -e "`${RED}❌ Configuration Nginx introuvable!`${NC}"
    echo "Configurations Nginx disponibles:"
    ls -la /mnt/etc/nginx/sites-available/ 2>/dev/null || echo "Dossier non trouvé"
fi

echo ""
echo -e "`${YELLOW}--- Services Systemd ---`${NC}"
if [ -d "/mnt/etc/systemd/system" ]; then
    echo "Services personnalisés:"
    ls -la /mnt/etc/systemd/system/*.service 2>/dev/null || echo "Aucun service personnalisé"
fi

echo ""
echo -e "`${GREEN}========================================`${NC}"
echo -e "`${GREEN}   ✅ CONFIGURATION TERMINÉE !`${NC}"
echo -e "`${GREEN}========================================`${NC}"
echo ""
echo -e "`${CYAN}Prochaines étapes:`${NC}"
echo "  1. Notez les résultats du diagnostic ci-dessus"
echo "  2. Tapez: exit"
echo "  3. Désactivez le Rescue Mode (Hetzner Console)"
echo "  4. Testez: ssh `$SSH_USER@$VPS_IP"
echo ""
echo -e "`${YELLOW}📋 N'oubliez pas de copier le diagnostic !`${NC}"
echo ""
"@

# Sauvegarder le script
$rescueScript | Out-File -FilePath "rescue-auto.sh" -Encoding UTF8
Write-Host "✅ Script créé: rescue-auto.sh" -ForegroundColor Green
Write-Host ""

# ============================================
# ÉTAPE 5 : INSTRUCTIONS FINALES
# ============================================

Write-Host "[5/5] INSTRUCTIONS POUR LA CONNEXION..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   MÉTHODE 1 : CONNEXION MANUELLE (Simple)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Connectez-vous en SSH :" -ForegroundColor Yellow
Write-Host ""
Write-Host "    ssh root@$VPS_IP" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Entrez le MOT DE PASSE RESCUE (Hetzner)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3️⃣  Copiez/collez tout le script ci-dessous :" -ForegroundColor Yellow
Write-Host ""
Write-Host "    # Télécharger et exécuter le script" -ForegroundColor Cyan
Write-Host "    cat > /tmp/setup.sh << 'EOFSCRIPT'" -ForegroundColor White
Get-Content "rescue-auto.sh" | ForEach-Object { Write-Host "    $_" -ForegroundColor Gray }
Write-Host "    EOFSCRIPT" -ForegroundColor White
Write-Host ""
Write-Host "    chmod +x /tmp/setup.sh" -ForegroundColor White
Write-Host "    /tmp/setup.sh" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   MÉTHODE 2 : COMMANDES SIMPLES (Recommandé)" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1️⃣  Connexion SSH :" -ForegroundColor Yellow
Write-Host ""
Write-Host "    ssh root@$VPS_IP" -ForegroundColor White
Write-Host ""
Write-Host "2️⃣  Dans le terminal Rescue, copiez/collez UNE PAR UNE :" -ForegroundColor Yellow
Write-Host ""

$commands = @(
    "# Identifier le disque",
    "lsblk",
    "",
    "# Monter le disque (ADAPTEZ sda1 si nécessaire)",
    "mount /dev/sda1 /mnt",
    "",
    "# Vérifier",
    "ls /mnt",
    "",
    "# Créer .ssh",
    "mkdir -p /mnt/home/$SSH_USER/.ssh",
    "",
    "# Ajouter la clé SSH",
    "echo `"$SSH_PUBLIC_KEY`" > /mnt/home/$SSH_USER/.ssh/authorized_keys",
    "",
    "# Permissions",
    "chmod 700 /mnt/home/$SSH_USER/.ssh",
    "chmod 600 /mnt/home/$SSH_USER/.ssh/authorized_keys",
    "chown -R 1000:1000 /mnt/home/$SSH_USER/.ssh",
    "",
    "# Vérifier",
    "cat /mnt/home/$SSH_USER/.ssh/authorized_keys",
    "",
    "# DIAGNOSTIC",
    "ls -la /mnt/var/www/pioneer-academy/frontend/",
    "cat /mnt/etc/nginx/sites-available/pioneer-academy",
    "",
    "# Sortir",
    "exit"
)

foreach ($cmd in $commands) {
    if ($cmd.StartsWith("#")) {
        Write-Host "    $cmd" -ForegroundColor Cyan
    }
    elseif ($cmd -eq "") {
        Write-Host ""
    }
    else {
        Write-Host "    $cmd" -ForegroundColor White
    }
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Sauvegarder les commandes dans un fichier
$commands -join "`n" | Out-File -FilePath "commandes-rescue-simple.txt" -Encoding UTF8
Write-Host "✅ Commandes sauvegardées : commandes-rescue-simple.txt" -ForegroundColor Green
Write-Host ""

# Résumé final
Write-Host "================================================" -ForegroundColor Green
Write-Host "   ✅ TOUT EST PRÊT !" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "Fichiers créés :" -ForegroundColor Yellow
Write-Host "  • rescue-auto.sh (script bash automatique)" -ForegroundColor White
Write-Host "  • commandes-rescue-simple.txt (commandes simples)" -ForegroundColor White
Write-Host ""
Write-Host "Clé SSH utilisée :" -ForegroundColor Yellow
Write-Host "  $SSH_PUBLIC_KEY" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes :" -ForegroundColor Yellow
Write-Host "  1. Ouvrez PowerShell" -ForegroundColor White
Write-Host "  2. Tapez: ssh root@$VPS_IP" -ForegroundColor White
Write-Host "  3. Entrez le MOT DE PASSE RESCUE" -ForegroundColor White
Write-Host "  4. Suivez la MÉTHODE 2 (commandes simples)" -ForegroundColor White
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Demander s'il faut ouvrir le fichier de commandes
$openFile = Read-Host "Voulez-vous ouvrir 'commandes-rescue-simple.txt'? (oui/non)"
if ($openFile -eq "oui") {
    notepad commandes-rescue-simple.txt
}

Write-Host ""
Write-Host "🚀 Bonne chance! Vous allez y arriver! 💪" -ForegroundColor Cyan
Write-Host ""
