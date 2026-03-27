const router = require('express').Router();
const pool = require('../db');
const { authMiddleware } = require('../middleware/auth');

// GET /api/messages/conversations — get list of people user has chatted with
router.get('/conversations', authMiddleware, async (req, res) => {
  try {
    // This query gets unique chat partners and their latest message
    const result = await pool.query(
      `WITH LastMessages AS (
         SELECT 
           CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END as partner_id,
           content,
           created_at,
           ROW_NUMBER() OVER(PARTITION BY CASE WHEN sender_id = $1 THEN receiver_id ELSE sender_id END ORDER BY created_at DESC) as rn
         FROM messages
         WHERE sender_id = $1 OR receiver_id = $1
       )
       SELECT lm.partner_id, lm.content as last_msg, lm.created_at, u.name as partner_name, u.role as partner_role
       FROM LastMessages lm
       JOIN users u ON u.id = lm.partner_id
       WHERE lm.rn = 1
       ORDER BY lm.created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch conversations error:', err);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// GET /api/messages/:partnerId — get chat history with a specific person
router.get('/:partnerId', authMiddleware, async (req, res) => {
  if (isNaN(parseInt(req.params.partnerId))) {
    return res.json([]); // Return empty array if no valid partner selected yet
  }
  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [req.user.id, req.params.partnerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch chat error:', err);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// POST /api/messages — send a message
router.post('/', authMiddleware, async (req, res) => {
  const { receiverId, content } = req.body;
  if (!receiverId || !content) {
    return res.status(400).json({ error: 'Receiver and content are required' });
  }
  try {
    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.user.id, receiverId, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

module.exports = router;
