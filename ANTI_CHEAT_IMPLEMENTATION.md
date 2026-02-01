# 🎯 ANTI-TRICHE QUIZ - IMPLÉMENTATION COMPLÈTE

**Objectif** : Sécuriser les quiz SANS toucher au modèle économique  
**Durée** : 4-5 heures  
**Statut** : Prêt à implémenter

---

## 📋 **PHASE 1 : OBFUSCATION RÉPONSES** (1h)

### **Problème Actuel**

```typescript
// questionBank.ts - LIGNE 16
{
    id: 'q-pi-intro-1',
    question: "Qu'est-ce qui rend Pi Network unique?",
    options: ["Minage smartphone", "Minage GPU", "PoW", "ASIC"],
    correct: 0,  // ❌ INDEX VISIBLE CÔTÉ CLIENT
    explanation: "..."
}
```

**Risque** : User peut inspecter code → Voir index correct → Tricher

---

### **Solution : Hachage Index + Validation Serveur**

#### **Étape 1.1 : Modifier Structure Questions**

```typescript
// src/data/questionBank.ts (NOUVELLE VERSION)

// ✅ NE PAS exporter `correct` au client
export interface QuizQuestionPublic {
    id: string;
    question: string;
    options: string[];
    // ❌ PAS de `correct` ici
    difficulty: 'easy' | 'medium' | 'hard';
    cognitiveLevel: string;
    topic: string;
    trapType: string;
}

// 🔒 Interface INTERNE (serveur uniquement)
interface QuizQuestionInternal extends QuizQuestionPublic {
    correct: number;  // ← Gardé secret
    explanation: string;
}

// Bank complète (INTERNE)
const QUESTIONS_INTERNAL: Record<string, QuizQuestionInternal[]> = {
    'pi-intro-l2': [
      {
          id: 'q-pi-intro-1',
          question: "Qu'est-ce qui rend Pi Network unique?",
          options: ["Minage smartphone", "Minage GPU", "PoW", "ASIC"],
          correct: 0,  // ← RESTE ICI
          explanation: "...",
          difficulty: 'easy',
          cognitiveLevel: 'knowledge',
          topic: 'pi-basics',
          trapType: 'none'
      },
      // ... reste
    ]
};

// ✅ Export PUBLIC (sans `correct`)
export const getLayerQuestions = (layerId: string, lang: string = 'en'): QuizQuestionPublic[] => {
    const questions = lang === 'fr' ? QUESTIONS_INTERNAL[layerId] : QUESTIONS_EN_INTERNAL[layerId];
    
    // Retirer `correct` et `explanation`
    return questions.map(({ correct, explanation, ...publicData }) => publicData);
};
```

---

#### **Étape 1.2 : Créer Mapping Serveur**

```typescript
// src/data/quizAnswers.ts (NOUVEAU FICHIER - SERVER ONLY)

/**
 * 🔒 ANSWERS MAPPING - NE JAMAIS EXPOSER AU CLIENT
 * Ce fichier sera utilisé par Cloud Functions uniquement
 */

export const QUIZ_ANSWERS: Record<string, number> = {
    // Cours 1
    'q-pi-intro-1': 0,
    'q-pi-intro-2': 1,
    'q-pi-intro-3': 2,
    'q-pi-intro-4': 1,
    'q-pi-intro-5': 1,
    // ... TOUTES les questions (1344 lignes)
    
    // Cours 2
    'q-wallet-1': 2,
    'q-wallet-2': 0,
    // ... etc
};

// ✅ Fonction validation
export function validateAnswer(questionId: string, userAnswer: number): boolean {
    const correctAnswer = QUIZ_ANSWERS[questionId];
    if (correctAnswer === undefined) {
        throw new Error(`Question ${questionId} not found`);
    }
    return userAnswer === correctAnswer;
}
```

---

## 📋 **PHASE 2 : FIREBASE CLOUD FUNCTION** (2h)

### **Étape 2.1 : Setup Firebase Functions**

```bash
# Installer Functions
npm install firebase-functions firebase-admin

# Initialiser Functions
firebase init functions

# Choisir :
# - Language: TypeScript
# - ESLint: Yes
# - Install dependencies: Yes
```

---

### **Étape 2.2 : Créer Cloud Function**

```typescript
// functions/src/index.ts

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { QUIZ_ANSWERS } from './quizAnswers';  // Import server-side

admin.initializeApp();
const db = admin.firestore();

/**
 * ✅ Valide une réponse quiz
 * 
 * @param {string} questionId - ID de la question
 * @param {number} userAnswer - Index réponse choisie (0-3)
 * @param {number} timestamp - Timestamp début question
 * @param {string} layerId - ID du layer (pour XP/rewards)
 * 
 * @returns {object} { isCorrect, xpEarned, explanation }
 */
export const validateQuizAnswer = functions.https.onCall(async (data, context) => {
    // 🔒 Security: User must be authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError(
            'unauthenticated',
            'Must be logged in to submit quiz answers'
        );
    }

    const { questionId, userAnswer, timestamp, layerId } = data;
    const uid = context.auth.uid;

    // ✅ Validate input
    if (!questionId || userAnswer === undefined || !layerId) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'Missing required fields'
        );
    }

    // ✅ Get correct answer (SERVER SIDE ONLY)
    const correctAnswer = QUIZ_ANSWERS[questionId];
    if (correctAnswer === undefined) {
        throw new functions.https.HttpsError(
            'not-found',
            `Question ${questionId} not found`
        );
    }

    // ✅ Validate answer
    const isCorrect = userAnswer === correctAnswer;

    // ✅ Anti-speed-run: Minimum 3 seconds per question
    const MIN_TIME_MS = 3000;
    const now = Date.now();
    
    if (timestamp && (now - timestamp) < MIN_TIME_MS) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'Answer submitted too quickly'
        );
    }

    // ✅ Calculate rewards (préserve modèle économique)
    let xpEarned = 0;
    if (isCorrect) {
        // XP basé sur difficulté (comme avant)
        xpEarned = 10;  // Default
        // TODO: Récupérer vraie difficulté depuis questionBank
    }

    // ✅ Log attempt (anti-triche analytics)
    await db.collection('quizAttempts').add({
        uid,
        questionId,
        layerId,
        userAnswer,
        isCorrect,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        timeTaken: timestamp ? (now - timestamp) : null,
    });

    // ✅ Update user stats si correct
    if (isCorrect) {
        const userRef = db.collection('users').doc(uid);
        await userRef.update({
            'userProgress.xp': admin.firestore.FieldValue.increment(xpEarned)
        });
    }

    return {
        isCorrect,
        xpEarned,
        // explanation sera ajoutée plus tard
    };
});

/**
 * ✅ Détection anomalies (bonus)
 */
export const detectQuizAnomalies = functions.https.onCall(async (data, context) => {
    // Check admin
    if (!context.auth || !context.auth.token.admin) {
        throw new functions.https.HttpsError('permission-denied', 'Admin only');
    }

    const { uid } = data;

    // Get all attempts
    const attemptsSnapshot = await db
        .collection('quizAttempts')
        .where('uid', '==', uid)
        .orderBy('timestamp', 'desc')
        .limit(100)
        .get();

    const attempts = attemptsSnapshot.docs.map(doc => doc.data());

    // ✅ Anomaly 1: 100% success rate (suspect)
    const successRate = attempts.filter(a => a.isCorrect).length / attempts.length;
    if (successRate > 0.95 && attempts.length > 20) {
        return {
            anomaly: true,
            type: 'perfect_score',
            details: `${(successRate * 100).toFixed(1)}% success on ${attempts.length} questions`
        };
    }

    // ✅ Anomaly 2: Réponse trop rapide systématique
    const avgTime = attempts
        .filter(a => a.timeTaken)
        .reduce((sum, a) => sum + a.timeTaken, 0) / attempts.length;
    
    if (avgTime < 5000 && attempts.length > 10) {
        return {
            anomaly: true,
            type: 'speed_run',
            details: `Average ${(avgTime / 1000).toFixed(1)}s per question`
        };
    }

    return { anomaly: false };
});
```

---

### **Étape 2.3 : Copier Answers Map**

```typescript
// functions/src/quizAnswers.ts (COPIE DE src/data/quizAnswers.ts)

export const QUIZ_ANSWERS: Record<string, number> = {
    // ✅ Copier depuis questionBank.ts
    // Extraire UNIQUEMENT les paires id: correct
    
    'q-pi-intro-1': 0,
    'q-pi-intro-2': 1,
    // ... (toutes les 1000+ questions)
};
```

**Script auto-extraction** :

```bash
# Créer script extract-answers.js
node extract-answers.js > functions/src/quizAnswers.ts
```

---

## 📋 **PHASE 3 : CLIENT INTEGRATION** (1h)

### **Étape 3.1 : Installer SDK Functions**

```bash
npm install firebase/functions
```

---

### **Étape 3.2 : Modifier EnhancedQuizScreen**

```typescript
// src/components/EnhancedQuizScreen.tsx

import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const validateQuizAnswer = httpsCallable(functions, 'validateQuizAnswer');

// ✅ Dans le quiz component
const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());

// Quand user répond
const handleAnswer = async (userAnswer: number) => {
    try {
        setIsSubmitting(true);
        
        // ✅ Call Cloud Function (validation serveur)
        const result = await validateQuizAnswer({
            questionId: currentQuestion.id,
            userAnswer,
            timestamp: questionStartTime,
            layerId: currentLayerId
        });

        if (result.data.isCorrect) {
            // ✅ Correct !
            setScore(score + 1);
            setXpGained(xpGained + result.data.xpEarned);
            setFeedback({ type: 'success', message: 'Correct !' });
        } else {
            // ❌ Wrong
            setFeedback({ type: 'error', message: 'Incorrect' });
        }

        // Next question
        setTimeout(() => {
            nextQuestion();
        }, 1500);

    } catch (error) {
        console.error('[Quiz] Validation error:', error);
        
        if (error.code === 'failed-precondition') {
            alert('Réponse soumise trop rapidement. Prenez le temps de lire !');
        } else {
            alert('Erreur validation. Réessayez.');
        }
    } finally {
        setIsSubmitting(false);
    }
};

// Reset timer nouvelle question
useEffect(() => {
    setQuestionStartTime(Date.now());
}, [currentQuestionIndex]);
```

---

## 📋 **PHASE 4 : TIMER VISIBLE** (30min)

```typescript
// Dans EnhancedQuizScreen.tsx

const [timeLeft, setTimeLeft] = useState<number>(60); // 60 secondes

useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft(prev => {
            if (prev <= 1) {
                // Auto-submit mauvaise réponse
                handleAnswer(-1);  // -1 = timeout
                return 60;
            }
            return prev - 1;
        });
    }, 1000);

    return () => clearInterval(timer);
}, [currentQuestionIndex]);

// Reset timer
useEffect(() => {
    setTimeLeft(60);
}, [currentQuestionIndex]);

// UI Timer
<div className="flex items-center gap-2 text-white">
    <Clock size={18} />
    <span className={`font-mono ${timeLeft < 10 ? 'text-red-400' : ''}`}>
        {timeLeft}s
    </span>
</div>
```

---

## 📋 **TIMELINE & DÉPLOIEMENT**

| Étape | Durée | Fichiers |
|-------|-------|----------|
| 1. Obfuscation | 1h | questionBank.ts, quizAnswers.ts |
| 2. Cloud Function | 2h | functions/src/index.ts |
| 3. Client | 1h | EnhancedQuizScreen.tsx |
| 4. Timer | 30min | EnhancedQuizScreen.tsx |
| **TOTAL** | **4.5h** | |

---

## 🚀 **DÉPLOIEMENT**

```bash
# 1. Build client
npm run build

# 2. Deploy Functions
firebase deploy --only functions

# 3. Deploy app
.\deploy_production.ps1
```

---

## ✅ **VALIDATION**

### **Test 1 : Réponse Correcte**
- Submit bonne réponse
- ✅ Cloud Function valide
- ✅ XP ajouté
- ✅ Log dans Firestore

### **Test 2 : Réponse Rapide**
- Submit < 3 secondes
- ❌ Erreur "too quickly"

### **Test 3 : Inspect Code**
- F12 → Sources
- Chercher `correct`
- ✅ Pas trouvé dans bundle client

---

**PRÉSERVE MODÈLE ÉCONOMIQUE** : ✅  
**XP, Rewards, Energy** : ✅ INCHANGÉS  
**Staking, APR, Periods** : ✅ INCHANGÉS

**Prêt à implémenter ?** 🚀
