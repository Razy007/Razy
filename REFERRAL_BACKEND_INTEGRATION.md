# 🚀 Intégration Frontend - Système de Parrainage

## 📦 Backend Développé - Prêt à Utiliser

Le backend du système de parrainage est maintenant **complètement développé** et prêt à être intégré dans votre application frontend.

---

## 📁 Fichiers Créés

### 1. **Modèle MongoDB**

- `backend/database/models/Referral.js`
  - Tracking complet des parrainages
  - Récompenses, milestones, statistiques
  - Système anti-fraude

### 2. **Routes API**

- `backend/routes/referral.js`
  - 8 endpoints complets (voir ci-dessous)

### 3. **Service Automatisé**

- `backend/src/services/ReferralService.js`
  - Attribution automatique des récompenses
  - Détection de fraude
  - Tâches planifiées

### 4. **Modèle User Mis à Jour**

- `backend/database/models/User.js`
  - Ajout des champs `referral` et `badges`

---

## 🔌 Endpoints API Disponibles

### 1. **GET /api/referral/code**

Obtenir le code de parrainage de l'utilisateur

**Headers:**

```json
{
  "Authorization": "Bearer USER_TOKEN"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "referralCode": "PIAA8F3D2",
    "shareLink": "https://piacademy.com/ref/PIAA8F3D2",
    "stats": {
      "totalReferrals": 12,
      "activeReferrals": 8,
      "totalEarnings": {
        "xp": 1250,
        "pi": 0.0035
      }
    }
  }
}
```

---

### 2. **POST /api/referral/validate**

Valider un code de parrainage lors de l'inscription

**Body:**

```json
{
  "referralCode": "PIAA8F3D2"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "valid": true,
    "referralCode": "PIAA8F3D2",
    "referrerUsername": "Pioneer123",
    "bonuses": {
      "signupXP": 50,
      "signupPi": 0.0001
    }
  }
}
```

---

### 3. **POST /api/referral/track**

Tracker un nouveau filleul (appelé lors de l'inscription)

**Body:**

```json
{
  "referralCode": "PIAA8F3D2",
  "newUserId": "USER_ID",
  "metadata": {
    "ipAddress": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "deviceFingerprint": "abc123def456"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Parrainage enregistré avec succès",
  "data": {
    "bonusAwarded": {
      "xp": 50,
      "pi": 0.0001
    }
  }
}
```

---

### 4. **POST /api/referral/milestone**

Notifier qu'un milestone a été atteint

**Headers:**

```json
{
  "Authorization": "Bearer USER_TOKEN"
}
```

**Body:**

```json
{
  "userId": "USER_ID",
  "milestone": "firstCourseCompleted" | "level5Reached" | "level10Reached"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Milestone enregistré",
  "data": {
    "milestone": "level5Reached",
    "unlockedTiers": ["tier5"]
  }
}
```

---

### 5. **GET /api/referral/stats**

Obtenir les statistiques complètes de parrainage

**Headers:**

```json
{
  "Authorization": "Bearer USER_TOKEN"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "totalReferrals": 12,
      "activeReferrals": 8,
      "pendingReferrals": 2,
      "totalEarnings": {
        "xp": 1250,
        "pi": 0.0035
      },
      "milestones": {
        "tier5": { "unlocked": true, "date": "2024-01-15" },
        "tier10": { "unlocked": false }
      }
    },
    "referrals": [
      {
        "username": "Pioneer456",
        "avatar": "👤",
        "level": 3,
        "status": "active",
        "signupDate": "2024-01-10",
        "milestones": {
          "firstCourseCompleted": { "completed": true, "date": "2024-01-11" },
          "level5Reached": { "completed": false }
        },
        "rewardsEarned": {
          "totalXP": 75,
          "totalPi": 0.0002
        }
      }
    ],
    "pendingRewards": {
      "xp": 150,
      "pi": 0.0005,
      "badges": []
    }
  }
}
```

---

### 6. **POST /api/referral/claim-rewards**

Réclamer les récompenses en attente

**Headers:**

```json
{
  "Authorization": "Bearer USER_TOKEN"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Récompenses réclamées avec succès",
  "data": {
    "claimed": {
      "xp": 150,
      "pi": 0.0005,
      "badges": ["referral_master"]
    },
    "newBalance": {
      "xp": 3500,
      "pi": 0.0125,
      "level": 4
    }
  }
}
```

---

### 7. **GET /api/referral/leaderboard**

Classement des meilleurs parrains

**Query Params:**

```
?limit=10
```

**Response:**

```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "username": "CryptoMaster",
        "avatar": "👑",
        "level": 15,
        "activeReferrals": 48,
        "totalEarnings": {
          "xp": 12500,
          "pi": 0.125
        }
      }
    ]
  }
}
```

---

### 8. **POST /api/referral/report-fraud**

Signaler une suspicion de fraude

**Headers:**

```json
{
  "Authorization": "Bearer USER_TOKEN"
}
```

**Body:**

```json
{
  "referralCode": "PIAFRAUD1",
  "reason": "Multiples comptes suspects avec les mêmes données"
}
```

**Response:**

---

### 9. **POST /api/users/:userId/link-pi-wallet**

Lier le Pi Wallet pour activer les récompenses "Écosystème Pi".

**Headers:**

```json
{
  "Authorization": "Bearer USER_TOKEN"
}
```

**Body:**

```json
{
  "walletAddress": "GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "walletAddress": "G...",
    "rewards": {
      "user": { "xp": 100, "pi": 0.0005 },
      "referrer": { "xp": 150, "pi": 0.001 }
    }
  }
}
```

---

## 💻 Intégration Frontend (Code React)

### 1. **Service API Frontend**

Créez `src/services/ReferralAPI.ts` :

```typescript
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const ReferralAPI = {
  // Obtenir le code de parrainage
  async getMyReferralCode(token: string) {
    const response = await fetch(`${API_BASE}/api/referral/code`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  // Valider un code lors de l'inscription
  async validateCode(code: string) {
    const response = await fetch(`${API_BASE}/api/referral/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ referralCode: code }),
    });
    return response.json();
  },

  // Tracker un nouveau filleul
  async trackReferral(code: string, userId: string, metadata: any) {
    const response = await fetch(`${API_BASE}/api/referral/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        referralCode: code,
        newUserId: userId,
        metadata,
      }),
    });
    return response.json();
  },

  // Obtenir les statistiques
  async getStats(token: string) {
    const response = await fetch(`${API_BASE}/api/referral/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  // Réclamer les récompenses
  async claimRewards(token: string) {
    const response = await fetch(`${API_BASE}/api/referral/claim-rewards`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.json();
  },

  // Obtenir le leaderboard
  async getLeaderboard(limit = 10) {
    const response = await fetch(
      `${API_BASE}/api/referral/leaderboard?limit=${limit}`
    );
    return response.json();
  },
};
```

---

### 2. **Composant Dashboard de Parrainage**

Créez `src/components/referral/ReferralDashboard.tsx` :

```typescript
import React, { useEffect, useState } from "react";
import { ReferralAPI } from "../../services/ReferralAPI";

export const ReferralDashboard = ({ userToken }) => {
  const [referralData, setReferralData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, []);

  const loadReferralData = async () => {
    try {
      const [codeData, statsData] = await Promise.all([
        ReferralAPI.getMyReferralCode(userToken),
        ReferralAPI.getStats(userToken),
      ]);

      setReferralData({
        code: codeData.data,
        stats: statsData.data,
      });
    } catch (error) {
      console.error("Error loading referral data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimRewards = async () => {
    try {
      const result = await ReferralAPI.claimRewards(userToken);

      if (result.success) {
        alert(
          `✅ Récompenses réclamées!\n\n+${result.data.claimed.xp} XP\n+${result.data.claimed.pi}π`
        );
        loadReferralData(); // Recharger
      }
    } catch (error) {
      alert("❌ Erreur lors de la réclamation");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(referralData?.code.shareLink || "");
    alert("✅ Lien copié!");
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="referral-dashboard">
      {/* Code de Parrainage */}
      <div className="referral-code-card">
        <h3>Votre Code de Parrainage</h3>
        <p className="code">{referralData?.code.referralCode}</p>
        <button onClick={copyLink}>📤 Partager</button>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Filleuls Actifs</h4>
          <p>{referralData?.stats.stats.activeReferrals}</p>
        </div>
        <div className="stat-card">
          <h4>Total Gagné</h4>
          <p>{referralData?.stats.stats.totalEarnings.xp} XP</p>
          <p>{referralData?.stats.stats.totalEarnings.pi.toFixed(6)}π</p>
        </div>
      </div>

      {/* Récompenses en Attente */}
      {referralData?.stats.pendingRewards.xp > 0 && (
        <div className="pending-rewards">
          <h4>Récompenses en Attente</h4>
          <p>{referralData.stats.pendingRewards.xp} XP</p>
          <p>{referralData.stats.pendingRewards.pi.toFixed(6)}π</p>
          <button onClick={handleClaimRewards}>💰 Réclamer</button>
        </div>
      )}

      {/* Liste des Filleuls */}
      <div className="referrals-list">
        <h4>Mes Filleuls</h4>
        {referralData?.stats.referrals.map((ref, i) => (
          <div key={i} className="referral-item">
            <span>
              {ref.avatar} {ref.username}
            </span>
            <span>Niveau {ref.level}</span>
            <span className={`status ${ref.status}`}>{ref.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
```

---

### 3. **Hook pour Tracker Automatiquement les Milestones**

Créez `src/hooks/useReferralTracking.ts` :

```typescript
import { useEffect } from "react";
import { ReferralAPI } from "../services/ReferralAPI";

export const useReferralTracking = (userToken: string, userId: string) => {
  // Tracker premier cours complété
  const trackFirstCourse = async () => {
    try {
      await fetch(`${API_BASE}/api/referral/milestone`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          milestone: "firstCourseCompleted",
        }),
      });
    } catch (error) {
      console.error("Error tracking first course:", error);
    }
  };

  // Tracker niveau 5
  const trackLevel5 = async () => {
    try {
      await fetch(`${API_BASE}/api/referral/milestone`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          milestone: "level5Reached",
        }),
      });
    } catch (error) {
      console.error("Error tracking level 5:", error);
    }
  };

  return { trackFirstCourse, trackLevel5 };
};
```

---

## 🔗 Intégration dans le Flow d'Inscription

### Dans votre composant d'inscription :

```typescript
const handleSignup = async (userData) => {
  try {
    // 1. Créer l'utilisateur
    const newUser = await createUser(userData);

    // 2. Si code de parrainage dans URL
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");

    if (refCode) {
      // 3. Valider le code
      const validation = await ReferralAPI.validateCode(refCode);

      if (validation.success && validation.data.valid) {
        // 4. Tracker le parrainage
        const metadata = {
          ipAddress: await getClientIP(),
          userAgent: navigator.userAgent,
          deviceFingerprint: await generateFingerprint(),
        };

        await ReferralAPI.trackReferral(refCode, newUser.id, metadata);

        // 5. Afficher le bonus
        alert(
          `🎁 Bonus de parrainage!\n\n+50 XP\n+0.0001π\n\nMerci d'avoir rejoint via ${validation.data.referrerUsername}!`
        );
      }
    }

    // Continuer le flow normal
    navigate("/dashboard");
  } catch (error) {
    console.error("Signup error:", error);
  }
};
```

---

## 📋 Checklist d'Intégration

### Backend

- [x] Modèle Referral créé
- [x] Routes API créées
- [x] Service ReferralService créé
- [x] Modèle User mis à jour
- [ ] Routes ajoutées dans server.js
- [ ] Variables d'environnement configurées

### Frontend

- [ ] Service API créé
- [ ] Composant ReferralDashboard créé
- [ ] Hook useReferralTracking créé
- [ ] Intégration dans le flow d'inscription
- [ ] Intégration dans le profil utilisateur
- [ ] Intégration dans l'onglet Social

### Tests

- [ ] Tester la création de code
- [ ] Tester la validation de code
- [ ] Tester le tracking
- [ ] Tester les milestones
- [ ] Tester la réclamation de récompenses

---

## 🚀 Prochaine Étape

Pour activer le système, vous devez :

1. **Ajouter la route dans server.js** :

```javascript
const referralRoutes = require("./routes/referral");
app.use("/api/referral", referralRoutes);
```

2. **Redémarrer le backend** :

```bash
cd backend
npm restart
```

3. **Tester les endpoints** avec Postman ou curl

---

## 📞 Support

Si vous rencontrez des problèmes d'intégration, vérifiez :

- Les tokens d'authentification sont bien passés
- Les ID utilisateurs sont bien formatés (ObjectId MongoDB)
- Les CORS sont configurés correctement
- Les variables d'environnement sont définies

**Le backend est prêt ! Il ne reste plus qu'à l'intégrer dans votre frontend ! 🎉**
