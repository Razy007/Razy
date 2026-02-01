import { Pool } from 'pg';

async function listTables() {
  // Hardcoded config based on local .env content seen
  const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'razy_pi_network', // As seen in .env
    user: 'postgres',
    password: 'postgres' // Standard default or from .env
  });

  try {
    console.log('Connecting to database razy_pi_network...');
    const res = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables found:', res.rows.map((r: any) => r.table_name));
    
    // Check if 'courses' table exists and count items
    if (res.rows.some((r: any) => r.table_name === 'courses')) {
        const count = await pool.query('SELECT count(*) FROM courses');
        console.log('Courses count:', count.rows[0].count);
        
        // Show sample
        const sample = await pool.query('SELECT * FROM courses LIMIT 2');
        console.log('Sample courses:', JSON.stringify(sample.rows, null, 2));
    }
    
  } catch (err) {
    console.error('Error listing tables:', err);
  } finally {
    await pool.end();
  }
}

listTables();
