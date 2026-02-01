const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const args = process.argv.slice(2);
const command = args[0];
const targetUser = args[1];
const value = args[2];

if (!command || !targetUser) {
    console.log(`
    🔴 Usage: node admin_actions.js <command> <username/id> [value]

    COMMANDS:
      --info     <user>         : Show full details for a user
      --ban      <user>         : Ban a user (set level to -1)
      --unban    <user>         : Unban a user
      --add-pi   <user> <amt>   : Add Pi to balance (e.g. for support/refund)
      --set-xp   <user> <amt>   : Set specific XP amount
      --delete   <user>         : ⚠️ DELETE user permanently
    `);
    process.exit(1);
}

async function run() {
    try {
        await client.connect();

        // 1. Find User
        // On cherche par ID ou Username (case insensitive)
        const findRes = await client.query(`
            SELECT * FROM users 
            WHERE username ILIKE $1 OR id::text = $1 
            LIMIT 1
        `, [targetUser]);

        if (findRes.rows.length === 0) {
            console.error(`❌ User '${targetUser}' not found.`);
            process.exit(1);
        }

        const user = findRes.rows[0];
        console.log(`✅ Found User: ${user.username} (ID: ${user.id}) | Current Balance: ${user.pi_balance} π`);

        // 2. Execute Command
        switch (command) {
            case '--info':
                console.log(JSON.stringify(user, null, 2));
                break;

            case '--ban':
                await client.query("UPDATE users SET level = -1, username = username || '_BANNED' WHERE id = $1", [user.id]);
                console.log(`🚫 User ${user.username} has been BANNED.`);
                break;

            case '--unban':
                await client.query("UPDATE users SET level = 1 WHERE id = $1", [user.id]);
                console.log(`🕊️ User ${user.username} has been UNBANNED.`);
                break;

            case '--add-pi':
                if (!value || isNaN(value)) { throw new Error("Please specify amount: --add-pi user 10"); }
                const newBalance = parseFloat(user.pi_balance) + parseFloat(value);
                await client.query("UPDATE users SET pi_balance = $1 WHERE id = $2", [newBalance, user.id]);
                console.log(`💰 Added ${value} π. New Balance: ${newBalance.toFixed(6)} π`);
                break;

            case '--set-xp':
                if (!value || isNaN(value)) { throw new Error("Please specify amount: --set-xp user 1000"); }
                await client.query("UPDATE users SET xp = $1 WHERE id = $2", [value, user.id]);
                console.log(`⭐ XP set to ${value}.`);
                break;
            
            case '--delete':
                // Safety check
                if (value !== 'CONFIRM') {
                    console.log("⚠️  To delete, you must type: node admin_actions.js --delete <user> CONFIRM");
                } else {
                    await client.query("DELETE FROM users WHERE id = $1", [user.id]);
                    console.log(`🗑️ User ${user.username} DELETED.`);
                }
                break;

            default:
                console.log("Unknown command.");
        }

    } catch (e) {
        console.error("❌ Error:", e.message);
    } finally {
        await client.end();
    }
}

run();
