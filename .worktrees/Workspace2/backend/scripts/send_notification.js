const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const args = process.argv.slice(2);
const target = args[0]; // 'all' or username
const type = args[1];   // 'info', 'warning', 'success', 'ban'
const title = args[2];
const message = args[3];

if (!target || !type || !title || !message) {
    console.log(`
    🔴 Usage: node send_notification.js <target> <type> <title> <message>
    
    <target>  : 'all' for everyone, or specific 'username'
    <type>    : info, warning, success, ban
    <title>   : "Title in quotes"
    <message> : "Message in quotes"

    Example:
    node send_notification.js all info "Maintenance" "Server update in 10 mins"
    node send_notification.js PioneerToto warning "Warning" "Please stop spamming"
    `);
    process.exit(1);
}

async function run() {
    try {
        await client.connect();

        let userId = null;

        // 1. Resolve Target
        if (target.toLowerCase() !== 'all') {
            const userRes = await client.query('SELECT id FROM users WHERE username ILIKE $1', [target]);
            if (userRes.rows.length === 0) {
                console.error(`❌ User '${target}' not found.`);
                process.exit(1);
            }
            userId = userRes.rows[0].id;
        }

        // 2. Insert Notification
        await client.query(`
            INSERT INTO notifications (user_id, type, title, message)
            VALUES ($1, $2, $3, $4)
        `, [userId, type, title, message]);

        console.log(`✅ Notification sent to [${target.toUpperCase()}]`);
        console.log(`   Title: ${title}`);
        console.log(`   Msg:   ${message}`);

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await client.end();
    }
}

run();
