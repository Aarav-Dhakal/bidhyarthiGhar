const router = require('express').Router();
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

// GET /api/marketplace — public
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, u.name AS seller_name
       FROM marketplace_items m
       JOIN users u ON u.id = m.seller_id
       WHERE m.is_sold = FALSE
       ORDER BY m.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch marketplace items.' });
  }
});

// POST /api/marketplace — create item (auth required)
router.post('/', authMiddleware, async (req, res) => {
  const { title, description, price, category, condition, image_urls } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required.' });
  try {
    const result = await pool.query(
      `INSERT INTO marketplace_items (seller_id, title, description, price, category, condition, image_urls)
       VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [req.user.id, title, description || '', price || 0, category || 'Other',
       condition || 'used', image_urls || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create item.' });
  }
});

// DELETE /api/marketplace/:id — delete own item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await pool.query('SELECT seller_id FROM marketplace_items WHERE id = $1', [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ error: 'Item not found.' });
    if (check.rows[0].seller_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not your item.' });

    await pool.query('DELETE FROM marketplace_items WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item deleted.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete item.' });
  }
});

module.exports = router;
