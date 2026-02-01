# ⚡ QUICK START - PIONEER ACADEMY

## 🎯 SITUATION

✅ **Frontend** : http://localhost:5173 → **FONCTIONNE**  
❌ **Backend** : MongoDB Atlas → **Bloqué TLS Windows**  
🔧 **Solution** : WSL2 + VPS

---

## 🚀 PROCHAINES ÉTAPES

### ⏳ MAINTENANT (Installation WSL2 en cours...)

**Action** : Attendre fin installation → Redémarrage automatique

---

### 1️⃣ APRÈS REDÉMARRAGE (5 min)

```bash
# WSL2 s'ouvre automatiquement
# Créer compte Ubuntu
Username: pioneer
Password: [votre mot de passe]
```

---

### 2️⃣ SETUP WSL2 (10 min)

**📖 Guide complet** : `docs/WSL2-SETUP.md`

```bash
# Mise à jour
sudo apt update && sudo apt upgrade -y

# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Vérification
node -v
npm -v
```

---

### 3️⃣ TEST MONGODB (2 min)

```bash
# Aller dans projet
cd /mnt/c/Users/lenovo/.gemini/antigravity/scratch/pi-academy-app/backend

# Installer dépendances
npm install

# Test connexion
node test-mongodb-wsl.js
```

**✅ Résultat attendu** : Connexion réussie !

---

### 4️⃣ LANCER BACKEND (1 min)

```bash
cd backend
npm run dev
```

**✅ Résultat attendu** :

```
🚀 Server running on port 3001
✅ MongoDB Connected
```

---

### 5️⃣ FRONTEND ↔ BACKEND (10 min)

**📖 Guide complet** : `docs/FRONTEND-BACKEND-INTEGRATION.md`

**Test rapide** :

1. Backend tourne (WSL2) → port 3001
2. Frontend tourne (Windows) → port 5173
3. Ouvrir console navigateur :

```javascript
fetch("http://localhost:3001/api/health")
  .then((r) => r.json())
  .then(console.log);
```

**✅ Résultat attendu** : `{status: "ok"}`

---

## 🏆 PRODUCTION (Après WSL2 validé)

**📖 Roadmap complète** : `.agent/workflows/production-deployment.md`

**Timeline** :

- J+1 : Choix VPS + Configuration
- J+2 : Déploiement application
- J+3 : Tests + Monitoring
- ✅ **LANCEMENT !**

---

## 🔐 SÉCURITÉ

**📋 Checklist** : `docs/SECURITY-CHECKLIST.md`  
**📖 Guide backend** : `backend/SECURITY.md`

**IMPORTANT** :

- ✅ Dev : MongoDB IP `0.0.0.0/0` OK temporairement
- ⚠️ Prod : MongoDB IP **FIXE VPS UNIQUEMENT**

---

## 📚 DOCUMENTATION COMPLÈTE

**📖 Index général** : `DOCUMENTATION-INDEX.md`  
**📊 Résumé exécutif** : `EXECUTIVE-SUMMARY.md`

---

## 🎯 TIMELINE GLOBALE

| Phase          | Tâche             | Durée       |
| -------------- | ----------------- | ----------- |
| **Maintenant** | Installation WSL2 | ⏳ En cours |
| **J+0**        | Setup + Tests     | 1 heure     |
| **J+0**        | ✅ App complète   | -           |
| **J+1-3**      | VPS Production    | 5 heures    |
| **J+3**        | 🚀 **LANCEMENT**  | -           |

---

## 🆘 AIDE RAPIDE

**Problème WSL2** → `docs/WSL2-SETUP.md` (section Troubleshooting)  
**Problème MongoDB** → `node test-mongodb-wsl.js` (diagnostic auto)  
**Problème Connexion** → `docs/FRONTEND-BACKEND-INTEGRATION.md`

---

## ✅ VALIDATION RAPIDE

**Phase 1 (WSL2) = Succès si** :

- [x] MongoDB test vert
- [x] Backend démarre sans erreur
- [x] Frontend appelle API avec succès

---

**🔥 Dans moins d'1 heure, votre app sera 100% fonctionnelle !**

**📖 Pour plus de détails, consultez les guides complets.**
