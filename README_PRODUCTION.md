# Pi Academy Social - Guide de Déploiement Production

## 📋 Vue d'Ensemble

**Pi Academy Social** est une plateforme éducative gamifiée qui récompense les utilisateurs avec de la cryptomonnaie Pi pour l'apprentissage. Cette application combine éducation, DeFi, et fonctionnalités sociales dans l'écosystème Pi Network.

### 🎯 Fonctionnalités Principales

- ✅ **6 Cours Éducatifs** (Pi Network, Blockchain, Sécurité, Économie, Trading, DeFi)
- ✅ **Système de Quiz** avec explications pédagogiques
- ✅ **Staking Pi** (3 périodes: 30/60/90 jours avec APR 5%/8%/12%)
- ✅ **Fil Social** avec publications persistantes
- ✅ **Boutique** d'items virtuels
- ✅ **Système Premium** (0.01π/mois)
- ✅ **Wallet Virtuel** avec dépôt/retrait
- ✅ **Leaderboard** hebdomadaire
- ✅ **Photo de Profil Personnalisée**
- ✅ **Système de Parrainage**
- ✅ **Multilingue** (FR/EN)

---

## 🚀 Installation Rapide

### Prérequis

```bash
Node.js >= 16.x
npm >= 8.x
```

### 1. Cloner/Copier les Fichiers

```bash
# Structure du projet
pi-academy-social/
├── src/
│   ├── App.tsx          # Composant principal
│   ├── index.tsx        # Point d'entrée
│   └── index.css        # Styles globaux
├── public/
│   └── index.html
├── package.json
└── tsconfig.json
```

### 2. Installer les Dépendances

```bash
npm install
```

**Dépendances requises:**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### 3. Configuration Tailwind CSS

**tailwind.config.js:**
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

**postcss.config.js:**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 4. Lancer en Développement

```bash
npm run dev
```

Application accessible sur: `http://localhost:5173`

---

## 🔧 Intégration Pi SDK (Production)

### Étape 1: Installer le SDK

```bash
npm install @pi-network/sdk
```

### Étape 2: Initialiser le SDK

**src/services/piNetwork.ts:**
```typescript
import { Pi } from '@pi-network/sdk';

export const initPiSDK = () => {
  return Pi.init({
    version: "2.0",
    sandbox: false // true pour testnet
  });
};

export const authenticateUser = async () => {
  try {
    const scopes = ['username', 'payments'];
    const authResult = await Pi.authenticate(scopes, onIncompletePaymentFound);
    return authResult;
  } catch (error) {
    console.error('Pi authentication failed:', error);
    throw error;
  }
};

const onIncompletePaymentFound = (payment: any) => {
  console.log('Incomplete payment found:', payment);
  // Gérer les paiements incomplets
};
```

### Étape 3: Remplacer le Mock User

**Dans App.tsx, remplacer:**
```typescript
// AVANT (Mock)
useEffect(() => {
  setTimeout(() => {
    const uid = 'PIA' + Math.random().toString(36).substring(2, 11).toUpperCase();
    setUser({
      uid: uid,
      username: 'Pioneer' + Math.floor(Math.random() * 10000),
      avatar: '🎓',
      joinDate: '2024-11-01'
    });
    setLoading(false);
  }, 1000);
}, []);

// APRÈS (Pi SDK)
useEffect(() => {
  const initPi = async () => {
    try {
      await initPiSDK();
      const authResult = await authenticateUser();
      setUser({
        uid: authResult.user.uid,
        username: authResult.user.username,
        avatar: '🎓',
        joinDate: new Date().toISOString().split('T')[0]
      });
      setLoading(false);
    } catch (error) {
      console.error('Pi initialization failed:', error);
      setLoading(false);
    }
  };
  initPi();
}, []);
```

### Étape 4: Implémenter les Paiements Pi

**src/services/piPayments.ts:**
```typescript
import { Pi } from '@pi-network/sdk';

export const createPayment = async (amount: number, memo: string) => {
  try {
    const paymentData = {
      amount: amount,
      memo: memo,
      metadata: { productId: 'premium_subscription' }
    };
    
    const payment = await Pi.createPayment(paymentData, {
      onReadyForServerApproval: (paymentId) => {
        // Appeler votre backend pour approuver
        approvePaymentOnBackend(paymentId);
      },
      onReadyForServerCompletion: (paymentId, txid) => {
        // Appeler votre backend pour compléter
        completePaymentOnBackend(paymentId, txid);
      },
      onCancel: (paymentId) => {
        console.log('Payment cancelled:', paymentId);
      },
      onError: (error, payment) => {
        console.error('Payment error:', error);
      }
    });
    
    return payment;
  } catch (error) {
    console.error('Create payment failed:', error);
    throw error;
  }
};

const approvePaymentOnBackend = async (paymentId: string) => {
  const response = await fetch('/api/payments/approve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId })
  });
  return response.json();
};

const completePaymentOnBackend = async (paymentId: string, txid: string) => {
  const response = await fetch('/api/payments/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentId, txid })
  });
  return response.json();
};
```

### Étape 5: Utiliser les Paiements

**Dans handlePremiumUpgrade():**
```typescript
const handlePremiumUpgrade = async () => {
  const PREMIUM_COST = 0.01;
  
  try {
    const payment = await createPayment(PREMIUM_COST, 'Premium Subscription');
    
    // Attendre la confirmation du paiement
    if (payment.status === 'completed') {
      setIsPremium(true);
      setShowPremiumModal(false);
      alert('🎉 Bienvenue Premium!');
    }
  } catch (error) {
    alert('⚠️ Paiement échoué. Veuillez réessayer.');
  }
};
```

---

## 🗄️ Backend API (Recommandé)

### Architecture Suggérée

```
Backend (Node.js + Express + MongoDB)
├── /api/auth
│   └── POST /login (Pi SDK auth)
├── /api/users
│   ├── GET /profile
│   └── PUT /profile/picture
├── /api/courses
│   ├── GET /list
│   └── POST /:id/complete
├── /api/social
│   ├── GET /feed
│   ├── POST /post
│   └── POST /like
├── /api/payments
│   ├── POST /approve
│   └── POST /complete
└── /api/leaderboard
    └── GET /top
```

### Exemple d'Endpoint

**server.js:**
```javascript
const express = require('express');
const app = express();

app.post('/api/payments/approve', async (req, res) => {
  const { paymentId } = req.body;
  
  // Vérifier le paiement avec Pi SDK
  const payment = await Pi.getPayment(paymentId);
  
  if (payment.amount === 0.01 && payment.memo === 'Premium Subscription') {
    // Approuver le paiement
    await Pi.approvePayment(paymentId);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid payment' });
  }
});
```

---

## 🌐 Déploiement VPS

### Option 1: Nginx + PM2

**1. Build Production:**
```bash
npm run build
```

**2. Installer PM2:**
```bash
npm install -g pm2
```

**3. Servir avec PM2:**
```bash
pm2 serve dist 3000 --spa --name pi-academy
pm2 save
pm2 startup
```

**4. Configuration Nginx:**
```nginx
server {
    listen 80;
    server_name piacademy.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: always
```

---

## 🔐 Variables d'Environnement

**`.env.production`:**
```env
VITE_PI_API_KEY=your_pi_api_key
VITE_PI_SANDBOX=false
VITE_API_URL=https://api.piacademy.com
VITE_GCV_VALUE=314.159
```

---

## 📊 Monitoring & Analytics

### Recommandations

1. **Sentry** pour le tracking d'erreurs
2. **Google Analytics** pour les métriques utilisateur
3. **LogRocket** pour les sessions replay
4. **Mixpanel** pour l'analyse comportementale

**Installation Sentry:**
```bash
npm install @sentry/react
```

**src/index.tsx:**
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
  tracesSampleRate: 1.0,
});
```

---

## ✅ Checklist Pré-Production

- [ ] Remplacer localStorage par API backend
- [ ] Intégrer Pi SDK pour authentification
- [ ] Implémenter les paiements Pi réels
- [ ] Configurer le monitoring (Sentry)
- [ ] Tester sur Pi Testnet
- [ ] Optimiser les images (compression)
- [ ] Activer HTTPS (Let's Encrypt)
- [ ] Configurer CORS pour API
- [ ] Ajouter rate limiting
- [ ] Tester sur mobile (responsive)
- [ ] Configurer backup base de données
- [ ] Documenter l'API

---

## 📞 Support & Contact

**Documentation Pi SDK:** https://developers.minepi.com  
**Pi Network:** https://minepi.com  

---

## 📄 Licence

© 2024 Pi Academy Social - Construit pour le Pi Hackathon

**Version:** 2.0.0  
**Dernière mise à jour:** 2025-12-16
