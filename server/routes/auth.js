const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();

/* ─────────────────────────────────────────
   POST /auth/login (Direct Login)
   Body: { mobile, email }
───────────────────────────────────────── */
router.post('/login', (req, res) => {
  const { mobile, email } = req.body;

  const cleanMobile = mobile ? String(mobile).replace(/\D/g, '') : '';
  const cleanEmail = email ? String(email).trim().toLowerCase() : '';

  if (!cleanMobile || cleanMobile.length !== 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
  }
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  // Check if user already exists
  const user = db.prepare('SELECT * FROM users WHERE mobile = ? OR email = ?').get(cleanMobile, cleanEmail);

  const payload = {
    mobile: cleanMobile,
    email: cleanEmail,
    id: user ? user.id : null,
    isNewUser: !user,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

  res.json({ token, isNewUser: !user, user });
});

/* ─────────────────────────────────────────
   POST /auth/verify-otp (Compatibility route)
───────────────────────────────────────── */
router.post('/verify-otp', (req, res) => {
  const { mobile, email } = req.body;

  const cleanMobile = mobile ? String(mobile).replace(/\D/g, '') : '';
  const cleanEmail = email ? String(email).trim().toLowerCase() : '';

  if (!cleanMobile) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }

  const user = db.prepare('SELECT * FROM users WHERE mobile = ? OR email = ?').get(cleanMobile, cleanEmail);

  const payload = {
    mobile: cleanMobile,
    email: cleanEmail || (user ? user.email : null),
    id: user ? user.id : null,
    isNewUser: !user,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });

  res.json({ token, isNewUser: !user, user });
});

/* ─────────────────────────────────────────
   POST /auth/send-otp (Compatibility route)
───────────────────────────────────────── */
router.post('/send-otp', (req, res) => {
  return res.json({ message: 'Direct login enabled', directLogin: true });
});

module.exports = router;

