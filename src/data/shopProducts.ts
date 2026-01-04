/**
 * 💰 MODÈLE ÉCONOMIQUE STRATÉGIQUE - PIONEER ACADEMY
 * 
 * Écosystème monétisable conçu pour maximiser:
 * 1. Revenus récurrents (subscriptions)
 * 2. Micro-transactions (energy, boosters)
 * 3. Premium conversions
 * 4. Engagement long-terme
 */

export interface ShopProduct {
    id: string;
    name: string;
    category: 'energy' | 'boosters' | 'premium' | 'unlocks' | 'cosmetics' | 'bundles' | 'services';
    description: string;
    icon: string;
    
    // Pricing
    priceInPi?: number;
    priceInUSD?: number; // For fiat purchases (when Open Mainnet)
    isSubscription?: boolean;
    subscriptionDuration?: 'monthly' | 'quarterly' | 'yearly';
    
    // What user gets
    benefits: {
        energy?: number;
        energyRechargeBoost?: number; // Percentage increase in recharge rate
        xpMultiplier?: number; // Ex: 1.5x = 50% more XP
        reputationBoost?: number;
        unlockCourseId?: string; // Unlock 1 specific course early
        skipCooldown?: boolean;
        premiumAccess?: boolean;
        cosmetic?: {
            type: 'avatar-frame' | 'badge' | 'profile-theme' | 'title';
            item: string;
        };
    };
    
    // Business Logic
    isRecurring?: boolean; // Generates recurring revenue
    conversionPriority?: 'high' | 'medium' | 'low'; // How aggressively to promote
    targetUserLevel?: number[]; // [min, max] level range
    limitPerUser?: number; // Max purchases per user (null = unlimited)
    
    // Psychology
    urgency?: {
        limited?: boolean;
        expiresAt?: number;
        stock?: number;
    };
    socialProof?: string; // Ex: "2,341 Pioneers purchased this week"
    successRate?: number; // % of users who buy this after viewing
}

/**
 * 🎯 STRATÉGIE 1: ÉNERGIE COMME MONNAIE CENTRALE
 */
export const ENERGY_PRODUCTS: ShopProduct[] = [
    {
        id: 'energy-small',
        name: 'Recharge Rapide',
        category: 'energy',
        description: 'Restaure 50⚡ instantanément. Parfait pour finir un quiz urgent.',
        icon: '⚡',
        priceInPi: 0.0001, // ~$0.03 USD à GCV
        priceInUSD: 0.99, // Psychologie: $0.99 > $1.00
        benefits: { energy: 50 },
        conversionPriority: 'high',
        targetUserLevel: [1, 10],
        socialProof: '12,458 purchases cette semaine',
        successRate: 23.4 // 23.4% conversion rate
    },
    {
        id: 'energy-medium',
        name: 'Pack Énergie Médium',
        category: 'energy',
        description: '150⚡ + 10% bonus. Meilleur rapport qualité/prix.',
        icon: '⚡⚡',
        priceInPi: 0.00025,
        priceInUSD: 2.49,
        benefits: { energy: 165 }, // 150 + 10% bonus
        conversionPriority: 'high',
        targetUserLevel: [5, 15],
        socialProof: 'POPULAIRE - 8,921 achats',
        successRate: 31.2
    },
    {
        id: 'energy-large',
        name: 'Mega Pack Énergie',
        category: 'energy',
        description: '400⚡ + 25% bonus + 1 jour de recharge 2x.',
        icon: '⚡⚡⚡',
        priceInPi: 0.0006,
        priceInUSD: 4.99,
        benefits: { 
            energy: 500, // 400 + 25%
            energyRechargeBoost: 100 // 2x recharge for 24h
        },
        conversionPriority: 'medium',
        targetUserLevel: [10, 99],
        urgency: { limited: true, expiresAt: Date.now() + 48 * 60 * 60 * 1000 },
        socialProof: 'MEILLEURE VALEUR',
        successRate: 18.7
    },
    {
        id: 'energy-infinite-day',
        name: 'Énergie Illimitée 24h',
        category: 'energy',
        description: '⚡ ILLIMITÉE pendant 24h. Grindez autant que vous voulez!',
        icon: '♾️',
        priceInPi: 0.001,
        priceInUSD: 9.99,
        benefits: { energy: 9999 }, // Infinite flag (handled in code)
        conversionPriority: 'high',
        targetUserLevel: [8, 99],
        urgency: { limited: true, stock: 500 },
        socialProof: '⭐ VIP ONLY',
        successRate: 12.3,
        limitPerUser: 3 // Max 3 per week to avoid abuse
    }
];

/**
 * 🚀 STRATÉGIE 2: XP & PROGRESSION BOOSTERS
 */
export const BOOSTER_PRODUCTS: ShopProduct[] = [
    {
        id: 'xp-booster-1h',
        name: 'XP Turbo 1h',
        category: 'boosters',
        description: '+50% XP pendant 1 heure. Parfait pour une session intensive.',
        icon: '🚀',
        priceInPi: 0.00015,
        priceInUSD: 1.99,
        benefits: { xpMultiplier: 1.5 },
        conversionPriority: 'high',
        targetUserLevel: [3, 15],
        successRate: 28.9
    },
    {
        id: 'xp-booster-24h',
        name: 'XP Mega Boost 24h',
        category: 'boosters',
        description: '2x XP pendant 24h + Reputation bonus.',
        icon: '🔥',
        priceInPi: 0.0008,
        priceInUSD: 6.99,
        benefits: { xpMultiplier: 2.0, reputationBoost: 100 },
        conversionPriority: 'medium',
        targetUserLevel: [10, 99],
        urgency: { limited: true },
        socialProof: 'WEEKEND SPECIAL',
        successRate: 15.4
    },
    {
        id: 'reputation-boost',
        name: 'Reputation Boost',
        category: 'boosters',
        description: '+200 Reputation instantanée. Monte dans le leaderboard!',
        icon: '🏆',
        priceInPi: 0.0005,
        priceInUSD: 4.49,
        benefits: { reputationBoost: 200 },
        conversionPriority: 'low',
        targetUserLevel: [15, 99],
        successRate: 8.2
    },
    {
        id: 'cooldown-skip',
        name: 'Skip Cooldown Token',
        category: 'boosters',
        description: 'Annule le cooldown d\'un quiz raté. Réessayez immédiatement!',
        icon: '⏭️',
        priceInPi: 0.0002,
        priceInUSD: 2.49,
        benefits: { skipCooldown: true },
        conversionPriority: 'high',
        targetUserLevel: [5, 99],
        socialProof: 'Sauve ton streak!',
        successRate: 35.7 // High conversion = pain point addressed
    }
];

/**
 * 💎 STRATÉGIE 3: PREMIUM SUBSCRIPTIONS (REVENUS RÉCURRENTS)
 */
export const PREMIUM_PRODUCTS: ShopProduct[] = [
    {
        id: 'premium-monthly',
        name: 'Pioneer Premium Monthly',
        category: 'premium',
        description: `✨ Accès à TOUS les cours premium
⚡ Recharge énergie 2x plus rapide
🚀 +30% XP permanent
🏆 Badge exclusif "Premium Pioneer"
💬 Support prioritaire
📊 Statistiques avancées`,
        icon: '👑',
        priceInPi: 0.003, // ~$0.94/month
        priceInUSD: 9.99,
        isSubscription: true,
        subscriptionDuration: 'monthly',
        benefits: {
            premiumAccess: true,
            energyRechargeBoost: 100,
            xpMultiplier: 1.3,
            cosmetic: { type: 'badge', item: 'premium-crown' }
        },
        isRecurring: true,
        conversionPriority: 'high',
        targetUserLevel: [5, 99],
        socialProof: '3,421 membres Premium',
        successRate: 11.8
    },
    {
        id: 'premium-yearly',
        name: 'Pioneer Premium Yearly',
        category: 'premium',
        description: `🎁 Save 40% vs Monthly!
Tous les avantages Premium +
🎯 2 mois GRATUITS
🔓 Early access nouveaux cours
💰 Dividendes exclusifs (futur)
🎖️ Founder badge`,
        icon: '🏅',
        priceInPi: 0.02, // 12 months for price of 7
        priceInUSD: 69.99,
        isSubscription: true,
        subscriptionDuration: 'yearly',
        benefits: {
            premiumAccess: true,
            energyRechargeBoost: 100,
            xpMultiplier: 1.3,
            cosmetic: { type: 'badge', item: 'founder-badge' }
        },
        isRecurring: true,
        conversionPriority: 'high',
        targetUserLevel: [10, 99],
        urgency: { limited: true, expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 },
        socialProof: '⚡ LIMITED OFFER - Ends in 7 days',
        successRate: 6.2
    }
];

/**
 * 🔓 STRATÉGIE 4: EARLY UNLOCK TOKENS (Bypass Progression)
 */
export const UNLOCK_PRODUCTS: ShopProduct[] = [
    {
        id: 'unlock-token-single',
        name: 'Course Unlock Token',
        category: 'unlocks',
        description: 'Débloquez N\'IMPORTE QUEL cours instantanément, même sans les prérequis.',
        icon: '🔓',
        priceInPi: 0.001,
        priceInUSD: 8.99,
        benefits: { unlockCourseId: 'user-choice' },
        conversionPriority: 'medium',
        targetUserLevel: [5, 99],
        socialProof: 'Accélère ta progression',
        successRate: 14.3,
        limitPerUser: 10 // Prevent abuse
    },
    {
        id: 'unlock-token-bundle',
        name: 'Unlock Bundle (5 tokens)',
        category: 'unlocks',
        description: '5 tokens de déblocage. Économisez 30%!',
        icon: '🔓🔓🔓',
        priceInPi: 0.0035, // 5 for price of 3.5
        priceInUSD: 29.99,
        benefits: { unlockCourseId: 'user-choice-5x' },
        conversionPriority: 'low',
        targetUserLevel: [10, 99],
        urgency: { limited: true },
        successRate: 7.1
    }
];

/**
 * 🎨 STRATÉGIE 5: COSMÉTIQUES (Faible coût, haute marge)
 */
export const COSMETIC_PRODUCTS: ShopProduct[] = [
    {
        id: 'avatar-frame-gold',
        name: 'Gold Avatar Frame',
        category: 'cosmetics',
        description: 'Cadre doré animé pour votre avatar. Montrez votre statut!',
        icon: '🖼️',
        priceInPi: 0.0003,
        priceInUSD: 2.99,
        benefits: { cosmetic: { type: 'avatar-frame', item: 'gold-animated' } },
        conversionPriority: 'low',
        targetUserLevel: [10, 99],
        socialProof: 'Tendance cette semaine',
        successRate: 9.4
    },
    {
        id: 'profile-theme-dark',
        name: 'Dark Mode VIP',
        category: 'cosmetics',
        description: 'Thème sombre premium avec effets néon. Exclusif.',
        icon: '🌙',
        priceInPi: 0.0004,
        priceInUSD: 3.99,
        benefits: { cosmetic: { type: 'profile-theme', item: 'dark-neon' } },
        conversionPriority: 'low',
        targetUserLevel: [15, 99],
        urgency: { limited: true, stock: 1000 },
        successRate: 6.8
    },
    {
        id: 'title-master',
        name: 'Title: "Blockchain Master"',
        category: 'cosmetics',
        description: 'Titre affiché sous votre nom. Respect garanti.',
        icon: '📛',
        priceInPi: 0.0002,
        priceInUSD: 1.99,
        benefits: { cosmetic: { type: 'title', item: 'blockchain-master' } },
        conversionPriority: 'low',
        targetUserLevel: [12, 99],
        successRate: 11.2
    }
];

/**
 * 📦 STRATÉGIE 6: BUNDLES (Augmente panier moyen)
 */
export const BUNDLE_PRODUCTS: ShopProduct[] = [
    {
        id: 'starter-pack',
        name: 'Starter Pack',
        category: 'bundles',
        description: `🎁 Pack débutant parfait:
200⚡ Énergie
XP Boost 3h
1 Course Unlock Token
Avatar Frame Bronze`,
        icon: '🎒',
        priceInPi: 0.0015,
        priceInUSD: 14.99,
        benefits: {
            energy: 200,
            xpMultiplier: 1.5, // 3h
            unlockCourseId: 'user-choice',
            cosmetic: { type: 'avatar-frame', item: 'bronze' }
        },
        conversionPriority: 'high',
        targetUserLevel: [1, 5],
        urgency: { limited: true },
        socialProof: '🔥 BEST SELLER - 18,452 vendus',
        successRate: 24.7
    },
    {
        id: 'weekend-warrior',
        name: 'Weekend Warrior Pack',
        category: 'bundles',
        description: `⚡ Spécial weekend:
Énergie illimitée 48h
2x XP pendant 48h
+300 Reputation
Skip Cooldown x3`,
        icon: '🎮',
        priceInPi: 0.002,
        priceInUSD: 19.99,
        benefits: {
            energy: 9999,
            xpMultiplier: 2.0,
            reputationBoost: 300,
            skipCooldown: true
        },
        conversionPriority: 'high',
        targetUserLevel: [5, 99],
        urgency: { limited: true, expiresAt: Date.now() + 72 * 60 * 60 * 1000 },
        socialProof: 'WEEKEND ONLY',
        successRate: 19.2
    },
    {
        id: 'vip-ultimate',
        name: 'VIP Ultimate Bundle',
        category: 'bundles',
        description: `👑 Le pack ultime:
Premium 1 mois
1000⚡ Énergie
3x XP 7 jours
5 Unlock Tokens
Tous les cosmétiques
+500 Reputation`,
        icon: '💎',
        priceInPi: 0.008,
        priceInUSD: 79.99,
        benefits: {
            premiumAccess: true,
            energy: 1000,
            xpMultiplier: 3.0,
            unlockCourseId: 'user-choice-5x',
            reputationBoost: 500
        },
        conversionPriority: 'medium',
        targetUserLevel: [15, 99],
        urgency: { limited: true, stock: 100 },
        socialProof: '💎 EXCLUSIVE - Only 100 available',
        successRate: 3.8
    }
];

/**
 * 🎓 STRATÉGIE 7: SERVICES (Nouveauté - Haute valeur)
 */
export const SERVICE_PRODUCTS: ShopProduct[] = [
    {
        id: 'mentor-session',
        name: '1-on-1 Mentor Session',
        category: 'services',
        description: '30min avec un Pioneer Expert. Conseils personnalisés sur votre progression.',
        icon: '👨‍🏫',
        priceInPi: 0.005,
        priceInUSD: 29.99,
        benefits: {}, // Custom benefit
        conversionPriority: 'low',
        targetUserLevel: [10, 99],
        urgency: { limited: true, stock: 50 },
        socialProof: 'Sessions disponibles: 12/50',
        successRate: 8.9
    },
    {
        id: 'course-certificate-nft',
        name: 'Certificate NFT',
        category: 'services',
        description: 'NFT certifié de complétion de cours. Prouvez vos skills on-chain!',
        icon: '🎖️',
        priceInPi: 0.002,
        priceInUSD: 19.99,
        benefits: {},
        conversionPriority: 'low',
        targetUserLevel: [15, 99],
        socialProof: 'Vérifiable sur blockchain',
        successRate: 5.3
    },
    {
        id: 'priority-support',
        name: 'Priority Support 30 days',
        category: 'services',
        description: 'Support client prioritaire pendant 30 jours. Réponse <2h garantie.',
        icon: '🆘',
        priceInPi: 0.0015,
        priceInUSD: 12.99,
        benefits: {},
        conversionPriority: 'low',
        targetUserLevel: [1, 99],
        successRate: 4.2
    }
];

// Consolidation
export const ALL_SHOP_PRODUCTS: ShopProduct[] = [
    ...ENERGY_PRODUCTS,
    ...BOOSTER_PRODUCTS,
    ...PREMIUM_PRODUCTS,
    ...UNLOCK_PRODUCTS,
    ...COSMETIC_PRODUCTS,
    ...BUNDLE_PRODUCTS,
    ...SERVICE_PRODUCTS
];

/**
 * 💰 ANALYSE DE REVENUS PROJETS
 */
export const REVENUE_MODEL = {
    // Assumptions (par utilisateur actif/mois)
    averageMonthlyActiveUsers: 10000,
    
    // Taux de conversion par catégorie
    conversionRates: {
        energy: 0.23, // 23% achètent de l'énergie
        boosters: 0.15,
        premium: 0.08, // 8% deviennent premium
        unlocks: 0.05,
        cosmetics: 0.12,
        bundles: 0.18,
        services: 0.02
    },
    
    // Panier moyen par catégorie (USD)
    averageBasketValue: {
        energy: 2.49,
        boosters: 3.99,
        premium: 9.99, // recurring
        unlocks: 8.99,
        cosmetics: 2.99,
        bundles: 19.99,
        services: 24.99
    },
    
    // Revenus mensuels projetés (10k users)
    projectedMonthlyRevenue: {
        energy: 10000 * 0.23 * 2.49, // $5,727
        boosters: 10000 * 0.15 * 3.99, // $5,985
        premium: 10000 * 0.08 * 9.99, // $7,992 (RECURRING!)
        unlocks: 10000 * 0.05 * 8.99, // $4,495
        cosmetics: 10000 * 0.12 * 2.99, // $3,588
        bundles: 10000 * 0.18 * 19.99, // $35,982
        services: 10000 * 0.02 * 24.99, // $4,998
        
        // TOTAL: ~$68,767/month avec 10k MAU
        // Avec 100k MAU: ~$687,670/month
        // Avec 1M MAU: ~$6.87M/month
    }
};

/**
 * 🎯 STRATÉGIES D'OPTIMISATION DES REVENUS
 */
export const MONETIZATION_STRATEGIES = {
    // 1. Dynamic Pricing (A/B testing)
    testDifferentPricePoints: true,
    
    // 2. Time-limited offers (FOMO)
    flashSales: {
        enabled: true,
        frequency: 'weekly',
        discount: '30-50%'
    },
    
    // 3. First-time buyer discount
    welcomeOffer: {
        discount: 50, // 50% off first purchase
        showAfterMinutes: 10 // After 10min of usage
    },
    
    // 4. Retargeting cart abandoners
    cartRecovery: {
        emailAfter: 24, // hours
        pushNotificationAfter: 2 // hours
    },
    
    // 5. Loyalty program
    loyaltyTiers: {
        bronze: { threshold: 100, // $100 lifetime spend
            benefits: '+5% Pi back on purchases'
        },
        silver: { threshold: 500, benefits: '+10% Pi back + exclusive items' },
        gold: { threshold: 2000, benefits: '+15% Pi back + VIP access' }
    },
    
    // 6. Referral rewards
    referral: {
        referrerGets: '20% Pi back on friend purchases',
        refereeGets: '10⚡ welcome bonus'
    }
};

export default ALL_SHOP_PRODUCTS;
