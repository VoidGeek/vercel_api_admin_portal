const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from a .env file or your hosting platform

// Configuration for nodemailer using Gmail
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail email address
    pass: process.env.GMAIL_APP_PASSWORD, // Your Gmail app password
  },
});

const otpExpiration = 10 * 60 * 1000; // OTP expiration time (in milliseconds), e.g., 10 minutes

const otps = new Map(); // Store OTPs and their expiration times

// Function to generate a random OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000); // Generates a 4-digit OTP
}

// Function to send an OTP to the user's email
async function sendOTPByEmail(email, otp) {
  const mailOptions = {
    from: process.env.GMAIL_USER,  // Your "no-reply" email address
    to: email,
    subject: 'OTP for Password Reset',
    text: `Your OTP is: ${otp}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('OTP sent:', info.response);

    // Store the OTP and its expiration time
    otps.set(email, {
      otp,
      expiration: Date.now() + otpExpiration,
    });
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
