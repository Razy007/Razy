# 🚀 PIONEER ACADEMY - BACKEND SÉCURISÉ

## Guide d'Implémentation & Déploiement

**Version:** 2.0.0  
**Date:** 2025-12-26  
**Statut:** ✅ Backend Sécurisé Implémenté

---

## 📋 TABLE DES MATIÈRES

1. [Architecture](#architecture)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Démarrage](#démarrage)
5. [Sécurité](#sécurité)
6. [API Documentation](#api-documentation)
7. [Frontend Integration](#frontend-integration)
8. [Déploiement Production](#déploiement-production)
9. [Tests](#tests)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ ARCHITECTURE

### Stack Technique

- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT + Pi Network SDK
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting

### Structure du Projet

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts              # Configuration environnement validée
│   │   └── database.ts         # Gestionnaire MongoDB
│   ├── middlewares/
│   │   └── auth.middleware.ts  # Auth JWT + KYC + Guest blocking
│   ├── models/
│   │   ├── User.model.ts       # Modèle utilisateur
│   │   ├── Staking.model.ts    # Modèle staking
│   │   └── Transaction.model.ts # Modèle transactions
│   ├── routes/
│   │   ├── auth.routes.ts      # Routes authentification
│   │   └── staking.routes.ts   # Routes staking (sécurisées)
│   ├── services/
│   │   ├── auth.service.ts     # Service authentification Pi
│   │   └── staking.service.ts  # Service staking (validation serveur)
│   ├── types/
│   │   └── index.ts            # Types TypeScript
│   └── server.ts               # Point d'entrée
├── .env                        # Variables d'environnement (à créer)
├── .env.development            # Template développement
├── package.json
└── tsconfig.json
```

---

## 📦 INSTALLATION

### Prérequis

- Node.js >= 18.x
- MongoDB >= 6.x (local ou Atlas)
- npm ou yarn

### Étapes

1. **Installer les dépendances**

```bash
cd backend
npm install
```

2. **Créer le fichier `.env`**

```bash
# Copier le template
cp .env.development .env

# Éditer .env avec vos vraies valeurs
```

3. **Compiler TypeScript**

```bash
npm run build
```

---

## ⚙️ CONFIGURATION

### Fichier `.env` (OBLIGATOIRE)

```env
# Server
PORT=3001
NODE_ENV=development

# Pi Network
PI_API_KEY=your_actual_pi_api_key
PI_SANDBOX=true

# Database
MONGODB_URI=mongodb://localhost:27017/pi-academy

# Security (⚠️ CHANGER EN PRODUCTION)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Variables Critiques

| Variable       | Description               | Obligatoire | Exemple                                                          |
| -------------- | ------------------------- | ----------- | ---------------------------------------------------------------- |
| `MONGODB_URI`  | URI MongoDB               | ✅          | `mongodb://localhost:27017/pi-academy`                           |
| `JWT_SECRET`   | Secret JWT (min 32 chars) | ✅          | `your_secret_here_change_in_prod`                                |
| `PI_API_KEY`   | Clé API Pi Network        | ✅          | Obtenir sur [Pi Developer Portal](https://developers.minepi.com) |
| `FRONTEND_URL` | URL frontend (CORS)       | ✅          | `http://localhost:5173`                                          |

---

## 🚀 DÉMARRAGE

### Mode Développement

```bash
npm run dev
```

✅ Hot-reload activé avec `nodemon` + `ts-node`

### Mode Production

```bash
# 1. Build
npm run build

# 2. Start
npm start
```

### Vérification

```bash
# Health check
curl http://localhost:3001/health

# Réponse attendue:
{
  "success": true,
  "message": "Pi Academy Backend API is running",
  "version": "2.0.0",
  "database": { "connected": true }
}
```

---

## 🔒 SÉCURITÉ

### Middlewares Implémentés

#### 1. `requireAuth`

- ✅ Vérifie le JWT token
- ✅ Attache `req.user` avec info utilisateur
- ❌ Bloque si token invalide/expiré

#### 2. `requireKyc`

- ✅ Vérifie KYC status === 'verified'
- ❌ Bloque si KYC non vérifié
- 📝 Message: "🔒 KYC verification required"

#### 3. `requirePioneer` / `blockGuest`

- ✅ Vérifie role !== 'guest'
- ❌ Bloque tous les guests
- 📝 Message: "🔒 Guest Mode Active. Please sign in"

### Protection des Routes Critiques

| Route                            | Middlewares                                 | Protection  |
| -------------------------------- | ------------------------------------------- | ----------- |
| `POST /api/staking`              | `requireAuth` + `requireKyc` + `blockGuest` | 🔴 MAXIMALE |
| `POST /api/staking/:id/complete` | `requireAuth` + `requireKyc` + `blockGuest` | 🔴 MAXIMALE |
| `GET /api/staking`               | `requireAuth`                               | 🟡 STANDARD |
| `POST /api/auth/pi`              | Aucun                                       | 🟢 PUBLIC   |

### Validation Serveur

✅ **Toutes les opérations critiques sont validées côté serveur :**

```typescript
// ❌ AVANT (client-side uniquement)
if (amount > balance) {
  alert("Insufficient balance"); // Contournable
}

// ✅ MAINTENANT (server-side)
if (user.piBalance < amount) {
  throw new ValidationError("Insufficient balance"); // Incontournable
}
```

---

## 📡 API DOCUMENTATION

### Authentification

#### `POST /api/auth/pi`

Authentification avec Pi Network

**Request:**

```json
{
  "uid": "pi_user_id",
  "username": "pioneer123",
  "accessToken": "pi_access_token"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here",
    "isNewUser": false
  },
  "message": "Welcome back! 👋"
}
```

#### `POST /api/auth/guest`

Mode invité (démo)

**Response:**

```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt_token_here"
  },
  "message": "🎮 Guest Mode Activated"
}
```

#### `GET /api/auth/me`

Récupérer profil utilisateur

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "user_id",
    "username": "pioneer123",
    "role": "pioneer_kyc",
    "kycStatus": "verified",
    "piBalance": 150.5,
    "energyBalance": 80,
    "level": 5,
    "xp": 450
  }
}
```

### Staking

#### `POST /api/staking`

Créer un stake

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request:**

```json
{
  "amount": 100,
  "period": 90
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "staking": {
      "id": "stake_id",
      "amount": 100,
      "period": 90,
      "apy": 8,
      "endDate": "2025-03-26T..."
    },
    "currentReward": 0,
    "user": {
      "piBalance": 50,
      "stakingBalance": 100
    }
  },
  "message": "✅ Successfully staked 100 Pi for 90 days!"
}
```

#### `GET /api/staking`

Récupérer stakes actifs

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "stake_id",
      "amount": 100,
      "period": 90,
      "apy": 8,
      "currentReward": 2.19,
      "isMatured": false,
      "startDate": "2025-12-26T...",
      "endDate": "2026-03-26T..."
    }
  ]
}
```

#### `POST /api/staking/:stakingId/complete`

Compléter un stake mature

**Response:**

```json
{
  "success": true,
  "data": {
    "principal": 100,
    "reward": 8,
    "total": 108,
    "user": {
      "piBalance": 158,
      "stakingBalance": 0
    }
  },
  "message": "🎉 Staking completed! You earned 8 Pi in rewards!"
}
```

### Codes d'Erreur

| Code                   | Statut | Description                        |
| ---------------------- | ------ | ---------------------------------- |
| `AUTHENTICATION_ERROR` | 401    | Token invalide/expiré              |
| `KYC_REQUIRED`         | 403    | KYC non vérifié                    |
| `GUEST_RESTRICTED`     | 403    | Fonctionnalité bloquée pour guests |
| `INSUFFICIENT_BALANCE` | 400    | Balance insuffisante               |
| `VALIDATION_ERROR`     | 400    | Données invalides                  |
| `NOT_FOUND`            | 404    | Ressource introuvable              |
| `RATE_LIMIT_EXCEEDED`  | 429    | Trop de requêtes                   |

---

## 🔗 FRONTEND INTEGRATION

### Service API Frontend

Créer `src/services/api.service.ts` :

```typescript
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Axios instance avec intercepteurs
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur: Ajouter JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur: Gestion erreurs
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré - logout
      localStorage.removeItem("authToken");
      window.location.href = "/login";
    }
    throw error.response?.data || error;
  }
);

// API Methods
export const authAPI = {
  loginWithPi: (payload: any) => apiClient.post("/auth/pi", payload),
  loginAsGuest: () => apiClient.post("/auth/guest"),
  getMe: () => apiClient.get("/auth/me"),
  logout: () => apiClient.post("/auth/logout"),
};

export const stakingAPI = {
  createStake: (data: { amount: number; period: number }) =>
    apiClient.post("/staking", data),
  getStakes: () => apiClient.get("/staking"),
  getStats: () => apiClient.get("/staking/stats"),
  completeStake: (stakingId: string) =>
    apiClient.post(`/staking/${stakingId}/complete`),
  cancelStake: (stakingId: string) =>
    apiClient.post(`/staking/${stakingId}/cancel`),
};

export default apiClient;
```

### Exemple d'Utilisation

```typescript
import { stakingAPI } from "./services/api.service";

// Créer un stake
const handleStaking = async (amount: number, period: number) => {
  try {
    const response = await stakingAPI.createStake({ amount, period });

    if (response.success) {
      alert(response.message);
      // Mettre à jour l'UI
    }
  } catch (error: any) {
    if (error.code === "KYC_REQUIRED") {
      alert("🔒 KYC verification required");
    } else if (error.code === "GUEST_RESTRICTED") {
      alert("🔒 Please sign in with Pi Network");
    } else {
      alert(error.error || "Operation failed");
    }
  }
};
```

---

## 🌐 DÉPLOIEMENT PRODUCTION

### Checklist Pré-Déploiement

- [ ] ✅ Générer un JWT_SECRET fort (min 64 caractères)
- [ ] ✅ Configurer MongoDB Atlas (ou serveur MongoDB dédié)
- [ ] ✅ Obtenir une vraie clé API Pi Network
- [ ] ✅ Configurer NODE_ENV=production
- [ ] ✅ Activer HTTPS (obligatoire pour Pi Network)
- [ ] ✅ Configurer CORS avec l'URL frontend de production
- [ ] ✅ Tester toutes les routes critiques
- [ ] ✅ Configurer monitoring (logs, erreurs)

### Variables d'Environnement Production

```env
PORT=3001
NODE_ENV=production

PI_API_KEY=<votre_vraie_clé_pi>
PI_SANDBOX=false

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/pi-academy

JWT_SECRET=<générer_avec_openssl_rand_-base64_64>
JWT_EXPIRES_IN=7d

FRONTEND_URL=https://votre-domaine.com

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Déploiement sur Heroku

```bash
# 1. Login
heroku login

# 2. Créer app
heroku create pi-academy-backend

# 3. Ajouter MongoDB
heroku addons:create mongolab:sandbox

# 4. Configurer variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<votre_secret>
heroku config:set PI_API_KEY=<votre_clé>
heroku config:set FRONTEND_URL=<votre_frontend>

# 5. Déployer
git push heroku main

# 6. Vérifier
heroku logs --tail
```

### Déploiement sur Railway/Render

1. Connecter le repo GitHub
2. Configurer les variables d'environnement
3. Build command: `npm run build`
4. Start command: `npm start`
5. Déployer

---

## 🧪 TESTS

### Test Manuel

```bash
# 1. Health check
curl http://localhost:3001/health

# 2. Login Guest
curl -X POST http://localhost:3001/api/auth/guest

# 3. Get profile (remplacer <TOKEN>)
curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:3001/api/auth/me

# 4. Create stake (KYC required - devrait échouer pour guest)
curl -X POST \
     -H "Authorization: Bearer <TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"amount": 10, "period": 30}' \
     http://localhost:3001/api/staking
```

---

## 🐛 TROUBLESHOOTING

### Problème: "Invalid environment variables"

**Solution:** Vérifier que `.env` existe et contient toutes les variables requises

### Problème: "Failed to connect to MongoDB"

**Solution:**

- Vérifier que MongoDB est démarré (`mongod`)
- Vérifier `MONGODB_URI` dans `.env`
- Pour Atlas: vérifier IP whitelist

### Problème: "KYC_REQUIRED" sur toutes les routes

**Solution:** C'est normal ! Les routes critiques nécessitent KYC vérifié. Utiliser un compte Pi avec KYC ou tester avec routes non-KYC.

### Problème: "CORS error"

**Solution:** Vérifier que `FRONTEND_URL` dans `.env` correspond à l'URL du frontend

---

## 📊 STATUT IMPLÉMENTATION

### ✅ PHASE 1 - COMPLÉTÉE

- [x] Configuration TypeScript
- [x] Modèles de données (User, Staking, Transaction)
- [x] Middlewares d'authentification (JWT, KYC, Guest blocking)
- [x] Service d'authentification Pi Network
- [x] Service Staking sécurisé
- [x] Routes API (Auth, Staking)
- [x] Serveur Express avec sécurité

### 🔄 PHASE 2 - EN COURS

- [ ] Service Shop (achats sécurisés)
- [ ] Service Quiz (validation serveur)
- [ ] Service Social (posts, comments)
- [ ] Service Withdrawal (retraits Pi)
- [ ] Routes complètes pour tous les services

### 📅 PHASE 3 - À VENIR

- [ ] Tests unitaires (Jest)
- [ ] Tests d'intégration
- [ ] Documentation API (Swagger)
- [ ] Monitoring & Logging (Winston)
- [ ] CI/CD Pipeline

---

## 🎯 PROCHAINES ÉTAPES

1. **Installer les dépendances backend**

   ```bash
   cd backend
   npm install
   ```

2. **Configurer `.env`**

   ```bash
   cp .env.development .env
   # Éditer .env avec vos valeurs
   ```

3. **Démarrer MongoDB**

   ```bash
   mongod
   ```

4. **Démarrer le backend**

   ```bash
   npm run dev
   ```

5. **Intégrer le frontend**
   - Créer `src/services/api.service.ts`
   - Remplacer les opérations locales par des appels API
   - Ajouter le modal Guest Mode

---

## 📞 SUPPORT

Pour toute question ou problème :

- Consulter les logs : `npm run dev` (mode verbose)
- Vérifier le health check : `http://localhost:3001/health`
- Examiner les erreurs dans la console

---

**Dernière mise à jour:** 2025-12-26  
**Version:** 2.0.0  
**Auteur:** Pioneer Academy Team
