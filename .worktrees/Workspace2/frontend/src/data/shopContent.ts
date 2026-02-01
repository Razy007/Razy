
export interface ShopItem {
    id: string;
    category: 'consumable' | 'boost' | 'license' | 'cosmetic';
    name: {
        fr: string;
        en: string;
    };
    description: {
        fr: string;
        en: string;
    };
    cost: number; // Prix en Pi (Edu)
    
    // IMPACT ÉCONOMIQUE (Le cœur du système anti-farm)
    effect: {
        type: 'energy_refill' | 'unlock_withdrawal_tier' | 'streak_freeze' | 'xp_boost' | 'course_unlock';
        value: number; // Quantité d'énergie, ou ID du Tier débloqué
    };
    
    // "SCORE DE CRÉDIBILITÉ"
    // Combien cet achat ajoute-t-il au "Total Spent" pour autoriser les retraits ?
    credibilityScore: number; 
    
    // Conditions d'achat
    requiredLevel?: number;
    maxQuantity?: number; // Pour les objets uniques comme les licences
    cooldownHours?: number; // Anti-spam achat
}

export const ACADEMY_SHOP_ITEMS: ShopItem[] = [
    // ==========================================
    // 1. MAINTIEN DE L'ACTIVITÉ (Consommables basiques)
    // ==========================================
    {
        id: 'energy_small',
        category: 'consumable',
        name: { fr: 'Café Numérique', en: 'Digital Coffee' },
        description: { fr: 'Recharge 50 points d\'énergie.', en: 'Refills 50 energy points.' },
        cost: 0.0001, 
        effect: { type: 'energy_refill', value: 50 },
        credibilityScore: 5 
    },
    {
        id: 'energy_full',
        category: 'consumable',
        name: { fr: 'Batterie Pleine', en: 'Full Battery' },
        description: { fr: 'Recharge COMPLÈTE de l\'énergie (500).', en: 'Full energy refill (500).' },
        cost: 0.0005,
        effect: { type: 'energy_refill', value: 500 },
        credibilityScore: 25
    },
    {
        id: 'intermediate_license',
        category: 'boost',
        name: { fr: 'Pass: Blockchain Intermédiaire', en: 'Pass: Intermediate Blockchain' },
        description: { fr: 'Requis pour débloquer les cours sur l\'Architecture Blockchain.', en: 'Required to unlock Blockchain Architecture courses.' },
        cost: 0.001,
        effect: { type: 'course_unlock', value: 0 },
        credibilityScore: 100,
        maxQuantity: 1
    },
    {
        id: 'validator_license',
        category: 'boost',
        name: { fr: 'Licence: Expert DeFi', en: 'License: DeFi Expert' },
        description: { fr: 'Requis pour débloquer les cours DeFi avancés.', en: 'Required to unlock advanced DeFi courses.' },
        cost: 0.0025,
        effect: { type: 'course_unlock', value: 0 },
        credibilityScore: 500,
        maxQuantity: 1
    },
    {
        id: 'license_starter',
        category: 'license',
        name: { fr: 'Badge: Novice Certifié', en: 'Badge: Certified Novice' },
        description: { 
            fr: 'Preuve d\'engagement basique. DÉBLOQUE LES MICRO-RETRAITS (Niveau 1).', 
            en: 'Basic engagement proof. UNLOCKS MICRO-WITHDRAWALS (Tier 1).' 
        },
        cost: 0.0025, // ~$800 value
        effect: { type: 'unlock_withdrawal_tier', value: 1 },
        credibilityScore: 500, 
        requiredLevel: 5,
        maxQuantity: 1
    },
    {
        id: 'license_pro',
        category: 'license',
        name: { fr: 'PASS PREMIUM (Official Validator)', en: 'PREMIUM PASS (Official Validator)' },
        description: { 
            fr: 'Statut avancé. Débloque les retraits standards et les fonctionnalités de validation.', 
            en: 'Advanced status. Unlocks standard withdrawals and validation features.' 
        },
        cost: 0.01, // ~$3141 value
        effect: { type: 'unlock_withdrawal_tier', value: 2 },
        credibilityScore: 2500,
        maxQuantity: 1
    },
];
