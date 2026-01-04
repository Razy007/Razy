# 🎯 GUIDE ÉTAPE PAR ÉTAPE - AJOUTS FINAUX

Vu que votre App.tsx a une structure spécifique, voici le guide adaptéà **3 ajouts simples** à faire.

---

## ✅ PRÉPARATION

Vous avez déjà:

- ✅ Imports (ProgressionSystem, CourseCard, DecisionLab)
- ✅ States (showDecisionLab, currentScenario)
- ✅ Handler (handleDecisionLabComplete)

---

## 📋 AJOUT #1: RENDU DECISION LAB

### Où?

Juste AVANT la fermeture du div principal (avant `</div>` final), cherchez la ligne qui ressemble à :

```tsx
{/* Energy Shop Modal */}
{showEnergyShop && (
```

### Ajouter JUSTE AVANT cette ligne:

```tsx
{
  /* Decision Lab Modal */
}
{
  showDecisionLab && currentScenario && (
    <DecisionLab
      scenario={currentScenario}
      onComplete={handleDecisionLabComplete}
      onClose={() => {
        setShowDecisionLab(false);
        setShowCourseDetail(true);
        setCurrentScenario(null);
      }}
    />
  );
}
```

**RÉSULTAT**: Decision Lab s'affichera quand un layer decision-lab est sélectionné.

---

## 📋 AJOUT #2: TAB COURSES AVEC PROGRESSION

### Où?

Cherchez dans votre fichier une section qui affiche les cours. Ça pourrait être:

- Un map sur COURSES
- activeTab === 'courses'
- Une liste de cours

Si vous ne trouvez PAS de section courses existante, créez-la.

### Si AUCUNE section courses n'existe, ajouter:

```tsx
{
  /* COURSES TAB avec Progressive Unlocking */
}
{
  activeTab === "courses" && !showCourseDetail && (
    <div className="space-y-8 p-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-3xl font-bold flex items-center gap-3">
          <Book size={32} className="text-yellow-400" />
          Cours Disponibles
        </h2>
        <div className="text-white/60 text-sm">
          <span className="text-yellow-400 font-bold">
            Niveau {userProgress.level}
          </span>{" "}
          • {userProgress.totalPoints} XP
        </div>
      </div>

      {/* Courses by Category */}
      {(() => {
        const organized = ProgressionSystem.organizeCoursesByCategory(
          COURSES,
          userProgress
        );

        return Array.from(organized.entries()).map(
          ([category, coursesData]) => (
            <div key={category} className="mb-8">
              <h3 className="text-white font-bold text-2xl mb-4 flex items-center gap-2">
                <ChevronRight size={24} className="text-yellow-400" />
                {category}
              </h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {coursesData.map(({ course, unlockStatus, progress }) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    unlockStatus={unlockStatus}
                    progress={progress}
                    onSelect={() => {
                      if (unlockStatus.isUnlocked) {
                        setSelectedCourse(course);
                        setShowCourseDetail(true);
                      } else {
                        alert(
                          `🔒 Cours verrouillé\n\n${unlockStatus.reason}\n\nContinuez votre progression pour le débloquer!`
                        );
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          )
        );
      })()}

      {/* Recommended Course */}
      {(() => {
        const recommended = ProgressionSystem.recommendNextCourse(
          COURSES,
          userProgress
        );
        if (recommended) {
          const recommendedProgress = ProgressionSystem.calculateCourseProgress(
            recommended,
            userProgress
          );
          return (
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400/50 rounded-xl p-6 mt-8">
              <h3 className="text-yellow-400 font-bold text-xl mb-2 flex items-center gap-2">
                <Target size={24} />
                💡 Recommandé pour vous
              </h3>
              <p className="text-white mb-4">
                Continue ta progression avec ce cours:
              </p>
              <CourseCard
                course={recommended}
                unlockStatus={{ isUnlocked: true }}
                progress={recommendedProgress}
                onSelect={() => {
                  setSelectedCourse(recommended);
                  setShowCourseDetail(true);
                }}
              />
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
}
```

**RÉSULTAT**: Liste de cours avec locks, progress bars, et recommendations!

---

## 📋 AJOUT #3: SUPPORT DECISION-LAB DANS LAYER SELECTION

### Où?

Cherchez dans votre code l'endroit où vous gérez la sélection d'un layer.

Ça pourrait être:

- Un `onSelectLayer` callback
- Un bouton qui lance un quiz
- Une fonction qui gère les layers

### Si vous avez déjà un layer selector existant:

Modifiez-le pour ajouter le cas `decision-lab`. Cherchez un `if (layer.type === ...)` et ajoutez:

```tsx
if (layer.type === "decision-lab") {
  // Find decision scenario
  const scenario = DECISION_SCENARIOS.find(
    (s) => s.id === layer.decisionScenarioId
  );
  if (!scenario) {
    alert("Scénario non trouvé!");
    return;
  }

  // Consume energy
  const newEnergyState = EnergySystem.consumeUnsafe(
    userProgress.energy,
    layer.energyCost
  );
  setUserProgress((prev) => ({ ...prev, energy: newEnergyState }));

  // Show Decision Lab
  setSelectedLayer(layer);
  setCurrentScenario(scenario);
  setShowDecisionLab(true);
  setShowCourseDetail(false);
} else if (layer.type === "discovery") {
  // ... existing discovery logic ...
} else if (layer.type === "comprehension" || layer.type === "application") {
  // ... existing quiz logic ...
}
```

**RÉSULTAT**: Decision Labs se lancent quand l'utilisateur sélectionne un layer decision-lab!

---

## 🧪 TESTER

Après avoir fait ces 3 ajouts:

### Test 1: Courses Tab

1. Rafraîchissez l'app
2. Cliquez sur tab "Courses"
3. ✅ Devriez voir: "Introduction à Pi" débloqué
4. ✅ Autres cours grisés avec 🔒
5. ✅ Cliquez sur cours verrouillé → Message de prérequis

### Test 2: Decision Lab

1. Ajoutez temporairement un layer decision-lab à un cours:

```tsx
// Dans courses.ts, dans un cours accessible:
{
  id: 'test-decision-lab',
  type: 'decision-lab',
  title: 'Lab: Test Decision',
  description: 'Test du Decision Lab',
  decisionScenarioId: 'dao-crisis-1',
  requiredMastery: 0,
  energyCost: 10,
  xpReward: 100,
  cooldownMinutes: 0
}
```

2. Sélectionnez ce layer
3. ✅ Decision Lab devrait s'ouvrir avec le scénario
4. ✅ Faites un choix → Rewards affichés

### Test 3: Progression

1. Complétez "Introduction à Pi"
2. Gagnez du XP → Niveau monte
3. ✅ Nouveaux cours se débloquent automatiquement

---

## 🚨 SI PROBLÈMES

### Cours ne s'affichent pas?

Vérifiez que vous avez bien `activeTab === 'courses'` dans la condition.

### Decision Lab ne s'ouvre pas?

Vérifiez:

- `decisionScenarioId` existe dans DECISION_SCENARIOS
- States (showDecisionLab, currentScenario) sont bien définis
- Imports en haut du fichier

### Locks ne fonctionnent pas?

Vérifiez que `userProgress` contient bien:

- `level`
- `totalPoints`
- `completedCourses[]`

---

## ✅ APRÈS AVOIR TOUT AJOUTÉ

Vous aurez:

- 🎯 Système de progression complet
- 🧠 Decision Labs fonctionnels
- 🎬 Discovery enrichi (déjà fait)
- 💰 Prêt pour la boutique

**Total code ajouté: ~150 lignes**
**Temps estimé: 30-45min**

---

## 💡 CONSEIL PRO

Faites un ajout à la fois:

1. Ajout #1 → Testez
2. Ajout #2 → Testez
3. Ajout #3 → Testez

Comme ça, si quelque chose ne marche pas, vous savez exactement où regarder!

---

**Prêt à commencer ? Suivez dans l'ordre: #1, #2, #3 ! 🚀**
