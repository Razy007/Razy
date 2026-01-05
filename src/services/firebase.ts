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

// Mock Save - Always succeeds locally
export const saveUserProfile = async (uid: string, data: Partial<UserData>): Promise<boolean> => {
    console.log("[FIREBASE-MOCK] Saving user profile to localStorage", uid);
    try {
        localStorage.setItem(`pi_academy_data_${uid}`, JSON.stringify(data));
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
