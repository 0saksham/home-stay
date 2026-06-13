const nodemailer = require('nodemailer');

async function sendBookingEmail(pdfPath, bookingRef) {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
      }
    });

    const mailOptions = {
      from: '"House of Marigold" <sgodiyal00@gmail.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking Confirmed: ${bookingRef}`,
      text: `A new booking (${bookingRef}) has been confirmed. Please find the receipt attached.`,
      attachments: [
        {
          filename: `booking-${bookingRef}.pdf`,
          path: pdfPath
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to admin for booking ${bookingRef}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = { sendBookingEmail };
