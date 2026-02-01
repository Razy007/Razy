// ========================================
// COURS 4: KYC PI NETWORK (50 QUESTIONS)
// ========================================
export const KYC_QUESTIONS_FR = [
    // === EASY (20 questions) ===
    {
        id: 'q-kyc-1',
        question: "Que signifie KYC?",
        options: ["Know Your Crypto", "Know Your Customer (Connaître son client)", "Keep Your Coins", "Key Your Code"],
        correct: 1,
        explanation: "KYC = Know Your Customer, processus de vérification d'identité obligatoire.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-basics',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-kyc-2',
        question: "Pourquoi le KYC est-il obligatoire sur Pi Network?",
        options: ["Pour vous espionner", "Pour garantir 1 compte = 1 personne réelle", "Pour vendre vos données", "C'est optionnel"],
        correct: 1,
        explanation: "Le KYC assure que chaque compte Pi appartient à une vraie personne unique, évitant les bots.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-purpose',
        trapType: 'conspiracy-trap'
    },
    {
        id: 'q-kyc-3',
        question: "Quels documents sont acceptés pour le KYC Pi?",
        options: ["Carte de visite", "Passeport ou carte d'identité officielle", "Photo de profil", "Diplôme"],
        correct: 1,
        explanation: "Seuls les documents d'identité officiels émis par le gouvernement sont acceptés.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-documents',
        trapType: 'none'
    },
    {
        id: 'q-kyc-4',
        question: "Que se passe-t-il si vous ne faites pas le KYC?",
        options: ["Rien", "Vous ne pourrez PAS migrer vos Pi vers le Mainnet", "Vous perdez juste des bonus", "Vous pouvez le faire plus tard sans conséquence"],
        correct: 1,
        explanation: "Sans KYC validé, vos Pi ne peuvent pas migrer vers le Mainnet et n'auront donc aucune valeur.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-consequences',
        trapType: 'procrastination-trap'
    },
    {
        id: 'q-kyc-5',
        question: "Le KYC est-il gratuit sur Pi Network?",
        options: ["Non, il coûte 10€", "Oui, totalement GRATUIT", "Ça dépend du pays", "Non, il coûte des Pi"],
        correct: 1,
        explanation: "Le KYC Pi est 100% gratuit. Toute demande de paiement est une ARNAQUE.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-cost',
        trapType: 'fee-scam'
    },
    {
        id: 'q-kyc-6',
        question: "Où devez-vous faire votre KYC?",
        options: ["Sur un site web externe", "UNIQUEMENT dans l'app officielle Pi", "Par email", "Sur Telegram"],
        correct: 1,
        explanation: "Le KYC se fait UNIQUEMENT dans l'application Pi officielle. Jamais ailleurs!",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'kyc-location',
        trapType: 'phishing-trap'
    },
    {
        id: 'q-kyc-7',
        question: "Combien de temps prend la validation du KYC?",
        options: ["5 minutes", "De quelques heures à plusieurs jours", "1 an", "C'est instantané"],
        correct: 1,
        explanation: "Le délai varie selon le volume de demandes et la qualité de vos documents.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-timeline',
        trapType: 'instant-gratification'
    },
    {
        id: 'q-kyc-8',
        question: "Pouvez-vous faire le KYC pour quelqu'un d'autre?",
        options: ["Oui, pour aider la famille", "NON, chaque personne doit faire SON propre KYC", "Oui, si vous avez sa permission", "Oui, avec procuration"],
        correct: 1,
        explanation: "Le KYC est personnel. Vous ne pouvez le faire que pour votre propre compte.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-personal',
        trapType: 'helpfulness-trap'
    },
    {
        id: 'q-kyc-9',
        question: "Que se passe-t-il si votre KYC est rejeté?",
        options: ["Vous êtes banni à vie", "Vous pouvez recommencer avec de meilleures photos/documents", "Vos Pi sont pris", "Rien"],
        correct: 1,
        explanation: "Un rejet KYC n'est pas définitif. Vous pouvez soumettre de nouveau avec de meilleurs documents.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-rejection',
        trapType: 'fear-trap'
    },
    {
        id: 'q-kyc-10',
        question: "Quelle photo devez-vous prendre pour le KYC?",
        options: ["Une photo de profil Instagram", "Une photo de vous tenant votre document d'identité (selfie)", "Une photo de votre animal", "N'importe quelle photo"],
        correct: 1,
        explanation: "Vous devez prendre un selfie clair en tenant votre document d'identité visible.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'kyc-selfie',
        trapType: 'none'
    },
    {
        id: 'q-kyc-11',
        question: "Les informations KYC sont-elles partagées avec des tiers?",
        options: ["Oui, avec tous", "Non, elles sont protégées et utilisées uniquement pour la vérification", "Oui, avec les annonceurs", "Oui, vendues"],
        correct: 1,
        explanation: "Vos données KYC sont confidentielles et utilisées uniquement pour vérifier votre identité.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-privacy',
        trapType: 'privacy-fear'
    },
    {
        id: 'q-kyc-12',
        question: "Quel âge minimum faut-il avoir pour le KYC Pi?",
        options: ["10 ans", "16 ans", "18 ans dans la plupart des pays", "Aucun minimum"],
        correct: 2,
        explanation: "L'âge minimum varie selon les pays mais est généralement de 18 ans.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-age',
        trapType: 'none'
    },
    {
        id: 'q-kyc-13',
        question: "Devez-vous refaire le KYC si vous changez de téléphone?",
        options: ["Oui, à chaque fois", "Non, votre KYC est lié à votre compte, pas au téléphone", "Oui, tous les 6 mois", "Ça dépend"],
        correct: 1,
        explanation: "Votre KYC validé reste attaché à votre compte, peu importe l'appareil utilisé.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-device',
        trapType: 'device-myth'
    },
    {
        id: 'q-kyc-14',
        question: "Qu'est-ce que 'le compte'?",
        options: ["Votre relevé bancaire", "La vérification que vous êtes vivant (liveness check)", "Votre facture", "Un document fiscal"],
        correct: 1,
        explanation: "Le liveness check vérifie que vous êtes une vraie personne (pas une photo imprimée).",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'liveness-check',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-15',
        question: "Pouvez-vous modifier vos informations KYC après validation?",
        options: ["Oui, facilement", "Non, elles sont définitives (sauf erreur prouvée)", "Oui, tous les mois", "Oui, avec un paiement"],
        correct: 1,
        explanation: "Une fois validées, les informations KYC sont permanentes. Soyez précis lors de la soumission!",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-permanence',
        trapType: 'casual-entry'
    },
    {
        id: 'q-kyc-16',
        question: "Que signifie un statut KYC 'Pending'?",
        options: ["Rejeté", "En cours de vérification", "Validé", "Annulé"],
        correct: 1,
        explanation: "Pending = en attente de traitement par les vérificateurs. Soyez patient!",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-status',
        trapType: 'status-confusion'
    },
    {
        id: 'q-kyc-17',
        question: "Qui vérifie les documents KYC sur Pi Network?",
        options: ["Des robots uniquement", "Une combinaison d'IA et de validateurs humains de la communauté", "Le gouvernement", "Des employés Pi Core Team"],
        correct: 1,
        explanation: "Pi utilise l'IA et des validateurs humains formés pour vérifier les documents.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-validators',
        trapType: 'none'
    },
    {
        id: 'q-kyc-18',
        question: "Devez-vous avoir une connexion Internet pour le KYC?",
        options: ["Non, ça marche hors ligne", "Oui, une connexion stable est NÉCESSAIRE", "Seulement pour l'envoi", "Non, on peut poster les documents"],
        correct: 1,
        explanation: "Une connexion Internet stable est indispensable pour soumettre et vérifier votre KYC.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-requirements',
        trapType: 'offline-myth'
    },
    {
        id: 'q-kyc-19',
        question: "Que faire si votre document d'identité est expiré?",
        options: ["L'utiliser quand même", "Renouveler votre document AVANT de faire le KYC", "Photocopier l'ancien", "Modifier la date"],
        correct: 1,
        explanation: "Seuls les documents valides et non expirés sont acceptés pour le KYC.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'kyc-document-validity',
        trapType: 'shortcut-trap'
    },
    {
        id: 'q-kyc-20',
        question: "Le KYC garantit-il que vos Pi auront une certaine valeur?",
        options: ["Oui, valeur garantie", "Non, il permet juste de migrer - la valeur dépend du marché", "Oui, 1 Pi = 1$", "Oui, 1 Pi = 314$"],
        correct: 1,
        explanation: "Le KYC permet la migration, pas une garantie de valeur. La valeur sera déterminée par le marché.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-value-misconception',
        trapType: 'guaranteed-value-myth'
    },

    // === MEDIUM (20 questions) ===
    {
        id: 'q-kyc-21',
        question: "Pourquoi Pi utilise-t-il des validateurs humains pour le KYC?",
        options: [
            "C'est moins cher",
            "Pour décentraliser la vérification et éviter les faux positifs de l'IA",
            "Parce que l'IA n'existe pas",
            "Pour créer des emplois"
        ],
        correct: 1,
        explanation: "Les validateurs humains vérifient ce que l'IA pourrait manquer, assurant une meilleure précision.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'decentralized-kyc',
        trapType: 'none'
    },
    {
        id: 'q-kyc-22',
        question: "Qu'est-ce que 'l'attestation d'identité décentralisée'?",
        options: [
            "Un document papier",
            "Une preuve d'identité validée par un réseau distribué plutôt qu'une seule autorité",
            "Une carte d'identité numérique",
            "Un passeport"
        ],
        correct: 1,
        explanation: "L'identité décentralisée est vérifiée par un réseau, pas par une seule entreprise ou gouvernement.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'decentralized-identity',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-23',
        question: "Comment éviter un rejet KYC?",
        options: [
            "Payer un service d'accélération",
            "Prendre des photos claires, bien éclairées, avec un document valide lisible",
            "Utiliser un document de quelqu'un d'autre",
            "Modifier les photos avec Photoshop"
        ],
        correct: 1,
        explanation: "Qualité des photos + document valide + informations correspondantes = validation facilitée.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'kyc-best-practices',
        trapType: 'shortcut-trap'
    },
    {
        id: 'q-kyc-24',
        question: "Que signifie 'AML' dans le contexte du KYC?",
        options: [
            "All My Love",
            "Anti-Money Laundering (Lutte contre le blanchiment d'argent)",
            "Application Mobile Light",
            "Automatic Mining Level"
        ],
        correct: 1,
        explanation: "AML = Anti-Money Laundering. Le KYC aide à prévenir le blanchiment d'argent et le financement du terrorisme.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'aml',
        trapType: 'acronym-confusion'
    },
    {
        id: 'q-kyc-25',
        question: "Pourquoi le selfie avec document est-il nécessaire?",
        options: [
            "Pour votre album photo",
            "Pour prouver que VOUS êtes le propriétaire du document",
            "C'est optionnel",
            "Pour vérifier la qualité de votre caméra"
        ],
        correct: 1,
        explanation: "Le selfie prouve que la personne qui soumet est bien celle sur le document d'identité.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'selfie-verification',
        trapType: 'questioning-trap'
    },
    {
        id: 'q-kyc-26',
        question: "Que se passe-t-il aux Pi des comptes non-KYC après la deadline?",
        options: [
            "Ils restent disponibles indéfiniment",
            "Ils peuvent être redistribués ou perdus (selon les règles officielles)",
            "Ils sont automatiquement validés",
            "Ils triplent de valeur"
        ],
        correct: 1,
        explanation: "Sans KYC à temps, vos Pi pourraient être inaccessibles ou redistribués selon les règles en vigueur.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-deadline',
        trapType: 'procrastination-trap'
    },
    {
        id: 'q-kyc-27',
        question: "Comment Pi protège-t-il vos données biométriques du KYC?",
        options: [
            "Il ne les protège pas",
            "Chiffrement, stockage sécurisé, et traitement conforme aux réglementations (GDPR)",
            "Il les vend",
            "Il les publie"
        ],
        correct: 1,
        explanation: "Pi applique le chiffrement et les standards de confidentialité (GDPR) pour protéger vos données.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'data-protection',
        trapType: 'privacy-fear'
    },
    {
        id: 'q-kyc-28',
        question: "Qu'est-ce qu'un 'faux positif' dans le contexte du KYC?",
        options: [
            "Un test COVID positif",
            "Un rejet erroné d'un vrai utilisateur légitime",
            "Une validation d'un faux compte",
            "Un bug"
        ],
        correct: 1,
        explanation: "Faux positif = le système rejette à tort un utilisateur légitime. Les validateurs humains aident à corriger.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'verification-errors',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-29',
        question: "Peut-on avoir plusieurs comptes Pi avec différentes identités?",
        options: [
            "Oui, avec chaque email",
            "NON, c'est strictement interdit et détectable",
            "Oui, avec différents téléphones",
            "Oui, dans différents pays"
        ],
        correct: 1,
        explanation: "Le multi-compte est interdit. Le KYC et l'IA détectent les tentatives de fraude.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'multi-account',
        trapType: 'loophole-trap'
    },
    {
        id: 'q-kyc-30',
        question: "Qu'est-ce que le 'Face Matching' dans le processus KYC?",
        options: [
            "Un jeu",
            "La comparaison de votre selfie avec la photo de votre document",
            "Un filtre Snapchat",
            "Une mode"
        ],
        correct: 1,
        explanation: "L'IA compare votre visage en direct avec la photo de votre document d'identité pour vérifier la correspondance.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'face-matching',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-31',
        question: "Pourquoi devez-vous parfois tourner la tête pendant le selfie KYC?",
        options: [
            "Pour voir si vous êtes éveillé",
            "C'est un 'liveness check' pour prouver que vous êtes réel et non une photo",
            "Pour vérifier votre cou",
            "C'est un bug"
        ],
        correct: 1,
        explanation: "Le liveness check détecte si c'est une vraie personne ou une photo/vidéo préenregistrée.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'liveness-detection',
        trapType: 'questioning-trap'
    },
    {
        id: 'q-kyc-32',
        question: "Que signifie 'KYC Passed' dans votre profil Pi?",
        options: [
            "Vous avez échoué",
            "Votre identité a été vérifiée avec succès",
            "Votre KYC est en attente",
            "Vous devez recommencer"
        ],
        correct: 1,
        explanation: "KYC Passed = vérification réussie. Vous pouvez migrer vers le Mainnet.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-status',
        trapType: 'none'
    },
    {
        id: 'q-kyc-33',
        question: "Qu'est-ce que l'OCR dans le processus KYC?",
        options: [
            "Un type de virus",
            "Optical Character Recognition - lecture automatique du texte sur votre document",
            "Un format d'image",
            "Un pays"
        ],
        correct: 1,
        explanation: "L'OCR extrait automatiquement les informations texte de votre document (nom, date de naissance, etc.).",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'ocr-technology',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-34',
        question: "Comment Pi détecte-t-il les documents falsifiés?",
        options: [
            "Il ne peut pas",
            "IA analysant les caractéristiques de sécurité + vérification humaine",
            "En appelant le gouvernement",
            "Par email"
        ],
        correct: 1,
        explanation: "L'IA analyse les éléments de sécurité des documents (hologrammes, fonts, formats) et les humains vérifient les cas suspects.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'document-verification',
        trapType: 'none'
    },
    {
        id: 'q-kyc-35',
        question: "Que faire si votre nom a un caractère spécial que le système ne reconnaît pas?",
        options: [
            "Abandonner",
            "Contacter le support Pi pour une assistance spéciale",
            "Changer votre nom",
            "Utiliser un faux nom"
        ],
        correct: 1,
        explanation: "Le support Pi peut aider avec les caractères spéciaux ou les noms non-latins.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'kyc-special-cases',
        trapType: 'none'
    },
    {
        id: 'q-kyc-36',
        question: "Pourquoi la lumière naturelle est-elle recommandée pour le selfie KYC?",
        options: [
            "C'est plus joli",
            "Elle permet à l'IA de mieux analyser votre visage sans ombres ni reflets",
            "C'est obligatoire",
            "Pour économiser l'électricité"
        ],
        correct: 1,
        explanation: "La lumière naturelle évite les ombres et reflets qui peuvent causer des rejets automatiques.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'kyc-photo-tips',
        trapType: 'none'
    },
    {
        id: 'q-kyc-37',
        question: "Qu'est-ce que le 'Slot System' pour le KYC Pi?",
        options: [
            "Un casino",
            "Un système de créneaux où vous devez attendre votre tour pour le KYC",
            "Un bonus",
            "Un jeu"
        ],
        correct: 1,
        explanation: "Le système de slots gère le flux des vérifications KYC pour éviter la congestion.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-queue',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-kyc-38',
        question: "Peuvent-ils vérifier si votre document est volé?",
        options: [
            "Non, jamais",
            "Oui, via des bases de données internationales de documents volés/perdus",
            "Seulement en Europe",
            "Seulement aux USA"
        ],
        correct: 1,
        explanation: "Le système peut croiser les données avec les registres internationaux de documents signalés.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'document-databases',
        trapType: 'none'
    },
    {
        id: 'q-kyc-39',
        question: "Que faire si vous n'avez pas de document d'identité?",
        options: [
            "Utiliser celui d'un ami",
            "Attendre d'en obtenir un légalement avant de faire le KYC",
            "Créer un faux",
            "Abandonner Pi"
        ],
        correct: 1,
        explanation: "Obtenez d'abord un document officiel. N'utilisez JAMAIS un faux ou celui d'autrui.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'kyc-no-document',
        trapType: 'shortcut-trap'
    },
    {
        id: 'q-kyc-40',
        question: "Le KYC fonctionne-t-il dans tous les pays?",
        options: [
            "Oui, partout sans exception",
            "Presque partout, avec quelques pays sous restrictions (sanctions internationales)",
            "Seulement aux USA",
            "Seulement en Europe"
        ],
        correct: 1,
        explanation: "Le KYC est disponible dans la plupart des pays, sauf ceux sous sanctions internationales.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'kyc-availability',
        trapType: 'none'
    },

    // === HARD (10 questions) ===
    {
        id: 'q-kyc-41',
        question: "Comment fonctionne le 'Zero-Knowledge Proof' pour la vie privée du KYC?",
        options: [
            "C'est impossible",
            "Prouver un fait (>18 ans) sans révéler l'information complète (date de naissance)",
            "Cacher toutes les données",
            "Ne rien prouver"
        ],
        correct: 1,
        explanation: "ZKP permet de prouver une propriété sans révéler les données sous-jacentes - l'avenir du KYC privé.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'zkp-kyc',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-kyc-42',
        question: "Qu'est-ce que l'identité auto-souveraine (Self-Sovereign Identity)?",
        options: [
            "Être son propre roi",
            "Un modèle où l'utilisateur contrôle totalement ses données d'identité",
            "N'avoir aucune identité",
            "Changer d'identité librement"
        ],
        correct: 1,
        explanation: "SSI = vous possédez et contrôlez vos données d'identité, pas les entreprises ou gouvernements.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'self-sovereign-identity',
        trapType: 'conceptual-complexity'
    },
    {
        id: 'q-kyc-43',
        question: "Comment fonctionne la vérification biométrique 3D?",
        options: [
            "Avec des lunettes 3D",
            "Analyse des contours faciaux en profondeur pour détecter les masques et photos",
            "Impression 3D du visage",
            "Réalité virtuelle"
        ],
        correct: 1,
        explanation: "La 3D mapping détecte les faux visages (masques, photos) en analysant la profondeur réelle.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: '3d-biometrics',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-44',
        question: "Qu'est-ce que le 'Presentation Attack Detection' (PAD)?",
        options: [
            "Détecter les présentations PowerPoint",
            "Technologie détectant les tentatives de tromper le système (photos, masques, deepfakes)",
            "Une attaque informatique",
            "Un type de virus"
        ],
        correct: 1,
        explanation: "PAD protège contre les attaques de présentation: photos imprimées, masques, vidéos préenregistrées.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'pad',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-45',
        question: "Comment les 'Verifiable Credentials' amélioreront-ils le KYC futur?",
        options: [
            "Pas d'amélioration",
            "Attestations cryptographiques réutilisables sans re-soumettre les documents",
            "Suppression du KYC",
            "Plus de paperasse"
        ],
        correct: 1,
        explanation: "Les VC permettront de prouver votre KYC sur plusieurs plateformes sans recommencer à chaque fois.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'verifiable-credentials',
        trapType: 'future-tech'
    },
    {
        id: 'q-kyc-46',
        question: "Qu'est-ce que le GDPR impose pour le traitement des données KYC?",
        options: [
            "Rien",
            "Consentement explicite, droit à l'effacement, minimisation des données, transparence",
            "Stockage illimité",
            "Partage obligatoire"
        ],
        correct: 1,
        explanation: "Le GDPR impose des règles strictes: consentement, droit d'accès, portabilité, effacement.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'gdpr-kyc',
        trapType: 'legal-complexity'
    },
    {
        id: 'q-kyc-47',
        question: "Comment fonctionne l'analyse de 'document tampering'?",
        options: [
            "Impossible à détecter",
            "L'IA analyse les incohérences de pixels, fonts, et méta-données du document",
            "Par lecture manuelle uniquement",
            "Par rayons X"
        ],
        correct: 1,
        explanation: "L'IA détecte les modifications: incohérences de polices, artefacts de compression, templates copiés.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'tamper-detection',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-kyc-48',
        question: "Qu'est-ce que le 'KYC Portability' dans le Web3?",
        options: [
            "Transporter physiquement ses documents",
            "Réutiliser sa vérification KYC sur plusieurs plateformes sans la refaire",
            "Changer de pays",
            "Modifier son KYC"
        ],
        correct: 1,
        explanation: "La portabilité KYC permettra d'utiliser une seule vérification sur multiple services Web3.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'kyc-portability',
        trapType: 'future-tech'
    },
    {
        id: 'q-kyc-49',
        question: "Comment Pi peut-il vérifier des documents de 180+ pays?",
        options: [
            "Impossible",
            "Base de données de templates de documents + IA + validateurs locaux formés",
            "Traduction automatique",
            "Google"
        ],
        correct: 1,
        explanation: "Pi combine templates de documents internationaux, IA multilingue, et validateurs de différentes régions.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'global-kyc',
        trapType: 'scale-complexity'
    },
    {
        id: 'q-kyc-50',
        question: "Qu'est-ce que le 'Decentralized Identifier' (DID) dans l'identité Web3?",
        options: [
            "Un numéro de téléphone",
            "Un identifiant unique contrôlé par l'utilisateur, ancré sur blockchain",
            "Un mot de passe",
            "Un email"
        ],
        correct: 1,
        explanation: "Le DID est un identifiant décentralisé que vous contrôlez, indépendant de toute autorité centrale.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: 'did',
        trapType: 'future-tech'
    }
];

export const KYC_QUESTIONS_EN = KYC_QUESTIONS_FR.map(q => ({
    ...q,
}));
