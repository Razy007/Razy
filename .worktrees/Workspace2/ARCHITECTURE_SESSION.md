# Architecture de Session & Navigation (Pioneer Academy v2.0)

Cette architecture a été mise en place pour résoudre définitivement les problèmes de flashs, de déconnexions intempestives et de crashs sur mobile.

## 1. Stabilisation du User Object (Anti-Flash)
- **Problème** : Les mises à jour de l'objet `user` (ex: upload photo) provoquaient des re-renders massifs et passaient parfois un état `undefined` transitoire aux composants.
- **Solution Technique** : `stableUserRef` + `effectiveUser`.
    - `App.tsx` maintient une référence persistante (`stableUserRef`) qui garde la dernière version valide de l'utilisateur.
    - `effectiveUser` est passé aux pages (Routes). Si une opération critique (`isCriticalOperation`) est en cours, `effectiveUser` reste figé sur l'ancienne valeur valide.
    - **Résultat** : L'interface ne clignote jamais, même pendant les mises à jour lourdes.

## 2. Overlay de Session "In-App" (Anti-Déconnexion)
- **Problème** : La perte temporaire de l'état `sessionUnlocked` (lors d'une navigation rapide) redirigeait brutalement vers `/login` (route externe).
- **Solution Technique** : Le flux de Login est maintenant **interne et superposé**.
    - Si l'utilisateur est déjà connu (`effectiveUser`), mais que la session nécessite une vérification :
        - L'application reste affichée en arrière-plan (états conservés).
        - `LoginScreen` s'affiche en **MODALE/OVERLAY** (`z-index: 100`) par-dessus l'application.
        - Il affiche une **Barre de Progression** ("Vérification de session...") au lieu des boutons de connexion.
    - **Résultat** : L'utilisateur n'est jamais "éjecté" de l'application. La vérification ressemble à un chargement fluide.

## 3. Optimisation Mémoire (Mobile Crash Fix)
- **Problème** : Les images de profil Base64 brutes (3-5MB) saturaient la mémoire RAM des navigateurs mobiles, provoquant des crashs de l'onglet (et donc un reset de l'app).
- **Solution Technique** : 
    - **Compression Client** : Toute image uploadée est redimensionnée (Max 800px) et compressée (JPEG 70%) via `src/utils/imageUtils.ts` avant d'être stockée. Poids : ~50KB.
    - **Memoization** : Les listes lourdes (`CoursesPage`) sont mémorisées via `useMemo` pour éviter les recalculs inutiles.

## 4. Gate Résiliente
- **Logique** : `if (!sessionUnlocked && !isCriticalOperation && !effectiveUser) return <LoginScreen />`
- **Explication** : 
    - Si `effectiveUser` existe (c'est-à-dire qu'on était connecté il y a une seconde), le Gate **NE BLOQUE PAS** le rendu de l'App.
    - Il laisse l'Overlay (point 2) gérer l'affichage "Vérification".
    - Le Gate bloquant ne s'active que si l'utilisateur est **vraiment** déconnecté (User `null`).

---
*Ce document sert de référence pour la stabilité de la session dans Pioneer Academy.*
