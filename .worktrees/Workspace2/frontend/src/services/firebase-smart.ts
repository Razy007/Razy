/**
 * Firebase Service - Smart Switch
 * Mode: Production ou Mock basé on REACT_APP_FIREBASE_MODE
 */

import { Firestore } from 'firebase/firestore';
import * as ProdService from './firebase-production';

// Mode determination
const FIREBASE_MODE = process.env.REACT_APP_FIREBASE_MODE || 'mock';

export interface UserData {
    userProgress: any;
    isPremium: boolean;
    socialPosts: any[];
    profilePicture: string | null;
    lastUpdated: number;
}

// Internal implementations
const mockSaveUserProfile = async (uid: string, data: Partial<UserData>): Promise<boolean> => {
    console.log("[FIREBASE-MOCK] Saving user profile to localStorage", uid);
    try {
        const existingData = localStorage.getItem(`pi_academy_data_${uid}`);
        let merged = data;
        
        if (existingData) {
            try {
                const existing = JSON.parse(existingData);
                merged = { ...existing, ...data, lastUpdated: Date.now() };
            } catch (e) {
                console.error("Error parsing existing data, will overwrite", e);
                merged = { ...data, lastUpdated: Date.now() };
            }
        } else {
            merged = { ...data, lastUpdated: Date.now() };
        }
        
        localStorage.setItem(`pi_academy_data_${uid}`, JSON.stringify(merged));
        return true;
    } catch (e) {
        console.error("Error saving to localStorage", e);
        return false;
    }
};

const mockGetUserProfile = async (uid: string): Promise<UserData | null> => {
    console.log("[FIREBASE-MOCK] Loading user profile from localStorage", uid);
    try {
        const data = localStorage.getItem(`pi_academy_data_${uid}`);
        if (data) {
            return JSON.parse(data) as UserData;
        }
        return null;
    } catch (e) {
        console.error("Error reading from localStorage", e);
        return null;
    }
};

// Exports
export const db: Firestore | null = null;

export const saveUserProfile = FIREBASE_MODE === 'production' 
    ? ProdService.saveUserProfile 
    : mockSaveUserProfile;

export const getUserProfile = FIREBASE_MODE === 'production' 
    ? ProdService.getUserProfile 
    : mockGetUserProfile;
