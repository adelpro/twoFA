const speakeasy = require("speakeasy");

const { users } = require("../data");
const { generateTwoFAQRCode } = require("../utils/utils");

// Function to check if a user exists
const getUserIndexById = (id) => {
  return users.findIndex((user) => user.id.toString() === id.toString());
};

// @desc ENABLE 2FA
// @Route POST /2fa/enable
// @Access Public
const enable = async (req, res) => {
  const { id } = req.body;

  const userIndex = getUserIndexById(id);
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }

  // Generate OTP secret
  const secret = speakeasy.generateSecret();

  // Store the secret in the user object
  users[userIndex].otpSecret = secret.base32;
  console.log("new secret generated: ", secret.base32);
  // Return QR code URL and secret
  const qrcode = await generateTwoFAQRCode(secret.base32);
  res.json({ qrcode });
};

// @desc VERIFY 2FA
// @Route POST /2fa/verify
// @Access Public
const verify = async (req, res) => {
  const { id, otp } = req.body;

  const userIndex = getUserIndexById(id);
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }

  // Validate OTP code
  const user = users[userIndex];
  const isValid = speakeasy.totp.verify({
    secret: user.otpSecret,
    encoding: "base32",
    token: otp.toString(),
    window: 5, //working: 1000000
  });
  console.log({ isValid, otp, user });
  if (!isValid) {
    return res
      .status(400)
      .json({ msg: "OTP code is invalid or expired. Please try again." });
  }

  res.json({ msg: "OTP code verified successfully" });
};

// @desc DISABLE 2FA
// @Route POST /2fa/disable
// @Access Public
const disable = async (req, res) => {
  const { id } = req.body;

  const userIndex = getUserIndexById(id);
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }

  // Delete OTP secret
  users[userIndex].otpSecret = null;
  res.json({ msg: "2FA disabled successfully" });
};

module.exports = { enable, verify, disable };
