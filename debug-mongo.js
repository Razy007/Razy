const mongoose = require('mongoose');
const path = require('path');
// Try to load .env from parent directory (if script is in backend/) OR current directory
const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

console.log('🔍 MongoDB Debug Tool');
console.log('---------------------');
console.log(`Loading .env from: ${envPath}`);

if (!process.env.MONGO_URI) {
    // Fallback try current dir
    require('dotenv').config({ path: path.join(__dirname, '.env') });
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
