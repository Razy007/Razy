/**
 * ============================================================================
 * EXEMPLE COURS ENRICHI - Pi Ecosystem Deep Dive
 * ============================================================================
 * Démonstration complète d'un cours avec vidéos, simulations, cas pratiques
 * ============================================================================
 */

import { 
  EnrichedCourse, 
  LayerContent, 
  ContentType, 
  DifficultyLevel,
  ContentStatus,
  VideoResource,
  InteractiveSimulation,
  CaseStudy,
  PracticeLab
} from '../domain/entities/CourseContent';

/**
 * EXEMPLE 1: Layer avec Vidéo Éducative
 */
export const piEcosystemIntroVideo: LayerContent = {
  layerId: 'pi-ecosystem-101-l1',
  courseId: 'pi-ecosystem-101',
  
  title: "L'Écosystème Pi Network: Vue d'Ensemble",
  description: "Découvrez l'architecture complète de l'écosystème Pi Network à travers une visite guidée vidéo avec le fondateur Dr. Nicolas Kokkalis",
  difficulty: DifficultyLevel.BEGINNER,
  estimatedDuration: 25,
  tags: ['pi-network', 'ecosystem', 'introduction', 'video'],
  
  contentType: ContentType.VIDEO,
  
  markdown: `
# L'Écosystème Pi Network: Une Révolution Blockchain

## 🎯 Objectifs d'Apprentissage

À la fin de cette leçon, vous serez capable de:
- Expliquer les 4 piliers de l'écosystème Pi Network
- Identifier les opportunités pour développeurs et entrepreneurs
- Comprendre le rôle des Pioneers dans la gouvernance
- Différencier Pi Network des autres cryptomonnaies

## 📹 Vidéo Principale (18 min)

*La vidéo ci-dessous présente une interview exclusive avec Dr. Nicolas Kokkalis, co-fondateur de Pi Network*

**Points clés abordés:**
- 00:00 - Introduction: Pourquoi Pi Network existe
- 02:30 - Les 3 phases du projet (Mining, Testnet, Mainnet)
- 06:15 - L'écosystème Pi: Apps, Utilities, Commerce
- 11:20 - KYC et sécurité: Protection de la communauté
- 15:45 - Vision 2026: 100 millions de Pioneers actifs

## 🏗️ Les 4 Piliers de Pi Network

### 1️⃣ Pi Blockchain (Stellar Consensus Protocol)
- **Énergétiquement efficace**: Pas de minage intensif (≠ Bitcoin)
- **3-5 secondes** par transaction (≠ Ethereum 15 sec)
- **Frais quasi-nuls**: ~0.00001 π par transaction

### 2️⃣ Pi Browser
Navigateur dédié permettant:
- Accès sécurisé aux Pi Apps
- Portefeuille intégré (non-custodial)
- Authentification biométrique

### 3️⃣ Pi SDK
Outils pour développeurs:
\`\`\`javascript
// Exemple: Initier un paiement Pi
Pi.authenticate().then(user => {
  Pi.createPayment({
    amount: 0.5,
    memo: "Purchase: Premium Course",
    metadata: { courseId: "pi-dev-201" }
  });
});
\`\`\`

### 4️⃣ Pi Marketplace
Écosystème économique réel:
- 100,000+ marchands enregistrés (Janvier 2026)
- Catégories: Éducation, E-commerce, Services, Jeux
- Exemples: Pioneer Academy, Pi Mall, Pi Games

## 💡 Cas d'Usage Réels

**Éducation:** Pioneer Academy (ce cours), Pi Learn
**Commerce:** Pi Shop (électronique), Pi Fashion
**Finance:** Pi Wallet, Pi Exchange (Q2 2026)
**Développement:** 50,000+ Pi Apps en développement

## 📊 Métriques Actuelles (Janvier 2026)

| Métrique | Valeur |
|----------|--------|
| Pioneers Enregistrés | 47 millions |
| KYC Validés | 12 millions |
| Transactions Mainnet | 2.5 milliards |
| Pi Apps Actives | 8,400 |
| Pays Présents | 180+ |

## 🎓 Points à Retenir

1. **Pi Network ≠ Bitcoin/Ethereum** → Mobile-first, accessible, éco-responsable
2. **Écosystème complet** → Pas seulement une crypto, mais une économie
3. **Gouvernance communautaire** → Les Pioneers décident via votes
4. **Développement ouvert** → SDK gratuit, documentation complète

## 📚 Ressources Complémentaires

- [Whitepaper Pi Network (2024)](https://minepi.com/white-paper)
- [Documentation Pi SDK](https://developers.minepi.com)
- [Pi Network Roadmap 2026](https://minepi.com/roadmap)
- [Community Forum](https://community.minepi.com)

---

**⚡ Conseil Pro:** Installez Pi Browser dès maintenant pour explorer l'écosystème en temps réel pendant le cours.
  `,
  
  video: {
    provider: 'vimeo',
    videoId: 'pi-ecosystem-overview-2026',
    url: 'https://player.vimeo.com/video/xxxxxxxxx',
    duration: 1080, // 18 minutes
    thumbnail: 'https://cdn.pioneeracademy.academy/thumbnails/pi-ecosystem-intro.jpg',
    subtitles: [
      { language: 'en', url: 'https://cdn.pioneeracademy.academy/subtitles/pi-ecosystem-en.vtt' },
      { language: 'fr', url: 'https://cdn.pioneeracademy.academy/subtitles/pi-ecosystem-fr.vtt' },
      { language: 'es', url: 'https://cdn.pioneeracademy.academy/subtitles/pi-ecosystem-es.vtt' }
    ],
    chapters: [
      { time: 0, title: "Introduction", description: "Pourquoi Pi Network existe" },
      { time: 150, title: "Les 3 Phases", description: "Mining → Testnet → Mainnet" },
      { time: 375, title: "L'Écosystème", description: "Apps, Utilities, Commerce" },
      { time: 680, title: "KYC et Sécurité", description: "Protection des Pioneers" },
      { time: 945, title: "Vision 2026", description: "Objectif 100M utilisateurs actifs" }
    ],
    quality: ['480p', '720p', '1080p'],
    transcription: 'Transcription complète disponible pour accessibilité...'
  },
  
  attachments: [
    {
      type: 'pdf',
      title: 'Pi Ecosystem Infographic 2026',
      url: 'https://cdn.pioneeracademy.academy/resources/pi-ecosystem-infographic.pdf',
      sizeInBytes: 2457600 // 2.4 MB
    },
    {
      type: 'cheatsheet',
      title: 'Pi Network Quick Reference Card',
      url: 'https://cdn.pioneeracademy.academy/resources/pi-quick-reference.pdf',
      sizeInBytes: 512000
    }
  ],
  
  quizId: 'quiz-pi-ecosystem-basics',
  quizRequired: true,
  
  xpReward: 100,
  energyCost: 0,
  
  status: ContentStatus.PUBLISHED,
  publishedAt: new Date('2026-01-10'),
  lastUpdated: new Date('2026-01-14'),
  version: '2.1.0',
  author: {
    name: 'Dr. Sarah Mitchell',
    role: 'Lead Blockchain Educator'
  },
  
  viewCount: 15420,
  completionRate: 0.87,
  averageRating: 4.8
};

/**
 * EXEMPLE 2: Layer avec Simulation Interactive
 */
export const piWalletSimulation: LayerContent = {
  layerId: 'pi-wallet-101-l3',
  courseId: 'pi-wallet-101',
  
  title: "Simulation: Créer et Sécuriser Votre Premier Wallet Pi",
  description: "Pratiquez la création d'un wallet Pi dans un environnement sandbox sécurisé avec feedback en temps réel",
  difficulty: DifficultyLevel.INTERMEDIATE,
  estimatedDuration: 40,
  tags: ['pi-wallet', 'security', 'hands-on', 'interactive'],
  
  contentType: ContentType.INTERACTIVE_SIMULATION,
  
  markdown: `
# Pratique: Créer Votre Wallet Pi en Toute Sécurité

## 🎮 Mode Simulation Interactive

Cette leçon utilise un **environnement sandbox réaliste** où vous allez:
1. Créer un wallet Pi de test
2. Générer et sauvegarder une passphrase sécurisée
3. Effectuer votre première transaction test
4. Activer l'authentification à 2 facteurs

**⚠️ Important:** Tout se passe dans un environnement de test. Aucun vrai Pi ne sera utilisé.

## 🛡️ Checklist de Sécurité

Avant de commencer, assurez-vous:
- [ ] Vous êtes seul(e) devant votre écran
- [ ] Aucune caméra ne filme votre écran
- [ ] Vous avez 40 minutes sans interruption
- [ ] Vous avez un stylo et papier pour noter la passphrase (simulation)

## 📝 Étapes de la Simulation

### Étape 1: Génération Passphrase (12 mots)
Le simulateur va générer une passphrase de 12 mots. 

**Dans la vraie vie:**
- ✅ Écrivez TOUJOURS à la main sur papier
- ✅ Vérifiez 3 fois l'orthographe
- ✅ Stockez dans un coffre ou lieu sûr
- ❌ JAMAIS de screenshot
- ❌ JAMAIS dans un fichier texte
- ❌ JAMAIS par email/message

### Étape 2: Vérification Passphrase
Vous devrez saisir 3 mots aléatoires de votre passphrase pour valider que vous l'avez bien notée.

### Étape 3: Transaction Test
Envoi de 0.1 π de test vers une adresse Pi fictive.

**Points d'attention:**
- Vérifier l'adresse destinataire (copier/coller, jamais taper)
- Valider les frais (toujours < 0.00001 π)
- Confirmer via biométrie ou PIN

### Étape 4: Activation 2FA
Configuration authentification à 2 facteurs avec Google Authenticator (simulé)

## 🎯 Critères de Réussite

Pour valider cette simulation, vous devez:
- ✅ Score ≥ 80% de sécurité
- ✅ Zéro erreur critique (ex: screenshot passphrase)
- ✅ Transaction test réussie en < 10 secondes
- ✅ 2FA activé correctement

## 🚨 Erreurs Courantes à Éviter

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| Passphrase copiée digitalement | Risque de hack | Écrire à la main uniquement |
| Mauvaise adresse destinataire | Perte de fonds | Toujours vérifier 2x |
| 2FA désactivé | Vulnérabilité compte | Activer dès le jour 1 |
| Partage de screen pendant setup | Exposition passphrase | Travailler seul |

---

**🎮 Cliquez sur "Lancer la Simulation" ci-dessous pour commencer**
  `,
  
  simulation: {
    type: 'pi-wallet-practice',
    iframeUrl: 'https://sim.pioneeracademy.academy/wallet-sandbox',
    interactionPoints: [
      {
        id: 'passphrase-generated',
        label: 'Passphrase générée',
        action: 'generate_passphrase',
        feedback: '✅ Passphrase de 12 mots générée. Notez-la sur papier (simulation).'
      },
      {
        id: 'passphrase-verified',
        label: 'Passphrase vérifiée',
        action: 'verify_passphrase',
        feedback: '✅ Vérification réussie! Vous avez correctement mémorisé votre passphrase.'
      },
      {
        id: 'transaction-sent',
        label: 'Transaction envoyée',
        action: 'send_test_transaction',
        feedback: '✅ Transaction confirmée en 4.2 secondes. Frais: 0.000005 π'
      },
      {
        id: '2fa-enabled',
        label: '2FA activé',
        action: 'enable_2fa',
        feedback: '✅ Authentification à 2 facteurs activée. Votre compte est maintenant ultra-sécurisé!'
      }
    ],
    successCriteria: {
      minScore: 80,
      requiredActions: [
        'generate_passphrase',
        'verify_passphrase',
        'send_test_transaction',
        'enable_2fa'
      ]
    },
    hints: [
      "Conseil 1: La passphrase est TOUJOURS 12 mots dans l'ordre exact",
      "Conseil 2: Avant d'envoyer, vérifiez que l'adresse commence par 'G' (format Stellar)",
      "Conseil 3: Le code 2FA change toutes les 30 secondes"
    ]
  },
  
  attachments: [
    {
      type: 'worksheet',
      title: 'Wallet Security Checklist (PDF)',
      url: 'https://cdn.pioneeracademy.academy/resources/wallet-security-checklist.pdf',
      sizeInBytes: 348160
    }
  ],
  
  quizId: 'quiz-wallet-security-advanced',
  quizRequired: true,
  
  xpReward: 150,
  energyCost: 20,
  unlockConditions: ['pi-wallet-101-l1', 'pi-wallet-101-l2'],
  
  status: ContentStatus.PUBLISHED,
  publishedAt: new Date('2026-01-12'),
  lastUpdated: new Date('2026-01-14'),
  version: '1.3.0',
  author: {
    name: 'Marcus Chen',
    role: 'Cybersecurity Instructor'
  },
  
  viewCount: 8932,
  completionRate: 0.76,
  averageRating: 4.9
};

/**
 * EXEMPLE 3: Layer avec Cas Pratique Réel
 */
export const piDappCaseStudy: LayerContent = {
  layerId: 'pi-dapp-dev-201-l5',
  courseId: 'pi-dapp-dev-201',
  
  title: "Cas Pratique: Lancement de 'Pi Coffee' - De l'Idée aux 10,000 Utilisateurs",
  description: "Analysez le parcours réel d'une Pi App à succès, de la conception au lancement, avec données financières et métriques d'engagement",
  difficulty: DifficultyLevel.ADVANCED,
  estimatedDuration: 60,
  tags: ['case-study', 'dapp', 'entrepreneurship', 'real-world'],
  
  contentType: ContentType.CASE_STUDY,
  
  markdown: `
# Cas Pratique: Pi Coffee - Révolutionner le Café avec Pi Network

## 📖 Contexte du Cas

**Entreprise:** Pi Coffee Ltd.  
**Fondateur:** Maria Santos, 34 ans, développeuse web et passionnée de café  
**Date Lancement:** Septembre 2025  
**Résultats (3 mois):** 10,247 utilisateurs actifs, 47,300 transactions, 2,150 π de volume

## 🎯 Le Défi

Maria possède 3 cafés à Lisbonne. En août 2025, elle constate:
- ❌ 60% des clients paient en carte bancaire (frais 2.5%)
- ❌ Programme fidélité papier inefficace (taux participation 12%)
- ❌ Aucune donnée client exploitable
- ❌ Jeunes clients (18-35 ans) veulent paiement mobile

**Objectif:** Créer une Pi App permettant:
1. Paiement Pi sans frais
2. Programme fidélité automatique
3. Commande anticipée (click & collect)
4. Recommandations personnalisées

## 🛠️ Solution Implémentée

### Architecture Technique
\`\`\`
Frontend (React Native)
  ↓
Pi SDK Authentication
  ↓
Backend Node.js + PostgreSQL
  ↓
Pi Blockchain (Mainnet)
\`\`\`

### Fonctionnalités Clés

**1. Paiement Pi**
- Scan QR code au comptoir
- Confirmation instantanée (3-4 sec)
- Reçu digital automatique

**2. Fidélité Gamifiée**
- 1 π dépensé = 10 points
- Paliers: Bronze (100 pts) → Silver (500) → Gold (2000)
- Récompenses: Café gratuit, réductions, early access nouvelles boissons

**3. Précommande**
- Commande via app 10-30 min avant arrivée
- Notification quand prêt
- Skip la file d'attente

**4. Recommandations IA**
- Analyse historique commandes
- Suggestions basées météo et heure
- "Les clients comme vous aiment..."

## 📊 Résultats Après 3 Mois

### Métriques Business

| Métrique | Avant | Après | Δ |
|----------|-------|-------|---|
| Transactions/jour | 450 | 680 | +51% |
| Panier moyen | €4.20 | €5.80 | +38% |
| Frais bancaires/mois | €1,250 | €320 | -74% |
| Fidélité active | 12% | 64% | +433% |
| Temps attente moyen | 8 min | 4 min | -50% |

### Métriques Techniques

- **Utilisateurs Actifs:** 10,247 (sur 15,000 téléchargements)
- **Transactions Pi:** 47,300 (avg 520/jour)
- **Volume:** 2,150 π (~$4,500 à 2.09 π/USD)
- **Uptime:** 99.7%
- **Temps réponse API:** 180ms (p95)

### Impact Financier

**Coûts Développement:**
- Développeur freelance: 8,000 €
- Design UI/UX: 2,500 €
- Serveur (3 mois): 450 €
- **Total:** 10,950 €

**Économies:**
- Frais bancaires: 930 €/mois × 3 = 2,790 €
- **ROI:** 25% en 3 mois

**Revenus Additionnels:**
- Augmentation transactions: +230/jour × 5.80€ × 90 jours = 120,420 €
- Marge 40%: **48,168 € de profit supplémentaire**

## 🤔 Questions à Analyser

Répondez aux questions suivantes (évaluées par pairs):

### Question 1: Stratégie de Lancement
Maria a lancé avec ces 3 tactiques:
a) Promotion: "Payez en Pi, obtenez 20% de réduction" (2 premières semaines)
b) Influenceurs locaux: 5 créateurs de contenu invités (budget 500 π)
c) Événement: "Pi Coffee Day" avec démos en magasin

**Votre mission:**
- Quelle tactique a probablement généré le plus d'inscriptions? Justifiez.
- Proposez 2 autres tactiques marketing pour accélérer l'adoption.

### Question 2: Challenge Technique
En Semaine 3, l'app crash 47 fois en 24h. Logs montrent:
\`\`\`
Error: Pi.authenticate() timeout after 30s
Occurs when: User has slow internet (<1 Mbps)
Frequency: 12% of authentication attempts
\`\`\`

**Votre mission:**
- Identifiez 3 causes possibles
- Proposez une solution technique (code accepté)
- Comment prévenir ce problème à l'avenir?

### Question 3: Scalabilité
Maria veut passer de 3 cafés à 50 cafés (franchise) d'ici 12 mois.

**Défis anticipés:**
- Backend actuel: 1 serveur VPS (4 vCPU, 8GB RAM)
- Base de données: PostgreSQL single instance
- Pas de CDN pour images menus

**Votre mission:**
- Proposez architecture scalable (diagramme accepté)
- Estimez coûts infrastructure à 50 cafés
- Identifiez 3 risques techniques majeurs

## 💡 Leçons Clés

### ✅ Ce qui a marché
1. **Onboarding fluide:** Inscription en < 60 secondes
2. **Valeur immédiate:** Réduction dès 1ère utilisation
3. **Gamification:** Points fidélité = engagement +180%
4. **Testimonials:** Clients satisfaits = meilleur marketing

### ❌ Erreurs à éviter
1. **Complexité initiale:** Version 1.0 avait 12 features → réduit à 4 core features
2. **Support client:** Sous-estimé volume questions (solution: FAQ + chatbot)
3. **Tests Pi Browser:** Développé sur desktop d'abord → bugs mobiles

## 🎓 Ressources Complémentaires

- [Interview Maria Santos (Podcast, 45 min)](https://podcast.pioneeracademy.academy/maria-santos)
- [Code Source Pi Coffee (GitHub)](https://github.com/pi-coffee/pi-coffee-app)
- [Pi Coffee Business Plan (PDF)](https://cdn.pioneeracademy.academy/case-studies/pi-coffee-business-plan.pdf)

---

**📝 Soumettez vos réponses aux 3 questions pour valider ce module**
  `,
  
  caseStudy: {
    title: "Pi Coffee: De 3 Cafés à 10,000 Utilisateurs en 3 Mois",
    scenario: "Maria Santos, développeuse et propriétaire de cafés, lance une Pi App pour accepter paiements Pi et gérer fidélité. Analysez sa stratégie, résolvez ses challenges techniques, et proposez une architecture scalable.",
    context: {
      industry: 'Food & Beverage',
      protagonist: 'Maria Santos, 34 ans, développeuse full-stack',
      challenge: 'Réduire frais bancaires, augmenter fidélité, moderniser expérience client',
      constraints: [
        'Budget développement: 10,000 €',
        'Délai lancement: 6 semaines',
        'Équipe: Maria + 1 designer freelance',
        'Infrastructure: Shared hosting initial'
      ]
    },
    challenges: [
      {
        id: 'marketing-strategy',
        question: 'Quelle tactique marketing a probablement généré le plus d\'inscriptions initiales?',
        type: 'multiple-choice',
        options: [
          'Promotion 20% réduction (2 semaines)',
          'Influenceurs locaux (5 créateurs)',
          'Événement "Pi Coffee Day" en magasin',
          'Toutes également efficaces'
        ],
        correctAnswer: 'Promotion 20% réduction (2 semaines)',
        explanation: 'Les données montrent un spike de 4,200 inscriptions durant les 2 premières semaines, coïncidant avec la promotion. Influenceurs ont généré +1,800 inscriptions, événement +900. La réduction immédiate crée une urgence et récompense instantanée, moteur clé d\'adoption early-stage.',
        resources: [
          'Growth Hacking for Pi Apps: https://developers.minepi.com/growth-guide',
          'Case Study: Promotion Strategies That Work'
        ]
      },
      {
        id: 'technical-challenge',
        question: 'Proposez une solution pour résoudre les timeouts Pi.authenticate() avec connexions lentes',
        type: 'code-challenge',
        correctAnswer: `
// Solution: Retry avec exponential backoff + offline mode
async function authenticateWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      // Augmenter timeout progressivement
      const timeout = 30000 + (i * 15000); // 30s, 45s, 60s
      
      const user = await Promise.race([
        Pi.authenticate(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        )
      ]);
      
      return user;
    } catch (error) {
      if (i === maxRetries - 1) {
        // Fallback: Mode offline avec sync différé
        return enableOfflineMode();
      }
      // Attendre avant retry
      await new Promise(r => setTimeout(r, 2000 * (i + 1)));
    }
  }
}

function enableOfflineMode() {
  // Permettre navigation avec sync ultérieure
  return {
    uid: 'offline_' + Date.now(),
    offline: true,
    syncOnReconnect: true
  };
}
        `,
        explanation: 'La solution implémente un retry mechanism avec exponential backoff et fallback vers mode offline. Ceci améliore UX pour utilisateurs avec connexion instable (fréquent dans certains pays) tout en garantissant sync ultérieure.',
        resources: [
          'Pi SDK Best Practices: Error Handling',
          'Offline-First Architecture Guide'
        ]
      },
      {
        id: 'scalability-architecture',
        question: 'Concevez une architecture scalable pour 50 cafés (estimé 150,000 transactions/jour)',
        type: 'open-ended',
        explanation: `
Architecture Recommandée:

**Frontend:**
- React Native app (iOS/Android)
- CDN Cloudflare pour assets statiques
- Progressive Web App (PWA) fallback

**Backend:**
- Kubernetes cluster (3 nodes minimum)
- Load Balancer (NGINX ou AWS ALB)
- Microservices: Auth, Payments, Loyalty, Orders
- Redis cluster pour cache + session
- Message Queue (RabbitMQ) pour async tasks

**Database:**
- PostgreSQL primary-replica setup (1 master, 2 read replicas)
- MongoDB pour analytics/logs
- Backup automatique quotidien

**Pi Blockchain:**
- Multiple Pi SDK instances (load balancing)
- Webhook handlers pour confirmations transactions

**Monitoring:**
- Prometheus + Grafana
- Sentry pour error tracking
- CloudWatch ou Datadog

**Coûts Estimés (50 cafés, 150k tx/jour):**
- Kubernetes cluster: $800/mois
- Database (managed): $400/mois
- CDN: $150/mois
- Monitoring: $200/mois
- **Total: ~$1,550/mois**

**Risques:**
1. Pi SDK rate limiting (solution: request pooling)
2. Database write bottleneck (solution: sharding par région)
3. Single point of failure (solution: multi-region deployment)
        `,
        resources: [
          'Kubernetes for Pi Apps',
          'Scaling PostgreSQL: The Definitive Guide',
          'AWS vs Google Cloud vs Azure for Blockchain Apps'
        ]
      }
    ],
    realWorldExample: {
      company: 'Pi Coffee (Lisbonne, Portugal)',
      outcome: '10,247 utilisateurs actifs, 47,300 transactions, 2,150 π volume en 3 mois',
      metrics: {
        'ROI': '25% en 3 mois',
        'Réduction frais': '74%',
        'Engagement fidélité': '+433%',
        'Temps attente': '-50%'
      }
    }
  },
  
  attachments: [
    {
      type: 'pdf',
      title: 'Pi Coffee Business Plan Complet',
      url: 'https://cdn.pioneeracademy.academy/case-studies/pi-coffee-business-plan.pdf',
      sizeInBytes: 3145728 // 3 MB
    },
    {
      type: 'slide',
      title: 'Architecture Diagram (High-Res)',
      url: 'https://cdn.pioneeracademy.academy/case-studies/pi-coffee-architecture.png',
      sizeInBytes: 1048576
    }
  ],
  
  quizId: 'quiz-dapp-case-study-evaluation',
  quizRequired: true,
  
  xpReward: 250,
  energyCost: 30,
  unlockConditions: ['pi-dapp-dev-201-l1', 'pi-dapp-dev-201-l2', 'pi-dapp-dev-201-l3', 'pi-dapp-dev-201-l4'],
  
  status: ContentStatus.PUBLISHED,
  publishedAt: new Date('2026-01-13'),
  lastUpdated: new Date('2026-01-14'),
  version: '1.0.0',
  author: {
    name: 'Alex Rodriguez',
    role: 'Entrepreneur-in-Residence'
  },
  
  viewCount: 3421,
  completionRate: 0.68,
  averageRating: 4.95
};

/**
 * EXEMPLE 4: Course Complet "Pi Ecosystem Mastery"
 */
export const piEcosystemMasteryCourse = new EnrichedCourse(
  'pi-ecosystem-mastery-2026',
  'Pi Ecosystem Mastery: De Pioneer à Builder',
  'Formation complète pour maîtriser l\'écosystème Pi Network et créer votre première Pi App profitable. Vidéos HD, simulations interactives, projets réels, et mentorat communautaire.',
  'Blockchain Development',
  DifficultyLevel.INTERMEDIATE,
  42, // 42 heures estimées
  'https://cdn.pioneeracademy.academy/courses/pi-ecosystem-mastery-thumb.jpg',
  [
    {
      name: 'Dr. Sarah Mitchell',
      title: 'Lead Blockchain Educator',
      avatar: 'https://cdn.pioneeracademy.academy/instructors/sarah-mitchell.jpg',
      bio: 'PhD Computer Science MIT, Core Team Advisor Pi Network, 10+ ans blockchain'
    },
    {
      name: 'Marcus Chen',
      title: 'Cybersecurity Expert',
      avatar: 'https://cdn.pioneeracademy.academy/instructors/marcus-chen.jpg',
      bio: 'Ex-Google Security, CISSP, spécialiste wallet security'
    },
    {
      name: 'Alex Rodriguez',
      title: 'Entrepreneur-in-Residence',
      avatar: 'https://cdn.pioneeracademy.academy/instructors/alex-rodriguez.jpg',
      bio: 'Fondateur 3 Pi Apps à succès, Total 50k+ utilisateurs'
    }
  ],
  [
    {
      moduleId: 'module-1-foundations',
      title: 'Module 1: Fondations Pi Network',
      description: 'Comprendre l\'écosystème, vision, et opportunités',
      layerIds: [
        'pi-ecosystem-101-l1',
        'pi-ecosystem-101-l2',
        'pi-ecosystem-101-l3',
        'pi-ecosystem-101-l4'
      ]
    },
    {
      moduleId: 'module-2-wallet-security',
      title: 'Module 2: Sécurité Wallet & Transactions',
      description: 'Maîtriser la sécurité de votre wallet et transactions',
      layerIds: [
        'pi-wallet-101-l1',
        'pi-wallet-101-l2',
        'pi-wallet-101-l3', // Simulation interactive
        'pi-wallet-101-l4'
      ]
    },
    {
      moduleId: 'module-3-pi-sdk',
      title: 'Module 3: Développement avec Pi SDK',
      description: 'Créer votre première Pi App from scratch',
      layerIds: [
        'pi-sdk-101-l1',
        'pi-sdk-101-l2',
        'pi-sdk-101-l3',
        'pi-sdk-101-l4',
        'pi-sdk-101-l5'
      ]
    },
    {
      moduleId: 'module-4-dapp-development',
      title: 'Module 4: DApp Development Avancé',
      description: 'Smart contracts, backend, scaling',
      layerIds: [
        'pi-dapp-dev-201-l1',
        'pi-dapp-dev-201-l2',
        'pi-dapp-dev-201-l3',
        'pi-dapp-dev-201-l4',
        'pi-dapp-dev-201-l5' // Case Study Pi Coffee
      ]
    },
    {
      moduleId: 'module-5-launch-monetize',
      title: 'Module 5: Lancement & Monétisation',
      description: 'Stratégies marketing, growth hacking, compliance',
      layerIds: [
        'pi-launch-301-l1',
        'pi-launch-301-l2',
        'pi-launch-301-l3',
        'pi-launch-301-l4'
      ]
    },
    {
      moduleId: 'module-6-capstone',
      title: 'Module 6: Projet Final',
      description: 'Créez et déployez votre Pi App en production',
      layerIds: [
        'pi-capstone-l1',
        'pi-capstone-l2',
        'pi-capstone-l3'
      ]
    }
  ],
  [
    'Comprendre l\'architecture complète de l\'écosystème Pi Network',
    'Créer et sécuriser un wallet Pi avec best practices industrie',
    'Développer une Pi App full-stack avec Pi SDK',
    'Implémenter paiements Pi et transactions on-chain',
    'Déployer une DApp en production avec scalabilité',
    'Lancer une Pi App avec stratégies marketing éprouvées',
    'Respecter les guidelines Pi Network et obtenir approbation',
    'Monétiser votre Pi App de manière éthique et durable'
  ],
  [
    'Connaissance de base JavaScript (variables, fonctions, async/await)',
    'Compréhension HTML/CSS (React un plus mais pas obligatoire)',
    'Compte Pi Network actif (KYC recommandé)',
    'Ordinateur avec 8GB RAM minimum',
    'Motivation à apprendre et construire'
  ],
  [
    'Développeurs web souhaitant entrer dans blockchain',
    'Entrepreneurs voulant créer une Pi App',
    'Pioneers actifs cherchant à contribuer à l\'écosystème',
    'Product Managers explorant opportunités Pi Network',
    'Étudiants en informatique/entrepreneuriat'
  ],
  true, // Certification disponible
  ['pi-network', 'blockchain', 'dapp-development', 'pi-sdk', 'entrepreneurship', 'web3'],
  ContentStatus.PUBLISHED,
  'https://cdn.pioneeracademy.academy/courses/pi-ecosystem-mastery-banner.jpg', // bannerImage maintenant ici
  new Date('2026-01-10'),
  2847, // Enrollments
  4.85, // Rating
  412, // Reviews
  // Ajout explicite des layers pour que le cours ne soit pas vide
  [
    piEcosystemIntroVideo,
    piWalletSimulation,
    piDappCaseStudy
  ]
);

// Export pour utilisation dans le backend
export const enrichedCourseExamples = {
  piEcosystemIntroVideo,
  piWalletSimulation,
  piDappCaseStudy,
  piEcosystemMasteryCourse
};
