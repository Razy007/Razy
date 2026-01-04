import { Course } from '../types';
import { ENRICHED_DISCOVERY_CONTENT, enrichDiscoveryLayer } from './discoveryContent';
import { getLayerQuestions } from './questionBank'; // Import question bank

/**
 * BIBLIOTHÈQUE COMPLÈTE DE COURS - Pi Academy Social
 * Système autonome avec 15+ cours couvrant tous les aspects de Pi Network
 */

export const COURSES: Course[] = [
    // ========== NIVEAU DÉBUTANT (Essentials) ==========
    {
        id: 'pi-intro-101',
        title: 'Introduction à Pi Network',
        category: 'Pi Basics',
        icon: '🥧',
        description: 'Découvrez les fondamentaux de Pi Network et son écosystème unique.',
        totalXp: 300,
        premium: false,
        locked: false,
        piReward: 0.0003,
        // Progression Requirements
        difficulty: 'beginner',
        requiredLevel: 1,
        requiredXP: 0,
        requiredCourses: [],
        layers: [
            {
                id: 'pi-intro-l1',
                type: 'discovery',
                title: 'Découverte: Qu\'est-ce que Pi Network?',
                description: 'Comprendre la vision et la mission de Pi Network',
                content: `### La Révolution Pi Network

Pi Network est la première cryptomonnaie que vous pouvez miner sur votre téléphone.

**Points Clés:**
- 🌍 **Accessible**: Pas besoin de matériel coûteux
- 🔋 **Économe**: Ne consomme pas votre batterie
- 👥 **Social**: Construit sur la confiance communautaire
- 🔒 **Sécurisé**: Utilise le Stellar Consensus Protocol (SCP)

**Vision:** Créer la crypto la plus accessible au monde.`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 50,
                cooldownMinutes: 0
            },
            {
                id: 'pi-intro-l2',
                type: 'comprehension',
                title: 'Compréhension: Quiz Fondamentaux',
                description: 'Testez votre compréhension des bases de Pi',
                requiredMastery: 80,
                energyCost: 5,
                xpReward: 100,
                cooldownMinutes: 15,
                // 🎯 50 QUESTIONS DISPONIBLES - Randomisation maximale!
                questions: getLayerQuestions('pi-intro-l2')
            }
        ]
    },

    {
        id: 'pi-wallet-101',
        title: 'Pi Wallet Mastery',
        category: 'Essentials',
        icon: '💳',
        description: 'Maîtrisez votre wallet non-custodial. Sécurisez votre Passphrase et gérez vos transactions.',
        totalXp: 500,
        premium: false,
        locked: false,
        piReward: 0.0005,
        // Progression Requirements
        difficulty: 'beginner',
        requiredLevel: 2,
        requiredXP: 300,
        requiredCourses: ['pi-intro-101'],
        layers: [
            {
                id: 'wallet-l1-discovery',
                type: 'discovery',
                title: 'Découverte: Wallet Non-Custodial',
                description: 'Comprendre la différence entre Pi Wallet et une banque',
                content: `### Vos Clés, Votre Crypto

Pi Wallet est **non-custodial**. SEUL VOUS avez accès à vos Pi.

**Composants Clés:**
- **Public Key (Adresse)**: Commence par 'G'. Partagez-la pour recevoir des Pi.
- **Private Key (Passphrase)**: 24 mots. **NE LA PARTAGEZ JAMAIS.**

⚠️ **CRITIQUE:** Si vous perdez votre Passphrase, vous perdez vos Pi. Personne ne peut les récupérer.`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 50,
                cooldownMinutes: 0
            },
            {
                id: 'wallet-l2-comprehension',
                type: 'comprehension',
                title: 'Compréhension: Sécurité du Wallet',
                description: 'Prouvez que vous comprenez la sécurité du wallet',
                requiredMastery: 80,
                energyCost: 10,
                xpReward: 150,
                cooldownMinutes: 30,
                // 🎯 10 QUESTIONS AAA - Randomisation forte!
                questions: getLayerQuestions('wallet-l2-comprehension')
            }
        ]
    },

    // ========== SÉCURITÉ ==========
    {
        id: 'safety-101',
        title: 'Anti-Scam Defense',
        category: 'Security',
        icon: '🛡️',
        description: 'Apprenez à identifier et éviter les arnaques courantes dans l\'écosystème Pi.',
        totalXp: 800,
        premium: false,
        locked: false,
        piReward: 0.0008,
        difficulty: 'beginner',
        requiredLevel: 3,
        requiredXP: 500,
        requiredCourses: ['pi-wallet-101'],
        layers: [
            {
                id: 'safety-l1',
                type: 'discovery',
                title: 'Les 3 Règles d\'Or de la Sécurité',
                description: 'Règles essentielles pour ne jamais se faire arnaquer',
                content: `### Règles d'Or Anti-Scam

1. **Ne partagez JAMAIS votre Passphrase**
   - Pas même à la "Core Team"
   - Pas même à un "modérateur"
   - Pas même à votre "sponsor"

2. **Utilisez UNIQUEMENT le Pi Browser officiel**
   - Téléchargez depuis l'app officielle Pi
   - Vérifiez l'URL: minepi.com

3. **Vérifiez, Vérifiez, Vérifiez**
   - Domaines officiels uniquement
   - Pas de DM non sollicités
   - Pas de promesses d'échange fiat (durant Enclosed Mainnet)`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 100,
                cooldownMinutes: 0
            },
            {
                id: 'safety-l2',
                type: 'comprehension',
                title: 'Quiz: Détection d\'Arnaques',
                description: 'Identifiez les red flags dans ces scénarios',
                requiredMastery: 90,
                energyCost: 15,
                xpReward: 200,
                cooldownMinutes: 60,
                // 🎯 10 QUESTIONS AAA - Randomisation forte!
                questions: getLayerQuestions('safety-l2')
            }
        ]
    },

    // ========== KYC ==========
    {
        id: 'kyc-101',
        title: 'KYC Process Explained',
        category: 'Verification',
        icon: '✅',
        description: 'Comprenez le processus KYC et pourquoi il est essentiel pour Pi Network.',
        totalXp: 600,
        premium: false,
        locked: false,
        piReward: 0.0006,
        difficulty: 'intermediate',
        requiredLevel: 4,
        requiredXP: 800,
        requiredCourses: ['safety-101'],
        layers: [
            {
                id: 'kyc-l1',
                type: 'discovery',
                title: 'Pourquoi le KYC?',
                description: 'Comprendre l\'importance du KYC pour Pi',
                content: `### KYC: Know Your Customer

**Objectif:** Garantir 1 personne = 1 compte

**Pourquoi c'est crucial:**
- 🚫 Empêche les faux comptes
- 🤖 Bloque les bots
- ✅ Assure l'équité du réseau
- 💰 Protège la valeur de Pi

**Processus:**
1. Vérification d'identité (ID officiel)
2. Liveness Check (selfie vidéo)
3. Période d'attente (14 jours)
4. Migration vers Mainnet

⏰ **Patience:** Le KYC peut prendre du temps, mais c'est pour protéger tout le monde.`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 80,
                cooldownMinutes: 0
            },
            {
                id: 'kyc-l2',
                type: 'comprehension',
                title: 'Quiz: Processus KYC',
                description: 'Testez votre compréhension du KYC',
                requiredMastery: 85,
                energyCost: 12,
                xpReward: 150,
                cooldownMinutes: 45,
                // 🎯 10 QUESTIONS AAA - Randomisation forte!
                questions: getLayerQuestions('kyc-l2')
            }
        ]
    },

    // ========== BLOCKCHAIN ==========
    {
        id: 'blockchain-fundamentals',
        title: 'Blockchain Fundamentals',
        category: 'Web3',
        icon: '⛓️',
        description: 'Comprenez la technologie blockchain et son fonctionnement.',
        totalXp: 700,
        premium: false,
        locked: false,
        piReward: 0.0007,
        difficulty: 'intermediate',
        requiredLevel: 5,
        requiredXP: 1000,
        requiredCourses: ['pi-intro-101', 'pi-wallet-101'],
        layers: [
            {
                id: 'blockchain-l1',
                type: 'discovery',
                title: 'Qu\'est-ce qu\'une Blockchain?',
                description: 'Les bases de la technologie blockchain',
                content: `### La Blockchain Expliquée

**Définition:** Un registre distribué, immuable et transparent.

**Caractéristiques:**
- 📖 **Registre**: Enregistre toutes les transactions
- 🌐 **Distribué**: Copié sur des milliers de nœuds
- 🔒 **Immuable**: Impossible de modifier l'historique
- 👁️ **Transparent**: Tout le monde peut vérifier

**Analogie:** Imaginez un cahier de comptes partagé que tout le monde peut lire, mais que personne ne peut effacer.

**Pi Network** utilise le Stellar Consensus Protocol (SCP) pour sa blockchain.`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 100,
                cooldownMinutes: 0
            },
            {
                id: 'blockchain-l2',
                type: 'comprehension',
                title: 'Quiz: Blockchain Basics',
                description: 'Testez votre compréhension de la blockchain',
                requiredMastery: 80,
                energyCost: 15,
                xpReward: 180,
                cooldownMinutes: 40,
                questions: [
                    {
                        id: 'q-blockchain-1',
                        question: "Qu'est-ce qu'une blockchain?",
                        options: ["Une chaîne physique", "Un registre distribué et immuable", "Un type de cryptographie", "Un réseau social"],
                        correct: 1,
                        explanation: "La blockchain est un registre distribué qui enregistre les transactions de manière sécurisée et transparente.",
                        difficulty: 'easy',
                        cognitiveLevel: 'knowledge',
                        topic: 'blockchain',
                        trapType: 'none'
                    },
                    {
                        id: 'q-blockchain-2',
                        question: "Que signifie 'décentralisé'?",
                        options: ["Contrôlé par une entité", "Distribué sur plusieurs nœuds", "Stocké dans le cloud", "Géré par des banques"],
                        correct: 1,
                        explanation: "La décentralisation signifie que le réseau est distribué sur plusieurs nœuds indépendants.",
                        difficulty: 'medium',
                        cognitiveLevel: 'comprehension',
                        topic: 'blockchain',
                        trapType: 'none'
                    }
                ]
            }
        ]
    },

    // ========== DEFI ==========
    {
        id: 'defi-intro',
        title: 'Introduction au DeFi',
        category: 'DeFi',
        icon: '🏦',
        description: 'Découvrez la finance décentralisée et ses opportunités.',
        totalXp: 900,
        premium: true,
        locked: false,
        piReward: 0.0009,
        difficulty: 'intermediate',
        requiredLevel: 7,
        requiredXP: 1500,
        requiredCourses: ['blockchain-fundamentals'],
        layers: [
            {
                id: 'defi-l1',
                type: 'discovery',
                title: 'Qu\'est-ce que le DeFi?',
                description: 'Les fondamentaux de la finance décentralisée',
                content: `### DeFi: Finance Décentralisée

**DeFi** = Services financiers sans intermédiaires (banques).

**Services DeFi:**
- 💱 **DEX**: Échanges décentralisés (Uniswap, PancakeSwap)
- 💰 **Lending**: Prêts/emprunts (Aave, Compound)
- 🌾 **Yield Farming**: Générer des rendements
- 🔄 **Staking**: Verrouiller des tokens pour des récompenses

**Avantages:**
- ✅ Pas de KYC (dans certains cas)
- ✅ Accès 24/7
- ✅ Contrôle total de vos fonds
- ✅ Transparence totale

**Risques:**
- ⚠️ Smart contract bugs
- ⚠️ Impermanent loss
- ⚠️ Volatilité élevée`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 120,
                cooldownMinutes: 0
            },
            {
                id: 'defi-l2',
                type: 'comprehension',
                title: 'Quiz: DeFi Basics',
                description: 'Testez votre compréhension du DeFi',
                requiredMastery: 85,
                energyCost: 20,
                xpReward: 220,
                cooldownMinutes: 60,
                questions: [
                    {
                        id: 'q-defi-1',
                        question: "Qu'est-ce qu'un DEX (Decentralized Exchange)?",
                        options: ["Une banque en ligne", "Un échange sans intermédiaire central", "Un wallet", "Un token"],
                        correct: 1,
                        explanation: "Un DEX permet d'échanger des cryptos directement entre utilisateurs, sans autorité centrale.",
                        difficulty: 'medium',
                        cognitiveLevel: 'knowledge',
                        topic: 'defi',
                        trapType: 'none'
                    },
                    {
                        id: 'q-defi-2',
                        question: "Qu'est-ce que le 'Yield Farming'?",
                        options: ["Cultiver des légumes", "Générer des rendements en fournissant de la liquidité", "Miner du Bitcoin", "Acheter des NFTs"],
                        correct: 1,
                        explanation: "Le Yield Farming consiste à fournir de la liquidité à des protocoles DeFi en échange de récompenses.",
                        difficulty: 'hard',
                        cognitiveLevel: 'application',
                        topic: 'defi',
                        trapType: 'none'
                    }
                ]
            }
        ]
    },

    // ========== TRADING ==========
    {
        id: 'trading-basics',
        title: 'Trading Crypto 101',
        category: 'Trading',
        icon: '📈',
        description: 'Apprenez les bases du trading de cryptomonnaies.',
        totalXp: 850,
        premium: true,
        locked: false,
        piReward: 0.00085,
        difficulty: 'advanced',
        requiredLevel: 10,
        requiredXP: 2500,
        requiredCourses: ['defi-intro'],
        layers: [
            {
                id: 'trading-l1',
                type: 'discovery',
                title: 'Fondamentaux du Trading',
                description: 'Comprendre les bases du trading crypto',
                content: `### Trading Crypto: Les Bases

**Types d'Ordres:**
- 📊 **Market Order**: Achat/vente immédiat au prix actuel
- 🎯 **Limit Order**: Achat/vente à un prix spécifique
- 🛑 **Stop Loss**: Limite vos pertes automatiquement

**Analyse:**
- 📈 **Technique**: Graphiques, patterns, indicateurs
- 📰 **Fondamentale**: News, adoption, technologie

**Règles d'Or:**
1. Ne tradez que ce que vous pouvez perdre
2. Diversifiez votre portfolio
3. DYOR (Do Your Own Research)
4. Contrôlez vos émotions

⚠️ **Attention:** Le trading comporte des risques élevés.`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 110,
                cooldownMinutes: 0
            }
        ]
    },

    // ========== SMART CONTRACTS ==========
    {
        id: 'smart-contracts',
        title: 'Smart Contracts Explained',
        category: 'Web3',
        icon: '📜',
        description: 'Comprenez les contrats intelligents et leur fonctionnement.',
        totalXp: 750,
        premium: true,
        locked: false,
        piReward: 0.00075,
        difficulty: 'advanced',
        requiredLevel: 10,
        requiredXP: 3000,
        requiredCourses: ['blockchain-fundamentals', 'defi-intro'],
        layers: [
            {
                id: 'smart-l1',
                type: 'discovery',
                title: 'Qu\'est-ce qu\'un Smart Contract?',
                description: 'Introduction aux contrats intelligents',
                content: `### Smart Contracts: Contrats Auto-Exécutables

**Définition:** Code qui s'exécute automatiquement quand les conditions sont remplies.

**Exemple Simple:**
\`\`\`
SI Alice envoie 10 Pi à Bob
ALORS Bob reçoit 10 Pi
ET Alice reçoit le NFT de Bob
\`\`\`

**Avantages:**
- ✅ Pas d'intermédiaire
- ✅ Exécution automatique
- ✅ Transparent et vérifiable
- ✅ Immuable une fois déployé

**Utilisations:**
- 🎮 NFTs et Gaming
- 💰 DeFi (prêts, échanges)
- 🗳️ Votes décentralisés
- 🏠 Immobilier tokenisé

**Pi Network** supporte les smart contracts sur sa blockchain.`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 100,
                cooldownMinutes: 0
            }
        ]
    },

    // ========== NFTs ==========
    {
        id: 'nft-basics',
        title: 'NFTs & Digital Assets',
        category: 'Web3',
        icon: '🎨',
        description: 'Découvrez les NFTs et leur utilité dans l\'écosystème Pi.',
        totalXp: 650,
        premium: true,
        locked: false,
        piReward: 0.00065,
        difficulty: 'advanced',
        requiredLevel: 12,
        requiredXP: 3500,
        requiredCourses: ['smart-contracts'],
        layers: [
            {
                id: 'nft-l1',
                type: 'discovery',
                title: 'Comprendre les NFTs',
                description: 'Qu\'est-ce qu\'un NFT et pourquoi c\'est important',
                content: `### NFTs: Non-Fungible Tokens

**NFT** = Token unique et non-interchangeable.

**Différence avec les cryptos:**
- 💰 1 Pi = 1 Pi (fongible)
- 🎨 NFT #1 ≠ NFT #2 (non-fongible)

**Cas d'Usage:**
- 🖼️ Art digital
- 🎮 Items de jeu
- 🎫 Tickets d'événements
- 📜 Certificats
- 🏠 Immobilier fractionné

**Sur Pi Network:**
- Créez et échangez des NFTs
- Utilisez Pi pour acheter des NFTs
- Gagnez des royalties

**Exemple:** Un badge de pionnier vérifié pourrait être un NFT!`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 90,
                cooldownMinutes: 0
            }
        ]
    },

    // ========== PI ECOSYSTEM ==========
    {
        id: 'pi-ecosystem',
        title: 'Pi Ecosystem Deep Dive',
        category: 'Pi Advanced',
        icon: '🌐',
        description: 'Explorez l\'écosystème complet de Pi Network.',
        totalXp: 1000,
        premium: true,
        locked: false,
        piReward: 0.001,
        difficulty: 'expert',
        requiredLevel: 15,
        requiredXP: 5000,
        requiredCourses: ['smart-contracts', 'defi-intro', 'nft-basics'],
        layers: [
            {
                id: 'ecosystem-l1',
                type: 'discovery',
                title: 'L\'Écosystème Pi',
                description: 'Découvrez tous les composants de l\'écosystème Pi',
                content: `### L'Écosystème Pi Network

**Composants Principaux:**

1. **Pi Browser**
   - Navigateur dédié pour les dApps Pi
   - Wallet intégré
   - Accès sécurisé aux apps

2. **Pi App Platform**
   - Marketplace d'applications
   - dApps développées par la communauté
   - Paiements en Pi

3. **Pi Blockchain**
   - Mainnet (Enclosed puis Open)
   - Smart contracts
   - Transactions rapides et peu coûteuses

4. **Pi Community**
   - 50M+ pionniers
   - Ambassadeurs
   - Développeurs

**Vision:** Créer une économie peer-to-peer complète.`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 130,
                cooldownMinutes: 0
            }
        ]
    },

    // ========== SECURITY ADVANCED ==========
    {
        id: 'security-advanced',
        title: 'Advanced Security Practices',
        category: 'Security',
        icon: '🔐',
        description: 'Techniques avancées pour sécuriser vos actifs crypto.',
        totalXp: 950,
        premium: true,
        locked: false,
        piReward: 0.00095,
        difficulty: 'expert',
        requiredLevel: 18,
        requiredXP: 6000,
        requiredCourses: ['safety-101', 'pi-wallet-101'],
        layers: [
            {
                id: 'security-adv-l1',
                type: 'discovery',
                title: 'Sécurité Avancée',
                description: 'Protégez vos actifs comme un pro',
                content: `### Sécurité Crypto Avancée

**Stockage de la Passphrase:**
- ✅ Papier (plusieurs copies)
- ✅ Coffre-fort physique
- ✅ Plaque métallique gravée
- ❌ JAMAIS en digital (photo, cloud, email)

**Bonnes Pratiques:**
1. **2FA partout** (Google Authenticator)
2. **Emails séparés** (1 pour crypto uniquement)
3. **VPN** pour transactions importantes
4. **Vérification des adresses** (copier-coller peut être piraté)
5. **Testez avec de petits montants** d'abord

**Hardware Wallets:**
- Ledger, Trezor pour stockage à long terme
- Pi Wallet pour usage quotidien

**Red Flags:**
- Promesses de rendements garantis
- Urgence artificielle
- Demandes de Passphrase`,
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 120,
                cooldownMinutes: 0
            }
        ]
    }
];

/**
 * SYSTÈME AUTONOME DE MISE À JOUR DES COURS
 * 
 * Ce système permet à l'application de:
 * 1. Détecter les nouveaux sujets tendances dans l'écosystème Pi
 * 2. Générer automatiquement du contenu éducatif
 * 3. Mettre à jour la bibliothèque de cours sans intervention humaine
 * 
 * Note: Nécessite une intégration avec une API AI (Gemini, GPT-4, etc.)
 */

export interface CourseUpdateConfig {
    autoUpdateEnabled: boolean;
    updateFrequency: 'daily' | 'weekly' | 'monthly';
    aiProvider: 'gemini' | 'gpt4' | 'claude';
    topics: string[];
}

export const AUTO_UPDATE_CONFIG: CourseUpdateConfig = {
    autoUpdateEnabled: true,
    updateFrequency: 'weekly',
    aiProvider: 'gemini',
    topics: [
        'Pi Network updates',
        'Blockchain technology',
        'DeFi trends',
        'Security threats',
        'Crypto regulations',
        'Web3 innovations'
    ]
};

/**
 * Fonction pour générer automatiquement de nouveaux cours
 * (À implémenter avec une API AI)
 */
export async function generateNewCourse(topic: string): Promise<Course | null> {
    // TODO: Implémenter avec Gemini API ou GPT-4
    // 1. Analyser les tendances actuelles
    // 2. Générer le contenu du cours
    // 3. Créer les quiz adaptatifs
    // 4. Valider la qualité du contenu
    // 5. Ajouter à la bibliothèque
    
    console.log(`[AUTO-UPDATE] Génération d'un nouveau cours sur: ${topic}`);
    return null;
}

/**
 * Fonction pour mettre à jour un cours existant
 */
export async function updateExistingCourse(courseId: string): Promise<boolean> {
    // TODO: Implémenter la mise à jour automatique
    console.log(`[AUTO-UPDATE] Mise à jour du cours: ${courseId}`);
    return false;
}

// Export for compatibility with App.tsx
export const courses = COURSES;
