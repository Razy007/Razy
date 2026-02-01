/**
 * ============================================================================
 * USER RETENTION & ENGAGEMENT SYSTEM
 * ============================================================================
 * Système complet de rétention utilisateur:
 * - Achievements & Badges
 * - Learning Streaks
 * - Personalized Learning Paths
 * - Progress Analytics
 * - Gamification Mechanics
 * ============================================================================
 */

export enum AchievementCategory {
  LEARNING = 'learning',
  SOCIAL = 'social',
  MILESTONE = 'milestone',
  SPECIAL = 'special'
}

export enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

/**
 * Achievement (Badge)
 */
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  rarity: AchievementRarity;
  
  // Critères de déverrouillage
  criteria: {
    type: 'xp_earned' | 'courses_completed' | 'layers_completed' | 'streak_days' | 'perfect_quizzes' | 'social_contribution' | 'custom';
    threshold?: number;
    condition?: string;
  };
  
  // Récompenses
  rewards: {
    xpBonus?: number;
    piBonus?: number;
    energyBonus?: number;
    title?: string; // Titre à afficher sur profil
    cosmetic?: string;
  };
  
  // Affichage
  isHidden: boolean; // Caché jusqu'à déverrouillage
  unlockMessage: string;
  shareText: string; // Pour partage social
  
  // Stats
  globalUnlockRate: number; // % utilisateurs ayant déverrouillé
}

/**
 * User Achievement Progress
 */
export interface UserAchievement {
  userId: string;
  achievementId: string;
  progress: number; // 0-100
  unlockedAt?: Date;
  displayOnProfile: boolean;
}

/**
 * Learning Streak
 */
export interface LearningStreak {
  userId: string;
  currentStreak: number; // jours consécutifs
  longestStreak: number;
  lastActivityDate: Date;
  freezesAvailable: number; // "Streak Freeze" items
  milestones: {
    days: number;
    reward: {
      xp: number;
      pi: number;
      badge?: string;
    };
    claimed: boolean;
  }[];
}

/**
 * Learning Path (Parcours personnalisé)
 */
export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  goal: string;
  
  // Parcours recommandé
  recommendedCourses: {
    courseId: string;
    order: number;
    reason: string; // Pourquoi recommandé
    estimatedCompletionDate?: Date;
  }[];
  
  // Progression
  currentCourseId: string;
  overallProgress: number; // 0-100
  
  // Métriques
  startedAt: Date;
  estimatedCompletionDate: Date;
  actualCompletionDate?: Date;
  
  // Personnalisation
  learningPace: 'relaxed' | 'moderate' | 'intensive'; // 3h/week vs 5h vs 10h
  preferredContentTypes: string[]; // ['video', 'interactive', 'text']
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

/**
 * User Progress Analytics
 */
export interface ProgressAnalytics {
  userId: string;
  period: 'week' | 'month' | 'all_time';
  
  // Activité
  layersCompleted: number;
  coursesCompleted: number;
  quizzesPassed: number;
  totalStudyTime: number; // minutes
  
  // Performance
  averageQuizScore: number;
  perfectQuizzes: number;
  retriesCount: number;
  
  // Gains
  xpEarned: number;
  piEarned: number;
  levelsGained: number;
  
  // Engagement
  loginDays: number;
  currentStreak: number;
  achievementsUnlocked: number;
  
  // Comparaison
  percentile: number; // Top X% des utilisateurs
  rankGlobal: number;
  
  // Tendances
  weeklyProgress: {
    week: string;
    layersCompleted: number;
    xpEarned: number;
  }[];
  
  // Recommandations
  strengths: string[]; // Domaines où l'utilisateur excelle
  areasToImprove: string[];
  nextRecommendedCourse: string;
}

/**
 * Gamification Events
 */
export enum GamificationEvent {
  LAYER_COMPLETED = 'layer_completed',
  QUIZ_PERFECT = 'quiz_perfect',
  STREAK_MILESTONE = 'streak_milestone',
  LEVEL_UP = 'level_up',
  ACHIEVEMENT_UNLOCKED = 'achievement_unlocked',
  COURSE_COMPLETED = 'course_completed',
  SOCIAL_CONTRIBUTION = 'social_contribution'
}

export interface GamificationReward {
  event: GamificationEvent;
  xp: number;
  pi: number;
  energy: number;
  message: string;
  animation?: 'confetti' | 'fireworks' | 'level_up';
}

/**
 * Notification Preferences
 */
export interface NotificationPreferences {
  userId: string;
  
  // Types de notifications
  achievementUnlocks: boolean;
  streakReminders: boolean;
  courseRecommendations: boolean;
  newContentAvailable: boolean;
  socialInteractions: boolean;
  
  // Fréquence
  dailyDigest: boolean;
  weeklyReport: boolean;
  
  // Canaux
  inApp: boolean;
  email: boolean;
  pushNotifications: boolean;
}

/**
 * ============================================================================
 * PREDEFINED ACHIEVEMENTS
 * ============================================================================
 */

export const ACHIEVEMENTS: Achievement[] = [
  // LEARNING CATEGORY
  {
    id: 'first-layer',
    name: 'Premier Pas',
    description: 'Complétez votre premier layer',
    icon: '🎯',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.COMMON,
    criteria: { type: 'layers_completed', threshold: 1 },
    rewards: { xpBonus: 10, piBonus: 0.0001 },
    isHidden: false,
    unlockMessage: '🎉 Félicitations! Vous avez complété votre premier layer!',
    shareText: 'Je viens de commencer mon parcours sur Pioneer Academy! 🚀',
    globalUnlockRate: 0.89
  },
  {
    id: 'layer-master-10',
    name: 'Apprenti Déterminé',
    description: 'Complétez 10 layers',
    icon: '📚',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.COMMON,
    criteria: { type: 'layers_completed', threshold: 10 },
    rewards: { xpBonus: 50, piBonus: 0.0005 },
    isHidden: false,
    unlockMessage: '🏆 10 layers complétés! Vous êtes sur la bonne voie!',
    shareText: '10 layers complétés sur Pioneer Academy! 📚',
    globalUnlockRate: 0.54
  },
  {
    id: 'layer-master-50',
    name: 'Érudit Pi',
    description: 'Complétez 50 layers',
    icon: '🎓',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.RARE,
    criteria: { type: 'layers_completed', threshold: 50 },
    rewards: { xpBonus: 250, piBonus: 0.003, title: 'Érudit Pi' },
    isHidden: false,
    unlockMessage: '💫 50 layers! Vous êtes un véritable Érudit Pi!',
    shareText: '50 layers maîtrisés! Je suis maintenant un Érudit Pi! 🎓',
    globalUnlockRate: 0.18
  },
  {
    id: 'layer-master-100',
    name: 'Maître Pi Network',
    description: 'Complétez 100 layers',
    icon: '👑',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.EPIC,
    criteria: { type: 'layers_completed', threshold: 100 },
    rewards: { xpBonus: 1000, piBonus: 0.01, title: 'Maître Pi Network', cosmetic: 'golden-crown-frame' },
    isHidden: false,
    unlockMessage: '🌟 100 LAYERS! Vous êtes un MAÎTRE Pi Network!',
    shareText: '100 layers complétés! Je suis devenu Maître Pi Network! 👑',
    globalUnlockRate: 0.04
  },
  
  // PERFECT QUIZZES
  {
    id: 'perfectionist',
    name: 'Perfectionniste',
    description: 'Obtenez 10 quiz parfaits (100% score)',
    icon: '💯',
    category: AchievementCategory.LEARNING,
    rarity: AchievementRarity.RARE,
    criteria: { type: 'perfect_quizzes', threshold: 10 },
    rewards: { xpBonus: 200, piBonus: 0.002 },
    isHidden: false,
    unlockMessage: '💯 10 quiz parfaits! Vous êtes un perfectionniste!',
    shareText: '10 quiz avec score parfait sur Pioneer Academy! 💯',
    globalUnlockRate: 0.22
  },
  
  // STREAK MILESTONES
  {
    id: 'streak-7',
    name: 'Semaine de Feu',
    description: '7 jours de streak consécutif',
    icon: '🔥',
    category: AchievementCategory.MILESTONE,
    rarity: AchievementRarity.COMMON,
    criteria: { type: 'streak_days', threshold: 7 },
    rewards: { xpBonus: 100, energyBonus: 50 },
    isHidden: false,
    unlockMessage: '🔥 7 jours d\'affilée! Vous êtes en feu!',
    shareText: '7 jours de streak sur Pioneer Academy! 🔥',
    globalUnlockRate: 0.31
  },
  {
    id: 'streak-30',
    name: 'Pionnier Dévoué',
    description: '30 jours de streak consécutif',
    icon: '🚀',
    category: AchievementCategory.MILESTONE,
    rarity: AchievementRarity.EPIC,
    criteria: { type: 'streak_days', threshold: 30 },
    rewards: { xpBonus: 500, piBonus: 0.005, title: 'Pionnier Dévoué' },
    isHidden: false,
    unlockMessage: '🚀 30 JOURS DE STREAK! Engagement exceptionnel!',
    shareText: '30 jours de streak sur Pioneer Academy! Rien ne m\'arrête! 🚀',
    globalUnlockRate: 0.08
  },
  {
    id: 'streak-100',
    name: 'Légende Immortelle',
    description: '100 jours de streak consécutif',
    icon: '⚡',
    category: AchievementCategory.MILESTONE,
    rarity: AchievementRarity.LEGENDARY,
    criteria: { type: 'streak_days', threshold: 100 },
    rewards: { xpBonus: 2000, piBonus: 0.025, title: 'Légende Immortelle', cosmetic: 'lightning-aura' },
    isHidden: true,
    unlockMessage: '⚡ 100 JOURS! VOUS ÊTES UNE LÉGENDE IMMORTELLE!',
    shareText: '100 jours de streak! Je suis une Légende Immortelle de Pioneer Academy! ⚡',
    globalUnlockRate: 0.01
  },
  
  // COURSE COMPLETION
  {
    id: 'first-course',
    name: 'Diplômé',
    description: 'Complétez votre premier cours',
    icon: '🎖️',
    category: AchievementCategory.MILESTONE,
    rarity: AchievementRarity.RARE,
    criteria: { type: 'courses_completed', threshold: 1 },
    rewards: { xpBonus: 300, piBonus: 0.003 },
    isHidden: false,
    unlockMessage: '🎖️ Premier cours terminé! Vous êtes diplômé!',
    shareText: 'Premier cours complété sur Pioneer Academy! 🎖️',
    globalUnlockRate: 0.42
  },
  {
    id: 'polymath',
    name: 'Polymathe',
    description: 'Complétez 5 cours dans différentes catégories',
    icon: '🌐',
    category: AchievementCategory.MILESTONE,
    rarity: AchievementRarity.EPIC,
    criteria: { type: 'custom', condition: 'distinct_course_categories >= 5' },
    rewards: { xpBonus: 1000, piBonus: 0.01, title: 'Polymathe' },
    isHidden: false,
    unlockMessage: '🌐 5 domaines maîtrisés! Vous êtes un véritable Polymathe!',
    shareText: '5 domaines différents maîtrisés! Je suis un Polymathe! 🌐',
    globalUnlockRate: 0.11
  },
  
  // SOCIAL ENGAGEMENT
  {
    id: 'helpful-pioneer',
    name: 'Pionnier Altruiste',
    description: 'Aidez 10 autres Pioneers (réponses forum, partage)',
    icon: '🤝',
    category: AchievementCategory.SOCIAL,
    rarity: AchievementRarity.RARE,
    criteria: { type: 'social_contribution', threshold: 10 },
    rewards: { xpBonus: 200, piBonus: 0.002 },
    isHidden: false,
    unlockMessage: '🤝 10 Pioneers aidés! Merci pour votre contribution!',
    shareText: 'J\'ai aidé 10 Pioneers! Ensemble, on va plus loin! 🤝',
    globalUnlockRate: 0.15
  },
  
  // SPECIAL ACHIEVEMENTS
  {
    id: 'early-adopter',
    name: 'Early Adopter',
    description: 'Inscrit dans les 1000 premiers utilisateurs',
    icon: '🌟',
    category: AchievementCategory.SPECIAL,
    rarity: AchievementRarity.LEGENDARY,
    criteria: { type: 'custom', condition: 'user_id <= 1000' },
    rewards: { xpBonus: 500, piBonus: 0.01, title: 'Early Adopter', cosmetic: 'founder-badge' },
    isHidden: false,
    unlockMessage: '🌟 EARLY ADOPTER! Merci de croire en Pioneer Academy dès le début!',
    shareText: 'Fier d\'être Early Adopter de Pioneer Academy! 🌟',
    globalUnlockRate: 0.02
  },
  {
    id: 'night-owl',
    name: 'Oiseau de Nuit',
    description: 'Complétez 10 layers entre minuit et 5h',
    icon: '🦉',
    category: AchievementCategory.SPECIAL,
    rarity: AchievementRarity.RARE,
    criteria: { type: 'custom', condition: 'layers_completed_night >= 10' },
    rewards: { xpBonus: 150, piBonus: 0.0015 },
    isHidden: true,
    unlockMessage: '🦉 Oiseau de Nuit! Vous êtes un apprenant nocturne!',
    shareText: 'Découvert: Je suis un Oiseau de Nuit sur Pioneer Academy! 🦉',
    globalUnlockRate: 0.07
  },
  {
    id: 'speedrunner',
    name: 'Speedrunner',
    description: 'Complétez un cours en moins de 48h (temps minimum respecté)',
    icon: '⏱️',
    category: AchievementCategory.SPECIAL,
    rarity: AchievementRarity.EPIC,
    criteria: { type: 'custom', condition: 'course_completed_48h' },
    rewards: { xpBonus: 500, piBonus: 0.005, title: 'Speedrunner' },
    isHidden: true,
    unlockMessage: '⏱️ SPEEDRUNNER! Cours complété en temps record!',
    shareText: 'Cours complété en moins de 48h! Je suis un Speedrunner! ⏱️',
    globalUnlockRate: 0.05
  }
];

/**
 * ============================================================================
 * STREAK MILESTONES CONFIGURATION
 * ============================================================================
 */

export const STREAK_MILESTONES = [
  { days: 3, reward: { xp: 30, pi: 0.0001, badge: undefined }, claimed: false },
  { days: 7, reward: { xp: 100, pi: 0.0005, badge: 'streak-7' }, claimed: false },
  { days: 14, reward: { xp: 250, pi: 0.001, badge: undefined }, claimed: false },
  { days: 30, reward: { xp: 500, pi: 0.005, badge: 'streak-30' }, claimed: false },
  { days: 60, reward: { xp: 1000, pi: 0.01, badge: undefined }, claimed: false },
  { days: 100, reward: { xp: 2000, pi: 0.025, badge: 'streak-100' }, claimed: false },
  { days: 365, reward: { xp: 10000, pi: 0.1, badge: 'streak-365' }, claimed: false }
];

/**
 * ============================================================================
 * GAMIFICATION REWARDS CONFIGURATION
 * ============================================================================
 */

export const GAMIFICATION_REWARDS: Record<GamificationEvent, GamificationReward> = {
  [GamificationEvent.LAYER_COMPLETED]: {
    event: GamificationEvent.LAYER_COMPLETED,
    xp: 50,
    pi: 0.00005,
    energy: 0,
    message: 'Layer complété! +{xp} XP, +{pi} π',
    animation: undefined
  },
  [GamificationEvent.QUIZ_PERFECT]: {
    event: GamificationEvent.QUIZ_PERFECT,
    xp: 25,
    pi: 0.00003,
    energy: 5,
    message: 'Quiz parfait! 💯 Bonus: +{xp} XP, +{pi} π, +{energy} ⚡',
    animation: 'confetti'
  },
  [GamificationEvent.STREAK_MILESTONE]: {
    event: GamificationEvent.STREAK_MILESTONE,
    xp: 0, // Variable selon milestone
    pi: 0, // Variable
    energy: 10,
    message: 'Milestone streak atteint! 🔥',
    animation: 'fireworks'
  },
  [GamificationEvent.LEVEL_UP]: {
    event: GamificationEvent.LEVEL_UP,
    xp: 0,
    pi: 0.001,
    energy: 50,
    message: 'LEVEL UP! 🎉 Niveau {level} atteint!',
    animation: 'level_up'
  },
  [GamificationEvent.ACHIEVEMENT_UNLOCKED]: {
    event: GamificationEvent.ACHIEVEMENT_UNLOCKED,
    xp: 0, // Défini par achievement
    pi: 0,
    energy: 0,
    message: 'Achievement déverrouillé: {achievement}',
    animation: 'confetti'
  },
  [GamificationEvent.COURSE_COMPLETED]: {
    event: GamificationEvent.COURSE_COMPLETED,
    xp: 500,
    pi: 0.005,
    energy: 100,
    message: 'COURS TERMINÉ! 🎖️ +{xp} XP, +{pi} π, +{energy} ⚡',
    animation: 'fireworks'
  },
  [GamificationEvent.SOCIAL_CONTRIBUTION]: {
    event: GamificationEvent.SOCIAL_CONTRIBUTION,
    xp: 20,
    pi: 0.00002,
    energy: 2,
    message: 'Merci pour votre contribution! 🤝',
    animation: undefined
  }
};
