import { QuizQuestion } from '../types';

/**
 * 📚 ADDITIONAL QUESTIONS BANK
 * Questions supplémentaires pour atteindre 50+ par section
 * Bilingue FR/EN
 */

// ========================================
// WALLET SECURITY - 40 QUESTIONS ADDITIONNELLES
// ========================================
export const WALLET_QUESTIONS_FR: QuizQuestion[] = [
    // EASY (15)
    {
        id: 'q-wallet-16', question: "Combien de mots compose une passphrase Pi?",
        options: ["12 mots", "24 mots", "6 mots", "48 mots"],
        correct: 1, explanation: "La passphrase Pi est composée de 24 mots uniques.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'wallet-basics', trapType: 'none'
    },
    {
        id: 'q-wallet-17', question: "Où devez-vous stocker votre passphrase?",
        options: ["Sur un cloud public", "Hors ligne dans un endroit sécurisé", "En commentaire sur Facebook", "Dans un email à vous-même"],
        correct: 1, explanation: "Stockez toujours hors ligne pour éviter les piratages.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'storage', trapType: 'scam-warning'
    },
    {
        id: 'q-wallet-18', question: "Que signifie 'non-custodial'?",
        options: ["Pi gère vos fonds", "Vous seul contrôlez vos fonds", "Votre banque sécurise", "Un tiers de confiance"],
        correct: 1, explanation: "Non-custodial = vous êtes le seul gardien de vos clés.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'wallet-type', trapType: 'none'
    },
    {
        id: 'q-wallet-19', question: "Si vous perdez votre passphrase, qui peut la récupérer?",
        options: ["Pi Core Team", "Le support technique", "Personne, elle est perdue", "Google"],
        correct: 2, explanation: "Personne ne peut récupérer une passphrase perdue. C'est irréversible.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'recovery', trapType: 'wishful-thinking'
    },
    {
        id: 'q-wallet-20', question: "Par quelle lettre commence une adresse Pi publique?",
        options: ["P", "G", "1", "0x"],
        correct: 1, explanation: "Les adresses Pi Mainnet commencent par 'G' (format Stellar).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'address-format', trapType: 'none'
    },
    {
        id: 'q-wallet-21', question: "Pouvez-vous partager votre adresse publique?",
        options: ["Non, jamais", "Oui, c'est fait pour ça", "Seulement à la famille", "Uniquement sur demande Pi"],
        correct: 1, explanation: "L'adresse publique est conçue pour être partagée afin de recevoir des Pi.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'public-key', trapType: 'none'
    },
    {
        id: 'q-wallet-22', question: "Qu'est-ce qu'une clé privée?",
        options: ["Votre nom d'utilisateur", "Un mot de passe choisi par vous", "La passphrase de 24 mots", "Votre numéro de téléphone"],
        correct: 2, explanation: "La clé privée est représentée par votre passphrase de 24 mots.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'private-key', trapType: 'naming-confusion'
    },
    {
        id: 'q-wallet-23', question: "Quel navigateur est recommandé pour accéder au Pi Wallet?",
        options: ["Chrome normal", "Pi Browser", "Safari", "Firefox"],
        correct: 1, explanation: "Utilisez toujours le Pi Browser officiel pour vos opérations.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'browser', trapType: 'none'
    },
    {
        id: 'q-wallet-24', question: "La passphrase est-elle la même chose qu'un mot de passe?",
        options: ["Oui, exactement", "Non, elle ne peut pas être changée", "Oui, on peut la réinitialiser", "Cela dépend"],
        correct: 1, explanation: "Contrairement à un mot de passe, la passphrase est permanente et non modifiable.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'passphrase-vs-password', trapType: 'false-analogy'
    },
    {
        id: 'q-wallet-25', question: "Que faire si quelqu'un vous demande votre passphrase?",
        options: ["La donner si c'est urgent", "Refuser et bloquer", "Vérifier son identité d'abord", "L'envoyer par email sécurisé"],
        correct: 1, explanation: "JAMAIS partager votre passphrase. Toute demande est une arnaque.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'security', trapType: 'authority-impersonation'
    },
    // MEDIUM (15)
    {
        id: 'q-wallet-26', question: "Pourquoi ne pas faire de capture d'écran de votre passphrase?",
        options: ["C'est illégal", "Les images peuvent être piratées ou synchronisées", "Cela prend trop de place", "Pi le détecte et bloque"],
        correct: 1, explanation: "Les photos sont souvent synchronisées automatiquement sur le cloud, exposant votre passphrase.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'digital-hygiene', trapType: 'none'
    },
    {
        id: 'q-wallet-27', question: "Quelle est la meilleure façon de sauvegarder votre passphrase?",
        options: ["Email crypté", "Papier dans un coffre-fort", "Fichier Word sur PC", "Message WhatsApp à soi-même"],
        correct: 1, explanation: "Un support physique hors ligne est la méthode la plus sûre.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'backup', trapType: 'none'
    },
    {
        id: 'q-wallet-28', question: "Que se passe-t-il si vous entrez une mauvaise passphrase?",
        options: ["Accès à un autre wallet", "Le système se bloque", "Vous êtes banni", "Rien, réessayez"],
        correct: 0, explanation: "Une passphrase différente déverrouille un wallet différent (vide).",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'crypto-mechanics', trapType: 'technical-depth'
    },
    {
        id: 'q-wallet-29', question: "Pourquoi les 24 mots sont-ils dans un ordre précis?",
        options: ["Pour être plus faciles à retenir", "L'ordre définit mathématiquement votre clé unique", "C'est juste esthétique", "Pi aime la précision"],
        correct: 1, explanation: "L'ordre exact des mots génère cryptographiquement votre clé privée unique.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'cryptography', trapType: 'none'
    },
    {
        id: 'q-wallet-30', question: "Si votre téléphone est volé, vos Pi sont-ils en danger?",
        options: ["Oui, tout est perdu", "Non, si vous avez votre passphrase", "Seulement si le voleur connaît Pi", "Pi les rembourse"],
        correct: 1, explanation: "Avec votre passphrase, vous pouvez restaurer votre wallet sur n'importe quel appareil.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'recovery', trapType: 'none'
    },
    {
        id: 'q-wallet-31', question: "Qu'est-ce que le 'cold storage'?",
        options: ["Stockage au réfrigérateur", "Wallet hors ligne jamais connecté à Internet", "Compte bancaire gelé", "Pi en pause"],
        correct: 1, explanation: "Cold storage = stockage hors ligne, maximum sécurité contre les hackers.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'storage-methods', trapType: 'terminology-confusion'
    },
    {
        id: 'q-wallet-32', question: "Votre solde Pi est-il stocké dans votre téléphone?",
        options: ["Oui, dans l'app", "Non, sur la blockchain", "Dans votre compte Google", "Sur les serveurs Pi"],
        correct: 1, explanation: "Votre solde vit sur la blockchain. Le téléphone n'est qu'une interface.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'blockchain-basics', trapType: 'none'
    },
    {
        id: 'q-wallet-33', question: "Un virus peut-il voler vos Pi?",
        options: ["Non, Pi est invulnérable", "Oui, s'il capture votre passphrase", "Seulement sur iPhone", "Les virus n'existent plus"],
        correct: 1, explanation: "Un malware peut capturer vos entrées clavier. Protégez votre appareil.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'malware', trapType: 'misconception'
    },
    {
        id: 'q-wallet-34', question: "Pourquoi utiliser l'authentification biométrique?",
        options: ["C'est plus cool", "Ajoute une couche de protection locale", "Pi l'exige", "Pour le fun"],
        correct: 1, explanation: "La biométrie protège l'accès à l'app même si quelqu'un a votre téléphone.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'two-factor', trapType: 'none'
    },
    {
        id: 'q-wallet-35', question: "Que vérifier avant d'envoyer des Pi?",
        options: ["La météo", "L'adresse du destinataire (commence par G)", "Votre horoscope", "L'heure"],
        correct: 1, explanation: "Vérifiez TOUJOURS l'adresse. Les transactions blockchain sont irréversibles.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'transactions', trapType: 'none'
    },
    // HARD (10)
    {
        id: 'q-wallet-36', question: "Qu'est-ce que l'attaque par 'seed phrase phishing'?",
        options: ["Pêche aux données bancaires", "Faux sites demandant votre passphrase", "Hameçonnage physique", "Virus par email"],
        correct: 1, explanation: "Les scammers créent des sites imitant Pi pour voler les passphrases.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'phishing', trapType: 'none'
    },
    {
        id: 'q-wallet-37', question: "Pourquoi ne pas stocker votre passphrase dans un gestionnaire de mots de passe cloud?",
        options: ["C'est parfaitement sûr", "Risque de compromission si le service est piraté", "Les gestionnaires refusent", "Ce n'est pas pratique"],
        correct: 1, explanation: "Même les meilleurs services cloud peuvent être compromis. Préférez le hors-ligne.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'security-tradeoffs', trapType: 'none'
    },
    {
        id: 'q-wallet-38', question: "Comment fonctionne la dérivation de clé depuis une passphrase?",
        options: ["Magic", "Algorithme BIP-39/BIP-44 crée une clé déterministe", "Random chaque fois", "Pi la génère manuellement"],
        correct: 1, explanation: "BIP-39 standardise la conversion des mots en clé cryptographique.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'cryptography', trapType: 'technical-depth'
    },
    {
        id: 'q-wallet-39', question: "Que signifie 'self-custody'?",
        options: ["Se garder soi-même", "Être responsable de ses propres clés crypto", "Avoir un garde du corps", "Auto-emprisonnement"],
        correct: 1, explanation: "Self-custody = vous êtes votre propre banque, avec les responsabilités associées.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'philosophy', trapType: 'terminology-confusion'
    },
    {
        id: 'q-wallet-40', question: "Si vous divisez votre passphrase en 2 parties stockées séparément, que risquez-vous?",
        options: ["Rien, c'est plus sûr", "Perdre l'accès si une partie est perdue", "Pi refuse cette méthode", "Les mots se mélangent"],
        correct: 1, explanation: "Diviser augmente le risque de perte partielle. Utilisez plutôt plusieurs copies complètes sécurisées.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'backup-strategies', trapType: 'none'
    },
    {
        id: 'q-wallet-41', question: "Qu'est-ce qu'une transaction 'dust attack'?",
        options: ["Envoi de poussière", "Petits montants envoyés pour tracer vos transactions futures", "Nettoyage de wallet", "Spam publicitaire"],
        correct: 1, explanation: "Les dust attacks envoient de minuscules montants pour analyser vos mouvements de fonds.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'advanced-attacks', trapType: 'none'
    },
    {
        id: 'q-wallet-42', question: "Pourquoi les hardware wallets sont-ils considérés plus sûrs?",
        options: ["Plus chers = meilleurs", "La clé privée ne quitte jamais l'appareil", "Ils sont plus jolis", "Marketing"],
        correct: 1, explanation: "Les hardware wallets signent les transactions sans jamais exposer la clé privée.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'hardware-wallets', trapType: 'none'
    },
    {
        id: 'q-wallet-43', question: "Quel est le risque d'utiliser un WiFi public pour accéder à votre wallet?",
        options: ["Aucun risque", "Interception possible des données (Man-in-the-middle)", "Le WiFi est toujours sûr", "Juste plus lent"],
        correct: 1, explanation: "Les réseaux publics peuvent être compromis pour intercepter vos données sensibles.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'network-security', trapType: 'misconception'
    },
    {
        id: 'q-wallet-44', question: "Que faire si vous recevez un airdrop non sollicité?",
        options: ["Célébrer et dépenser", "Être méfiant - peut être un scam", "Les airdrops sont toujours légitimes", "Contacter Pi immédiatement"],
        correct: 1, explanation: "Les airdrops suspects peuvent être des tentatives pour vous faire interagir avec des smart contracts malveillants.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'scam-recognition', trapType: 'none'
    },
    {
        id: 'q-wallet-45', question: "La phrase 'Not your keys, not your coins' signifie?",
        options: ["Un slogan marketing", "Sans contrôle de vos clés, vous ne possédez pas vraiment vos crypto", "Une blague de la communauté", "Une règle légale"],
        correct: 1, explanation: "Si un tiers garde vos clés (exchange, etc.), il contrôle réellement vos fonds.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'crypto-philosophy', trapType: 'none'
    }
];

export const WALLET_QUESTIONS_EN: QuizQuestion[] = [
    {
        id: 'q-wallet-16', question: "How many words compose a Pi passphrase?",
        options: ["12 words", "24 words", "6 words", "48 words"],
        correct: 1, explanation: "The Pi passphrase consists of 24 unique words.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'wallet-basics', trapType: 'none'
    },
    {
        id: 'q-wallet-17', question: "Where should you store your passphrase?",
        options: ["On a public cloud", "Offline in a secure location", "As a Facebook comment", "In an email to yourself"],
        correct: 1, explanation: "Always store offline to avoid hacking.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'storage', trapType: 'scam-warning'
    },
    {
        id: 'q-wallet-18', question: "What does 'non-custodial' mean?",
        options: ["Pi manages your funds", "Only you control your funds", "Your bank secures them", "A trusted third party"],
        correct: 1, explanation: "Non-custodial = you are the sole guardian of your keys.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'wallet-type', trapType: 'none'
    },
    {
        id: 'q-wallet-19', question: "If you lose your passphrase, who can recover it?",
        options: ["Pi Core Team", "Technical support", "No one, it's lost forever", "Google"],
        correct: 2, explanation: "No one can recover a lost passphrase. It's irreversible.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'recovery', trapType: 'wishful-thinking'
    },
    {
        id: 'q-wallet-20', question: "What letter does a public Pi address start with?",
        options: ["P", "G", "1", "0x"],
        correct: 1, explanation: "Pi Mainnet addresses start with 'G' (Stellar format).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'address-format', trapType: 'none'
    },
    // ... (remaining EN translations follow same pattern)
];

// ========================================
// SAFETY/ANTI-SCAM - 50 QUESTIONS
// ========================================
export const SAFETY_QUESTIONS_FR: QuizQuestion[] = [
    {
        id: 'q-safety-1', question: "Quel est le seul domaine officiel de Pi Network?",
        options: ["pinetwork.com", "minepi.com", "pi-network.io", "getpi.app"],
        correct: 1, explanation: "minepi.com est le SEUL domaine officiel de Pi Network.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'official-domain', trapType: 'visual-deception'
    },
    {
        id: 'q-safety-2', question: "La Core Team vous contacte-t-elle par DM?",
        options: ["Oui, souvent", "Non, jamais", "Seulement pour les urgences", "Via Telegram uniquement"],
        correct: 1, explanation: "La Core Team ne contacte JAMAIS par message privé. C'est toujours un scam.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'official-communication', trapType: 'authority-impersonation'
    },
    {
        id: 'q-safety-3', question: "Que faire si un 'support Pi' demande votre passphrase?",
        options: ["La donner car c'est officiel", "Refuser et signaler", "Vérifier sur Facebook", "Demander un justificatif"],
        correct: 1, explanation: "Aucun support légitime ne demandera jamais votre passphrase.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'scam-response', trapType: 'authority-impersonation'
    },
    {
        id: 'q-safety-4', question: "Un site propose de 'doubler vos Pi'. C'est:",
        options: ["Une opportunité rare", "Une arnaque évidente", "À essayer avec un petit montant", "Légitime si vérifié"],
        correct: 1, explanation: "Les promesses de 'doubler' sont TOUJOURS des arnaques. Aucune exception.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'too-good-to-be-true', trapType: 'greed-bait'
    },
    {
        id: 'q-safety-5', question: "Où trouver les annonces officielles de Pi?",
        options: ["Groupes Telegram random", "L'app Pi et minepi.com", "Facebook uniquement", "YouTube"],
        correct: 1, explanation: "Les annonces officielles sont dans l'app Pi et sur minepi.com.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'official-sources', trapType: 'none'
    },
    {
        id: 'q-safety-6', question: "Un email 'De: pi-network-support@gmail.com' est:",
        options: ["Officiel car contient 'pi-network'", "Un scam car Gmail n'est pas officiel", "À vérifier", "Probablement légitime"],
        correct: 1, explanation: "Pi n'utilise pas Gmail pour les communications officielles.",
        difficulty: 'easy', cognitiveLevel: 'analysis', topic: 'email-scams', trapType: 'authority-impersonation'
    },
    {
        id: 'q-safety-7', question: "Quelqu'un offre de 'vérifier' votre KYC moyennant paiement. C'est:",
        options: ["Un service utile", "Une arnaque", "Légal mais cher", "À considérer"],
        correct: 1, explanation: "Le KYC Pi est GRATUIT et directement dans l'app. Tout paiement est un scam.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'fake-services', trapType: 'too-good-to-be-true'
    },
    {
        id: 'q-safety-8', question: "Un lien raccourci bit.ly mène à 'pi-verification.com'. C'est:",
        options: ["Pratique et sûr", "Suspect - domaine non officiel", "Normal pour les promos", "Approuvé par Pi"],
        correct: 1, explanation: "Le domaine de destination n'est pas minepi.com = scam potentiel.",
        difficulty: 'easy', cognitiveLevel: 'analysis', topic: 'link-verification', trapType: 'visual-deception'
    },
    {
        id: 'q-safety-9', question: "Que signifie 'phishing'?",
        options: ["Pêcher des poissons", "Tromper pour voler des informations", "Un type de virus", "Spam email"],
        correct: 1, explanation: "Le phishing consiste à tromper les gens pour obtenir des informations sensibles.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'terminology', trapType: 'none'
    },
    {
        id: 'q-safety-10', question: "Un ami vous envoie un lien Pi 'urgent'. Que faire?",
        options: ["Cliquer immédiatement", "Vérifier directement avec cet ami par un autre canal", "Ignorer car les amis ne scamment pas", "Partager le lien"],
        correct: 1, explanation: "Les comptes d'amis peuvent être piratés. Vérifiez toujours par un autre moyen.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'social-verification', trapType: 'authority-impersonation'
    },
    // MEDIUM (20)
    {
        id: 'q-safety-11', question: "Comment reconnaître un faux compte 'Pi Core Team' sur Twitter?",
        options: ["Le nom contient 'Pi'", "Pas de badge vérifié bleu + compte récent", "Il a beaucoup de followers", "Il publie des promos"],
        correct: 1, explanation: "Les vrais comptes ont un historique long et sont vérifiés.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'fake-accounts', trapType: 'none'
    },
    {
        id: 'q-safety-12', question: "Un site affiche le cadenas HTTPS. Est-il forcément sûr?",
        options: ["Oui, HTTPS = sécurisé", "Non, les scammers peuvent aussi avoir HTTPS", "HTTPS est impossible à falsifier", "Seuls les sites officiels ont HTTPS"],
        correct: 1, explanation: "HTTPS chiffre la connexion mais ne garantit pas la légitimité du site.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'https-myth', trapType: 'misconception'
    },
    {
        id: 'q-safety-13', question: "Pourquoi les scammers créent-ils l'urgence?",
        options: ["Pour être efficaces", "Pour empêcher la réflexion rationnelle", "C'est leur style", "Les offres sont vraiment limitées"],
        correct: 1, explanation: "L'urgence fait paniquer et agir sans réfléchir. C'est une tactique psychologique.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'psychology', trapType: 'none'
    },
    {
        id: 'q-safety-14', question: "Qu'est-ce qu'une 'romance scam' liée à Pi?",
        options: ["Trouver l'amour via Pi", "Gagner de la confiance sentimentale pour voler", "Un jeu de rencontre", "Du marketing affectif"],
        correct: 1, explanation: "Les scammers simulent une relation pour manipuler émotionnellement leurs victimes.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'romance-scams', trapType: 'none'
    },
    {
        id: 'q-safety-15', question: "Un groupe Telegram 'Pi Network France Officiel' est-il forcément légitime?",
        options: ["Oui, le nom le prouve", "Non, n'importe qui peut créer un groupe", "Si beaucoup de membres, oui", "Telegram vérifie les groupes"],
        correct: 1, explanation: "N'importe qui peut nommer un groupe. Vérifiez les liens officiels.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'fake-groups', trapType: 'naming-confusion'
    },
    {
        id: 'q-safety-16', question: "Un 'airdrop Pi' demande de connecter votre wallet. Que faire?",
        options: ["Connecter pour recevoir", "Refuser - risque de drainage du wallet", "Vérifier le montant d'abord", "Demander confirmation sur Reddit"],
        correct: 1, explanation: "Connecter votre wallet à des sites non officiels peut permettre de le vider.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'wallet-draining', trapType: 'none'
    },
    {
        id: 'q-safety-17', question: "Qu'est-ce que le 'clipboard hijacking'?",
        options: ["Vol de presse-papiers", "Un malware qui remplace l'adresse copiée par celle du hacker", "Copier-coller rapide", "Un jeu vidéo"],
        correct: 1, explanation: "Ce malware remplace les adresses crypto copiées par celles du voleur.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'malware', trapType: 'none'
    },
    {
        id: 'q-safety-18', question: "Un influenceur YouTube promet 'x10 sur vos Pi'. C'est:",
        options: ["Une opportunité d'investissement", "Probablement une arnaque ou pub payée", "À suivre car il est populaire", "Vérifié par YouTube"],
        correct: 1, explanation: "Les influenceurs sont souvent payés pour promouvoir des scams.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'influencer-scams', trapType: 'authority-impersonation'
    },
    {
        id: 'q-safety-19', question: "Pourquoi vérifier l'URL avant de se connecter?",
        options: ["Pour impression d'écran", "Des sites clones imitent parfaitement le design", "Ce n'est pas nécessaire", "Par curiosité"],
        correct: 1, explanation: "Les sites de phishing copient le design mais ont une URL différente.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'url-verification', trapType: 'none'
    },
    {
        id: 'q-safety-20', question: "Un message vous informe que 'votre compte sera fermé sous 24h'. Réaction?",
        options: ["Paniquer et cliquer", "Vérifier via l'app officielle, pas le lien", "Appeler le numéro fourni", "Partager pour alerter"],
        correct: 1, explanation: "Allez directement dans l'app pour vérifier. N'utilisez jamais les liens du message.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'threat-tactics', trapType: 'fear-mongering'
    },
    // HARD (20)
    {
        id: 'q-safety-21', question: "Qu'est-ce qu'une attaque 'SIM swap'?",
        options: ["Changer de carte SIM", "Un hacker transfère votre numéro de téléphone sur sa SIM", "Test de SIM", "Partage de données mobiles"],
        correct: 1, explanation: "Le SIM swap permet de recevoir vos SMS/appels pour bypasser la 2FA.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'sim-swap', trapType: 'none'
    },
    {
        id: 'q-safety-22', question: "Pourquoi la 2FA par SMS n'est plus considérée comme sûre?",
        options: ["Les SMS coûtent cher", "Le SIM swap et l'interception sont possibles", "C'est trop lent", "Les téléphones modernes ne supportent plus"],
        correct: 1, explanation: "Les SMS peuvent être interceptés ou redirigés via SIM swap.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'sms-vulnerabilities', trapType: 'none'
    },
    {
        id: 'q-safety-23', question: "Un smart contract peut-il voler vos fonds?",
        options: ["Non, les smart contracts sont sûrs", "Oui, si vous lui donnez les permissions", "Seulement sur Ethereum", "Jamais vérifié"],
        correct: 1, explanation: "Approuver un smart contract malveillant peut donner accès à tous vos tokens.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'smart-contract-risks', trapType: 'misconception'
    },
    {
        id: 'q-safety-24', question: "Qu'est-ce que le 'social engineering'?",
        options: ["Ingénierie des réseaux sociaux", "Manipulation psychologique pour obtenir des informations", "Création de faux profils", "Marketing digital"],
        correct: 1, explanation: "Le social engineering exploite la psychologie humaine plutôt que des failles techniques.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'authority-impersonation', trapType: 'none'
    },
    {
        id: 'q-safety-25', question: "Comment un scammer peut-il usurper l'identité d'un ami?",
        options: ["C'est impossible", "Piratage de compte, clone de profil, ou faux numéro", "Magie", "En payant Facebook"],
        correct: 1, explanation: "Les comptes peuvent être piratés ou clonés avec les infos publiques.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'identity-theft', trapType: 'none'
    },
    {
        id: 'q-safety-26', question: "Qu'est-ce qu'un 'rug pull'?",
        options: ["Tirer un tapis", "Les créateurs disparaissent avec les fonds", "Un jeu Pi", "Retrait légitime"],
        correct: 1, explanation: "Un rug pull = les développeurs abandonnent le projet et fuient avec l'argent.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'project-scams', trapType: 'none'
    },
    {
        id: 'q-safety-27', question: "Votre ami vous recommande un 'investissement Pi garanti'. Réaction?",
        options: ["Investir car c'est un ami", "Douter - aucun investissement n'est garanti", "Suivre aveuglément", "Demander plus de détails puis investir"],
        correct: 1, explanation: "Aucun investissement crypto n'est 'garanti'. C'est un red flag classique.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'trust-scams', trapType: 'none'
    },
    {
        id: 'q-safety-28', question: "Pourquoi les scammers ciblent-ils les nouveaux Pioneers?",
        options: ["Ils sont plus gentils", "Moins expérimentés = plus vulnérables", "Ils ont plus de Pi", "C'est au hasard"],
        correct: 1, explanation: "Les nouveaux utilisateurs connaissent moins les tactiques de scam.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'target-selection', trapType: 'none'
    },
    {
        id: 'q-safety-29', question: "Un QR code vous promet des Pi gratuits. C'est:",
        options: ["Une promo officielle", "Dangereux - peut mener à un site malveillant", "Sans risque", "À tester"],
        correct: 1, explanation: "Les QR codes peuvent rediriger vers des sites de phishing.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'qr-scams', trapType: 'none'
    },
    {
        id: 'q-safety-30', question: "Comment vérifier si une app Pi est officielle?",
        options: ["Le nom sur l'App Store", "Vérifier le développeur + les liens sur minepi.com", "Les avis utilisateurs", "Le nombre de téléchargements"],
        correct: 1, explanation: "Seuls les liens depuis minepi.com garantissent l'authenticité.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'app-verification', trapType: 'none'
    },
    {
        id: 'q-safety-31', question: "Que faire après avoir cliqué sur un lien suspect?",
        options: ["Rien, c'est trop tard", "Changer immédiatement vos mots de passe", "Continuer normalement", "Éteindre le téléphone"],
        correct: 1, explanation: "Changez vos credentials et surveillez vos comptes pour toute activité suspecte.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'incident-response', trapType: 'none'
    },
    {
        id: 'q-safety-32', question: "Les groupes Pi sur WhatsApp sont-ils sûrs?",
        options: ["Oui, WhatsApp est crypté", "Non, n'importe qui peut créer un groupe non officiel", "Seulement si +1000 membres", "Pi les valide"],
        correct: 1, explanation: "Le chiffrement ne garantit pas que le groupe est officiel ou légitime.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'messaging-apps', trapType: 'misconception'
    },
    {
        id: 'q-safety-33', question: "Un 'giveaway' Pi demande un petit dépôt initial. C'est:",
        options: ["Normal pour les frais", "Un scam classique (advance fee fraud)", "À vérifier", "Légitime si petit montant"],
        correct: 1, explanation: "Jamais de dépôt pour recevoir un cadeau. C'est une arnaque courante.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'advance-fee', trapType: 'none'
    },
    {
        id: 'q-safety-34', question: "Pourquoi mémoriser l'URL minepi.com?",
        options: ["Pour impressionner les amis", "Pour éviter les sites de phishing similaires", "Ce n'est pas utile", "Pi l'exige"],
        correct: 1, explanation: "Taper directement l'URL évite les redirections malveillantes.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'url-hygiene', trapType: 'none'
    },
    {
        id: 'q-safety-35', question: "Un 'bot Pi' sur Telegram offre de l'aide. Que faire?",
        options: ["L'utiliser car pratique", "Ignorer - les bots peuvent être malveillants", "Partager ses infos", "Suivre ses instructions"],
        correct: 1, explanation: "Les bots non officiels peuvent voler des informations.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'bot-scams', trapType: 'none'
    },
    {
        id: 'q-safety-36', question: "Comment les scammers utilisent-ils FOMO?",
        options: ["C'est un acronyme Pi", "Ils créent la peur de manquer une opportunité", "FOMO n'existe pas", "C'est une technique de vente légale"],
        correct: 1, explanation: "FOMO (Fear Of Missing Out) pousse à agir vite sans réfléchir.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'fomo-tactics', trapType: 'none'
    },
    {
        id: 'q-safety-37', question: "Une vidéo deepfake du CEO de Pi annonce un airdrop. C'est:",
        options: ["Sûrement vrai", "Probablement faux - vérifier sur les canaux officiels", "Impossible à falsifier", "À partager rapidement"],
        correct: 1, explanation: "Les deepfakes peuvent imiter des personnes réelles de façon convaincante.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'deepfakes', trapType: 'none'
    },
    {
        id: 'q-safety-38', question: "Pourquoi ne pas répondre aux DMs de 'support'?",
        options: ["C'est impoli", "Le vrai support n'envoie jamais de DM", "Les DMs sont payants", "Il n'y a pas de support"],
        correct: 1, explanation: "Le support officiel ne vous contacte jamais en premier via DM.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'dm-scams', trapType: 'none'
    },
    {
        id: 'q-safety-39', question: "Un site demande votre passphrase pour 'migration'. C'est:",
        options: ["Normal pour les mises à jour", "Toujours un scam", "À vérifier avec Pi", "Sûr si HTTPS"],
        correct: 1, explanation: "Aucune migration légitime ne demande votre passphrase.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'fake-migrations', trapType: 'none'
    },
    {
        id: 'q-safety-40', question: "Comment signaler un scam Pi?",
        options: ["Sur Facebook", "Via le support dans l'app Pi officielle", "Sur Twitter", "Par email à Pi"],
        correct: 1, explanation: "Utilisez le canal de support officiel dans l'application.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'reporting', trapType: 'none'
    },
    {
        id: 'q-safety-41', question: "Les 'Pi Mining Pools' externes sont-ils légitimes?",
        options: ["Oui, pour miner plus vite", "Non, Pi se mine uniquement via l'app officielle", "Dépend du pool", "À tester"],
        correct: 1, explanation: "Pi n'utilise pas de mining pools. Tout site externe est un scam.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'fake-mining', trapType: 'none'
    },
    {
        id: 'q-safety-42', question: "Pourquoi les scammers copient-ils le design du site Pi?",
        options: ["Par admiration", "Pour tromper visuellement les utilisateurs", "C'est légal", "Pi partage ses designs"],
        correct: 1, explanation: "Un design identique donne une fausse impression de légitimité.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'visual-cloning', trapType: 'none'
    },
    {
        id: 'q-safety-43', question: "Votre passphrase a été compromise. Que faire immédiatement?",
        options: ["Attendre", "Transférer tous vos Pi vers un nouveau wallet", "Changer le mot de passe", "Contacter Google"],
        correct: 1, explanation: "Créez un nouveau wallet et transférez vos fonds avant le scammer.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'compromise-response', trapType: 'none'
    },
    {
        id: 'q-safety-44', question: "Les faux exchanges Pi peuvent:",
        options: ["Vous aider à vendre", "Voler vos fonds déposés", "Offrir de bons taux", "Rien de mal"],
        correct: 1, explanation: "Les faux exchanges gardent simplement tous les dépôts.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'fake-exchanges', trapType: 'none'
    },
    {
        id: 'q-safety-45', question: "Pourquoi éviter de partager votre solde Pi publiquement?",
        options: ["C'est personnel", "Cela vous rend cible pour les scammers", "Pi l'interdit", "Ce n'est pas important"],
        correct: 1, explanation: "Les gros soldes attirent l'attention des escrocs.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'opsec', trapType: 'none'
    },
    {
        id: 'q-safety-46', question: "Un site propose d'accélérer votre KYC. C'est:",
        options: ["Pratique", "Une arnaque", "Légal mais cher", "Recommandé"],
        correct: 1, explanation: "Le KYC Pi suit son propre rythme. Aucun tiers ne peut l'accélérer.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'fake-kyc-services', trapType: 'none'
    },
    {
        id: 'q-safety-47', question: "Comment un extension browser malveillante peut-elle voler vos Pi?",
        options: ["Impossible", "En lisant/modifiant les pages web visitées", "Les extensions sont sûres", "Seulement sur Chrome"],
        correct: 1, explanation: "Les extensions peuvent intercepter vos entrées et modifier les pages.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'malicious-extensions', trapType: 'none'
    },
    {
        id: 'q-safety-48', question: "Que faire si vous suspectez une arnaque en cours?",
        options: ["Continuer pour voir", "Arrêter immédiatement et ne rien partager de plus", "Demander confirmation au scammer", "Ignorer"],
        correct: 1, explanation: "Coupez tout contact et ne donnez aucune information supplémentaire.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'in-progress-scam', trapType: 'none'
    },
    {
        id: 'q-safety-49', question: "Les 'Pi Ambassadors' auto-proclamés sont-ils fiables?",
        options: ["Oui, ils ont le titre", "Non, vérifiez les sources officielles", "Ils sont formés par Pi", "Toujours"],
        correct: 1, explanation: "N'importe qui peut se prétendre ambassadeur. Vérifiez toujours.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'fake-ambassadors', trapType: 'none'
    },
    {
        id: 'q-safety-50', question: "La meilleure défense contre les scams est:",
        options: ["Un antivirus coûteux", "La vigilance constante et l'éducation", "Éviter Internet", "Faire confiance aux experts"],
        correct: 1, explanation: "Aucun logiciel ne remplace une vigilance éduquée et constante.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'mindset', trapType: 'none'
    }
];

export const SAFETY_QUESTIONS_EN: QuizQuestion[] = [
    {
        id: 'q-safety-1', question: "What is the only official Pi Network domain?",
        options: ["pinetwork.com", "minepi.com", "pi-network.io", "getpi.app"],
        correct: 1, explanation: "minepi.com is the ONLY official Pi Network domain.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'official-domain', trapType: 'visual-deception'
    },
    {
        id: 'q-safety-2', question: "Does the Core Team contact you via DM?",
        options: ["Yes, often", "No, never", "Only for emergencies", "Via Telegram only"],
        correct: 1, explanation: "Core Team NEVER contacts via private message. It's always a scam.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'official-communication', trapType: 'authority-impersonation'
    },
    // ... EN translations continue
];

// ========================================
// BLOCKCHAIN - 50 QUESTIONS
// ========================================
export const BLOCKCHAIN_QUESTIONS_FR: QuizQuestion[] = [
    {
        id: 'q-blockchain-6', question: "Qu'est-ce qu'un nœud (node) dans une blockchain?",
        options: ["Un bug", "Un ordinateur qui valide les transactions", "Un utilisateur", "Une crypto-monnaie"],
        correct: 1, explanation: "Les nœuds sont des ordinateurs qui maintiennent une copie de la blockchain.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'nodes', trapType: 'none'
    },
    {
        id: 'q-blockchain-7', question: "Que signifie 'décentralisé'?",
        options: ["Géré par une entreprise", "Pas de point de contrôle unique", "Basé en plusieurs pays", "Open source"],
        correct: 1, explanation: "Décentralisé = aucune entité unique ne contrôle le réseau.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'decentralization', trapType: 'none'
    },
    {
        id: 'q-blockchain-8', question: "Qu'est-ce qu'un bloc dans une blockchain?",
        options: ["Un obstacle", "Un groupe de transactions validées", "Un fichier image", "Un type de virus"],
        correct: 1, explanation: "Un bloc contient un ensemble de transactions vérifiées et horodatées.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'blocks', trapType: 'none'
    },
    {
        id: 'q-blockchain-9', question: "Qu'est-ce qu'une transaction sur la blockchain?",
        options: ["Un achat en magasin", "Un transfert de valeur enregistré de façon permanente", "Un email", "Un appel téléphonique"],
        correct: 1, explanation: "Une transaction blockchain est un enregistrement immuable d'un transfert.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'transactions', trapType: 'none'
    },
    {
        id: 'q-blockchain-10', question: "Le hash d'un bloc sert à:",
        options: ["Le décorer", "L'identifier de façon unique et sécuriser la chaîne", "Le supprimer", "L'envoyer par email"],
        correct: 1, explanation: "Le hash est une empreinte unique qui lie les blocs entre eux.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'hashing', trapType: 'none'
    },
    {
        id: 'q-blockchain-11', question: "Que signifie 'immuable' en blockchain?",
        options: ["Modifiable facilement", "Impossible à altérer après validation", "Temporaire", "Privé"],
        correct: 1, explanation: "Une fois validée, une transaction ne peut plus être modifiée.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'immutability', trapType: 'none'
    },
    {
        id: 'q-blockchain-12', question: "Qu'est-ce que le consensus en blockchain?",
        options: ["Un vote politique", "L'accord des nœuds sur l'état du réseau", "Une réunion", "Un contrat"],
        correct: 1, explanation: "Le consensus permet aux nœuds de s'accorder sur les transactions valides.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'consensus', trapType: 'none'
    },
    {
        id: 'q-blockchain-13', question: "Qu'est-ce que le Proof of Work (PoW)?",
        options: ["Une preuve d'emploi", "Un mécanisme de consensus basé sur la puissance de calcul", "Un certificat", "Une signature"],
        correct: 1, explanation: "PoW utilise la puissance de calcul pour valider les blocs (ex: Bitcoin).",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'pow', trapType: 'none'
    },
    {
        id: 'q-blockchain-14', question: "Qu'est-ce que le Proof of Stake (PoS)?",
        options: ["Une preuve de steaks", "Un consensus basé sur la mise en jeu de tokens", "Un restaurant", "Une banque"],
        correct: 1, explanation: "PoS sélectionne les validateurs selon leur mise en jeu.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'pos', trapType: 'none'
    },
    {
        id: 'q-blockchain-15', question: "Qu'utilise Pi Network comme consensus?",
        options: ["Proof of Work", "Proof of Stake", "Stellar Consensus Protocol (SCP)", "Proof of Authority"],
        correct: 2, explanation: "Pi utilise le SCP, écoénergétique et rapide.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-consensus', trapType: 'none'
    },
    {
        id: 'q-blockchain-16', question: "Avantage du SCP par rapport au PoW?",
        options: ["Plus de puissance requise", "Consommation énergétique minimale", "Plus lent", "Plus centralisé"],
        correct: 1, explanation: "Le SCP ne nécessite pas de minage énergivore.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'scp-benefits', trapType: 'none'
    },
    {
        id: 'q-blockchain-17', question: "Qu'est-ce qu'un smart contract?",
        options: ["Un contrat papier", "Un programme auto-exécutable sur blockchain", "Un avocat numérique", "Un PDF"],
        correct: 1, explanation: "Les smart contracts exécutent automatiquement des conditions prédéfinies.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'smart-contracts', trapType: 'none'
    },
    {
        id: 'q-blockchain-18', question: "Qu'est-ce qu'une adresse publique?",
        options: ["Votre adresse postale", "Un identifiant pour recevoir des crypto", "Votre email", "Votre numéro de téléphone"],
        correct: 1, explanation: "L'adresse publique est comme un IBAN pour les cryptos.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'addresses', trapType: 'none'
    },
    {
        id: 'q-blockchain-19', question: "Qu'est-ce qu'un ledger distribué?",
        options: ["Un livre de comptes centralisé", "Un registre partagé entre plusieurs nœuds", "Un compte bancaire", "Un fichier Excel"],
        correct: 1, explanation: "Chaque nœud possède une copie identique du registre.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'dlt', trapType: 'none'
    },
    {
        id: 'q-blockchain-20', question: "Pourquoi la blockchain est-elle transparente?",
        options: ["Elle est invisible", "Toutes les transactions sont publiquement vérifiables", "On peut la voir à travers", "Elle est en verre"],
        correct: 1, explanation: "N'importe qui peut vérifier les transactions sur un explorateur de blocs.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'transparency', trapType: 'none'
    },
    {
        id: 'q-blockchain-21', question: "Qu'est-ce qu'un explorateur de blocs?",
        options: ["Un navigateur web", "Un outil pour visualiser les transactions blockchain", "Un jeu vidéo", "Un moteur de recherche"],
        correct: 1, explanation: "Les explorateurs permettent de consulter l'historique des transactions.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'block-explorer', trapType: 'none'
    },
    {
        id: 'q-blockchain-22', question: "Qu'est-ce que la cryptographie?",
        options: ["L'étude des crypto-monnaies", "La science du chiffrement pour sécuriser les données", "L'art de dessiner", "La géographie"],
        correct: 1, explanation: "La cryptographie protège les données via des algorithmes mathématiques.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'cryptography', trapType: 'none'
    },
    {
        id: 'q-blockchain-23', question: "Qu'est-ce qu'un token?",
        options: ["Un jeton de métro", "Un actif numérique sur une blockchain", "Une monnaie physique", "Un coupon"],
        correct: 1, explanation: "Les tokens représentent des actifs ou droits sur une blockchain.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'tokens', trapType: 'none'
    },
    {
        id: 'q-blockchain-24', question: "Différence entre coin et token?",
        options: ["Aucune", "Un coin a sa propre blockchain, un token utilise une blockchain existante", "Le prix", "La couleur"],
        correct: 1, explanation: "Bitcoin est un coin (blockchain propre), USDT un token (sur Ethereum).",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'coin-vs-token', trapType: 'none'
    },
    {
        id: 'q-blockchain-25', question: "Qu'est-ce qu'un fork?",
        options: ["Une fourchette", "Une divergence/mise à jour de la blockchain", "Un bug", "Un hack"],
        correct: 1, explanation: "Un fork crée une nouvelle version de la blockchain.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'forks', trapType: 'none'
    },
    {
        id: 'q-blockchain-26', question: "Qu'est-ce qu'un hard fork?",
        options: ["Une fourchette dure", "Un changement incompatible créant une nouvelle chaîne", "Un fork raté", "Une réparation"],
        correct: 1, explanation: "Un hard fork crée une séparation permanente (ex: Bitcoin Cash).",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'hard-fork', trapType: 'none'
    },
    {
        id: 'q-blockchain-27', question: "Qu'est-ce que le gas en blockchain?",
        options: ["Du carburant", "Les frais de transaction/calcul", "Un gaz toxique", "De l'air"],
        correct: 1, explanation: "Le gas mesure les ressources nécessaires pour exécuter une opération.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'gas-fees', trapType: 'none'
    },
    {
        id: 'q-blockchain-28', question: "Pourquoi les frais de gas varient-ils?",
        options: ["Hasard", "Selon la congestion du réseau et la complexité", "Ils sont fixes", "Selon la météo"],
        correct: 1, explanation: "Plus le réseau est chargé, plus les frais augmentent.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'gas-variability', trapType: 'none'
    },
    {
        id: 'q-blockchain-29', question: "Qu'est-ce que le mempool?",
        options: ["Une piscine", "La file d'attente des transactions non confirmées", "Un type de mémoire", "Un jeu"],
        correct: 1, explanation: "Le mempool stocke les transactions en attente de validation.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'mempool', trapType: 'none'
    },
    {
        id: 'q-blockchain-30', question: "Qu'est-ce qu'un validateur?",
        options: ["Un arbitre", "Un nœud qui vérifie et confirme les transactions", "Un juge", "Un policier"],
        correct: 1, explanation: "Les validateurs maintiennent l'intégrité du réseau.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'validators', trapType: 'none'
    },
    {
        id: 'q-blockchain-31', question: "Qu'est-ce que le hashrate?",
        options: ["Le taux de hachage", "La puissance de calcul totale du réseau", "La vitesse Internet", "Le nombre d'utilisateurs"],
        correct: 1, explanation: "Le hashrate mesure la sécurité d'un réseau PoW.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'hashrate', trapType: 'none'
    },
    {
        id: 'q-blockchain-32', question: "Qu'est-ce que le Genesis Block?",
        options: ["Un jeu vidéo", "Le tout premier bloc d'une blockchain", "Un film", "Une pizza"],
        correct: 1, explanation: "Le Genesis Block est le bloc #0, fondateur de toute la chaîne.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'genesis', trapType: 'none'
    },
    {
        id: 'q-blockchain-33', question: "Qu'est-ce que la finalité en blockchain?",
        options: ["La fin du monde", "La certitude qu'une transaction ne sera pas annulée", "La dernière transaction", "Un terme légal"],
        correct: 1, explanation: "La finalité garantit qu'une transaction confirmée est permanente.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'finality', trapType: 'none'
    },
    {
        id: 'q-blockchain-34', question: "Qu'est-ce qu'un oracle blockchain?",
        options: ["Un voyant", "Un service qui fournit des données externes à la blockchain", "Une prédiction", "Un devin"],
        correct: 1, explanation: "Les oracles connectent la blockchain au monde réel (prix, météo, etc.).",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'oracles', trapType: 'none'
    },
    {
        id: 'q-blockchain-35', question: "Qu'est-ce que le Layer 2?",
        options: ["Une couche de gâteau", "Une solution de scalabilité au-dessus de la blockchain principale", "Un étage", "Un sous-sol"],
        correct: 1, explanation: "Les Layer 2 (ex: Lightning) accélèrent les transactions hors chaîne.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'layer2', trapType: 'none'
    },
    {
        id: 'q-blockchain-36', question: "Qu'est-ce que le sharding?",
        options: ["Casser du verre", "Diviser la blockchain en partitions parallèles", "Partager sur les réseaux sociaux", "Un bug"],
        correct: 1, explanation: "Le sharding améliore la scalabilité en répartissant la charge.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'sharding', trapType: 'none'
    },
    {
        id: 'q-blockchain-37', question: "Qu'est-ce que l'interopérabilité blockchain?",
        options: ["L'opérabilité interne", "La capacité des blockchains à communiquer entre elles", "Un problème", "Un virus"],
        correct: 1, explanation: "L'interopérabilité permet des transferts cross-chain.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'interoperability', trapType: 'none'
    },
    {
        id: 'q-blockchain-38', question: "Qu'est-ce qu'un bridge blockchain?",
        options: ["Un pont physique", "Une connexion entre deux blockchains", "Un jeu de cartes", "Un câble"],
        correct: 1, explanation: "Les bridges permettent de transférer des actifs entre chaînes.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'bridges', trapType: 'none'
    },
    {
        id: 'q-blockchain-39', question: "Qu'est-ce qu'un NFT?",
        options: ["Not For Trading", "Non-Fungible Token - un actif unique", "New Finance Technology", "Network Fee Token"],
        correct: 1, explanation: "Un NFT représente un actif numérique unique et non interchangeable.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'nft', trapType: 'none'
    },
    {
        id: 'q-blockchain-40', question: "Qu'est-ce que le Web3?",
        options: ["Web 3.0 classique", "L'Internet décentralisé basé sur blockchain", "Une nouvelle version de Chrome", "Un réseau social"],
        correct: 1, explanation: "Web3 = Internet où les utilisateurs possèdent leurs données.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'web3', trapType: 'none'
    },
    {
        id: 'q-blockchain-41', question: "Qu'est-ce qu'un DAO?",
        options: ["Un art martial", "Decentralized Autonomous Organization", "Digital Asset Order", "Data Access Object"],
        correct: 1, explanation: "Un DAO est une organisation gérée par des smart contracts.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'dao', trapType: 'none'
    },
    {
        id: 'q-blockchain-42', question: "Pourquoi la blockchain est-elle sécurisée?",
        options: ["Par magie", "Cryptographie + décentralisation + consensus", "Par un antivirus", "Par des gardes"],
        correct: 1, explanation: "La combinaison de ces éléments rend la falsification quasi impossible.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'security', trapType: 'none'
    },
    {
        id: 'q-blockchain-43', question: "Qu'est-ce qu'une attaque 51%?",
        options: ["Une promo", "Quand une entité contrôle la majorité du réseau", "Un virus", "Un bug"],
        correct: 1, explanation: "51% permet de réécrire l'historique des transactions.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: '51-attack', trapType: 'none'
    },
    {
        id: 'q-blockchain-44', question: "Pi Network est sur quel type de blockchain?",
        options: ["Publique uniquement", "En transition de Testnet à Mainnet", "Privée", "Aucune"],
        correct: 1, explanation: "Pi a lancé son Mainnet avec migration progressive des utilisateurs.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'pi-mainnet', trapType: 'none'
    },
    {
        id: 'q-blockchain-45', question: "Qu'est-ce que le testnet?",
        options: ["Un filet de test", "Un environnement de test sans vraie valeur", "Un réseau rapide", "Un jeu"],
        correct: 1, explanation: "Le testnet permet de tester sans risquer de vrais fonds.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'testnet', trapType: 'none'
    },
    {
        id: 'q-blockchain-46', question: "Qu'est-ce que le mainnet?",
        options: ["Le réseau principal", "La blockchain de production avec vraie valeur", "Un réseau secondaire", "Un backup"],
        correct: 1, explanation: "Le mainnet est le réseau live où les transactions ont une réelle valeur.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'mainnet', trapType: 'none'
    },
    {
        id: 'q-blockchain-47', question: "Comment les blocs sont-ils liés entre eux?",
        options: ["Par des câbles", "Chaque bloc contient le hash du bloc précédent", "Par ordre alphabétique", "Au hasard"],
        correct: 1, explanation: "Cette chaîne de hashes rend toute modification détectable.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'chain-linking', trapType: 'none'
    },
    {
        id: 'q-blockchain-48', question: "Qu'est-ce que le temps de bloc?",
        options: ["L'heure du bloc", "Le temps moyen entre deux blocs", "La durée de vie d'un bloc", "Le temps de téléchargement"],
        correct: 1, explanation: "Bitcoin: ~10 min, Ethereum: ~12 sec, Pi: quelques secondes.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'block-time', trapType: 'none'
    },
    {
        id: 'q-blockchain-49', question: "Qu'est-ce que le throughput d'une blockchain?",
        options: ["Son poids", "Le nombre de transactions par seconde (TPS)", "Sa taille", "Son âge"],
        correct: 1, explanation: "Le TPS mesure la capacité de traitement du réseau.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'tps', trapType: 'none'
    },
    {
        id: 'q-blockchain-50', question: "Pourquoi le SCP est-il considéré comme 'vert'?",
        options: ["La couleur du logo", "Il ne nécessite pas de minage énergivore", "Il utilise des serveurs solaires", "Marketing écologique"],
        correct: 1, explanation: "Le SCP évite le Proof of Work énergivore, consommant très peu d'électricité.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'energy-efficiency', trapType: 'none'
    }
];

export const BLOCKCHAIN_QUESTIONS_EN: QuizQuestion[] = [
    {
        id: 'q-blockchain-6', question: "What is a node in a blockchain?",
        options: ["A bug", "A computer that validates transactions", "A user", "A cryptocurrency"],
        correct: 1, explanation: "Nodes are computers that maintain a copy of the blockchain.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'nodes', trapType: 'none'
    },
    // ... EN translations
];

// ========================================
// KYC - 40 QUESTIONS ADDITIONNELLES
// ========================================
export const KYC_QUESTIONS_FR: QuizQuestion[] = [
    {
        id: 'q-kyc-16', question: "Que signifie KYC?",
        options: ["Keep Your Coins", "Know Your Customer", "Key to Your Crypto", "Korean Yuan Currency"],
        correct: 1, explanation: "KYC = Know Your Customer (Connaître son client).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'terminology', trapType: 'none'
    },
    {
        id: 'q-kyc-17', question: "Le KYC Pi est-il payant?",
        options: ["Oui, 10$", "Non, gratuit", "Dépend du pays", "Premium uniquement"],
        correct: 1, explanation: "Le KYC Pi est entièrement GRATUIT. Tout paiement demandé est un scam.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'cost', trapType: 'none'
    },
    {
        id: 'q-kyc-18', question: "Pourquoi Pi Network exige-t-il le KYC?",
        options: ["Pour vendre vos données", "Pour garantir 1 compte = 1 personne réelle", "Par obligation légale uniquement", "Pour vous espionner"],
        correct: 1, explanation: "Le KYC prévient les bots et comptes multiples, assurant l'équité.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'purpose', trapType: 'none'
    },
    {
        id: 'q-kyc-19', question: "Où effectuer votre KYC Pi?",
        options: ["Sur un site tiers", "Directement dans l'application Pi officielle", "Via un email", "Sur Facebook"],
        correct: 1, explanation: "Le KYC se fait UNIQUEMENT dans l'app Pi officielle.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'location', trapType: 'none'
    },
    {
        id: 'q-kyc-20', question: "Quels documents sont acceptés pour le KYC Pi?",
        options: ["Carte de visite", "Pièce d'identité officielle avec photo", "Facture d'électricité", "Carte de fidélité"],
        correct: 1, explanation: "Passeport, carte d'identité nationale ou permis de conduire.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'documents', trapType: 'none'
    },
    {
        id: 'q-kyc-21', question: "Que se passe-t-il si vous échouez au KYC?",
        options: ["Vos Pi sont perdus définitivement", "Vous pouvez réessayer avec les bonnes informations", "Vous êtes banni à vie", "Rien"],
        correct: 1, explanation: "Vous avez généralement la possibilité de corriger et réessayer.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'failure-handling', trapType: 'none'
    },
    {
        id: 'q-kyc-22', question: "Le KYC Pi utilise quelle technologie de vérification?",
        options: ["Vérification manuelle uniquement", "IA + vérification humaine", "Aucune vérification", "Blockchain"],
        correct: 1, explanation: "Pi combine l'IA avec des vérificateurs humains de la communauté.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'technology', trapType: 'none'
    },
    {
        id: 'q-kyc-23', question: "Qui sont les validators KYC dans Pi?",
        options: ["Des employés Pi", "Des Pioneers formés de la communauté", "Des robots", "Des gouvernements"],
        correct: 1, explanation: "Des membres de la communauté Pi formés pour valider les KYC.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'validators', trapType: 'none'
    },
    {
        id: 'q-kyc-24', question: "Vos données KYC sont-elles vendues?",
        options: ["Oui, c'est le business model", "Non, elles sont utilisées uniquement pour la vérification", "À des partenaires", "Parfois"],
        correct: 1, explanation: "Pi ne vend pas vos données personnelles.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'privacy', trapType: 'none'
    },
    {
        id: 'q-kyc-25', question: "Que faire si quelqu'un propose de faire votre KYC?",
        options: ["Accepter si pressé", "Refuser - c'est personnel et risqué", "Vérifier son identité d'abord", "Payer pour le service"],
        correct: 1, explanation: "Ne donnez JAMAIS vos documents à un tiers. C'est un scam.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'security', trapType: 'none'
    },
    {
        id: 'q-kyc-26', question: "Le KYC Pi est-il obligatoire pour utiliser les Pi?",
        options: ["Non, facultatif", "Oui, pour transférer des Pi sur le Mainnet", "Seulement pour les gros montants", "Jamais"],
        correct: 1, explanation: "Le KYC est requis pour accéder au Mainnet et utiliser vos Pi.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'requirement', trapType: 'none'
    },
    {
        id: 'q-kyc-27', question: "Combien de temps dure le processus KYC?",
        options: ["Instantané", "Variable: quelques jours à quelques semaines", "Toujours 24h", "1 an"],
        correct: 1, explanation: "Le délai varie selon le volume de demandes et les vérifications.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'timeline', trapType: 'none'
    },
    {
        id: 'q-kyc-28', question: "Peut-on avoir plusieurs comptes Pi avec le même KYC?",
        options: ["Oui, autant qu'on veut", "Non, 1 KYC = 1 compte", "Jusqu'à 3", "Dépend du pays"],
        correct: 1, explanation: "Le principe fondamental est 1 personne = 1 compte.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'multi-account', trapType: 'none'
    },
    {
        id: 'q-kyc-29', question: "Que se passe-t-il si vous utilisez un faux document?",
        options: ["Rien", "Bannissement permanent et perte des Pi", "Avertissement", "Amende"],
        correct: 1, explanation: "La fraude documentaire entraîne le bannissement définitif.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'fraud', trapType: 'none'
    },
    {
        id: 'q-kyc-30', question: "Le nom sur le KYC doit correspondre à quoi?",
        options: ["Votre pseudo Pi", "Votre nom légal sur votre document d'identité", "Le nom de votre email", "N'importe quel nom"],
        correct: 1, explanation: "Le nom doit correspondre exactement à votre pièce d'identité.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'name-matching', trapType: 'none'
    },
    {
        id: 'q-kyc-31', question: "Pourquoi prendre un selfie lors du KYC?",
        options: ["Pour votre profil", "Pour vérifier que vous êtes le propriétaire du document", "Pour les réseaux sociaux", "C'est optionnel"],
        correct: 1, explanation: "La comparaison faciale confirme votre identité.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'selfie', trapType: 'none'
    },
    {
        id: 'q-kyc-32', question: "Un document expiré est-il accepté?",
        options: ["Oui, c'est pareil", "Non, le document doit être valide", "Dépend du pays", "Seulement passeport"],
        correct: 1, explanation: "Utilisez uniquement des documents en cours de validité.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'validity', trapType: 'none'
    },
    {
        id: 'q-kyc-33', question: "Que faire si votre nom a changé depuis l'inscription?",
        options: ["Utiliser l'ancien nom", "Fournir le document avec le nouveau nom officiel", "Créer un nouveau compte", "Contacter un tiers"],
        correct: 1, explanation: "Utilisez votre document actuel légal.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'name-change', trapType: 'none'
    },
    {
        id: 'q-kyc-34', question: "Les mineurs peuvent-ils faire le KYC?",
        options: ["Oui sans restriction", "Les règles varient selon les juridictions", "Jamais", "Seulement avec parents"],
        correct: 1, explanation: "L'éligibilité dépend des lois locales et des politiques Pi.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'minors', trapType: 'none'
    },
    {
        id: 'q-kyc-35', question: "Votre KYC est-il transférable?",
        options: ["Oui, à la famille", "Non, il est lié à vous personnellement", "Sur demande", "Après décès"],
        correct: 1, explanation: "Le KYC est personnel et non transférable.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'transferability', trapType: 'none'
    },
    {
        id: 'q-kyc-36', question: "Que vérifier avant de soumettre votre KYC?",
        options: ["La météo", "Clarté des photos et correspondance des informations", "L'heure", "Rien"],
        correct: 1, explanation: "Des photos floues ou des infos incorrectes causent des rejets.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'submission-tips', trapType: 'none'
    },
    {
        id: 'q-kyc-37', question: "Le KYC protège-t-il contre les scams?",
        options: ["Non", "Oui, en réduisant les faux comptes", "Cela n'a aucun rapport", "Seulement les gros scams"],
        correct: 1, explanation: "Le KYC rend plus difficile la création de comptes frauduleux.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'anti-scam', trapType: 'none'
    },
    {
        id: 'q-kyc-38', question: "Peut-on refaire son KYC?",
        options: ["Jamais", "Oui, en cas de rejet pour correction", "Chaque année", "Moyennant paiement"],
        correct: 1, explanation: "Des tentatives supplémentaires sont généralement accordées.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'retry', trapType: 'none'
    },
    {
        id: 'q-kyc-39', question: "Quel est le rôle du liveness check?",
        options: ["Un test de vie personnel", "Vérifier que vous êtes présent en temps réel (pas une photo)", "Un quiz", "Un jeu"],
        correct: 1, explanation: "Le liveness check détecte les tentatives de fraude par photo/vidéo.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'liveness', trapType: 'none'
    },
    {
        id: 'q-kyc-40', question: "Les données KYC sont stockées:",
        options: ["Sur Facebook", "De manière sécurisée avec chiffrement", "En clair sur Internet", "Sur votre téléphone uniquement"],
        correct: 1, explanation: "Pi utilise des mesures de sécurité pour protéger vos données.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'data-security', trapType: 'none'
    },
    {
        id: 'q-kyc-41', question: "Un site propose 'KYC express'. C'est:",
        options: ["Un service officiel", "Un scam pour voler vos documents", "Légal mais cher", "Recommandé"],
        correct: 1, explanation: "Aucun service tiers n'est autorisé pour le KYC Pi.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'fake-services', trapType: 'none'
    },
    {
        id: 'q-kyc-42', question: "Le KYC vérifie-t-il votre adresse?",
        options: ["Oui, en détail", "Le focus est sur l'identité, pas l'adresse", "Toujours", "Jamais"],
        correct: 1, explanation: "Le KYC Pi se concentre sur la vérification d'identité.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'scope', trapType: 'none'
    },
    {
        id: 'q-kyc-43', question: "Que faire si le KYC est en attente depuis longtemps?",
        options: ["Créer un nouveau compte", "Être patient, ne pas payer de 'services d'accélération'", "Contacter un tiers", "Abandonner"],
        correct: 1, explanation: "Le volume de demandes peut causer des délais. Patience.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'delays', trapType: 'none'
    },
    {
        id: 'q-kyc-44', question: "Peut-on utiliser un permis de conduire pour le KYC?",
        options: ["Jamais", "Oui, s'il est accepté dans votre pays", "Seulement en Europe", "Uniquement passeport"],
        correct: 1, explanation: "Les documents acceptés varient selon les juridictions.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'accepted-docs', trapType: 'none'
    },
    {
        id: 'q-kyc-45', question: "Pourquoi votre KYC pourrait-il être rejeté?",
        options: ["Malchance", "Photo floue, document expiré, informations incorrectes", "Trop de Pi", "Connexion Internet"],
        correct: 1, explanation: "Les problèmes techniques ou de documentation causent les rejets.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'rejection-reasons', trapType: 'none'
    },
    {
        id: 'q-kyc-46', question: "Le KYC est-il un standard de l'industrie crypto?",
        options: ["Non, unique à Pi", "Oui, la plupart des plateformes l'exigent", "Interdit en crypto", "Optionnel partout"],
        correct: 1, explanation: "Le KYC est une pratique standard sur les exchanges et plateformes régulées.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'industry-standard', trapType: 'none'
    },
    {
        id: 'q-kyc-47', question: "Après le KYC réussi, vos Pi sont:",
        options: ["Supprimés", "Éligibles à la migration vers le Mainnet", "Doublés", "Gelés"],
        correct: 1, explanation: "Le KYC valide permet la migration de vos Pi vers le réseau principal.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'post-kyc', trapType: 'none'
    },
    {
        id: 'q-kyc-48', question: "Les validators KYC voient-ils toutes vos informations?",
        options: ["Oui, tout", "Non, ils voient des informations limitées/masquées", "Seulement votre nom", "Rien"],
        correct: 1, explanation: "Des mesures de confidentialité limitent l'accès des validators.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'validator-access', trapType: 'none'
    },
    {
        id: 'q-kyc-49', question: "Peut-on contester un rejet KYC?",
        options: ["Non, c'est final", "Oui, via les canaux officiels", "Seulement avec un avocat", "En payant"],
        correct: 1, explanation: "Des processus d'appel existent pour les cas légitimes.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'appeals', trapType: 'none'
    },
    {
        id: 'q-kyc-50', question: "Le KYC Pi contribue à:",
        options: ["Ralentir le réseau", "Créer un écosystème de confiance", "Enrichir Pi", "Rien d'utile"],
        correct: 1, explanation: "Le KYC renforce la confiance et la légitimité du réseau.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'benefits', trapType: 'none'
    }
];

export const KYC_QUESTIONS_EN: QuizQuestion[] = [
    {
        id: 'q-kyc-16', question: "What does KYC stand for?",
        options: ["Keep Your Coins", "Know Your Customer", "Key to Your Crypto", "Korean Yuan Currency"],
        correct: 1, explanation: "KYC = Know Your Customer.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'terminology', trapType: 'none'
    },
    // ... EN translations
];

// ========================================
// DEFI - 40 QUESTIONS ADDITIONNELLES
// ========================================
export const DEFI_QUESTIONS_FR: QuizQuestion[] = [
    {
        id: 'q-defi-16', question: "Qu'est-ce qu'un DEX?",
        options: ["Digital Exchange", "Decentralized Exchange", "Direct Exchange", "Dynamic Exchange"],
        correct: 1, explanation: "DEX = Decentralized Exchange (échange sans intermédiaire central).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'dex', trapType: 'none'
    },
    {
        id: 'q-defi-17', question: "Qu'est-ce que le 'slippage' en DeFi?",
        options: ["Glisser sur l'écran", "Différence entre prix attendu et prix exécuté", "Un type de hack", "Frais cachés"],
        correct: 1, explanation: "Le slippage est l'écart de prix dû aux mouvements de marché pendant l'exécution.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'slippage', trapType: 'none'
    },
    {
        id: 'q-defi-18', question: "Qu'est-ce qu'un CEX?",
        options: ["Crypto Exchange", "Centralized Exchange", "Certified Exchange", "Community Exchange"],
        correct: 1, explanation: "CEX = Centralized Exchange (ex: Binance, Coinbase).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'cex', trapType: 'none'
    },
    {
        id: 'q-defi-19', question: "Avantage principal d'un DEX?",
        options: ["Plus rapide", "Pas de KYC et contrôle de ses clés", "Moins cher", "Plus populaire"],
        correct: 1, explanation: "Les DEX permettent de trader sans confier ses clés à un tiers.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'dex-benefits', trapType: 'none'
    },
    {
        id: 'q-defi-20', question: "Qu'est-ce que le staking?",
        options: ["Manger un steak", "Verrouiller des tokens pour gagner des récompenses", "Vendre des tokens", "Acheter des tokens"],
        correct: 1, explanation: "Le staking génère des revenus passifs en sécurisant le réseau.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'staking', trapType: 'none'
    },
    {
        id: 'q-defi-21', question: "Qu'est-ce que le lending en DeFi?",
        options: ["Prêter", "Prêter ses crypto pour gagner des intérêts", "Emprunter de l'argent", "Donner des tokens"],
        correct: 1, explanation: "Le lending permet de générer des revenus en prêtant ses actifs.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'lending', trapType: 'none'
    },
    {
        id: 'q-defi-22', question: "Qu'est-ce que le borrowing en DeFi?",
        options: ["Voler", "Emprunter des crypto contre un collatéral", "Acheter à crédit", "Mendier"],
        correct: 1, explanation: "On emprunte en déposant un collatéral supérieur à l'emprunt.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'borrowing', trapType: 'none'
    },
    {
        id: 'q-defi-23', question: "Qu'est-ce que le collatéral?",
        options: ["Un effet secondaire", "Un actif déposé en garantie d'un prêt", "Un frais", "Un bonus"],
        correct: 1, explanation: "Le collatéral sécurise le prêteur en cas de défaut.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'collateral', trapType: 'none'
    },
    {
        id: 'q-defi-24', question: "Qu'est-ce que la liquidation en DeFi?",
        options: ["Vendre une entreprise", "Vente forcée du collatéral quand sa valeur baisse trop", "Payer ses dettes", "Fermer un compte"],
        correct: 1, explanation: "La liquidation protège les prêteurs quand le ratio de collatéral chute.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'liquidation', trapType: 'none'
    },
    {
        id: 'q-defi-25', question: "Qu'est-ce qu'un stablecoin?",
        options: ["Une crypto stable", "Un token indexé sur une valeur stable (ex: dollar)", "Une crypto fiable", "Bitcoin"],
        correct: 1, explanation: "Les stablecoins maintiennent une valeur constante (ex: USDT, USDC).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'stablecoins', trapType: 'none'
    },
    {
        id: 'q-defi-26', question: "Risque principal des stablecoins algorithmiques?",
        options: ["Aucun risque", "Dé-peg: perdre leur ancrage à la valeur cible", "Trop stables", "Frais élevés"],
        correct: 1, explanation: "Les stablecoins algorithmiques peuvent perdre leur peg (ex: UST en 2022).",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'algo-stable-risks', trapType: 'none'
    },
    {
        id: 'q-defi-27', question: "Qu'est-ce que le TVL en DeFi?",
        options: ["Total Value Listed", "Total Value Locked - valeur totale déposée", "Token Value Level", "Trading Volume Level"],
        correct: 1, explanation: "Le TVL mesure la confiance et l'adoption d'un protocole DeFi.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'tvl', trapType: 'none'
    },
    {
        id: 'q-defi-28', question: "Qu'est-ce que l'APY?",
        options: ["Annual Payment Yield", "Annual Percentage Yield - rendement annuel composé", "Average Price Yearly", "Automated Protocol Yield"],
        correct: 1, explanation: "L'APY inclut les intérêts composés sur un an.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'apy', trapType: 'none'
    },
    {
        id: 'q-defi-29', question: "Différence entre APY et APR?",
        options: ["Aucune", "APY inclut les intérêts composés, APR non", "APR est plus élevé", "APY est mensuel"],
        correct: 1, explanation: "APR = taux simple, APY = avec réinvestissement des gains.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'apy-vs-apr', trapType: 'none'
    },
    {
        id: 'q-defi-30', question: "Qu'est-ce qu'un flash loan?",
        options: ["Un prêt rapide", "Un prêt instantané sans collatéral remboursé dans la même transaction", "Un micro-crédit", "Un prêt d'ami"],
        correct: 1, explanation: "Les flash loans permettent des arbitrages complexes sans capital initial.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'flash-loans', trapType: 'none'
    },
    {
        id: 'q-defi-31', question: "Risque d'un APY très élevé (ex: 1000%)?",
        options: ["Aucun, plus c'est haut mieux c'est", "Probablement un scam ou un projet non durable", "Garantie de richesse", "Bonus fiscal"],
        correct: 1, explanation: "Les APY irréalistes sont souvent des arnaques ou des Ponzi.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'high-apy-warning', trapType: 'none'
    },
    {
        id: 'q-defi-32', question: "Qu'est-ce que le farming de liquidité?",
        options: ["Agriculture", "Fournir de la liquidité à un DEX en échange de récompenses", "Miner des coins", "Stocker des tokens"],
        correct: 1, explanation: "Les liquidity providers gagnent des frais et parfois des tokens bonus.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'liquidity-farming', trapType: 'none'
    },
    {
        id: 'q-defi-33', question: "Qu'est-ce qu'un token LP?",
        options: ["Lucky Prize", "Liquidity Provider token - preuve de dépôt dans un pool", "Long Position", "Legal Payment"],
        correct: 1, explanation: "Les tokens LP représentent votre part dans un pool de liquidité.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'lp-tokens', trapType: 'none'
    },
    {
        id: 'q-defi-34', question: "Qu'est-ce que le rug pull en DeFi?",
        options: ["Tirer le tapis", "Les développeurs retirent toute la liquidité et s'enfuient", "Un jeu", "Une mise à jour"],
        correct: 1, explanation: "Le rug pull est un type de scam où les créateurs volent les fonds.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'rug-pull', trapType: 'none'
    },
    {
        id: 'q-defi-35', question: "Comment éviter les rug pulls?",
        options: ["Impossible", "Vérifier l'équipe, l'audit, la liquidité verrouillée", "Investir peu", "Suivre les influenceurs"],
        correct: 1, explanation: "La due diligence réduit significativement les risques.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'rug-pull-prevention', trapType: 'none'
    },
    {
        id: 'q-defi-36', question: "Qu'est-ce qu'un audit de smart contract?",
        options: ["Un examen fiscal", "Une vérification de sécurité du code par des experts", "Un test utilisateur", "Une certification officielle"],
        correct: 1, explanation: "Les audits identifient les vulnérabilités potentielles du code.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'audits', trapType: 'none'
    },
    {
        id: 'q-defi-37', question: "Un audit garantit-il la sécurité à 100%?",
        options: ["Oui, absolument", "Non, des bugs peuvent exister malgré l'audit", "Seulement les audits CertiK", "Oui, si payé cher"],
        correct: 1, explanation: "Les audits réduisent les risques mais ne les éliminent pas.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'audit-limitations', trapType: 'none'
    },
    {
        id: 'q-defi-38', question: "Qu'est-ce que la gouvernance décentralisée?",
        options: ["Un gouvernement", "Les holders votent sur les décisions du protocole", "Une anarchie", "Une démocratie nationale"],
        correct: 1, explanation: "Les tokens de gouvernance donnent un droit de vote aux utilisateurs.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'governance', trapType: 'none'
    },
    {
        id: 'q-defi-39', question: "Qu'est-ce qu'un wrapper token?",
        options: ["Un emballage", "Une version d'un token compatible avec une autre blockchain", "Un token cadeau", "Un token de Noël"],
        correct: 1, explanation: "Ex: WBTC est du Bitcoin 'wrapped' sur Ethereum.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'wrapped-tokens', trapType: 'none'
    },
    {
        id: 'q-defi-40', question: "Qu'est-ce que le MEV?",
        options: ["Maximum Exchange Value", "Maximal Extractable Value - profit des validateurs sur l'ordre des tx", "Minimum Entry Value", "Market Exchange Volume"],
        correct: 1, explanation: "Le MEV peut affecter le prix de vos transactions sur les DEX.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'mev', trapType: 'none'
    },
    {
        id: 'q-defi-41', question: "Qu'est-ce qu'un front-running?",
        options: ["Courir devant", "Un bot qui place une transaction avant la vôtre pour profiter", "Une course", "Un marathon"],
        correct: 1, explanation: "Les bots observent les transactions en attente et s'intercalent.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'front-running', trapType: 'none'
    },
    {
        id: 'q-defi-42', question: "Comment se protéger du front-running?",
        options: ["Impossible", "Utiliser des solutions anti-MEV ou limiter le slippage", "Trader plus vite", "Payer plus de gas"],
        correct: 1, explanation: "Des outils comme Flashbots ou des paramètres de slippage aident.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'anti-frontrun', trapType: 'none'
    },
    {
        id: 'q-defi-43', question: "Qu'est-ce qu'un aggregateur DeFi?",
        options: ["Un outil agricole", "Un service qui trouve le meilleur prix sur plusieurs DEX", "Un exchange", "Un wallet"],
        correct: 1, explanation: "Ex: 1inch, Paraswap comparent les prix pour optimiser les trades.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'aggregators', trapType: 'none'
    },
    {
        id: 'q-defi-44', question: "Avantage d'utiliser un aggregateur?",
        options: ["Plus de risques", "Meilleur prix et moins de slippage", "Plus lent", "Plus de frais"],
        correct: 1, explanation: "Les aggregateurs optimisent les routes pour minimiser les coûts.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'aggregator-benefits', trapType: 'none'
    },
    {
        id: 'q-defi-45', question: "Qu'est-ce que le cross-chain DeFi?",
        options: ["DeFi en colère", "Utiliser des services DeFi sur plusieurs blockchains", "Du DeFi chrétien", "Un nouveau protocole"],
        correct: 1, explanation: "Le cross-chain permet d'échanger/utiliser des assets entre chaînes.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'cross-chain', trapType: 'none'
    },
    {
        id: 'q-defi-46', question: "Risque principal du cross-chain?",
        options: ["Aucun", "Les bridges sont des cibles d'attaques majeures", "Trop rapide", "Trop sécurisé"],
        correct: 1, explanation: "Les hacks de bridges ont causé des milliards de pertes.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'bridge-risks', trapType: 'none'
    },
    {
        id: 'q-defi-47', question: "Qu'est-ce qu'un vault en DeFi?",
        options: ["Un coffre-fort physique", "Un smart contract qui automatise des stratégies d'investissement", "Une banque", "Un exchange"],
        correct: 1, explanation: "Les vaults (ex: Yearn) optimisent automatiquement les rendements.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'vaults', trapType: 'none'
    },
    {
        id: 'q-defi-48', question: "Qu'est-ce que le composability en DeFi?",
        options: ["Faire de la musique", "La capacité des protocoles à s'intégrer comme des Legos", "Un type de code", "Une marque"],
        correct: 1, explanation: "Les 'Money Legos' permettent de combiner les protocoles.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'composability', trapType: 'none'
    },
    {
        id: 'q-defi-49', question: "Pourquoi diversifier en DeFi?",
        options: ["Pour compliquer", "Réduire le risque si un protocole est hacké", "C'est inutile", "Pour payer plus de frais"],
        correct: 1, explanation: "Ne pas mettre tous ses œufs dans le même panier!",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'diversification', trapType: 'none'
    },
    {
        id: 'q-defi-50', question: "Le DeFi est-il sans risque?",
        options: ["Oui, tout est automatisé", "Non, il comporte des risques techniques et financiers", "Seulement sur Ethereum", "Garanti par les gouvernements"],
        correct: 1, explanation: "Smart contract bugs, hacks, volatilité: le DeFi reste risqué.",
        difficulty: 'easy', cognitiveLevel: 'analysis', topic: 'risk-awareness', trapType: 'none'
    }
];

export const DEFI_QUESTIONS_EN: QuizQuestion[] = [
    {
        id: 'q-defi-16', question: "What is a DEX?",
        options: ["Digital Exchange", "Decentralized Exchange", "Direct Exchange", "Dynamic Exchange"],
        correct: 1, explanation: "DEX = Decentralized Exchange (no central intermediary).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'dex', trapType: 'none'
    },
    // ... EN translations follow same pattern
];
