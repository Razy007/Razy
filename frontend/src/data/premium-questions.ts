// ========================================
// COURS 7: MASTERCLASS ARCHITECTURE PI (50 QUESTIONS PREMIUM)
// ========================================
export const PREMIUM_QUESTIONS_FR = [
    // === MEDIUM (25 questions - niveau expert accessible) ===
    {
        id: 'q-premium-1',
        question: "Sur quelle base technologique est construit le consensus Pi Network?",
        options: ["Bitcoin", "Ethereum", "Stellar Consensus Protocol (SCP)", "Solana"],
        correct: 2,
        explanation: "Pi est basé sur le Stellar Consensus Protocol, développé par David Mazières de Stanford.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'pi-foundation',
        trapType: 'none'
    },
    {
        id: 'q-premium-2',
        question: "Qui a créé Pi Network et d'où viennent-ils?",
        options: ["MIT", "Stanford University (Dr. Nicolas Kokkalis, Dr. Chengdiao Fan)", "Harvard", "Anonyme comme Bitcoin"],
        correct: 1,
        explanation: "Pi a été créé par des docteurs de Stanford, notamment spécialisés en systèmes distribués.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'founders',
        trapType: 'none'
    },
    {
        id: 'q-premium-3',
        question: "Quelle est la signification de 'π' (Pi) dans le nom du projet?",
        options: ["C'est aléatoire", "Référence au nombre π (3.14159...) symbolisant l'infini et l'inclusion", "Le prénom du fondateur", "Un acronyme"],
        correct: 1,
        explanation: "Pi symbolise l'infini, l'inclusion universelle, et la date de lancement (Pi Day: 3/14).",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'naming',
        trapType: 'none'
    },
    {
        id: 'q-premium-4',
        question: "Comment le Trust Graph sécurise-t-il Pi contre les attaques Sybil?",
        options: [
            "Par mot de passe",
            "Les humains attestent des connexions réelles, créant un réseau de confiance vérifiable",
            "Par captcha",
            "Par KYC uniquement"
        ],
        correct: 1,
        explanation: "Le Trust Graph tire parti des relations humaines réelles pour valider l'unicité des participants.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'trust-graph-security',
        trapType: 'none'
    },
    {
        id: 'q-premium-5',
        question: "Quelle architecture de nœuds Pi Network utilise-t-il?",
        options: [
            "Nœuds identiques",
            "Architecture à plusieurs niveaux: Mobile, SuperNodes, Validateurs",
            "Seulement des serveurs",
            "Seulement des téléphones"
        ],
        correct: 1,
        explanation: "Pi utilise une architecture hiérarchique avec différents types de nœuds selon les capacités.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'node-architecture',
        trapType: 'none'
    },
    {
        id: 'q-premium-6',
        question: "Quel est le rôle d'un 'Contributor' dans le minage Pi?",
        options: [
            "Donner de l'argent",
            "Ajouter des personnes de confiance au Security Circle pour renforcer le réseau",
            "Écrire du code",
            "Faire de la publicité"
        ],
        correct: 1,
        explanation: "Contributors ajoutent des membres de confiance, renforçant le graphe de confiance du réseau.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'roles',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-7',
        question: "Quel est le rôle d'un 'Ambassador' dans Pi?",
        options: [
            "Représenter un pays",
            "Inviter de nouveaux Pioneers au réseau, augmentant l'équipe de minage",
            "Voyager",
            "Négocier des contrats"
        ],
        correct: 1,
        explanation: "Ambassadors recrutent de nouveaux membres, étendant le réseau et gagnant des bonus de minage.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'roles',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-8',
        question: "Comment les Quorum Slices se forment-ils dans Pi Network?",
        options: [
            "Aléatoirement",
            "Basés sur les Security Circles des utilisateurs et la réputation des nœuds",
            "Par le gouvernement",
            "Par Pi Core Team uniquement"
        ],
        correct: 1,
        explanation: "Les Quorum Slices émergent du Trust Graph créé par les Security Circles des utilisateurs.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'quorum-formation',
        trapType: 'none'
    },
    {
        id: 'q-premium-9',
        question: "Pourquoi Pi a-t-il choisi le modèle de 'minage mobile'?",
        options: [
            "C'était moins cher",
            "Pour démocratiser l'accès - tout le monde a un smartphone",
            "Pour économiser l'électricité",
            "Par accident"
        ],
        correct: 1,
        explanation: "Le mobile permet à n'importe qui de participer, sans matériel coûteux ni expertise technique.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'mobile-first',
        trapType: 'none'
    },
    {
        id: 'q-premium-10',
        question: "Quelle est la différence entre Pi Browser et Pi App?",
        options: [
            "Aucune",
            "App = minage/wallet, Browser = accès aux dApps de l'écosystème",
            "Browser = minage",
            "App = jeux"
        ],
        correct: 1,
        explanation: "Pi App gère le minage et le wallet. Pi Browser est le portail vers les applications décentralisées.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'pi-apps',
        trapType: 'none'
    },
    {
        id: 'q-premium-11',
        question: "Qu'est-ce que le 'Base Mining Rate' et comment évolue-t-il?",
        options: [
            "Il reste constant",
            "Le taux de base de minage qui diminue par halving à mesure que le réseau grandit",
            "Il augmente",
            "Il est aléatoire"
        ],
        correct: 1,
        explanation: "Le Base Rate subit des halvings pour contrôler l'offre à mesure que plus de Pioneers rejoignent.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'mining-rate',
        trapType: 'none'
    },
    {
        id: 'q-premium-12',
        question: "Qu'est-ce que le 'Lockup' Bonus et comment fonctionne-t-il?",
        options: [
            "Un bonus secret",
            "Plus vous verrouillez vos Pi longtemps, plus votre taux de minage augmente",
            "Un paiement unique",
            "Un concours"
        ],
        correct: 1,
        explanation: "Lockup = engagement à ne pas vendre. En échange, votre mining rate peut augmenter jusqu'à 200%.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'lockup-bonus',
        trapType: 'none'
    },
    {
        id: 'q-premium-13',
        question: "Comment Pi Network gère-t-il la compatibilité avec d'autres blockchains?",
        options: [
            "Il ne le fait pas",
            "Via des bridges, wrapped tokens, et standards d'interopérabilité",
            "En copiant leur code",
            "Via email"
        ],
        correct: 1,
        explanation: "Pi développe des solutions d'interopérabilité pour connecter son écosystème aux autres blockchains.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'interoperability',
        trapType: 'none'
    },
    {
        id: 'q-premium-14',
        question: "Qu'est-ce que le 'Pi Platform' pour les développeurs?",
        options: [
            "Un jeu vidéo",
            "Une suite d'outils (SDK, API) pour créer des dApps sur Pi",
            "Un réseau social",
            "Un exchange"
        ],
        correct: 1,
        explanation: "Pi Platform fournit aux développeurs les outils pour construire des applications sur l'écosystème Pi.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'developer-platform',
        trapType: 'none'
    },
    {
        id: 'q-premium-15',
        question: "Comment le modèle économique de Pi évite-t-il l'inflation excessive?",
        options: [
            "Il ne l'évite pas",
            "Halvings, supply max fixe, et burning mechanisms",
            "En augmentant les prix",
            "Par des taxes"
        ],
        correct: 1,
        explanation: "Pi limite l'offre via halvings, un cap maximum, et potentiellement des mécanismes de burning.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'tokenomics',
        trapType: 'none'
    },
    {
        id: 'q-premium-16',
        question: "Qu'est-ce que le 'Mainnet Checklist' nécessite pour la migration?",
        options: [
            "Seulement un email",
            "KYC validé, passphrase sauvegardée, wallet créé, lockup choisi",
            "Un paiement",
            "Un certificat"
        ],
        correct: 1,
        explanation: "Pour migrer: KYC vérifié, wallet créé et passphrase sauvegardée, configuration de lockup.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'migration-checklist',
        trapType: 'none'
    },
    {
        id: 'q-premium-17',
        question: "Comment Pi protège-t-il la vie privée tout en faisant du KYC?",
        options: [
            "Il ne protège pas",
            "Chiffrement, stockage minimal, et exploration de solutions Zero-Knowledge",
            "En supprimant les données",
            "En ne faisant pas de KYC"
        ],
        correct: 1,
        explanation: "Pi applique le chiffrement, minimise les données stockées, et explore les preuves zero-knowledge.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'privacy-kyc',
        trapType: 'none'
    },
    {
        id: 'q-premium-18',
        question: "Qu'est-ce qui différencie Pi des autres 'phone mining' projects?",
        options: [
            "Rien",
            "Équipe Stanford identifiée, SCP éprouvé, et focus sur l'utilité réelle",
            "Le logo",
            "Le pays d'origine"
        ],
        correct: 1,
        explanation: "Pi a une équipe académique identifiée, un consensus rigoureux, et vise des cas d'usage réels.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'differentiation',
        trapType: 'none'
    },
    {
        id: 'q-premium-19',
        question: "Quel est l'objectif du 'Enclosed Mainnet'?",
        options: [
            "Fermer le réseau",
            "Tester l'économie réelle avec des restrictions avant l'ouverture complète",
            "Limiter les utilisateurs",
            "Augmenter les prix"
        ],
        correct: 1,
        explanation: "L'Enclosed Mainnet permet de tester l'écosystème avec de vrais Pi avant l'exposition aux exchanges externes.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'enclosed-mainnet',
        trapType: 'none'
    },
    {
        id: 'q-premium-20',
        question: "Comment Pi mesure-t-il la 'santé' du réseau?",
        options: [
            "Par les profits",
            "Nombre de nœuds actifs, TPS, latence, distribution géographique, engagement",
            "Par les plaintes",
            "Par la publicité"
        ],
        correct: 1,
        explanation: "Métriques: nœuds actifs, transactions par seconde, latence, couverture mondiale, et activité.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'network-health',
        trapType: 'none'
    },
    {
        id: 'q-premium-21',
        question: "Qu'est-ce que le 'Pi SDK' permet aux développeurs de faire?",
        options: [
            "Miner plus vite",
            "Intégrer les paiements Pi, l'authentification, et accéder aux données blockchain",
            "Pirater des comptes",
            "Créer des virus"
        ],
        correct: 1,
        explanation: "Le SDK permet: authentification Pi, paiements Pi, accès aux données utilisateur (avec consentement).",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'pi-sdk',
        trapType: 'none'
    },
    {
        id: 'q-premium-22',
        question: "Comment fonctionne le système de 'Payment' Pi pour les dApps?",
        options: [
            "Par carte bancaire",
            "Appel SDK → Approbation utilisateur → Transaction blockchain → Callback",
            "Par virement",
            "Par email"
        ],
        correct: 1,
        explanation: "Flow: dApp appelle SDK → utilisateur approuve dans Pi App → transaction on-chain → confirmation à la dApp.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'payment-flow',
        trapType: 'none'
    },
    {
        id: 'q-premium-23',
        question: "Qu'est-ce que le 'Pi Ecosystem' vise à construire?",
        options: [
            "Juste une monnaie",
            "Un écosystème complet: marketplace, apps, social, avec Pi comme monnaie native",
            "Un réseau social",
            "Un jeu"
        ],
        correct: 1,
        explanation: "Pi vise un écosystème où les Pi sont utilisés pour des biens, services, et applications réels.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'ecosystem-vision',
        trapType: 'none'
    },
    {
        id: 'q-premium-24',
        question: "Pourquoi le 'Hackathon' Pi est-il important pour l'écosystème?",
        options: [
            "Pour les prix",
            "Il encourage les développeurs à créer des dApps utiles, enrichissant l'écosystème",
            "Pour le marketing",
            "Pour recruter des employés"
        ],
        correct: 1,
        explanation: "Les Hackathons stimulent l'innovation et créent des applications qui donnent de l'utilité à Pi.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'hackathons',
        trapType: 'none'
    },
    {
        id: 'q-premium-25',
        question: "Qu'est-ce qui détermine la 'valeur' de Pi à long terme?",
        options: [
            "Pi Core Team",
            "L'utilité, l'adoption, la demande, et la rareté de l'offre",
            "Les influenceurs",
            "Le gouvernement"
        ],
        correct: 1,
        explanation: "La valeur dépend: utilité réelle (paiements, dApps), adoption massive, et équilibre offre/demande.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'value-drivers',
        trapType: 'none'
    },

    // === HARD (25 questions - niveau expert avancé) ===
    {
        id: 'q-premium-26',
        question: "Comment le Federated Byzantine Agreement (FBA) diffère-t-il du PBFT classique?",
        options: [
            "Aucune différence",
            "FBA permet des quorums ouverts et dynamiques, pas de membership fixe",
            "FBA est plus lent",
            "PBFT est décentralisé"
        ],
        correct: 1,
        explanation: "FBA: quorums déterminés individuellement. PBFT: membership fixe et coordinateur central.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'fba-vs-pbft',
        trapType: 'technical-comparison'
    },
    {
        id: 'q-premium-27',
        question: "Qu'est-ce qu'un 'Quorum Intersection' et pourquoi est-ce crucial pour SCP?",
        options: [
            "Une intersection routière",
            "Les quorums de différents nœuds doivent se chevaucher pour garantir l'accord global",
            "Un type de vote",
            "Une erreur"
        ],
        correct: 1,
        explanation: "Sans quorum intersection, des nœuds pourraient valider des états contradictoires. L'intersection garantit la cohérence.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'quorum-intersection',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-premium-28',
        question: "Comment Pi Network empêche-t-il les 'Eclipse Attacks'?",
        options: [
            "En évitant les éclipses",
            "Diversification des connexions, détection d'anomalies, et architecture distribuée",
            "Par des pare-feu",
            "C'est impossible"
        ],
        correct: 1,
        explanation: "Eclipse attack = isoler un nœud. Protection: connexions diversifiées et monitoring des comportements anormaux.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'eclipse-attacks',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-29',
        question: "Qu'est-ce que le 'Ballot Protocol' dans SCP?",
        options: [
            "Un vote politique",
            "Le mécanisme par lequel les nœuds proposent et acceptent des valeurs de consensus",
            "Un protocole de danse",
            "Un type de transaction"
        ],
        correct: 1,
        explanation: "Le Ballot Protocol gère les rounds de proposition/acceptation pour atteindre le consensus sur une valeur.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'ballot-protocol',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-premium-30',
        question: "Comment fonctionne le 'Nomination Protocol' dans SCP?",
        options: [
            "En nommant des présidents",
            "Les nœuds proposent des valeurs candidates jusqu'à convergence vers une valeur commune",
            "Par tirage au sort",
            "Par ancienneté"
        ],
        correct: 1,
        explanation: "Nomination: les nœuds proposent des valeurs. Quand un quorum accepte, cette valeur est 'nominée' pour le Ballot.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'nomination-protocol',
        trapType: 'none'
    },
    {
        id: 'q-premium-31',
        question: "Qu'implique la propriété de 'Safety' dans le consensus Pi?",
        options: [
            "Le réseau est physiquement sûr",
            "Deux nœuds honnêtes ne valideront jamais des valeurs contradictoires",
            "Les données sont cryptées",
            "Les mots de passe sont forts"
        ],
        correct: 1,
        explanation: "Safety garantit la cohérence: tous les nœuds honnêtes s'accordent sur le même état.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'safety-property',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-32',
        question: "Qu'implique la propriété de 'Liveness' dans le consensus Pi?",
        options: [
            "Le réseau est vivant",
            "Le système continue de progresser et de valider de nouvelles transactions",
            "Les nœuds ne dorment pas",
            "Les serveurs restent allumés"
        ],
        correct: 1,
        explanation: "Liveness = le système ne se bloque pas, il continue à traiter des transactions.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'liveness-property',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-33',
        question: "Comment Pi optimise-t-il la latence du consensus?",
        options: [
            "En ralentissant tout",
            "Structure de quorum optimisée, communication efficace, et parallélisation",
            "En utilisant la 5G",
            "En réduisant le nombre d'utilisateurs"
        ],
        correct: 1,
        explanation: "Optimisations: quorums bien structurés, messages agrégés, et traitement parallèle des transactions.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'latency-optimization',
        trapType: 'none'
    },
    {
        id: 'q-premium-34',
        question: "Qu'est-ce que le 'Catchup' mechanism dans les nœuds Pi?",
        options: [
            "Un jeu de poursuite",
            "Processus par lequel un nœud synchronise son état avec le reste du réseau",
            "Un rattrapage de cours",
            "Un bonus"
        ],
        correct: 1,
        explanation: "Catchup = quand un nœud rejoint ou redémarre, il télécharge les blocs manquants pour se synchroniser.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'catchup',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-35',
        question: "Comment le Trust Graph évolue-t-il dynamiquement?",
        options: [
            "Il ne change jamais",
            "Les Security Circles changent, les réputations évoluent, les nouveaux Pioneers s'ajoutent",
            "Par mise à jour manuelle",
            "Tous les ans"
        ],
        correct: 1,
        explanation: "Le graphe est vivant: nouvelles connexions, suppression de contacts non fiables, évolution de la réputation.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'dynamic-trust-graph',
        trapType: 'none'
    },
    {
        id: 'q-premium-36',
        question: "Que se passe-t-il si un nœud 'Byzantine' (malveillant) rejoint le réseau?",
        options: [
            "Le réseau s'effondre",
            "SCP tolère jusqu'à 1/3 de nœuds défaillants dans chaque quorum slice",
            "Il est automatiquement banni",
            "Rien"
        ],
        correct: 1,
        explanation: "SCP peut fonctionner correctement même si certains nœuds mentent, grâce à la tolérance Byzantine.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'byzantine-tolerance',
        trapType: 'none'
    },
    {
        id: 'q-premium-37',
        question: "Comment Pi gère-t-il les 'splitbrains' potentiels du réseau?",
        options: [
            "Par chirurgie",
            "Les quorum intersections garantissent qu'un seul état cohérent émerge",
            "Par redémarrage",
            "C'est impossible"
        ],
        correct: 1,
        explanation: "L'intersection des quorums empêche deux parties du réseau de diverger sur des états contradictoires.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'splitbrain-prevention',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-38',
        question: "Qu'est-ce que le 'Tier Model' dans l'architecture des nœuds Pi?",
        options: [
            "Un modèle de larmes",
            "Hiérarchie: Pioneer nodes (light), SuperNodes (full), Validateurs Core (consensus)",
            "Un système de niveaux de jeu",
            "Un classement"
        ],
        correct: 1,
        explanation: "Différents tiers de nœuds selon leurs capacités: light (mobile), full (desktop), validateurs (serveurs).",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'tier-model',
        trapType: 'none'
    },
    {
        id: 'q-premium-39',
        question: "Comment fonctionne le 'Stellar Asset Issuance' potentiellement applicable à Pi?",
        options: [
            "Par la poste",
            "Permet de créer des tokens/assets sur la blockchain avec émetteur identifié",
            "Par achat",
            "C'est interdit"
        ],
        correct: 1,
        explanation: "Comme Stellar, Pi pourrait permettre d'émettre des tokens représentant des actifs réels.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'asset-issuance',
        trapType: 'none'
    },
    {
        id: 'q-premium-40',
        question: "Qu'est-ce que le 'Horizon API' dans les systèmes basés sur Stellar/SCP?",
        options: [
            "Un jeu vidéo",
            "L'API REST qui expose les données blockchain aux applications",
            "Une limite géographique",
            "Un horizon lointain"
        ],
        correct: 1,
        explanation: "Horizon = interface API pour interroger la blockchain (transactions, comptes, ledger).",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'horizon-api',
        trapType: 'none'
    },
    {
        id: 'q-premium-41',
        question: "Comment Pi pourrait-il implémenter des 'State Channels' pour la scalabilité?",
        options: [
            "Par des chaînes de télévision",
            "Transactions off-chain entre parties, settlement on-chain final",
            "Par des tunnels physiques",
            "C'est impossible"
        ],
        correct: 1,
        explanation: "State Channels: transactions instantanées hors blockchain, règlement final sur la chaîne principale.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'state-channels',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-42',
        question: "Qu'est-ce que le 'Threshold Cryptography' et son potentiel pour Pi?",
        options: [
            "Un seuil de douleur",
            "Une clé divisée entre plusieurs parties, aucune seule ne peut signer",
            "Un niveau de cryptage",
            "Un mot de passe fort"
        ],
        correct: 1,
        explanation: "Threshold signatures: plusieurs parties doivent collaborer pour signer, augmentant la sécurité.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'threshold-crypto',
        trapType: 'none'
    },
    {
        id: 'q-premium-43',
        question: "Comment le 'Reputation System' influence-t-il les quorums Pi?",
        options: [
            "Par des likes",
            "Les nœuds avec meilleure réputation sont plus souvent choisis dans les quorums",
            "Par des points",
            "Il n'influence pas"
        ],
        correct: 1,
        explanation: "La réputation (historique, uptime, validation correcte) influence la confiance et l'inclusion dans les quorums.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'reputation-system',
        trapType: 'none'
    },
    {
        id: 'q-premium-44',
        question: "Qu'est-ce que le 'Stellar Core' et sa relation avec Pi?",
        options: [
            "Le centre d'une étoile",
            "Le logiciel de nœud Stellar dont Pi s'inspire pour son implémentation consensus",
            "Un processeur",
            "Un satellite"
        ],
        correct: 1,
        explanation: "Stellar Core est le logiciel de référence pour SCP. Pi adapte ces concepts à son architecture.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'stellar-core',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-45',
        question: "Comment les 'Anchors' fonctionnent-ils dans l'écosystème Stellar/Pi?",
        options: [
            "Comme des ancres de bateau",
            "Entités qui connectent le monde réel (fiat, assets) à la blockchain",
            "Des points d'ancrage GPS",
            "Des influenceurs"
        ],
        correct: 1,
        explanation: "Anchors = ponts entre monnaie traditionnelle et crypto, émettant des tokens adossés à des actifs réels.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'anchors',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-46',
        question: "Qu'est-ce que le 'Path Payment' potentiellement disponible sur Pi?",
        options: [
            "Payer pour un chemin",
            "Conversion automatique via plusieurs assets pour atteindre le currency désiré",
            "Un GPS payant",
            "Un abonnement"
        ],
        correct: 1,
        explanation: "Path Payment: envoyer A et le destinataire reçoit B, la blockchain trouve le chemin de conversion optimal.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'path-payment',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-47',
        question: "Comment Pi prévoit-il de gérer la 'Regulatory Compliance' (conformité réglementaire)?",
        options: [
            "En ignorant les lois",
            "KYC obligatoire, collaboration avec régulateurs, et outils de conformité pour les entreprises",
            "En quittant les pays régulés",
            "Par des pots-de-vin"
        ],
        correct: 1,
        explanation: "Pi s'engage dans la conformité: KYC rigoureux, dialogue avec régulateurs, et outils AML/CFT.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'regulatory-compliance',
        trapType: 'none'
    },
    {
        id: 'q-premium-48',
        question: "Quelle est la stratégie de 'Network Effects' de Pi?",
        options: [
            "Effets spéciaux de réseau",
            "Plus d'utilisateurs = plus de valeur pour tous (effet boule de neige)",
            "Moins d'utilisateurs = mieux",
            "Aucune stratégie"
        ],
        correct: 1,
        explanation: "Network effects: chaque nouveau Pioneer ajoute de la valeur pour tous les autres (plus de vendeurs, acheteurs, liquidité).",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'network-effects',
        trapType: 'none'
    },
    {
        id: 'q-premium-49',
        question: "Comment Pi différencie-t-il 'Utility Value' de 'Speculative Value'?",
        options: [
            "C'est la même chose",
            "Utility = usage réel (paiements, dApps), Speculative = espoir de gain futur",
            "Utility = moins de valeur",
            "Speculative = illégal"
        ],
        correct: 1,
        explanation: "Pi vise l'utilité réelle (commerce, apps) plutôt que la pure spéculation pour une valeur durable.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'value-types',
        trapType: 'none'
    },
    {
        id: 'q-premium-50',
        question: "Quelle est la vision à 10 ans de Pi Network?",
        options: [
            "Disparaître",
            "Devenir une infrastructure financière mondiale accessible à tous via mobile",
            "Rester une expérience",
            "Devenir une banque"
        ],
        correct: 1,
        explanation: "Vision: une crypto mobile universelle avec un écosystème d'applications, accessible aux milliards de non-bancarisés.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'long-term-vision',
        trapType: 'none'
    }
];

export const PREMIUM_QUESTIONS_EN = PREMIUM_QUESTIONS_FR.map(q => ({
    ...q,
}));
