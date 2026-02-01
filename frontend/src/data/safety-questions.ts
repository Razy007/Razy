// ========================================
// COURS 3: SÉCURITÉ PI NETWORK (50 QUESTIONS)
// ========================================
export const SAFETY_QUESTIONS_FR = [
    // DIFFICULTÉ: EASY (20 questions)
    {
        id: 'q-safety-1',
        question: "Quelle est la règle d'or de la sécurité Pi?",
        options: ["Partager sa passphrase avec des amis", "Ne JAMAIS partager sa passphrase", "Envoyer sa passphrase par email", "La noter sur les réseaux sociaux"],
        correct: 1,
        explanation: "Votre passphrase est votre clé privée. Ne la partagez JAMAIS avec personne.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'passphrase-security',
        trapType: 'none'
    },
    {
        id: 'q-safety-2',
        question: "Combien de mots contient une passphrase Pi standard?",
        options: ["12 mots", "24 mots", "6 mots", "48 mots"],
        correct: 1,
        explanation: "Une passphrase Pi contient 24 mots pour une sécurité maximale.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'passphrase-basics',
        trapType: 'similar-numbers'
    },
    {
        id: 'q-safety-3',
        question: "Où devez-vous stocker votre passphrase?",
        options: ["Dans le cloud Google Drive", "Sur papier dans un coffre", "Dans un email", "Sur une capture d'écran"],
        correct: 1,
        explanation: "Stockez votre passphrase sur papier dans un endroit sûr (coffre-fort).",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'passphrase-storage',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-4',
        question: "Que se passe-t-il si vous perdez votre passphrase?",
        options: ["Pi Core Team peut la récupérer", "Vous perdez vos Pi DÉFINITIVEMENT", "Vous pouvez la réinitialiser par email", "Rien de grave"],
        correct: 1,
        explanation: "Si vous perdez votre passphrase, vos Pi sont perdus à jamais. Personne ne peut les récupérer.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'passphrase-importance',
        trapType: 'false-security'
    },
    {
        id: 'q-safety-5',
        question: "Qu'est-ce qu'une attaque de phishing?",
        options: ["Un virus informatique", "Une tentative de vol d'informations par tromperie", "Un bug du wallet", "Une mise à jour Pi"],
        correct: 1,
        explanation: "Le phishing est une technique où des escrocs se font passer pour Pi Network pour voler vos données.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'phishing',
        trapType: 'none'
    },
    {
        id: 'q-safety-6',
        question: "Pi Core Team demandera-t-elle JAMAIS votre passphrase?",
        options: ["Oui, pour vérification KYC", "Oui, en cas de problème", "NON, JAMAIS", "Oui, par email officiel"],
        correct: 2,
        explanation: "Pi Core Team ne demandera JAMAIS votre passphrase. Toute demande est une arnaque.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'official-policy',
        trapType: 'authority-trap'
    },
    {
        id: 'q-safety-7',
        question: "Quel est le site officiel de Pi Network?",
        options: ["pinetwork.com", "minepi.com", "pi-network.org", "pinetwork.net"],
        correct: 1,
        explanation: "Le seul site officiel est minepi.com. Méfiez-vous des imitations.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'official-channels',
        trapType: 'similar-domains'
    },
    {
        id: 'q-safety-8',
        question: "Devez-vous activer l'authentification à deux facteurs (2FA)?",
        options: ["Non, c'est optionnel", "Oui, c'est FORTEMENT recommandé", "Seulement si vous avez beaucoup de Pi", "C'est inutile"],
        correct: 1,
        explanation: "Le 2FA ajoute une couche de sécurité essentielle pour protéger votre compte.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: '2fa',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-9',
        question: "Que faire si vous recevez un email suspect prétendant venir de Pi?",
        options: ["Cliquer sur le lien pour vérifier", "Répondre avec vos informations", "IGNORER et signaler comme spam", "Partager avec vos amis"],
        correct: 2,
        explanation: "Ne cliquez jamais sur des liens suspects. Signalez et supprimez immédiatement.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'phishing-response',
        trapType: 'urgency-trap'
    },
    {
        id: 'q-safety-10',
        question: "Combien de copies de votre passphrase devriez-vous avoir?",
        options: ["1 seule", "Au moins 2-3 copies dans des endroits différents", "10 copies partout", "Aucune, la mémoriser suffit"],
        correct: 1,
        explanation: "Ayez 2-3 copies sécurisées dans des endroits différents (coffre, banque, etc.).",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'backup-strategy',
        trapType: 'extreme-options'
    },
    {
        id: 'q-safety-11',
        question: "Qu'est-ce qu'un wallet non-custodial?",
        options: ["Un wallet géré par Pi Core Team", "Un wallet où VOUS seul contrôlez vos clés", "Un wallet sans sécurité", "Un wallet partagé"],
        correct: 1,
        explanation: "Non-custodial signifie que vous êtes le seul à contrôler vos fonds. Personne d'autre.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'wallet-types',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-12',
        question: "Pouvez-vous partager votre adresse publique Pi?",
        options: ["Non, c'est dangereux", "Oui, c'est sûr pour recevoir des Pi", "Seulement avec la famille", "Jamais"],
        correct: 1,
        explanation: "Votre adresse publique peut être partagée sans danger pour recevoir des paiements.",
        difficulty: 'easy',
        cognitiveLevel: 'comprehension',
        topic: 'public-vs-private',
        trapType: 'confusion-trap'
    },
    {
        id: 'q-safety-13',
        question: "Que signifie 'clé privée'?",
        options: ["Votre mot de passe email", "La clé qui donne accès à vos Pi", "Votre nom d'utilisateur", "Votre numéro de téléphone"],
        correct: 1,
        explanation: "La clé privée (passphrase) est ce qui prouve que vous possédez vos Pi.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'cryptography-basics',
        trapType: 'none'
    },
    {
        id: 'q-safety-14',
        question: "Devez-vous télécharger Pi Wallet depuis le Google Play Store officiel?",
        options: ["Non, n'importe quel site suffit", "Oui, UNIQUEMENT depuis les stores officiels", "Les APK tiers sont plus rapides", "Peu importe"],
        correct: 1,
        explanation: "Téléchargez UNIQUEMENT depuis Google Play ou App Store pour éviter les faux wallets.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'app-security',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-15',
        question: "Qu'est-ce qu'une 'seed phrase'?",
        options: ["Un code promo", "Votre passphrase de 24 mots", "Votre mot de passe", "Votre email"],
        correct: 1,
        explanation: "Seed phrase = passphrase = vos 24 mots secrets.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'terminology',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-16',
        question: "Pouvez-vous changer votre passphrase après création?",
        options: ["Oui, à tout moment", "Non, elle est permanente", "Oui, mais seulement une fois", "Oui, via support"],
        correct: 1,
        explanation: "Votre passphrase est permanente. Vous ne pouvez pas la changer. Protégez-la !",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'passphrase-permanence',
        trapType: 'false-flexibility'
    },
    {
        id: 'q-safety-17',
        question: "Que faire si quelqu'un vous demande vos Pi en échange d'un 'doublement'?",
        options: ["Accepter, c'est une bonne affaire", "C'est une ARNAQUE, refuser immédiatement", "Vérifier d'abord", "Demander à Pi Core Team"],
        correct: 1,
        explanation: "Toute promesse de 'doubler vos Pi' est une arnaque classique. Ne tombez pas dans le piège.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'scam-awareness',
        trapType: 'greed-trap'
    },
    {
        id: 'q-safety-18',
        question: "Devez-vous mettre à jour l'app Pi régulièrement?",
        options: ["Non, l'ancienne version suffit", "Oui, pour la sécurité et les nouvelles fonctionnalités", "Seulement si obligé", "Jamais"],
        correct: 1,
        explanation: "Les mises à jour corrigent des failles de sécurité. Mettez toujours à jour.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'app-maintenance',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-19',
        question: "Qu'est-ce qu'un 'smart contract malveillant'?",
        options: ["Un contrat intelligent normal", "Un contrat conçu pour voler vos fonds", "Un contrat rapide", "Un contrat officiel Pi"],
        correct: 1,
        explanation: "Certains smart contracts sont des pièges pour voler vos Pi. Vérifiez toujours la source.",
        difficulty: 'easy',
        cognitiveLevel: 'knowledge',
        topic: 'smart-contract-risks',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-20',
        question: "Pouvez-vous utiliser le même mot de passe pour Pi et vos emails?",
        options: ["Oui, c'est pratique", "NON, utilisez des mots de passe uniques", "Oui, si c'est fort", "Peu importe"],
        correct: 1,
        explanation: "Utilisez TOUJOURS des mots de passe différents pour chaque service critique.",
        difficulty: 'easy',
        cognitiveLevel: 'application',
        topic: 'password-hygiene',
        trapType: 'convenience-trap'
    },

    // DIFFICULTÉ: MEDIUM (20 questions)
    {
        id: 'q-safety-21',
        question: "Quelle est la différence entre une clé publique et une clé privée?",
        options: [
            "Aucune différence",
            "Publique = pour recevoir, Privée = pour dépenser",
            "Publique = secrète, Privée = partageable",
            "Les deux sont identiques"
        ],
        correct: 1,
        explanation: "La clé publique (adresse) est partageable pour recevoir des Pi. La clé privée (passphrase) doit rester secrète.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'cryptography',
        trapType: 'reversed-logic'
    },
    {
        id: 'q-safety-22',
        question: "Qu'est-ce qu'une attaque 'Man-in-the-Middle'?",
        options: [
            "Un virus qui ralentit votre téléphone",
            "Un pirate qui intercepte vos communications",
            "Une mise à jour Pi",
            "Un bug du wallet"
        ],
        correct: 1,
        explanation: "Un attaquant intercepte vos données entre vous et le serveur. Utilisez toujours HTTPS.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'network-security',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-23',
        question: "Pourquoi ne devez-vous jamais prendre de photo de votre passphrase?",
        options: [
            "C'est interdit par Pi",
            "Les photos peuvent être hackées/volées dans le cloud",
            "Ça porte malheur",
            "C'est trop long"
        ],
        correct: 1,
        explanation: "Les photos sont souvent synchronisées avec le cloud (Google Photos, iCloud) et peuvent être piratées.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'digital-hygiene',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-24',
        question: "Qu'est-ce qu'un 'clipboard hijacker'?",
        options: [
            "Un outil de copier-coller",
            "Un malware qui remplace les adresses copiées",
            "Une fonctionnalité Pi",
            "Un raccourci clavier"
        ],
        correct: 1,
        explanation: "Ce malware remplace l'adresse que vous copiez par celle du pirate. Vérifiez toujours l'adresse avant d'envoyer.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'malware-types',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-25',
        question: "Comment vérifier qu'un site est le vrai minepi.com?",
        options: [
            "Vérifier le design",
            "Vérifier le certificat SSL (cadenas) et l'URL exacte",
            "Demander à un ami",
            "Cliquer sur le premier résultat Google"
        ],
        correct: 1,
        explanation: "Vérifiez toujours le cadenas SSL et que l'URL est EXACTEMENT 'minepi.com' (pas 'minepi.net' ou 'mine-pi.com').",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'url-verification',
        trapType: 'visual-similarity'
    },
    {
        id: 'q-safety-26',
        question: "Qu'est-ce qu'un 'dust attack'?",
        options: [
            "Un virus qui ralentit le réseau",
            "L'envoi de petites quantités de crypto pour tracer votre identité",
            "Une mise à jour Pi",
            "Un bug du wallet"
        ],
        correct: 1,
        explanation: "Les pirates envoient de minuscules montants pour lier vos adresses et désanonymiser vos transactions.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'privacy-attacks',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-27',
        question: "Pourquoi devez-vous vérifier l'adresse de destination AVANT d'envoyer des Pi?",
        options: [
            "Pour être poli",
            "Car les transactions blockchain sont IRRÉVERSIBLES",
            "C'est optionnel",
            "Pi peut annuler les erreurs"
        ],
        correct: 1,
        explanation: "Une fois envoyés, les Pi ne peuvent PAS être récupérés. Vérifiez toujours 2 fois l'adresse.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'transaction-finality',
        trapType: 'false-security'
    },
    {
        id: 'q-safety-28',
        question: "Qu'est-ce qu'un 'hardware wallet'?",
        options: [
            "Un wallet sur papier",
            "Un appareil physique qui stocke vos clés hors ligne",
            "Un wallet mobile",
            "Un wallet en ligne"
        ],
        correct: 1,
        explanation: "Un hardware wallet (ex: Ledger) stocke vos clés hors ligne, offrant une sécurité maximale.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'wallet-types',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-29',
        question: "Que signifie 'cold storage'?",
        options: [
            "Stocker ses Pi dans un frigo",
            "Stocker ses clés hors ligne (papier, hardware wallet)",
            "Stocker dans le cloud",
            "Stocker sur mobile"
        ],
        correct: 1,
        explanation: "Cold storage = stockage hors ligne, à l'abri des hackers en ligne.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'storage-methods',
        trapType: 'literal-interpretation'
    },
    {
        id: 'q-safety-30',
        question: "Pourquoi ne devez-vous jamais entrer votre passphrase sur un ordinateur public?",
        options: [
            "C'est lent",
            "Des keyloggers peuvent enregistrer vos frappes",
            "C'est interdit",
            "Ça ne marche pas"
        ],
        correct: 1,
        explanation: "Les ordinateurs publics peuvent avoir des keyloggers qui enregistrent tout ce que vous tapez.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'public-device-risks',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-31',
        question: "Qu'est-ce qu'un 'rug pull' dans les cryptos?",
        options: [
            "Une mise à jour",
            "Quand les créateurs d'un projet volent tous les fonds et disparaissent",
            "Un bug",
            "Une fonctionnalité"
        ],
        correct: 1,
        explanation: "Un rug pull est une arnaque où les développeurs abandonnent le projet et volent l'argent des investisseurs.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'scam-types',
        trapType: 'slang-term'
    },
    {
        id: 'q-safety-32',
        question: "Comment reconnaître un faux wallet Pi?",
        options: [
            "Il a un joli design",
            "Il n'est PAS sur les stores officiels ou demande votre passphrase",
            "Il est gratuit",
            "Il a beaucoup de téléchargements"
        ],
        correct: 1,
        explanation: "Les faux wallets ne sont pas sur les stores officiels et peuvent demander votre passphrase (JAMAIS normal).",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'fake-apps',
        trapType: 'visual-deception'
    },
    {
        id: 'q-safety-33',
        question: "Qu'est-ce qu'un 'social engineering attack'?",
        options: [
            "Un réseau social",
            "Manipuler psychologiquement quelqu'un pour obtenir ses informations",
            "Un bug",
            "Une fonctionnalité Pi"
        ],
        correct: 1,
        explanation: "Le social engineering exploite la confiance humaine pour voler des informations (ex: se faire passer pour le support).",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'psychological-attacks',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-34',
        question: "Pourquoi devez-vous activer le verrouillage biométrique (empreinte/Face ID)?",
        options: [
            "C'est cool",
            "Ça empêche l'accès physique non autorisé à votre wallet",
            "C'est obligatoire",
            "Ça accélère l'app"
        ],
        correct: 1,
        explanation: "Le verrouillage biométrique protège votre wallet si quelqu'un vole votre téléphone.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'device-security',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-35',
        question: "Qu'est-ce qu'un 'honeypot' dans les smart contracts?",
        options: [
            "Un contrat qui donne du miel",
            "Un contrat piège qui laisse entrer des fonds mais ne les laisse pas sortir",
            "Un contrat rapide",
            "Un contrat officiel"
        ],
        correct: 1,
        explanation: "Un honeypot est un smart contract malveillant qui piège vos fonds de manière irréversible.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'smart-contract-traps',
        trapType: 'metaphor-confusion'
    },
    {
        id: 'q-safety-36',
        question: "Pourquoi ne devez-vous jamais partager votre écran lors d'un appel vidéo avec votre wallet ouvert?",
        options: [
            "C'est impoli",
            "Les autres peuvent voir vos clés privées ou votre solde",
            "Ça ralentit la connexion",
            "C'est interdit"
        ],
        correct: 1,
        explanation: "Partager votre écran peut exposer des informations sensibles (passphrase, solde, adresses).",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'screen-sharing-risks',
        trapType: 'social-pressure'
    },
    {
        id: 'q-safety-37',
        question: "Qu'est-ce qu'un 'SIM swap attack'?",
        options: [
            "Changer de carte SIM",
            "Un pirate transfère votre numéro vers sa SIM pour intercepter vos SMS 2FA",
            "Un bug téléphonique",
            "Une mise à jour"
        ],
        correct: 1,
        explanation: "Les pirates convainquent votre opérateur de transférer votre numéro pour voler vos codes 2FA par SMS.",
        difficulty: 'medium',
        cognitiveLevel: 'comprehension',
        topic: 'mobile-security',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-38',
        question: "Pourquoi devez-vous utiliser un gestionnaire de mots de passe?",
        options: [
            "C'est obligatoire",
            "Pour créer et stocker des mots de passe forts et uniques",
            "C'est gratuit",
            "Pour partager vos mots de passe"
        ],
        correct: 1,
        explanation: "Un gestionnaire de mots de passe (ex: Bitwarden, 1Password) génère et stocke des mots de passe uniques et forts.",
        difficulty: 'medium',
        cognitiveLevel: 'application',
        topic: 'password-management',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-39',
        question: "Qu'est-ce qu'un 'zero-day exploit'?",
        options: [
            "Un bug gratuit",
            "Une faille de sécurité inconnue des développeurs",
            "Une mise à jour",
            "Un bonus Pi"
        ],
        correct: 1,
        explanation: "Un zero-day est une vulnérabilité que les pirates exploitent avant que les développeurs ne la corrigent.",
        difficulty: 'medium',
        cognitiveLevel: 'knowledge',
        topic: 'security-vulnerabilities',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-40',
        question: "Pourquoi devez-vous vérifier les permissions d'une app avant de l'installer?",
        options: [
            "Pour gagner du temps",
            "Pour éviter que l'app accède à des données sensibles sans raison",
            "C'est optionnel",
            "Toutes les apps sont sûres"
        ],
        correct: 1,
        explanation: "Certaines apps malveillantes demandent des permissions excessives (caméra, contacts) pour voler vos données.",
        difficulty: 'medium',
        cognitiveLevel: 'analysis',
        topic: 'app-permissions',
        trapType: 'trust-assumption'
    },

    // DIFFICULTÉ: HARD (10 questions)
    {
        id: 'q-safety-41',
        question: "Comment fonctionne une attaque par 'typosquatting'?",
        options: [
            "En créant des fautes de frappe",
            "En enregistrant des domaines similaires (ex: minepii.com au lieu de minepi.com)",
            "En hackant le DNS",
            "En volant des mots de passe"
        ],
        correct: 1,
        explanation: "Les pirates enregistrent des domaines avec des fautes de frappe courantes pour piéger les utilisateurs distraits.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'domain-spoofing',
        trapType: 'visual-similarity'
    },
    {
        id: 'q-safety-42',
        question: "Qu'est-ce qu'une attaque par 'DNS poisoning'?",
        options: [
            "Un virus",
            "Rediriger un nom de domaine vers un faux site en corrompant le DNS",
            "Un bug réseau",
            "Une mise à jour"
        ],
        correct: 1,
        explanation: "Le DNS poisoning redirige minepi.com vers un faux site même si vous tapez la bonne URL.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'network-attacks',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-safety-43',
        question: "Pourquoi devez-vous utiliser un VPN sur un WiFi public?",
        options: [
            "Pour aller plus vite",
            "Pour chiffrer vos données et éviter l'interception",
            "C'est obligatoire",
            "Pour économiser la batterie"
        ],
        correct: 1,
        explanation: "Un VPN chiffre votre connexion, empêchant les pirates sur le même WiFi de voir vos données.",
        difficulty: 'hard',
        cognitiveLevel: 'application',
        topic: 'network-security',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-44',
        question: "Qu'est-ce qu'une 'rainbow table attack'?",
        options: [
            "Un virus coloré",
            "Une méthode pour casser des mots de passe en utilisant des tables pré-calculées",
            "Un bug graphique",
            "Une fonctionnalité"
        ],
        correct: 1,
        explanation: "Les rainbow tables sont des bases de données de hashes pré-calculés pour casser rapidement les mots de passe faibles.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'cryptography-attacks',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-45',
        question: "Pourquoi le 'salting' est-il important pour les mots de passe?",
        options: [
            "Pour le goût",
            "Pour rendre chaque hash unique même si le mot de passe est identique",
            "Pour accélérer le hashage",
            "C'est inutile"
        ],
        correct: 1,
        explanation: "Le salting ajoute des données aléatoires avant le hashage, rendant les rainbow tables inefficaces.",
        difficulty: 'hard',
        cognitiveLevel: 'analysis',
        topic: 'cryptography',
        trapType: 'metaphor-confusion'
    },
    {
        id: 'q-safety-46',
        question: "Qu'est-ce qu'une attaque par 'side-channel'?",
        options: [
            "Un virus",
            "Exploiter des informations indirectes (temps de calcul, consommation électrique)",
            "Un bug",
            "Une fonctionnalité"
        ],
        correct: 1,
        explanation: "Les attaques side-channel analysent des données physiques (temps, énergie) pour extraire des clés cryptographiques.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'advanced-attacks',
        trapType: 'technical-complexity'
    },
    {
        id: 'q-safety-47',
        question: "Pourquoi devez-vous vérifier le 'checksum' d'un fichier téléchargé?",
        options: [
            "Pour gagner du temps",
            "Pour vérifier que le fichier n'a pas été modifié/corrompu",
            "C'est optionnel",
            "Pour accélérer l'installation"
        ],
        correct: 1,
        explanation: "Le checksum (hash SHA256) garantit que le fichier téléchargé est authentique et non altéré.",
        difficulty: 'hard',
        cognitiveLevel: 'application',
        topic: 'file-integrity',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-48',
        question: "Qu'est-ce qu'une attaque par 'replay attack'?",
        options: [
            "Rejouer une vidéo",
            "Intercepter et renvoyer une transaction valide pour la dupliquer",
            "Un bug",
            "Une fonctionnalité"
        ],
        correct: 1,
        explanation: "Un pirate intercepte une transaction légitime et la renvoie pour tromper le système.",
        difficulty: 'hard',
        cognitiveLevel: 'comprehension',
        topic: 'transaction-security',
        trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-49',
        question: "Pourquoi devez-vous utiliser HTTPS Everywhere?",
        options: [
            "Pour aller plus vite",
            "Pour forcer le chiffrement SSL/TLS sur tous les sites",
            "C'est obligatoire",
            "Pour économiser la batterie"
        ],
        correct: 1,
        explanation: "HTTPS Everywhere force les sites à utiliser HTTPS, protégeant vos données contre l'interception.",
        difficulty: 'hard',
        cognitiveLevel: 'application',
        topic: 'browser-security',
        trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-50',
        question: "Qu'est-ce qu'un 'time-based one-time password' (TOTP)?",
        options: [
            "Un mot de passe temporaire",
            "Un code 2FA qui change toutes les 30 secondes",
            "Un mot de passe faible",
            "Un bug"
        ],
        correct: 1,
        explanation: "TOTP (ex: Google Authenticator) génère des codes 2FA qui expirent après 30 secondes, rendant l'interception inutile.",
        difficulty: 'hard',
        cognitiveLevel: 'knowledge',
        topic: '2fa-mechanisms',
        trapType: 'technical-jargon'
    }
];
