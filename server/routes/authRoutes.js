// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/User"); // adjust path to your User model

// ─── Nodemailer transporter ───────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,     // your Gmail: e.g. omerprise@gmail.com
    pass: process.env.GMAIL_PASS,     // Gmail App Password (not your login password)
  },
});

transporter.verify((err, success) => {
  if (err) console.error("❌ Mail config error:", err.message);
  else console.log("✅ Mail server ready to send");
});
// ─── Helper: generate 6-digit OTP ────────────────────────────────────────────
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// ─── POST /api/auth/signup ────────────────────────────────────────────────────
// Step 1: Receive name/email/password → save unverified user → send OTP email
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    // Check if email already verified & exists
    const existing = await User.findOne({ email });
    if (existing && existing.isVerified)
      return res.status(400).json({ message: "Email already registered. Please sign in." });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const hashedPassword = await bcrypt.hash(password, 10);

    if (existing && !existing.isVerified) {
      // Update existing unverified user with fresh OTP
      existing.name = name;
      existing.password = hashedPassword;
      existing.otp = otp;
      existing.otpExpiry = otpExpiry;
      await existing.save();
    } else {
      // Create new unverified user
      await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry,
        isVerified: false,
      });
    }

    // Send OTP email
    await transporter.sendMail({
      from: `"Om Enterprise" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Verification Code — Om Enterprise",
      html: `
        <div style="font-family:'Segoe UI',sans-serif;background:#0f0f13;padding:40px;border-radius:16px;max-width:480px;margin:auto">
          <h2 style="color:#e8b86d;font-size:24px;margin-bottom:8px">Om Enterprise</h2>
          <p style="color:#f0ece4;font-size:16px;margin-bottom:24px">Your verification code is:</p>
          <div style="background:#1c1c26;border:1px solid rgba(232,184,109,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#e8b86d">${otp}</span>
          </div>
          <p style="color:rgba(240,236,228,0.5);font-size:13px">This code expires in <strong style="color:#f0ece4">10 minutes</strong>.</p>
          <p style="color:rgba(240,236,228,0.3);font-size:12px;margin-top:16px">If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─── POST /api/auth/verify-otp ────────────────────────────────────────────────
// Step 2: Verify OTP → mark user as verified
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found." });

    if (user.isVerified)
      return res.status(400).json({ message: "Account already verified." });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Incorrect verification code." });

    if (new Date() > user.otpExpiry)
      return res.status(400).json({ message: "Code has expired. Please sign up again." });

    // Mark verified, clear OTP
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Account verified successfully!" });
  } catch (err) {
    console.error("OTP verify error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─── POST /api/auth/resend-otp ────────────────────────────────────────────────
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.isVerified)
      return res.status(400).json({ message: "Invalid request." });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await transporter.sendMail({
      from: `"Om Enterprise" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "New Verification Code — Om Enterprise",
      html: `
        <div style="font-family:'Segoe UI',sans-serif;background:#0f0f13;padding:40px;border-radius:16px;max-width:480px;margin:auto">
          <h2 style="color:#e8b86d;font-size:24px;margin-bottom:8px">Om Enterprise</h2>
          <p style="color:#f0ece4;font-size:16px;margin-bottom:24px">Your new verification code:</p>
          <div style="background:#1c1c26;border:1px solid rgba(232,184,109,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
            <span style="font-size:40px;font-weight:700;letter-spacing:12px;color:#e8b86d">${otp}</span>
          </div>
          <p style="color:rgba(240,236,228,0.5);font-size:13px">Expires in <strong style="color:#f0ece4">10 minutes</strong>.</p>
        </div>
      `,
    });

    res.status(200).json({ message: "New OTP sent." });
  } catch (err) {
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "No account found with this email." });

    if (!user.isVerified)
      return res.status(403).json({ message: "Please verify your email before signing in." });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: "Incorrect password." });

    // Return user info (add JWT here if needed)
    res.status(200).json({
      message: "Login successful.",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
  console.log("🔥 FULL SIGNUP ERROR:");
  console.log(err);
  console.log("🔥 ERROR MESSAGE:", err.message);

  res.status(500).json({
    message: "Server error. Please try again.",
    error: err.message
  });
}
});

module.exports = router;
