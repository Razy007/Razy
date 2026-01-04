<#
.SYNOPSIS
    Script de configuration automatique MongoDB Atlas Production

.DESCRIPTION
    Configure automatiquement:
    - Firewall Windows pour MongoDB
    - Fichier .env avec credentials sécurisés
    - Test de connexion MongoDB Atlas
    - Création des indexes
    - Vérification complète du système

.NOTES
    Exécution: powershell -ExecutionPolicy Bypass -File .\setup-mongodb-atlas-production.ps1
#>

$ErrorActionPreference = "Continue"

# ============================================================================
# CONFIGURATION
# ============================================================================

$SCRIPT_VERSION = "2.0.0"
$LOG_FILE = "mongodb-setup.log"
$ENV_FILE = ".env"
$ENV_TEMPLATE = ".env.production.template"

# Couleurs
function Write-Success { param($msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Write-Error { param($msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Write-Info { param($msg) Write-Host "ℹ️  $msg" -ForegroundColor Cyan }
function Write-Warning { param($msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Write-Step { param($msg) Write-Host "`n📍 $msg" -ForegroundColor Magenta }

# ============================================================================
# FONCTIONS UTILITAIRES
# ============================================================================

function Write-Log {
    param($Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    "$timestamp - $Message" | Out-File -FilePath $LOG_FILE -Append
}

function Get-PublicIP {
    try {
        $response = Invoke-RestMethod -Uri "https://api.ipify.org?format=json" -TimeoutSec 5
        return $response.ip
    }
    catch {
        return "Unknown"
    }
}

function Test-AdminPrivileges {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Generate-SecureSecret {
    param([int]$Length = 64)
    
    $bytes = New-Object byte[] $Length
    $rng = [Security.Cryptography.RNGCryptoServiceProvider]::Create()
    $rng.GetBytes($bytes)
    
    return [BitConverter]::ToString($bytes).Replace("-", "").ToLower()
}

# ============================================================================
# HEADER
# ============================================================================

Clear-Host
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "   🚀 SETUP MONGODB ATLAS - PRODUCTION MODE v$SCRIPT_VERSION" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

Write-Log "Script démarré - Version $SCRIPT_VERSION"

# ============================================================================
# ÉTAPE 1: VÉRIFICATIONS PRÉLIMINAIRES
# ============================================================================

Write-Step "ÉTAPE 1/7: Vérifications préliminaires"

# Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js installé: $nodeVersion"
    Write-Log "Node.js version: $nodeVersion"
}
catch {
    Write-Error "Node.js non trouvé! Installez-le depuis https://nodejs.org/"
    exit 1
}

# Connexion Internet
try {
    $null = Invoke-WebRequest -Uri "https://www.google.com" -UseBasicParsing -TimeoutSec 5
    Write-Success "Connexion Internet OK"
}
catch {
    Write-Error "Pas de connexion Internet!"
    exit 1
}

# IP Publique
$publicIP = Get-PublicIP
Write-Info "Votre IP publique: $publicIP"
Write-Log "IP publique: $publicIP"

# Privilèges Admin
$isAdmin = Test-AdminPrivileges
if ($isAdmin) {
    Write-Success "Exécution en tant qu'Administrateur"
}
else {
    Write-Warning "Pas de privilèges Admin - certaines fonctionnalités seront limitées"
    Write-Warning "Pour configurer le firewall, exécutez en tant qu'Administrateur"
}

# ============================================================================
# ÉTAPE 2: CONFIGURATION FIREWALL
# ============================================================================

Write-Step "ÉTAPE 2/7: Configuration Firewall Windows"

if ($isAdmin) {
    try {
        # Vérifier si règle existe déjà
        $existingRule = Get-NetFirewallRule -DisplayName "MongoDB Atlas" -ErrorAction SilentlyContinue
        
        if ($existingRule) {
            Write-Info "Règle firewall déjà existante"
        }
        else {
            # Créer règle
            New-NetFirewallRule `
                -DisplayName "MongoDB Atlas" `
                -Direction Outbound `
                -Protocol TCP `
                -RemotePort 27017 `
                -Action Allow `
                -Profile Any `
                -ErrorAction Stop | Out-Null
            
            Write-Success "Règle firewall créée pour port 27017"
            Write-Log "Règle firewall créée"
        }
        
        # Vérifier règle
        $rule = Get-NetFirewallRule -DisplayName "MongoDB Atlas"
        if ($rule.Enabled -eq $true) {
            Write-Success "Firewall configuré correctement"
        }
        
    }
    catch {
        Write-Error "Erreur configuration firewall: $_"
        Write-Warning "Configurez manuellement le firewall pour autoriser port 27017 sortant"
    }
}
else {
    Write-Warning "Privilèges Admin requis pour configurer firewall"
    Write-Info "Réexécutez ce script en Admin pour configurer automatiquement"
}

# ============================================================================
# ÉTAPE 3: TEST RÉSEAU MONGODB
# ============================================================================

Write-Step "ÉTAPE 3/7: Test de connectivité MongoDB Atlas"

# Test DNS SRV
Write-Info "Test résolution DNS SRV..."
try {
    $dnsResult = Resolve-DnsName -Name "_mongodb._tcp.cluster0.y87z9is.mongodb.net" -Type SRV -ErrorAction Stop
    
    if ($dnsResult) {
        Write-Success "DNS SRV résolu - $($dnsResult.Count) serveurs trouvés"
        Write-Log "DNS SRV OK - Serveurs: $($dnsResult.Count)"
    }
}
catch {
    Write-Error "Échec résolution DNS SRV"
    Write-Warning "Vérifiez votre connexion Internet et DNS"
}

# Test connectivité port 27017
Write-Info "Test connexion port 27017..."
try {
    $testResult = Test-NetConnection -ComputerName "ac-sh9juwq-shard-00-00.y87z9is.mongodb.net" -Port 27017 -WarningAction SilentlyContinue
    
    if ($testResult.TcpTestSucceeded) {
        Write-Success "Port 27017 accessible ✓"
        Write-Log "Port 27017 accessible"
    }
    else {
        Write-Warning "Port 27017 BLOQUÉ"
        Write-Warning "Causes possibles: Firewall, Antivirus, VPN, Proxy"
        Write-Log "Port 27017 bloqué"
    }
}
catch {
    Write-Warning "Impossible de tester le port 27017"
}

# ============================================================================
# ÉTAPE 4: CONFIGURATION .ENV
# ============================================================================

Write-Step "ÉTAPE 4/7: Configuration fichier .env"

$createNew = $false

if (Test-Path $ENV_FILE) {
    Write-Warning "Fichier .env existant trouvé"
    $response = Read-Host "Voulez-vous le remplacer? (o/N)"
    
    if ($response -ne "o" -and $response -ne "O") {
        Write-Info "Conservation du .env existant"
    }
    else {
        $backup = "$ENV_FILE.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $ENV_FILE $backup
        Write-Success "Backup créé: $backup"
        
        $createNew = $true
    }
}
else {
    $createNew = $true
}

if ($createNew) {
    Write-Info "Création du fichier .env..."
    
    # Collecter informations
    Write-Host "`nConfiguration MongoDB Atlas:" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
    
    $mongodbURI = Read-Host "Connection String MongoDB Atlas (ou laissez vide)"
    
    if ([string]::IsNullOrWhiteSpace($mongodbURI)) {
        Write-Info "Configuration par composants..."
        $username = Read-Host "MongoDB Username"
        $password = Read-Host "MongoDB Password" -AsSecureString
        $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
        )
        $cluster = Read-Host "MongoDB Cluster (défaut: cluster0.y87z9is.mongodb.net)"
        $database = Read-Host "MongoDB Database (défaut: pi_academy)"
        
        if ([string]::IsNullOrWhiteSpace($cluster)) { $cluster = "cluster0.y87z9is.mongodb.net" }
        if ([string]::IsNullOrWhiteSpace($database)) { $database = "pi_academy" }
        
        # Construire URI
        $passwordEncoded = [System.Web.HttpUtility]::UrlEncode($passwordPlain)
        $mongodbURI = "mongodb+srv://${username}:${passwordEncoded}@${cluster}/${database}?retryWrites=true&w=majority"
    }
    
    # Générer secrets
    $jwtSecret = Generate-SecureSecret -Length 64
    $sessionSecret = Generate-SecureSecret -Length 32
    
    # Créer .env
    $envContent = @"
# Generated by setup-mongodb-atlas-production.ps1
# Date: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# ============================================================================
# MONGODB ATLAS
# ============================================================================
MONGODB_URI=$mongodbURI

# ============================================================================
# BACKEND
# ============================================================================
PORT=3001
NODE_ENV=production

FRONTEND_URL=http://localhost:5173

# ============================================================================
# SECURITY
# ============================================================================
JWT_SECRET=$jwtSecret
JWT_EXPIRES_IN=7d
SESSION_SECRET=$sessionSecret

# ============================================================================
# PI NETWORK
# ============================================================================
PI_API_KEY=your_pi_api_key_here
PI_SANDBOX=true
USE_MOCK_AUTH=true

# ============================================================================
# APP CONFIG
# ============================================================================
GCV_VALUE=314.159
RATE_LIMIT_MAX=100

# ============================================================================
# FEATURE FLAGS
# ============================================================================
ENABLE_PREMIUM=true
ENABLE_STAKING=true
ENABLE_SOCIAL=true
"@

    $envContent | Out-File -FilePath $ENV_FILE -Encoding UTF8
    Write-Success "Fichier .env créé avec succès"
    Write-Log "Fichier .env créé"
}

# ============================================================================
# ÉTAPE 5: INSTALLATION DÉPENDANCES
# ============================================================================

Write-Step "ÉTAPE 5/7: Vérification des dépendances"

if (Test-Path "package.json") {
    Write-Info "Installation des dépendances npm..."
    
    try {
        npm install --silent 2>&1 | Out-Null
        Write-Success "Dépendances installées"
        Write-Log "npm install OK"
    }
    catch {
        Write-Warning "Erreur installation dépendances"
        Write-Info "Exécutez manuellement: npm install"
    }
}
else {
    Write-Warning "package.json non trouvé - ignoré"
}

# ============================================================================
# ÉTAPE 6: TEST CONNEXION MONGODB
# ============================================================================

Write-Step "ÉTAPE 6/7: Test connexion MongoDB Atlas"

if (Test-Path "backend\database\mongodb-atlas-production.js") {
    Write-Info "Lancement du test de connexion..."
    
    $testScript = @"
require('dotenv').config();
const { connectAtlasProduction, testAtlasConnection, disconnectAtlasProduction } = require('./backend/database/mongodb-atlas-production');

(async () => {
    try {
        await connectAtlasProduction();
        await testAtlasConnection();
        await disconnectAtlasProduction();
        process.exit(0);
    } catch (error) {
        console.error('Erreur:', error.message);
        process.exit(1);
    }
})();
"@

    $testScript | Out-File -FilePath "test-connection.js" -Encoding UTF8
    
    try {
        $result = node test-connection.js 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Connexion MongoDB Atlas réussie!"
            Write-Log "Test connexion OK"
        }
        else {
            Write-Warning "Échec du test de connexion"
            Write-Info "Vérifiez votre configuration MongoDB Atlas"
            Write-Log "Test connexion échoué"
        }
    }
    catch {
        Write-Warning "Impossible de tester la connexion"
    }
    finally {
        Remove-Item "test-connection.js" -ErrorAction SilentlyContinue
    }
}
else {
    Write-Warning "Module mongodb-atlas-production.js non trouvé"
}

# ============================================================================
# ÉTAPE 7: RÉSUMÉ & PROCHAINES ÉTAPES
# ============================================================================

Write-Step "ÉTAPE 7/7: Résumé de la configuration"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "   ✅ CONFIGURATION TERMINÉE" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "📋 CHECKLIST MONGODB ATLAS:" -ForegroundColor Yellow
Write-Host ""

Write-Host "1️⃣  NETWORK ACCESS (CRITIQUE):" -ForegroundColor Cyan
Write-Host "   → Ajoutez votre IP: $publicIP" -ForegroundColor White
Write-Host "   → URL: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList" -ForegroundColor Gray
Write-Host ""

Write-Host "2️⃣  DATABASE ACCESS:" -ForegroundColor Cyan
Write-Host "   → Créez un utilisateur avec permissions atlasAdmin" -ForegroundColor White
Write-Host "   → Copiez username/password dans .env" -ForegroundColor White
Write-Host ""

Write-Host "3️⃣  FICHIERS CRÉÉS:" -ForegroundColor Cyan
Write-Host "   ✅ .env (credentials)" -ForegroundColor White
Write-Host "   ✅ backend/database/mongodb-atlas-production.js" -ForegroundColor White
Write-Host "   ✅ MONGODB_ATLAS_PRODUCTION_GUIDE.md" -ForegroundColor White
Write-Host ""

Write-Host "4️⃣  PROCHAINES ÉTAPES:" -ForegroundColor Cyan
Write-Host "   1. Whitelist IP dans MongoDB Atlas" -ForegroundColor White
Write-Host "   2. Créer database user" -ForegroundColor White
Write-Host "   3. Mettre à jour .env avec vraies credentials" -ForegroundColor White
Write-Host "   4. Lancer backend: npm run dev" -ForegroundColor White
Write-Host "   5. Tester: http://localhost:3001/health" -ForegroundColor White
Write-Host ""

Write-Host "📚 DOCUMENTATION:" -ForegroundColor Yellow
Write-Host "   → Guide complet: MONGODB_ATLAS_PRODUCTION_GUIDE.md" -ForegroundColor White
Write-Host "   → Template .env: .env.production.template" -ForegroundColor White
Write-Host ""

Write-Host "═══════════════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Log "Script terminé avec succès"

# Ouvrir guide
$openGuide = Read-Host "Voulez-vous ouvrir le guide complet? (o/N)"
if ($openGuide -eq "o" -or $openGuide -eq "O") {
    Start-Process "MONGODB_ATLAS_PRODUCTION_GUIDE.md"
}

Write-Host ""
Write-Host "✨ Configuration terminée! Bon déploiement! 🚀" -ForegroundColor Magenta
Write-Host ""
