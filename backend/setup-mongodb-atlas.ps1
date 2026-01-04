# ============================================================================
# Script de Configuration Automatique MongoDB Atlas
# Pi Academy Backend Setup
# ============================================================================

$ErrorActionPreference = "Stop"

Write-Host "`n" -NoNewline
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " 🚀 Configuration MongoDB Atlas - Pi Academy Backend" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# Fonction: Afficher un message avec couleur
# ============================================================================
function Write-Step {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host "[$((Get-Date).ToString('HH:mm:ss'))] " -NoNewline
    Write-Host $Message -ForegroundColor $Color
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ " -NoNewline -ForegroundColor Green
    Write-Host $Message -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ " -NoNewline -ForegroundColor Red
    Write-Host $Message -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  " -NoNewline -ForegroundColor Yellow
    Write-Host $Message -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  " -NoNewline -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
}

# ============================================================================
# Étape 1: Vérification des prérequis
# ============================================================================
Write-Step "Vérification des prérequis..." "Yellow"

# Vérifier Node.js
try {
    $nodeVersion = node --version
    Write-Success "Node.js installé: $nodeVersion"
} catch {
    Write-Error "Node.js non trouvé. Veuillez installer Node.js."
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm --version
    Write-Success "npm installé: $npmVersion"
} catch {
    Write-Error "npm non trouvé. Veuillez installer npm."
    exit 1
}

# ============================================================================
# Étape 2: Récupération de l'IP publique
# ============================================================================
Write-Step "`nRécupération de votre IP publique..." "Yellow"

try {
    $publicIP = (Invoke-RestMethod -Uri "https://api.ipify.org?format=json").ip
    Write-Success "IP publique détectée: $publicIP"
    Write-Info "Cette IP doit être ajoutée dans MongoDB Atlas Network Access"
} catch {
    Write-Warning "Impossible de récupérer l'IP publique"
    $publicIP = "Inconnu"
}

# ============================================================================
# Étape 3: Configuration du fichier .env
# ============================================================================
Write-Step "`nConfiguration du fichier .env..." "Yellow"

$envTemplatePath = ".\.env.atlas-template"
$envPath = ".\.env"

if (-not (Test-Path $envTemplatePath)) {
    Write-Error "Template .env non trouvé: $envTemplatePath"
    exit 1
}

# Demander les informations MongoDB
Write-Host "`nConfiguration MongoDB Atlas:" -ForegroundColor Cyan
Write-Host "-----------------------------------------------------------"

$mongoUsername = Read-Host "Username MongoDB (par défaut: piAcademy)"
if ([string]::IsNullOrWhiteSpace($mongoUsername)) {
    $mongoUsername = "piAcademy"
}

$mongoPassword = Read-Host "Password MongoDB" -AsSecureString
$mongoPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mongoPassword))

if ([string]::IsNullOrWhiteSpace($mongoPasswordPlain)) {
    Write-Error "Le mot de passe est requis!"
    exit 1
}

$mongoCluster = Read-Host "Cluster MongoDB (par défaut: cluster0.y87z9is.mongodb.net)"
if ([string]::IsNullOrWhiteSpace($mongoCluster)) {
    $mongoCluster = "cluster0.y87z9is.mongodb.net"
}

$mongoDatabase = Read-Host "Database name (par défaut: pi_academy)"
if ([string]::IsNullOrWhiteSpace($mongoDatabase)) {
    $mongoDatabase = "pi_academy"
}

# Encoder le mot de passe pour l'URI
function Encode-Uri {
    param([string]$text)
    return [System.Uri]::EscapeDataString($text)
}

$encodedPassword = Encode-Uri $mongoPasswordPlain
$mongoUri = "mongodb+srv://${mongoUsername}:${encodedPassword}@${mongoCluster}/${mongoDatabase}?retryWrites=true&w=majority"

# Créer le fichier .env
Write-Step "Création du fichier .env..." "Yellow"

$envContent = @"
# ============================================================================
# CONFIGURATION MONGODB ATLAS
# Généré automatiquement le $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
# ============================================================================

# MongoDB Atlas URI
MONGODB_URI=$mongoUri

# Composants séparés (optionnel)
MONGODB_USERNAME=$mongoUsername
MONGODB_PASSWORD=$mongoPasswordPlain
MONGODB_CLUSTER=$mongoCluster
MONGODB_DATABASE=$mongoDatabase

# ============================================================================
# CONFIGURATION SERVEUR
# ============================================================================

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# ============================================================================
# SÉCURITÉ
# ============================================================================

JWT_SECRET=pi_academy_ultra_secure_jwt_secret_2025_CHANGE_IN_PRODUCTION
BCRYPT_ROUNDS=10
SESSION_SECRET=pi_academy_session_secret_CHANGE_IN_PRODUCTION

# ============================================================================
# PI NETWORK
# ============================================================================

PI_API_KEY=your_pi_api_key_here
PI_SANDBOX=true

# ============================================================================
# RATE LIMITING
# ============================================================================

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ============================================================================
# PERFORMANCE
# ============================================================================

MONGODB_POOL_SIZE_MIN=10
MONGODB_POOL_SIZE_MAX=50
MONGODB_CONNECT_TIMEOUT=30000
MONGODB_SOCKET_TIMEOUT=45000

# ============================================================================
# FEATURES FLAGS
# ============================================================================

ENABLE_STAKING=true
ENABLE_WITHDRAWALS=true
ENABLE_SOCIAL=true
"@

$envContent | Out-File -FilePath $envPath -Encoding UTF8
Write-Success "Fichier .env créé avec succès"

# ============================================================================
# Étape 4: Installation des dépendances
# ============================================================================
Write-Step "`nInstallation des dépendances..." "Yellow"

try {
    npm install | Out-Null
    Write-Success "Dépendances installées avec succès"
} catch {
    Write-Error "Erreur lors de l'installation des dépendances"
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# ============================================================================
# Étape 5: Test de connexion
# ============================================================================
Write-Step "`nTest de connexion MongoDB Atlas..." "Yellow"

try {
    Write-Host "`nExécution des tests..." -ForegroundColor Cyan
    Write-Host "-----------------------------------------------------------`n"
    
    $testResult = node test-atlas.js
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "`nTous les tests sont passés!"
    } else {
        Write-Warning "`nCertains tests ont échoué. Vérifiez les logs ci-dessus."
    }
} catch {
    Write-Error "Erreur lors des tests"
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# ============================================================================
# Résumé de la configuration
# ============================================================================
Write-Host "`n" -NoNewline
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " 📊 Résumé de la Configuration" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "MongoDB Atlas:" -ForegroundColor Yellow
Write-Host "  • Username:   $mongoUsername"
Write-Host "  • Cluster:    $mongoCluster"
Write-Host "  • Database:   $mongoDatabase"
Write-Host "  • IP Required: $publicIP" -ForegroundColor Yellow
Write-Host ""

Write-Host "Configuration:" -ForegroundColor Yellow
Write-Host "  • Port:       3001"
Write-Host "  • Environment: development"
Write-Host "  • Frontend:   http://localhost:5173"
Write-Host ""

Write-Host "Fichiers créés:" -ForegroundColor Yellow
Write-Host "  ✅ .env"
Write-Host ""

# ============================================================================
# Instructions pour MongoDB Atlas
# ============================================================================
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " 🔧 Actions Requises dans MongoDB Atlas" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. NETWORK ACCESS (CRITIQUE):" -ForegroundColor Yellow
Write-Host "   📍 URL: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList"
Write-Host "   📌 Ajoutez votre IP: $publicIP" -ForegroundColor Green
Write-Host "   Ou temporairement: 0.0.0.0/0 (développement uniquement)"
Write-Host ""

Write-Host "2. DATABASE ACCESS:" -ForegroundColor Yellow
Write-Host "   • Username: $mongoUsername"
Write-Host "   • Password: [le mot de passe que vous avez entré]"
Write-Host "   • Privileges: Read and write to any database"
Write-Host ""

Write-Host "3. VÉRIFIER LE CLUSTER:" -ForegroundColor Yellow
Write-Host "   • Le cluster doit être actif"
Write-Host "   • Format: $mongoCluster"
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " 🚀 Prochaines Étapes" -ForegroundColor Cyan
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Ouvrez MongoDB Atlas et ajoutez votre IP ($publicIP)" -ForegroundColor Green
Write-Host "2. Pour démarrer le serveur:" -ForegroundColor Green
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "3. Pour tester la santé:" -ForegroundColor Green
Write-Host "   http://localhost:3001/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. Pour relancer les tests:" -ForegroundColor Green
Write-Host "   node test-atlas.js" -ForegroundColor Cyan
Write-Host ""

Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   • Guide rapide:  QUICK_START_MONGODB.md"
Write-Host "   • Guide complet: MONGODB_ATLAS_GUIDE.md"
Write-Host ""

Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host " ✨ Configuration terminée!" -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

# Demander si on doit ouvrir MongoDB Atlas
$openAtlas = Read-Host "Voulez-vous ouvrir MongoDB Atlas maintenant? (o/n)"
if ($openAtlas -eq "o" -or $openAtlas -eq "O") {
    Start-Process "https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList"
    Write-Success "MongoDB Atlas ouvert dans votre navigateur"
}

Write-Host "`nAppuyez sur une touche pour terminer..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
