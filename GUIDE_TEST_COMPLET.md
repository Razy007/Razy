# 🧪 GUIDE DE TEST - ACADEMY OF PI (HORS PI NETWORK)

**Date**: 2026-01-07 15:42  
**Objectif**: Tester l'application SANS l'écosystème Pi Network  
**Environnements**: Local + Production

---

## 🎯 SERVEUR LOCAL ACTIF ✅

**Status**: ✅ Serveur de développement lancé et prêt !

### URLs Disponibles:

```
Local (sur votre PC):
→ http://localhost:5173/

Network (depuis autres appareils):
→ http://192.168.30.100:5173/  (votre réseau local)
→ http://10.2.0.2:5173/
→ http://192.168.112.1:5173/
→ http://172.22.224.1:5173/
```

---

## 📋 COMMENT TESTER (ÉTAPE PAR ÉTAPE)

### 🟢 TEST 1: Version Locale (MAINTENANT)

#### Étape 1: Ouvrir l'application
1. Ouvrez votre navigateur (Chrome, Firefox, Edge, Safari)
2. Allez sur: **http://localhost:5173/**

#### Étape 2: Mode Guest (contourner Pi Network)
**L'application va afficher un écran de connexion Pi Network.**

Pour tester SANS Pi Network:
1. Cherchez le bouton **"Mode Invité (Limité)"** ou **"Guest Mode"**
2. Cliquez dessus
3. ✅ **Vous êtes maintenant dans l'app !**

#### Étape 3: Vérifier la navigation (4 boutons)
**En bas de l'écran**, vous devez voir **EXACTEMENT 4 boutons**:

1. 📚 **Courses** (Cours)
2. 🏆 **Leaderboard** (Classement)
3. 👥 **Social**
4. 🎁 **Shop** (Boutique)

**✅ Confirmer**: Aucun 5ème bouton "Profile" visible

---

#### Étape 4: Tester le switch FR/EN
1. En haut à droite, cliquez sur **FR** ou **ENG**
2. Toute l'interface doit changer de langue
3. **Vérifier Energy Shop**:
   - Cliquez sur l'icône ⚡ (panier) en haut
   - Vérifier que "Premium" est traduit
   - Fermer le shop
   - Changer de langue
   - Rouvrir le shop
   - ✅ Vérifier que la traduction a changé

---

#### Étape 5: Tester les cours
1. Cliquez sur un cours (ex: "Pi Network Essentials")
2. ✅ Vérifier que le contenu s'affiche (pas de "...")
3. Changer de langue (FR → EN ou EN → FR)
4. ✅ Vérifier que le contenu change de langue

---

#### Étape 6: Tester la navigation complète
Cliquez sur chaque bouton de navigation:

- **Courses** → Page d'accueil avec cours
- **Leaderboard** → Classement (même en mode Guest)
- **Social** → Feed social (posts visibles)
- **Shop** → Boutique (items Premium)

**✅ Confirmer**: Toutes les pages chargent correctement

---

#### Étape 7: Tester les pages juridiques (séparées)
Dans la barre d'adresse, tapez:

1. **http://localhost:5173/privacy**
   - ✅ Page Privacy Policy doit s'afficher
   - ✅ Bouton "Back" visible en haut

2. **http://localhost:5173/terms**
   - ✅ Page Terms of Service doit s'afficher
   - ✅ Bouton "Back" fonctionne

3. Cliquer sur "Back"
   - ✅ Retour à l'app principale (4 boutons toujours là)

---

## 🟡 TEST 2: Version Production (APRÈS DÉPLOIEMENT)

### Prérequis:
Déployer d'abord sur production:

```powershell
.\deploy_production.ps1
```

### URLs à tester:

1. **Application principale**:
   ```
   https://www.pioneeracademy.academy/
   ```

2. **Privacy Policy**:
   ```
   https://www.pioneeracademy.academy/privacy
   ```

3. **Terms of Service**:
   ```
   https://www.pioneeracademy.academy/terms
   ```

### Même tests que local:
- ✅ Mode Guest fonctionne
- ✅ 4 boutons de navigation
- ✅ Switch FR/EN
- ✅ Cours accessibles
- ✅ Pages /privacy et /terms séparées

---

## ⚠️ COMPORTEMENT ATTENDU (IMPORTANT)

### En mode Guest (hors Pi Network):

**CE QUI FONCTIONNE** ✅:
- Navigation (4 boutons)
- Visualisation des cours
- Interface complète (FR/EN)
- Social (lecture des posts)
- Shop (visualisation, pas d'achats)
- Progression limitée

**CE QUI EST RESTREINT** 🔒:
- Achats Pi (nécessite Pi Network)
- Staking (nécessite Pi Network)
- Progression complète (limitée en mode Guest)
- Posts sociaux (lecture seule)

**C'EST NORMAL !** Le mode Guest est fait pour TESTER, pas pour jouer pleinement.

---

### Avec Pi Network (dans Pi Browser):

**TOUT FONCTIONNE** ✅:
- Authentification Pi
- Achats en Pi
- Staking
- Progression complète
- Rewards XP/Pi
- Posts sociaux interactifs

---

## 📸 CHECKLIST DE VÉRIFICATION VISUELLE

### Page principale (/)
- [ ] ✅ Header avec logo Academy of Pi
- [ ] ✅ Balance (Pi, XP, Energy) visible
- [ ] ✅ Section cours visible
- [ ] ✅ **4 boutons** de navigation en bas (pas 5 !)
- [ ] ✅ Switch langue FR/EN fonctionne

### Page Privacy (/privacy)
- [ ] ✅ Page SÉPARÉE de l'app
- [ ] ✅ Header avec logo + bouton Back
- [ ] ✅ Contenu juridique visible
- [ ] ✅ Design cohérent (même style que l'app)
- [ ] ✅ Bouton Back ramène à l'app

### Page Terms (/terms)
- [ ] ✅ Page SÉPARÉE de l'app
- [ ] ✅ Header avec logo + bouton Back
- [ ] ✅ Contenu juridique visible
- [ ] ✅ Bouton Back fonctionne

### Energy Shop
- [ ] ✅ Modal s'ouvre au clic sur ⚡
- [ ] ✅ Produits affichés avec prix Pi
- [ ] ✅ Badge "Premium" visible
- [ ] ✅ Switch FR/EN change les labels

### Cours
- [ ] ✅ Liste complète visible
- [ ] ✅ Clic ouvre le détail du cours
- [ ] ✅ Contenu accessible (pas de "...")
- [ ] ✅ Switch FR/EN change le contenu

---

## 🧪 TEST AVANCÉ (OPTIONNEL)

### Console Développeur (F12)
1. Appuyer sur **F12** dans le navigateur
2. Onglet **"Console"**
3. ✅ Vérifier: **Aucune erreur rouge critique**

**Erreurs acceptables** (peut être ignoré):
- Warnings i18n (jaunes)
- Info logs (bleus)

**Erreurs problématiques** (à signaler):
- Erreurs rouges répétées
- "Failed to load"
- "TypeError" ou "ReferenceError"

---

## 🎯 RÉSULTAT ATTENDU

Si TOUT fonctionne correctement:

### Local (http://localhost:5173/)
```
✅ App charge en ~2 secondes
✅ Mode Guest accessible
✅ 4 boutons de navigation (pas 5)
✅ FR/EN fonctionne partout
✅ Cours accessibles avec contenu
✅ Energy Shop traduit
✅ /privacy et /terms accessibles
✅ Aucune erreur console critique
```

### Production (https://www.pioneeracademy.academy/)
```
✅ App charge via HTTPS
✅ Même comportement que local
✅ Certificat SSL valide (cadenas vert)
✅ Toutes les routes fonctionnent
✅ Performance fluide
```

---

## ❓ QUE FAIRE SI...

### ❌ "Page blanche" (local ou prod)
**Solution**:
1. F12 → Console
2. Copier les erreurs rouges
3. Me les envoyer

### ❌ "5 boutons au lieu de 4"
**Solution**:
1. Rafraîchir la page (Ctrl+R)
2. Vider le cache (Ctrl+Shift+R)
3. Si persiste → Me signaler

### ❌ "Switch FR/EN ne marche pas"
**Solution**:
1. Vérifier que le bouton FR/ENG est cliquable
2. Regarder si l'URL change
3. Rafraîchir et réessayer
4. Si persiste → Me signaler

### ❌ "Contenus de cours vides (... ou rien)"
**Solution**:
1. Changer de langue (FR → EN ou EN → FR)
2. Revenir au cours
3. Si toujours vide → Me signaler immédiatement

---

## 📊 COMPARAISON VERSIONS

### Version CORRECTE (actuelle)
```
✅ 4 boutons navigation
✅ Contenus cours accessibles FR/EN
✅ Energy Shop traduit
✅ Pages /privacy et /terms séparées
✅ Aucune erreur build
✅ Performance optimale
```

### Version INCORRECTE (anciennes versions rejetées)
```
❌ 5 boutons navigation (bug Profile)
❌ Contenus cours vides ("....")
❌ Energy Shop non traduit
❌ Pages juridiques manquantes
❌ Erreurs build
```

---

## ⏱️ TEMPS ESTIMÉ DE TEST

**Test rapide** (essentiel): **5 minutes**
- Ouvrir app
- Mode Guest
- Vérifier 4 boutons
- Tester FR/EN
- Voir un cours

**Test complet** (recommandé): **15 minutes**
- Tout le test rapide +
- Chaque page de navigation
- Energy Shop
- Pages juridiques
- Console F12

**Test exhaustif** (avant soumission Pi): **30 minutes**
- Tout le test complet +
- Chaque cours individuellement
- Chaque produit Energy Shop
- Toutes les combinaisons FR/EN
- Screenshots pour documentation

---

## 🎬 QUAND VOUS ÊTES PRÊT

### Après avoir testé en local (localhost:5173):

**Si TOUT est OK** ✅:
1. Me confirmer : "Local OK, prêt pour production"
2. Je déploie sur production
3. Vous testez sur www.pioneeracademy.academy
4. Si production OK → Soumission Pi Developer Portal

**Si des problèmes** ❌:
1. Me décrire précisément ce qui ne va pas
2. Screenshots si possible
3. Erreurs console (F12)
4. Je corrige immédiatement

---

## 📞 COMMUNICATION

**Format de retour attendu**:

```
TEST LOCAL - RÉSULTATS:

✅ App charge: OUI/NON
✅ Mode Guest: OUI/NON
✅ 4 boutons: OUI/NON (si NON, combien ?)
✅ FR/EN: OUI/NON
✅ Cours accessibles: OUI/NON
✅ Energy Shop traduit: OUI/NON
✅ /privacy accessible: OUI/NON
✅ /terms accessible: OUI/NON

PROBLÈMES DÉTECTÉS (si applicable):
[Décrire ici]

SCREENSHOTS (si applicable):
[Joindre ici]
```

---

## 🚀 STATUT ACTUEL

**Serveur local**: ✅ **ACTIF et PRÊT**

**URL de test**: http://localhost:5173/

**Action requise**: **VOUS testez maintenant !**

---

**Dernière mise à jour**: 2026-01-07 15:42  
**Serveur**: Lancé et opérationnel  
**En attente de**: Vos retours de test 🧪
