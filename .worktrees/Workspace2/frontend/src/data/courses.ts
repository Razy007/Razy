import { Course, Layer, QuizQuestion } from '../types';
import { getLayerQuestions, getRandomQuestions } from './questionBank'; 
import { getRandomLabScenario } from './labScenarios';

/**
 * 🌍 INTERNATIONALIZED COURSE DATABASE
 * 
 * This file contains the master data for all courses in multiple languages.
 * The `getCourseData(lang)` function automatically serving the correct content.
 */

type TranslatableString = { fr: string; en: string; };
type TranslatableContent = { fr: string; en: string; };

interface BilingualCourse extends Omit<Course, 'title' | 'description' | 'layers'> {
    title: TranslatableString;
    description: TranslatableString;
    requiredItem?: string;
    layers: TranslatableLayer[];
}

interface TranslatableLayer {
    id: string;
    type: 'discovery' | 'comprehension' | 'quiz' | 'decision-lab';
    title: TranslatableString;
    description: TranslatableString;
    content?: TranslatableContent;
    requiredMastery: number;
    energyCost: number;
    xpReward: number;
    cooldownMinutes: number;
    questions?: QuizQuestion[]; 
    requiredItem?: string;
}

const RAW_COURSES: BilingualCourse[] = [
    // ========== 1. PI NETWORK ESSENTIALS ==========
    {
        id: 'pi-intro-101',
        title: { fr: 'Fondamentaux Pi Network', en: 'Pi Network Fundamentals' },
        category: 'Pi Basics',
        icon: '🥧',
        description: {
            fr: "Plongez au cœur de la vision de Nicolas Kokkalis. Comprenez pourquoi Pi révolutionne la blockchain mobile sans détruire la planète.",
            en: "Deep dive into Nicolas Kokkalis's vision. Understand why Pi is revolutionizing mobile blockchain without costing the Earth."
        },
        totalXp: 300,
        premium: false,
        locked: false,
        piReward: 0.0000001,
        difficulty: 'beginner',
        requiredLevel: 1,
        requiredXP: 0,
        requiredCourses: [],
        layers: [
            {
                id: 'pi-intro-l1',
                type: 'discovery',
                title: { fr: "Genèse: La Vision Stanford", en: "Genesis: The Stanford Vision" },
                description: { fr: 'Comprendre pourquoi Pi a été créé et quel problème il résout réellement.', en: 'Why Pi was created and the real-world problem it solves.' },
                content: {
                    fr: `### La Révolution dans votre Poche\n\nLe monde de la blockchain était autrefois réservé à une élite. **Pi Network change la donne.**\n\nLancé par des docteurs de Stanford, l'objectif est de construire l'écosystème peer-to-peer le plus inclusif au monde.\n\n**Ce qui rend Pi unique :**\n\nContrairement au Bitcoin (Proof of Work), Pi repose sur le **Stellar Consensus Protocol (SCP)**. Au lieu de brûler de l'électricité, le réseau utilise vos cercles de confiance.`,
                    en: `### The Revolution in Your Pocket\n\nThe blockchain world used to be reserved for an elite. **Pi Network changes everything.**\n\nLaunched by Stanford PhDs, the goal is to build the world's most inclusive peer-to-peer ecosystem.\n\n**What Makes Pi Unique:**\n\nUnlike Bitcoin, Pi relies on the **Stellar Consensus Protocol (SCP)**. Instead of burning electricity, the network uses your circles of trust.`
                },
                requiredMastery: 0,
                energyCost: 15,
                xpReward: 10,
                cooldownMinutes: 0
            },
            {
                id: 'pi-intro-l1b',
                type: 'discovery',
                title: { fr: "La Force du Nombre: 50M+", en: "Power of Numbers: 50M+" },
                description: { fr: "L'aspect social du minage et la croissance organique.", en: "The social aspect of mining and organic growth." },
                content: {
                    fr: `### Une Communauté Mondiale\n\nPi n'est pas seulement un code, c'est une nation numérique. Avec plus de 50 millions de Pioneers, le réseau possède une force de frappe sans précédent.\n\n**Le Minage Social :**\nChaque Pioneer qui active son app quotidiennement contribue à la distribution équitable de la monnaie. Ce n'est pas votre processeur qui mine, c'est votre **engagement**.\n\n**L'Équité :**\nUn Pioneer = Un compte. Le KYC (Know Your Customer) garantit que personne ne peut tricher avec des bots.`,
                    en: `### A Global Community\n\nPi is not just code; it's a digital nation. With over 50 million Pioneers, the network has unprecedented power.\n\n**Social Mining:**\nEvery Pioneer who activates their app daily contributes to the fair distribution of the currency. It's not your CPU mining; it's your **commitment**.\n\n**Fairness:**\nOne Pioneer = One account. KYC ensures no one can cheat with bots.`
                },
                requiredMastery: 20,
                energyCost: 15,
                xpReward: 10,
                cooldownMinutes: 0
            },
            {
                id: 'pi-intro-l1c',
                type: 'discovery',
                title: { fr: "L'Économie du Futur", en: "The Future Economy" },
                description: { fr: "Utilités réelles et Web3.", en: "Real utility and Web3." },
                content: {
                    fr: `### Créer de la Valeur Réelle\n\nLa monnaie Pi tire sa valeur de son **utilité**. \n\n**L'Écosystème Pi :**\nDes applications (dApps) permettent d'acheter des biens, des services et de l'art (NFT) directement en Pi. \n\n**Web3 & Confidentialité :**\nPi Browser est votre porte d'entrée vers un internet décentralisé où vous possédez vos données.`,
                    en: `### Creating Real Value\n\nPi currency derives its value from its **utility**.\n\n**The Pi Ecosystem:**\ndApps allow you to buy goods, services, and art (NFTs) directly with Pi.\n\n**Web3 & Privacy:**\nPi Browser is your gateway to a decentralized internet where you own your data.`
                },
                requiredMastery: 40,
                energyCost: 20,
                xpReward: 15,
                cooldownMinutes: 0
            },
            {
                id: 'pi-intro-l2',
                type: 'comprehension',
                title: { fr: "Check-point: Fondamentaux", en: "Checkpoint: Fundamentals" },
                description: { fr: 'Première validation de vos connaissances.', en: 'First validation of your knowledge.' },
                requiredMastery: 60,
                energyCost: 40,
                xpReward: 25,
                cooldownMinutes: 30,
                questions: getLayerQuestions('pi-intro-l2')
            },
            {
                id: 'pi-intro-l5',
                type: 'quiz',
                title: { fr: "Examen Final: Expert Pi", en: "Final Exam: Pi Expert" },
                description: { fr: "Obtenez votre certification de Pioneer Fondateur.", en: "Get your Founding Pioneer certification." },
                requiredMastery: 90,
                energyCost: 100,
                xpReward: 100,
                cooldownMinutes: 120,
                questions: getLayerQuestions('pi-intro-l2') // Re-use bank with more questions via getRandomQuestions in mapping
            }
        ]
    },

    // ========== 2. WALLET MASTERY ==========
    {
        id: 'pi-wallet-101',
        title: { fr: 'Maîtrise du Wallet Pi', en: 'Pi Wallet Mastery' },
        category: 'Essentials',
        icon: '💳',
        description: { fr: "Votre Passphrase est votre coffre-fort. Apprenez à gérer vos fonds sans jamais risquer de les perdre.", en: "Your Passphrase is your vault. Learn to manage your funds without ever risking their loss." },
        totalXp: 500,
        premium: false,
        locked: false,
        piReward: 0.0000002,
        difficulty: 'beginner',
        requiredLevel: 1,  // ✅ Reduced from 2 - Allow progression from course 1
        requiredXP: 200,   // ✅ Reduced from 500 - Course 1 gives ~160-300 XP
        requiredCourses: ['pi-intro-101'],
        layers: [
            {
                id: 'wallet-l1-discovery',
                type: 'discovery',
                title: { fr: "L'Art de l'Auto-Souveraineté", en: "The Art of Self-Sovereignty" },
                description: { fr: 'Wallet vs Compte Bancaire.', en: 'Wallet vs Bank Account.' },
                content: {
                    fr: `### Soyez Votre Propre Banque\n\nDans le système financier traditionnel, vous appelez la banque si vous perdez votre code. Dans le monde de Pi, **vous êtes la banque.**\n\nLe Pi Wallet est "non-custodial". Cela signifie que la Core Team n'a pas accès à vos fonds.`,
                    en: `### Be Your Own Bank\n\nIn the traditional financial system, you call the bank if you lose your code. In the world of Pi, **you are the bank.**\n\nThe Pi Wallet is "non-custodial." This means the Core Team has no access to your funds.`
                },
                requiredMastery: 0,
                energyCost: 10,
                xpReward: 15,
                cooldownMinutes: 0
            },
            {
                id: 'wallet-l1b-discovery',
                type: 'discovery',
                title: { fr: "La Passphrase: Votre Seule Clé", en: "The Passphrase: Your Only Key" },
                description: { fr: 'Sécuriser les 24 mots.', en: 'Securing the 24 words.' },
                content: {
                    fr: `### Le Trésor des 24 Mots\n\nVotre passphrase n'est pas un simple mot de passe. C'est la clé cryptographique de vos fonds.\n\n**Règles d'Or :**\n1. Ne jamais la prendre en photo.\n2. Ne jamais la stocker sur un cloud.\n3. Ne jamais la donner à "un support technique".`,
                    en: `### The 24-Word Treasure\n\nYour passphrase is not just a password. It's the cryptographic key to your funds.\n\n**Golden Rules:**\n1. Never take a photo of it.\n2. Never store it on a cloud.\n3. Never give it to "technical support."`
                },
                requiredMastery: 20,
                energyCost: 15,
                xpReward: 20,
                cooldownMinutes: 0
            },
            {
                id: 'wallet-l2-quiz',
                type: 'comprehension',
                title: { fr: 'Audit de Sécurité Wallet', en: 'Wallet Security Audit' },
                description: { fr: 'Saurez-vous protéger vos fonds ?', en: 'Can you protect your funds?' },
                requiredMastery: 40,
                energyCost: 35,
                xpReward: 40,
                cooldownMinutes: 30,
                questions: getLayerQuestions('wallet-l2-comprehension')
            },
            {
                id: 'wallet-l3-lab',
                type: 'decision-lab',
                title: { fr: 'Simulation: Backup Sécurisé', en: 'Simulation: Secure Backup' },
                description: { fr: 'Mise en pratique de la sauvegarde.', en: 'Practice the backup procedure.' },
                requiredMastery: 70,
                energyCost: 80,
                xpReward: 80,
                cooldownMinutes: 60
            },
            {
                id: 'wallet-l5-master',
                type: 'quiz',
                title: { fr: "Examen Maîtrise Wallet", en: "Wallet Mastery Exam" },
                description: { fr: "Devenez gardien certifié de vos actifs.", en: "Become a certified guardian of your assets." },
                requiredMastery: 90,
                energyCost: 80,
                xpReward: 150,
                cooldownMinutes: 180,
                questions: getLayerQuestions('wallet-l2-comprehension')
            }
        ]
    },

    // ========== 3. SECURITY / ANTI-SCAM ==========
    {
        id: 'safety-101',
        title: { fr: 'Défense Anti-Scam', en: 'Anti-Scam Defense' },
        category: 'Security',
        icon: '🛡️',
        description: { fr: "Développez les réflexes d'un expert pour identifier les arnaques avant qu'elles ne menacent votre wallet.", en: "Develop expert reflexes to identify scams before they threaten your wallet." },
        totalXp: 800,
        premium: true,
        locked: false,
        piReward: 0.0000003,
        difficulty: 'beginner',
        requiredLevel: 2,  // ✅ Adjusted from 3
        requiredXP: 600,   // ✅ Adjusted from 1200 (Wallet gives ~500 XP)
        requiredCourses: ['pi-wallet-101'],
        layers: [
            {
                id: 'safety-l1',
                type: 'discovery',
                title: { fr: 'Les Lois de la Jungle Web3', en: 'The Laws of the Web3 Jungle' },
                description: { fr: 'Les trois piliers de votre protection numérique.', en: 'The three pillars of your digital protection.' },
                content: {
                    fr: `### Votre Bouclier Numérique\n\nLa blockchain est une liberté qui exige une vigilance constante.\n\n**Règle n°1 : Le Secret de la Passphrase**\nElle ne se partage JAMAIS. Si on vous la demande, c'est une arnaque.\n\n**Règle n°2 : Territoire Officiel**\nBasculez toujours sur le Pi Browser pour vos transactions.\n\n**Règle n°3 : Pas de Support Privé**\nLa Core Team ne vous enverra jamais de DM.`,
                    en: `### Your Digital Shield\n\nThe blockchain is freedom that requires constant vigilance.\n\n**Rule #1: Passphrase Secrecy**\nIt is NEVER shared. If asked, it's a scam.\n\n**Rule #2: Official Territory**\nAlways use Pi Browser for transactions.\n\n**Rule #3: No Private Support**\nThe Core Team will never send you a DM.`
                },
                requiredMastery: 0,
                energyCost: 10,
                xpReward: 15,
                cooldownMinutes: 0
            },
            {
                id: 'safety-l1b',
                type: 'discovery',
                title: { fr: 'Anatomie d\'un Scam', en: 'Anatomy of a Scam' },
                description: { fr: 'Identifier les faux sites et les faux admins.', en: 'Identify fake sites and fake admins.' },
                content: {
                    fr: `### Comment ils vous piègent\n\nLes arnaqueurs utilisent souvent l'urgence ou la peur.\n\n**Exemples classiques :**\n- "Validez votre KYC maintenant ou perdez vos Pi"\n- "Nouveau airdrop : déposez 10 Pi pour en recevoir 100"\n- "Support Pi : envoyez votre passphrase pour débloquer votre compte"\n\n**Soyez plus malin :**\nVérifiez toujours l'URL. Si ce n'est pas minepi.com, fuyez.`,
                    en: `### How They Trap You\n\nScammers often use urgency or fear.\n\n**Classic Examples:**\n- "Validate KYC now or lose your Pi"\n- "New airdrop: deposit 10 Pi to receive 100"\n- "Pi Support: send passphrase to unlock account"\n\n**Be Smarter:**\nAlways check the URL. If it's not minepi.com, run.`
                },
                requiredMastery: 20,
                energyCost: 15,
                xpReward: 20,
                cooldownMinutes: 0
            },
            {
                id: 'safety-l2-quiz',
                type: 'comprehension',
                title: { fr: 'Détéction d\'Arnaques', en: 'Scam Detection' },
                description: { fr: 'Anticipez les pièges du Web3.', en: 'Anticipate Web3 traps.' },
                requiredMastery: 40,
                energyCost: 40,
                xpReward: 40,
                cooldownMinutes: 45,
                questions: getLayerQuestions('safety-l2')
            },
            {
                id: 'safety-l3-lab',
                type: 'decision-lab',
                title: { fr: 'Simulation: Investigation Scam', en: 'Simulation: Scam Investigation' },
                description: { fr: 'Analysez un message suspect.', en: 'Analyze a suspicious message.' },
                requiredMastery: 70,
                energyCost: 100,
                xpReward: 100,
                cooldownMinutes: 90
            },
            {
                id: 'safety-l5-master',
                type: 'quiz',
                title: { fr: "Examen Maîtrise Sécurité", en: "Security Mastery Exam" },
                description: { fr: "Devenez un Pioneer Inattaquable.", en: "Become an Unstoppable Pioneer." },
                requiredMastery: 90,
                energyCost: 100,
                xpReward: 200,
                cooldownMinutes: 180,
                questions: getLayerQuestions('safety-l2')
            }
        ]
    },

    // ========== 4. KYC (UPDATED WITH LAB) ==========
    {
        id: 'kyc-101',
        title: { fr: 'Comprendre le Processus KYC', en: 'Understanding the KYC Process' },
        category: 'Verification',
        icon: '✅',
        description: { fr: "Démystifiez la vérification d'identité. Pourquoi elle est nécessaire et comment la réussir du premier coup.", en: "Demystify identity verification. Why it's necessary and how to pass it on your first try." },
        totalXp: 600,
        premium: false,
        locked: false,
        piReward: 0.0000003,
        difficulty: 'intermediate',
        requiredLevel: 3,  // ✅ Adjusted from 6
        requiredXP: 700,   // ✅ Fixed: Wallet gives 500XP, total ~800 after pi-intro
        requiredCourses: ['pi-wallet-101'],
        layers: [
            {
                id: 'kyc-l1',
                type: 'discovery',
                title: { fr: 'KYC : La Preuve d\'Humanité', en: 'KYC: The Proof of Humanity' },
                description: { fr: 'Pourquoi la blockchain doit savoir qui vous êtes.', en: 'Why the blockchain needs to know who you are.' },
                content: {
                    fr: `### Un Humain, Un Compte\n\nLe KYC (*Know Your Customer*) protège le réseau contre les fermes de bots.\n\n**Critères de Réussite :**\n- Lumière naturelle pour la photo.\n- Document d'identité valide et non expiré.\n- Correspondance parfaite entre votre nom et vos documents.`,
                    en: `### One Human, One Account\n\nKYC (*Know Your Customer*) protects the network against bot farms.\n\n**Success Criteria:**\n- Natural light for the photo.\n- Valid and unexpired ID document.\n- Perfect match between your name and your documents.`
                },
                requiredMastery: 0,
                energyCost: 10,
                xpReward: 15,
                cooldownMinutes: 0
            },
            {
                id: 'kyc-l1b',
                type: 'discovery',
                title: { fr: 'Guide du Validateur', en: 'Validator Guide' },
                description: { fr: 'Comment aider les autres et gagner des Pi.', en: 'How to help others and earn Pi.' },
                content: {
                    fr: `### Devenez un Validateur\n\nUne fois votre KYC passé, vous pouvez devenir un validateur pour aider les autres Pioneers de votre pays.\n\n**Le Rôle :**\nVous vérifiez anonymement les documents des autres. Chaque validation correcte vous rapporte des récompenses en Pi.`,
                    en: `### Become a Validator\n\nOnce you pass KYC, you can become a validator to help other Pioneers in your country.\n\n**The Role:**\nYou anonymously verify other people's documents. Each correct validation earns you Pi rewards.`
                },
                requiredMastery: 20,
                energyCost: 15,
                xpReward: 20,
                cooldownMinutes: 0
            },
            {
                id: 'kyc-l2',
                type: 'comprehension',
                title: { fr: 'Audit de Procédure KYC', en: 'KYC Procedure Audit' },
                description: { fr: 'Saurez-vous passer sans accrocs ?', en: 'Can you pass without issues?' },
                requiredMastery: 40,
                energyCost: 40,
                xpReward: 40,
                cooldownMinutes: 45,
                questions: getLayerQuestions('kyc-l2')
            },
            {
                id: 'kyc-l3-lab',
                type: 'decision-lab',
                title: { fr: 'Simulation: Validation KYC', en: 'Simulation: KYC Validation' },
                description: { fr: 'Pratiquez l\'envoi de vos documents.', en: 'Practice sending your documents.' },
                requiredMastery: 70,
                energyCost: 100,
                xpReward: 100,
                cooldownMinutes: 60
            },
            {
                id: 'kyc-l5-master',
                type: 'quiz',
                title: { fr: "Examen Maîtrise KYC", en: "KYC Mastery Exam" },
                description: { fr: "Assurez votre migration vers le Mainnet.", en: "Ensure your migration to Mainnet." },
                requiredMastery: 90,
                energyCost: 100,
                xpReward: 200,
                cooldownMinutes: 120,
                questions: getLayerQuestions('kyc-l2')
            }
        ]
    },

     // ========== 5. BLOCKCHAIN (UPDATED WITH LAB) ==========
    {
        id: 'blockchain-fundamentals',
        title: { fr: 'Architecture de la Blockchain', en: 'Blockchain Architecture' },
        category: 'Web3',
        icon: '⛓️',
        description: { fr: "Comprenez la mécanique interne des registres distribués. Du consensus SCP aux smart contracts.", en: "Understand the internal mechanics of distributed ledgers. From SCP consensus to smart contracts." },
        totalXp: 700,
        premium: false,
        locked: false,
        piReward: 0.000004,
        difficulty: 'intermediate',
        requiredItem: 'intermediate_license',
        requiredLevel: 4,  // ✅ Adjusted from 11
        requiredXP: 1500,  // ✅ Fixed: After kyc-101, user has ~2200 XP
        requiredCourses: ['kyc-101'],
        layers: [
            {
                id: 'blockchain-l1',
                type: 'discovery',
                title: { fr: 'La Confiance Décentralisée', en: 'Decentralized Trust' },
                description: { fr: 'Comment un réseau sans chef peut être inviolable.', en: 'How a leaderless network can be unhackable.' },
                content: {
                    fr: `### L'Infaillibilité du Registre\n\nUne blockchain n'est pas simplement une base de données, c'est un **registre immuable**.\n\n**Les Fondations :**\n\n**L'Immuabilité par le Hachage**\nChaque bloc est lié au précédent. Si un bit change, tout casse.\n\n**Le Consensus de Pi : Le SCP**\nLe réseau s'accorde via des "quorums" de confiance.`,
                    en: `### The Infallibility of the Ledger\n\nA blockchain is not just a database; it is an **immutable ledger**.\n\n**The Foundations:**\n\n**Immutability through Hashing**\nEach block links to the previous. Change one bit, break everything.\n\n**The Pi Consensus: SCP**\nThe network agrees via trust "quorums".`
                },
                requiredMastery: 0,
                energyCost: 10,
                xpReward: 15,
                cooldownMinutes: 0
            },
            {
                id: 'blockchain-l1b',
                type: 'discovery',
                title: { fr: 'Les Quorums de Confiance', en: 'The Trust Quorums' },
                description: { fr: 'Au cœur de l\'algorithme SCP.', en: 'At the heart of the SCP algorithm.' },
                content: {
                    fr: `### Comment Pi se met d'accord\n\nBitcoin utilise l'énergie (PoW), Pi utilise la confiance.\n\n**Le SCP (Stellar Consensus Protocol) :**\nAu lieu d'un vote global massif, les nœuds choisissent des quorums de confiance. Si assez de groupes s'entendent, la transaction est validée. C'est ultra-rapide et écologique.`,
                    en: `### How Pi Reaches Agreement\n\nBitcoin uses energy (PoW); Pi uses trust.\n\n**SCP (Stellar Consensus Protocol):**\nInstead of a massive global vote, nodes choose trust quorums. If enough groups agree, the transaction is validated. It's ultra-fast and eco-friendly.`
                },
                requiredMastery: 20,
                energyCost: 20,
                xpReward: 25,
                cooldownMinutes: 0
            },
            {
                id: 'blockchain-l2',
                type: 'comprehension',
                title: { fr: 'Audit Structure & Consensus', en: 'Structure & Consensus Audit' },
                description: { fr: 'Examen technique des mécanismes.', en: 'Technical exam of mechanisms.' },
                requiredMastery: 40,
                energyCost: 50,
                xpReward: 50,
                cooldownMinutes: 45,
                questions: getLayerQuestions('blockchain-l2')
            },
            {
                id: 'blockchain-l3-lab',
                type: 'decision-lab',
                title: { fr: 'Lab: Consensus de Nœud', en: 'Lab: Node Consensus' },
                description: { fr: 'Gérez des transactions conflictuelles.', en: 'Handle conflicting transactions.' },
                requiredMastery: 70,
                energyCost: 80,
                xpReward: 120,
                cooldownMinutes: 90
            },
            {
                id: 'blockchain-l5-master',
                type: 'quiz',
                title: { fr: "Examen Maîtrise Blockchain", en: "Blockchain Mastery Exam" },
                description: { fr: "Validez votre expertise technique Web3.", en: "Validate your Web3 technical expertise." },
                requiredMastery: 90,
                energyCost: 100,
                xpReward: 250,
                cooldownMinutes: 180,
                questions: getLayerQuestions('blockchain-l2')
            }
        ]
    },
    
    // ========== 6. DEFI (UPDATED WITH LAB) ==========
    {
        id: 'defi-intro',
        title: { fr: 'Exploration de la DeFi', en: 'DeFi Exploration' },
        category: 'DeFi',
        icon: '🏦',
        description: { fr: "Accédez aux services financiers du futur : AMM, Staking et Liquidity Pools sans intermédiaires.", en: "Access the financial services of the future: AMM, Staking, and Liquidity Pools without intermediaries." },
        totalXp: 900,
        premium: true,
        locked: false,
        piReward: 0.000005,
        difficulty: 'advanced',
        requiredItem: 'validator_license',
        requiredLevel: 5,   // ✅ Adjusted from 21
        requiredXP: 2500,   // ✅ Fixed: After blockchain, user has ~2900 XP
        requiredCourses: ['blockchain-fundamentals'],
        layers: [
            {
                id: 'defi-l1',
                type: 'discovery',
                title: { fr: 'La Finance sans Banques', en: 'Banking without Banks' },
                description: { fr: 'Comprendre les nouveaux protocoles de liquidité.', en: 'Understanding new liquidity protocols.' },
                content: { 
                    fr: `### La Révolution de la Liquidité\n\nLa Finance Décentralisée (**DeFi**) utilise le code pour remplacer les banquiers.\n\n**Les Piliers :**\n1. **Les AMM** (Market Makers Automatisés)\n2. **Les Pools de Liquidité**\n3. **Le Staking Stratégique**`, 
                    en: `### The Liquidity Revolution\n\nDecentralized Finance (**DeFi**) uses code to replace bankers.\n\n**The Pillars:**\n1. **AMMs** (Automated Market Makers)\n2. **Liquidity Pools**\n3. **Strategic Staking**` 
                },
                requiredMastery: 0,
                energyCost: 15,
                xpReward: 20,
                cooldownMinutes: 0
            },
            {
                id: 'defi-l1b',
                type: 'discovery',
                title: { fr: 'Risques & Rendements', en: 'Risk & Reward' },
                description: { fr: 'Gérez votre capital intelligemment.', en: 'Manage your capital smartly.' },
                content: {
                    fr: `### Ne Perdez Pas Vos Pi\n\nLe rendement élevé s'accompagne toujours de risques.\n\n**Pertes Impermanentes :**\nSi le prix du Pi change trop vite par rapport à l'autre token en pool, vous pourriez perdre de la valeur.\n\n**Smart Contract Risk :**\nUn bug dans le code peut être fatal. N'utilisez que des protocoles audités.`,
                    en: `### Don't Lose Your Pi\n\nHigh yield always comes with risk.\n\n**Impermanent Loss:**\nIf the price of Pi changes too fast relative to the other token in the pool, you could lose value.\n\n**Smart Contract Risk:**\nA bug in the code can be fatal. Only use audited protocols.`
                },
                requiredMastery: 20,
                energyCost: 20,
                xpReward: 25,
                cooldownMinutes: 0
            },
            {
                id: 'defi-l2',
                type: 'comprehension',
                title: { fr: 'Audit de Stratégies DeFi', en: 'DeFi Strategies Audit' },
                description: { fr: 'Validez votre expertise financière.', en: 'Validate your financial expertise.' },
                requiredMastery: 40,
                energyCost: 60,
                xpReward: 60,
                cooldownMinutes: 60,
                questions: getLayerQuestions('defi-l2')
            },
            {
                id: 'defi-l3-lab',
                type: 'decision-lab',
                title: { fr: 'Lab: Gestion de Liquidité', en: 'Lab: Liquidity Management' },
                description: { fr: 'Simulez un investissement en Pool.', en: 'Simulate Pool investment.' },
                requiredMastery: 70,
                energyCost: 80,
                xpReward: 120,
                cooldownMinutes: 120
            },
            {
                id: 'defi-l5-master',
                type: 'quiz',
                title: { fr: "Examen Maître de la DeFi", en: "DeFi Master Exam" },
                description: { fr: "Gouvernez vos actifs comme un expert.", en: "Govern your assets like an expert." },
                requiredMastery: 90,
                energyCost: 100,
                xpReward: 500,
                cooldownMinutes: 240,
                questions: getLayerQuestions('defi-l2')
            }
        ]
    },
    
    // ========== 7. PREMIUM MASTERCLASS (TEST) ==========
    {
        id: 'premium-masterclass',
        title: { fr: 'Masterclass: Architecture Pi', en: 'Masterclass: Pi Architecture' },
        category: 'Premium',
        icon: '💎',
        description: { fr: "Contenu exclusif réservé aux membres Premium. Analyse technique approfondie.", en: "Exclusive content for Premium members. Deep technical analysis." },
        totalXp: 1000,
        premium: true,
        locked: false,
        piReward: 0.0001,
        difficulty: 'expert',
        requiredLevel: 3,   // ✅ Adjusted from 5
        requiredXP: 1000,   // ✅ Adjusted from 2000 (accessible to motivated users)
        requiredCourses: [],
        layers: [
            {
                id: 'premium-l1',
                type: 'discovery',
                title: { fr: "Secrets du SCP & Graphe de Confiance", en: "SCP Secrets & Trust Graph" },
                description: { fr: "Plongée abyssale dans le moteur de consensus de Pi.", en: "Deep dive into Pi's consensus engine." },
                content: {
                    fr: `### Au-delà du Proof of Work\n\nLe Bitcoin gaspille de l'énergie pour sécuriser son réseau. Pi utilise l'intelligence sociale.\n\n**1. Le Federated Byzantine Agreement (FBA)**\nPi repose sur le SCP (dérivé de Stellar). Contrairement aux systèmes traditionnels où un leader est élu, ici chaque nœud décide à qui il fait confiance.\n\n**2. Les Quorum Slices**\nChaque nœud sélectionne une liste de pairs fiables (son "Quorum Slice").\n- Si le nœud A fait confiance à B et C\n- Et que B fait confiance à A et C\n- Alors un consensus émerge organiquement par intersection.\n\n**3. Le Graphe de Confiance (Trust Graph)**\nC'est la véritable innovation. C'est votre **Security Circle**. En choisissant 5 personnes de confiance, vous tissez la toile de sécurité mondiale qui empêche les attaques Sybil (faux comptes).\n\n**Pourquoi c'est incassable ?**\nPour attaquer Pi, il ne suffit pas d'acheter des super-calculateurs. Il faudrait convaincre socialement la majorité des humains honnêtes de faire confiance à des nœuds malveillants. C'est économiquement et socialement impossible à grande échelle.`,
                    en: `### Beyond Proof of Work\n\nBitcoin wastes energy to secure its network. Pi uses social intelligence.\n\n**1. Federated Byzantine Agreement (FBA)**\nPi relies on SCP (derived from Stellar). Unlike traditional systems where a leader is elected, here each node decides whom to trust.\n\n**2. Quorum Slices**\nEach node selects a list of reliable peers (its "Quorum Slice").\n- If node A trusts B and C\n- And B trusts A and C\n- Then consensus emerges organically through intersection.\n\n**3. The Trust Graph**\nThis is the real innovation. This is your **Security Circle**. By choosing 5 trusted people, you weave the global security web that prevents Sybil attacks (fake accounts).\n\n**Why is it unbreakable?**\nTo attack Pi, simply buying supercomputers isn't enough. You would have to socially convince the majority of honest humans to trust malicious nodes. This is economically and socially impossible at scale.`
                },
                requiredMastery: 0,
                energyCost: 50,
                xpReward: 300,
                cooldownMinutes: 0
            }
        ]
    }
];

export const getCourses = (language: string = 'en'): Course[] => {
    const targetLang = (language === 'fr' || language === 'en') ? language : 'en';

    return RAW_COURSES.map(course => ({
        ...course,
        requiredLevel: course.requiredLevel,
        requiredXP: course.requiredXP,
        requiredCourses: course.requiredCourses,
        title: course.title[targetLang] || course.title['en'],
        description: course.description[targetLang] || course.description['en'],
        layers: course.layers.map(layer => {
            // Strictly typed Layer construction
            const baseLayer: Layer = {
                id: layer.id,
                type: layer.type,
                title: layer.title[targetLang] || layer.title['en'],
                description: layer.description[targetLang] || layer.description['en'],
                content: layer.content 
                    ? (typeof layer.content === 'string' ? layer.content : (layer.content[targetLang] || layer.content['en'])) 
                    : undefined,
                requiredMastery: layer.requiredMastery,
                energyCost: layer.energyCost,
                xpReward: layer.xpReward,
                cooldownMinutes: layer.cooldownMinutes,
                questions: layer.questions && layer.questions.length > 0 
                    ? layer.questions 
                    : getRandomQuestions(layer.id, layer.type === 'quiz' ? 10 : 5, targetLang)
            } as Layer;

            // DYNAMIC: Inject random scenario for Labs
            if (layer.type === 'decision-lab') {
                const scenario = getRandomLabScenario(layer.id, targetLang);
                if (scenario) {
                    baseLayer.interactiveData = scenario;
                } else {
                    console.warn(`No scenario found for Lab ${layer.id} in ${targetLang}`);
                    // Fallback to empty context
                     baseLayer.interactiveData = {
                        initialState: "Scenario data unavailable. Please check backend configuration.",
                        actions: [],
                        winningCondition: []
                     };
                }
            }

            return baseLayer;
        })
    }));
};

export const COURSES = getCourses('fr');
