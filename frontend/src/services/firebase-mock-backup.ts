// MOCKED FIREBASE SERVICE (Debug Mode)
import { Firestore } from 'firebase/firestore';

// Mock DB
let db: Firestore | null = null;

export { db };

// Mock User Data Type
export interface UserData {
    userProgress: any;
    isPremium: boolean;
    socialPosts: any[];
    profilePicture: string | null;
    lastUpdated: number;
}

// Mock Save - MERGES with existing data instead of overwriting
export const saveUserProfile = async (uid: string, data: Partial<UserData>): Promise<boolean> => {
    console.log("[FIREBASE-MOCK] Saving user profile to localStorage", uid);
    try {
        // 🔥 CRITICAL FIX: Merge instead of overwrite
        const existingData = localStorage.getItem(`pi_academy_data_${uid}`);
        let merged = data;
        
        if (existingData) {
            try {
                const existing = JSON.parse(existingData);
                // Merge new data into existing data
                merged = { ...existing, ...data, lastUpdated: Date.now() };
            } catch (e) {
                console.error("Error parsing existing data, will overwrite", e);
                merged = { ...data, lastUpdated: Date.now() };
            }
        } else {
            merged = { ...data, lastUpdated: Date.now() };
        }
        
        localStorage.setItem(`pi_academy_data_${uid}`, JSON.stringify(merged));
        console.log("[FIREBASE-MOCK] Data merged successfully:", Object.keys(merged));
        return true;
    } catch (e) {
        console.error("Error saving to localStorage", e);
        return false;
    }
};

// Mock Get - Always reads locally
export const getUserProfile = async (uid: string): Promise<UserData | null> => {
    console.log("[FIREBASE-MOCK] Loading user profile from localStorage", uid);
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
