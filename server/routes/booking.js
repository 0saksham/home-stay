const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const db = require('../db/database');
const { generateBookingPDF } = require('../services/pdfService');
const { sendBookingEmail } = require('../services/emailService');
const path = require('path');
const fs = require('fs');

const router = express.Router();

router.post('/confirm', authMiddleware, async (req, res) => {
  const { room_type, checkin_date, checkout_date, nights, total_amount, special_requests } = req.body;
  
  if (!req.user.id) {
    return res.status(400).json({ error: 'User profile incomplete' });
  }

  // Generate unique booking ref
  const bookingRef = `NST-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const agreedAt = new Date().toISOString();

  const insertStmt = db.prepare(`
    INSERT INTO bookings (booking_ref, user_id, room_type, checkin_date, checkout_date, nights, total_amount, special_requests, agreed_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const info = insertStmt.run(bookingRef, req.user.id, room_type, checkin_date, checkout_date, nights, total_amount, special_requests, agreedAt);
    
    // Fetch user and booking details to generate PDF
    const userStmt = db.prepare('SELECT * FROM users WHERE id = ?');
    const user = userStmt.get(req.user.id);

    const bookingStmt = db.prepare('SELECT * FROM bookings WHERE id = ?');
    const booking = bookingStmt.get(info.lastInsertRowid);

    // Generate PDF asynchronously
    generateBookingPDF(booking, user)
      .then(pdfPath => {
        // Send email with PDF
        if (process.env.DEV_MODE !== 'true') {
           sendBookingEmail(pdfPath, bookingRef);
        } else {
           console.log(`[DEV MODE] PDF generated at ${pdfPath}. Skipping email send.`);
        }
      })
      .catch(err => console.error('Error generating PDF:', err));

    res.json({ message: 'Booking confirmed', booking_ref: bookingRef, id: info.lastInsertRowid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to confirm booking' });
  }
});

router.get('/:id', authMiddleware, (req, res) => {
  const stmt = db.prepare('SELECT * FROM bookings WHERE id = ? AND user_id = ?');
  const booking = stmt.get(req.params.id, req.user.id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }
  
  res.json(booking);
});

router.get('/:id/pdf', authMiddleware, (req, res) => {
  const stmt = db.prepare('SELECT booking_ref FROM bookings WHERE id = ? AND user_id = ?');
  const booking = stmt.get(req.params.id, req.user.id);

  if (!booking) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  const pdfPath = path.resolve(__dirname, `../../tmp/booking-${booking.booking_ref}.pdf`);
  
  if (fs.existsSync(pdfPath)) {
    res.download(pdfPath);
  } else {
    res.status(404).json({ error: 'PDF not found. It might still be generating.' });
  }
});

module.exports = router;
