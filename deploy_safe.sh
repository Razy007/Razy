#!/bin/bash
set -e

echo "========================================="
echo "   DÉPLOIEMENT PIONEER ACADEMY v2.2"
echo "========================================="
echo ""

# Variables
DEPLOY_DIR="/var/www/pioneer-academy"
BACKEND_DIR="$DEPLOY_DIR/backend"
FRONTEND_DIR="$DEPLOY_DIR/frontend"

# 1. Frontend
echo "[1/4] Déploiement Frontend..."
mkdir -p "$FRONTEND_DIR"
if [ -f /tmp/frontend_deploy.tar.gz ]; then
    tar -xzf /tmp/frontend_deploy.tar.gz -C "$FRONTEND_DIR"
    rm /tmp/frontend_deploy.tar.gz
    echo "✅ Frontend déployé ($(ls -1 $FRONTEND_DIR | wc -l) fichiers)"
else
    echo "⚠️ Archive frontend non trouvée"
fi

# 2. Backend
echo ""
echo "[2/4] Déploiement Backend..."
mkdir -p "$BACKEND_DIR"
if [ -f /tmp/backend_deploy.tar.gz ]; then
    tar -xzf /tmp/backend_deploy.tar.gz -C "$BACKEND_DIR"
    rm /tmp/backend_deploy.tar.gz
    echo "✅ Backend déployé"
    
    # Install dependencies
    echo "Installation des dépendances..."
    cd "$BACKEND_DIR"
    npm ci --production --omit=dev 2>&1 | tail -3
    
    # Build TypeScript
    echo "Compilation TypeScript..."
    npm run build 2>&1 | tail -2
    
    echo "✅ Backend compilé"
else
    echo "⚠️ Archive backend non trouvée"
fi

# 3. PM2 Restart
echo ""
echo "[3/4] Redémarrage Backend (PM2)..."
pm2 delete pioneer-backend 2>/dev/null || true
cd "$BACKEND_DIR"
NODE_ENV=production pm2 start dist/server.js --name "pioneer-backend" --instances 1 --max-memory-restart 500M
pm2 save
echo "✅ Backend redémarré"

# 4. Nginx Reload
echo ""
echo "[4/4] Rechargement Nginx..."
nginx -t && systemctl reload nginx
echo "✅ Nginx rechargé"

# Status final
echo ""
echo "========================================="
echo "   ✅ DÉPLOIEMENT RÉUSSI !"
echo "========================================="
echo ""
pm2 status pioneer-backend
echo ""
echo "🌐 Site: https://pioneeracademy.academy"
echo "📊 Logs: pm2 logs pioneer-backend"
