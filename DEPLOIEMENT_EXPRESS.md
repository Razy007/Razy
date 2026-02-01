# 🚀 DÉPLOIEMENT EXPRESS - ACADEMY OF PI

## ⚠️ PRÉREQUIS

Avant de commencer, assurez-vous d'avoir :
- ✅ Accès SSH à votre serveur pioneeracademy.academy
- ✅ Credentials PostgreSQL (user/password/database)
- ✅ Accès au répertoire `/var/www/pi-academy` (ou équivalent)

---

## 🎯 DÉPLOIEMENT EN 3 ÉTAPES (15 MINUTES)

### ÉTAPE 1 : MIGRATION SQL (2 minutes)

**Fichier à Appliquer** : `backend/migrations/add_completed_layers.sql`

#### Option A : Via SSH

```bash
# 1. Connectez-vous à votre serveur
ssh votre_user@pioneeracademy.academy

# 2. Allez dans le répertoire backend
cd /var/www/pi-academy/backend

# 3. Appliquez la migration
psql -U postgres -d pi_academy -f migrations/add_completed_layers.sql

# 4. Vérifiez
psql -U postgres -d pi_academy -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'completed_layers';"

# Résultat attendu:
#  column_name      | data_type 
# ------------------+-----------
#  completed_layers | jsonb
```

#### Option B : Depuis Windows (Local)

```powershell
# Dans PowerShell (depuis votre machine locale)
cd c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app\backend

# Upload migration vers serveur
scp migrations/add_completed_layers.sql votre_user@pioneeracademy.academy:/var/www/pi-academy/backend/migrations/

# SSH + Appliquer
ssh votre_user@pioneeracademy.academy "psql -U postgres -d pi_academy -f /var/www/pi-academy/backend/migrations/add_completed_layers.sql"
```

---

### ÉTAPE 2 : DÉPLOYER BOUTIQUE AMÉLIORÉE (5 minutes)

#### 2.1 Modifier shopProducts.ts Localement

**Fichier** : `frontend/src/data/shopProducts.ts`

**Action** :
1. Ouvrir le fichier dans VS Code
2. Copier TOUT le code de `IMPLEMENTATION_BOUTIQUE_AMELIOREE.md` (section "💻 CODE COMPLET")
3. Coller pour remplacer le contenu actuel
4. Sauvegarder (Ctrl+S)

#### 2.2 Rebuild Frontend

```powershell
cd c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app\frontend

# Build production
npm run build

# Vérifier que dist/ est créé
dir dist
```

#### 2.3 Upload vers Serveur

```powershell
# Backup ancien dist
ssh votre_user@pioneeracademy.academy "mv /var/www/pi-academy/frontend/dist /var/www/pi-academy/frontend/dist.backup_$(date +%Y%m%d)"

# Upload nouveau dist
scp -r dist/* votre_user@pioneeracademy.academy:/var/www/pi-academy/frontend/dist/
```

---

### ÉTAPE 3 : DÉPLOYER BACKEND (8 minutes)

#### 3.1 Rebuild Backend Localement

```powershell
cd c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app\backend

# Build
npm run build

# Vérifier dist/
dir dist
```

#### 3.2 Upload Backend

```powershell
# Backup
ssh votre_user@pioneeracademy.academy "cp -r /var/www/pi-academy/backend/dist /var/www/pi-academy/backend/dist.backup_$(date +%Y%m%d)"

# Upload
scp -r dist/* votre_user@pioneeracademy.academy:/var/www/pi-academy/backend/dist/
```

#### 3.3 Redémarrer PM2

```bash
# Via SSH
ssh votre_user@pioneeracademy.academy

# Redémarrer backend
pm2 restart pi-academy-api

# Vérifier logs
pm2 logs pi-academy-api --lines 50
```

---

## ✅ VÉRIFICATION (2 minutes)

### Test 1 : Boutique

```
1. Ouvrir Pi Browser
2. Aller sur https://pioneeracademy.academy/shop
3. Vérifier nouveaux prix:
   - Recharge Rapide : 0.0005 π (était 0.0001 π) ✅
   - Pack Énergie : 0.001 π (était 0.0002 π) ✅
   - Focus XP 1h : 0.001 π (nouveau) ✅
```

### Test 2 : Skills Analysis

```
1. Aller sur https://pioneeracademy.academy
2. Compléter un module Discovery
3. Vérifier: Toast "+50 XP gagnés !" ✅
4. Naviguer vers "Analyse des Compétences" (dans sidebar)
5. Vérifier: Score > 0% visible ✅
```

### Test 3 : API

```
1. Ouvrir Console Browser (F12)
2. Vérifier: Aucune erreur 404 /api/payments/history
```

---

## 🔧 SI PROBLÈMES

### Erreur : "column completed_layers does not exist"

**Solution** : Migration SQL non appliquée

```bash
ssh votre_user@pioneeracademy.academy
psql -U postgres -d pi_academy -f /var/www/pi-academy/backend/migrations/add_completed_layers.sql
pm2 restart pi-academy-api
```

### Erreur : Boutique affiche toujours anciens prix

**Solutions** :

1. **Vider cache navigateur** (Ctrl+Shift+R)
2. **Vérifier build** :
   ```powershell
   cd frontend
   npm run build
   # Uploader à nouveau dist/
   ```
3. **Vérifier fichier serveur** :
   ```bash
   ssh votre_user@pioneeracademy.academy
   cat /var/www/pi-academy/frontend/dist/assets/*.js | grep "0.0005"
   # Doit afficher la ligne avec 0.0005 π
   ```

### Backend ne redémarre pas

```bash
ssh votre_user@pioneeracademy.academy

# Vérifier statut
pm2 status

# Si erreur, voir logs
pm2 logs pi-academy-api --err

# Restart forcé
pm2 delete pi-academy-api
pm2 start ecosystem.config.js
```

---

## 📊 RÉSULTAT ATTENDU

### AVANT (Actuellement en production)

```
Boutique:
  - Pack Énergie Flash: 0.0001 π
  - Booster XP Turbo: 0.0002 π
  - Skip Cooldown: 0.0003 π

Skills Analysis: ❌ Absente
Erreur 404: /api/payments/history
```

### APRÈS (Déploiement)

```
Boutique:
  - Recharge Rapide: 0.0005 π (+400%)
  - Pack Énergie: 0.001 π (+400%)
  - Focus XP 1h: 0.001 π (nouveau)
  - Badge Bronze: 0.001 π (nouveau)

Skills Analysis: ✅ Fonctionnelle
Erreur 404: ✅ Corrigée
Revenus: +500% boutique
```

---

## 🎯 PROCHAINE ÉTAPE (Optionnelle - Semaine Prochaine)

Après validation de la boutique améliorée, déployer :

**Système d'Abonnement Premium** (Guide complet dans `GUIDE_ABONNEMENT_PREMIUM.md`)
- Migration SQL `add_subscription_fields.sql`
- Backend : `SubscriptionService.ts`, `SubscriptionController.ts`
- Frontend : `SubscriptionPage.tsx`
- Revenus additionnels : +150% globaux

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] Migration SQL `completed_layers` appliquée
- [ ] shopProducts.ts modifié localement
- [ ] Frontend rebuild (`npm run build`)
- [ ] Frontend dist/ uploadé
- [ ] Backend rebuild (`npm run build`)
- [ ] Backend dist/ uploadé
- [ ] PM2 redémarré
- [ ] Tests boutique validés
- [ ] Tests Skills Analysis validés
- [ ] Aucune erreur console

---

## 🚀 SCRIPT AUTOMATIQUE (AVANCÉ)

Si vous préférez un script automatique :

**Fichier** : `deploy_quick.ps1`

```powershell
# CONFIG
$SERVER = "votre_user@pioneeracademy.academy"
$REMOTE_PATH = "/var/www/pi-academy"

Write-Host "🚀 DÉPLOIEMENT ACADEMY OF PI" -ForegroundColor Cyan

# 1. Migration SQL
Write-Host "`n1️⃣  Application migration SQL..." -ForegroundColor Yellow
ssh $SERVER "psql -U postgres -d pi_academy -f $REMOTE_PATH/backend/migrations/add_completed_layers.sql"

# 2. Build Frontend
Write-Host "`n2️⃣  Build frontend..." -ForegroundColor Yellow
cd frontend
npm run build

# 3. Upload Frontend
Write-Host "`n3️⃣  Upload frontend..." -ForegroundColor Yellow
scp -r dist/* ${SERVER}:${REMOTE_PATH}/frontend/dist/

# 4. Build Backend
Write-Host "`n4️⃣  Build backend..." -ForegroundColor Yellow
cd ../backend
npm run build

# 5. Upload Backend
Write-Host "`n5️⃣  Upload backend..." -ForegroundColor Yellow
scp -r dist/* ${SERVER}:${REMOTE_PATH}/backend/dist/

# 6. Restart PM2
Write-Host "`n6️⃣  Restart PM2..." -ForegroundColor Yellow
ssh $SERVER "pm2 restart pi-academy-api"

Write-Host "`n✅ DÉPLOIEMENT TERMINÉ!" -ForegroundColor Green
Write-Host "Testez sur: https://pioneeracademy.academy/shop" -ForegroundColor Cyan
```

**Usage** :
```powershell
cd c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app
.\deploy_quick.ps1
```

---

## 📞 SUPPORT

**Problème ?** Vérifiez :
1. Logs PM2 : `pm2 logs pi-academy-api`
2. Logs Nginx : `tail -f /var/log/nginx/error.log`
3. Base de données : `psql -U postgres -d pi_academy -c "\dt"`

**Date** : 2026-01-15  
**Version** : Déploiement Express v1.0  
**Durée Estimée** : 15 minutes
