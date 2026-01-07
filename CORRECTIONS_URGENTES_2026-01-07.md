# 🚨 CORRECTIONS URGENTES - RETOUR UTILISATEUR

**Date**: 2026-01-07 16:15  
**Source**: Test utilisateur en local  
**Priorité**: ❌ CRITIQUE

---

## 📋 PROBLÈMES IDENTIFIÉS

### 1. ❌ EMAILS JURIDIQUES NON CONFIGURÉS ⚠️ LÉGAL

**Fichiers concernés**:
- `src/pages/PrivacyPolicyPage.tsx`
- `src/pages/TermsOfServicePage.tsx`

**Emails mentionnés**:
```
privacy@pioneeracademy.academy
support@pioneeracademy.academy
legal@pioneeracademy.academy
```

**Status**: ❌ **PAS CONFIGURÉS / PAS FONCTIONNELS**

**Risque juridique**: 🔴 **ÉLEVÉ**
- Fausses déclarations dans documents juridiques
- Non-conformité GDPR (obligation de contact réel)
- Pénalités possibles si signalé

**Solution requise**:
1. **Option A** (Immédiat): Utiliser emails réels existants
2. **Option B** (Professionnel): Créer les adresses emails sur le serveur

**Recommandation**: Option B (créer vraies adresses emails)

---

### 2. ❌ TABLEAU XP PROGRESSION MANQUANT

**Problème**: Tableau temps réel d'avancement XP a disparu

**Impact utilisateur**:
- ❌ Utilisateurs ne savent plus combien de XP ils accumulent
- ❌ Impossible de savoir quand débloquer cours suivant
- ❌ Expérience "à l'aveuglette"

**Fichier**: `src/components/education/CoursesTab.tsx`

**Status actuel**:
```typescript
<XPProgressIndicator userProgress={userProgress} allCourses={COURSES} />
```

✅ **Le composant est là !** Mais peut-être caché ou non visible.

**Actions à vérifier**:
1. Vérifier si `XPProgressIndicator` s'affiche correctement
2. Vérifier les styles CSS
3. Restaurer si nécessaire

---

### 3. ❌ BUG UI - BARRE COMMENTAIRE ÉTIRÉE

**Problème**: Après envoi commentaire en réponse, la barre reste étendue indéfiniment

**Impact**:
- ❌ Prend toute la place visuelle
- ❌ Persiste même en changeant de module
- ❌ Ruine l'expérience utilisateur

**Fichier**: `src/components/social/CommentThread.tsx`

**Cause probable**: État `replyingTo` n'est pas reset après envoi

**Ligne concernée**: 73-78

**Solution**: Reset `replyingTo` et `replyContent` après `handleSubmitReply()`

---

### 4. ❌ BOUTON SYNCHRONISATION DISPARU

**Problème**: Bouton sync dans profil guest_pioneer a disparu

**Rôle du bouton**:
- ✅ Synchroniser données utilisateur
- ✅ Actualiser progression XP
- ✅ Corriger désynchronisation

**Fichier concerné**: `src/pages/ProfilePage.tsx` (probable)

**Actions**:
1. Vérifier si le bouton existe
2. Le restaurer si supprimé
3. S'assurer qu'il fonctionne

---

## 🎯 ORDRE DE CORRECTION

### Priorité 1 (LÉGAL) ⚠️:
1. ✅ **Emails juridiques** - Remplacer par emails réels ou créer les adresses

### Priorité 2 (UX CRITIQUE):
2. ✅ **Barre commentaire** - Corriger le bug d'étirement
3. ✅ **Tableau XP** - Restaurer/Rendre visible
4. ✅ **Bouton sync** - Restaurer dans profil

---

## 📧 SOLUTION EMAILS (DÉTAILLÉE)

### Option A: Utiliser emails existants (Temporaire)

**Si vous avez un email professionnel**:
```
privacy@pioneeracademy.academy → votre_email@gmail.com
support@pioneeracademy.academy → votre_email@gmail.com
legal@pioneeracademy.academy → votre_email@gmail.com
```

### Option B: Créer adresses emails (Recommandé)

**Sur votre serveur Hetzner via cPanel/Mail**:
1. Créer `privacy@pioneeracademy.academy`
2. Créer `support@pioneeracademy.academy`
3. Créer `legal@pioneeracademy.academy`
4. Configurer redirections vers votre email principal

### Option C: Services externes

**Google Workspace** (payant, ~5€/mois/user):
```
privacy@pioneeracademy.academy
support@pioneeracademy.academy
```

**Zoho Mail** (gratuit jusqu'à 5 users):
```
Emails professionnels gratuits
Configuration DNS MX records
```

---

## ⏱️ TEMPS ESTIMÉ CORRECTIONS

1. **Emails juridiques**: 30-60 min (selon option choisie)
2. **Barre commentaire**: 5 minutes (fix code)
3. **Tableau XP**: 10 minutes (vérification + restoration)
4. **Bouton sync**: 10 minutes (restoration)

**Total**: 55-85 minutes

---

## 🚨 DÉCISION REQUISE (VOUS)

**Emails juridiques** - Quelle option choisir ?

**Option A**: "J'ai déjà un email → utiliser : _____________"
**Option B**: "Je vais créer les 3 emails sur mon serveur"
**Option C**: "Je vais utiliser Zoho Mail gratuit"
**Option D**: "Autre solution : _____________"

**Merci de me confirmer votre choix avant que je corrige !**

---

**Dernière mise à jour**: 2026-01-07 16:15  
**En attente de**: Décision utilisateur sur les emails
