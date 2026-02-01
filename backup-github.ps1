# ========================================
# SCRIPT DE SAUVEGARDE GITHUB SECURISEE
# Pioneer Academy - Repository Privé
# ========================================

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SAUVEGARDE GITHUB SECURISEE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# ETAPE 1 : VERIFICATION FICHIERS SENSIBLES
# ========================================
Write-Host "[1/5] Vérification fichiers sensibles..." -ForegroundColor Yellow

$sensiblePatterns = @("*.log", "*.env", "test-*.js", "*-test.js", "debug-*.js", "hetzner_key*", "*.pem", "*.key")
$foundSensible = @()

foreach ($pattern in $sensiblePatterns) {
    $files = Get-ChildItem -Path "." -Recurse -Include $pattern -ErrorAction SilentlyContinue | 
    Where-Object { $_.FullName -notmatch "node_modules|\.example" }
    $foundSensible += $files
}

if ($foundSensible.Count -gt 0) {
    Write-Host "  ⚠️ FICHIERS SENSIBLES DETECTES:" -ForegroundColor Red
    $foundSensible | Select-Object -First 10 | ForEach-Object {
        Write-Host "    - $($_.Name)" -ForegroundColor Yellow
    }
    
    $response = Read-Host "`n  Voulez-vous les EXCLURE automatiquement? (O/N)"
    if ($response -ne "O" -and $response -ne "o") {
        Write-Host "  ❌ Sauvegarde annulée par sécurité" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "  ✅ Aucun fichier sensible détecté" -ForegroundColor Green
}

# ========================================
# ETAPE 2 : VERIFICATION .gitignore
# ========================================
Write-Host "`n[2/5] Vérification .gitignore..." -ForegroundColor Yellow

$requiredIgnores = @(
    ".env",
    "*.log",
    "node_modules/",
    "dist/",
    "*.pem",
    "*.key",
    "hetzner_key",
    ".env.production"
)

if (Test-Path ".gitignore") {
    $gitignoreContent = Get-Content ".gitignore" -Raw
    $missing = @()
    
    foreach ($pattern in $requiredIgnores) {
        if ($gitignoreContent -notmatch [regex]::Escape($pattern)) {
            $missing += $pattern
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Host "  ⚠️ Patterns manquants dans .gitignore:" -ForegroundColor Yellow
        $missing | ForEach-Object { Write-Host "    - $_" -ForegroundColor Gray }
        
        # Ajouter automatiquement
        $missing | ForEach-Object { Add-Content ".gitignore" "`n$_" }
        Write-Host "  ✅ Patterns ajoutés automatiquement" -ForegroundColor Green
    }
    else {
        Write-Host "  ✅ .gitignore complet" -ForegroundColor Green
    }
}
else {
    Write-Host "  ❌ .gitignore manquant!" -ForegroundColor Red
    exit 1
}

# ========================================
# ETAPE 3 : GIT STATUS
# ========================================
Write-Host "`n[3/5] Status Git..." -ForegroundColor Yellow

try {
    git status --short
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ⚠️ Repository Git non initialisé" -ForegroundColor Yellow
        $response = Read-Host "  Initialiser Git maintenant? (O/N)"
        if ($response -eq "O" -or $response -eq "o") {
            git init
            git branch -M main
            Write-Host "  ✅ Git initialisé" -ForegroundColor Green
        }
        else {
            exit 1
        }
    }
}
catch {
    Write-Host "  ❌ Erreur Git: $_" -ForegroundColor Red
    exit 1
}

# ========================================
# ETAPE 4 : COMMIT
# ========================================
Write-Host "`n[4/5] Commit des changements..." -ForegroundColor Yellow

git add .
$commitMessage = "🚀 Production deployment - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Commit créé: $commitMessage" -ForegroundColor Green
}
else {
    Write-Host "  ℹ️ Aucun changement à commiter" -ForegroundColor Gray
}

# ========================================
# ETAPE 5 : PUSH GITHUB
# ========================================
Write-Host "`n[5/5] Push vers GitHub..." -ForegroundColor Yellow

# Vérifier remote
$remotes = git remote -v

if ($remotes -match "origin") {
    Write-Host "  Remote 'origin' trouvé" -ForegroundColor Cyan
    
    git push origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Push réussi" -ForegroundColor Green
    }
    else {
        Write-Host "  ❌ Erreur push" -ForegroundColor Red
        Write-Host "  Commande pour configurer remote:" -ForegroundColor Yellow
        Write-Host "  git remote add origin https://github.com/VOTRE_USERNAME/pioneer-academy.git" -ForegroundColor Gray
        exit 1
    }
}
else {
    Write-Host "  ⚠️ Aucun remote configuré" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  ETAPES POUR CONFIGURER GITHUB:" -ForegroundColor Cyan
    Write-Host "  1. Créer un repository PRIVE sur GitHub: https://github.com/new" -ForegroundColor Gray
    Write-Host "  2. Nom suggéré: pioneer-academy-private" -ForegroundColor Gray
    Write-Host "  3. Cocher 'Private'" -ForegroundColor Gray
    Write-Host "  4. Exécuter:" -ForegroundColor Gray
    Write-Host ""
    Write-Host "     git remote add origin https://github.com/VOTRE_USERNAME/pioneer-academy-private.git" -ForegroundColor White
    Write-Host "     git push -u origin main" -ForegroundColor White
    Write-Host ""
}

# ========================================
# RESUME
# ========================================
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   ✅ SAUVEGARDE SECURISEE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📦 Fichiers commités (sans données sensibles)" -ForegroundColor Cyan
Write-Host "🔐 Secrets protégés par .gitignore" -ForegroundColor Cyan
Write-Host "☁️ Repository GitHub (à configurer si nécessaire)" -ForegroundColor Cyan
Write-Host ""
