import OTP from "../models/otpModel.js";
import { generateOTP } from "../utils/otp.js";
import sendEmail from "../services/emailService.js";

// ✅ Send OTP to email
export const sendEmailOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });

  const code = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

  await OTP.deleteMany({ email });
  await OTP.create({ email, code, expiresAt });

  try {
    await sendEmail(email, "Your ProMart Verification Code", `Your OTP is ${code}`);
    console.log(`📧 OTP sent to ${email}: ${code}`);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Email send failed:", error);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify OTP
export const verifyEmailOTP = async (req, res) => {
  const { email, code } = req.body;

  const otpRecord = await OTP.findOne({ email, code });
  if (!otpRecord) return res.status(400).json({ message: "Invalid OTP" });
  if (otpRecord.expiresAt < new Date()) return res.status(400).json({ message: "OTP expired" });

  await OTP.deleteMany({ email }); // cleanup after success
  res.json({ message: "OTP verified successfully" });
};
