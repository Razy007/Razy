# 🔧 Diagnostic Détaillé - Pioneer Academy

## 📋 Résumé des Problèmes Identifiés

### Problème 1 : État de Déverrouillage des Cours avec les Cumuls XP

**Description :** Les cours ne se déverrouillent pas correctement malgré les XP accumulés.

**Causes Potentielles :**
1. Incohérence entre le niveau stocké et le niveau calculé à partir des XP
2. Cours prérequis non marqués comme complétés
3. Formule de calcul du niveau incorrecte ou incohérente

**Solution Appliquée :**
- ✅ Création d'un fichier de diagnostic HTML (`diagnostic-detaille.html`)
- ✅ Script de console pour diagnostic en temps réel (`console-diagnostic.js`)
- ✅ Fonction de synchronisation automatique du niveau basée sur les XP

---

### Problème 2 : Referral System Test Figé

**Description :** Le composant ReferralTest reste figé en position `fixed bottom-4 right-4` et bloque l'accès à la boutique.

**Causes :**
1. Position CSS fixe sans possibilité de déplacement
2. Z-index élevé (`z-50`) qui passe au-dessus de la boutique
3. Aucun mécanisme pour minimiser ou masquer le composant

**Solutions Implémentées :**
- ✅ Composant rendu **draggable** avec `react-draggable`
- ✅ Bouton de minimisation pour réduire à un simple badge
- ✅ Z-index réduit à `z-40` pour permettre aux modals de passer au-dessus
- ✅ Indication visuelle que le composant est déplaçable

---

## 🛠️ Fichiers Créés/Modifiés

### 1. `diagnostic-detaille.html`
**Localisation :** Racine du projet

**Utilisation :**
```bash
# Ouvrir directement dans le navigateur
start diagnostic-detaille.html
```

**Fonctionnalités :**
- Diagnostic complet de l'état utilisateur
- Vérification des cours et cumuls XP
- Détection des incohérences de niveau
- Analyse du problème ReferralTest
- Boutons de correction automatique

---

### 2. `console-diagnostic.js`
**Localisation :** Racine du projet

**Utilisation :**
1. Ouvrez http://localhost:5173/
2. Appuyez sur **F12** pour ouvrir la console
3. Copiez-collez le contenu de `console-diagnostic.js`
4. Appuyez sur **Entrée**

**Fonctions Disponibles :**
```javascript
// Corriger le niveau basé sur les XP
fixLevel()

// Ajouter des XP
addXP(500)  // Ajoute 500 XP

// Marquer un cours comme complété
completeCourse("pi-intro-101")

// Débloquer tous les cours (DEBUG)
unlockAllCourses()

// Réinitialiser la progression
resetProgress()
```

---

### 3. `src/components/referral/ReferralTest.tsx` (MODIFIÉ)
**Changements Principaux :**

**Avant :**
```tsx
<div className="fixed bottom-4 right-4 ... z-50">
  {/* Composant non déplaçable */}
</div>
```

**Après :**
```tsx
<Draggable handle=".drag-handle" bounds="parent">
  <div className="fixed bottom-4 right-4 ... z-40">
    {/* Composant déplaçable + minimizable */}
    <button onClick={() => setIsMinimized(true)}>➖</button>
  </div>
</Draggable>
```

**Nouvelles Fonctionnalités :**
- ✅ **Draggable** : Glissez-déposez pour déplacer
- ✅ **Minimizable** : Bouton ➖ pour réduire
- ✅ **Z-index réduit** : Ne bloque plus la boutique
- ✅ **Visual feedback** : Indication visuelle "(Draggable)"

---

### 4. `src/types/react-draggable.d.ts` (NOUVEAU)
**But :** Déclarations de types TypeScript pour `react-draggable`

Fichier créé car `@types/react-draggable` n'existe pas dans le registre npm.

---

## 🚀 Instructions d'Utilisation

### Option 1 : Diagnostic HTML (Recommandé)

1. Ouvrez le fichier de diagnostic :
   ```bash
   start diagnostic-detaille.html
   ```

2. Cliquez sur **"🔍 Lancer le Diagnostic Complet"**

3. Consultez les résultats et utilisez les boutons de correction :
   - **🔧 Corriger la Position du ReferralTest** (déjà fait)
   - **🔓 Corriger le Déverrouillage des Cours**
   - **🗑️ Réinitialiser toutes les données** (si nécessaire)

---

### Option 2 : Console du Navigateur

1. Ouvrez l'application : http://localhost:5173/

2. Ouvrez la console (F12)

3. Copiez-collez le contenu de `console-diagnostic.js`

4. Utilisez les fonctions disponibles :
   ```javascript
   // Exemple: Corriger le niveau
   fixLevel()
   
   // Exemple: Ajouter 500 XP
   addXP(500)
   
   // Exemple: Compléter le cours intro
   completeCourse("pi-intro-101")
   ```

---

## 🔍 Vérification du Composant ReferralTest

### Test de Draggable

1. Ouvrez http://localhost:5173/
2. En mode développement, le composant **🧪 Referral System Tests** apparaît en bas à droite
3. **Essayez de le déplacer** en cliquant sur la barre de titre (zone grise)
4. **Minimisez-le** en cliquant sur le bouton **➖**
5. Vérifiez qu'il ne bloque plus la boutique

### Test de Non-blocage

1. Ouvrez la boutique (onglet **Shop**)
2. Vérifiez que le composant ReferralTest ne bloque pas les boutons
3. Si nécessaire, déplacez le composant ou minimisez-le

---

## 📊 Formule de Calcul du Niveau

**Formule utilisée dans l'application :**
```javascript
const level = Math.floor(totalXP / 100) + 1;
```

**Exemples :**
- 0 XP → Niveau 1
- 100 XP → Niveau 2
- 500 XP → Niveau 6
- 696 XP → Niveau 7
- 1000 XP → Niveau 11

**Note :** Le diagnostic vérifie cette cohérence et peut la corriger automatiquement.

---

## 🎓 Cours et Prérequis

| Cours | ID | Niveau | XP | Prérequis |
|-------|-----|--------|-----|-----------|
| Introduction à Pi Network | `pi-intro-101` | 1 | 0 | Aucun |
| Pi Wallet Mastery | `pi-wallet-101` | 2 | 300 | `pi-intro-101` |
| Anti-Scam Defense | `safety-101` | 3 | 500 | `pi-wallet-101` |
| KYC Process Explained | `kyc-101` | 4 | 800 | `safety-101` |
| Blockchain Fundamentals | `blockchain-fundamentals` | 5 | 1000 | `pi-intro-101`, `pi-wallet-101` |
| Introduction au DeFi | `defi-intro` | 7 | 1500 | `blockchain-fundamentals` |

---

## ⚙️ Dépendances Installées

```json
{
  "react-draggable": "^4.4.6"
}
```

**Installation :**
```bash
npm install react-draggable
```

---

## 🐛 Problèmes Connus et Solutions

### Problème : ReferralTest ne s'affiche pas

**Cause :** Le composant ne s'affiche qu'en mode développement.

**Solution :**
```javascript
// Dans App.tsx, ligne 2068
{process.env.NODE_ENV === 'development' && <ReferralTest />}
```

Vérifiez que vous êtes bien en mode développement (`npm run dev`).

---

### Problème : TypeScript signale une erreur sur Draggable

**Cause :** Types manquants pour `react-draggable`.

**Solution :** Le fichier `src/types/react-draggable.d.ts` a été créé. Si l'erreur persiste :
```bash
# Redémarrer le serveur de développement
npm run dev
```

---

### Problème : Les cours ne se débloquent toujours pas

**Vérifications :**
1. Ouvrez le diagnostic HTML
2. Vérifiez la cohérence niveau/XP
3. Vérifiez que les cours prérequis sont complétés
4. Utilisez `fixLevel()` dans la console si nécessaire

**Correction manuelle :**
```javascript
// Console du navigateur
completeCourse("pi-intro-101")  // Marquer intro comme complété
fixLevel()                      // Recalculer le niveau
```

---

## 📞 Support et Débogage

### Logs de Diagnostic

Tous les logs sont visibles dans :
1. **Diagnostic HTML** : Section "💻 Console de Diagnostic"
2. **Console du navigateur** : Après exécution du script

### Vérification de l'État

```javascript
// Console du navigateur
JSON.parse(localStorage.getItem('userProgress'))
```

Cela affiche toutes les données de progression.

---

## ✅ Checklist de Vérification

- [ ] Diagnostic HTML ouvert et exécuté
- [ ] Incohérences de niveau corrigées
- [ ] Cours prérequis marqués comme complétés
- [ ] ReferralTest déplaçable et minimizable
- [ ] Boutique accessible sans blocage
- [ ] Application rechargée après corrections

---

## 🎯 Prochaines Étapes

1. **Tester le système de déverrouillage**
   - Vérifier que tous les cours se débloquent correctement
   - Tester la progression XP

2. **Tester le Referral System**
   - Vérifier que le composant est déplaçable
   - Tester la minimisation
   - S'assurer qu'il ne bloque plus la boutique

3. **Nettoyer le code**
   - Une fois validé, considérer de désactiver ReferralTest en production
   - Ajouter des commentaires sur la formule de calcul du niveau

---

## 📝 Notes Techniques

### localStorage Structure

```json
{
  "userProgress": {
    "level": 7,
    "xp": 696,
    "totalPoints": 696,
    "completedCourses": ["pi-intro-101"],
    "completedLayers": {},
    "energy": {
      "current": 100,
      "max": 100
    },
    "referralCode": "PIAXXXXX"
  }
}
```

### Calcul du Niveau

```
Niveau = floor(XP / 100) + 1

Exemples:
- 0-99 XP   → Niveau 1
- 100-199   → Niveau 2
- 200-299   → Niveau 3
- ...
- 600-699   → Niveau 7
```

---

**Dernière mise à jour :** 2026-01-02  
**Version :** 1.0  
**Auteur :** Antigravity AI Assistant
