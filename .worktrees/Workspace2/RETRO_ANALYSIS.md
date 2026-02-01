# 🎯 RÉTRO-ANALYSE & PLAN D'ACTION - PIONEER ACADEMY

## 1️⃣ ÉTAT DES LIEUX (RÉTRO-ANALYSE)

### A. Logique Générale & Incohérences
*   **Monolithe `App.tsx`**: Le coeur de l'application (2205 lignes) gère TOUT : routing, logique métier, UI, state, et data fetching. Cela rend le code fragile et difficile à maintenir.
*   **Logique "Bricolée" Identifiée**:
    *   **"Synchronisation de Progression"** (App.tsx: L2104): Un bouton caché dans le profil permet de débloquer manuellement des cours. C'est un aveu d'échec de la logique de progression automatique. **Action: Supprimer et corriger le bug racine.**
    *   **Staking Client-Side** (App.tsx: L376): Le calcul des récompenses de staking se fait dans un `useEffect` côté client. C'est risqué et non sécurisé. **Action: Déplacer la logique dans un Service ou Backend.**
    *   **Mode "Pioneer Dev"** (App.tsx: L275): Une backdoor explicite en production. **Action: Sécuriser via variables d'environnement UNIQUEMENT.**
*   **Navigation**: Gestion manuelle via `activeTab` au lieu d'un vrai routeur. Empêche le deep-linking et complexifie l'état.

### B. Architecture
*   **Absence de Séparation UI / Logique**: Les fonctions comme `handleStaking`, `handlePublish` sont mélangées au rendu JSX.
*   **Pas de Vrai Système de Settings**: Le fichier de traduction mentionne "Notifications", "Sons", mais l'UI ne propose aucune de ces options. Le profil n'est qu'une vue de stats + logout.

### C. Multilingue (i18n) - ❌ CRITIQUE
L'application ne respecte pas le multilingue. De nombreuses chaînes sont **codées en dur en Français** :
*   **Alertes**: Tous les `window.alert()` et `window.confirm()` (L448, L474, L546...).
*   **Composants**: `UserBadge.tsx`, `App.tsx` (Bannières, Titres, Descriptions Shop).
*   **Items Shop**: Les noms et descriptions des produits sont hardcodés.

---

## 2️⃣ PLAN DE NETTOYAGE & RECONSTRUCTION

### Phase 1: Nettoyage Immédiat (Stabilisation)
1.  **Suppression des Options Mortes**: Supprimer le bouton "Synchronisation de Progression" (après avoir vérifié la logique de déblocage).
2.  **Externalisation des Textes**: Remplacer TOUTES les chaînes hardcodées par des clés `t('...')`.
    *   Créer les clés manquantes dans `i18n.ts`.
    *   Mettre à jour `App.tsx` et `UserBadge.tsx`.

### Phase 2: Refonte Architecturelle (Reconstruction)
1.  **Extraction des Composants**:
    *   Créer `src/pages/ProfilePage.tsx`, `src/pages/ShopPage.tsx`, `src/pages/SocialPage.tsx`.
    *   Déplacer la logique de `App.tsx` vers ces pages.
2.  **Logique de Settings**: Implémenter une vraie modale de paramètres (Langue, Son, Notifs) accessible depuis le profil.
3.  **Fix Bugs**:
    *   Revoir la logique de déblocage des cours dans `ProgressionSystem`.
    *   Sécuriser le calcul des récompenses.

---

## 3️⃣ VALIDATION UTILISATEUR

Confirmez-vous ce plan d'action ?
1.  **Priorité 1**: Remplacer le texte hardcodé (FR mixing) par i18n partout.
2.  **Priorité 2**: Extraire le gros bloc `App.tsx` en sous-pages propres.
3.  **Priorité 3**: Supprimer le hack "Sync Progression" et corriger la logique réelle.

En attente de votre feu vert pour démarrer la **Phase 1 (Nettoyage & i18n Global)**.
