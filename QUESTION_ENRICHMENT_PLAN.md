# 📚 PLAN D'ENRICHISSEMENT: 550 QUESTIONS

## 🎯 OBJECTIF

Créer **50 questions par cours** pour les **11 cours** = **550 questions totales**

---

## ✅ STATUT ACTUEL

### COURS 1: Introduction à Pi Network

**Status**: ✅ **COMPLÉTÉ - 50 QUESTIONS**

**Breakdown**:

- Easy: 20 questions (40%)
- Medium: 20 questions (40%)
- Hard: 10 questions (20%)

**Topics couverts**:

- Pi Basics (6 questions)
- Pi Technology (10 questions)
- Pi Security (8 questions)
- Pi Economics (6 questions)
- Pi Mining (7 questions)
- Pi History (3 questions)
- Pi Ecosystem (5 questions)
- Pi Strategy (3 questions)
- Pi Philosophy (2 questions)

**Types de pièges**:

- None (simples)
- Similar-concepts
- Negative-framing
- Misconception
- False-analogy
- Scam-warning
- Fear-mongering
- Technical-depth
- Strategic-thinking
- Philosophical-depth

---

## 📋 COURS RESTANTS (10 COURS)

### COURS 2: Pi Wallet Mastery (50 questions)

**Topics à couvrir**:

- Wallet basics (passphrase, private keys)
- Security best practices
- Backup strategies
- Transaction management
- Multi-signature
- Custodial vs Non-custodial
- Wallet recovery
- Common mistakes
- Advanced features

**Difficulty split**: 15 easy / 25 medium / 10 hard

---

### COURS 3: Anti-Scam Best Practices (50 questions)

**Topics à couvrir**:

- Common scams (phishing, fake support, ponzi)
- Red flags identification
- Social engineering tactics
- Verification techniques
- Reporting scams
- Recovery procedures
- Prevention strategies
- Case studies
- Psychological manipulation

**Difficulty split**: 20 easy / 20 medium / 10 hard

---

### COURS 4: KYC Verification Guide (50 questions)

**Topics à couvrir**:

- KYC importance
- Document requirements
- Verification process
- Common issues
- Privacy concerns
- Yoti integration
- Identity protection
- Rejection reasons
- Appeals process

**Difficulty split**: 20 easy / 20 medium / 10 hard

---

### COURS 5: Blockchain Fundamentals (50 questions)

**Topics à couvrir**:

- Blockchain structure
- Hashing algorithms
- Consensus mechanisms
- Decentralization
- Smart contracts
- Distributed ledger
- Byzantine fault tolerance
- Immutability
- Scalability trilemma

**Difficulty split**: 10 easy / 25 medium / 15 hard

---

### COURS 6: DeFi Basics (50 questions)

**Topics à couvrir**:

- DeFi definition
- DEX vs CEX
- Liquidity pools
- Yield farming
- Staking
- Lending/Borrowing
- Impermanent loss
- DeFi risks
- DeFi protocols

**Difficulty split**: 15 easy / 20 medium / 15 hard

---

### COURS 7: Trading Strategies (50 questions)

**Topics à couvrer**:

- Technical analysis
- Chart patterns
- Indicators (RSI, MACD, etc.)
- Risk management
- Position sizing
- Stop loss/Take profit
- Market psychology
- Trading psychology
- Common mistakes

**Difficulty split**: 10 easy / 25 medium / 15 hard

---

### COURS 8: Smart Contracts 101 (50 questions)

**Topics à couvrir**:

- Smart contract definition
- Solidity basics
- Gas fees
- Contract deployment
- Security vulnerabilities
- Audits
- Use cases
- Limitations
- Best practices

**Difficulty split**: 10 easy / 25 medium / 15 hard

---

### COURS 9: NFTs & Digital Assets (50 questions)

**Topics à couvrir**:

- NFT definition
- Minting process
- Marketplaces
- Royalties
- Metadata
- Use cases (art, gaming, etc.)
- Valuation
- Storage (IPFS)
- Future trends

**Difficulty split**: 15 easy / 20 medium / 15 hard

---

### COURS 10: Pi Ecosystem Deep Dive (50 questions)

**Topics à couvrir**:

- dApps ecosystem
- Pi Browser
- Pi SDK
- Developer tools
- Community projects
- Partnerships
- Roadmap
- Governance
- Future vision

**Difficulty split**: 15 easy / 25 medium / 10 hard

---

### COURS 11: Advanced Security (50 questions)

**Topics à couvrir**:

- Cryptography basics
- Encryption methods
- 2FA/MFA
- Hardware wallets
- Cold storage
- Social engineering defense
- Incident response
- Security audits
- Advanced threats

**Difficulty split**: 10 easy / 20 medium / 20 hard

---

## 🎯 STRATÉGIE DE CRÉATION

### Template par Question

```typescript
{
    id: 'unique-id',
    question: "Question claire et précise?",
    options: [
        "Option A",
        "Option B (piège subtil)",
        "Option C (correcte)",
        "Option D (piège classique)"
    ],
    correct: 2,
    explanation: "Explication détaillée pourquoi C est correct et pourquoi les autres sont faux.",
    difficulty: 'easy' | 'medium' | 'hard',
    cognitiveLevel: 'knowledge' | 'comprehension' | 'application' | 'analysis',
    topic: 'specific-topic',
    trapType: 'none' | 'similar-concepts' | 'scam-warning' | etc.
}
```

### Distribution Cognitive

- **Knowledge** (30%): Recall de faits
- **Comprehension** (40%): Compréhension de concepts
- **Application** (20%): Appliquer connaissances
- **Analysis** (10%): Analyse et pensée critique

### Types de Pièges Variés

1. **None**: Questions straightforward
2. **Similar-concepts**: Options qui se ressemblent
3. **Misconception**: Basé sur croyances communes fausses
4. **Scam-warning**: Identifier arnaques
5. **False-analogy**: Comparaison Bitcoin/Pi trompeuse
6. **Fear-mongering**: Jouer sur la peur
7. **Wishful-thinking**: Ce qu'on veut croire
8. **Technical-depth**: Requiert compréhension technique
9. **Temporal-confusion**: Confondre passé/présent/futur
10. **Nuanced-comparison**: Différences subtiles

---

## 📊 MÉTRIQUES TOTALES

### Par Cours

- Questions: 50
- Facile: 10-20 (20-40%)
- Moyen: 20-25 (40-50%)
- Difficile: 10-20 (20-40%)

### Global (11 Cours)

- **Total questions**: 550
- **Easy**: ~165 (30%)
- **Medium**: ~275 (50%)
- **Hard**: ~110 (20%)

---

## ⏱️ TEMPS DE DÉVELOPPEMENT ESTIMÉ

**Par cours (50 questions)**:

- Recherche topics: 30 min
- Rédaction questions: 90 min
- Review & polish: 30 min
- **Total par cours**: ~2h30

**Total pour 10 cours restants**:

- 10 × 2h30 = **25 heures**

---

## 🚀 IMPLÉMENTATION

### Phase 1: Créer questionBank.ts ✅

- FAIT pour cours #1 (Introduction)

### Phase 2: Enrichir questionBank.ts

- Ajouter les 10 autres cours (500 questions)

### Phase 3: Modifier courses.ts

- Remplacer questions inline par référence à questionBank

### Phase 4: Update layer generation

- Utiliser `getRandomQuestions(layerId, 3)` au runtime

---

## 💡 RECOMMANDATION

**Vu l'ampleur (550 questions)**, je propose:

### Option A: Progressive (RECOMMANDÉ)

**Phase 1**: Cours critiques (1-4) = 200 questions

- Introduction ✅
- Wallet
- Anti-Scam
- KYC

**Phase 2**: Cours intermédiaires (5-8) = 200 questions

- Blockchain
- DeFi
- Trading
- Smart Contracts

**Phase 3**: Cours avancés (9-11) = 150 questions

- NFTs
- Ecosystem
- Advanced Security

### Option B: Complète immédiate

- Créer les 550 questions d'un coup
- Temps: ~25h de travail
- Fichier: ~15,000 lignes de code

---

## ✅ PROCHAINE ÉTAPE

**ATTENTE DE VOTRE DÉCISION**:

1. **Progressive** → Je commence par Wallet (cours #2, 50 questions)
2. **Complète** → Je génère tous les 550 questions maintenant

**Quelle option préférez-vous?**
