const express = require('express');
const https = require('https');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();

/**
 * Sends an OTP via Fast2SMS Bulk OTP API.
 * Docs: https://docs.fast2sms.com/
 * Route: otp (uses DLT registered OTP template — no sender ID required)
 */
function sendFast2SMS(mobile, otp) {
  return new Promise((resolve, reject) => {
    const params = new URLSearchParams({
      authorization: process.env.FAST2SMS_API_KEY,
      variables_values: otp,
      route: 'otp',
      numbers: mobile,
    });

    const options = {
      hostname: 'www.fast2sms.com',
      path: `/dev/bulkV2?${params.toString()}`,
      method: 'GET',
      headers: {
        'cache-control': 'no-cache',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.return === true) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.message || 'Fast2SMS returned failure'));
          }
        } catch (e) {
          reject(new Error('Failed to parse Fast2SMS response'));
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

router.post('/send-otp', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ error: 'Valid mobile number required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60000).toISOString();

  const insertOtp = db.prepare('INSERT INTO otps (mobile, otp_code, expires_at) VALUES (?, ?, ?)');
  insertOtp.run(mobile, otp, expiresAt);

  if (process.env.DEV_MODE === 'true') {
    console.log(`[DEV MODE] OTP for +91${mobile} → ${otp}`);
    return res.json({ message: 'OTP sent (dev mode)', devOtp: otp });
  }

  try {
    await sendFast2SMS(mobile, otp);
    return res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('[Fast2SMS Error]', err.message);
    return res.status(500).json({ error: 'Failed to send SMS. Please try again.' });
  }
});

router.post('/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;

  const stmt = db.prepare('SELECT * FROM otps WHERE mobile = ? AND otp_code = ? AND used = 0 ORDER BY id DESC LIMIT 1');
  const otpRecord = stmt.get(mobile, otp);

  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
  }

  if (new Date(otpRecord.expires_at) < new Date()) {
    return res.status(400).json({ error: 'OTP has expired' });
  }

  const markUsed = db.prepare('UPDATE otps SET used = 1 WHERE id = ?');
  markUsed.run(otpRecord.id);

  // Check if user exists
  const userStmt = db.prepare('SELECT * FROM users WHERE mobile = ?');
  const user = userStmt.get(mobile);

  const payload = {
    mobile: mobile,
    id: user ? user.id : null,
    isNewUser: !user
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, isNewUser: !user, user });
});

module.exports = router;
