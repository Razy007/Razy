import { PiUserProgress } from '../types';
import { ACADEMY_SHOP_ITEMS, ShopItem } from '../data/shopContent';

/**
 * MOTEUR ÉCONOMIQUE CENTRAL
 * Gère toutes les transactions, achats et calculs de droits de retrait.
 * Implémente la philosophie "Proof of Spend".
 */

// REGLES ÉCONOMIQUES (CONSTANTES)
const WITHDRAWAL_TIERS = {
    0: { name: 'Locked', maxDaily: 0, requiredCredibility: 0 },
    1: { name: 'Micro', maxDaily: 5, requiredCredibility: 50 },    // Faut avoir dépensé ~50 Pi
    2: { name: 'Standard', maxDaily: 50, requiredCredibility: 500 }, // Faut avoir une Licence Novice
    3: { name: 'Unlimited', maxDaily: 1000, requiredCredibility: 2500 } // Faut la Licence Pro
};

export class EconomyEngine {

    /**
     * S'assure que l'utilisateur a une structure économique valide (Migration à la volée)
     */
    private static ensureEconomyState(user: PiUserProgress) {
        if (!user.economy) {
            user.economy = {
                balance: user.piBalance || 0, // Migration solde existant
                transferableBalance: 0,
                lifetimeEarnings: user.piBalance || 0,
                lifetimeSpent: 0,
                credibilityScore: 0,
                withdrawalTier: 0,
                pendingWithdrawals: 0
            };
        }
        if (!user.inventory) user.inventory = [];
    }

    /**
     * Tente d'acheter un objet du shop.
     * @returns { success: boolean, updatedUser: PiUserProgress, message: string }
     */
    static purchaseItem(user: PiUserProgress, itemId: string): { success: boolean, updatedUser: PiUserProgress | null, message: string } {
        // Migration préventive
        this.ensureEconomyState(user);
        
        const item = ACADEMY_SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return { success: false, updatedUser: null, message: "Item introuvable." };

        // 1. Vérifications de base
        // ------------------------
        // Vérif Solde
        if (user.economy.balance < item.cost) {
            return { success: false, updatedUser: null, message: `Fonds insuffisants. Manque ${(item.cost - user.economy.balance).toFixed(2)} Pi.` };
        }

        // Vérif Niveau
        if (item.requiredLevel && user.level < item.requiredLevel) {
            return { success: false, updatedUser: null, message: `Niveau ${item.requiredLevel} requis.` };
        }

        // Vérif Quantité Max (pour les licences uniques)
        const existingItem = user.inventory.find(i => i.itemId === itemId);
        if (item.maxQuantity && existingItem) {
             // Si on a déjà l'item, on vérifie si la stack est max
             // Pour l'instant on simplifie : si on l'a, on bloque si maxQuantity = 1
             if (item.maxQuantity === 1) {
                 return { success: false, updatedUser: null, message: "Vous possédez déjà cet objet unique." };
             }
        }

        // 2. TRANSACTION (Atomic Logic模拟)
        // ------------------------------
        // On clone pour ne pas muter directement
        const updatedUser = JSON.parse(JSON.stringify(user)) as PiUserProgress;

        // A. Débit
        updatedUser.economy.balance -= item.cost;
        updatedUser.economy.lifetimeSpent += item.cost;
        updatedUser.economy.credibilityScore += item.credibilityScore;

        // B. Ajout Inventaire
        updatedUser.inventory.push({
            itemId: item.id,
            acquiredDate: Date.now(),
            active: true
        });

        // 3. APPLICATION DES EFFETS IMMÉDIATS
        // -----------------------------------
        this.applyItemEffect(updatedUser, item);

        // 4. RECALCUL DU STATUT DE RETRAIT (Anti-Farm)
        // --------------------------------------------
        this.recalculateWithdrawalTier(updatedUser);

        return { 
            success: true, 
            updatedUser: updatedUser, 
            message: `Achat réussi ! Crédibilité +${item.credibilityScore}` 
        };
    }

    /**
     * Applique l'effet technique de l'objet
     */
    private static applyItemEffect(user: PiUserProgress, item: ShopItem) {
        switch (item.effect.type) {
            case 'energy_refill':
                // On suppose max energy = 100 pour l'instant (devrait être dans config)
                // Si user.energy n'existe pas encore (migration), on init
                if (!user.energy) user.energy = { current: 0, max: 100, lastRechargeTime: Date.now() };
                
                user.energy.current = Math.min(user.energy.max, user.energy.current + item.effect.value);
                break;
            
            case 'unlock_withdrawal_tier':
                // L'effet est géré par le recalcul de tier basé sur la crédibilité, 
                // mais on peut forcer un flag si besoin. 
                // Ici, la simple possession de l'item + le score de crédibilité suffit.
                break;

            case 'xp_boost':
                // Logique de boost XP à implémenter (ex: flag dans user state)
                break;
        }
    }

    /**
     * Cœur de la logique Anti-Farm.
     * Le Tier de retrait dépend du Credibility Score.
     */
    private static recalculateWithdrawalTier(user: PiUserProgress) {
        const score = user.economy.credibilityScore;
        let newTier = 0;

        if (score >= WITHDRAWAL_TIERS[3].requiredCredibility) newTier = 3;
        else if (score >= WITHDRAWAL_TIERS[2].requiredCredibility) newTier = 2;
        else if (score >= WITHDRAWAL_TIERS[1].requiredCredibility) newTier = 1;
        else newTier = 0;

        // On ne retrograde jamais un tier acquis via achat (sauf punition, pas implémenté ici)
        if (newTier > user.economy.withdrawalTier) {
            user.economy.withdrawalTier = newTier;
            // On pourrait déclencher une notif "Félicitations, retraits débloqués !"
        }
    }

    /**
     * Calcule combien on peut retirer AUJOURD'HUI.
     */
    static getWithdrawalCapacity(user: PiUserProgress): { allowed: boolean, maxAmount: number, reason?: string, reasonKey?: string } {
        const tier = user.economy.withdrawalTier;
        const tierConfig = WITHDRAWAL_TIERS[tier as keyof typeof WITHDRAWAL_TIERS];

        if (tier === 0) {
            return { allowed: false, maxAmount: 0, reason: "Niveau de crédibilité insuffisant. Achetez des objets ou des licences.", reasonKey: "tier_0_reason" };
        }

        // Ici on pourrait ajouter une vérif de limite journalière stockée en DB
        // Pour l'instant on retourne le max théorique du tier
        return { allowed: true, maxAmount: tierConfig.maxDaily };
    }
}
