const router = require('express').Router();
const pool = require('../db');
const { authMiddleware, requireRole } = require('../middleware/auth');

// GET /api/rooms — public (all available rooms)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT r.*, u.name AS landlord_name
       FROM rooms r
       JOIN users u ON u.id = r.landlord_id
       ORDER BY r.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch rooms.' });
  }
});

// GET /api/rooms/mine — landlord's own listings
router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM rooms WHERE landlord_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch your rooms.' });
  }
});

// POST /api/rooms — create listing (landlord only)
router.post('/', authMiddleware, requireRole('landlord', 'admin'), async (req, res) => {
  const { title, description, price, location, address, room_type, amenities, image_urls } = req.body;
  if (!title || !price || !location)
    return res.status(400).json({ error: 'Title, price and location are required.' });
  try {
    console.log('--- CREATING ROOM ---');
    console.log('Room Type Received:', room_type);
    console.log('Amenities:', amenities);
    const result = await pool.query(
      `INSERT INTO rooms (landlord_id, title, description, price, location, address, room_type, amenities, image_urls, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active')
       RETURNING *`,
      [req.user.id, title, description || '', price, location, address || '', room_type || 'single',
       amenities || [], image_urls || []]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ error: 'Failed to create listing: ' + err.message });
  }
});

// PUT /api/rooms/:id — edit (owner or admin)
router.put('/:id', authMiddleware, async (req, res) => {
  const { title, description, price, location, address, room_type, amenities, image_urls } = req.body;
  try {
    const check = await pool.query('SELECT landlord_id FROM rooms WHERE id = $1', [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ error: 'Room not found.' });
    if (check.rows[0].landlord_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not your listing.' });

    const result = await pool.query(
      `UPDATE rooms 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           location = COALESCE($4, location),
           address = COALESCE($5, address),
           room_type = COALESCE($6, room_type),
           amenities = COALESCE($7, amenities),
           image_urls = COALESCE($8, image_urls),
           updated_at = NOW()
       WHERE id = $9 RETURNING *`,
      [title, description, price, location, address, room_type, amenities, image_urls, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update listing.' });
  }
});

// DELETE /api/rooms/:id — delete (owner or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const check = await pool.query('SELECT landlord_id FROM rooms WHERE id = $1', [req.params.id]);
    if (!check.rows.length) return res.status(404).json({ error: 'Room not found.' });
    if (check.rows[0].landlord_id !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ error: 'Not your listing.' });

    await pool.query('DELETE FROM rooms WHERE id = $1', [req.params.id]);
    res.json({ message: 'Listing deleted.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

module.exports = router;
