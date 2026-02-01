import { InteractiveData } from '../types';

// Helper types for bilingual scenarios
export type TranslatableAction = {
    id: string;
    label: { fr: string; en: string };
    energyCost: number;
    feedbackType: 'positive' | 'negative' | 'warning' | 'info';
    feedback: { fr: string; en: string };
    consequence?: { xpChange?: number };
};

export type TranslatableInteractiveData = {
    title?: { fr: string; en: string }; // Contextual Title
    initialState: { fr: string; en: string };
    actions: TranslatableAction[];
    winningCondition: string[];
};

// ==========================================
// 🧪 LAB SCENARIO DATABASE
// ==========================================

export const LAB_SCENARIOS: Record<string, TranslatableInteractiveData[]> = {
    // ------------------------------------------------------------------
    // 💳 WALLET MASTERY LABS
    // ------------------------------------------------------------------
    'wallet-l3-lab': [
        // SCENARIO 1: BACKUP (Classic)
        {
            title: { fr: "Mission: Sauvegarde Critique", en: "Mission: Critical Backup" },
            initialState: {
                fr: "### Mission: Sécuriser votre Fortune\n\nVous venez de générer votre nouveau Pi Wallet. Votre passphrase de 24 mots s'affiche à l'écran. Que faites-vous pour la sauvegarder de manière optimale ?",
                en: "### Mission: Secure your Fortune\n\nYou have just generated your new Pi Wallet. Your 24-word passphrase is displayed on the screen. What do you do to back it up optimally?"
            },
            actions: [
                {
                    id: 'act-1',
                    label: { fr: 'Prendre un Screenshot', en: 'Take a Screenshot' },
                    energyCost: 5,
                    feedback: { 
                        fr: "⚠️ Risque élevé ! Si votre téléphone est piraté ou synchronisé sur le cloud, votre passphrase est exposée.",
                        en: "⚠️ High Risk! If your phone is hacked or synced to the cloud, your passphrase is exposed."
                    },
                    feedbackType: 'warning'
                },
                {
                    id: 'act-2',
                    label: { fr: 'Copier sur Papier (x2)', en: 'Write on Paper (x2)' },
                    energyCost: 10,
                    feedback: {
                        fr: "✅ Excellent ! C'est la méthode 'Cold Storage' la plus sûre. Gardez les deux copies dans des lieux physiques différents.",
                        en: "✅ Excellent! This is the safest 'Cold Storage' method. Keep the two copies in different physical locations."
                    },
                    feedbackType: 'positive',
                    consequence: { xpChange: 100 }
                },
                {
                    id: 'act-3',
                    label: { fr: 'Envoyer par Email', en: 'Send via Email' },
                    energyCost: 5,
                    feedback: {
                        fr: "❌ DANGER ! Les serveurs email sont des cibles prioritaires. Ne stockez jamais de passphrase en clair en ligne.",
                        en: "❌ DANGER! Email servers are priority targets. Never store a plaintext passphrase online."
                    },
                    feedbackType: 'negative',
                    consequence: { xpChange: -50 }
                }
            ],
            winningCondition: ['act-2']
        },
        // SCENARIO 2: PUBLIC vs PRIVATE KEY (New)
        {
            title: { fr: "Mission: Recevoir un Paiement", en: "Mission: Receive Payment" },
            initialState: {
                fr: "### Contexte\n\nUn ami Pioneer souhaite vous envoyer 50 Pi pour un service rendu. Il vous demande vos coordonnées bancaires Pi. Que lui envoyez-vous ?",
                en: "### Context\n\nA Pioneer friend wants to send you 50 Pi for a service. He asks for your Pi banking details. What do you send him?"
            },
            actions: [
                {
                    id: 'w2-act-1',
                    label: { fr: 'Votre Passphrase (24 mots)', en: 'Your Passphrase (24 words)' },
                    energyCost: 5,
                    feedback: {
                        fr: "❌ STOP ! Ne jamais partager votre Passphrase. Vous donneriez le contrôle total de votre compte à votre ami.",
                        en: "❌ STOP! Never share your Passphrase. You would be giving full control of your account to your friend."
                    },
                    feedbackType: 'negative',
                    consequence: { xpChange: -100 }
                },
                {
                    id: 'w2-act-2',
                    label: { fr: 'Votre Clé Publique (Adresse G...)', en: 'Your Public Key (Address G...)' },
                    energyCost: 5,
                    feedback: {
                        fr: "✅ Correct ! C'est comme votre RIB. Elle est faite pour être partagée sans risque.",
                        en: "✅ Correct! This is like your bank account number. It is safe to share."
                    },
                    feedbackType: 'positive',
                    consequence: { xpChange: 80 }
                },
                {
                    id: 'w2-act-3',
                    label: { fr: 'Votre numéro de téléphone', en: 'Your phone number' },
                    energyCost: 2,
                    feedback: {
                        fr: "⚠️ Inefficace. Sur la blockchain, les transactions se font d'adresse à adresse, pas par numéro de mobile.",
                        en: "⚠️ Ineffective. On the blockchain, transactions are address-to-address, not via mobile number."
                    },
                    feedbackType: 'info'
                }
            ],
            winningCondition: ['w2-act-2']
        }
    ],

    // ------------------------------------------------------------------
    // 🛡️ ANTI-SCAM LABS
    // ------------------------------------------------------------------
    'safety-l3-lab': [
        // SCENARIO 1: PHISHING DM (Classic)
        {
            title: { fr: "Analyse de Menace : DM Suspect", en: "Threat Analysis: Suspicious DM" },
            initialState: {
                fr: `### Dossier d'Investigation #104
**Sujet :** Message suspect sur les réseaux sociaux.
Vous recevez une notification d'un compte nommé "Pi Core Official Support" avec le logo de Pi Network.
> "Cher Pionnier, nous avons détecté une activité inhabituelle sur votre compte. Pour sécuriser votre solde Mainnet avant le prochain brûlage massif, merci de synchroniser votre wallet sur notre portail sécurisé : https://pi-network-verification.tk"
**Quelle est votre analyse stratégique ?**`,
                en: `### Investigation File #104
**Subject:** Suspicious social media message.
You receive a notification from an account named "Pi Core Official Support" featuring the Pi Network logo.
> "Dear Pioneer, we have detected unusual activity on your account. To secure your Mainnet balance before the next massive burn, please sync your wallet on our secure portal: https://pi-network-verification.tk"
**What is your strategic analysis?**`
            },
            actions: [
                {
                    id: 'scam-act-1',
                    label: { fr: 'Cliquer pour "Vérifier"', en: 'Click to "Verify"' },
                    energyCost: 10,
                    feedback: {
                        fr: "❌ ÉCHEC CRITIQUE ! Le site a aspiré votre passphrase. Vos fonds ont été transférés vers une adresse de pirate en quelques secondes.",
                        en: "❌ CRITICAL FAILURE! The site sucked your passphrase. Your funds were transferred to a hacker's address in seconds."
                    },
                    feedbackType: 'negative',
                    consequence: { xpChange: -200 }
                },
                {
                    id: 'scam-act-2',
                    label: { fr: 'Inspecter l\'URL (Analyse)', en: 'Inspect the URL (Analysis)' },
                    energyCost: 5,
                    feedback: {
                        fr: "🔍 Observation : L'extension '.tk' est gratuite et suspecte. Le domaine officiel est 'minepi.com'.",
                        en: "🔍 Observation: The '.tk' extension is free and suspicious. The official domain is 'minepi.com'."
                    },
                    feedbackType: 'warning'
                },
                {
                    id: 'scam-act-3',
                    label: { fr: 'Signaler, Bloquer et Alerter', en: 'Report, Block and Alert' },
                    energyCost: 5,
                    feedback: {
                        fr: "✅ EXCELLENCE ! Vous avez identifié les red flags : DM direct + lien externe.",
                        en: "✅ EXCELLENCE! You identified the red flags: direct DM + external link."
                    },
                    feedbackType: 'positive',
                    consequence: { xpChange: 150 }
                }
            ],
            winningCondition: ['scam-act-3']
        },
        // SCENARIO 2: ILLEGAL SALE (New)
        {
            title: { fr: "Dilemme : Vente de Pi", en: "Dilemma: Selling Pi" },
            initialState: {
                fr: "### Dossier #209: Offre Alléchante\n\nUn utilisateur dans le chat général propose : 'Je vends mes 1000 Pi pour 100$ immédiatement via PayPal. Paiement rapide garanti.'\nQue faites-vous ?",
                en: "### File #209: Tempting Offer\n\nA user in the general chat offers: 'Selling my 1000 Pi for $100 immediately via PayPal. Fast payment guaranteed.'\nWhat do you do?"
            },
            actions: [
                {
                    id: 's2-act-1',
                    label: { fr: 'Accepter l\'offre', en: 'Accept the offer' },
                    energyCost: 5,
                    feedback: {
                        fr: "❌ INTERDIT. La vente de Pi contre fiat/crypto est strictement interdite durant la période Enclosed Mainnet. Votre compte risque le bannissement.",
                        en: "❌ FORBIDDEN. Selling Pi for fiat/crypto is strictly prohibited during the Enclosed Mainnet. Your account risks banning."
                    },
                    feedbackType: 'negative',
                    consequence: { xpChange: -150 }
                },
                {
                    id: 's2-act-2',
                    label: { fr: 'Ignorer simplement', en: 'Ignore simply' },
                    energyCost: 0,
                    feedback: {
                        fr: "😐 Passable. Vous ne prenez pas de risque, mais vous laissez un scammer potentiel agir.",
                        en: "😐 Fair. You take no risk, but you let a potential scammer act."
                    },
                    feedbackType: 'info'
                },
                {
                    id: 's2-act-3',
                    label: { fr: 'Signaler le message aux Mods', en: 'Report message to Mods' },
                    energyCost: 5,
                    feedback: {
                        fr: "✅ Bravo ! Vous protégez l'intégrité de l'écosystème. Les échanges illicites retardent l'Open Mainnet.",
                        en: "✅ Bravo! You protect the ecosystem integrity. Illicit exchanges delay Open Mainnet."
                    },
                    feedbackType: 'positive',
                    consequence: { xpChange: 100 }
                }
            ],
            winningCondition: ['s2-act-3']
        }
    ],

    // ------------------------------------------------------------------
    // 🆔 KYC LABS (New)
    // ------------------------------------------------------------------
    'kyc-l3-lab': [
        {
            title: { fr: "Atelier Photo KYC", en: "KYC Photo Workshop" },
            initialState: {
                fr: "### Simulation KYC : Étape Photo\n\nVous devez soumettre la photo de votre pièce d'identité. La lumière est faible dans votre chambre.",
                en: "### KYC Simulation: Photo Step\n\nYou need to submit your ID photo. The light is dim in your room."
            },
            actions: [
                {
                    id: 'k1-act-1',
                    label: { fr: 'Prendre la photo avec le flash', en: 'Take photo with flash' },
                    energyCost: 5,
                    feedback: {
                        fr: "⚠️ Attention. Le flash crée souvent des reflets sur les cartes plastifiées, rendant le texte illisible pour l'IA.",
                        en: "⚠️ Warning. Flash often creates glare on plastic cards, making text unreadable for AI."
                    },
                    feedbackType: 'warning'
                },
                {
                    id: 'k1-act-2',
                    label: { fr: 'Allumer une lampe et éviter les ombres', en: 'Turn on a lamp and avoid shadows' },
                    energyCost: 5,
                    feedback: {
                        fr: "✅ Parfait. Une lumière indirecte et claire assure la meilleure validation rapide.",
                        en: "✅ Perfect. Indirect, clear light ensures the best fast validation."
                    },
                    feedbackType: 'positive',
                    consequence: { xpChange: 100 }
                },
                {
                    id: 'k1-act-3',
                    label: { fr: 'Utiliser une photocopie noir et blanc', en: 'Use a black and white photocopy' },
                    energyCost: 2,
                    feedback: {
                        fr: "❌ Refusé. Seuls les documents originaux en couleur sont acceptés.",
                        en: "❌ Rejected. Only original color documents are accepted."
                    },
                    feedbackType: 'negative'
                }
            ],
            winningCondition: ['k1-act-2']
        }
    ],

    // ------------------------------------------------------------------
    // ⛓️ BLOCKCHAIN LABS (New)
    // ------------------------------------------------------------------
    'blockchain-l3-lab': [
        {
            title: { fr: "Rôle de Nœud : Consensus", en: "Node Role: Consensus" },
            initialState: {
                fr: "### Laboratoire de Consensus\n\nVous êtes un Nœud du réseau Pi. Une transaction conflictuelle arrive : Alice envoie ses mêmes 10 Pi à Bob et à Charlie en même temps (Double Spend). Que faites-vous ?",
                en: "### Consensus Lab\n\nYou are a Pi Node. A conflicting transaction arrives: Alice sends her same 10 Pi to Bob and Charlie simultaneously (Double Spend). What do you do?"
            },
            actions: [
                {
                    id: 'b1-act-1',
                    label: { fr: 'Valider les deux pour être sympa', en: 'Validate both to be nice' },
                    energyCost: 5,
                    feedback: {
                        fr: "❌ Impossible. Cela briserait la comptabilité totale et l'intégrité de la monnaie.",
                        en: "❌ Impossible. This would break total supply and currency integrity."
                    },
                    feedbackType: 'negative',
                    consequence: { xpChange: -100 }
                },
                {
                    id: 'b1-act-2',
                    label: { fr: 'Consulter votre Quorum de confiance', en: 'Consult your Trust Quorum' },
                    energyCost: 10,
                    feedback: {
                        fr: "✅ C'est le SCP ! Votre nœud regarde ce que les nœuds de confiance (Nicolas, etc.) ont vu en premier et s'aligne sur la majorité.",
                        en: "✅ This is SCP! Your node checks what trusted nodes (Nicolas, etc.) saw first and aligns with majority."
                    },
                    feedbackType: 'positive',
                    consequence: { xpChange: 200 }
                }
            ],
            winningCondition: ['b1-act-2']
        }
    ],

    // ------------------------------------------------------------------
    // 🏦 DEFI LABS (New)
    // ------------------------------------------------------------------
    'defi-l3-lab': [
        {
            title: { fr: "Gestion de Liquidity Pool", en: "Liquidity Pool Management" },
            initialState: {
                fr: "### Simulation Liquidity Pool\n\nVous déposez 100 Pi et 100 USDC dans une pool. Le prix du Pi double soudainement sur le marché. Que se passe-t-il dans votre pool ?",
                en: "### Liquidity Pool Simulation\n\nYou deposit 100 Pi and 100 USDC in a pool. The price of Pi suddenly doubles on the market. What happens in your pool?"
            },
            actions: [
                {
                    id: 'd1-act-1',
                    label: { fr: 'Rien, j\'ai toujours 100 Pi', en: 'Nothing, I still have 100 Pi' },
                    energyCost: 5,
                    feedback: {
                        fr: "❌ Faux. Pour maintenir l'équilibre de valeur 50/50, l'algorithme a vendu une partie de vos Pi montants contre plus d'USDC.",
                        en: "❌ Wrong. To maintain 50/50 value balance, algorithm sold some of your rising Pi for more USDC."
                    },
                    feedbackType: 'warning'
                },
                {
                    id: 'd1-act-2',
                    label: { fr: 'Je subis une "Impermanent Loss"', en: 'I suffer "Impermanent Loss"' },
                    energyCost: 10,
                    feedback: {
                        fr: "✅ Exact. Vous avez moins de Pi qu'au départ (mais plus d'USDC). Si vous retirez maintenant, la perte virtuelle devient réelle comparée au HODL.",
                        en: "✅ Correct. You have fewer Pi than allowed (but more USDC). If you withdraw now, the virtual loss becomes real compared to HODL."
                    },
                    feedbackType: 'positive',
                    consequence: { xpChange: 150 }
                }
            ],
            winningCondition: ['d1-act-2']
        }
    ]
};

/**
 * Returns a random lab scenario for a given layer ID and language.
 * Default to English if scenario missing.
 */
export const getRandomLabScenario = (layerId: string, lang: 'fr' | 'en'): InteractiveData | null => {
    const scenarios = LAB_SCENARIOS[layerId];
    if (!scenarios || scenarios.length === 0) return null;

    // Pick random
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    // Localize
    return {
        title: randomScenario.title ? (randomScenario.title[lang] || randomScenario.title['en']) : undefined,
        initialState: randomScenario.initialState[lang] || randomScenario.initialState['en'],
        actions: randomScenario.actions.map(a => ({
            id: a.id,
            label: a.label[lang] || a.label['en'],
            energyCost: a.energyCost,
            feedbackType: a.feedbackType,
            feedback: a.feedback[lang] || a.feedback['en'],
            consequence: a.consequence
        })),
        winningCondition: randomScenario.winningCondition
    };
};
