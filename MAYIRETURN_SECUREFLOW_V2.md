# 🔄 MayiReturn SecureFlow - Système Retours V2

## 📋 Vue d'Ensemble

**Nom du système:** MayiReturn SecureFlow  
Système de gestion des retours sécurisé pour MayimavaStore avec **escrow payment**, **arbitrage dédié** et **notation post-retour**.

**Version:** 2.0 (Intégration réflexions équipe dev)  
**Alignement:** CORRECTIONS_FINALES_PROD_READY

---

## 🎯 Politique Officielle de Retour MayimavaStore

### Satisfaction Client Garantie

Chez MayimavaStore, la satisfaction de nos clients est une priorité. Nous avons mis en place un système de retour **fiable, sécurisé et équitable** pour protéger à la fois les acheteurs et les vendeurs.

---

## 📅 1. Délai de Retour

Les retours sont acceptés dans un délai de **7 à 15 jours** suivant la date de réception du produit.

```javascript
const returnWindow = {
  minimum: 7, // 7 jours (vendeurs premium)
  standard: 14, // 14 jours (par défaut)
  extended: 15, // 15 jours (vendeurs avec garantie étendue)

  // Configurable par vendeur (dans limites)
  sellerCanSet: true,
  minAllowed: 7,
  maxAllowed: 15,
};
```

---

## 🛍 2. Produits Éligibles au Retour

### ✅ Éligibles

- Produits non conformes à la description
- Produits endommagés à la réception
- Mauvais article reçu (erreur d'envoi)
- Produit défectueux

### ❌ Non Éligibles

- Produits **utilisés** ou endommagés par l'acheteur
- Articles d'**hygiène** (sous-vêtements, cosmétiques ouverts)
- Denrées **périssables** (alimentaire, fleurs)
- Produits **personnalisés** ou sur mesure
- Produits **digitaux** (téléchargements, licences)

---

## 📝 3. Procédure de Demande de Retour

### Étape 1: Initiation (Acheteur)

L'acheteur clique sur **"Demander un retour"** depuis son espace commande et fournit:

```javascript
const returnRequest = {
  // Obligatoire
  motif:
    "DEFECTIVE" |
    "WRONG_ITEM" |
    "DAMAGED" |
    "NOT_AS_DESCRIBED" |
    "CHANGED_MIND",
  description: "Texte libre (min 20 caractères)",

  // Preuves (OBLIGATOIRES)
  photos: [
    "photo_emballage.jpg",
    "photo_produit_defaut.jpg",
    "photo_etiquette.jpg", // Si applicable
  ],
  videos: ["video_demonstration_defaut.mp4"], // Optionnel mais recommandé

  // Automatique
  deliveryProof: "preuve_reception.pdf",
  originalPackaging: true, // Checkbox obligatoire
};
```

### Étape 2: Gel du Paiement ⚠️ NOUVEAU

**Dès la demande de retour validée:**

```javascript
async function freezeSellerPayment(returnId) {
  const ret = await Return.findById(returnId);
  const order = await Order.findById(ret.order_id);

  // Vérifier si paiement vendeur déjà effectué
  const sellerPayout = await Payout.findOne({
    order_id: order.id,
    seller_id: ret.seller_id,
    status: "COMPLETED",
  });

  if (sellerPayout) {
    // ❌ Paiement déjà effectué → Prélever du wallet vendeur
    await UserWallet.decrement(ret.seller_id, order.seller_amount);

    // Mettre en escrow
    await Escrow.create({
      return_id: returnId,
      amount: order.seller_amount,
      status: "FROZEN",
      reason: "RETURN_REQUESTED",
    });
  } else {
    // ✅ Paiement pas encore effectué → Bloquer le virement
    await Payout.update(sellerPayout.id, {
      status: "ON_HOLD",
      hold_reason: `Retour demandé: ${returnId}`,
    });
  }

  // Notification vendeur
  await sendNotification(
    ret.seller_id,
    `⚠️ Demande de retour reçue. Paiement gelé temporairement. Répondez sous 72h.`
  );
}
```

---

## 🔔 4. Traitement par le Vendeur (72h MAX)

Le vendeur est **notifié automatiquement** et dispose de **72 heures** pour:

### Option A: Accepter le Retour

```javascript
async function acceptReturn(returnId, sellerId) {
  await Return.update(returnId, {
    status: "APPROVED",
    seller_decision: "REFUND",
    seller_responded: true,
    seller_response_at: new Date(),
    approved_at: new Date(),
  });

  // Générer étiquette de retour automatique
  await generateReturnLabel(returnId);

  // Notification acheteur
  await sendNotification(
    ret.buyer_id,
    "✅ Votre retour a été accepté! Consultez votre email pour l'étiquette de retour."
  );
}
```

### Option B: Contester avec Preuves

```javascript
async function disputeReturn(returnId, disputeData) {
  const { reason, evidence } = disputeData;

  await Return.update(returnId, {
    status: "DISPUTED",
    seller_decision: "CONTEST",
    seller_responded: true,
    seller_dispute_reason: reason,
    seller_dispute_evidence: evidence, // Photos/vidéos
    disputed_at: new Date(),
  });

  // Créer cas d'arbitrage
  await createArbitrationCase(returnId);

  // Notification acheteur
  await sendNotification(
    ret.buyer_id,
    "⚖️ Le vendeur a contesté votre retour. Notre équipe d'arbitrage examinera le dossier sous 5 jours ouvrés."
  );
}
```

### Option C: Pas de Réponse → Auto-Approbation

```javascript
// Cron job: Toutes les heures
async function autoApproveExpiredReturns() {
  const now = new Date();
  const deadline = new Date(now - 72 * 60 * 60 * 1000); // 72h ago

  const expiredReturns = await Return.find({
    status: "PENDING_SELLER_APPROVAL",
    requested_at: { $lte: deadline },
    seller_responded: false,
  });

  for (const ret of expiredReturns) {
    await Return.update(ret.id, {
      status: "APPROVED",
      seller_decision: "REFUND",
      seller_decision_reason: "Pas de réponse dans les 72h (auto-approuvé)",
      auto_approved: true,
      approved_at: now,
    });

    // Générer étiquette automatiquement
    await generateReturnLabel(ret.id);

    // Pénalité vendeur (trust score)
    await adjustTrustScore(ret.seller_id, -10);

    // Notifications
    await sendNotification(
      ret.buyer_id,
      "✅ Votre retour a été approuvé automatiquement (vendeur n'a pas répondu). Étiquette de retour envoyée par email."
    );

    await sendNotification(
      ret.seller_id,
      "⚠️ Votre retour a été auto-approuvé car vous n'avez pas répondu dans les 72h."
    );
  }
}
```

---

## 🚚 5. Retour Logistique

### A. Génération Étiquette de Retour ⭐ NOUVEAU

```javascript
async function generateReturnLabel(returnId) {
  const ret = await Return.findById(returnId)
    .populate("buyer_id")
    .populate("seller_id")
    .populate("product_id");

  const seller = ret.seller_id;
  const buyer = ret.buyer_id;

  // Déterminer qui paye les frais de retour
  const shippingPaidBy = isSellerFault(ret.reason_code) ? "SELLER" : "BUYER";

  // Adresse de retour vendeur
  const returnAddress = await Address.findById(seller.return_address_id);

  // API Transporteur (exemple: Chronopost/DHL API)
  const courierResponse = await courierAPI.createReturnShipment({
    // Expéditeur (acheteur)
    from: {
      name: buyer.full_name,
      address: buyer.shipping_address.street,
      city: buyer.shipping_address.city,
      postalCode: buyer.shipping_address.postal_code,
      country: buyer.shipping_address.country,
      phone: buyer.phone,
    },

    // Destinataire (vendeur)
    to: {
      name: seller.shop_name,
      address: returnAddress.street,
      city: returnAddress.city,
      postalCode: returnAddress.postal_code,
      country: returnAddress.country,
      phone: seller.phone,
    },

    // Colis
    parcel: {
      weight: ret.product_id.weight || 1, // kg
      length: ret.product_id.length || 30, // cm
      width: ret.product_id.width || 20,
      height: ret.product_id.height || 10,
      value: ret.original_amount,
      reference: ret.id,
    },

    // Paiement
    paidBy: shippingPaidBy,
    paymentMethod:
      shippingPaidBy === "SELLER"
        ? "ACCOUNT" // Compte vendeur
        : "PREPAID", // Acheteur paye

    // Options
    service: "RETURN",
    withTracking: true,
    signature: true,
    insurance: ret.original_amount > 50000, // Si > 50k FCFA
  });

  // Mettre à jour retour
  await Return.update(returnId, {
    return_label_url: courierResponse.labelPdfUrl,
    tracking_number: courierResponse.trackingNumber,
    carrier: courierResponse.carrier,
    shipping_cost: courierResponse.cost,
    shipping_paid_by: shippingPaidBy,
    label_generated_at: new Date(),
  });

  // Envoyer par email
  await sendEmail(buyer.email, "RETURN_LABEL_READY", {
    returnId: ret.id,
    productName: ret.product_id.name,
    labelUrl: courierResponse.labelPdfUrl,
    trackingNumber: courierResponse.trackingNumber,
    carrier: courierResponse.carrier,
    instructions: `
      1. Imprimez l'étiquette de retour ci-jointe
      2. Emballez soigneusement le produit dans son emballage d'origine
      3. Collez l'étiquette sur le colis
      4. Déposez le colis au point relais ${courierResponse.carrier}
      5. Conservez votre preuve de dépôt
      
      Suivi: ${courierResponse.trackingUrl}
    `,
  });

  return courierResponse;
}
```

### B. Suivi du Retour

```javascript
// Webhook du transporteur (mise à jour automatique)
app.post("/webhooks/courier/tracking", async (req, res) => {
  const { trackingNumber, status, timestamp } = req.body;

  const ret = await Return.findOne({ tracking_number: trackingNumber });

  if (!ret) return res.status(404).send("Return not found");

  // Mettre à jour statut
  if (status === "IN_TRANSIT") {
    await Return.update(ret.id, { status: "RETURN_SHIPPED" });
  } else if (status === "DELIVERED") {
    await Return.update(ret.id, {
      status: "RETURN_RECEIVED",
      received_at: timestamp,
    });

    // Notification vendeur: inspecter sous 48h
    await sendNotification(
      ret.seller_id,
      "📦 Retour reçu. Inspectez le produit et validez sous 48h."
    );
  }

  res.status(200).send("OK");
});
```

---

## ⚖️ 6. Arbitrage MayimavaStore ⭐ NOUVEAU

### Structure Équipe Arbitrage

```javascript
const arbitrationTeam = {
  role: "ARBITRATOR",
  membres: [
    { id: "arb_001", name: "Marie K.", specialité: "Électronique" },
    { id: "arb_002", name: "Jean D.", specialité: "Mode" },
    { id: "arb_003", name: "Fatou S.", specialité: "Généraliste" },
  ],

  sla: {
    délaiMax: "5 jours ouvrés",
    priorités: {
      HIGH: "24h", // Montant > 200k FCFA
      MEDIUM: "72h", // Montant 50-200k
      LOW: "5 jours", // Montant < 50k
    },
  },
};
```

### Création Cas d'Arbitrage

```javascript
async function createArbitrationCase(returnId) {
  const ret = await Return.findById(returnId);

  // Calculer priorité
  const priority =
    ret.original_amount > 200000
      ? "HIGH"
      : ret.original_amount > 50000
      ? "MEDIUM"
      : "LOW";

  // Trouver arbitre disponible
  const availableArbitrator = await findAvailableArbitrator(
    ret.product_id.category
  );

  const arbCase = await ArbitrationCase.create({
    return_id: returnId,
    status: "PENDING_REVIEW",
    priority: priority,
    assigned_to: availableArbitrator?.id || null,

    // Deadline selon priorité
    deadline: calculateDeadline(priority),

    // Éléments du dossier
    evidence: {
      buyer: {
        photos: ret.evidence_urls,
        description: ret.reason_description,
        deliveryProof: ret.delivery_proof_url,
      },
      seller: {
        photos: ret.seller_dispute_evidence,
        reason: ret.seller_dispute_reason,
        productDescription: ret.product_id.description,
      },
    },

    created_at: new Date(),
  });

  // Notification arbitre
  if (availableArbitrator) {
    await sendNotification(
      availableArbitrator.id,
      `⚖️ Nouveau cas d'arbitrage assigné (Priorité: ${priority}). Deadline: ${arbCase.deadline.toLocaleDateString()}`
    );
  }

  return arbCase;
}

function calculateDeadline(priority) {
  const hours = {
    HIGH: 24,
    MEDIUM: 72,
    LOW: 120, // 5 jours
  };

  return new Date(Date.now() + hours[priority] * 60 * 60 * 1000);
}
```

### Processus de Décision

```javascript
// Interface Arbitre
async function makeArbitrationDecision(caseId, decision) {
  const arbCase = await ArbitrationCase.findById(caseId);
  const ret = await Return.findById(arbCase.return_id);

  const {
    ruling, // 'BUYER_WIN' | 'SELLER_WIN' | 'PARTIAL'
    explanation,
    refundPercentage, // Si PARTIAL: 0-100
  } = decision;

  // Enregistrer décision
  await ArbitrationCase.update(caseId, {
    status: "RESOLVED",
    ruling: ruling,
    explanation: explanation,
    decided_by: arbCase.assigned_to,
    decided_at: new Date(),
  });

  if (ruling === "BUYER_WIN") {
    // Acheteur gagne: retour complet accepté
    await Return.update(ret.id, {
      status: "APPROVED",
      arbitration_decision: "BUYER_WIN",
      arbitration_explanation: explanation,
      arbitration_decided_at: new Date(),
    });

    // Générer étiquette retour
    await generateReturnLabel(ret.id);

    // Notifications
    await sendNotification(
      ret.buyer_id,
      `✅ L'arbitrage est en votre faveur. Retour accepté. Consultez l'étiquette de retour.`
    );

    await sendNotification(
      ret.seller_id,
      `⚖️ Décision arbitrage: Retour accepté. Raison: ${explanation}`
    );
  } else if (ruling === "SELLER_WIN") {
    // Vendeur gagne: retour refusé
    await Return.update(ret.id, {
      status: "REJECTED",
      arbitration_decision: "SELLER_WIN",
      arbitration_explanation: explanation,
      arbitration_decided_at: new Date(),
    });

    // Libérer escrow au vendeur
    await releaseEscrowToSeller(ret.order_id);

    // Notifications
    await sendNotification(
      ret.buyer_id,
      `❌ L'arbitrage est en faveur du vendeur. Retour refusé. Raison: ${explanation}`
    );

    await sendNotification(
      ret.seller_id,
      `✅ Décision arbitrage: Retour refusé. Paiement libéré.`
    );
  } else if (ruling === "PARTIAL") {
    // Remboursement partiel
    const partialRefund = ret.original_amount * (refundPercentage / 100);

    await Return.update(ret.id, {
      status: "REFUNDED",
      refund_amount: partialRefund,
      refund_percentage: refundPercentage,
      arbitration_decision: "PARTIAL",
      arbitration_explanation: explanation,
      refund_issued_at: new Date(),
    });

    // Rembourser acheteur partiellement
    await UserWallet.increment(ret.buyer_id, partialRefund);

    // Payer vendeur le reste
    const sellerAmount = ret.original_amount - partialRefund;
    await UserWallet.increment(ret.seller_id, sellerAmount);

    // Libérer escrow
    await Escrow.update(
      { return_id: ret.id },
      {
        status: "RELEASED_PARTIAL",
        buyer_amount: partialRefund,
        seller_amount: sellerAmount,
      }
    );

    // Notifications
    await sendNotification(
      ret.buyer_id,
      `⚖️ Remboursement partiel: ${refundPercentage}% (${partialRefund} FCFA). Raison: ${explanation}`
    );

    await sendNotification(
      ret.seller_id,
      `⚖️ Remboursement partiel accordé: ${refundPercentage}% à l'acheteur. Vous recevez ${sellerAmount} FCFA.`
    );
  }

  return { success: true, ruling };
}
```

---

## 💳 7. Remboursement

### A. Remboursement Complet

```javascript
async function processFullRefund(returnId) {
  const ret = await Return.findById(returnId);
  const order = await Order.findById(ret.order_id);

  // Montant remboursable
  let refundAmount = ret.original_amount;

  // Ajouter frais livraison si faute vendeur
  if (ret.refund_shipping_fees && isSellerFault(ret.reason_code)) {
    refundAmount += ret.shipping_fees_original;
  }

  // ❌ COUPONS NON REMBOURSABLES (règle existante)
  // Le montant = prix déjà réduit par coupon

  // Méthode de remboursement
  const refundMethod = order.payment_method;

  if (refundMethod === "WALLET" || refundMethod === "PI") {
    // Remboursement instantané sur wallet
    await UserWallet.increment(ret.buyer_id, refundAmount);

    await Transaction.create({
      type: "REFUND",
      user_id: ret.buyer_id,
      amount: refundAmount,
      status: "COMPLETED",
      reference_type: "RETURN",
      reference_id: returnId,
      method: refundMethod,
    });
  } else if (refundMethod === "FLOOZ" || refundMethod === "TMONEY") {
    // API Mobile Money
    await mobileMoneyAPI.refund({
      phoneNumber: order.payment_phone,
      amount: refundAmount,
      reference: returnId,
      operator: refundMethod,
    });
  } else {
    // Carte bancaire: remboursement via Stripe/PayPal
    await paymentGateway.refund({
      chargeId: order.payment_charge_id,
      amount: refundAmount,
      reason: "RETURN_APPROVED",
    });
  }

  // Mettre à jour retour
  await Return.update(returnId, {
    status: "REFUNDED",
    refund_amount: refundAmount,
    refund_method: refundMethod,
    refund_issued_at: new Date(),
    completed_at: new Date(),
  });

  // Libérer escrow
  await Escrow.update(
    { return_id: returnId },
    {
      status: "RELEASED_TO_BUYER",
      released_at: new Date(),
    }
  );

  // Notification
  await sendNotification(
    ret.buyer_id,
    `✅ Remboursement de ${refundAmount} FCFA effectué sur ${refundMethod}`
  );

  // Demander notation post-retour
  await requestReturnRating(returnId);

  return { success: true, refundAmount, method: refundMethod };
}
```

---

## ⭐ 8. Système de Notation Post-Retour ⭐ NOUVEAU

### Schema BDD

```sql
CREATE TABLE return_ratings (
  id UUID PRIMARY KEY,

  return_id UUID NOT NULL UNIQUE,

  -- Notation acheteur → vendeur
  buyer_to_seller_rating INT CHECK (buyer_to_seller_rating BETWEEN 1 AND 5),
  buyer_to_seller_comment TEXT,
  buyer_to_seller_aspects JSONB,  -- { responsiveness: 5, fairness: 4, communication: 5 }
  buyer_rated_at TIMESTAMP,

  -- Notation vendeur → acheteur
  seller_to_buyer_rating INT CHECK (seller_to_buyer_rating BETWEEN 1 AND 5),
  seller_to_buyer_comment TEXT,
  seller_to_buyer_aspects JSONB,  -- { honesty: 4, packaging: 5, cooperation: 4 }
  seller_rated_at TIMESTAMP,

  -- Visible publiquement?
  is_public BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (return_id) REFERENCES returns(id)
);

CREATE INDEX idx_rating_return ON return_ratings(return_id);
```

### Demande de Notation

```javascript
async function requestReturnRating(returnId) {
  const ret = await Return.findById(returnId);

  // Créer rating vide
  await ReturnRating.create({ return_id: returnId });

  // Notification acheteur
  await sendNotification(ret.buyer_id, {
    title: "⭐ Notez votre expérience de retour",
    body: `Comment s'est passé le retour avec ${ret.seller_id.shop_name}?`,
    action: "RATE_RETURN",
    data: { returnId },
  });

  // Notification vendeur
  await sendNotification(ret.seller_id, {
    title: "⭐ Notez le comportement de l'acheteur",
    body: "Comment s'est passé le retour?",
    action: "RATE_BUYER",
    data: { returnId },
  });
}
```

### Soumettre Notation

```javascript
// API: POST /api/returns/:id/rate
async function submitReturnRating(returnId, ratingData, raterType) {
  const { rating, comment, aspects } = ratingData;

  const rating = await ReturnRating.findOne({ return_id: returnId });

  if (raterType === "BUYER") {
    await ReturnRating.update(rating.id, {
      buyer_to_seller_rating: rating,
      buyer_to_seller_comment: comment,
      buyer_to_seller_aspects: aspects,
      buyer_rated_at: new Date(),
    });

    // Impact trust score vendeur
    await updateTrustScoreFromReturnRating(ret.seller_id, rating);
  } else {
    await ReturnRating.update(rating.id, {
      seller_to_buyer_rating: rating,
      seller_to_buyer_comment: comment,
      seller_to_buyer_aspects: aspects,
      seller_rated_at: new Date(),
    });

    // Impact trust score acheteur
    await updateTrustScoreFromReturnRating(ret.buyer_id, rating);
  }

  return { success: true };
}

async function updateTrustScoreFromReturnRating(userId, rating) {
  if (rating <= 2) {
    await adjustTrustScore(userId, -5); // Mauvaise note
  } else if (rating === 3) {
    await adjustTrustScore(userId, 0); // Neutre
  } else if (rating >= 4) {
    await adjustTrustScore(userId, +3); // Bonne note
  }
}
```

### Affichage Public

```javascript
// Profil vendeur: afficher stats retours
const sellerReturnStats = {
  totalReturns: 45,
  acceptanceRate: 0.82, // 82% acceptés
  averageRating: 4.3, // Note moyenne retours
  responseTime: "18h", // Temps moyen réponse

  ratingDistribution: {
    5: 25,
    4: 12,
    3: 5,
    2: 2,
    1: 1,
  },
};

// Badge si excellent
if (averageRating >= 4.5 && acceptanceRate >= 0.9) {
  badge = "🏆 Excellent Service Retours";
}
```

---

## 🛡️ 9. Mesures de Sécurité & Anti-Abus

### A. Détection Abus Acheteurs

```javascript
// Cron job quotidien
async function detectBuyerReturnAbuse() {
  const suspectBuyers = await Return.aggregate([
    {
      $match: {
        created_at: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: "$buyer_id",
        returnCount: { $sum: 1 },
        refundedCount: {
          $sum: { $cond: [{ $eq: ["$status", "REFUNDED"] }, 1, 0] },
        },
        totalRefunded: {
          $sum: {
            $cond: [{ $eq: ["$status", "REFUNDED"] }, "$refund_amount", 0],
          },
        },
      },
    },
    {
      $match: {
        $or: [
          { returnCount: { $gte: 8 } }, // 8+ retours en 90j
          { refundedCount: { $gte: 6 } }, // 6+ remboursés
          { totalRefunded: { $gte: 300000 } }, // 300k FCFA remboursés
        ],
      },
    },
  ]);

  for (const suspect of suspectBuyers) {
    // Flaguer
    await User.update(suspect._id, {
      is_return_abuser: true,
      return_abuse_detected_at: new Date(),
    });

    // Réduire trust score
    await adjustTrustScore(suspect._id, -25);

    // Alerte admin
    await createAdminAlert({
      type: "BUYER_RETURN_ABUSE",
      user_id: suspect._id,
      severity: "HIGH",
      data: {
        returnCount: suspect.returnCount,
        refundedCount: suspect.refundedCount,
        totalRefunded: suspect.totalRefunded,
      },
      action: "REVIEW_ACCOUNT",
    });

    // Limiter retours futurs
    await User.update(suspect._id, {
      max_concurrent_returns: 1, // Max 1 retour à la fois
      return_approval_required: true, // Approbation admin requise
    });
  }
}
```

### B. Détection Abus Vendeurs

```javascript
// Vendeurs refusant systématiquement les retours
async function detectSellerReturnAbuse() {
  const suspectSellers = await Return.aggregate([
    {
      $match: {
        created_at: { $gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
    },
    {
      $group: {
        _id: "$seller_id",
        totalReturns: { $sum: 1 },
        rejectedCount: {
          $sum: { $cond: [{ $eq: ["$status", "REJECTED"] }, 1, 0] },
        },
        autoApprovedCount: {
          $sum: { $cond: ["$auto_approved", 1, 0] },
        },
      },
    },
    {
      $match: {
        totalReturns: { $gte: 10 },
        $or: [
          { rejectedCount: { $gte: 7 } }, // 70%+ rejetés
          { autoApprovedCount: { $gte: 5 } }, // 5+ auto-approuvés (pas de réponse)
        ],
      },
    },
  ]);

  for (const suspect of suspectSellers) {
    const rejectionRate = suspect.rejectedCount / suspect.totalReturns;

    if (rejectionRate > 0.7) {
      // Taux rejet trop élevé
      await adjustTrustScore(suspect._id, -20);

      await createAdminAlert({
        type: "SELLER_EXCESSIVE_REJECTIONS",
        user_id: suspect._id,
        severity: "MEDIUM",
        data: {
          totalReturns: suspect.totalReturns,
          rejectionRate: (rejectionRate * 100).toFixed(1) + "%",
        },
      });
    }

    if (suspect.autoApprovedCount >= 5) {
      // Ne répond pas aux retours
      await adjustTrustScore(suspect._id, -15);

      await sendNotification(
        suspect._id,
        `⚠️ Vous avez ${suspect.autoApprovedCount} retours auto-approuvés pour non-réponse. Veuillez répondre dans les 72h.`
      );
    }
  }
}
```

### C. Historique Visible (Transparence)

```javascript
// Profil public acheteur (pour vendeurs)
const buyerPublicProfile = {
  accountAge: "2 ans",
  ordersCompleted: 145,

  returnHistory: {
    total: 12,
    last90Days: 2,
    acceptanceRate: 0.75, // 75% des retours acceptés
    averageRating: 4.2, // Note moyenne par vendeurs

    // Drapeaux visibles
    flags: [
      returnHistory.total > 15 ? "⚠️ Retours fréquents" : null,
      returnHistory.acceptanceRate < 0.5 ? "🚩 Beaucoup de rejets" : null,
    ].filter(Boolean),
  },
};

// Profil public vendeur (pour acheteurs)
const sellerPublicProfile = {
  shopName: "TechPro",

  returnPolicy: {
    windowDays: 14,
    acceptanceRate: 0.88,
    averageResponseTime: "12h",
    averageRating: 4.5,

    badges: [
      acceptanceRate >= 0.85 ? "✅ Retours acceptés facilement" : null,
      averageResponseTime < "24h" ? "⚡ Réponse rapide" : null,
      averageRating >= 4.5 ? "⭐ Excellent service retours" : null,
    ].filter(Boolean),
  },
};
```

---

## 📊 MÉTRIQUES & DASHBOARD

### Dashboard Administrateur

```javascript
const adminDashboard = {
  // Vue d'ensemble
  overview: {
    activeReturns: 127,
    pendingArbitration: 8,
    avgResolutionTime: "4.2 jours",
    returnRate: "3.8%", // % commandes totales
  },

  // Par statut
  byStatus: {
    PENDING_SELLER_APPROVAL: 45,
    APPROVED: 32,
    DISPUTED: 8,
    IN_ARBITRATION: 8,
    RETURN_SHIPPED: 18,
    REFUNDED: 16,
  },

  // Alertes
  alerts: [
    {
      type: "BUYER_ABUSE",
      count: 3,
      severity: "HIGH",
    },
    {
      type: "AUTO_APPROVED_SPIKE",
      count: 12,
      message:
        "12 retours auto-approuvés aujourd'hui (vendeurs ne répondent pas)",
    },
  ],

  // Top motifs retours
  topReasons: [
    { reason: "DEFECTIVE", count: 45, percentage: 35.4 },
    { reason: "NOT_AS_DESCRIBED", count: 32, percentage: 25.2 },
    { reason: "DAMAGED", count: 28, percentage: 22.0 },
  ],
};
```

---

## 🎨 INTERFACE UTILISATEUR

### Bouton "Demander un Retour"

```jsx
// OrderDetailsPage.jsx
function ReturnRequestButton({ order, item }) {
  const [canReturn, setCanReturn] = useState(false);
  const [returnWindow, setReturnWindow] = useState(null);

  useEffect(() => {
    checkReturnEligibility();
  }, []);

  async function checkReturnEligibility() {
    const response = await fetch(
      `/api/orders/${order.id}/items/${item.id}/can-return`
    );
    const data = await response.json();

    setCanReturn(data.eligible);
    setReturnWindow(data.daysRemaining);
  }

  if (!canReturn) {
    return (
      <div className="return-not-eligible">
        <span>Retour non disponible</span>
        {returnWindow !== null && returnWindow <= 0 && (
          <small>Délai de retour dépassé</small>
        )}
      </div>
    );
  }

  return (
    <div className="return-action">
      <button className="btn-return" onClick={() => openReturnModal(item)}>
        🔄 Demander un retour
      </button>
      {returnWindow && (
        <small className="return-deadline">
          ⏰ Encore {returnWindow} jours
        </small>
      )}
    </div>
  );
}
```

### Modal Demande Retour

```jsx
function ReturnRequestModal({ item, onClose }) {
  const [formData, setFormData] = useState({
    reason: "",
    description: "",
    photos: [],
    videos: [],
    originalPackaging: false,
  });

  async function submitReturn() {
    // Upload preuves
    const photoUrls = await uploadFiles(formData.photos, "return-evidence");
    const videoUrls = await uploadFiles(formData.videos, "return-evidence");

    const response = await fetch("/api/returns/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderItemId: item.id,
        reasonCode: formData.reason,
        reasonDescription: formData.description,
        evidenceFiles: [...photoUrls, ...videoUrls],
        originalPackaging: formData.originalPackaging,
      }),
    });

    if (response.ok) {
      alert("✅ Demande de retour envoyée! Le vendeur a 72h pour répondre.");
      onClose();
    }
  }

  return (
    <Modal isOpen onClose={onClose}>
      <h2>Demander un retour</h2>

      <div className="form-group">
        <label>Motif du retour *</label>
        <select
          value={formData.reason}
          onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
        >
          <option value="">Sélectionnez un motif</option>
          <option value="DEFECTIVE">Produit défectueux</option>
          <option value="WRONG_ITEM">Mauvais article reçu</option>
          <option value="DAMAGED">Endommagé à la réception</option>
          <option value="NOT_AS_DESCRIBED">
            Non conforme à la description
          </option>
          <option value="CHANGED_MIND">Je ne veux plus le produit</option>
        </select>
      </div>

      <div className="form-group">
        <label>Description détaillée * (min. 20 caractères)</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Expliquez précisément le problème..."
          minLength={20}
        />
      </div>

      <div className="form-group">
        <label>Photos du problème * (min. 2)</label>
        <FileUpload
          accept="image/*"
          multiple
          maxFiles={5}
          onChange={(files) => setFormData({ ...formData, photos: files })}
        />
        <small>
          Prenez en photo: emballage, produit, défaut visible, étiquette
        </small>
      </div>

      <div className="form-group">
        <label>Vidéo (optionnel mais recommandé)</label>
        <FileUpload
          accept="video/*"
          onChange={(files) => setFormData({ ...formData, videos: files })}
        />
      </div>

      <div className="form-group checkbox">
        <input
          type="checkbox"
          checked={formData.originalPackaging}
          onChange={(e) =>
            setFormData({ ...formData, originalPackaging: e.target.checked })
          }
        />
        <label>Je confirme avoir l'emballage d'origine *</label>
      </div>

      <div className="modal-actions">
        <button className="btn-cancel" onClick={onClose}>
          Annuler
        </button>
        <button
          className="btn-submit"
          onClick={submitReturn}
          disabled={!isFormValid(formData)}
        >
          Envoyer la demande
        </button>
      </div>

      <div className="info-box">
        ℹ️ Le paiement du vendeur sera gelé temporairement. Il a 72h pour
        répondre. Sans réponse, votre retour sera automatiquement accepté.
      </div>
    </Modal>
  );
}
```

---

## 📋 CHECKLIST IMPLÉMENTATION

### Phase 1: Core Système (3 semaines)

- [ ] ✅ Créer tables BDD (returns, return_ratings, arbitration_cases, escrow)
- [ ] ✅ Système escrow (gel/libération paiements)
- [ ] ✅ Délai vendeur 72h + auto-approbation
- [ ] ✅ API demande retour (avec upload preuves)
- [ ] ✅ API réponse vendeur (accepter/contester)
- [ ] ✅ Workflow arbitrage (création cas, assignation, décision)

### Phase 2: Logistique (2 semaines)

- [ ] ✅ Intégration API transporteur (Chronopost/DHL)
- [ ] ✅ Génération étiquette retour automatique
- [ ] ✅ Webhooks suivi colis
- [ ] ✅ Upload preuves S3

### Phase 3: Notation & Anti-Abus (1 semaine)

- [ ] ✅ Système notation post-retour
- [ ] ✅ Impact trust score
- [ ] ✅ Détection abus (acheteurs + vendeurs)
- [ ] ✅ Historique public

### Phase 4: Frontend (2 semaines)

- [ ] ✅ Modal demande retour (upload photos/vidéos)
- [ ] ✅ Dashboard retours acheteur
- [ ] ✅ Dashboard retours vendeur
- [ ] ✅ Interface arbitrage (admin)
- [ ] ✅ Notation post-retour

### Phase 5: Testing (1 semaine)

- [ ] ✅ Tests workflow complet
- [ ] ✅ Tests auto-approbation
- [ ] ✅ Tests arbitrage
- [ ] ✅ Tests escrow

**Total:** 9 semaines

---

## 🎯 RÉSULTATS ATTENDUS

### Impact Business

- **Confiance acheteurs:** +45% (escrow protection)
- **Résolution rapide:** 72h max réponse vendeur
- **Litiges:** -70% grâce à arbitrage clair
- **Satisfaction:** +40% (process transparent)

### Impact Vendeurs

- **Cash-flow:** Retardé de 7-14 jours (escrow)
- **Confiance:** Badge "Excellent Service Retours" si bon comportement
- **Protection:** Arbitrage équitable contre retours abusifs

### Impact Plateforme

- **Professionnalisme:** Étiquettes retour automatiques
- **Transparence:** Historique public + notations
- **Conformité:** Traçabilité complète (audit)

---

**Document créé le:** 2025-12-31  
**Version:** 2.0 - MayiReturn SecureFlow  
**Statut:** ✅ PRÊT POUR IMPLÉMENTATION  
**Améliorations:** Escrow, Délai 72h, Étiquettes auto, Arbitrage dédié, Notation post-retour
