# 🐛 BUG - Cours restent verrouillés malgré le niveau atteint

## 📅 Date: 27 Décembre 2024 - 16h00

---

## 🔍 PROBLÈME SIGNALÉ

L'utilisateur a atteint le niveau requis pour débloquer de nouveaux cours (Ex: "Essentials") mais **les cours restent verrouillés** avec un cadenas 🔒.

### Symptômes

- ✅ XP suffisants accumulés
- ✅ Niveau affiché correctement dans l'interface
- ❌ **Les cours ne se débloquent pas automatiquement**
- ❌ **Message "Niveau X requis" même si l'utilisateur a ce niveau**

---

## 🔎 DIAGNOSTIC

### Vérification 1: Le niveau est-il persisté correctement ?

**Question clé**: Est-ce que `userProgress.level` est bien mis à jour dans Firebase/localStorage ?

Le flux est:

```
1. Utilisateur gagne XP
2. calculateLevelFromXP() est appelé
3. setUserProgress() met à jour le state React
4. useEffect() sauvegarde dans Firebase (avec debounce de 1 seconde)
```

**Problème potentiel #1**: Si la page est rafraîchie avant la sauvegarde, le niveau n'est pas persisté !

### Vérification 2: Comment est chargé le niveau au démarrage ?

**Fichier**: `src/App.tsx` lignes 337-343

```typescript
const savedData = await getUserProfile(auth.user.uid);
if (savedData) {
  setUserProgress(savedData.userProgress || userProgress);
  // ...
}
```

**Problème potentiel #2**: Si `savedData.userProgress` ne contient pas le bon niveau, il remplace le state avec des données anciennes !

### Vérification 3: La logique de déblocage

**Fichier**: `src/services/ProgressionSystem.ts` ligne 35

```typescript
if (course.requiredLevel && userProgress.level < course.requiredLevel) {
  return {
    isUnlocked: false,
    reason: `Niveau ${course.requiredLevel} requis`,
  };
}
```

**Vérification**: Cette logique est correcte. Si `userProgress.level >= course.requiredLevel`, le cours devrait se débloquer.

---

## 🧪 TESTS DE DIAGNOSTIC

### Test #1: Vérifier le niveau dans le state

**Ouvrir la console** (F12) et taper:

```javascript
// Inspecter le state React (si React DevTools installé)
$r.state.userProgress.level;
```

Ou ajouter un `console.log` temporaire dans `CoursesTab.tsx`:

```typescript
console.log("👤 User Level:", userProgress.level);
console.log("📊 Total XP:", userProgress.xp);
console.log("📈 Total Points:", userProgress.totalPoints);
```

### Test #2: Vérifier les données sauvegardées

**Console** (F12):

```javascript
// Vérifier localStorage (si utilisé)
localStorage.getItem("pi-academy-user-data");

// Ou Firebase (depuis les outils de développement)
```

### Test #3: Forcer le recalcul du niveau après rafraîchissement

**Problème**: Si le niveau n'est pas sauvegardé correctement, il faut le recalculer au chargement.

---

## ✅ SOLUTIONS PROPOSÉES

### Solution #1: Recalculer le niveau au chargement ⭐ RECOMMANDÉE

**Modifier**: `src/App.tsx` lignes 337-343

```diff
  const savedData = await getUserProfile(auth.user.uid);
  if (savedData) {
-   setUserProgress(savedData.userProgress || userProgress);
+   // 🐛 FIX: Recalculer le niveau au chargement pour éviter les incohérences
+   const loadedProgress = savedData.userProgress || userProgress;
+   const { level, xpToNext } = calculateLevelFromXP(loadedProgress.xp);
+   setUserProgress({
+     ...loadedProgress,
+     level,  // Niveau recalculé depuis les XP
+     xpToNext
+   });
    setIsPremium(savedData.isPremium || false);
    // ...
  }
```

**Avantage**: Garantit que le niveau est toujours cohérent avec les XP, même si les données sauvegardées sont obsolètes.

### Solution #2: Ajouter un bouton de debug (temporaire)

Pour diagnostiquer le problème, ajouter un bouton de test dans l'interface:

```typescript
<button
  onClick={() => {
    const { level, xpToNext } = calculateLevelFromXP(userProgress.xp);
    console.log("🔍 DEBUG INFO:");
    console.log("XP:", userProgress.xp);
    console.log("Niveau actuel:", userProgress.level);
    console.log("Niveau calculé:", level);
    console.log("XP pour prochain:", xpToNext);

    // Force un recalcul
    setUserProgress((prev) => ({
      ...prev,
      level,
      xpToNext,
    }));
  }}
>
  🔧 Recalculer Niveau
</button>
```

### Solution #3: Log de diagnostic automatique

Ajouter dans `CoursesTab.tsx`:

```typescript
export const CoursesTab: React.FC<CoursesTabProps> = ({
  userProgress,
  onSelectCourse,
}) => {
  // 🐛 DEBUG: Log de diagnostic
  React.useEffect(() => {
    console.log("📊 CoursesTab - User Progress:", {
      level: userProgress.level,
      xp: userProgress.xp,
      totalPoints: userProgress.totalPoints,
      calculatedLevel: Math.floor(userProgress.xp / 100) + 1,
    });

    // Afficher les cours verrouillés
    COURSES.forEach((course) => {
      const status = ProgressionSystem.isCourseUnlocked(course, userProgress);
      if (!status.isUnlocked) {
        console.log(`🔒 ${course.title}:`, status.reason);
      }
    });
  }, [userProgress]);

  // ... rest of component
};
```

---

## 🎯 PLAN D'ACTION IMMÉDIAT

### Étape 1: Appliquer le Fix #1 (Recalcul au chargement)

C'est la solution la plus robuste qui garantit la cohérence.

### Étape 2: Tester

1. Rafraîchir l'application (F5)
2. Vérifier que le niveau est correct
3. Vérifier que les cours se débloquent

### Étape 3: Si le problème persiste

Appliquer le Fix #3 (logs de diagnostic) pour identifier précisément où est le blocage.

---

## 🔍 INFORMATIONS DEMANDÉES À L'UTILISATEUR

Pour mieux diagnostiquer, j'aurais besoin de savoir:

1. **Quel est votre niveau actuel affiché ?** (ex: "Niveau 3")
2. **Combien d'XP avez-vous ?** (ex: "350 XP")
3. **Quel cours essayez-vous de débloquer ?** (ex: "Pi Wallet Mastery")
4. **Quel est le niveau requis pour ce cours ?** (s'affiche dans le message d'erreur)
5. **Que se passe-t-il quand vous cliquez sur le cours verrouillé ?** (message exact)

---

## 📋 TABLEAUX DE VÉRIFICATION

### Niveaux requis pour chaque cours (référence)

| Cours                     | Catégorie    | Niveau Requis | XP Requis |
| ------------------------- | ------------ | ------------- | --------- |
| Introduction à Pi Network | Pi Basics    | 1             | 0         |
| Pi Wallet Mastery         | Essentials   | 2             | 300       |
| Anti-Scam Defense         | Security     | 3             | 500       |
| KYC Process Explained     | Verification | 4             | 800       |
| Blockchain Fundamentals   | Web3         | 5             | 1000      |

### Formule de calcul du niveau

```
Niveau = Math.floor(XP / 100) + 1
```

**Exemples**:

- 0-99 XP → Niveau 1
- 100-199 XP → Niveau 2
- 200-299 XP → Niveau 3
- 300-399 XP → Niveau 4
- 400-499 XP → Niveau 5

---

## 🚀 STATUT

- [x] Problème signalé
- [x] Diagnostic effectué
- [x] Solution #1 proposée (recalcul au chargement)
- [ ] Fix à appliquer
- [ ] Tests à valider

---

**Ce bug empêche la progression normale dans l'application. Il faut le corriger immédiatement !** 🚨
