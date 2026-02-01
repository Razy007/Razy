# ⚡ QUICK START - HETZNER VPS DEPLOYMENT

## 🎯 TON CHOIX : HETZNER ✅

**Pourquoi c'est le bon choix** :

- 💰 **€4.51/mois** (le moins cher)
- 🚀 **Performance** : Datacenters 🇩🇪
- 🔒 **IP fixe** incluse
- ⚡ **20 TB** trafic gratuit

---

## 🚀 PROCHAINES ÉTAPES IMMÉDIATES

### 📍 MAINTENANT (5 min)

**1. Créer compte Hetzner**

👉 https://console.hetzner.cloud/

**2. Créer serveur**

```
Location:     Nuremberg (Allemagne)
Image:        Ubuntu 22.04 LTS
Type:         CX11 (2GB RAM)
Prix:         €4.51/mois
Nom:          pioneer-academy-prod
```

**3. Générer clé SSH (PowerShell Windows)**

```powershell
ssh-keygen -t ed25519 -C "pioneer-vps"
cat ~\.ssh\id_ed25519.pub
```

→ **Copiez la clé** et collez dans Hetzner

**4. Créer le serveur**

→ **Notez l'IP publique** : `95.216.xxx.xxx`

---

### 📍 APRÈS CRÉATION (10 min)

**5. Première connexion**

```powershell
ssh root@95.216.xxx.xxx
```

**6. Setup rapide**

```bash
# Mise à jour
apt update && apt upgrade -y

# Créer utilisateur
adduser pioneer
usermod -aG sudo pioneer

# Copier clé SSH
mkdir -p /home/pioneer/.ssh
cp /root/.ssh/authorized_keys /home/pioneer/.ssh/
chown -R pioneer:pioneer /home/pioneer/.ssh
```

**7. Se reconnecter avec nouveau user**

```powershell
ssh pioneer@95.216.xxx.xxx
```

---

### 📍 INSTALLATION STACK (15 min)

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx

# PM2
sudo npm install -g pm2

# Certbot (SSL)
sudo apt install -y certbot python3-certbot-nginx
```

---

### 📍 DÉPLOIEMENT APP (20 min)

**Depuis Windows, compresser et upload** :

```powershell
cd C:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app

# Compresser backend
tar -czf backend.tar.gz backend

# Upload
scp backend.tar.gz pioneer@95.216.xxx.xxx:~
```

**Sur VPS** :

```bash
# Décompresser
tar -xzf backend.tar.gz
mkdir -p /var/www/pioneer-academy
mv backend /var/www/pioneer-academy/

# Installer deps
cd /var/www/pioneer-academy/backend
npm ci --production

# Créer .env
nano .env
```

**Coller** :

```env
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pioneer
JWT_SECRET=GENERER_SECRET_32_CARACTERES
ALLOWED_ORIGINS=http://IP_VPS
```

**Générer secrets** :

```bash
openssl rand -base64 32
# Copiez dans .env
```

**Start PM2** :

```bash
pm2 start npm --name "pioneer-backend" -- start
pm2 startup
pm2 save
```

---

### 📍 NGINX + FRONTEND (10 min)

**Créer config Nginx** :

```bash
sudo nano /etc/nginx/sites-available/pioneer-academy
```

**Coller** :

```nginx
server {
    listen 80;
    server_name _;

    root /var/www/pioneer-academy/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Activer** :

```bash
sudo ln -s /etc/nginx/sites-available/pioneer-academy /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

### 📍 MONGODB ATLAS (5 min)

**Important** :

1. Allez sur MongoDB Atlas
2. Network Access → Add IP
3. **Ajoutez IP VPS uniquement** : `95.216.xxx.xxx/32`
4. ❌ **Supprimez** `0.0.0.0/0`

---

### 📍 TEST FINAL

**Ouvrez navigateur** : `http://95.216.xxx.xxx`

✅ **Pioneer Academy doit s'afficher !**

---

## 📊 TEMPS TOTAL

| Étape              | Temps        |
| ------------------ | ------------ |
| Création Hetzner   | 5 min        |
| Setup sécurité     | 10 min       |
| Installation stack | 15 min       |
| Déploiement        | 20 min       |
| Configuration      | 10 min       |
| **TOTAL**          | **~1 heure** |

---

## 📄 GUIDE COMPLET

👉 **docs/HETZNER-VPS-DEPLOYMENT-GUIDE.md**

**Contient** :

- ✅ Instructions détaillées
- ✅ Sécurisation complète
- ✅ SSL/HTTPS setup
- ✅ Troubleshooting
- ✅ Monitoring
- ✅ Backups

---

## 🆘 BLOQUÉ ?

**Problème MongoDB** :

```bash
pm2 logs pioneer-backend
# Vérifier erreur connexion
```

**Problème Nginx** :

```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

**Besoin d'aide** :
→ Consultez section Troubleshooting du guide complet

---

## 🎉 APRÈS DÉPLOIEMENT

**Vous aurez** :

- ✅ App en ligne 24/7
- ✅ IP fixe stable
- ✅ MongoDB sécurisé
- ✅ €4.51/mois (imbattable)

**Next steps** :

- Ajouter domaine
- Activer SSL
- Configurer monitoring

---

**🚀 READY TO DEPLOY !**

**Commencez maintenant** : https://console.hetzner.cloud/
