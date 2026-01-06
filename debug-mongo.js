import mongoose from 'mongoose';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import process from 'process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from current directory (root)
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: envPath });

console.log('🔍 MongoDB Debug Tool');
console.log('---------------------');
console.log(`Loading .env from: ${envPath}`);

if (!process.env.MONGO_URI) {
    // Fallback try parent dir just in case
    const parentEnv = path.join(__dirname, '../.env');
    dotenv.config({ path: parentEnv });
    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI is missing from .env');
        process.exit(1);
    }
}

// Hide password in logs
const maskedUri = process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@');
console.log(`URI: ${maskedUri}`);
console.log('Connecting...');

mongoose.connect(process.env.MONGO_URI, {
    // Removed deprecated options and simplified
    serverSelectionTimeoutMS: 5000
})
.then(() => {
    console.log('✅ CONNECTED SUCCESSFULLY!');
    console.log('Database state:', mongoose.connection.readyState);
    return mongoose.connection.close();
})
.then(() => {
    console.log('Disconnection successful. Test passed.');
    process.exit(0);
})
.catch(err => {
    console.error('❌ CONNECTION FAILED');
    console.error('Error Name:', err.name);
    console.error('Error Message:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
    if (err.reason) console.error('Reason:', err.reason);
    process.exit(1);
});
