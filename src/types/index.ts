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
    scenarios?: any[]; // For Application (Future)
    decisionScenarioId?: string; // For Decision Lab
    discoveryContent?: any; // Rich discovery content
    requiredMastery: number; // 0-100
    energyCost: number;
    xpReward: number;
    cooldownMinutes: number; // Failure cooldown
}

export interface Course {
    id: string; // Changed to string for flexibility
    title: string;
    category: string;
    icon: string;
    description: string;
    layers: Layer[];
    totalXp: number;
    premium: boolean;
    locked: boolean; // Global lock
    piReward: number; // Pi reward for completing the course
    progress?: number; // User's progress percentage (0-100)
    // Unlock Requirements
    requiredLevel?: number; // Minimum user level required
    requiredXP?: number; // Minimum total XP required
    requiredCourses?: string[]; // Course IDs that must be completed first
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// User Progress Types
export interface EnergyState {
    current: number;
    max: number;
    lastRecharge: number; // Timestamp
    rechargeRate: number; // Energy per hour
    restBonus: number; // Bonus energy from rest
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
    reputation: ReputationScore;
    
    // New Architecture - Array-based progress tracking
    layerProgress: LayerProgress[];
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
    | 'complex-pattern-recognition' | 'expectation-management' | 'privacy-concern';
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
        [key: string]: any;
    };
}

export interface PaymentResult {
    identifier: string;
    status: 'pending' | 'completed' | 'cancelled' | 'failed';
    amount: number;
    memo: string;
    metadata: any;
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
export interface ApiResponse<T = any> {
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
