import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';

// Configuration Firebase
// TODO: Remplacer par les vraies clés lors du déploiement
// Pour l'instant, si les clés manquent, on fallback sur localStorage
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pi-academy-social.firebaseapp.com",
  projectId: "pi-academy-social",
  storageBucket: "pi-academy-social.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

let db: Firestore | null = null;
let isFirebaseInitialized = false;

try {
  // Simple check to see if config is valid (not placeholder)
  // In a real scenario, we might want to try-catch the init itself more robustly
  // For this exercise, we'll try to init anyway, but handle errors gracefully
  if (firebaseConfig.apiKey !== "YOUR_API_KEY") {
      const app = initializeApp(firebaseConfig);
      db = getFirestore(app);
      isFirebaseInitialized = true;
      console.log("Firebase initialized successfully");
  } else {
      console.warn("Firebase not configured (using placeholders). Falling back to localStorage.");
  }
} catch (error) {
  console.warn("Firebase initialization failed. Falling back to localStorage.", error);
}

export { db };

// Type definition for user data
export interface UserData {
    userProgress: any;
    isPremium: boolean;
    socialPosts: any[];
    profilePicture: string | null;
    lastUpdated: number;
}

export const saveUserProfile = async (uid: string, data: Partial<UserData>): Promise<boolean> => {
    try {
        if (isFirebaseInitialized && db) {
            await setDoc(doc(db, "users", uid), {
                ...data,
                lastUpdated: Date.now()
            }, { merge: true });
            console.log("Data saved to Firestore");
            return true;
        }
    } catch (e) {
        console.error("Error saving to Firestore", e);
    }

    // Fallback to localStorage
    console.log("Saving to localStorage (Fallback)");
    try {
        localStorage.setItem(`pi_academy_data_${uid}`, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error("Error saving to localStorage", e);
        return false;
    }
};

export const getUserProfile = async (uid: string): Promise<UserData | null> => {
    try {
        if (isFirebaseInitialized && db) {
            const docRef = doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Data loaded from Firestore");
                return docSnap.data() as UserData;
            }
        }
    } catch (e) {
        console.error("Error loading from Firestore", e);
    }

    // Fallback to localStorage
    console.log("Loading from localStorage (Fallback)");
    const saved = localStorage.getItem(`pi_academy_data_${uid}`);
    if (saved) {
        try {
            return JSON.parse(saved) as UserData;
        } catch (e) {
            console.error("Error parsing localStorage data", e);
        }
    }
    return null;
};
