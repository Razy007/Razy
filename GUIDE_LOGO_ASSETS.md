# 🎨 LOGO & ASSETS - SOUMISSION PI NETWORK

**Date**: 2026-01-07 19:00  
**Pour**: Soumission Pi Developer Portal  
**Application**: Academy of Pi

---

## 📦 FICHIERS LOGO DISPONIBLES

### 1. Logo Principal (SVG)

**Emplacement**: `public/logo.svg`

**Spécifications**:
- Format: SVG (vectoriel, scalable)
- Dimensions: Adaptable (vectoriel)
- Couleurs: Gradient Orange (#FFA500 → #FF6B35)
- Symbole: π (Pi grec) stylisé
- Texte: "Academy of Pi" + "Learn • Earn • Grow"

**Utilisation**:
- Header de l'application
- Écran de chargement
- Pages légales
- Composant React (`<Logo />`)

---

### 2. Favicon (SVG)

**Emplacement**: `public/favicon.svg`

**Spécifications**:
- Format: SVG
- Symbole: π (Pi grec) simple
- Couleurs: Gradient Orange
- Usage: Icône navigateur

---

## 🎯 POUR PI DEVELOPER PORTAL

### Formats requis par Pi Network:

**1. Application Icon (512x512 PNG)**

**À créer depuis le SVG**:
1. Ouvrir `public/logo.svg` dans un éditeur (Inkscape, Adobe Illustrator, ou en ligne)
2. Exporter en PNG
3. Résolution: **512x512 pixels**
4. Background: **Transparent OU violet (#5B21B6)**

---

### 2. Banner Image (1920x1080 PNG)

**Image pour la vitrine Pi Browser**:
- Dimensions: 1920x1080 pixels
- Contenu suggéré:
  - Logo central
  - Titre "Academy of Pi"  
  - Slogan "Learn • Earn • Grow"
  - Visuel attractif (gradient violet/orange)
  - Screenshots de l'app

---

## 🛠️ COMMENT CRÉER LES ASSETS

### Option A: En ligne (GRATUIT et RAPIDE)

**1. Convertir SVG → PNG** :

**Site recommandé**: https://cloudconvert.com/svg-to-png

**Étapes**:
1. Allez sur https://cloudconvert.com/svg-to-png
2. Upload `public/logo.svg`
3. Configurez:
   - Width: 512px
   - Height: 512px
   - Maintain aspect ratio: ✅
4. Convert
5. Download **logo_512x512.png**

---

**2. Créer Banner 1920x1080**:

**Site recommandé**: https://www.canva.com/ (gratuit)

**Template suggéré**:
```
┌─────────────────────────────────────┐
│                                     │
│          [LOGO 200x200]             │
│                                     │
│        ACADEMY OF PI                │
│      Learn • Earn • Grow            │
│                                     │
│   [Screenshot App] [Screenshot]     │
│                                     │
│    "Master Pi Network Ecosystem"    │
│                                     │
└─────────────────────────────────────┘
```

**Couleurs**:
- Background: Gradient violet (#5B21B6 → #1E1B4B → #000000)
- Texte: Jaune/Or (#FBBF24)
- Accents: Orange (#FF6B35)

---

### Option B: Automatique (Script)

Je peux créer un script Node.js qui génère automatiquement:
- logo_512x512.png
- banner_1920x1080.png

**Dites-moi si vous préférez cette option !**

---

## 📋 CHECKLIST ASSETS PI NETWORK

**Fichiers à préparer**:

- [ ] **App Icon** (512x512 PNG)
  - Nom: `academy_of_pi_icon_512.png`
  - Background: Transparent ou violet
  - Centré, logovardy
  
- [ ] **Banner** (1920x1080 PNG)
  - Nom: `academy_of_pi_banner.png`
  - Attractive, professional
  - Logo + Title + Screenshots

- [ ] **Screenshots** (recommandé 3-5):
  - Courses page
  - Leaderboard
  - Social feed
  - Profile
  - Energy shop

---

## 📱 SCREENSHOTS RECOMMANDÉS

**Pour Pi Developer Portal showcase**:

1. **Homepage (Courses)**:
   - Montre XP Progress Indicator
   - Difficulty badges visibles
   - Coming Soon section

2. **Leaderboard**:
   - Top players
   - Classement

3. **Social Feed**:
   - Posts communauté
   - Interactions

4. **Profile**:
   - Stats utilisateur
   - Sync button visible

5. **Course Content**:
   - Un cours ouvert
   - Contenu éducatif

**Dimensions**: 
- Mobile: 375x667 (iPhone SE) ou 390x844 (iPhone 13)
- OU Desktop: 1280x720

---

## 🎨 COULEURS OFFICIELLES (à donner à Core Team)

```css
/* Primary Colors */
--primary-orange: #FF6B35;
--primary-yellow: #FBBF24;
--primary-purple: #5B21B6;

/* Gradients */
--gradient-bg: linear-gradient(135deg, #5B21B6 0%, #1E1B4B 50%, #000000 100%);
--gradient-logo: linear-gradient(135deg, #FFA500 0%, #FF6B35 100%);

/* Accents */
--accent-green: #10B981;
--accent-blue: #3B82F6;
```

---

## 📝 DESCRIPTION APP (Pour Portal)

**Short Description** (160 chars max):
```
Learn Pi Network, earn rewards, and grow in the ecosystem. 
Educational platform with gamified learning experience.
```

**Full Description**:
```
Academy of Pi is the premier educational platform for the Pi Network ecosystem. 
Master blockchain fundamentals, wallet security, DeFi, and more through 
interactive courses, quizzes, and real-world scenarios.

Features:
✅ Progressive difficulty levels (Beginner → Expert)
✅ Earn Pi rewards for learning
✅ XP & leveling system
✅ Community leaderboard
✅ Social features
✅ Staking & Energy system
✅ Multilingual (French & English)

Start your Pi Network journey today!
```

---

## 🔗 LIENS À FOURNIR (Portal)

```yaml
App Name: Academy of Pi
App URL: https://www.pioneeracademy.academy
Privacy Policy: https://www.pioneeracademy.academy/privacy
Terms of Service: https://www.pioneeracademy.academy/terms
Support Email: support@pioneeracademy.academy
Category: Education
Tags: education, learning, blockchain, defi, gamification
```

---

## 🎯 FICHIERS ACTUELS DISPONIBLES

**Dans votre projet**:
```
public/
├── logo.svg           ✅ (Source principale)
├── favicon.svg        ✅ (Icône navigateur)
└── logo.png           ❌ (À créer - 512x512)
```

**À créer**:
- `logo_512x512.png` (pour Pi Portal)
- `banner_1920x1080.png` (pour Pi Portal)
- Screenshots (3-5 images)

---

## 🚀 PROCHAINES ÉTAPES

### Immédiat:

1. **Créer logo PNG 512x512**:
   - Via CloudConvert (lien ci-dessus)
   - OU me dire et je génère un script

2. **Créer banner 1920x1080**:
   - Via Canva (gratuit)
   - OU je peux vous donner template HTML

3. **Prendre screenshots**:
   - Depuis http://localhost:5173/
   - Utiliser F12 → Device Toggle (iPhone 13)
   - Screenshot chaque page principale

### Après création assets:

4. Remplir Pi Developer Portal
5. Upload assets
6. Soumettre pour review

---

## 💡 QUESTION

**Voulez-vous que je**:

**A**. Vous guide étape par étape avec CloudConvert + Canva (GRATUIT)  
**B**. Crée un script automatique pour générer les PNGs  
**C**. Vous donne un template HTML pour le banner  

**Choisissez A, B ou C !**

---

**Dernière mise à jour**: 2026-01-07 19:00  
**Status Logo**: ✅ SVG disponible, PNG à créer  
**Temps estimé**: 15-30 minutes pour tous les assets
