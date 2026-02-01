// ========================================
// EXTENDED QUESTION BANK - IMPORTS & EXPORTS
// ========================================
// This file aggregates all extended question banks for the 7 courses

import { SAFETY_QUESTIONS_FR } from './safety-questions';
import { WALLET_QUESTIONS_FR } from './wallet-questions';
import { KYC_QUESTIONS_FR } from './kyc-questions';
import { BLOCKCHAIN_QUESTIONS_FR } from './blockchain-questions';
import { DEFI_QUESTIONS_FR } from './defi-questions';
import { PREMIUM_QUESTIONS_FR } from './premium-questions';
import { QuizQuestion } from '../types';

// ========================================
// EXTENDED QUESTION BANKS (FR)
// ========================================
export const EXTENDED_QUESTIONS_FR: Record<string, QuizQuestion[]> = {
    // Course 2: Wallet (maps to wallet-l2-comprehension)
    'wallet-l2-comprehension': WALLET_QUESTIONS_FR,
    
    // Course 3: Safety/Security (maps to safety-l2)
    'safety-l2': SAFETY_QUESTIONS_FR,
    
    // Course 4: KYC (maps to kyc-l2)
    'kyc-l2': KYC_QUESTIONS_FR,
    
    // Course 5: Blockchain (maps to blockchain-l2)
    'blockchain-l2': BLOCKCHAIN_QUESTIONS_FR,
    
    // Course 6: DeFi (maps to defi-l2)
    'defi-l2': DEFI_QUESTIONS_FR,
    
    // Course 7: Premium Masterclass (maps to premium-l1)
    'premium-l1': PREMIUM_QUESTIONS_FR,
    'premium-l2': PREMIUM_QUESTIONS_FR, // Alias for quiz layer
};

// ========================================
// EXTENDED QUESTION BANKS (EN) - For now, use FR as base
// English translations can be added later
// ========================================
export const EXTENDED_QUESTIONS_EN: Record<string, QuizQuestion[]> = {
    'wallet-l2-comprehension': WALLET_QUESTIONS_FR,
    'safety-l2': SAFETY_QUESTIONS_FR,
    'kyc-l2': KYC_QUESTIONS_FR,
    'blockchain-l2': BLOCKCHAIN_QUESTIONS_FR,
    'defi-l2': DEFI_QUESTIONS_FR,
    'premium-l1': PREMIUM_QUESTIONS_FR,
    'premium-l2': PREMIUM_QUESTIONS_FR,
};

// ========================================
// UTILITY: Get questions for a layer (extended)
// ========================================
export function getExtendedQuestions(layerId: string, lang: string = 'fr'): QuizQuestion[] {
    const bank = lang === 'en' ? EXTENDED_QUESTIONS_EN : EXTENDED_QUESTIONS_FR;
    return bank[layerId] || [];
}

// ========================================
// UTILITY: Get random questions from extended bank
// ========================================
export function getRandomExtendedQuestions(layerId: string, count: number = 5, lang: string = 'fr'): QuizQuestion[] {
    const allQuestions = getExtendedQuestions(layerId, lang);
    if (allQuestions.length === 0) {
        return [];
    }
    
    // Shuffle and take N
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, allQuestions.length));
}

// ========================================
// SUMMARY LOG
// ========================================
console.log('[Extended Question Bank] Loaded:');
console.log(`  - Wallet: ${WALLET_QUESTIONS_FR.length} questions`);
console.log(`  - Safety: ${SAFETY_QUESTIONS_FR.length} questions`);
console.log(`  - KYC: ${KYC_QUESTIONS_FR.length} questions`);
console.log(`  - Blockchain: ${BLOCKCHAIN_QUESTIONS_FR.length} questions`);
console.log(`  - DeFi: ${DEFI_QUESTIONS_FR.length} questions`);
console.log(`  - Premium: ${PREMIUM_QUESTIONS_FR.length} questions`);
console.log(`  - TOTAL: ${WALLET_QUESTIONS_FR.length + SAFETY_QUESTIONS_FR.length + KYC_QUESTIONS_FR.length + BLOCKCHAIN_QUESTIONS_FR.length + DEFI_QUESTIONS_FR.length + PREMIUM_QUESTIONS_FR.length} questions`);
