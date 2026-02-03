import { QuizQuestion } from '../types';
// EXPANDED banks are imported at the bottom where logic resides to avoid circular dependencies or clutter.
// 🇫🇷 FRENCH BANK (Default)
// ==========================================
 const BASE_QUESTION_BANK_FR: Record<string, QuizQuestion[]> = {
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
        },
        // NEW QUESTIONS (EXTENSION V2)
        {
            id: 'q-scam-11',
            question: "Comment reconnaître un VRAI modérateur Pi dans le chat?",
            options: [
                "Il dit qu'il est modérateur",
                "Il a un badge 'M' officiel à côté de son nom",
                "Il écrit en majuscules",
                "Il demande votre numéro"
            ],
            correct: 1,
            explanation: "Les vrais modérateurs ont un badge 'M' distinctif dans l'interface de chat officielle.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'moderation',
            trapType: 'visual-identification'
        },
        {
            id: 'q-scam-12',
            question: "Des 'Pi Airdrops' sur Telegram vous demandent de connecter votre wallet. Risque?",
            options: [
                "Aucun, c'est gratuit",
                "Risque maximal: ils veulent votre Passphrase pour vider le wallet",
                "Faible risque",
                "C'est officiel"
            ],
            correct: 1,
            explanation: "Pi Network ne fait PAS d'airdrops externes. Connecter votre wallet à ces sites via Passphrase = vol total.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'airdrop-scams',
            trapType: 'greed-bait'
        },
        {
            id: 'q-scam-13',
            question: "Est-il légal d'acheter ou vendre un compte Pi?",
            options: [
                "Oui, c'est votre propriété",
                "Non, c'est strictement interdit (Violation TOS) et entraîne le bannissement",
                "Oui, si le prix est bas",
                "Seulement aux USA"
            ],
            correct: 1,
            explanation: "La vente/achat de compte viole les Conditions d'Utilisation (ToS). Les comptes vendus sont bannis et les Pi brûlés.",
            difficulty: 'medium',
            cognitiveLevel: 'knowledge',
            topic: 'account-security',
            trapType: 'rule-violation'
        },
        {
            id: 'q-scam-14',
            question: "Vous trouvez une app 'Pi Miner Pro' sur un store tiers (APK). Que faire?",
            options: [
                "L'installer pour miner plus vite",
                "Ne PAS installer (Malware probable pour voler vos données)",
                "L'installer sur un vieux téléphone",
                "La partager"
            ],
            correct: 1,
            explanation: "N'installez JAMAIS d'APK hors des sources officielles. Ces 'Miners Pro' sont des malwares pour voler vos identifiants.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'malware-prevention',
            trapType: 'fake-app'
        },
        {
            id: 'q-scam-15',
            question: "Un site web prétend être un 'Exchange Pi' officiel approuvé. Vrai ou Faux?",
            options: [
                "Vrai",
                "Faux. Il n'y a PAS d'exchange officiel Pi approuvé pendant l'Enclosed Mainnet",
                "Vrai, c'est Binance",
                "Vrai, c'est Coinbase"
            ],
            correct: 1,
            explanation: "Pendant l'Enclosed Mainnet, AUCUN exchange n'est approuvé ou connecté. Ce sont des leurres (IOU) ou des arnaques.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'exchange-scams',
            trapType: 'misinformation'
        },
        {
            id: 'q-scam-16',
            question: "Pourquoi est-il dangereux d'utiliser le même mot de passe pour Pi et Facebook?",
            options: [
                "Pas dangereux",
                "Si Facebook est hacké (ou une autre app), le hacker accède à votre Pi",
                "Facebook n'aime pas ça",
                "C'est plus facile à retenir"
            ],
            correct: 1,
            explanation: "La réutilisation de mot de passe est la cause #1 des piratages. Utilisez un mot de passe unique pour votre compte Pi.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'password-security',
            trapType: 'convenience-trap'
        },
        {
            id: 'q-scam-17',
            question: "Qu'est-ce qu'une attaque 'Dusting'?",
            options: [
                "Nettoyer son écran",
                "Recevoir une infime quantité de crypto pour tracer votre identité",
                "Supprimer des fichiers",
                "Une mise à jour"
            ],
            correct: 1,
            explanation: "Le Dusting consiste à envoyer de minuscules montants ('dust') à des milliers de wallets pour désanonymiser leurs propriétaires.",
            difficulty: 'hard',
            cognitiveLevel: 'knowledge',
            topic: 'advanced-attacks',
            trapType: 'obscure-term'
        },
        {
            id: 'q-scam-18',
            question: "Un 'Ami' Facebook que vous connaissez peu vous demande de rejoindre son Cercle de Sécurité. Risque?",
            options: [
                "Aucun, plus de monde = mieux",
                "Si cet 'ami' est un faux compte/bot, il ne vous aidera pas à récupérer votre wallet",
                "Il va voler vos Pi",
                "C'est obligatoire"
            ],
            correct: 1,
            explanation: "Le Security Circle est pour la RÉCUPÉRATION. Ajouter des inconnus nuit à votre capacité à récupérer votre compte en cas de problème.",
            difficulty: 'medium',
            cognitiveLevel: 'analysis',
            topic: 'security-circle',
            trapType: 'misunderstanding-mechanism'
        },
        {
            id: 'q-scam-19',
            question: "Que faire si vous suspectez que votre propre compte est compromis?",
            options: [
                "Rien, c'est trop tard",
                "Changer immédiatement le mot de passe Facebook/Phone associé + Signaler au support",
                "Créer un nouveau compte",
                "Supprimer l'app"
            ],
            correct: 1,
            explanation: "Agissez vite: sécurisez le point d'entrée (Facebook/Phone) en changeant ses accès.",
            difficulty: 'medium',
            cognitiveLevel: 'application',
            topic: 'incident-response',
            trapType: 'panic-reaction'
        },
        {
            id: 'q-scam-20',
            question: "La 'Pi Card' ou 'Pi Visa' existe-t-elle officiellement actuellement?",
            options: [
                "Oui, j'en ai une",
                "Non, ce sont des concepts tiers ou des arnaques pour collecter des adresses",
                "Oui, commandable sur Amazon",
                "Oui, donnée aux Modérateurs"
            ],
            correct: 1,
            explanation: "Il n'y a pas de carte Visa Pi officielle distribuée massivement. Les sites qui en vendent cherchent vos données.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'fake-products',
            trapType: 'wishful-thinking'
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
    ],

    // ========================================
    // ========================================
    // COURS 5: BLOCKCHAIN FUNDAMENTALS (POOL DE 15 QUESTIONS - SELECTION DE 3 A 5 ALÉATOIRES)
    // ========================================
    'blockchain-l2': [
        // EASY
        {
            id: 'q-bc-1',
            question: "Qu'est-ce qu'une blockchain?",
            options: ["Un serveur centralisé", "Un registre distribué et immuable", "Une base de données Excel", "Un cloud Google"],
            correct: 1,
            explanation: "Une blockchain est un registre partagé par tous les participants, sans autorité centrale.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'blockchain-basics', trapType: 'none'
        },
        {
            id: 'q-bc-2',
            question: "Que signifie 'décentralisé'?",
            options: ["Contrôlé par une banque", "Pas de point de contrôle unique", "Hébergé en France", "Anonyme"],
            correct: 1,
            explanation: "La décentralisation signifie qu'aucune entité unique ne contrôle le réseau.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'blockchain-basics', trapType: 'none'
        },
        {
            id: 'q-bc-3',
            question: "Qu'est-ce qu'un Smart Contract?",
            options: ["Un contrat papier scanné", "Un programme auto-exécutant", "Un accord verbal", "Un avocat virtuel"],
            correct: 1,
            explanation: "Un smart contract est du code qui s'exécute automatiquement quand les conditions sont remplies (If This Then That).",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'smart-contracts', trapType: 'misconception'
        },
        {
            id: 'q-bc-4',
            question: "Quel problème le Bitcoin a-t-il résolu en premier?",
            options: ["Le spam email", "La double dépense sans tiers de confiance", "La vitesse d'internet", "Le stockage de photos"],
            correct: 1,
            explanation: "Bitcoin a résolu le problème de la double dépense : comment envoyer une valeur numérique sans qu'elle soit copiée-collée.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'crypto-history', trapType: 'none'
        },
        {
            id: 'q-bc-5',
            question: "Qu'est-ce qu'un 'Hash'?",
            options: ["Une drogue", "Une empreinte digitale numérique unique", "Un mot de passe", "Un hashtag Twitter"],
            correct: 1,
            explanation: "Un hash est une chaîne de caractères unique générée à partir de données. Si on change un seul bit de donnée, le hash change complètement.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'cryptography', trapType: 'similar-concepts'
        },
        // MEDIUM
        {
            id: 'q-bc-6',
            question: "Quelle est la différence entre PoW (Proof of Work) et SCP (Stellar Consensus)?",
            options: ["Aucune", "PoW utilise de l'énergie, SCP utilise la confiance", "SCP est pour les banques", "PoW est plus rapide"],
            correct: 1,
            explanation: "PoW sécurise via le gaspillage d'énergie (calcul), SCP sécurise via les relations de confiance (quorum slices).",
            difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'consensus', trapType: 'precision'
        },
        {
            id: 'q-bc-7',
            question: "Pourquoi la blockchain est-elle dite 'immuable'?",
            options: ["Elle ne bouge pas", "On ne peut pas modifier le passé sans invalider toute la chaîne", "Elle est lente", "Elle est en lecture seule"],
            correct: 1,
            explanation: "Modifier un bloc passé changerait son hash, invalidant le lien avec le bloc suivant, et ainsi de suite jusqu'au présent.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'blockchain-security', trapType: 'technical-concept'
        },
        {
            id: 'q-bc-8',
            question: "Qu'est-ce qu'un 'Fork'?",
            options: ["Une fourchette", "Une division de la blockchain en deux versions", "Une erreur de code", "Une mise à jour payante"],
            correct: 1,
            explanation: "Un fork se produit quand le réseau se divise, soit par désaccord (hard fork), soit par mise à jour (soft fork).",
            difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'blockchain-governance', trapType: 'misconception'
        },
        {
            id: 'q-bc-9',
            question: "Rôle des 'Miners' (ou 'Nodes')?",
            options: ["Créer de l'argent", "Valider les transactions et sécuriser le réseau", "Héberger un site web", "Vendre des cryptos"],
            correct: 1,
            explanation: "Leur rôle principal est de vérifier la validité des transactions et de les ajouter au registre commun.",
            difficulty: 'medium', cognitiveLevel: 'application', topic: 'blockchain-actors', trapType: 'misconception'
        },
        {
            id: 'q-bc-10',
            question: "Qu'est-ce qu'une dApp?",
            options: ["Une App sur l'Apple Store", "Une Application Décentralisée tournant sur blockchain", "Une app de rencontre", "Un virus"],
            correct: 1,
            explanation: "Une dApp (Decentralized App) a son code backend (smart contracts) sur une blockchain P2P.",
            difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'dapps', trapType: 'none'
        },
        // HARD
        {
            id: 'q-bc-11',
            question: "Qu'est-ce que le 'Trilemme de la Blockchain'?",
            options: ["Passé, Présent, Futur", "Sécurité, Décentralisation, Scalabilité", "Bitcoin, Ethereum, Pi", "Vitesse, Coût, Qualité"],
            correct: 1,
            explanation: "Le trilemme stipule qu'il est difficile d'optimiser simultanément la Sécurité, la Décentralisation et la Scalabilité.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'blockchain-theory', trapType: 'complex-concept'
        },
        {
            id: 'q-bc-12',
            question: "Comment le SCP (Pi) résout-il le problème énergétique du PoW?",
            options: ["Il utilise des batteries solaires", "Il ne fait pas de calculs intensifs (hash puzzles)", "Il mine la nuit", "Il utilise moins de serveurs"],
            correct: 1,
            explanation: "SCP ne demande pas de résoudre des puzzles cryptographiques complexes (minage), il utilise le vote fédéré.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'consensus-mechanisms', trapType: 'none'
        },
        {
            id: 'q-bc-13',
            question: "Qu'est-ce qu'une 'Attaque des 51%'?",
            options: ["Une promo Black Friday", "Quand une entité contrôle la majorité de la puissance (ou confiance) du réseau", "Quand 51% des utilisateurs vendent", "Un hack de serveur"],
            correct: 1,
            explanation: "Si un attaquant contrôle >50% du réseau, il peut réécrire l'histoire récente et double-dépenser.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'blockchain-attacks', trapType: 'none'
        },
        {
            id: 'q-bc-14',
            question: "Quelle est la différence entre un Token et un Coin?",
            options: ["C'est pareil", "Coin = natif (sa propre blockchain), Token = sur une autre blockchain (réseau hôte)", "Coin = cher, Token = pas cher", "Token = physique"],
            correct: 1,
            explanation: "Pi est un Coin (sa propre blockchain). USDT sur Ethereum est un Token (ERC-20).",
            difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'crypto-taxonomy', trapType: 'precision'
        },
        {
            id: 'q-bc-15',
            question: "Qu'est-ce qu'un Oracle en blockchain?",
            options: ["Une prédiction du futur", "Un pont qui apporte des données du monde réel vers la blockchain", "Une base de données SQL", "Un mineur expert"],
            correct: 1,
            explanation: "Les blockchains sont fermées. Un Oracle (ex: Chainlink) injecte des données externes (prix météo, scores sportifs) pour les smart contracts.",
            difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'oracles', trapType: 'misconception'
        }
    ],

    // ========================================
    // COURS 6: DEFI INTRODUCTION (10 QUESTIONS) - PREMIUM
    // ========================================
    'defi-l2': [
        // EASY (4 questions)
        {
            id: 'q-defi-1',
            question: "Que signifie DeFi?",
            options: ["Decentralized Finance", "Digital Finance", "Defined Finance", "Delegated Finance"],
            correct: 0,
            explanation: "DeFi = Decentralized Finance (Finance Décentralisée), des services financiers sans intermédiaires traditionnels.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'defi-basics',
            trapType: 'none'
        },
        {
            id: 'q-defi-2',
            question: "Qu'est-ce qu'un AMM?",
            options: [
                "Automated Money Manager",
                "Automated Market Maker - algorithme qui fixe les prix",
                "American Money Market",
                "Advanced Mining Module"
            ],
            correct: 1,
            explanation: "AMM = Automated Market Maker. Un algorithme qui remplace les carnets d'ordres traditionnels pour fixer les prix automatiquement.",
            difficulty: 'easy',
            cognitiveLevel: 'knowledge',
            topic: 'amm',
            trapType: 'terminology'
        },
        {
            id: 'q-defi-3',
            question: "Qu'est-ce qu'une Liquidity Pool?",
            options: [
                "Une piscine de crypto",
                "Un ensemble de tokens verrouillés pour faciliter les échanges",
                "Un portefeuille personnel",
                "Une limite de retrait"
            ],
            correct: 1,
            explanation: "Une Liquidity Pool est un smart contract contenant des paires de tokens permettant les échanges décentralisés.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'liquidity-pools',
            trapType: 'none'
        },
        {
            id: 'q-defi-4',
            question: "Quel est l'avantage principal du staking?",
            options: [
                "Minage gratuit",
                "Gagner des récompenses passives en verrouillant des tokens",
                "Accès VIP",
                "Protection contre les hackers"
            ],
            correct: 1,
            explanation: "Le staking permet de gagner des récompenses (yield) en verrouillant vos tokens pour sécuriser le réseau ou fournir de la liquidité.",
            difficulty: 'easy',
            cognitiveLevel: 'comprehension',
            topic: 'staking',
            trapType: 'none'
        },

        // MEDIUM (4 questions)
        {
            id: 'q-defi-5',
            question: "Qu'est-ce que l'Impermanent Loss?",
            options: [
                "Perte permanente de tokens",
                "Perte temporaire due aux variations de prix dans une LP",
                "Vol de crypto",
                "Frais de transaction"
            ],
            correct: 1,
            explanation: "L'Impermanent Loss survient quand le ratio des tokens dans une LP change à cause de la volatilité des prix. Elle devient 'permanente' si vous retirez.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'defi-risks',
            trapType: 'technical-concept'
        },
        {
            id: 'q-defi-6',
            question: "Comment fonctionne la formule x*y=k dans un AMM?",
            options: [
                "x et y sont les quantités de 2 tokens, k reste constant",
                "C'est aléatoire",
                "x = nombre d'utilisateurs",
                "k = rendement garanti"
            ],
            correct: 0,
            explanation: "Dans la formule x*y=k, x et y sont les quantités des deux tokens dans la pool. Le produit k reste constant après chaque swap.",
            difficulty: 'medium',
            cognitiveLevel: 'analysis',
            topic: 'amm-mechanics',
            trapType: 'technical-depth'
        },
        {
            id: 'q-defi-7',
            question: "Qu'est-ce qu'un yield farming?",
            options: [
                "Cultiver des légumes",
                "Optimiser le rendement en déplaçant des fonds entre protocoles DeFi",
                "Miner des crypto",
                "Acheter des actions"
            ],
            correct: 1,
            explanation: "Le yield farming consiste à maximiser les rendements en déplaçant stratégiquement des fonds entre différents protocoles DeFi.",
            difficulty: 'medium',
            cognitiveLevel: 'comprehension',
            topic: 'yield-farming',
            trapType: 'terminology'
        },
        {
            id: 'q-defi-8',
            question: "Pourquoi les APY DeFi peuvent-ils atteindre 1000%+?",
            options: [
                "C'est garanti par les banques",
                "Risques élevés + tokens de gouvernance distribués + effet de levier possible",
                "C'est une arnaque toujours",
                "Erreur de calcul"
            ],
            correct: 1,
            explanation: "APY élevés = risques élevés (smart contract bugs, rug pulls, IL) + tokens de gouvernance distribués comme incitation + parfois effet de levier.",
            difficulty: 'medium',
            cognitiveLevel: 'analysis',
            topic: 'defi-risks',
            trapType: 'too-good-to-be-true'
        },

        // HARD (2 questions)
        {
            id: 'q-defi-9',
            question: "Qu'est-ce qu'un 'Rug Pull' en DeFi?",
            options: [
                "Mise à jour du protocole",
                "Les développeurs retirent la liquidité et disparaissent avec les fonds",
                "Un dividende spécial",
                "Une technique de trading"
            ],
            correct: 1,
            explanation: "Un Rug Pull est une arnaque où les développeurs retirent soudainement toute la liquidité, laissant les tokens sans valeur.",
            difficulty: 'hard',
            cognitiveLevel: 'comprehension',
            topic: 'defi-scams',
            trapType: 'critical-warning'
        },
        {
            id: 'q-defi-10',
            question: "Qu'est-ce qu'une attaque flash loan?",
            options: [
                "Vol physique de crypto",
                "Emprunt sans collatéral dans une seule transaction pour manipuler les prix",
                "Demande de prêt refusée",
                "Paiement express"
            ],
            correct: 1,
            explanation: "Une flash loan attack utilise un emprunt remboursé dans la même transaction pour manipuler les prix d'actifs et exploiter des vulnérabilités.",
            difficulty: 'hard',
            cognitiveLevel: 'analysis',
            topic: 'defi-attacks',
            trapType: 'complex-concept'
        }
    ]
};

// ==========================================
// 🇺🇸 ENGLISH BANK
// ==========================================
const BASE_QUESTION_BANK_EN: Record<string, QuizQuestion[]> = {
    'pi-intro-l2': [
        // EASY (20 items)
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
            question: "What is the GCV (General Consensus Value) concept in Pi?",
            options: ["$100", "$314,159", "$1000", "$50"],
            correct: 1,
            explanation: "The GCV is a value supported by parts of the community at $314,159, referencing the mathematical constant π.",
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
        },
        {
            id: 'q-pi-intro-6',
            question: "When was Pi Network launched?",
            options: ["2017", "2019", "2020", "2021"],
            correct: 1,
            explanation: "Pi Network was launched on March 14, 2019 (Pi Day - 3/14).",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-history', trapType: 'none'
        },
        {
            id: 'q-pi-intro-7',
            question: "Who founded Pi Network?",
            options: ["MIT Students", "Stanford PhDs", "Satoshi Nakamoto", "Vitalik Buterin"],
            correct: 1,
            explanation: "Pi was founded by Stanford PhDs (Dr. Nicolas Kokkalis, Dr. Chengdiao Fan).",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-history', trapType: 'similar-institutions'
        },
        {
            id: 'q-pi-intro-8',
            question: "Does Pi Network require special hardware?",
            options: ["Yes, a powerful GPU", "Yes, an ASIC miner", "No, just a smartphone", "Yes, a dedicated PC"],
            correct: 2,
            explanation: "Pi requires only a smartphone, making it accessible to everyone.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-basics', trapType: 'none'
        },
        {
            id: 'q-pi-intro-9',
            question: "Approximately how many Pioneers does Pi Network have?",
            options: ["1 million", "10 million", "50+ million", "500 million"],
            correct: 2,
            explanation: "Pi counts over 50 million engaged Pioneers worldwide.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-community', trapType: 'magnitude'
        },
        {
            id: 'q-pi-intro-10',
            question: "Does Pi Network drain your battery?",
            options: ["Yes, heavily like Bitcoin", "No, minimal consumption", "Yes, requires hourly charging", "Depends on the phone"],
            correct: 1,
            explanation: "Pi is designed to have minimal impact on battery life as it doesn't compute proof-of-work puzzles.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-technology', trapType: 'false-analogy'
        },
        {
            id: 'q-pi-intro-11',
            question: "What is the symbol for Pi?",
            options: ["₿", "Ξ", "π", "Π"],
            correct: 2,
            explanation: "The symbol for Pi is π (lowercase pi).",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-basics', trapType: 'visual-similarity'
        },
        {
            id: 'q-pi-intro-12',
            question: "Is Pi Network a blockchain?",
            options: ["No, it's just an app", "Yes, it is a blockchain", "No, it's a game", "Yes, but centralized"],
            correct: 1,
            explanation: "Pi Network is indeed a decentralized blockchain ecosystem.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-technology', trapType: 'misconception'
        },
        {
            id: 'q-pi-intro-13',
            question: "Do you need to pay to mine Pi?",
            options: ["Yes, $10/month", "Yes, $100 upfront", "No, it's completely free", "Yes, for Premium only"],
            correct: 2,
            explanation: "Mining Pi is 100% free; there are no hidden fees.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-basics', trapType: 'scam-warning'
        },
        {
            id: 'q-pi-intro-14',
            question: "How often must you mine Pi?",
            options: ["Every hour", "Every 24 hours", "Once a week", "Continuously"],
            correct: 1,
            explanation: "You must check in and confirm your mining session every 24 hours.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-mining', trapType: 'none'
        },
        {
            id: 'q-pi-intro-15',
            question: "Is Pi Network open source?",
            options: ["No, completely closed", "Yes, partially", "Yes, totally", "Only for devs"],
            correct: 1,
            explanation: "Parts of Pi are open source (like the Pi Node and SDK), while others are proprietary during development.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-technology', trapType: 'partial-truth'
        },
        {
            id: 'q-pi-intro-16',
            question: "Can you sell your Pi right now (during Enclosed Mainnet)?",
            options: ["Yes, on exchanges", "Yes, but only via P2P for goods/services", "No, strictly forbidden", "Yes, for cash"],
            correct: 1,
            explanation: "During Enclosed Mainnet, Pi can only be exchanged for goods and services within the ecosystem, not for fiat or other crypto on exchanges.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'pi-economics', trapType: 'scam-warning'
        },
        {
            id: 'q-pi-intro-17',
            question: "What is a 'Pioneer' in Pi Network?",
            options: ["A developer", "A user who mines Pi", "An admin", "An investor"],
            correct: 1,
            explanation: "A Pioneer is any user who has installed the app and mines Pi.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-terminology', trapType: 'none'
        },
        {
            id: 'q-pi-intro-18',
            question: "Does Pi Network have a native token?",
            options: ["No", "Yes, Pi (π)", "Yes, PiCoin", "No, it uses Bitcoin"],
            correct: 1,
            explanation: "Pi (π) is the native utility token of the Pi Network.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-basics', trapType: 'naming-confusion'
        },
        {
            id: 'q-pi-intro-19',
            question: "Can you create multiple Pi accounts?",
            options: ["Yes, unlimited", "Yes, max 3", "No, strictly forbidden (1 person = 1 account)", "Yes, with different numbers"],
            correct: 2,
            explanation: "Strict rule: One person = One account. Multi-accounting leads to banning.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'pi-rules', trapType: 'temptation'
        },
        {
            id: 'q-pi-intro-20',
            question: "What happens when the app is closed?",
            options: ["Mining continues if session is active", "Mining stops", "Battery drains", "You lose Pi"],
            correct: 0,
            explanation: "Pi mining continues in the cloud/backend for the 24h cycle even if the app is closed.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'pi-technology', trapType: 'misconception'
        },
        // MEDIUM (20 items)
        {
            id: 'q-pi-intro-21',
            question: "What creates the base mining rate for Pioneers?",
            options: ["Time spent in app", "A formula based on network growth and halving", "Random generated", "Payment"],
            correct: 1,
            explanation: "The base mining rate is determined by a declining formula (halving) based on network size.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-mining', trapType: 'temporal-confusion'
        },
        {
            id: 'q-pi-intro-22',
            question: "What is the 'Security Circle'?",
            options: ["An antivirus", "A trust group of 3-5 Pioneers securing the network", "A different coin", "A wallet type"],
            correct: 1,
            explanation: "The Security Circle is a group of 3-5 trusted individuals built by each Pioneer to secure the global trust graph.",
            difficulty: 'medium', cognitiveLevel: 'application', topic: 'pi-security', trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-23',
            question: "What is the main advantage of Pi Mainnet?",
            options: ["More free Pi", "Real utility and exchange for goods/services", "Faster mining", "No KYC needed"],
            correct: 1,
            explanation: "Mainnet allows Pi to be used for real transactions within the ecosystem (dApps, goods, services).",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-ecosystem', trapType: 'wishful-thinking'
        },
        {
            id: 'q-pi-intro-24',
            question: "Why does Pi require internet connection to start mining?",
            options: ["To download blockchain", "To verify account status and start the 24h timer", "To mine blocks", "Not needed"],
            correct: 1,
            explanation: "Internet is needed to ping the server and start the 24-hour mining session (proof of liveness).",
            difficulty: 'medium', cognitiveLevel: 'application', topic: 'pi-mining', trapType: 'false-analogy'
        },
        {
            id: 'q-pi-intro-25',
            question: "What boosts your mining rate?",
            options: ["Powerful phone", "Active Security Circle & Lockup", "Mining 24/7", "Paid subscription"],
            correct: 1,
            explanation: "Building a Security Circle, inviting others, and configuring a Lockup boost your mining rate.",
            difficulty: 'medium', cognitiveLevel: 'application', topic: 'pi-mining', trapType: 'misconception'
        },
        {
            id: 'q-pi-intro-26',
            question: "What is 'Enclosed Mainnet'?",
            options: ["A test network", "A phase where firewalls prevent external connectivity (exchanges)", "A closed wallet", "Different app"],
            correct: 1,
            explanation: "Enclosed Mainnet puts a firewall around Pi Network to build ecosystem utility before opening to external exchanges.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-technology', trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-27',
            question: "Max people in Security Circle for max rewards?",
            options: ["3", "5", "10", "Unlimited"],
            correct: 1,
            explanation: "You need 5 trusted members in your Security Circle to reach the maximum security boost (100%).",
            difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'pi-security', trapType: 'none'
        },
        {
            id: 'q-pi-intro-28',
            question: "What happens if you miss a mining session?",
            options: ["You lose all Pi", "Mining stops until you restart", "Nothing", "You get banned"],
            correct: 1,
            explanation: "Mining pauses after 24h. You must tap the button again to resume earning.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-mining', trapType: 'fear-mongering'
        },
        {
            id: 'q-pi-intro-29',
            question: "What is the role of a 'Contributor'?",
            options: ["Mines more", "Adds security by adding members to Security Circle", "Develops apps", "Moderates chat"],
            correct: 1,
            explanation: "A Contributor adds to network security by building a trust graph (Security Circle).",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-roles', trapType: 'none'
        },
        {
            id: 'q-pi-intro-30',
            question: "Can you transfer Pi before KYC?",
            options: ["Yes, freely", "No, KYC is required to migrate balances", "Yes, with fees", "Only to friends"],
            correct: 1,
            explanation: "Balances mined are pending until the Pioneer passes KYC and migrates to Mainnet.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-security', trapType: 'restriction'
        },
        {
            id: 'q-pi-intro-31',
            question: "Purpose of the 'Halving'?",
            options: ["Punish users", "Create scarcity by reducing supply over time", "Slow network", "Test patience"],
            correct: 1,
            explanation: "Halving reduces the mining rate as the network grows, creating scarcity and value potential.",
            difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'pi-economics', trapType: 'none'
        },
        {
            id: 'q-pi-intro-32',
            question: "What is a Pi dApp?",
            options: ["Mobile game", "Decentralized Application built on Pi Platform", "Standard website", "Virus"],
            correct: 1,
            explanation: "A dApp is an application that integrates with the Pi Blockchain and Pi SDK.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-ecosystem', trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-33',
            question: "Does mining affect phone performance?",
            options: ["Yes, significantly", "No, negligible impact", "Yes, slightly", "Only old phones"],
            correct: 1,
            explanation: "Since Pi doesn't do heavy Proof-of-Work locally, performance impact is negligible.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-technology', trapType: 'misconception'
        },
        {
            id: 'q-pi-intro-34',
            question: "How long does KYC usually take?",
            options: ["Instant", "Minutes to Weeks depending on volume and validation", "Exact 24h", "Years"],
            correct: 1,
            explanation: "KYC timing varies based on availability of human validators in your region and AI processing.",
            difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'pi-security', trapType: 'expectation'
        },
        {
            id: 'q-pi-intro-35',
            question: "What means 'migrated to mainnet'?",
            options: ["App update", "Transferable Balance moved to your Wallet", "New account", "Deleted account"],
            correct: 1,
            explanation: "Migration means your verified Pi balance is moved onto the live blockchain in your wallet.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-technology', trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-36',
            question: "Does Pi use Proof of Work (PoW)?",
            options: ["Yes", "No, it uses SCP (Federated Byzantine Agreement)", "Yes, lite version", "Partially"],
            correct: 1,
            explanation: "Pi uses a variation of Stellar Consensus Protocol (FBA), not Proof of Work.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-technology', trapType: 'false-analogy'
        },
        {
            id: 'q-pi-intro-37',
            question: "Can you lose your mined Pi?",
            options: ["Yes, if you lose your Passphrase", "No, never", "Only if inactive", "Yes if KYC fails"],
            correct: 0,
            explanation: "If you migrate to Mainnet and lose your Wallet Passphrase, those Pi are lost forever.",
            difficulty: 'medium', cognitiveLevel: 'application', topic: 'pi-security', trapType: 'critical-warning'
        },
        {
            id: 'q-pi-intro-38',
            question: "What is Pi Browser?",
            options: ["Chrome equivalent", "A gateway to the Pi Web3 ecosystem", "Chat app", "External wallet"],
            correct: 1,
            explanation: "Pi Browser is the interface for accessing Pi Apps, Wallet, KYC, and the decentralized web.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-ecosystem', trapType: 'none'
        },
        {
            id: 'q-pi-intro-39',
            question: "How does Pi prevent bots?",
            options: ["Captchas", "Strict KYC (Liveness check)", "Time limits", "SMS verify"],
            correct: 1,
            explanation: "The liveness check during KYC ensures a real human is behind the account.",
            difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'pi-security', trapType: 'none'
        },
        {
            id: 'q-pi-intro-40',
            question: "Are pre-KYC Pi lost?",
            options: ["Yes", "No, they wait for KYC verification", "Yes after 6 months", "Half lost"],
            correct: 1,
            explanation: "They remain in your unverified balance until you and your team pass KYC.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-security', trapType: 'fear-mongering'
        },
        // HARD (10 items)
        {
            id: 'q-pi-intro-41',
            question: "Advantage of SCP over PoW?",
            options: ["More secure", "Eco-friendly, scalable, fast finality", "More decentralized", "Total anonymity"],
            correct: 1,
            explanation: "SCP is vastly more energy efficient and faster (3-5s confirmation) than Bitcoin's PoW.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'pi-technology', trapType: 'nuanced-comparison'
        },
        {
            id: 'q-pi-intro-42',
            question: "Why does Pi use an 'invitation' model?",
            options: ["Revenue", "Build an organic Trust Graph for security", "Exclusivity", "Marketing"],
            correct: 1,
            explanation: "Referrals build the Security Circles (Trust Graph) which SCP uses for consensus validation.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'pi-strategy', trapType: 'deep-reasoning'
        },
        {
            id: 'q-pi-intro-43',
            question: "What is 'Lockup'?",
            options: ["Ban", "Voluntarily locking Pi for higher mining rate", "Penalty", "KYC type"],
            correct: 1,
            explanation: "Lockup is a mechanism to stabilize the token economy by incentivizing long-term holding.",
            difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'pi-economics', trapType: 'terminology-confusion'
        },
        {
            id: 'q-pi-intro-44',
            question: "How does Pi maintain decentralization?",
            options: ["Distributed Nodes & Trust Graph", "Central servers", "Single data center", "PoW"],
            correct: 0,
            explanation: "Rather than one central authority, thousands of Nodes using the Trust Graph secure the ledger.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'pi-technology', trapType: 'technical-depth'
        },
        {
            id: 'q-pi-intro-45',
            question: "Risk of multi-accounting?",
            options: ["Permanent ban & total loss of Pi", "Warning", "Half balance lost", "Suspension"],
            correct: 0,
            explanation: "Pi Network has a zero-tolerance policy for scripts/bots/multi-accounts. Result is total burn.",
            difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'pi-rules', trapType: 'severity'
        },
        {
            id: 'q-pi-intro-46',
            question: "Why establish 'Phases' (Beta, Testnet, Mainnet)?",
            options: ["Iterative testing and community building", "Delay tactics", "Random", "Hype"],
            correct: 0,
            explanation: "Phases allow the network to mature, debug, and scale organically before real economic value is at risk.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'pi-strategy', trapType: 'strategic-thinking'
        },
        {
            id: 'q-pi-intro-47',
            question: "What determines Total Supply?",
            options: ["Unlimited", "Mining mechanism + Activity + Network size", "Founders", "100 Billion fixed"],
            correct: 3,
            explanation: "The max supply is capped at 100 Billion Pi, distributed over time via mining rewards.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'pi-economics', trapType: 'complex-mechanism'
        },
        {
            id: 'q-pi-intro-48',
            question: "How does Security Circle secure the network?",
            options: ["Identifies malicious nodes via Trust Graph intersections", "Encryption", "Passwords", "Firewall"],
            correct: 0,
            explanation: "SCP uses intersections of Quorum Slices (Security Circles) to agree on transactions, blocking bad actors.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'pi-security', trapType: 'deep-reasoning'
        },
        {
            id: 'q-pi-intro-49',
            question: "Key difference Testnet vs Mainnet?",
            options: ["Testnet = Fake Pi, Mainnet = Real Pi", "None", "Speed", "KYC"],
            correct: 0,
            explanation: "Testnet coins have no value and are reset periodically. Mainnet coins are permanent assets.",
            difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'pi-technology', trapType: 'technical-nuance'
        },
        {
            id: 'q-pi-intro-50',
            question: "Why prioritize 'Peer-to-Peer'?",
            options: ["Cut middlemen costs & empower individuals", "Trend", "Avoid laws", "Simple"],
            correct: 0,
            explanation: "Pi aims to return value to creators/users (Pioneers) rather than tech giants or banks.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'pi-philosophy', trapType: 'philosophical-depth'
        }
    ],
    'wallet-l2-comprehension': [
        {
            id: 'q-wallet-1',
            question: "Who can reset your Passphrase if you lose it?",
            options: ["Pi Core Team", "Your Security Circle", "No one", "Technical Support"],
            correct: 2,
            explanation: "Non-custodial wallet = ONLY YOU have control. No one can reset your Passphrase.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'wallet-basics', trapType: 'misconception'
        },
        {
            id: 'q-wallet-2',
            question: "How many words are in a Pi Wallet Passphrase?",
            options: ["12 words", "18 words", "24 words", "32 words"],
            correct: 2,
            explanation: "The Pi Wallet Passphrase contains 24 words to be saved in the exact order.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'wallet-basics', trapType: 'none'
        },
        {
            id: 'q-wallet-3',
            question: "What is your Public Key (Wallet Address) used for?",
            options: ["To login to the app", "To share with others to receive Pi", "To access your settings", "It is secret"],
            correct: 1,
            explanation: "Your Public Key (starts with G) is like your IBAN. You can share it to receive Pi.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'wallet-basics', trapType: 'none'
        },
        {
            id: 'q-wallet-4',
            question: "Where should you enter your Passphrase?",
            options: ["Any website asking for it", "Only in the official Pi Browser Wallet", "In an email to support", "On social media"],
            correct: 1,
            explanation: "NEVER enter your Passphrase anywhere except the official Pi Wallet inside Pi Browser.",
            difficulty: 'medium', cognitiveLevel: 'application', topic: 'wallet-security', trapType: 'critical-warning'
        },
        {
            id: 'q-wallet-5',
            question: "What happens if you share your Passphrase?",
            options: ["Nothing", "You lose all your Pi forever (theft)", "You get a bonus", "Your account is verified"],
            correct: 1,
            explanation: "Sharing your Passphrase allows anyone to steal all your assets instantly and irreversibly.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'wallet-security', trapType: 'fear-mongering'
        }
    ],
    'safety-l2': [
        {
            id: 'q-scam-1',
            question: "What is the official domain of Pi Network?",
            options: ["pi-network.com", "minepi.com", "pinetwork.org", "getpi.com"],
            correct: 1,
            explanation: "The ONLY official domain is minepi.com. Any other domain is suspicious!",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'scam-basics', trapType: 'none'
        },
        {
            id: 'q-scam-2',
            question: "Will the Pi Core Team EVER ask for your Passphrase?",
            options: ["Yes, for KYC", "Yes, if there's a technical issue", "NEVER, under any pretext", "Yes, but only by official email"],
            correct: 2,
            explanation: "The Core Team will NEVER ask for your Passphrase. Anyone who asks is a scammer.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'scam-rules', trapType: 'absolute-rule'
        },
        {
            id: 'q-scam-3',
            question: "How do you spot a fake Pi website?",
            options: ["It asks for your Passphrase to 'verify' or 'stake'", "It has the Pi logo", "It looks professional", "It is on Google"],
            correct: 0,
            explanation: "Any site asking for your Passphrase for verification, airdrop, or staking outside the app is a SCAM.",
            difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'scam-detection', trapType: 'none'
        },
        {
            id: 'q-scam-4',
            question: "Is 'Pi Support' on Telegram/Twitter/Facebook real?",
            options: ["Yes, they are helpful", "No, Core Team does not provide DM support", "Yes, but only verified accounts", "Sometimes"],
            correct: 1,
            explanation: "Core Team does NOT provide individual support via DMs on social media. DM support offers are scams.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'scam-channels', trapType: 'none'
        },
        {
            id: 'q-scam-5',
            question: "What should you do if you suspect a scam?",
            options: ["Try it with a small amount", "Report it in the Pi App and do not interact", "Share it with friends", "Ignore it"],
            correct: 1,
            explanation: "Report suspicious activities via the official report buttons in the Pi App or Pi Browser.",
            difficulty: 'easy', cognitiveLevel: 'application', topic: 'community-action', trapType: 'none'
        }
    ],
    'kyc-l2': [
        {
            id: 'q-kyc-1',
            question: "Why does Pi Network require KYC?",
            options: ["To sell your data", "To ensure 1 person = 1 account (prevent bots)", "To complicate registration", "It is optional"],
            correct: 1,
            explanation: "KYC ensures that one Pi = one real person, preventing bots and multi-accounts that would devalue Pi.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'kyc-purpose', trapType: 'none'
        },
        {
            id: 'q-kyc-2',
            question: "Which document can be used for KYC?",
            options: ["Library card", "Government-issued ID (Passport, ID Card, Driver's License)", "Student ID", "Gym membership"],
            correct: 1,
            explanation: "Only official government-issued ID documents (Passport, National ID, Driver's License) are accepted.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-docs', trapType: 'none'
        },
        {
            id: 'q-kyc-3',
            question: "Why does the KYC process take time?",
            options: ["The system is broken", "It involves manual validation by Human Validators from your country", "Core Team is slow", "It is random"],
            correct: 1,
            explanation: "KYC is validated by a distributed workforce of Human Validators to ensure accuracy and security.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'kyc-process', trapType: 'expectation'
        },
        {
            id: 'q-kyc-4',
            question: "Is your data safe during KYC?",
            options: ["No, everyone sees it", "Yes, heavily redacted and only shown to validators in pieces", "Validators see everything", "It is public"],
            correct: 1,
            explanation: "Pi KYC uses data redaction. Validators only see the specific piece of data they need to verify, never your full ID.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'kyc-privacy', trapType: 'fear-mongering'
        },
        {
            id: 'q-kyc-5',
            question: "Can under-18s pass KYC?",
            options: ["Yes, immediately", "No, never", "Yes, with parental consent (special process)", "Yes, if they hide their age"],
            correct: 2,
            explanation: "Minors will have a specific KYC process requiring parental consent.",
            difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'kyc-rules', trapType: 'none'
        }
    ],
    'blockchain-l2': [
        {
            id: 'q-blockchain-1',
            question: "What is a blockchain?",
            options: ["A centralized server", "A distributed and immutable ledger", "A classic database", "A social network"],
            correct: 1,
            explanation: "A blockchain is a distributed, decentralized, and immutable ledger where data is shared among many nodes.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'blockchain-basics', trapType: 'none'
        },
        {
            id: 'q-blockchain-2',
            question: "What is the role of a Node?",
            options: ["To create new rules", "To validate transactions and secure the ledger", "To mine Bitcoin", "To host the website"],
            correct: 1,
            explanation: "Nodes validate transactions according to the consensus protocol and maintain the ledger's integrity.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'blockchain-actors', trapType: 'none'
        },
        {
            id: 'q-blockchain-3',
            question: "What makes a blockchain 'immutable'?",
            options: ["It cannot be turned off", "Data blocks are cryptographically linked; changing one breaks the chain", "The government protects it", "It is very big"],
            correct: 1,
            explanation: "Each block contains the hash of the previous one. Modifying data would require re-calculating the entire chain, which is impossible.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'blockchain-theory', trapType: 'technical-concept'
        },
        {
            id: 'q-blockchain-4',
            question: "What is a Smart Contract?",
            options: ["A legal paper", "Self-executing code stored on the blockchain", "A promise between friends", "A bank transfer"],
            correct: 1,
            explanation: "Smart Contracts are programs that run automatically when predetermined conditions are met.",
            difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'smart-contracts', trapType: 'none'
        },
        {
            id: 'q-blockchain-5',
            question: "What is Decentralization?",
            options: ["No internet needed", "No single point of failure or control", "Everyone is anonymous", "No rules"],
            correct: 1,
            explanation: "Decentralization means control is distributed among many participants rather than a single authority.",
            difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'blockchain-philosophy', trapType: 'none'
        }
    ],
    'defi-l2': [
        {
            id: 'q-defi-1',
            question: "What does DeFi stand for?",
            options: ["Decentralized Finance", "Digital Finance", "Defined Finance", "Delegated Finance"],
            correct: 0,
            explanation: "DeFi = Decentralized Finance, financial services without traditional intermediaries.",
            difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'defi-basics', trapType: 'none'
        },
        {
            id: 'q-defi-2',
            question: "What is a Liquidity Pool?",
            options: ["A swimming pool", "A smart contract where users deposit tokens to facilitate trading", "A bank account", "A scam"],
            correct: 1,
            explanation: "Liquidity Pools allow users to trade without a counterparty by trading against the pool's funds.",
            difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'liquidity-pools', trapType: 'none'
        },
        {
            id: 'q-defi-3',
            question: "What is Impermanent Loss?",
            options: ["A permanent loss of funds", "Temporary loss of value compared to holding tokens, due to price divergence", "A transaction fee", "A hacker attack"],
            correct: 1,
            explanation: "Impermanent loss happens when the price of deposited assets changes compared to when you deposited them.",
            difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'defi-risks', trapType: 'complex-concept'
        },
        {
            id: 'q-defi-4',
            question: "What is an AMM?",
            options: ["Automated Market Maker", "Automatic Money Machine", "Anti-Money Mechanism", "Advanced Mining Mode"],
            correct: 0,
            explanation: "AMM (Automated Market Maker) uses algorithms to price assets in a liquidity pool.",
            difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'amm', trapType: 'terminology'
        },
        {
            id: 'q-defi-5',
            question: "What is Yield Farming?",
            options: ["Agriculture", "Earning rewards by leveraging different DeFi protocols", "Mining rocks", "Creating tokens"],
            correct: 1,
            explanation: "Yield farming involves moving capital around DeFi protocols to maximize return on investment.",
            difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'yield-farming', trapType: 'none'
        }
    ]
};

// Import Expanded Questions
import { EXPANDED_QUESTIONS_FR, EXPANDED_QUESTIONS_EN } from './expandedQuestions';

// FORCE TYPE SAFETY
const MERGED_FR: Record<string, QuizQuestion[]> = { ...BASE_QUESTION_BANK_FR };
const MERGED_EN: Record<string, QuizQuestion[]> = { ...BASE_QUESTION_BANK_EN };

// Helper to safely merge arrays
const safeMerge = (base: QuizQuestion[] | undefined, expanded: QuizQuestion[] | undefined): QuizQuestion[] => {
    return [...(base || []), ...(expanded || [])];
};

// Apply merges manually for critical sections to ensure keys exist
const CRITICAL_KEYS = ['wallet-l2-comprehension', 'safety-l2', 'kyc-l2', 'blockchain-l2', 'defi-l2', 'premium-l1', 'premium-l2'];

CRITICAL_KEYS.forEach(key => {
    MERGED_FR[key] = safeMerge(BASE_QUESTION_BANK_FR[key], EXPANDED_QUESTIONS_FR[key]);
    MERGED_EN[key] = safeMerge(BASE_QUESTION_BANK_EN[key], EXPANDED_QUESTIONS_EN[key]);
});

// Fonction helper pour obtenir questions d'un layer (BILINGUE)
export function getLayerQuestions(layerId: string, lang: string = 'fr'): QuizQuestion[] {
    // 1. Try English if requested
    if (lang === 'en') {
        const enQuestions = MERGED_EN[layerId];
        if (enQuestions && enQuestions.length > 0) return enQuestions;
    }
    
    // 2. Default to French (or fallback)
    return MERGED_FR[layerId] || [];
}

// Fonction pour obtenir N questions aléatoires (BILINGUE)
export function getRandomQuestions(layerId: string, count: number = 3, lang: string = 'fr'): QuizQuestion[] {
    const allQuestions = getLayerQuestions(layerId, lang);
    if (allQuestions.length === 0) {
        console.warn(`[QUESTION BANK] No questions found for layer: ${layerId} (${lang})`);
        return [];
    }
    
    // Shuffle et prendre N premières
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, allQuestions.length));
}
