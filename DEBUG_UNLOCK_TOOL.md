# 🔍 Outil de Diagnostic - Déverrouillage des Cours

## Comment Utiliser Cet Outil

1. Ouvrez l'application : http://localhost:5174/
2. Ouvrez la console développeur (F12)
3. Copiez-collez ce code dans la console :

```javascript
// Diagnostic de l'état utilisateur
const checkUserProgress = () => {
  const savedData = localStorage.getItem("pi_academy_data");

  if (!savedData) {
    console.log("❌ Aucune donnée sauvegardée trouvée");
    return;
  }

  const data = JSON.parse(savedData);
  const progress = data.userProgress;

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 ÉTAT DE PROGRESSION UTILISATEUR");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🎯 Niveau actuel: ${progress.level}`);
  console.log(`⚡ XP actuels: ${progress.xp}`);
  console.log(`📈 XP pour prochain niveau: ${progress.xpToNext}`);
  console.log(`💰 Balance Pi: ${progress.piBalance.toFixed(6)}π`);
  console.log(`🔥 Série: ${progress.streak} jours`);
  console.log(`✅ Cours complétés: ${progress.completedCourses.length}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Vérifier les cours disponibles
  const courses = [
    { id: 1, title: "Introduction à Pi Network", requiredXP: 0 },
    { id: 2, title: "Pi Wallet Mastery", requiredXP: 100 },
    { id: 3, title: "Anti-Scam Defense", requiredXP: 200 },
    { id: 4, title: "KYC Process Explained", requiredXP: 300 },
    { id: 5, title: "Blockchain Fundamentals", requiredXP: 400 },
    { id: 6, title: "Cybersécurité Essentielle", requiredXP: 400 },
    { id: 7, title: "Économie Numérique", requiredXP: 500 },
    { id: 8, title: "Trading Crypto Avancé", requiredXP: 600 },
    { id: 9, title: "DeFi & Smart Contracts", requiredXP: 700 },
  ];

  console.log("📚 ÉTAT DES COURS:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  courses.forEach((course) => {
    const isUnlocked = progress.xp >= course.requiredXP;
    const isCompleted = progress.completedCourses.includes(course.id);
    const requiredLevel = Math.floor(course.requiredXP / 100) + 1;

    const status = isCompleted
      ? "✅ COMPLÉTÉ"
      : isUnlocked
      ? "🔓 DÉBLOQUÉ"
      : "🔒 VERROUILLÉ";
    const info = isUnlocked
      ? ""
      : ` (Besoin de ${course.requiredXP - progress.xp} XP de plus)`;

    console.log(`${status} - ${course.title}`);
    console.log(
      `   📌 Requis: ${course.requiredXP} XP (Niveau ${requiredLevel})${info}`
    );
  });

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  // Calculer la progression globale
  const unlockedCount = courses.filter(
    (c) => progress.xp >= c.requiredXP
  ).length;
  const completedCount = progress.completedCourses.length;

  console.log("📊 RÉSUMÉ:");
  console.log(`🔓 Cours débloqués: ${unlockedCount}/${courses.length}`);
  console.log(`✅ Cours complétés: ${completedCount}/${courses.length}`);
  console.log(
    `🎯 Progression: ${Math.round((completedCount / courses.length) * 100)}%`
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
};

// Exécuter le diagnostic
checkUserProgress();
```

## 🎯 Interprétation des Résultats

### Statuts des Cours

- **✅ COMPLÉTÉ** : Vous avez terminé ce cours avec succès
- **🔓 DÉBLOQUÉ** : Vous pouvez commencer ce cours maintenant
- **🔒 VERROUILLÉ** : Vous devez gagner plus d'XP pour débloquer ce cours

### Votre Situation (Niveau 6, 518 XP)

Avec 518 XP, vous devriez voir :

| Cours                     | XP Requis | Status Attendu                   |
| ------------------------- | --------- | -------------------------------- |
| Introduction à Pi Network | 0 XP      | ✅ ou 🔓                         |
| Pi Wallet Mastery         | 100 XP    | 🔓 DÉBLOQUÉ                      |
| Anti-Scam Defense         | 200 XP    | 🔓 DÉBLOQUÉ                      |
| KYC Process Explained     | 300 XP    | 🔓 DÉBLOQUÉ                      |
| Blockchain Fundamentals   | 400 XP    | 🔓 DÉBLOQUÉ                      |
| Cybersécurité Essentielle | 400 XP    | 🔓 DÉBLOQUÉ                      |
| Économie Numérique        | 500 XP    | 🔓 DÉBLOQUÉ                      |
| Trading Crypto Avancé     | 600 XP    | 🔒 VERROUILLÉ (82 XP manquants)  |
| DeFi & Smart Contracts    | 700 XP    | 🔒 VERROUILLÉ (182 XP manquants) |

**Total débloqué : 7/9 cours** 🎉

## 🔄 Réinitialiser la Progression (Si Nécessaire)

Si vous rencontrez toujours des problèmes, vous pouvez réinitialiser complètement votre progression :

```javascript
// ⚠️ ATTENTION : Cela supprimera TOUTE votre progression !
localStorage.removeItem("pi_academy_data");
location.reload();
```

## 📝 Mettre à Jour Manuellement Votre XP (Pour Tests)

```javascript
// Augmenter vos XP à 600 pour tester le déverrouillage
const data = JSON.parse(localStorage.getItem("pi_academy_data"));
data.userProgress.xp = 600;
data.userProgress.level = Math.floor(600 / 100) + 1;
localStorage.setItem("pi_academy_data", JSON.stringify(data));
location.reload();
```

## 🐛 Signaler un Problème

Si après avoir appliqué le correctif, un cours reste verrouillé alors qu'il devrait être débloqué :

1. Exécutez le diagnostic ci-dessus
2. Notez :
   - Votre XP actuel
   - Le cours qui pose problème
   - Les XP requis pour ce cours
3. Vérifiez la console pour les erreurs JavaScript

---

**Astuce :** Sauvegardez ce document pour un accès rapide au diagnostic !
