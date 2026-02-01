# 🧾 SYSTÈME FACTURATION AUTOMATIQUE - MayimavaStore

## 📋 Vue d'Ensemble

Système de génération automatique de factures PDF pour acheteurs ET vendeurs, conforme aux standards e-commerce et réglementations fiscales africaines.

**Contraintes:**

- ✅ Génération automatique après paiement
- ✅ Numérotation unique et séquentielle
- ✅ Archivage illimité (compliance légale)
- ✅ Format PDF professionnel
- ✅ Immutabilité (non modifiable après création)
- ✅ Accessible mobile & desktop

---

## 🎯 Types de Factures

### 1. Facture Acheteur (Invoice)

**Générée:** Après paiement validé  
**Destinataire:** Acheteur  
**Contenu:**

```javascript
const buyerInvoice = {
  // En-tête
  invoiceNumber: "INV-2025-000123", // Unique, séquentiel
  invoiceDate: "2025-12-31",
  dueDate: null, // Payé immédiatement

  // Parties
  seller: {
    name: "Boutique TechPro",
    businessName: "TechPro SARL",
    address: "...",
    phone: "+227 XX XX XX XX",
    email: "contact@techpro.com",
    taxId: "NIF-XXXXX", // Numéro fiscal (si applicable)
  },

  buyer: {
    name: "Jean Dupont",
    address: "...",
    phone: "+227 XX XX XX XX",
    email: "jean@email.com",
  },

  // Détails commande
  orderNumber: "ORD-2025-456789",
  items: [
    {
      description: "iPhone 15 Pro 256GB",
      quantity: 1,
      unitPrice: 850000,
      subtotal: 850000,
    },
  ],

  // Montants
  subtotal: 850000,
  shippingFees: 5000,
  discount: 85000, // Coupon -10%
  discountLabel: "Coupon SILVER (-10%)",
  tax: 0, // TVA si applicable
  total: 770000,

  // Paiement
  paymentMethod: "Orange Money",
  paymentDate: "2025-12-31 14:30",
  paymentStatus: "PAID",

  // Informations légales
  terms: "Coupons non remboursables. Retours acceptés sous 14 jours.",
  notes: "Merci pour votre achat!",

  // Commission marketplace (invisible pour acheteur)
  platformFee: 77000, // 10% (interne uniquement)
};
```

### 2. Facture Vendeur (Sales Report / Payout Statement)

**Générée:** Par commande OU périodique  
**Destinataire:** Vendeur  
**Contenu:**

```javascript
const sellerInvoice = {
  // En-tête
  statementNumber: "STMT-2025-V123-001",
  statementDate: "2025-12-31",
  period: {
    from: "2025-12-01",
    to: "2025-12-31",
  },

  // Vendeur
  seller: {
    id: "seller_123",
    name: "Boutique TechPro",
    businessName: "TechPro SARL",
    taxId: "NIF-XXXXX",
  },

  // Ventes
  sales: [
    {
      orderNumber: "ORD-2025-456789",
      orderDate: "2025-12-15",
      buyer: "Jean D.", // Anonymisé
      productName: "iPhone 15 Pro",
      quantity: 1,
      grossAmount: 850000, // Prix avant réduction
      discount: 85000, // Réduction appliquée
      netSaleAmount: 770000, // Prix final payé
      platformFee: 77000, // Commission 10%
      sellerPayout: 693000, // Ce que reçoit le vendeur
    },
  ],

  // Totaux
  summary: {
    totalOrders: 15,
    grossSales: 12750000, // Total avant réductions
    totalDiscounts: 1275000, // Total réductions (coupons)
    netSales: 11475000, // Total après réductions
    platformFees: 1147500, // Total commissions (10%)
    returns: -250000, // Remboursements retours
    adjustments: 0, // Ajustements divers
    totalPayout: 10077500, // Montant final vendeur
  },

  // Statut paiement
  payoutStatus: "PENDING", // PENDING, PROCESSING, PAID
  payoutMethod: "Bank Transfer",
  payoutDate: "2026-01-05", // Paiement J+5
  bankAccount: "XXXX-XXXX-XXXX-1234",
};
```

---

## 💾 SCHÉMA DE BASE DE DONNÉES

### Table: `invoices`

```sql
CREATE TABLE invoices (
  id UUID PRIMARY KEY,

  -- Type
  invoice_type ENUM('BUYER', 'SELLER') NOT NULL,

  -- Numéros uniques
  invoice_number VARCHAR(50) UNIQUE NOT NULL,  -- INV-2025-000123
  sequential_number INT NOT NULL,               -- Auto-increment

  -- Références
  order_id UUID,                                -- Null si relevé vendeur périodique
  seller_id UUID NOT NULL,
  buyer_id UUID,                                -- Null si relevé vendeur

  -- Dates
  invoice_date DATE NOT NULL,
  due_date DATE,
  period_start DATE,                            -- Pour relevés périodiques
  period_end DATE,

  -- Montants (acheteur)
  subtotal DECIMAL(10,2),
  shipping_fees DECIMAL(10,2),
  discount_amount DECIMAL(10,2),
  discount_label VARCHAR(255),
  tax_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2),

  -- Montants (vendeur)
  gross_sales DECIMAL(10,2),                    -- Ventes brutes
  net_sales DECIMAL(10,2),                      -- Après réductions
  platform_fees DECIMAL(10,2),                  -- Commissions
  returns_amount DECIMAL(10,2) DEFAULT 0,
  payout_amount DECIMAL(10,2),                  -- Montant final vendeur

  -- Paiement
  payment_method VARCHAR(50),
  payment_status ENUM('UNPAID', 'PAID', 'PARTIALLY_PAID') DEFAULT 'PAID',
  payment_date TIMESTAMP,

  -- Payout (vendeur)
  payout_status ENUM('PENDING', 'PROCESSING', 'PAID', 'FAILED') DEFAULT 'PENDING',
  payout_method VARCHAR(50),
  payout_date DATE,
  payout_reference VARCHAR(100),

  -- PDF
  pdf_url TEXT,                                 -- URL S3/storage
  pdf_generated_at TIMESTAMP,

  -- Immutabilité
  is_finalized BOOLEAN DEFAULT TRUE,            -- Immutable après création
  hash VARCHAR(64),                             -- SHA-256 hash (intégrité)

  -- Métadonnées
  items_data JSONB,                             -- Détails articles (immutable)
  metadata JSONB,                               -- Informations complémentaires

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (seller_id) REFERENCES users(id),
  FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE UNIQUE INDEX idx_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoice_order ON invoices(order_id);
CREATE INDEX idx_invoice_seller ON invoices(seller_id);
CREATE INDEX idx_invoice_buyer ON invoices(buyer_id);
CREATE INDEX idx_invoice_date ON invoices(invoice_date DESC);
CREATE INDEX idx_invoice_sequential ON invoices(sequential_number);
```

### Table: `invoice_sequences` (Numérotation unique)

```sql
CREATE TABLE invoice_sequences (
  id UUID PRIMARY KEY,

  year INT NOT NULL,
  invoice_type ENUM('BUYER', 'SELLER') NOT NULL,
  last_number INT DEFAULT 0,

  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),

  UNIQUE(year, invoice_type)
);

-- Fonction pour obtenir le prochain numéro
CREATE OR REPLACE FUNCTION get_next_invoice_number(
  p_type VARCHAR,
  OUT invoice_number VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_year INT;
  v_next_number INT;
  v_prefix VARCHAR;
BEGIN
  v_year := EXTRACT(YEAR FROM CURRENT_DATE);

  -- Déterminer le préfixe
  IF p_type = 'BUYER' THEN
    v_prefix := 'INV';
  ELSE
    v_prefix := 'STMT';
  END IF;

  -- Lock et increment
  INSERT INTO invoice_sequences (year, invoice_type, last_number)
  VALUES (v_year, p_type, 1)
  ON CONFLICT (year, invoice_type)
  DO UPDATE SET
    last_number = invoice_sequences.last_number + 1,
    updated_at = NOW()
  RETURNING last_number INTO v_next_number;

  -- Format: INV-2025-000123 ou STMT-2025-000456
  invoice_number := v_prefix || '-' || v_year || '-' || LPAD(v_next_number::TEXT, 6, '0');
END;
$$;
```

---

## 🔄 GÉNÉRATION AUTOMATIQUE

### 1. Facture Acheteur (Après Paiement)

```javascript
// Trigger: Après paiement validé
async function generateBuyerInvoice(orderId) {
  const order = await Order.findById(orderId)
    .populate("buyer_id")
    .populate("seller_id")
    .populate("items")
    .populate("coupon_id");

  // Vérifier si facture déjà générée
  const existingInvoice = await Invoice.findOne({
    order_id: orderId,
    invoice_type: "BUYER",
  });
  if (existingInvoice) {
    return existingInvoice;
  }

  // Obtenir numéro de facture unique
  const invoiceNumber = await getNextInvoiceNumber("BUYER");

  // Préparer données
  const items = order.items.map((item) => ({
    description: item.product_name,
    sku: item.product_sku,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    subtotal: item.unit_price * item.quantity,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingFees = order.shipping_fees || 0;
  const discount = order.discount_amount || 0;
  const discountLabel = order.coupon_id
    ? `Coupon ${order.coupon_id.code} (-${order.coupon_id.discount_value}%)`
    : null;
  const tax = 0; // TVA si applicable
  const total = subtotal + shippingFees - discount + tax;

  // Créer facture
  const invoice = await Invoice.create({
    invoice_type: "BUYER",
    invoice_number: invoiceNumber,
    sequential_number: extractSequentialNumber(invoiceNumber),

    order_id: orderId,
    seller_id: order.seller_id._id,
    buyer_id: order.buyer_id._id,

    invoice_date: new Date(),

    subtotal,
    shipping_fees: shippingFees,
    discount_amount: discount,
    discount_label: discountLabel,
    tax_amount: tax,
    total_amount: total,

    payment_method: order.payment_method,
    payment_status: "PAID",
    payment_date: order.paid_at,

    is_finalized: true,
    items_data: items,

    metadata: {
      seller: {
        name: order.seller_id.shop_name,
        businessName: order.seller_id.business_name,
        address: order.seller_id.business_address,
        phone: order.seller_id.phone,
        email: order.seller_id.email,
        taxId: order.seller_id.tax_id,
      },
      buyer: {
        name: order.buyer_id.full_name,
        address: order.shipping_address,
        phone: order.buyer_id.phone,
        email: order.buyer_id.email,
      },
      orderNumber: order.order_number,
      terms:
        "Coupons non remboursables. Retours acceptés sous 14 jours selon conditions.",
      notes: "Merci pour votre achat sur MayimavaStore!",
    },
  });

  // Générer PDF
  const pdfUrl = await generateInvoicePDF(invoice.id);

  // Mettre à jour avec URL PDF
  await Invoice.update(invoice.id, {
    pdf_url: pdfUrl,
    pdf_generated_at: new Date(),
    hash: generateInvoiceHash(invoice),
  });

  // Envoyer par email
  await sendEmail(order.buyer_id.email, "INVOICE_READY", {
    invoiceNumber: invoiceNumber,
    downloadUrl: pdfUrl,
    orderNumber: order.order_number,
  });

  return invoice;
}

function generateInvoiceHash(invoice) {
  const crypto = require("crypto");
  const dataToHash = JSON.stringify({
    invoice_number: invoice.invoice_number,
    total_amount: invoice.total_amount,
    invoice_date: invoice.invoice_date,
    items: invoice.items_data,
  });

  return crypto.createHash("sha256").update(dataToHash).digest("hex");
}
```

### 2. Relevé Vendeur (Périodique ou Par Commande)

```javascript
// Option A: Générer par commande
async function generateSellerInvoicePerOrder(orderId) {
  const order = await Order.findById(orderId)
    .populate("seller_id")
    .populate("items");

  const invoiceNumber = await getNextInvoiceNumber("SELLER");

  // Calculer montants
  const grossSales = order.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  const netSales = order.total; // Après réductions coupon
  const platformFee = netSales * 0.1; // Commission 10%
  const payoutAmount = netSales - platformFee;

  const invoice = await Invoice.create({
    invoice_type: "SELLER",
    invoice_number: invoiceNumber,
    sequential_number: extractSequentialNumber(invoiceNumber),

    order_id: orderId,
    seller_id: order.seller_id._id,

    invoice_date: new Date(),

    gross_sales: grossSales,
    net_sales: netSales,
    platform_fees: platformFee,
    payout_amount: payoutAmount,

    payout_status: "PENDING",
    payout_method: order.seller_id.payout_method || "Bank Transfer",

    is_finalized: true,

    items_data: [
      {
        orderNumber: order.order_number,
        orderDate: order.created_at,
        buyer: anonymizeBuyerName(order.buyer_id.full_name),
        items: order.items.map((item) => ({
          productName: item.product_name,
          quantity: item.quantity,
          grossAmount: item.unit_price * item.quantity,
          discount: 0,
          netAmount: item.unit_price * item.quantity,
        })),
        grossAmount: grossSales,
        discount: grossSales - netSales,
        netSaleAmount: netSales,
        platformFee: platformFee,
        sellerPayout: payoutAmount,
      },
    ],

    metadata: {
      seller: {
        id: order.seller_id._id,
        name: order.seller_id.shop_name,
        businessName: order.seller_id.business_name,
        taxId: order.seller_id.tax_id,
      },
    },
  });

  // Générer PDF
  const pdfUrl = await generateSellerStatementPDF(invoice.id);

  await Invoice.update(invoice.id, {
    pdf_url: pdfUrl,
    pdf_generated_at: new Date(),
    hash: generateInvoiceHash(invoice),
  });

  return invoice;
}

// Option B: Relevé mensuel consolidé
async function generateMonthlySellerStatement(sellerId, year, month) {
  const invoiceNumber = await getNextInvoiceNumber("SELLER");

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  // Récupérer toutes les commandes du mois
  const orders = await Order.find({
    seller_id: sellerId,
    status: "DELIVERED",
    delivered_at: { $gte: startDate, $lte: endDate },
  }).populate("items");

  // Récupérer retours du mois
  const returns = await Return.find({
    seller_id: sellerId,
    status: "REFUNDED",
    refund_issued_at: { $gte: startDate, $lte: endDate },
  });

  // Calculer totaux
  let grossSales = 0;
  let totalDiscounts = 0;
  let netSales = 0;

  const salesData = orders.map((order) => {
    const gross = order.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const discount = order.discount_amount || 0;
    const net = order.total;

    grossSales += gross;
    totalDiscounts += discount;
    netSales += net;

    return {
      orderNumber: order.order_number,
      orderDate: order.created_at,
      buyer: anonymizeBuyerName(order.buyer_id?.full_name || "Anonymous"),
      items: order.items.map((item) => ({
        productName: item.product_name,
        quantity: item.quantity,
      })),
      grossAmount: gross,
      discount: discount,
      netSaleAmount: net,
      platformFee: net * 0.1,
      sellerPayout: net * 0.9,
    };
  });

  const platformFees = netSales * 0.1;
  const returnsAmount = returns.reduce(
    (sum, ret) => sum + ret.refund_amount,
    0
  );
  const totalPayout = netSales * 0.9 - returnsAmount;

  const invoice = await Invoice.create({
    invoice_type: "SELLER",
    invoice_number: invoiceNumber,
    sequential_number: extractSequentialNumber(invoiceNumber),

    seller_id: sellerId,

    invoice_date: new Date(),
    period_start: startDate,
    period_end: endDate,

    gross_sales: grossSales,
    net_sales: netSales,
    platform_fees: platformFees,
    returns_amount: returnsAmount,
    payout_amount: totalPayout,

    payout_status: "PENDING",

    is_finalized: true,

    items_data: salesData,

    metadata: {
      summary: {
        totalOrders: orders.length,
        grossSales,
        totalDiscounts,
        netSales,
        platformFees,
        returns: returnsAmount,
        totalPayout,
      },
      period: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
    },
  });

  // Générer PDF
  const pdfUrl = await generateSellerStatementPDF(invoice.id);

  await Invoice.update(invoice.id, {
    pdf_url: pdfUrl,
    pdf_generated_at: new Date(),
    hash: generateInvoiceHash(invoice),
  });

  // Envoyer par email
  const seller = await User.findById(sellerId);
  await sendEmail(seller.email, "MONTHLY_STATEMENT", {
    invoiceNumber,
    period: `${month}/${year}`,
    totalPayout,
    downloadUrl: pdfUrl,
  });

  return invoice;
}

function anonymizeBuyerName(fullName) {
  if (!fullName) return "Anonymous";
  const parts = fullName.split(" ");
  if (parts.length === 1) return parts[0][0] + ".";
  return parts[0] + " " + parts[parts.length - 1][0] + ".";
}
```

---

## 📄 GÉNÉRATION PDF

### Template Facture Acheteur

```javascript
// Utilisation de PDFKit ou Puppeteer
const PDFDocument = require("pdfkit");
const AWS = require("aws-sdk");
const s3 = new AWS.S3();

async function generateInvoicePDF(invoiceId) {
  const invoice = await Invoice.findById(invoiceId);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const fileName = `invoices/buyer/${invoice.invoice_number}.pdf`;

  // Buffer pour upload S3
  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  // ========== HEADER ==========
  doc.fontSize(20).text("FACTURE", 50, 50, { align: "center" });

  doc
    .fontSize(10)
    .fillColor("#666")
    .text(`N° ${invoice.invoice_number}`, 50, 80, { align: "center" })
    .text(`Date: ${new Date(invoice.invoice_date).toLocaleDateString()}`, {
      align: "center",
    });

  // Logo MayimavaStore
  // doc.image('logo.png', 50, 120, { width: 100 });

  // ========== VENDEUR & ACHETEUR ==========
  doc
    .fontSize(12)
    .fillColor("#000")
    .text("Vendeur:", 50, 180)
    .fontSize(10)
    .fillColor("#333")
    .text(
      invoice.metadata.seller.businessName || invoice.metadata.seller.name,
      50,
      200
    )
    .text(invoice.metadata.seller.address, 50, 215)
    .text(invoice.metadata.seller.phone, 50, 230)
    .text(invoice.metadata.seller.email, 50, 245);

  if (invoice.metadata.seller.taxId) {
    doc.text(`NIF: ${invoice.metadata.seller.taxId}`, 50, 260);
  }

  doc
    .fontSize(12)
    .fillColor("#000")
    .text("Acheteur:", 320, 180)
    .fontSize(10)
    .fillColor("#333")
    .text(invoice.metadata.buyer.name, 320, 200)
    .text(invoice.metadata.buyer.address, 320, 215)
    .text(invoice.metadata.buyer.phone, 320, 230)
    .text(invoice.metadata.buyer.email, 320, 245);

  // ========== TABLEAU ARTICLES ==========
  const tableTop = 320;

  doc.fontSize(10).fillColor("#000");

  // Headers
  drawTableRow(doc, tableTop, "Description", "Qté", "P.U.", "Total");
  doc
    .moveTo(50, tableTop + 20)
    .lineTo(550, tableTop + 20)
    .stroke();

  let yPosition = tableTop + 30;

  invoice.items_data.forEach((item) => {
    drawTableRow(
      doc,
      yPosition,
      item.description,
      item.quantity.toString(),
      formatCurrency(item.unitPrice),
      formatCurrency(item.subtotal)
    );
    yPosition += 25;
  });

  // ========== TOTAUX ==========
  yPosition += 20;

  doc
    .fontSize(10)
    .text("Sous-total:", 350, yPosition)
    .text(formatCurrency(invoice.subtotal), 450, yPosition, { align: "right" });

  yPosition += 20;
  doc
    .text("Frais de livraison:", 350, yPosition)
    .text(formatCurrency(invoice.shipping_fees), 450, yPosition, {
      align: "right",
    });

  if (invoice.discount_amount > 0) {
    yPosition += 20;
    doc
      .fillColor("#008000")
      .text(`Réduction (${invoice.discount_label}):`, 350, yPosition)
      .text(`-${formatCurrency(invoice.discount_amount)}`, 450, yPosition, {
        align: "right",
      })
      .fillColor("#000");
  }

  if (invoice.tax_amount > 0) {
    yPosition += 20;
    doc
      .text("TVA:", 350, yPosition)
      .text(formatCurrency(invoice.tax_amount), 450, yPosition, {
        align: "right",
      });
  }

  yPosition += 20;
  doc
    .fontSize(12)
    .fillColor("#000")
    .text("TOTAL PAYÉ:", 350, yPosition)
    .text(formatCurrency(invoice.total_amount) + " FCFA", 450, yPosition, {
      align: "right",
    });

  // ========== PAIEMENT ==========
  yPosition += 40;
  doc
    .fontSize(10)
    .fillColor("#333")
    .text(`Paiement: ${invoice.payment_method}`, 50, yPosition)
    .text(
      `Date de paiement: ${new Date(invoice.payment_date).toLocaleString()}`,
      50,
      yPosition + 15
    );

  // ========== FOOTER ==========
  yPosition += 60;
  doc
    .fontSize(8)
    .fillColor("#666")
    .text(invoice.metadata.terms, 50, yPosition, {
      width: 500,
      align: "center",
    });

  yPosition += 30;
  doc
    .fontSize(10)
    .fillColor("#333")
    .text(invoice.metadata.notes, 50, yPosition, { align: "center" });

  // ========== WATERMARK (si non payé) ==========
  if (invoice.payment_status !== "PAID") {
    doc
      .fontSize(60)
      .fillColor("#ff0000", 0.3)
      .rotate(-45, { origin: [300, 400] })
      .text("NON PAYÉE", 200, 400)
      .rotate(45, { origin: [300, 400] })
      .fillColor("#000", 1);
  }

  doc.end();

  // ========== UPLOAD S3 ==========
  await new Promise((resolve) => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(chunks);

  const uploadResult = await s3
    .upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      ACL: "private",
    })
    .promise();

  return uploadResult.Location;
}

function drawTableRow(doc, y, col1, col2, col3, col4) {
  doc
    .fontSize(9)
    .text(col1, 50, y, { width: 250 })
    .text(col2, 320, y, { width: 50, align: "center" })
    .text(col3, 390, y, { width: 80, align: "right" })
    .text(col4, 480, y, { width: 80, align: "right" });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("fr-FR").format(amount);
}
```

### Template Relevé Vendeur

```javascript
async function generateSellerStatementPDF(invoiceId) {
  const invoice = await Invoice.findById(invoiceId);

  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const fileName = `invoices/seller/${invoice.invoice_number}.pdf`;

  const chunks = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  // ========== HEADER ==========
  doc.fontSize(20).text("RELEVÉ DE VENTES", 50, 50, { align: "center" });

  doc
    .fontSize(10)
    .fillColor("#666")
    .text(`N° ${invoice.invoice_number}`, 50, 80, { align: "center" })
    .text(`Période: ${invoice.metadata.period}`, { align: "center" });

  // ========== VENDEUR ==========
  doc
    .fontSize(12)
    .fillColor("#000")
    .text("Vendeur:", 50, 130)
    .fontSize(10)
    .fillColor("#333")
    .text(
      invoice.metadata.seller.businessName || invoice.metadata.seller.name,
      50,
      150
    )
    .text(`ID: ${invoice.metadata.seller.id}`, 50, 165);

  if (invoice.metadata.seller.taxId) {
    doc.text(`NIF: ${invoice.metadata.seller.taxId}`, 50, 180);
  }

  // ========== RÉSUMÉ ==========
  const summary = invoice.metadata.summary;
  const summaryY = 220;

  doc
    .fontSize(12)
    .fillColor("#000")
    .text("RÉSUMÉ", 50, summaryY)
    .fontSize(10)
    .fillColor("#333");

  const summaryRows = [
    ["Commandes:", summary.totalOrders.toString()],
    ["Ventes brutes:", formatCurrency(summary.grossSales) + " FCFA"],
    ["Réductions:", "-" + formatCurrency(summary.totalDiscounts) + " FCFA"],
    ["Ventes nettes:", formatCurrency(summary.netSales) + " FCFA"],
    [
      "Commission MayimavaStore (10%):",
      "-" + formatCurrency(summary.platformFees) + " FCFA",
    ],
    ["Retours:", "-" + formatCurrency(Math.abs(summary.returns)) + " FCFA"],
  ];

  let y = summaryY + 20;
  summaryRows.forEach(([label, value]) => {
    doc.text(label, 50, y).text(value, 350, y, { align: "right" });
    y += 20;
  });

  y += 10;
  doc
    .fontSize(12)
    .fillColor("#008000")
    .text("MONTANT NET À RECEVOIR:", 50, y)
    .text(formatCurrency(summary.totalPayout) + " FCFA", 350, y, {
      align: "right",
    })
    .fillColor("#000");

  // ========== DÉTAILS VENTES ==========
  y += 50;
  doc.fontSize(12).text("DÉTAILS DES VENTES", 50, y);

  y += 20;
  doc.fontSize(9).fillColor("#000");

  // Headers
  drawSellerTableRow(
    doc,
    y,
    "Commande",
    "Date",
    "Client",
    "Montant",
    "Commission",
    "Net"
  );
  doc
    .moveTo(50, y + 15)
    .lineTo(550, y + 15)
    .stroke();

  y += 25;

  invoice.items_data.forEach((sale) => {
    drawSellerTableRow(
      doc,
      y,
      sale.orderNumber.substring(0, 12),
      new Date(sale.orderDate).toLocaleDateString(),
      sale.buyer,
      formatCurrency(sale.netSaleAmount),
      formatCurrency(sale.platformFee),
      formatCurrency(sale.sellerPayout)
    );
    y += 20;

    // Nouvelle page si besoin
    if (y > 700) {
      doc.addPage();
      y = 50;
    }
  });

  // ========== PAIEMENT ==========
  y += 30;
  doc
    .fontSize(10)
    .fillColor("#333")
    .text(
      `Statut paiement: ${translatePayoutStatus(invoice.payout_status)}`,
      50,
      y
    )
    .text(`Méthode: ${invoice.payout_method}`, 50, y + 15);

  if (invoice.payout_date) {
    doc.text(
      `Date prévue: ${new Date(invoice.payout_date).toLocaleDateString()}`,
      50,
      y + 30
    );
  }

  // ========== FOOTER ==========
  doc
    .fontSize(8)
    .fillColor("#666")
    .text("MayimavaStore - Plateforme e-commerce", 50, 750, { align: "center" })
    .text("support@mayimavastore.com", { align: "center" });

  doc.end();

  // Upload S3
  await new Promise((resolve) => doc.on("end", resolve));
  const pdfBuffer = Buffer.concat(chunks);

  const uploadResult = await s3
    .upload({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: pdfBuffer,
      ContentType: "application/pdf",
      ACL: "private",
    })
    .promise();

  return uploadResult.Location;
}

function drawSellerTableRow(doc, y, col1, col2, col3, col4, col5, col6) {
  doc
    .fontSize(8)
    .text(col1, 50, y, { width: 80 })
    .text(col2, 140, y, { width: 70 })
    .text(col3, 220, y, { width: 80 })
    .text(col4, 310, y, { width: 70, align: "right" })
    .text(col5, 390, y, { width: 70, align: "right" })
    .text(col6, 470, y, { width: 70, align: "right" });
}

function translatePayoutStatus(status) {
  const translations = {
    PENDING: "En attente",
    PROCESSING: "En cours",
    PAID: "Payé",
    FAILED: "Échec",
  };
  return translations[status] || status;
}
```

---

## 🎨 INTERFACE UTILISATEUR

### Page "Mes Factures" (Acheteur)

```jsx
// MyInvoicesPage.jsx
import React, { useState, useEffect } from "react";

export default function MyInvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchMyInvoices();
  }, []);

  async function fetchMyInvoices() {
    const response = await fetch("/api/buyer/invoices");
    const data = await response.json();
    setInvoices(data);
  }

  async function downloadInvoice(invoiceId) {
    const response = await fetch(`/api/invoices/${invoiceId}/download`);
    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `facture_${invoiceId}.pdf`;
    a.click();
  }

  return (
    <div className="my-invoices-page">
      <h1>Mes Factures</h1>

      <div className="invoices-list">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="invoice-card">
            <div className="invoice-header">
              <span className="invoice-number">{invoice.invoice_number}</span>
              <span className="invoice-date">
                {new Date(invoice.invoice_date).toLocaleDateString()}
              </span>
            </div>

            <div className="invoice-details">
              <div className="detail">
                <span>Commande:</span>
                <strong>#{invoice.metadata.orderNumber}</strong>
              </div>

              <div className="detail">
                <span>Vendeur:</span>
                <strong>{invoice.metadata.seller.name}</strong>
              </div>

              <div className="detail amount">
                <span>Montant total:</span>
                <strong>{invoice.total_amount.toLocaleString()} FCFA</strong>
              </div>

              <div className="detail">
                <span>Statut:</span>
                <span className="badge-paid">✅ Payé</span>
              </div>
            </div>

            <div className="invoice-actions">
              <button
                className="btn-download"
                onClick={() => downloadInvoice(invoice.id)}
              >
                📥 Télécharger PDF
              </button>

              <button className="btn-view">👁️ Voir détails</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Page "Mes Ventes & Paiements" (Vendeur)

```jsx
// SellerSalesPage.jsx
export default function SellerSalesPage() {
  const [statements, setStatements] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStatements();
    fetchStats();
  }, []);

  async function fetchStatements() {
    const response = await fetch("/api/seller/statements");
    const data = await response.json();
    setStatements(data);
  }

  async function fetchStats() {
    const response = await fetch("/api/seller/sales/stats");
    const data = await response.json();
    setStats(data);
  }

  return (
    <div className="seller-sales-page">
      <h1>Mes Ventes & Paiements</h1>

      {/* Stats globales */}
      {stats && (
        <div className="stats-cards">
          <div className="stat-card">
            <span className="stat-label">Ventes ce mois</span>
            <span className="stat-value">{stats.thisMonth.orders}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Montant total</span>
            <span className="stat-value">
              {stats.thisMonth.netSales.toLocaleString()} FCFA
            </span>
          </div>

          <div className="stat-card highlight">
            <span className="stat-label">À recevoir</span>
            <span className="stat-value">
              {stats.thisMonth.payout.toLocaleString()} FCFA
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Commissions</span>
            <span className="stat-value">
              {stats.thisMonth.fees.toLocaleString()} FCFA
            </span>
          </div>
        </div>
      )}

      {/* Relevés */}
      <div className="statements-section">
        <h2>Relevés de ventes</h2>

        <div className="statements-list">
          {statements.map((stmt) => (
            <div key={stmt.id} className="statement-card">
              <div className="statement-header">
                <span className="statement-number">{stmt.invoice_number}</span>
                <span className={`badge-${stmt.payout_status.toLowerCase()}`}>
                  {translatePayoutStatus(stmt.payout_status)}
                </span>
              </div>

              <div className="statement-details">
                <div className="detail">
                  <span>Période:</span>
                  <strong>{stmt.metadata.period}</strong>
                </div>

                <div className="detail">
                  <span>Commandes:</span>
                  <strong>{stmt.metadata.summary.totalOrders}</strong>
                </div>

                <div className="detail">
                  <span>Ventes nettes:</span>
                  <strong>{stmt.net_sales.toLocaleString()} FCFA</strong>
                </div>

                <div className="detail">
                  <span>Commission (10%):</span>
                  <strong className="text-red">
                    -{stmt.platform_fees.toLocaleString()} FCFA
                  </strong>
                </div>

                <div className="detail payout">
                  <span>Montant net:</span>
                  <strong className="text-green">
                    {stmt.payout_amount.toLocaleString()} FCFA
                  </strong>
                </div>
              </div>

              <div className="statement-actions">
                <button
                  className="btn-download"
                  onClick={() => downloadStatement(stmt.id)}
                >
                  📥 Télécharger PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## 📋 CHECKLIST IMPLÉMENTATION

### Phase 1: Backend (2 semaines)

- [ ] Créer tables BDD (invoices, invoice_sequences)
- [ ] Fonction génération numéro unique
- [ ] Génération facture acheteur (trigger après paiement)
- [ ] Génération relevé vendeur (par commande + mensuel)
- [ ] Génération PDF (PDFKit ou Puppeteer)
- [ ] Upload S3 sécurisé
- [ ] Hash intégrité (SHA-256)

### Phase 2: Frontend (1 semaine)

- [ ] Page "Mes Factures" (acheteur)
- [ ] Page "Mes Ventes" (vendeur)
- [ ] Téléchargement PDF sécurisé
- [ ] Stats dashboard vendeur

### Phase 3: Cron Jobs (3 jours)

- [ ] Génération relevés mensuels (automated)
- [ ] Statuts de paiement vendeurs (update)
- [ ] Archivage automatique

### Phase 4: Testing (1 semaine)

- [ ] Tests génération PDF
- [ ] Tests numérotation unique (concurrency)
- [ ] Tests immutabilité
- [ ] Tests téléchargement

---

## 🎯 RÉSULTATS ATTENDUS

### Conformité Légale

- ✅ Factures conformes standards africains
- ✅ Archivage illimité (compliance)
- ✅ Numérotation unique (audit)

### Transparence

- ✅ Vendeurs voient exactement leurs gains
- ✅ Acheteurs gardent trace de tous leurs achats
- ✅ Commission marketplace claire

### Automatisation

- ✅ 0 intervention manuelle
- ✅ Génération instantanée
- ✅ Envoi email automatique

---

**Document créé le:** 2025-12-31  
**Version:** 1.0 PROD-READY  
**Statut:** ✅ PRÊT POUR IMPLÉMENTATION
