# 🚀 Guide Complet: Configuration MongoDB Atlas

## 📋 Table des Matières
1. [Prérequis](#prérequis)
2. [Configuration MongoDB Atlas](#configuration-mongodb-atlas)
3. [Configuration du Backend](#configuration-du-backend)
4. [Résolution des Problèmes](#résolution-des-problèmes)
5. [Sécurité & Best Practices](#sécurité--best-practices)

---

## 🎯 Prérequis

### Votre IP Actuelle
```
IP Publique: 190.2.155.230
```
**⚠️ IMPORTANT:** Cette IP DOIT être ajoutée dans MongoDB Atlas Network Access!

### Informations de Connexion
- **Cluster:** `cluster0.y87z9is.mongodb.net`
- **Database:** `pi_academy`
- **Username:** À définir dans MongoDB Atlas
- **Password:** À définir dans MongoDB Atlas

---

## ⚙️ Configuration MongoDB Atlas

### Étape 1: Configurer Network Access (CRITIQUE)

1. **Ouvrez MongoDB Atlas:**
   - Allez sur: https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList

2. **Ajoutez votre IP:**
   ```
   Cliquez sur "ADD IP ADDRESS"
   - IP Address: 190.2.155.230
   - Comment: "Pi Academy Development"
   - Cliquez "Confirm"
   ```

3. **Option Alternative (Développement Uniquement):**
   ```
   - IP Address: 0.0.0.0/0
   - Comment: "Allow from anywhere (TEMPORAIRE)"
   ```
   **⚠️ ATTENTION:** Ne jamais utiliser en production!

### Étape 2: Configurer Database Access

1. **Créer un utilisateur:**
   ```
   Database Access > ADD NEW DATABASE USER
   
   - Username: piAcademy
   - Password: [Générez un mot de passe fort]
   - Database User Privileges: Read and write to any database
   - Cliquez "Add User"
   ```

2. **Sauvegardez les identifiants:**
   ```
   Username: piAcademy
   Password: [VOTRE_MOT_DE_PASSE]
   ```

### Étape 3: Obtenir la Connection String

1. **Dans MongoDB Atlas:**
   ```
   Clusters > Connect > Connect your application
   - Driver: Node.js
   - Version: 4.1 or later
   ```

2. **Copiez la connection string:**
   ```
   mongodb+srv://piAcademy:<password>@cluster0.y87z9is.mongodb.net/?retryWrites=true&w=majority
   ```

---

## 🔧 Configuration du Backend

### Méthode 1: Configuration Automatique (Recommandée)

1. **Copiez le template:**
   ```powershell
   cd backend
   Copy-Item .env.atlas-template .env
   ```

2. **Éditez le fichier `.env`:**
   ```bash
   # Ouvrir dans l'éditeur
   notepad .env
   ```

3. **Configurez MongoDB URI:**
   ```env
   MONGODB_URI=mongodb+srv://piAcademy:VOTRE_MOT_DE_PASSE@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority
   ```

4. **Configurez les autres variables:**
   ```env
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   JWT_SECRET=pi_academy_ultra_secure_jwt_secret_2025_CHANGE_IN_PRODUCTION
   PI_SANDBOX=true
   ```

### Méthode 2: Configuration Manuelle

Créez un fichier `backend/.env`:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://piAcademy:VOTRE_PASSWORD@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority

# Serveur
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Sécurité
JWT_SECRET=changez_moi_en_production

# Pi Network
PI_API_KEY=your_pi_api_key
PI_SANDBOX=true

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Étape 4: Installer les Dépendances

```powershell
cd backend
npm install
```

### Étape 5: Tester la Connexion

1. **Script de test automatique:**
   ```powershell
   node -e "require('./database/mongodb-atlas-config').connectAtlas().then(() => console.log('✅ Connexion réussie!')).catch(err => console.error('❌ Erreur:', err.message))"
   ```

2. **Lancer le serveur:**
   ```powershell
   npm run dev
   ```

3. **Vérifier le health check:**
   - Ouvrez: http://localhost:3001/health
   - Vous devriez voir: `"MongoDB Atlas connecté avec succès !"`

---

## 🔥 Résolution des Problèmes

### Problème 1: "MongoServerSelectionError: read ECONNRESET"

**Cause:** Port 27017 bloqué par firewall/antivirus

**Solutions:**

1. **Vérifier le firewall Windows:**
   ```powershell
   # Ouvrir PowerShell en administrateur
   New-NetFirewallRule -DisplayName "MongoDB Atlas" -Direction Outbound -LocalPort 27017 -Protocol TCP -Action Allow
   ```

2. **Désactiver temporairement l'antivirus**

3. **Vérifier VPN:**
   - Désactivez tout VPN actif
   - Certains VPN bloquent le port 27017

4. **Test de connectivité:**
   ```powershell
   Test-NetConnection -ComputerName cluster0.y87z9is.mongodb.net -Port 27017
   ```

### Problème 2: "Authentication Failed"

**Solutions:**

1. **Vérifier les identifiants:**
   - Username correct dans MongoDB Atlas
   - Mot de passe correctement encodé dans l'URI

2. **Encoder caractères spéciaux:**
   ```javascript
   const username = encodeURIComponent('piAcademy');
   const password = encodeURIComponent('votre_mot@de#passe');
   ```

### Problème 3: "IP Not Whitelisted"

**Solution:**

1. **Vérifier votre IP actuelle:**
   ```powershell
   Invoke-RestMethod -Uri "https://api.ipify.org?format=json" | Select-Object -ExpandProperty ip
   ```

2. **Mettre à jour Network Access:**
   - Ajoutez la nouvelle IP dans MongoDB Atlas
   - Ou utilisez 0.0.0.0/0 (développement uniquement)

### Problème 4: "Connection Timeout"

**Solutions:**

1. **Augmenter les timeouts:**
   ```javascript
   // Dans mongodb-atlas-config.js
   connectTimeoutMS: 60000,  // 60 secondes
   socketTimeoutMS: 60000,
   ```

2. **Vérifier DNS:**
   ```powershell
   nslookup cluster0.y87z9is.mongodb.net
   ```

3. **Flush DNS cache:**
   ```powershell
   ipconfig /flushdns
   ```

---

## 🔒 Sécurité & Best Practices

### 1. Sécurité des Identifiants

**✅ À FAIRE:**
- Utilisez des mots de passe longs et complexes (min 16 caractères)
- Ne committez JAMAIS le fichier `.env` dans Git
- Utilisez des secrets différents pour dev/staging/production
- Changez `JWT_SECRET` en production

**❌ À NE PAS FAIRE:**
- Mots de passe simples
- Partager les identifiants
- 0.0.0.0/0 en production
- Utiliser les mêmes secrets partout

### 2. Network Access

**Développement:**
```
IP spécifique: 190.2.155.230
OU temporairement: 0.0.0.0/0
```

**Production:**
```
IP du serveur de production uniquement
Jamais 0.0.0.0/0 !
```

### 3. Configuration Optimale

```javascript
// Performance maximale
const options = {
    maxPoolSize: 50,           // Haute charge
    minPoolSize: 10,           // Toujours prêt
    retryWrites: true,         // Fiabilité
    retryReads: true,
    ssl: true,                 // Sécurité
    compressors: ['snappy'],   // Compression
};
```

### 4. Monitoring

**Activer les logs:**
```env
LOG_LEVEL=info
MONGODB_LOG_LEVEL=warn
```

**Vérifier régulièrement:**
- MongoDB Atlas Metrics
- Alertes de performance
- Logs d'erreur

### 5. Backup

```env
ENABLE_AUTO_BACKUP=true
BACKUP_FREQUENCY_HOURS=24
```

---

## 🚀 Démarrage Rapide

### Script Complet de Configuration

1. **Ajoutez votre IP dans MongoDB Atlas:**
   - https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList
   - IP: `190.2.155.230`

2. **Créez l'utilisateur MongoDB:**
   - Username: `piAcademy`
   - Password: `[générez un mot de passe fort]`

3. **Configurez le backend:**
   ```powershell
   cd backend
   Copy-Item .env.atlas-template .env
   notepad .env
   # Modifiez MONGODB_URI avec votre mot de passe
   ```

4. **Installez et démarrez:**
   ```powershell
   npm install
   npm run dev
   ```

5. **Testez:**
   - Ouvrez: http://localhost:3001/health
   - Vérifiez: ✅ MongoDB Atlas connecté

---

## 📞 Support

### Logs Utiles

**Voir les logs de connexion:**
```javascript
// mongodb-atlas-config.js affiche automatiquement:
✅ MongoDB Atlas connecté avec succès !
🌐 Mode: development
⚡ Pool Size: 10-50
🔒 SSL/TLS: Activé
🔄 Retry: Activé
```

**En cas d'erreur:**
- Vérifiez les logs dans la console
- Testez avec le script de diagnostic
- Vérifiez MongoDB Atlas Metrics

### Checklist de Dépannage

- [ ] IP ajoutée dans Network Access
- [ ] Utilisateur créé dans Database Access
- [ ] Mot de passe correct dans `.env`
- [ ] Firewall ne bloque pas le port 27017
- [ ] DNS résout correctement le cluster
- [ ] Pas de VPN actif qui bloque la connexion
- [ ] Dependencies installées (`npm install`)

---

## ✅ Validation Finale

### Test de Connexion Complet

```javascript
// Créez test-atlas.js
const { connectAtlas, healthCheck, disconnectAtlas } = require('./database/mongodb-atlas-config');

(async () => {
    try {
        console.log('🔄 Test de connexion MongoDB Atlas...\n');
        
        await connectAtlas();
        console.log('\n📊 Health Check...');
        
        const health = await healthCheck();
        console.log(JSON.stringify(health, null, 2));
        
        console.log('\n✅ Tous les tests passés !');
        
        await disconnectAtlas();
    } catch (error) {
        console.error('\n❌ Test échoué:', error.message);
        process.exit(1);
    }
})();
```

**Exécutez:**
```powershell
node test-atlas.js
```

---

## 🎉 Félicitations !

Si vous voyez:
```
✅ MongoDB Atlas connecté avec succès !
```

Votre backend est maintenant:
- ✅ Connecté à MongoDB Atlas
- ✅ Scalable (pool de connexions)
- ✅ Rapide (compression + retry)
- ✅ Sécurisé (SSL/TLS + authentification)
- ✅ Fiable (reconnexion automatique)

**Prochaines étapes:**
1. Lancer le frontend
2. Tester les API endpoints
3. Vérifier les transactions
4. Déployer en production

---

**Besoin d'aide?** Vérifiez la section [Résolution des Problèmes](#résolution-des-problèmes)
