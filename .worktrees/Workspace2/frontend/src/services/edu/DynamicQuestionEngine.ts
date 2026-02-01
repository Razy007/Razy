import { QuizQuestion, UserProgress, Layer } from '../../types';

/**
 * 🎮 DYNAMIC QUESTION ENGINE
 * 
 * Génère des questions contextuelles et adaptatives pour chaque cours
 * - Questions uniques par session
 * - Adaptation au niveau de l'utilisateur
 * - Contexte spécifique à chaque layer
 * - Pool massif pour éviter la répétition
 */

// Template de questions par topic et difficulté
interface QuestionTemplate {
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    cognitiveLevel: 'knowledge' | 'comprehension' | 'application' | 'analysis';
    templates: {
        question: string;
        options: string[];
        correct: number;
        explanation: string;
        trapType?: 'scam_awareness' | 'misconception' | 'precision' | 'none';
        variables?: { [key: string]: string[] }; // Pour générer des variations
    }[];
}

// 🎯 POOL MASSIF DE QUESTIONS PAR TOPIC
const QUESTION_POOLS: QuestionTemplate[] = [
    // ========== PI BASICS ==========
    {
        topic: 'pi-basics',
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        templates: [
            {
                question: "Qu'est-ce qui rend Pi Network unique par rapport aux autres cryptomonnaies?",
                options: ["Minage sur smartphone sans batterie", "Minage GPU intensif", "Proof of Work classique", "Nécessite des ASIC"],
                correct: 0,
                explanation: "Pi Network permet le minage mobile sans consommer de ressources, le rendant accessible à tous.",
                trapType: 'none'
            },
            {
                question: "Combien de personnes peuvent miner Pi Network simultanément?",
                options: ["Illimité", "Maximum 1 million", "Seulement les KYC", "Seulement les pionniers"],
                correct: 0,
                explanation: "Pi Network est conçu pour être accessible à tous, sans limite de participants.",
                trapType: 'none'
            },
            {
                question: "Quel est le protocole de consensus utilisé par Pi Network?",
                options: ["Proof of Work", "Stellar Consensus Protocol (SCP)", "Proof of Stake", "Delegated Proof of Stake"],
                correct: 1,
                explanation: "Pi utilise le SCP, un protocole efficace et écologique basé sur la confiance.",
                trapType: 'none'
            },
            {
                question: "Quelle est la vision principale de Pi Network?",
                options: ["Remplacer Bitcoin", "Créer la crypto la plus accessible au monde", "Devenir la plus chère", "Être réservée aux experts"],
                correct: 1,
                explanation: "Pi vise à démocratiser l'accès aux cryptomonnaies pour tous.",
                trapType: 'none'
            },
            {
                question: "Pi Network consomme-t-il beaucoup de batterie lors du minage?",
                options: ["Oui, comme Bitcoin", "Non, consommation minimale", "Seulement la nuit", "Oui, il faut charger constamment"],
                correct: 1,
                explanation: "Le minage Pi est conçu pour être économe en énergie et ne draine pas la batterie.",
                trapType: 'misconception'
            }
        ]
    },
    {
        topic: 'pi-basics',
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        templates: [
            {
                question: "Pourquoi Pi Network a-t-il choisi le Stellar Consensus Protocol?",
                options: [
                    "Pour consommer plus d'énergie",
                    "Pour permettre un consensus rapide et écologique",
                    "Pour être compatible avec Bitcoin",
                    "Pour nécessiter des GPU"
                ],
                correct: 1,
                explanation: "Le SCP permet un consensus efficace sans la consommation énergétique du Proof of Work.",
                trapType: 'none'
            },
            {
                question: "Quelle est la différence entre Testnet et Mainnet?",
                options: [
                    "Aucune différence",
                    "Testnet = test, Mainnet = production réelle",
                    "Testnet est plus rapide",
                    "Mainnet est gratuit"
                ],
                correct: 1,
                explanation: "Le Testnet est un environnement de test, le Mainnet est la blockchain de production.",
                trapType: 'none'
            },
            {
                question: "Que signifie 'Enclosed Mainnet'?",
                options: [
                    "Mainnet fermé aux échanges externes",
                    "Mainnet seulement pour les KYC",
                    "Mainnet en maintenance",
                    "Mainnet gratuit"
                ],
                correct: 0,
                explanation: "L'Enclosed Mainnet interdit les échanges fiat pour protéger l'écosystème durant la phase de croissance.",
                trapType: 'misconception'
            }
        ]
    },

    // ========== PI ECONOMICS ==========
    {
        topic: 'pi-economics',
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        templates: [
            {
                question: "Quel est le GCV (General Consensus Value) de Pi?",
                options: ["$100", "$314.159", "$1000", "$50"],
                correct: 1,
                explanation: "Le GCV est fixé à $314.159, référence au nombre π (3.14159).",
                trapType: 'none'
            },
            {
                question: "Que signifie GCV?",
                options: [
                    "Global Crypto Value",
                    "General Consensus Value",
                    "Great Community Vision",
                    "Guaranteed Coin Value"
                ],
                correct: 1,
                explanation: "GCV = General Consensus Value, la valeur consensuelle de Pi.",
                trapType: 'none'
            },
            {
                question: "Pourquoi le GCV est-il important?",
                options: [
                    "C'est le prix minimum garanti",
                    "C'est une référence pour les échanges internes",
                    "C'est le prix maximum",
                    "Il n'a aucune importance"
                ],
                correct: 1,
                explanation: "Le GCV sert de référence pour les transactions dans l'écosystème Pi.",
                trapType: 'misconception'
            }
        ]
    },
    {
        topic: 'pi-economics',
        difficulty: 'medium',
        cognitiveLevel: 'application',
        templates: [
            {
                question: "Si un produit coûte 10 Pi et le GCV est $314.159, quelle est sa valeur en dollars?",
                options: ["$314.159", "$3,141.59", "$31.42", "$100"],
                correct: 1,
                explanation: "10 Pi × $314.159 = $3,141.59. Le GCV sert de référence de calcul.",
                trapType: 'precision'
            },
            {
                question: "Pourquoi les échanges fiat sont-ils interdits durant l'Enclosed Mainnet?",
                options: [
                    "Pour protéger l'écosystème et éviter la spéculation",
                    "Pour garder Pi gratuit",
                    "Pour empêcher les gens de vendre",
                    "C'est temporaire, juste 1 mois"
                ],
                correct: 0,
                explanation: "L'Enclosed Mainnet protège l'écosystème durant sa phase de développement.",
                trapType: 'misconception'
            }
        ]
    },

    // ========== SECURITY ==========
    {
        topic: 'security',
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        templates: [
            {
                question: "Qui peut réinitialiser votre Passphrase si vous la perdez?",
                options: ["Pi Core Team", "Votre Security Circle", "Personne", "Votre Validator"],
                correct: 2,
                explanation: "Wallet non-custodial = aucune entité ne peut récupérer votre Passphrase. Vous êtes votre propre banque.",
                trapType: 'misconception'
            },
            {
                question: "Combien de mots contient une Passphrase Pi Wallet?",
                options: ["12 mots", "24 mots", "16 mots", "8 mots"],
                correct: 1,
                explanation: "La Passphrase Pi Wallet contient 24 mots uniques à mémoriser ou stocker en sécurité.",
                trapType: 'none'
            },
            {
                question: "Où devez-vous stocker votre Passphrase?",
                options: [
                    "Dans le cloud (Google Drive)",
                    "Sur papier, en lieu sûr",
                    "Dans un email",
                    "Dans une photo sur votre téléphone"
                ],
                correct: 1,
                explanation: "La Passphrase doit être stockée hors ligne, sur papier, dans un endroit sécurisé.",
                trapType: 'scam_awareness'
            }
        ]
    },
    {
        topic: 'security',
        difficulty: 'medium',
        cognitiveLevel: 'application',
        templates: [
            {
                question: "Un 'modérateur' vous contacte pour 'vérifier votre wallet'. Que faites-vous?",
                options: [
                    "Je donne ma Passphrase",
                    "Je le signale immédiatement (c'est une arnaque)",
                    "Je donne seulement 12 mots",
                    "Je vérifie son badge d'abord"
                ],
                correct: 1,
                explanation: "Les modérateurs et la Core Team ne demanderont JAMAIS votre Passphrase. C'est une arnaque classique.",
                trapType: 'scam_awareness'
            },
            {
                question: "Vous recevez un email 'URGENT: Vérifiez votre wallet sur pi-verify.com'. Que faites-vous?",
                options: [
                    "Je clique et vérifie",
                    "J'ignore et signale (phishing)",
                    "Je transfère à mes amis",
                    "Je vérifie l'expéditeur seulement"
                ],
                correct: 1,
                explanation: "Domaine officiel = minepi.com. Toute demande 'urgente' est probablement du phishing.",
                trapType: 'scam_awareness'
            }
        ]
    },

    // ========== SCAMS ==========
    {
        topic: 'scams',
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        templates: [
            {
                question: "Un site promet d'échanger vos Pi contre des $ maintenant. Que pensez-vous?",
                options: [
                    "Bonne opportunité",
                    "Arnaque (Enclosed Mainnet interdit échanges fiat)",
                    "Je teste avec 1 Pi",
                    "Je demande à mes amis"
                ],
                correct: 1,
                explanation: "Durant l'Enclosed Mainnet, les échanges Pi ↔ fiat sont interdits. C'est une arnaque garantie.",
                trapType: 'scam_awareness'
            },
            {
                question: "Quelqu'un vous offre 100 Pi gratuits si vous donnez votre Passphrase. Réaction?",
                options: [
                    "J'accepte, c'est gratuit!",
                    "Je refuse et signale (arnaque évidente)",
                    "Je négocie pour 200 Pi",
                    "Je donne seulement la moitié de ma Passphrase"
                ],
                correct: 1,
                explanation: "Ne JAMAIS partager votre Passphrase, même pour des promesses alléchantes.",
                trapType: 'scam_awareness'
            },
            {
                question: "Un 'membre de la Core Team' vous DM sur Telegram. Red flag?",
                options: [
                    "Non, c'est normal",
                    "OUI - La Core Team ne DM jamais en premier",
                    "Seulement si il demande de l'argent",
                    "Non si il a un badge"
                ],
                correct: 1,
                explanation: "La Core Team ne contacte jamais les utilisateurs en DM. C'est toujours une arnaque.",
                trapType: 'scam_awareness'
            }
        ]
    },

    // ========== KYC ==========
    {
        topic: 'kyc',
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        templates: [
            {
                question: "Pourquoi le KYC est-il nécessaire pour Pi?",
                options: [
                    "Vendre vos données",
                    "Assurer 1 personne = 1 compte",
                    "C'est facultatif",
                    "Payer des impôts"
                ],
                correct: 1,
                explanation: "Le KYC garantit l'intégrité du réseau en empêchant les faux comptes et les bots.",
                trapType: 'misconception'
            },
            {
                question: "Qu'est-ce que le 'Liveness Check'?",
                options: [
                    "Test de respiration",
                    "Selfie vidéo pour prouver que vous êtes humain",
                    "Analyse sanguine",
                    "Test de QI"
                ],
                correct: 1,
                explanation: "Le Liveness Check est un selfie vidéo pour confirmer que vous êtes une personne réelle.",
                trapType: 'none'
            },
            {
                question: "Combien de temps dure la période d'attente KYC?",
                options: ["7 jours", "14 jours", "30 jours", "1 jour"],
                correct: 1,
                explanation: "La période d'attente standard est de 14 jours après la soumission du KYC.",
                trapType: 'none'
            }
        ]
    },

    // ========== BLOCKCHAIN ==========
    {
        topic: 'blockchain',
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        templates: [
            {
                question: "Qu'est-ce qu'une blockchain?",
                options: [
                    "Une chaîne physique",
                    "Un registre distribué et immuable",
                    "Un type de cryptographie",
                    "Un réseau social"
                ],
                correct: 1,
                explanation: "La blockchain est un registre distribué qui enregistre les transactions de manière sécurisée.",
                trapType: 'none'
            },
            {
                question: "Que signifie 'décentralisé'?",
                options: [
                    "Contrôlé par une entité",
                    "Distribué sur plusieurs nœuds",
                    "Stocké dans le cloud",
                    "Géré par des banques"
                ],
                correct: 1,
                explanation: "La décentralisation signifie que le réseau est distribué sur plusieurs nœuds indépendants.",
                trapType: 'none'
            },
            {
                question: "Peut-on modifier une transaction déjà enregistrée sur la blockchain?",
                options: [
                    "Oui, avec permission",
                    "Non, c'est immuable",
                    "Oui, si on paie",
                    "Seulement les admins peuvent"
                ],
                correct: 1,
                explanation: "L'immuabilité est une caractéristique fondamentale de la blockchain.",
                trapType: 'none'
            }
        ]
    },

    // ========== DEFI ==========
    {
        topic: 'defi',
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        templates: [
            {
                question: "Qu'est-ce qu'un DEX (Decentralized Exchange)?",
                options: [
                    "Une banque en ligne",
                    "Un échange sans intermédiaire central",
                    "Un wallet",
                    "Un token"
                ],
                correct: 1,
                explanation: "Un DEX permet d'échanger des cryptos directement entre utilisateurs, sans autorité centrale.",
                trapType: 'none'
            },
            {
                question: "Qu'est-ce que le 'Yield Farming'?",
                options: [
                    "Cultiver des légumes",
                    "Générer des rendements en fournissant de la liquidité",
                    "Miner du Bitcoin",
                    "Acheter des NFTs"
                ],
                correct: 1,
                explanation: "Le Yield Farming consiste à fournir de la liquidité à des protocoles DeFi en échange de récompenses.",
                trapType: 'none'
            },
            {
                question: "Quel est le principal risque du DeFi?",
                options: [
                    "Aucun risque",
                    "Bugs de smart contracts et volatilité",
                    "Trop de profits",
                    "C'est illégal"
                ],
                correct: 1,
                explanation: "Le DeFi comporte des risques techniques (bugs) et financiers (volatilité).",
                trapType: 'misconception'
            }
        ]
    },

    // ========== PHISHING ==========
    {
        topic: 'phishing',
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        templates: [
            {
                question: "Email: 'Votre compte Pi sera suspendu. Cliquez ici: pi-network-secure.net'. Analyse?",
                options: [
                    "Légitime, je clique",
                    "Phishing évident (domaine frauduleux + urgence artificielle)",
                    "Je vérifie l'expéditeur seulement",
                    "Je transfère à mes amis"
                ],
                correct: 1,
                explanation: "Domaine officiel = minepi.com. Urgence artificielle = tactique de phishing classique.",
                trapType: 'scam_awareness'
            },
            {
                question: "Comment vérifier qu'un site Pi est légitime?",
                options: [
                    "Vérifier le design",
                    "Vérifier le domaine (doit être minepi.com)",
                    "Vérifier les couleurs",
                    "Demander sur les réseaux sociaux"
                ],
                correct: 1,
                explanation: "Le domaine officiel est le seul indicateur fiable. Tout autre domaine est suspect.",
                trapType: 'scam_awareness'
            }
        ]
    }
];

export class DynamicQuestionEngine {
    /**
     * Génère des questions contextuelles pour un layer spécifique
     * @param layer - Le layer actuel
     * @param userProgress - Progression de l'utilisateur
     * @param count - Nombre de questions à générer
     * @returns Questions adaptées au contexte et au niveau
     */
    static generateContextualQuestions(
        layer: Layer,
        userProgress: UserProgress,
        count: number = 5
    ): QuizQuestion[] {
        // Déterminer le topic principal du layer
        const layerTopic = this.extractTopicFromLayer(layer);
        
        // Déterminer la difficulté basée sur le niveau de l'utilisateur
        const userDifficulty = this.calculateUserDifficulty(userProgress);
        
        // Filtrer les questions pertinentes
        const relevantPools = QUESTION_POOLS.filter(pool => 
            pool.topic === layerTopic && 
            this.isDifficultyAppropriate(pool.difficulty, userDifficulty)
        );
        
        if (relevantPools.length === 0) {
            // Fallback: retourner les questions du layer si disponibles
            return layer.questions || [];
        }
        
        // Sélectionner des questions aléatoires sans répétition récente
        const questions: QuizQuestion[] = [];
        const usedQuestions = new Set<string>();
        
        // Récupérer l'historique des questions récentes
        const recentQuestions = this.getRecentQuestions(userProgress, 50);
        
        for (const pool of relevantPools) {
            for (const template of pool.templates) {
                // Éviter les questions récemment posées
                const questionId = this.generateQuestionId(template.question);
                if (recentQuestions.has(questionId) || usedQuestions.has(questionId)) {
                    continue;
                }
                
                questions.push({
                    id: questionId,
                    question: template.question,
                    options: template.options,
                    correct: template.correct,
                    explanation: template.explanation,
                    difficulty: pool.difficulty,
                    cognitiveLevel: pool.cognitiveLevel,
                    topic: pool.topic,
                    trapType: template.trapType || 'none'
                });
                
                usedQuestions.add(questionId);
                
                if (questions.length >= count) break;
            }
            if (questions.length >= count) break;
        }
        
        // Mélanger les questions
        return this.shuffleArray(questions).slice(0, count);
    }
    
    /**
     * Extrait le topic principal d'un layer
     */
    private static extractTopicFromLayer(layer: Layer): string {
        // Analyser le titre et la description pour déterminer le topic
        const text = `${layer.title} ${layer.description}`.toLowerCase();
        
        if (text.includes('wallet') || text.includes('passphrase')) return 'security';
        if (text.includes('scam') || text.includes('arnaque') || text.includes('phishing')) return 'scams';
        if (text.includes('kyc') || text.includes('vérification')) return 'kyc';
        if (text.includes('blockchain')) return 'blockchain';
        if (text.includes('defi') || text.includes('finance')) return 'defi';
        if (text.includes('gcv') || text.includes('économie')) return 'pi-economics';
        
        return 'pi-basics'; // Default
    }
    
    /**
     * Calcule la difficulté appropriée pour l'utilisateur
     */
    private static calculateUserDifficulty(userProgress: UserProgress): 'easy' | 'medium' | 'hard' | 'expert' {
        const level = userProgress.level;
        const accuracy = this.calculateAccuracy(userProgress);
        
        if (level >= 20 && accuracy > 0.85) return 'expert';
        if (level >= 10 && accuracy > 0.75) return 'hard';
        if (level >= 5 && accuracy > 0.65) return 'medium';
        return 'easy';
    }
    
    /**
     * Calcule le taux de précision de l'utilisateur
     */
    private static calculateAccuracy(userProgress: UserProgress): number {
        const history = userProgress.questionHistory || [];
        
        if (history.length === 0) return 0.5; // Neutral pour nouveaux utilisateurs
        
        const correct = history.filter(a => a.correct).length;
        return correct / history.length;
    }
    
    /**
     * Vérifie si une difficulté est appropriée
     */
    private static isDifficultyAppropriate(
        poolDifficulty: string,
        userDifficulty: string
    ): boolean {
        const levels = ['easy', 'medium', 'hard', 'expert'];
        const poolIndex = levels.indexOf(poolDifficulty);
        const userIndex = levels.indexOf(userDifficulty);
        
        // Accepter la difficulté de l'utilisateur et une difficulté en dessous/dessus
        return Math.abs(poolIndex - userIndex) <= 1;
    }
    
    /**
     * Récupère les questions récemment posées
     */
    private static getRecentQuestions(userProgress: UserProgress, limit: number): Set<string> {
        const history = userProgress.questionHistory || [];
        const recent = [...history]
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit)
            .map(h => h.questionId);
        
        return new Set(recent);
    }
    
    /**
     * Génère un ID unique pour une question
     */
    private static generateQuestionId(question: string): string {
        // Utiliser un hash simple de la question
        let hash = 0;
        for (let i = 0; i < question.length; i++) {
            const char = question.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return `dq-${Math.abs(hash)}`;
    }
    
    /**
     * Mélange un tableau (Fisher-Yates)
     */
    private static shuffleArray<T>(array: T[]): T[] {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    /**
     * Ajoute de nouvelles questions au pool (pour l'expansion future)
     */
    static addQuestionsToPool(template: QuestionTemplate): void {
        QUESTION_POOLS.push(template);
    }
    
    /**
     * Statistiques du pool de questions
     */
    static getPoolStats(): {
        totalTemplates: number;
        totalQuestions: number;
        byTopic: { [topic: string]: number };
        byDifficulty: { [difficulty: string]: number };
    } {
        const stats = {
            totalTemplates: QUESTION_POOLS.length,
            totalQuestions: 0,
            byTopic: {} as { [topic: string]: number },
            byDifficulty: {} as { [difficulty: string]: number }
        };
        
        for (const pool of QUESTION_POOLS) {
            stats.totalQuestions += pool.templates.length;
            stats.byTopic[pool.topic] = (stats.byTopic[pool.topic] || 0) + pool.templates.length;
            stats.byDifficulty[pool.difficulty] = (stats.byDifficulty[pool.difficulty] || 0) + pool.templates.length;
        }
        
        return stats;
    }
}
