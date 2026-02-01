# 🚀 Guide de Configuration MongoDB Atlas - AUTOMATIQUE

## ⚡ Configuration Rapide (3 étapes)

### Étape 1: Diagnostic Automatique

```powershell
# Ouvrir PowerShell dans ce dossier et exécuter:
.\mongodb-diagnostic.ps1
```

Ce script va:

- ✅ Vérifier votre connexion Internet
- ✅ Récupérer votre IP publique
- ✅ Tester la résolution DNS
- ✅ Tester le port MongoDB (27017)
- ✅ Générer un rapport détaillé

### Étape 2: Configurer MongoDB Atlas

Après le diagnostic, suivez les actions dans le rapport:

#### A. Network Access (CRITIQUE ⚠️)

1. Allez sur: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList
2. Cliquez sur **"Add IP Address"**
3. Deux options:
   - **Recommandé pour test**: Ajoutez `0.0.0.0/0` (toutes les IPs)
   - **Production**: Ajoutez votre IP publique (affichée dans le diagnostic)
4. Cliquez **"Confirm"**

#### B. Database Access

1. Allez sur: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/database/users
2. Vérifiez que l'utilisateur `abdoulrazaktanko06_db_user` existe
3. Si besoin, cliquez **"Edit"** → **"Edit Password"** → Notez le nouveau mot de passe

#### C. Cluster Status

1. Allez sur: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/clusters
2. Vérifiez que le statut est **"Running"** (pas "Paused")
3. Si en pause, cliquez **"Resume"**

### Étape 3: Test de Connexion Automatique

```powershell
# Installez mongoose si nécessaire
npm install mongoose

# Testez la connexion (remplacez VOTRE_MOT_DE_PASSE)
node setup-mongodb.js VOTRE_MOT_DE_PASSE
```

**Exemple:**

```powershell
node setup-mongodb.js MyPassword123!
```

Ce script va:

- ✅ Tester la connexion à MongoDB Atlas
- ✅ Créer un document de test
- ✅ Générer automatiquement le fichier `.env`
- ✅ Vous confirmer si tout fonctionne

---

## 🔧 Solutions aux Problèmes Courants

### Problème 1: DNS SRV ne se résout pas

**Symptôme:** Le diagnostic indique "DNS SRV non résolu"

**Solution:** Utilisez la connexion standard au lieu de SRV

Dans votre code, au lieu de:

```
mongodb+srv://...
```

Utilisez:

```
mongodb://abdoulrazaktanko06_db_user:<password>@cluster0-shard-00-00.y87z9is.mongodb.net:27017,cluster0-shard-00-01.y87z9is.mongodb.net:27017,cluster0-shard-00-02.y87z9is.mongodb.net:27017/?ssl=true&authSource=admin
```

### Problème 2: Port 27017 bloqué

**Symptôme:** "Port 27017 non accessible"

**Solutions:**

1. Désactivez temporairement le pare-feu Windows
2. Désactivez VPN/Proxy
3. Essayez un autre réseau (partage de connexion mobile)

### Problème 3: ECONNRESET persiste

**Symptôme:** Erreur "read ECONNRESET"

**Solutions dans l'ordre:**

1. ✅ Ajoutez `0.0.0.0/0` dans Network Access
2. ✅ Vérifiez que le cluster est "Running"
3. ✅ Changez de réseau WiFi
4. ✅ Utilisez mongodb:// au lieu de mongodb+srv://

---

## 📋 Checklist Complète

Avant de demander de l'aide, vérifiez:

- [ ] Diagnostic exécuté avec `.\mongodb-diagnostic.ps1`
- [ ] IP ajoutée dans Network Access (ou 0.0.0.0/0)
- [ ] Utilisateur créé dans Database Access
- [ ] Mot de passe correct (sans `<db_password>`)
- [ ] Cluster en statut "Running"
- [ ] Node.js et mongoose installés
- [ ] Test exécuté avec `node setup-mongodb.js`
- [ ] Pare-feu/VPN désactivés (pour test)

---

## 🔑 Informations de Connexion

### Votre Cluster

- **Nom:** Cluster0
- **Host:** cluster0.y87z9is.mongodb.net
- **Région:** (visible dans Atlas)

### Chaîne de Connexion MongoDB Compass

**Format SRV (recommandé si DNS fonctionne):**

```
mongodb+srv://abdoulrazaktanko06_db_user:<VOTRE_MOT_DE_PASSE>@cluster0.y87z9is.mongodb.net/?appName=Cluster0
```

**Format Standard (si problème DNS):**

```
mongodb://abdoulrazaktanko06_db_user:<VOTRE_MOT_DE_PASSE>@cluster0-shard-00-00.y87z9is.mongodb.net:27017,cluster0-shard-00-01.y87z9is.mongodb.net:27017,cluster0-shard-00-02.y87z9is.mongodb.net:27017/?ssl=true&authSource=admin&replicaSet=atlas-xxxxx
```

⚠️ **Remplacez `<VOTRE_MOT_DE_PASSE>` par votre vrai mot de passe!**

---

## 🎯 Utilisation dans votre Application

Une fois `.env` créé par le script, dans votre code:

```javascript
// Importer dotenv
require("dotenv").config();

// Importer mongoose
const mongoose = require("mongoose");

// Se connecter
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connecté"))
  .catch((err) => console.error("❌ Erreur MongoDB:", err));

// Créer un modèle
const User = mongoose.model("User", {
  username: String,
  email: String,
});

// Utiliser le modèle
const newUser = await User.create({
  username: "test",
  email: "test@example.com",
});
```

---

## 📞 Besoin d'Aide?

Si après avoir suivi TOUS les steps ci-dessus, ça ne fonctionne toujours pas:

1. Partagez le fichier `mongodb-diagnostic-results.txt`
2. Partagez les messages d'erreur complets
3. Indiquez quelle étape a échoué

---

## 🎉 Succès!

Une fois la connexion établie, vous verrez:

```
✅ Connexion réussie!
✅ Écriture dans la base réussie
✅ Fichier .env créé
🎉 Configuration terminée avec succès!
```

Votre fichier `.env` contiendra automatiquement:

- `MONGODB_URI` - votre chaîne de connexion
- `MONGODB_DB_NAME` - le nom de votre base de données
- D'autres configurations utiles

**Vous êtes prêt à développer! 🚀**
