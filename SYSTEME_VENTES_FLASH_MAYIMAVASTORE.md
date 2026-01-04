# 🔥 SYSTÈME VENTES FLASH - MayimavaStore

## 📋 Vue d'Ensemble

Système de ventes flash monétisé aligné avec la logique **CORRECTIONS_FINALES_PROD_READY**:

- ✅ Vendus PAR MayimavaStore (pas P2P)
- ✅ Non remboursables
- ✅ Protection anti-abus (trust score, fingerprinting)
- ✅ Modèle économique clair

---

## 🎯 Concept de Monétisation

### Modèle: "Accès VIP Ventes Flash"

Au lieu de vendre juste des produits en promo, MayimavaStore vend **l'accès privilégié** aux ventes flash:

```javascript
// 🔓 GRATUIT (Utilisateurs Standard)
{
  accèsVentesFlash: true,
  notificationAvance: '0 heures',    // Email au lancement
  réservationAvant: false,           // Pas de réservation
  stockGaranti: false,               // Premier arrivé, premier servi
  prioritéAchat: 'NORMAL'
}

// 💎 PAYANT (Pass Flash VIP)
{
  accèsVentesFlash: true,
  notificationAvance: '24 heures',   // SMS 24h avant
  réservationAvant: true,            // Réserver 12h avant lancement
  stockGaranti: true,                // 1 unité garantie
  prioritéAchat: 'VIP',              // File d'attente prioritaire

  prix: 5000,                        // 5 000 FCFA
  validité: '30 jours'               // Accès illimité pendant 30j
}
```

---

## 💰 MODÈLES DE MONÉTISATION

### Option 1: Pass Flash (Recommandé pour MVP)

**Produit:** Abonnement accès VIP ventes flash

| Pass         | Prix        | Durée    | Avantages                                          |
| ------------ | ----------- | -------- | -------------------------------------------------- |
| **FLASH 7J** | 3 000 FCFA  | 7 jours  | Notifications SMS 12h avant, accès prioritaire     |
| **FLASH 1M** | 8 000 FCFA  | 30 jours | SMS 24h avant, réservation 6h avant, stock garanti |
| **FLASH 3M** | 20 000 FCFA | 90 jours | Tout ci-dessus + early bird -5% supplémentaire     |

**Rentabilité:**

```javascript
// Scénario conservateur
const monthlyRevenue = {
  utilisateursActifs: 10000,
  tauxConversion: 0.12, // 12% achètent un pass
  acheteurs: 1200,

  distribution: {
    FLASH_7J: { qty: 600, prix: 3000, total: 1800000 }, // 1.8M
    FLASH_1M: { qty: 500, prix: 8000, total: 4000000 }, // 4M
    FLASH_3M: { qty: 100, prix: 20000, total: 2000000 }, // 2M
  },

  revenuTotal: 7800000, // 7.8M FCFA/mois
  coûtPromo: 2000000, // Réductions accordées
  bénéficeNet: 5800000, // 5.8M FCFA/mois
};
```

### Option 2: Réservation à l'Unité (Complémentaire)

**Produit:** Payer pour réserver UN produit flash spécifique

```javascript
// Vente flash: iPhone 15 à -40%
{
  produit: "iPhone 15 Pro",
  prixNormal: 500000,
  prixFlash: 300000,
  économie: 200000,
  stock: 20,

  // Monétisation réservation
  prixRéservation: 10000,            // 10 000 FCFA (5% économie)
  avantage: "Garantit 1 unité même si rupture stock",

  modèleEconomique: {
    ventePrix: 300000,
    commissionMarketplace: 30000,     // 10%
    fraisRéservation: 10000,          // 100% profit
    totalMarketplace: 40000           // vs 50k sans réservation
  }
}
```

### Option 3: Notifications Premium (Low-Cost)

**Produit:** Alertes SMS prioritaires

```javascript
{
  nom: "Flash Alert Premium",
  prix: 1500,                        // 1 500 FCFA/mois

  gratuit: {
    notification: "Email jour J",
    délai: "Au lancement"
  },

  premium: {
    notification: "SMS + Email",
    délai: "24h avant lancement",
    catégories: "Personnalisables (Electronics, Mode, etc.)"
  }
}
```

---

## 💾 SCHÉMA DE BASE DE DONNÉES

### Table: `flash_sales`

```sql
CREATE TABLE flash_sales (
  id UUID PRIMARY KEY,

  -- Informations produit
  product_id UUID NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image_url TEXT,

  -- Prix
  original_price DECIMAL(10,2) NOT NULL,
  flash_price DECIMAL(10,2) NOT NULL,
  discount_percentage INT NOT NULL,     -- Calculé: (original - flash) / original × 100

  -- Stock
  total_stock INT NOT NULL,
  reserved_stock INT DEFAULT 0,         -- Réservations VIP
  sold_stock INT DEFAULT 0,
  available_stock INT GENERATED ALWAYS AS (total_stock - reserved_stock - sold_stock) STORED,

  -- Timing
  announcement_at TIMESTAMP,            -- Annonce (24h avant)
  reservation_opens_at TIMESTAMP,       -- Réservations VIP (12h avant)
  sale_starts_at TIMESTAMP NOT NULL,    -- Début vente publique
  sale_ends_at TIMESTAMP NOT NULL,

  -- Statut
  status ENUM('SCHEDULED', 'ANNOUNCED', 'RESERVATION_OPEN', 'LIVE', 'ENDED', 'CANCELLED') DEFAULT 'SCHEDULED',

  -- Restrictions
  max_per_user INT DEFAULT 1,           -- Limite par utilisateur
  min_trust_score INT DEFAULT 40,       -- Trust score minimum requis

  -- Vendeur (si vendu par vendeur marketplace)
  seller_id UUID,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (seller_id) REFERENCES users(id)
);

CREATE INDEX idx_flash_status ON flash_sales(status);
CREATE INDEX idx_flash_dates ON flash_sales(sale_starts_at, sale_ends_at);
CREATE INDEX idx_flash_product ON flash_sales(product_id);
```

### Table: `flash_passes`

```sql
CREATE TABLE flash_passes (
  id UUID PRIMARY KEY,

  -- Type de pass
  type ENUM('FLASH_7J', 'FLASH_1M', 'FLASH_3M') NOT NULL,

  -- Propriétaire (NON TRANSFÉRABLE)
  owner_id UUID NOT NULL,

  -- Prix payé
  price_paid DECIMAL(10,2) NOT NULL,
  purchase_date TIMESTAMP DEFAULT NOW(),

  -- Validité
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,

  -- Utilisation
  reservations_count INT DEFAULT 0,
  purchases_count INT DEFAULT 0,

  -- Source
  source ENUM('PURCHASED', 'REFERRAL_REWARD', 'PROMOTIONAL') DEFAULT 'PURCHASED',

  -- NON REMBOURSABLE
  refundable BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE INDEX idx_pass_owner ON flash_passes(owner_id);
CREATE INDEX idx_pass_active ON flash_passes(is_active, valid_until);
```

### Table: `flash_reservations`

```sql
CREATE TABLE flash_reservations (
  id UUID PRIMARY KEY,

  -- Vente flash concernée
  flash_sale_id UUID NOT NULL,

  -- Utilisateur
  user_id UUID NOT NULL,

  -- Pass utilisé (si VIP)
  flash_pass_id UUID,

  -- Réservation
  reserved_at TIMESTAMP DEFAULT NOW(),
  reservation_expires_at TIMESTAMP NOT NULL,  -- 30 min pour acheter

  -- Statut
  status ENUM('RESERVED', 'PURCHASED', 'EXPIRED', 'CANCELLED') DEFAULT 'RESERVED',

  -- Achat final
  order_id UUID,
  purchased_at TIMESTAMP,

  -- Prix de réservation (si payant)
  reservation_fee DECIMAL(10,2) DEFAULT 0,
  reservation_fee_paid BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (flash_sale_id) REFERENCES flash_sales(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (flash_pass_id) REFERENCES flash_passes(id),
  FOREIGN KEY (order_id) REFERENCES orders(id),

  -- Un user ne peut réserver qu'une fois par vente flash
  UNIQUE(flash_sale_id, user_id)
);

CREATE INDEX idx_reservation_user ON flash_reservations(user_id);
CREATE INDEX idx_reservation_status ON flash_reservations(status);
CREATE INDEX idx_reservation_flash ON flash_reservations(flash_sale_id);
```

### Table: `flash_notifications`

```sql
CREATE TABLE flash_notifications (
  id UUID PRIMARY KEY,

  -- Vente flash
  flash_sale_id UUID NOT NULL,

  -- Type notification
  type ENUM('ANNOUNCEMENT', 'RESERVATION_OPEN', 'SALE_LIVE', 'STOCK_LOW', 'LAST_CHANCE') NOT NULL,

  -- Destinataires
  target ENUM('ALL', 'VIP_ONLY', 'INTERESTED_USERS') NOT NULL,

  -- Channels
  send_email BOOLEAN DEFAULT TRUE,
  send_sms BOOLEAN DEFAULT FALSE,       -- Réservé aux VIP (pass flash)
  send_push BOOLEAN DEFAULT TRUE,

  -- Timing
  scheduled_for TIMESTAMP NOT NULL,
  sent_at TIMESTAMP,

  -- Statut
  status ENUM('PENDING', 'SENT', 'FAILED') DEFAULT 'PENDING',

  -- Stats
  recipients_count INT DEFAULT 0,
  delivered_count INT DEFAULT 0,
  clicked_count INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (flash_sale_id) REFERENCES flash_sales(id)
);

CREATE INDEX idx_notif_scheduled ON flash_notifications(scheduled_for, status);
```

---

## 🔄 FLUX UTILISATEUR

### 1. Achat Pass Flash VIP

```javascript
// API: POST /api/flash-passes/purchase
async function purchaseFlashPass(userId, passType) {
  const passPricing = {
    FLASH_7J: { price: 3000, days: 7 },
    FLASH_1M: { price: 8000, days: 30 },
    FLASH_3M: { price: 20000, days: 90 },
  };

  const config = passPricing[passType];

  // 1. Vérifications anti-abus
  const user = await User.findById(userId);
  const trustScore = await calculateTrustScore(userId);

  if (trustScore < 40) {
    throw new Error("Niveau de confiance insuffisant");
  }

  // 2. Vérifier qu'il n'a pas déjà un pass actif (éviter duplicatas)
  const existingPass = await FlashPass.findOne({
    owner_id: userId,
    is_active: true,
    valid_until: { $gte: new Date() },
  });

  if (existingPass) {
    throw new Error("Vous avez déjà un pass actif");
  }

  // 3. Créer pass
  const validUntil = new Date(Date.now() + config.days * 24 * 60 * 60 * 1000);

  const pass = await FlashPass.create({
    type: passType,
    owner_id: userId,
    price_paid: config.price,
    valid_from: new Date(),
    valid_until: validUntil,
    is_active: true,
    source: "PURCHASED",
    refundable: false,
  });

  // 4. Paiement
  await processPayment(userId, config.price, {
    type: "FLASH_PASS",
    pass_id: pass.id,
  });

  // 5. Notification
  await sendNotification(
    userId,
    `🔥 Votre Pass Flash ${passType} est actif jusqu'au ${validUntil.toLocaleDateString()}`
  );

  return { pass, validUntil };
}
```

### 2. Création Vente Flash (Admin)

```javascript
// API: POST /api/admin/flash-sales/create
async function createFlashSale(adminId, saleData) {
  const {
    productId,
    originalPrice,
    flashPrice,
    totalStock,
    saleStartsAt,
    duration, // en heures
    maxPerUser,
  } = saleData;

  // Calculs automatiques
  const discountPercentage = Math.round(
    ((originalPrice - flashPrice) / originalPrice) * 100
  );

  const saleEndsAt = new Date(
    new Date(saleStartsAt).getTime() + duration * 60 * 60 * 1000
  );

  const announcementAt = new Date(
    new Date(saleStartsAt).getTime() - 24 * 60 * 60 * 1000 // 24h avant
  );

  const reservationOpensAt = new Date(
    new Date(saleStartsAt).getTime() - 12 * 60 * 60 * 1000 // 12h avant
  );

  // Créer vente flash
  const flashSale = await FlashSale.create({
    product_id: productId,
    original_price: originalPrice,
    flash_price: flashPrice,
    discount_percentage: discountPercentage,
    total_stock: totalStock,
    announcement_at: announcementAt,
    reservation_opens_at: reservationOpensAt,
    sale_starts_at: saleStartsAt,
    sale_ends_at: saleEndsAt,
    status: "SCHEDULED",
    max_per_user: maxPerUser || 1,
    min_trust_score: 40,
  });

  // Planifier notifications automatiques
  await scheduleFlashNotifications(flashSale.id);

  return flashSale;
}

async function scheduleFlashNotifications(flashSaleId) {
  const sale = await FlashSale.findById(flashSaleId);

  // 1. Annonce (24h avant - VIP only via SMS)
  await FlashNotification.create({
    flash_sale_id: flashSaleId,
    type: "ANNOUNCEMENT",
    target: "VIP_ONLY",
    send_email: true,
    send_sms: true, // ✅ SMS pour VIP
    send_push: true,
    scheduled_for: sale.announcement_at,
    status: "PENDING",
  });

  // 2. Ouverture réservations (12h avant - VIP only)
  await FlashNotification.create({
    flash_sale_id: flashSaleId,
    type: "RESERVATION_OPEN",
    target: "VIP_ONLY",
    send_email: true,
    send_sms: true,
    scheduled_for: sale.reservation_opens_at,
    status: "PENDING",
  });

  // 3. Vente en direct (tous - email uniquement pour gratuit)
  await FlashNotification.create({
    flash_sale_id: flashSaleId,
    type: "SALE_LIVE",
    target: "ALL",
    send_email: true,
    send_sms: false, // ❌ Gratuit = pas de SMS
    send_push: true,
    scheduled_for: sale.sale_starts_at,
    status: "PENDING",
  });

  // 4. Stock faible (< 20% - tous)
  // Calculé dynamiquement pendant la vente
}
```

### 3. Réservation VIP (Pass Flash requis)

```javascript
// API: POST /api/flash-sales/:id/reserve
async function reserveFlashSale(flashSaleId, userId) {
  const sale = await FlashSale.findById(flashSaleId);
  const user = await User.findById(userId);

  // 1. Vérifier timing (réservations ouvertes?)
  const now = new Date();
  if (now < sale.reservation_opens_at) {
    throw new Error("Les réservations ne sont pas encore ouvertes");
  }

  if (now >= sale.sale_starts_at) {
    throw new Error("La vente a déjà commencé. Réservations fermées.");
  }

  // 2. Vérifier Pass Flash actif
  const activePass = await FlashPass.findOne({
    owner_id: userId,
    is_active: true,
    valid_until: { $gte: now },
  });

  if (!activePass) {
    throw new Error("Pass Flash VIP requis pour réserver");
  }

  // 3. Vérifier trust score
  const trustScore = await calculateTrustScore(userId);
  if (trustScore < sale.min_trust_score) {
    throw new Error("Niveau de confiance insuffisant");
  }

  // 4. Vérifier stock disponible
  if (sale.available_stock <= 0) {
    throw new Error("Stock épuisé");
  }

  // 5. Vérifier qu'il n'a pas déjà réservé
  const existingReservation = await FlashReservation.exists({
    flash_sale_id: flashSaleId,
    user_id: userId,
    status: { $in: ["RESERVED", "PURCHASED"] },
  });

  if (existingReservation) {
    throw new Error("Vous avez déjà une réservation");
  }

  // 6. Créer réservation
  const expiresAt = new Date(now.getTime() + 30 * 60 * 1000); // 30 min

  const reservation = await FlashReservation.create({
    flash_sale_id: flashSaleId,
    user_id: userId,
    flash_pass_id: activePass.id,
    reservation_expires_at: expiresAt,
    status: "RESERVED",
  });

  // 7. Décrémenter stock disponible
  await FlashSale.update(flashSaleId, {
    reserved_stock: sale.reserved_stock + 1,
  });

  // 8. Notification
  await sendNotification(
    userId,
    `✅ Produit réservé! Achetez avant ${expiresAt.toLocaleString()}`
  );

  return { reservation, expiresAt };
}
```

### 4. Achat Produit Flash

```javascript
// API: POST /api/flash-sales/:id/purchase
async function purchaseFlashProduct(flashSaleId, userId) {
  const sale = await FlashSale.findById(flashSaleId);
  const now = new Date();

  // 1. Vérifier timing (vente live?)
  if (now < sale.sale_starts_at || now > sale.sale_ends_at) {
    throw new Error("Vente flash non disponible");
  }

  // 2. Vérifier réservation (si VIP)
  const reservation = await FlashReservation.findOne({
    flash_sale_id: flashSaleId,
    user_id: userId,
    status: "RESERVED",
  });

  let priority = "NORMAL";

  if (reservation) {
    // VIP avec réservation
    if (now > reservation.reservation_expires_at) {
      throw new Error("Votre réservation a expiré");
    }
    priority = "VIP";
  } else {
    // Utilisateur standard - vérifier stock
    if (sale.available_stock <= 0) {
      throw new Error("Stock épuisé");
    }
  }

  // 3. Vérifier limite par utilisateur
  const userPurchases = await FlashReservation.countDocuments({
    flash_sale_id: flashSaleId,
    user_id: userId,
    status: "PURCHASED",
  });

  if (userPurchases >= sale.max_per_user) {
    throw new Error(`Limite de ${sale.max_per_user} par utilisateur atteinte`);
  }

  // 4. Créer commande
  const order = await Order.create({
    user_id: userId,
    items: [
      {
        product_id: sale.product_id,
        quantity: 1,
        unit_price: sale.flash_price,
        is_flash_sale: true,
        flash_sale_id: flashSaleId,
      },
    ],
    subtotal: sale.flash_price,
    total: sale.flash_price,
    priority: priority,
    status: "PENDING_PAYMENT",
  });

  // 5. Marquer réservation comme achetée (si applicable)
  if (reservation) {
    await FlashReservation.update(reservation.id, {
      status: "PURCHASED",
      order_id: order.id,
      purchased_at: new Date(),
    });

    // Libérer reserved_stock
    await FlashSale.update(flashSaleId, {
      reserved_stock: sale.reserved_stock - 1,
      sold_stock: sale.sold_stock + 1,
    });
  } else {
    // Achat direct (pas de réservation)
    await FlashSale.update(flashSaleId, {
      sold_stock: sale.sold_stock + 1,
    });
  }

  // 6. Vérifier stock faible (notification automatique)
  const updatedSale = await FlashSale.findById(flashSaleId);
  const stockPercentage =
    (updatedSale.available_stock / updatedSale.total_stock) * 100;

  if (stockPercentage <= 20 && stockPercentage > 0) {
    await createStockLowNotification(flashSaleId);
  }

  return { order, priority };
}
```

---

## 🚀 CRON JOBS AUTOMATIQUES

```javascript
// 1. Update statut ventes flash (toutes les 5 min)
async function updateFlashSalesStatus() {
  const now = new Date();

  // SCHEDULED → ANNOUNCED (24h avant)
  await FlashSale.updateMany(
    { status: "SCHEDULED", announcement_at: { $lte: now } },
    { status: "ANNOUNCED" }
  );

  // ANNOUNCED → RESERVATION_OPEN (12h avant)
  await FlashSale.updateMany(
    { status: "ANNOUNCED", reservation_opens_at: { $lte: now } },
    { status: "RESERVATION_OPEN" }
  );

  // RESERVATION_OPEN → LIVE (heure de début)
  await FlashSale.updateMany(
    {
      status: { $in: ["ANNOUNCED", "RESERVATION_OPEN"] },
      sale_starts_at: { $lte: now },
    },
    { status: "LIVE" }
  );

  // LIVE → ENDED (heure de fin ou stock épuisé)
  await FlashSale.updateMany(
    {
      status: "LIVE",
      $or: [{ sale_ends_at: { $lte: now } }, { available_stock: { $lte: 0 } }],
    },
    { status: "ENDED" }
  );
}

// 2. Expirer réservations non payées (toutes les 5 min)
async function expireUnpaidReservations() {
  const now = new Date();

  const expiredReservations = await FlashReservation.find({
    status: "RESERVED",
    reservation_expires_at: { $lte: now },
  });

  for (const reservation of expiredReservations) {
    // Marquer comme expiré
    await FlashReservation.update(reservation.id, {
      status: "EXPIRED",
    });

    // Libérer le stock réservé
    await FlashSale.findByIdAndUpdate(reservation.flash_sale_id, {
      $inc: { reserved_stock: -1 },
    });

    // Notification
    await sendNotification(
      reservation.user_id,
      "⏰ Votre réservation a expiré. Le produit est de nouveau disponible."
    );
  }
}

// 3. Envoyer notifications planifiées (toutes les minutes)
async function sendScheduledFlashNotifications() {
  const now = new Date();

  const pendingNotifications = await FlashNotification.find({
    status: "PENDING",
    scheduled_for: { $lte: now },
  });

  for (const notif of pendingNotifications) {
    await sendFlashNotification(notif.id);
  }
}

async function sendFlashNotification(notificationId) {
  const notif = await FlashNotification.findById(notificationId);
  const sale = await FlashSale.findById(notif.flash_sale_id);

  let recipients = [];

  // Déterminer destinataires
  if (notif.target === "VIP_ONLY") {
    // Tous les utilisateurs avec Pass Flash actif
    const activePasses = await FlashPass.find({
      is_active: true,
      valid_until: { $gte: new Date() },
    });
    recipients = activePasses.map((p) => p.owner_id);
  } else if (notif.target === "ALL") {
    // Tous les utilisateurs actifs
    recipients = await User.find({ is_active: true }).select("id");
  }

  // Envoyer notifications
  let deliveredCount = 0;

  for (const userId of recipients) {
    try {
      if (notif.send_email) {
        await sendEmail(userId, getNotificationContent(notif.type, sale));
      }

      if (notif.send_sms) {
        const user = await User.findById(userId);
        const hasActivePass = await FlashPass.exists({
          owner_id: userId,
          is_active: true,
          valid_until: { $gte: new Date() },
        });

        // SMS uniquement si VIP
        if (hasActivePass) {
          await sendSMS(user.phone, getNotificationContent(notif.type, sale));
        }
      }

      if (notif.send_push) {
        await sendPushNotification(
          userId,
          getNotificationContent(notif.type, sale)
        );
      }

      deliveredCount++;
    } catch (error) {
      console.error(`Failed to send notification to ${userId}:`, error);
    }
  }

  // Mettre à jour notification
  await FlashNotification.update(notificationId, {
    status: "SENT",
    sent_at: new Date(),
    recipients_count: recipients.length,
    delivered_count: deliveredCount,
  });
}

// 4. Expirer Pass Flash (quotidien)
async function expireFlashPasses() {
  const now = new Date();

  await FlashPass.updateMany(
    {
      is_active: true,
      valid_until: { $lt: now },
    },
    {
      is_active: false,
    }
  );
}
```

---

## 📊 MODÈLE ÉCONOMIQUE DÉTAILLÉ

### Scénario 1: Lancement (Mois 1-3)

```javascript
const phase1 = {
  ventesFlash: {
    nombreParMois: 8,                    // 2 par semaine
    panierMoyenFlash: 75000,             // 75k FCFA
    stockMoyenParVente: 30,              // 30 unités
    tauxVente: 0.85,                     // 85% vendu

    revenus: {
      venteProduits: 8 × 30 × 0.85 × 75000 = 15300000,  // Commission 10% = 1.53M
      commissionStandard: 1530000
    }
  },

  passFlash: {
    utilisateursActifs: 5000,
    tauxConversion: 0.08,                // 8% achètent un pass
    acheteurs: 400,

    distribution: {
      FLASH_7J: { qty: 200, prix: 3000, total: 600000 },
      FLASH_1M: { qty: 150, prix: 8000, total: 1200000 },
      FLASH_3M: { qty: 50, prix: 20000, total: 1000000 }
    },

    revenusPass: 2800000                 // 2.8M FCFA/mois
  },

  total: {
    revenus: 1530000 + 2800000,
    revenusMensuels: 4330000,            // 4.33M FCFA/mois
    coutMarketing: 500000,
    bénéficeNet: 3830000                 // 3.8M FCFA/mois
  }
}
```

### Scénario 2: Croissance (Mois 6-12)

```javascript
const phase2 = {
  ventesFlash: {
    nombreParMois: 20,                   // Presque quotidien
    stockMoyenParVente: 50,
    tauxVente: 0.90,

    commissionStandard: 6750000          // 6.75M FCFA
  },

  passFlash: {
    utilisateursActifs: 15000,
    tauxConversion: 0.12,                // 12%
    acheteurs: 1800,

    revenusPass: 12000000                // 12M FCFA/mois
  },

  nouveauté: {
    réservationsPremium: {
      produitsPremium: 5,                // 5 ventes ultra-premium/mois
      prixRéservation: 15000,            // 15k par réservation
      réservationsParVente: 20,
      total: 5 × 20 × 15000 = 1500000    // 1.5M FCFA
    }
  },

  total: {
    revenusMensuels: 6750000 + 12000000 + 1500000,
    total: 20250000,                     // 20.25M FCFA/mois
    bénéficeNet: 17000000                // 17M FCFA/mois (after costs)
  }
}
```

### ROI Année 1

```javascript
const annualProjection = {
  mois1_3: 3830000 × 3 = 11490000,
  mois4_6: 10000000 × 3 = 30000000,
  mois7_12: 17000000 × 6 = 102000000,

  totalAnnuel: 143490000,                // 143.5M FCFA/an

  partRevenusMarketplace: '12%'          // Si marketplace totale = 1.2B FCFA/an
}
```

---

## 🎨 INTERFACE UTILISATEUR

### Page Ventes Flash (Public)

```jsx
// FlashSalesPage.jsx
import React, { useState, useEffect } from "react";

export default function FlashSalesPage() {
  const [flashSales, setFlashSales] = useState([]);
  const [userPass, setUserPass] = useState(null);

  useEffect(() => {
    fetchActiveFlashSales();
    checkUserPass();
  }, []);

  return (
    <div className="flash-sales-page">
      {/* Header avec CTA Pass Flash */}
      {!userPass && (
        <div className="flash-pass-promo">
          <h2>🔥 Obtenez un accès VIP aux Ventes Flash</h2>
          <div className="benefits">
            <div>✅ Notifications SMS 24h avant</div>
            <div>✅ Réservation prioritaire</div>
            <div>✅ Stock garanti</div>
          </div>
          <button onClick={() => openPassModal()}>ACHETER UN PASS FLASH</button>
        </div>
      )}

      {/* Ventes live */}
      <section className="live-sales">
        <h2>🔴 EN DIRECT MAINTENANT</h2>
        {flashSales
          .filter((s) => s.status === "LIVE")
          .map((sale) => (
            <FlashSaleCard key={sale.id} sale={sale} hasPass={!!userPass} />
          ))}
      </section>

      {/* Ventes à venir (VIP peut voir 24h avant) */}
      <section className="upcoming-sales">
        <h2>📅 BIENTÔT DISPONIBLE</h2>
        {flashSales
          .filter((s) => s.status === "ANNOUNCED")
          .map((sale) => (
            <UpcomingSaleCard
              key={sale.id}
              sale={sale}
              canReserve={userPass && sale.status === "RESERVATION_OPEN"}
            />
          ))}
      </section>
    </div>
  );
}

function FlashSaleCard({ sale, hasPass }) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [stockPercentage, setStockPercentage] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const end = new Date(sale.sale_ends_at);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft("TERMINÉ");
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${hours}h ${mins}m`);
      }
    }, 1000);

    setStockPercentage((sale.available_stock / sale.total_stock) * 100);

    return () => clearInterval(timer);
  }, [sale]);

  return (
    <div className="flash-card">
      {hasPass && <div className="vip-badge">⭐ VIP</div>}

      <img src={sale.product_image_url} alt={sale.product_name} />

      <div className="info">
        <h3>{sale.product_name}</h3>

        <div className="pricing">
          <span className="original">{sale.original_price} FCFA</span>
          <span className="flash">{sale.flash_price} FCFA</span>
          <span className="discount">-{sale.discount_percentage}%</span>
        </div>

        <div className="urgency">
          <div className="timer">⏰ {timeLeft}</div>
          <div className="stock">
            <div
              className="stock-bar"
              style={{ width: `${stockPercentage}%` }}
            ></div>
            <span>{sale.available_stock} restants</span>
          </div>
        </div>

        {hasPass ? (
          <button className="btn-primary">⚡ ACHETER MAINTENANT (VIP)</button>
        ) : (
          <button className="btn-secondary">ACHETER</button>
        )}
      </div>
    </div>
  );
}
```

### Modal Achat Pass Flash

```jsx
function FlashPassModal({ isOpen, onClose }) {
  const passes = [
    {
      type: "FLASH_7J",
      name: "7 Jours",
      price: 3000,
      features: [
        "Notifications SMS 12h avant",
        "Accès prioritaire",
        "Support VIP",
      ],
    },
    {
      type: "FLASH_1M",
      name: "1 Mois",
      price: 8000,
      popular: true,
      features: [
        "Tout 7 Jours +",
        "SMS 24h avant",
        "Réservation 6h avant",
        "Stock garanti",
      ],
    },
    {
      type: "FLASH_3M",
      name: "3 Mois",
      price: 20000,
      features: [
        "Tout 1 Mois +",
        "-5% supplémentaire",
        "Early bird exclusif",
        "Badge VIP Gold",
      ],
    },
  ];

  const [selectedPass, setSelectedPass] = useState("FLASH_1M");

  async function handlePurchase() {
    try {
      const response = await fetch("/api/flash-passes/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passType: selectedPass }),
      });

      if (response.ok) {
        alert("✅ Pass Flash activé!");
        onClose();
        window.location.reload();
      }
    } catch (error) {
      alert("❌ Erreur: " + error.message);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Choisissez votre Pass Flash VIP</h2>

      <div className="pass-options">
        {passes.map((pass) => (
          <div
            key={pass.type}
            className={`pass-card ${
              selectedPass === pass.type ? "selected" : ""
            }`}
            onClick={() => setSelectedPass(pass.type)}
          >
            {pass.popular && <div className="badge-popular">🔥 POPULAIRE</div>}

            <h3>{pass.name}</h3>
            <div className="price">{pass.price.toLocaleString()} FCFA</div>

            <ul className="features">
              {pass.features.map((f, i) => (
                <li key={i}>✅ {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button className="btn-purchase" onClick={handlePurchase}>
        ACHETER MAINTENANT
      </button>
    </Modal>
  );
}
```

---

## ⚠️ ALIGNEMENT AVEC CORRECTIONS_FINALES_PROD_READY

### ✅ Cohérence Appliquée

| Principe           | Coupons       | Pass Flash       |
| ------------------ | ------------- | ---------------- |
| **Vendus par**     | MayimavaStore | MayimavaStore ✅ |
| **Transférable**   | Non           | Non ✅           |
| **Remboursable**   | Non           | Non ✅           |
| **Trust Score**    | Vérifié       | Vérifié ✅       |
| **Fingerprinting** | Hashé SHA-256 | Hashé SHA-256 ✅ |
| **Revente P2P**    | Interdite     | Interdite ✅     |

### ✅ Protections Anti-Abus

```javascript
// Même niveau de protection que les coupons
async function purchaseFlashPass(userId, passType) {
  // 1. Trust score minimum
  const trustScore = await calculateTrustScore(userId);
  if (trustScore < 40) throw new Error("Trust score too low");

  // 2. Fingerprint vérifié
  const userFingerprint = await getUserFingerprint(userId);
  // (hashé en SHA-256, jamais en clair)

  // 3. Limite duplicatas
  const existingActivePass = await FlashPass.exists({
    owner_id: userId,
    is_active: true,
    valid_until: { $gte: new Date() },
  });
  if (existingActivePass) throw new Error("Already has active pass");

  // 4. NON TRANSFÉRABLE
  // Champ owner_id IMMUTABLE après création

  // 5. NON REMBOURSABLE
  refundable: false; // BDD + CGU
}
```

---

## 📋 CHECKLIST IMPLÉMENTATION

### Phase 1: Backend (Semaine 1-2)

- [ ] Créer tables BDD (flash_sales, flash_passes, flash_reservations, flash_notifications)
- [ ] API achat pass flash (avec protection trust score)
- [ ] API création vente flash (admin)
- [ ] API réservation VIP
- [ ] API achat produit flash
- [ ] Cron jobs (update status, expire reservations, send notifications, expire passes)

### Phase 2: Frontend (Semaine 3)

- [ ] Page ventes flash publique
- [ ] Modal achat pass
- [ ] Cards produits flash (avec timer live)
- [ ] Dashboard utilisateur (mon pass flash)

### Phase 3: Notifications (Semaine 4)

- [ ] Intégration SMS (Twilio pour VIP)
- [ ] Templates email (annonce, réservation, vente live)
- [ ] Push notifications

### Phase 4: Testing (Semaine 5)

- [ ] Test achat pass (trust score edge cases)
- [ ] Test réservation VIP (expiration, stock)
- [ ] Test notifications (timing, ciblage)
- [ ] Load testing (vente flash 1000 users simultanés)

---

## 🎯 RÉSULTATS ATTENDUS

### Année 1

- **Revenus Pass Flash:** 120M FCFA
- **Commissions Ventes Flash:** 24M FCFA
- **Total:** 144M FCFA
- **Part revenus marketplace:** 12-15%

### Synergies avec Coupons

```javascript
// Bundle Premium
const bundlePremiumFlash = {
  nom: "Pack Elite",
  contenu: {
    passFlash1M: 8000,
    couponGOLD: 12000,
    livraison30j: 5000,
  },
  prixNormal: 25000,
  prixBundle: 18000, // -28%
  économie: 7000,
};

// Revenus combinés (Coupons + Pass Flash)
const totalRevenusProduitDigitaux = {
  coupons: 250000000, // 250M FCFA/an
  passFlash: 144000000, // 144M FCFA/an
  bundles: 50000000, // 50M FCFA/an

  total: 444000000, // 444M FCFA/an
  partMarketplace: "30%", // vs 10% commission standard
};
```

---

**Document créé le:** 2025-12-31  
**Version:** 1.0 PROD-READY  
**Statut:** ✅ PRÊT POUR IMPLÉMENTATION
