# 📋 GUIDE COMPLET - PI DEVELOPER PORTAL CONFIG

**Date**: 2026-01-07 15:45  
**Application**: Academy of Pi  
**Status**: ✅ Prêt pour soumission

---

## 🎯 COMMENT REMPLIR LE FORMULAIRE PI DEVELOPER PORTAL

### Section 1: APP SETTINGS

#### App Name ✅
```
Academy of Pi
```
**Note**: ✅ Conforme aux guidelines (pas de préfixe "Pi")

---

#### Subtitle
```
Learning for Pi Ecosystem
```
**Alternative suggestions**:
- `Learn • Earn • Grow with Pi`
- `Educational Platform for Pioneers`
- `Master Blockchain & Pi Network`

---

#### Description
```
Academy of Pi is an educational platform dedicated to learning, skills development, and knowledge sharing within the Pi Network ecosystem. Master blockchain fundamentals, earn Pi rewards through interactive courses, and join a community of learners building the future of decentralized finance.
```

**Caractères**: 140/140

---

### Section 2: APP NETWORK ⚠️ IMPORTANT

#### App Network
**À sélectionner**: 

```
✅ mainnet  (pour PRODUCTION)
```

ou

```
🟡 testnet  (pour TEST seulement)
```

**⚠️ CRUCIAL**:
- **Testnet** = Environnement de test (Pi fictifs)
- **Mainnet** = Production réelle (vrais Pi)

**Votre choix**:
- Si vous voulez **lancer officiellement** → Sélectionnez **mainnet**
- Si vous voulez **tester d'abord** → Restez sur **testnet**

**Recommandation**: Commencez par **testnet** pour validation, puis migrez vers **mainnet** quand prêt.

---

#### Testnet/Mainnet App Visibility
```
✅ public
```
**Alternatives**:
- `public`: Tout le monde peut accéder
- `private`: Accès restreint (invitations uniquement)

**Recommandation**: **public** pour maximiser l'adoption

---

### Section 3: APP HOSTING

#### App Hosting
```
✅ self-hosted  (ou similaire - vous hébergez sur VPS Hetzner)
```

---

### Section 4: URLS & POLICY ⚠️ CRUCIAL

#### Your App's URL (Production) ✅
```
https://www.pioneeracademy.academy
```

**Exigences**:
- ✅ HTTPS obligatoire
- ✅ Domaine vérifié (vous recevrez email de vérification)
- ✅ Accessible publiquement

---

#### Your App's Development URL (Sandbox)

**Option 1** (Même URL):
```
https://www.pioneeracademy.academy
```

**Option 2** (Sous-domaine recommandé):
```
https://dev.pioneeracademy.academy
```

ou

```
https://sandbox.pioneeracademy.academy
```

**⚠️ Important**:
- Si vous n'avez pas de sous-domaine dev, utilisez l'URL principale OK ✅
- Si vous voulez séparer dev et prod, créez un sous-domaine

---

#### App's Privacy Policy URL ✅

```
https://www.pioneeracademy.academy/privacy
```

**✅ Status**: Créé et accessible !

**Pour tester** (après déploiement):
```bash
curl https://www.pioneeracademy.academy/privacy
```

---

#### App's Terms of Service URL ✅

```
https://www.pioneeracademy.academy/terms
```

**✅ Status**: Créé et accessible !

**Pour tester** (après déploiement):
```bash
curl https://www.pioneeracademy.academy/terms
```

---

## 🔐 VÉRIFICATION DOMAINE

Après avoir soumis le formulaire, Pi Network vous enverra un email pour **vérifier la propriété du domaine**.

### Méthodes possibles:

#### Méthode 1: Fichier HTML
Pi vous demandera de placer un fichier comme:
```
https://www.pioneeracademy.academy/pi-verification.html
```

**Comment faire**:
1. Pi vous donne le fichier ou code unique
2. Créer le fichier sur votre VPS dans `/var/www/pioneer-academy/`
3. Vérifier l'accès via navigateur
4. Cliquer "Verify" dans le portal

---

#### Méthode 2: DNS TXT Record
Pi vous demandera d'ajouter un enregistrement DNS comme:
```
Type: TXT
Host: _pi-verification
Value: [code unique fourni par Pi]
```

**Comment faire**:
1. Aller dans votre panel domaine (chez votre registrar)
2. Ajouter l'enregistrement TXT fourni
3. Attendre propagation DNS (5-30 min)
4. Cliquer "Verify" dans le portal

---

## 🎯 CONFIGURATION .env.production

**Avant le déploiement**, vérifiez votre fichier `.env.production` :

```bash
# CRITICAL: Sandbox DOIT être false en production
VITE_PI_SANDBOX=false

# Votre vraie clé API Pi (obtenez-la depuis Pi Developer Portal)
VITE_PI_API_KEY=your_real_pi_api_key_here

# Mock Auth DOIT être false en production
VITE_USE_MOCK_AUTH=false

# URL backend
VITE_API_URL=https://www.pioneeracademy.academy/api

# GCV Value
VITE_GCV_VALUE=314.159
```

**⚠️ IMPORTANT**: Remplacez `your_real_pi_api_key_here` par votre vraie clé API Pi !

**Où trouver la clé API ?**
1. Pi Developer Portal
2. Votre app "Academy of Pi"
3. Section "API Keys" ou "Credentials"

---

## 📊 CHECKLIST AVANT SOUMISSION

### Configuration App
- [ ] ✅ App Name: "Academy of Pi"
- [ ] ✅ Subtitle rempli
- [ ] ✅ Description complète (140 caractères)
- [ ] ⚠️ App Network: **mainnet** (ou testnet si test)
- [ ] ✅ App Visibility: **public**
- [ ] ✅ App Hosting: **self-hosted**

### URLs
- [ ] ✅ Production URL: `https://www.pioneeracademy.academy`
- [ ] ✅ Development URL: Rempli
- [ ] ✅ Privacy URL: `https://www.pioneeracademy.academy/privacy`
- [ ] ✅ Terms URL: `https://www.pioneeracademy.academy/terms`

### Variables Environnement
- [ ] ⚠️ `.env.production` configuré
- [ ] ⚠️ `VITE_PI_SANDBOX=false`
- [ ] ⚠️ `VITE_PI_API_KEY` rempli avec vraie clé
- [ ] ⚠️ `VITE_USE_MOCK_AUTH=false`

### Build & Déploiement
- [ ] ✅ Build production réussi (`npm run build`)
- [ ] ⏳ Déploiement VPS (`.\deploy_production.ps1`)
- [ ] ⏳ Vérification domaine Pi Network
- [ ] ⏳ Test app via Pi Browser

---

## 🚀 ORDRE DES OPÉRATIONS

### ÉTAPE 1: Déployer sur VPS
```powershell
# Build avec .env.production
npm run build

# Déployer
.\deploy_production.ps1
```

**Durée**: 2-3 minutes

---

### ÉTAPE 2: Vérifier pages légales accessibles

**Tester Privacy**:
```bash
# Ouvrir dans navigateur:
https://www.pioneeracademy.academy/privacy
```

**Tester Terms**:
```bash
# Ouvrir dans navigateur:
https://www.pioneeracademy.academy/terms
```

**✅ Expected**:
- Pages chargent correctement
- Design cohérent avec l'app
- Bouton "Back" fonctionne

---

### ÉTAPE 3: Remplir Pi Developer Portal

**URL**: https://develop.pi/

1. Se connecter avec compte Pi Network
2. Sélectionner votre app "Academy of Pi"
3. Aller dans "App Settings"
4. Remplir **TOUS** les champs (voir section ci-dessus)
5. **Sauvegarder**

---

### ÉTAPE 4: Vérifier domaine

1. Attendre email de Pi Network
2. Suivre instructions (fichier HTML ou DNS TXT)
3. Cliquer "Verify" dans le portal
4. ✅ Validation confirmée

---

### ÉTAPE 5: Tester via Pi Browser

1. Ouvrir **Pi Network App** sur mobile
2. Aller dans **"Pi Browser"**
3. Chercher **"Academy of Pi"**
4. Cliquer **"Open"**
5. ✅ Vérifier que l'app charge correctement

---

## 📝 RÉPONSES EXACTES À COPIER-COLLER

### Pour le formulaire Pi Developer Portal:

```
App Name: Academy of Pi

Subtitle: Learning for Pi Ecosystem

Description: Academy of Pi is an educational platform dedicated to learning, skills development, and knowledge sharing within the Pi Network ecosystem. Master blockchain fundamentals, earn Pi rewards through interactive courses, and join a community of learners building the future of decentralized finance.

App Network: mainnet

App Visibility: public

App Hosting: self-hosted

Production URL: https://www.pioneeracademy.academy

Development URL: https://www.pioneeracademy.academy

Privacy Policy URL: https://www.pioneeracademy.academy/privacy

Terms of Service URL: https://www.pioneeracademy.academy/terms
```

---

## ⚠️ ERREURS FRÉQUENTES À ÉVITER

### ❌ Erreur #1: Oublier HTTPS
**Problème**: Utiliser `http://` au lieu de `https://`  
**Solution**: Toujours utiliser `https://`

---

### ❌ Erreur #2: Sandbox = true en production
**Problème**: `.env.production` avec `VITE_PI_SANDBOX=true`  
**Solution**: Mettre `VITE_PI_SANDBOX=false`

---

### ❌ Erreur #3: App Network = testnet pour lancement
**Problème**: Rester sur testnet alors que vous voulez lancer en prod  
**Solution**: Changer vers **mainnet** avant soumission finale

---

### ❌ Erreur #4: Privacy/Terms non accessibles
**Problème**: URLs `/privacy` et `/terms` retournent 404  
**Solution**: Vérifier routing, déployer build avec routes activées

---

### ❌ Erreur #5: Pas de vraie clé API Pi
**Problème**: `VITE_PI_API_KEY` vide ou placeholder  
**Solution**: Obtenir vraie clé depuis Pi Developer Portal

---

## ✅ VALIDATION FINALE

Avant de soumettre, vérifiez:

```bash
# 1. Build réussi ?
npm run build
# → Doit afficher "✓ built in XX.XXs"

# 2. Privacy accessible ?
curl -I https://www.pioneeracademy.academy/privacy
# → Doit retourner "200 OK"

# 3. Terms accessible ?
curl -I https://www.pioneeracademy.academy/terms
# → Doit retourner "200 OK"

# 4. Variables env correctes ?
cat .env.production
# → Vérifier VITE_PI_SANDBOX=false
```

---

## 🎉 APRÈS SOUMISSION

Une fois le formulaire soumis:

1. **Email de vérification** (sous 24h)
   - Suivre instructions
   - Valider propriété domaine

2. **Review par Pi Core Team** (1-7 jours)
   - Ils vérifient l'app manuellement
   - Vérifient conformité privacy/terms
   - Testent fonctionnalités

3. **Approval / Feedback** (notification dans portal)
   - Si approuvé → App visible dans Pi Browser ! 🎉
   - Si feedback → Corriger et resoumettre

4. **Go Live !**
   - Votre app devient accessible à tous les Pioneers
   - Monitoring des users et analytics
   - Support et mises à jour continues

---

## 📞 SUPPORT

**Problèmes de configuration ?**
- Email Pi Support: developer@minepi.com
- Documentation: https://developers.minepi.com/

**Problèmes techniques Academy of Pi ?**
- Support app: support@pioneeracademy.academy
- Privacy: privacy@pioneeracademy.academy
- Legal: legal@pioneeracademy.academy

---

## 🎯 RÉSUMÉ ULTRA-RAPIDE

**1. Déployer**:
```powershell
npm run build
.\deploy_production.ps1
```

**2. Remplir Pi Developer Portal**:
- App Name: Academy of Pi
- Network: mainnet
- Production URL: https://www.pioneeracademy.academy
- Privacy: https://www.pioneeracademy.academy/privacy
- Terms: https://www.pioneeracademy.academy/terms

**3. Vérifier domaine** (suivre email Pi)

**4. Tester via Pi Browser**

**5. Attendre approval** 🎉

---

**Dernière mise à jour**: 2026-01-07 15:45  
**Status**: ✅ Documentation complète  
**Prochaine action**: Déployer puis remplir le formulaire Pi Developer Portal
