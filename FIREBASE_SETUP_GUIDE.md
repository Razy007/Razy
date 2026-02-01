# 🚀 GUIDE FIREBASE PRODUCTION - STEP BY STEP

**Compte Gmail** : mayimava7@gmail.com  
**Objectif** : Activer Firebase Production  
**Durée Estimée** : 45 minutes

---

## ✅ **ÉTAPE 1 : CRÉER PROJET FIREBASE** (10 min)

### **1.1 Accéder Firebase Console**

1. Aller sur : https://console.firebase.google.com
2. Se connecter avec : **mayimava7@gmail.com**

### **1.2 Créer Nouveau Projet**

1. **Cliquer** : "+ Add project" ou "+ Ajouter un projet"
2. **Nom du projet** : `Academy of Pi`
3. **Cliquer** : Continue
4. **Google Analytics** : Activer (recommandé)
   - Choisir compte Analytics existant ou créer nouveau
5. **Cliquer** : Create project
6. **Attendre** : ~30 secondes (création projet)
7. **Cliquer** : Continue

---

## ✅ **ÉTAPE 2 : ACTIVER SERVICES** (10 min)

### **2.1 Firestore Database**

1. **Menu gauche** → 🗄️ **Firestore Database**
2. **Cliquer** : "Create database"
3. **Location** : Choisir `europe-west` (proche utilisateurs)
4. **Security Rules** : Start in **production mode**
5. **Cliquer** : Enable

**⏱️ Attendre 2-3 minutes (création database)**

### **2.2 Authentication**

1. **Menu gauche** → 🔐 **Authentication**
2. **Cliquer** : "Get started"
3. **Sign-in method** tab
4. **Activer** :
   - ✅ **Google** (pour Pi Network)
   - ✅ **Email/Password** (backup)
5. **Pour Google** :
   - Project public-facing name: `Academy of Pi`
   - Support email: `mayimava7@gmail.com`
   - Cliquer : Save

### **2.3 Cloud Functions** (Optionnel - pour anti-triche)

1. **Menu gauche** → ⚡ **Functions**
2. **Cliquer** : "Get started"
3. **Upgrade** : Blaze plan (pay-as-you-go)
   - ⚠️ Nécessite carte bancaire
   - ✅ Inclut free tier généreux
   - ⚠️ Si pas de carte, skip pour l'instant

---

## ✅ **ÉTAPE 3 : OBTENIR CONFIGURATION** (5 min)

### **3.1 Firebase Config**

1. **Cliquer** : ⚙️ (Settings) en haut à gauche
2. **Project Settings**
3. **Scroll down** vers "Your apps"
4. **Section** : "There are no apps in your project"
5. **Cliquer** : `</>` (Web icon)
6. **App nickname** : `Academy of Pi Web`
7. **Firebase Hosting** : ❌ Décocher (on utilise VPS)
8. **Cliquer** : Register app

### **3.2 Copier Configuration**

**Vous verrez** :

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "academy-of-pi-....firebaseapp.com",
  projectId: "academy-of-pi-....",
  storageBucket: "academy-of-pi-....appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

**⚠️ COPIER** ces valeurs (on va les utiliser)

### **3.3 Continuer**

**Cliquer** : "Continue to console"

---

## ✅ **ÉTAPE 4 : CONFIGURER SÉCURITÉ FIRESTORE** (10 min)

### **4.1 Security Rules**

1. **Firestore Database** → **Rules** tab
2. **Remplacer** le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ✅ Users collection - Only owner can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ✅ Banned users collection - Read-only for authenticated users
    match /bannedUsers/{userId} {
      allow read: if request.auth != null;
      allow write: if false;  // Only admin SDK can write
    }
    
    // ✅ Quiz questions - Read-only
    match /quizQuestions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false;  // Only admin can write
    }
    
    // ✅ Leaderboard - Public read
    match /leaderboard/{entry} {
      allow read: if true;
      allow write: if false;  // Only Cloud Functions can write
    }
    
    // ❌ Deny everything else
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Cliquer** : **Publish**

---

## ✅ **ÉTAPE 5 : CONFIGURER APPLICATION** (10 min)

### **5.1 Créer fichier .env**

1. **Ouvrir** : `c:\Users\lenovo\.gemini\antigravity\scratch\pi-academy-app`
2. **Copier** : `.env.example` → `.env`
3. **Éditer** `.env` avec valeurs Firebase :

```env
REACT_APP_FIREBASE_API_KEY=AIza...  (← Votre vraie valeur)
REACT_APP_FIREBASE_AUTH_DOMAIN=academy-of-pi-....firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=academy-of-pi-....
REACT_APP_FIREBASE_STORAGE_BUCKET=academy-of-pi-....appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=1234567890
REACT_APP_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

### **5.2 Activer Firebase Production**

**Option A : Remplacer firebase.ts directement**

```bash
# Backup ancien fichier
cp src/services/firebase.ts src/services/firebase-mock-backup.ts

# Remplacer par version production
cp src/services/firebase-production.ts src/services/firebase.ts
```

**Option B : Import conditionnel (Recommandé)**

Dans `src/services/firebase.ts`, ajouter :

```typescript
// Mode: 'production' ou 'mock'
const FIREBASE_MODE = process.env.REACT_APP_FIREBASE_MODE || 'production';

if (FIREBASE_MODE === 'production') {
  export * from './firebase-production';
} else {
  export * from './firebase-mock';
}
```

### **5.3 Test Local**

```bash
# 1. Installer deps (déjà fait)
npm install firebase

# 2. Build test
npm run build

# 3. Dev test
npm run dev

# 4. Vérifier console browser
# → Devrait voir: "[Firebase] Loading user profile..."
# → PAS "FIREBASE-MOCK"
```

---

## ✅ **ÉTAPE 6 : VÉRIFICATION & TESTS** (5 min)

### **6.1 Test Login**

1. **Ouvrir** : http://localhost:3000
2. **Login** (Guest ou Pioneer)
3. **Console Browser** (F12) :
   - ✅ Voir : `[Firebase] Saving user profile`
   - ❌ PAS de `[FIREBASE-MOCK]`

### **6.2 Vérifier Firestore**

1. **Firebase Console** → Firestore Database → **Data** tab
2. **Collection** : `users`
3. **Document** : Voir votre UID
4. **Données** : `userProgress`, `isPremium`, etc.

### **6.3 Test Migration**

Si ancien user avec localStorage :
- Login → Auto-migration vers Firestore
- Console : `[Firebase] Data migrated to Firestore`

---

## ✅ **CHECKLIST FINAL**

- [ ] Projet Firebase créé (`Academy of Pi`)
- [ ] Firestore Database activé
- [ ] Authentication activé (Google + Email/Password)
- [ ] Security Rules configurées
- [ ] Firebase Config copié
- [ ] `.env` créé avec vraies valeurs
- [ ] `firebase-production.ts` activé
- [ ] Build OK (`npm run build`)
- [ ] Console montre `[Firebase]` (pas `[FIREBASE-MOCK]`)
- [ ] Data visible dans Firestore Console

---

## 🚨 **TROUBLESHOOTING**

### **Problème : "Firebase: Error (auth/configuration-not-found)"**

**Solution** :
- Vérifier `.env` bien créé (pas `.env.example`)
- Vérifier variables commencent par `REACT_APP_`
- Restart dev server après changement `.env`

### **Problème : "Missing or insufficient permissions"**

**Solution** :
- Vérifier Firestore Rules publiées
- Vérifier user authentifié (pas null)
- Vérifier UID match dans rules

### **Problème : "Quota exceeded"**

**Solution** :
- Firestore free tier : 50k reads/day, 20k writes/day
- Upgrade vers Blaze plan si dépassé
- Optimiser requêtes (caching)

---

## 📞 **SUPPORT**

Si blocage :
1. Vérifier Firebase Console → Usage tab
2. Vérifier Firebase Console → Logs tab
3. Console Browser (F12) → Erreurs détaillées

---

**Firebase Production est maintenant PRÊT !** 🔥🚀
