# 🚀 CODE PRÊT À COPIER-COLLER - App.tsx

## ✅ IMPORTS ET STATES - DÉJÀ FAIT !

Les imports et states sont déjà ajoutés:

- ✅ ProgressionSystem imported
- ✅ CourseCard imported
- ✅ DecisionLab imported
- ✅ showDecisionLab, currentScenario states ajoutés
- ✅ handleDecisionLabComplete créé

---

## 📋 DERNIÈRE ÉTAPE: RENDU DES COURS

### Trouver la section Courses Tab

Dans votre `App.tsx`, trouvez l'endroit où vous affic

hez la liste des cours (probablement dans un `activeTab === 'courses'` ou similaire).

### Remplacer cette section par:

```tsx
{
  /* 📚 COURSES TAB - Progressive Unlocking */
}
{
  activeTab === "courses" && (
    <div className="space-y-8 p-6">
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

      {(() => {
        // Organize courses by category with unlock status
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

      {/* Recommended Next Course */}
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

---

## 🎬 RENDU CONDITIONNEL DECISION LAB

Dans la partie du return principal, AVANT le rendu du DiscoveryViewer, ajoutez:

```tsx
{
  /* Decision Lab View */
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

{
  /* Discovery Viewer - Already exists */
}
{
  showDiscovery && selectedLayer?.discoveryContent && (
    <DiscoveryViewer
      content={selectedLayer.discoveryContent}
      onComplete={handleDiscoveryComplete}
      onClose={() => setShowDiscovery(false)}
    />
  );
}
```

---

## 🧠 MODIFIER LAYERSELECTOR (Si vous l'utilisez)

Si vous utilisez LayerSelector component, modifiez son onSelectLayer pour gérer decision-lab:

```tsx
<LayerSelector
  layers={selectedCourse.layers}
  completedLayers={userProgress.completedLayers[selectedCourse.id] || []}
  onSelectLayer={(layer) => {
    // Check energy
    const canAccess = EnergySystem.hasEnoughEnergy(
      userProgress.energy,
      layer.energyCost
    );
    if (!canAccess) {
      const freshEnergy = EnergySystem.calculateCurrentEnergy(
        userProgress.energy
      );
      alert(
        `⚠️ Énergie insuffisante!\n\nRequis: ${layer.energyCost}⚡\nActuel: ${freshEnergy.current}⚡`
      );
      return;
    }

    // Consume energy
    const newEnergyState = EnergySystem.consumeUnsafe(
      userProgress.energy,
      layer.energyCost
    );
    setUserProgress((prev) => ({ ...prev, energy: newEnergyState }));

    // Handle layer type
    setSelectedLayer(layer);

    if (layer.type === "decision-lab") {
      // Find decision scenario
      const scenario = DECISION_SCENARIOS.find(
        (s) => s.id === layer.decisionScenarioId
      );
      if (!scenario) {
        alert("Scénario non trouvé!");
        return;
      }
      setCurrentScenario(scenario);
      setShowDecisionLab(true);
      setShowCourseDetail(false);
    } else if (layer.type === "discovery") {
      // Enrich with discovery content
      const enrichedContent = enrichDiscoveryLayer(layer.id);
      if (enrichedContent) {
        setSelectedLayer({ ...layer, discoveryContent: enrichedContent });
      }
      setShowDiscovery(true);
      setShowCourseDetail(false);
    } else if (layer.type === "comprehension" || layer.type === "application") {
      // Start quiz
      if (!layer.questions || layer.questions.length === 0) {
        alert("Aucune question disponible pour ce layer.");
        return;
      }
      setCurrentQuestion(0);
      setScore(0);
      setAnswers([]);
      setQuizActive(true);
      setShowCourseDetail(false);
    }
  }}
  onClose={() => {
    setShowCourseDetail(false);
    setSelectedCourse(null);
  }}
/>
```

---

## ✅ C'EST TOUT !

Avec ces 3 ajouts, votre système de progression est 100% fonctionnel:

1. ✅ Courses tab avec CourseCard et locks
2. ✅ Decision Lab rendering
3. ✅ Layer selection avec decision-lab support

---

## 🧪 TESTING

Après avoir ajouté le code:

1. Rafraîchissez l'app
2. Allez dans "Courses"
3. Vous devriez voir:
   - ✅ Seulement "Introduction à Pi" débloqué au niveau 1
   - ✅ Autres cours grisés avec 🔒
   - ✅ Prérequis affichés quand on clique un cours verrouillé
4. Completez un quiz → gagnez XP → nouveaux cours se débloquent!

---

## 🎉 FÉLICITATIONS!

Vous avez maintenant:

- 🎯 Système de progression intelligent
- 🧠 Decision Labs (simulations cognitives)
- 🎬 Discovery enrichi (5 formats)
- 💰 Modèle économique multi-millions
- 📚 Documentation complète

**Pioneer Academy est maintenant un système éducatif AAA!** 🚀
