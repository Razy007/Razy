# Documentation Système de Parrainage - MayimavaStore

## 📋 Vue d'ensemble

Système de parrainage conçu pour MayimavaStore avec mécanismes anti-abus robustes, tenant compte que **seuls les vendeurs font le KYC** (pas les acheteurs).

---

## 🎯 Objectifs

1. ✅ Permettre aux membres de parrainer de nouveaux utilisateurs
2. ✅ Récompenser parrains et filleuls avec des coupons de réduction
3. ✅ **Prévenir les abus** (multi-comptes, faux parrainages)
4. ✅ Gérer les coupons non-remboursables vendus sur la plateforme

---

## 🔐 Stratégie Anti-Abus (Sans KYC pour Acheteurs)

### Mécanismes de Vérification Multi-Niveaux

#### 1. **Empreinte Digitale du Navigateur (Fingerprinting)**

```javascript
// Collecte au moment de l'inscription
{
  userAgent: string,
  screenResolution: string,
  timezone: string,
  language: string,
  canvasFingerprint: string,  // Unique par navigateur
  webGLFingerprint: string,
  audioFingerprint: string
}
```

**Logique:** Bloquer si fingerprint identique à un compte existant (même parrain).

#### 2. **Vérification IP + Comportement Réseau**

```javascript
{
  ipAddress: string,
  ipCountry: string,
  isVPN: boolean,      // Détection via services (IPHub, IPQualityScore)
  isProxy: boolean,
  isTor: boolean
}
```

**Règles:**

- ❌ Bloquer parrainages si même IP dans les dernières 24h
- ⚠️ Limiter à 3 comptes maximum par IP (sur 30 jours)
- ❌ Bloquer VPN/Proxy pour nouvelles inscriptions via parrainage

#### 3. **Informations de Paiement Uniques**

```javascript
// Au premier achat
{
  cardFingerprint: string,      // Hash des 6 premiers + 4 derniers chiffres
  billingAddress: string,
  phoneNumber: string,          // Vérification SMS obligatoire
  email: string                 // Vérification email obligatoire
}
```

**Validation:** Un même moyen de paiement ne peut être associé qu'à UN SEUL compte.

#### 4. **Progression Comportementale (Gamification)**

```javascript
// Système de niveaux pour débloquer récompenses
const userTrustLevel = {
  NEW: {
    daysRequired: 0,
    actionsRequired: 0,
    canReceiveReferralBonus: false,
  },
  BRONZE: {
    daysRequired: 7,
    actionsRequired: 3, // 3 connexions distinctes
    minPurchase: 0,
    canReceiveReferralBonus: true,
    bonusMultiplier: 1.0,
  },
  SILVER: {
    daysRequired: 30,
    actionsRequired: 10,
    minPurchase: 50, // 50€ d'achats cumulés
    canReceiveReferralBonus: true,
    bonusMultiplier: 1.2,
  },
  GOLD: {
    daysRequired: 90,
    actionsRequired: 25,
    minPurchase: 200,
    canReceiveReferralBonus: true,
    bonusMultiplier: 1.5,
  },
};
```

**Récompense progressive:** Le filleul ne reçoit le bonus de parrainage qu'après avoir atteint le niveau BRONZE minimum.

#### 5. **Vérification Téléphonique Obligatoire**

```javascript
// Inscription via parrainage
{
  phoneVerification: {
    required: true,
    method: "SMS",
    maxAttemptsPerPhone: 3,
    cooldownHours: 24
  }
}
```

**Règle:** Un numéro de téléphone = 1 seul compte actif.

---

## 💾 Schéma de Base de Données

### Table: `users`

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20) UNIQUE,
  phone_verified BOOLEAN DEFAULT FALSE,
  email_verified BOOLEAN DEFAULT FALSE,

  -- Anti-abus
  browser_fingerprint VARCHAR(255),
  ip_address VARCHAR(45),
  ip_country VARCHAR(2),
  is_vpn BOOLEAN DEFAULT FALSE,

  -- Trust level
  trust_level ENUM('NEW', 'BRONZE', 'SILVER', 'GOLD') DEFAULT 'NEW',
  account_created_at TIMESTAMP DEFAULT NOW(),
  first_purchase_at TIMESTAMP,
  total_spent DECIMAL(10,2) DEFAULT 0,
  login_count INT DEFAULT 0,

  -- KYC (vendeurs uniquement)
  is_seller BOOLEAN DEFAULT FALSE,
  kyc_verified BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_browser_fingerprint ON users(browser_fingerprint);
CREATE INDEX idx_ip_address ON users(ip_address);
CREATE INDEX idx_phone ON users(phone);
```

### Table: `referrals`

```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY,
  referrer_id UUID NOT NULL,  -- Parrain
  referee_id UUID NOT NULL,   -- Filleul
  referral_code VARCHAR(20) UNIQUE NOT NULL,

  -- Statut du parrainage
  status ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'REJECTED') DEFAULT 'PENDING',
  rejection_reason TEXT,

  -- Conditions de validation
  referee_trust_level_achieved ENUM('NEW', 'BRONZE', 'SILVER', 'GOLD'),
  referee_first_purchase_at TIMESTAMP,
  referee_first_purchase_amount DECIMAL(10,2),

  -- Récompenses
  referrer_reward_issued BOOLEAN DEFAULT FALSE,
  referee_reward_issued BOOLEAN DEFAULT FALSE,
  referrer_coupon_id UUID,
  referee_coupon_id UUID,

  created_at TIMESTAMP DEFAULT NOW(),
  validated_at TIMESTAMP,

  FOREIGN KEY (referrer_id) REFERENCES users(id),
  FOREIGN KEY (referee_id) REFERENCES users(id),
  FOREIGN KEY (referrer_coupon_id) REFERENCES coupons(id),
  FOREIGN KEY (referee_coupon_id) REFERENCES coupons(id)
);

CREATE INDEX idx_referrer ON referrals(referrer_id);
CREATE INDEX idx_referee ON referrals(referee_id);
CREATE INDEX idx_status ON referrals(status);
```

### Table: `coupons`

```sql
CREATE TABLE coupons (
  id UUID PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,

  -- Type de coupon
  type ENUM('REFERRAL_REWARD', 'PURCHASED', 'PROMOTIONAL') NOT NULL,

  -- Valeur
  discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
  discount_value DECIMAL(10,2) NOT NULL,
  min_purchase_amount DECIMAL(10,2) DEFAULT 0,
  max_discount_amount DECIMAL(10,2),

  -- Propriété
  owner_id UUID,
  transferable BOOLEAN DEFAULT FALSE,

  -- Utilisation
  is_used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  used_in_order_id UUID,

  -- Validité
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,

  -- NON REMBOURSABLE
  refundable BOOLEAN DEFAULT FALSE,

  -- Si vendu sur marketplace
  is_for_sale BOOLEAN DEFAULT FALSE,
  sale_price DECIMAL(10,2),
  original_owner_id UUID,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (owner_id) REFERENCES users(id),
  FOREIGN KEY (used_in_order_id) REFERENCES orders(id),
  FOREIGN KEY (original_owner_id) REFERENCES users(id)
);

CREATE INDEX idx_owner ON coupons(owner_id);
CREATE INDEX idx_code ON coupons(code);
CREATE INDEX idx_type ON coupons(type);
```

### Table: `fraud_checks`

```sql
CREATE TABLE fraud_checks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  check_type VARCHAR(50) NOT NULL,

  -- Données de vérification
  fingerprint_data JSON,
  ip_data JSON,
  device_data JSON,

  -- Résultat
  risk_score INT,  -- 0-100
  is_suspicious BOOLEAN DEFAULT FALSE,
  flags JSON,      -- Liste des red flags

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_user_fraud ON fraud_checks(user_id);
CREATE INDEX idx_risk_score ON fraud_checks(risk_score);
```

---

## 🔄 Flux de Parrainage

### 1. Génération du Code de Parrainage

```javascript
// API: POST /api/referrals/generate
async function generateReferralCode(userId) {
  const user = await User.findById(userId);

  // Vérifier éligibilité
  if (user.trust_level === "NEW") {
    throw new Error("Niveau de confiance insuffisant pour parrainer");
  }

  const code = generateUniqueCode(); // Ex: "MAY-JOHN-X7K2"

  await Referral.create({
    referrer_id: userId,
    referral_code: code,
    status: "PENDING",
  });

  return { code, shareUrl: `https://mayimavastore.com/register?ref=${code}` };
}
```

### 2. Inscription du Filleul

```javascript
// API: POST /api/auth/register
async function registerWithReferral(userData, referralCode) {
  // 1. Vérifications anti-fraude
  const fraudCheck = await performFraudCheck(userData);

  if (fraudCheck.risk_score > 70) {
    throw new Error("Inscription suspecte. Veuillez contacter le support.");
  }

  // 2. Créer utilisateur
  const user = await User.create({
    ...userData,
    trust_level: "NEW",
    browser_fingerprint: userData.fingerprint,
    ip_address: userData.ip,
  });

  // 3. Envoyer vérification SMS/Email
  await sendVerificationSMS(user.phone);
  await sendVerificationEmail(user.email);

  // 4. Lier au parrainage (PENDING)
  if (referralCode) {
    const referral = await Referral.findOne({ referral_code: referralCode });

    if (!referral) {
      throw new Error("Code de parrainage invalide");
    }

    await Referral.update(referral.id, {
      referee_id: user.id,
      status: "PENDING",
    });
  }

  return user;
}
```

### 3. Vérification Anti-Fraude

```javascript
async function performFraudCheck(userData) {
  const { fingerprint, ip, phone, email } = userData;

  let riskScore = 0;
  const flags = [];

  // Check 1: Fingerprint dupliqué
  const existingFingerprint = await User.findOne({
    browser_fingerprint: fingerprint,
  });
  if (existingFingerprint) {
    riskScore += 40;
    flags.push("DUPLICATE_FINGERPRINT");
  }

  // Check 2: IP dupliquée (24h)
  const recentIpUsers = await User.countDocuments({
    ip_address: ip,
    created_at: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });
  if (recentIpUsers >= 3) {
    riskScore += 30;
    flags.push("MULTIPLE_ACCOUNTS_SAME_IP");
  }

  // Check 3: VPN/Proxy
  const ipInfo = await checkIPQuality(ip);
  if (ipInfo.isVPN || ipInfo.isProxy) {
    riskScore += 20;
    flags.push("VPN_DETECTED");
  }

  // Check 4: Téléphone dupliqué
  const existingPhone = await User.findOne({ phone, phone_verified: true });
  if (existingPhone) {
    riskScore += 50;
    flags.push("DUPLICATE_PHONE");
  }

  // Enregistrer le check
  await FraudCheck.create({
    user_id: userData.userId,
    check_type: "REGISTRATION",
    fingerprint_data: { fingerprint },
    ip_data: ipInfo,
    risk_score: riskScore,
    is_suspicious: riskScore > 70,
    flags,
  });

  return { risk_score: riskScore, flags };
}
```

### 4. Progression vers BRONZE (Déblocage Récompenses)

```javascript
// Cron job quotidien
async function updateUserTrustLevels() {
  const eligibleUsers = await User.find({
    trust_level: "NEW",
    email_verified: true,
    phone_verified: true,
    account_created_at: {
      $lte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    login_count: { $gte: 3 },
  });

  for (const user of eligibleUsers) {
    // Passer à BRONZE
    await User.update(user.id, { trust_level: "BRONZE" });

    // Activer les parrainages en attente
    const pendingReferrals = await Referral.find({
      referee_id: user.id,
      status: "PENDING",
    });

    for (const referral of pendingReferrals) {
      await activateReferral(referral.id);
    }
  }
}

async function activateReferral(referralId) {
  const referral = await Referral.findById(referralId);

  // Générer coupons pour parrain ET filleul
  const referrerCoupon = await Coupon.create({
    code: generateCouponCode(),
    type: "REFERRAL_REWARD",
    discount_type: "PERCENTAGE",
    discount_value: 10, // 10% de réduction
    owner_id: referral.referrer_id,
    valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 jours
    refundable: false,
  });

  const refereeCoupon = await Coupon.create({
    code: generateCouponCode(),
    type: "REFERRAL_REWARD",
    discount_type: "PERCENTAGE",
    discount_value: 5, // 5% de réduction
    owner_id: referral.referee_id,
    valid_until: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    refundable: false,
  });

  // Mettre à jour le parrainage
  await Referral.update(referralId, {
    status: "COMPLETED",
    validated_at: new Date(),
    referrer_reward_issued: true,
    referee_reward_issued: true,
    referrer_coupon_id: referrerCoupon.id,
    referee_coupon_id: refereeCoupon.id,
  });

  // Notifications
  await sendNotification(
    referral.referrer_id,
    "Votre filleul est validé! Coupon disponible"
  );
  await sendNotification(
    referral.referee_id,
    "Bienvenue! Votre coupon de bienvenue est prêt"
  );
}
```

---

## 🎁 Gestion des Coupons

### Règles Métier

1. **Non-Remboursables**: Tous les coupons (achetés ou gagnés) sont NON REMBOURSABLES
2. **Vendus par MayimavaStore**: Les coupons sont proposés à l'achat PAR LA MARKETPLACE (source de revenus)
3. **Non-Cumulables**: Un seul coupon par commande
4. **Pré-Application**: Doivent être appliqués AVANT validation de commande
5. **Non-Transférables**: Les utilisateurs NE PEUVENT PAS revendre leurs coupons

---

## 💰 MODÈLE ÉCONOMIQUE - Vente de Coupons

### Stratégie de Monétisation

Les coupons sont une **source de revenus directe** pour MayimavaStore. Voici le modèle économique:

#### 1. **Catalogue de Coupons à Vendre**

| Coupon       | Réduction | Prix d'Achat | ROI Marketplace | Achat Minimum | Validité  |
| ------------ | --------- | ------------ | --------------- | ------------- | --------- |
| **STARTER**  | -5%       | 2 000 FCFA   | 100% profit     | 20 000 FCFA   | 30 jours  |
| **BRONZE**   | -10%      | 4 000 FCFA   | 100% profit     | 40 000 FCFA   | 60 jours  |
| **SILVER**   | -15%      | 7 000 FCFA   | 100% profit     | 50 000 FCFA   | 90 jours  |
| **GOLD**     | -20%      | 12 000 FCFA  | 100% profit     | 80 000 FCFA   | 90 jours  |
| **PLATINUM** | -25%      | 20 000 FCFA  | 100% profit     | 120 000 FCFA  | 120 jours |
| **FLASH**    | -30%      | 15 000 FCFA  | 100% profit     | 100 000 FCFA  | 7 jours   |

**Logique de Pricing:**

```javascript
Prix Coupon = (Achat Minimum × % Réduction) × 0.4 à 0.6

Exemple BRONZE:
- Réduction: -10%
- Achat minimum: 40 000 FCFA
- Économie client max: 4 000 FCFA
- Prix coupon: 4 000 FCFA (50% de l'économie)
- Client gagne: 0 FCFA si achat = 40k, mais économise sur achats > 40k
```

#### 2. **Rentabilité pour MayimavaStore**

**Scénario Client Type:**

```javascript
// Client achète coupon SILVER
Prix coupon: 7 000 FCFA
Panier moyen: 75 000 FCFA

Calculs:
- Économie client: 75 000 × 15% = 11 250 FCFA
- Client paye: 7 000 FCFA (coupon)
- Gain net client: 11 250 - 7 000 = 4 250 FCFA économisés

Pour MayimavaStore:
- Revenu direct: 7 000 FCFA (coupon vendu)
- Commission normale (10%): 75 000 × 10% = 7 500 FCFA
- Réduction donnée: -11 250 FCFA
- Perte sur commission: -11 250 FCFA
- GAIN NET: 7 000 - 4 250 = 2 750 FCFA

✅ Marketplace gagne TOUJOURS (coupon vendu avant utilisation)
```

**Pourquoi c'est rentable:**

1. **Coupon payé immédiatement** (trésorerie instantanée)
2. **Pas de garantie d'utilisation** (30% des coupons expirés = profit pur)
3. **Augmentation panier moyen** (client achète plus pour "rentabiliser")
4. **Fidélisation** (client revient pour utiliser avant expiration)

#### 3. **Gamification & Offres Dynamiques**

**A. Packs de Coupons (Cross-Sell)**

```javascript
{
  name: "Pack Économie",
  coupons: [
    { type: "STARTER", qty: 2 },
    { type: "BRONZE", qty: 1 }
  ],
  prixNormal: 8 000,
  prixPack: 6 500,  // -19% discount
  économie: 1 500
}

{
  name: "Pack VIP",
  coupons: [
    { type: "GOLD", qty: 2 },
    { type: "SILVER", qty: 1 }
  ],
  prixNormal: 31 000,
  prixPack: 25 000,  // -19%
  bonus: "Premium 1 mois OFFERT"
}
```

**B. Coupons Événementiels (FOMO)**

```javascript
// Black Friday
{
  name: "BLACK FRIDAY",
  reduction: -35%,
  prixCoupon: 25 000,
  achatMinimum: 150 000,
  validité: "3 jours",
  stock: 500,  // Quantité limitée
  compteurEnDirecte: true  // "Plus que 87 coupons!"
}

// Anniversaire Marketplace
{
  name: "ANNIV-2025",
  reduction: -40%,
  prixCoupon: 30 000,
  achatMinimum: 200 000,
  validité: "24 heures",
  eligible: "Membres depuis > 6 mois"
}
```

**C. Programme de Fidélité (Tier System)**

```javascript
// Achats coupons ≠ Membership Premium
const couponLoyalty = {
  BRONZE: {
    couponsAchetés: 3,
    avantage: "Livraison gratuite sur prochaine commande",
  },
  SILVER: {
    couponsAchetés: 10,
    avantage: "Accès coupons VIP en avant-première",
  },
  GOLD: {
    couponsAchetés: 25,
    avantage: "Cashback 5% sur achat de coupons",
  },
};
```

#### 4. **Psychologie de Vente (UI/UX Recommandé)**

**Page "Boutique Coupons":**

```javascript
// Card Coupon - Exemple SILVER
{
  badge: "POPULAIRE",  // Social proof
  titre: "SILVER -15%",
  prixBarré: 10 000,
  prix: 7 000,
  économie: "Économisez jusqu'à 15 000 FCFA",
  social: "🔥 347 personnes ont acheté aujourd'hui",
  urgence: "Expire dans 3h pour ce prix",
  cta: "ACHETER MAINTENANT"
}

// Affichage économie potentielle
Copier le code
"Avec un panier de 100 000 FCFA, vous économisez 15 000 FCFA
→ Gain net: 8 000 FCFA (après achat coupon)"
```

**Notifications Push:**

```javascript
// Remarketing intelligent
"Votre panier (85 000 FCFA) est éligible au coupon SILVER!
→ Économisez 12 750 FCFA pour 7 000 FCFA 💰"

// Expiration proche
"Votre coupon GOLD expire dans 5 jours!
Valeur restante: 20 000 FCFA 🎁"
```

#### 5. **Projections Financières**

**Hypothèses (Marketplace moyenne Afrique):**

- Utilisateurs actifs/mois: 10 000
- Taux conversion coupons: 15% (1 500 achats/mois)
- Panier moyen coupon: 8 000 FCFA

**Revenus Mensuels Estimés:**

```javascript
Scénario Conservateur:
- 1 500 coupons vendus
- Prix moyen: 8 000 FCFA
- Taux expiration: 30% (450 coupons non utilisés)

Revenus:
- Vente coupons: 1 500 × 8 000 = 12 000 000 FCFA
- Profit sur expirés: 450 × 8 000 = 3 600 000 FCFA (profit pur)
- TOTAL: 15 600 000 FCFA/mois

Coût (réductions accordées):
- 1 050 coupons utilisés
- Panier moyen: 75 000 FCFA
- Réduction moyenne: 12%
- Manque à gagner: 1 050 × 75k × 12% × 10% = 945 000 FCFA

BÉNÉFICE NET: 15 600 000 - 945 000 = 14 655 000 FCFA/mois
```

**Scénario Optimiste (6 mois après lancement):**

```javascript
- 3 000 coupons/mois
- Prix moyen: 10 000 FCFA
- Revenus: 30 000 000 FCFA/mois
- Profit net: ~27 000 000 FCFA/mois
```

#### 6. **KPIs à Tracker**

```javascript
{
  ventes: {
    nbCouponsVendus: number,
    revenusTotal: number,
    panierMoyen: number,
    tauxConversion: percentage  // Visiteurs → Acheteurs coupons
  },

  utilisation: {
    tauxUtilisation: percentage,  // Utilisés / Vendus
    tauxExpiration: percentage,   // Profit pur
    délaiMoyenUtilisation: days
  },

  impact: {
    augmentationPanierMoyen: percentage,
    tauxRetourClient: percentage,  // Achètent après 1er coupon
    LTVAvecCoupons: amount
  }
}
```

---

## 🎁 Gestion Technique des Coupons

### Application d'un Coupon

```javascript
// API: POST /api/orders/apply-coupon
async function applyCoupon(orderId, couponCode) {
  const order = await Order.findById(orderId);
  const coupon = await Coupon.findOne({ code: couponCode });

  // Validations
  if (!coupon) throw new Error("Coupon invalide");
  if (coupon.is_used) throw new Error("Coupon déjà utilisé");
  if (coupon.owner_id !== order.user_id)
    throw new Error("Ce coupon ne vous appartient pas");
  if (new Date() > coupon.valid_until) throw new Error("Coupon expiré");
  if (order.total < coupon.min_purchase_amount)
    throw new Error("Montant minimum non atteint");

  // Calculer réduction
  let discount = 0;
  if (coupon.discount_type === "PERCENTAGE") {
    discount = (order.subtotal * coupon.discount_value) / 100;
    if (coupon.max_discount_amount) {
      discount = Math.min(discount, coupon.max_discount_amount);
    }
  } else {
    discount = coupon.discount_value;
  }

  // Appliquer
  await Order.update(orderId, {
    coupon_id: coupon.id,
    discount_amount: discount,
    total: order.subtotal - discount,
  });

  return { discount, newTotal: order.subtotal - discount };
}
```

### Utilisation Finale (Validation Commande)

```javascript
// API: POST /api/orders/:id/validate
async function validateOrder(orderId) {
  const order = await Order.findById(orderId);

  if (order.coupon_id) {
    // Marquer coupon comme utilisé
    await Coupon.update(order.coupon_id, {
      is_used: true,
      used_at: new Date(),
      used_in_order_id: orderId,
    });
  }

  await Order.update(orderId, { status: "CONFIRMED" });
}
```

### Retour de Marchandise (Coupon NON Remboursé)

```javascript
// API: POST /api/orders/:id/refund
async function processRefund(orderId) {
  const order = await Order.findById(orderId);

  // Rembourser le montant payé (SANS le coupon)
  const refundAmount = order.total; // Montant après réduction

  // Le coupon reste consommé (non récupérable)
  await processPaymentRefund(refundAmount);

  await Order.update(orderId, {
    status: "REFUNDED",
    refund_amount: refundAmount,
  });

  // Note: Le coupon n'est PAS réactivé
  return {
    refunded: refundAmount,
    couponStatus: "CONSUMED_NOT_REFUNDABLE",
  };
}
```

### Vente de Coupons sur Marketplace

```javascript
// API: POST /api/coupons/:id/list-for-sale
async function listCouponForSale(couponId, salePrice) {
  const coupon = await Coupon.findById(couponId);

  // Validations
  if (coupon.is_used) throw new Error("Coupon déjà utilisé");
  if (!coupon.transferable && coupon.type === "REFERRAL_REWARD") {
    // Coupons de parrainage peuvent être vendus
    await Coupon.update(couponId, { transferable: true });
  }

  await Coupon.update(couponId, {
    is_for_sale: true,
    sale_price: salePrice,
    original_owner_id: coupon.owner_id,
  });

  // Créer annonce marketplace
  await MarketplaceListing.create({
    type: "COUPON",
    item_id: couponId,
    seller_id: coupon.owner_id,
    price: salePrice,
  });
}

// API: POST /api/coupons/:id/purchase
async function purchaseCoupon(couponId, buyerId) {
  const coupon = await Coupon.findById(couponId);

  if (!coupon.is_for_sale) throw new Error("Coupon non disponible à la vente");

  // Transfert de propriété
  await Coupon.update(couponId, {
    owner_id: buyerId,
    is_for_sale: false,
    transferable: true,
  });

  // Paiement vendeur
  await processPayment(buyerId, coupon.owner_id, coupon.sale_price);

  return { message: "Coupon acheté avec succès" };
}
```

---

## 🚀 API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription (avec code parrainage optionnel)
- `POST /api/auth/verify-phone` - Vérification SMS
- `POST /api/auth/verify-email` - Vérification email

### Parrainage

- `POST /api/referrals/generate` - Générer code de parrainage
- `GET /api/referrals/my-referrals` - Liste des filleuls
- `GET /api/referrals/stats` - Statistiques de parrainage

### Coupons

- `GET /api/coupons/my-coupons` - Mes coupons disponibles
- `POST /api/coupons/:id/list-for-sale` - Mettre en vente
- `POST /api/coupons/:id/purchase` - Acheter un coupon

### Commandes

- `POST /api/orders/apply-coupon` - Appliquer coupon
- `POST /api/orders/:id/validate` - Valider commande

---

## 📊 Métriques & Monitoring

### Indicateurs à Surveiller

```javascript
// Dashboard Admin
{
  fraud_detection: {
    daily_suspicious_registrations: number,
    blocked_accounts: number,
    average_risk_score: number
  },
  referral_system: {
    active_referrals: number,
    pending_validations: number,
    conversion_rate: percentage,
    average_time_to_bronze: days
  },
  coupons: {
    total_issued: number,
    total_used: number,
    total_for_sale: number,
    average_discount_value: amount
  }
}
```

### Alertes Automatiques

- Score de risque > 80 sur 5 inscriptions en 1h
- Plus de 10 comptes créés depuis même IP en 24h
- Utilisation de coupon suspect (transferts multiples)

---

## 🛡️ Sécurité & Conformité

### Protection des Données

- Hachage des fingerprints (SHA-256)
- Chiffrement des numéros de téléphone
- Conformité RGPD pour données IP

### Rate Limiting

```javascript
{
  registration: '5 per hour per IP',
  referral_generation: '10 per day per user',
  coupon_application: '20 per hour per user'
}
```

---

## 📝 Exemple d'Implémentation Frontend

### Inscription avec Parrainage

```javascript
// RegisterForm.jsx
import FingerprintJS from "@fingerprintjs/fingerprintjs";

async function handleRegister(formData, referralCode) {
  // Générer fingerprint
  const fp = await FingerprintJS.load();
  const result = await fp.get();

  const payload = {
    ...formData,
    fingerprint: result.visitorId,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    referral_code: referralCode,
  };

  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (response.ok) {
    alert("Vérifiez votre téléphone pour le code SMS!");
  }
}
```

### Application de Coupon

```javascript
// CheckoutPage.jsx
async function applyCoupon(couponCode) {
  const response = await fetch(`/api/orders/${orderId}/apply-coupon`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coupon_code: couponCode }),
  });

  const data = await response.json();

  if (response.ok) {
    setDiscount(data.discount);
    setTotal(data.newTotal);
    alert(`✅ Réduction de ${data.discount}€ appliquée!`);
  } else {
    alert(`❌ ${data.error}`);
  }
}
```

---

## ✅ Checklist Déploiement

- [ ] Configurer service de vérification SMS (Twilio/Vonage)
- [ ] Intégrer API détection VPN (IPQualityScore)
- [ ] Implémenter fingerprinting navigateur (FingerprintJS)
- [ ] Configurer cron jobs (trust level, expirations)
- [ ] Créer dashboard admin anti-fraude
- [ ] Tests de charge (inscriptions simultanées)
- [ ] Documentation API complète (Swagger)
- [ ] Formation équipe support (gestion litiges)

---

## 🔧 Stack Technique Recommandée

**Backend:**

- Node.js + Express (ou NestJS)
- PostgreSQL (relationnel pour intégrité)
- Redis (cache + rate limiting)
- Bull (job queues)

**Frontend:**

- React/Vue
- FingerprintJS Pro
- Axios

**Services Tiers:**

- Twilio (SMS)
- IPQualityScore (anti-fraude IP)
- Stripe/PayPal (paiements)

---

## 📞 Support & Questions

Pour toute question technique, contactez l'architecte système avec:

- Schéma de données spécifique
- Logs d'erreur complets
- Cas d'usage problématique

**Document créé le:** 2025-12-31  
**Version:** 1.0  
**Auteur:** Équipe Technique MayimavaStore
