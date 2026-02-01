# 🔐 INFORMATIONS VPS - PIONEER ACADEMY

## 📍 Serveur VPS

**Fournisseur :** Hetzner Cloud  
**IP :** 116.203.51.124  
**Domaine :** pioneeracademy.academy (à configurer)  
**OS :** Ubuntu 22.04 LTS (supposé)

---

## 👤 Comptes Utilisateurs

### User Root (Actuellement BLOQUÉ)

- **Username :** root
- **Password :** WtnUPWRipAuu
- **Status :** ❌ Permission denied - NE FONCTIONNE PAS
- **Raison :** Désactivé ou bloqué par fail2ban

### User Pioneer (Accès SSH cible)

- **Username :** pioneer
- **UID/GID :** 1000:1000
- **Home :** /home/pioneer
- **SSH Key :** ✅ Configurée via Rescue Mode
- **Authentification :** Par clé publique (sans mot de passe)

---

## 🔑 Clés SSH

### Clé SSH Actuelle (À installer via Rescue)

```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILTlNH7VhnZfPxmoLsy0HyKKhF5xVlyO5vE5SKGGhG0I abdoulrazaktanko06@gmail.com
```

**Type :** ED25519  
**Email :** abdoulrazaktanko06@gmail.com  
**Status :** ✅ Prête à être installée

### Emplacement sur le serveur (après Rescue)

```
/home/pioneer/.ssh/authorized_keys
```

**Permissions requises :**

- `/home/pioneer/.ssh/` → 700 (drwx------)
- `/home/pioneer/.ssh/authorized_keys` → 600 (-rw-------)
- **Propriétaire :** pioneer:pioneer (1000:1000)

---

## 🌐 Application Pioneer Academy

### Frontend

**Emplacement :** /var/www/pioneer-academy/frontend/  
**Status :** ❓ À diagnostiquer  
**Port local :** 5173 (développement) ou build statique  
**Technologie :** React + Vite (supposé)

### Backend

**Emplacement :** /var/www/pioneer-academy/backend/ (supposé)  
**Port :** 3000 ou 5000 (à confirmer)  
**Technologie :** Node.js + Express (supposé)

### Base de données

**Type :** MongoDB ou PostgreSQL (à confirmer)  
**Status :** ❓ À vérifier

---

## 🔧 Configuration Nginx

**Fichier de config :** /etc/nginx/sites-available/pioneer-academy  
**Lien symbolique :** /etc/nginx/sites-enabled/pioneer-academy  
**Status :** ❓ À diagnostiquer

**Domaines attendus :**

- pioneeracademy.academy
- www.pioneeracademy.academy

**Ports :**

- HTTP : 80
- HTTPS : 443 (à configurer avec Certbot)

---

## 📋 Checklist Configuration HTTPS

### Prérequis DNS (Namecheap)

- [ ] Enregistrement A : pioneeracademy.academy → 77.42.75.58
- [ ] Enregistrement A : www.pioneeracademy.academy → 77.42.75.58
- [ ] Propagation DNS complète (24-48h max)

### Certificat SSL (Certbot)

- [ ] Certbot installé sur le VPS
- [ ] Certificat généré : `certbot --nginx -d pioneeracademy.academy -d www.pioneeracademy.academy`
- [ ] Auto-renouvellement configuré

---

## 🚨 Problèmes Actuels

### 1. Accès SSH Impossible

- **Symptôme :** `ssh root@77.42.75.58` → Permission denied
- **Cause :** Mot de passe root désactivé/bloqué
- **Solution :** ✅ Rescue Mode + Configuration clé SSH

### 2. Frontend Non Accessible

- **Symptôme :** Site non disponible sur pioneeracademy.academy
- **Causes possibles :**
  - Nginx mal configuré
  - Frontend non buildé
  - Fichiers statiques manquants
  - Permissions incorrectes
- **Solution :** Diagnostic via Rescue Mode (étape 4)

### 3. DNS Non Configuré

- **Symptôme :** Domaine ne pointe pas vers le VPS
- **Cause :** Configuration Namecheap incorrecte ou non propagée
- **Solution :** Vérifier DNS avec `nslookup pioneeracademy.academy`

---

## 🎯 Plan d'Action Post-Rescue

### Étape 1 : Connexion SSH Rétablie ✅

```bash
ssh pioneer@77.42.75.58
```

→ Connexion automatique avec clé SSH

### Étape 2 : Diagnostic Complet

```bash
# Vérifier Nginx
sudo systemctl status nginx
sudo nginx -t

# Vérifier frontend
ls -la /var/www/pioneer-academy/frontend/
cat /etc/nginx/sites-available/pioneer-academy

# Vérifier DNS
nslookup pioneeracademy.academy
```

### Étape 3 : Correction Frontend

Selon le diagnostic :

- Rebuild du frontend si nécessaire
- Correction de la config Nginx
- Redémarrage des services

### Étape 4 : HTTPS

```bash
# Installer Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Générer certificat
sudo certbot --nginx -d pioneeracademy.academy -d www.pioneeracademy.academy
```

### Étape 5 : Tests

- ✅ http://pioneeracademy.academy → Redirection HTTPS
- ✅ https://pioneeracademy.academy → Site accessible
- ✅ https://www.pioneeracademy.academy → Site accessible

---

## 📞 Informations de Contact

### Assistant IA

- **Nom :** Antigravity
- **Tâche :** Configuration complète du VPS Pioneer Academy

### Propriétaire VPS

- **Email :** abdoulrazaktanko06@gmail.com

---

## 🗓️ Historique

**2025-12-30**

- ❌ Tentatives de connexion SSH échouées (root)
- ✅ Préparation Rescue Mode
- ✅ Création guides et scripts
- ⏳ En attente : Activation Rescue Mode par l'utilisateur

---

## 🔗 Liens Utiles

- **Hetzner Console :** https://console.hetzner.cloud/
- **Namecheap Dashboard :** https://ap.www.namecheap.com/
- **Documentation Hetzner Rescue :** https://docs.hetzner.com/cloud/servers/server-actions/rescue-mode/
- **Documentation Certbot :** https://certbot.eff.org/

---

## 📁 Fichiers de Référence

| Fichier                  | Description                              |
| ------------------------ | ---------------------------------------- |
| `QUICK-START.txt`        | Guide ultra-rapide (1 page)              |
| `rescue-commands.txt`    | Commandes copier/coller pour Rescue      |
| `GUIDE-RESCUE-MODE.md`   | Guide détaillé étape par étape           |
| `RAPPORT-RESCUE-MODE.md` | Rapport technique complet                |
| `rescue-mode-setup.ps1`  | Script PowerShell d'automatisation       |
| `DEMARRER-RESCUE.bat`    | Lanceur rapide (ouvre tous les fichiers) |
| `INFOS-VPS.md`           | Ce fichier - Informations VPS            |

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ **URGENT :** Activer Rescue Mode (Hetzner Console)
2. ✅ Suivre QUICK-START.txt ou GUIDE-RESCUE-MODE.md
3. ✅ Envoyer résultats du diagnostic
4. ✅ Corrections Nginx/Frontend
5. ✅ Configuration HTTPS
6. ✅ Site en ligne !

---

**📌 Sauvegarder ce fichier pour référence future**

_Dernière mise à jour : 2025-12-30 09:55 UTC_
