---
description: Roadmap de Déploiement Production VPS - Pioneer Academy
---

# 🏆 ROADMAP PRODUCTION VPS - PIONEER ACADEMY

## 🎯 OBJECTIF

Déployer Pioneer Academy sur VPS avec **sécurité maximale**, scalabilité et monitoring professionnel.

---

## 📊 ARCHITECTURE PRODUCTION RECOMMANDÉE

```
┌─────────────────────────────────────────────────────────────┐
│                     ARCHITECTURE SÉCURISÉE                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  [Utilisateurs] → [Cloudflare CDN/WAF] → [Nginx Reverse Proxy]
│                                                ↓              │
│                                    [Node.js Backend (PM2)]   │
│                                                ↓              │
│                                    [MongoDB Atlas]            │
│                                                               │
│  [Monitoring] ← [Logs centralisés] ← [Alertes sécurité]     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 SÉCURITÉ - CHECKLIST COMPLÈTE

### 🛡️ NIVEAU 1 - SÉCURITÉ RÉSEAU

#### ✅ Firewall Configuration

- [ ] Autoriser uniquement ports 80, 443, 22 (SSH)
- [ ] SSH uniquement depuis IP autorisée (pas 0.0.0.0/0)
- [ ] Rate limiting sur toutes les entrées
- [ ] DDoS protection (Cloudflare)

#### ✅ SSL/TLS

- [ ] Certificat Let's Encrypt (gratuit, auto-renouvelé)
- [ ] TLS 1.3 minimum
- [ ] HSTS activé
- [ ] Certificat valide A+ sur SSL Labs

---

### 🔒 NIVEAU 2 - SÉCURITÉ APPLICATION

#### ✅ Backend Node.js

- [ ] Variables d'environnement (.env) **JAMAIS** dans Git
- [ ] Helmet.js pour headers sécurisés
- [ ] Rate limiting API (express-rate-limit)
- [ ] CORS configuré strictement
- [ ] Validation entrées utilisateur (Joi/Zod)
- [ ] Sanitization données (express-mongo-sanitize)
- [ ] JWT avec expiration courte + refresh token
- [ ] Bcrypt pour hash passwords (rounds ≥ 12)

#### ✅ MongoDB Atlas

- [ ] IP Whitelisting : **IP FIXE VPS UNIQUEMENT**
- [ ] Utilisateur DB avec permissions minimales (principe du moindre privilège)
- [ ] Authentification forte activée
- [ ] Encryption at rest activée
- [ ] Backup automatique quotidien
- [ ] Monitoring des accès suspects

---

### 🔐 NIVEAU 3 - SÉCURITÉ SYSTÈME

#### ✅ Server Hardening

- [ ] Utilisateur non-root pour Node.js
- [ ] SSH : clé publique uniquement (pas de password)
- [ ] Fail2ban contre brute force SSH
- [ ] Mises à jour automatiques sécurité
- [ ] Audit logs activé
- [ ] SELinux ou AppArmor activé

---

## 🚀 ÉTAPES DE DÉPLOIEMENT

### PHASE 1 - PRÉPARATION VPS (Jour 1)

#### 1. Choix du Provider VPS

**Recommandations :**

- **DigitalOcean** : $6/mois, simple, fiable
- **Hetzner** : $4.5/mois, excellent rapport qualité/prix
- **Linode** : $5/mois, performant
- **Vultr** : $6/mois, global

**Configuration minimale :**

- 1 vCPU
- 2 GB RAM
- 50 GB SSD
- Ubuntu 22.04 LTS

#### 2. Configuration initiale serveur

```bash
# Créer utilisateur non-root
adduser pioneer
usermod -aG sudo pioneer

# Configuration SSH sécurisé
nano /etc/ssh/sshd_config
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes

# Firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable

# Fail2ban
apt install fail2ban -y
systemctl enable fail2ban
```

#### 3. Installation Stack

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Nginx
apt install nginx -y

# PM2 (Process Manager)
npm install -g pm2

# Certbot (Let's Encrypt)
apt install certbot python3-certbot-nginx -y
```

---

### PHASE 2 - DÉPLOIEMENT APPLICATION (Jour 2)

#### 4. Déploiement Backend

```bash
# Clone repository
cd /var/www
git clone <votre-repo> pioneer-academy
cd pioneer-academy/backend

# Installation dépendances
npm ci --production

# Configuration environnement
nano .env
```

**Fichier .env PRODUCTION :**

```env
NODE_ENV=production
PORT=3001

# MongoDB Atlas - IP VPS UNIQUEMENT
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pioneer?retryWrites=true&w=majority

# JWT Secrets (générer avec: openssl rand -base64 32)
JWT_SECRET=<secret-fort-généré>
JWT_REFRESH_SECRET=<autre-secret-fort>

# CORS
ALLOWED_ORIGINS=https://pioneer-academy.com,https://www.pioneer-academy.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

```bash
# PM2 Start
pm2 start npm --name "pioneer-backend" -- start
pm2 startup
pm2 save
```

#### 5. Configuration Nginx

```nginx
# /etc/nginx/sites-available/pioneer-academy
server {
    listen 80;
    server_name pioneer-academy.com www.pioneer-academy.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name pioneer-academy.com www.pioneer-academy.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/pioneer-academy.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pioneer-academy.com/privkey.pem;
    ssl_protocols TLSv1.3 TLSv1.2;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend (build React)
    root /var/www/pioneer-academy/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Backend
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

        # Rate limiting
        limit_req zone=api burst=20 nodelay;
    }
}

# Rate limiting zone
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
```

```bash
# Activer site
ln -s /etc/nginx/sites-available/pioneer-academy /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx

# Générer certificat SSL
certbot --nginx -d pioneer-academy.com -d www.pioneer-academy.com
```

#### 6. Build Frontend

```bash
cd /var/www/pioneer-academy/frontend

# Configuration API URL production
nano .env.production
```

**Fichier .env.production :**

```env
VITE_API_URL=https://pioneer-academy.com/api
VITE_PI_API_KEY=<votre-clé-pi-network>
```

```bash
# Build
npm ci
npm run build

# Les fichiers sont dans dist/ et servis par Nginx
```

---

### PHASE 3 - MONITORING & MAINTENANCE (Jour 3+)

#### 7. Monitoring

```bash
# PM2 Monitoring
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30

# Monitoring web (optionnel mais recommandé)
# Uptime Kuma (gratuit, self-hosted)
docker run -d --restart=always -p 3002:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

#### 8. Backups

```bash
# Script backup MongoDB (à exécuter quotidiennement via cron)
mkdir -p /backups/mongodb

# MongoDB Atlas a déjà des backups automatiques
# Mais on peut aussi faire des exports locaux

# Cron backup
crontab -e
# Ajouter : 0 2 * * * /home/pioneer/backup-script.sh
```

#### 9. Logs centralisés

```bash
# PM2 logs
pm2 logs --lines 100

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Rotation automatique déjà configurée par logrotate
```

---

## 📊 CONFIGURATION MONGODB ATLAS PRODUCTION

### 🔐 Sécurité MongoDB (CRITIQUE)

#### 1. Network Access

```
✅ IP Whitelist : AJOUTER UNIQUEMENT l'IP FIXE du VPS
✅ Supprimer 0.0.0.0/0 (développement seulement)
```

#### 2. Database Access

```
Créer utilisateur dédié avec permissions minimales :

Username: pioneer_prod_user
Password: <générer mot de passe fort 32+ caractères>
Role: readWrite sur database "pioneer" uniquement
```

#### 3. Advanced Settings

```
✅ Encryption at Rest: Enabled
✅ Backup: Continuous (Cloud Backup)
✅ Monitoring: Alerts activées
✅ Performance Advisor: Enabled
```

---

## 🔍 CHECKLIST SÉCURITÉ PRÉ-LANCEMENT

### ✅ AVANT DE METTRE EN PRODUCTION

- [ ] Tous les secrets dans .env (pas dans le code)
- [ ] .env dans .gitignore
- [ ] MongoDB IP = VPS uniquement
- [ ] SSL/TLS A+ sur SSL Labs
- [ ] Headers sécurité (helmet.js)
- [ ] Rate limiting activé
- [ ] CORS configuré strictement
- [ ] JWT expiration correcte
- [ ] Validation entrées utilisateur
- [ ] Logs configurés
- [ ] Backup automatique testé
- [ ] Monitoring actif
- [ ] Firewall VPS configuré
- [ ] Fail2ban actif
- [ ] SSH sécurisé (clé uniquement)
- [ ] Nginx hardened
- [ ] PM2 auto-restart configuré

---

## 🚨 PLAN D'URGENCE

### En cas de problème

#### Backend down

```bash
# Restart PM2
pm2 restart pioneer-backend
pm2 logs
```

#### Nginx down

```bash
systemctl status nginx
systemctl restart nginx
nginx -t
```

#### Attack DDoS

```bash
# Cloudflare : activer "I'm Under Attack" mode
# Nginx : ajuster rate limits
limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;
```

#### Compromission détectée

```bash
# 1. Isoler serveur immédiatement
ufw deny from <ip-suspecte>

# 2. Changer tous les secrets
# 3. Audit complet logs
# 4. Restaurer backup si nécessaire
```

---

## 💰 COÛTS ESTIMÉS

### Infrastructure Mensuelle

- VPS (DigitalOcean/Hetzner) : $5-6/mois
- MongoDB Atlas M0 (gratuit) : $0
- Cloudflare Free : $0
- Domaine (.com) : ~$12/an = $1/mois
- **TOTAL : ~$7/mois**

### Scaling (si croissance)

- VPS upgraded (4GB RAM) : $12/mois
- MongoDB M10 (production) : $57/mois
- Cloudflare Pro : $20/mois
- **TOTAL avec scaling : ~$90/mois**

---

## 📈 ROADMAP POST-LANCEMENT

### Semaine 1-2

- Monitoring quotidien
- Ajustements performance
- Correction bugs critiques

### Mois 1

- Analytics utilisateurs
- Optimisation SEO
- A/B testing

### Mois 2-3

- Scaling si besoin
- Nouvelles features
- CDN pour assets statiques

### Améliorations continues

- Tests de charge
- Audit sécurité régulier
- Optimisation base de données
- CI/CD automatisé (GitHub Actions)

---

## 🎯 NEXT STEPS

1. **Maintenant** : Setup WSL2 + Test MongoDB
2. **Aujourd'hui** : Finaliser backend/frontend local
3. **Demain** : Choisir provider VPS
4. **J+2** : Déploiement production
5. **J+3** : Tests finaux + monitoring
6. **J+4** : 🚀 LANCEMENT PUBLIC

---

## 📞 SUPPORT & RESSOURCES

### Documentation

- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)
- [MongoDB Atlas Security](https://docs.atlas.mongodb.com/security/)
- [Node.js Production Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)

### Monitoring Services (gratuits pour commencer)

- Uptime Kuma (self-hosted)
- UptimeRobot (cloud, gratuit 50 monitors)
- Better Uptime (gratuit)

---

**🔒 SÉCURITÉ = PRIORITÉ #1**

Cette roadmap suit les standards de l'industrie pour une application en production.
Chaque étape est conçue pour garantir sécurité, performance et résilience.
