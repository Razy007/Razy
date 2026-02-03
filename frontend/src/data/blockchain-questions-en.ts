import { QuizQuestion } from '../types';

export const BLOCKCHAIN_QUESTIONS_EN: QuizQuestion[] = [
    // === EASY (20 items) ===
    {
        id: 'q-blockchain-1',
        question: "What is a blockchain?",
        options: ["Central database", "Distributed immutable ledger", "Social network", "Mining software"],
        correct: 1,
        explanation: "A digital ledger of transactions distributed across many computers, permanent and secure.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'blockchain-basics', trapType: 'none'
    },
    {
        id: 'q-blockchain-2',
        question: "What does 'Decentralized' mean?",
        options: ["Single owner", "No central authority control", "In a basement", "Government run"],
        correct: 1,
        explanation: "Power is spread among all participants rather than held by one CEO or bank.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'decentralization', trapType: 'none'
    },
    {
        id: 'q-blockchain-3',
        question: "What is a 'Block'?",
        options: ["Game item", "Bundle of transactions linked together", "Virus", "Password"],
        correct: 1,
        explanation: "A container for a batch of valid transactions, chained to previous blocks.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'blocks', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-4',
        question: "What is a Block Hash?",
        options: ["Name", "Unique digital fingerprint", "Size", "Color"],
        correct: 1,
        explanation: "Cryptographic signature identifying the block and its contents uniquely.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'hashing', trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-5',
        question: "Pi Consensus Protocol?",
        options: ["Proof of Work", "Proof of Stake", "Stellar Consensus Protocol (SCP)", "Proof of Authority"],
        correct: 2,
        explanation: "Pi uses SCP, which relies on trust graphs rather than energy burning.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'consensus', trapType: 'bitcoin-comparison'
    },
    {
        id: 'q-blockchain-6',
        question: "Why 'Immutable'?",
        options: ["Broken", "Cannot be changed or erased once written", "Silent", "Static"],
        correct: 1,
        explanation: "Once recorded, history cannot be altered without breaking the entire chain.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'immutability', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-7',
        question: "What is a Node?",
        options: ["Glitch", "Computer participating in the network", "Virus", "Bonus"],
        correct: 1,
        explanation: "A device running Pi software to validate and store the ledger.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'nodes', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-8',
        question: "What is a Transaction?",
        options: ["Shopping", "Transfer of value recorded on ledger", "Email", "Call"],
        correct: 1,
        explanation: "Record of sending Pi from Address A to Address B.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'transactions', trapType: 'none'
    },
    {
        id: 'q-blockchain-9',
        question: "What is Pi Mining?",
        options: ["Digging", "Securing network for rewards", "Hacking", "Gaming"],
        correct: 1,
        explanation: "Contributing to network security/utility and earning Pi.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'mining', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-10',
        question: "Why no battery drain?",
        options: ["Impossible", "SCP doesn't use heavy calculations (PoW)", "Solar", "Lie"],
        correct: 1,
        explanation: "Mining is about trust (signatures), not computing trillions of hashes.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'energy-efficiency', trapType: 'skepticism'
    },
    {
        id: 'q-blockchain-11',
        question: "Security Circle?",
        options: ["Traffic", "Trust graph connections protecting network", "Antivirus", "Insurance"],
        correct: 1,
        explanation: "3-5 trusted people you vouch for, building the global trust graph.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'security-circle', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-12',
        question: "Blockchain Explorer?",
        options: ["Browser", "Tool to view/search ledger data", "Game", "Robot"],
        correct: 1,
        explanation: "Website showing live blocks and transactions (transparency).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'blockchain-explorer', trapType: 'none'
    },
    {
        id: 'q-blockchain-13',
        question: "Transaction ID (TxHash)?",
        options: ["No", "Yes, unique receipts for every transfer", "Sometimes", "Big ones only"],
        correct: 1,
        explanation: "Every transfer has a unique ID string to track it.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'transaction-id', trapType: 'none'
    },
    {
        id: 'q-blockchain-14',
        question: "Mainnet?",
        options: ["Dating site", "Live production blockchain with real value", "Test", "Game"],
        correct: 1,
        explanation: "The 'Real' network where coins are real assets.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'mainnet', trapType: 'none'
    },
    {
        id: 'q-blockchain-15',
        question: "Testnet?",
        options: ["Fishing", "Sandbox for testing without real value", "Main", "Virus"],
        correct: 1,
        explanation: "Playground for devs to test apps without risking real money.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'testnet', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-16',
        question: "Size of Pi Community?",
        options: ["1M", "10M", "50M+", "1B"],
        correct: 2,
        explanation: "One of the largest crypto communities globally.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'community-size', trapType: 'none'
    },
    {
        id: 'q-blockchain-17',
        question: "What is a dApp?",
        options: ["Dance app", "Decentralized Application running on blockchain", "Virus", "Dating"],
        correct: 1,
        explanation: "Apps built on the Pi Platform utilizing the blockchain backend.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'dapps', trapType: 'phonetic-confusion'
    },
    {
        id: 'q-blockchain-18',
        question: "Who can see transactions?",
        options: ["Team only", "Publicly visible to everyone", "Govt", "No one"],
        correct: 1,
        explanation: "Blockchains are transparent public records.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'transparency', trapType: 'privacy-misconception'
    },
    {
        id: 'q-blockchain-19',
        question: "What secures Pi?",
        options: ["Passwords", "Cryptography & Distributed Consensus", "Antivirus", "Police"],
        correct: 1,
        explanation: "Math and collective agreement, not force.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'security', trapType: 'none'
    },
    {
        id: 'q-blockchain-20',
        question: "Trust Graph?",
        options: ["Chart", "Web of trust relationships enabling SCP consensus", "Game", "Price"],
        correct: 1,
        explanation: "Who trusts whom. This map prevents bad actors from taking over.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'trust-graph', trapType: 'none'
    },

    // === MEDIUM (20 items) ===
    {
        id: 'q-blockchain-21',
        question: "PoW vs SCP?",
        options: ["None", "PoW burns energy; SCP uses social trust", "PoW newer", "SCP slower"],
        correct: 1,
        explanation: "Bitcoin (PoW) uses electricity. Pi (SCP) uses relationships.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'consensus-comparison', trapType: 'none'
    },
    {
        id: 'q-blockchain-22',
        question: "Byzantine Fault Tolerance?",
        options: ["History", "System works even if some nodes are traitors/offline", "Electricity", "Central"],
        correct: 1,
        explanation: "Resilience against malicious actors or failures.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'bft', trapType: 'historical-reference'
    },
    {
        id: 'q-blockchain-23',
        question: "Quorum Slice?",
        options: ["Pizza", "Subset of nodes a node trusts to agree with", "Vote", "Update"],
        correct: 1,
        explanation: "The group of nodes YOUR node listens to for truth.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'quorum-slices', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-blockchain-24',
        question: "Why SCP over PoS?",
        options: ["PoS expensive", "SCP is inclusive (no wealth requirement) & provable", "PoS fake", "Same"],
        correct: 1,
        explanation: "Proof of Stake makes rich richer. SCP allows merit-based contribution.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'scp-vs-pos', trapType: 'none'
    },
    {
        id: 'q-blockchain-25',
        question: "Sybil Attack?",
        options: ["Virus", "One person creating many fake identities to cheat", "Mining", "Update"],
        correct: 1,
        explanation: "Flooding network with bots. KYC prevents this.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'sybil-attack', trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-26',
        question: "How Security Circles stop Sybil?",
        options: ["Magic", "Humans vouch for humans, isolating bots", "Algo", "None"],
        correct: 1,
        explanation: "Bots can't get real humans to trust them in circles.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'sybil-protection', trapType: 'none'
    },
    {
        id: 'q-blockchain-27',
        question: "Finality?",
        options: ["End of world", "Guarantee transaction cannot be reversed", "Tax", "Cancel"],
        correct: 1,
        explanation: "When it's done, it's done. 100% confirmed.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'finality', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-28',
        question: "Pi Confirmation Speed?",
        options: ["1 hour", "3-5 Seconds", "1 day", "1 week"],
        correct: 1,
        explanation: "Blazing fast compared to Bitcoin's 10-60 mins.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'transaction-speed', trapType: 'bitcoin-comparison'
    },
    {
        id: 'q-blockchain-29',
        question: "Ledger?",
        options: ["Brand", "The record book of all transactions", "Wallet", "Bonus"],
        correct: 1,
        explanation: "The database containing 'Who owns what'.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'ledger', trapType: 'brand-confusion'
    },
    {
        id: 'q-blockchain-30',
        question: "Fork?",
        options: ["Cutlery", "Chain splits into two versions", "Mining", "Update"],
        correct: 1,
        explanation: "Divergence in the blockchain path.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'forks', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-31',
        question: "Hard vs Soft Fork?",
        options: ["Texture", "Hard = Incompatible (Split), Soft = Backward Compatible", "Speed", "None"],
        correct: 1,
        explanation: "Hard fork requires everyone to update. Soft fork works with old nodes.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'fork-types', trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-32',
        question: "Smart Contract?",
        options: ["Paper", "Self-executing code on blockchain", "Lawyer", "Job"],
        correct: 1,
        explanation: "Code that runs automatically when rules are met (e.g. Escrow).",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'smart-contracts', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-33',
        question: "Scalability?",
        options: ["Limits", "Ability to handle varied throughput/growth", "Slow", "No"],
        correct: 1,
        explanation: "Pi is designed to handle millions of users/txs.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'scalability', trapType: 'none'
    },
    {
        id: 'q-blockchain-34',
        question: "TPS?",
        options: ["Stake", "Transactions Per Second", "Tax", "Time"],
        correct: 1,
        explanation: "Metric of network speed/capacity.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'tps', trapType: 'acronym-confusion'
    },
    {
        id: 'q-blockchain-35',
        question: "Coin vs Token?",
        options: ["Same", "Coin = Native Blockchain (Pi), Token = Built on top", "Token > Coin", "Coin new"],
        correct: 1,
        explanation: "Pi is a Coin (Layer 1). Apps might issue Tokens (Layer 2) on Pi.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'coin-vs-token', trapType: 'terminology-confusion'
    },
    {
        id: 'q-blockchain-36',
        question: "Why Eco-friendly?",
        options: ["Less servers", "No massive mining farms burning coal (SCP)", "Trees", "Marketing"],
        correct: 1,
        explanation: "You can run a node on a laptop, not a warehouse of ASICs.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'eco-friendly', trapType: 'marketing-skepticism'
    },
    {
        id: 'q-blockchain-37',
        question: "Interoperability?",
        options: ["Languages", "Blockchains talking to each other", "Phones", "Mining"],
        correct: 1,
        explanation: "Connecting Pi to other networks like Ethereum or Stellar.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'interoperability', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-38',
        question: "Mempool?",
        options: ["Pool", "Waiting room for unconfirmed transactions", "Wallet", "Game"],
        correct: 1,
        explanation: "Holding area before transactions are picked into a block.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'mempool', trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-39',
        question: "Prevent Double-Spending?",
        options: ["Willpower", "Consensus orders transactions sequentially", "Law", "Impossible"],
        correct: 1,
        explanation: "You can't spend the same digital dollar twice because nodes track state.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'double-spending', trapType: 'none'
    },
    {
        id: 'q-blockchain-40',
        question: "Genesis Block?",
        options: ["Sega", "The very first block (Block 0)", "Bonus", "Last block"],
        correct: 1,
        explanation: "The start of the chain.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'genesis-block', trapType: 'pop-culture-reference'
    },

    // === HARD (10 items) ===
    {
        id: 'q-blockchain-41',
        question: "Federated Byzantine Agreement (FBA)?",
        options: ["Vote", "Consensus via individual trust choices overlapping", "Lottery", "Mining"],
        correct: 1,
        explanation: "The class of consensus algorithm Pi/Stellar uses.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'fba', trapType: 'technical-complexity'
    },
    {
        id: 'q-blockchain-42',
        question: "Safety vs Liveness?",
        options: ["Ads", "Safety = No conflicts, Liveness = Always moving", "Mining", "Bonus"],
        correct: 1,
        explanation: "Distributed systems tradeoff. Pi prioritizes Safety (Correctness).",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'safety-liveness', trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-43',
        question: "Trust Graph influence?",
        options: ["None", "Determines Quorums (who validates)", "Speed", "Price"],
        correct: 1,
        explanation: "Your circles actually build the validation topology.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'trust-graph-consensus', trapType: 'none'
    },
    {
        id: 'q-blockchain-44',
        question: "Byzantine General Problem?",
        options: ["War", "Agreeing when spies are present", "Bug", "Game"],
        correct: 1,
        explanation: "Classic CS problem: reaching consensus in an unreliable system.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'byzantine-generals', trapType: 'historical-reference'
    },
    {
        id: 'q-blockchain-45',
        question: "Block Propagation?",
        options: ["Plants", "Spreading new block data to all nodes", "Marketing", "Breeding"],
        correct: 1,
        explanation: "Speed of data travel across network.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'block-propagation', trapType: 'literal-interpretation'
    },
    {
        id: 'q-blockchain-46',
        question: "State Machine Replication?",
        options: ["Copying", "Nodes executing same log getting same result", "Repair", "Install"],
        correct: 1,
        explanation: "How blockchains keep data synced: same input + same logic = same state.",
        difficulty: 'hard', cognitiveLevel: 'comprehension', topic: 'smr', trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-47',
        question: "Geographic Decentralization?",
        options: ["Mail", "Nodes in many countries preventing local shutdown", "Satellite", "Central"],
        correct: 1,
        explanation: "Pi's global userbase makes it resistant to regional regulations/failures.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'geographic-decentralization', trapType: 'none'
    },
    {
        id: 'q-blockchain-48',
        question: "Light vs Full Node?",
        options: ["Fast", "Light = Headers only (Mobile), Full = History (PC)", "Mobile", "Same"],
        correct: 1,
        explanation: "Phones can't store TBs of data, so they verify headers.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'node-types', trapType: 'none'
    },
    {
        id: 'q-blockchain-49',
        question: "Sharding?",
        options: ["Breaking", "Splitting chain into parallel partitions", "Mining", "Virus"],
        correct: 1,
        explanation: "Scaling method to process more transactions in parallel.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'sharding', trapType: 'technical-jargon'
    },
    {
        id: 'q-blockchain-50',
        question: "Asymmetric Cryptography?",
        options: ["Passwords", "Public/Private Key pair system", "Firewall", "Antivirus"],
        correct: 1,
        explanation: "One key to lock (Public), one differently key to unlock (Private).",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'asymmetric-cryptography', trapType: 'none'
    }
];
