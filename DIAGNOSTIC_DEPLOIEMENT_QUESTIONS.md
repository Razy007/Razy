# 🚨 INFORMATIONS REQUISES - DIAGNOSTIC DÉPLOIEMENT PRODUCTION

**Date**: 2026-01-07  
**URL Production**: www.pioneeracademy.academy  
**Statut**: ❌ Non fonctionnel

---

## ❓ QUESTIONS URGENTES

Pour diagnostiquer et corriger le problème de déploiement, merci de répondre aux questions suivantes :

### 1. Quelle est la plateforme d'hébergement ?
**Répondre l'une des options suivantes**:
- [ ] VPS (Hetzner, DigitalOcean, AWS EC2, etc.) avec Nginx
- [ ] Netlify
- [ ] Vercel
- [ ] GitHub Pages
- [ ] Render
- [ ] Autre: ________________

---

### 2. Quel est le résultat actuel en production ?
**Cocher tous les symptômes observés**:
- [ ] Écran blanc (page blanche)
- [ ] Erreur 404 (Not Found)
- [ ] Erreur 503 (Service Unavailable)
- [ ] Page charge mais erreurs JavaScript
- [ ] Page charge partiellement puis crash
- [ ] Rien ne se passe (ne charge jamais)
- [ ] Autre: ________________

---

### 3. Avez-vous des erreurs dans la console navigateur ?
**Instructions**:
1. Ouvrir https://www.pioneeracademy.academy
2. Appuyer sur F12 (Developer Tools)
3. Aller dans l'onglet "Console"
4. **Copier-coller toutes les erreurs rouges ici**:

```
[COLLER LES ERREURS ICI]
```

---

### 4. Vérification réseau (assets JS/CSS)
**Instructions**:
1. F12 → Onglet "Network" (Réseau)
2. Rafraîchir la page (F5)
3. **Chercher des fichiers en rouge (404 ou erreur)**
4. **Copier les noms des fichiers manquants ici**:

```
[COLLER LES FICHIERS 404 ICI]
Exemple:
- index-xxxxx.js → 404
- index.css → 404
```

---

### 5. Configuration Nginx (si VPS)
**Question**: Utilisez-vous Nginx sur votre VPS ?
- [ ] Oui
- [ ] Non
- [ ] Je ne sais pas

**Si OUI**, copier-coller votre configuration Nginx ici:
```nginx
[COLLER VOTRE FICHIER /etc/nginx/sites-available/pioneeracademy.academy ICI]
```

**Si NON**, quel serveur web utilisez-vous ?
- [ ] Apache
- [ ] Caddy
- [ ] Autre: ________________

---

### 6. Variables d'environnement Firebase
**Question**: Avez-vous un fichier `.env` ou `.env.production` à la racine du projet ?
- [ ] Oui
- [ ] Non

**Si OUI**, copier le contenu ici (ATTENTION: masquer les clés sensibles avec `***`):
```bash
[COLLER VOTRE .env ICI EN MASQUANT LES VALEURS SENSIBLES]
Exemple:
VITE_PI_API_KEY=***********
VITE_PI_SANDBOX=true
VITE_USE_MOCK_AUTH=true
VITE_API_URL=https://***
VITE_GCV_VALUE=314.159
```

---

### 7. Script de déploiement
**Question**: Comment déployez-vous actuellement en production ?
- [ ] Script PowerShell (`deploy_production.ps1`)
- [ ] FTP manuel
- [ ] Git push (auto-deploy)
- [ ] Autre: ________________

**Si script PowerShell**, l'avez-vous exécuté depuis la dernière modification ?
- [ ] Oui, exécuté avec succès
- [ ] Oui, mais avec erreurs
- [ ] Non, pas encore

---

### 8. Test rapide local
**Question**: Avez-vous testé `npm run dev` en local récemment ?
- [ ] Oui, fonctionne parfaitement
- [ ] Oui, mais avec des bugs
- [ ] Non, pas testé

**Si bugs**, lesquels ?
```
[DÉCRIRE LES BUGS ICI]
```

---

## 🎯 DIAGNOSTIC AUTOMATIQUE PRÉLIMINAIRE

Basé sur les symptômes courants, voici les causes probables par ordre de probabilité :

### 🥇 CAUSE #1: Configuration Nginx (Routing SPA)
**Symptôme typique**:
- `/` (racine) fonctionne
- `/courses`, `/profile`, `/shop` → Erreur 404

**Solution attendue**:
Ajouter dans votre fichier Nginx:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Vérification**:
- [ ] J'ai vérifié ma config Nginx
- [ ] Cette ligne est présente
- [ ] Cette ligne est absente ← **PROBLÈME PROBABLE**

---

### 🥈 CAUSE #2: `base` incorrect dans vite.config.ts
**Symptôme typique**:
- Page blanche
- Erreurs 404 pour `index-xxxxx.js` et `index.css`

**Vérification actuelle** (vite.config.ts):
```typescript
// Actuellement ABSENT dans votre config
base: '/'
```

**Question**: L'application est-elle servie depuis :
- [ ] La racine du domaine (https://www.pioneeracademy.academy/)
- [ ] Un sous-dossier (https://www.pioneeracademy.academy/app/)

**Si sous-dossier**, il faut ajouter:
```typescript
export default defineConfig({
    base: '/app/',  // Ajuster selon votre chemin
    plugins: [react()],
    // ...
});
```

---

### 🥉 CAUSE #3: Variables Firebase non injectées
**Symptôme typique**:
- Page charge
- Erreur console: `import.meta.env.VITE_XXX is undefined`

**Vérification**:
1. Ouvrir F12 → Console
2. Chercher erreurs mentionnant `import.meta.env`
3. Si présentes → Variables non définies en production

**Solution**: Créer `.env.production` avec toutes les variables requises

---

## 📝 RÉPONSE RAPIDE (TEMPLATE)

**Merci de copier ce template et de remplir les réponses**:

```
1. Hébergement: [VPS/Netlify/Vercel/Autre]
2. Symptôme: [Écran blanc/404/503/Erreur JS]
3. Erreurs console:
   [Coller ici]
4. Fichiers 404:
   [Coller ici]
5. Nginx: [Oui/Non] 
   Config:
   [Coller ici si applicable]
6. Variables .env: [Oui/Non]
   [Masquer valeurs sensibles]
7. Script déploiement: [PowerShell/FTP/Git/Autre]
8. Test local: [OK/Bugs/Pas testé]
```

---

## 🚀 ACTIONS IMMÉDIATES (Pendant que vous répondez)

### Ce que JE fais maintenant :
1. ✅ **Build de production testé** → Succès (32.51s)
2. ✅ **Bug `discoveryContent.ts` corrigé** → Contenus de cours accessibles
3. ⏳ **En attente de vos réponses** pour diagnostic déploiement

### Ce que VOUS devez faire :
1. 📋 **Répondre aux 8 questions ci-dessus**
2. 🖥️ **Ouvrir www.pioneeracademy.academy dans un navigateur**
3. 🔍 **F12 → Console** et copier toutes les erreurs
4. 📸 **Screenshot optionnel** de la page d'erreur

---

## ⏱️ TEMPS ESTIMÉ

Une fois vos réponses reçues :
- ✅ Diagnostic précis : **5 minutes**
- ✅ Solution fournie : **10 minutes**
- ✅ Test de validation : **5 minutes**

**Total**: 20 minutes pour résoudre le problème de déploiement ! 🚀

---

**Dernière mise à jour**: 2026-01-07 13:45  
**Prochain step**: Attente réponses utilisateur
