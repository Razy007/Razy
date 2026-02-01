#!/bin/bash
# DEPLOY_SECURISE_v2.2.1.sh
# Script de déploiement automatique et sécurisé pour Pioneer Academy

set -e

echo "🔒 Démarrage du déploiement sécurisé v2.2.1..."

# 1. Vérification des prérequis
if [ ! -f "hetzner_key" ]; then
    echo "❌ Erreur: Clé SSH 'hetzner_key' introuvable."
    exit 1
fi

chmod 600 hetzner_key

HOST="root@pioneeracademy.academy"
REMOTE_DIR="/mnt/okcomputer/output/pi-academy-app"
BACKUP_DIR="/mnt/okcomputer/backups"
TIMESTAMP=$(date +%Y%m%d%H%M%S)

echo "📡 Connexion au serveur..."

# 2. Création Backup
echo "💾 Création du backup distant..."
ssh -i hetzner_key -o StrictHostKeyChecking=no $HOST << EOF
    mkdir -p $BACKUP_DIR
    if [ -d "$REMOTE_DIR" ]; then
        tar -czf "$BACKUP_DIR/backup-pre-v2.2.1-$TIMESTAMP.tar.gz" -C /mnt/okcomputer/output pi-academy-app
        echo "✅ Backup créé: backup-pre-v2.2.1-$TIMESTAMP.tar.gz"
    fi
EOF

# 3. Synchronisation des Fichiers (Exclusion des secrets)
echo "📤 Envoi des fichiers..."
rsync -avz --exclude 'node_modules' --exclude '.env' --exclude '.git' --exclude 'dist' \
    -e "ssh -i hetzner_key -o StrictHostKeyChecking=no" \
    ./ $HOST:$REMOTE_DIR/

# 4. Exécution des tâches distantes
echo "⚙️ Configuration et Build sur le serveur..."
ssh -i hetzner_key $HOST << EOF
    set -e
    cd $REMOTE_DIR
    
    # Restauration .env sécurisé (s'il existe déjà sur le serveur)
    # ou copie de l'example si nécessaire
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "⚠️ .env créé depuis example (A CONFIGURER)"
    fi

    echo "📦 Installation Backend..."
    cd backend
    npm ci --production=false
    npm run build
    
    echo "📦 Installation Frontend..."
    cd ../frontend
    npm ci
    npm run build

    echo "🗄️ Migration Base de Données..."
    sudo -u postgres psql pi_academy -f ../migration_wallet_management.sql

    echo "🚀 Redémarrage des Services..."
    pm2 reload pi-academy-backend || pm2 start dist/server.js --name pi-academy-backend
    systemctl reload nginx

    echo "✅ Déploiement terminé !"
EOF

echo "✨ SUCCÈS: v2.2.1 Déployée sur https://pioneeracademy.academy"
