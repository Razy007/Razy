import { QuizQuestion } from '../types';

// ==========================================
// 🇫🇷 FRENCH BANK (Default)
// ==========================================
const QUESTION_BANK_FR: Record<string, QuizQuestion[]> = {
    // ========================================
    // COURS 1: INTRODUCTION À PI NETWORK (50 QUESTIONS)
    // ========================================
    'pi-intro-l2': [
        // DIFFICULTÉ: EASY (20 questions)
        {
            id: 'q-pi-intro-1',
            question: "Qu'est-ce qui rend Pi Network unique?",
            options: ["Minage sur smartphone", "Minage GPU", "Proof of Work", "Minage ASIC"],
            correct: 0,
            explanation: "Pi Network permet le minage sur smartphone sans consommer de ressources.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-basics',
            trapType: 'none'
        },
        // ... (Keep existing French content here - implicit fallback for this demo) ...

        {
            id: 'q-pi-intro-2',
            question: "Quel est le GCV (General Consensus Value) de Pi?",
            options: ["$100", "$314.159", "$1000", "$50"],
            correct: 1,
            explanation: "Le GCV est fixé à $314.159, référence au nombre π.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-economics',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-3',
            question: "Quel protocole de consensus utilise Pi Network?",
            options: ["Proof of Work", "Proof of Stake", "Stellar Consensus Protocol (SCP)", "Delegated PoS"],
            correct: 2,
            explanation: "Pi utilise le Stellar Consensus Protocol (SCP).",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'pi-technology',
            trapType: 'similar-concepts'
        },
        {
            id: 'q-pi-intro-4',
            question: "Pourquoi le KYC est-il important pour Pi Network?",
            options: [
                "Pour envoyer des emails marketing",
                "Pour vérifier l'identité et éviter les faux comptes",
                "Pour vendre vos données",
                "C'est optionnel et inutile"
            ],
            correct: 1,
            explanation: "Le KYC assure qu'un Pi = une personne, évitant les bots.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'pi-security',
            trapType: 'negative-framing'
        },
        {
            id: 'q-pi-intro-5',
            question: "Quelle est la vision principale de Pi Network?",
            options: [
                "Remplacer Bitcoin uniquement",
                "Créer la crypto la plus accessible au monde",
                "Maximiser les profits des fondateurs",
                "Servir uniquement les pays riches"
            ],
            correct: 1,
            explanation: "La vision de Pi est de démocratiser l'accès aux cryptomonnaies.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-vision',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-6',
            question: "Quand Pi Network a-t-il été lancé?",
            options: ["2017", "2019", "2020", "2021"],
            correct: 1,
            explanation: "Pi Network a été lancé le 14 mars 2019 (Pi Day - 3/14).",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-history',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-7',
            question: "Qui a créé Pi Network?",
            options: [
                "Des étudiants du MIT",
                "Des docteurs de Stanford",
                "Satoshi Nakamoto",
                "Vitalik Buterin"
            ],
            correct: 1,
            explanation: "Pi a été créé par des docteurs de Stanford (Dr. Nicolas Kokkalis, Dr. Chengdiao Fan).",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-history',
            trapType: 'similar-institutions'
        },
        {
            id: 'q-pi-intro-8',
            question: "Pi Network nécessite-t-il du matériel spécial?",
            options: [
                "Oui, un GPU puissant",
                "Oui, un ASIC miner",
                "Non, juste un smartphone",
                "Oui, un ordinateur dédié"
            ],
            correct: 2,
            explanation: "Pi ne nécessite qu'un smartphone, c'est sa force principale.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-basics',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-9',
            question: "Combien de Pioneers Pi Network compte-t-il approximativement?",
            options: ["1 million", "10 millions", "50+ millions", "500 millions"],
            correct: 2,
            explanation: "Pi compte plus de 50 millions de Pioneers à travers le monde.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-community',
            trapType: 'magnitude'
        },
        {
            id: 'q-pi-intro-10',
            question: "Pi Network consomme-t-il beaucoup de batterie?",
            options: [
                "Oui, beaucoup comme Bitcoin",
                "Non, consommation minimale",
                "Oui, il faut charger toutes les heures",
                "Cela dépend du téléphone"
            ],
            correct: 1,
            explanation: "Pi a été conçu pour une consommation minimale de batterie.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-technology',
            trapType: 'false-analogy'
        },
        {
            id: 'q-pi-intro-11',
            question: "Quel est le symbole de Pi?",
            options: ["₿", "Ξ", "π", "Π"],
            correct: 2,
            explanation: "Le symbole de Pi est π (pi minuscule).",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-basics',
            trapType: 'visual-similarity'
        },
        {
            id: 'q-pi-intro-12',
            question: "Pi Network est-il une blockchain?",
            options: [
                "Non, c'est juste une app",
                "Oui, c'est une blockchain",
                "Non, c'est un jeu",
                "Oui, mais centralisée"
            ],
            correct: 1,
            explanation: "Pi Network est bien une blockchain décentralisée.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-technology',
            trapType: 'misconception'
        },
        {
            id: 'q-pi-intro-13',
            question: "Faut-il payer pour miner Pi?",
            options: [
                "Oui, $10/mois",
                "Oui, $100 initial",
                "Non, c'est totalement gratuit",
                "Oui, mais seulement pour Premium"
            ],
            correct: 2,
            explanation: "Le minage de Pi est 100% gratuit, pas de frais cachés.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-basics',
            trapType: 'scam-warning'
        },
        {
            id: 'q-pi-intro-14',
            question: "À quelle fréquence faut-il miner Pi?",
            options: [
                "Toutes les heures",
                "Toutes les 24 heures",
                "Une fois par semaine",
                "En continu"
            ],
            correct: 1,
            explanation: "Il faut confirmer sa session de minage toutes les 24 heures.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-mining',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-15',
            question: "Pi Network est-il open source?",
            options: [
                "Non, totalement fermé",
                "Oui, partiellement",
                "Oui, totalement",
                "Seulement pour les développeurs"
            ],
            correct: 1,
            explanation: "Certaines parties de Pi sont open source, notamment le SDK.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-technology',
            trapType: 'partial-truth'
        },
        {
            id: 'q-pi-intro-16',
            question: "Peut-on vendre ses Pi actuellement (2024)?",
            options: [
                "Oui, sur tous les exchanges",
                "Oui, mais seulement sur Pi Browser",
                "Non, pas pendant Enclosed Mainnet",
                "Oui, contre cash uniquement"
            ],
            correct: 2,
            explanation: "Durant l'Enclosed Mainnet, les Pi ne peuvent pas être échangés contre fiat.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'pi-economics',
            trapType: 'scam-warning'
        },
        {
            id: 'q-pi-intro-17',
            question: "Qu'est-ce qu'un Pioneer dans Pi Network?",
            options: [
                "Un développeur",
                "Un utilisateur qui mine Pi",
                "Un administrateur",
                "Un investisseur"
            ],
            correct: 1,
            explanation: "Un Pioneer est tout utilisateur qui mine Pi via l'app.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-terminology',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-18',
            question: "Pi Network a-t-il un token natif?",
            options: [
                "Non, pas encore",
                "Oui, le Pi (π)",
                "Oui, le PiCoin",
                "Non, ils utilisent Bitcoin"
            ],
            correct: 1,
            explanation: "Pi (π) est le token natif de Pi Network.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'pi-basics',
            trapType: 'naming-confusion'
        },
        {
            id: 'q-pi-intro-19',
            question: "Peut-on créer plusieurs comptes Pi?",
            options: [
                "Oui, autant qu'on veut",
                "Oui, max 3",
                "Non, strictement interdit (1 personne = 1 compte)",
                "Oui, avec différents numéros"
            ],
            correct: 2,
            explanation: "Une seule personne = un seul compte. Le multi-compte viole les règles.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'pi-rules',
            trapType: 'temptation'
        },
        {
            id: 'q-pi-intro-20',
            question: "Que fait l'app Pi quand elle est fermée?",
            options: [
                "Continue de miner en arrière-plan",
                "Ne fait rien",
                "Consomme de la batterie",
                "Mine moins vite"
            ],
            correct: 1,
            explanation: "Fermer l'app n'affecte pas le minage, Pi ne tourne pas en arrière-plan.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'pi-technology',
            trapType: 'misconception'
        },

        // DIFFICULTÉ: MEDIUM (20 questions)
        {
            id: 'q-pi-intro-21',
            question: "Combien de Pi peut-on miner par heure en tant que Pioneer de base?",
            options: [
                "Le taux diminue avec le temps",
                "Toujours 1 Pi/h",
                "10 Pi/h",
                "C'est aléatoire"
            ],
            correct: 0,
            explanation: "Le taux de minage diminue progressivement (halving) pour maintenir la rareté.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-mining',
            trapType: 'temporal-confusion'
        },
        {
            id: 'q-pi-intro-22',
            question: "Que signifie 'Security Circle' dans Pi Network?",
            options: [
                "Un antivirus pour Pi",
                "Un groupe de Pioneers de confiance pour sécuriser le réseau",
                "Une crypto-monnaie différente",
                "Un type de wallet"
            ],
            correct: 1,
            explanation: "Le Security Circle est un groupe de 3-5 Pioneers de confiance.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'pi-security',
            trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-23',
            question: "Quel est l'avantage principal du mainnet de Pi?",
            options: [
                "Plus de Pi gratuit",
                "Possibilité d'échanger Pi contre des biens/services",
                "Minage plus rapide",
                "Pas de KYC nécessaire"
            ],
            correct: 1,
            explanation: "Le mainnet permet d'utiliser Pi dans l'économie réelle via dApps.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-ecosystem',
            trapType: 'wishful-thinking'
        },
        {
            id: 'q-pi-intro-24',
            question: "Pourquoi Pi Network nécessite-t-il une connexion Internet?",
            options: [
                "Pour télécharger la blockchain",
                "Pour vérifier votre activité toutes les 24h",
                "Pour miner comme Bitcoin",
                "Ce n'est pas nécessaire"
            ],
            correct: 1,
            explanation: "Pi nécessite de confirmer la session toutes les 24h (preuve d'humanité).",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'pi-mining',
            trapType: 'false-analogy'
        },
        {
            id: 'q-pi-intro-25',
            question: "Qu'est-ce qu'augmente votre taux de minage Pi?",
            options: [
                "Avoir un téléphone plus puissant",
                "Avoir un Security Circle actif",
                "Miner 24h/24",
                "Payer un abonnement"
            ],
            correct: 1,
            explanation: "Un Security Circle actif augmente votre taux de minage.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'pi-mining',
            trapType: 'misconception'
        },
        {
            id: 'q-pi-intro-26',
            question: "Qu'est-ce que le 'Enclosed Mainnet'?",
            options: [
                "Un test avant le vrai mainnet",
                "Une phase où Pi ne peut pas encore être échangé contre fiat",
                "Un wallet fermé",
                "Une app différente"
            ],
            correct: 1,
            explanation: "Enclosed Mainnet = Pi fonctionne mais pas d'échange fiat externe.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-technology',
            trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-27',
            question: "Combien de personnes maximum dans votre Security Circle?",
            options: ["3", "5", "10", "Illimité"],
            correct: 1,
            explanation: "Maximum 5 personnes dans votre Security Circle.",
            difficulty: 'medium',
            cognitiveLevel: 'knowledge',
            topic: 'pi-security',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-28',
            question: "Que se passe-t-il si vous ratez une session de minage?",
            options: [
                "Vous perdez tous vos Pi",
                "Votre compteur se reset mais vos Pi sont conservés",
                "Rien ne se passe",
                "Vous êtes banni"
            ],
            correct: 1,
            explanation: "Rater une session reset le compteur mais ne fait pas perdre les Pi accumulés.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-mining',
            trapType: 'fear-mongering'
        },
        {
            id: 'q-pi-intro-29',
            question: "Quel est le rôle d'un 'Contributor' dans Pi?",
            options: [
                "Mine plus de Pi",
                "Contribue à la sécurité via Security Circle",
                "Développe des dApps",
                "Modère la communauté"
            ],
            correct: 1,
            explanation: "Un Contributor contribue à la sécurité en formant un Security Circle.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-roles',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-30',
            question: "Peut-on transférer ses Pi avant le KYC?",
            options: [
                "Oui, librement",
                "Non, pas avant KYC validé",
                "Oui, mais avec frais",
                "Seulement vers d'autres Pioneers"
            ],
            correct: 1,
            explanation: "Le KYC est requis avant de pouvoir transférer des Pi au mainnet.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-security',
            trapType: 'restriction'
        },
        {
            id: 'q-pi-intro-31',
            question: "Quel est le but du halving dans Pi?",
            options: [
                "Punir les utilisateurs",
                "Maintenir la rareté et la valeur",
                "Ralentir le réseau",
                "Tester la patience"
            ],
            correct: 1,
            explanation: "Le halving maintient la rareté en réduisant progressivement le taux de minage.",
            difficulty: 'medium',
            cognitiveLevel: 'analysis',
            topic: 'pi-economics',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-32',
            question: "Qu'est-ce qu'une dApp sur Pi Network?",
            options: [
                "Une application mobile",
                "Une application décentralisée utilisant Pi",
                "Un jeu vidéo",
                "Un site web classique"
            ],
            correct: 1,
            explanation: "Une dApp est une application décentralisée construite sur Pi Network.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-ecosystem',
            trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-33',
            question: "Le minage Pi affecte-t-il la vitesse de votre téléphone?",
            options: [
                "Oui, beaucoup",
                "Non, aucun impact",
                "Oui, un peu",
                "Seulement sur vieux téléphones"
            ],
            correct: 1,
            explanation: "Pi ne tourne pas en arrière-plan, donc aucun impact sur performance.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-technology',
            trapType: 'misconception'
        },
        {
            id: 'q-pi-intro-34',
            question: "Combien de temps le KYC prend-il généralement?",
            options: [
                "Instantané",
                "Quelques minutes",
                "Peut prendre plusieurs semaines",
                "Exactement 24h"
            ],
            correct: 2,
            explanation: "Le KYC peut prendre du temps car des millions de demandes sont traitées.",
            difficulty: 'medium',
            cognitiveLevel: 'knowledge',
            topic: 'pi-security',
            trapType: 'expectation'
        },
        {
            id: 'q-pi-intro-35',
            question: "Que signifie 'migrated to mainnet'?",
            options: [
                "Changement d'app",
                "Transfert des Pi testnet vers mainnet après KYC",
                "Mise à jour de l'app",
                "Nouveau compte"
            ],
            correct: 1,
            explanation: "Migration = transfert des Pi de testnet vers mainnet après KYC validé.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-technology',
            trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-36',
            question: "Pi Network utilise-t-il preuve de travail (PoW)?",
            options: [
                "Oui, comme Bitcoin",
                "Non, il utilise SCP",
                "Oui, mais moins intensif",
                "Partiellement"
            ],
            correct: 1,
            explanation: "Pi utilise Stellar Consensus Protocol, pas Proof of Work.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-technology',
            trapType: 'false-analogy'
        },
        {
            id: 'q-pi-intro-37',
            question: "Peut-on perdre ses Pi minés?",
            options: [
                "Oui, si on oublie sa passphrase wallet",
                "Non, jamais",
                "Oui, si on ne mine pas pendant 1 an",
                "Oui, si le KYC échoue"
            ],
            correct: 0,
            explanation: "Perdre sa passphrase = perdre accès à ses Pi définitivement.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'pi-security',
            trapType: 'critical-warning'
        },
        {
            id: 'q-pi-intro-38',
            question: "Qu'est-ce que le Pi Browser?",
            options: [
                "Un navigateur web classique",
                "Un navigateur pour accéder aux dApps Pi",
                "Une app de messagerie",
                "Un wallet externe"
            ],
            correct: 1,
            explanation: "Pi Browser est le navigateur pour accéder aux dApps de l'écosystème Pi.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-ecosystem',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-39',
            question: "Comment Pi Network évite-t-il les bots?",
            options: [
                "CAPTCHA à chaque connexion",
                "KYC obligatoire",
                "Limite de temps de minage",
                "Vérification téléphonique"
            ],
            correct: 1,
            explanation: "Le KYC garantit que chaque compte = une vraie personne unique.",
            difficulty: 'medium',
            cognitiveLevel: 'analysis',
            topic: 'pi-security',
            trapType: 'none'
        },
        {
            id: 'q-pi-intro-40',
            question: "Les Pi minés avant KYC sont-ils perdus?",
            options: [
                "Oui, complètement",
                "Non, ils sont migrés après KYC validé",
                "Oui, si KYC prend >6 mois",
                "Partiellement (50%)"
            ],
            correct: 1,
            explanation: "Les Pi minés sont conservés et migrés au mainnet après KYC validé.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'pi-security',
            trapType: 'fear-mongering'
        },

        // DIFFICULTÉ: HARD (10 questions)
        {
            id: 'q-pi-intro-41',
            question: "Quel avantage le SCP offre-t-il vs Proof of Work?",
            options: [
                "Plus sécurisé",
                "Consommation énergétique minimale + finalité rapide",
                "Plus décentralisé",
                "Anonymat total"
            ],
            correct: 1,
            explanation: "SCP consomme très peu d'énergie et offre une finalité rapide comparé à PoW.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'pi-technology',
            trapType: 'nuanced-comparison'
        },
        {
            id: 'q-pi-intro-42',
            question: "Pourquoi Pi a-t-il choisi le modèle 'invitation'?",
            options: [
                "Pour gagner de l'argent",
                "Pour croissance organique et sécurité via graphe de confiance",
                "Pour limiter les utilisateurs",
                "C'est plus facile"
            ],
            correct: 1,
            explanation: "Le modèle d'invitation crée un graphe de confiance qui renforce la sécurité.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'pi-strategy',
            trapType: 'deep-reasoning'
        },
        {
            id: 'q-pi-intro-43',
            question: "Qu'est-ce que le 'lockup' dans Pi Network?",
            options: [
                "Bloquer son compte",
                "Verrouiller des Pi pour augmenter les récompenses et engagement",
                "Une pénalité",
                "Un type de KYC"
            ],
            correct: 1,
            explanation: "Le lockup permet de verrouiller des Pi pour montrer engagement long-terme.",
            difficulty: 'hard',
            cognitiveLevel: 'comprehension',
            topic: 'pi-economics',
            trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-44',
            question: "Comment Pi Network maintient-il la décentralisation?",
            options: [
                "Nodes répartis géographiquement + consensus distribué",
                "Serveurs centralisés",
                "Un seul datacenter",
                "Proof of Work"
            ],
            correct: 0,
            explanation: "Pi maintient décentralisation via nodes répartis et SCP consensus.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'pi-technology',
            trapType: 'technical-depth'
        },
        {
            id: 'q-pi-intro-45',
            question: "Quel est le risque principal du multi-compte?",
            options: [
                "Ban permanent + perte de tous les Pi",
                "Avertissement simple",
                "Réduction de moitié des Pi",
                "Suspension de 30 jours"
            ],
            correct: 0,
            explanation: "Multi-compte = ban permanent et perte définitive de tous les Pi.",
            difficulty: 'hard',
            cognitiveLevel: 'comprehension',
            topic: 'pi-rules',
            trapType: 'severity'
        },
        {
            id: 'q-pi-intro-46',
            question: "Pourquoi Pi utilise-t-il un modèle de 'phases' (testnet, mainnet, etc.)?",
            options: [
                "Pour tester et sécuriser progressivement le réseau",
                "Pour ralentir intentionnellement",
                "C'est aléatoire",
                "Pour créer du hype"
            ],
            correct: 0,
            explanation: "Les phases permettent de tester et sécuriser progressivement avant full launch.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'pi-strategy',
            trapType: 'strategic-thinking'
        },
        {
            id: 'q-pi-intro-47',
            question: "Qu'est-ce qui détermine la supply totale de Pi?",
            options: [
                "C'est illimité",
                "Halving + nombre de Pioneers actifs",
                "Décision des fondateurs",
                "100 milliards fixes"
            ],
            correct: 1,
            explanation: "La supply dépend du halving et du nombre de Pioneers actifs.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'pi-economics',
            trapType: 'complex-mechanism'
        },
        {
            id: 'q-pi-intro-48',
            question: "Comment le Security Circle renforce-t-il la sécurité?",
            options: [
                "Crée un graphe de confiance pour identifier/isoler acteurs malveillants",
                "Chiffre les données",
                "Ajoute un mot de passe",
                "Bloque les hackers"
            ],
            correct: 0,
            explanation: "Le Security Circle crée un graphe de confiance pour détecter anomalies.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'pi-security',
            trapType: 'deep-reasoning'
        },
        {
            id: 'q-pi-intro-49',
            question: "Quelle est la différence clé entre Pi testnet et Pi mainnet?",
            options: [
                "Testnet = Pi fictifs, Mainnet = Pi réels transférables",
                "Aucune différence",
                "Testnet plus rapide",
                "Mainnet require KYC, testnet non"
            ],
            correct: 0,
            explanation: "Testnet = phase test avec Pi fictifs. Mainnet = Pi réels après migration KYC.",
            difficulty: 'hard',
            cognitiveLevel: 'comprehension',
            topic: 'pi-technology',
            trapType: 'technical-nuance'
        },
        {
            id: 'q-pi-intro-50',
            question: "Pourquoi Pi insiste-t-il tant sur le 'peer-to-peer'?",
            options: [
                "Pour réduire frais + donner contrôle direct aux utilisateurs",
                "C'est une mode",
                "Pour éviter régulation",
                "C'est plus simple"
            ],
            correct: 0,
            explanation: "P2P réduit frais intermédiaires et donne contrôle direct aux utilisateurs.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'pi-philosophy',
            trapType: 'philosophical-depth'
        }
    ],

    // ========================================
    // COURS 2: PI WALLET MASTERY (10 QUESTIONS)
    // ========================================
    'wallet-l2-comprehension': [
        // EASY (4 questions)
        {
            id: 'q-wallet-1',
            question: "Qui peut réinitialiser votre Passphrase si vous la perdez?",
            options: ["Pi Core Team", "Votre Security Circle", "Personne", "Support technique"],
            correct: 2,
            explanation: "Wallet non-custodial = VOUS SEUL avez le contrôle. Personne ne peut réinitialiser votre Passphrase.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'wallet-basics',
            trapType: 'misconception'
        },
        {
            id: 'q-wallet-2',
            question: "Combien de mots comporte une Passphrase Pi Wallet?",
            options: ["12 mots", "18 mots", "24 mots", "32 mots"],
            correct: 2,
            explanation: "La Passphrase Pi Wallet contient 24 mots à sauvegarder dans l'ordre exact.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'wallet-basics',
            trapType: 'none'
        },
        {
            id: 'q-wallet-3',
            question: "Que commence toujours une adresse Pi Wallet?",
            options: ["Par 'P'", "Par 'G'", "Par '0x'", "Par '1'"],
            correct: 1,
            explanation: "Les adresses Pi Wallet commencent toujours par la lettre 'G' (format Stellar).",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'wallet-basics',
            trapType: 'none'
        },
        {
            id: 'q-wallet-4',
            question: "Faut-il sauvegarder sa Passphrase sur papier?",
            options: [
                "Non, dans un fichier texte suffit",
                "Oui, ABSOLUMENT (méthode la plus sûre)",
                "Non, la mémoriser suffit",
                "Oui, mais seulement sur Google Drive"
            ],
            correct: 1,
            explanation: "Sauvegarder sur papier (dans un endroit sûr) est la méthode la plus sécurisée. Jamais en numérique non chiffré!",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'wallet-security',
            trapType: 'security-best-practice'
        },

        // MEDIUM (4 questions)
        {
            id: 'q-wallet-5',
            question: "Un 'modérateur' demande votre Passphrase pour 'débloquer KYC'. Que faites-vous?",
            options: [
                "Je la donne",
                "Je donne seulement 12 mots sur 24",
                "Je le signale immédiatement (c'est une ARNAQUE)",
                "Je demande son badge officiel"
            ],
            correct: 2,
            explanation: "AUCUN membre de la Core Team ne demandera JAMAIS votre Passphrase. C'est une arnaque classique!",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'wallet-security',
            trapType:'scam-warning'
        },
        {
            id: 'q-wallet-6',
            question: "Vous avez oublié l'ordre des mots de votre Passphrase. Que faire?",
            options: [
                "Contacter le support Pi",
                "Essayer toutes les combinaisons possibles",
                "Vos Pi sont perdus définitivement si aucune sauvegarde valide",
                "Utiliser la fonction 'récupération'"
            ],
            correct: 2,
            explanation: "Sans l'ordre exact, il est mathématiquement impossible de récupérer le wallet. C'est pourquoi la sauvegarde est CRITIQUE.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'wallet-recovery',
            trapType: 'critical-warning'
        },
        {
            id: 'q-wallet-7',
            question: "Quelle est la meilleure pratique pour sauvegarder sa Passphrase?",
            options: [
                "Screenshot sur téléphone",
                "Email à soi-même",
                "Multiple copies papier dans lieux sûrs séparés",
                "Mémorisation uniquement"
            ],
            correct: 2,
            explanation: "Plusieurs copies papier dans des endroits physiquement séparés (feu, vol) est la méthode optimale.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'wallet-backup',
            trapType: 'security-best-practice'
        },
        {
            id: 'q-wallet-8',
            question: "Peut-on partager son adresse publique (commence par 'G')?",
            options: [
                "Non, jamais",
                "Oui, c'est fait pour ça (recevoir des Pi)",
                "Oui, mais seulement à la famille",
                "Non, sauf pour KYC"
            ],
            correct: 1,
            explanation: "L'adresse publique est FAITE pour être partagée (recevoir Pi). C'est la Passphrase qui est secrète!",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'wallet-basics',
            trapType: 'confusion-public-private'
        },

        // HARD (2 questions)
        {
            id: 'q-wallet-9',
            question: "Pourquoi un wallet non-custodial est-il plus sûr qu'un exchange centralisé?",
            options: [
                "Il est plus rapide",
                "VOUS contrôlez vos clés, pas un tiers qui peut être hacké/faire faillite",
                "Il coûte moins cher",
                "Il a une meilleure interface"
            ],
            correct: 1,
            explanation: "Non-custodial = vous contrôlez vos clés. L'exchange peut être hacké, faire faillite, ou bloquer vos fonds. Vos clés = votre crypto.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'wallet-philosophy',
            trapType: 'deep-reasoning'
        },
        {
            id: 'q-wallet-10',
            question: "Votre téléphone est volé. Vos Pi sont-ils perdus?",
            options: [
                "Oui, définitivement",
                "Non, si vous avez votre Passphrase sauvegardée ailleurs",
                "Oui, sauf si le voleur ne connaît pas le code PIN",
                "Non, Pi Core Team peut les bloquer"
            ],
            correct: 1,
            explanation: "Avec votre Passphrase, vous pouvez restaurer votre wallet sur n'importe quel appareil. C'est pourquoi la sauvegarde papier est ESSENTIELLE.",
            difficulty: 'hard',
            cognitiveLevel: 'application',
            topic: 'wallet-recovery',
            trapType: 'scenario-based'
        }
    ],

    // ========================================
    // COURS 3: ANTI-SCAM DEFENSE (10 QUESTIONS)
    // ========================================
    'safety-l2': [
        // EASY (4 questions)
        {
            id: 'q-scam-1',
            question: "Quel est le domaine officiel de Pi Network?",
            options: ["pi-network.com", "minepi.com", "pinetwork.org", "getpi.com"],
            correct: 1,
            explanation: "Le SEUL domaine officiel est minepi.com. Tout autre domaine est suspect!",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'scam-basics',
            trapType: 'none'
        },
        {
            id: 'q-scam-2',
            question: "La Core Team Pi demandera-t-elle JAMAIS votre Passphrase?",
            options: [
                "Oui, pour KYC",
                "Oui, si problème technique",
                "JAMAIS, sous aucun prétexte",
                "Oui, mais seulement par email officiel"
            ],
            correct: 2,
            explanation: "La Core Team ne demandera JAMAIS votre Passphrase. Quiconque la demande est un escroc.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'scam-rules',
            trapType: 'absolute-rule'
        },
        {
            id: 'q-scam-3',
            question: "Recevez un email: 'Votre wallet sera bloqué sous 24h. Cliquez ici'. Que faire?",
            options: [
                "Cliquer rapidement pour éviter blocage",
                "Vérifier l'expéditeur puis cliquer",
                "IGNORER et SIGNALER (phishing classique)",
                "Transférer à des amis"
            ],
            correct: 2,
            explanation: "Tactique de peur + urgence = phishing classique. Pi n'envoie pas ce genre d'emails alarmistes.",
            difficulty: 'easy',
            cognitiveLevel: 'application',
            topic: 'phishing',
            trapType: 'urgency-tactic'
        },
        {
            id: 'q-scam-4',
            question: "Peut-on échanger des Pi contre $ durant l'Enclosed Mainnet (2024)?",
            options: [
                "Oui, sur exchanges autorisés",
                "Oui, mais seulement P2P",
                "NON, c'est INTERDIT (tout site qui propose est une arnaque)",
                "Oui, via Pi Browser"
            ],
            correct: 2,
            explanation: "Durant Enclosed Mainnet, échanges Pi ↔ fiat sont INTERDITS. Tout site promettant cela = arnaque garantie!",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'scam-economics',
            trapType: 'scam-warning'
        },

        // MEDIUM (4 questions)
        {
            id: 'q-scam-5',
            question: "Email avec logo Pi: 'Vérifiez votre wallet sur pi-verify-network.com'. RED FLAG?",
            options: [
                "Pas de red flag, logo officiel",
                "Red flag: domaine suspect (pas minepi.com)",
                "Pas de red flag, '.com' est bon",
                "Red flag seulement si demande mot de passe"
            ],
            correct: 1,
            explanation: "Domaine officiel = minepi.com UNIQUEMENT. 'pi-verify-network.com' est un faux site de phishing.",
            difficulty: 'medium',
            cognitiveLevel: 'analysis',
            topic: 'phishing-detection',
            trapType: 'visual-deception'
        },
        {
            id: 'q-scam-6',
            question: "DM: 'Je suis modérateur Pi. Donne-moi tes 24 mots pour migration manuelle'. Réponse?",
            options: [
                "Je vérifie son badge puis donne",
                "Je donne seulement sur Pi Browser",
                "ARNAQUE! Bloquer et signaler immédiatement",
                "Je demande preuve d'identité"
            ],
            correct: 2,
            explanation: "AUCUN modérateur ni membre Core Team ne demandera vos 24 mots. JAMAIS. C'est une arnaque flagrante!",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'social-engineering',
            trapType: 'authority-impersonation'
        },
        {
            id: 'q-scam-7',
            question: "Site web: 'Doublez vos Pi! Envoyez 100π, recevez 200π'. Verdict?",
            options: [
                "Bonne opportunité",
                "Arnaque Ponzi classique (vous perdrez tout)",
                "Légitime si sur Pi Browser",
                "À tester avec 1 Pi d'abord"
            ],
            correct: 1,
            explanation: "Schéma 'doublez votre argent' = arnaque Ponzi classique. Vous envoyez, vous ne recevez rien. 100% perte.",
            difficulty: 'medium',
            cognitiveLevel: 'analysis',
            topic: 'ponzi-schemes',
            trapType: 'too-good-to-be-true'
        },
        {
            id: 'q-scam-8',
            question: "Comment identifier un faux site Pi?",
            options: [
                "Vérifier le design",
                "Vérifier URL (minepi.com = seul officiel), HTTPS, certificat SSL",
                "Vérifier nombre de visites",
                "Vérifier réseaux sociaux"
            ],
            correct: 1,
            explanation: "URL est l'indicateur #1. minepi.com UNIQUEMENT. Vérifier aussi HTTPS et certificat SSL valide.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'website-verification',
            trapType: 'technical-verification'
        },

        // HARD (2 questions)
        {
            id: 'q-scam-9',
            question: "Pourquoi les escrocs ciblent-ils spécifiquement Pi Network?",
            options: [
                "Pi est vulnérable techniquement",
                "50M+ utilisateurs, beaucoup débutants crypto = cible facile",
                "Pi n'a pas de sécurité",
                "C'est aléatoire"
            ],
            correct: 1,
            explanation: "Large base d'utilisateurs (50M+) dont beaucoup sont nouveaux en crypto = cible attractive pour escrocs.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'scam-psychology',
            trapType: 'deep-reasoning'
        },
        {
            id: 'q-scam-10',
            question: "Quel red flag indique un 'rug pull' imminent dans une dApp Pi?",
            options: [
                "Design amateur",
                "Équipe anonyme + promesses irréalistes + liquidité verrouillable par devs",
                "Pas de whitepaper",
                "Nouveau projet"
            ],
            correct: 1,
            explanation: "Combo MORTEL: équipe anonyme + promesses folles (1000% APY) + devs peuvent retirer liquidité = rug pull probable.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'defi-scams',
            trapType: 'complex-pattern-recognition'
        }
    ],

    // ========================================
    // COURS 4: KYC VERIFICATION (10 QUESTIONS)
    // ========================================
    'kyc-l2': [
        // EASY (4 questions)
        {
            id: 'q-kyc-1',
            question: "Pourquoi Pi Network exige-t-il le KYC?",
            options: [
                "Pour vendre vos données",
                "Pour garantir 1 personne = 1 compte (éviter bots)",
                "Pour compliquer l'inscription",
                "C'est optionnel"
            ],
            correct: 1,
            explanation: "KYC assure qu'un Pi = une personne réelle, empêchant bots et multi-comptes qui dévaloriseraient Pi.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'kyc-purpose',
            trapType: 'none'
        },
        {
            id: 'q-kyc-2',
            question: "Quelle app Pi utilise pour KYC?",
            options: ["Yoti", "Civic", "Onfido", "Jumio"],
            correct: 0,
            explanation: "Pi Network utilise Yoti, une solution de vérification d'identité reconnue et sécurisée.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'kyc-process',
            trapType: 'none'
        },
        {
            id: 'q-kyc-3',
            question: "Faut-il payer pour le KYC Pi?",
            options: [
                "Oui, $50",
                "Oui, $10",
                "NON, c'est 100% GRATUIT",
                "Oui, mais remboursé après"
            ],
            correct: 2,
            explanation: "Le KYC Pi est totalement GRATUIT. Toute demande de paiement = arnaque!",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'kyc-scams',
            trapType: 'scam-warning'
        },
        {
            id: 'q-kyc-4',
            question: "Quel document est généralement accepté pour KYC?",
            options: [
                "Carte d'identité / Passeport valides",
                "Permis de conduire périmé",
                "Carte de bibliothèque",
                "Facture d'électricité"
            ],
            correct: 0,
            explanation: "Documents officiels valides avec photo: carte d'identité nationale, passeport, permis (selon pays).",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'kyc-documents',
            trapType: 'none'
        },

        // MEDIUM (4 questions)
        {
            id: 'q-kyc-5',
            question: "Combien de temps peut prendre le KYC?",
            options: [
                "Toujours instantané",
                "Quelques minutes à plusieurs semaines (charge de demandes)",
                "Exactement 24h",
                "Maximum 3 jours"
            ],
            correct: 1,
            explanation: "Avec 50M+ utilisateurs, le KYC peut prendre du temps. Patience! Vous serez notifié du résultat.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'kyc-timeline',
            trapType: 'expectation-management'
        },
        {
            id: 'q-kyc-6',
            question: "Que se passe-t-il si votre KYC est rejeté?",
            options: [
                "Vous perdez vos Pi définitivement",
                "Vous pouvez faire appel avec documents corrigés",
                "Ban permanent",
                "Rien, c'était optionnel"
            ],
            correct: 1,
            explanation: "KYC rejeté ≠ perdu! Vous pouvez faire appel en soumettant de meilleurs documents/photos.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'kyc-appeals',
            trapType: 'fear-mongering'
        },
        {
            id: 'q-kyc-7',
            question: "DM: 'Salut, je peux accélérer ton KYC pour 50 Pi'. Réponse?",
            options: [
                "Super, j'accepte!",
                "ARNAQUE! Signaler immédiatement",
                "Négocier à 25 Pi",
                "Demander garanties"
            ],
            correct: 1,
            explanation: "PERSONNE ne peut accélérer votre KYC contre paiement. C'est une arnaque classique!",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'kyc-scams',
            trapType: 'scam-warning'
        },
        {
            id: 'q-kyc-8',
            question: "Vos données KYC sont-elles partagées avec des tiers marketing?",
            options: [
                "Oui, pour financer Pi",
                "Non, utilisées UNIQUEMENT pour vérification identité",
                "Oui, mais anonymisées",
                "Oui, avec votre consentement"
            ],
            correct: 1,
            explanation: "Données KYC = strictement pour vérification identité. Pas de vente ni partage marketing.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'kyc-privacy',
            trapType: 'privacy-concern'
        },

        // HARD (2 questions)
        {
            id: 'q-kyc-9',
            question: "Pourquoi le 'liveness check' (selfie vidéo) est-il crucial?",
            options: [
                "Pour avoir votre photo",
                "Pour empêcher deepfakes et photos volées (vérifier humain réel)",
                "Pour l'album photo Pi",
                "C'est juste décoratif"
            ],
            correct: 1,
            explanation: "Liveness check prouve que VOUS êtes physiquement présent (pas une photo/vidéo volée ou deepfake).",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'kyc-technology',
            trapType: 'technical-depth'
        },
        {
            id: 'q-kyc-10',
            question: "Quel est le risque si Pi acceptait comptes sans KYC?",
            options: [
                "Croissance plus rapide",
                "Bots/multi-comptes dévaloriseraient Pi + réseau vulnérable Sybil attack",
                "Plus simple pour utilisateurs",
                "Aucun risque"
            ],
            correct: 1,
            explanation: "Sans KYC: 1 personne = 1000 comptes = hyperinflation Pi + attaque Sybil détruisant sécurité du réseau.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'kyc-security',
            trapType: 'deep-reasoning'
        }
    ]
};

// ==========================================
// 🇺🇸 ENGLISH BANK
// ==========================================
const QUESTION_BANK_EN: Record<string, QuizQuestion[]> = {
    'pi-intro-l2': [
        {
            id: 'q-pi-intro-1',
            question: "What makes Pi Network unique?",
            options: ["Mining on smartphone", "GPU Mining", "Proof of Work", "ASIC Mining"],
            correct: 0,
            explanation: "Pi Network allows mining on smartphones without draining battery or consuming excessive data using the Stellar Consensus Protocol (SCP).",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-basics', trapType: 'none'
        },
        {
            id: 'q-pi-intro-2',
            question: "What is the GCV (General Consensus Value) of Pi?",
            options: ["$100", "$314,159", "$1000", "$50"],
            correct: 1,
            explanation: "The GCV is widely supported by the community at $314,159, referencing the mathematical constant π.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-economics', trapType: 'none'
        },
        {
            id: 'q-pi-intro-3',
            question: "Which consensus protocol does Pi Network use?",
            options: ["Proof of Work", "Proof of Stake", "Stellar Consensus Protocol (SCP)", "Delegated PoS"],
            correct: 2,
            explanation: "Pi runs on the Stellar Consensus Protocol (SCP), which relies on trust graphs rather than energy-intensive computations.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'pi-technology', trapType: 'similar-concepts'
        },
        {
            id: 'q-pi-intro-4',
            question: "Why is KYC important for Pi Network?",
            options: ["For marketing emails", "To verify identity and prevent fake accounts", "To sell your data", "It is optional"],
            correct: 1,
            explanation: "KYC ensures that 1 Pi Account = 1 Real Person, preventing bots from farming coins.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'pi-security', trapType: 'negative-framing'
        },
        {
            id: 'q-pi-intro-5',
            question: "What is the main vision of Pi Network?",
            options: ["Replace Bitcoin only", "Build the world's most inclusive peer-to-peer ecosystem", "Maximize founder profits", "Serve rich countries only"],
            correct: 1,
            explanation: "Pi's vision is to build the world's most inclusive peer-to-peer ecosystem and online experience, fueled by Pi.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-vision', trapType: 'none'
        }
    ]
};

// Fonction helper pour obtenir questions d'un layer (BILINGUE)
export function getLayerQuestions(layerId: string, lang: string = 'fr'): QuizQuestion[] {
    // 1. Try English if requested
    if (lang === 'en') {
        const enQuestions = QUESTION_BANK_EN[layerId];
        if (enQuestions && enQuestions.length > 0) return enQuestions;
        // Fallback to French if English translation missing for this specific layer
    }
    
    // 2. Default to French
    return QUESTION_BANK_FR[layerId] || [];
}

// Fonction pour obtenir N questions aléatoires (BILINGUE)
export function getRandomQuestions(layerId: string, count: number = 3, lang: string = 'fr'): QuizQuestion[] {
    const allQuestions = getLayerQuestions(layerId, lang);
    if (allQuestions.length === 0) return [];
    
    // Shuffle et prendre N premières
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, allQuestions.length));
}
