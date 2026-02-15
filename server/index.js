import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(cors({
  origin: frontendUrl,
  credentials: true
}));
app.use(express.json());

// Middleware pour extraire le user_id des headers
const authenticate = (req, res, next) => {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    return res.status(401).json({ error: 'Non authentifié. user_id manquant.' });
  }
  req.userId = userId;
  next();
};

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

// Helper: convertir les chaînes vides en null pour PostgreSQL
const toNull = (v) => (v === '' || v === undefined ? null : v);

// ============================================
// ROUTES AUTHENTIFICATION
// ============================================

// POST /api/auth/login - Connexion par email
app.get('/api/auth/login', async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'Email requis' });

  try {
    const result = await pool.query('SELECT id, email FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES API SANTÉ (Protégées)
// ============================================

// Appliquer le middleware d'authentification à toutes les routes /api/health
app.use('/api/health', authenticate);

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
    const result = await pool.query(query, [req.userId]);
    
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
    const result = await pool.query(query, [req.userId]);
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
      FROM activity_logs
      WHERE workout_type IS NOT NULL AND user_id = $1
      GROUP BY workout_type
      ORDER BY count DESC
    `;
    const result = await pool.query(query, [req.userId]);
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
      FROM activity_logs
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 30
    `;
    const result = await pool.query(query, [req.userId]);
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
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 30
    `;
    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur /api/health/body-measurements:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES CRUD - ALIMENTATION QUOTIDIENNE
// ============================================

// GET /api/health/daily-diet - Liste des journées alimentation
app.get('/api/health/daily-diet', async (req, res) => {
  try {
    const query = `
      SELECT d.*, 
        COALESCE(json_agg(
          json_build_object('id', di.id, 'meal_type', di.meal_type, 'item_text', di.item_text, 'sort_order', di.sort_order)
        ) FILTER (WHERE di.id IS NOT NULL), '[]') as items
      FROM daily_diet d
      LEFT JOIN diet_items di ON di.daily_diet_id = d.id
      WHERE d.user_id = $1
      GROUP BY d.id
      ORDER BY d.date DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur GET /api/health/daily-diet:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/health/daily-diet - Créer une entrée alimentation
app.post('/api/health/daily-diet', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { date, week_number, breakfast_rating, snack_am_rating, lunch_rating, snack_pm_rating,
      dinner_rating, hydration_rating, objectif_text, craquage_exces, feeling, items } = req.body;

    const dietResult = await client.query(
      `INSERT INTO daily_diet (user_id, date, week_number, breakfast_rating, snack_am_rating, lunch_rating, 
        snack_pm_rating, dinner_rating, hydration_rating, objectif_text, craquage_exces, feeling)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.userId, date, toNull(week_number), toNull(breakfast_rating), toNull(snack_am_rating), toNull(lunch_rating),
        toNull(snack_pm_rating), toNull(dinner_rating), toNull(hydration_rating), objectif_text, craquage_exces, feeling]
    );

    const dietId = dietResult.rows[0].id;

    // Insérer les items de repas si fournis
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO diet_items (daily_diet_id, meal_type, item_text, sort_order) VALUES ($1,$2,$3,$4)`,
          [dietId, item.meal_type, item.item_text, item.sort_order || 0]
        );
      }
    }

    await client.query('COMMIT');
    res.status(201).json(dietResult.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur POST /api/health/daily-diet:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// PUT /api/health/daily-diet/:id - Modifier une entrée alimentation
app.put('/api/health/daily-diet/:id', async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { date, week_number, breakfast_rating, snack_am_rating, lunch_rating, snack_pm_rating,
      dinner_rating, hydration_rating, objectif_text, craquage_exces, feeling, items } = req.body;

    const result = await client.query(
      `UPDATE daily_diet SET date=$1, week_number=$2, breakfast_rating=$3, snack_am_rating=$4, lunch_rating=$5,
        snack_pm_rating=$6, dinner_rating=$7, hydration_rating=$8, objectif_text=$9, craquage_exces=$10, feeling=$11
       WHERE id=$12 AND user_id=$13 RETURNING *`,
      [date, toNull(week_number), toNull(breakfast_rating), toNull(snack_am_rating), toNull(lunch_rating), toNull(snack_pm_rating),
        toNull(dinner_rating), toNull(hydration_rating), objectif_text, craquage_exces, feeling, req.params.id, req.userId]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });

    // Remplacer les items
    if (items) {
      await client.query('DELETE FROM diet_items WHERE daily_diet_id = $1', [req.params.id]);
      for (const item of items) {
        await client.query(
          `INSERT INTO diet_items (daily_diet_id, meal_type, item_text, sort_order) VALUES ($1,$2,$3,$4)`,
          [req.params.id, item.meal_type, item.item_text, item.sort_order || 0]
        );
      }
    }

    await client.query('COMMIT');
    res.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erreur PUT /api/health/daily-diet:', error);
    res.status(500).json({ error: error.message });
  } finally {
    client.release();
  }
});

// DELETE /api/health/daily-diet/:id - Supprimer une entrée alimentation
app.delete('/api/health/daily-diet/:id', async (req, res) => {
  try {
    // diet_items should cascade delete if FK is set up, otherwise delete manually
    await pool.query('DELETE FROM diet_items WHERE daily_diet_id = $1', [req.params.id]);
    const result = await pool.query('DELETE FROM daily_diet WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/health/daily-diet:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES CRUD - SPORT & SOMMEIL
// ============================================

// GET /api/health/daily-sport-sleep - Liste sport & sommeil
app.get('/api/health/daily-sport-sleep', async (req, res) => {
  try {
    const query = `
      SELECT * FROM daily_sport_sleep
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur GET /api/health/daily-sport-sleep:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/health/daily-sport-sleep - Créer une entrée sport/sommeil
app.post('/api/health/daily-sport-sleep', async (req, res) => {
  try {
    const { date, week_number, workout_desc, duration_min, steps, sleep_hours,
      bedtime, wake_time, nap_start, nap_end, feeling } = req.body;
    const result = await pool.query(
      `INSERT INTO daily_sport_sleep (user_id, date, week_number, workout_desc, duration_min, steps, 
        sleep_hours, bedtime, wake_time, nap_start, nap_end, feeling)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [req.userId, date, toNull(week_number), workout_desc, toNull(duration_min), toNull(steps),
        toNull(sleep_hours), toNull(bedtime), toNull(wake_time), toNull(nap_start), toNull(nap_end), feeling]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST /api/health/daily-sport-sleep:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/health/daily-sport-sleep/:id - Modifier une entrée sport/sommeil
app.put('/api/health/daily-sport-sleep/:id', async (req, res) => {
  try {
    const { date, week_number, workout_desc, duration_min, steps, sleep_hours,
      bedtime, wake_time, nap_start, nap_end, feeling } = req.body;
    const result = await pool.query(
      `UPDATE daily_sport_sleep SET date=$1, week_number=$2, workout_desc=$3, duration_min=$4, steps=$5,
        sleep_hours=$6, bedtime=$7, wake_time=$8, nap_start=$9, nap_end=$10, feeling=$11
       WHERE id=$12 AND user_id=$13 RETURNING *`,
      [date, toNull(week_number), workout_desc, toNull(duration_min), toNull(steps), toNull(sleep_hours),
        toNull(bedtime), toNull(wake_time), toNull(nap_start), toNull(nap_end), feeling, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT /api/health/daily-sport-sleep:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/health/daily-sport-sleep/:id
app.delete('/api/health/daily-sport-sleep/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM daily_sport_sleep WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/health/daily-sport-sleep:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES CRUD - BILANS HEBDOMADAIRES
// ============================================

// GET /api/health/weekly-bilans - Liste des bilans
app.get('/api/health/weekly-bilans', async (req, res) => {
  try {
    const query = `
      SELECT * FROM weekly_bilans
      WHERE user_id = $1
      ORDER BY week_number DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur GET /api/health/weekly-bilans:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/health/weekly-bilans - Créer un bilan
app.post('/api/health/weekly-bilans', async (req, res) => {
  try {
    const { week_number, total_sport_time, total_sport_min, avg_sport_min_per_day, total_steps,
      avg_steps_per_day, rating_petits_dejeuners, rating_collations_matin, rating_dejeuners,
      rating_collations_aprem, rating_diners, rating_hydratation, avg_sleep_hours, weight_kg, bilan_text } = req.body;
    const result = await pool.query(
      `INSERT INTO weekly_bilans (user_id, week_number, total_sport_time, total_sport_min, avg_sport_min_per_day, 
        total_steps, avg_steps_per_day, rating_petits_dejeuners, rating_collations_matin, rating_dejeuners,
        rating_collations_aprem, rating_diners, rating_hydratation, avg_sleep_hours, weight_kg, bilan_text)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [req.userId, toNull(week_number), total_sport_time, toNull(total_sport_min), toNull(avg_sport_min_per_day), toNull(total_steps),
        toNull(avg_steps_per_day), toNull(rating_petits_dejeuners), toNull(rating_collations_matin), toNull(rating_dejeuners),
        toNull(rating_collations_aprem), toNull(rating_diners), toNull(rating_hydratation), toNull(avg_sleep_hours), toNull(weight_kg), bilan_text]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST /api/health/weekly-bilans:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/health/weekly-bilans/:id - Modifier un bilan
app.put('/api/health/weekly-bilans/:id', async (req, res) => {
  try {
    const { week_number, total_sport_time, total_sport_min, avg_sport_min_per_day, total_steps,
      avg_steps_per_day, rating_petits_dejeuners, rating_collations_matin, rating_dejeuners,
      rating_collations_aprem, rating_diners, rating_hydratation, avg_sleep_hours, weight_kg, bilan_text } = req.body;
    const result = await pool.query(
      `UPDATE weekly_bilans SET week_number=$1, total_sport_time=$2, total_sport_min=$3, avg_sport_min_per_day=$4,
        total_steps=$5, avg_steps_per_day=$6, rating_petits_dejeuners=$7, rating_collations_matin=$8,
        rating_dejeuners=$9, rating_collations_aprem=$10, rating_diners=$11, rating_hydratation=$12,
        avg_sleep_hours=$13, weight_kg=$14, bilan_text=$15
       WHERE id=$16 AND user_id=$17 RETURNING *`,
      [toNull(week_number), total_sport_time, toNull(total_sport_min), toNull(avg_sport_min_per_day), toNull(total_steps),
        toNull(avg_steps_per_day), toNull(rating_petits_dejeuners), toNull(rating_collations_matin), toNull(rating_dejeuners),
        toNull(rating_collations_aprem), toNull(rating_diners), toNull(rating_hydratation), toNull(avg_sleep_hours), toNull(weight_kg), bilan_text,
        req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT /api/health/weekly-bilans:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/health/weekly-bilans/:id
app.delete('/api/health/weekly-bilans/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM weekly_bilans WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/health/weekly-bilans:', error);
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// ROUTES CRUD - MENSURATIONS CORPORELLES
// ============================================

// GET /api/health/body-measurements-list - Liste complète des mensurations
app.get('/api/health/body-measurements-list', async (req, res) => {
  try {
    const query = `
      SELECT * FROM body_measurements
      WHERE user_id = $1
      ORDER BY date DESC
      LIMIT 50
    `;
    const result = await pool.query(query, [req.userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur GET /api/health/body-measurements-list:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/health/body-measurements - Créer une mensuration
app.post('/api/health/body-measurements', async (req, res) => {
  try {
    const { date, week_number, weight_kg, shoulders_cm, chest_cm, waist_cm, abs_cm, hips_cm,
      bicep_left_cm, bicep_right_cm, thigh_left_cm, thigh_right_cm } = req.body;
    const result = await pool.query(
      `INSERT INTO body_measurements (user_id, date, week_number, weight_kg, shoulders_cm, chest_cm, waist_cm,
        abs_cm, hips_cm, bicep_left_cm, bicep_right_cm, thigh_left_cm, thigh_right_cm)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *`,
      [req.userId, date, toNull(week_number), toNull(weight_kg), toNull(shoulders_cm), toNull(chest_cm), toNull(waist_cm), toNull(abs_cm), toNull(hips_cm),
        toNull(bicep_left_cm), toNull(bicep_right_cm), toNull(thigh_left_cm), toNull(thigh_right_cm)]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST /api/health/body-measurements:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/health/body-measurements/:id - Modifier une mensuration
app.put('/api/health/body-measurements/:id', async (req, res) => {
  try {
    const { date, week_number, weight_kg, shoulders_cm, chest_cm, waist_cm, abs_cm, hips_cm,
      bicep_left_cm, bicep_right_cm, thigh_left_cm, thigh_right_cm } = req.body;
    const result = await pool.query(
      `UPDATE body_measurements SET date=$1, week_number=$2, weight_kg=$3, shoulders_cm=$4, chest_cm=$5, 
        waist_cm=$6, abs_cm=$7, hips_cm=$8, bicep_left_cm=$9, bicep_right_cm=$10, thigh_left_cm=$11, thigh_right_cm=$12
       WHERE id=$13 AND user_id=$14 RETURNING *`,
      [date, toNull(week_number), toNull(weight_kg), toNull(shoulders_cm), toNull(chest_cm), toNull(waist_cm), toNull(abs_cm), toNull(hips_cm),
        toNull(bicep_left_cm), toNull(bicep_right_cm), toNull(thigh_left_cm), toNull(thigh_right_cm), req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT /api/health/body-measurements:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/health/body-measurements/:id
app.delete('/api/health/body-measurements/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM body_measurements WHERE id = $1 AND user_id = $2 RETURNING id', [req.params.id, req.userId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Non trouvé' });
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE /api/health/body-measurements:', error);
    res.status(500).json({ error: error.message });
  }
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`🚀 API Server running on http://localhost:${PORT}`);
  console.log('📊 Routes disponibles:');
  console.log('   GET  /api/health/kpis');
  console.log('   GET  /api/health/weight-history');
  console.log('   CRUD /api/health/daily-diet');
  console.log('   CRUD /api/health/daily-sport-sleep');
  console.log('   CRUD /api/health/weekly-bilans');
  console.log('   CRUD /api/health/body-measurements');
});
