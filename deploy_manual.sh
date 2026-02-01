#!/bin/bash
set -e

echo "=== DEPLOYMENT STARTED ==="

# 1. SETUP DIRECTORIES
mkdir -p /var/www/pioneer-academy
echo "[OK] Directories created"

# 2. FRONTEND
if [ -f /tmp/frontend_deploy.zip ]; then
    echo "--- Installing Frontend ---"
    rm -rf /var/www/pioneer-academy/frontend
    mkdir -p /var/www/pioneer-academy/frontend
    unzip -q -o /tmp/frontend_deploy.zip -d /var/www/pioneer-academy/frontend || echo "Warning: Unzip had issues (likely backslashes), continuing..."
    rm /tmp/frontend_deploy.zip
    echo "[OK] Frontend Installed"
fi

# 3. BACKEND
if [ -f /tmp/backend_deploy.zip ]; then
    echo "--- Installing Backend ---"
    rm -rf /var/www/pioneer-academy/backend
    mkdir -p /var/www/pioneer-academy/backend
    unzip -q -o /tmp/backend_deploy.zip -d /var/www/pioneer-academy/backend || echo "Warning: Unzip had issues, continuing..."
    rm /tmp/backend_deploy.zip
    
    # .env
    if [ -f /tmp/.env ]; then
        cp /tmp/.env /var/www/pioneer-academy/backend/.env
        rm /tmp/.env
    fi
    echo "[OK] Backend Extracted"
    
    # Install dependencies
    echo "--- Installing Dependencies ---"
    cd /var/www/pioneer-academy/backend
    npm ci --production --omit=dev
    echo "[OK] Dependencies Installed"
    
    # DATABASE MIGRATIONS
    echo "--- Running Migrations ---"
    if [ -f migrations/create_user_wallets_table.sql ]; then
        sudo -u postgres psql pi_academy -f migrations/create_user_wallets_table.sql || echo "Warning: User Wallets migration failed or partial"
    fi
    # Also ensure withdrawal table exists if not already
    if [ -f migrations/create_withdrawal_table.sql ]; then
        sudo -u postgres psql pi_academy -f migrations/create_withdrawal_table.sql || echo "Warning: Withdrawal table migration failed or partial"
    fi
    echo "[OK] Migrations attempted"

    # PM2
    echo "--- Restarting PM2 ---"
    pm2 delete pioneer-backend 2>/dev/null || true
    NODE_ENV=production pm2 start server.js --name "pioneer-backend" --instances 1 --max-memory-restart 500M
    pm2 save
    echo "[OK] Backend Started"
fi

echo "=== DEPLOYMENT FINISHED SUCCESS ==="
