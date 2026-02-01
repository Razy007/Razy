# 🚀 QUICK START - PIONEER ACADEMY BACKEND

## ⚡ Démarrage en 3 Minutes

### 1️⃣ Installer MongoDB

**Option A: MongoDB Local (Recommandé pour développement)**

```powershell
# Télécharger: https://www.mongodb.com/try/download/community
# Installer et démarrer:
mongod
```

**Option B: MongoDB Atlas (Cloud - Gratuit)**

1. Créer un compte sur https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit
3. Obtenir l'URI de connexion
4. Mettre à jour `.env` avec l'URI

### 2️⃣ Démarrer le Backend

```powershell
# Aller dans le dossier backend
cd backend

# Démarrer en mode développement
npm run dev
```

### 3️⃣ Vérifier que ça fonctionne

Ouvrir http://localhost:3001/health dans votre navigateur.

**Réponse attendue:**

```json
{
  "success": true,
  "message": "Pi Academy Backend API is running",
  "version": "2.0.0",
  "database": {
    "connected": true
  }
}
```

---

## 🧪 Tester l'API

### Test 1: Login Guest

```powershell
curl -X POST http://localhost:3001/api/auth/guest
```

**Réponse:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "username": "Guest_abc123",
      "role": "guest",
      "piBalance": 10,
      "energyBalance": 100
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "🎮 Guest Mode Activated"
}
```

**Copier le token** pour les prochains tests.

### Test 2: Récupérer le Profil

```powershell
# Remplacer <TOKEN> par le token obtenu
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3001/api/auth/me
```

### Test 3: Essayer de Créer un Stake (devrait échouer pour Guest)

```powershell
curl -X POST \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"amount": 10, "period": 30}' \
  http://localhost:3001/api/staking
```

**Réponse attendue (erreur 403):**

```json
{
  "success": false,
  "error": "🔒 Guest Mode Active. Please sign in with a Pi Network account to access this feature.",
  "code": "GUEST_RESTRICTED"
}
```

✅ **C'est EXACTEMENT ce qu'on veut !** Le backend bloque correctement les guests.

---

## 🔧 Configuration Minimale

Le fichier `.env` existe déjà avec des valeurs par défaut qui fonctionnent.

**Pour MongoDB local, rien à changer !**

**Pour MongoDB Atlas:**

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pi-academy
```

---

## 📊 Endpoints Disponibles

### Authentification

- `POST /api/auth/guest` - Mode invité
- `POST /api/auth/pi` - Login Pi Network
- `GET /api/auth/me` - Profil utilisateur (Auth requis)

### Staking (🔒 Requiert Auth + KYC + Non-Guest)

- `POST /api/staking` - Créer un stake
- `GET /api/staking` - Liste des stakes
- `GET /api/staking/stats` - Statistiques
- `POST /api/staking/:id/complete` - Compléter un stake
- `POST /api/staking/:id/cancel` - Annuler un stake

### Utilitaires

- `GET /health` - Health check
- `GET /` - Info API

---

## 🐛 Problèmes Courants

### "Failed to connect to MongoDB"

**Solution:**

```powershell
# Vérifier que MongoDB est démarré
mongod

# Ou vérifier l'URI dans .env
```

### "Port 3001 already in use"

**Solution:**

```powershell
# Changer le port dans .env
PORT=3002
```

### "Invalid environment variables"

**Solution:**

```powershell
# Vérifier que .env existe
ls .env

# Si non, copier le template
copy .env.development .env
```

---

## 📚 Documentation Complète

- **Guide complet:** `BACKEND_IMPLEMENTATION_GUIDE.md`
- **Récapitulatif:** `BACKEND_IMPLEMENTATION_COMPLETE.md`
- **Audit original:** `BACKEND_AUDIT_REPORT.md`

---

## ✅ Checklist Rapide

- [ ] MongoDB installé et démarré
- [ ] `cd backend`
- [ ] `npm run dev`
- [ ] Ouvrir http://localhost:3001/health
- [ ] Tester `POST /api/auth/guest`
- [ ] Vérifier que le staking est bloqué pour guests

---

## 🎯 Prochaine Étape

Une fois le backend démarré, intégrer le frontend :

1. Créer `src/services/api.service.ts`
2. Remplacer les opérations locales par des appels API
3. Ajouter le modal Guest Mode
4. Profiter d'une application 100% sécurisée ! 🎉

---

**Besoin d'aide ?** Consultez `BACKEND_IMPLEMENTATION_GUIDE.md` section "Troubleshooting"
