# Correction du Bug de la Boutique (Shop & Energy Shop)

## Problème Identifié

L'utilisateur rapportait qu'il possédait assez de Pi mais ne pouvait pas effectuer d'achats dans la **boutique d'Énergie**.

## Cause Racine

Le problème était causé par **des erreurs de précision des nombres à virgule flottante** en JavaScript.

Lorsque des opérations arithmétiques sont effectuées sur des nombres décimaux (comme 0.0125 - 0.001), JavaScript peut introduire de minuscules erreurs de précision. Par exemple :

```javascript
0.1 + 0.2 === 0.3; // false! (retourne 0.30000000000000004)
```

Dans notre cas :

- Balance initiale : `0.0125π`
- Après quelques achats/gains, la balance pouvait devenir : `0.012499999999999999π`
- Lors de la comparaison `balance >= cost`, cette petite imprécision faisait échouer l'achat

## Solution Appliquée

Nous avons implémenté un **arrondi à 6 décimales** pour toutes les comparaisons et opérations monétaires dans **3 fichiers** :

### 1. **App.jsx** (Boutique régulière - racine du projet)

```javascript
// Avant (risque d'erreur de précision)
if (userProgress.piBalance >= item.cost) {
  setUserProgress((prev) => ({
    ...prev,
    piBalance: prev.piBalance - item.cost,
  }));
}

// Après (corrigé)
const balance = Math.round(userProgress.piBalance * 1000000) / 1000000;
const cost = Math.round(item.cost * 1000000) / 1000000;

if (balance >= cost) {
  setUserProgress((prev) => ({
    ...prev,
    piBalance: Math.round((prev.piBalance - item.cost) * 1000000) / 1000000,
  }));
}
```

### 2. **src/components/energy/EnergyShop.tsx** (Boutique d'Énergie)

```typescript
// Correction dans handlePurchase
const balance = Math.round(piBalance * 1000000) / 1000000;
const cost = Math.round(product.piCost * 1000000) / 1000000;

if (balance < cost) {
  alert(
    `⚠️ Solde insuffisant!\n\nCoût: ${
      product.piCost
    }π\nVotre solde: ${piBalance.toFixed(6)}π\nManquant: ${(
      product.piCost - piBalance
    ).toFixed(6)}π`
  );
  return;
}
```

```typescript
// Correction dans le bouton d'achat
disabled={(Math.round(piBalance * 1000000) / 1000000) < (Math.round(product.piCost * 1000000) / 1000000)}
```

### 3. **src/App.tsx** (Fonction handleEnergyPurchase)

```typescript
// Avant
piBalance: prev.piBalance - cost;

// Après (corrigé)
piBalance: Math.round((prev.piBalance - cost) * 1000000) / 1000000;
```

## Améliorations Supplémentaires

1. **Messages d'erreur détaillés** : Les utilisateurs voient maintenant exactement :
   - Leur balance actuelle
   - Le coût de l'item
   - Le montant manquant

```javascript
alert(`⚠️ Solde insuffisant!

Votre balance: ${userProgress.piBalance.toFixed(6)}π
Coût: ${item.cost}π
Manquant: ${(item.cost - userProgress.piBalance).toFixed(6)}π`);
```

2. **Application cohérente** : La correction a été appliquée à :
   - Tous les items individuels de la boutique (App.jsx)
   - Les packs spéciaux (App.jsx)
   - Tous les produits d'énergie (EnergyShop.tsx)
   - La fonction de déduction de Pi (App.tsx)

## Fichiers Modifiés

1. `App.jsx` (lignes 1445-1461 et 1478-1491)
2. `src/components/energy/EnergyShop.tsx` (lignes 57-61 et 190-205)
3. `src/App.tsx` (lignes 626-637)

## Test Recommandé

### Boutique Régulière (si applicable)

1. Ouvrir l'application
2. Vérifier la balance initiale (0.0125π)
3. Essayer d'acheter :
   - Avatar Premium (0.001π) ✅
   - Badge Légendaire (0.002π) ✅
   - Boost XP x2 (0.003π) ✅
   - Pass Premium (0.005π) ✅
   - Pack Débutant (0.008π) ✅

### Boutique d'Énergie

1. Ouvrir la boutique d'énergie
2. Vérifier votre balance Pi
3. Essayer d'acheter :
   - Recharge Rapide (0.0001π, +50⚡) ✅
   - Boost 24h (0.0003π) ✅
   - Énergie Illimitée 7j (0.001π) ✅

Tous les achats devraient maintenant fonctionner correctement !

## Note Technique

Pour les transactions critiques en production, il est recommandé d'utiliser :

- Une bibliothèque comme `decimal.js` ou `big.js`
- Ou stocker les montants en centièmes/millièmes (integers) et les convertir uniquement pour l'affichage
