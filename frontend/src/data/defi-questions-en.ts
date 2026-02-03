import { QuizQuestion } from '../types';

export const DEFI_QUESTIONS_EN: QuizQuestion[] = [
    // === EASY (20 items) ===
    {
        id: 'q-defi-1',
        question: "What does DeFi mean?",
        options: ["Digital Finance", "Decentralized Finance", "Default Finance", "Defined Finance"],
        correct: 1,
        explanation: "DeFi = Decentralized Finance, financial services without traditional intermediaries.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'defi-basics', trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-2',
        question: "Difference between DeFi and Bank?",
        options: ["DeFi has no fees", "DeFi removes the middleman (peer-to-peer)", "Banks are digital", "Same"],
        correct: 1,
        explanation: "DeFi uses smart contracts to replace bankers.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'defi-vs-tradfi', trapType: 'none'
    },
    {
        id: 'q-defi-3',
        question: "What is a DEX?",
        options: ["Dog", "Decentralized Exchange (like Uniswap)", "Index", "Stock"],
        correct: 1,
        explanation: "A marketplace where users trade crypto directly without an admin.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'dex', trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-4',
        question: "What is Staking?",
        options: ["Cooking", "Locking coins to earn rewards/interest", "Mining", "Selling"],
        correct: 1,
        explanation: "Earning passive income by locking your assets to support the network.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'staking', trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-5',
        question: "What is a Liquidity Pool?",
        options: ["Swimming pool", "Pile of funds locked in a smart contract for trading", "Bank vault", "Bonus"],
        correct: 1,
        explanation: "Users deposit pairs of tokens to facilitate trading for others.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'liquidity-pools', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-defi-6',
        question: "Risk of DeFi?",
        options: ["None", "Smart Contract Bugs / Hacks", "Low interest", "Too fast"],
        correct: 1,
        explanation: "Code vulnerabilities can lead to theft of funds.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'defi-risks', trapType: 'none'
    },
    {
        id: 'q-defi-7',
        question: "What is Yield Farming?",
        options: ["Agriculture", "Moving crypto around to maximize return rates", "Mining", "Gaming"],
        correct: 1,
        explanation: "Chasing the highest APY across different protocols.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'yield-farming', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-defi-8',
        question: "What is a Stablecoin?",
        options: ["Bitcoin", "Crypto pegged to a stable asset (like USD)", "Volatile coin", "Old coin"],
        correct: 1,
        explanation: "Designed to maintain a steady value (e.g. 1 USDC = $1).",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'stablecoins', trapType: 'none'
    },
    {
        id: 'q-defi-9',
        question: "Collateral?",
        options: ["Damage", "Asset pledged to secure a loan", "Fee", "Profit"],
        correct: 1,
        explanation: "You deposit ETH/Pi to borrow other assets against it.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'collateral', trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-10',
        question: "Gas Fee?",
        options: ["Petrol", "Transaction cost paid to network validators", "Tax", "Free"],
        correct: 1,
        explanation: "You pay gas (in Pi/ETH) to process your transaction.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'gas', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-defi-11',
        question: "APY?",
        options: ["App", "Annual Percentage Yield (Interest)", "Pay", "Year"],
        correct: 1,
        explanation: "How much interest you earn in a year.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'apy', trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-12',
        question: "TVL?",
        options: ["TV Channel", "Total Value Locked in a protocol", "Travel", "Time"],
        correct: 1,
        explanation: "Metric showing how much money is deposited in a DeFi app.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'tvl', trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-13',
        question: "Metamask / Pi Wallet role?",
        options: ["None", "The interface to connect to DeFi apps", "Bank", "Game"],
        correct: 1,
        explanation: "You need a Web3 wallet to interact with dApps.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'web3-wallets', trapType: 'none'
    },
    {
        id: 'q-defi-14',
        question: "Can you borrow without ID in DeFi?",
        options: ["No", "Yes, it is permissionless (uses collateral)", "Only rich", "Maybe"],
        correct: 1,
        explanation: "Smart contracts don't care who you are, only about your collateral.",
        difficulty: 'easy', cognitiveLevel: 'comprehension', topic: 'permissionless', trapType: 'none'
    },
    {
        id: 'q-defi-15',
        question: "Difference CEX vs DEX?",
        options: ["Spelling", "CEX = Company (Binance), DEX = Code (Uniswap)", "Same", "CEX better"],
        correct: 1,
        explanation: "Custodial (Company) vs Non-Custodial (Code).",
        difficulty: 'easy', cognitiveLevel: 'analysis', topic: 'cex-vs-dex', trapType: 'none'
    },
    {
        id: 'q-defi-16',
        question: "Wrapping (wPi)?",
        options: ["Gift", "Tokenizing a coin to use on another standard/chain", "Hiding", "Fee"],
        correct: 1,
        explanation: "Converting Pi to 'Wrapped Pi' to use in DeFi smart contracts.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'wrapped-tokens', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-defi-17',
        question: "Impermanent Loss?",
        options: ["Permanent", "Loss due to price divergence while providing liquidity", "Profit", "Fee"],
        correct: 1,
        explanation: "Risk for liquidity providers when prices change drastically compared to holding.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'impermanent-loss', trapType: 'paradox-trap'
    },
    {
        id: 'q-defi-18',
        question: "DAO?",
        options: ["Taoism", "Decentralized Autonomous Organization (Voters manage app)", "Food", "Art"],
        correct: 1,
        explanation: "Organization run by code and token-holder votes.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'dao', trapType: 'none'
    },
    {
        id: 'q-defi-19',
        question: "Slippage?",
        options: ["Falling", "Difference between expected price and execution price", "Fee", "Speed"],
        correct: 1,
        explanation: "Price changing while your trade is processing.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'slippage', trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-20',
        question: "Airdrop?",
        options: ["Plane", "Free tokens distributed to users", "Crash", "Rain"],
        correct: 1,
        explanation: "Marketing tactic giving free crypto to early users.",
        difficulty: 'easy', cognitiveLevel: 'knowledge', topic: 'airdrops', trapType: 'literal-interpretation'
    },

    // === MEDIUM (20 items) ===
    {
        id: 'q-defi-21',
        question: "Automated Market Maker (AMM)?",
        options: ["Robot", "Algorithm pricing assets based on pool ratio (x*y=k)", "Banker", "Stock"],
        correct: 1,
        explanation: "Replaces order books with a mathematical formula for trading.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'amm', trapType: 'none'
    },
    {
        id: 'q-defi-22',
        question: "Flash Loan?",
        options: ["Fast cash", "Uncollateralized loan that must be repaid in SAME block", "Credit card", "Scam"],
        correct: 1,
        explanation: "Borrow millions for free, use it for arbitrage, repay instantly. If fail, tx reverts.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'flash-loans', trapType: 'too-good-to-be-true'
    },
    {
        id: 'q-defi-23',
        question: "Rug Pull in DeFi?",
        options: ["Carpet", "Devs removing all liquidity from pool", "Bug", "Update"],
        correct: 1,
        explanation: "Scammers drain the liquidity pool, leaving token holders with worthless coins.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'rug-pull', trapType: 'none'
    },
    {
        id: 'q-defi-24',
        question: "Oracle?",
        options: ["Matrix", "Feeds real-world data (prices) to smart contracts", "Future", "Past"],
        correct: 1,
        explanation: "Blockchains can't see the outside world. Oracles bring data in.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'oracles', trapType: 'mythology-trap'
    },
    {
        id: 'q-defi-25',
        question: "Over-collateralization?",
        options: ["Too much", "Depositing $150 to borrow $100", "Safe", "Risk"],
        correct: 1,
        explanation: "Protects the lender. Since crypto is volatile, you must deposit more than you borrow.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'lending-mechanics', trapType: 'none'
    },
    {
        id: 'q-defi-26',
        question: "Goucenance Token?",
        options: ["Ticket", "Token giving voting rights on protocol changes", "Money", "Picture"],
        correct: 1,
        explanation: "Holding these lets you vote on DAO proposals.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'governance', trapType: 'none'
    },
    {
        id: 'q-defi-27',
        question: "Why high APY in DeFi?",
        options: ["Magic", "High risk + no middlemen taking cut + incentives", "Scam", "Error"],
        correct: 1,
        explanation: "Yields come from trading fees and token incentives, but carry higher risk.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'yield-source', trapType: 'skepticism'
    },
    {
        id: 'q-defi-28',
        question: "Synthetics?",
        options: ["Fake", "Crypto assets tracking value of real assets (Gold, Stocks)", "Plastic", "None"],
        correct: 1,
        explanation: "Trading Apple stock or Gold price on the blockchain without owning the asset.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'synthetics', trapType: 'none'
    },
    {
        id: 'q-defi-29',
        question: "Bridge?",
        options: ["Road", "Protocol moving assets between blockchains", "Game", "Wall"],
        correct: 1,
        explanation: "Allows moving BTC to Ethereum or Pi to Solana.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'bridges', trapType: 'literal-interpretation'
    },
    {
        id: 'q-defi-30',
        question: "Liquidation?",
        options: ["Water", "Protocol selling your collateral because value dropped", "Sale", "Profit"],
        correct: 1,
        explanation: "If your collateral value falls below requirement, the system sells it to cover debt.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'liquidation', trapType: 'none'
    },
    {
        id: 'q-defi-31',
        question: "Layer 2?",
        options: ["Cake", "Scaling solution on top of main chain (lower fees)", "Backup", "Second chance"],
        correct: 1,
        explanation: "Optimism, Arbitrum, Lightning Network. Faster/Cheaper than Layer 1.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'layer2', trapType: 'none'
    },
    {
        id: 'q-defi-32',
        question: "MEV (Maximal Extractable Value)?",
        options: ["Tax", "Miners reordering txs for profit", "Fee", "Bonus"],
        correct: 1,
        explanation: "The 'Invisible Tax' where miners front-run your trades.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'mev', trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-33',
        question: "Composable (Money Legos)?",
        options: ["Toys", "DeFi apps plug into each other seamlessly", "Blocks", "Kids"],
        correct: 1,
        explanation: "You can use output of App A as input for App B.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'composability', trapType: 'metaphor-confusion'
    },
    {
        id: 'q-defi-34',
        question: "Audit?",
        options: ["Exam", "Security review of code by experts", "Tax", "Class"],
        correct: 1,
        explanation: "Crucial step to find bugs before launch. Never trust unaudited code.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'audits', trapType: 'none'
    },
    {
        id: 'q-defi-35',
        question: "Initial DEX Offering (IDO)?",
        options: ["IPO", "Launching a token directly on a DEX", "ICO", "IEO"],
        correct: 1,
        explanation: "Crowdfunding method using liquidity pools.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'ido', trapType: 'acronym-confusion'
    },
    {
        id: 'q-defi-36',
        question: "Infinite Approval risk?",
        options: ["Good", "Contract can drain ALL your tokens, not just one tx", "Bad", "Okay"],
        correct: 1,
        explanation: "Granting unlimited spend permission is risky if contract is malicious.",
        difficulty: 'medium', cognitiveLevel: 'application', topic: 'token-approvals', trapType: 'convenience-trap'
    },
    {
        id: 'q-defi-37',
        question: "Rebase Token?",
        options: ["Base", "Supply changes elastically to stabilize price", "Stable", "Fixed"],
        correct: 1,
        explanation: "Your wallet balance changes automatically. Complex and risky.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'rebase', trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-38',
        question: "Prediction Market?",
        options: ["Betting", "Betting on future outcomes (Politics, Weather)", "Stock", "Game"],
        correct: 1,
        explanation: "Using crowd wisdom to predict events.",
        difficulty: 'medium', cognitiveLevel: 'knowledge', topic: 'prediction-markets', trapType: 'none'
    },
    {
        id: 'q-defi-39',
        question: "Front-running?",
        options: ["Running", "Bot seeing your trade and buying before you to hike price", "Speed", "Win"],
        correct: 1,
        explanation: "Harmful practice increasing your costs.",
        difficulty: 'medium', cognitiveLevel: 'comprehension', topic: 'front-running', trapType: 'none'
    },
    {
        id: 'q-defi-40',
        question: "Why DeFi on Pi?",
        options: ["Fun", "Accessible to 50M+ users on mobile", "Slow", "Hard"],
        correct: 1,
        explanation: "Mass adoption potential via user-friendly mobile interface.",
        difficulty: 'medium', cognitiveLevel: 'analysis', topic: 'pi-defi-potential', trapType: 'none'
    },

    // === HARD (10 items) ===
    {
        id: 'q-defi-41',
        question: "Time-Weighted Average Price (TWAP)?",
        options: ["Clock", "Oracle method to resist manipulation", "Chart", "Fee"],
        correct: 1,
        explanation: "Averaging price over time to prevent flash-loan attacks manipulation.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'twap', trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-42',
        question: "Concentrated Liquidity (Uniswap V3)?",
        options: ["Juice", "Providing liquidity only in specific price range", "Water", "Cloud"],
        correct: 1,
        explanation: "Makes capital more efficient but increases impermanent loss risk.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'concentrated-liquidity', trapType: 'none'
    },
    {
        id: 'q-defi-43',
        question: "Zero-Knowledge Rollup?",
        options: ["Paper", "L2 scaling using cryptographic validity proofs", "Sushi", "Game"],
        correct: 1,
        explanation: "Batching transactions off-chain and proving they are valid securely.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'zk-rollups', trapType: 'technical-complexity'
    },
    {
        id: 'q-defi-44',
        question: "Calculating APY vs APR?",
        options: ["Same", "APY includes compounding, APR does not", "APR higher", "None"],
        correct: 1,
        explanation: "Compound interest (APY) makes a huge difference over time.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'financial-math', trapType: 'terminology-confusion'
    },
    {
        id: 'q-defi-45',
        question: "Algorithmic Stablecoin Risk?",
        options: ["None", "Death Spiral (Terra/Luna)", "Safe", "Fixed"],
        correct: 1,
        explanation: "If support mechanism fails, it can crash to zero (de-peg).",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'algo-stablecoins', trapType: 'none'
    },
    {
        id: 'q-defi-46',
        question: "Determine Smart Contract Proxy?",
        options: ["IP", "Upgradable contract pattern", "Server", "VPN"],
        correct: 1,
        explanation: "Allows devs to change logic later. Requires trust they won't change it maliciously.",
        difficulty: 'hard', cognitiveLevel: 'knowledge', topic: 'proxy-pattern', trapType: 'technical-jargon'
    },
    {
        id: 'q-defi-47',
        question: "Sybil Resistance in DeFi?",
        options: ["None", "PoH / Pi KYC preventing bot manipulation of airdrops", "Virus", "Fee"],
        correct: 1,
        explanation: "Ensuring fair distribution.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'sybil-resistance', trapType: 'none'
    },
    {
        id: 'q-defi-48',
        question: "Slippage Tolerance setting?",
        options: ["Wait", "Max price change allowed before reverting tx", "Speed", "Gas"],
        correct: 1,
        explanation: "Setting too high allows front-running. Setting too low fails tx.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'trading-settings', trapType: 'none'
    },
    {
        id: 'q-defi-49',
        question: "Liquidity Mining vs Staking?",
        options: ["Same", "LM = Providing LP tokens, Staking = Single Asset", "LM easy", "Staking hard"],
        correct: 1,
        explanation: "Subtle difference in risk and function.",
        difficulty: 'hard', cognitiveLevel: 'analysis', topic: 'defi-mechanics', trapType: 'terminology-confusion'
    },
    {
        id: 'q-defi-50',
        question: "Emergency Withdrawal in Contracts?",
        options: ["ATM", "Function to recover funds if UI down", "Run", "Panic"],
        correct: 1,
        explanation: "Interacting directly with contract to withdraw when frontend is offline.",
        difficulty: 'hard', cognitiveLevel: 'application', topic: 'smart-contract-interaction', trapType: 'none'
    }
];
