// ========================================
// COURS 5: BLOCKCHAIN PI (50 QUESTIONS)
// ========================================
export const BLOCKCHAIN_QUESTIONS_FR = [
    // === EASY (20 questions) ===
    {
        id: 'q-blockchain-1',
        question: "Qu'est-ce qu'une blockchain?",
        options: ["Une base de données centralisée", "Un registre distribué et immuable", "Un réseau social", "Un logiciel de minage"],
        correct: 1,
        explanation: "Une blockchain est un registre numérique distribué où les transactions sont enregistrées de manière permanente.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'blockchain-basics',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-2',
        question: "Que signifie 'décentralisé'?",
        options: ["Contrôlé par une seule entité", "Réparti sur plusieurs ordinateurs sans autorité centrale", "Situé dans un datacenter", "Géré par le gouvernement"],
        correct: 1,
        explanation: "Décentralisé = aucune entité unique ne contrôle le réseau. Tout le monde peut participer.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'decentralization',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-3',
        question: "Qu'est-ce qu'un 'bloc' dans la blockchain?",
        options: ["Un jeu vidéo", "Un groupe de transactions regroupées ensemble", "Un type de virus", "Un mot de passe"],
        correct: 1,
        explanation: "Un bloc contient plusieurs transactions et est lié cryptographiquement aux blocs précédents.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'blocks',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-4',
        question: "Qu'est-ce que le 'hash' d'un bloc?",
        options: ["Son nom", "Son empreinte digitale unique", "Sa taille", "Sa couleur"],
        correct: 1,
        explanation: "Le hash est une empreinte cryptographique unique qui identifie le bloc et son contenu.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'hashing',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-5',
        question: "Quel protocole de consensus utilise Pi Network?",
        options: ["Proof of Work (PoW)", "Proof of Stake (PoS)", "Stellar Consensus Protocol (SCP)", "Proof of Authority"],
        correct: 2,
        explanation: "Pi utilise le Stellar Consensus Protocol (SCP) qui est plus écologique et inclusif.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'consensus',
        trapType: 'bitcoin-comparison'
    },
    {
        id: 'q-blockchain-6',
        question: "Pourquoi dit-on que la blockchain est 'immuable'?",
        options: ["Elle ne fonctionne pas", "Une fois les données enregistrées, elles ne peuvent être modifiées", "Elle est muette", "Elle ne bouge pas"],
        correct: 1,
        explanation: "Les données sont cryptographiquement liées. Modifier un bloc invaliderait tous les suivants.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'immutability',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-7',
        question: "Qu'est-ce qu'un 'nœud' (node) dans le réseau Pi?",
        options: ["Un problème technique", "Un ordinateur qui participe au réseau", "Un type de virus", "Un bonus"],
        correct: 1,
        explanation: "Un nœud est un ordinateur qui maintient une copie de la blockchain et valide les transactions.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'nodes',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-8',
        question: "Qu'est-ce qu'une transaction blockchain?",
        options: ["Un achat en magasin", "Un transfert de valeur enregistré sur la blockchain", "Un email", "Un appel téléphonique"],
        correct: 1,
        explanation: "Une transaction est un enregistrement d'un transfert de valeur (Pi, données) sur la blockchain.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'transactions',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-9',
        question: "Qu'est-ce que le 'minage' sur Pi Network?",
        options: ["Creuser la terre", "Contribuer au réseau en échange de Pi", "Pirater des comptes", "Jouer à un jeu"],
        correct: 1,
        explanation: "Le minage Pi = contribuer au réseau (sécurité, validation) et recevoir des Pi en récompense.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'mining',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-10',
        question: "Pourquoi le minage Pi ne consomme-t-il pas d'électricité?",
        options: ["C'est impossible", "Pi utilise SCP au lieu de Proof of Work", "Il utilise l'énergie solaire", "C'est un mensonge"],
        correct: 1,
        explanation: "Contrairement au Bitcoin (PoW), Pi utilise SCP qui ne nécessite pas de calculs intensifs.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'energy-efficiency',
        trapType: 'skepticism'
    },
    {
        id: 'q-blockchain-11',
        question: "Qu'est-ce que le 'Security Circle' dans Pi?",
        options: ["Un cercle de sécurité routière", "Un groupe de personnes de confiance qui sécurisent le réseau", "Un antivirus", "Une assurance"],
        correct: 1,
        explanation: "Le Security Circle est votre liste de contacts de confiance qui renforcent la sécurité du réseau.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'security-circle',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-12',
        question: "Qu'est-ce qu'un 'Explorer' blockchain?",
        options: ["Un navigateur web", "Un outil pour visualiser les transactions sur la blockchain", "Un jeu vidéo", "Un robot"],
        correct: 1,
        explanation: "L'Explorer permet de rechercher et vérifier les transactions, blocs et adresses publiquement.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'blockchain-explorer',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-13',
        question: "Chaque transaction a-t-elle un identifiant unique?",
        options: ["Non", "Oui, le hash de transaction (TxHash)", "Parfois", "Seulement les grosses transactions"],
        correct: 1,
        explanation: "Chaque transaction a un hash unique (TxHash) qui permet de la tracer sur la blockchain.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'transaction-id',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-14',
        question: "Qu'est-ce que le 'Mainnet' de Pi?",
        options: ["Un site de rencontre", "Le réseau principal où les Pi ont une vraie valeur", "Un réseau de test", "Un jeu"],
        correct: 1,
        explanation: "Le Mainnet est le réseau blockchain final et opérationnel où les transactions sont réelles.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'mainnet',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-15',
        question: "Qu'est-ce que le 'Testnet'?",
        options: ["Un filet de pêche", "Un réseau de test pour les développeurs", "Le réseau principal", "Un virus"],
        correct: 1,
        explanation: "Le Testnet permet de tester les fonctionnalités sans risquer de vrais Pi.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'testnet',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-16',
        question: "Combien de Pioneers Pi Network compte-t-il?",
        options: ["1 million", "10 millions", "50+ millions", "1 milliard"],
        correct: 2,
        explanation: "Pi Network compte plus de 50 millions de Pioneers à travers le monde.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'community-size',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-17',
        question: "Qu'est-ce qu'une dApp?",
        options: ["Une application de danse", "Une application décentralisée sur blockchain", "Un type de virus", "Une application de dating"],
        correct: 1,
        explanation: "dApp = Decentralized Application, une application qui fonctionne sur la blockchain.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'dapps',
        trapType: 'phonetic-confusion'
    },
    {
        id: 'q-blockchain-18',
        question: "Qui peut voir les transactions sur la blockchain Pi?",
        options: ["Seulement Pi Core Team", "Tout le monde (c'est public)", "Seulement les gouvernements", "Personne"],
        correct: 1,
        explanation: "La blockchain est publique et transparente. Tout le monde peut voir les transactions.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'transparency',
        trapType: 'privacy-misconception'
    },
    {
        id: 'q-blockchain-19',
        question: "Qu'est-ce qui sécurise les transactions Pi?",
        options: ["Les mots de passe", "La cryptographie et le consensus distribué", "Les antivirus", "La police"],
        correct: 1,
        explanation: "La cryptographie et le consensus entre les nœuds assurent la sécurité des transactions.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'security',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-20',
        question: "Qu'est-ce que le 'Trust Graph' de Pi?",
        options: ["Un graphique de confiance", "Le réseau social de confiance qui sécurise Pi", "Un jeu", "Une courbe de prix"],
        correct: 1,
        explanation: "Le Trust Graph est le réseau de relations de confiance entre Pioneers qui sécurise le consensus.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'trust-graph',
        trapType: 'none'
    },

    // === MEDIUM (20 questions) ===
    {
        id: 'q-blockchain-21',
        question: "Quelle est la différence entre Proof of Work et SCP?",
        options: [
            "Aucune différence",
            "PoW consomme énormément d'énergie, SCP utilise la confiance sociale",
            "PoW est plus récent",
            "SCP est plus lent"
        ],
        correct: 1,
        explanation: "PoW (Bitcoin) nécessite des calculs énergivores. SCP utilise les cercles de confiance, économisant l'énergie.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'consensus-comparison',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-22',
        question: "Comment fonctionne le Byzantine Fault Tolerance dans SCP?",
        options: [
            "En référence à l'Empire Byzantin",
            "Le réseau fonctionne même si certains nœuds sont défaillants ou malveillants",
            "En utilisant beaucoup d'électricité",
            "En centralisant les décisions"
        ],
        correct: 1,
        explanation: "BFT permet au réseau d'atteindre un consensus même si jusqu'à 1/3 des nœuds sont malveillants.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'bft',
        trapType: 'historical-reference'
    },
    {
        id: 'q-blockchain-23',
        question: "Qu'est-ce qu'un 'Quorum Slice' dans SCP?",
        options: [
            "Une tranche de pizza",
            "L'ensemble de nœuds qu'un nœud particulier juge suffisant pour le consensus",
            "Un type de vote",
            "Une mise à jour"
        ],
        correct: 1,
        explanation: "Chaque nœud définit sa liste de nœuds de confiance (Quorum Slice) pour atteindre le consensus.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'quorum-slices',
        trapType: 'metaphor-confusion'
    },
    {
        id: 'q-blockchain-24',
        question: "Pourquoi Pi utilise-t-il SCP plutôt que PoS?",
        options: [
            "PoS est trop cher",
            "SCP est plus inclusif (pas besoin de stake initial) et vérifié académiquement",
            "PoS n'existe pas",
            "C'est le même chose"
        ],
        correct: 1,
        explanation: "SCP ne nécessite pas de posséder des Pi pour participer, contrairement au PoS qui favorise les riches.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'scp-vs-pos',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-25',
        question: "Qu'est-ce qu'une 'attaque Sybil'?",
        options: [
            "Un virus informatique",
            "Créer de nombreux faux comptes pour manipuler le réseau",
            "Un type de minage",
            "Une mise à jour"
        ],
        correct: 1,
        explanation: "L'attaque Sybil crée de nombreuses fausses identités. Le KYC Pi protège contre cela.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'sybil-attack',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-26',
        question: "Comment le Security Circle protège-t-il contre les attaques Sybil?",
        options: [
            "Par magie",
            "Les humains vérifient que leurs contacts sont de vraies personnes uniques",
            "Par des algorithmes uniquement",
            "Il ne protège pas"
        ],
        correct: 1,
        explanation: "Les Pioneers attestent que leurs contacts sont de vraies personnes, créant un web de confiance humain.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'sybil-protection',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-27',
        question: "Qu'est-ce que la 'finalité' d'une transaction?",
        options: [
            "La fin du monde",
            "Le moment où une transaction est considérée comme irréversible",
            "La taxe finale",
            "L'annulation"
        ],
        correct: 1,
        explanation: "La finalité = la transaction est définitivement confirmée et ne peut plus être annulée.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'finality',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-28',
        question: "Combien de temps prend une transaction Pi pour être confirmée?",
        options: [
            "1 heure",
            "Quelques secondes (3-5 secondes)",
            "1 jour",
            "1 semaine"
        ],
        correct: 1,
        explanation: "Grâce à SCP, les transactions Pi sont confirmées en quelques secondes, bien plus rapide que Bitcoin.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'transaction-speed',
        trapType: 'bitcoin-comparison'
    },
    {
        id: 'q-blockchain-29',
        question: "Qu'est-ce que le 'ledger' dans le contexte blockchain?",
        options: [
            "Une marque d'appareil",
            "Le registre qui contient l'historique de toutes les transactions",
            "Un type de wallet",
            "Un bonus"
        ],
        correct: 1,
        explanation: "Le ledger est le grand livre comptable décentralisé qui enregistre toutes les transactions.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'ledger',
        trapType: 'brand-confusion'
    },
    {
        id: 'q-blockchain-30',
        question: "Qu'est-ce qu'un 'fork' blockchain?",
        options: [
            "Une fourchette pour manger",
            "Une division de la blockchain en deux versions différentes",
            "Un type de minage",
            "Une mise à jour normale"
        ],
        correct: 1,
        explanation: "Un fork = la blockchain se divise en deux chaînes différentes (ex: Bitcoin vs Bitcoin Cash).",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'forks',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-31',
        question: "Qu'est-ce qui différencie un 'hard fork' d'un 'soft fork'?",
        options: [
            "La dureté du code",
            "Hard fork = incompatible avec l'ancien, Soft fork = rétro-compatible",
            "Hard fork est plus rapide",
            "Aucune différence"
        ],
        correct: 1,
        explanation: "Hard fork = nouvelle version incompatible. Soft fork = mise à jour compatible avec l'ancienne version.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'fork-types',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-32',
        question: "Qu'est-ce qu'un 'smart contract'?",
        options: [
            "Un contrat papier intelligent",
            "Du code auto-exécutable sur blockchain selon des conditions prédéfinies",
            "Un avocat digital",
            "Un contrat de travail"
        ],
        correct: 1,
        explanation: "Smart contract = programme qui s'exécute automatiquement quand les conditions sont remplies.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'smart-contracts',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-33',
        question: "Comment Pi gère-t-il la scalabilité du réseau?",
        options: [
            "En limitant les utilisateurs",
            "Architecture à plusieurs couches + SCP optimisé pour haut débit",
            "En ralentissant les transactions",
            "Il ne peut pas"
        ],
        correct: 1,
        explanation: "Pi utilise une architecture optimisée et SCP qui permet des milliers de transactions par seconde.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'scalability',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-34',
        question: "Qu'est-ce que le 'TPS' (Transactions Per Second)?",
        options: [
            "Total Pi Staked",
            "Le nombre de transactions que le réseau peut traiter par seconde",
            "Tax Per Sale",
            "Time Per Session"
        ],
        correct: 1,
        explanation: "TPS mesure la capacité du réseau. Bitcoin: ~7 TPS, Pi peut atteindre des milliers de TPS.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'tps',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-blockchain-35',
        question: "Qu'est-ce qu'un 'Token' par rapport à une 'Coin'?",
        options: [
            "C'est identique",
            "Coin = blockchain native, Token = créé sur une autre blockchain",
            "Token = plus de valeur",
            "Coin = plus récent"
        ],
        correct: 1,
        explanation: "Pi est une coin (blockchain native). Un token serait créé SUR la blockchain Pi.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'coin-vs-token',
        trapType: 'terminology-confusion'
    },
    {
        id: 'q-blockchain-36',
        question: "Pourquoi la blockchain Pi est-elle plus écologique que Bitcoin?",
        options: [
            "Elle utilise moins de serveurs",
            "SCP ne nécessite pas de calculs intensifs (pas de course au hashage)",
            "Elle plante des arbres",
            "C'est marketing"
        ],
        correct: 1,
        explanation: "Bitcoin utilise PoW (énormes calculs). Pi utilise SCP (confiance sociale), consommant très peu d'énergie.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'eco-friendly',
        trapType: 'marketing-skepticism'
    },
    {
        id: 'q-blockchain-37',
        question: "Qu'est-ce que l'interopérabilité blockchain?",
        options: [
            "Parler plusieurs langues",
            "La capacité de différentes blockchains à communiquer entre elles",
            "Utiliser plusieurs téléphones",
            "Un type de mining"
        ],
        correct: 1,
        explanation: "L'interopérabilité permet aux différentes blockchains d'échanger des données et de la valeur.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'interoperability',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-38',
        question: "Qu'est-ce que le 'mempool'?",
        options: [
            "Une piscine à mémoires",
            "La file d'attente des transactions non confirmées",
            "Un type de wallet",
            "Un jeu"
        ],
        correct: 1,
        explanation: "Le mempool est où les transactions attendent avant d'être incluses dans un bloc.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'mempool',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-39',
        question: "Comment Pi empêche-t-il les double-dépenses?",
        options: [
            "Par la volonté",
            "Le consensus SCP valide l'ordre des transactions et rejette les doublons",
            "Par des lois",
            "C'est impossible"
        ],
        correct: 1,
        explanation: "Chaque transaction est validée par le consensus. Une fois confirmée, elle ne peut pas être dépensée à nouveau.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'double-spending',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-40',
        question: "Qu'est-ce qu'un 'Genesis Block'?",
        options: [
            "Un jeu vidéo Sega",
            "Le tout premier bloc d'une blockchain",
            "Un bloc spécial avec plus de Pi",
            "Un bloc bonus"
        ],
        correct: 1,
        explanation: "Le Genesis Block (bloc 0) est le premier bloc d'une blockchain, codé en dur dans le protocole.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'genesis-block',
        trapType: 'pop-culture-reference'
    },

    // === HARD (10 questions) ===
    {
        id: 'q-blockchain-41',
        question: "Comment fonctionne le 'Federated Byzantine Agreement' (FBA)?",
        options: [
            "Par vote démocratique",
            "Chaque nœud choisit ses nœuds de confiance, le consensus émerge par intersection des quorums",
            "Par tirage au sort",
            "Par minage intensif"
        ],
        correct: 1,
        explanation: "FBA: chaque nœud définit son quorum slice. Le consensus émerge quand les quorums se chevauchent suffisamment.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'fba',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-blockchain-42',
        question: "Qu'est-ce que la 'Safety' et la 'Liveness' dans le consensus distribué?",
        options: [
            "Des termes marketing",
            "Safety = pas de résultats conflictuels, Liveness = le système progresse toujours",
            "Des types de mining",
            "Des bonus"
        ],
        correct: 1,
        explanation: "Safety: jamais deux validations différentes. Liveness: le système continue de fonctionner et valider.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'safety-liveness',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-43',
        question: "Comment le 'Trust Graph' influence-t-il le consensus Pi?",
        options: [
            "Il n'influence pas",
            "Les connexions de confiance déterminent les quorum slices et donc qui peut atteindre le consensus ensemble",
            "Il accélère le minage",
            "Il augmente la valeur"
        ],
        correct: 1,
        explanation: "Le Trust Graph détermine quels nœuds se font confiance, formant les quorums qui atteignent le consensus.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'trust-graph-consensus',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-44',
        question: "Qu'est-ce que le problème des généraux byzantins et comment Pi le résout?",
        options: [
            "Un problème militaire",
            "Comment atteindre un accord quand certains participants mentent - résolu par SCP et Trust Graph",
            "Un bug",
            "Un jeu"
        ],
        correct: 1,
        explanation: "Le problème: comment s'accorder quand certains sont malveillants. SCP + Trust Graph permettent un consensus même avec des traîtres.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'byzantine-generals',
        trapType: 'historical-reference'
    },
    {
        id: 'q-blockchain-45',
        question: "Qu'est-ce que la 'propagation de bloc' et pourquoi est-elle importante?",
        options: [
            "La croissance des plantes",
            "La diffusion d'un nouveau bloc à tous les nœuds du réseau - crucial pour la synchronisation",
            "Le marketing",
            "La reproduction"
        ],
        correct: 1,
        explanation: "La propagation rapide assure que tous les nœuds ont la même vision de la blockchain.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'block-propagation',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-46',
        question: "Qu'est-ce que le 'State Machine Replication' dans le contexte blockchain?",
        options: [
            "Copier des machines",
            "Tous les nœuds exécutent les mêmes transactions dans le même ordre pour arriver au même état",
            "Réparer des ordinateurs",
            "Installer des logiciels"
        ],
        correct: 1,
        explanation: "SMR garantit que tous les nœuds, exécutant les mêmes opérations, arrivent au même résultat (état).",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'smr',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-47',
        question: "Comment Pi assure-t-il la 'décentralisation géographique'?",
        options: [
            "Par la poste",
            "Nœuds répartis mondialement + Pioneers de 180+ pays + validation distribuée",
            "Par les satellites",
            "C'est centralisé"
        ],
        correct: 1,
        explanation: "Pi encourage les nœuds partout dans le monde, avec des Pioneers sur tous les continents.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'geographic-decentralization',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-48',
        question: "Qu'est-ce qu'un 'Light Node' par rapport à un 'Full Node'?",
        options: [
            "Un nœud plus rapide",
            "Light = vérifie les headers sans stocker tout, Full = stocke toute la blockchain",
            "Light = mobile, Full = desktop",
            "Aucune différence"
        ],
        correct: 1,
        explanation: "Light node: vérifie sans tout stocker (mobile). Full node: copie complète de la blockchain.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'node-types',
        trapType: 'none'
    },
    {
        id: 'q-blockchain-49',
        question: "Qu'est-ce que le 'Sharding' et Pi l'utilise-t-il?",
        options: [
            "Casser en morceaux",
            "Diviser la blockchain en partitions parallèles pour plus de scalabilité",
            "Un type de mining",
            "Un virus"
        ],
        correct: 1,
        explanation: "Le sharding divise le réseau en shards qui traitent les transactions en parallèle. Pi explore ces optimisations.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'sharding',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-50',
        question: "Comment la cryptographie asymétrique sécurise-t-elle Pi?",
        options: [
            "Par des mots de passe",
            "Clé publique (partager) + clé privée (secrète) permettent signature et chiffrement",
            "Par des pare-feu",
            "Par des antivirus"
        ],
        correct: 1,
        explanation: "La paire clé publique/privée permet de signer les transactions (preuve de propriété) sans révéler la clé privée.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'asymmetric-cryptography',
        trapType: 'none'
    }
];

export const BLOCKCHAIN_QUESTIONS_EN = BLOCKCHAIN_QUESTIONS_FR.map(q => ({
    ...q,
}));
