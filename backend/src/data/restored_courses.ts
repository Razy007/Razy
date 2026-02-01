
export const RESTORED_COURSES = [
  // ========================================================================
  // 1. PI NETWORK ESSENTIALS (Introduction)
  // ========================================================================
  {
    id: 'pi-intro-101',
    courseId: 'pi-intro-101',
    title: 'Introduction à Pi Network',
    description: 'Découvrez les fondamentaux de Pi Network et son écosystème unique.',
    category: 'Pi Basics',
    difficulty: 'beginner',
    totalXp: 300,
    estimatedHours: 1,
    thumbnail: 'https://cdn.pioneeracademy.academy/thumbnails/pi-intro.jpg',
    layers: [
      {
        id: 'pi-intro-l1',
        layerId: 'pi-intro-l1',
        type: 'discovery',
        contentType: 'discovery',
        title: "Découverte: Qu'est-ce que Pi Network?",
        description: 'Comprendre la vision et la mission de Pi Network',
        content: `### La Révolution Pi Network

Pi Network est la première cryptomonnaie que vous pouvez miner sur votre téléphone.

**Points Clés:**
- 🌍 **Accessible**: Pas besoin de matériel coûteux
- 🔋 **Économe**: Ne consomme pas votre batterie
- 👥 **Social**: Construit sur la confiance communautaire
- 🔒 **Sécurisé**: Utilise le Stellar Consensus Protocol (SCP)

**Vision:** Créer la crypto la plus accessible au monde.`,
        markdown: `### La Révolution Pi Network ... (Identique)`,
        xpReward: 50,
        energyCost: 0
      },
      {
        id: 'pi-intro-l2',
        layerId: 'pi-intro-l2',
        type: 'quiz',
        contentType: 'quiz',
        title: "Compréhension: Quiz Fondamentaux",
        description: 'Testez votre compréhension des bases de Pi',
        xpReward: 100,
        energyCost: 25,
        questions: [
            { id: 'q1', type: 'multiple-choice', question: "Qu'est-ce qui rend Pi Network unique?", options: ["Minage sur smartphone", "Minage GPU", "Proof of Work"], correct: 0, explanation: "Pi Network permet le minage sur smartphone sans consommer de ressources." },
            { id: 'q2', type: 'multiple-choice', question: "Quel est le consensus de Pi?", options: ["PoW", "PoS", "SCP (Stellar Consensus Protocol)"], correct: 2, explanation: "Pi utilise le Stellar Consensus Protocol." },
            { id: 'q3', type: 'multiple-choice', question: "Pourquoi le KYC est-il important?", options: ["Marketing", "1 Personne = 1 Compte", "Vendre des données"], correct: 1, explanation: "Pour assurer l'équité du réseau." }
        ]
      }
    ]
  },

  // ========================================================================
  // 2. WALLET MASTERY
  // ========================================================================
  {
    id: 'pi-wallet-101',
    courseId: 'pi-wallet-101',
    title: 'Devenez votre propre Banque',
    description: 'Mission Critique : Sécurisez votre fortune Pi. Ne perdez jamais votre Passphrase.',
    category: 'Essentials',
    difficulty: 'beginner',
    totalXp: 500,
    estimatedHours: 2,
    thumbnail: 'https://cdn.pioneeracademy.academy/thumbnails/pi-wallet.jpg',
    layers: [
      {
        id: 'wallet-l1-discovery',
        layerId: 'wallet-l1-discovery',
        type: 'discovery',
        contentType: 'discovery',
        title: "Découverte: Wallet Non-Custodial",
        description: 'Pi Wallet vs Banque',
        content: `### Vos Clés, Votre Crypto
Pi Wallet est **non-custodial**. SEUL VOUS avez accès à vos Pi.

**Composants Clés:**
- **Public Key**: Votre adresse pour recevoir (commence par G...).
- **Passphrase**: 24 mots secrets. **NE JAMAIS PARTAGER.**

⚠️ Si vous perdez votre Passphrase, vous perdez tout.`,
        xpReward: 50,
        energyCost: 0
      },
      {
        id: 'wallet-l3-lab',
        layerId: 'wallet-l3-lab',
        type: 'interactive_simulation', 
        contentType: 'interactive_simulation',
        title: 'Simulation: Backup Sécurisé',
        description: 'Mise en pratique de la sauvegarde de passphrase',
        xpReward: 300,
        energyCost: 100,
        interactiveData: {
            initialState: "### Mission: Sécuriser votre Fortune\n\nVous venez de générer votre nouveau Pi Wallet. Votre passphrase de 24 mots s'affiche à l'écran. Que faites-vous pour la sauvegarder de manière optimale ?",
            winningCondition: ['act-2'],
            actions: [
                {
                    id: 'act-1',
                    label: 'Prendre un Screenshot',
                    energyCost: 5,
                    feedback: "⚠️ Risque élevé ! Si votre téléphone est piraté ou synchronisé sur le cloud, votre passphrase est exposée.",
                    feedbackType: 'warning'
                },
                {
                    id: 'act-2',
                    label: 'Copier sur Papier (x2)',
                    energyCost: 10,
                    feedback: "✅ Excellent ! C'est la méthode 'Cold Storage' la plus sûre. Gardez les deux copies dans des lieux physiques différents.",
                    feedbackType: 'positive',
                    consequence: { xpChange: 100 }
                },
                {
                    id: 'act-3',
                    label: 'Envoyer par Email',
                    energyCost: 5,
                    feedback: "❌ DANGER ! Les serveurs email sont des cibles prioritaires. Ne stockez jamais de passphrase en clair en ligne.",
                    feedbackType: 'negative',
                    consequence: { xpChange: -50 }
                }
            ]
        }
      }
    ]
  },

  // ========================================================================
  // 3. SECURITY / ANTI-SCAM
  // ========================================================================
  {
    id: 'safety-101',
    courseId: 'safety-101',
    title: 'Anti-Scam : Défense Active',
    description: 'Ne soyez pas une victime. Apprenez à déjouer les pièges des hackers.',
    category: 'Security',
    difficulty: 'intermediate',
    isPremium: true,
    premium: true,
    totalXp: 800,
    estimatedHours: 1,
    layers: [
      {
        id: 'safety-l1',
        layerId: 'safety-l1',
        type: 'discovery',
        contentType: 'discovery',
        title: 'Les 3 Règles d\'Or',
        description: 'Ne jamais se faire arnaquer',
        content: `### Règles d'Or
1. **Ne partagez JAMAIS votre Passphrase** (même à la Core Team qui ne la demandera JAMAIS)
2. **Utilisez UNIQUEMENT le Pi Browser** (minepi.com)
3. **Vérifiez les sources** et les URLs (attention aux fautes de frappe)`,
        xpReward: 100,
        energyCost: 5
      },
      {
        id: 'safety-l2',
        layerId: 'safety-l2',
        type: 'quiz',
        contentType: 'quiz',
        title: 'Quiz: Détection',
        description: 'Identifiez les red flags',
        xpReward: 150,
        energyCost: 25,
        questions: [
            { id: 'q-scam-1', question: "La Core Team peut-elle vous demander votre passphrase?", options: ["Jamais", "Parfois", "Seulement pour le KYC"], correct: 0, explanation: "Jamais. C'est une arnaque garantie." },
            { id: 'q-scam-2', question: "Où devez-vous entrer votre passphrase?", options: ["Sur n'importe quel site", "Uniquement dans le Pi Wallet officiel", "Dans un Google Form"], correct: 1, explanation: "Uniquement dans l'application Wallet officielle du Pi Browser." }
        ]
      },
      {
        id: 'safety-l3-lab',
        layerId: 'safety-l3-lab',
        type: 'interactive_simulation',
        contentType: 'interactive_simulation',
        title: 'Simulation: Investigation Scam',
        description: 'Analysez un message suspect reçu en DM',
        xpReward: 400,
        energyCost: 25,
        interactiveData: {
            initialState: "### Dossier d'Investigation #104\n\nVous recevez un DM: 'Bonjour, votre compte nécessite une vérification immédiate pour éviter le brûlage de vos Pi. Cliquez ici: [minepi-verify.tk]'.\n\nQue faites-vous ?",
            winningCondition: ['scam-act-3'],
            actions: [
                {
                    id: 'scam-act-1',
                    label: 'Cliquer pour vérifier',
                    energyCost: 25,
                    feedback: "❌ TRÈS MAUVAIS ! Vous avez donné votre clé. Votre wallet est vidé en 3 secondes.",
                    feedbackType: 'negative',
                    consequence: { xpChange: -200 }
                },
                {
                    id: 'scam-act-2',
                    label: 'Inspecter l\'URL',
                    energyCost: 5,
                    feedback: "🔍 Analyse: 'minepi-verify.tk' n'est pas 'minepi.com'. C'est un faux domaine.",
                    feedbackType: 'warning'
                },
                {
                    id: 'scam-act-3',
                    label: 'Signaler et Bloquer',
                    energyCost: 5,
                    feedback: "✅ Parfait ! Signalement envoyé. Vous avez protégé la communauté.",
                    feedbackType: 'positive',
                    consequence: { xpChange: 150 }
                }
            ]
        }
      }
    ]
  },

  // ========================================================================
  // 4. BLOCKCHAIN FUNDAMENTALS
  // ========================================================================
  {
    id: 'blockchain-fundamentals',
    courseId: 'blockchain-fundamentals',
    title: 'Sous le capot du Web3',
    description: 'Décryptez la technologie révolutionnaire derrière Pi. Plus de secrets.',
    category: 'Web3',
    difficulty: 'intermediate',
    requiredItem: 'intermediate_license',
    totalXp: 700,
    estimatedHours: 3,
    layers: [
      {
        id: 'blockchain-l1',
        layerId: 'blockchain-l1',
        type: 'discovery',
        contentType: 'discovery',
        title: 'La Blockchain Expliquée',
        description: 'Les fondamentaux de la technologie',
        content: `### ⛓️ Qu'est-ce que la Blockchain?

Une blockchain est un **registre distribué** qui stocke les données de manière immuable et transparente.

**Caractéristiques Clés:**

#### 🔗 Structure en Chaîne
- Chaque **bloc** contient des transactions a un **hash** unique.
- Modifier un bloc = modifier TOUS les suivants (impossible!)

#### 🌐 Décentralisation
- Pas de serveur central = pas de point de défaillance unique.
- Consensus pour valider les nouvelles transactions.

#### 🔐 Types de Consensus
| Mécanisme | Fonctionnement | Exemples |
|-----------|----------------|----------|
| **PoW** | Puzzles mathématiques | Bitcoin |
| **SCP** | Graphes de confiance | Pi Network |

#### 📜 Smart Contracts
- Programmes **auto-exécutants**.
- "Si condition X, alors action Y".`,
        xpReward: 100,
        energyCost: 5
      },
      {
        id: 'blockchain-l2',
        layerId: 'blockchain-l2',
        type: 'quiz',
        contentType: 'quiz',
        title: 'Quiz: Blockchain',
        description: 'Testez vos connaissances blockchain',
        xpReward: 180,
        energyCost: 25,
        questions: [
            { id: 'q-bc-1', question: "Qu'est-ce qu'un bloc?", options: ["Un groupe de transactions", "Un serveur", "Une pièce de monnaie"], correct: 0, explanation: "Un bloc regroupe des transactions validées." },
            { id: 'q-bc-2', question: "Quelle propriété rend la blockchain sûre?", options: ["Immutabilité", "Rapidité", "Anonymat"], correct: 0, explanation: "Une fois écrite, une donnée ne peut être modifiée (immutabilité)." }
        ]
      }
    ]
  },

  // ========================================================================
  // 5. DEFI
  // ========================================================================
  {
    id: 'defi-intro',
    courseId: 'defi-intro',
    title: 'Finance du Futur (DeFi)',
    description: 'Oubliez les banques. Plongez dans les AMM, Staking et la liberté financière.',
    category: 'DeFi',
    difficulty: 'advanced',
    requiredItem: 'validator_license',
    isPremium: true,
    premium: true,
    totalXp: 900,
    layers: [
      {
        id: 'defi-l1',
        layerId: 'defi-l1',
        type: 'discovery',
        contentType: 'discovery',
        title: 'Le DeFi Expliqué',
        description: 'Finance sans banque traditionnelle',
        content: `### 🏦 La Finance Décentralisée (DeFi)

La DeFi représente une révolution dans le monde financier. Elle permet d'accéder à des services bancaires **sans intermédiaires**.

**Concepts Clés:**

#### 1️⃣ AMM (Automated Market Maker)
Les AMM remplacent les carnets d'ordres par des **algorithmes**.
- **Uniswap, PancakeSwap**
- Prix = \`x * y = k\`

#### 2️⃣ Liquidity Pools
- Déposez 2 tokens en paire
- Gagnez des **frais**
- ⚠️ Risque: **Impermanent Loss**

#### 3️⃣ Staking
Verrouiller des tokens pour sécuriser le réseau → Récompenses`,
        xpReward: 120,
        energyCost: 5
      },
      {
        id: 'defi-l2',
        layerId: 'defi-l2',
        type: 'quiz',
        contentType: 'quiz',
        title: 'Quiz: Maîtrise DeFi',
        description: 'Validez vos connaissances DeFi',
        xpReward: 250,
        energyCost: 25,
        questions: [
            { id: 'q-defi-1', question: "Que signifie AMM?", options: ["Automated Market Maker", "Automated Money Machine", "Advanced Mining Method"], correct: 0, explanation: "Un teneur de marché automatisé." },
            { id: 'q-defi-2', question: "Quel est un risque majeur des Liquidity Pools?", options: ["Impermanent Loss", "Vol de banque", "Trop de profit"], correct: 0, explanation: "La perte impermanente survient quand le prix des actifs diverge." }
        ]
      }
    ]
  }
];
