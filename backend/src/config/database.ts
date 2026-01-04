import mongoose from 'mongoose';
import config from './env';

/**
 * MongoDB Connection Manager
 * Handles database connection with retry logic and graceful shutdown
 */
class DatabaseManager {
    private isConnected: boolean = false;
    private retryCount: number = 0;
    private maxRetries: number = 5;
    private retryDelay: number = 5000; // 5 seconds

    /**
     * Connect to MongoDB with retry logic
     */
    async connect(): Promise<void> {
        if (this.isConnected) {
            console.log('✅ Already connected to MongoDB');
            return;
        }

        try {
            await mongoose.connect(config.database.uri, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            this.isConnected = true;
            this.retryCount = 0;

            console.log('✅ Connected to MongoDB successfully');
            console.log(`📊 Database: ${mongoose.connection.name}`);

            // Handle connection events
            mongoose.connection.on('error', (error) => {
                console.error('❌ MongoDB connection error:', error);
                this.isConnected = false;
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️  MongoDB disconnected');
                this.isConnected = false;
                this.reconnect();
            });

        } catch (error) {
            console.error('❌ Failed to connect to MongoDB:', error);
            this.isConnected = false;
            
            if (this.retryCount < this.maxRetries) {
                this.retryCount++;
                console.log(`🔄 Retrying connection (${this.retryCount}/${this.maxRetries}) in ${this.retryDelay / 1000}s...`);
                setTimeout(() => this.connect(), this.retryDelay);
            } else {
                console.error('❌ Max retries reached. Exiting...');
                process.exit(1);
            }
        }
    }

    /**
     * Reconnect to MongoDB
     */
    private async reconnect(): Promise<void> {
        if (!this.isConnected && this.retryCount < this.maxRetries) {
            await this.connect();
        }
    }

    /**
     * Disconnect from MongoDB gracefully
     */
    async disconnect(): Promise<void> {
        if (!this.isConnected) {
            return;
        }

        try {
            await mongoose.connection.close();
            this.isConnected = false;
            console.log('✅ Disconnected from MongoDB gracefully');
        } catch (error) {
            console.error('❌ Error disconnecting from MongoDB:', error);
            throw error;
        }
    }

    /**
     * Get connection status
     */
    getStatus(): boolean {
        return this.isConnected;
    }

    /**
     * Health check
     */
    async healthCheck(): Promise<{ connected: boolean; database?: string }> {
        try {
            if (!this.isConnected || !mongoose.connection.db) {
                return { connected: false };
            }

            await mongoose.connection.db.admin().ping();
            
            return {
                connected: true,
                database: mongoose.connection.name,
            };
        } catch (error) {
            return { connected: false };
        }
    }
}

// Export singleton instance
export const db = new DatabaseManager();

export default db;
