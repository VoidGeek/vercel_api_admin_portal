const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpExpiration = 10 * 60 * 1000; // OTP expiration time (in milliseconds), e.g., 10 minutes

const otps = new Map(); // Store OTPs and their expiration times

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
}

// Function to send an OTP to the user's email
async function sendOTPByEmail(email, otp) {
  const msg = {
    to: email,
    from: 'ravenfritter@gmail.com', // Your "no-reply" email address
    subject: 'OTP for Password Reset',
    text: `Your OTP is: ${otp}`,
  };

  try {
    await sgMail.send(msg);

    // Store the OTP and its expiration time
    const expirationTime = Date.now() + otpExpiration;
    otps.set(email, { otp, expiration: expirationTime });
    console.log('OTP sent to:', email);
  } catch (error) {
    console.error('Error sending OTP:', error);
  }
}

// Function to verify an OTP
function verifyOTP(email, userOTP) {
  const storedOTP = otps.get(email);

  if (!storedOTP || Date.now() > storedOTP.expiration) {
    // OTP has expired or doesn't exist
    return false;
  }

  if (userOTP === storedOTP.otp) {
    // OTP matches
    otps.delete(email); // Remove the OTP from the storage
    return true;
  }

  return false;
}

module.exports = {
  generateOTP,
  sendOTPByEmail,
  verifyOTP,
};
