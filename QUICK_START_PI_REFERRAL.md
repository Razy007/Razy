# ⚡ QUICK START - Système de Parrainage Pi-Centric

## 🎯 EN 3 MINUTES

### ✅ Qu'est-ce qui a été fait ?

Un système de parrainage **centré sur Pi Network** avec:

- **Multiplicateur 2X** si le filleul a un Pi Wallet
- **Bonus unique** de 200 XP + 0.002π lors de la connexion Pi Wallet
- **Paliers exclusifs** (25+, 50+) réservés aux utilisateurs Pi Network

---

## 🚀 DÉMARRAGE RAPIDE

### 1. Redémarrer le Backend (2 min)

```bash
# Naviguer vers le backend
cd c:/Users/lenovo/.gemini/antigravity/scratch/pi-academy-app/backend

# Installer les dépendances (si nécessaire)
npm install

# Démarrer le serveur
npm start
```

**✅ Vérification:** Le backend devrait afficher `Server running on port 3001`

---

### 2. Tester les Endpoints (3 min)

#### Test 1: Vérifier les stats Pi Network

```bash
curl http://localhost:3001/api/referral/pi-network-stats
```

**Résultat attendu:**

```json
{
  "success": true,
  "data": {
    "globalStats": {
      "totalReferrals": 0,
      "piNetworkUsers": 0,
      "piAdoptionRate": "0%",
      ...
    }
  }
}
```

#### Test 2: Vérifier le leaderboard

```bash
curl http://localhost:3001/api/referral/leaderboard
```

---

## 🔥 COMMENT ÇA FONCTIONNE

### Scénario Typique

1. **Utilisateur A** (parrain) crée un code de parrainage
2. **Utilisateur B** (filleul) s'inscrit avec le code
   - Parrain A reçoit: **50 XP + 0.0001π**
3. **Utilisateur B connecte son Pi Wallet** 🔥

   - **B** reçoit: **100 XP + 0.0005π + Badge "Pi Pioneer"**
   - **Parrain A** reçoit: **200 XP + 0.002π + MULTIPLICATEUR 2X activé**

4. **Utilisateur B** complète son premier cours

   - Normalement: Parrain A recevrait 25 XP + 0.0001π
   - **AVEC 2X:** Parrain A reçoit **50 XP + 0.0002π** 🚀

5. **Utilisateur B atteint niveau 5**
   - Normalement: Parrain A recevrait 100 XP + 0.0005π
   - **AVEC 2X:** Parrain A reçoit **200 XP + 0.001π** 🚀

---

## 📊 GAINS RÉELS

### Sans Pi Wallet (10 filleuls)

```
Total: ~2,700 XP + 0.0093π (~$5.10)
```

### Avec Pi Wallet (10 filleuls) 🔥

```
Total: ~6,650 XP + 0.0361π (~$19.78)
```

**💰 3.9X PLUS DE GAINS !**

---

## 🛠️ ENDPOINTS CLÉS

### 1. Obtenir son code de parrainage

```
GET /api/referral/code
```

### 2. Valider un code de parrainage

```
POST /api/referral/validate
Body: { "referralCode": "PIA8F3D2" }
```

### 3. Tracker un nouveau filleul

```
POST /api/referral/track
Body: {
  "referralCode": "PIA8F3D2",
  "newUserId": "64abc...",
  "metadata": { "ipAddress": "...", ... }
}
```

### 4. 🔥 Connecter un Pi Wallet (NOUVEAU)

```
POST /api/referral/link-pi-wallet
Body: {
  "userId": "64abc...",
  "piWalletAddress": "GDX...",
  "piUsername": "pioneer123"
}
```

### 5. Stats Pi Network (NOUVEAU)

```
GET /api/referral/pi-network-stats
```

### 6. Obtenir ses stats

```
GET /api/referral/stats
```

### 7. Réclamer ses récompenses

```
POST /api/referral/claim-rewards
```

---

## 📋 CHECKLIST RAPIDE

### Backend ✅

- [x] Modèles MongoDB mis à jour
- [x] Routes API créées
- [x] Service automatisé configuré
- [x] Multiplicateur 2X implémenté
- [x] Documentation complète

### Frontend (À FAIRE)

- [ ] Intégrer les endpoints
- [ ] Créer le composant PiWalletPrompt
- [ ] Afficher le multiplicateur 2X
- [ ] Dashboard Pi Network Stats

---

## 📚 DOCUMENTATION COMPLÈTE

1. **`PI_NETWORK_REFERRAL_SUMMARY.md`**

   - Résumé exécutif avec tous les détails techniques
   - Comparaisons de gains
   - Checklist complétation

2. **`PI_NETWORK_REFERRAL_GUIDE.md`**

   - Guide complet du système Pi-Centric
   - Stratégies de maximisation des gains
   - Copywriting et messages d'incitation

3. **`REFERRAL_BACKEND_INTEGRATION.md`**

   - Code d'intégration React/TypeScript
   - Composants prêts à l'emploi
   - Hooks personnalisés

4. **`REFERRAL_TESTING_GUIDE.md`**
   - Tests curl pour chaque endpoint
   - Collection Postman
   - Guide de dépannage

---

## 🔍 VÉRIFICATION RAPIDE

### Test Complet en 1 Commande

```bash
# Test des stats (devrait retourner JSON)
curl http://localhost:3001/api/referral/pi-network-stats
```

Si vous voyez un JSON avec `"success": true`, **tout fonctionne !** 🎉

---

## 💡 PROCHAINES ÉTAPES

1. **Tester le backend** avec les commandes ci-dessus
2. **Lire** `PI_NETWORK_REFERRAL_SUMMARY.md` pour les détails
3. **Intégrer** dans le frontend (voir `REFERRAL_BACKEND_INTEGRATION.md`)
4. **Créer** les composants React manquants
5. **Déployer** en production

---

## 🎯 EN RÉSUMÉ

Le système de parrainage est maintenant **100% Pi-Centric**:

✅ **Multiplicateur 2X** pour les utilisateurs avec Pi Wallet  
✅ **Bonus unique** de 0.002π + 200 XP à la connexion  
✅ **Paliers exclusifs** réservés à Pi Network  
✅ **Stats en temps réel** de l'adoption Pi  
✅ **Documentation complète** pour l'intégration

**🚀 Prêt à promouvoir l'écosystème Pi Network !**

---

## ❓ BESOIN D'AIDE ?

- **Problème backend?** Vérifiez que MongoDB est connecté
- **Question technique?** Lisez `PI_NETWORK_REFERRAL_SUMMARY.md`
- **Intégration frontend?** Voir `REFERRAL_BACKEND_INTEGRATION.md`

**Tous les fichiers sont dans:** `c:/Users/lenovo/.gemini/antigravity/scratch/pi-academy-app/`
