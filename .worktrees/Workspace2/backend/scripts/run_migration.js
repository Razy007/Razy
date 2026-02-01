const { Client } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const dbUrl = process.env.DATABASE_URL || 
              `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const isProduction = process.env.NODE_ENV === 'production';

const client = new Client({
    connectionString: dbUrl,
    ssl: isProduction ? { rejectUnauthorized: false } : false
});

async function run() {
    try {
        await client.connect();
        
        const sqlPath = path.join(__dirname, '../migrations/create_notifications_table.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');
        
        console.log('Running migration...');
        await client.query(sql);
        console.log('✅ Migration success: Notifications table created.');
        
    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await client.end();
    }
}

run();
