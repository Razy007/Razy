# 🔍 ANALYSE ARCHITECTURE QUIZ - APP.TSX

**Date** : 2026-01-08 23:43 UTC  
**Fichier analysé** : `src/App.tsx`  
**Lignes totales** : 2070

---

## 📊 COMPOSANTS QUIZ IDENTIFIÉS

### **1. Fonctions Principales**

| Fonction | Lignes | Rôle |
|----------|--------|------|
| `startQuiz` | 935-977 | Initialise quiz, randomize questions |
| `handleAnswer` | 979-1007 | **Validation réponse** ⭐ (CIBLE pour anti-triche) |
| `completeQuiz` | 1009-1122 | Calcule score, XP, Pi, sauvegarde |

---

### **2. État Quiz**

```typescript
// Ligne 102
const [randomizedQuestions, setRandomizedQuestions] = useState<QuizQuestion[]>([]);

// Questions quiz
const [quizActive, setQuizActive] = useState(false);
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [answers, setAnswers] = useState<any[]>([]);
```

---

### **3. Flux Actuel (SANS Anti-Triche)**

```
User clique réponse
   ↓
handleAnswer(answerIndex)
   ↓
const isCorrect = answerIndex === questions[currentQuestion].correct ← DIRECT ACCESS!
   ↓
if (isCorrect) setScore(score + 1) ← PAS DE VALIDATION
   ↓
Next question OU completeQuiz()
```

**⚠️ PROBLÈMES** :
- ❌ Réponse `correct` accessible directement (ligne 988)
- ❌ Pas de timer
- ❌ Pas de validation cryptographique
- ❌ Pas de détection manipulation

---

## 🎯 PLAN D'IMPLÉMENTATION ANTI-TRICHE

### **ÉTAPE 1 : Préparation (Déjà fait)**

✅ `QuizValidator.ts` créé  
✅ `quizAnswers.ts` créé  
✅ Hash SHA-256 des réponses  

### **ÉTAPE 2 : Modification App.tsx**

#### **A. Ajouter Imports (après ligne 20)**

```typescript
import { validateAnswer, detectTimeManipulation } from './services/QuizValidator';
import { getQuizAnswerHash } from './data/quizAnswers';
```

#### **B. Ajouter État Timer (après ligne 102)**

```typescript
const [questionStartTime, setQuestionStartTime] = useState(Date.now());
const [timeLeft, setTimeLeft] = useState(60);
```

#### **C. Ajouter useEffect Timer (après ligne 590)**

```typescript
// Timer quiz anti-cheat
useEffect(() => {
  if (!quizActive) return;
  
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        // Auto-submit incorrect answer
        handleAnswer(-1);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(timer);
}, [quizActive, currentQuestion]);

// Reset timer on question change
useEffect(() => {
  setQuestionStartTime(Date.now());
  setTimeLeft(60);
}, [currentQuestion]);
```

#### **D. Modifier handleAnswer (lignes 979-1007)**

**AVANT** (ligne 988):
```typescript
const isCorrect = answerIndex === questions[currentQuestion].correct;
```

**APRÈS** :
```typescript
// 🔐 ANTI-CHEAT: Cryptographic validation
const question = questions[currentQuestion];
const correctHash = getQuizAnswerHash(question.id);

if (!correctHash) {
  console.error('[Quiz] No hash for question:', question.id);
  return;
}

// Détection manipulation temps
if (detectTimeManipulation()) {
  console.warn('[Security] Time manipulation detected');
}

// Validation SHA-256
const validation = validateAnswer(
  question.id,
  answerIndex,
  correctHash,
  questionStartTime
);

const isCorrect = validation.isValid;

// Log si suspicious
if (validation.suspicious) {
  console.warn('[Security] Suspicious answer:', validation);
}
```

#### **E. Afficher Timer dans UI (ligne 1382)**

**AVANT** :
```typescript
<span className="text-yellow-400 text-lg font-bold">
  {currentQuestion + 1}/{questions.length}
</span>
```

**APRÈS** :
```typescript
<div className="flex items-center gap-4">
  <span className="text-yellow-400 text-lg font-bold">
    {currentQuestion + 1}/{questions.length}
  </span>
  <div className="flex items-center gap-2">
    <Clock size={20} className={timeLeft < 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'} />
    <span className={`text-lg font-bold ${timeLeft < 10 ? 'text-red-400' : 'text-white'}`}>
      {timeLeft}s
    </span>
  </div>
</div>
```

---

## ✅ AVANTAGES DE CETTE APPROCHE

1. **Minimal Invasif** : Modification de 3 fonctions seulement
2. **Préserve Logique** : Tout le système XP/Pi/retry intact
3. **Progressive** : On peut tester chaque ajout séparément
4. **Rollback Facile** : Git permet retour arrière si problème

---

## 📋 CHECKLIST IMPLÉMENTATION

- [ ] Ajouter imports QuizValidator, quizAnswers
- [ ] Ajouter état questionStartTime, timeLeft
- [ ] Ajouter useEffect timer
- [ ] Modifier handleAnswer avec validation cryptographique
- [ ] Afficher timer dans UI
- [ ] Tester localement
- [ ] Build production
- [ ] Déployer
- [ ] Tester en production

---

## ⚠️ RISQUES & MITIGATION

| Risque | Probabilité | Mitigation |
|--------|-------------|------------|
| Hash mismatch | Moyenne | Vérifier questionBank.ts a `correct` field |
| Timer trop strict | Faible | Timeout 60s généreux |
| Build error | Faible | Imports déjà testés dans EnhancedQuizScreen |
| Régression XP | **Très Faible** | On ne touche PAS completeQuiz() |

---

**Prêt pour implémentation progressive !** 🚀
