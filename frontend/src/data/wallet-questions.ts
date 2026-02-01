// ========================================
// COURS 2: WALLET PI (50 QUESTIONS COMPLÈTES)
// ========================================
export const WALLET_QUESTIONS_FR = [
    // === EASY (20 questions) ===
    {
        id: 'q-wallet-1',
        question: "Qu'est-ce qu'une passphrase Pi Wallet?",
        options: ["Un mot de passe email", "24 mots secrets qui donnent accès à vos Pi", "Votre nom d'utilisateur", "Un code PIN"],
        correct: 1,
        explanation: "La passphrase est une série de 24 mots qui prouve que vous êtes le propriétaire de vos Pi.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'wallet-basics',
        trapType: 'none'
    },
    {
        id: 'q-wallet-2',
        question: "Combien de mots contient votre passphrase Pi?",
        options: ["12 mots", "24 mots", "6 mots", "48 mots"],
        correct: 1,
        explanation: "La passphrase Pi contient exactement 24 mots pour une sécurité maximale.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'passphrase',
        trapType: 'similar-numbers'
    },
    {
        id: 'q-wallet-3',
        question: "Pouvez-vous récupérer votre passphrase si vous la perdez?",
        options: ["Oui, via le support Pi", "Oui, par email", "NON, elle est perdue à jamais", "Oui, avec votre numéro de téléphone"],
        correct: 2,
        explanation: "Si vous perdez votre passphrase, vos Pi sont perdus DÉFINITIVEMENT. Personne ne peut les récupérer.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'passphrase-importance',
        trapType: 'false-security'
    },
    {
        id: 'q-wallet-4',
        question: "Où devez-vous stocker votre passphrase?",
        options: ["Sur votre téléphone", "Dans un email", "Sur papier dans un endroit sûr", "Sur les réseaux sociaux"],
        correct: 2,
        explanation: "Écrivez votre passphrase sur papier et conservez-la dans un endroit sûr (coffre-fort).",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'storage',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-wallet-5',
        question: "Qu'est-ce qu'une adresse publique Pi?",
        options: ["Votre passphrase", "L'adresse pour RECEVOIR des Pi", "Votre mot de passe", "Votre email"],
        correct: 1,
        explanation: "L'adresse publique est comme un IBAN - vous pouvez la partager pour recevoir des paiements.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'addresses',
        trapType: 'confusion'
    },
    {
        id: 'q-wallet-6',
        question: "Pouvez-vous partager votre adresse publique Pi?",
        options: ["Non, c'est dangereux", "Oui, c'est sûr pour recevoir des Pi", "Seulement avec la famille", "Jamais"],
        correct: 1,
        explanation: "Votre adresse publique peut être partagée en toute sécurité pour recevoir des paiements.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'public-address',
        trapType: 'fear-trap'
    },
    {
        id: 'q-wallet-7',
        question: "Que signifie 'non-custodial wallet'?",
        options: ["Pi garde vos clés", "VOUS seul contrôlez vos clés", "Un wallet partagé", "Un wallet sans sécurité"],
        correct: 1,
        explanation: "Non-custodial = vous êtes le SEUL à avoir accès à vos fonds. Aucun tiers ne peut les bloquer.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'wallet-types',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-8',
        question: "Qu'arrive-t-il si quelqu'un obtient votre passphrase?",
        options: ["Rien de grave", "Il peut VOLER tous vos Pi", "Il peut seulement voir votre solde", "Pi le bloquera"],
        correct: 1,
        explanation: "Quiconque a votre passphrase a un ACCÈS TOTAL à vos fonds. Protégez-la absolument!",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'security-risks',
        trapType: 'false-security'
    },
    {
        id: 'q-wallet-9',
        question: "Quel est le rôle du Pi Browser?",
        options: ["Naviguer sur Facebook", "Accéder à l'écosystème Pi et aux dApps", "Miner plus vite", "Contacter le support"],
        correct: 1,
        explanation: "Pi Browser est votre portail vers les applications décentralisées (dApps) de l'écosystème Pi.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'pi-browser',
        trapType: 'none'
    },
    {
        id: 'q-wallet-10',
        question: "Devez-vous créer votre wallet AVANT la migration Mainnet?",
        options: ["Non, après suffit", "Oui, c'est OBLIGATOIRE", "C'est optionnel", "Seulement si vous avez beaucoup de Pi"],
        correct: 1,
        explanation: "Vous DEVEZ créer votre wallet et sauvegarder votre passphrase AVANT de migrer vers le Mainnet.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'mainnet-prep',
        trapType: 'procrastination-trap'
    },
    {
        id: 'q-wallet-11',
        question: "Qu'est-ce que le 'Lockup' dans Pi Wallet?",
        options: ["Verrouiller son téléphone", "Bloquer ses Pi pour un certain temps en échange de bonus", "Perdre ses Pi", "Un bug"],
        correct: 1,
        explanation: "Le Lockup permet de verrouiller vos Pi pour une période choisie et recevoir des bonus de minage.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'lockup',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-wallet-12',
        question: "Quelle est la différence entre Testnet et Mainnet?",
        options: ["Aucune", "Testnet = test, Mainnet = Pi réels avec valeur", "Mainnet = plus de bugs", "Testnet = plus rapide"],
        correct: 1,
        explanation: "Testnet sert à tester l'application. Mainnet = réseau réel où vos Pi ont une vraie valeur.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'networks',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-13',
        question: "Pouvez-vous avoir plusieurs wallets Pi?",
        options: ["Oui, autant que vous voulez", "Non, 1 seul wallet par compte KYC vérifié", "Oui, avec différents emails", "Oui, sur différents téléphones"],
        correct: 1,
        explanation: "Le système 1 Pioneer = 1 Wallet est appliqué grâce au KYC pour éviter les abus.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'wallet-limit',
        trapType: 'multiple-account-trap'
    },
    {
        id: 'q-wallet-14',
        question: "Que faire si l'app Pi plante pendant une transaction?",
        options: ["Paniquer", "Attendre et vérifier l'historique des transactions", "Réinstaller immédiatement", "Contacter la police"],
        correct: 1,
        explanation: "Les transactions blockchain sont enregistrées. Vérifiez l'historique avant de refaire une transaction.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'troubleshooting',
        trapType: 'panic-trap'
    },
    {
        id: 'q-wallet-15',
        question: "Les transactions Pi sont-elles réversibles?",
        options: ["Oui, dans les 24h", "Oui, le support peut annuler", "NON, elles sont IRRÉVERSIBLES", "Oui, avec la bonne demande"],
        correct: 2,
        explanation: "Les transactions blockchain sont DÉFINITIVES. Vérifiez toujours l'adresse avant d'envoyer!",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'transaction-finality',
        trapType: 'false-hope'
    },
    {
        id: 'q-wallet-16',
        question: "Qu'est-ce qu'un QR code dans Pi Wallet?",
        options: ["Un virus", "Un code visuel contenant votre adresse publique", "Votre passphrase encodée", "Un ticket de loterie"],
        correct: 1,
        explanation: "Le QR code encode votre adresse publique pour faciliter les paiements en personne.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'qr-codes',
        trapType: 'none'
    },
    {
        id: 'q-wallet-17',
        question: "Devez-vous payer des frais pour envoyer des Pi?",
        options: ["Oui, 10% de frais", "Non, les transactions Pi sont gratuites", "Oui, comme Bitcoin", "Ça dépend du montant"],
        correct: 1,
        explanation: "Les transactions Pi sont gratuites ou à très faible coût, contrairement à Bitcoin.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'fees',
        trapType: 'bitcoin-comparison'
    },
    {
        id: 'q-wallet-18',
        question: "Que signifie 'Migrate to Mainnet'?",
        options: ["Supprimer son compte", "Transférer ses Pi vers le réseau principal définitif", "Changer de téléphone", "Créer un nouveau compte"],
        correct: 1,
        explanation: "Migrer = transférer vos Pi minés vers le réseau Mainnet où ils ont une vraie valeur.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'migration',
        trapType: 'none'
    },
    {
        id: 'q-wallet-19',
        question: "Pouvez-vous accéder à votre wallet depuis un autre téléphone?",
        options: ["Non, jamais", "Oui, avec votre passphrase", "Seulement avec le même numéro", "Oui, avec votre email"],
        correct: 1,
        explanation: "Votre passphrase vous permet de récupérer votre wallet sur n'importe quel appareil.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'recovery',
        trapType: 'device-lock-myth'
    },
    {
        id: 'q-wallet-20',
        question: "Qu'est-ce que le 'Balance' dans Pi Wallet?",
        options: ["Votre équilibre mental", "Le solde total de vos Pi", "Votre niveau de minage", "Votre score KYC"],
        correct: 1,
        explanation: "Balance = votre solde, le nombre total de Pi que vous possédez.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'balance',
        trapType: 'literal-interpretation'
    },

    // === MEDIUM (20 questions) ===
    {
        id: 'q-wallet-21',
        question: "Quelle est la différence entre 'Transferable' et 'Locked' Pi?",
        options: [
            "Aucune différence",
            "Transferable = utilisable maintenant, Locked = bloqué pour bonus",
            "Locked = perdu",
            "Transferable = volé"
        ],
        correct: 1,
        explanation: "Les Pi Transferable sont disponibles. Les Locked sont verrouillés volontairement pour des bonus de minage.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'pi-types',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-22',
        question: "Comment vérifier qu'une transaction a bien été effectuée?",
        options: [
            "Faire confiance à l'autre personne",
            "Vérifier sur le Pi Blockchain Explorer avec le hash de transaction",
            "Attendre un email",
            "Appeler le support"
        ],
        correct: 1,
        explanation: "Chaque transaction a un hash unique vérifiable sur le blockchain explorer.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'transaction-verification',
        trapType: 'trust-trap'
    },
    {
        id: 'q-wallet-23',
        question: "Pourquoi le Pi Browser utilise-t-il un système de sandbox?",
        options: [
            "Pour les enfants",
            "Pour isoler les dApps et protéger vos données",
            "Pour jouer à des jeux",
            "C'est un bug"
        ],
        correct: 1,
        explanation: "Le sandbox isole chaque dApp pour qu'elle ne puisse pas accéder à vos données sensibles.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'browser-security',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-24',
        question: "Que se passe-t-il si vous envoyez des Pi à une mauvaise adresse?",
        options: [
            "Pi corrige automatiquement",
            "Le destinataire vous les renverra",
            "Ils sont PERDUS à jamais (sauf si le destinataire est honnête)",
            "Le support peut annuler"
        ],
        correct: 2,
        explanation: "Les transactions sont irréversibles. Vérifiez TOUJOURS l'adresse 2 fois avant d'envoyer!",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'transaction-errors',
        trapType: 'false-security'
    },
    {
        id: 'q-wallet-25',
        question: "Qu'est-ce qu'un 'smart contract' dans l'écosystème Pi?",
        options: [
            "Un contrat papier intelligent",
            "Un programme automatique qui exécute des conditions prédéfinies",
            "Un contrat avec l'équipe Pi",
            "Un accord entre mineurs"
        ],
        correct: 1,
        explanation: "Un smart contract est du code qui s'exécute automatiquement quand certaines conditions sont remplies.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'smart-contracts',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-wallet-26',
        question: "Pourquoi devez-vous activer le verrouillage biométrique du wallet?",
        options: [
            "Pour faire joli",
            "Pour empêcher l'accès physique non autorisé",
            "C'est obligatoire",
            "Pour miner plus vite"
        ],
        correct: 1,
        explanation: "Le verrouillage biométrique protège votre wallet si quelqu'un vole votre téléphone.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'biometric-security',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-wallet-27',
        question: "Quelle est la meilleure stratégie de lockup?",
        options: [
            "Tout locker 3 ans",
            "Équilibre entre liquidité à court terme et bonus à long terme selon vos besoins",
            "Ne rien locker",
            "Locker 1 semaine"
        ],
        correct: 1,
        explanation: "La stratégie optimale dépend de vos besoins personnels de liquidité et objectifs long terme.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'lockup-strategy',
        trapType: 'extreme-options'
    },
    {
        id: 'q-wallet-28',
        question: "Qu'est-ce que le 'Mining Rate Boost' lié au lockup?",
        options: [
            "Un virus",
            "Un bonus de minage proportionnel à la durée de lockup",
            "Une arnaque",
            "Un bug"
        ],
        correct: 1,
        explanation: "Plus vous lockez longtemps, plus votre taux de minage augmente (jusqu'à 200% de bonus).",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'mining-boost',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-29',
        question: "Comment fonctionne le système de 'Passphrase Confirmation'?",
        options: [
            "Pi vous envoie un email",
            "Vous devez re-saisir certains mots pour prouver que vous les avez notés",
            "Un agent vous appelle",
            "C'est automatique"
        ],
        correct: 1,
        explanation: "Pi vous demande de confirmer certains mots de votre passphrase pour s'assurer que vous l'avez bien sauvegardée.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'passphrase-verification',
        trapType: 'none'
    },
    {
        id: 'q-wallet-30',
        question: "Que faire si votre téléphone est volé avec l'app Pi?",
        options: [
            "Rien, c'est fini",
            "Récupérer vos Pi sur un nouveau téléphone avec votre passphrase + signaler le vol",
            "Appeler Pi pour bloquer",
            "Acheter le même téléphone"
        ],
        correct: 1,
        explanation: "Votre passphrase vous permet de récupérer vos Pi sur n'importe quel appareil. Signalez aussi le vol.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'device-theft',
        trapType: 'panic-trap'
    },
    {
        id: 'q-wallet-31',
        question: "Qu'est-ce qu'une 'transaction pending'?",
        options: [
            "Transaction échouée",
            "Transaction en attente de confirmation sur le réseau",
            "Transaction annulée",
            "Transaction volée"
        ],
        correct: 1,
        explanation: "Une transaction pending est en cours de validation par le réseau. Attendez quelques secondes/minutes.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'transaction-states',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-32',
        question: "Pourquoi certaines dApps demandent une 'approbation' de votre wallet?",
        options: [
            "Pour voler vos Pi",
            "Pour avoir la permission d'interagir avec vos fonds selon les règles définies",
            "C'est un virus",
            "Pour vous identifier"
        ],
        correct: 1,
        explanation: "L'approbation autorise un smart contract à interagir avec vos fonds. Lisez toujours les conditions!",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'dapp-approvals',
        trapType: 'fear-trap'
    },
    {
        id: 'q-wallet-33',
        question: "Quelle est l'importance de l'ordre des mots dans votre passphrase?",
        options: [
            "Peu importe l'ordre",
            "L'ordre est CRUCIAL - changer un mot = wallet différent",
            "Seuls les 12 premiers comptent",
            "On peut les réorganiser"
        ],
        correct: 1,
        explanation: "L'ordre exact des 24 mots génère une clé unique. Un seul mot déplacé = accès perdu.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'passphrase-order',
        trapType: 'false-flexibility'
    },
    {
        id: 'q-wallet-34',
        question: "Qu'est-ce que le 'Pi Network SDK' pour les développeurs?",
        options: [
            "Un jeu vidéo",
            "Un kit de développement pour créer des dApps Pi",
            "Un wallet spécial",
            "Un outil de minage"
        ],
        correct: 1,
        explanation: "Le SDK (Software Development Kit) permet aux développeurs de créer des applications sur Pi.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'developer-tools',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-35',
        question: "Comment fonctionne le paiement Pi dans les commerces?",
        options: [
            "Par carte bancaire",
            "En scannant le QR code du commerçant et confirmant le montant",
            "Par virement bancaire",
            "Uniquement en ligne"
        ],
        correct: 1,
        explanation: "Scannez le QR du commerçant, vérifiez le montant, confirmez. Transaction instantanée!",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'merchant-payments',
        trapType: 'traditional-finance-trap'
    },
    {
        id: 'q-wallet-36',
        question: "Que signifie 'gas fee' dans les blockchains?",
        options: [
            "Le prix de l'essence",
            "Les frais payés pour traiter une transaction sur le réseau",
            "Un bonus de minage",
            "Une taxe gouvernementale"
        ],
        correct: 1,
        explanation: "Gas = frais pour rémunérer les validateurs qui traitent votre transaction. Pi a des frais très bas.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'gas-fees',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-wallet-37',
        question: "Pourquoi ne devez-vous JAMAIS saisir votre passphrase sur un site web?",
        options: [
            "C'est lent",
            "Les sites peuvent être des pièges de phishing pour voler vos mots",
            "Ce n'est pas nécessaire",
            "C'est obligatoire pour certains services"
        ],
        correct: 1,
        explanation: "SEULE l'app officielle Pi doit avoir votre passphrase. Tout site la demandant est une arnaque.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'phishing-prevention',
        trapType: 'authority-trap'
    },
    {
        id: 'q-wallet-38',
        question: "Qu'est-ce que le 'Mainnet Balance'?",
        options: [
            "Votre solde de test",
            "Vos Pi réels sur le réseau principal, ayant une vraie valeur",
            "Votre score de minage",
            "Votre rang"
        ],
        correct: 1,
        explanation: "Le Mainnet Balance représente vos Pi réels et transférables sur le réseau principal.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'mainnet-balance',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-39',
        question: "Quelle est la durée maximale de lockup disponible?",
        options: [
            "1 mois",
            "1 an",
            "3 ans",
            "10 ans"
        ],
        correct: 2,
        explanation: "Le lockup maximum est de 3 ans, offrant les meilleurs bonus de minage.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'lockup-duration',
        trapType: 'none'
    },
    {
        id: 'q-wallet-40',
        question: "Comment vérifier l'authenticité d'une dApp sur Pi Browser?",
        options: [
            "Par son design",
            "Via la liste officielle des dApps approuvées par Pi Network",
            "Par les avis utilisateurs",
            "Par le nombre de téléchargements"
        ],
        correct: 1,
        explanation: "Consultez uniquement les dApps listées sur l'écosystème officiel Pi pour éviter les arnaques.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'dapp-verification',
        trapType: 'social-proof-trap'
    },

    // === HARD (10 questions) ===
    {
        id: 'q-wallet-41',
        question: "Comment fonctionne la dérivation de clés HD (Hierarchical Deterministic)?",
        options: [
            "Génère une clé aléatoire à chaque fois",
            "Une seed génère une infinité d'adresses de manière déterministe",
            "Utilise votre email",
            "Nécessite Internet"
        ],
        correct: 1,
        explanation: "HD wallet: votre passphrase génère mathématiquement toutes vos adresses de manière reproductible.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'hd-wallet',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-wallet-42',
        question: "Qu'est-ce que le BIP39 dans le contexte des wallets crypto?",
        options: [
            "Un type de virus",
            "Le standard qui définit les passphrase (mnemonic) de 24 mots",
            "Un type de transaction",
            "Un protocole de minage"
        ],
        correct: 1,
        explanation: "BIP39 est le standard industriel pour générer des phrases mnémoniques (passphrases) sécurisées.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'bip39',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-43',
        question: "Pourquoi la checksum est-elle importante dans une passphrase?",
        options: [
            "Pour faire joli",
            "Elle détecte les erreurs de saisie en validant le dernier mot",
            "Elle accélère les transactions",
            "Elle augmente le minage"
        ],
        correct: 1,
        explanation: "La checksum intégrée au dernier mot détecte si vous avez fait une faute de frappe.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'checksum',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-44',
        question: "Qu'est-ce qu'une attaque par 'brute force' sur un wallet?",
        options: [
            "Voler physiquement le téléphone",
            "Essayer toutes les combinaisons possibles de passphrase",
            "Pirater le serveur Pi",
            "Usurper l'identité"
        ],
        correct: 1,
        explanation: "Brute force = tester toutes les combinaisons. Impossible avec 24 mots (2^256 possibilités).",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'brute-force',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-45',
        question: "Combien de combinaisons possibles y a-t-il pour une passphrase de 24 mots?",
        options: [
            "Un million",
            "Un milliard",
            "2^256 (plus d'atomes dans l'univers observable)",
            "24 puissance 24"
        ],
        correct: 2,
        explanation: "Une passphrase de 24 mots offre ~2^256 combinaisons. C'est incassable par force brute.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'entropy',
        trapType: 'scale-comprehension'
    },
    {
        id: 'q-wallet-46',
        question: "Qu'est-ce qu'une 'signature cryptographique' pour une transaction?",
        options: [
            "Votre signature manuscrite scannée",
            "Une preuve mathématique que vous êtes propriétaire des Pi envoyés",
            "Un tampon officiel",
            "Un code QR"
        ],
        correct: 1,
        explanation: "La signature cryptographique prouve mathématiquement que vous possédez les clés privées sans les révéler.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'digital-signatures',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-wallet-47',
        question: "Comment fonctionne ECDSA (Elliptic Curve Digital Signature Algorithm)?",
        options: [
            "Par email",
            "Utilise les mathématiques des courbes elliptiques pour créer des signatures compactes et sécurisées",
            "Par SMS",
            "Avec l'empreinte digitale"
        ],
        correct: 1,
        explanation: "ECDSA utilise la cryptographie sur courbes elliptiques pour signer les transactions de manière sécurisée.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'ecdsa',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-wallet-48',
        question: "Qu'est-ce qu'un 'Merkle Tree' dans la blockchain Pi?",
        options: [
            "Un arbre généalogique",
            "Une structure de données qui vérifie efficacement l'intégrité des transactions",
            "Un type de minage",
            "Un bonus"
        ],
        correct: 1,
        explanation: "Le Merkle Tree permet de vérifier qu'une transaction est incluse dans un bloc sans télécharger tout le bloc.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'merkle-tree',
        trapType: 'metaphor-confusion'
    },
    {
        id: 'q-wallet-49',
        question: "Pourquoi devriez-vous utiliser un 'passphrase' supplémentaire (25ème mot)?",
        options: [
            "C'est obligatoire",
            "Elle ajoute une couche de sécurité même si les 24 mots sont compromis",
            "Pour miner plus vite",
            "C'est déconseillé"
        ],
        correct: 1,
        explanation: "Le 25ème mot (optionnel) crée un wallet caché. Même si les 24 mots fuient, vos fonds sont protégés.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'plausible-deniability',
        trapType: 'advanced-security'
    },
    {
        id: 'q-wallet-50',
        question: "Qu'est-ce que le 'State Channel' dans le contexte des paiements Pi?",
        options: [
            "Un canal de télévision",
            "Un mécanisme de transactions hors-chaîne pour des paiements instantanés et à faible coût",
            "Un type de wallet",
            "Un bug"
        ],
        correct: 1,
        explanation: "Les State Channels permettent des transactions instantanées hors-chaîne, réduisant la congestion du réseau.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'layer2',
        trapType: 'technical-jargon'
    }
];

// English version
export const WALLET_QUESTIONS_EN = WALLET_QUESTIONS_FR.map(q => ({
    ...q,
    // Add English translations here if needed
    // For now, use French as base
}));
