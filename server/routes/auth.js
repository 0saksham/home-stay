const express = require('express');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const router = express.Router();

/* ─────────────────────────────────────────
   Nodemailer transporter (Gmail SMTP)
───────────────────────────────────────── */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

/* ─────────────────────────────────────────
   OTP email HTML template
───────────────────────────────────────── */
function buildOtpEmail(otp, mobile) {
  // Spaced digits for the subject: "1 2 3 4 5 6"
  const spacedOtp = otp.split('').join(' ');

  return {
    subject: `Your House of Marigold Booking Code: ${spacedOtp}`,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>House of Marigold — Booking Code</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0A0A0A;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#111111;border:1px solid rgba(201,168,76,0.2);max-width:520px;width:100%;">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:40px 48px 28px;border-bottom:1px solid rgba(201,168,76,0.15);">
              <p style="margin:0;font-family:'Georgia',serif;font-weight:400;font-size:22px;
                        letter-spacing:0.08em;color:#F8F5F0;">
                HOUSE <em style="color:#C9A84C;">of</em> MARIGOLD
              </p>
              <p style="margin:8px 0 0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;
                        color:rgba(201,168,76,0.7);">Gandhi Chowk · Mussoorie</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 32px;">
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;
                        color:#C9A84C;">Your Booking Code</p>
              <p style="margin:0 0 40px;font-size:13px;line-height:1.8;color:rgba(248,245,240,0.55);
                        letter-spacing:0.04em;">
                Use the code below to complete your reservation at House of Marigold.
                This code is valid for <strong style="color:rgba(248,245,240,0.8);">10 minutes</strong>.
              </p>

              <!-- OTP block -->
              <div style="background:#0A0A0A;border:1px solid rgba(201,168,76,0.35);
                          padding:32px;text-align:center;margin-bottom:40px;">
                <p style="margin:0 0 8px;font-size:9px;letter-spacing:0.25em;text-transform:uppercase;
                           color:rgba(201,168,76,0.6);">One-Time Password</p>
                <p style="margin:0;font-family:'Georgia',serif;font-size:52px;font-weight:400;
                           letter-spacing:0.18em;color:#C9A84C;line-height:1.1;">${otp}</p>
              </div>

              <p style="margin:0 0 8px;font-size:12px;line-height:1.8;color:rgba(248,245,240,0.45);
                        letter-spacing:0.03em;">
                Mobile on file: +91 ${mobile}<br/>
                If you did not request this code, please ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 48px 40px;border-top:1px solid rgba(201,168,76,0.1);">
              <p style="margin:0;font-size:10px;letter-spacing:0.1em;
                        color:rgba(248,245,240,0.2);line-height:1.8;">
                © ${new Date().getFullYear()} House of Marigold · Mussoorie, Uttarakhand<br/>
                Direct reservations &amp; enquiries: ${process.env.GMAIL_USER || 'contact@houseofmarigold.in'}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
  };
}

/* ─────────────────────────────────────────
   POST /auth/send-otp
   Body: { mobile, email }
───────────────────────────────────────── */
router.post('/send-otp', async (req, res) => {
  const { mobile, email } = req.body;

  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email address required' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

  // Store OTP — email column added via ALTER if not exists (handled in DB init)
  try {
    db.prepare(
      'INSERT INTO otps (mobile, email, otp_code, expires_at) VALUES (?, ?, ?, ?)'
    ).run(mobile, email, otp, expiresAt);
  } catch {
    // Fallback if email column doesn't exist yet (old schema)
    db.prepare(
      'INSERT INTO otps (mobile, otp_code, expires_at) VALUES (?, ?, ?)'
    ).run(mobile, otp, expiresAt);
  }

  // DEV_MODE — skip email, return OTP in response
  if (process.env.DEV_MODE === 'true') {
    console.log(`\n[DEV MODE] OTP for ${email} (mobile: +91${mobile}) → ${otp}\n`);
    return res.json({ message: 'OTP sent (dev mode)', devOtp: otp });
  }

  // Production — send via Gmail SMTP
  try {
    const { subject, html } = buildOtpEmail(otp, mobile);
    await transporter.sendMail({
      from: `"House of Marigold" <${process.env.GMAIL_USER}>`,
      to: email,
      subject,
      html,
    });
    return res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('[Email OTP Error]', err.message);
    return res.status(500).json({ error: 'Failed to send OTP email. Please try again.' });
  }
});

/* ─────────────────────────────────────────
   POST /auth/verify-otp
   Body: { mobile, email, otp }
───────────────────────────────────────── */
router.post('/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ error: 'Mobile and OTP are required' });
  }

  // Look up the most recent unused OTP for this mobile
  const stmt = db.prepare(
    'SELECT * FROM otps WHERE mobile = ? AND otp_code = ? AND used = 0 ORDER BY id DESC LIMIT 1'
  );
  const otpRecord = stmt.get(mobile, otp);

  if (!otpRecord) {
    return res.status(400).json({ error: 'Invalid OTP. Please check and try again.' });
  }

  if (new Date(otpRecord.expires_at) < new Date()) {
    return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
  }

  // Mark used
  db.prepare('UPDATE otps SET used = 1 WHERE id = ?').run(otpRecord.id);

  // Check if user already exists
  const user = db.prepare('SELECT * FROM users WHERE mobile = ?').get(mobile);

  const payload = {
    mobile,
    email: otpRecord.email || req.body.email || null,
    id: user ? user.id : null,
    isNewUser: !user,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.json({ token, isNewUser: !user, user });
});

module.exports = router;
