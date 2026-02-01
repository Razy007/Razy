#!/bin/bash
# Script de déploiement Pioneer Academy
set -e

echo "=== DEPLOIEMENT PIONEER ACADEMY ==="

# 1. Déplacer le frontend
echo "[1/5] Installation Frontend..."
mkdir -p /var/www/pioneer-academy
rm -rf /var/www/pioneer-academy/frontend
mv /tmp/dist /var/www/pioneer-academy/frontend

# 2. Déplacer le backend
echo "[2/5] Installation Backend..."
rm -rf /var/www/pioneer-academy/backend
mv /tmp/pioneer-backend /var/www/pioneer-academy/backend

# 3. Installer dépendances backend
echo "[3/5] Installation dépendances..."
cd /var/www/pioneer-academy/backend
npm ci --production --omit=dev

# 4. Configuration PM2
echo "[4/5] Configuration PM2..."
pm2 delete pioneer-backend 2>/dev/null || true
pm2 start server.js --name "pioneer-backend" --instances 1 --max-memory-restart 500M
pm2 save
pm2 startup

# 5. Configuration Nginx
echo "[5/5] Configuration Nginx..."
cat > /etc/nginx/sites-available/pioneer-academy << 'EOF'
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

    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

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
EOF

ln -sf /etc/nginx/sites-available/pioneer-academy /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo "✅ DEPLOIEMENT TERMINE !"
echo "🌐 Site accessible sur: https://pioneeracademy.academy"
