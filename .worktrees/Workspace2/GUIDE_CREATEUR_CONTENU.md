# 🎬 GUIDE RAPIDE CRÉATEUR DE CONTENU - Pioneer Academy

## 🎯 Mission
Créer des cours **mémorables** qui transforment des Pioneers curieux en **builders compétents**.

---

## ⚡ Checklist Rapide: Créer un Layer en 2h

### Phase 1: Préparation (20 min)
- [ ] Définir 3-5 objectifs d'apprentissage précis (verbes d'action: "créer", "expliquer", "implémenter")
- [ ] Choisir le type de contenu approprié (vidéo? simulation? cas pratique?)
- [ ] Vérifier prérequis utilisateur (niveau, cours précédents)
- [ ] Créer outline en bullet points

### Phase 2: Production Contenu (60 min)
- [ ] Rédiger markdown principal (intro + théorie + exemples)
- [ ] Intégrer médias riches:
  - **Vidéo:** Upload sur Vimeo → Copier embed code
  - **Simulation:** Créer iframe sandbox → Tester interactions
  - **Code:** Préparer starter code + solution + tests
- [ ] Ajouter ressources téléchargeables (PDF, cheatsheet)
- [ ] Rédiger 5-10 questions quiz (mix multiple-choice + open-ended)

### Phase 3: Review & Polish (30 min)
- [ ] Relire orthographe/grammaire (Grammarly ou LanguageTool)
- [ ] Vérifier tous liens fonctionnels
- [ ] Tester vidéo playback (subtitles OK?)
- [ ] Valider durée estimée réaliste
- [ ] Vérifier conformité Pi Network (pas de prix USD, pas de promesses gains)

### Phase 4: Publication (10 min)
- [ ] Upload dans Strapi CMS
- [ ] Preview dans staging
- [ ] Publish to production
- [ ] Vérifier sync backend (check logs)

---

## 🎨 Templates Prêts à l'Emploi

### Template 1: Layer Vidéo Standard

```markdown
# [Titre Accrocheur: Max 60 caractères]

## 🎯 Objectifs d'Apprentissage
À la fin de cette leçon, vous serez capable de:
- [Verbe d'action] + [compétence mesurable]
- [Verbe d'action] + [compétence mesurable]
- [Verbe d'action] + [compétence mesurable]

## 📹 Vidéo Principale ([XX] min)

**Points clés abordés:**
- 00:00 - [Chapitre 1]
- [XX:XX] - [Chapitre 2]
- [XX:XX] - [Chapitre 3]

[Embed vidéo via CMS]

## 📚 Résumé du Contenu

### [Concept 1]
[Explication concise avec exemple concret]

**Exemple:**
\`\`\`javascript
// Code exemple bien commenté
const example = "clear and simple";
\`\`\`

### [Concept 2]
[Explication]

**Cas d'usage réel:**
- Situation X → Solution Y
- Situation Z → Solution W

## 💡 Points Clés à Retenir

1. **[Point 1]:** [En une phrase]
2. **[Point 2]:** [En une phrase]
3. **[Point 3]:** [En une phrase]

## ⚠️ Erreurs Courantes à Éviter

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| [Erreur 1] | [Impact] | [Fix] |
| [Erreur 2] | [Impact] | [Fix] |

## 📚 Pour Aller Plus Loin

- [Ressource 1 - Titre](URL)
- [Ressource 2 - Titre](URL)
- [Documentation Officielle](URL)

---

**Temps Estimé:** [XX] minutes  
**Niveau:** [Beginner/Intermediate/Advanced]  
**Prérequis:** [Layer X, Layer Y] ou "Aucun"
```

---

### Template 2: Layer Simulation Interactive

```markdown
# [Titre: Pratique Guidée - X]

## 🎮 Mode Simulation Interactive

Cette leçon utilise un **environnement sandbox sécurisé** où vous allez:
1. [Action 1]
2. [Action 2]
3. [Action 3]

**⚠️ Important:** Tout se passe en mode test. Aucun vrai Pi utilisé.

## 🛡️ Checklist de Sécurité
- [ ] Vous êtes seul(e) (pas de caméra)
- [ ] Vous avez [XX] minutes sans interruption
- [ ] [Autre prérequis si nécessaire]

## 📝 Étapes de la Simulation

### Étape 1: [Titre Étape]
[Instructions claires, numérotées]

**Dans la vraie vie:**
- ✅ [Best practice 1]
- ✅ [Best practice 2]
- ❌ JAMAIS [Anti-pattern 1]
- ❌ JAMAIS [Anti-pattern 2]

### Étape 2: [Titre Étape]
[Instructions]

**Points d'attention:**
- [Point important 1]
- [Point important 2]

### Étape 3: [Titre Étape]
[Instructions]

## 🎯 Critères de Réussite

Pour valider cette simulation, vous devez:
- ✅ Score ≥ 80%
- ✅ Zéro erreur critique
- ✅ [Critère spécifique 1]
- ✅ [Critère spécifique 2]

## 🚨 Erreurs Courantes

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| [Erreur 1] | [Impact] | [Fix détaillé] |

---

**🎮 Cliquez sur "Lancer la Simulation" ci-dessous**
```

---

### Template 3: Layer Cas Pratique

```markdown
# Cas Pratique: [Titre Entreprise/Projet Réel]

## 📖 Contexte du Cas

**Entreprise:** [Nom]  
**Fondateur:** [Nom, âge, background]  
**Contexte:** [Date/lieu]  
**Résultats:** [Métriques clés atteintes]

## 🎯 Le Défi

[Protagoniste] fait face à:
- ❌ [Problème 1]
- ❌ [Problème 2]
- ❌ [Problème 3]

**Objectif:** [But à atteindre]

**Contraintes:**
- Budget: [X]
- Délai: [Y]
- Équipe: [Z]
- [Autre contrainte]

## 🛠️ Solution Implémentée

### Architecture Technique
\`\`\`
[Diagramme ASCII ou description]
\`\`\`

### Fonctionnalités Clés
[Liste + explication]

## 📊 Résultats Après [Période]

### Métriques Business
| Métrique | Avant | Après | Δ |
|----------|-------|-------|---|
| [Métrique 1] | [X] | [Y] | [%] |
| [Métrique 2] | [X] | [Y] | [%] |

### Impact Financier
**Coûts:**
- [Poste 1]: [Montant]
- **Total:** [X]

**ROI:** [X]% en [période]

## 🤔 Questions à Analyser

### Question 1: [Titre Question]
[Énoncé détaillé]

**Votre mission:**
- [Tâche 1]
- [Tâche 2]

### Question 2: [Challenge Technique]
[Code snippet problématique ou scenario]

**Votre mission:**
- Identifier causes possibles
- Proposer solution (code accepté)

### Question 3: [Scalabilité/Stratégie]
[Scenario évolution]

**Votre mission:**
- Architecture proposée
- Estimation coûts
- Identification risques

## 💡 Leçons Clés

### ✅ Ce qui a marché
1. [Leçon 1 + pourquoi]
2. [Leçon 2 + pourquoi]

### ❌ Erreurs à éviter
1. [Erreur 1 + impact]
2. [Erreur 2 + impact]

---

**📝 Soumettez vos réponses pour validation**
```

---

## 🎥 Standards Vidéo

### Équipement Recommandé

**Budget Minimal ($100-300):**
- Webcam: Logitech C920 HD (1080p)
- Micro: Blue Snowball Ice (USB)
- Éclairage: Anneau LED 10" (~$30)
- Software: OBS Studio (gratuit)

**Budget Pro ($500-1500):**
- Caméra: Sony ZV-1 ou Canon M50
- Micro: Rode VideoMic NTG
- Éclairage: Kit Softbox 3 points
- Software: Adobe Premiere Pro

### Checklist Tournage

**Pre-Production:**
- [ ] Script écrit et répété
- [ ] Slides/Screenshare préparés
- [ ] Exemples de code testés
- [ ] Background propre et professionnel

**Production:**
- [ ] Éclairage: Visage bien éclairé, pas de contre-jour
- [ ] Audio: Test micro (pas d'écho, bruit minimal)
- [ ] Framing: Règle des tiers, espace au-dessus de la tête
- [ ] Enregistrer en 1080p 30fps minimum

**Post-Production:**
- [ ] Couper silences >3 secondes
- [ ] Ajouter intro/outro (max 5 secondes chaque)
- [ ] Normaliser audio à -14 LUFS
- [ ] Exporter MP4 H.264 (qualité High)

### Durées Recommandées

| Type Vidéo | Durée Idéale | Max |
|------------|--------------|-----|
| Introduction Concept | 5-10 min | 15 min |
| Tutorial Step-by-Step | 15-20 min | 30 min |
| Interview Expert | 10-15 min | 25 min |
| Case Study Analysis | 20-25 min | 40 min |

---

## 🧪 Standards Simulation Interactive

### Stack Technique

**Frontend Simulation:**
```bash
npm install react@18 react-dom@18
npm install @pi-network/sdk
npm install iframe-resizer
```

**Structure Fichiers:**
```
simulations/
├── pi-wallet-practice/
│   ├── index.html
│   ├── app.tsx (React component)
│   ├── sandbox.ts (Pi SDK sandbox mode)
│   └── styles.css
├── smart-contract-deploy/
└── transaction-flow/
```

**Sécurité Sandbox:**
```html
<iframe 
  src="https://sim.pioneeracademy.academy/wallet-practice"
  sandbox="allow-scripts allow-same-origin"
  style="width: 100%; height: 600px; border: none;"
/>
```

### Feedback Interactif

**Principes:**
1. **Immédiat:** Feedback < 100ms après action
2. **Visuel:** Couleurs (✅ vert, ❌ rouge, ⚠️ jaune)
3. **Contextuel:** Expliquer POURQUOI c'est correct/incorrect
4. **Progressif:** Hints disponibles après 2 tentatives échouées

**Exemple Code:**
```typescript
const handleUserAction = (action: string) => {
  const result = validateAction(action);
  
  if (result.success) {
    showFeedback({
      type: 'success',
      message: '✅ Excellent! ' + result.explanation,
      points: +10
    });
  } else {
    showFeedback({
      type: 'error',
      message: '❌ ' + result.error,
      hint: result.attempts > 2 ? getHint(action) : null
    });
  }
};
```

---

## 📊 Métriques Qualité Contenu

### KPIs à Tracker

| Métrique | Target | Action si < Target |
|----------|--------|--------------------|
| **Completion Rate** | >70% | Réduire durée ou améliorer engagement |
| **Average Rating** | >4.5/5 | Review contenu, gather feedback |
| **Quiz Pass Rate** | 60-80% | Ajuster difficulté quiz |
| **Rewatch Rate** | >15% | Bon signe (contenu référence) |
| **Time on Page** | ~80% durée estimée | Vérifier distractions ou longueur |

### A/B Testing

**Tester régulièrement:**
- Titres layers (CTR)
- Durées vidéos (completion rate)
- Types d'exemples (engagement)
- Format quiz (pass rate)

---

## ✅ Checklist Conformité Pi Network

Avant publication, vérifier:

- [ ] **Pas de prix USD** (uniquement π)
- [ ] **Pas de promesses financières** ("gagnez 100π/jour" interdit)
- [ ] **Pas de pay-to-win** (contenu premium OK si équilibré)
- [ ] **Données vérifiables** (case studies avec sources)
- [ ] **Respect copyright** (vidéos, images, musique sous licence)
- [ ] **Pas de contenu sensible** (politique, religion, contenu adulte)
- [ ] **Accessibilité** (sous-titres, alt text, transcriptions)

---

## 🚀 Publication Workflow

### Strapi CMS Upload

1. **Login:** https://cms.pioneeracademy.academy/admin
2. **Créer Layer:**
   - Content Manager → Layers → Create New Entry
   - Remplir tous champs obligatoires
   - Upload médias (vidéos → CDN d'abord, puis copier URL)
   - Status: "Draft" pour preview
3. **Preview:** Click "Preview" → Test dans staging
4. **Publish:** Change status "Published" → Save
5. **Vérifier Sync:** Check backend logs (auto-sync 5 min max)

### Vidéo Upload (Vimeo)

```bash
# Via Vimeo Web UI
1. Upload video (drag & drop)
2. Pendant upload: Ajouter titre, description, tags
3. Privacy: "Unlisted" ou "Public" (jamais "Private")
4. Sous-titres: Upload .vtt files (FR + EN minimum)
5. Copier Video ID depuis URL: vimeo.com/[VIDEO_ID]
6. Dans Strapi: Coller URL embed: https://player.vimeo.com/video/[VIDEO_ID]
```

---

## 📞 Support Créateurs

**Questions? Problèmes?**

- **Slack:** #content-creators channel
- **Email:** content@pioneeracademy.academy
- **Documentation:** https://docs.pioneeracademy.academy
- **Weekly Office Hours:** Mardi 14h-15h (visio)

---

**Bon courage et merci de contribuer à l'éducation des Pioneers! 🚀**

---

**Version:** 1.0.0  
**Dernière Mise à Jour:** 2026-01-14
