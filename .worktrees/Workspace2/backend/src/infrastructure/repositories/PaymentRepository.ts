import { Pool } from 'pg';
import { Payment, PaymentStatus } from '../../domain/entities/Payment';

export interface IPaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByPiPaymentId(piPaymentId: string): Promise<Payment | null>;
  findByUserId(userId: string, limit?: number): Promise<Payment[]>;
  updateStatus(id: string, status: PaymentStatus, txid?: string): Promise<void>;
}

export class PaymentRepository implements IPaymentRepository {
  constructor(private db: Pool) {}

  async save(payment: Payment): Promise<Payment> {
    const query = `
      INSERT INTO payments (
        id, pi_payment_id, user_id, amount, memo, metadata,
        direction, status, txid, from_address, to_address,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      ON CONFLICT (id) DO UPDATE SET
        status = $8,
        txid = $9,
        updated_at = $13
      RETURNING *
    `;

    const values = [
      payment.id,
      payment.piPaymentId,
      payment.userId,
      payment.amount,
      payment.memo,
      JSON.stringify(payment.metadata),
      payment.direction,
      payment.status,
      payment.txid,
      payment.fromAddress,
      payment.toAddress,
      payment.createdAt,
      payment.updatedAt
    ];

    const result = await this.db.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async findById(id: string): Promise<Payment | null> {
    const query = 'SELECT * FROM payments WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async findByPiPaymentId(piPaymentId: string): Promise<Payment | null> {
    const query = 'SELECT * FROM payments WHERE pi_payment_id = $1';
    const result = await this.db.query(query, [piPaymentId]);
    return result.rows[0] ? this.mapToEntity(result.rows[0]) : null;
  }

  async findByUserId(userId: string, limit = 50): Promise<Payment[]> {
    const query = `
      SELECT * FROM payments 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await this.db.query(query, [userId, limit]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  async updateStatus(id: string, status: PaymentStatus, txid?: string): Promise<void> {
    const query = `
      UPDATE payments 
      SET status = $1, txid = $2, updated_at = NOW()
      WHERE id = $3
    `;
    await this.db.query(query, [status, txid || null, id]);
  }

  private mapToEntity(row: any): Payment {
    return new Payment(
      row.id,
      row.pi_payment_id,
      row.user_id,
      parseFloat(row.amount),
      row.memo,
      typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      row.direction,
      row.status,
      row.txid,
      row.from_address,
      row.to_address,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}
