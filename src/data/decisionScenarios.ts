import { DecisionScenario } from '../components/education/DecisionLab';

/**
 * BIBLIOTHÈQUE DE SCÉNARIOS DE DÉCISION
 * Simulations cognitives pour développer la pensée stratégique
 */

export const DECISION_SCENARIOS: DecisionScenario[] = [
    {
        id: 'dao-crisis-1',
        title: 'Crise de Gouvernance DAO',
        context: `Vous êtes membre du conseil de gouvernance d'une DAO Pi avec 10,000 membres actifs. La communauté vote sur des propositions pour améliorer l'écosystème.`,
        situation: `30% des membres actifs protestent contre une décision récente d'allouer 50,000π au développement d'une nouvelle dApp. Ils réclament plus de transparence et menacent de quitter la DAO. Le vote était serré (52% pour, 48% contre). Que faites-vous ?`,
        difficulty: 'hard',
        category: 'dao-governance',
        energyCost: 25,
        xpReward: 300,
        reputationReward: 50,
        options: [
            {
                id: 'ignore',
                text: 'Ignorer les protestations - La majorité a voté, la démocratie a parlé.',
                impact: { xp: 50, reputation: -20 },
                consequences: '30% des membres quittent la DAO. La réputation du projet est endommagée. Le développement continue mais avec moins de soutien communautaire.',
                reasoning: 'Ignorer les préoccupations minoritaires crée de la division et érode la confiance, même si techniquement légal.',
                isOptimal: false
            },
            {
                id: 'reverse',
                text: 'Annuler la décision immédiatement pour calmer la situation.',
                impact: { xp: 100, reputation: -10 },
                consequences: 'Les 30% protestataires sont satisfaits, mais les 52% qui ont voté POUR sont furieux. Cela crée un précédent dangereux où les votes peuvent être annulés sous pression.',
                reasoning: 'Annuler un vote démocratique mine le système de gouvernance lui-même.',
                isOptimal: false
            },
            {
                id: 'transparency',
                text: 'Organiser une session de transparence totale + proposer un audit indépendant.',
                impact: { xp: 300, reputation: 50 },
                consequences: 'Vous organisez un AMA (Ask Me Anything) en direct, publiez tous les budgets détaillés, et engagez un auditeur tiers. 80% des protestataires sont rassurés et restent. La confiance augmente.',
                reasoning: 'La transparence et la communication répondent à la vraie préoccupation (manque d\'info) sans compromettre la gouvernance.',
                isOptimal: true
            },
            {
                id: 'compromise',
                text: 'Proposer un nouveau vote avec conditions : développement par phases + rapports mensuels.',
                impact: { xp: 250, reputation: 30 },
                consequences: 'Un nouveau vote est organisé avec des garanties de transparence (milestones, rapports publics). Il passe à 68%. La plupart des protestataires acceptent ce compromis.',
                reasoning: 'Bonne approche qui respecte la gouvernance tout en adressant les préoccupations légitimes, mais prend plus de temps.',
                isOptimal: false
            }
        ]
    },

    {
        id: 'security-breach',
        title: 'Faille de Sécurité Détectée',
        context: `Vous êtes développeur principal d'une dApp Pi avec 50,000 utilisateurs et 100,000π en smart contracts.`,
        situation: `Votre équipe découvre une faille critique dans le smart contract qui permet potentiellement de drainer tous les fonds. Personne d'autre ne semble au courant pour l'instant. Il est 2h du matin. Que faites-vous immédiatement ?`,
        difficulty: 'expert',
        category: 'security',
        energyCost: 30,
        xpReward: 400,
        reputationReward: 80,
        options: [
            {
                id: 'public-announcement',
                text: 'Annoncer publiquement la faille immédiatement pour alerter les utilisateurs.',
                impact: { xp: 100, reputation: -30 },
                consequences: 'Panique générale. Les hackers voient l\'annonce et exploitent la faille en moins de 10 minutes. 100,000π sont volés. Votre réputation est détruite.',
                reasoning: 'Annoncer publiquement une faille AVANT de la corriger est la pire décision possible en sécurité.',
                isOptimal: false
            },
            {
                id: 'pause-upgrade',
                text: 'Activer la fonction de pause d\'urgence + déployer le fix immédiatement.',
                impact: { xp: 400, reputation: 80 },
                consequences: 'Vous pausez les contrats (fonction prévue), corrigez la faille en 2h, déployez, puis annoncez avec transparence ce qui s\'est passé. Les utilisateurs applaudissent votre réactivité. 0π perdu.',
                reasoning: 'C\'est exactement pourquoi les pauses d\'urgence existent. Corriger d\'abord, communiquer après.',
                isOptimal: true
            },
            {
                id: 'wait-morning',
                text: 'Attendre le matin pour consulter toute l\'équipe avant d\'agir.',
                impact: { xp: 50, reputation: -50 },
                consequences: 'À 6h, un hacker découvre et exploite la faille. 100,000π volés. L\'équipe vous en veut de ne pas avoir agi immédiatement.',
                reasoning: 'En sécurité, chaque minute compte. Les failles critiques nécessitent une action immédiate.',
                isOptimal: false
            },
            {
                id: 'secret-fix',
                text: 'Corriger silencieusement sans jamais en parler publiquement.',
                impact: { xp: 200, reputation: 10 },
                consequences: 'Vous corrigez la faille en secret. Aucun fonds perdu. Mais 6 mois plus tard, quelqu\'un découvre l\'incident dans l\'historique des commits. Scandale de "manque de transparence".',
                reasoning: 'Bien que techniquement efficace, le manque de transparence crée des problèmes de confiance à long terme.',
                isOptimal: false
            }
        ]
    },

    {
        id: 'community-conflict',
        title: 'Conflit Communautaire Majeur',
        context: `Vous gérez une communauté Pi de 5,000 membres. Deux factions émergent avec des visions opposées pour l'avenir du projet.`,
        situation: `Faction A (2,000 membres) veut se concentrer sur la DeFi et la finance. Faction B (2,000 membres) veut développer des use-cases sociaux et éducatifs. Les 1,000 restants sont neutres. Les discussions deviennent toxiques, avec des attaques personnelles. Comment restaurez-vous l'harmonie ?`,
        difficulty: 'medium',
        category: 'community',
        energyCost: 15,
        xpReward: 200,
        reputationReward: 35,
        options: [
            {
                id: 'choose-side',
                text: 'Choisir la Faction A (DeFi) car c\'est plus lucratif.',
                impact: { xp: 80, reputation: -15 },
                consequences: 'Faction B se sent trahie. 1,500 membres quittent pour créer leur propre projet concurrent. La communauté est fracturée.',
                reasoning: 'Prendre parti dans un conflit communautaire crée des divisions permanentes.',
                isOptimal: false
            },
            {
                id: 'both-track',
                text: 'Proposer une approche "dual-track" : 50% ressources DeFi, 50% Social/Éducatif.',
                impact: { xp: 200, reputation: 35 },
                consequences: 'Compromis accepté par la majorité. Vous créez deux sous-DAOs avec budgets distincts. Les deux factions travaillent en parallèle. Synergie inattendue : l\'éducation DeFi devient un pont.',
                reasoning: 'Le compromis "gagnant-gagnant" préserve l\'unité tout en satisfaisant les deux visions.',
                isOptimal: true
            },
            {
                id: 'vote',
                text: 'Organiser un vote pour trancher démocratiquement.',
                impact: { xp: 120, reputation: 5 },
                consequences: 'Le vote donne 51% pour DeFi. La Faction B accepte à contrecœur mais reste amère. Toxicité réduite mais division latente persiste.',
                reasoning: 'Le vote résout le problème légalement mais ne guérit pas la division émotionnelle.',
                isOptimal: false
            },
            {
                id: 'mediation',
                text: 'Engager un médiateur externe neutre + workshops de team-building.',
                impact: { xp: 150, reputation: 20 },
                consequences: 'Le médiateur aide les factions à trouver des valeurs communes. Toxicité réduite. Mais aucune solution concrète sur la direction à prendre.',
                reasoning: 'Améliore l\'ambiance mais ne résout pas le désaccord stratégique fondamental.',
                isOptimal: false
            }
        ]
    },

    {
        id: 'economic-decision',
        title: 'Décision Économique Critique',
        context: `Vous êtes le trésorier d'un projet Pi. Le trésor contient 500,000π (≈ $157M USD à GCV).`,
        situation: `Le marché crypto est en bull run. Votre Pi a pris +300% de valeur en 3 mois. L\'équipe propose de vendre 30% du trésor (150,000π ≈ $47M) pour sécuriser des liquidités en stablecoins et financer 3 ans de développement. D\'autres disent de HODL car Pi ira encore plus haut. Que décidez-vous ?`,
        difficulty: 'hard',
        category: 'economics',
        energyCost: 20,
        xpReward: 280,
        reputationReward: 45,
        options: [
            {
                id: 'sell-all',
                text: 'Vendre 50% maintenant pour maximiser les gains pendant le bull run.',
                impact: { xp: 100, reputation: -10 },
                consequences: 'Vous vendez 250,000π à prix élevé. 2 mois plus tard, Pi fait +500% supplémentaire. La communauté est furieuse car vous avez vendu trop tôt. "Paper hands!"',
                reasoning: 'Vendre plus que nécessaire est de la spéculation et peut créer de la pression baissière.',
                isOptimal: false
            },
            {
                id: 'hodl-all',
                text: 'HODL 100% - Ne jamais vendre Pi, c\'est la philosophie du projet.',
                impact: { xp: 120, reputation: 10 },
                consequences: 'Vous gardez tout. 3 mois plus tard, le marché crash (bear market). Pi perd 70% de sa valeur. Le trésor ne vaut plus que $47M. Pas assez pour 3 ans de dev. Licenciements.',
                reasoning: 'L\'idéalisme sans pragmatisme met le projet en danger financier.',
                isOptimal: false
            },
            {
                id: 'dca-strategy',
                text: 'DCA (Dollar Cost Average) : Vendre 10% par mois sur 3 mois (30% total).',
                impact: { xp: 280, reputation: 45 },
                consequences: 'Approche équilibrée. Vous vendez progressivement, captant différents prix. Résultat : $45M sécurisés même après un mini-crash. Trésor reste à 70%. Communauté approuve la prudence.',
                reasoning: 'Le DCA réduit le risque de timing et démontre une gestion professionnelle.',
                isOptimal: true
            },
            {
                id: 'community-vote',
                text: 'Laisser la communauté voter sur la stratégie de vente.',
                impact: { xp: 150, reputation: 15 },
                consequences: 'Vote organisé. Résultat: 60% veulent HODL par émotion. Pas de vente. Bear market arrive. Catastrophe financière. "La communauté a décidé" ne vous dédouane pas.',
                reasoning: 'Certaines décisions techniques/financières ne devraient pas être 100% communautaires. C\'est votre rôle d\'expert.',
                isOptimal: false
            }
        ]
    },

    {
        id: 'innovation-dilemma',
        title: 'Dilemme d\'Innovation',
        context: `Vous développez une dApp Pi qui a 10,000 utilisateurs actifs. Votre concurrent lance une feature révolutionnaire.`,
        situation: `Votre principal concurrent vient de lancer une fonctionnalité AI qui automatise ce que vos utilisateurs font manuellement. C\'est viral, il gagne 1,000 nouveaux users/jour. Vos utilisateurs commencent à partir. Votre équipe peut copier la feature en 2 semaines OU innover quelque chose de différent en 2 mois. Que faites-vous ?`,
        difficulty: 'medium',
        category: 'strategy',
        energyCost: 18,
        xpReward: 220,
        reputationReward: 40,
        options: [
            {
                id: 'copy-fast',
                text: 'Copier la feature en 2 semaines - Survivre d\'abord, innover après.',
                impact: { xp: 120, reputation: 10 },
                consequences: 'Vous stoppez l\'hémorragie d\'utilisateurs. Mais vous êtes maintenant perçu comme un "copycat". Pas de différenciation. Compétition par les prix commence.',
                reasoning: 'Copier stoppe le saignement mais vous condamne à être un suiveur, pas un leader.',
                isOptimal: false
            },
            {
                id: 'innovate',
                text: 'Ignorer le concurrent et innover votre propre solution unique en 2 mois.',
                impact: { xp: 80, reputation: -20 },
                consequences: 'Vous perdez encore 3,000 utilisateurs pendant les 2 mois. Votre innovation arrive mais il est trop tard - momentum perdu. Fermeture dans 6 mois.',
                reasoning: 'L\'innovation pure sans considération du timing peut être fatale.',
                isOptimal: false
            },
            {
                id: 'hybrid',
                text: 'Quick MVP (1 semaine) + Innovation complète en parallèle (2 mois).',
                impact: { xp: 220, reputation: 40 },
                consequences: 'Vous sortez une version basique rapidement pour retenir les users, puis DÉPASSEZ le concurrent avec votre innovation supérieure. Récupérez les users perdus + gagnez les leurs.',
                reasoning: 'Balance entre vitesse (survivre) et vision (gagner). C\'est la stratégie "Fast Follow + Leapfrog".',
                isOptimal: true
            },
            {
                id: 'marketing',
                text: 'Contre-attaque marketing : Expliquez pourquoi votre approche manuelle est meilleure.',
                impact: { xp: 60, reputation: -30 },
                consequences: 'Campagne "Human touch vs AI cold". Sauve 30% des users partants mais vous passez pour réactionnaire. Les jeunes users (60% de votre base) ne sont pas convaincus.',
                reasoning: 'Défendre l\'ancien au lieu d\'embrasser le nouveau est rarement gagnant en tech.',
                isOptimal: false
            }
        ]
    }
];

// Fonction pour obtenir des scénarios par difficulté
export function getScenariosByDifficulty(difficulty: 'easy' | 'medium' | 'hard' | 'expert') {
    return DECISION_SCENARIOS.filter(s => s.difficulty === difficulty);
}

// Fonction pour obtenir des scénarios par catégorie
export function getScenariosByCategory(category: string) {
    return DECISION_SCENARIOS.filter(s => s.category === category);
}

// Fonction pour obtenir un scénario aléatoire adapté au niveau de l'utilisateur
export function getAdaptiveScenario(userLevel: number): DecisionScenario | null {
    let targetDifficulty: 'easy' | 'medium' | 'hard' | 'expert';
    
    if (userLevel < 5) targetDifficulty = 'easy';
    else if (userLevel < 10) targetDifficulty = 'medium';
    else if (userLevel < 20) targetDifficulty = 'hard';
    else targetDifficulty = 'expert';
    
    const scenarios = getScenariosByDifficulty(targetDifficulty);
    if (scenarios.length === 0) return null;
    
    return scenarios[Math.floor(Math.random() * scenarios.length)];
}
