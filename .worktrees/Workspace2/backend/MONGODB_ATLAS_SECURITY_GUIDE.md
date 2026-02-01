# ============================================================================
# GUIDE COMPLET : MONGODB ATLAS - SÉCURITÉ ET SCALABILITÉ
# ============================================================================

## 🎯 OBJECTIF

Synchroniser le backend Pi Academy avec MongoDB Atlas Cloud pour garantir :
- ✅ **Scalabilité maximale** (jusqu'à 100+ connexions simultanées)
- ✅ **Rapidité optimale** (compression, indexes, connection pooling)
- ✅ **Sécurité renforcée** (chiffrement, anti-injection, détection d'anomalies)
- ✅ **Protection contre les failles** (validation, sanitization, audit logging)

---

## 📊 DIAGNOSTIC ACTUEL

D'après le diagnostic, voici l'état actuel :

```
✅ Connexion Internet       : OK
✅ IP Publique             : 190.2.155.230
✅ Résolution DNS SRV      : OK
❌ Port 27017              : BLOQUÉ (Firewall/Proxy/VPN/Antivirus)
⚠️  Erreur fichier logs    : Accès concurrent
```

---

## 🔧 SOLUTIONS AU PROBLÈME DE PORT BLOQUÉ

### Solution 1 : Utiliser MongoDB Atlas via DNS SRV (RECOMMANDÉE)

MongoDB Atlas supporte le format `mongodb+srv://` qui résout automatiquement les adresses et peut contourner certains blocages :

```javascript
// Dans votre .env
MONGODB_URI=mongodb+srv://username:password@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority
```

**Avantages** :
- Contourne certains firewalls
- Résolution DNS automatique
- Redondance intégrée

### Solution 2 : Autoriser MongoDB Atlas dans le Firewall Windows

```powershell
# Ouvrir PowerShell en ADMINISTRATEUR et exécuter :

# Autoriser MongoDB Atlas (port 27017)
New-NetFirewallRule -DisplayName "MongoDB Atlas" -Direction Outbound -Protocol TCP -RemotePort 27017 -Action Allow

# Vérifier la règle
Get-NetFirewallRule -DisplayName "MongoDB Atlas"
```

### Solution 3 : Désactiver temporairement l'antivirus/firewall

1. **Windows Defender Firewall** :
   - Paramètres Windows > Sécurité Windows > Pare-feu > Désactiver temporairement
   
2. **Antivirus tiers** (Avast, Norton, etc.) :
   - Désactiver temporairement la protection réseau
   - Tester la connexion
   - Si ça fonctionne, ajouter une exception pour MongoDB

### Solution 4 : Utiliser un VPN ou Proxy

Si votre réseau d'entreprise/école bloque le port 27017 :
- Utiliser un VPN pour contourner les restrictions
- Configurer un proxy HTTP/HTTPS dans MongoDB Atlas

---

## 🔒 CONFIGURATION SÉCURISÉE - ÉTAPE PAR ÉTAPE

### Étape 1 : Configuration MongoDB Atlas (Cloud)

#### A. Whitelist de votre IP

1. Allez sur [MongoDB Atlas Network Access](https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList)
2. Cliquez sur **"Add IP Address"**
3. Ajoutez votre IP actuelle : `190.2.155.230`
4. OU ajoutez `0.0.0.0/0` pour autoriser toutes les IPs (développement seulement)

#### B. Créer un utilisateur de base de données

1. Allez sur [Database Access](https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/database/users)
2. Créez un nouvel utilisateur :
   - Username : `pi_academy_admin`
   - Password : **Générez un mot de passe fort**
   - Database User Privileges : `Atlas Admin` ou `Read and Write to any database`
3. **Sauvegardez les identifiants de manière sécurisée**

### Étape 2 : Configuration de votre .env

Créez/modifiez le fichier `.env` dans le dossier `backend/` :

```bash
# ============================================================================
# MONGODB ATLAS CONFIGURATION
# ============================================================================

# Option 1 : URI Complete (RECOMMANDÉE)
MONGODB_URI=mongodb+srv://pi_academy_admin:VOTRE_MOT_DE_PASSE@cluster0.y87z9is.mongodb.net/pi_academy?retryWrites=true&w=majority&ssl=true

# Option 2 : Paramètres séparés
MONGODB_USERNAME=pi_academy_admin
MONGODB_PASSWORD=VOTRE_MOT_DE_PASSE
MONGODB_CLUSTER=cluster0.y87z9is.mongodb.net
MONGODB_DATABASE=pi_academy

# ============================================================================
# SÉCURITÉ
# ============================================================================

# Clé de chiffrement pour données sensibles (générez une clé aléatoire de 32 bytes)
ENCRYPTION_KEY=votre_cle_de_chiffrement_32_caracteres_minimum_ici

# ============================================================================
# ENVIRONNEMENT
# ============================================================================

NODE_ENV=production
PORT=3001
FRONTEND_URL=http://localhost:5173

# ============================================================================
# PI NETWORK
# ============================================================================

PI_SANDBOX=false  # true pour sandbox, false pour production
```

### Étape 3 : Mettre à jour server.js

Modifiez `backend/server.js` pour utiliser la nouvelle configuration optimisée :

```javascript
// Remplacer cette ligne :
const { connectAtlas, disconnectAtlas, healthCheck, createIndexes } = require('./database/mongodb-atlas-config');

// Par :
const { connectAtlas, disconnectAtlas, healthCheck, createIndexes } = require('./database/mongodb-atlas-optimized');
```

---

## 🚀 DÉMARRAGE ET TESTS

### 1. Installer les dépendances (si pas déjà fait)

```bash
cd backend
npm install
```

### 2. Tester la connexion

```bash
node simple-test.js
```

**Sortie attendue** :
```
🔄 CONNEXION MONGODB ATLAS
======================================================================
✅ MONGODB ATLAS CONNECTÉ AVEC SUCCÈS !
Latency: 45ms
Database: pi_academy
Status: healthy
```

### 3. Démarrer le backend

```bash
npm start
```

**Sortie attendue** :
```
============================================================
🚀 Pi Academy Backend - PRÊT
============================================================
📍 Server: http://localhost:3001
🏥 Health: http://localhost:3001/health
💾 Database: MongoDB Atlas
✨ Backend sécurisé, scalable et prêt pour production!
```

### 4. Tester l'API Health Check

Ouvrez votre navigateur ou utilisez curl :

```bash
curl http://localhost:3001/health
```

**Réponse attendue** :
```json
{
  "success": true,
  "message": "Pi Academy Backend API is running",
  "database": {
    "status": "healthy",
    "type": "MongoDB Atlas",
    "connected": true,
    "latency": "45ms"
  },
  "environment": "production"
}
```

---

## 🔐 FONCTIONNALITÉS DE SÉCURITÉ IMPLÉMENTÉES

### 1. Chiffrement des Données Sensibles

```javascript
const { encrypt, decrypt } = require('./database/security-config');

// Chiffrer un email
const encryptedEmail = encrypt('user@example.com');

// Déchiffrer
const originalEmail = decrypt(encryptedEmail);
```

**Utilisation** :
- Emails
- Données KYC
- Informations personnelles sensibles

### 2. Protection Anti-Injection (NoSQL Injection)

```javascript
const { sanitizeInput, validateAndSanitize } = require('./database/security-config');

// Nettoyer les inputs
const cleanData = sanitizeInput(req.body);

// Valider avec schema
const schema = {
    username: { type: 'string', required: true, minLength: 3, maxLength: 20 },
    email: { type: 'email', required: true },
    age: { type: 'number', min: 18, max: 99 }
};

try {
    const validatedData = validateAndSanitize(req.body, schema);
    // Données sûres, procéder...
} catch (error) {
    // Erreur de validation
    res.status(400).json({ error: error.message });
}
```

### 3. Détection d'Anomalies (Anti-Fraude)

```javascript
const { detectAnomalies } = require('./database/security-config');

// Détecter activité suspecte
const anomaly = detectAnomalies(userId, 'stake', 50);

if (anomaly.suspicious) {
    console.error(`⚠️  Activité suspecte: ${anomaly.reason}`);
    // Bloquer la transaction
    if (anomaly.severity === 'critical') {
        return res.status(403).json({ 
            error: 'Transaction bloquée pour sécurité' 
        });
    }
}
```

**Détections** :
- ✅ Trop d'actions en peu de temps (> 20/minute)
- ✅ Montant suspect (> 1000 Pi/minute)
- ✅ Actions répétitives (bots)

### 4. Validation de Transactions

```javascript
const { validateTransaction } = require('./database/security-config');

// Valider avant exécution
const validation = validateTransaction(userId, 'stake', 50, userBalance);

if (!validation.valid) {
    return res.status(400).json({ 
        error: 'Transaction invalide',
        details: validation.errors 
    });
}

// Procéder avec la transaction
```

### 5. Rate Limiting par Utilisateur

```javascript
const { check RateLimit } = require('./database/security-config');

// Vérifier limite
const rateCheck = checkRateLimit(userId, 'api_call', 100, 60000);

if (!rateCheck.allowed) {
    return res.status(429).json({ 
        error: 'Trop de requêtes',
        retryAfter: rateCheck.retryAfter 
    });
}
```

### 6. Audit Logging

```javascript
const { auditLog } = require('./database/security-config');

// Logger les actions importantes
auditLog(userId, 'user_login', {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    success: true
});

auditLog(userId, 'transaction_stake', {
    amount: 50,
    type: 'stake',
    success: true
});
```

---

## 📊 OPTIMISATIONS DE PERFORMANCE

### 1. Connection Pooling

```
Min Pool Size: 10-20 connexions (évite cold starts)
Max Pool Size: 50-100 connexions (haute charge)
```

### 2. Compression des Données

```
Compressors: Snappy, Zlib
Compression Level: 6
Réduction bande passante: ~30-50%
```

### 3. Indexes Automatiques

Les indexes suivants sont créés automatiquement pour des queries ultra-rapides :

```javascript
// Users
- uid (unique)
- username
- email (sparse)
- createdAt

// Transactions
- userId + timestamp
- type + timestamp

// Progress
- userId (unique)

// Staking
- userId + active
- endDate + active

// Posts (Social)
- userId + timestamp
- likes
- timestamp

// Leaderboard
- stats.totalPi
- stats.level
```

### 4. Read Preference

```
Production : secondaryPreferred (répartit la charge)
Development : primary (cohérence maximale)
```

---

## 🛡️ CHECKLIST SÉCURITÉ AVANT PRODUCTION

- [ ] IP whitelistée dans MongoDB Atlas Network Access
- [ ] Utilisateur MongoDB créé avec mot de passe fort
- [ ] MONGODB_URI dans .env (jamais committé sur git)
- [ ] ENCRYPTION_KEY généré (32+ caractères aléatoires)
- [ ] SSL/TLS activé
- [ ] Firewall configuré (port 27017 autorisé)
- [ ] Rate limiting activé
- [ ] Validation des inputs implémentée
- [ ] Audit logging configuré
- [ ] Indexes créés
- [ ] Health checks testés
- [ ] Backup automatique configuré dans Atlas

---

## 🔥 TROUBLESHOOTING

### Erreur : "MongoServerSelectionError: read ECONNRESET"

**Causes possibles** :
1. IP pas whitelistée → Vérifier MongoDB Atlas Network Access
2. Port 27017 bloqué → Appliquer Solution 2 (Firewall)
3. Identifiants incorrects → Vérifier .env
4. VPN/Proxy → Essayer Solution 4

### Erreur : "Authentication failed"

**Solution** :
- Vérifier MONGODB_USERNAME et MONGODB_PASSWORD dans .env
- Vérifier que l'utilisateur existe dans Database Access
- Vérifier authSource=admin dans l'URI

### Erreur : "Topology was destroyed"

**Solution** :
- Redémarrer le serveur Node.js
- Vérifier que le cluster Atlas est actif
- Augmenter serverSelectionTimeoutMS

### Performance lente

**Solutions** :
1. Vérifier que les indexes sont créés : `createIndexes()`
2. Activer la compression
3. Augmenter le pool de connexions
4. Utiliser `secondaryPreferred` en production

---

## 📚 RESSOURCES

- [MongoDB Atlas Dashboard](https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f)
- [Network Access](https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/network/accessList)
- [Database Users](https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/security/database/users)
- [Monitoring](https://cloud.mongodb.com/v2/694e9f7b45800142ccefe48f#/metrics/replicaSet/)

---

## ✅ RÉSUMÉ

Votre backend Pi Academy est maintenant configuré avec :

1. **Scalabilité** : Connection pooling optimisé (10-100 connexions)
2. **Rapidité** : Compression automatique, indexes optimisés
3. **Sécurité** : Chiffrement, anti-injection, détection d'anomalies
4. **Protection** : Validation, sanitization, rate limiting, audit logs
5. **Robustesse** : Retry logic intelligent, health checks, monitoring

**Prochaine étape** : Résoudre le problème de port bloqué puis démarrer le backend !
