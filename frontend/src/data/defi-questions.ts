// ========================================
// COURS 6: DEFI PI NETWORK (50 QUESTIONS)
// ========================================
export const DEFI_QUESTIONS_FR = [
    // === EASY (20 questions) ===
    {
        id: 'q-defi-1',
        question: "Que signifie DeFi?",
        options: ["Digital Finance", "Decentralized Finance (Finance Décentralisée)", "Default Finance", "Defined Finance"],
        correct: 1,
        explanation: "DeFi = Finance Décentralisée, des services financiers sans intermédiaires traditionnels (banques).",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'defi-basics',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-2',
        question: "Quelle est la principale différence entre DeFi et finance traditionnelle?",
        options: ["Les logos", "Pas d'intermédiaires centralisés (banques)", "La couleur de l'argent", "Les horaires"],
        correct: 1,
        explanation: "DeFi élimine les intermédiaires (banques, courtiers) grâce aux smart contracts.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'defi-vs-traditional',
        trapType: 'none'
    },
    {
        id: 'q-defi-3',
        question: "Qu'est-ce qu'un 'DEX'?",
        options: ["Un dinosaure", "Un échange décentralisé (Decentralized Exchange)", "Un type de virus", "Un jeu vidéo"],
        correct: 1,
        explanation: "DEX = plateforme d'échange où les utilisateurs tradent directement entre eux sans intermédiaire.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'dex',
        trapType: 'phonetic-confusion'
    },
    {
        id: 'q-defi-4',
        question: "Qu'est-ce que le 'Yield Farming'?",
        options: ["Cultiver des légumes", "Gagner des récompenses en fournissant des liquidités", "Miner des bitcoins", "Un jeu de ferme"],
        correct: 1,
        explanation: "Yield Farming = déposer des crypto dans des protocoles DeFi pour gagner des intérêts/récompenses.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'yield-farming',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-5',
        question: "Qu'est-ce qu'un 'Liquidity Pool'?",
        options: ["Une piscine", "Un réservoir de fonds permettant les échanges sur DEX", "Un lac de crypto", "Un wallet spécial"],
        correct: 1,
        explanation: "Un Liquidity Pool contient des paires de tokens permettant les échanges automatisés.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'liquidity-pools',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-6',
        question: "Qu'est-ce que le 'Staking'?",
        options: ["Manger un steak", "Verrouiller des crypto pour sécuriser le réseau et gagner des récompenses", "Jouer aux cartes", "Faire du sport"],
        correct: 1,
        explanation: "Staking = immobiliser vos crypto pour participer au consensus et recevoir des récompenses.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'staking',
        trapType: 'phonetic-confusion'
    },
    {
        id: 'q-defi-7',
        question: "Qu'est-ce qu'un 'AMM' (Automated Market Maker)?",
        options: ["Un robot de cuisine", "Un algorithme qui définit les prix selon l'offre/demande dans les pools", "Un type de crypto", "Un email automatique"],
        correct: 1,
        explanation: "AMM = formule mathématique qui ajuste automatiquement les prix en fonction des liquidités.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'amm',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-8',
        question: "Qu'est-ce que le 'TVL' en DeFi?",
        options: ["Total Value Locked - la valeur totale des fonds dans un protocole", "Television", "Token Value Level", "Trade Volume Live"],
        correct: 0,
        explanation: "TVL (Total Value Locked) mesure combien d'argent est déposé dans un protocole DeFi.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'tvl',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-9',
        question: "Qu'est-ce qu'un 'Lending Protocol'?",
        options: ["Un protocole de prêt qui permet d'emprunter/prêter des crypto", "Un service de livraison", "Un jeu", "Un réseau social"],
        correct: 0,
        explanation: "Lending = prêt. Ces protocoles permettent de prêter vos crypto contre intérêts ou d'emprunter.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'lending',
        trapType: 'none'
    },
    {
        id: 'q-defi-10',
        question: "Pourquoi DeFi est-il considéré comme plus inclusif?",
        options: ["C'est plus joli", "Accessible à tous avec un smartphone, sans conditions bancaires", "C'est moins cher", "C'est plus rapide"],
        correct: 1,
        explanation: "DeFi ne demande pas de compte bancaire, crédit score, ou pièces d'identité gouvernementales pour participer.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'financial-inclusion',
        trapType: 'none'
    },
    {
        id: 'q-defi-11',
        question: "Qu'est-ce qu'un 'Collateral' en DeFi?",
        options: ["Un type de bijou", "Une garantie déposée pour obtenir un prêt", "Un bonus", "Un ami"],
        correct: 1,
        explanation: "Collateral = garantie que vous déposez pour emprunter. Si vous ne remboursez pas, elle est saisie.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'collateral',
        trapType: 'none'
    },
    {
        id: 'q-defi-12',
        question: "Qu'est-ce que le 'Slippage'?",
        options: ["Glisser sur une banane", "La différence entre le prix attendu et le prix réel d'un trade", "Un bug", "Un bonus"],
        correct: 1,
        explanation: "Slippage = écart de prix entre le moment où vous cliquez et l'exécution réelle du trade.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'slippage',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-13',
        question: "Qu'est-ce qu'un 'Stablecoin'?",
        options: ["Une crypto très lourde", "Une crypto dont le prix est stable (souvent 1$)", "Une crypto rare", "Une crypto rapide"],
        correct: 1,
        explanation: "Stablecoin = crypto indexée sur une valeur stable comme le dollar (ex: USDT, USDC).",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'stablecoins',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-14',
        question: "Qu'est-ce que l'APY en DeFi?",
        options: ["Annual Percentage Yield - le rendement annuel avec intérêts composés", "A Pi Yearly", "Always Pay Yourself", "Application Yearly"],
        correct: 0,
        explanation: "APY = taux de rendement annuel incluant les intérêts composés.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'apy',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-15',
        question: "Quelle est la différence entre APY et APR?",
        options: ["Aucune", "APY inclut les intérêts composés, APR non", "APR est plus élevé", "APY est mensuel"],
        correct: 1,
        explanation: "APR = taux simple. APY = taux avec réinvestissement des intérêts (généralement plus élevé).",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'apy-vs-apr',
        trapType: 'similar-terms'
    },
    {
        id: 'q-defi-16',
        question: "Qu'est-ce qu'un 'Governance Token'?",
        options: ["Un token gouvernemental", "Un token donnant droit de vote sur les décisions du protocole", "Un token obligatoire", "Un token gratuit"],
        correct: 1,
        explanation: "Les Governance Tokens permettent de voter sur l'évolution du protocole (taux, fonctionnalités).",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'governance',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-17',
        question: "Qu'est-ce que le 'Flash Loan'?",
        options: ["Un prêt éclair remboursé dans la même transaction", "Un prêt rapide", "Un prêt gratuit", "Un prêt permanent"],
        correct: 0,
        explanation: "Flash Loan = prêt instantané sans garantie mais qui DOIT être remboursé dans la même transaction.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'flash-loans',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-18',
        question: "Qu'est-ce qu'un 'LP Token'?",
        options: ["Long Play Token", "Liquidity Provider Token - preuve de votre dépôt dans un pool", "Light Pi Token", "Last Price Token"],
        correct: 1,
        explanation: "LP Token = reçu prouvant que vous avez fourni des liquidités à un pool (récupérable pour retirer).",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'lp-tokens',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-19',
        question: "DeFi fonctionne-t-il 24/7?",
        options: ["Non, seulement en semaine", "Oui, sans interruption ni jours fériés", "Seulement le jour", "Selon les pays"],
        correct: 1,
        explanation: "Contrairement aux banques, DeFi fonctionne 24h/24, 7j/7, sans jours fériés.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'availability',
        trapType: 'traditional-finance-comparison'
    },
    {
        id: 'q-defi-20',
        question: "Qu'est-ce qu'un 'Rug Pull' en DeFi?",
        options: ["Tirer un tapis", "Une arnaque où les créateurs volent les fonds et disparaissent", "Une mise à jour", "Un bonus"],
        correct: 1,
        explanation: "Rug Pull = arnaque où les développeurs retirent toutes les liquidités et disparaissent.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'rug-pull',
        trapType: 'idiom'
    },

    // === MEDIUM (20 questions) ===
    {
        id: 'q-defi-21',
        question: "Comment fonctionne l'algorithme 'x * y = k' dans les AMM?",
        options: [
            "C'est de l'algèbre basique",
            "Le produit des quantités de deux tokens reste constant, définissant les prix automatiquement",
            "C'est une erreur",
            "Ça calcule les frais"
        ],
        correct: 1,
        explanation: "Formule: quantité_A × quantité_B = constante. Quand l'un change, l'autre s'ajuste, définissant le prix.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'amm-algorithm',
        trapType: 'math-aversion'
    },
    {
        id: 'q-defi-22',
        question: "Qu'est-ce que l'Impermanent Loss?",
        options: [
            "Une perte temporaire",
            "La perte potentielle de valeur vs HODL quand vous fournissez des liquidités",
            "Une perte définitive",
            "Un bug"
        ],
        correct: 1,
        explanation: "IL = différence de valeur entre fournir des liquidités et simplement garder les tokens. 'Impermanent' car réversible.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'impermanent-loss',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-23',
        question: "Quand l'Impermanent Loss devient-il 'permanent'?",
        options: [
            "Jamais",
            "Quand vous retirez vos liquidités avec un ratio de prix différent de l'entrée",
            "Après 1 an",
            "À la fermeture du pool"
        ],
        correct: 1,
        explanation: "La perte est 'réalisée' (permanente) uniquement quand vous retirez à un prix différent de l'entrée.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'impermanent-loss-realized',
        trapType: 'none'
    },
    {
        id: 'q-defi-24',
        question: "Qu'est-ce que le 'Liquidity Mining'?",
        options: [
            "Miner des liquides",
            "Gagner des tokens de récompense en fournissant des liquidités",
            "Creuser des puits",
            "Un type de staking"
        ],
        correct: 1,
        explanation: "Liquidity Mining = fournir des liquidités et recevoir des tokens natifs du protocole en bonus.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'liquidity-mining',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-25',
        question: "Qu'est-ce qu'un 'Oracle' en DeFi?",
        options: [
            "Un diseur de bonne aventure",
            "Un service qui fournit des données du monde réel à la blockchain",
            "Un type de crypto",
            "Une entreprise"
        ],
        correct: 1,
        explanation: "Oracle = pont entre blockchain et monde réel (prix, météo, résultats sportifs).",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'oracles',
        trapType: 'mythological-reference'
    },
    {
        id: 'q-defi-26',
        question: "Pourquoi les oracles sont-ils critiques pour DeFi?",
        options: [
            "Pour la décoration",
            "Les smart contracts ont besoin de données fiables du monde réel pour fonctionner",
            "Pour le marketing",
            "Ils ne sont pas importants"
        ],
        correct: 1,
        explanation: "Sans oracles fiables, les smart contracts ne peuvent pas savoir le prix réel des actifs.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'oracle-importance',
        trapType: 'none'
    },
    {
        id: 'q-defi-27',
        question: "Qu'est-ce que le 'Liquidation' en lending DeFi?",
        options: [
            "Vendre son entreprise",
            "La saisie automatique du collateral quand la valeur descend sous un seuil",
            "Recevoir des liquidités",
            "Fermer son compte"
        ],
        correct: 1,
        explanation: "Si votre collateral perd trop de valeur, le protocole le vend automatiquement pour rembourser le prêt.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'liquidation',
        trapType: 'none'
    },
    {
        id: 'q-defi-28',
        question: "Qu'est-ce que le 'Health Factor' en lending?",
        options: [
            "Votre santé physique",
            "Ratio indiquant la sécurité de votre position (>1 = safe, <1 = liquidation)",
            "Un score médical",
            "Un bonus santé"
        ],
        correct: 1,
        explanation: "Health Factor = ratio collateral/dette. Au-dessus de 1 = sûr. En dessous = risque de liquidation.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'health-factor',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-29',
        question: "Qu'est-ce que le 'Collateralization Ratio'?",
        options: [
            "Un ratio de bijoux",
            "Le pourcentage de garantie requis par rapport à l'emprunt",
            "Un ratio de vitesse",
            "Un ratio de profit"
        ],
        correct: 1,
        explanation: "Ex: ratio de 150% = pour emprunter 100$, vous devez déposer 150$ de collateral.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'collateral-ratio',
        trapType: 'none'
    },
    {
        id: 'q-defi-30',
        question: "Qu'est-ce qu'un 'Wrapped Token'?",
        options: [
            "Un token emballé",
            "Une représentation d'un actif d'une autre blockchain sur cette blockchain",
            "Un token cadeau",
            "Un token secret"
        ],
        correct: 1,
        explanation: "Ex: WBTC (Wrapped Bitcoin) = représentation de Bitcoin sur Ethereum, permettant son utilisation en DeFi.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'wrapped-tokens',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-31',
        question: "Comment fonctionnent les 'Farming Rewards'?",
        options: [
            "Par la culture de légumes",
            "Des tokens sont distribués aux fournisseurs de liquidités proportionnellement à leur part",
            "Par tirage au sort",
            "Par ancienneté"
        ],
        correct: 1,
        explanation: "Rewards = tokens distribués selon votre part du pool et la durée de votre participation.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'farming-rewards',
        trapType: 'none'
    },
    {
        id: 'q-defi-32',
        question: "Qu'est-ce que le 'Vault' en DeFi?",
        options: [
            "Un coffre-fort de banque",
            "Un smart contract qui automatise des stratégies de yield farming",
            "Un wallet",
            "Un exchange"
        ],
        correct: 1,
        explanation: "Vault = contrat qui dépose/retire automatiquement des fonds pour maximiser les rendements.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'vaults',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-33',
        question: "Qu'est-ce que le 'Auto-compounding'?",
        options: [
            "Se composer automatiquement",
            "Réinvestir automatiquement les récompenses pour maximiser les gains",
            "Une erreur automatique",
            "Un paiement automatique"
        ],
        correct: 1,
        explanation: "Auto-compounding = les rewards sont automatiquement réinvestis, augmentant l'APY effectif.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'auto-compounding',
        trapType: 'none'
    },
    {
        id: 'q-defi-34',
        question: "Qu'est-ce qu'un 'Synthetic Asset'?",
        options: [
            "Un actif en plastique",
            "Un token qui réplique la valeur d'un actif réel (action, or, etc.)",
            "Un actif virtuel",
            "Un actif temporaire"
        ],
        correct: 1,
        explanation: "Synthetic = token dont le prix suit un actif réel (ex: sAAPL suit le cours d'Apple).",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'synthetics',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-35',
        question: "Qu'est-ce que le 'Leverage' en DeFi?",
        options: [
            "Un levier de porte",
            "Emprunter pour augmenter son exposition (multiplier gains/pertes)",
            "Une taxe",
            "Un bonus"
        ],
        correct: 1,
        explanation: "Leverage = utiliser des fonds empruntés pour amplifier les gains (mais aussi les pertes!).",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'leverage',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-36',
        question: "Qu'est-ce qu'un 'Perpetual Swap'?",
        options: [
            "Un échange perpétuel de cadeaux",
            "Un contrat dérivé sans date d'expiration pour trader avec leverage",
            "Un swap permanent",
            "Un contrat à vie"
        ],
        correct: 1,
        explanation: "Perps = contrats à terme sans expiration, permettant le trading avec leverage indéfiniment.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'perpetuals',
        trapType: 'none'
    },
    {
        id: 'q-defi-37',
        question: "Qu'est-ce que le 'MEV' (Maximal Extractable Value)?",
        options: [
            "Maximum Electric Value",
            "Profit que les mineurs/validateurs peuvent extraire en réordonnant les transactions",
            "Minimum Effective Value",
            "Market Exchange Value"
        ],
        correct: 1,
        explanation: "MEV = valeur que les validateurs peuvent capturer en réordonnant les transactions (frontrunning).",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'mev',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-38',
        question: "Qu'est-ce que le 'Frontrunning' en DeFi?",
        options: [
            "Courir devant",
            "Placer une transaction avant une autre pour profiter de ses effets sur le prix",
            "Un type de course",
            "Une stratégie de marketing"
        ],
        correct: 1,
        explanation: "Frontrunning = voir une grosse transaction et placer la sienne avant pour profiter du mouvement de prix.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'frontrunning',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-39',
        question: "Comment se protéger du frontrunning?",
        options: [
            "Courir plus vite",
            "Utiliser des transaction privées, limiter le slippage, ou des protocoles anti-MEV",
            "Payer plus de frais",
            "C'est impossible"
        ],
        correct: 1,
        explanation: "Solutions: mempools privés, slippage limité, ou protocoles comme Flashbots.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'frontrunning-protection',
        trapType: 'none'
    },
    {
        id: 'q-defi-40',
        question: "Qu'est-ce que le 'Bonding Curve'?",
        options: [
            "Une courbe de liaison chimique",
            "Une formule mathématique qui ajuste le prix selon l'offre",
            "Une courbe de croissance",
            "Un graphique financier"
        ],
        correct: 1,
        explanation: "Bonding Curve = le prix augmente automatiquement avec l'offre (plus de tokens achetés = prix plus élevé).",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'bonding-curve',
        trapType: 'technical-jargon'
    },

    // === HARD (10 questions) ===
    {
        id: 'q-defi-41',
        question: "Comment fonctionne un 'Flash Loan Attack'?",
        options: [
            "Voler avec une lampe",
            "Emprunter sans garantie, manipuler un prix, puis profiter dans la même transaction",
            "Un piratage rapide",
            "Une arnaque par email"
        ],
        correct: 1,
        explanation: "L'attaquant emprunte massivement, manipule un prix d'oracle ou de pool, profit, et rembourse. Le tout en 1 transaction.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'flash-loan-attacks',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-defi-42',
        question: "Qu'est-ce que le 'TVL fragmentation' et pourquoi est-ce problématique?",
        options: [
            "Casser la TV",
            "La liquidité dispersée entre trop de protocoles, réduisant l'efficacité",
            "Un bug technique",
            "Une fonctionnalité"
        ],
        correct: 1,
        explanation: "Trop de pools/protocoles = liquidité fractionnée = plus de slippage et moins d'efficacité.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'tvl-fragmentation',
        trapType: 'none'
    },
    {
        id: 'q-defi-43',
        question: "Comment fonctionnent les 'Concentrated Liquidity' comme Uniswap V3?",
        options: [
            "Par concentration mentale",
            "Les LP choisissent une fourchette de prix pour concentrer leur liquidité",
            "Par compression de données",
            "Par réduction de frais"
        ],
        correct: 1,
        explanation: "Au lieu de fournir liquidité sur tout le range de prix, vous choisissez un range spécifique pour plus d'efficacité.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'concentrated-liquidity',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-44',
        question: "Qu'est-ce que le 'Protocol Owned Liquidity' (POL)?",
        options: [
            "Un protocole polonais",
            "Le protocole possède sa propre liquidité au lieu de dépendre des LP mercenaires",
            "Une licence",
            "Un type de token"
        ],
        correct: 1,
        explanation: "POL = le protocole accumule sa propre liquidité, réduisant la dépendance aux fermiers qui partent pour de meilleurs rendements.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'pol',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-45',
        question: "Qu'est-ce que le 'Reflexivity' en économie DeFi?",
        options: [
            "Se regarder dans un miroir",
            "Les prix influencent les fondamentaux qui influencent les prix (boucle de rétroaction)",
            "Un type de trade",
            "Une réflexion"
        ],
        correct: 1,
        explanation: "Reflexivity: hausse de prix → plus de collateral → plus d'emprunts → plus d'achats → hausse de prix (spiral).",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'reflexivity',
        trapType: 'conceptual-complexity'
    },
    {
        id: 'q-defi-46',
        question: "Comment fonctionne le 'Curve Wars'?",
        options: [
            "Une guerre de courbes",
            "Compétition pour contrôler les votes CRV afin de diriger les émissions de récompenses",
            "Un jeu vidéo",
            "Un conflit géopolitique"
        ],
        correct: 1,
        explanation: "Les protocoles accumulent veCRV pour voter et diriger les récompenses vers leurs pools.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'curve-wars',
        trapType: 'metaphor'
    },
    {
        id: 'q-defi-47',
        question: "Qu'est-ce que le 've-tokenomics'?",
        options: [
            "Tokenomics vénézuélien",
            "Vote-Escrowed: verrouiller des tokens longtemps pour plus de pouvoir de vote et récompenses",
            "Une version électronique",
            "Un type de staking"
        ],
        correct: 1,
        explanation: "ve = vote-escrowed. Plus vous lockez longtemps, plus vous avez de pouvoir de vote et de récompenses.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 've-tokenomics',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-48',
        question: "Qu'est-ce que le 'Composability' en DeFi?",
        options: [
            "Composer de la musique",
            "La capacité de combiner différents protocoles comme des Lego",
            "Créer des compositions",
            "Un type d'art"
        ],
        correct: 1,
        explanation: "DeFi Legos: vous pouvez empiler des protocoles (déposer dans A, emprunter, déposer dans B, etc.).",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'composability',
        trapType: 'metaphor'
    },
    {
        id: 'q-defi-49',
        question: "Qu'est-ce que le risque 'Smart Contract' en DeFi?",
        options: [
            "Les contrats sont trop intelligents",
            "Bugs ou vulnérabilités dans le code pouvant entraîner des pertes de fonds",
            "Les contrats expirent",
            "Les contrats sont lents"
        ],
        correct: 1,
        explanation: "Le code peut contenir des bugs exploitables. Des milliards ont été perdus via des exploits de smart contracts.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'smart-contract-risk',
        trapType: 'none'
    },
    {
        id: 'q-defi-50',
        question: "Comment évaluer la sécurité d'un protocole DeFi avant d'y investir?",
        options: [
            "Par son logo",
            "Audits, TVL, ancienneté, équipe, code open-source, historique d'incidents",
            "Par son nom",
            "Par le nombre de followers"
        ],
        correct: 1,
        explanation: "Vérifiez: audits de sécurité, réputation, code source, TVL, et historique. DYOR (Do Your Own Research)!",
        difficulty: 'hard',
        cognitiveLevel: 'application',
        topic: 'due-diligence',
        trapType: 'none'
    }
];

export const DEFI_QUESTIONS_EN = DEFI_QUESTIONS_FR.map(q => ({
    ...q,
}));
