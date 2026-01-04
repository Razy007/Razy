import { DiscoveryContent } from '../components/education/DiscoveryViewer';

/**
 * CONTENU ENRICHI POUR LES DISCOVERY LAYERS
 * Ce fichier contient du contenu varié et engageant pour les différents types de présentation
 */

export const ENRICHED_DISCOVERY_CONTENT: Record<string, DiscoveryContent> = {
    'pi-intro-l1': {
        type: 'video',
        title: 'La Révolution Pi Network',
        description: 'Découvrez comment Pi Network démocratise la cryptomonnaie',
        duration: '5 min',
        visualUrl: 'https://www.youtube.com/embed/UhC7hi7PZSE', // Official Pi Network intro video
        content: `Pi Network représente une révolution dans le monde de la crypto. Pour la première fois, n'importe qui peut miner directement depuis son smartphone, sans équipement coûteux ni consommation excessive de batterie.

**Ce qui rend Pi unique:**

La technologie derrière Pi utilise le Stellar Consensus Protocol (SCP), un algorithme de consensus qui ne nécessite pas la puissance de calcul intensive du Proof of Work traditionnel. Cela signifie que votre téléphone peut participer au réseau sans se décharger en quelques heures!

**L'écosystème en croissance:**

Avec plus de 50 millions de pionniers à travers le monde, Pi Network construit une véritable économie peer-to-peer. Des développeurs créent des applications (dApps) qui utilisent Pi comme moyen de paiement, créant ainsi un écosystème vivant et en constante évolution.`,
        highlights: [
            'Comprendre le minage mobile et son fonctionnement',
            'Découvrir le Stellar Consensus Protocol (SCP)',
            'Explorer l\'écosystème dApps de Pi',
            'Visualiser la croissance de la communauté mondiale'
        ]
    },

    'wallet-l1-discovery': {
        type: 'case-study',
        title: 'Vos Clés, Votre Crypto',
        description: 'Étude de cas: Pourquoi le wallet non-custodial est crucial',
        content: `**Cas réel: L'effondrement de FTX**

En novembre 2022, FTX, l'une des plus grandes plateformes d'échange de cryptomonnaies, a fait faillite. Des millions d'utilisateurs ont perdu l'accès à leurs fonds car FTX détenait leurs clés privées (modèle custodial).

**Avec Pi Wallet (non-custodial):**
✅ VOUS détenez vos clés privées
✅ Personne d'autre ne peut accéder à vos Pi
✅ Pas de risque de faillite d'une plateforme centralisée

**Votre Passphrase = Votre Responsabilité**

Votre Passphrase de 24 mots est LA SEULE façon d'accéder à votre wallet. C'est comme la combinaison d'un coffre-fort dont vous êtes le seul à connaître le code. Perdez-la, et vos Pi sont perdus à jamais.

**Stockage Sécurisé:**
1. **Écrivez-la sur papier** (plusieurs copies)
2. **Coffre-fort physique** ou endroit très sécurisé
3. **JAMAIS en digital** (pas de photo, pas de cloud, pas d'email)
4. **Testez votre backup** en restaurant une fois

**Red Flag:** Quiconque vous demande votre Passphrase est un arnaqueur. Même la Core Team de Pi ne la demandera JAMAIS.`,
        highlights: [
            'Comprendre custodial vs non-custodial',
            'Analyser les risques des plateformes centralisées',
            'Apprendre les meilleures pratiques de stockage',
            'Identifier les arnaques courantes'
        ]
    },

    'safety-l1': {
        type: 'infographic',
        title: 'Les 3 Règles d\'Or Anti-Scam',
        description: 'Guide visuel pour ne jamais se faire arnaquer',
        content: `**🔴 RÈGLE #1: JAMAIS DE PASSPHRASE**

Votre Passphrase = Vos Pi. Partager = Perdre TOUT.
❌ Pas à la "Core Team"
❌ Pas à un "modérateur"
❌ Pas à votre "sponsor"
❌ Pas pour "débloquer le KYC"
❌ Pas pour "vérifier votre wallet"

**🟡 RÈGLE #2: UTILISEZ SEULEMENT LE OFFICIEL**

✅ Pi Browser (depuis l'app officielle Pi)
✅ Domaine: minepi.com
❌ Aucun autre site ou app

**🟢 RÈGLE #3: VÉRIFIEZ TOUT**

Avant de cliquer, de partager, ou de payer:
1. ✓ Vérifiez l'URL (minepi.com uniquement)
2. ✓ Pas de DM non sollicités
3. ✓ Pas de promesses d'échange fiat (durant Enclosed Mainnet)
4. ✓ Si c'est trop beau pour être vrai, c'est une arnaque

**🚨 ARNAQUES COURANTES:**

📧 **Phishing Emails**: "Urgent: Vérifiez votre wallet"
💬 **Faux Support**: DM non sollicités "pour vous aider"
💰 **Échange Fiat**: "Échangez vos Pi contre des $ maintenant"
🔗 **Faux Sites**: pi-network-verify.com, pi-wallet.net, etc.

**✅ QUOI FAIRE SI VOUS ÊTES CIBLÉ:**

1. 🛑 NE CLIQUEZ PAS
2. 📸 Screenshot = Preuve
3. 🚫 Bloquez l'arnaqueur
4. 📣 Signalez à la communauté`,
        highlights: [
            'Mémoriser les 3 règles d\'or',
            'Identifier les red flags visuellement',
            'Reconnaître les arnaques courantes',
            'Savoir réagir face à une tentative'
        ]
    },

    'kyc-l1': {
        type: 'article',
        title: 'KYC: Pourquoi c\'est Essential',
        description: 'Comprendre l\'importance du KYC pour l\'intégrité du réseau',
        content: `**Le Défi de l'Un-Personne-Un-Compte**

Dans les cryptomonnaies traditionnelles, rien n'empêche quelqu'un de créer 1000 comptes et de miner avec tous. Cela détruit l'équité et dilue la valeur pour les vrais utilisateurs.

**Solution de Pi: KYC (Know Your Customer)**

Le KYC garantit que chaque Pioneer est une personne réelle et unique. C'est crucial pour:

🚫 **Empêcher les Bots**
Imaginez si quelqu'un pouvait créer 10,000 comptes automatisés. Le réseau serait submergé de faux utilisateurs.

✅ **Protéger la Valeur**
Moins de comptes fictifs = Offre réelle limitée = Valeur préservée pour les vrais Pioneers.

⚖️ **Assurer l'Équité**
Tout le monde mine à la même vitesse, pas d'avantage injuste pour ceux qui créent des fermes de comptes.

**Le Processus KYC de Pi:**

1. **Soumission d'ID** - Document officiel (passeport, ID national)
2. **Liveness Check** - Selfie vidéo pour prouver que vous êtes réel
3. **Validation** - Algorithme + vérification humaine si nécessaire
4. **Période d'attente** - 14 jours de cooling-off
5. **Migration Mainnet** - Vos Pi sont transférés au Mainnet

**⏰ Soyez Patient**

Le KYC peut prendre du temps. La Core Team traite des millions de demandes. La qualité de la vérification prime sur la vitesse - c'est ce qui protège l'intégrité de TOUT le réseau.

**🔒 Vos Données Sont Protégées**

Pi Network utilise Yoti, un leader mondial de la vérification d'identité. Vos données sont cryptées et ne sont JAMAIS vendues à des tiers.`,
        highlights: [
            'Comprendre pourquoi 1 personne = 1 compte est crucial',
            'Découvrir les étapes du processus KYC',
            'Apprendre comment vos données sont protégées',
            'Gérer l\'attente avec patience et confiance'
        ]
    },

    'blockchain-l1': {
        type: 'demo',
        title: 'La Blockchain en Action',
        description: 'Démonstration interactive du fonctionnement d\'une blockchain',
        content: `**Simulation: Créons une blockchain ensemble!**

Imaginez un grand livre de comptes que tout le monde peut lire, mais que personne ne peut effacer ou modifier. C'est la blockchain!

**BLOC #1 (Genesis Block)**
┌─────────────────┐
│ Timestamp: 0:00 │
│ Data: "Pi Network lancé" │
│ Hash: ABC123 │
└─────────────────┘

**BLOC #2**
┌─────────────────┐
│ Timestamp: 0:01 │
│ Previous: ABC123 │
│ Data: "Alice → 10π → Bob" │
│ Hash: DEF456 │
└─────────────────┘

**BLOC #3**
┌─────────────────┐
│ Timestamp: 0:02 │
│ Previous: DEF456 │
│ Data: "Bob → 5π → Carol" │
│ Hash: GHI789 │
└─────────────────┘

**Que se passe-t-il si quelqu'un tente de modifier le Bloc #2?**

❌ Le hash change: DEF456 → XXX999
❌ Le Bloc #3 ne correspond plus (Previous ≠ XXX999)
❌ TOUTE la chaîne est invalidée!
❌ Le réseau rejette la modification

**C'est L'immuabilité!**

Grâce aux hash cryptographiques, modifier l'historique est pratiquement impossible. Chaque bloc est lié au précédent dans une chaîne indestructible.

**Décentralisation = Sécurité**

Au lieu d'une seule copie du livre (comme une banque), des milliers de nœuds ont une copie identique. Pour falsifier, il faudrait pirater 51%+ des nœuds simultanément - quasi impossible.`,
        highlights: [
            'Visualiser la structure en blocs enchaînés',
            'Comprendre les hash cryptographiques',
            'Expérimenter l\'immuabilité en action',
            'Découvrir la puissance de la décentralisation'
        ],
        codeExample: `// Exemple simple de hash
function hashBlock(data) {
  return SHA256(data + previousHash);
}

Block #2:
  data = "Alice → 10π → Bob"
  previousHash = "ABC123"
  hash = SHA256("Alice → 10π → BobABC123") 
       = "DEF456"
`
    },

    'defi-l1': {
        type: 'article',
        title: 'DeFi: Votre Banque Sans Banque',
        description: 'Introduction aux services financiers décentralisés',
        content: `**Imaginez une banque ouverte 24/7 où VOUS êtes le patron.**

C'est la DeFi (Decentralized Finance). Pas de banquier, pas d'horaires, pas de KYC (dans certains cas), pas d'intermédiaire prenant une Commission.

**Services DeFi Principaux:**

💱 **DEX (Decentralized Exchanges)**
Échangez des tokens directement avec d'autres utilisateurs. Uniswap, PancakeSwap, SushiSwap.
Exemple: Échangez vos Pi contre des USDT sans passer par Binance.

💰 **Lending \u0026 Borrowing**
Prêtez vos crypto et gagnez des intérêts. Ou empruntez contre vos actifs.
Plateformes: Aave, Compound, MakerDAO.
Exemple: Déposez 100π et gagnez 5% APY (Annual Percentage Yield).

🌾 **Yield Farming**
Fournissez de la liquidité à un DEX et gagnez des récompenses.
Exemple: Fournissez 50π + 50 USDT à un pool, gagnez des fees de trading.

🔄 **Staking**
Verrouillez vos tokens pour sécuriser un réseau et gagnez des récompenses.
Exemple: Stakez vos Pi pour 30 jours, gagnez 5% supplémentaires.

**Avantages de la DeFi:**

✅ **Accès Global** - Disponible partout, à tous
✅ **Transparent** - Toutes les transactions sur la blockchain
✅ **Contrôle Total** - Vous gardez vos clés
✅ **Composable** - Les protocoles s'interconnectent (Money Legos)

**Risques à Connaître:**

⚠️ **Smart Contract Bugs** - Code = Loi. Bug = Perte potentielle
⚠️ **Impermanent Loss** - En fournissant de la liquidité
⚠️ **Volatilité** - Les prix peuvent changer rapidement
⚠️ **Scams \u0026 Rug Pulls** - Projets malveillants

**DeFi sur Pi Network:**

L'écosystème Pi développe ses propres protocoles DeFi. Bientôt, vous pourrez:
- Échanger Pi contre d'autres tokens
- Prêter vos Pi pour gagner des intérêts
- Utiliser Pi comme collatéral
- Participer à des DAOs (Decentralized Autonomous Organizations)

**La Finance du Futur Est Ici.**`,
        highlights: [
            'Comprendre les principaux services DeFi',
            'Comparer DeFi vs Finance traditionnelle',
            'Identifier les opportunités et les risques',
            'Découvrir le potentiel de Pi dans la DeFi'
        ]
    }
};

// Fonction helper pour enrichir un layer avec du contenu
export function enrichDiscoveryLayer(layerId: string) {
    return ENRICHED_DISCOVERY_CONTENT[layerId] || null;
}
