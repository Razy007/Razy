import mongoose from 'mongoose';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/razy_pi_network';
const PG_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'razy_pi_network',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
};

async function migrate() {
  console.log('🚀 Starting Migration: MongoDB -> PostgreSQL');

  try {
    console.log(`Connecting to MongoDB: ${MONGO_URI}`);
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log(`Connecting to PostgreSQL: ${JSON.stringify(PG_CONFIG)}`);
    const pgPool = new Pool(PG_CONFIG);
    await pgPool.query('SELECT 1');
    console.log('✅ Connected to PostgreSQL');

    // 1. Migrate Users
    console.log('👥 Migrating Users...');
    const sourceDbName = process.env.MONGO_SOURCE_DB || 'pi_academy';
    console.log(`Using source database: ${sourceDbName}`);
    const db = mongoose.connection.useDb(sourceDbName);
    const mongoUsers = await db.collection('users').find().toArray();
    console.log(`Found ${mongoUsers.length} users in MongoDB`);
    for (const u of mongoUsers) {
      const query = `
        INSERT INTO users (
          id, pi_id, username, email, role, kyc_status, 
          pi_balance, energy_balance, staking_balance, total_earned,
          level, xp, streak, last_login_date, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (pi_id) DO NOTHING
      `;
      const values = [
        u._id.toString(), u.piId, u.username, u.email, u.role || 'guest', u.kycStatus || 'none',
        u.piBalance || 0, u.energyBalance || 100, u.stakingBalance || 0, u.totalEarned || 0,
        u.level || 1, u.xp || 0, u.streak || 0, u.lastLoginDate || new Date(),
        u.createdAt || new Date(), u.updatedAt || new Date()
      ];
      await pgPool.query(query, values);
    }
    console.log(`✅ Migrated ${mongoUsers.length} users`);

    // 2. Migrate Staking
    console.log('💰 Migrating Staking...');
    const mongoStakes = await db.collection('stakings').find().toArray();
    for (const s of mongoStakes) {
      const query = `
        INSERT INTO staking (
          id, user_id, amount, period, apy, start_date, end_date, 
          status, reward_earned, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
      `;
      const values = [
        s._id.toString(), s.userId, s.amount, s.period, s.apy,
        s.startDate, s.endDate, s.status, s.rewardEarned || 0,
        s.createdAt || new Date(), s.updatedAt || new Date()
      ];
      await pgPool.query(query, values);
    }
    console.log(`✅ Migrated ${mongoStakes.length} stakes`);

    // 3. Migrate Transactions
    console.log('📊 Migrating Transactions...');
    const mongoTrans = await db.collection('transactions').find().toArray();
    for (const t of mongoTrans) {
      const query = `
        INSERT INTO transactions (
          id, user_id, type, amount, energy_amount, status, 
          description, metadata, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING
      `;
      const values = [
        t._id.toString(), t.userId, t.type, t.amount, t.energyAmount || 0,
        t.status, t.description, JSON.stringify(t.metadata || {}),
        t.createdAt || new Date(), t.updatedAt || new Date()
      ];
      await pgPool.query(query, values);
    }
    console.log(`✅ Migrated ${mongoTrans.length} transactions`);

    console.log('🎉 Migration Completed Successfully!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Migration Failed Error Detail:');
    console.error(error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

migrate();
