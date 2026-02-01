const { Client } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    try {
        await client.connect();
        
        console.log("\n=========================================");
        console.log("   ACADEMY OF PI - ADMIN DASHBOARD");
        console.log("=========================================\n");

        // 1. GLOBAL STATS
        const stats = await client.query(`
            SELECT 
                COUNT(*) as total_users, 
                SUM(pi_balance) as total_pi_liability,
                AVG(xp) as avg_xp
            FROM users;
        `);
        console.log("📊 CRITICAL METRICS:");
        console.log(`   Total Users:      ${stats.rows[0].total_users}`);
        console.log(`   Pending Payouts:  ${stats.rows[0].total_pi_liability} π`); // Total que vous devez aux joueurs
        console.log(`   Average XP:       ${parseFloat(stats.rows[0].avg_xp).toFixed(0)} pts`);
        console.log("\n-----------------------------------------");

        // 2. TOP 20 RICH LIST (Pour valider les retraits)
        console.log("\n🏆 TOP 20 WALLETS (Highest Balance):");
        const res = await client.query(`
            SELECT 
                id,
                username, 
                pi_balance, 
                level, 
                xp,
                pi_id
            FROM users 
            ORDER BY pi_balance DESC 
            LIMIT 20;
        `);
        console.table(res.rows);
        
        // 3. SUSPICIOUS ACTIVITY (Audit Triche)
        // Règle : Avoir beaucoup de Pi mais peu d'XP est suspect (Hack direct SQL ?)
        // Ou avoir un niveau démesuré > 100
        console.log("\n🚨 SUSPICIOUS ACCOUNTS (High Balance / Low XP):");
        const resSus = await client.query(`
             SELECT id, username, pi_balance, xp 
             FROM users 
             WHERE pi_balance > 1.0 AND xp < 50
             ORDER BY pi_balance DESC;
        `);
        if (resSus.rows.length === 0) {
            console.log("   ✅ No anomalies detected.");
        } else {
            console.table(resSus.rows);
        }

    } catch (e) {
        console.error("Error:", e.message);
    } finally {
        await client.end();
    }
}

run();
