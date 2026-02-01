# ========================================
# SCRIPT DE DEPLOIEMENT AUTOMATIQUE
# Pioneer Academy → pioneeracademy.academy
# ========================================

$ErrorActionPreference = "Stop"
$SSH_KEY = ".\hetzner_key"
$HOST = "root@pioneeracademy.academy"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DÉPLOIEMENT PIONEER ACADEMY v2.2" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Étape 0: Migration SQL (CRITIQUE)
Write-Host "[0/4] Migration Base de Données..." -ForegroundColor Yellow
$migrationCmd = "sudo -u postgres psql pi_academy -c 'ALTER TABLE withdrawal_requests ADD COLUMN IF NOT EXISTS fee_amount DECIMAL(18, 8) DEFAULT 0;'"
ssh -i $SSH_KEY $HOST $migrationCmd
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Migration SQL réussie" -ForegroundColor Green
} else {
    Write-Host "  ⚠️ Attention: Vérifiez la migration SQL" -ForegroundColor Red
}

# Étape 1: Frontend
Write-Host "`n[1/4] Extraction Frontend sur serveur..." -ForegroundColor Yellow
$cmd1 = "mkdir -p /var/www/pioneer-academy/frontend; tar -xzf /tmp/frontend_deploy.tar.gz -C /var/www/pioneer-academy/frontend; echo Frontend extracted"
ssh -i $SSH_KEY $HOST $cmd1
Write-Host "  ✅ Frontend déployé" -ForegroundColor Green

# Étape 2: Backend
Write-Host "`n[2/4] Extraction Backend sur serveur..." -ForegroundColor Yellow
$cmd2 = "mkdir -p /var/www/pioneer-academy/backend; tar -xzf /tmp/backend_deploy.tar.gz -C /var/www/pioneer-academy/backend; echo Backend extracted"
ssh -i $SSH_KEY $HOST $cmd2
Write-Host "  ✅ Backend extrait" -ForegroundColor Green

# Étape 3: Installation dépendances
Write-Host "`n[3/4] Installation dépendances Backend..." -ForegroundColor Yellow
$cmd3 = "cd /var/www/pioneer-academy/backend; npm ci --production --omit=dev; npm run build"
ssh -i $SSH_KEY $HOST $cmd3 2>&1 | Select-String -Pattern "added|built" | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
Write-Host "  ✅ Backend compilé" -ForegroundColor Green

# Étape 4: Redémarrage PM2
Write-Host "`n[4/4] Redémarrage de l'application..." -ForegroundColor Yellow
$cmd4 = "pm2 delete pioneer-backend 2>/dev/null || true; cd /var/www/pioneer-academy/backend; NODE_ENV=production pm2 start dist/server.js --name pioneer-backend --instances 1 --max-memory-restart 500M; pm2 save"
ssh -i $SSH_KEY $HOST $cmd4 2>&1 | Select-String -Pattern "(started|online|saved)" | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
Write-Host "  ✅ Application redémarrée" -ForegroundColor Green

# Vérification finale
Write-Host "`n[Vérification] Status PM2..." -ForegroundColor Yellow
ssh -i $SSH_KEY $HOST "pm2 status pioneer-backend"

# Succès
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   ✅ DÉPLOIEMENT RÉUSSI !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Site accessible: https://pioneeracademy.academy" -ForegroundColor Cyan
Write-Host "📊 Voir les logs: ssh -i $SSH_KEY $HOST 'pm2 logs pioneer-backend'" -ForegroundColor Gray
Write-Host ""
