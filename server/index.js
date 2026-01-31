import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Configuration PostgreSQL
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'workfit',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

// Test connexion
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur connexion PostgreSQL:', err.message);
  } else {
    console.log('✅ PostgreSQL connecté:', res.rows[0].now);
  }
});

// ============================================
// ROUTES API SANTÉ
// ============================================

// GET /api/health/kpis - Statistiques principales
app.get('/api/health/kpis', async (req, res) => {
  try {
    const query = `
      SELECT 
        avg_weight,
        total_steps,
        avg_sleep_hours,
        total_sport_min
      FROM weekly_stats_view
      WHERE user_id = $1
      ORDER BY week_number DESC
      LIMIT 1
    `;
    // TODO: Remplacer par l'user_id authentifié
    const userId = req.query.user_id || '00000000-0000-0000-0000-000000000000';
    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.json({
        avg_weight: 0,
        total_steps: 0,
        avg_sleep_hours: 0,
        total_sport_min: 0
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur /api/health/kpis:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/health/weight-history - Historique du poids
app.get('/api/health/weight-history', async (req, res) => {
  try {
    const query = `
      SELECT 
        week_number,
        avg_weight
      FROM weekly_stats_view
      WHERE user_id = $1
      ORDER BY week_number ASC
      LIMIT 12
    `;
    const userId = req.query.user_id || '00000000-0000-0000-0000-000000000000';
    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur /api/health/weight-history:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/health/training-distribution - Répartition des entraînements
app.get('/api/health/training-distribution', async (req, res) => {
  try {
    const query = `
      SELECT 
        workout_type,
        COUNT(*) as count
      FROM daily_logs
      WHERE workout_type IS NOT NULL
      GROUP BY workout_type
      ORDER BY count DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur /api/health/training-distribution:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/health/daily-logs - Logs quotidiens
app.get('/api/health/daily-logs', async (req, res) => {
  try {
    const query = `
      SELECT 
        date,
        workout_type,
        sleep_hours,
        feeling_notes
      FROM daily_logs
      ORDER BY date DESC
      LIMIT 30
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur /api/health/daily-logs:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/health/body-measurements - Mensurations corporelles
app.get('/api/health/body-measurements', async (req, res) => {
  try {
    const query = `
      SELECT 
        date,
        weight,
        waist
      FROM body_measurements
      ORDER BY date DESC
      LIMIT 30
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur /api/health/body-measurements:', error);
    res.status(500).json({ error: error.message });
  }
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log('📊 Routes disponibles:');
  console.log('   GET /api/health/kpis');
  console.log('   GET /api/health/weight-history');
  console.log('   GET /api/health/training-distribution');
  console.log('   GET /api/health/daily-logs');
  console.log('   GET /api/health/body-measurements');
});
