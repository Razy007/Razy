# 🐛 DEBUG COURSE UNLOCKING - GUIDE UTILISATEUR

## PROBLÈME CONSTATÉ
Le cours "Fondamentaux Pi Network" est marqué TERMINÉ à 100%, mais "Maîtrise du Wallet Pi" reste verrouillé.

---

## 🔍 DIAGNOSTIC ÉTAPE PAR ÉTAPE

### ÉTAPE 1 : Vérifier localStorage

1. Ouvrez l'application dans le navigateur (http://localhost:5173)
2. Appuyez sur **F12** pour ouvrir la console développeur
3. Allez dans l'onglet **Console**
4. Tapez cette commande et appuyez sur Entrée :

```javascript
const user = JSON.parse(localStorage.getItem('pi_user'));
console.log('📊 USER PROGRESS:', {
  level: user.userProgress.level,
  xp: user.userProgress.cumulatedXP,
  completedCourses: user.userProgress.completedCourses,
  completedLayers: user.userProgress.completedLayers
});
```

### ÉTAPE 2 : Vérifier les prérequis du Cours 2

Vérifiez que le cours 1 (`pi-intro-101`) est dans `completedCourses` :

```javascript
const user = JSON.parse(localStorage.getItem('pi_user'));
const hasCourse1 = (user.userProgress.completedCourses || []).includes('pi-intro-101');
console.log('✅ Cours 1 terminé ?', hasCourse1);
console.log('📝 Courses terminés:', user.userProgress.completedCourses);
```

### ÉTAPE 3 : Forcer le déblocage (si nécessaire)

Si `completedCourses` ne contient PAS `'pi-intro-101'`, forcez l'ajout :

```javascript
const user = JSON.parse(localStorage.getItem('pi_user'));
if (!user.userProgress.completedCourses) {
  user.userProgress.completedCourses = [];
}
if (!user.userProgress.completedCourses.includes('pi-intro-101')) {
  user.userProgress.completedCourses.push('pi-intro-101');
  localStorage.setItem('pi_user', JSON.stringify(user));
  console.log('✅ Cours 1 ajouté à completedCourses. Rechargez la page (F5)');
}
```

### ÉTAPE 4 : Recharger et vérifier

1. Rechargez la page (**F5** ou **Ctrl+R**)
2. Vérifiez si "Maîtrise du Wallet Pi" est débloqué
3. Vérifiez les logs dans la console :

```
[CoursesPage] ✅ Prereq pi-intro-101 found in completedCourses
```

---

## 🔧 SI LE PROBLÈME PERSISTE

### Copier-Coller cette commande complète

```javascript
// RESET ET FORCE COMPLETION
const user = JSON.parse(localStorage.getItem('pi_user'));

// S'assurer que completedCourses existe
if (!user.userProgress.completedCourses) {
  user.userProgress.completedCourses = [];
}

// Marquer cours 1 comme terminé
if (!user.userProgress.completedCourses.includes('pi-intro-101')) {
  user.userProgress.completedCourses.push('pi-intro-101');
}

// Vérifier que toutes les layers du cours 1 sont complétées
const course1Layers = ['pi-l1-discovery', 'pi-l2-quiz', 'pi-l3-comprehension', 'pi-l4-smartlab', 'pi-l5-quiz'];
if (!user.userProgress.completedLayers['pi-intro-101']) {
  user.userProgress.completedLayers['pi-intro-101'] = [];
}
course1Layers.forEach(layerId => {
  if (!user.userProgress.completedLayers['pi-intro-101'].includes(layerId)) {
    user.userProgress.completedLayers['pi-intro-101'].push(layerId);
  }
});

// Sauvegarder
localStorage.setItem('pi_user', JSON.stringify(user));

console.log('✅ CORRECTION APPLIQUÉE. Rechargez la page maintenant (F5)');
console.log('📊 Completed Courses:', user.userProgress.completedCourses);
console.log('📋 Completed Layers:', user.userProgress.completedLayers['pi-intro-101']);
```

---

## 📝 ENVOYEZ-MOI CES INFORMATIONS

Après avoir exécuté ces commandes, envoyez-moi :

1. Le contenu de `completedCourses`
2. Le niveau et XP actuel
3. Si le cours 2 se débloque ou non
4. Toute erreur affichée en console

---

## 🎯 PROCHAINES ÉTAPES

Une fois que nous aurons identifié la cause exacte :
- Je corrigerai le bug dans le code
- Je rebuild l'application
- Je déploierai sur le VPS
