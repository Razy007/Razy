import { Request } from 'express';

/**
 * ============================================================================
 * USER TYPES
 * ============================================================================
 */

export type UserRole = 'guest' | 'pioneer_non_kyc' | 'pioneer_kyc';
export type KycStatus = 'none' | 'pending' | 'verified' | 'rejected';

export interface IUser {
    _id: string;
    piId: string;
    username: string;
    email?: string;
    role: UserRole;
    kycStatus: KycStatus;
    piBalance: number;
    energyBalance: number;
    stakingBalance: number;
    totalEarned: number;
    level: number;
    xp: number;
    streak: number;
    lastLoginDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * ============================================================================
 * AUTHENTICATION TYPES
 * ============================================================================
 */

export interface IJwtPayload {
    userId: string;
    piId: string;
    role: UserRole;
    kycStatus: KycStatus;
}

export interface IAuthRequest extends Request {
    user?: IJwtPayload;
}

export interface IPiAuthPayload {
    uid: string;
    username: string;
    accessToken: string;
}

/**
 * ============================================================================
 * STAKING TYPES
 * ============================================================================
 */

export type StakingStatus = 'active' | 'completed' | 'cancelled';

export interface IStaking {
    _id: string;
    userId: string;
    amount: number;
    period: number; // in days
    apy: number; // Annual Percentage Yield
    startDate: Date;
    endDate: Date;
    status: StakingStatus;
    rewardEarned: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStakingRequest {
    amount: number;
    period: number;
}

/**
 * ============================================================================
 * SHOP TYPES
 * ============================================================================
 */

export type ProductType = 'energy' | 'boost' | 'cosmetic';

export interface IProduct {
    _id: string;
    productId: string;
    name: string;
    description: string;
    type: ProductType;
    cost: number;
    energyGain?: number;
    boostMultiplier?: number;
    boostDuration?: number; // in hours
    imageUrl?: string;
    isAvailable: boolean;
    requiredKyc: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IPurchaseRequest {
    productId: string;
}

export interface IPurchase {
    _id: string;
    userId: string;
    productId: string;
    cost: number;
    energyGained?: number;
    purchaseDate: Date;
}

/**
 * ============================================================================
 * TRANSACTION TYPES
 * ============================================================================
 */

export type TransactionType = 
    | 'quiz_reward'
    | 'staking_reward'
    | 'purchase'
    | 'withdrawal'
    | 'energy_purchase'
    | 'referral_bonus';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface ITransaction {
    _id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    energyAmount?: number;
    status: TransactionStatus;
    description: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

export interface IWithdrawalRequest {
    amount: number;
    piWalletAddress: string;
}

/**
 * ============================================================================
 * QUIZ TYPES
 * ============================================================================
 */

export type QuizDifficulty = 'beginner' | 'intermediate' | 'advanced';

export interface IQuizQuestion {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface IQuiz {
    _id: string;
    courseId: string;
    title: string;
    difficulty: QuizDifficulty;
    questions: IQuizQuestion[];
    rewardPi: number;
    rewardXp: number;
    energyCost: number;
    requiredLevel: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IQuizAttempt {
    _id: string;
    userId: string;
    quizId: string;
    answers: number[];
    score: number;
    passed: boolean;
    rewardEarned: number;
    xpEarned: number;
    completedAt: Date;
}

export interface IQuizSubmission {
    quizId: string;
    answers: number[];
}

/**
 * ============================================================================
 * SOCIAL TYPES
 * ============================================================================
 */

export interface IPost {
    _id: string;
    userId: string;
    username: string;
    content: string;
    imageUrl?: string;
    likes: string[]; // Array of user IDs
    comments: IComment[];
    createdAt: Date;
    updatedAt: Date;
}

export interface IComment {
    _id: string;
    userId: string;
    username: string;
    content: string;
    likes: string[];
    replies: IComment[];
    createdAt: Date;
}

export interface IPostRequest {
    content: string;
    imageUrl?: string;
}

export interface ICommentRequest {
    postId: string;
    content: string;
    parentCommentId?: string; // For replies
}

/**
 * ============================================================================
 * COURSE TYPES
 * ============================================================================
 */

export type CourseCategory = 
    | 'blockchain'
    | 'pi_network'
    | 'web3'
    | 'defi'
    | 'nft'
    | 'security';

export interface ICourse {
    _id: string;
    courseId: string;
    title: string;
    description: string;
    category: CourseCategory;
    difficulty: QuizDifficulty;
    duration: number; // in minutes
    content: string;
    videoUrl?: string;
    requiredLevel: number;
    xpReward: number;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ICourseProgress {
    _id: string;
    userId: string;
    courseId: string;
    completed: boolean;
    progress: number; // 0-100
    lastAccessedAt: Date;
    completedAt?: Date;
}

/**
 * ============================================================================
 * API RESPONSE TYPES
 * ============================================================================
 */

export interface IApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    code?: string;
}

export interface IPaginatedResponse<T> extends IApiResponse<T[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

/**
 * ============================================================================
 * ERROR TYPES
 * ============================================================================
 */

export class AppError extends Error {
    constructor(
        public message: string,
        public statusCode: number = 500,
        public code?: string,
        public isOperational: boolean = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}

export class ValidationError extends AppError {
    constructor(message: string, code?: string) {
        super(message, 400, code || 'VALIDATION_ERROR');
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string = 'Authentication required', code?: string) {
        super(message, 401, code || 'AUTHENTICATION_ERROR');
    }
}

export class AuthorizationError extends AppError {
    constructor(message: string = 'Insufficient permissions', code?: string) {
        super(message, 403, code || 'AUTHORIZATION_ERROR');
    }
}

export class NotFoundError extends AppError {
    constructor(message: string = 'Resource not found', code?: string) {
        super(message, 404, code || 'NOT_FOUND');
    }
}
