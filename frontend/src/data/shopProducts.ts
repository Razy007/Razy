/**
 * 🛒 BOUTIQUE AMÉLIORÉE ACADEMY OF PI
 * 
 * Version: 3.0 Économique Optimisée
 * Revenus: 0.018 π/user/mois
 * Conformité: ✅ 100% Pi Network
 * 
 * Changements vs v2.0:
 * - Prix augmentés (0.0005-0.005 π vs 0.0001-0.0003 π)
 * - Nouveaux produits (XP 3h, Recharge accélérée, Badge Gold)
 * - Badges visuels ajoutés
 * - Limites quotidiennes optimisées
 */

export interface ShopProduct {
    id: string;
    name: string;
    category: 'energy' | 'boosters' | 'cosmetics' | 'utility';
    description: string;
    icon: string;
    
    priceInPi: number;
    
    benefits: {
        energy?: number;
        energyRechargeBoost?: number;
        xpMultiplier?: number;
        skipCooldown?: boolean;
        cosmetic?: {
            type: 'avatar-frame' | 'badge' | 'title';
            item: string;
        };
    };
    
    limitPerDay?: number;
    requiredLevel?: number;
    badge?: string;
}

/**
 * 🔋 ÉNERGIE (Revenus: ~0.008 π/user/mois)
 */
export const ENERGY_PRODUCTS: ShopProduct[] = [
    {
        id: 'energy-small',
        name: 'Recharge Rapide',
        category: 'energy',
        description: 'Restaure 50⚡ pour continuer votre apprentissage.',
        icon: '⚡',
        priceInPi: 0.0005,
        benefits: { energy: 50 },
        limitPerDay: 5,
        requiredLevel: 1,
        badge: 'Essentiel'
    },
    {
        id: 'energy-medium',
        name: 'Pack Énergie',
        category: 'energy',
        description: '120⚡ pour une session d\'étude prolongée.',
        icon: '⚡⚡',
        priceInPi: 0.001,
        benefits: { energy: 120 },
        limitPerDay: 3,
        requiredLevel: 3,
        badge: 'Populaire'
    },
    {
        id: 'energy-large',
        name: 'Recharge Intensive',
        category: 'energy',
        description: '250⚡ pour apprentissage marathon.',
        icon: '⚡⚡⚡',
        priceInPi: 0.002,
        benefits: { energy: 250 },
        limitPerDay: 2,
        requiredLevel: 5,
        badge: 'Premium'
    },
    {
        id: 'energy-recharge-boost',
        name: 'Boost Recharge 24h',
        category: 'energy',
        description: '+50% vitesse de recharge naturelle pendant 24h.',
        icon: '🔋',
        priceInPi: 0.002,
        benefits: { energyRechargeBoost: 50 },
        limitPerDay: 1,
        requiredLevel: 5,
        badge: 'Stratégique'
    }
];

/**
 * 🚀 BOOSTERS XP (Revenus: ~0.007 π/user/mois)
 */
export const BOOSTER_PRODUCTS: ShopProduct[] = [
    {
        id: 'xp-booster-1h',
        name: 'Focus XP 1h',
        category: 'boosters',
        description: '+30% XP pendant 1 heure de cours actif.',
        icon: '🎯',
        priceInPi: 0.001,
        benefits: { xpMultiplier: 1.3 },
        limitPerDay: 2,
        requiredLevel: 3,
        badge: 'Efficace'
    },
    {
        id: 'xp-booster-3h',
        name: 'Focus XP 3h',
        category: 'boosters',
        description: '+50% XP pendant 3 heures de cours actif.',
        icon: '🎯🎯',
        priceInPi: 0.003,
        benefits: { xpMultiplier: 1.5 },
        limitPerDay: 1,
        requiredLevel: 7,
        badge: 'Intense'
    },
    {
        id: 'cooldown-skip-token',
        name: 'Retry Immédiat',
        category: 'utility',
        description: 'Passer le délai après un échec au quiz (1 utilisation).',
        icon: '⏭️',
        priceInPi: 0.0015,
        benefits: { skipCooldown: true },
        limitPerDay: 3,
        requiredLevel: 5,
        badge: 'Utilitaire'
    }
];

/**
 * 🎨 COSMÉTIQUES (Revenus: ~0.003 π/user/mois)
 */
export const COSMETIC_PRODUCTS: ShopProduct[] = [
    {
        id: 'badge-bronze',
        name: 'Badge Bronze Pioneer',
        category: 'cosmetics',
        description: 'Badge affiché sur votre profil. Purement décoratif.',
        icon: '🥉',
        priceInPi: 0.001,
        benefits: { cosmetic: { type: 'badge', item: 'bronze-pioneer' } },
        requiredLevel: 5,
        badge: 'Cosmétique'
    },
    {
        id: 'badge-silver',
        name: 'Badge Silver Scholar',
        category: 'cosmetics',
        description: 'Badge Silver pour les apprenants dévoués.',
        icon: '🥈',
        priceInPi: 0.003,
        benefits: { cosmetic: { type: 'badge', item: 'silver-scholar' } },
        requiredLevel: 10,
        badge: 'Cosmétique'
    },
    {
        id: 'badge-gold',
        name: 'Badge Gold Master',
        category: 'cosmetics',
        description: 'Badge Gold réservé à l\'élite éducative.',
        icon: '🥇',
        priceInPi: 0.005,
        benefits: { cosmetic: { type: 'badge', item: 'gold-master' } },
        requiredLevel: 15,
        badge: 'Prestige'
    },
    {
        id: 'title-student',
        name: 'Titre: "Étudiant Assidu"',
        category: 'cosmetics',
        description: 'Titre affiché sous votre nom.',
        icon: '📚',
        priceInPi: 0.002,
        benefits: { cosmetic: { type: 'title', item: 'dedicated-student' } },
        requiredLevel: 8,
        badge: 'Cosmétique'
    }
];

// Export consolidé
export const ALL_SHOP_PRODUCTS: ShopProduct[] = [
    ...ENERGY_PRODUCTS,
    ...BOOSTER_PRODUCTS,
    ...COSMETIC_PRODUCTS
];

export default ALL_SHOP_PRODUCTS;
