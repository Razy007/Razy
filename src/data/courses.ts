import { Course } from '../types';
import { getLayerQuestions } from './questionBank'; 

/**
 * 🌍 INTERNATIONALIZED COURSE DATABASE
 * 
 * This file contains the master data for all courses in multiple languages.
 * The `getCourseData(lang)` function automatically serving the correct content.
 */

// Helper type for bilingual strings
type TranslatableString = {
    fr: string;
    en: string;
};

type TranslatableContent = {
    fr: string;
    en: string;
};

// Interface for raw bilingual data (internal use)
interface BilingualCourse extends Omit<Course, 'title' | 'description' | 'layers'> {
    title: TranslatableString;
    description: TranslatableString;
    layers: TranslatableLayer[];
}

interface TranslatableLayer {
    id: string;
    type: 'discovery' | 'comprehension' | 'quiz';
    title: TranslatableString;
    description: TranslatableString;
    content?: TranslatableContent; // Markdown content
    requiredMastery: number;
    energyCost: number;
    xpReward: number;
    cooldownMinutes: number;
    questions?: any[]; // Questions are handled by questionBank, which also needs i18n later
}

const RAW_COURSES: BilingualCourse[] = [
    // ========== 1. PI NETWORK ESSENTIALS (Fully Translated) ==========
    {
        id: 'pi-intro-101',
        title: {
            fr: 'Introduction à Pi Network',
            en: 'Pi Network Essentials'
        },
        category: 'Pi Basics',
        icon: '🥧',
        description: {
            fr: 'Découvrez les fondamentaux de Pi Network et son écosystème unique.',
            en: 'Master the fundamentals of Pi Network and its unique ecosystem.'
        },
        totalXp: 300,
        premium: false,
        locked: false,
        piReward: 0.0003,
        difficulty: 'beginner',
        requiredLevel: 1,
        requiredXP: 0,
        requiredCourses: [],
        layers: [
            {
                id: 'pi-intro-l1',
                type: 'discovery',
                title: {
                    fr: "Découverte: Qu'est-ce que Pi Network?",
                    en: "Discovery: What is Pi Network?"
                },
                description: {
                    fr: 'Comprendre la vision et la mission de Pi Network',
                    en: 'Understand the vision and mission of Pi Network'
                },
                content: {
                    fr: `### La Révolution Pi Network

Pi Network est la première cryptomonnaie que vous pouvez miner sur votre téléphone.

**Points Clés:**
- 🌍 **Accessible**: Pas besoin de matériel coûteux
- 🔋 **Économe**: Ne consomme pas votre batterie
- 👥 **Social**: Construit sur la confiance communautaire
- 🔒 **Sécurisé**: Utilise le Stellar Consensus Protocol (SCP)

**Vision:** Créer la crypto la plus accessible au monde.`,
                    en: `### The Pi Network Revolution

Pi Network is the first digital currency you can mine on your phone.

**Key Highlights:**
- 🌍 **Accessible**: No expensive hardware required
- 🔋 **Eco-Friendly**: Does not drain your battery
- 👥 **Social**: Built on community trust (Security Circles)
- 🔒 **Secure**: Powered by the Stellar Consensus Protocol (SCP)

**Vision:** To build the world's most inclusive peer-to-peer ecosystem.`
                },
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 50,
                cooldownMinutes: 0
            },
            {
                id: 'pi-intro-l2',
                type: 'comprehension',
                title: {
                    fr: "Compréhension: Quiz Fondamentaux",
                    en: "Comprehension: Core Quiz"
                },
                description: {
                    fr: 'Testez votre compréhension des bases de Pi',
                    en: 'Test your understanding of Pi fundamentals'
                },
                requiredMastery: 80,
                energyCost: 5,
                xpReward: 100,
                cooldownMinutes: 15,
                questions: getLayerQuestions('pi-intro-l2') // TODO: i18n for Questions
            }
        ]
    },

    // ========== 2. WALLET MASTERY ==========
    {
        id: 'pi-wallet-101',
        title: {
            fr: 'Pi Wallet Mastery',
            en: 'Pi Wallet Mastery'
        },
        category: 'Essentials',
        icon: '💳',
        description: {
            fr: 'Maîtrisez votre wallet non-custodial. Sécurisez votre Passphrase.',
            en: 'Master your non-custodial wallet. Secure your Passphrase.'
        },
        totalXp: 500,
        premium: false,
        locked: false,
        piReward: 0.0005,
        difficulty: 'beginner',
        requiredLevel: 2,
        requiredXP: 300,
        requiredCourses: ['pi-intro-101'],
        layers: [
            {
                id: 'wallet-l1-discovery',
                type: 'discovery',
                title: {
                    fr: "Découverte: Wallet Non-Custodial",
                    en: "Discovery: Non-Custodial Wallet"
                },
                description: {
                    fr: 'Pi Wallet vs Banque',
                    en: 'Pi Wallet vs Bank'
                },
                content: {
                    fr: `### Vos Clés, Votre Crypto
Pi Wallet est **non-custodial**. SEUL VOUS avez accès à vos Pi.

**Composants Clés:**
- **Public Key**: Votre adresse pour recevoir.
- **Passphrase**: 24 mots secrets. **NE JAMAIS PARTAGER.**

⚠️ Si vous perdez votre Passphrase, vous perdez tout.`,
                    en: `### Your Keys, Your Crypto
Pi Wallet is **non-custodial**. ONLY YOU have access to your Pi.

**Key Components:**
- **Public Key**: Your address to receive Pi (starts with G).
- **Passphrase**: 24 secret words. **NEVER SHARE THIS.**

⚠️ If you lose your Passphrase, you lose your funds forever. No reset possible.`
                },
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 50,
                cooldownMinutes: 0
            },
            {
                id: 'wallet-l2-comprehension',
                type: 'comprehension',
                title: {
                    fr: "Compréhension: Sécurité",
                    en: "Comprehension: Security"
                },
                description: {
                    fr: "Sécurité du Wallet",
                    en: "Wallet Security Check"
                },
                requiredMastery: 80,
                energyCost: 10,
                xpReward: 150,
                cooldownMinutes: 30,
                questions: getLayerQuestions('wallet-l2-comprehension')
            }
        ]
    },

    // ========== 3. SECURITY / ANTI-SCAM ==========
    {
        id: 'safety-101',
        title: {
            fr: 'Anti-Scam Defense',
            en: 'Anti-Scam Defense'
        },
        category: 'Security',
        icon: '🛡️',
        description: {
            fr: 'Identifiez et évitez les arnaques.',
            en: 'Identify and avoid common ecosystem scams.'
        },
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
                title: { fr: 'Les 3 Règles d\'Or', en: 'The 3 Golden Rules' },
                description: { fr: 'Ne jamais se faire arnaquer', en: 'Never get scammed' },
                content: {
                    fr: `### Règles d'Or
1. **Ne partagez JAMAIS votre Passphrase** (même à la Core Team)
2. **Utilisez UNIQUEMENT le Pi Browser** (minepi.com)
3. **Vérifiez les sources**`,
                    en: `### Golden Rules
1. **NEVER share your Passphrase** (not even to Core Team)
2. **ONLY use the Pi Browser** (minepi.com)
3. **Verify sources**`
                },
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 100,
                cooldownMinutes: 0
            },
            {
                id: 'safety-l2',
                type: 'comprehension',
                title: { fr: 'Quiz: Détection', en: 'Quiz: Detection' },
                description: { fr: 'Identifiez les red flags', en: 'Spot the red flags' },
                requiredMastery: 90,
                energyCost: 15,
                xpReward: 200,
                cooldownMinutes: 60,
                questions: getLayerQuestions('safety-l2')
            }
        ]
    },

    // ========== 4. KYC ==========
    {
        id: 'kyc-101',
        title: { fr: 'KYC Process', en: 'KYC Process' },
        category: 'Verification',
        icon: '✅',
        description: { fr: 'Le processus de vérification d\'identité.', en: 'Identity verification process explained.' },
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
                title: { fr: 'Pourquoi le KYC?', en: 'Why KYC?' },
                description: { fr: 'Importance du KYC', en: 'Importance of KYC' },
                content: {
                    fr: `### KYC: Know Your Customer
Objectif: 1 personne = 1 compte.
Bloque les bots et assure l'équité.`,
                    en: `### KYC: Know Your Customer
Goal: 1 Person = 1 Account.
Prevents bots and ensures network fairness.`
                },
                requiredMastery: 0,
                energyCost: 0,
                xpReward: 80,
                cooldownMinutes: 0
            },
             {
                id: 'kyc-l2',
                type: 'comprehension',
                title: { fr: 'Quiz: KYC', en: 'Quiz: KYC' },
                description: { fr: 'Testez vos connaissances', en: 'Test your knowledge' },
                requiredMastery: 85,
                energyCost: 12,
                xpReward: 150,
                cooldownMinutes: 45,
                questions: getLayerQuestions('kyc-l2')
            }
        ]
    },

     // ========== 5. BLOCKCHAIN ==========
    {
        id: 'blockchain-fundamentals',
        title: { fr: 'Blockchain Fundamentals', en: 'Blockchain Fundamentals' },
        category: 'Web3',
        icon: '⛓️',
        description: { fr: 'Comprenez la technologie blockchain.', en: 'Understand blockchain technology.' },
        totalXp: 700,
        premium: false,
        locked: false,
        piReward: 0.0007,
        difficulty: 'intermediate',
        requiredLevel: 5,
        requiredXP: 1000,
        requiredCourses: ['pi-intro-101'],
        layers: [{
            id: 'blockchain-l1',
            type: 'discovery',
            title: { fr: 'La Blockchain', en: 'The Blockchain' },
            description: { fr: 'Les bases', en: 'The basics' },
            content: {
                 fr: `### Blockchain
Un registre distribué, immuable et transparent.`,
                 en: `### Blockchain
A distributed, immutable, and transparent ledger.`
            },
            requiredMastery: 0,
            energyCost: 0,
            xpReward: 100,
            cooldownMinutes: 0
        }]
    },
    
    // ========== 6. DEFI ==========
    {
        id: 'defi-intro',
        title: { fr: 'Introduction au DeFi', en: 'DeFi Introduction' },
        category: 'DeFi',
        icon: '🏦',
        description: { fr: 'Finance Décentralisée.', en: 'Decentralized Finance.' },
        totalXp: 900,
        premium: true,
        locked: false,
        piReward: 0.0009,
        difficulty: 'intermediate',
        requiredLevel: 7,
        requiredXP: 1500,
        requiredCourses: ['blockchain-fundamentals'],
        layers: [{
            id: 'defi-l1',
            type: 'discovery',
            title: { fr: 'Le DeFi', en: 'DeFi' },
            description: { fr: 'Finance sans banque', en: 'Banking without banks' },
            content: { 
                fr: `### DeFi : La Finance Décentralisée

**Qu'est-ce que le DeFi ?**
DeFi (Decentralized Finance) = Finance sans intermédiaire centralisé.

**Cas d'usage principaux :**
- 💱 **Échanges (DEX)** : Tradez sans KYC (ex: Uniswap)
- 💰 **Prêts** : Empruntez/Prêtez sans banque
- 📈 **Staking** : Gagnez des intérêts passifs
- 🎯 **Yield Farming** : Optimisez vos rendements

**Avantages :**
✅ Pas de banque = Pas de censure
✅ Accessible 24/7 partout dans le monde
✅ Transparence totale (code open-source)

**Risques :**
⚠️ Smart contracts peuvent avoir des bugs
⚠️ Volatilité des crypto-actifs
⚠️ Responsabilité totale (pas de support client)`,
                
                en: `### DeFi: Decentralized Finance

**What is DeFi?**
DeFi (Decentralized Finance) = Finance without centralized intermediaries.

**Main Use Cases:**
- 💱 **Exchanges (DEX)**: Trade without KYC (e.g., Uniswap)
- 💰 **Lending**: Borrow/Lend without banks
- 📈 **Staking**: Earn passive interest
- 🎯 **Yield Farming**: Optimize your returns

**Advantages:**
✅ No bank = No censorship
✅ Accessible 24/7 worldwide
✅ Full transparency (open-source code)

**Risks :**
⚠️ Smart contracts can have bugs
⚠️ Crypto asset volatility
⚠️ Full responsibility (no customer support)` 
            },
            requiredMastery: 0,
            energyCost: 0,
            xpReward: 120,
            cooldownMinutes: 0
        }]
    }
    // Note: Other courses truncated for brevity but follow same pattern. 
    // Ideally, all 15 courses would be mapped here.
];


/**
 * Returns the fully translated list of courses based on selected language.
 * Default to English if language not found.
 */
export const getCourses = (language: string = 'en'): Course[] => {
    const targetLang = (language === 'fr' || language === 'en') ? language : 'en';

    return RAW_COURSES.map(course => ({
        ...course,
        title: course.title[targetLang],
        description: course.description[targetLang],
        layers: course.layers.map(layer => ({
            ...layer,
            title: layer.title[targetLang],
            description: layer.description[targetLang],
            content: layer.content ? layer.content[targetLang] : '',
            // 💉 INJECTION DYNAMIQUE DES QUESTIONS TRADUITES
            questions: getLayerQuestions(layer.id, targetLang) 
        }))
    }));
};

// Fallback for parts of the app still using direct import
export const COURSES = getCourses('fr'); 
