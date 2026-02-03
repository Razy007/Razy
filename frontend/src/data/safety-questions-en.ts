import { QuizQuestion } from '../types';

export const SAFETY_QUESTIONS_EN: QuizQuestion[] = [
    // === EASY (20 items) ===
    {
        id: 'q-safety-1',
        question: "What is the Golden Rule of Pi Security?",
        options: ["Share passphrase with friends", "NEVER share your passphrase", "Email it to support", "Post it online"],
        correct: 1,
        explanation: "Your passphrase is your private key. NEVER share it with anyone, not even Pi Core Team.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'passphrase-security', trapType: 'none'
    },
    {
        id: 'q-safety-2',
        question: "How many words in standard Pi passphrase?",
        options: ["12 words", "24 words", "6 words", "48 words"],
        correct: 1,
        explanation: "A standard Pi passphrase consists of 24 words for maximum security.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'passphrase-basics', trapType: 'similar-numbers'
    },
    {
        id: 'q-safety-3',
        question: "Where should you store your passphrase?",
        options: ["Google Drive", "On paper in a safe place", "Draft email", "Screenshot"],
        correct: 1,
        explanation: "Store it offline on paper or in a secure location. Avoid cloud storage.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'passphrase-storage', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-4',
        question: "What happens if you lose your passphrase?",
        options: ["Core Team recovers it", "You lose your Pi FOREVER", "Reset via email", "Nothing bad"],
        correct: 1,
        explanation: "If you lose your passphrase, your Pi are lost forever. No recovery possible.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'passphrase-importance', trapType: 'false-security'
    },
    {
        id: 'q-safety-5',
        question: "What is a phishing attack?",
        options: ["A virus", "Attempt to steal info by deception", "Wallet bug", "Pi update"],
        correct: 1,
        explanation: "Phishing involves scammers pretending to be Pi Network to steal your credentials.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'phishing', trapType: 'none'
    },
    {
        id: 'q-safety-6',
        question: "Will Pi Core Team ask for your passphrase?",
        options: ["Yes, for KYC", "Yes, to fix wallet", "NO, NEVER", "Yes, official email"],
        correct: 2,
        explanation: "Pi Core Team will NEVER ask for your passphrase. Anyone asking is a scammer.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'official-policy', trapType: 'authority-trap'
    },
    {
        id: 'q-safety-7',
        question: "What is the official Pi Network website?",
        options: ["pinetwork.com", "minepi.com", "pi-network.org", "pinetwork.net"],
        correct: 1,
        explanation: "The only official domain is minepi.com. Beware of lookalikes.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'official-channels', trapType: 'similar-domains'
    },
    {
        id: 'q-safety-8',
        question: "Should you enable Two-Factor Authentication (2FA)?",
        options: ["No, optional", "Yes, STRONGLY recommended", "Only if rich", "Useless"],
        correct: 1,
        explanation: "2FA adds an essential layer of security to protect your account.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: '2fa', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-9',
        question: "What to do with a suspicious email claiming to be Pi?",
        options: ["Click links", "Reply with info", "IGNORE and report", "Share with friends"],
        correct: 2,
        explanation: "Never click suspicious links. Report and delete immediately.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'phishing-response', trapType: 'urgency-trap'
    },
    {
        id: 'q-safety-10',
        question: "How many copies of passphrase should you have?",
        options: ["Just 1", "At least 2-3 in different secure spots", "10 everywhere", "Zero, memorize it"],
        correct: 1,
        explanation: "Keep 2-3 secure copies in different locations (safe, bank, parents) to avoid loss.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'backup-strategy', trapType: 'extreme-options'
    },
    {
        id: 'q-safety-11',
        question: "What is a non-custodial wallet?",
        options: ["Team manages it", "YOU control keys alone", "No security", "Shared"],
        correct: 1,
        explanation: "Non-custodial means you are the only one with control over your funds.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'wallet-types', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-12',
        question: "Can you share your Public Address?",
        options: ["No, dangerous", "Yes, safe to receive Pi", "Only family", "Never"],
        correct: 1,
        explanation: "Your Public Address is safe to share for receiving payments.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'public-vs-private', trapType: 'confusion-trap'
    },
    {
        id: 'q-safety-13',
        question: "What is a 'Private Key'?",
        options: ["Email password", "Key unlocking your Pi (Passphrase)", "Username", "Phone number"],
        correct: 1,
        explanation: "The Private Key (passphrase) proves ownership. Keep it secret.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'cryptography-basics', trapType: 'none'
    },
    {
        id: 'q-safety-14',
        question: "Should you download Pi Wallet from random sites?",
        options: ["Yes", "No, ONLY official App Store/Play Store", "APK is fine", "Anywhere"],
        correct: 1,
        explanation: "Download ONLY from official stores to avoid fake wallets containing malware.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'app-security', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-15',
        question: "What is a 'Seed Phrase'?",
        options: ["Promo code", "Your 24-word passphrase", "Password", "Email"],
        correct: 1,
        explanation: "Seed phrase terms usually refers to your 24-word secret passphrase.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'terminology', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-16',
        question: "Can you change passphrase later?",
        options: ["Yes anytime", "No, it is permanent", "Once", "Via support"],
        correct: 1,
        explanation: "Your passphrase matches your wallet address permanently. It cannot be changed.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'passphrase-permanence', trapType: 'false-flexibility'
    },
    {
        id: 'q-safety-17',
        question: "What if someone offers to 'double' your Pi?",
        options: ["Accept deal", "It's a SCAM, refuse", "Check first", "Ask Team"],
        correct: 1,
        explanation: "Any promise to 'double' funds is a classic scam. Don't fall for it.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'scam-awareness', trapType: 'greed-trap'
    },
    {
        id: 'q-safety-18',
        question: "Should you update the Pi App?",
        options: ["No need", "Yes, for security fixes", "Only forced", "Never"],
        correct: 1,
        explanation: "Updates often contain critical security patches. Always keep app updated.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'app-maintenance', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-19',
        question: "What is a malicious smart contract?",
        options: ["Normal contract", "Contract designed to steal funds", "Fast contract", "Official contract"],
        correct: 1,
        explanation: "Some contracts are traps designed to drain your wallet upon interaction.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'smart-contract-risks', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-20',
        question: "Reuse same password for Pi and Email?",
        options: ["Yes convenient", "NO, use unique passwords", "If strong yes", "Don't care"],
        correct: 1,
        explanation: "ALWAYS use unique passwords for critical services to prevent chain reactions.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'password-hygiene', trapType: 'convenience-trap'
    },

    // === MEDIUM (20 items) ===
    {
        id: 'q-safety-21',
        question: "Difference between Public and Private key?",
        options: ["None", "Public = Receive, Private = Spend/Access", "Public = Secret", "Same"],
        correct: 1,
        explanation: "Public key is for receiving funds. Private key (passphrase) signs transactions to spend them.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'cryptography', trapType: 'reversed-logic'
    },
    {
        id: 'q-safety-22',
        question: "What is a 'Man-in-the-Middle' attack?",
        options: ["Virus", "Hacker intercepting communications", "Update", "Bug"],
        correct: 1,
        explanation: "Attacker intercepts data between you and server. Use HTTPS/VPN to prevent.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'network-security', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-23',
        question: "Why NEVER photo your passphrase?",
        options: ["Forbidden", "Photos sync to cloud and get hacked", "Bad luck", "Too long"],
        correct: 1,
        explanation: "Photos often auto-upload to cloud (iCloud, Google) where they can be scanned/hacked.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'digital-hygiene', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-24',
        question: "What is a 'clipboard hijacker'?",
        options: ["Paste tool", "Malware swapping copied addresses", "Feature", "Shortcut"],
        correct: 1,
        explanation: "Malware that detects crypto addresses in clipboard and swaps them for the hacker's address.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'malware-types', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-25',
        question: "How to simplify verifying minepi.com?",
        options: ["Look at design", "Check SSL lock + EXACT URL spelling", "Ask friend", "Google it"],
        correct: 1,
        explanation: "Check SSL padlock and ensure URL is EXACTLY 'minepi.com' (no typos).",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'url-verification', trapType: 'visual-similarity'
    },
    {
        id: 'q-safety-26',
        question: "What is a 'Dust Attack'?",
        options: ["Slow net", "Tiny crypto dust sent to de-anonymize you", "Update", "Bug"],
        correct: 1,
        explanation: "Scammers send tiny amounts to track your wallet activity and identify you.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'privacy-attacks', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-27',
        question: "Why check destination address before sending?",
        options: ["Politeness", "Transactions are IRREVERSIBLE", "Optional", "Pi refunds"],
        correct: 1,
        explanation: "Once sent, Pi is gone. A typo means loss of funds. Always verify.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'transaction-finality', trapType: 'false-security'
    },
    {
        id: 'q-safety-28',
        question: "What is a Hardware Wallet?",
        options: ["Paper", "Physical device storing keys offline", "Mobile app", "Online site"],
        correct: 1,
        explanation: "Device like Ledger that keeps keys disconnected from internet (max security).",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'wallet-types', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-29',
        question: "What is 'Cold Storage'?",
        options: ["Fridge", "Offline storage of keys", "Cloud", "Mobile"],
        correct: 1,
        explanation: "Storing keys completely offline to prevent online hacking attempts.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'storage-methods', trapType: 'literal-interpretation'
    },
    {
        id: 'q-safety-30',
        question: "Why no passphrase on public PC?",
        options: ["Slow", "Keyloggers can steal inputs", "Forbidden", "Buggy"],
        correct: 1,
        explanation: "Public computers often have keyloggers recording everything you type.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'public-device-risks', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-31',
        question: "What is a 'Rug Pull'?",
        options: ["Update", "Devs stealing all funds and vanishing", "Bug", "Feature"],
        correct: 1,
        explanation: "Devs abandon project and take investors' money. Classic scam.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'scam-types', trapType: 'slang-term'
    },
    {
        id: 'q-safety-32',
        question: "How to spot a Fake Wallet?",
        options: ["Nice design", "Not on official stores / asks for keys immediately", "Free", "Popular"],
        correct: 1,
        explanation: "Fake wallets are often sideloaded and aggressively ask for passphrase.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'fake-apps', trapType: 'visual-deception'
    },
    {
        id: 'q-safety-33',
        question: "What is 'Social Engineering'?",
        options: ["Facebook", "Psychological manipulation to steal info", "Bug", "Feature"],
        correct: 1,
        explanation: "Hacking the human (e.g. pretending to be support) rather than the machine.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'psychological-attacks', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-34',
        question: "Why enable Biometric Lock?",
        options: ["Cool", "Prevents physical access if phone stolen", "Mandatory", "Faster"],
        correct: 1,
        explanation: "If someone steals your unlocked phone, biometrics stop them opening the wallet.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'device-security', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-35',
        question: "What is a 'Honeypot'?",
        options: ["Honey jar", "Trap contract letting coins in but not out", "Fast contract", "Official"],
        correct: 1,
        explanation: "A smart contract trap that allows deposits but blocks withdrawals.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'smart-contract-traps', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-safety-36',
        question: "Why never screen-share with wallet open?",
        options: ["Rude", "Viewers can see keys/balance", "Slows net", "Forbidden"],
        correct: 1,
        explanation: "Screen recording/sharing can accidentally expose your passphrase.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'screen-sharing-risks', trapType: 'social-pressure'
    },
    {
        id: 'q-safety-37',
        question: "What is a 'SIM Swap' attack?",
        options: ["New SIM", "Hacker hijacking your number to intercept SMS 2FA", "Bug", "Update"],
        correct: 1,
        explanation: "Attackers trick carrier to transfer your number to their SIM to steal 2FA codes.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'mobile-security', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-38',
        question: "Why use a Password Manager?",
        options: ["Mandatory", "To generate/store strong unique passwords", "Free", "Sharing"],
        correct: 1,
        explanation: "Managers (Bitwarden, 1Password) enable complex unique passwords for every site.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'password-management', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-39',
        question: "What is a 'Zero-Day' exploit?",
        options: ["Free bug", "Unknown vulnerability exploited before fix", "Update", "Bonus"],
        correct: 1,
        explanation: "Attack on a vulnerability unknown to the developers (0 days to fix).",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'security-vulnerabilities', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-40',
        question: "Why check App Permissions?",
        options: ["Time saving", "Avoid apps accessing sensitive data unneeded", "Optional", "All safe"],
        correct: 1,
        explanation: "Malware often asks for excessive permissions (SMS, Storage) to steal data.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'app-permissions', trapType: 'trust-assumption'
    },

    // === HARD (10 items) ===
    {
        id: 'q-safety-41',
        question: "How does 'Typosquatting' work?",
        options: ["Typing errors", "Registering similar domains (minepii.com) to trap users", "DNS hack", "Password theft"],
        correct: 1,
        explanation: "Fake sites with names 1 letter different from real ones catch typo errors.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'domain-spoofing', trapType: 'visual-similarity'
    },
    {
        id: 'q-safety-42',
        question: "What is 'DNS Poisoning'?",
        options: ["Virus", "Corrupting DNS to redirect correct URL to fake site", "Bug", "Update"],
        correct: 1,
        explanation: "Even if you type correct URL, poisoned DNS sends you to hacker server.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'network-attacks', trapType: 'technical-complexity'
    },
    {
        id: 'q-safety-43',
        question: "Why use VPN on public WiFi?",
        options: ["Speed", "Encrypts traffic against interception", "Mandatory", "Battery"],
        correct: 1,
        explanation: "Public WiFi is insecure. VPN creates an encrypted tunnel for your data.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'network-security', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-44',
        question: "What is a 'Rainbow Table'?",
        options: ["Colors", "Precomputed hash table to crack passwords", "Bug", "Feature"],
        correct: 1,
        explanation: "A database of pre-calculated hashes allowing instant cracking of weak passwords.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'cryptography-attacks', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-45',
        question: "Why is 'Salting' passwords important?",
        options: ["Taste", "Makes hashes unique preventing Rainbow Table attacks", "Speed", "Useless"],
        correct: 1,
        explanation: "Adding random data (salt) to passwords before hashing defeats precomputed tables.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'cryptography', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-safety-46',
        question: "What is a 'Side-Channel Attack'?",
        options: ["Virus", "Exploiting indirect info (power, timing) to steal keys", "Bug", "Feature"],
        correct: 1,
        explanation: "Reading physical signals (heat, sound, power) to deduce crypto keys.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'advanced-attacks', trapType: 'technical-complexity'
    },
    {
        id: 'q-safety-47',
        question: "Why verify file Checksum?",
        options: ["Time saving", "Ensures file is authentic and not tampered with", "Optional", "Speed"],
        correct: 1,
        explanation: "Checksum (hash) proves the file you downloaded matches the original exactly.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'file-integrity', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-48',
        question: "What is a 'Replay Attack'?",
        options: ["Video replay", "Intercepting and resending a valid transaction", "Bug", "Feature"],
        correct: 1,
        explanation: "Attacker replays a legitimate data transmission to deceive the system.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'transaction-security', trapType: 'technical-jargon'
    },
    {
        id: 'q-safety-49',
        question: "Why use 'HTTPS Everywhere'?",
        options: ["Speed", "Forces encrypted connection on all sites", "Mandatory", "Battery"],
        correct: 1,
        explanation: "Ensures you always use the secure encrypted version of websites.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'browser-security', trapType: 'convenience-trap'
    },
    {
        id: 'q-safety-50',
        question: "What is TOTP (Time-based One-Time Password)?",
        options: ["Temp password", "2FA code changing every 30s", "Weak pass", "Bug"],
        correct: 1,
        explanation: "Rotating codes (Google Auth) are safer than SMS as they expire quickly.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: '2fa-mechanisms', trapType: 'technical-jargon'
    }
];
