# ========================================
# SCRIPT DE DEPLOIEMENT PIONEER ACADEMY
# Windows → VPS Hetzner (pioneeracademy.academy)
# ========================================

param(
    [switch]$SkipBuild,
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$ErrorActionPreference = "Stop"
$VPS_HOST = "pioneeracademy.academy"
$SSH_KEY = ".\hetzner_key"
$SSH_USER = "root"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   DEPLOIEMENT PIONEER ACADEMY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ========================================
# ETAPE 1 : BUILD FRONTEND
# ========================================
if (-not $BackendOnly -and -not $SkipBuild) {
    Write-Host "[1/6] Build Frontend..." -ForegroundColor Yellow
    Push-Location frontend
    try {
        npm run build
        Write-Host "  ✅ Build frontend terminé" -ForegroundColor Green
    } catch {
        Write-Host "  ❌ Erreur build frontend: $_" -ForegroundColor Red
        exit 1
    } finally {
        Pop-Location
    }
} else {
    Write-Host "[1/6] Build Frontend... SKIP" -ForegroundColor Gray
}

# ========================================
# ETAPE 2 : TRANSFERT FRONTEND
# ========================================
if (-not $BackendOnly) {
    Write-Host "`n[2/6] Transfert Frontend vers VPS..." -ForegroundColor Yellow
    
    # Créer archive pour accélérer transfert
    if (Test-Path "frontend_deploy.zip") { Remove-Item "frontend_deploy.zip" -Force }
    Compress-Archive -Path "frontend/dist/*" -DestinationPath "frontend_deploy.zip" -Force
    
    scp -i $SSH_KEY frontend_deploy.zip ${SSH_USER}@${VPS_HOST}:/tmp/
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Frontend transféré" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Erreur transfert frontend" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "`n[2/6] Transfert Frontend... SKIP" -ForegroundColor Gray
}

# ========================================
# ETAPE 3 : TRANSFERT BACKEND
# ========================================
if (-not $FrontendOnly) {
    Write-Host "`n[3/6] Transfert Backend vers VPS..." -ForegroundColor Yellow
    
    # Créer archive backend (sans node_modules)
    if (Test-Path "backend_deploy.zip") { Remove-Item "backend_deploy.zip" -Force }
    
    $backendFiles = @(
        "backend/server.js",
        "backend/package.json",
        "backend/package-lock.json",
        "backend/tsconfig.json"
    )
    
    Compress-Archive -Path $backendFiles -DestinationPath "backend_deploy.zip" -Force
    Compress-Archive -Path "backend/database","backend/routes","backend/services","backend/middleware","backend/src","backend/migrations" -DestinationPath "backend_deploy.zip" -Update -ErrorAction SilentlyContinue
    
    scp -i $SSH_KEY backend_deploy.zip ${SSH_USER}@${VPS_HOST}:/tmp/
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ Backend transféré" -ForegroundColor Green
    } else {
        Write-Host "  ❌ Erreur transfert backend" -ForegroundColor Red
        exit 1
    }
    
    # Transfert .env production
    scp -i $SSH_KEY .env.production ${SSH_USER}@${VPS_HOST}:/tmp/.env
    Write-Host "  ✅ Fichier .env transféré" -ForegroundColor Green
} else {
    Write-Host "`n[3/6] Transfert Backend... SKIP" -ForegroundColor Gray
}

# ========================================
# ETAPE 4 : DEPLOIEMENT SUR SERVEUR
# ========================================
Write-Host "`n[4/6] Déploiement sur serveur..." -ForegroundColor Yellow

$deployScript = @'
#!/bin/bash
set -e

echo "=== DEPLOIEMENT PIONEER ACADEMY ==="

# Créer répertoire principal
mkdir -p /var/www/pioneer-academy

# 1. FRONTEND
if [ -f /tmp/frontend_deploy.zip ]; then
    echo "[FRONTEND] Installation..."
    rm -rf /var/www/pioneer-academy/frontend
    mkdir -p /var/www/pioneer-academy/frontend
    unzip -q /tmp/frontend_deploy.zip -d /var/www/pioneer-academy/frontend
    rm /tmp/frontend_deploy.zip
    echo "✅ Frontend installé"
fi

# 2. BACKEND
if [ -f /tmp/backend_deploy.zip ]; then
    echo "[BACKEND] Installation..."
    rm -rf /var/www/pioneer-academy/backend
    mkdir -p /var/www/pioneer-academy/backend
    unzip -q /tmp/backend_deploy.zip -d /var/www/pioneer-academy/backend
    rm /tmp/backend_deploy.zip
    
    # Copier .env
    if [ -f /tmp/.env ]; then
        cp /tmp/.env /var/www/pioneer-academy/backend/.env
        rm /tmp/.env
    fi
    
    # Installer dépendances
    echo "[BACKEND] Installation npm..."
    cd /var/www/pioneer-academy/backend
    npm ci --production --omit=dev
    
    # PM2
    echo "[BACKEND] Configuration PM2..."
    pm2 delete pioneer-backend 2>/dev/null || true
    NODE_ENV=production pm2 start server.js --name "pioneer-backend" --instances 1 --max-memory-restart 500M
    pm2 save
    
    echo "✅ Backend déployé et démarré"
fi

echo "✅ DEPLOIEMENT TERMINE"
'@

# Sauvegarder script sur serveur
$deployScript | ssh -i $SSH_KEY ${SSH_USER}@${VPS_HOST} "cat > /tmp/deploy_pioneer.sh && chmod +x /tmp/deploy_pioneer.sh"

# Exécuter script
Write-Host "  Exécution du déploiement..." -ForegroundColor Cyan
ssh -i $SSH_KEY ${SSH_USER}@${VPS_HOST} "bash /tmp/deploy_pioneer.sh"

if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Déploiement serveur OK" -ForegroundColor Green
} else {
    Write-Host "  ❌ Erreur déploiement serveur" -ForegroundColor Red
    exit 1
}

# ========================================
# ETAPE 5 : CONFIGURATION NGINX
# ========================================
Write-Host "`n[5/6] Configuration Nginx..." -ForegroundColor Yellow

$nginxConfig = @'
server {
    listen 80;
    server_name pioneeracademy.academy www.pioneeracademy.academy;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pioneeracademy.academy www.pioneeracademy.academy;

    ssl_certificate /etc/letsencrypt/live/pioneeracademy.academy/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pioneeracademy.academy/privkey.pem;
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    root /var/www/pioneer-academy/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
'@

$nginxConfig | ssh -i $SSH_KEY ${SSH_USER}@${VPS_HOST} "cat > /etc/nginx/sites-available/pioneer-academy"
ssh -i $SSH_KEY ${SSH_USER}@${VPS_HOST} "ln -sf /etc/nginx/sites-available/pioneer-academy /etc/nginx/sites-enabled/ && nginx -t && systemctl reload nginx"

Write-Host "  ✅ Nginx configuré et rechargé" -ForegroundColor Green

# ========================================
# ETAPE 6 : VERIFICATION
# ========================================
Write-Host "`n[6/6] Vérification..." -ForegroundColor Yellow

$status = ssh -i $SSH_KEY ${SSH_USER}@${VPS_HOST} "pm2 status pioneer-backend --no-color | grep pioneer-backend"
Write-Host "  Backend: $status" -ForegroundColor Cyan

# ========================================
# SUCCES
# ========================================
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "   ✅ DEPLOIEMENT REUSSI !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Site accessible: https://pioneeracademy.academy" -ForegroundColor Cyan
Write-Host "📊 Monitoring: ssh -i $SSH_KEY $SSH_USER@$VPS_HOST 'pm2 monit'" -ForegroundColor Gray
Write-Host "📜 Logs: ssh -i $SSH_KEY $SSH_USER@$VPS_HOST 'pm2 logs pioneer-backend'" -ForegroundColor Gray
Write-Host ""

# Cleanup
Remove-Item frontend_deploy.zip -ErrorAction SilentlyContinue
Remove-Item backend_deploy.zip -ErrorAction SilentlyContinue
