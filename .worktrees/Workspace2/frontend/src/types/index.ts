// User Types
export interface User {
    uid: string;
    username: string;
    avatar: string;
    joinDate: string;
}

// Course Types
// Learning Layers Types
// Learning Layers Types
export type LayerType = 'discovery' | 'comprehension' | 'application' | 'mastery' | 'decision-lab' | 'quiz';

export interface Layer {
    id: string;
    type: LayerType;
    title: string;
    description: string;
    content?: string | { fr: string; en: string }; // Markdown content for Discovery layer
    videoUrl?: string; // For Discovery layer
    questions?: QuizQuestion[]; // For Comprehension/Application
    scenarios?: Record<string, unknown>[]; // For Application (Future)
    decisionScenarioId?: string; // For Decision Lab
    discoveryContent?: Record<string, unknown>; // Rich discovery content
    displayType?: 'text' | 'simulation' | 'lab';
    interactiveData?: InteractiveData; // For Simulations/Labs
    requiredMastery: number; // 0-100
    energyCost: number;
    xpReward: number;
    cooldownMinutes: number; // Failure cooldown
    requiredItem?: string;
}

export interface InteractiveAction {
    id: string;
    label: string; // Button text
    energyCost: number;
    feedback: string;
    feedbackType: 'positive' | 'negative' | 'neutral' | 'info' | 'warning';
    consequence?: {
        xpChange?: number;
        reputationChange?: number;
        tokenImpact?: 'up' | 'down' | 'stable';
    };
    requiredUnlock?: string; // ID of another action needed first
}

export interface InteractiveData {
    title?: string; // Localized Contextual Title
    initialState: string; // Markdown supported
    actions: InteractiveAction[];
    winningCondition: string[]; // List of action IDs required to win
    losingCondition?: string[];
}

export interface Course {
    id: string; // Changed to string for flexibility
    title: string;
    category: string;
    icon: string;
    description: string;
    layers: Layer[];
    unlockRequirements?: {
        requiredLevel?: number;
        requiredCourse?: string;
    };
    duration?: string;
    totalXp: number;
    premium: boolean;
    isPremium?: boolean; // Legacy/Backend compatibility
    locked: boolean; // Global lock
    piReward: number; // Pi reward for completing the course
    progress?: number; // User's progress percentage (0-100)
    // Unlock Requirements
    requiredLevel?: number; // Minimum user level required
    requiredXP?: number; // Minimum total XP required
    requiredCourses?: string[]; // Course IDs that must be completed first
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    requiredItem?: string;
}

// User Progress Types
export interface EnergyState {
    current: number;
    max: number;
    lastRechargeTime: number; // Timestamp
    rechargeRate?: number; // Energy per hour
    restBonus?: number; // Bonus energy from rest
}

export interface QuestionHistoryEntry {
    questionId: string;
    courseId: string | number;
    layerId: LayerType;
    timestamp: number;
    correct: boolean;
    timeTaken?: number;
}

export interface LayerProgress {
    courseId: string;
    layerId: string;
    unlocked: boolean;
    mastered: boolean;
    attempts: number;
    bestScore: number;
    lastAttempt: number | null;
    cooldownUntil?: number | null;
}

export interface AccessControlResult {
    allowed: boolean;
    reason?: string;
    energyNeeded?: number;
    requiredLayer?: string;
    cooldownRemaining?: number;
}

export interface ReputationScore {
    total: number;
    constancy: number; // Logins/Daily streaks
    progression: number; // Layers unlocked
    precision: number; // accuracy rate
}

export interface UserProgress {
    level: number;
    xp: number;
    xpToNext: number;
    streak: number;
    piBalance: number;
    
    // New EdTech Fields
    energy: EnergyState;
    energyBalance?: number; // Legacy/Sync field
    reputation: ReputationScore;
    uid?: string; // Included for convenience in some components
    
    // New Architecture - Array-based progress tracking
    layerProgress: LayerProgress[];
    completedLayers?: Record<string, string[]>; // Map courseId -> layerIds[]
    layerCooldowns?: Record<string, import('../services/CooldownManager').LayerCooldown>;
    questionHistory: QuestionHistoryEntry[];
    
    // Legacy mapping (maintained for type safety during migration)
    completedCourses: string[]; // IDs of fully mastered courses
    totalPoints: number;
    referralCode: string;
    lastLoginDate: number;
    stakingBalance: number;
    stakingRewards: number;
    stakingStartDate: number | null;
    stakingPeriod: number | null;
    purchaseHistory?: string[]; // Track purchased items/premium passes
    inventory?: InventoryItem[]; // Synced from PiUserProgress
    quizAttempts?: Record<string, {
        attempts: number;
        lastAttempt: number;
        cooldownUntil?: number;
    }>;
}

// Authentication & Identity types (Migrated from AuthContext)
// Economy & Anti-Farm Types
export interface UserEconomyState {
    balance: number;           // Solde "Edu" (gagné en jeu, virtuel pour l'instant)
    transferableBalance: number; // Solde "Réel" (débloqué par proof-of-spend)
    
    lifetimeEarnings: number;  // Total gagné à vie (stats)
    lifetimeSpent: number;     // Total "brûlé" dans la boutique (Anti-Farm Metric principale)
    
    credibilityScore: number;  // Score calculé basé sur les achats "Sérieux" (Licences)
    withdrawalTier: number;    // 0 = Bloqué, 1 = Micro, 2 = Standard, 3 = Illimité
    
    lastWithdrawalDate?: number;
    pendingWithdrawals: number; // Montant en cours de validation (période de 14 jours)
}

export interface InventoryItem {
    itemId: string;
    id?: string;
    acquiredDate: number;
    active: boolean; // Pour les boosts temporaires
    expiryDate?: number; // Pour les items à durée limitée
}

export interface PiUserProgress {
  level: number;
  xp: number; // Current level progress (0-99)
  cumulatedXP: number; // Total XP earned
  
  // NOUVEAU SYSTÈME ÉCONOMIQUE
  economy: UserEconomyState;
  inventory: InventoryItem[];
  energy?: EnergyState; // Ajouté pour compatibilité avec le moteur

  // Legacy fields (kept for backward compatibility during migration)
  piBalance: number; // -> Sera migré vers economy.balance
  energyBalance?: number;
  lastEnergyUpdate?: number;
  stakingBalance?: number;
  completedLayers?: Record<string, string[]>;
  layerProgress?: LayerProgress[];
  referralCode?: string;
  quizAttempts?: Record<string, {
    attempts: number;
    lastAttempt: number;
    cooldownUntil?: number;
  }>;
  completedCourses?: string[]; // IDs of fully mastered courses
}

export interface PiUser {
  uid: string;
  username: string;
  accessToken: string;
  avatar?: string;
  // piBalance?: number; // Deprecated, use userProgress.economy.balance
  userProgress?: PiUserProgress;
}

// Social Types
export interface SocialPost {
    user: string;
    avatar: string;
    time: string;
    content: string;
    likes: number;
    timestamp: number;
}

// Quiz Types
export interface QuizQuestion {
    id: string; // Unique ID for tracking
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    // Adaptive Metadata
    difficulty: 'easy' | 'medium' | 'hard' | 'expert';
    cognitiveLevel: 'knowledge' | 'comprehension' | 'application' | 'analysis';
    topic: string;
    subTopic?: string;
    trapType?: 'scam_awareness' | 'misconception' | 'precision' | 'none' 
    | 'similar-concepts' | 'negative-framing' | 'similar-institutions' | 'magnitude' 
    | 'false-analogy' | 'visual-similarity' | 'scam-warning' | 'partial-truth' 
    | 'naming-confusion' | 'temptation' | 'temporal-confusion' | 'terminology-confusion' 
    | 'wishful-thinking' | 'fear-mongering' | 'restriction' | 'expectation' 
    | 'critical-warning' | 'nuanced-comparison' | 'deep-reasoning' | 'technical-depth' 
    | 'severity' | 'strategic-thinking' | 'complex-mechanism' | 'technical-nuance' 
    | 'philosophical-depth' | 'security-best-practice' | 'confusion-public-private' 
    | 'scenario-based' | 'absolute-rule' | 'urgency-tactic' | 'visual-deception' 
    | 'authority-impersonation' | 'too-good-to-be-true' | 'technical-verification' 
    | 'complex-pattern-recognition' | 'expectation-management' | 'privacy-concern'
    | 'visual-identification' | 'greed-bait' | 'rule-violation' | 'fake-app' 
    | 'misinformation' | 'convenience-trap' | 'obscure-term' | 'misunderstanding-mechanism' 
    | 'panic-reaction' | 'comparison' | 'terminology' | 'technical-concept' | 'complex-concept';
    xpReward?: number; // Optional XP reward for answering correctly
}

export interface QuizAnswer {
    questionId: string;
    correct: boolean;
    timestamp: number;
    timeSpent: number;
}

// Payment Types
export interface PaymentData {
    amount: number;
    memo: string;
    metadata: {
        productId: string;
        [key: string]: string | number | boolean | undefined;
    };
}

export interface PaymentResult {
    identifier: string;
    status: 'pending' | 'completed' | 'cancelled' | 'failed';
    amount: number;
    memo: string;
    metadata: Record<string, unknown>;
    from_address?: string;
    to_address?: string;
    created_at?: string;
    transaction?: {
        txid: string;
        verified: boolean;
    };
}

// Pi SDK Types
export interface PiAuthResult {
    accessToken: string;
    user: {
        uid: string;
        username: string;
    };
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface ApiError {
    message: string;
    code?: string;
    status?: number;
}

// Translation Types
export interface Translations {
    connecting: string;
    welcome: string;
    balance: string;
    level: string;
    streak: string;
    days: string;
    courses: string;
    leaderboard: string;
    social: string;
    shop: string;
    staking: string;
    profile: string;
    premium: string;
    freeTier: string;
    upgradePremium: string;
    stakingTitle: string;
    stakingSubtitle: string;
    availableToStake: string;
    currentlyStaked: string;
    earnedRewards: string;
    startStaking: string;
    unstake: string;
    month: string;
    subscribe: string;
}

export type Language = 'en' | 'fr';

// Environment Config Types
export interface AppConfig {
    piApiKey: string;
    piSandbox: boolean;
    apiUrl: string;
    gcvValue: number;
    useMockAuth: boolean;
    sentryDsn?: string;
}
