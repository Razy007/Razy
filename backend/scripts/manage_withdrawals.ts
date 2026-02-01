import { Pool } from 'pg';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

// Config DB (Alignée avec le serveur)
const pool = new Pool({
    user: process.env.DB_USER || 'postgres', // Sur Prod souvent c'est postgres ou pi_user, le .env fera foi
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'pi_academy',
    password: process.env.DB_PASSWORD, // Must be in .env
    port: parseInt(process.env.DB_PORT || '5432'),
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query: string): Promise<string> => {
  return new Promise((resolve) => rl.question(query, resolve));
};

async function listPending() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
        SELECT w.id, w.amount, w.wallet_address, u.username, w.user_id 
        FROM withdrawal_requests w
        LEFT JOIN users u ON w.user_id = u.pi_id
        WHERE w.status = 'pending'
        ORDER BY w.created_at ASC
    `);

    console.log('\n--- DEMANDES EN ATTENTE ---');
    if (res.rowCount === 0) {
        console.log('Aucune demande en attente.');
        return;
    }

    console.log('ID\t\t\t\t\t| User\t\t| Amount\t| Wallet');
    console.log('-'.repeat(100));
    for (const row of res.rows) {
        console.log(`${row.id}\t| ${row.username || row.user_id}\t| ${row.amount} Pi\t| ${row.wallet_address}`);
    }
    console.log('-'.repeat(100));
  } catch (e) {
      console.error(e);
  } finally {
      client.release();
  }
}

async function approveRequest(id: string, txHash: string) {
  const client = await pool.connect();
  try {
      const res = await client.query("UPDATE withdrawal_requests SET status = 'completed', tx_hash = $1, updated_at = NOW() WHERE id = $2 RETURNING id", [txHash, id]);
      if (res.rowCount === 0) {
          console.log('❌ ID introuvable.');
      } else {
          console.log(`✅ Demande ${id} validée.`);
      }
  } catch(e) { console.error(e); } finally { client.release(); }
}

async function rejectRequest(id: string, reason: string) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const reqRes = await client.query("SELECT * FROM withdrawal_requests WHERE id = $1 AND status = 'pending' FOR UPDATE", [id]);
        if (reqRes.rowCount === 0) {
            console.log('❌ Demande introuvable ou déjà traitée.');
            await client.query('ROLLBACK');
            return;
        }
        const req = reqRes.rows[0];

        // Refund User
        // Need ID of user from `users` table where pi_id = req.user_id
        await client.query("UPDATE users SET pi_balance = pi_balance + $1 WHERE pi_id = $2", [req.amount, req.user_id]);
        
        // Update Request
        await client.query("UPDATE withdrawal_requests SET status = 'rejected', admin_note = $1, updated_at = NOW() WHERE id = $2", [reason, id]);

        await client.query('COMMIT');
        console.log(`❌ Demande rejetée et ${req.amount} Pi remboursés.`);

    } catch(e) { 
        await client.query('ROLLBACK');
        console.error(e); 
    } finally { client.release(); }
}

async function main() {
  // Test connection
  try {
      const client = await pool.connect();
      console.log("✅ Connecté à PostgreSQL");
      client.release();
  } catch (e) {
      console.error("❌ Erreur connexion DB:", e);
      process.exit(1);
  }

  while (true) {
    console.log('\n--- GESTION DES RETRAITS (SQL) ---');
    console.log('1. Lister les demandes en attente');
    console.log('2. Approuver une demande (Marquer payée)');
    console.log('3. Rejeter une demande (Rembourser)');
    console.log('4. Quitter');

    const choice = await question('Choix: ');

    switch (choice) {
      case '1': await listPending(); break;
      case '2': {
          const id = await question('ID UUID: ');
          const tx = await question('TX Hash: ');
          await approveRequest(id.trim(), tx.trim());
      } break;
      case '3': {
          const id = await question('ID UUID: ');
          const r = await question('Raison: ');
          await rejectRequest(id.trim(), r.trim());
      } break;
      case '4': process.exit(0); break;
    }
  }
}

main();
