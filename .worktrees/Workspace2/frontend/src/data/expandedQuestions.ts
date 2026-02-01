// ========================================
// EXPANDED QUESTIONS BANK - REAL CONTENT
// ========================================
// This file imports all extended question banks and exports them for use in questionBank.ts

import { QuizQuestion } from '../types';

// Import all new question banks
import { SAFETY_QUESTIONS_FR } from './safety-questions';
import { WALLET_QUESTIONS_FR } from './wallet-questions';
import { KYC_QUESTIONS_FR } from './kyc-questions';
import { BLOCKCHAIN_QUESTIONS_FR } from './blockchain-questions';
import { DEFI_QUESTIONS_FR } from './defi-questions';
import { PREMIUM_QUESTIONS_FR } from './premium-questions';

// ========================================
// MERGED EXPANDED QUESTIONS (FR)
// ========================================
export const EXPANDED_QUESTIONS_FR: Record<string, QuizQuestion[]> = {
    // Course 2: Wallet Mastery (50 questions)
    'wallet-l2-comprehension': WALLET_QUESTIONS_FR,
    
    // Course 3: Security/Anti-Scam (50 questions)
    'safety-l2': SAFETY_QUESTIONS_FR,
    
    // Course 4: KYC Mastery (50 questions)
    'kyc-l2': KYC_QUESTIONS_FR,
    
    // Course 5: Blockchain Architecture (50 questions)
    'blockchain-l2': BLOCKCHAIN_QUESTIONS_FR,
    
    // Course 6: DeFi & Finance (50 questions)
    'defi-l2': DEFI_QUESTIONS_FR,
    
    // Course 7: Premium Masterclass - Pi Architecture (50 questions)
    'premium-l1': PREMIUM_QUESTIONS_FR,
    'premium-l2': PREMIUM_QUESTIONS_FR, // Alias for quiz layer if different ID used
};

// ========================================
// MERGED EXPANDED QUESTIONS (EN)
// For now, use French as base - English translations can be added later
// ========================================
export const EXPANDED_QUESTIONS_EN: Record<string, QuizQuestion[]> = {
    'wallet-l2-comprehension': WALLET_QUESTIONS_FR,
    'safety-l2': SAFETY_QUESTIONS_FR,
    'kyc-l2': KYC_QUESTIONS_FR,
    'blockchain-l2': BLOCKCHAIN_QUESTIONS_FR,
    'defi-l2': DEFI_QUESTIONS_FR,
    'premium-l1': PREMIUM_QUESTIONS_FR,
    'premium-l2': PREMIUM_QUESTIONS_FR,
};

// ========================================
// LOG SUMMARY
// ========================================
const totalQuestions = 
    WALLET_QUESTIONS_FR.length + 
    SAFETY_QUESTIONS_FR.length + 
    KYC_QUESTIONS_FR.length + 
    BLOCKCHAIN_QUESTIONS_FR.length + 
    DEFI_QUESTIONS_FR.length + 
    PREMIUM_QUESTIONS_FR.length;

console.log(`[Question Bank] Extended questions loaded: ${totalQuestions} total`);
console.log(`  - Wallet: ${WALLET_QUESTIONS_FR.length}`);
console.log(`  - Safety: ${SAFETY_QUESTIONS_FR.length}`);
console.log(`  - KYC: ${KYC_QUESTIONS_FR.length}`);
console.log(`  - Blockchain: ${BLOCKCHAIN_QUESTIONS_FR.length}`);
console.log(`  - DeFi: ${DEFI_QUESTIONS_FR.length}`);
console.log(`  - Premium: ${PREMIUM_QUESTIONS_FR.length}`);
