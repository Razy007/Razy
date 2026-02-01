import crypto from 'crypto';

export enum PaymentStatus {
  CREATED = 'CREATED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PENDING_COMPLETION = 'PENDING_COMPLETION',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED'
}

export enum PaymentDirection {
  USER_TO_APP = 'USER_TO_APP',
  APP_TO_USER = 'APP_TO_USER'
}

export class Payment {
  constructor(
    public readonly id: string,
    public readonly piPaymentId: string | null,
    public readonly userId: string,
    public readonly amount: number,
    public readonly memo: string,
    public readonly metadata: Record<string, any>,
    public readonly direction: PaymentDirection,
    public status: PaymentStatus,
    public readonly txid: string | null,
    public readonly fromAddress: string | null,
    public readonly toAddress: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  static createUserToApp(data: {
    userId: string;
    amount: number;
    memo: string;
    metadata?: Record<string, any>;
  }): Payment {
    return new Payment(
      crypto.randomUUID(),
      null,
      data.userId,
      data.amount,
      data.memo,
      data.metadata || {},
      PaymentDirection.USER_TO_APP,
      PaymentStatus.CREATED,
      null,
      null,
      null,
      new Date(),
      new Date()
    );
  }

  updateStatus(newStatus: PaymentStatus): void {
    this.status = newStatus;
  }
}
