# 🏗️ MASTERPLAN: ARCHITECTURE EXPERTE (Operation Citadel)

> **Diagnostic** : L'application souffre d'un couplage excessif centré sur `App.tsx`. La logique métier (Économie, Jeu, Auth) est mélangée à la couche de présentation.
> **Objectif** : Découpler, Modulariser, Sécuriser.
> **Standard** : Feature-Sliced Design (Adapté React).

---

## 1. 🧱 Architecture Cible

Nous allons passer d'une structure "Par Type" (components, pages, services) à une structure "Par Domaine" (features).

### A. `src/features/` (Le Cerveau)
Chaque dossier contient TOUT ce qui concerne une fonctionnalité : ses composants, ses hooks, ses services.

1.  **`auth/`** : `LoginScreen`, `UserAccessControl`, `AuthContext`.
2.  **`economy/`** : `EnergySystem`, `StakingModal`, `ShopPage`, `WalletModal`.
3.  **`education/`** : `CourseCard`, `QuizEngine`, `SmartLabViewer`, `DiscoveryViewer`.
4.  **`gamification/`** : `XPProgress`, `Badges`, `Leaderboard`.

### B. `src/shared/` (Les Briques)
Composants idiots (UI) et utilitaires qui ne connaissent RIEN au métier Pionnier.

1.  **`ui/`** : `Button`, `Modal`, `Card`, `Toast`.
2.  **`lib/`** : `firebase.ts`, `i18n.ts`.

### C. `src/app/` (Le Chef d'Orchestre)
Ce qui initialise l'application.

1.  **`App.tsx`** : Ne doit contenir QUE le Routing et les Providers. Plus de logique !
2.  **`store.ts`** : (Optionnel) Un Global Store (Zustand/Context) pour remplacer le gros state de App.tsx.

---

## 2. 🛡️ Modèle Économique & Sécurité (Restructuration)

### Le Problème Actuel
L'économie est calculée "côté client" dans des handlers dispersés (`handleSmartLabComplete`, `handleQuizComplete`). C'est vulnérable à la triche et difficile à maintenir.

### La Solution "Economy Engine"
Nous allons centraliser toute mutation économique dans un Hook/Service unique.

```typescript
// hook usage example
const { earn } = useEconomy();
earn('QUIZ_COMPLETE', { score: 100, premium: true }); 
// Le hook gère tout : XP, Pi, Logs, Cloud Sync, Anti-Cheat.
```

---

## 3. 📜 SCRIPT DE MIGRATION (Plan d'Action)

### Phase 1 : Echafaudage (Safe)
- Créer la nouvelle structure de dossiers.
- Ne rien casser de l'existant.

### Phase 2 : Extraction de l'UI Partagée
- Deplacer `EnergyHeader`, `Logo`, boutons génériques vers `src/shared/ui`.

### Phase 3 : Extraction des Features (Big refactor)
- Bouger `SmartLabViewer` -> `features/education/components`.
- Bouger `EnergyShop` -> `features/economy/components`.

### Phase 4 : The Great Decoupling (App.tsx)
- Créer `GameContextProvider` pour absorber le state `userProgress`.
- Vider `App.tsx` de ses 2000 lignes de logique.

---

## 4. 🚀 BÉNÉFICES IMMÉDIATS
1.  **Stabilité** : Modifier le Labo ne cassera plus le Login.
2.  **Vitesse** : `App.tsx` sera léger, le re-render sera optimisé.
3.  **Clarté** : "Où est le code du quiz ?" -> `features/education`.

---
*Ce document est la "Bible" de la restructuration. Suivez-le strictement.*
