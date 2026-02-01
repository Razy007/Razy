# 🚀 ROADMAP FIREBASE PRODUCTION + ANTI-TRICHE

**Date Début** : 2026-01-08  
**Objectif** : Implémenter Firebase réel + Sécuriser Quiz  
**Priorité** : HAUTE (Bloqueur Production Pi Network)

---

## 📋 **PHASE 1 : FIREBASE PRODUCTION**

### **Étape 1.1 : Configuration Firebase**

**Durée** : 30 min

```bash
# 1. Créer projet Firebase
firebase init

# 2. Activer services
- Firestore Database
- Authentication
- Cloud Functions
- Hosting (optionnel)

# 3. Obtenir config
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "academy-of-pi",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};
```

**Fichiers à créer** :
- `.env` (variables Firebase)
- `firebase.json` (config)
- `.firebaserc` (projet)

---

### **Étape 1.2 : Remplacer Mock Firebase**

**Durée** : 1h

**Fichier** : `src/services/firebase.ts`

**AVANT (Mock)** :
```typescript
export const saveUserProfile = async (uid: string, data: Partial<UserData>) => {
    localStorage.setItem(`pi_academy_data_${uid}`, JSON.stringify(merged));
    return true;
};
```

**APRÈS (Firebase Réel)** :
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... etc
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const saveUserProfile = async (uid: string, data: Partial<UserData>) => {
    try {
        const userRef = doc(db, 'users', uid);
        
        // Merge with existing data
        await setDoc(userRef, data, { merge: true });
        
        console.log('[Firebase] User profile saved:', uid);
        return true;
    } catch (error) {
        console.error('[Firebase] Error saving profile:', error);
        return false;
    }
};

export const getUserProfile = async (uid: string): Promise<UserData | null> => {
    try {
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);
        
        if (snapshot.exists()) {
            return snapshot.data() as UserData;
        }
        return null;
    } catch (error) {
        console.error('[Firebase] Error getting profile:', error);
        return null;
    }
};
```

---

### **Étape 1.3 : Firestore Security Rules**

**Durée** : 30 min

**Fichier** : `firestore.rules`

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ✅ Users collection - Only owner can read/write
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // ✅ Banned users - Admin only
    match /bannedUsers/{userId} {
      allow read: if request.auth != null;
      allow write: if false;  // Admin SDK only
    }
    
    // ✅ Quiz questions - Read only
    match /quizQuestions/{questionId} {
      allow read: if request.auth != null;
      allow write: if false;  // Admin only
    }
    
    // ✅ Leaderboard - Read only for all
    match /leaderboard/{entry} {
      allow read: if true;
      allow write: if false;  // Cloud Function only
    }
  }
}
```

---

### **Étape 1.4 : Migration localStorage → Firestore**

**Durée** : 1h

```typescript
// src/services/FirebaseMigration.ts

export const migrateLocalStorageToFirestore = async (uid: string) => {
    try {
        // 1. Read from localStorage
        const localData = localStorage.getItem(`pi_academy_data_${uid}`);
        
        if (localData) {
            const parsed = JSON.parse(localData);
            
            // 2. Save to Firestore
            await saveUserProfile(uid, parsed);
            
            // 3. Clear localStorage (optional)
            // localStorage.removeItem(`pi_academy_data_${uid}`);
            
            console.log('[Migration] Data migrated to Firestore');
            return true;
        }
    } catch (error) {
        console.error('[Migration] Error:', error);
        return false;
    }
};
```

---

## 📋 **PHASE 2 : ANTI-TRICHE QUIZ**

### **Étape 2.1 : Obfuscation Réponses**

**Durée** : 30 min

**AVANT (Vulnérable)** :
```typescript
// courses.ts
questions: [
  {
    question: "What is Pi?",
    options: ["A", "B", "C"],
    correctAnswer: "A"  // ❌ Visible dans code source
  }
]
```

**APRÈS (Obfusqué)** :
```typescript
// courses.ts
questions: [
  {
    id: "q1_layer1",
    question: "What is Pi?",
    options: ["A", "B", "C"],
    correctIndex: 0,  // Index seulement
    // ❌ correctAnswer supprimé
  }
]

// Validation côté serveur uniquement
```

---

### **Étape 2.2 : Cloud Function Validation**

**Durée** : 2h

**Fichier** : `functions/src/validateQuizAnswer.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// ✅ CORRECT ANSWERS STOCKÉES CÔTÉ SERVEUR UNIQUEMENT
const QUIZ_ANSWERS: Record<string, number> = {
  'q1_layer1': 0,
  'q2_layer1': 2,
  'q3_layer1': 1,
  // ... etc
};

export const validateQuizAnswer = functions.https.onCall(async (data, context) => {
  // 🔐 Security: User must be authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const { questionId, userAnswer, timestamp } = data;
  const uid = context.auth.uid;

  // ✅ Validate answer
  const correctAnswer = QUIZ_ANSWERS[questionId];
  
  if (correctAnswer === undefined) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid question ID');
  }

  const isCorrect = userAnswer === correctAnswer;

  // ✅ Anti-speed-run: Check if answer too fast
  const timeLimit = 5000; // 5 seconds minimum per question
  const now = Date.now();
  
  if (timestamp && (now - timestamp) < timeLimit) {
    throw new functions.https.HttpsError('failed-precondition', 'Answer submitted too quickly');
  }

  // ✅ Log attempt (anti-triche analytics)
  await admin.firestore().collection('quizAttempts').add({
    uid,
    questionId,
    userAnswer,
    isCorrect,
    timestamp: admin.firestore.FieldValue.serverTimestamp()
  });

  return { isCorrect };
});
```

---

### **Étape 2.3 : Client Integration**

**Durée** : 1h

**Fichier** : `src/components/education/EnhancedQuizScreen.tsx`

```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const validateQuizAnswer = httpsCallable(functions, 'validateQuizAnswer');

// Dans le quiz component
const handleAnswer = async (questionId: string, userAnswer: number) => {
  try {
    const questionStartTime = questionTimestamps[questionId];
    
    // ✅ Call Cloud Function pour validation
    const result = await validateQuizAnswer({
      questionId,
      userAnswer,
      timestamp: questionStartTime
    });

    if (result.data.isCorrect) {
      // Correct !
      setScore(score + 1);
    } else {
      // Wrong
      // ...
    }
  } catch (error) {
    console.error('[Quiz] Validation error:', error);
    alert('Error validating answer. Please try again.');
  }
};
```

---

### **Étape 2.4 : Timer Par Question**

**Durée** : 30 min

```typescript
const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
const [timeLeft, setTimeLeft] = useState<number>(60); // 60 seconds

useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        // Auto-submit wrong answer
        handleAnswer(currentQuestion.id, -1);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [currentQuestionIndex]);

// Reset timer on new question
useEffect(() => {
  setTimeLeft(60);
  setQuestionStartTime(Date.now());
}, [currentQuestionIndex]);
```

---

### **Étape 2.5 : Randomization Questions**

**Durée** : 30 min

```typescript
// Déjà implémenté dans QuestionRandomizer.ts
// Mais améliorer pour éviter patterns

const randomizeQuestions = (questions: QuizQuestion[], recentIds: string[]) => {
  // 1. Filter out recent questions
  const available = questions.filter(q => !recentIds.includes(q.id));
  
  // 2. Shuffle using Fisher-Yates
  for (let i = available.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [available[i], available[j]] = [available[j], available[i]];
  }
  
  // 3. Randomize options order for each question
  return available.slice(0, 5).map(q => ({
    ...q,
    options: shuffleArray(q.options),
    correctIndex: adjustCorrectIndex(q.correctIndex, q.options)
  }));
};
```

---

## 📊 **TIMELINE GLOBAL**

| Phase | Tâche | Durée | Priorité |
|-------|-------|-------|----------|
| **1.1** | Config Firebase | 30 min | 🔴 CRITIQUE |
| **1.2** | Remplacer Mock | 1h | 🔴 CRITIQUE |
| **1.3** | Security Rules | 30 min | 🔴 CRITIQUE |
| **1.4** | Migration Data | 1h | 🟡 IMPORTANT |
| **2.1** | Obfuscation | 30 min | 🔴 CRITIQUE |
| **2.2** | Cloud Function | 2h | 🔴 CRITIQUE |
| **2.3** | Client Integration | 1h | 🔴 CRITIQUE |
| **2.4** | Timer Questions | 30 min | 🟡 IMPORTANT |
| **2.5** | Randomization+ | 30 min | 🟢 NICE |

**TOTAL ESTIMÉ** : 7-8 heures

---

## 🎯 **PROCHAINE ÉTAPE IMMÉDIATE**

**Commencer par** :
1. Créer projet Firebase Console
2. Obtenir firebaseConfig
3. Installer dépendances

```bash
npm install firebase
npm install -D firebase-tools
firebase login
firebase init
```

---

**Prêt à commencer Firebase Production ?** 🚀
