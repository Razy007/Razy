#!/bin/bash
# Fix Nginx cache for Pi Browser
# Run on server: bash fix_nginx_cache.sh

echo "Updating Nginx configuration..."

# Backup
sudo cp /etc/nginx/sites-available/pioneer-academy /etc/nginx/sites-available/pioneer-academy.backup.$(date +%Y%m%d_%H%M%S)

# Create new config
sudo tee /etc/nginx/sites-available/pioneer-academy > /dev/null <<'EOF'
# HTTP -> HTTPS
server {
    listen 80;
    server_name pioneeracademy.academy www.pioneeracademy.academy;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl;
    server_name pioneeracademy.academy www.pioneeracademy.academy;

    ssl_certificate /etc/letsencrypt/live/pioneeracademy.academy/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pioneeracademy.academy/privkey.pem;

    root /var/www/pioneer-academy;
    index index.html;

    # FORCE NO CACHE - Critical for Pi Browser
    location / {
        add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0";
        add_header Pragma "no-cache";
        add_header Expires "0";
        try_files $uri $uri/ /index.html;
    }

    # Assets with cache busting via query string
    location /assets/ {
        add_header Cache-Control "no-store, no-cache, must-revalidate";
        add_header Pragma "no-cache";
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Test config
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration valid. Reloading Nginx..."
    sudo systemctl reload nginx
    echo "✅ Nginx reloaded successfully!"
else
    echo "❌ Configuration error. Restoring backup..."
    sudo cp /etc/nginx/sites-available/pioneer-academy.backup.$(date +%Y%m%d)* /etc/nginx/sites-available/pioneer-academy
fi
