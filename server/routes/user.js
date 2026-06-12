const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../db/database');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.get('/me', authMiddleware, (req, res) => {
  if (!req.user.id) {
    return res.status(404).json({ error: 'User profile not completed' });
  }

  const stmt = db.prepare('SELECT id, mobile, name, email, age, city, id_type, id_number, guests_count, created_at FROM users WHERE id = ?');
  const user = stmt.get(req.user.id);
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

router.post('/profile', authMiddleware, (req, res) => {
  const { name, email, age, city, id_type, id_number, guests_count } = req.body;
  const mobile = req.user.mobile;

  // Insert or update
  const existingUserStmt = db.prepare('SELECT id FROM users WHERE mobile = ?');
  let user = existingUserStmt.get(mobile);

  if (user) {
    const updateStmt = db.prepare(`
      UPDATE users 
      SET name = ?, email = ?, age = ?, city = ?, id_type = ?, id_number = ?, guests_count = ?
      WHERE id = ?
    `);
    updateStmt.run(name, email, age, city, id_type, id_number, guests_count, user.id);
  } else {
    const insertStmt = db.prepare(`
      INSERT INTO users (mobile, name, email, age, city, id_type, id_number, guests_count)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = insertStmt.run(mobile, name, email, age, city, id_type, id_number, guests_count);
    user = { id: info.lastInsertRowid };
  }

  // Generate new token with user ID
  const payload = { mobile, id: user.id, isNewUser: false };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ message: 'Profile saved successfully', token, userId: user.id });
});

module.exports = router;
