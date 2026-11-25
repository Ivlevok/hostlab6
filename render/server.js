const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
let initialized = false;
let initialization;

async function setupDatabase() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL не настроен');
  if (initialized) return;
  if (!initialization) {
    initialization = (async () => {
      await pool.query(`CREATE TABLE IF NOT EXISTS hosting_checks (
        id INTEGER PRIMARY KEY, description TEXT NOT NULL
      )`);
      await pool.query(`INSERT INTO hosting_checks(id, description)
        VALUES(1, 'Render PostgreSQL connected') ON CONFLICT(id) DO NOTHING`);
      initialized = true;
    })().catch(err => { initialization = null; throw err; });
  }
  await initialization;
}

app.disable('x-powered-by');
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  next();
});
app.get('/api/status', async (req, res) => {
  res.set('Cache-Control','no-store');
  res.set('Access-Control-Allow-Origin','*');  // Read-only, public demo endpoint
  try {
    await setupDatabase();
    const result = await pool.query('SELECT COUNT(*)::int AS records FROM hosting_checks');
    res.json({ online:true, database:'OK', backend:'Render / Node.js + PostgreSQL',
      records:result.rows[0].records, time:new Date().toISOString() });
  } catch (err) {
    console.error('Database check failed:', err.message);
    res.status(503).json({ online:false, database:'ERROR', message:'Database unavailable' });
  }
});
app.get('/health', (_req, res) => res.status(200).send('OK'));
app.get('/old', (_req, res) => res.redirect(301,'/'));
app.use(express.static(path.join(__dirname,'public'), {extensions:['html']}));
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`HostLab PaaS listening on ${PORT}`));
