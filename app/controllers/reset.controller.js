const User = require("../models/user.model");
const OTPService = require("../middlewares/otp.service");

exports.requestReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    const otp = OTPService.generateOTP();
    OTPService.sendOTPByEmail(email, otp);

    res.status(200).json({ message: "OTP sent to the email" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (OTPService.verifyOTP(email, otp)) {
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "OTP verification failed" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
