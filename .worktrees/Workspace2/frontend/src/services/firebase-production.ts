/**
 * Firebase Production Configuration
 * Remplace le mock localStorage par Firebase réel
 * 
 * ⚠️ IMPORTANT : Configurer les variables d'environnement dans .env
 */

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// 🔐 Firebase Configuration
// TODO: Obtenir config depuis Firebase Console
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'YOUR_AUTH_DOMAIN',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'academy-of-pi',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'YOUR_STORAGE_BUCKET',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || 'YOUR_SENDER_ID',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || 'YOUR_APP_ID'
};

// ✅ Initialize Firebase (only once)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

// 📊 User Data Interface
export interface UserData {
    userProgress: any;
    isPremium: boolean;
    socialPosts: any[];
    profilePicture: string | null;
    lastUpdated: number;
}

/**
 * ✅ Save User Profile to Firestore
 * Merges new data with existing data (preserves all fields)
 */
export const saveUserProfile = async (uid: string, data: Partial<UserData>): Promise<boolean> => {
    try {
        console.log('[Firebase] Saving user profile:', uid);
        
        const userRef = doc(db, 'users', uid);
        
        // ✅ CRITICAL: Merge with existing data (setDoc with merge: true)
        await setDoc(userRef, {
            ...data,
            lastUpdated: Date.now()
        }, { merge: true });  // ← IMPORTANT: merge instead of overwrite
        
        console.log('[Firebase] User profile saved successfully');
        return true;
    } catch (error) {
        console.error('[Firebase] Error saving profile:', error);
        
        // ⚠️ Fallback to localStorage if Firebase unavailable
        try {
            const existingData = localStorage.getItem(`pi_academy_data_${uid}`);
            let merged = data;
            
            if (existingData) {
                const existing = JSON.parse(existingData);
                merged = { ...existing, ...data, lastUpdated: Date.now() };
            }
            
            localStorage.setItem(`pi_academy_data_${uid}`, JSON.stringify(merged));
            console.warn('[Firebase] Fallback to localStorage (Firebase unavailable)');
            return true;
        } catch (localError) {
            console.error('[Firebase] Fallback error:', localError);
            return false;
        }
    }
};

/**
 * ✅ Get User Profile from Firestore
 */
export const getUserProfile = async (uid: string): Promise<UserData | null> => {
    try {
        console.log('[Firebase] Loading user profile:', uid);
        
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);
        
        if (snapshot.exists()) {
            console.log('[Firebase] User profile loaded from Firestore');
            return snapshot.data() as UserData;
        }
        
        console.log('[Firebase] No profile found in Firestore, checking localStorage');
        
        // ⚠️ Fallback to localStorage
        const localData = localStorage.getItem(`pi_academy_data_${uid}`);
        if (localData) {
            const parsed = JSON.parse(localData);
            console.log('[Firebase] Profile loaded from localStorage');
            
            // 🔄 Migrate to Firestore
            await saveUserProfile(uid, parsed);
            console.log('[Firebase] Data migrated to Firestore');
            
            return parsed as UserData;
        }
        
        return null;
    } catch (error) {
        console.error('[Firebase] Error getting profile:', error);
        
        // ⚠️ Fallback to localStorage
        try {
            const localData = localStorage.getItem(`pi_academy_data_${uid}`);
            if (localData) {
                console.warn('[Firebase] Fallback to localStorage (Firebase unavailable)');
                return JSON.parse(localData) as UserData;
            }
        } catch (localError) {
            console.error('[Firebase] Fallback error:', localError);
        }
        
        return null;
    }
};

/**
 * ✅ Check if User is Banned
 */
export const checkIfBanned = async (uid: string): Promise<{ isBanned: boolean; reason?: string }> => {
    try {
        const bannedRef = doc(db, 'bannedUsers', uid);
        const snapshot = await getDoc(bannedRef);
        
        if (snapshot.exists()) {
            return {
                isBanned: true,
                reason: snapshot.data().reason || 'Terms of Service violation'
            };
        }
        
        return { isBanned: false };
    } catch (error) {
        console.error('[Firebase] Error checking ban status:', error);
        return { isBanned: false };  // Fail open (allow if can't check)
    }
};

/**
 * ✅ Migrate localStorage to Firestore
 * Call once after user login to migrate existing data
 */
export const migrateLocalStorageToFirestore = async (uid: string): Promise<boolean> => {
    try {
        const localData = localStorage.getItem(`pi_academy_data_${uid}`);
        
        if (localData) {
            const parsed = JSON.parse(localData);
            console.log('[Firebase] Migrating localStorage to Firestore...');
            
            await saveUserProfile(uid, parsed);
            
            console.log('[Firebase] Migration successful');
            
            // Optional: Clear localStorage after successful migration
            // localStorage.removeItem(`pi_academy_data_${uid}`);
            
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('[Firebase] Migration error:', error);
        return false;
    }
};
