# 🔍 VÉRIFICATION COMPLÈTE PRÉ-DÉPLOIEMENT

**Date**: 2026-01-07 19:25  
**Application**: Academy of Pi  
**Status**: En cours de vérification

---

## 1. 🌍 SYSTÈME i18n (FRANÇAIS/ANGLAIS)

### A. Switch de Langue

**Emplacement à vérifier**:
- Header App.tsx (bouton FR/EN)
- Toutes les pages traduites
- Cours (courses.ts avec getCourses(lang))
- Composants utilisant useTranslation()

**Points critiques**:
- [ ] Bouton switch langue visible
- [ ] onChange persiste dans localStorage
- [ ] Tous les textes UI changent
- [ ] Cours changent de langue
- [ ] Questions de quiz traduites

---

## 2. 💰 MODÈLE ÉCONOMIQUE

### A. Pi Cryptocurrency

#### Source de Pi:
1. **Rewards cours** (courses.ts - piReward)
2. **Staking rewards** (calculateReward)
3. **Referral bonuses**
4. **Ads watched** (0.0001π per ad)

#### Dépenses Pi:
1. **Energy shop** (EnergyShop.tsx)
2. **Premium upgrade** (0.01π)
3. **Shop items**

**À vérifier**:
- [ ] Balance Pi visible (header)
- [ ] Rewards ajoutés après cours
- [ ] Staking fonctionne
- [ ] Transactions Pi SDK
- [ ] Balance persiste (localStorage + Firebase)

---

### B. Système XP

#### Sources XP:
- **Layers discovery**: 50-100 XP
- **Quiz réussis**: 100-200 XP
- **Bonus streak**: +10%
- **Decision Labs**: 150 XP

#### Utilisation XP:
- **Déblocage cours** (requiredXP)
- **Leveling** (100 XP/level)
- **Leaderboard ranking**

**À vérifier**:
- [ ] XP s'incrémente correctement
- [ ] Level up automatique (100 XP = +1 level)
- [ ] XP Progress Indicator affiche bon calcul
- [ ] xpToNext correct
- [ ] Déblocage cours selon XP

---

### C. Système Énergétique

#### Recharge:
- **Capacité**: 100 energy max
- **Recharge**: 1 energy / 6 minutes
- **Premium**: 200 energy max, 1 energy / 3 min

#### Consommation:
- **Discovery layer**: 0 energy (gratuit)
- **Quiz layer**: 5-15 energy selon difficulté
- **Retry quiz**: 10 energy

**À vérifier**:
- [ ] Energy visible (header)
- [ ] Consommation correcte
- [ ] Recharge automatique (6 min)
- [ ] Energy shop fonctionne
- [ ] Premium double capacité

---

### D. Système Staking

**Mécanisme**:
```typescript
Deposit → Lock period → APR interest → Claim rewards
```

**Paramètres**:
- 7 jours: 5% APR
- 30 jours: 10% APR
- 90 jours: 15% APR

**À vérifier**:
- [ ] Staking interface accessible
- [ ] Deposit fonctionne
- [ ] Rewards calculés correctement
- [ ] Expiration respectée
- [ ] Claim rewards fonctionne
- [ ] Balance restante après stake

---

## 3. 🎓 SYSTÈME ÉDUCATIF

### A. Déblocage Cours

**Logique**:
```typescript
Course unlocked IF:
  - level >= requiredLevel AND
  - xp >= requiredXP AND
  - prerequisite courses completed
```

**À vérifier**:
- [ ] Cours initiala débloqués (Pi Intro)
- [ ] Cours verrouillés affichent requis
- [ ] Déblocage automatique quand conditions remplies
- [ ] Message clair si locked
- [ ] Progression visible

---

### B. Système Layers

**Types**:
1. **Discovery** (lecture) - 0 energy
2. **Comprehension** (quiz) - 5-15 energy
3. **Quiz** (advanced) - 15+ energy

**À vérifier**:
- [ ] Discovery affiche contenu
- [ ] Markdown render correctement
- [ ] Quiz questions chargent
- [ ] Answres validation correcte
- [ ] Retry system fonctionne
- [ ] Cooldowns respectés

---

### C. Questions Bank

**Vérification**:
- [ ] Questions en FR et EN
- [ ] getLayerQuestions(id, lang) fonctionne
- [ ] Randomization active
- [ ] Pas de questions dupliquées
- [ ] Explanations affichées

---

## 4. 📱 INTERFACE UTILISATEUR

### A. Navigation

**Bottom Nav (4 tabs)**:
- [ ] Courses
- [ ] Leaderboard
- [ ] Social
- [ ] Shop

**Routes**:
- [ ] / (Courses)
- [ ] /leaderboard
- [ ] /social
- [ ] /shop
- [ ] /profile
- [ ] /privacy
- [ ] /terms

---

### B. Header

**Éléments**:
- [ ] Logo cliquable
- [ ] Energy display
- [ ] Pi balance
- [ ] Language switch (FR/EN)
- [ ] Profile access

---

### C. Footer

**Liens légaux**:
- [ ] Privacy Policy
- [ ] Terms of Service
- [ ] Support email
- [ ] Copyright

---

## 5. 🔐 AUTHENTIFICATION

### A. Pi Network Auth

**Flow**:
```
1. Login screen
2. Connect with Pi / Guest Mode
3. Pi SDK authenticate
4. Load user data
5. Redirect to app
```

**À vérifier**:
- [ ] Pi SDK initialisé
- [ ] sandbox mode (dev) / production mode
- [ ] Guest mode fonctionne
- [ ] User data loaded
- [ ] Logout fonctionne

---

### B. Data Persistence

**localStorage**:
- [ ] userProgress sauvegardé
- [ ] isPremium sauvegardé
- [ ] socialPosts sauvegardés
- [ ] profilePicture sauvegardé

**Firebase (backup)**:
- [ ] Auto-save toutes les 30s
- [ ] Cross-device sync

---

## 6. 🎮 FONCTIONNALITÉS SOCIALES

### A. Posts

**Actions**:
- [ ] Créer post
- [ ] Modifier post
- [ ] Supprimer post
- [ ] Liker post
- [ ] Commenter post

---

### B. Comments

**Actions**:
- [ ] Ajouter commentaire
- [ ] Répondre à commentaire
- [ ] Liker commentaire
- [ ] Supprimer commentaire

**Bug précédent**:
- [ ] Barre commentaire se rétracte après envoi

---

### C. Leaderboard

**Affichage**:
- [ ] Top 100 users
- [ ] Tri par XP
- [ ] Position actuelle visible
- [ ] Avatar/username affichés

---

## 7. 🛒 BOUTIQUE

### A. Energy Shop

**Items**:
- [ ] +20 Energy (0.0001π)
- [ ] +50 Energy (0.0002π)
- [ ] +100 Energy (0.0005π)

**Vérification**:
- [ ] Prix affichés
- [ ] Achat fonctionne
- [ ] Energy ajoutée
- [ ] Balance déduite
- [ ] i18n correct (FR/EN)

---

### B. Items Shop

**Items disponibles**:
- [ ] Badges
- [ ] Avatars
- [ ] Boosters
- [ ] Themes

**Achat**:
- [ ] Confirmation modal
- [ ] Transaction Pi
- [ ] Item ajouté à inventaire

---

## 8. 🎯 SYSTEM CRITIQUES

### A. Progression System

**Vérifications**:
- [ ] calculateXP correct
- [ ] levelUp automatique
- [ ] unlockCourse correct
- [ ] isCourseUnlocked correct

---

### B. Cooldown Manager

**Fonctionnement**:
- [ ] Cooldowns enregistrés
- [ ] Timer affiché
- [ ] Déblocage automatique
- [ ] Persist après refresh

---

### C. Retry System

**Logique**:
- [ ] Max 3 retries/layer
- [ ] Coût: 10 energy/retry
- [ ] History sauvegardée
- [ ] Reset après success

---

## 9. 🐛 BUGS CONNUS (CORRIGÉS)

- [x] ✅ Navigation Privacy/Terms (déconnexion)
- [x] ✅ Barre progression XP manquante
- [x] ✅ Bouton sync disparu
- [x] ✅ Bug "Chargement..."
- [x] ✅ Footer légal manquant
- [x] ✅ Emails contact manquants

---

## 10. 🚀 CHECKLIST FINALE

### Avant Déploiement:

**Code**:
- [ ] Pas d'erreurs TypeScript
- [ ] Pas de console.error()
- [ ] Pas de TODO critiques
- [ ] Build production réussi

**Fonctionnel**:
- [ ] Toutes fonctionnalités testées
- [ ] i18n FR/EN vérifié
- [ ] Modèle économique validé
- [ ] Progression course testée

**Performance**:
- [ ] Bundle size < 5 MB
- [ ] First load < 3s
- [ ] No memory leaks

**Conformité**:
- [ ] Privacy/Terms accessibles
- [ ] Emails fonctionnels
- [ ] Pi Network SDK correct

---

## 📊 RÉSULTAT

**À compléter après vérification...**

---

**Prochaine étape**: Lancer tests automatisés
