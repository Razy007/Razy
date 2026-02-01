# 🚀 GUIDE DÉPLOIEMENT HETZNER VPS - PIONEER ACADEMY

## 🎯 OBJECTIF

Déployer Pioneer Academy sur Hetzner VPS avec sécurité maximale et performance optimale.

---

## 📋 PRÉREQUIS

- [ ] Compte Hetzner Cloud créé
- [ ] Carte bancaire pour paiement (€4.51/mois)
- [ ] 2-3 heures de disponibilité
- [ ] Accès SSH depuis votre machine

---

## 🔥 ÉTAPE 1 - CRÉATION DU VPS HETZNER (5 min)

### 1.1 Connexion Hetzner Cloud

1. Allez sur : https://console.hetzner.cloud/
2. Créez un compte ou connectez-vous
3. Créez un nouveau **Projet** : "Pioneer Academy"

### 1.2 Création du serveur

**Cliquez sur "Add Server"**

**Configuration recommandée** :

```
┌─────────────────────────────────────────────────────────┐
│              CONFIGURATION HETZNER OPTIMALE             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Location:        Nuremberg, Germany (nbg1)             │
│  Image:           Ubuntu 22.04 LTS                       │
│  Type:            CX11 (Shared vCPU)                     │
│  Specs:           1 vCPU / 2 GB RAM / 20 GB SSD         │
│  IPv4:            Included                               │
│  Backups:         ❌ Désactivé (optionnel, +20%)        │
│  Volumes:         ❌ Non requis                         │
│  Firewall:        ✅ À créer (voir ci-dessous)          │
│  SSH Key:         ✅ OBLIGATOIRE                        │
│  Server name:     pioneer-academy-prod                   │
│                                                          │
│  PRIX:            €4.51 / mois                          │
└─────────────────────────────────────────────────────────┘
```

### 1.3 Configuration SSH Key (CRITIQUE)

**Sur votre machine locale (Windows PowerShell)** :

```powershell
# Générer clé SSH (si pas déjà fait)
ssh-keygen -t ed25519 -C "pioneer-academy-vps"

# Afficher la clé publique
cat ~\.ssh\id_ed25519.pub
```

**Copiez la clé publique** et collez-la dans Hetzner lors de la création du serveur.

### 1.4 Création Firewall Hetzner

**Avant de créer le serveur, configurez le firewall** :

1. Dans le menu Hetzner, allez sur "Firewalls"
2. Cliquez "Create Firewall"
3. Nom : `pioneer-academy-fw`

**Règles INBOUND** :

```
┌──────────────┬────────────┬─────────────┬──────────────────┐
│ Protocol     │ Port       │ Source      │ Description      │
├──────────────┼────────────┼─────────────┼──────────────────┤
│ TCP          │ 22         │ 0.0.0.0/0   │ SSH (temporaire) │
│ TCP          │ 80         │ 0.0.0.0/0   │ HTTP             │
│ TCP          │ 443        │ 0.0.0.0/0   │ HTTPS            │
└──────────────┴────────────┴─────────────┴──────────────────┘
```

**OUTBOUND** : Allow all (par défaut)

⚠️ **Note** : On restreindra SSH à votre IP plus tard.

### 1.5 Lancement du serveur

1. Appliquez le firewall au serveur
2. Cliquez **"Create & Buy now"**
3. **Notez l'IP publique** qui s'affiche (ex: `95.216.xxx.xxx`)

**⏱️ Temps de création** : ~60 secondes

---

## 🔐 ÉTAPE 2 - PREMIÈRE CONNEXION & SÉCURISATION (15 min)

### 2.1 Connexion SSH initiale

**Depuis PowerShell** :

```powershell
# Remplacez par votre IP VPS
ssh root@95.216.xxx.xxx
```

**Réponse attendue** :

```
The authenticity of host '95.216.xxx.xxx' can't be established.
Are you sure you want to continue connecting (yes/no)? yes
```

✅ **Vous êtes connecté en tant que root !**

### 2.2 Mise à jour système

```bash
# Mise à jour complète
apt update && apt upgrade -y

# Installation outils essentiels
apt install -y curl wget git ufw fail2ban
```

### 2.3 Création utilisateur non-root

```bash
# Créer utilisateur 'pioneer'
adduser pioneer

# Répondre aux questions :
# - Password: [CHOISIR UN MOT DE PASSE FORT]
# - Full Name: Pioneer Academy
# - Autres: [Enter] pour skip

# Ajouter aux sudoers
usermod -aG sudo pioneer

# Copier clé SSH vers nouvel utilisateur
mkdir -p /home/pioneer/.ssh
cp /root/.ssh/authorized_keys /home/pioneer/.ssh/
chown -R pioneer:pioneer /home/pioneer/.ssh
chmod 700 /home/pioneer/.ssh
chmod 600 /home/pioneer/.ssh/authorized_keys
```

### 2.4 Configuration SSH sécurisée

```bash
# Éditer configuration SSH
nano /etc/ssh/sshd_config
```

**Modifiez ces lignes** :

```bash
# Trouver et modifier / décommenter :
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 22
```

**Sauvegarder** : `Ctrl+X`, puis `Y`, puis `Enter`

```bash
# Redémarrer SSH
systemctl restart sshd
```

### 2.5 Configuration Firewall UFW

```bash
# Configuration UFW (en plus du firewall Hetzner)
ufw default deny incoming
ufw default allow outgoing

# Autoriser SSH, HTTP, HTTPS
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp

# Activer (IMPORTANT: ne pas perdre connexion)
ufw enable

# Vérifier
ufw status
```

**Résultat attendu** :

```
Status: active

To                         Action      From
--                         ------      ----
22/tcp                     ALLOW       Anywhere
80/tcp                     ALLOW       Anywhere
443/tcp                     ALLOW       Anywhere
```

### 2.6 Configuration Fail2Ban (protection brute-force)

```bash
# Créer configuration locale
cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Éditer
nano /etc/fail2ban/jail.local
```

**Trouver section `[sshd]` et modifier** :

```ini
[sshd]
enabled = true
port = 22
maxretry = 3
bantime = 3600
findtime = 600
```

**Sauvegarder et redémarrer** :

```bash
systemctl enable fail2ban
systemctl restart fail2ban
systemctl status fail2ban
```

### 2.7 Test connexion avec nouvel utilisateur

**OUVREZ UN NOUVEAU TERMINAL (gardez l'ancien ouvert !)** :

```powershell
# Test connexion utilisateur 'pioneer'
ssh pioneer@95.216.xxx.xxx
```

✅ **Si connexion OK, vous pouvez fermer la session root.**

**Désormais, utilisez TOUJOURS l'utilisateur `pioneer`.**

---

## ⚙️ ÉTAPE 3 - INSTALLATION STACK (20 min)

### 3.1 Installation Node.js 20 LTS

```bash
# Installer Node.js depuis NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérifier installation
node -v    # Devrait afficher: v20.x.x
npm -v     # Devrait afficher: 10.x.x
```

### 3.2 Installation Nginx

```bash
# Installer Nginx
sudo apt install -y nginx

# Démarrer et activer
sudo systemctl start nginx
sudo systemctl enable nginx

# Vérifier
sudo systemctl status nginx
```

**Test rapide** : Ouvrez `http://95.216.xxx.xxx` dans votre navigateur  
✅ **Vous devriez voir** : "Welcome to nginx!"

### 3.3 Installation PM2 (Process Manager)

```bash
# Installer PM2 globalement
sudo npm install -g pm2

# Vérifier
pm2 -v
```

### 3.4 Installation Certbot (Let's Encrypt SSL)

```bash
# Installer Certbot
sudo apt install -y certbot python3-certbot-nginx
```

---

## 🚀 ÉTAPE 4 - DÉPLOIEMENT BACKEND (30 min)

### 4.1 Cloner le projet

```bash
# Aller dans home directory
cd ~

# Cloner votre repository
# Option 1: Si vous avez Git repository
git clone https://github.com/VOTRE-USERNAME/pi-academy-app.git

# Option 2: Upload manuel via SCP (depuis votre machine Windows)
# scp -r C:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app pioneer@95.216.xxx.xxx:~
```

**Pour ce guide, on suppose upload manuel** :

**Depuis PowerShell Windows** :

```powershell
# Compresser le projet backend
cd C:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app
tar -czf backend.tar.gz backend

# Upload vers VPS
scp backend.tar.gz pioneer@95.216.xxx.xxx:~

# Compresser frontend build
cd frontend
npm run build
cd ..
tar -czf frontend-dist.tar.gz frontend/dist

# Upload frontend
scp frontend-dist.tar.gz pioneer@95.216.xxx.xxx:~
```

**Sur le VPS** :

```bash
# Décompresser
tar -xzf backend.tar.gz
tar -xzf frontend-dist.tar.gz

# Créer structure
mkdir -p /var/www/pioneer-academy
mv backend /var/www/pioneer-academy/
mv frontend/dist /var/www/pioneer-academy/frontend
```

### 4.2 Configuration Backend

```bash
cd /var/www/pioneer-academy/backend

# Installer dépendances PRODUCTION
npm ci --production

# Créer fichier .env
nano .env
```

**Contenu `.env` PRODUCTION** :

```env
# Environment
NODE_ENV=production

# Server
PORT=3001

# MongoDB Atlas - UTILISEZ VOTRE URI RÉELLE
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/pioneer?retryWrites=true&w=majority

# JWT Secrets - GÉNÉRER DE NOUVEAUX SECRETS
# Commande: openssl rand -base64 32
JWT_SECRET=VOTRE_SECRET_GENERE_ICI_32_CARACTERES_MIN
JWT_REFRESH_SECRET=AUTRE_SECRET_DIFFERENT_32_CARACTERES_MIN
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# CORS - UTILISER VOTRE DOMAINE
ALLOWED_ORIGINS=https://votredomaine.com,https://www.votredomaine.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
BCRYPT_ROUNDS=12

# Pi Network
PI_API_KEY=your-pi-api-key
PI_API_SECRET=your-pi-api-secret
```

**Sauvegarder** : `Ctrl+X`, `Y`, `Enter`

**⚠️ IMPORTANT - Générer secrets JWT** :

```bash
# Générer JWT_SECRET
openssl rand -base64 32

# Générer JWT_REFRESH_SECRET
openssl rand -base64 32

# Copiez ces valeurs dans .env
nano .env
```

### 4.3 Tester Backend manuellement

```bash
# Test rapide
npm start
```

**Résultat attendu** :

```
🚀 Server running on port 3001
✅ MongoDB Connected successfully
```

**Testez l'API** (nouveau terminal) :

```bash
curl http://localhost:3001/api/health
```

**Si OK, arrêtez avec `Ctrl+C`**

### 4.4 Lancer avec PM2

```bash
# Démarrer avec PM2
pm2 start npm --name "pioneer-backend" -- start

# Configuration auto-restart au boot
pm2 startup
# Copiez-collez la commande affichée (commence par 'sudo env...')

# Sauvegarder configuration PM2
pm2 save

# Vérifier
pm2 list
pm2 logs pioneer-backend --lines 20
```

---

## 🌐 ÉTAPE 5 - CONFIGURATION NGINX + SSL (30 min)

### 5.1 Obtenir IP du VPS et configurer MongoDB Atlas

**Important avant de continuer** :

1. **Notez l'IP publique de votre VPS** : `95.216.xxx.xxx`

2. **Allez sur MongoDB Atlas** :
   - Network Access → Add IP Address
   - **Entrez UNIQUEMENT l'IP du VPS** : `95.216.xxx.xxx/32`
   - ❌ **SUPPRIMEZ** `0.0.0.0/0` (si présent)
   - Description : "Hetzner VPS Production"
   - Confirm

### 5.2 Configuration Nginx (sans domaine pour l'instant)

```bash
# Créer configuration Nginx
sudo nano /etc/nginx/sites-available/pioneer-academy
```

**Contenu** :

```nginx
server {
    listen 80;
    server_name _;  # Accepter toutes les requêtes

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Frontend (React build)
    root /var/www/pioneer-academy/frontend;
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
    }
}
```

**Sauvegarder et activer** :

```bash
# Créer lien symbolique
sudo ln -s /etc/nginx/sites-available/pioneer-academy /etc/nginx/sites-enabled/

# Désactiver site par défaut
sudo rm /etc/nginx/sites-enabled/default

# Tester configuration
sudo nginx -t

# Recharger Nginx
sudo systemctl reload nginx
```

### 5.3 Test Frontend + Backend

**Ouvrez votre navigateur** : `http://95.216.xxx.xxx`

✅ **Vous devriez voir Pioneer Academy !**

**Testez l'API** : `http://95.216.xxx.xxx/api/health`

---

## 🔒 ÉTAPE 6 - HTTPS avec Let's Encrypt (SI DOMAINE)

### 6.1 Configuration DNS (Prérequis)

**Si vous avez un domaine** (ex: `pioneer-academy.com`) :

1. Allez sur votre registrar (Namecheap, GoDaddy, etc.)
2. Configurez les DNS records :

```
Type    Name    Value               TTL
A       @       95.216.xxx.xxx      300
A       www     95.216.xxx.xxx      300
```

**Attendez 5-10 minutes** pour propagation DNS.

**Testez** :

```bash
ping votredomaine.com
# Devrait répondre avec l'IP de votre VPS
```

### 6.2 Modifier configuration Nginx avec domaine

```bash
sudo nano /etc/nginx/sites-available/pioneer-academy
```

**Modifiez `server_name`** :

```nginx
server {
    listen 80;
    server_name pioneer-academy.com www.pioneer-academy.com;
    # ... reste identique
}
```

**Recharger** :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3 Obtenir certificat SSL

```bash
# Générer certificat Let's Encrypt
sudo certbot --nginx -d pioneer-academy.com -d www.pioneer-academy.com
```

**Questions Certbot** :

```
Email: votre@email.com
Terms of Service: (A)gree
Share email: (N)o
```

**Certbot va automatiquement** :

- Générer le certificat
- Modifier la configuration Nginx
- Configurer le renouvellement automatique

**Test** : `https://pioneer-academy.com`

✅ **Cadenas vert dans le navigateur !**

### 6.4 Vérifier SSL Grade

**Test sur** : https://www.ssllabs.com/ssltest/

**Objectif** : **A+**

---

## 🧪 ÉTAPE 7 - TESTS FINAUX (15 min)

### 7.1 Test Backend API

```bash
# Health check
curl https://votredomaine.com/api/health

# Login Guest
curl -X POST https://votredomaine.com/api/auth/guest \
  -H "Content-Type: application/json"
```

### 7.2 Test Frontend

**Ouvrez** : `https://votredomaine.com`

**Testez** :

- [ ] Page charge
- [ ] Login Guest fonctionne
- [ ] Cours visibles
- [ ] Quiz fonctionnent
- [ ] Wallet s'ouvre
- [ ] Stats s'affichent

### 7.3 Test MongoDB Persistence

```bash
# Créer un utilisateur Guest
# Notez le User ID affiché

# Redémarrer backend
pm2 restart pioneer-backend

# Reconnectez-vous
# ✅ Les données doivent persister
```

---

## 📊 ÉTAPE 8 - MONITORING & MAINTENANCE (optionnel mais recommandé)

### 8.1 Configuration PM2 Monitoring

```bash
# Installer module logrotate
pm2 install pm2-logrotate

# Configurer rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

### 8.2 Monitoring externe (gratuit)

**UptimeRobot** : https://uptimerobot.com

- Créez un monitor HTTP(S)
- URL : `https://votredomaine.com`
- Interval : 5 minutes
- Notifications : Email

### 8.3 Backups automatiques (Hetzner)

1. Dans Hetzner Console
2. Serveur → Backups → Enable
3. Coût : +20% (€0.90/mois)
4. Retention : 7 jours

**Alternative gratuite** : Script backup MongoDB

```bash
# Script backup (exemple)
nano ~/backup-mongodb.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/pioneer/backups"
mkdir -p $BACKUP_DIR

# MongoDB Atlas a déjà des backups automatiques
# Mais on peut exporter localement
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR/backup_$DATE"

# Garder seulement les 7 derniers backups
ls -t $BACKUP_DIR | tail -n +8 | xargs -I {} rm -rf $BACKUP_DIR/{}
```

```bash
# Rendre exécutable
chmod +x ~/backup-mongodb.sh

# Ajouter au cron (quotidien à 2h du matin)
crontab -e
```

**Ajouter** :

```
0 2 * * * /home/pioneer/backup-mongodb.sh
```

---

## 🔐 ÉTAPE 9 - SÉCURITÉ FINALE (10 min)

### 9.1 Restreindre SSH à votre IP

**Trouvez votre IP publique** (depuis Windows) :

```powershell
curl ifconfig.me
```

**Sur le VPS** :

```bash
# Éditer Hetzner Firewall (Web Console)
# SSH Rule: Source = VOTRE_IP/32 (au lieu de 0.0.0.0/0)
```

### 9.2 Configuration MongoDB Atlas FINALE

**Network Access** :

- ✅ `95.216.xxx.xxx/32` (VPS uniquement)
- ❌ Supprimez TOUT le reste

**Database Access** :

- Username : `pioneer_prod`
- Password : [Générer nouveau fort]
- Role : `readWrite` sur database `pioneer` uniquement

### 9.3 Vérifier permissions fichiers

```bash
# .env doit être lisible uniquement par owner
chmod 600 /var/www/pioneer-academy/backend/.env

# Vérifier
ls -la /var/www/pioneer-academy/backend/.env
# Devrait afficher: -rw------- (600)
```

---

## ✅ CHECKLIST FINALE

### Infrastructure

- [ ] VPS Hetzner créé et accessible
- [ ] Utilisateur non-root configuré
- [ ] SSH sécurisé (clé uniquement)
- [ ] Firewall UFW activé
- [ ] Fail2ban actif

### Stack

- [ ] Node.js 20 LTS installé
- [ ] Nginx installé et fonctionnel
- [ ] PM2 installé
- [ ] SSL/TLS (si domaine)

### Application

- [ ] Backend déployé
- [ ] Frontend déployé
- [ ] MongoDB Atlas connecté (IP VPS uniquement)
- [ ] .env sécurisé (600 permissions)
- [ ] PM2 auto-restart configuré

### Sécurité

- [ ] Secrets JWT uniques et forts
- [ ] MongoDB IP whitelist = VPS uniquement
- [ ] CORS configuré strictement
- [ ] Headers sécurité activés
- [ ] SSL A+ (si domaine)

### Tests

- [ ] Frontend accessible
- [ ] Backend API répond
- [ ] Login Guest fonctionne
- [ ] Persistence MongoDB OK
- [ ] Logs PM2 propres

---

## 🎉 LANCEMENT PRODUCTION

**Votre application est maintenant EN LIGNE !**

**URLs** :

- Frontend : `https://votredomaine.com` (ou `http://IP`)
- API : `https://votredomaine.com/api`
- Health : `https://votredomaine.com/api/health`

---

## 🆘 TROUBLESHOOTING

### Problème: Backend ne démarre pas

```bash
# Vérifier logs PM2
pm2 logs pioneer-backend --lines 50

# Vérifier MongoDB connection
cd /var/www/pioneer-academy/backend
node -e "require('dotenv').config(); console.log(process.env.MONGODB_URI)"
```

### Problème: Nginx 502 Bad Gateway

```bash
# Vérifier que backend tourne
pm2 list

# Vérifier logs Nginx
sudo tail -f /var/log/nginx/error.log
```

### Problème: MongoDB connection failed

```bash
# Vérifier IP du VPS
curl ifconfig.me

# Vérifier MongoDB Atlas Network Access
# L'IP doit correspondre exactement
```

### Problème: SSL certificate failed

```bash
# Vérifier DNS
nslookup votredomaine.com

# Retry Certbot
sudo certbot --nginx -d votredomaine.com -d www.votredomaine.com
```

---

## 📞 COMMANDES UTILES

### Logs

```bash
# Logs PM2
pm2 logs pioneer-backend

# Logs Nginx access
sudo tail -f /var/log/nginx/access.log

# Logs Nginx error
sudo tail -f /var/log/nginx/error.log

# Logs système
sudo journalctl -u nginx -f
```

### PM2

```bash
# Restart backend
pm2 restart pioneer-backend

# Stop backend
pm2 stop pioneer-backend

# Monitoring
pm2 monit
```

### Nginx

```bash
# Test config
sudo nginx -t

# Reload
sudo systemctl reload nginx

# Restart
sudo systemctl restart nginx
```

---

## 💰 COÛTS MENSUELS

```
Hetzner CX11:          €4.51
Domaine (.com):        ~€1.00
MongoDB Atlas M0:      €0 (gratuit)
SSL Let's Encrypt:     €0 (gratuit)
Cloudflare (optionnel): €0 (gratuit)
─────────────────────────────
TOTAL:                 ~€5.50 / mois
```

**Avec Backups** : +€0.90 = **€6.40 / mois**

---

## 🚀 NEXT LEVEL

### Scaling (si croissance)

**Upgrade vers CX21** :

- 2 vCPU / 4 GB RAM
- Prix : €9.01/mois
- Capacité : ~500-1000 utilisateurs simultanés

### Monitoring avancé

- **Grafana** + **Prometheus** (gratuit, self-hosted)
- **New Relic** (payant, complet)
- **DataDog** (payant, premium)

### CDN

**Cloudflare** (gratuit) :

- Cache assets statiques
- DDoS protection
- SSL universel
- Analytics

---

## ✅ FÉLICITATIONS !

**Pioneer Academy est en production sur Hetzner !** 🎉

**Vous avez maintenant** :

- ✅ Application accessible 24/7
- ✅ SSL/TLS sécurisé
- ✅ MongoDB connecté et protégé
- ✅ Backups automatiques
- ✅ Monitoring actif
- ✅ Infrastructure scalable

**Profitez du meilleur rapport qualité/prix du marché avec Hetzner !** 🇩🇪🚀

---

**📅 Guide créé le** : 28 Décembre 2025  
**🎯 Pour** : Pioneer Academy - Déploiement Production Hetzner  
**👤 Par** : Antigravity (Google Deepmind)
