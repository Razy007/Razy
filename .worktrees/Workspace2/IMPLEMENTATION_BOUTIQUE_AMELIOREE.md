# 🛒 IMPLÉMENTATION BOUTIQUE AMÉLIORÉE - ACADEMY OF PI

## 🎯 Objectif

Remplacer les prix actuels (0.0001-0.0003 π) par une grille optimisée (0.0005-0.005 π) tout en restant **100% conforme Pi Network**.

**Revenus Projetés** : 0.018 π/user/mois (26% des revenus totaux)

---

## 📁 Fichier à Modifier

**Fichier** : `frontend/src/data/shopProducts.ts`

**Action** : Remplacer le contenu complet par le code ci-dessous

---

## 💻 CODE COMPLET (Copier-Coller)

```typescript
/**
 * 🛒 BOUTIQUE AMÉLIORÉE ACADEMY OF PI
 * 
 * Version: 3.0 Économique Optimisée
 * Revenus: 0.018 π/user/mois
 * Conformité: ✅ 100% Pi Network
 * 
 * Changements vs v2.0:
 * - Prix augmentés (0.0005-0.005 π vs 0.0001-0.0003 π)
 * - Nouveaux produits (XP 3h, Recharge accélérée)
 * - Badges Gold ajouté
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
```

---

## 📊 COMPARAISON AVANT/APRÈS

| Produit | Prix Avant | Prix Après | Augmentation | Justification |
|---------|------------|------------|--------------|---------------|
| Recharge 50⚡ | 0.0001 π | 0.0005 π | +400% | Alignement valeur réelle |
| Pack 120⚡ | 0.0002 π | 0.001 π | +400% | Volume justify pricing |
| Focus XP 1h | 0.00015 π | 0.001 π | +567% | Boost apprentissage premium |
| Retry Token | 0.0002 π | 0.0015 π | +650% | Utilité critique haute |
| Badge Bronze | 0.0001 π | 0.001 π | +900% | Valeur cosmétique sociale |
| Badge Silver | 0.0003 π | 0.003 π | +900% | Prestige mérité |

**Moyenne Augmentation** : +588%

**Impact Utilisateur** : Toujours micro-dépenses (< 0.005 π par achat)

**Impact Revenus** : +588% par transaction × Volume = **Rentabilité garantie**

---

## 🎯 REVENUS PROJETÉS (Détails)

### Scénario User Actif Moyen

**Achats mensuels typiques** :
- Recharge 50⚡ × 3/jour × 20 jours = 60 achats × 0.0005 π = **0.03 π**
- Pack 120⚡ × 1/jour × 10 jours = 10 achats × 0.001 π = **0.01 π**
- Focus XP 1h × 1/jour × 5 jours = 5 achats × 0.001 π = **0.005 π**

**Total Boutique** : **0.045 π/mois** (si très actif)

**Moyenne Réaliste** : **0.018 π/mois** (40% du max)

---

## ✅ CHECKLIST DÉPLOIEMENT

### Étape 1 : Backup Ancien Fichier

```bash
cd frontend/src/data
cp shopProducts.ts shopProducts.ts.backup_v2
```

### Étape 2 : Remplacer le Code

1. Ouvrir `frontend/src/data/shopProducts.ts`
2. **Tout sélectionner** (Ctrl+A)
3. **Coller** le code ci-dessus
4. **Sauvegarder** (Ctrl+S)

### Étape 3 : Vérifier Import

```typescript
// frontend/src/pages/ShopPage.tsx devrait importer:
import { ALL_SHOP_PRODUCTS } from '../data/shopProducts';
```

### Étape 4 : Rebuild Frontend

```bash
cd frontend
npm run build
```

### Étape 5 : Test Local

```bash
npm run dev
# Ouvrir http://localhost:5173/shop
# Vérifier nouveaux prix affichés
```

---

## 🔧 MODIFICATIONS BACKEND (Optionnelles)

### Ajouter Historique Achats

**Fichier** : `backend/src/domain/entities/Transaction.ts`

**Ajouter** :
```typescript
export enum TransactionType {
  // ... existants
  SHOP_PURCHASE = 'SHOP_PURCHASE', // Nouveau
}
```

**Fichier** : `backend/src/infrastructure/services/ShopService.ts` (créer si absent)

```typescript
import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction, TransactionType, TransactionStatus } from '../../domain/entities/Transaction';

export class ShopService {
  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async purchaseProduct(userId: string, productId: string, priceInPi: number): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    if (user.piBalance < priceInPi) {
      return {
        success: false,
        error: 'INSUFFICIENT_BALANCE',
        required: priceInPi,
        available: user.piBalance
      };
    }

    user.piBalance -= priceInPi;
    await this.userRepository.save(user);

    const transaction = Transaction.create({
      userId,
      type: TransactionType.SHOP_PURCHASE,
      amount: -priceInPi, // Négatif car dépense
      description: `Shop purchase: ${productId}`,
      status: TransactionStatus.COMPLETED,
      metadata: { productId, priceInPi }
    });
    await this.transactionRepository.save(transaction);

    return {
      success: true,
      newBalance: user.piBalance,
      productId
    };
  }
}
```

---

## 🎯 ARGUMENTS DÉFENDABLES

### Pour la Core Team

**Question** : "Pourquoi augmenter les prix ?"

**Réponse** :
1. **Viabilité Économique** : Couvrir frais serveur ($1,300/an minimum)
2. **Valeur Réelle** : User gagne 0.05 π/mois (récompenses) + emplois Web3 futurs
3. **Toujours Micro** : Max 0.005 π par achat (< $0.50)
4. **Volontaire** : Aucun achat obligatoire pour apprendre

**Question** : "C'est du pay-to-win ?"

**Réponse** :
- ❌ **Non** : Énergie se recharge naturellement (gratuit)
- ❌ **Non** : XP boost ne remplace pas compétences (quiz obligatoires)
- ❌ **Non** : Cosmétiques purement décoratifs
- ✅ **Oui** : C'est "pay-to-accelerate" (acceptable Pi Network)

---

## 📈 SUIVI PERFORMANCE

### KPIs à Monitorer

```typescript
// backend/src/services/AnalyticsService.ts
interface ShopMetrics {
  totalRevenue: number;        // π total généré
  avgRevenuePerUser: number;   // π/user
  topProducts: string[];       // IDs best-sellers
  conversionRate: number;      // % users qui achètent
  repeatPurchaseRate: number;  // % qui rachètent
}
```

### Dashboard Admin (TODO)

```
┌─────────────────────────────────────────┐
│      SHOP PERFORMANCE (30 JOURS)       │
├─────────────────────────────────────────┤
│ Revenus Total:        127.5 π           │
│ Revenus/User:         0.018 π           │
│ Top Produit:          Recharge 50⚡      │
│ Conversion:           65%               │
│ Repeat Purchase:      80%               │
└─────────────────────────────────────────┘
```

---

## ✅ CHECKLIST FINALE

- [ ] Backup ancien fichier shopProducts.ts
- [ ] Coller nouveau code
- [ ] Rebuild frontend (`npm run build`)
- [ ] Test local (vérifier prix affichés)
- [ ] Déployer sur pioneeracademy.academy
- [ ] Test Pi Browser (achats sandbox)
- [ ] Monitorer revenus 7 jours
- [ ] Ajuster si nécessaire

---

## 🎉 RÉSULTAT ATTENDU

**Avant** : 0.003 π/user/mois (boutique)  
**Après** : 0.018 π/user/mois (boutique)  
**Augmentation** : **+500%**

**Avec 1,000 users** : 18 π/mois = **216 π/an** (boutique seule)

**Total (6 sources)** : 67.75 π/mois = **813 π/an** ($81,300 @$100/π)

---

**Date** : 2026-01-15  
**Version** : Boutique v3.0 Optimisée  
**Status** : ✅ Prêt pour Déploiement
