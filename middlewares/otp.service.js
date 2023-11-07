const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create a SendGrid transport with the desired settings
const sendGridTransport = sgMail.setClient({
  host: 'smtp.sendgrid.net', // SendGrid SMTP server
  port: 587, // Port for TLS connection
  secure: true, // Use a secure (TLS) connection
  auth: {
    user: 'process.env.SENDGRID_API_KEY', // Your SendGrid username
    pass: 'process.env.SENDGRID_API_KEY', // Your SendGrid password
  },
});

// Function to send an OTP to the user's email
async function sendOTPByEmail(email, otp) {
  const msg = {
    to: email,
    from: 'ravenfritter@gmail.com', // Your "no-reply" email address
    subject: 'OTP for Password Reset',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await sendGridTransport.sendMail(msg);

    // Rest of your code remains the same
    const expirationTime = Date.now() + otpExpiration;
    otps.set(email, { otp, expiration: expirationTime });
    console.log('OTP sent to:', email);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

// Rest of your code

module.exports = {
  generateOTP,
  sendOTPByEmail,
  verifyOTP,
};
