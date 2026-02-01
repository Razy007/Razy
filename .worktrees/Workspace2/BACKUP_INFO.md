# État de la Sauvegarde - Pi Academy Social
**Date:** 2026-01-15
**Version:** Restauration V2 (Secours)

## 📌 État Actuel
Cette version est une **sauvegarde fonctionnelle de secours**. Elle a été configurée pour garantir l'affichage des cours et le fonctionnement de base malgré des problèmes de base de données (Postgres/MongoDB).

### 🛠️ Modifications Critiques (À savoir pour le futur dev)

1.  **Frontend (Bypass API)**
    *   Fichier : `frontend/src/pages/CoursesPage.tsx`
    *   Modif : L'appel API `ApiService.getCourses()` est court-circuité pour utiliser directement les données locales (`frontend/src/data/courses.ts`).
    *   *Pourquoi ?* Pour assurer que les utilisateurs voient le contenu même si le backend est instable ou la DB vide.
    *   *À faire :* Retirer le bypass une fois la DB de production connectée et peuplée.

2.  **Backend (Fake Data Injection)**
    *   Fichier : `backend/src/presentation/controllers/CourseController.ts`
    *   Modif : Le contrôleur sert les données statiques depuis `backend/src/data/restored_courses.ts` au lieu d'interroger la DB.
    *   Données sources : `backend/src/data/restored_courses.ts` (contient Intro, Wallet, Anti-Scam, Blockchain, DeFi).

3.  **Cours Restaurés**
    *   Le catalogue complet (Blockchain, DeFi, Wallet Security...) a été reconstitué dans les fichiers statiques.
    *   Le système de "Lab" interactif est fonctionnel via les données statiques (simulations).

## 🚀 Comment relancer proprement
1.  **DB :** Configurer une base Postgres propre et y injecter les données structurées (un script de seed sera nécessaire basé sur `restored_courses.ts`).
2.  **Backend :** Restaurer `CourseController` pour utiliser `this.courseRepository.findAll()`.
3.  **Frontend :** Réactiver l'appel API dans `CoursesPage.tsx`.

## ⚠️ Notes
Cette version est optimisée pour la **stabilité immédiate** et la **démonstration**. Ne pas écraser la base de données de production sans backup préalable.
