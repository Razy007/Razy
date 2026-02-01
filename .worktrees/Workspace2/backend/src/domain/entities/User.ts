import crypto from 'crypto';

export enum UserRole {
  GUEST = 'guest',
  PIONEER_NON_KYC = 'pioneer_non_kyc',
  PIONEER_KYC = 'pioneer_kyc'
}

export enum KycStatus {
  NONE = 'none',
  PENDING = 'pending',
  VERIFIED = 'verified',
  REJECTED = 'rejected'
}

export class User {
  constructor(
    public readonly id: string,
    public readonly piId: string,
    public readonly username: string,
    public readonly email: string | null,
    public role: UserRole,
    public kycStatus: KycStatus,
    public piBalance: number,
    public energyBalance: number,
    public stakingBalance: number,
    public totalEarned: number,
    public level: number,
    public xp: number,
    public streak: number,
    public lastLoginDate: Date,
    public readonly completedLayers: Record<string, string[]>,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public avatarUrl: string | null = null,
    public inventory: any[] = [],
    public transferableBalance: number = 0,
    public quizAttempts: Record<string, any> = {}
  ) {}

  static create(data: {
    piId: string;
    username: string;
    email?: string;
  }): User {
    const now = new Date();
    return new User(
      crypto.randomUUID(),
      data.piId,
      data.username,
      data.email || null,
      UserRole.GUEST,
      KycStatus.NONE,
      0,
      100,
      0,
      0,
      1,
      0,
      0,
      now,
      {},
      now,
      now,
      null,
      [], // inventory
      0, // transferableBalance
      {} // quizAttempts
    );
  }

  isKycVerified(): boolean {
    return this.kycStatus === KycStatus.VERIFIED;
  }

  addXp(amount: number): void {
    this.xp += amount;
    // HARDCORE: 500 XP per level
    const newLevel = Math.floor(this.xp / 500) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.energyBalance = Math.min(this.energyBalance + 50, 1000);
    }
  }

  completeLayer(courseId: string, layerId: string): boolean {
    if (!this.completedLayers[courseId]) {
      this.completedLayers[courseId] = [];
    }
    
    if (this.completedLayers[courseId].includes(layerId)) {
      return false;
    }
    
    this.completedLayers[courseId].push(layerId);
    return true;
  }

  isLayerCompleted(courseId: string, layerId: string): boolean {
    return this.completedLayers[courseId]?.includes(layerId) || false;
  }
}
