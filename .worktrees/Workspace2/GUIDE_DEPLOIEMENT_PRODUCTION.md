# 🚀 GUIDE DE DÉPLOIEMENT - pioneeracademy.academy

## 📋 PRÉREQUIS

Avant de déployer, assurez-vous d'avoir:
- [x] Accès SSH au serveur pioneeracademy.academy
- [x] Base de données PostgreSQL configurée
- [x] Node.js 16+ installé sur le serveur
- [x] Nom de domaine configuré (DNS pointant vers serveur)

---

## 🔧 ÉTAPE 1: PRÉPARATION LOCALE

### 1.1 Appliquer la migration SQL (CRITIQUE)

**Sur votre serveur de base de données:**

```bash
# Connexion PostgreSQL
psql -U postgres -d pi_academy

# Appliquer la migration
\i /path/to/backend/migrations/add_completed_layers.sql

# Vérification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name = 'completed_layers';

# Résultat attendu:
#  column_name      | data_type 
# ------------------+-----------
#  completed_layers | jsonb
```

### 1.2 Build Backend

```powershell
cd backend

# Installation dépendances
npm install --production

# Compilation TypeScript
npm run build

# Vérification
Test-Path dist/server.js  # Doit retourner True
```

### 1.3 Build Frontend

```powershell
cd frontend

# Configuration production
$env:VITE_API_URL="https://pioneeracademy.academy/api"
$env:VITE_PI_SANDBOX="false"  # PRODUCTION MODE
$env:VITE_PI_API_KEY="YOUR_PRODUCTION_PI_API_KEY"

# Build optimisé
npm install --production
npm run build

# Vérification
Test-Path dist/index.html  # Doit retourner True
```

---

## 🌐 ÉTAPE 2: CONFIGURATION SERVEUR

### 2.1 Variables d'environnement Backend

Créez `/var/www/pi-academy/.env`:

```env
# Base de données
DATABASE_URL=postgresql://user:password@localhost:5432/pi_academy
MONGODB_URI=mongodb://localhost:27017/pi_academy
REDIS_URL=redis://localhost:6379

# Pi Network
PI_API_KEY=your_production_pi_api_key
PI_WALLET_PRIVATE_SEED=your_wallet_seed
PI_ENVIRONMENT=production  # IMPORTANT: pas "sandbox"

# Sécurité
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production

# Frontend
FRONTEND_URL=https://pioneeracademy.academy

# Serveur
PORT=3000
```

### 2.2 Nginx Configuration

Créez `/etc/nginx/sites-available/pioneeracademy.academy`:

```nginx
# Backend API (Node.js)
upstream backend_api {
    server localhost:3000;
}

# Frontend (Static files)
server {
    listen 80;
    listen [::]:80;
    server_name pioneeracademy.academy www.pioneeracademy.academy;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name pioneeracademy.academy www.pioneeracademy.academy;

    # SSL Certificates (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/pioneeracademy.academy/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pioneeracademy.academy/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Frontend static files
    root /var/www/pi-academy/frontend/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "public, max-age=3600";
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://backend_api/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.minepi.com https://sdk.minepi.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.minepi.com;" always;

    # Logs
    access_log /var/log/nginx/pioneeracademy.academy.access.log;
    error_log /var/log/nginx/pioneeracademy.academy.error.log;
}
```

**Activer le site:**

```bash
sudo ln -s /etc/nginx/sites-available/pioneeracademy.academy /etc/nginx/sites-enabled/
sudo nginx -t  # Vérifier configuration
sudo systemctl reload nginx
```

### 2.3 SSL Certificate (Let's Encrypt)

```bash
# Installation Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtenir certificat SSL
sudo certbot --nginx -d pioneeracademy.academy -d www.pioneeracademy.academy

# Auto-renouvellement
sudo certbot renew --dry-run
```

---

## 🚀 ÉTAPE 3: DÉPLOIEMENT

### 3.1 Upload des fichiers

**Option A: Via Git (Recommandé)**

```bash
# Sur le serveur
cd /var/www/pi-academy
git pull origin main
cd backend && npm install --production && npm run build
cd ../frontend && npm install --production && npm run build
```

**Option B: Via SCP/SFTP**

```powershell
# Depuis votre machine locale
scp -r backend/dist user@pioneeracademy.academy:/var/www/pi-academy/backend/
scp -r frontend/dist user@pioneeracademy.academy:/var/www/pi-academy/frontend/
```

### 3.2 Démarrer Backend (PM2)

```bash
# Installation PM2
sudo npm install -g pm2

# Démarrer l'application
cd /var/www/pi-academy/backend
pm2 start dist/server.js --name "pi-academy-api" --env production

# Configuration auto-start
pm2 startup
pm2 save

# Logs
pm2 logs pi-academy-api
```

### 3.3 Vérification

```bash
# Backend API
curl https://pioneeracademy.academy/api/health
# Attendu: {"status":"ok"}

# Frontend
curl -I https://pioneeracademy.academy
# Attendu: HTTP/2 200
```

---

## ✅ ÉTAPE 4: TESTS DANS PI BROWSER

### 4.1 Configuration Pi Developer Portal

1. Allez sur https://developers.minepi.com
2. Créez une nouvelle app:
   - **Name:** Academy of Pi
   - **URL:** https://pioneeracademy.academy
   - **Category:** Education
   - **Environment:** Production
3. Copiez votre **Pi API Key** production
4. Mettez à jour `.env` backend avec cette clé

### 4.2 Tests Fonctionnels

**Dans Pi Browser:**

1. **Authentification Pi**
   - Ouvrir https://pioneeracademy.academy
   - Cliquer "Login with Pi"
   - ✅ Vérifier: Modal Pi s'ouvre
   - ✅ Vérifier: Après login, profil affiché

2. **Complétion Discovery**
   - Cours → "Introduction à Pi Network"
   - Layer "Découverte" → Lire → Terminer
   - ✅ Vérifier: Toast "+50 XP gagnés !"
   - ✅ Vérifier: Header mis à jour
   - ✅ Vérifier: Console browser (F12) aucune erreur

3. **Skills Analysis**
   - Navigation → "Analyse des Compétences"
   - ✅ Vérifier: Score "Économie Pi" > 0%
   - ✅ Vérifier: Barre progression visible
   - ✅ Vérifier: Pas d'erreur console

4. **Boutique Conforme**
   - Navigation → "Boutique"
   - ✅ Vérifier: Aucun prix USD
   - ✅ Vérifier: Limites "(Max X/jour)" affichées
   - ✅ Vérifier: Produits conformes uniquement

5. **Test Paiement (Sandbox si dispo)**
   - Acheter "Recharge Énergie" (0.0001 π)
   - ✅ Vérifier: Modal paiement Pi s'ouvre
   - ✅ Vérifier: Transaction enregistrée
   - ✅ Vérifier: Énergie ajoutée (+50)

---

## 🔍 MONITORING & LOGS

### Logs Backend (PM2)

```bash
pm2 logs pi-academy-api --lines 100
pm2 monit  # Interface monitoring temps réel
```

### Logs Nginx

```bash
tail -f /var/log/nginx/pioneeracademy.academy.access.log
tail -f /var/log/nginx/pioneeracademy.academy.error.log
```

### Logs PostgreSQL

```bash
sudo tail -f /var/log/postgresql/postgresql-*.log
```

---

## 🐛 TROUBLESHOOTING

### Erreur: "Cannot connect to backend"

**Solution:**
```bash
# Vérifier backend running
pm2 status
pm2 restart pi-academy-api

# Vérifier port 3000 listening
netstat -tulpn | grep 3000
```

### Erreur: "column completed_layers does not exist"

**Solution:**
```bash
# Migration non appliquée
psql -U postgres -d pi_academy -f /var/www/pi-academy/backend/migrations/add_completed_layers.sql
pm2 restart pi-academy-api
```

### Erreur: "Pi SDK not loaded"

**Solution:**
```javascript
// Vérifier dans frontend/dist/index.html
<script src="https://sdk.minepi.com/pi-sdk.js"></script>
```

### Erreur 502 Bad Gateway

**Solution:**
```bash
# Backend crashé
pm2 logs pi-academy-api --err
pm2 restart pi-academy-api

# Nginx config invalide
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 CHECKLIST DÉPLOIEMENT

- [ ] Migration SQL `completed_layers` appliquée
- [ ] Backend build compilé (`dist/server.js` existe)
- [ ] Frontend build compilé (`dist/index.html` existe)
- [ ] Variables env production configurées
- [ ] SSL certificate installé (HTTPS)
- [ ] Nginx configuré et redémarré
- [ ] PM2 backend démarré
- [ ] DNS pioneeracademy.academy pointe vers serveur
- [ ] Firewall ports 80/443 ouverts
- [ ] Tests Pi Browser passés
- [ ] Logs aucune erreur critique

---

## 🎯 COMMANDES RAPIDES

### Redéploiement rapide

```bash
cd /var/www/pi-academy
git pull
cd backend && npm run build && pm2 restart pi-academy-api
cd ../frontend && npm run build
sudo systemctl reload nginx
```

### Rollback urgence

```bash
cd /var/www/pi-academy
git reset --hard HEAD~1
cd backend && npm run build && pm2 restart pi-academy-api
cd ../frontend && npm run build
```

---

## ✅ VALIDATION FINALE

Avant de soumettre à la Core Team, vérifiez:

1. ✅ https://pioneeracademy.academy charge en HTTPS
2. ✅ Login Pi fonctionne
3. ✅ Discovery → XP validation fonctionne
4. ✅ Skills Analysis affiche scores
5. ✅ Boutique conforme (aucun USD)
6. ✅ Console browser 0 erreur
7. ✅ Tests tous les flows utilisateur

**Si tout est ✅, vous pouvez soumettre à la Core Team Pi Network !**

---

**Date:** 2026-01-14  
**Auteur:** Verdent AI Engineering Assistant  
**Version:** 2.1.0 Production
