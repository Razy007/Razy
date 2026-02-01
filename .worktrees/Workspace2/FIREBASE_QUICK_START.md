# ⚡ FIREBASE - ACTIVATION RAPIDE

**Durée** : 15 minutes  
**Compte** : mayimava7@gmail.com

---

## 🔥 **ÉTAPES SUR FIREBASE CONSOLE**

### **1. Créer Projet** (5 min)

1. Aller sur : **https://console.firebase.google.com**
2. Se connecter : **mayimava7@gmail.com**
3. Cliquer : **"+ Ajouter un projet"**
4. Nom : **Academy of Pi**
5. Google Analytics : **Activer** ✅
6. Cliquer : **Créer le projet**
7. Attendre 30 secondes...
8. Cliquer : **Continuer**

---

### **2. Activer Firestore** (3 min)

1. Menu gauche → **Firestore Database**
2. **Créer une base de données**
3. Location : **europe-west** (ou le plus proche)
4. Mode : **Production** ✅
5. **Activer**
6. Attendre 2 minutes...

---

### **3. Activer Authentication** (2 min)

1. Menu gauche → **Authentication**
2. **Commencer**
3. Onglet **Sign-in method**
4. **Google** → Activer
   - Nom public : `Academy of Pi`
   - Email support : `mayimava7@gmail.com`
   - **Enregistrer**
5. **Email/Password** → Activer
   - **Enregistrer**

---

### **4. Obtenir Config** (3 min)

1. Cliquer **⚙️ Paramètres** (en haut)
2. **Paramètres du projet**
3. Scroll vers **Vos applications**
4. Cliquer **`</>`** (Web)
5. Pseudo : `Academy of Pi Web`
6. Hosting : **❌ Décocher**
7. **Enregistrer l'application**

**COPIER LES VALEURS** :
```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "academy-of-pi-....firebaseapp.com",
  projectId: "academy-of-pi-....",
  storageBucket: "academy-of-pi-....appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:..."
};
```

8. **Continuer vers la console**

---

### **5. Security Rules** (2 min)

1. **Firestore Database** → Onglet **Règles**
2. **Remplacer** par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /bannedUsers/{userId} {
      allow read: if request.auth != null;
      allow write: if false;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Publier**

---

## 💻 **ÉTAPES LOCALES**

### **6. Configurer .env** (1 min)

```powershell
# Dans le dossier du projet
.\setup-firebase.ps1
```

**Entrer** les valeurs copiées depuis Firebase Console.

---

### **7. Activer Firebase Production** (1 min)

```powershell
# Backup ancien fichier
Copy-Item src/services/firebase.ts src/services/firebase-mock-backup.ts

# Activer smart switch
Copy-Item src/services/firebase-smart.ts src/services/firebase.ts -Force
```

---

### **8. Test Build** (2 min)

```powershell
npm run build
```

**Vérifier console** :
- ✅ `[Firebase] Mode actif: production`
- ✅ `[Firebase] Loading PRODUCTION module (Firestore)`
- ❌ PAS `[FIREBASE-MOCK]`

---

### **9. Test Application**

```powershell
npm run dev
```

1. Ouvrir : http://localhost:3000
2. Login (Guest ou Pioneer)
3. F12 (Console) :
   - ✅ `[Firebase] Saving user profile`
   - ✅ `[Firebase] Loading user profile`

4. **Firebase Console** → Firestore → **Data**
   - ✅ Collection `users`
   - ✅ Document avec votre UID
   - ✅ Données visibles

---

## ✅ **CHECKLIST**

- [ ] Projet Firebase créé
- [ ] Firestore activé
- [ ] Authentication activé
- [ ] Config copiée
- [ ] `.env` créé
- [ ] `firebase-smart.ts` activé
- [ ] Build OK
- [ ] Console montre `production`
- [ ] Data visible Firestore

---

## 🚨 **SI ERREUR**

### **`configuration-not-found`**
→ Vérifier `.env` existe (pas `.env.example`)  
→ Redémarrer dev server

### **`Permission denied`**
→ Vérifier Security Rules publiées  
→ Vérifier user authentifié

---

**Firebase Production est ACTIF !** 🔥

**Prochaine étape** : Anti-Triche Quiz 🎯
