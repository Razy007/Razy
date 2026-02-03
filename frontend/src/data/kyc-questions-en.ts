import { QuizQuestion } from '../types';

export const KYC_QUESTIONS_EN: QuizQuestion[] = [
    // === EASY (20 items) ===
    {
        id: 'q-kyc-1',
        question: "What does KYC mean?",
        options: ["Know Your Crypto", "Know Your Customer", "Keep Your Coins", "Key Your Code"],
        correct: 1,
        explanation: "KYC = Know Your Customer, a mandatory identity verification process.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-basics', trapType: 'acronym-confusion'
    },
    {
        id: 'q-kyc-2',
        question: "Why is KYC mandatory on Pi Network?",
        options: ["To spy on you", "To ensure 1 account = 1 real person", "To sell data", "Optional"],
        correct: 1,
        explanation: "KYC ensures fairness by verifying that every Pi account belongs to a unique real human.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'kyc-purpose', trapType: 'conspiracy-trap'
    },
    {
        id: 'q-kyc-3',
        question: "Which documents are accepted for Pi KYC?",
        options: ["Business card", "Official Govt ID (Passport, ID Card, License)", "Profile photo", "Diploma"],
        correct: 1,
        explanation: "Only official government-issued identification documents are accepted.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-documents', trapType: 'none'
    },
    {
        id: 'q-kyc-4',
        question: "What happens if you don't do KYC?",
        options: ["Nothing", "You CANNOT migrate Pi to Mainnet", "Lose bonus only", "Do it later anytime"],
        correct: 1,
        explanation: "Without passing KYC, none of your mined Pi can be migrated to the Mainnet blockchain.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'kyc-consequences', trapType: 'procrastination-trap'
    },
    {
        id: 'q-kyc-5',
        question: "Is Pi KYC free?",
        options: ["No, costs $10", "Yes, totally free (costs 1 Pi from balance)", "Depends", "Costs fiat"],
        correct: 1,
        explanation: "Pi KYC does not cost fiat money. It costs 1 Pi (deducted later) to pay validators.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-cost', trapType: 'fee-scam'
    },
    {
        id: 'q-kyc-6',
        question: "Where must you perform KYC?",
        options: ["External website", "ONLY inside official Pi Browser (KYC.pi)", "Email", "Telegram"],
        correct: 1,
        explanation: "KYC takes place ONLY within the Pi Browser app. Any external link is a scam.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'kyc-location', trapType: 'phishing-trap'
    },
    {
        id: 'q-kyc-7',
        question: "How long does KYC validation take?",
        options: ["5 mins", "From minutes to months (depends on volume/clarity)", "1 year", "Instant"],
        correct: 1,
        explanation: "Timing varies wildly based on document clarity, country, and validator availability.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-timeline', trapType: 'instant-gratification'
    },
    {
        id: 'q-kyc-8',
        question: "Can you do KYC for someone else?",
        options: ["Yes help family", "NO, every person must do their OWN", "With permission", "Proxy"],
        correct: 1,
        explanation: "Liveness checks require the real person to be present. You cannot do it for others.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'kyc-personal', trapType: 'helpfulness-trap'
    },
    {
        id: 'q-kyc-9',
        question: "What if KYC is rejected?",
        options: ["Banned forever", "You can resubmit with better photos", "Pi seized", "Nothing"],
        correct: 1,
        explanation: "Rejection is often due to blurry photos. You usually get a chance to resubmit.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-rejection', trapType: 'fear-trap'
    },
    {
        id: 'q-kyc-10',
        question: "What photo is required?",
        options: ["Instagram pic", "Live Selfie + ID photo", "Pet photo", "Any"],
        correct: 1,
        explanation: "You must take a live selfie (liveness check) and photos of your ID document.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'kyc-selfie', trapType: 'none'
    },
    {
        id: 'q-kyc-11',
        question: "Is KYC data shared with third parties?",
        options: ["Yes all", "No, used only for verification (GDPR compliant)", "Sold for ads", "Public"],
        correct: 1,
        explanation: "Pi Network adheres to strict data privacy standards. Data is for identity verification only.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'kyc-privacy', trapType: 'privacy-fear'
    },
    {
        id: 'q-kyc-12',
        question: "Minimum age for KYC?",
        options: ["10", "16", "18 (varies by country laws)", "None"],
        correct: 2,
        explanation: "Generally 18 years old. Minors may have specific future processes with parental consent.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-age', trapType: 'none'
    },
    {
        id: 'q-kyc-13',
        question: "Redo KYC if you change phone?",
        options: ["Yes", "No, KYC is linked to account not device", "Every year", "Maybe"],
        correct: 1,
        explanation: "Verified status belongs to your account. Changing devices doesn't affect it.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'kyc-device', trapType: 'device-myth'
    },
    {
        id: 'q-kyc-14',
        question: "What is 'Liveness Check'?",
        options: ["Checking pulse", "AI verifying you are a real human, not a photo", "Bill", "Tax"],
        correct: 1,
        explanation: "You smile/move to prove you are a live human being and not a static picture.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'liveness-check', trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-15',
        question: "Can you change KYC info after submission?",
        options: ["Yes easily", "No, it's final (unless rejected)", "Monthly", "Paid"],
        correct: 1,
        explanation: "Submitted data is locked for verification. Double-check before sending!",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-permanence', trapType: 'casual-entry'
    },
    {
        id: 'q-kyc-16',
        question: "What does 'Pending' status mean?",
        options: ["Rejected", "Waiting for validators/AI to review", "Passed", "Failed"],
        correct: 1,
        explanation: "Pending means your application is in the queue being processed.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-status', trapType: 'status-confusion'
    },
    {
        id: 'q-kyc-17',
        question: "Who verifies the documents?",
        options: ["Robots only", "AI + Human Validators from community", "Government", "Core Team"],
        correct: 1,
        explanation: "A hybrid system: AI does heavy lifting, Human Validators check redacted snippets.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-validators', trapType: 'none'
    },
    {
        id: 'q-kyc-18',
        question: "Need internet for KYC?",
        options: ["No", "Yes, stable connection required", "Only for upload", "Mail it"],
        correct: 1,
        explanation: "You need a good data connection to upload heavy image files.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'kyc-requirements', trapType: 'offline-myth'
    },
    {
        id: 'q-kyc-19',
        question: "What if ID is expired?",
        options: ["Use it anyway", "Renew ID BEFORE KYC", "Photocopy it", "Edit date"],
        correct: 1,
        explanation: "Expired documents are invalid. You must use a valid, current ID.",
        difficulty: 'easy', cognitiveLevel: 'application', topic: 'kyc-document-validity', trapType: 'shortcut-trap'
    },
    {
        id: 'q-kyc-20',
        question: "Does KYC guarantee Pi value?",
        options: ["Yes $100", "No, it just enables migration. Value is market-driven", "Yes $314", "Fixed"],
        correct: 1,
        explanation: "KYC is a technical requirement for migration, not a value guarantee.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'kyc-value-misconception', trapType: 'guaranteed-value-myth'
    },

    // === MEDIUM (20 items) ===
    {
        id: 'q-kyc-21',
        question: "Why use Human Validators?",
        options: ["Cheaper", "Decentralized workforce better than centralized AI bias", "AI doesn't exist", "Jobs"],
        correct: 1,
        explanation: "Locals understand local ID documents better than a global AI.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'decentralized-kyc', trapType: 'none'
    },
    {
        id: 'q-kyc-22',
        question: "What is Decentralized Identity?",
        options: ["Paper ID", "Identity verified by distributed network", "Digital ID", "Passport"],
        correct: 1,
        explanation: "Moving away from central authorities holding all data to a distributed verification.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'decentralized-identity', trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-23',
        question: "Best way to avoid rejection?",
        options: ["Pay bribe", "Clear lighting, sharp focus, dark background", "Use fake ID", "Photoshop"],
        correct: 1,
        explanation: "Technical quality (lighting, focus) is the #1 reason for delays.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'kyc-best-practices', trapType: 'shortcut-trap'
    },
    {
        id: 'q-kyc-24',
        question: "What is AML?",
        options: ["Anti-Money Laundering", "All My Love", "App Mobile Light", "Auto Mine"],
        correct: 0,
        explanation: "Regulations preventing criminals from laundering illicit funds via crypto.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'aml', trapType: 'acronym-confusion'
    },
    {
        id: 'q-kyc-25',
        question: "Why selfie with ID?",
        options: ["Album", "Prove ownership of the document", "Optional", "Fun"],
        correct: 1,
        explanation: "Ensures the person holding the phone is the same person on the ID card.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'selfie-verification', trapType: 'questioning-trap'
    },
    {
        id: 'q-kyc-26',
        question: "What happens to non-KYC Pi after grace period?",
        options: ["Keep forever", "Burned/Redistributed to pool", "Validated", "Tripled"],
        correct: 1,
        explanation: "Unverified coins may eventually be returned to the mining pool (burned) after deadlines.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'kyc-deadline', trapType: 'procrastination-trap'
    },
    {
        id: 'q-kyc-27',
        question: "How is biometric data protected?",
        options: ["Not protected", "Encryption + GDPR compliance", "Sold", "Public"],
        correct: 1,
        explanation: "Security standards ensuring your face data isn't leaked.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'data-protection', trapType: 'privacy-fear'
    },
    {
        id: 'q-kyc-28',
        question: "What is a 'False Positive'?",
        options: ["Virus", "System wrongly rejecting a legitimate user", "Valid fake", "Bug"],
        correct: 1,
        explanation: "When the anti-fraud system gets over-aggressive and blocks a real person.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'verification-errors', trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-29',
        question: "Identify multpile accounts?",
        options: ["Yes easily", "Strictly forbidden and detected by AI", "Yes if different phone", "Yes"],
        correct: 1,
        explanation: "1 Person = 1 Account. Multi-accounting leads to banning.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'multi-account', trapType: 'loophole-trap'
    },
    {
        id: 'q-kyc-30',
        question: "What is Face Matching?",
        options: ["Game", "Comparing selfie geometry to ID photo", "Filter", "Trend"],
        correct: 1,
        explanation: "Algorithmic comparison of facial features.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'face-matching', trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-31',
        question: "Why turn head during selfie?",
        options: ["Awake check", "3D Liveness check", "Neck check", "Bug"],
        correct: 1,
        explanation: "Proves depth (3D object) rather than a 2D screen/photo spoof.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'liveness-detection', trapType: 'questioning-trap'
    },
    {
        id: 'q-kyc-32',
        question: "Meaning of 'KYC Passed'?",
        options: ["Failed", "Verified successfully", "Pending", "Redo"],
        correct: 1,
        explanation: "You are verified and eligible for migration.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'kyc-status', trapType: 'none'
    },
    {
        id: 'q-kyc-33',
        question: "What is OCR?",
        options: ["Virus", "Optical Character Recognition (reading text from image)", "Format", "Country"],
        correct: 1,
        explanation: "Technology that reads the Name/Date from your ID card image automatically.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'ocr-technology', trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-34',
        question: "How to detect fake IDs?",
        options: ["Impossible", "Holograms, fonts, texture analysis (AI)", "Call govt", "Email"],
        correct: 1,
        explanation: "Software checks for security features like holograms and micro-text.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'document-verification', trapType: 'none'
    },
    {
        id: 'q-kyc-35',
        question: "Name mismatch due to special chars?",
        options: ["Give up", "Appeal/Correction feature", "Change name", "Fake name"],
        correct: 1,
        explanation: "Pi allows minor name corrections/appeals for transliteration issues.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'kyc-special-cases', trapType: 'none'
    },
    {
        id: 'q-kyc-36',
        question: "Why natural light for selfie?",
        options: ["Pretty", "Avoids shadows/glare confusing the AI", "Mandatory", "Eco"],
        correct: 1,
        explanation: " Shadows can look like facial alterations or obscure features.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'kyc-photo-tips', trapType: 'none'
    },
    {
        id: 'q-kyc-37',
        question: "What is the Slot System?",
        options: ["Casino", "Queue management for KYC invites", "Bonus", "Game"],
        correct: 1,
        explanation: "Manages server load by inviting users in batches.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'kyc-queue', trapType: 'literal-interpretation'
    },
    {
        id: 'q-kyc-38',
        question: "Can they check for stolen ID?",
        options: ["No", "Yes, against global databases", "Only EU", "Only US"],
        correct: 1,
        explanation: "Systems cross-reference lost/stolen document registries.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'document-databases', trapType: 'none'
    },
    {
        id: 'q-kyc-39',
        question: "No ID document?",
        options: ["Borrow friend's", "Wait to get one legal", "Fake it", "Quit"],
        correct: 1,
        explanation: "You must obtain a legal ID. No workarounds.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'kyc-no-document', trapType: 'shortcut-trap'
    },
    {
        id: 'q-kyc-40',
        question: "KYC Global?",
        options: ["Yes", "Most countries (except sanctioned)", "US only", "EU only"],
        correct: 1,
        explanation: "Available in 200+ countries/territories.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'kyc-availability', trapType: 'none'
    },

    // === HARD (10 items) ===
    {
        id: 'q-kyc-41',
        question: "Zero-Knowledge Proof in KYC?",
        options: ["Impossible", "Proving age >18 without revealing DOB", "Hiding value", "None"],
        correct: 1,
        explanation: "Verifying a criteria is met without revealing the underlying private data.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'zkp-kyc', trapType: 'technical-complexity'
    },
    {
        id: 'q-kyc-42',
        question: "Self-Sovereign Identity (SSI)?",
        options: ["King", "User owns/controls their identity data", "No identity", "Changeable"],
        correct: 1,
        explanation: "You hold your credentials in your wallet, sharing only what you choose.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'self-sovereign-identity', trapType: 'conceptual-complexity'
    },
    {
        id: 'q-kyc-43',
        question: "3D Biometric Verification?",
        options: ["Glasses", "Mapping face depth to thwart screens/masks", "Printing", "VR"],
        correct: 1,
        explanation: "Ensures the face has volumatric depth (not a flat photo).",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: '3d-biometrics', trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-44',
        question: "Presentation Attack Detection (PAD)?",
        options: ["PowerPoint", "Detecting spoofing attempts (masks, videos)", "Hacking", "Virus"],
        correct: 1,
        explanation: "Tech detecting whether biometric sample is from live person or artifact.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'pad', trapType: 'technical-jargon'
    },
    {
        id: 'q-kyc-45',
        question: "Verifiable Credentials (VC)?",
        options: ["None", "Reusable digital proofs of identity", "Delete KYC", "More paper"],
        correct: 1,
        explanation: "Standard allowing you to present 'proof' of KYC to apps without re-uploading ID.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'verifiable-credentials', trapType: 'future-tech'
    },
    {
        id: 'q-kyc-46',
        question: "GDPR impact on KYC?",
        options: ["None", "Right to erasure, minimization, consent", "Store forever", "Share all"],
        correct: 1,
        explanation: "Users have rights to their data, requiring strict privacy controls.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'gdpr-kyc', trapType: 'legal-complexity'
    },
    {
        id: 'q-kyc-47',
        question: "Document Tampering Analysis?",
        options: ["Invisible", "AI spotting pixel inconsistencies/font exploits", "Manual", "X-ray"],
        correct: 1,
        explanation: "Detecting Photoshop edits via compression artifacts and font mismatches.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'tamper-detection', trapType: 'technical-complexity'
    },
    {
        id: 'q-kyc-48',
        question: "KYC Portability?",
        options: ["Moving paper", "One KYC valid across multiple Web3 apps", "Change country", "Edit"],
        correct: 1,
        explanation: "Verify once, use everywhere.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'kyc-portability', trapType: 'future-tech'
    },
    {
        id: 'q-kyc-49',
        question: "Handling 180+ country ID types?",
        options: ["Impossible", "Global template database + localized validators", "Auto translate", "Google"],
        correct: 1,
        explanation: "Scalability achieved by crowd-sourcing validator knowledge for local documents.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'global-kyc', trapType: 'scale-complexity'
    },
    {
        id: 'q-kyc-50',
        question: "Decentralized Identifier (DID)?",
        options: ["Phone #", "User-controlled ID anchored on blockchain", "Password", "Email"],
        correct: 1,
        explanation: "A standard URL scheme for identities that don't need a central registry.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'did', trapType: 'future-tech'
    }
];
