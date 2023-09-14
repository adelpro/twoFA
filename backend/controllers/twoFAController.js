const speakeasy = require("speakeasy");
const { users } = require("../data");
const { generateTwoFAQRCode } = require("../utils/utils");

// @desc ENABLE 2FA
// @Route POST /2fa/enable
// @Access Public
const enable = async (req, res) => {
  const { id } = req.body;

  //check if user exists
  const userIndex = users.findIndex((u) => u.id.toString() === id.toString());
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }
  //generate OTP secret
  const secret = speakeasy.generateSecret({
    length: 20,
    name: "2FA-auth",
  });
  // Store the secret in the user object
  users[userIndex].otpSecret = secret.base32;
  console.log({ enableSecret: (users[userIndex].otpSecret = secret.base32) });
  // Return QR code URL and secret
  const qrcode = await generateTwoFAQRCode(secret.base32);
  res.json({ qrcode });
};

// @desc VERIFY 2FA
// @Route POST /2fa/verify
// @Access Public
const verify = async (req, res) => {
  const { id, otp } = req.body;

  // Check if otp is provided
  if (!otp) {
    return res.status(400).json({ msg: "OTP code is required" });
  }

  // Check if user exists
  const userIndex = users.findIndex((u) => u.id.toString() === id.toString());
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }
  // Validate OTP code
  const user = users[userIndex];
  console.log({ verifySecret: user.otpSecret });
  const isValid = speakeasy.totp.verify({
    secret: user.otpSecret,
    encoding: "base32",
    token: otp,
  });
  console.log({
    isValid,
    secret: user.otpSecret,
    otp,
  });
  if (!isValid) {
    return res.json({ msg: "OTP code is invalid or expired" });
  }
  res.json({ msg: "OTP code verified successfully" });
};

// @desc DISABLE 2FA
// @Route POST /2fa/disable
// @Access Public
const disable = async (req, res) => {
  const { id } = req.body;

  // Check if user exists
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }
  // Delete OTP secret
  users[userIndex].otpSecret = null;
  res.json({ msg: "2FA disabled successfully" });
};

module.exports = { enable, verify, disable };
