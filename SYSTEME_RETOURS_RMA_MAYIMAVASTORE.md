# 🔄 SYSTÈME RETOURS (RMA) - MayimavaStore

## 📋 Vue d'Ensemble

Système de gestion des retours sur marchandises (RMA - Return Merchandise Authorization) pour marketplace multi-vendeurs, aligné avec **CORRECTIONS_FINALES_PROD_READY**.

**Contraintes:**

- ✅ Marketplace multi-vendeurs (chaque vendeur gère ses retours)
- ✅ Traçabilité complète (juridique + audit)
- ✅ Protection anti-abus (trust score, délais)
- ✅ Non-remboursable pour coupons utilisés (cohérence avec règles existantes)

---

## 🎯 Règles Métier Fondamentales

### 1. Éligibilité au Retour

```javascript
const returnEligibility = {
  // Conditions générales
  orderStatus: "DELIVERED", // Uniquement commandes livrées
  maxDaysAfterDelivery: 14, // 14 jours standard (configurable par vendeur)

  // Produits exclus (non retournables)
  excludedCategories: [
    "DIGITAL_PRODUCTS", // Téléchargements, licences
    "PERISHABLES", // Denrées périssables
    "INTIMATE_APPAREL", // Sous-vêtements (sauf défaut)
    "CUSTOM_MADE", // Produits personnalisés
  ],

  // Conditions produit
  productCondition: {
    unopened: true, // Emballage d'origine
    tags: true, // Étiquettes présentes
    unused: true, // Non utilisé
    damaged: false, // Non endommagé par client
  },

  // Exceptions (toujours retournables)
  exceptions: [
    "DEFECTIVE", // Produit défectueux
    "WRONG_ITEM", // Erreur d'envoi
    "DAMAGED_ON_ARRIVAL", // Endommagé à la livraison
  ],
};
```

### 2. Motifs de Retour (Obligatoires)

```javascript
const returnReasons = {
  // Responsabilité vendeur (frais retour → vendeur)
  SELLER_FAULT: [
    { code: "DEFECTIVE", label: "Produit défectueux", refundShipping: true },
    {
      code: "WRONG_ITEM",
      label: "Article non conforme à la commande",
      refundShipping: true,
    },
    {
      code: "DAMAGED",
      label: "Endommagé à la réception",
      refundShipping: true,
    },
    { code: "MISSING_PARTS", label: "Pièces manquantes", refundShipping: true },
  ],

  // Responsabilité acheteur (frais retour → acheteur)
  BUYER_FAULT: [
    {
      code: "CHANGED_MIND",
      label: "Je ne veux plus le produit",
      refundShipping: false,
    },
    {
      code: "BETTER_PRICE",
      label: "Trouvé moins cher ailleurs",
      refundShipping: false,
    },
    { code: "NO_LONGER_NEEDED", label: "Plus besoin", refundShipping: false },
  ],

  // Cas spéciaux
  SPECIAL: [
    {
      code: "WRONG_SIZE",
      label: "Taille incorrecte",
      refundShipping: false,
      exchangeOnly: true,
    },
    {
      code: "NOT_AS_DESCRIBED",
      label: "Non conforme à la description",
      refundShipping: true,
    },
  ],
};
```

### 3. Politiques de Remboursement

```javascript
const refundPolicies = {
  // Montant remboursé
  amount: {
    productPrice: true, // ✅ Prix produit toujours remboursé
    shippingFees: "conditional", // ✅ Uniquement si faute vendeur
    couponUsed: false, // ❌ Coupons NON remboursables (règle existante)
    gift: false, // ❌ Carte cadeau NON remboursable
  },

  // Délais de remboursement
  timeline: {
    afterProductReceived: 5, // 5 jours après réception retour
    maxDays: 14, // Maximum légal
  },

  // Méthodes de remboursement
  methods: [
    { type: "WALLET", delay: 0, preferred: true }, // Immédiat sur wallet
    { type: "ORIGINAL_PAYMENT", delay: 5, preferred: false }, // 5-7 jours bancaires
    { type: "STORE_CREDIT", delay: 0, bonus: 5 }, // +5% en crédit boutique
  ],
};
```

---

## 💾 SCHÉMA DE BASE DE DONNÉES

### Table: `returns` (RMA)

```sql
CREATE TABLE returns (
  id UUID PRIMARY KEY,

  -- Références
  order_id UUID NOT NULL,
  order_item_id UUID NOT NULL,             -- Article spécifique retourné
  product_id UUID NOT NULL,
  buyer_id UUID NOT NULL,
  seller_id UUID NOT NULL,

  -- Informations retour
  reason_code VARCHAR(50) NOT NULL,        -- DEFECTIVE, WRONG_ITEM, etc.
  reason_description TEXT,                 -- Description détaillée acheteur
  quantity INT NOT NULL DEFAULT 1,

  -- Preuves
  evidence_urls TEXT[],                    -- URLs images/vidéos
  evidence_uploaded_at TIMESTAMP,

  -- Statut workflow
  status ENUM(
    'PENDING_SELLER_APPROVAL',             -- En attente validation vendeur
    'APPROVED',                            -- Accepté par vendeur
    'REJECTED',                            -- Refusé par vendeur
    'RETURN_SHIPPED',                      -- Produit renvoyé par acheteur
    'RETURN_RECEIVED',                     -- Produit reçu par vendeur
    'INSPECTED',                           -- Vérifié par vendeur
    'REFUNDED',                            -- Remboursé
    'EXCHANGED',                           -- Échangé
    'CANCELLED'                            -- Annulé
  ) DEFAULT 'PENDING_SELLER_APPROVAL',

  -- Décision vendeur
  seller_decision ENUM('REFUND', 'EXCHANGE', 'STORE_CREDIT', 'REJECT') NULL,
  seller_decision_reason TEXT,
  seller_decision_at TIMESTAMP,

  -- Montants
  original_amount DECIMAL(10,2) NOT NULL,
  shipping_fees_original DECIMAL(10,2),
  refund_amount DECIMAL(10,2),             -- Montant final remboursé
  refund_shipping_fees BOOLEAN DEFAULT FALSE,

  -- Coupon utilisé (NON REMBOURSABLE)
  coupon_used_id UUID,
  coupon_discount_amount DECIMAL(10,2) DEFAULT 0,

  -- Adresse retour
  return_address_id UUID,                  -- Adresse vendeur pour retour
  tracking_number VARCHAR(100),
  carrier VARCHAR(50),

  -- Inspection (par vendeur)
  inspection_notes TEXT,
  inspection_passed BOOLEAN,
  inspection_at TIMESTAMP,

  -- Remboursement
  refund_method ENUM('WALLET', 'ORIGINAL_PAYMENT', 'STORE_CREDIT'),
  refund_issued_at TIMESTAMP,
  refund_transaction_id UUID,

  -- Délais
  requested_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  deadline_return_shipping TIMESTAMP,      -- Date limite envoi retour
  received_at TIMESTAMP,
  completed_at TIMESTAMP,

  -- Anti-abus
  trust_score_at_request INT,              -- Trust score au moment de la demande
  is_suspicious BOOLEAN DEFAULT FALSE,
  fraud_flags TEXT[],

  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (order_item_id) REFERENCES order_items(id),
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (coupon_used_id) REFERENCES coupons(id),
  FOREIGN KEY (return_address_id) REFERENCES addresses(id),
  FOREIGN KEY (refund_transaction_id) REFERENCES transactions(id)
);

CREATE INDEX idx_return_order ON returns(order_id);
CREATE INDEX idx_return_buyer ON returns(buyer_id);
CREATE INDEX idx_return_seller ON returns(seller_id);
CREATE INDEX idx_return_status ON returns(status);
CREATE INDEX idx_return_created ON returns(created_at DESC);
```

### Table: `return_messages` (Communication acheteur/vendeur)

```sql
CREATE TABLE return_messages (
  id UUID PRIMARY KEY,

  return_id UUID NOT NULL,

  -- Expéditeur
  sender_id UUID NOT NULL,
  sender_type ENUM('BUYER', 'SELLER', 'ADMIN') NOT NULL,

  -- Message
  message TEXT NOT NULL,
  attachments TEXT[],

  -- Métadonnées
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (return_id) REFERENCES returns(id),
  FOREIGN KEY (sender_id) REFERENCES users(id)
);

CREATE INDEX idx_message_return ON return_messages(return_id);
```

### Table: `seller_return_policies` (Politiques par vendeur)

```sql
CREATE TABLE seller_return_policies (
  id UUID PRIMARY KEY,

  seller_id UUID NOT NULL,

  -- Délais
  return_window_days INT DEFAULT 14,       -- Jours pour demander retour

  -- Catégories exclues (en plus des exclusions globales)
  excluded_category_ids UUID[],

  -- Frais de retour
  restocking_fee_percentage DECIMAL(5,2) DEFAULT 0,  -- Frais de réapprovisionnement

  -- Adresse retour
  return_address_id UUID NOT NULL,

  -- Custom policy text
  policy_text TEXT,

  -- Active
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (return_address_id) REFERENCES addresses(id),

  UNIQUE(seller_id)
);
```

### Table: `return_audit_log` (Traçabilité complète)

```sql
CREATE TABLE return_audit_log (
  id UUID PRIMARY KEY,

  return_id UUID NOT NULL,

  -- Action
  action VARCHAR(100) NOT NULL,            -- 'STATUS_CHANGED', 'DECISION_MADE', etc.
  from_status VARCHAR(50),
  to_status VARCHAR(50),

  -- Acteur
  actor_id UUID NOT NULL,
  actor_type ENUM('BUYER', 'SELLER', 'ADMIN', 'SYSTEM') NOT NULL,

  -- Détails
  details JSONB,

  -- IP & fingerprint (anti-abus)
  ip_address VARCHAR(45),
  user_agent TEXT,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (return_id) REFERENCES returns(id),
  FOREIGN KEY (actor_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_return ON return_audit_log(return_id);
CREATE INDEX idx_audit_created ON return_audit_log(created_at DESC);
```

---

## 🔄 WORKFLOW COMPLET

### 1. Demande de Retour (Acheteur)

```javascript
// API: POST /api/returns/request
async function requestReturn(data) {
  const {
    orderId,
    orderItemId,
    reasonCode,
    reasonDescription,
    evidenceFiles, // Images/vidéos
  } = data;

  // 1. Vérifications éligibilité
  const order = await Order.findById(orderId);
  const orderItem = await OrderItem.findById(orderItemId);

  // Check statut commande
  if (order.status !== "DELIVERED") {
    throw new Error("Seules les commandes livrées peuvent être retournées");
  }

  // Check délai
  const deliveredAt = new Date(order.delivered_at);
  const now = new Date();
  const daysSinceDelivery = (now - deliveredAt) / (1000 * 60 * 60 * 24);

  const sellerPolicy = await SellerReturnPolicy.findOne({
    seller_id: orderItem.seller_id,
  });

  const maxDays = sellerPolicy?.return_window_days || 14;

  if (daysSinceDelivery > maxDays) {
    throw new Error(`Délai de retour dépassé (${maxDays} jours maximum)`);
  }

  // Check catégorie exclue
  const product = await Product.findById(orderItem.product_id);
  const excludedCategories = [
    "DIGITAL_PRODUCTS",
    "PERISHABLES",
    "INTIMATE_APPAREL",
    "CUSTOM_MADE",
  ];

  if (excludedCategories.includes(product.category)) {
    throw new Error("Cette catégorie de produit n'est pas retournable");
  }

  // Check déjà retourné
  const existingReturn = await Return.findOne({
    order_item_id: orderItemId,
    status: { $nin: ["REJECTED", "CANCELLED"] },
  });

  if (existingReturn) {
    throw new Error("Un retour est déjà en cours pour cet article");
  }

  // 2. Anti-abus (trust score)
  const buyer = await User.findById(order.buyer_id);
  const trustScore = await calculateTrustScore(buyer.id);

  let isSuspicious = false;
  const fraudFlags = [];

  if (trustScore < 30) {
    isSuspicious = true;
    fraudFlags.push("LOW_TRUST_SCORE");
  }

  // Check historique retours (abus?)
  const recentReturns = await Return.countDocuments({
    buyer_id: buyer.id,
    created_at: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    status: { $nin: ["REJECTED", "CANCELLED"] },
  });

  if (recentReturns > 5) {
    isSuspicious = true;
    fraudFlags.push("EXCESSIVE_RETURNS");
  }

  // 3. Upload preuves
  const evidenceUrls = [];
  for (const file of evidenceFiles) {
    const url = await uploadToS3(file, "return-evidence");
    evidenceUrls.push(url);
  }

  // 4. Calculer montant remboursable
  const couponUsed = order.coupon_id
    ? await Coupon.findById(order.coupon_id)
    : null;
  const couponDiscount = couponUsed ? order.discount_amount : 0;

  // Montant produit sans coupon
  const productPrice = orderItem.unit_price * orderItem.quantity;

  // Frais de livraison (remboursables si faute vendeur)
  const shippingFees = order.shipping_fees;
  const refundShipping = isSellerFault(reasonCode);

  // 5. Créer demande de retour
  const returnDeadline = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 14 jours pour renvoyer

  const returnRequest = await Return.create({
    order_id: orderId,
    order_item_id: orderItemId,
    product_id: orderItem.product_id,
    buyer_id: order.buyer_id,
    seller_id: orderItem.seller_id,

    reason_code: reasonCode,
    reason_description: reasonDescription,
    quantity: orderItem.quantity,

    evidence_urls: evidenceUrls,
    evidence_uploaded_at: new Date(),

    status: "PENDING_SELLER_APPROVAL",

    original_amount: productPrice,
    shipping_fees_original: shippingFees,
    refund_shipping_fees: refundShipping,

    coupon_used_id: couponUsed?.id || null,
    coupon_discount_amount: couponDiscount,

    return_address_id: sellerPolicy.return_address_id,
    deadline_return_shipping: returnDeadline,

    trust_score_at_request: trustScore,
    is_suspicious: isSuspicious,
    fraud_flags: fraudFlags,

    requested_at: new Date(),
  });

  // 6. Audit log
  await ReturnAuditLog.create({
    return_id: returnRequest.id,
    action: "RETURN_REQUESTED",
    to_status: "PENDING_SELLER_APPROVAL",
    actor_id: buyer.id,
    actor_type: "BUYER",
    details: { reasonCode, evidenceCount: evidenceUrls.length },
  });

  // 7. Notifications
  await sendNotification(
    orderItem.seller_id,
    `📦 Nouvelle demande de retour: ${product.name}`
  );

  await sendEmail(orderItem.seller_id, "NEW_RETURN_REQUEST", {
    returnId: returnRequest.id,
    productName: product.name,
    reason: reasonDescription,
  });

  return returnRequest;
}

function isSellerFault(reasonCode) {
  const sellerFaultCodes = [
    "DEFECTIVE",
    "WRONG_ITEM",
    "DAMAGED",
    "MISSING_PARTS",
    "NOT_AS_DESCRIBED",
  ];
  return sellerFaultCodes.includes(reasonCode);
}
```

### 2. Décision Vendeur (Accepter/Refuser)

```javascript
// API: POST /api/returns/:id/decision
async function sellerDecision(returnId, decision, data) {
  const {
    action, // 'APPROVE', 'REJECT'
    decisionType, // 'REFUND', 'EXCHANGE', 'STORE_CREDIT'
    rejectionReason, // Si rejet
  } = data;

  const returnRequest = await Return.findById(returnId);

  // Vérifier que c'est bien le vendeur
  if (returnRequest.seller_id !== sellerId) {
    throw new Error("Non autorisé");
  }

  // Vérifier statut
  if (returnRequest.status !== "PENDING_SELLER_APPROVAL") {
    throw new Error("Cette demande ne peut plus être modifiée");
  }

  if (action === "REJECT") {
    // ========== REJET ==========

    if (!rejectionReason) {
      throw new Error("Motif de refus obligatoire");
    }

    await Return.update(returnId, {
      status: "REJECTED",
      seller_decision: "REJECT",
      seller_decision_reason: rejectionReason,
      seller_decision_at: new Date(),
    });

    // Audit
    await ReturnAuditLog.create({
      return_id: returnId,
      action: "DECISION_MADE",
      from_status: "PENDING_SELLER_APPROVAL",
      to_status: "REJECTED",
      actor_id: sellerId,
      actor_type: "SELLER",
      details: { decision: "REJECT", reason: rejectionReason },
    });

    // Notification acheteur
    await sendNotification(
      returnRequest.buyer_id,
      `❌ Votre demande de retour a été refusée: ${rejectionReason}`
    );
  } else if (action === "APPROVE") {
    // ========== ACCEPTATION ==========

    await Return.update(returnId, {
      status: "APPROVED",
      seller_decision: decisionType,
      seller_decision_at: new Date(),
      approved_at: new Date(),
    });

    // Audit
    await ReturnAuditLog.create({
      return_id: returnId,
      action: "DECISION_MADE",
      from_status: "PENDING_SELLER_APPROVAL",
      to_status: "APPROVED",
      actor_id: sellerId,
      actor_type: "SELLER",
      details: { decision: decisionType },
    });

    // Notification acheteur avec adresse retour
    const returnAddress = await Address.findById(
      returnRequest.return_address_id
    );

    await sendEmail(returnRequest.buyer_id, "RETURN_APPROVED", {
      returnId,
      decisionType,
      returnAddress: formatAddress(returnAddress),
      deadline: returnRequest.deadline_return_shipping,
    });
  }

  return { success: true };
}
```

### 3. Expédition Retour (Acheteur)

```javascript
// API: POST /api/returns/:id/ship
async function shipReturn(returnId, shippingData) {
  const { carrier, trackingNumber } = shippingData;

  const returnRequest = await Return.findById(returnId);

  // Vérifier statut
  if (returnRequest.status !== "APPROVED") {
    throw new Error("Le retour n'a pas encore été approuvé");
  }

  // Vérifier délai
  if (new Date() > returnRequest.deadline_return_shipping) {
    throw new Error("Délai d'expédition dépassé");
  }

  // Mettre à jour
  await Return.update(returnId, {
    status: "RETURN_SHIPPED",
    carrier,
    tracking_number: trackingNumber,
  });

  // Audit
  await ReturnAuditLog.create({
    return_id: returnId,
    action: "RETURN_SHIPPED",
    from_status: "APPROVED",
    to_status: "RETURN_SHIPPED",
    actor_id: returnRequest.buyer_id,
    actor_type: "BUYER",
    details: { carrier, trackingNumber },
  });

  // Notification vendeur
  await sendNotification(
    returnRequest.seller_id,
    `📫 Produit retourné. Suivi: ${trackingNumber}`
  );

  return { success: true };
}
```

### 4. Réception & Inspection (Vendeur)

```javascript
// API: POST /api/returns/:id/inspect
async function inspectReturn(returnId, inspectionData) {
  const {
    passed, // true/false
    notes,
    photos,
  } = inspectionData;

  const returnRequest = await Return.findById(returnId);

  // Vérifier statut
  if (returnRequest.status !== "RETURN_SHIPPED") {
    throw new Error("Le produit n'a pas encore été expédié");
  }

  // Marquer comme reçu
  await Return.update(returnId, {
    status: "INSPECTED",
    inspection_passed: passed,
    inspection_notes: notes,
    inspection_at: new Date(),
    received_at: new Date(),
  });

  // Audit
  await ReturnAuditLog.create({
    return_id: returnId,
    action: "INSPECTED",
    from_status: "RETURN_SHIPPED",
    to_status: "INSPECTED",
    actor_id: returnRequest.seller_id,
    actor_type: "SELLER",
    details: { passed, notes },
  });

  if (passed) {
    // Inspection OK → Procéder au remboursement/échange
    if (returnRequest.seller_decision === "REFUND") {
      await processRefund(returnId);
    } else if (returnRequest.seller_decision === "EXCHANGE") {
      await processExchange(returnId);
    } else if (returnRequest.seller_decision === "STORE_CREDIT") {
      await processStoreCredit(returnId);
    }
  } else {
    // Inspection échouée
    await sendNotification(
      returnRequest.buyer_id,
      `⚠️ Votre retour a été refusé après inspection: ${notes}`
    );
  }

  return { success: true };
}
```

### 5. Remboursement

```javascript
async function processRefund(returnId) {
  const returnRequest = await Return.findById(returnId);
  const order = await Order.findById(returnRequest.order_id);

  // Calculer montant remboursé
  let refundAmount = returnRequest.original_amount;

  // Ajouter frais livraison si applicable
  if (returnRequest.refund_shipping_fees) {
    refundAmount += returnRequest.shipping_fees_original;
  }

  // ❌ COUPONS NON REMBOURSABLES (règle existante)
  // Le montant remboursé = prix payé (déjà réduit par le coupon)
  // Le coupon reste consommé

  // Déduire frais de réapprovisionnement (si applicable)
  const sellerPolicy = await SellerReturnPolicy.findOne({
    seller_id: returnRequest.seller_id,
  });

  if (sellerPolicy?.restocking_fee_percentage > 0) {
    const restockingFee =
      refundAmount * (sellerPolicy.restocking_fee_percentage / 100);
    refundAmount -= restockingFee;
  }

  // Méthode de remboursement
  let refundMethod = "WALLET"; // Par défaut: wallet (instantané)

  // Créer transaction de remboursement
  const transaction = await Transaction.create({
    type: "REFUND",
    user_id: returnRequest.buyer_id,
    amount: refundAmount,
    status: "COMPLETED",
    reference_type: "RETURN",
    reference_id: returnId,
  });

  // Créditer wallet acheteur
  await UserWallet.increment(returnRequest.buyer_id, refundAmount);

  // Débiter wallet vendeur
  await UserWallet.decrement(returnRequest.seller_id, refundAmount);

  // Mettre à jour retour
  await Return.update(returnId, {
    status: "REFUNDED",
    refund_amount: refundAmount,
    refund_method: refundMethod,
    refund_transaction_id: transaction.id,
    refund_issued_at: new Date(),
    completed_at: new Date(),
  });

  // Audit
  await ReturnAuditLog.create({
    return_id: returnId,
    action: "REFUNDED",
    from_status: "INSPECTED",
    to_status: "REFUNDED",
    actor_id: returnRequest.seller_id,
    actor_type: "SELLER",
    details: { amount: refundAmount, method: refundMethod },
  });

  // Notifications
  await sendNotification(
    returnRequest.buyer_id,
    `✅ Remboursement de ${refundAmount} FCFA crédité sur votre wallet`
  );

  await sendEmail(returnRequest.buyer_id, "REFUND_PROCESSED", {
    returnId,
    amount: refundAmount,
    method: refundMethod,
  });

  return { success: true, refundAmount, transactionId: transaction.id };
}
```

---

## 🚨 PROTECTION ANTI-ABUS

### Détection Abus Retours

```javascript
// Cron job quotidien: Détecter acheteurs abusifs
async function detectReturnAbuse() {
  const suspectBuyers = await Return.aggregate([
    {
      $match: {
        created_at: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        status: { $nin: ["REJECTED", "CANCELLED"] },
      },
    },
    {
      $group: {
        _id: "$buyer_id",
        returnCount: { $sum: 1 },
        refundTotal: { $sum: "$refund_amount" },
      },
    },
    {
      $match: {
        $or: [
          { returnCount: { $gte: 8 } }, // 8+ retours en 90j
          { refundTotal: { $gte: 500000 } }, // 500k FCFA remboursés
        ],
      },
    },
  ]);

  for (const suspect of suspectBuyers) {
    // Flaguer utilisateur
    await User.update(suspect._id, {
      is_return_abuser: true,
    });

    // Réduire trust score
    await adjustTrustScore(suspect._id, -20);

    // Créer alerte admin
    await createAdminAlert({
      type: "RETURN_ABUSE_DETECTED",
      user_id: suspect._id,
      severity: "HIGH",
      data: {
        returnCount: suspect.returnCount,
        refundTotal: suspect.refundTotal,
      },
    });
  }
}

// Limites par trust score
async function canRequestReturn(userId) {
  const trustScore = await calculateTrustScore(userId);
  const user = await User.findById(userId);

  // Bloqué si flagué abusif
  if (user.is_return_abuser) {
    return {
      allowed: false,
      reason:
        "Votre compte a été signalé pour abus de retours. Contactez le support.",
    };
  }

  // Limites selon trust score
  if (trustScore < 30) {
    // Trust très faible: max 1 retour actif
    const activeReturns = await Return.countDocuments({
      buyer_id: userId,
      status: { $nin: ["REFUNDED", "EXCHANGED", "REJECTED", "CANCELLED"] },
    });

    if (activeReturns >= 1) {
      return {
        allowed: false,
        reason:
          "Vous avez déjà un retour en cours. Veuillez le finaliser d'abord.",
      };
    }
  }

  return { allowed: true };
}
```

---

## 📊 DASHBOARD & ANALYTICS

### Métriques Vendeur

```javascript
// GET /api/seller/returns/stats
async function getSellerReturnStats(sellerId, period = "30d") {
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const stats = await Return.aggregate([
    {
      $match: {
        seller_id: sellerId,
        created_at: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        totalAmount: { $sum: "$refund_amount" },
      },
    },
  ]);

  // Taux de retour
  const totalOrders = await Order.countDocuments({
    seller_id: sellerId,
    status: "DELIVERED",
    delivered_at: { $gte: startDate },
  });

  const totalReturns = stats.reduce((sum, s) => sum + s.count, 0);
  const returnRate = totalOrders > 0 ? (totalReturns / totalOrders) * 100 : 0;

  // Motifs principaux
  const topReasons = await Return.aggregate([
    {
      $match: {
        seller_id: sellerId,
        created_at: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: "$reason_code",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ]);

  return {
    period: "30 jours",
    totalReturns,
    returnRate: returnRate.toFixed(2) + "%",
    byStatus: stats,
    topReasons,
    totalRefunded: stats.find((s) => s._id === "REFUNDED")?.totalAmount || 0,
  };
}
```

---

## 🎨 INTERFACE UTILISATEUR

### Page "Mes Retours" (Acheteur)

```jsx
// MyReturnsPage.jsx
import React, { useState, useEffect } from "react";

export default function MyReturnsPage() {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    fetchMyReturns();
  }, []);

  async function fetchMyReturns() {
    const response = await fetch("/api/buyer/returns");
    const data = await response.json();
    setReturns(data);
  }

  return (
    <div className="my-returns-page">
      <h1>Mes Retours</h1>

      {returns.length === 0 ? (
        <div className="empty-state">
          <p>Aucun retour en cours</p>
        </div>
      ) : (
        <div className="returns-list">
          {returns.map((ret) => (
            <ReturnCard key={ret.id} return={ret} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReturnCard({ return: ret }) {
  const statusLabels = {
    PENDING_SELLER_APPROVAL: "⏳ En attente validation vendeur",
    APPROVED: "✅ Approuvé - Renvoyez le produit",
    REJECTED: "❌ Refusé",
    RETURN_SHIPPED: "📫 Produit renvoyé",
    RETURN_RECEIVED: "📦 Reçu par le vendeur",
    INSPECTED: "🔍 Vérifié",
    REFUNDED: "💰 Remboursé",
    EXCHANGED: "🔄 Échangé",
  };

  return (
    <div className="return-card">
      <div className="status-badge">{statusLabels[ret.status]}</div>

      <div className="product-info">
        <img src={ret.product_image} alt={ret.product_name} />
        <div>
          <h3>{ret.product_name}</h3>
          <p>Commande #{ret.order_id.substring(0, 8)}</p>
        </div>
      </div>

      <div className="return-details">
        <div className="detail">
          <span>Motif:</span>
          <strong>{ret.reason_description}</strong>
        </div>

        <div className="detail">
          <span>Demandé le:</span>
          <strong>{new Date(ret.requested_at).toLocaleDateString()}</strong>
        </div>

        {ret.refund_amount && (
          <div className="detail refund">
            <span>Montant remboursé:</span>
            <strong>{ret.refund_amount} FCFA</strong>
          </div>
        )}
      </div>

      {ret.status === "APPROVED" && (
        <button className="btn-ship">Confirmer l'expédition</button>
      )}

      {ret.status === "PENDING_SELLER_APPROVAL" && (
        <button className="btn-cancel">Annuler la demande</button>
      )}
    </div>
  );
}
```

### Bouton "Demander un Retour" (Page Commande)

```jsx
// OrderDetailsPage.jsx
function OrderDetailsPage({ orderId }) {
  const [order, setOrder] = useState(null);

  async function canReturn(item) {
    // Vérifier éligibilité
    if (order.status !== "DELIVERED") return false;

    const daysSinceDelivery =
      (Date.now() - new Date(order.delivered_at)) / (1000 * 60 * 60 * 24);
    if (daysSinceDelivery > 14) return false;

    // Vérifier si déjà retourné
    const hasReturn = await checkExistingReturn(item.id);
    if (hasReturn) return false;

    return true;
  }

  return (
    <div className="order-details">
      <h1>Commande #{orderId}</h1>

      <div className="items-list">
        {order.items.map((item) => (
          <div key={item.id} className="order-item">
            <img src={item.image} alt={item.name} />
            <div className="item-info">
              <h3>{item.name}</h3>
              <p>{item.price} FCFA</p>
            </div>

            {canReturn(item) && (
              <button
                className="btn-return"
                onClick={() => openReturnModal(item)}
              >
                🔄 Demander un retour
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 📋 CHECKLIST IMPLÉMENTATION

### Phase 1: Backend (2 semaines)

- [ ] Créer tables BDD (returns, return_messages, seller_return_policies, return_audit_log)
- [ ] API demande retour (avec anti-abus)
- [ ] API décision vendeur
- [ ] API expédition retour
- [ ] API inspection
- [ ] Logique remboursement (wallet)
- [ ] Cron job détection abus

### Phase 2: Frontend (1.5 semaines)

- [ ] Page "Mes Retours" (acheteur)
- [ ] Modal demande retour (upload preuves)
- [ ] Dashboard retours vendeur
- [ ] Interface inspection
- [ ] Chat acheteur/vendeur

### Phase 3: Admin (1 semaine)

- [ ] Dashboard supervision
- [ ] Gestion litiges
- [ ] Analytics retours
- [ ] Export rapports

### Phase 4: Testing (1 semaine)

- [ ] Tests workflow complet
- [ ] Tests anti-abus
- [ ] Tests remboursement
- [ ] Tests notifications

---

## 🎯 RÉSULTATS ATTENDUS

### Réduction Litiges

- **-60%** litiges remboursement (process clair)
- **-40%** temps résolution (automatisé)

### Protection Vendeurs

- Inspection obligatoire avant remboursement
- Frais retour à la charge acheteur (si non faute vendeur)
- Politique personnalisable

### Satisfaction Acheteurs

- Process transparent
- Délais clairs
- Remboursement rapide (wallet instantané)

---

**Document créé le:** 2025-12-31  
**Version:** 1.0 PROD-READY  
**Statut:** ✅ PRÊT POUR IMPLÉMENTATION
