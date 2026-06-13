const fs = require('fs');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const fromAddress = 'House of Marigold <onboarding@resend.dev>';

const sendOTPEmail = async (toEmail, otp) => {
  try {
    if (process.env.DEV_MODE === 'true') {
      console.log(`[DEV] OTP for ${toEmail}: ${otp}`);
      return true;
    }

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      subject: 'Your Verification Code — House of Marigold',
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px;
                    margin: 0 auto; padding: 40px 32px;
                    background: #F8F5F0; border-top: 3px solid #C9A84C;">
          <h2 style="font-weight: 300; color: #1A2E1A; margin: 0 0 8px;">
            House of Marigold 🌼
          </h2>
          <p style="color: #8B8680; font-size: 13px; margin: 0 0 32px;">
            Gandhi Chowk, Mussoorie, Uttarakhand
          </p>
          <p style="color: #0A0A0A; font-size: 15px; margin: 0 0 16px;">
            Your verification code is:
          </p>
          <div style="font-size: 52px; font-weight: 300;
                      letter-spacing: 16px; color: #1A2E1A;
                      margin: 0 0 32px; font-family: monospace;">
            ${otp}
          </div>
          <p style="color: #8B8680; font-size: 12px; margin: 0 0 8px;">
            This code expires in 10 minutes.
          </p>
          <p style="color: #8B8680; font-size: 12px; margin: 0;">
            If you did not request this, please ignore this email.
          </p>
          <hr style="border:none; border-top:1px solid #C9A84C; margin:32px 0 16px;"/>
          <p style="color: #C9A84C; font-size: 11px; margin: 0;">
            Gandhi Chowk, near Sumitra Bhawan, Mussoorie 248179
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Resend Error]', error);
      throw new Error(error.message);
    }

    console.log('[Email OTP Sent]', data?.id);
    return true;
  } catch (err) {
    console.error('[Email OTP Error]', err.message);
    throw err;
  }
};

const sendBookingConfirmation = async (toEmail, bookingDetails) => {
  try {
    const attachments = [];

    if (bookingDetails.pdfPath) {
      attachments.push({
        filename: `booking-${bookingDetails.bookingRef}.pdf`,
        content: fs.readFileSync(bookingDetails.pdfPath).toString('base64'),
      });
    }

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: toEmail,
      subject: `Booking Confirmed — ${bookingDetails.bookingRef}`,
      html: `
        <div style="font-family: Georgia, serif; max-width: 480px;
                    margin: 0 auto; padding: 40px 32px;
                    background: #F8F5F0; border-top: 3px solid #C9A84C;">
          <h2 style="font-weight: 300; color: #1A2E1A;">
            Booking Confirmed 🌼
          </h2>
          <p style="color: #8B8680; font-size: 13px;">
            House of Marigold, Mussoorie
          </p>
          <hr style="border:none; border-top:1px solid #C9A84C; margin:24px 0;"/>
          <table style="width:100%; font-size:14px; color:#0A0A0A;">
            <tr><td style="padding:8px 0; color:#8B8680;">Booking ID</td>
                <td>${bookingDetails.bookingRef}</td></tr>
            <tr><td style="padding:8px 0; color:#8B8680;">Room</td>
                <td>${bookingDetails.roomType}</td></tr>
            <tr><td style="padding:8px 0; color:#8B8680;">Check-in</td>
                <td>${bookingDetails.checkinDate}</td></tr>
            <tr><td style="padding:8px 0; color:#8B8680;">Check-out</td>
                <td>${bookingDetails.checkoutDate}</td></tr>
            <tr><td style="padding:8px 0; color:#8B8680;">Nights</td>
                <td>${bookingDetails.nights}</td></tr>
            <tr><td style="padding:8px 0; color:#8B8680; font-weight:bold;">
                Total</td>
                <td style="font-size:18px;">₹${bookingDetails.totalAmount}</td></tr>
          </table>
          <hr style="border:none; border-top:1px solid #C9A84C; margin:24px 0;"/>
          <p style="color:#0A0A0A; font-size:14px;">
            We will call you within 2 hours to confirm your arrival details.
          </p>
          <p style="color:#C9A84C; font-size:11px; margin-top:32px;">
            Gandhi Chowk, near Sumitra Bhawan, Mussoorie 248179
          </p>
        </div>
      `,
      attachments,
    });

    if (error) {
      console.error('[Resend Error]', error);
      throw new Error(error.message);
    }

    console.log('[Booking Email Sent]', data?.id);
    return true;
  } catch (err) {
    console.error('[Booking Email Error]', err.message);
    throw err;
  }
};

const sendBookingEmail = async (pdfPath, bookingRef) => {
  return sendBookingConfirmation(process.env.ADMIN_EMAIL, {
    bookingRef,
    roomType: 'Booking Receipt',
    checkinDate: 'N/A',
    checkoutDate: 'N/A',
    nights: 'N/A',
    totalAmount: 'N/A',
    pdfPath,
  });
};

module.exports = { sendOTPEmail, sendBookingConfirmation, sendBookingEmail };
