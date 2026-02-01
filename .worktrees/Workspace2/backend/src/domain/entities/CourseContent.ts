/**
 * ============================================================================
 * COURSE CONTENT ENTITIES - Système de Contenu Enrichi v2.0
 * ============================================================================
 * Architecture pour cours multimédias avec vidéos, simulations, cas pratiques
 * Conforme Pi Network - Focus qualité et rétention utilisateur
 * ============================================================================
 */

export enum ContentType {
  TEXT = 'text',
  VIDEO = 'video',
  INTERACTIVE_SIMULATION = 'interactive_simulation',
  CASE_STUDY = 'case_study',
  CODE_SANDBOX = 'code_sandbox',
  QUIZ = 'quiz',
  PRACTICE_LAB = 'practice_lab',
  INFOGRAPHIC = 'infographic',
  PODCAST = 'podcast'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum ContentStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  SCHEDULED = 'scheduled'
}

/**
 * Ressource Vidéo
 */
export interface VideoResource {
  provider: 'youtube' | 'vimeo' | 'cloudflare' | 'self-hosted';
  videoId: string;
  url: string;
  duration: number; // en secondes
  thumbnail: string;
  subtitles?: {
    language: string;
    url: string;
  }[];
  chapters?: {
    time: number;
    title: string;
    description?: string;
  }[];
  quality: string[]; // ['480p', '720p', '1080p']
  transcription?: string; // Pour accessibilité et SEO
}

/**
 * Simulation Interactive
 */
export interface InteractiveSimulation {
  type: 'pi-wallet-practice' | 'smart-contract-deploy' | 'transaction-flow' | 'mining-simulator' | 'kyc-process';
  iframeUrl?: string;
  embedCode?: string;
  interactionPoints: {
    id: string;
    label: string;
    action: string;
    feedback: string;
  }[];
  successCriteria: {
    minScore: number;
    requiredActions: string[];
  };
  hints?: string[];
}

/**
 * Cas Pratique (Case Study)
 */
export interface CaseStudy {
  title: string;
  scenario: string;
  context: {
    industry?: string;
    protagonist?: string;
    challenge: string;
    constraints?: string[];
  };
  challenges: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'open-ended' | 'code-challenge';
    options?: string[];
    correctAnswer?: string | string[];
    explanation: string;
    resources?: string[];
  }[];
  realWorldExample?: {
    company: string;
    outcome: string;
    metrics?: Record<string, string>;
  };
}

/**
 * Code Sandbox
 */
export interface CodeSandbox {
  language: 'javascript' | 'typescript' | 'python' | 'solidity';
  starterCode: string;
  solution?: string;
  tests?: {
    name: string;
    assertion: string;
  }[];
  environment: {
    dependencies?: Record<string, string>;
    files?: Record<string, string>;
  };
  hints?: string[];
}

/**
 * Practice Lab
 */
export interface PracticeLab {
  title: string;
  objective: string;
  estimatedTime: number; // minutes
  prerequisites: string[];
  steps: {
    order: number;
    instruction: string;
    expectedOutcome: string;
    validation?: {
      type: 'code' | 'screenshot' | 'text';
      criteria: string;
    };
  }[];
  resources: {
    type: 'documentation' | 'video' | 'template' | 'tool';
    title: string;
    url: string;
  }[];
}

/**
 * Contenu de Layer (Lesson/Chapter)
 */
export interface LayerContent {
  layerId: string;
  courseId: string;
  
  // Métadonnées
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  estimatedDuration: number; // minutes
  tags: string[];
  
  // Contenu principal
  contentType: ContentType;
  
  // Texte enrichi (toujours présent)
  markdown: string;
  
  // Contenu multimédia (optionnel selon type)
  video?: VideoResource;
  simulation?: InteractiveSimulation;
  caseStudy?: CaseStudy;
  codeSandbox?: CodeSandbox;
  practiceLab?: PracticeLab;
  
  // Ressources complémentaires
  attachments?: {
    type: 'pdf' | 'slide' | 'worksheet' | 'cheatsheet';
    title: string;
    url: string;
    sizeInBytes: number;
  }[];
  
  // Quiz associé
  quizId?: string;
  quizRequired: boolean;
  
  // Progression
  xpReward: number;
  energyCost: number;
  unlockConditions?: string[]; // IDs des layers prérequis
  
  // Métadonnées publication
  status: ContentStatus;
  publishedAt?: Date;
  scheduledFor?: Date;
  lastUpdated: Date;
  version: string; // Pour tracking mises à jour
  author: {
    name: string;
    role: string;
  };
  
  // Analytics
  viewCount?: number;
  completionRate?: number;
  averageRating?: number;
}

/**
 * Course complet
 */
export class EnrichedCourse {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly category: string,
    public difficulty: DifficultyLevel,
    public estimatedHours: number,
    public thumbnail: string,
    public instructors: {
      name: string;
      title: string;
      avatar?: string;
      bio?: string;
    }[],
    public syllabus: {
      moduleId: string;
      title: string;
      description: string;
      layerIds: string[];
    }[],
    public learningObjectives: string[],
    public prerequisites: string[],
    public targetAudience: string[],
    public certificationAvailable: boolean,
    public tags: string[],
    public status: ContentStatus,
    public bannerImage?: string,
    public publishedAt?: Date,
    public enrollmentCount: number = 0,
    public averageRating: number = 0,
    public reviewCount: number = 0,
    public layers: LayerContent[] = []
  ) {}
}

/**
 * Système de mise à jour automatique
 */
export interface ContentUpdateManifest {
  version: string;
  releaseDate: Date;
  changes: {
    type: 'new' | 'updated' | 'deprecated';
    courseId: string;
    layerId?: string;
    description: string;
    breaking?: boolean;
  }[];
  downloadUrl: string;
  checksum: string;
}

/**
 * Configuration CMS Headless
 */
export interface CMSConfiguration {
  provider: 'strapi' | 'contentful' | 'sanity' | 'custom';
  apiUrl: string;
  apiKey: string;
  webhookSecret?: string;
  syncInterval: number; // minutes
  autoPublish: boolean;
  cacheTTL: number; // secondes
}
