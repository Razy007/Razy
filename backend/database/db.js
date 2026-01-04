const { MongoClient } = require('mongodb');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'pi_academy';

let db = null;
let client = null;

/**
 * Connect to MongoDB
 */
const connectDB = async () => {
    try {
        client = new MongoClient(MONGO_URI, {
            useUnifiedTopology: true,
            maxPoolSize: 10,
            minPoolSize: 2,
        });

        await client.connect();
        db = client.db(DB_NAME);

        console.log(`✅ MongoDB connected: ${DB_NAME}`);
        
        // Create indexes
        await createIndexes();
        
        return db;
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        throw error;
    }
};

/**
 * Get database instance
 */
const getDB = () => {
    if (!db) {
        throw new Error('Database not initialized. Call connectDB() first.');
    }
    return db;
};

/**
 * Get collection
 */
const getCollection = (name) => {
    return getDB().collection(name);
};

/**
 * Create database indexes
 */
const createIndexes = async () => {
    try {
        // Users collection indexes
        await getCollection('users').createIndex({ uid: 1 }, { unique: true });
        await getCollection('users').createIndex({ username: 1 });
        await getCollection('users').createIndex({ authStatus: 1, kycStatus: 1 });

        // Transactions collection indexes
        await getCollection('transactions').createIndex({ userId: 1 });
        await getCollection('transactions').createIndex({ type: 1 });
        await getCollection('transactions').createIndex({ timestamp: -1 });

        // Staking collection indexes
        await getCollection('staking').createIndex({ userId: 1 }, { unique: true });
        await getCollection('staking').createIndex({ active: 1 });

        // Posts collection indexes
        await getCollection('posts').createIndex({ userId: 1 });
        await getCollection('posts').createIndex({ timestamp: -1 });

        // Progress collection indexes
        await getCollection('progress').createIndex({ userId: 1 }, { unique: true });

        console.log('✅ Database indexes created');
    } catch (error) {
        console.error('⚠️  Index creation warning:', error.message);
    }
};

/**
 * Close database connection
 */
const closeDB = async () => {
    if (client) {
        await client.close();
        console.log('📴 MongoDB connection closed');
    }
};

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Find user by UID
 */
const findUserByUid = async (uid) => {
    return await getCollection('users').findOne({ uid });
};

/**
 * Create or update user
 */
const upsertUser = async (userData) => {
    return await getCollection('users').updateOne(
        { uid: userData.uid },
        { $set: { ...userData, updatedAt: new Date() } },
        { upsert: true }
    );
};

/**
 * Get user progress
 */
const getUserProgress = async (userId) => {
    return await getCollection('progress').findOne({ userId });
};

/**
 * Update user progress
 */
const updateUserProgress = async (userId, progressData) => {
    return await getCollection('progress').updateOne(
        { userId },
        { 
            $set: { ...progressData, updatedAt: new Date() },
            $setOnInsert: { createdAt: new Date() }
        },
        { upsert: true }
    );
};

/**
 * Create transaction
 */
const createTransaction = async (transactionData) => {
    return await getCollection('transactions').insertOne({
        ...transactionData,
        timestamp: new Date(),
        status: 'completed'
    });
};

/**
 * Get user transactions
 */
const getUserTransactions = async (userId, limit = 50) => {
    return await getCollection('transactions')
        .find({ userId })
        .sort({ timestamp: -1 })
        .limit(limit)
        .toArray();
};

/**
 * Start staking (atomic transaction)
 */
const startStaking = async (userId, amount, period) => {
    const session = client.startSession();
    
    try {
        await session.withTransaction(async () => {
            // 1. Check user balance
            const progress = await getCollection('progress').findOne({ userId }, { session });
            
            if (!progress || progress.piBalance < amount) {
                throw new Error('Solde insuffisant');
            }

            // 2. Update balance and staking
            await getCollection('progress').updateOne(
                { userId },
                {
                    $inc: { piBalance: -amount, stakingBalance: amount },
                    $set: {
                        stakingStartDate: new Date(),
                        stakingPeriod: period,
                        updatedAt: new Date()
                    }
                },
                { session }
            );

            // 3. Create staking record
            await getCollection('staking').updateOne(
                { userId },
                {
                    $set: {
                        userId,
                        amount,
                        period,
                        startDate: new Date(),
                        active: true,
                        updatedAt: new Date()
                    }
                },
                { upsert: true, session }
            );

            // 4. Record transaction
            await getCollection('transactions').insertOne({
                userId,
                type: 'staking_start',
                amount,
                period,
                timestamp: new Date(),
                status: 'completed'
            }, { session });
        });

        return { success: true };
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
};

/**
 * Unstake (atomic transaction)
 */
const unstake = async (userId) => {
    const session = client.startSession();
    
    try {
        let totalAmount = 0;

        await session.withTransaction(async () => {
            // 1. Get staking info
            const staking = await getCollection('staking').findOne({ userId, active: true }, { session });
            
            if (!staking) {
                throw new Error('Aucun staking actif');
            }

            // 2. Calculate rewards
            const now = new Date();
            const elapsed = now - staking.startDate;
            const daysElapsed = elapsed / (1000 * 60 * 60 * 24);
            
            let apr = 0.05; // 5% base
            if (staking.period === 60) apr = 0.08;
            if (staking.period === 90) apr = 0.12;

            const rewards = (staking.amount * apr * daysElapsed) / 365;
            totalAmount = staking.amount + rewards;

            // 3. Update balance
            await getCollection('progress').updateOne(
                { userId },
                {
                    $inc: { piBalance: totalAmount, stakingBalance: -staking.amount },
                    $set: {
                        stakingStartDate: null,
                        stakingPeriod: null,
                        stakingRewards: 0,
                        updatedAt: new Date()
                    }
                },
                { session }
            );

            // 4. Deactivate staking
            await getCollection('staking').updateOne(
                { userId },
                {
                    $set: {
                        active: false,
                        endDate: now,
                        rewards,
                        updatedAt: now
                    }
                },
                { session }
            );

            // 5. Record transaction
            await getCollection('transactions').insertOne({
                userId,
                type: 'staking_end',
                amount: totalAmount,
                principal: staking.amount,
                rewards,
                timestamp: now,
                status: 'completed'
            }, { session });
        });

        return { success: true, totalAmount };
    } catch (error) {
        throw error;
    } finally {
        await session.endSession();
    }
};

module.exports = {
    connectDB,
    getDB,
    getCollection,
    closeDB,
    // User operations
    findUserByUid,
    upsertUser,
    // Progress operations
    getUserProgress,
    updateUserProgress,
    // Transaction operations
    createTransaction,
    getUserTransactions,
    // Staking operations
    startStaking,
    unstake
};
