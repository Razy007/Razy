import { QuizQuestion } from '../types';

export const PREMIUM_QUESTIONS_EN: QuizQuestion[] = [
    // === MEDIUM (25 questions) ===
    {
        id: 'q-premium-1',
        question: "What tech base is Pi Network built on?",
        options: ["Bitcoin", "Ethereum", "Stellar Consensus Protocol (SCP)", "Solana"],
        correct: 2,
        explanation: "Pi is based on SCP, developed by David Mazières at Stanford.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'pi-foundation', trapType: 'none'
    },
    {
        id: 'q-premium-2',
        question: "Who created Pi Network?",
        options: ["MIT", "Stanford University PhDs (Nicolas Kokkalis, Chengdiao Fan)", "Harvard", "Anonymous"],
        correct: 1,
        explanation: "Created by Stanford PhDs specializing in distributed systems / HCI.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'founders', trapType: 'none'
    },
    {
        id: 'q-premium-3',
        question: "Meaning of 'Pi' (π) in the name?",
        options: ["Random", "Reference to π (3.14...) symbolizing infinity and accessibility", "Founder name", "Acronym"],
        correct: 1,
        explanation: "Symbolizes infinity, universal inclusion, and launch date (Pi Day).",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'naming', trapType: 'none'
    },
    {
        id: 'q-premium-4',
        question: "How does Trust Graph secure Pi againt Sybil?",
        options: ["Password", "Real humans attest to connections, creating verifiable trust web", "Captcha", "KYC only"],
        correct: 1,
        explanation: "Leverages real-world relationships to validate identity uniqueness.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'trust-graph-security', trapType: 'none'
    },
    {
        id: 'q-premium-5',
        question: "Pi Node Architecture types?",
        options: ["All same", "Tiered: Mobile, SuperNodes, Validator Nodes", "Server only", "Phone only"],
        correct: 1,
        explanation: "Hierarchical architecture based on device utility.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'node-architecture', trapType: 'none'
    },
    {
        id: 'q-premium-6',
        question: "Role of 'Contributor'?",
        options: ["Donate", "Add trusted people to Security Circle", "Coding", "Ads"],
        correct: 1,
        explanation: "Contributors strengthen the trust graph by vouching for others.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'roles', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-7',
        question: "Role of 'Ambassador'?",
        options: ["Diplomat", "Invite new Pioneers (growth)", "Travel", "Negotiation"],
        correct: 1,
        explanation: "Ambassadors recruit new members, expanding the network.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'roles', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-8',
        question: "How are Quorum Slices formed?",
        options: ["Random", "Based on user Security Circles and reputation", "Govt", "Core Team"],
        correct: 1,
        explanation: "They emerge from the trust graph created by users.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'quorum-formation', trapType: 'none'
    },
    {
        id: 'q-premium-9',
        question: "Why Mobile Mining model?",
        options: ["Cheap", "To democratize access - everyone has a phone", "Power save", "Accident"],
        correct: 1,
        explanation: "Allows average people to participate without expensive hardware.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'mobile-first', trapType: 'none'
    },
    {
        id: 'q-premium-10',
        question: "Pi App vs Pi Browser?",
        options: ["None", "App = Mining/Wallet; Browser = Gateway to Web3 Ecosystem", "Browser = Mine", "App = Game"],
        correct: 1,
        explanation: "Browser is the interface for decentralized applications.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'pi-apps', trapType: 'none'
    },
    {
        id: 'q-premium-11',
        question: "Base Mining Rate evolution?",
        options: ["Constant", "Decreases via Halving as network grows", "Increases", "Random"],
        correct: 1,
        explanation: "Scarcity model: rewards drop as userbase expands.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'mining-rate', trapType: 'none'
    },
    {
        id: 'q-premium-12',
        question: "Lockup Bonus?",
        options: ["Secret", "Commit to hold Pi for time -> higher mining rate", "One time", "Contest"],
        correct: 1,
        explanation: "Delayed gratification reward supporting long-term ecosystem health.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'lockup-bonus', trapType: 'none'
    },
    {
        id: 'q-premium-13',
        question: "Interoperability strategy?",
        options: ["None", "Bridges and standard protocols", "Copy code", "Email"],
        correct: 1,
        explanation: "Connecting Pi to external blockchains.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'interoperability', trapType: 'none'
    },
    {
        id: 'q-premium-14',
        question: "Pi Developer Platform?",
        options: ["Game", "SDK/API suite for building dApps", "Social", "Exchange"],
        correct: 1,
        explanation: "Tools ensuring devs can build useful utilities.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'developer-platform', trapType: 'none'
    },
    {
        id: 'q-premium-15',
        question: "Control of Inflation?",
        options: ["None", "Halvings, Max Supply cap, burning", "Prices", "Tax"],
        correct: 1,
        explanation: "Economic controls to preserve value.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'tokenomics', trapType: 'none'
    },
    {
        id: 'q-premium-16',
        question: "Mainnet checklist reqs?",
        options: ["Email", "KYC, Wallet conf, Lockup conf", "Pay", "Cert"],
        correct: 1,
        explanation: "Mandatory steps ensuring readiness for migration.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'migration-checklist', trapType: 'none'
    },
    {
        id: 'q-premium-17',
        question: "Privacy in KYC?",
        options: ["None", "Encryption, minimization, future ZKP", "Del", "No KYC"],
        correct: 1,
        explanation: "Balancing compliance with user privacy.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'privacy-kyc', trapType: 'none'
    },
    {
        id: 'q-premium-18',
        question: "Difference from other phone mining?",
        options: ["None", "Real academic team, real consensus (SCP), real utility focus", "Logo", "Country"],
        correct: 1,
        explanation: "Not just a clicker game; robust underlying tech.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'differentiation', trapType: 'none'
    },
    {
        id: 'q-premium-19',
        question: "Enclosed Mainnet goal?",
        options: ["Close", "Test economy in isolation, build utility", "Limit", "Price"],
        correct: 1,
        explanation: "Building value loop internally before external exposure.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'enclosed-mainnet', trapType: 'none'
    },
    {
        id: 'q-premium-20',
        question: "Network Health Metrics?",
        options: ["Profit", "Active Nodes, Latency, Distribution", "Complaints", "Ads"],
        correct: 1,
        explanation: "Technical indicators of stability.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'network-health', trapType: 'none'
    },
    {
        id: 'q-premium-21',
        question: "Pi SDK features?",
        options: ["Mine", "Auth & Payments integration", "Hack", "Virus"],
        correct: 1,
        explanation: "Allows apps to identify users and request Pi payments.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'pi-sdk', trapType: 'none'
    },
    {
        id: 'q-premium-22',
        question: "App Payment Flow?",
        options: ["Card", "SDK -> User Approve -> Blockchain -> Callback", "Wire", "Email"],
        correct: 1,
        explanation: "On-chain settlement triggered by user action in app.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'payment-flow', trapType: 'none'
    },
    {
        id: 'q-premium-23',
        question: "Ecosystem Goal?",
        options: ["Currency", "Full economy (Marketplace, Services) driven by Pi", "Social", "Game"],
        correct: 1,
        explanation: "Creating circular utility, not just speculation.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'ecosystem-vision', trapType: 'none'
    },
    {
        id: 'q-premium-24',
        question: "Hackathon purpose?",
        options: ["Prize", "Spark innovation & content creation", "Marketing", "Jobs"],
        correct: 1,
        explanation: "Crowdsourcing utility creation.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'hackathons', trapType: 'none'
    },
    {
        id: 'q-premium-25',
        question: "Long term value driver?",
        options: ["Team", "Utility & Adoption vs Scarcity", "Influencers", "Govt"],
        correct: 1,
        explanation: "Fundamental economics: Supply and Demand.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'value-drivers', trapType: 'none'
    },

    // === HARD (25 questions) ===
    {
        id: 'q-premium-26',
        question: "FBA vs PBFT?",
        options: ["None", "FBA = Open membership (Dynamic Quorums), PBFT = Closed", "FBA Slow", "PBFT Decentralized"],
        correct: 1,
        explanation: "FBA allows organic growth without central list.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'fba-vs-pbft', trapType: 'technical-comparison'
    },
    {
        id: 'q-premium-27',
        question: "Quorum Intersection importance?",
        options: ["Road", "Ensures global consensus (no split brain)", "Vote", "Error"],
        correct: 1,
        explanation: "Overlap prevents distinct groups from agreeing on different truths.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'quorum-intersection', trapType: 'technical-jargon'
    },
    {
        id: 'q-premium-28',
        question: "Eclipse Attack prevention?",
        options: ["Sun", "Diverse connections & anomaly detection", "Firewall", "Impossible"],
        correct: 1,
        explanation: "Harder to isolate a node that connects to diverse peers.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'eclipse-attacks', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-29',
        question: "Ballot Protocol?",
        options: ["Vote", "Mechanism to propose/accept values", "Dance", "Tx"],
        correct: 1,
        explanation: "Core SCP mechanic for agreeing on statements.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'ballot-protocol', trapType: 'technical-jargon'
    },
    {
        id: 'q-premium-30',
        question: "Nomination Protocol?",
        options: ["President", "Selecting candidate values for consensus", "Random", "Age"],
        correct: 1,
        explanation: "Phase where nodes suggest what to agree on.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'nomination-protocol', trapType: 'none'
    },
    {
        id: 'q-premium-31',
        question: "Safety Property?",
        options: ["Secure", "Honest nodes never validate conflicting values", "Encryption", "Password"],
        correct: 1,
        explanation: "Guarantee of consistency.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'safety-property', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-32',
        question: "Liveness Property?",
        options: ["Alive", "System makes progress (doesn't hang)", "Awake", "Server"],
        correct: 1,
        explanation: "Guarantee that transaction processing continues.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'liveness-property', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-33',
        question: "Latency Optimization?",
        options: ["Slow", "Efficient message routing & quorum structure", "5G", "Less users"],
        correct: 1,
        explanation: "Making consensus fast.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'latency-optimization', trapType: 'none'
    },
    {
        id: 'q-premium-34',
        question: "Catchup Mechanism?",
        options: ["Race", "Syncing missing history for lagging nodes", "School", "Bonus"],
        correct: 1,
        explanation: "Getting up to speed after being offline.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'catchup', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-35',
        question: "Dynamic Trust Graph?",
        options: ["Static", "Evolves as users change circles/reputation", "Manual", "Yearly"],
        correct: 1,
        explanation: "Adapts to network changes biologically.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'dynamic-trust-graph', trapType: 'none'
    },
    {
        id: 'q-premium-36',
        question: "Byzantine Tolerance limit?",
        options: ["Crash", "33% (1/3) of nodes in quorum", "Banned", "None"],
        correct: 1,
        explanation: "Mathematical limit for BFT systems.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'byzantine-tolerance', trapType: 'none'
    },
    {
        id: 'q-premium-37',
        question: "Split-brain prevention?",
        options: ["Surgery", "Quorum intersection", "Restart", "Impossible"],
        correct: 1,
        explanation: "Intersecting slices keep the brain whole.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'splitbrain-prevention', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-38',
        question: "Tier Model?",
        options: ["Tears", "Mobile (light), SuperNode (full), Validator", "Level", "Rank"],
        correct: 1,
        explanation: "Resource-based roles.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'tier-model', trapType: 'none'
    },
    {
        id: 'q-premium-39',
        question: "Asset Issuance?",
        options: ["Mail", "Creating custom tokens on Pi chain", "Buy", "Ban"],
        correct: 1,
        explanation: "Like ERC-20 but on Pi.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'asset-issuance', trapType: 'none'
    },
    {
        id: 'q-premium-40',
        question: "Horizon API?",
        options: ["Game", "Bridge between Core and Apps (REST API)", "Limit", "Space"],
        correct: 1,
        explanation: "Standard interface for querying ledger data.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'horizon-api', trapType: 'none'
    },
    {
        id: 'q-premium-41',
        question: "State Channels?",
        options: ["TV", "Off-chain txs settled on-chain later", "Tunnel", "Impossible"],
        correct: 1,
        explanation: "Scaling layer.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'state-channels', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-42',
        question: "Threshold Cryptography?",
        options: ["Pain", "Distributed key signing (no single point of failure)", "Level", "Pass"],
        correct: 1,
        explanation: "Security enhancement.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'threshold-crypto', trapType: 'none'
    },
    {
        id: 'q-premium-43',
        question: "Reputation System impact?",
        options: ["Likes", "Nodes with high rep chosen more in quorums", "Points", "None"],
        correct: 1,
        explanation: "Meritocratic consensus influence.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'reputation-system', trapType: 'none'
    },
    {
        id: 'q-premium-44',
        question: "Stellar Core relation?",
        options: ["Star", "Software Pi adapts for consensus", "CPU", "Satellite"],
        correct: 1,
        explanation: "The codebase ancestry.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'stellar-core', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-45',
        question: "Anchors?",
        options: ["Boat", "Gateways for fiat/assets <-> crypto", "GPS", "Influencer"],
        correct: 1,
        explanation: "On/Off ramps.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'anchors', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-46',
        question: "Path Payment?",
        options: ["Toll", "Send currency A, receive currency B (auto-swap)", "GPS", "Sub"],
        correct: 1,
        explanation: "Atomic multi-hop currency conversion.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'path-payment', trapType: 'literal-interpretation'
    },
    {
        id: 'q-premium-47',
        question: "Regulatory Compliance?",
        options: ["Ignore", "KYC/AML tools built-in", "Leave", "Bribe"],
        correct: 1,
        explanation: "Designed for real-world legal integration.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'regulatory-compliance', trapType: 'none'
    },
    {
        id: 'q-premium-48',
        question: "Network Effects?",
        options: ["SFX", "Value grows with user count ^2", "Less", "None"],
        correct: 1,
        explanation: "Metcalfe's law.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'network-effects', trapType: 'none'
    },
    {
        id: 'q-premium-49',
        question: "Utility vs Speculative Value?",
        options: ["Same", "Usefulness vs Gambling", "Lower", "Illegal"],
        correct: 1,
        explanation: "Sustainable value comes from utility.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'value-types', trapType: 'none'
    },
    {
        id: 'q-premium-50',
        question: "10-Year Vision?",
        options: ["Gone", "Global inclusive financial infrastructure", "Test", "Bank"],
        correct: 1,
        explanation: "Long-term paradigm shift.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'long-term-vision', trapType: 'none'
    }
];
