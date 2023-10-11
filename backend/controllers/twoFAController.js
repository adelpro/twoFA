const { authenticator } = require("otplib");
const { users } = require("../data");
const {
  generateTwoFAQRCode,
  isTrusted,
  getUserIndexById,
} = require("../utils/utils");

// @desc ENABLE 2FA
// @Route POST /2fa/enable
// @Access Public
const enable = async (req, res) => {
  const { id } = req.body;

  const userIndex = getUserIndexById(id);
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }
  const user = users[userIndex];

  // Generate a new TFA secret (if its null)
  if (!user.TFASecret) {
    // Generate TFA secret
    const secret = authenticator.generateSecret();

    // Store the secret in the user object
    user.TFASecret = secret;
    console.log("new secret generated: ", user.TFASecret);
  }
  console.log("Using stored secret: ", user.TFASecret);

  // Return QR code URL and secret
  const qrcode = await generateTwoFAQRCode(users[userIndex].id, user.TFASecret);
  res.json({ qrcode });
};

// @desc VERIFY 2FA
// @Route POST /2fa/verify
// @Access Public
const verify = async (req, res) => {
  const { id, otp, fingerprint } = req.body;
  if (!id || !otp || !fingerprint) {
    return res.status(400).json({ msg: "Request error" });
  }
  const userIndex = getUserIndexById(id);
  if (userIndex === -1) {
    return res.status(400).json({ msg: "User not found" });
  }

  // Validate OTP code
  const user = users[userIndex];
  let isValid = false;
  try {
    authenticator.options = {
      window: 1,
    };
    isValid = authenticator.verify({
      secret: user.TFASecret,
      token: otp,
    });
  } catch (err) {
    console.log({ verify_error: err });
  }
  if (!isValid) {
    return res
      .status(400)
      .json({ msg: "OTP code is invalid or expired. Please try again." });
  }

  // Add Device To trusted list
  if (!user?.trusted.includes(fingerprint)) {
    user?.trusted.push(fingerprint);
  }
  res.json({ msg: "OTP code verified successfully" });
};

// @desc TRUSTED 2FA
// @Route POST /2fa/trusted
// @Access Public
const trusted = async (req, res) => {
  const { fingerprint, id } = req.body;
  const trusted = isTrusted(id, fingerprint);
  res.json({ trusted });
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
  users[userIndex].TFASecret = null;
  res.json({ msg: "2FA disabled successfully" });
};

module.exports = { enable, verify, disable, trusted };
