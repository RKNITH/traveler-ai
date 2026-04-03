// import nodemailer from 'nodemailer';
// import { Payment } from '../models/index.js';
// import Booking from '../models/Booking.js';

// // Brevo SMTP transporter
// const createTransporter = () => {
//   return nodemailer.createTransport({
//     host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
//     port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
//     secure: false,
//     auth: {
//       user: process.env.BREVO_SMTP_USER,
//       pass: process.env.BREVO_SMTP_PASS,
//     },
//   });
// };

// const sendPaymentConfirmationEmail = async (userEmail, userName, booking, payment) => {
//   if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
//     console.log('Brevo SMTP not configured — skipping email.');
//     return;
//   }
//   try {
//     const transporter = createTransporter();
//     const methodLabels = {
//       online: 'Online Payment (UPI / Card / Net Banking)',
//       bank_transfer: 'Bank Transfer',
//       upi: 'UPI',
//       cash: 'Cash on Arrival',
//     };
//     const methodLabel = methodLabels[payment.method] || payment.method;

//     await transporter.sendMail({
//       from: `"${process.env.EMAIL_FROM_NAME || 'WanderLux Travel'}" <${process.env.BREVO_SMTP_USER}>`,
//       to: userEmail,
//       subject: `✅ Booking Confirmed – ${booking.bookingId || booking._id}`,
//       html: `
//         <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;">
//           <div style="background:#0ea5e9;padding:32px 24px;text-align:center;border-radius:8px 8px 0 0;">
//             <h1 style="color:#fff;margin:0;font-size:24px;">🌍 WanderLux Travel</h1>
//             <p style="color:#e0f2fe;margin:8px 0 0;">Your Booking is Confirmed!</p>
//           </div>
//           <div style="background:#fff;padding:32px 24px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;">
//             <p style="font-size:16px;">Hi <strong>${userName}</strong>,</p>
//             <p>Thank you for booking with WanderLux! Here are your booking details:</p>
//             <table style="width:100%;border-collapse:collapse;margin:20px 0;">
//               <tr style="background:#f8fafc;">
//                 <td style="padding:10px 14px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Booking ID</td>
//                 <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;">${booking.bookingId || booking._id}</td>
//               </tr>
//               <tr>
//                 <td style="padding:10px 14px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Amount Paid</td>
//                 <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;">₹${payment.amount?.toLocaleString('en-IN')}</td>
//               </tr>
//               <tr style="background:#f8fafc;">
//                 <td style="padding:10px 14px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Payment Method</td>
//                 <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;">${methodLabel}</td>
//               </tr>
//               <tr>
//                 <td style="padding:10px 14px;font-weight:bold;border-bottom:1px solid #e2e8f0;">Transaction ID</td>
//                 <td style="padding:10px 14px;border-bottom:1px solid #e2e8f0;">${payment.transactionId}</td>
//               </tr>
//               <tr style="background:#f8fafc;">
//                 <td style="padding:10px 14px;font-weight:bold;">Status</td>
//                 <td style="padding:10px 14px;color:#16a34a;font-weight:bold;">✅ Confirmed</td>
//               </tr>
//             </table>
//             <p style="margin-top:24px;font-size:14px;color:#64748b;">If you have any questions, reply to this email or contact our support team.</p>
//             <p style="font-size:14px;color:#64748b;">Happy Travels! 🌴</p>
//             <p style="font-size:14px;"><strong>WanderLux Travel Team</strong></p>
//           </div>
//         </div>
//       `,
//     });
//     console.log('✅ Confirmation email sent to ' + userEmail);
//   } catch (err) {
//     console.error('Email send error:', err.message);
//   }
// };

// // @desc    Process payment (simple methods — no Stripe)
// // @route   POST /api/payments/process
// export const processPayment = async (req, res, next) => {
//   try {
//     const { bookingId, method } = req.body;
//     const allowedMethods = ['online', 'bank_transfer', 'upi', 'cash'];
//     if (!allowedMethods.includes(method)) {
//       return res.status(400).json({ success: false, message: 'Invalid payment method.' });
//     }

//     const booking = await Booking.findOne({ _id: bookingId, user: req.user._id })
//       .populate('user', 'name email');
//     if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

//     const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();

//     const payment = await Payment.create({
//       booking: bookingId,
//       user: req.user._id,
//       transactionId,
//       amount: booking.pricing.totalAmount,
//       currency: 'inr',
//       status: 'completed',
//       method,
//       gateway: 'manual',
//     });

//     booking.paymentStatus = 'paid';
//     booking.status = 'confirmed';
//     await booking.save();

//     if (booking.user?.email) {
//       await sendPaymentConfirmationEmail(booking.user.email, booking.user.name, booking, payment);
//     }

//     res.json({ success: true, message: 'Payment successful! Booking confirmed.', payment, transactionId });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get payment history
// // @route   GET /api/payments/history
// export const getPaymentHistory = async (req, res, next) => {
//   try {
//     const payments = await Payment.find({ user: req.user._id })
//       .populate('booking', 'bookingId travelDates pricing')
//       .sort({ createdAt: -1 });
//     res.json({ success: true, payments });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Get payment by booking ID
// // @route   GET /api/payments/booking/:bookingId
// export const getPaymentByBooking = async (req, res, next) => {
//   try {
//     const payment = await Payment.findOne({ booking: req.params.bookingId, user: req.user._id });
//     if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
//     res.json({ success: true, payment });
//   } catch (error) {
//     next(error);
//   }
// };




import nodemailer from 'nodemailer';
import { Payment } from '../models/index.js';
import Booking from '../models/Booking.js';

/**
 * EMAIL UTILITY: Creates the SMTP Transporter
 * SMTP works by establishing a secure handshake between your server and Brevo.
 */
const createTransporter = async () => {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
    port: parseInt(process.env.BREVO_SMTP_PORT || '587'),
    secure: false, // true for 465, false for 587 (uses STARTTLS)
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  try {
    // Verify connection configuration
    await transporter.verify();
    return transporter;
  } catch (error) {
    console.error('SMTP Connection Error:', error.message);
    return null;
  }
};

/**
 * EMAIL UTILITY: Sends the HTML Confirmation
 */
const sendPaymentConfirmationEmail = async (userEmail, userName, booking, payment) => {
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_PASS) {
    console.warn('Brevo SMTP credentials missing — skipping email.');
    return;
  }

  try {
    const transporter = await createTransporter();
    if (!transporter) return;

    const methodLabels = {
      online: 'Online (UPI/Card)',
      bank_transfer: 'Bank Transfer',
      upi: 'UPI',
      cash: 'Cash on Arrival',
    };

    const methodLabel = methodLabels[payment.method] || payment.method;
    const amountFormatted = payment.amount?.toLocaleString('en-IN');

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'WanderLux Travel'}" <${process.env.EMAIL_FROM}>`,
      to: userEmail,
      subject: `✅ Booking Confirmed – ${booking.bookingId || booking._id}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
          <div style="background:#0ea5e9;padding:30px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;">🌍 WanderLux Travel</h1>
            <p style="color:#e0f2fe;margin:8px 0 0;">Adventure Awaits!</p>
          </div>
          <div style="padding:30px;background:#fff;">
            <h2 style="margin-top:0;color:#1e293b;">Hi ${userName},</h2>
            <p>Your payment has been processed successfully. Your booking is now <strong>Confirmed</strong>.</p>
            
            <table style="width:100%;border-collapse:collapse;margin:20px 0;background:#f8fafc;border-radius:8px;">
              <tr>
                <td style="padding:12px;border-bottom:1px solid #e2e8f0;"><strong>Booking ID</strong></td>
                <td style="padding:12px;border-bottom:1px solid #e2e8f0;">${booking.bookingId || booking._id}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #e2e8f0;"><strong>Amount Paid</strong></td>
                <td style="padding:12px;border-bottom:1px solid #e2e8f0;color:#0ea5e9;font-weight:bold;">₹${amountFormatted}</td>
              </tr>
              <tr>
                <td style="padding:12px;border-bottom:1px solid #e2e8f0;"><strong>Payment Method</strong></td>
                <td style="padding:12px;border-bottom:1px solid #e2e8f0;">${methodLabel}</td>
              </tr>
              <tr>
                <td style="padding:12px;"><strong>Transaction ID</strong></td>
                <td style="padding:12px;">${payment.transactionId}</td>
              </tr>
            </table>

            <div style="text-align:center;margin:30px 0;">
               <a href="${process.env.CLIENT_URL}/dashboard/bookings" style="background:#0ea5e9;color:#fff;padding:12px 25px;text-decoration:none;border-radius:6px;font-weight:bold;">View My Bookings</a>
            </div>

            <p style="font-size:14px;color:#64748b;line-height:1.6;">If you have any questions regarding your trip, simply reply to this email. Our support team is available 24/7.</p>
            <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0;">
            <p style="font-size:14px;margin:0;">Happy Travels!</p>
            <p style="font-size:14px;font-weight:bold;margin:4px 0;">The WanderLux Team</p>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
  } catch (err) {
    console.error('❌ Nodemailer Error:', err.message);
  }
};

// @desc    Process payment (Manual/Simple Gateways)
// @route   POST /api/payments/process
export const processPayment = async (req, res, next) => {
  try {
    const { bookingId, method } = req.body;
    const allowedMethods = ['online', 'bank_transfer', 'upi', 'cash'];

    if (!allowedMethods.includes(method)) {
      return res.status(400).json({ success: false, message: 'Invalid payment method.' });
    }

    // 1. Find Booking
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id })
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // 2. Create Transaction ID
    const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substring(2, 7).toUpperCase();

    // 3. Create Payment Record
    const payment = await Payment.create({
      booking: bookingId,
      user: req.user._id,
      transactionId,
      amount: booking.pricing.totalAmount,
      currency: 'inr',
      status: 'completed',
      method,
      gateway: 'manual',
    });

    // 4. Update Booking Status
    booking.paymentStatus = 'paid';
    booking.status = 'confirmed';
    await booking.save();

    // 5. Send Confirmation Email (Async)
    if (booking.user?.email) {
      sendPaymentConfirmationEmail(booking.user.email, booking.user.name, booking, payment);
    }

    res.status(200).json({
      success: true,
      message: 'Payment processed and booking confirmed!',
      payment,
      transactionId
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's payment history
// @route   GET /api/payments/history
export const getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('booking', 'bookingId travelDates pricing')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get payment details by booking ID
// @route   GET /api/payments/booking/:bookingId
export const getPaymentByBooking = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({
      booking: req.params.bookingId,
      user: req.user._id
    });

    if (!payment) {
      return res.status(404).json({ success: false, message: 'No payment record found for this booking.' });
    }

    res.status(200).json({ success: true, payment });
  } catch (error) {
    next(error);
  }
};