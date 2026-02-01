import mongoose, { Schema, Document } from 'mongoose';

export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected'
}

export interface IWithdrawalRequest extends Document {
  userId: string; // Lié au Pi ID
  amount: number;
  walletAddress: string;
  status: WithdrawalStatus;
  txHash?: string;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalRequestSchema = new Schema<IWithdrawalRequest>(
  {
    userId: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    walletAddress: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(WithdrawalStatus),
      default: WithdrawalStatus.PENDING,
      index: true
    },
    txHash: { type: String },
    adminNote: { type: String }
  },
  { timestamps: true }
);

export const WithdrawalRequest = mongoose.model<IWithdrawalRequest>('WithdrawalRequest', withdrawalRequestSchema);
