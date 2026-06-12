const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

async function generateBookingPDF(booking, user) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const filename = `booking-${booking.booking_ref}.pdf`;
      const tempDir = path.resolve(__dirname, '../../tmp');
      
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }

      const filePath = path.join(tempDir, filename);
      const stream = fs.createWriteStream(filePath);
      
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('THE NEST STAY — Guest Booking Record', { align: 'center' });
      doc.moveDown();
      
      doc.fontSize(12).text(`Date of Booking: ${new Date(booking.created_at).toLocaleString()}`);
      doc.text(`Booking ID: ${booking.booking_ref}`);
      doc.moveDown();

      // Guest Details
      doc.fontSize(16).text('Guest Details', { underline: true });
      doc.fontSize(12)
         .text(`Name: ${user.name}`)
         .text(`Mobile: ${user.mobile}`)
         .text(`Email: ${user.email}`)
         .text(`Age: ${user.age}`)
         .text(`City/State: ${user.city}`)
         .text(`ID Proof: ${user.id_type} - ${user.id_number}`);
      doc.moveDown();

      // Booking Details
      doc.fontSize(16).text('Booking Details', { underline: true });
      doc.fontSize(12)
         .text(`Room Type: ${booking.room_type === 'single' ? 'Single Room' : 'Double Room Set'}`)
         .text(`Check-in Date: ${new Date(booking.checkin_date).toLocaleDateString()}`)
         .text(`Check-out Date: ${new Date(booking.checkout_date).toLocaleDateString()}`)
         .text(`Nights: ${booking.nights}`)
         .text(`Number of Guests: ${user.guests_count}`)
         .text(`Special Requests: ${booking.special_requests || 'None'}`);
      doc.moveDown();

      // Total Amount
      doc.fontSize(16).text(`Total Amount: Rs. ${booking.total_amount}`, { bold: true });
      doc.moveDown();

      // Terms
      doc.fontSize(12).text(`Terms Accepted: Yes (at ${new Date(booking.agreed_at).toLocaleString()})`);
      doc.moveDown(2);

      // Footer
      doc.fontSize(10).text(`This document is auto-generated. For queries call: +91 98765 43210`, { align: 'center' });

      doc.end();

      stream.on('finish', () => resolve(filePath));
      stream.on('error', reject);
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generateBookingPDF };
