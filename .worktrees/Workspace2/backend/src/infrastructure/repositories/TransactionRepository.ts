import { Pool } from 'pg';
import { Transaction, TransactionType, TransactionStatus } from '../../domain/entities/Transaction';

export class TransactionRepository {
  constructor(private db: Pool) {}

  async save(transaction: Transaction): Promise<Transaction> {
    const query = `
      INSERT INTO transactions (
        id, user_id, type, amount, energy_amount, status, 
        description, metadata, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (id) DO UPDATE SET
        status = $6,
        metadata = $8,
        updated_at = NOW()
      RETURNING *
    `;

    const values = [
      transaction.id, transaction.userId, transaction.type, transaction.amount,
      transaction.energyAmount, transaction.status, transaction.description,
      JSON.stringify(transaction.metadata), transaction.createdAt, transaction.updatedAt
    ];

    const result = await this.db.query(query, values);
    return this.mapToEntity(result.rows[0]);
  }

  async findByUserId(userId: string, limit = 50): Promise<Transaction[]> {
    const query = 'SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2';
    const result = await this.db.query(query, [userId, limit]);
    return result.rows.map(row => this.mapToEntity(row));
  }

  private mapToEntity(row: any): Transaction {
    return new Transaction(
      row.id,
      row.user_id,
      row.type as TransactionType,
      parseFloat(row.amount),
      parseInt(row.energy_amount),
      row.status as TransactionStatus,
      row.description,
      typeof row.metadata === 'string' ? JSON.parse(row.metadata) : row.metadata,
      new Date(row.created_at),
      new Date(row.updated_at)
    );
  }
}
