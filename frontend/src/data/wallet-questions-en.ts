import { QuizQuestion } from '../types';

export const WALLET_QUESTIONS_EN: QuizQuestion[] = [
    // === EASY (20 items) ===
    {
        id: 'q-wallet-1',
        question: "What is a Pi Wallet passphrase?",
        options: ["Email password", "24 secret words accessing your Pi", "Your username", "A PIN code"],
        correct: 1,
        explanation: "The passphrase is a series of 24 words that proves you are the owner of your Pi.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'wallet-basics', trapType: 'none'
    },
    {
        id: 'q-wallet-2',
        question: "Where should you store your passphrase?",
        options: ["In a Facebook post", "On a sticky note on your monitor", "Safe offline place (paper, manager)", "Share with mods"],
        correct: 2,
        explanation: "Store your passphrase offline or in a secure password manager. NEVER share it.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'security', trapType: 'convenience-trap'
    },
    {
        id: 'q-wallet-3',
        question: "Can Pi Core Team reset your passphrase?",
        options: ["Yes, anytime", "No, never (non-custodial)", "Only if you pay", "Yes, with ID"],
        correct: 1,
        explanation: "Pi Wallet is non-custodial. Only YOU have the keys. Pi Team cannot recover it.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'non-custodial', trapType: 'false-security'
    },
    {
        id: 'q-wallet-4',
        question: "What is the Public Key (Address)?",
        options: ["Your secret password", "Address to receive Pi (shareable)", "Your GPS location", "Your phone number"],
        correct: 1,
        explanation: "Public Key (starts with G...) is like your bank account number (IBAN). Safe to share.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'keys', trapType: 'none'
    },
    {
        id: 'q-wallet-5',
        question: "What happens if you lose your passphrase?",
        options: ["You verify email", "You lose all Pi in that wallet forever", "You call support", "It resets in 7 days"],
        correct: 1,
        explanation: "Lost passphrase = Lost Pi. There is no 'forgot password' feature for the wallet.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'loss-consequence', trapType: 'fear-trap'
    },
    {
        id: 'q-wallet-6',
        question: "Is the Testnet wallet real money?",
        options: ["Yes, absolutely", "No, it's play money for testing", "Yes, if you KYC", "Maybe later"],
        correct: 1,
        explanation: "Testnet Pi are for testing only and have ZERO value. Do not sell them.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'testnet', trapType: 'greed-trap'
    },
    {
        id: 'q-wallet-7',
        question: "Does creating a wallet cost Pi?",
        options: ["Yes, 1 Pi", "No, it's free", "Yes, 100 Pi", "Depends on country"],
        correct: 1,
        explanation: "Creating a wallet is technically free, though activating it on-chain requires a small reserve.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'creation-cost', trapType: 'none'
    },
    {
        id: 'q-wallet-8',
        question: "How many words are in a passphrase?",
        options: ["12", "24", "6", "8"],
        correct: 1,
        explanation: "The standard BIP-39 passphrase used by Pi contains 24 English words.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'passphrase-structure', trapType: 'similar-numbers'
    },
    {
        id: 'q-wallet-9',
        question: "Who controls your Pi Wallet?",
        options: ["Pi Core Team", "The Government", "Only YOU (with passphrase)", "Google"],
        correct: 2,
        explanation: "You are the sole custodian of your funds through your passphrase.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'custody', trapType: 'authority-trap'
    },
    {
        id: 'q-wallet-10',
        question: "Can you change your passphrase?",
        options: ["Yes, daily", "No, you must create a NEW wallet", "Yes, in settings", "Yes, for a fee"],
        correct: 1,
        explanation: "You cannot change the passphrase of an existing wallet. You must create a new one.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'wallet-management', trapType: 'false-flexibility'
    },
    {
        id: 'q-wallet-11',
        question: "What is Biometric unlock?",
        options: ["FaceID/Fingerprint access", "DNA test", "Voice control", "Eye scan"],
        correct: 0,
        explanation: "Allows accessing wallet on your phone using FaceID or Fingerprint locally.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'features', trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-12',
        question: "Is it safe to use Biometrics?",
        options: ["No, never", "Yes, it keeps passphrase encrypted on device", "Only on PC", "Only for rich people"],
        correct: 1,
        explanation: "Biometrics store your passphrase safely in the phone's secure enclave.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'security', trapType: 'none'
    },
    {
        id: 'q-wallet-13',
        question: "Can you have multiple wallets?",
        options: ["No, forbidden", "Yes, you can create new ones", "Only one per life", "Only 2 max"],
        correct: 1,
        explanation: "You can create multiple wallets, but Mainnet migration is linked to ONE confirmed wallet.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'multi-wallet', trapType: 'loophole-trap'
    },
    {
        id: 'q-wallet-14',
        question: "What is the minimum balance reserve?",
        options: ["0 Pi", "1 Pi (on Testnet currently)", "100 Pi", "0.01 Pi"],
        correct: 1,
        explanation: "Stellar protocol requires a minimum reserve (often 1 Pi on Testnet) to keep account active.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'reserve', trapType: 'none'
    },
    {
        id: 'q-wallet-15',
        question: "How fast are Pi transactions?",
        options: ["1 hour", "3-5 seconds", "1 day", "10 minutes"],
        correct: 1,
        explanation: "Pi blockchain is extremely fast, confirming transactions in seconds.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'performance', trapType: 'bitcoin-comparison'
    },
    {
        id: 'q-wallet-16',
        question: "Can you undo a transaction?",
        options: ["Yes, within 10 min", "No, blockchain is irreversible", "Yes, ask support", "Yes, if erroneous"],
        correct: 1,
        explanation: "Blockchain transactions are final. Once sent, Pi is gone unless returned by recipient.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'immutability', trapType: 'false-security'
    },
    {
        id: 'q-wallet-17',
        question: "Should you screenshot your passphrase?",
        options: ["Yes, convenient", "NO, gallery apps sync to cloud (unsafe)", "Yes, print it", "Yes, send to mom"],
        correct: 1,
        explanation: "Cloud backups (iCloud, Google Photos) can be hacked. Do not screenshot secrets.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'security-practice', trapType: 'convenience-trap'
    },
    {
        id: 'q-wallet-18',
        question: "What is the transaction fee?",
        options: ["0.01 Pi", "1 Pi", "0 Pi", "10%"],
        correct: 0,
        explanation: "The standard fee is 0.01 Pi per transaction to prevent spam.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'fees', trapType: 'none'
    },
    {
        id: 'q-wallet-19',
        question: "Can you use Pi Wallet on PC?",
        options: ["No, mobile only", "Yes, via Pi Node / Browser desktop", "Yes, website", "Yes, Windows app"],
        correct: 1,
        explanation: "You can access your wallet via the Pi Browser interface on desktop or Pi Node.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'accessibility', trapType: 'none'
    },
    {
        id: 'q-wallet-20',
        question: "Is Pi Wallet compatible with Bitcoin?",
        options: ["Yes, it holds BTC", "No, it's for Pi Network assets only", "Yes, and ETH", "Maybe"],
        correct: 1,
        explanation: "Currently, Pi Wallet only supports Pi blockchain assets.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'compatibility', trapType: 'interoperability-myth'
    },

    // === MEDIUM (20 items) ===
    {
        id: 'q-wallet-21',
        question: "What tech is Pi Wallet based on?",
        options: ["Ethereum ERC20", "Stellar (SCP)", "Bitcoin Core", "Solana"],
        correct: 1,
        explanation: "Pi is a fork of Stellar Consensus Protocol (SCP), using similar wallet structures.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'technology', trapType: 'technical-confusion'
    },
    {
        id: 'q-wallet-22',
        question: "Why check the URL before entering passphrase?",
        options: ["To prevent phishing", "To see stats", "For fun", "To update"],
        correct: 0,
        explanation: "Phishing sites look like Pi Browser to steal keys. Always verify source.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'security', trapType: 'none'
    },
    {
        id: 'q-wallet-23',
        question: "What is the 'Mainnet Checklist' wallet step?",
        options: ["Optional", "Confirming which wallet receives your Mainnet balance", "Paying fees", "Uploading ID"],
        correct: 1,
        explanation: "You must cryptographically sign to confirm which wallet address receives your migrated Pi.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'migration', trapType: 'none'
    },
    {
        id: 'q-wallet-24',
        question: "How to safely copy passphrase?",
        options: ["Type manually", "Use 'Copy' button and paste immediately in secure note", "Take photo", "Read aloud"],
        correct: 1,
        explanation: "Use system clipboard carefully. Avoid typing which can be keylogged.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'ui-usage', trapType: 'none'
    },
    {
        id: 'q-wallet-25',
        question: "What if you send Pi to the wrong address?",
        options: ["Call police", "It is lost forever mostly", "CT reverses it", "Bank refunds"],
        correct: 1,
        explanation: "Irreversible. Always check the last 4 characters of address before sending.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'transaction-safety', trapType: 'fear-trap'
    },
    {
        id: 'q-wallet-26',
        question: "Can wallet hold 'Lockup' Pi?",
        options: ["No", "Yes, locked balances are visible but unusable until expiry", "Only unlocked", "Only Test-Pi"],
        correct: 1,
        explanation: "Your wallet shows total balance, including locked portions which cannot be spent yet.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'lockups', trapType: 'none'
    },
    {
        id: 'q-wallet-27',
        question: "What is a 'Non-Custodial' wallet?",
        options: ["Bank holds money", "User holds private keys solely", "Shared wallet", "Public wallet"],
        correct: 1,
        explanation: "Non-custodial means you have total control (and total responsibility).",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'terminology', trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-28',
        question: "Is passphrase case-sensitive?",
        options: ["Yes, very", "No, it's all lowercase usually", "Yes, capitals matter", "Mixed"],
        correct: 1,
        explanation: "BIP-39 words are typically handled as lowercase, but exact input matters.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'technical-detail', trapType: 'minute-detail-trap'
    },
    {
        id: 'q-wallet-29',
        question: "Does wallet work offline?",
        options: ["Yes fully", "No, needs internet to sign/broadcast", "Yes for viewing", "Yes for sending"],
        correct: 1,
        explanation: "You need internet to broadcast transactions to the blockchain nodes.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'connectivity', trapType: 'offline-myth'
    },
    {
        id: 'q-wallet-30',
        question: "Can you export private key (starts with S)?",
        options: ["Yes, in settings", "No, only passphrase is shown", "Yes, ask mod", "It is public"],
        correct: 0,
        explanation: "Pi Wallet UI focuses on Passphrase, but Stellar keys (S...) exist under the hood.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'advanced-keys', trapType: 'none'
    },
    {
        id: 'q-wallet-31',
        question: "What to do if your wallet is compromised?",
        options: ["Change password", "Create NEW wallet immediately and stop using old one", "Call support", "Nothing"],
        correct: 1,
        explanation: "Since you can't change the passphrase, you must abandon the compromised wallet.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'emergency-response', trapType: 'reflex-trap'
    },
    {
        id: 'q-wallet-32',
        question: "Why verify wallet in Checklist?",
        options: ["To get bonus", "To link your off-chain mining to on-chain address", "To pay tax", "To verify email"],
        correct: 1,
        explanation: "It links your app account identity to a specific blockchain address for migration.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'migration-mechanics', trapType: 'none'
    },
    {
        id: 'q-wallet-33',
        question: "Are Testnet and Mainnet wallets the same?",
        options: ["Different apps", "Same passphrase generates addresses on both networks", "Totally different keys", "One costs money"],
        correct: 1,
        explanation: "Your 24-word passphrase mathematically generates addresses for both Mainnet and Testnet.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'architecture', trapType: 'none'
    },
    {
        id: 'q-wallet-34',
        question: "Can apps request your passphrase?",
        options: ["Yes, to login", "NO, apps use Pi SDK, never passphrase", "Yes, for payments", "Sometimes"],
        correct: 1,
        explanation: "Legitimate Pi Apps use the SDK to request payment. NEVER enter passphrase in a 3rd party app.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'scam-prevention', trapType: 'convenience-trap'
    },
    {
        id: 'q-wallet-35',
        question: "What is 'History' in wallet?",
        options: ["Browser history", "List of past transactions (in/out)", "Login history", "Chat logs"],
        correct: 1,
        explanation: "Shows all payment operations associated with your address.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'features', trapType: 'none'
    },
    {
        id: 'q-wallet-36',
        question: "How to request payment?",
        options: ["Give passphrase", "Share Public Key (Address)", "Send screenshot", "Share phone number"],
        correct: 1,
        explanation: "Share your Public Key (Starts with G) for others to send you Pi.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'usability', trapType: 'none'
    },
    {
        id: 'q-wallet-37',
        question: "Does wallet store Pi inside your phone?",
        options: ["Yes, in the chip", "No, Pi is on the Blockchain; wallet is just a key", "Yes, in storage", "Yes, in SIM"],
        correct: 1,
        explanation: "Coins live on the global ledger (blockchain). Wallet stores the key to move them.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'blockchain-concept', trapType: 'physical-misconception'
    },
    {
        id: 'q-wallet-38',
        question: "Can you reset wallet if empty?",
        options: ["Yes, create new one", "No", "Only once", "Pay fee"],
        correct: 0,
        explanation: "You can generate endless new wallets (but verify the correct one for migration).",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'management', trapType: 'none'
    },
    {
        id: 'q-wallet-39',
        question: "What is 'Notifications' in wallet?",
        options: ["Ads", "Alerts for incoming payments", "News", "Emails"],
        correct: 1,
        explanation: "Alerts you when funds arrive in your account.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'features', trapType: 'none'
    },
    {
        id: 'q-wallet-40',
        question: "Why is 24 words better than a password?",
        options: ["Harder to guess (Entropy)", "Easier to remember", "Cheaper", "It isn't"],
        correct: 0,
        explanation: "24 words provide astronomical possibilities, making brute-force hacking impossible.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'cryptography', trapType: 'none'
    },

    // === HARD (10 items) ===
    {
        id: 'q-wallet-41',
        question: "What is a 'Memo' in transactions?",
        options: ["A note to self", "Optional ID tag required by exchanges identifying the user", "A password", "A fee"],
        correct: 1,
        explanation: "Exchanges use one shared address. The Memo tells them WHICH user account to credit.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'advanced-transactions', trapType: 'omission-trap'
    },
    {
        id: 'q-wallet-42',
        question: "What happens if you send to Exchange without Memo?",
        options: ["It arrives fine", "Funds may be lost as Exchange doesn't know it's you", "It bounces back", "Fee doubles"],
        correct: 1,
        explanation: "Without Memo, the Exchange receives funds but doesn't know who sent them. Support ticket required.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'exchange-safety', trapType: 'none'
    },
    {
        id: 'q-wallet-43',
        question: "How does Pi Wallet sign transactions?",
        options: ["With a pen", "Mathematically using Ed25519 signature scheme", "With GPS", "With email"],
        correct: 1,
        explanation: "It uses Ed25519 elliptic curve cryptography to prove ownership without revealing private key.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'cryptography-advanced', trapType: 'technical-jargon'
    },
    {
        id: 'q-wallet-44',
        question: "Can you use same passphrase on other Stellar wallets?",
        options: ["No, never", "Technically yes (BIP-39 compatible), but risky", "Yes, recommended", "Only Bitcoin wallets"],
        correct: 1,
        explanation: "Pi uses standard BIP-39. Technically compatible, but using outside official app risks security.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'compatibility-deep', trapType: 'curiosity-trap'
    },
    {
        id: 'q-wallet-45',
        question: "What is 'Minimum Balance' error?",
        options: ["You are broke", "You try to send leaving less than required reserve (e.g. 1 Pi)", "System bug", "Network down"],
        correct: 1,
        explanation: "The protocol prevents emptying an account below the base reserve requirement.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'protocol-rules', trapType: 'none'
    },
    {
        id: 'q-wallet-46',
        question: "What is 'Dust' in crypto wallets?",
        options: ["Dirty screen", "Tiny amounts of crypto smaller than transaction fees", "Lost coins", "Old coins"],
        correct: 1,
        explanation: "Dust refers to trace amounts of crypto that are too small to happen to spend economically.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'terminology', trapType: 'literal-interpretation'
    },
    {
        id: 'q-wallet-47',
        question: "How does Seed Phrase derive keys?",
        options: ["Magic", "Deterministic derivation path (m/44'/...)", "Randomly", "Cloud sync"],
        correct: 1,
        explanation: "It follows a specific mathematical path to generate the key pair consistently every time.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'derivation', trapType: 'technical-complexity'
    },
    {
        id: 'q-wallet-48',
        question: "Why can't support recover passphrase?",
        options: ["They are lazy", "Zero-Knowledge architecture means they never see/store it", "It costs money", "Policy"],
        correct: 1,
        explanation: "The system is designed so ONLY the user device handles the keys. Server sees only encrypted signatures.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'architecture-privacy', trapType: 'blame-trap'
    },
    {
        id: 'q-wallet-49',
        question: "What is a 'Cold Wallet' setup for Pi?",
        options: ["Phone in fridge", "Using a device never connected to internet to sign transactions", "Deleted wallet", "Paper wallet"],
        correct: 1,
        explanation: "Signing transactions on an offline device and broadcasting via online device (air-gapped).",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'extreme-security', trapType: 'literal-interpretation'
    },
    {
        id: 'q-wallet-50',
        question: "What implies 'Not your keys, not your coins'?",
        options: ["A slogan", "If you leave crypto on custodial exchange, you don't really own it", "Keys are coins", "Nothing"],
        correct: 1,
        explanation: "Fundamental crypto maxim: ownership depends entirely on holding the private keys yourself.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'philosophy', trapType: 'cliche-trap'
    }
];
