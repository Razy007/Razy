# 🏗️ ARCHITECTURE PIONEER ACADEMY - BACKEND SÉCURISÉ

## 📊 Vue d'Ensemble

```
┌─────────────────────────────────────────────────────────────────┐
│                      PIONEER ACADEMY                             │
│                   Architecture Sécurisée                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────┐         HTTPS/JWT          ┌─────────────────┐
│                  │ ◄─────────────────────────► │                 │
│   FRONTEND       │                             │    BACKEND      │
│   React/Vite     │                             │  Express/TS     │
│                  │                             │                 │
└──────────────────┘                             └─────────────────┘
        │                                                 │
        │                                                 │
        ▼                                                 ▼
┌──────────────────┐                             ┌─────────────────┐
│  Local Storage   │                             │    MongoDB      │
│  - JWT Token     │                             │  - Users        │
│  - User Prefs    │                             │  - Staking      │
└──────────────────┘                             │  - Transactions │
                                                  └─────────────────┘
```

---

## 🔒 Flux de Sécurité

### 1. Authentification

```
┌─────────┐                                    ┌──────────┐
│  User   │                                    │ Backend  │
└────┬────┘                                    └────┬─────┘
     │                                              │
     │  1. POST /api/auth/pi                        │
     │     { uid, username, accessToken }           │
     ├─────────────────────────────────────────────►│
     │                                              │
     │                                              │ 2. Verify Pi Token
     │                                              │    with Pi Network
     │                                              │
     │                                              │ 3. Create/Update User
     │                                              │    in MongoDB
     │                                              │
     │                                              │ 4. Generate JWT
     │  5. { user, token }                          │
     │◄─────────────────────────────────────────────┤
     │                                              │
     │  6. Store token in localStorage              │
     │                                              │
```

### 2. Requête Protégée (Staking)

```
┌─────────┐                                    ┌──────────┐
│  User   │                                    │ Backend  │
└────┬────┘                                    └────┬─────┘
     │                                              │
     │  1. POST /api/staking                        │
     │     Headers: Authorization: Bearer <JWT>     │
     │     Body: { amount: 100, period: 90 }        │
     ├─────────────────────────────────────────────►│
     │                                              │
     │                                              │ 2. requireAuth
     │                                              │    ✅ Verify JWT
     │                                              │
     │                                              │ 3. requireKyc
     │                                              │    ✅ Check KYC status
     │                                              │
     │                                              │ 4. blockGuest
     │                                              │    ✅ Verify role !== guest
     │                                              │
     │                                              │ 5. Validate amount
     │                                              │    ✅ amount > 0
     │                                              │    ✅ amount <= balance
     │                                              │
     │                                              │ 6. Create Staking
     │                                              │    - Deduct balance
     │                                              │    - Save to MongoDB
     │                                              │    - Create transaction
     │                                              │
     │  7. { success: true, data: {...} }           │
     │◄─────────────────────────────────────────────┤
     │                                              │
```

### 3. Blocage Guest

```
┌─────────┐                                    ┌──────────┐
│  Guest  │                                    │ Backend  │
└────┬────┘                                    └────┬─────┘
     │                                              │
     │  1. POST /api/staking                        │
     │     Headers: Authorization: Bearer <JWT>     │
     ├─────────────────────────────────────────────►│
     │                                              │
     │                                              │ 2. requireAuth
     │                                              │    ✅ JWT valid
     │                                              │
     │                                              │ 3. requireKyc
     │                                              │    ❌ KYC not verified
     │                                              │
     │  4. 403 Forbidden                            │
     │     { error: "KYC_REQUIRED" }                │
     │◄─────────────────────────────────────────────┤
     │                                              │
     │  5. Show Guest Modal                         │
     │                                              │
```

---

## 🗂️ Structure des Données

### User Model

```typescript
{
  _id: ObjectId,
  piId: string,              // Pi Network UID
  username: string,
  role: "guest" | "pioneer_non_kyc" | "pioneer_kyc",
  kycStatus: "none" | "pending" | "verified" | "rejected",

  // Balances
  piBalance: number,         // Pi disponible
  energyBalance: number,     // Énergie (0-1000)
  stakingBalance: number,    // Pi en staking
  totalEarned: number,       // Total gagné

  // Progress
  level: number,
  xp: number,
  streak: number,
  lastLoginDate: Date,

  createdAt: Date,
  updatedAt: Date
}
```

### Staking Model

```typescript
{
  _id: ObjectId,
  userId: string,
  amount: number,            // Montant staké
  period: 30 | 90 | 180 | 365,  // Période en jours
  apy: number,               // APY (5%, 8%, 12%, 15%)
  startDate: Date,
  endDate: Date,
  status: "active" | "completed" | "cancelled",
  rewardEarned: number,      // Récompense calculée

  createdAt: Date,
  updatedAt: Date
}
```

### Transaction Model

```typescript
{
  _id: ObjectId,
  userId: string,
  type: "quiz_reward" | "staking_reward" | "purchase" | "withdrawal" | ...,
  amount: number,            // Montant Pi
  energyAmount: number,      // Montant énergie
  status: "pending" | "completed" | "failed" | "cancelled",
  description: string,
  metadata: object,          // Données additionnelles

  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔐 Middlewares de Sécurité

### requireAuth

```typescript
┌─────────────────────────────────────────┐
│  1. Extract JWT from Authorization      │
│     header                               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Verify JWT signature                │
│     - Check issuer                       │
│     - Check audience                     │
│     - Check expiration                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  3. Attach user to req.user             │
│     { userId, piId, role, kycStatus }   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  4. Call next()                         │
└─────────────────────────────────────────┘
```

### requireKyc

```typescript
┌─────────────────────────────────────────┐
│  1. Check req.user exists               │
│     (requireAuth must be before)        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Check kycStatus === "verified"      │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ▼           ▼
    ✅ Verified  ❌ Not Verified
         │           │
         │           ▼
         │      403 Forbidden
         │      "KYC_REQUIRED"
         │
         ▼
    Call next()
```

### blockGuest

```typescript
┌─────────────────────────────────────────┐
│  1. Check req.user exists               │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  2. Check role !== "guest"              │
└──────────────┬──────────────────────────┘
               │
         ┌─────┴─────┐
         │           │
         ▼           ▼
    ✅ Pioneer   ❌ Guest
         │           │
         │           ▼
         │      403 Forbidden
         │      "GUEST_RESTRICTED"
         │
         ▼
    Call next()
```

---

## 📡 Routes API

### Auth Routes (`/api/auth`)

```
POST   /pi          - Login Pi Network
POST   /guest       - Mode invité
GET    /me          - Profil utilisateur (Auth)
POST   /refresh     - Refresh token (Auth)
POST   /logout      - Déconnexion (Auth)
```

### Staking Routes (`/api/staking`)

```
POST   /                  - Créer stake (Auth + KYC + Non-Guest)
GET    /                  - Liste stakes (Auth)
GET    /stats             - Statistiques (Auth)
POST   /:id/complete      - Compléter stake (Auth + KYC + Non-Guest)
POST   /:id/cancel        - Annuler stake (Auth + KYC + Non-Guest)
```

---

## 🎯 Flux Complet: Création de Stake

```
┌──────────┐
│ Frontend │
└────┬─────┘
     │
     │ 1. User clicks "Stake 100 Pi for 90 days"
     │
     ▼
┌────────────────────────────────────────────┐
│ stakingAPI.create({ amount: 100, period: 90 }) │
└────┬───────────────────────────────────────┘
     │
     │ 2. POST /api/staking
     │    Headers: Authorization: Bearer <JWT>
     │    Body: { amount: 100, period: 90 }
     │
     ▼
┌──────────┐
│ Backend  │
└────┬─────┘
     │
     │ 3. Middleware Stack
     │    ├─ requireAuth ✅
     │    ├─ requireKyc ✅
     │    └─ blockGuest ✅
     │
     ▼
┌────────────────────────────────────────────┐
│ stakingService.createStake()               │
│                                            │
│ 4. Validate amount                         │
│    ✅ amount > 0                           │
│    ✅ amount >= 1                          │
│                                            │
│ 5. Get user from DB                        │
│    user = await User.findById(userId)      │
│                                            │
│ 6. Check balance                           │
│    ✅ user.piBalance >= amount             │
│                                            │
│ 7. Deduct balance                          │
│    await user.deductPiBalance(amount)      │
│                                            │
│ 8. Create staking                          │
│    staking = new Staking({                 │
│      userId, amount, period,               │
│      apy: getApyForPeriod(period)          │
│    })                                      │
│    await staking.save()                    │
│                                            │
│ 9. Update user staking balance             │
│    user.stakingBalance += amount           │
│    await user.save()                       │
│                                            │
│ 10. Create transaction record              │
│     await Transaction.createTransaction({  │
│       userId, type: 'purchase',            │
│       amount: -amount, ...                 │
│     })                                     │
│                                            │
│ 11. Return response                        │
└────┬───────────────────────────────────────┘
     │
     │ 12. { success: true, data: { staking, user } }
     │
     ▼
┌──────────┐
│ Frontend │
└────┬─────┘
     │
     │ 13. Update UI
     │     - Show success message
     │     - Update balance display
     │     - Refresh staking list
     │
```

---

## 🛡️ Protection en Profondeur

```
┌─────────────────────────────────────────────────────────┐
│                    LAYER 1: NETWORK                      │
│  - HTTPS (TLS/SSL)                                       │
│  - CORS (Origin whitelist)                               │
│  - Rate Limiting (100 req/15min)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    LAYER 2: AUTHENTICATION               │
│  - JWT Token Verification                                │
│  - Token Expiration (7 days)                             │
│  - Signature Validation                                  │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    LAYER 3: AUTHORIZATION                │
│  - KYC Status Check                                      │
│  - Role Verification (Guest/Pioneer)                     │
│  - Permission Granularity                                │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    LAYER 4: VALIDATION                   │
│  - Input Validation (Zod schemas)                        │
│  - Business Rules (amount > 0, balance check)            │
│  - Data Sanitization                                     │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    LAYER 5: DATABASE                     │
│  - Atomic Transactions                                   │
│  - Schema Validation (Mongoose)                          │
│  - Rollback on Error                                     │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Comparaison Avant/Après

### AVANT (Client-side uniquement)

```
┌──────────┐
│ Frontend │
└────┬─────┘
     │
     │ handleStaking(amount, period)
     │
     ▼
┌────────────────────────────────────────────┐
│ if (amount > balance) {                    │
│   alert('Insufficient balance');           │ ❌ Contournable
│   return;                                  │    dans la console
│ }                                          │
│                                            │
│ setUserProgress(prev => ({                │
│   ...prev,                                │
│   piBalance: prev.piBalance - amount,     │ ❌ État local
│   stakingBalance: prev.stakingBalance + amount │ uniquement
│ }));                                       │
└────────────────────────────────────────────┘
```

### APRÈS (Server-side validation)

```
┌──────────┐                    ┌──────────┐
│ Frontend │                    │ Backend  │
└────┬─────┘                    └────┬─────┘
     │                               │
     │ stakingAPI.create()           │
     ├──────────────────────────────►│
     │                               │
     │                               │ requireAuth ✅
     │                               │ requireKyc ✅
     │                               │ blockGuest ✅
     │                               │
     │                               │ Validate amount ✅
     │                               │ Check balance ✅
     │                               │
     │                               │ MongoDB Transaction:
     │                               │ - Deduct balance
     │                               │ - Create staking
     │                               │ - Save transaction
     │                               │
     │ { success, data }             │
     │◄──────────────────────────────┤
     │                               │
     │ Update UI                     │
     │                               │
```

---

**🎉 Architecture Sécurisée Complète !**

_Version: 2.0.0 | Date: 2025-12-26_
