# 🎓 SYSTÈME D'ABONNEMENT PREMIUM - ACADEMY OF PI

## 🎯 Objectif

Implémenter un système d'abonnement mensuel "Scholar" et annuel "Expert" pour débloquer contenus avancés.

**Revenus Projetés** : 0.034 π/user/mois (50% des revenus totaux)

---

## 📋 TYPES D'ABONNEMENTS

### 1️⃣ Abonnement "Scholar" (Mensuel)

**Prix** : 0.03 π/mois  
**Avantages** :
- ✅ Accès tous cours premium
- ✅ Toutes simulations interactives
- ✅ Tous labs code (sandboxes)
- ✅ Vidéos complètes (30-60 min)
- ✅ Badge "Scholar" exclusif
- ✅ Support prioritaire

**Target** : 30% des utilisateurs actifs

---

### 2️⃣ Abonnement "Expert" (Annuel)

**Prix** : 0.25 π/an (économie de 0.11 π vs mensuel)  
**Avantages** :
- ✅ Tout du Scholar
- ✅ Badge "Expert Certified" prestigieux
- ✅ Accès early-access nouveaux cours
- ✅ Certificats NFT à prix réduit (-20%)
- ✅ Nom dans "Hall of Fame"

**Target** : 10% des utilisateurs actifs

---

## 💻 IMPLÉMENTATION BACKEND

### Étape 1 : Modifier Entité User

**Fichier** : `backend/src/domain/entities/User.ts`

**Ajouter** :
```typescript
export enum SubscriptionTier {
  FREE = 'free',
  SCHOLAR = 'scholar_monthly',
  EXPERT = 'expert_annual'
}

export class User {
  constructor(
    // ... champs existants
    public subscriptionTier: SubscriptionTier,
    public subscriptionExpiresAt: Date | null,
    public subscriptionStartedAt: Date | null,
    // ... reste
  ) {}

  static create(data: { piId: string; username: string; email?: string }): User {
    const now = new Date();
    return new User(
      // ... champs existants
      SubscriptionTier.FREE,
      null,
      null,
      // ... reste
    );
  }

  isSubscriptionActive(): boolean {
    if (this.subscriptionTier === SubscriptionTier.FREE) return false;
    if (!this.subscriptionExpiresAt) return false;
    return new Date() < this.subscriptionExpiresAt;
  }

  hasAccessToPremium(): boolean {
    return this.isSubscriptionActive();
  }

  renewSubscription(tier: SubscriptionTier): void {
    const now = new Date();
    this.subscriptionTier = tier;
    this.subscriptionStartedAt = now;

    if (tier === SubscriptionTier.SCHOLAR) {
      this.subscriptionExpiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // +30 jours
    } else if (tier === SubscriptionTier.EXPERT) {
      this.subscriptionExpiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000); // +365 jours
    }
  }
}
```

---

### Étape 2 : Migration SQL

**Fichier** : `backend/migrations/add_subscription_fields.sql`

```sql
-- Ajouter colonnes subscription à la table users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(50) DEFAULT 'free';

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP NULL;

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_started_at TIMESTAMP NULL;

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier 
ON users(subscription_tier);

CREATE INDEX IF NOT EXISTS idx_users_subscription_expires_at 
ON users(subscription_expires_at);

-- Mettre à jour users existants
UPDATE users 
SET subscription_tier = 'free',
    subscription_expires_at = NULL,
    subscription_started_at = NULL
WHERE subscription_tier IS NULL;
```

**Appliquer** :
```bash
psql -U postgres -d pi_academy -f backend/migrations/add_subscription_fields.sql
```

---

### Étape 3 : Service Subscription

**Fichier** : `backend/src/infrastructure/services/SubscriptionService.ts` (créer)

```typescript
import { UserRepository } from '../repositories/UserRepository';
import { TransactionRepository } from '../repositories/TransactionRepository';
import { Transaction, TransactionType, TransactionStatus } from '../../domain/entities/Transaction';
import { SubscriptionTier } from '../../domain/entities/User';

interface SubscriptionPricing {
  tier: SubscriptionTier;
  priceInPi: number;
  durationDays: number;
}

export class SubscriptionService {
  private readonly PRICING: SubscriptionPricing[] = [
    { tier: SubscriptionTier.SCHOLAR, priceInPi: 0.03, durationDays: 30 },
    { tier: SubscriptionTier.EXPERT, priceInPi: 0.25, durationDays: 365 }
  ];

  constructor(
    private userRepository: UserRepository,
    private transactionRepository: TransactionRepository
  ) {}

  async subscribe(userId: string, tier: SubscriptionTier): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    const pricing = this.PRICING.find(p => p.tier === tier);
    if (!pricing) throw new Error('Invalid subscription tier');

    // Vérifier solde
    if (user.piBalance < pricing.priceInPi) {
      return {
        success: false,
        error: 'INSUFFICIENT_BALANCE',
        required: pricing.priceInPi,
        available: user.piBalance
      };
    }

    // Déduire Pi
    user.piBalance -= pricing.priceInPi;

    // Activer subscription
    user.renewSubscription(tier);
    await this.userRepository.save(user);

    // Enregistrer transaction
    const transaction = Transaction.create({
      userId,
      type: TransactionType.SUBSCRIPTION,
      amount: -pricing.priceInPi,
      description: `Subscription: ${tier} (${pricing.durationDays} jours)`,
      status: TransactionStatus.COMPLETED,
      metadata: { tier, durationDays: pricing.durationDays }
    });
    await this.transactionRepository.save(transaction);

    return {
      success: true,
      tier,
      expiresAt: user.subscriptionExpiresAt,
      newBalance: user.piBalance
    };
  }

  async cancelSubscription(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    user.subscriptionTier = SubscriptionTier.FREE;
    user.subscriptionExpiresAt = null;
    user.subscriptionStartedAt = null;
    await this.userRepository.save(user);

    return { success: true, message: 'Subscription canceled' };
  }

  async getSubscriptionStatus(userId: string): Promise<any> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new Error('User not found');

    return {
      tier: user.subscriptionTier,
      isActive: user.isSubscriptionActive(),
      expiresAt: user.subscriptionExpiresAt,
      startedAt: user.subscriptionStartedAt,
      daysRemaining: user.subscriptionExpiresAt 
        ? Math.ceil((user.subscriptionExpiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0
    };
  }
}
```

---

### Étape 4 : Controller

**Fichier** : `backend/src/presentation/controllers/SubscriptionController.ts` (créer)

```typescript
import { Request, Response } from 'express';
import { SubscriptionService } from '../../infrastructure/services/SubscriptionService';
import { SubscriptionTier } from '../../domain/entities/User';

export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  subscribe = async (req: Request, res: Response) => {
    try {
      const { tier } = req.body;
      const userId = (req as any).user.id;

      if (!Object.values(SubscriptionTier).includes(tier)) {
        return res.status(400).json({ error: 'Invalid subscription tier' });
      }

      const result = await this.subscriptionService.subscribe(userId, tier);
      
      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  cancel = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const result = await this.subscriptionService.cancelSubscription(userId);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };

  getStatus = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id;
      const status = await this.subscriptionService.getSubscriptionStatus(userId);
      res.json(status);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
```

---

### Étape 5 : Routes

**Fichier** : `backend/src/presentation/routes/subscription.routes.ts` (créer)

```typescript
import { Router } from 'express';
import { SubscriptionController } from '../controllers/SubscriptionController';
import { SubscriptionService } from '../../infrastructure/services/SubscriptionService';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { TransactionRepository } from '../../infrastructure/repositories/TransactionRepository';
import Database from '../../config/database';
import { authenticateToken } from '../middlewares/authentication';

const router = Router();
const db = Database.getInstance();
const userRepository = new UserRepository(db.pool);
const transactionRepository = new TransactionRepository(db.pool);
const subscriptionService = new SubscriptionService(userRepository, transactionRepository);
const subscriptionController = new SubscriptionController(subscriptionService);

//@ts-ignore
router.post('/subscribe', authenticateToken, subscriptionController.subscribe);
//@ts-ignore
router.post('/cancel', authenticateToken, subscriptionController.cancel);
//@ts-ignore
router.get('/status', authenticateToken, subscriptionController.getStatus);

export default router;
```

**Ajouter dans** : `backend/src/presentation/routes/index.ts`

```typescript
import subscriptionRoutes from './subscription.routes';

// ...
app.use('/api/subscriptions', subscriptionRoutes);
```

---

## 💻 IMPLÉMENTATION FRONTEND

### Étape 1 : Types TypeScript

**Fichier** : `frontend/src/types/index.ts`

**Ajouter** :
```typescript
export enum SubscriptionTier {
  FREE = 'free',
  SCHOLAR = 'scholar_monthly',
  EXPERT = 'expert_annual'
}

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: Date | null;
  startedAt: Date | null;
  daysRemaining: number;
}
```

---

### Étape 2 : Service API

**Fichier** : `frontend/src/services/ApiService.ts`

**Ajouter** :
```typescript
// Subscription
async subscribeToTier(tier: SubscriptionTier): Promise<AxiosResponse> {
  return this.client.post('/subscriptions/subscribe', { tier });
},

async cancelSubscription(): Promise<AxiosResponse> {
  return this.client.post('/subscriptions/cancel');
},

async getSubscriptionStatus(): Promise<AxiosResponse<SubscriptionStatus>> {
  return this.client.get('/subscriptions/status');
}
```

---

### Étape 3 : Page Subscription

**Fichier** : `frontend/src/pages/SubscriptionPage.tsx` (créer)

```typescript
import React, { useEffect, useState } from 'react';
import { Crown, Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, Button } from '../components/BaseComponents';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/ApiService';
import { toast } from 'react-hot-toast';
import { SubscriptionTier } from '../types';

const SubscriptionPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !user.uid.startsWith('guest_')) {
      loadSubscriptionStatus();
    }
  }, [user]);

  const loadSubscriptionStatus = async () => {
    try {
      const response = await ApiService.getSubscriptionStatus();
      setSubscriptionStatus(response.data);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    }
  };

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user || user.uid.startsWith('guest_')) {
      toast.error('Connectez-vous avec Pi pour vous abonner');
      return;
    }

    setLoading(true);
    try {
      const response = await ApiService.subscribeToTier(tier);
      if (response.data.success) {
        toast.success(`Abonnement ${tier} activé !`);
        await refreshProfile();
        await loadSubscriptionStatus();
      } else {
        toast.error(response.data.error || 'Échec abonnement');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free',
      tier: SubscriptionTier.FREE,
      price: 0,
      duration: 'Gratuit',
      features: [
        { name: 'Cours fondamentaux', included: true },
        { name: 'Quiz basiques', included: true },
        { name: 'Cours avancés', included: false },
        { name: 'Simulations', included: false },
        { name: 'Labs code', included: false },
        { name: 'Vidéos complètes', included: false },
        { name: 'Badges premium', included: false }
      ]
    },
    {
      name: 'Scholar',
      tier: SubscriptionTier.SCHOLAR,
      price: 0.03,
      duration: 'Mensuel',
      badge: 'Populaire',
      features: [
        { name: 'Cours fondamentaux', included: true },
        { name: 'Quiz basiques', included: true },
        { name: 'Cours avancés', included: true },
        { name: 'Simulations', included: true },
        { name: 'Labs code', included: true },
        { name: 'Vidéos complètes', included: true },
        { name: 'Badge Scholar', included: true }
      ]
    },
    {
      name: 'Expert',
      tier: SubscriptionTier.EXPERT,
      price: 0.25,
      duration: 'Annuel',
      badge: 'Meilleure Valeur',
      features: [
        { name: 'Tout du Scholar', included: true },
        { name: 'Badge Expert Certified', included: true },
        { name: 'Early-access cours', included: true },
        { name: 'Certificats -20%', included: true },
        { name: 'Hall of Fame', included: true },
        { name: 'Support prioritaire', included: true }
      ]
    }
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <Crown size={56} className="text-yellow-500 mx-auto" />
        <h2 className="text-5xl font-black text-white">
          {t('subscription.title', 'Abonnements Premium')}
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto">
          {t('subscription.subtitle', 'Débloquez tous les contenus avancés et devenez un expert certifié de l\'écosystème Pi.')}
        </p>
      </div>

      {subscriptionStatus?.isActive && (
        <Card className="bg-yellow-500/10 border-yellow-500/20 p-8">
          <div className="flex items-center gap-4">
            <Crown size={32} className="text-yellow-500" />
            <div>
              <h3 className="text-xl font-bold text-white">Abonnement Actif : {subscriptionStatus.tier}</h3>
              <p className="text-white/60">Expire dans {subscriptionStatus.daysRemaining} jours</p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <Card key={i} className={`p-10 flex flex-col h-full relative ${plan.tier === SubscriptionTier.SCHOLAR ? 'border-yellow-500/50 shadow-yellow-500/20' : 'bg-white/5'}`}>
            {plan.badge && (
              <div className="absolute top-6 right-6 px-3 py-1 bg-yellow-500 text-black text-[8px] font-black uppercase rounded-full">
                {plan.badge}
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-white mb-4">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-5xl font-black text-white">{plan.price}</span>
                <span className="text-xl text-yellow-500">π</span>
              </div>
              <p className="text-white/40 text-sm mt-2">{plan.duration}</p>
            </div>

            <ul className="space-y-4 flex-grow mb-8">
              {plan.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3">
                  {feature.included ? (
                    <Check size={16} className="text-green-500" />
                  ) : (
                    <X size={16} className="text-red-500" />
                  )}
                  <span className={feature.included ? 'text-white' : 'text-white/30'}>{feature.name}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.tier === SubscriptionTier.SCHOLAR ? 'premium' : 'primary'}
              className="w-full"
              onClick={() => handleSubscribe(plan.tier)}
              disabled={loading || plan.tier === SubscriptionTier.FREE || subscriptionStatus?.tier === plan.tier}
            >
              {subscriptionStatus?.tier === plan.tier ? 'Actif' : plan.tier === SubscriptionTier.FREE ? 'Actuel' : 'S\'abonner'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPage;
```

---

### Étape 4 : Ajouter Route

**Fichier** : `frontend/src/App.tsx`

**Ajouter** :
```typescript
import SubscriptionPage from './pages/SubscriptionPage';

// Dans les routes:
<Route path="/subscription" element={<SubscriptionPage />} />
```

**Fichier** : `frontend/src/components/layout/Header.tsx`

**Ajouter** :
```typescript
<Link to="/subscription" className="text-white/60 hover:text-white">
  {t('nav.subscription', 'Premium')}
</Link>
```

---

## 📊 REVENUS PROJETÉS

### Scénario 1,000 Users

- 30% Scholar (300 users × 0.03 π) = **9 π/mois**
- 10% Expert (100 users × 0.25 π / 12) = **2.08 π/mois**

**Total Subscription** : **11.08 π/mois**

---

### Scénario 10,000 Users

- 30% Scholar (3,000 users × 0.03 π) = **90 π/mois**
- 10% Expert (1,000 users × 0.25 π / 12) = **20.8 π/mois**

**Total Subscription** : **110.8 π/mois**

---

## ✅ CHECKLIST DÉPLOIEMENT

- [ ] Appliquer migration SQL `add_subscription_fields.sql`
- [ ] Créer `SubscriptionService.ts`
- [ ] Créer `SubscriptionController.ts`
- [ ] Ajouter routes `/api/subscriptions/*`
- [ ] Ajouter enum `SubscriptionTier` (frontend/backend)
- [ ] Créer page `SubscriptionPage.tsx`
- [ ] Ajouter route `/subscription`
- [ ] Rebuild backend + frontend
- [ ] Tester achats sandbox Pi
- [ ] Monitorer conversions

---

**Date** : 2026-01-15  
**Version** : Subscription System v1.0  
**Status** : ✅ Prêt pour Déploiement
