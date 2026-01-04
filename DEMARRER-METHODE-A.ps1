# ============================================
# SCRIPT AUTOMATIQUE - MÉTHODE A (SSH KEYS HETZNER)
# ============================================
# Ce script automatise la création et configuration de SSH Keys pour Hetzner
# Auteur: Antigravity AI Assistant
# Date: 2025-12-30
# ============================================

$VPS_IP = "77.42.75.58"
$SSH_USER = "pioneer"
$KEY_NAME = "hetzner_rescue"
$KEY_PATH = "$env:USERPROFILE\.ssh\$KEY_NAME"

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   MÉTHODE A : SSH KEYS HETZNER" -ForegroundColor Cyan
Write-Host "   Configuration Automatique" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================
# ÉTAPE 1 : NETTOYAGE
# ============================================

Write-Host "[1/6] Nettoyage de la configuration SSH..." -ForegroundColor Yellow
Write-Host ""

# Supprimer l'ancienne entrée known_hosts
Write-Host "Suppression de l'ancienne entrée pour $VPS_IP..." -ForegroundColor Cyan
try {
    ssh-keygen -R $VPS_IP 2>&1 | Out-Null
    Write-Host "✅ Ancienne entrée supprimée" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Pas d'ancienne entrée à supprimer" -ForegroundColor Yellow
}

# Vérifier
Write-Host ""
Write-Host "Vérification..." -ForegroundColor Cyan
$knownHostsPath = "$env:USERPROFILE\.ssh\known_hosts"
if (Test-Path $knownHostsPath) {
    $found = Select-String -Path $knownHostsPath -Pattern $VPS_IP -Quiet
    if ($found) {
        Write-Host "⚠️  L'IP $VPS_IP est encore dans known_hosts" -ForegroundColor Yellow
    }
    else {
        Write-Host "✅ L'IP $VPS_IP n'est plus dans known_hosts" -ForegroundColor Green
    }
}
else {
    Write-Host "✅ Fichier known_hosts vide/inexistant" -ForegroundColor Green
}

Write-Host ""

# ============================================
# ÉTAPE 2 : CRÉATION DE LA CLÉ SSH
# ============================================

Write-Host "[2/6] Création de la nouvelle clé SSH..." -ForegroundColor Yellow
Write-Host ""

# Créer le dossier .ssh s'il n'existe pas
$sshDir = "$env:USERPROFILE\.ssh"
if (-not (Test-Path $sshDir)) {
    New-Item -ItemType Directory -Path $sshDir -Force | Out-Null
    Write-Host "✓ Dossier .ssh créé" -ForegroundColor Green
}

# Vérifier si la clé existe déjà
if (Test-Path $KEY_PATH) {
    Write-Host "⚠️  La clé $KEY_NAME existe déjà!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Options:" -ForegroundColor Cyan
    Write-Host "  1. Utiliser la clé existante" -ForegroundColor White
    Write-Host "  2. Créer une nouvelle clé (remplacer)" -ForegroundColor White
    Write-Host ""
    
    $choice = Read-Host "Votre choix (1 ou 2)"
    
    if ($choice -eq "2") {
        Write-Host "Suppression de l'ancienne clé..." -ForegroundColor Cyan
        Remove-Item -Path $KEY_PATH -Force
        Remove-Item -Path "$KEY_PATH.pub" -Force -ErrorAction SilentlyContinue
        Write-Host "✅ Ancienne clé supprimée" -ForegroundColor Green
        Write-Host ""
        
        # Créer la nouvelle clé
        Write-Host "Création de la nouvelle clé SSH ED25519..." -ForegroundColor Cyan
        ssh-keygen -t ed25519 -f $KEY_PATH -C "hetzner-rescue-$VPS_IP" -N '""'
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Nouvelle clé SSH créée!" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Erreur lors de la création de la clé" -ForegroundColor Red
            exit
        }
    }
    else {
        Write-Host "✅ Utilisation de la clé existante" -ForegroundColor Green
    }
}
else {
    # Créer la nouvelle clé
    Write-Host "Création de la clé SSH ED25519..." -ForegroundColor Cyan
    ssh-keygen -t ed25519 -f $KEY_PATH -C "hetzner-rescue-$VPS_IP" -N '""'
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Clé SSH créée avec succès!" -ForegroundColor Green
    }
    else {
        Write-Host "❌ Erreur lors de la création de la clé" -ForegroundColor Red
        exit
    }
}

Write-Host ""

# Afficher la clé publique
Write-Host "Votre CLÉ PUBLIQUE SSH :" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
$publicKey = Get-Content "$KEY_PATH.pub"
Write-Host $publicKey -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

# Copier la clé publique dans le presse-papiers
try {
    $publicKey | Set-Clipboard
    Write-Host "✅ Clé publique COPIÉE dans le presse-papiers!" -ForegroundColor Green
}
catch {
    Write-Host "⚠️  Impossible de copier automatiquement. Copiez manuellement la clé ci-dessus." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Fichiers créés :" -ForegroundColor Cyan
Write-Host "  Clé privée  : $KEY_PATH" -ForegroundColor White
Write-Host "  Clé publique: $KEY_PATH.pub" -ForegroundColor White
Write-Host ""

# ============================================
# ÉTAPE 3 : INSTRUCTIONS HETZNER
# ============================================

Write-Host "[3/6] Configuration dans Hetzner..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   ACTIONS REQUISES DANS HETZNER CONSOLE" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  Ouvrez votre navigateur:" -ForegroundColor Yellow
Write-Host "    https://console.hetzner.cloud/" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  OPTION A - Ajouter une SSH Key globale (RECOMMANDÉ):" -ForegroundColor Yellow
Write-Host "    a. Menu gauche → 'SSH Keys'" -ForegroundColor White
Write-Host "    b. Bouton 'Add SSH Key' (en haut à droite)" -ForegroundColor White
Write-Host "    c. Coller la clé publique (déjà dans votre presse-papiers!)" -ForegroundColor White
Write-Host "    d. Nom: 'hetzner-rescue-pioneer'" -ForegroundColor White
Write-Host "    e. Cliquer 'Add SSH Key'" -ForegroundColor White
Write-Host ""

Write-Host "   OU" -ForegroundColor Cyan
Write-Host ""

Write-Host "   OPTION B - Ajouter dans Rescue Mode directement:" -ForegroundColor Yellow
Write-Host "    a. Servers → Votre serveur ($VPS_IP)" -ForegroundColor White
Write-Host "    b. Onglet 'Rescue'" -ForegroundColor White
Write-Host "    c. Si déjà activé: 'Disable rescue' d'abord" -ForegroundColor White
Write-Host "    d. 'Enable rescue & power cycle'" -ForegroundColor White
Write-Host "    e. SSH Keys → Sélectionner votre clé OU 'Add SSH Key'" -ForegroundColor White
Write-Host "    f. Cliquer 'Enable rescue & power cycle'" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣  Attendez 1-2 minutes (redémarrage du serveur)" -ForegroundColor Yellow
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$hetznerReady = Read-Host "Avez-vous terminé la configuration dans Hetzner? (oui/non)"

if ($hetznerReady -ne "oui") {
    Write-Host ""
    Write-Host "❌ Veuillez terminer la configuration dans Hetzner d'abord!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Relancez ce script après avoir configuré Hetzner." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Appuyez sur une touche pour quitter..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

Write-Host ""
Write-Host "✅ Configuration Hetzner confirmée" -ForegroundColor Green
Write-Host ""

# ============================================
# ÉTAPE 4 : TEST CONNEXION RESCUE
# ============================================

Write-Host "[4/6] Test de connexion en mode Rescue..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Commande de connexion:" -ForegroundColor Cyan
Write-Host "ssh -i `"$KEY_PATH`" root@$VPS_IP" -ForegroundColor White
Write-Host ""

$testConnection = Read-Host "Voulez-vous tester la connexion maintenant? (oui/non)"

if ($testConnection -eq "oui") {
    Write-Host ""
    Write-Host "Tentative de connexion..." -ForegroundColor Cyan
    Write-Host "⚠️  Si c'est la première connexion, tapez 'yes' pour accepter la clé" -ForegroundColor Yellow
    Write-Host ""
    
    # Tester la connexion (shell interactif)
    & ssh -i "$KEY_PATH" root@$VPS_IP
    
    write-Host ""
    $connectionSuccess = Read-Host "La connexion a-t-elle réussi? (oui/non)"
    
    if ($connectionSuccess -ne "oui") {
        Write-Host ""
        Write-Host "❌ La connexion a échoué" -ForegroundColor Red
        Write-Host ""
        Write-Host "Vérifications:" -ForegroundColor Yellow
        Write-Host "  1. Avez-vous bien ajouté la clé publique dans Hetzner?" -ForegroundColor White
        Write-Host "  2. Le Rescue Mode est-il activé?" -ForegroundColor White
        Write-Host "  3. Avez-vous attendu 1-2 minutes après l'activation?" -ForegroundColor White
        Write-Host ""
        Write-Host "Appuyez sur une touche pour quitter..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit
    }
}
else {
    Write-Host "⚠️  Test de connexion ignoré" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Connexion Rescue configurée" -ForegroundColor Green
Write-Host ""

# ============================================
# ÉTAPE 5 : GÉNÉRER LES COMMANDES RESCUE
# ============================================

Write-Host "[5/6] Génération des commandes pour le mode Rescue..." -ForegroundColor Yellow
Write-Host ""

# Déterminer quelle clé publique utiliser
Write-Host "Quelle clé SSH voulez-vous installer sur le serveur?" -ForegroundColor Cyan
Write-Host "  1. La même clé (hetzner_rescue) - RECOMMANDÉ" -ForegroundColor White
Write-Host "  2. La clé existante (abdoulrazaktanko06@gmail.com)" -ForegroundColor White
Write-Host ""

$keyChoice = Read-Host "Votre choix (1 ou 2)"

if ($keyChoice -eq "1") {
    $serverPublicKey = $publicKey
    Write-Host "✅ Utilisation de la clé hetzner_rescue" -ForegroundColor Green
}
else {
    $serverPublicKey = "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILTlNH7VhnZfPxmoLsy0HyKKhF5xVlyO5vE5SKGGhG0I abdoulrazaktanko06@gmail.com"
    Write-Host "✅ Utilisation de la clé existante" -ForegroundColor Green
}

Write-Host ""

# Créer le fichier de commandes
$rescueCommands = @"
# ========================================
# COMMANDES RESCUE MODE - MÉTHODE A
# ========================================
# Copiez/collez ces commandes UNE PAR UNE dans le terminal Rescue

# ÉTAPE 1 : Identifier le disque
lsblk

# ÉTAPE 2 : Monter le disque (ADAPTER sda1 si nécessaire!)
mount /dev/sda1 /mnt

# ÉTAPE 3 : Vérifier le montage
ls /mnt

# ÉTAPE 4 : Créer le dossier SSH
mkdir -p /mnt/home/$SSH_USER/.ssh

# ÉTAPE 5 : Ajouter la clé SSH
echo "$serverPublicKey" > /mnt/home/$SSH_USER/.ssh/authorized_keys

# ÉTAPE 6 : Permissions dossier .ssh
chmod 700 /mnt/home/$SSH_USER/.ssh

# ÉTAPE 7 : Permissions authorized_keys
chmod 600 /mnt/home/$SSH_USER/.ssh/authorized_keys

# ÉTAPE 8 : Propriétaire
chown -R 1000:1000 /mnt/home/$SSH_USER/.ssh

# ÉTAPE 9 : Vérifier
cat /mnt/home/$SSH_USER/.ssh/authorized_keys

# ========================================
# DIAGNOSTIC (IMPORTANT - COPIER RÉSULTATS!)
# ========================================

# Frontend
ls -la /mnt/var/www/pioneer-academy/frontend/

# Nginx
cat /mnt/etc/nginx/sites-available/pioneer-academy

# ========================================
# FIN - Sortir du Rescue Mode
# ========================================

# Quitter
exit

# ========================================
# APRÈS AVOIR TAPÉ exit:
# ========================================
# 1. Hetzner Console → Disable rescue & reboot
# 2. Attendre 1-2 minutes
# 3. PowerShell: ssh -i "$KEY_PATH" $SSH_USER@$VPS_IP
# 4. Connexion AUTO ! 🎉
"@

$rescueCommands | Out-File -FilePath "commandes-rescue-methode-a.txt" -Encoding UTF8
Write-Host "✅ Fichier créé: commandes-rescue-methode-a.txt" -ForegroundColor Green
Write-Host ""

# ============================================
# ÉTAPE 6 : INSTRUCTIONS FINALES
# ============================================

Write-Host "[6/6] Instructions finales..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "   ✅ CONFIGURATION TERMINÉE !" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Résumé de la configuration:" -ForegroundColor Yellow
Write-Host "  • Clé SSH créée: $KEY_NAME" -ForegroundColor White
Write-Host "  • Clé publique ajoutée dans Hetzner ✅" -ForegroundColor White
Write-Host "  • Rescue Mode activé ✅" -ForegroundColor White
Write-Host "  • Commandes Rescue générées ✅" -ForegroundColor White
Write-Host ""

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "   PROCHAINES ÉTAPES" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣  Connectez-vous en Rescue Mode:" -ForegroundColor Yellow
Write-Host "    ssh -i `"$KEY_PATH`" root@$VPS_IP" -ForegroundColor White
Write-Host ""

Write-Host "2️⃣  Exécutez les commandes du fichier:" -ForegroundColor Yellow
Write-Host "    commandes-rescue-methode-a.txt" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣  COPIER les résultats du diagnostic (frontend + nginx)" -ForegroundColor Yellow
Write-Host "    et ENVOYER à l'assistant!" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣  Sortir du Rescue:" -ForegroundColor Yellow
Write-Host "    • Taper: exit" -ForegroundColor White
Write-Host "    • Hetzner Console → Disable rescue & reboot" -ForegroundColor White
Write-Host "    • Attendre 1-2 minutes" -ForegroundColor White
Write-Host ""

Write-Host "5️⃣  Tester la connexion normale:" -ForegroundColor Yellow
if ($keyChoice -eq "1") {
    Write-Host "    ssh -i `"$KEY_PATH`" $SSH_USER@$VPS_IP" -ForegroundColor White
}
else {
    Write-Host "    ssh $SSH_USER@$VPS_IP" -ForegroundColor White
}
Write-Host ""

Write-Host "================================================" -ForegroundColor Green
Write-Host ""

# Demander s'il faut ouvrir le fichier de commandes
$openFile = Read-Host "Voulez-vous ouvrir 'commandes-rescue-methode-a.txt'? (oui/non)"
if ($openFile -eq "oui") {
    notepad commandes-rescue-methode-a.txt
}

Write-Host ""
Write-Host "🎉 Configuration terminée avec succès!" -ForegroundColor Green
Write-Host "🚀 Vous pouvez maintenant vous connecter au Rescue Mode!" -ForegroundColor Cyan
Write-Host ""

# Créer un aide-mémoire pour la connexion
$aidemem = @"
# AIDE-MÉMOIRE CONNEXION SSH

## Connexion en mode Rescue:
ssh -i "$KEY_PATH" root@$VPS_IP

## Connexion normale (après configuration):
"@

if ($keyChoice -eq "1") {
    $aidemem += @"
ssh -i "$KEY_PATH" $SSH_USER@$VPS_IP
"@
}
else {
    $aidemem += @"
ssh $SSH_USER@$VPS_IP
"@
}

$aidemem | Out-File -FilePath "connexion-ssh.txt" -Encoding UTF8
Write-Host "✅ Aide-mémoire créé: connexion-ssh.txt" -ForegroundColor Green
Write-Host ""
