# Actions Urgentes & Post-Test

## 🔴 TO DO AVANT RELEASE PUBLIQUE
1. **Re-verrouiller les cours** :
   - Dans `src/pages/CoursesPage.tsx` : remettre `QUIZ_SYSTEM_DISABLED = false`.
   - Dans `src/services/edu/AccessControl.ts` : retirer `return { allowed: true }`.

2. **Nettoyer les logs Debug** :
   - Vérifier si des consoles logs excessifs trainent.

## ✅ FAIT (Session UX + Unlock)
- [x] Gamification du Smart Lab V2 (Barre XP, Popups, Feedback).
- [x] Déblocage total des cours pour review utilisateur ("Master Key").
- [x] Déploiement Production (No Sudo fix).
